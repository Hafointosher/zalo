#!/usr/bin/env python3
"""GUI tool for automating n8n-nodes-zalo-user-v3 processing.

Features
========
- Select source dist folder and output workspace
- Copy libs/credentials/nodes
- Run Prettier (format minified files)
- Run synchrony deobfuscation with progress logging
- Apply optional regex-based rename heuristics
- Execute all steps sequentially via "Run Full Pipeline"

Requirements
============
- Python 3.9+
- Node.js with npm
- Local dev dependencies installed once in output folder:
    npm install --save-dev prettier synchrony

Usage
======
python scripts/zalo_gui.py
"""
from __future__ import annotations

import json
import queue
import re
import shutil
import subprocess
import threading
import tkinter as tk
from dataclasses import dataclass
from pathlib import Path
from tkinter import filedialog, messagebox, scrolledtext
from typing import Iterable, List

DEFAULT_REL_DIRS = {
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
    (r"\b([A-Za-z_]\w*)\s*=\s*serviceUrls,\s*([A-Za-z_]\w*)\s*=\s*([^,]+),\s*([A-Za-z_]\w*)\s*=\s*([^)]+)\)",
     "serviceUrls = serviceUrls, appContext = \\3, api = \\5"),
]


@dataclass
class TaskResult:
    name: str
    success: bool
    details: str


class ZaloToolGUI:
    def __init__(self, root: tk.Tk):
        self.root = root
        self.root.title("Zalo Node Processing Tool")
        self.source_var = tk.StringVar()
        self.output_var = tk.StringVar()
        self.queue: queue.Queue[str] = queue.Queue()
        self._build_ui()
        self._poll_log()

    # --- UI helpers ---
    def _build_ui(self) -> None:
        frm = tk.Frame(self.root, padx=10, pady=10)
        frm.pack(fill=tk.BOTH, expand=True)

        tk.Label(frm, text="Source (dist folder)").grid(row=0, column=0, sticky="w")
        tk.Entry(frm, textvariable=self.source_var, width=60).grid(row=0, column=1, sticky="ew")
        tk.Button(frm, text="Browse", command=self._choose_source).grid(row=0, column=2, padx=5)

        tk.Label(frm, text="Output workspace").grid(row=1, column=0, sticky="w")
        tk.Entry(frm, textvariable=self.output_var, width=60).grid(row=1, column=1, sticky="ew")
        tk.Button(frm, text="Browse", command=self._choose_output).grid(row=1, column=2, padx=5)

        button_frame = tk.Frame(frm)
        button_frame.grid(row=2, column=0, columnspan=3, pady=10, sticky="ew")
        buttons = [
            ("Copy files", self.copy_files),
            ("Run Prettier", self.run_prettier),
            ("Run Synchrony", self.run_synchrony),
            ("Rename heuristics", self.run_rename),
            ("Run full pipeline", self.run_all_steps),
        ]
        for idx, (label, cmd) in enumerate(buttons):
            tk.Button(button_frame, text=label, command=cmd, width=18).grid(row=0, column=idx, padx=5)

        tk.Label(frm, text="Log").grid(row=3, column=0, sticky="w")
        self.log_box = scrolledtext.ScrolledText(frm, height=20, width=90, state=tk.DISABLED)
        self.log_box.grid(row=4, column=0, columnspan=3, pady=5, sticky="nsew")
        frm.grid_rowconfigure(4, weight=1)
        frm.grid_columnconfigure(1, weight=1)

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
        self.log_box.insert(tk.END, text + "\n")
        self.log_box.see(tk.END)
        self.log_box.configure(state=tk.DISABLED)

    def _poll_log(self) -> None:
        while not self.queue.empty():
            self._append_log(self.queue.get())
        self.root.after(250, self._poll_log)

    def _validate_paths(self) -> tuple[Path, Path] | None:
        source = Path(self.source_var.get())
        output = Path(self.output_var.get())
        if not source.exists():
            messagebox.showerror("Missing source", "Please select valid source folder")
            return None
        output.mkdir(parents=True, exist_ok=True)
        return source, output

    def _run_in_thread(self, func, label: str) -> None:
        paths = self._validate_paths()
        if not paths:
            return
        source, output = paths

        def worker():
            try:
                func(source, output)
            except Exception as exc:
                self.queue.put(f"[ERROR] {label}: {exc}")

        threading.Thread(target=worker, daemon=True).start()

    # --- Actions ---
    def copy_files(self, *_):
        self._run_in_thread(self._copy_impl, "Copy")

    def run_prettier(self, *_):
        self._run_in_thread(self._prettier_impl, "Prettier")

    def run_synchrony(self, *_):
        self._run_in_thread(self._synchrony_impl, "Synchrony")

    def run_rename(self, *_):
        self._run_in_thread(self._rename_impl, "Rename")

    def run_all_steps(self, *_):
        def pipeline(source: Path, output: Path):
            self._copy_impl(source, output)
            self._prettier_impl(source, output)
            self._synchrony_impl(source, output)
            self._rename_impl(source, output)
        self._run_in_thread(pipeline, "Full pipeline")

    # --- Implementation ---
    def _copy_impl(self, source: Path, output: Path) -> None:
        for key, rel in DEFAULT_REL_DIRS.items():
            src = source / rel
            dst = output / key
            if dst.exists():
                shutil.rmtree(dst)
            shutil.copytree(src, dst)
            self.queue.put(f"[COPY] {src} -> {dst}")

    def _prettier_impl(self, _source: Path, output: Path) -> None:
        files = []
        for pattern in ("libs/**/*.js", "nodes/**/*.js", "credentials/*.js"):
            files.extend(str(p) for p in output.glob(pattern))
        if not files:
            self.queue.put("[PRETTIER] No files found")
            return
        cmd = ["npx", "prettier", "--write", *files]
        self._run_subprocess(cmd, output, "PRETTIER")

    def _synchrony_impl(self, _source: Path, output: Path) -> None:
        for pattern in SYNCHRONY_GLOBS:
            for file in output.glob(pattern):
                cmd = ["npx", "synchrony", str(file), "-o", str(file), "--rename"]
                result = self._run_subprocess(cmd, output, f"SYNCHRONY {file.relative_to(output)}")
                if not result.success:
                    self.queue.put(f"[WARN] {result.details}")

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
        self.queue.put(f"[RENAME] Applied heuristics to {count} files")

    def _run_subprocess(self, cmd: List[str], cwd: Path, label: str) -> TaskResult:
        try:
            completed = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, check=True)
            self.queue.put(f"[{label}] Success")
            if completed.stdout:
                self.queue.put(completed.stdout.strip())
            return TaskResult(label, True, completed.stdout)
        except subprocess.CalledProcessError as exc:
            self.queue.put(f"[{label}] Failed: {exc.stderr.strip()}")
            return TaskResult(label, False, exc.stderr)


def main() -> None:
    root = tk.Tk()
    app = ZaloToolGUI(root)
    root.mainloop()


if __name__ == "__main__":
    main()
