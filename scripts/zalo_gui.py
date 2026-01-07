#!/usr/bin/env python3
"""GUI automation tool for processing n8n-nodes-zalo-user-v3.

The tool now auto-installs required npm dev dependencies (prettier, synchrony)
whenever the output workspace does not yet contain them. Users only need to
select source/output folders and press "Run Full Pipeline".
"""
from __future__ import annotations

import concurrent.futures
import json
import queue
import re
import shutil
import subprocess
import threading
import time
import tkinter as tk
from dataclasses import dataclass
from pathlib import Path
from tkinter import filedialog, messagebox, scrolledtext
from typing import Dict, Iterable, List, Optional, Tuple

DEFAULT_REL_DIRS: Dict[str, Path] = {
    "libs": Path("dist/nodes/ZaloUser/libs"),
    "credentials": Path("dist/credentials"),
    "nodes": Path("dist/nodes"),
}

SYNCHRONY_GLOBS = [
    "credentials/*.js",
    "nodes/ZaloUser/*.js",
    "nodes/ZaloBot/*.js",
    "nodes/ZaloOA/*.js",
]

RENAME_PATTERNS = [
    (r"\b([A-Za-z_]\w*)\s*=\s*\(0,\s*utils_js_1\.apiFactory\)\(\)\(", "serviceUrls = (0, utils_js_1.apiFactory)()("),
    (r"\b([A-Za-z_]\w*)\s*=\s*serviceUrls\b", "serviceUrls"),
]

SUMMARY_FILE = "automation_summary.json"
REQUIRED_TOOLS = ["npm", "npx"]
REQUIRED_DEPS = ["prettier", "synchrony"]


def timestamp() -> str:
    return time.strftime("%Y-%m-%d %H:%M:%S")


@dataclass
class TaskResult:
    name: str
    success: bool
    details: str = ""


class ZaloToolGUI:
    def __init__(self, root: tk.Tk):
        self.root = root
        self.root.title("Zalo Node Processing Tool")
        self.source_var = tk.StringVar()
        self.output_var = tk.StringVar()
        self.max_workers_var = tk.IntVar(value=4)
        self.queue: queue.Queue[str] = queue.Queue()
        self.summary: List[TaskResult] = []
        self._build_ui()
        self._poll_log()

    # UI construction
    def _build_ui(self) -> None:
        frm = tk.Frame(self.root, padx=10, pady=10)
        frm.pack(fill=tk.BOTH, expand=True)

        tk.Label(frm, text="Source (dist root)").grid(row=0, column=0, sticky="w")
        tk.Entry(frm, textvariable=self.source_var, width=60).grid(row=0, column=1, sticky="ew")
        tk.Button(frm, text="Browse", command=self._choose_source).grid(row=0, column=2, padx=5)

        tk.Label(frm, text="Output workspace").grid(row=1, column=0, sticky="w")
        tk.Entry(frm, textvariable=self.output_var, width=60).grid(row=1, column=1, sticky="ew")
        tk.Button(frm, text="Browse", command=self._choose_output).grid(row=1, column=2, padx=5)

        tk.Label(frm, text="Synchrony workers").grid(row=2, column=0, sticky="w")
        tk.Spinbox(frm, from_=1, to=16, textvariable=self.max_workers_var, width=5).grid(row=2, column=1, sticky="w")

        button_row = tk.Frame(frm)
        button_row.grid(row=3, column=0, columnspan=3, pady=8, sticky="ew")
        tk.Button(button_row, text="Run Full Pipeline", width=20, command=self.run_all_steps).grid(row=0, column=0, padx=4)
        tk.Button(button_row, text="Export Summary", width=16, command=self.export_summary).grid(row=0, column=1, padx=4)

        tk.Label(frm, text="Log").grid(row=4, column=0, sticky="w")
        self.log_box = scrolledtext.ScrolledText(frm, height=20, width=100, state=tk.DISABLED)
        self.log_box.grid(row=5, column=0, columnspan=3, pady=5, sticky="nsew")
        frm.grid_rowconfigure(5, weight=1)
        frm.grid_columnconfigure(1, weight=1)

    # UI helpers
    def _choose_source(self) -> None:
        path = filedialog.askdirectory()
        if path:
            self.source_var.set(path)

    def _choose_output(self) -> None:
        path = filedialog.askdirectory()
        if path:
            self.output_var.set(path)

    def _append_log(self, text: str) -> None:
        self.log_box.configure(state=tk.NORMAL)
        self.log_box.insert(tk.END, f"[{timestamp()}] {text}\n")
        self.log_box.see(tk.END)
        self.log_box.configure(state=tk.DISABLED)

    def _poll_log(self) -> None:
        while not self.queue.empty():
            self._append_log(self.queue.get())
        self.root.after(200, self._poll_log)

    def _validate_paths(self) -> Optional[Tuple[Path, Path]]:
        source = Path(self.source_var.get())
        output = Path(self.output_var.get())
        if not source.exists():
            messagebox.showerror("Invalid source", "Please choose valid source folder")
            return None
        output.mkdir(parents=True, exist_ok=True)
        return source, output

    def _run_threaded(self, label: str, func) -> None:
        paths = self._validate_paths()
        if not paths:
            return
        source, output = paths

        def worker():
            try:
                self.queue.put(f"{label} started")
                func(source, output)
                self.queue.put(f"{label} finished")
            except Exception as exc:  # noqa: BLE001
                self.queue.put(f"ERROR during {label}: {exc}")
        threading.Thread(target=worker, daemon=True).start()

    # Button actions
    def run_all_steps(self, *_):
        def pipeline(source: Path, output: Path):
            self._ensure_tools()
            self._ensure_deps(output)
            self._copy_impl(source, output)
            self._prettier_impl(source, output)
            self._synchrony_impl(source, output)
            self._rename_impl(source, output)
        self._run_threaded("Full pipeline", pipeline)

    def export_summary(self, *_):
        output = Path(self.output_var.get()) if self.output_var.get() else None
        if not output:
            messagebox.showerror("Missing output", "Set output directory first")
            return
        data = [result.__dict__ for result in self.summary]
        path = output / SUMMARY_FILE
        path.write_text(json.dumps(data, indent=2), encoding="utf-8")
        self.queue.put(f"Summary exported to {path}")

    # Core steps
    def _ensure_tools(self) -> None:
        for tool in REQUIRED_TOOLS:
            if shutil.which(tool) is None:
                raise RuntimeError(f"Required tool '{tool}' not found in PATH")

    def _ensure_deps(self, output: Path) -> None:
        pkg = output / "package.json"
        if not pkg.exists():
            pkg.write_text(json.dumps({"name": "zalo-deobf", "version": "1.0.0"}, indent=2), encoding="utf-8")
        node_modules = output / "node_modules"
        needs_install = any(not (node_modules / dep).exists() for dep in [])
        # Force install if prettier binary missing
        prettier_bin = output / "node_modules/.bin/prettier"
        synchrony_bin = output / "node_modules/.bin/synchrony"
        if not prettier_bin.exists() or not synchrony_bin.exists():
            cmd = ["npm", "install", "--save-dev", *REQUIRED_DEPS]
            result = self._subprocess(cmd, output, "npm install")
            self.summary.append(result)

    def _copy_impl(self, source: Path, output: Path) -> None:
        for key, rel in DEFAULT_REL_DIRS.items():
            src = source / rel
            dst = output / key
            if dst.exists():
                shutil.rmtree(dst)
            shutil.copytree(src, dst)
            self.queue.put(f"Copied {src} -> {dst}")
        self.summary.append(TaskResult("copy", True, "Copied libs/credentials/nodes"))

    def _prettier_impl(self, _source: Path, output: Path) -> None:
        files = []
        for pattern in ("libs/**/*.js", "nodes/**/*.js", "credentials/*.js"):
            files.extend(str(p) for p in output.glob(pattern))
        if not files:
            self.queue.put("No files for Prettier")
            return
        cmd = ["npx", "prettier", "--write", *files]
        result = self._subprocess(cmd, output, "prettier")
        self.summary.append(result)

    def _synchrony_impl(self, _source: Path, output: Path) -> None:
        targets = [str(file) for pattern in SYNCHRONY_GLOBS for file in output.glob(pattern)]
        if not targets:
            self.queue.put("No synchrony targets")
            return
        max_workers = max(1, min(self.max_workers_var.get(), 16))

        def worker(path: str) -> TaskResult:
            cmd = ["npx", "synchrony", path, "-o", path, "--rename"]
            return self._subprocess(cmd, output, f"synchrony {Path(path).name}")

        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            results = list(executor.map(worker, targets))
        success = sum(1 for r in results if r.success)
        self.summary.append(TaskResult("synchrony", success == len(targets), f"{success}/{len(targets)}"))

    def _rename_impl(self, _source: Path, output: Path) -> None:
        replacements = [(re.compile(pattern), repl) for pattern, repl in RENAME_PATTERNS]
        count = 0
        for file in output.glob("libs/apis/*.js"):
            text = file.read_text(encoding="utf-8")
            original = text
            for pattern, repl in replacements:
                text = pattern.sub(repl, text)
            if text != original:
                file.write_text(text, encoding="utf-8")
                count += 1
        msg = f"Rename heuristics applied to {count} files"
        self.queue.put(msg)
        self.summary.append(TaskResult("rename", True, msg))

    # helpers
    def _subprocess(self, cmd: List[str], cwd: Path, label: str) -> TaskResult:
        try:
            completed = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, check=True)
            if completed.stdout:
                self.queue.put(completed.stdout.strip())
            return TaskResult(label, True, completed.stdout.strip())
        except subprocess.CalledProcessError as exc:
            self.queue.put(f"{label} failed: {exc.stderr.strip()}")
            raise


def main() -> None:
    root = tk.Tk()
    app = ZaloToolGUI(root)
    root.mainloop()


if __name__ == "__main__":
    main()
