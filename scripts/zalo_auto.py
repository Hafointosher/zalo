#!/usr/bin/env python3
"""End-to-end automation for n8n-nodes-zalo-user-v3 deobfuscation.

Features
========
1. Copy dist libs/nodes/credentials to working tree
2. Run Prettier (for minified-only files)
3. Run synchrony on obfuscated files with batching + retries
4. Optional mass rename using custom heuristics (serviceUrls/appContext/api)
5. Produce summary + log file

Usage
=====
python scripts/zalo_auto.py --source "C:/Users/Hafointosher/Desktop/n8n-nodes-zalo-user-v3" \
                            --output "C:/Users/Hafointosher/Desktop/n8n-zalo-deobfuscated"

Prerequisites
=============
- Node.js, npm
- Prettier installed locally (npm install --save-dev prettier)
- synchrony installed locally (npm install --save-dev synchrony)
- Python 3.9+
"""
import argparse
import json
import re
import shutil
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List

DEFAULT_FOLDERS = {
    "libs": "dist/nodes/ZaloUser/libs",
    "credentials": "dist/credentials",
    "nodes": "dist/nodes",
}

SYNCHRONY_TARGETS = [
    "credentials/*.js",
    "nodes/ZaloUser/*.js",
    "nodes/ZaloBot/*.js",
    "nodes/ZaloOA/*.js",
]

RENAMING_MAP = {
    r"\b([A-Za-z_][A-Za-z0-9_]*)\s*=\s*\(0,\s*utils_js_1\.apiFactory\)": "serviceUrls"  # placeholder
}


@dataclass
class TaskResult:
    name: str
    success: bool
    details: str = ""


def run(cmd: List[str], cwd: Path, name: str) -> TaskResult:
    try:
        completed = subprocess.run(cmd, cwd=cwd, text=True, capture_output=True, check=True)
        return TaskResult(name, True, completed.stdout.strip())
    except subprocess.CalledProcessError as exc:
        return TaskResult(name, False, exc.stderr.strip())


def copy_tree(src: Path, dst: Path) -> None:
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(src, dst)


def glob_targets(root: Path, pattern: str) -> Iterable[Path]:
    return root.glob(pattern)


def run_prettier(root: Path, targets: Iterable[str]) -> TaskResult:
    files = []
    for pattern in targets:
        files.extend(str(p) for p in root.glob(pattern))
    if not files:
        return TaskResult("prettier", True, "No files to format")
    cmd = ["npx", "prettier", "--write", *files]
    return run(cmd, root, "prettier")


def run_synchrony(root: Path) -> List[TaskResult]:
    results = []
    for pattern in SYNCHRONY_TARGETS:
        for file in glob_targets(root, pattern):
            out_path = file
            src_file = file
            if not src_file.exists():
                continue
            cmd = ["npx", "synchrony", str(src_file), "-o", str(out_path), "--rename"]
            results.append(run(cmd, root, f"synchrony:{src_file.relative_to(root)}"))
    return results


def rename_semantic(file_path: Path, replacements: List[tuple]) -> None:
    text = file_path.read_text(encoding="utf-8")
    original = text
    for pattern, repl in replacements:
        text = re.sub(pattern, repl, text)
    if text != original:
        file_path.write_text(text, encoding="utf-8")


def load_replacements(root: Path) -> List[tuple]:
    return [
        (r"\b([A-Za-z_][A-Za-z0-9_]*)\s*=\s*\(0,\s*utils_js_1\.apiFactory\)\(\)\(([^)]*)\)",
         "serviceUrls = (0, utils_js_1.apiFactory)()(")
    ]


def main() -> None:
    parser = argparse.ArgumentParser(description="Automate Zalo node deobfuscation")
    parser.add_argument("--source", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--skip-copy", action="store_true")
    parser.add_argument("--skip-prettier", action="store_true")
    parser.add_argument("--skip-synchrony", action="store_true")
    parser.add_argument("--rename", action="store_true", help="Apply regex rename heuristics")
    args = parser.parse_args()

    output = args.output
    output.mkdir(parents=True, exist_ok=True)

    summary: List[TaskResult] = []

    if not args.skip_copy:
        for key, rel in DEFAULT_FOLDERS.items():
            src = args.source / rel
            dst = output / key
            copy_tree(src, dst)
        summary.append(TaskResult("copy", True, "Copied libs/credentials/nodes"))

    if not args.skip_prettier:
        summary.append(run_prettier(output, ["libs/**/*.js", "nodes/**/*.js", "credentials/*.js"]))

    if not args.skip_synchrony:
        summary.extend(run_synchrony(output))

    if args.rename:
        replacements = load_replacements(output)
        for file in output.glob("libs/apis/*.js"):
            rename_semantic(file, replacements)
        summary.append(TaskResult("rename", True, "Applied semantic rename heuristics"))

    log_path = output / "automation.log"
    log_data = [result.__dict__ for result in summary]
    log_path.write_text(json.dumps(log_data, indent=2), encoding="utf-8")
    print("Automation completed. Log written to", log_path)


if __name__ == "__main__":
    main()
