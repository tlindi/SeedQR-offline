#!/usr/bin/env python3
"""
scripts/build_bundle_html.py

Merge local CSS and JS files referenced in index.html into one standalone HTML file
for release distribution.

Usage:
  python3 scripts/build_bundle_html.py [--input index.html] [--output SeedQR.html]

Behavior:
  - Inlines local <link rel="stylesheet" href="..."> into <style> blocks.
  - Inlines local <script src="..."></script> into <script> blocks.
  - Leaves absolute (http/https) resources unchanged.
  - Writes the bundled file to the output path (creates parent dirs if needed).
"""
import argparse
import re
import sys
from pathlib import Path
from datetime import datetime

LINK_RE = re.compile(
    r'<link[^>]+rel=[\'"]stylesheet[\'"][^>]*href=[\'"]([^\'"]+)[\'"][^>]*>',
    re.IGNORECASE,
)
SCRIPT_RE = re.compile(
    r'<script[^>]+src=[\'"]([^\'"]+)[\'"][^>]*>\s*</script>',
    re.IGNORECASE,
)


def read_file(path: Path):
    try:
        return path.read_text(encoding="utf-8")
    except Exception as e:
        print(f"ERROR: cannot read {path}: {e}", file=sys.stderr)
        return None


def inline_styles(html: str, base_dir: Path):
    def repl(m):
        href = m.group(1)
        if href.startswith("http://") or href.startswith("https://"):
            return m.group(0)  # leave external links alone
        full = (base_dir / href).resolve()
        content = read_file(full)
        if content is None:
            return f"<!-- MISSING STYLESHEET: {href} -->"
        return f"<!-- inlined: {href} -->\n<style>\n/* {href} */\n{content}\n</style>\n"

    return LINK_RE.sub(repl, html)


def inline_scripts(html: str, base_dir: Path):
    def repl(m):
        src = m.group(1)
        if src.startswith("http://") or src.startswith("https://"):
            return m.group(0)  # leave external scripts alone
        full = (base_dir / src).resolve()
        content = read_file(full)
        if content is None:
            return f"<!-- MISSING SCRIPT: {src} -->"
        return f"<!-- inlined: {src} -->\n<script>\n/* {src} */\n{content}\n</script>\n"

    return SCRIPT_RE.sub(repl, html)


def main(argv):
    parser = argparse.ArgumentParser(
        description="Bundle index.html with local CSS/JS into a single file"
    )
    parser.add_argument(
        "--input", "-i", default="index.html", help="input HTML file (default: index.html)"
    )
    parser.add_argument(
        "--output",
        "-o",
        default="SeedQR.html",
        help="output bundled HTML (default: SeedQR.html)",
    )
    args = parser.parse_args(argv)

    input_path = Path(args.input)
    if not input_path.exists():
        print(f"ERROR: input file {input_path} not found", file=sys.stderr)
        return 2

    base_dir = input_path.parent
    html = read_file(input_path)
    if html is None:
        return 3

    # Inline styles and scripts
    html = inline_styles(html, base_dir)
    html = inline_scripts(html, base_dir)

    # Add a metadata comment at top
    now = datetime.utcnow().isoformat() + "Z"
    header = f"<!-- Bundled by scripts/build_bundle_html.py on {now} UTC -->\n"
    out_html = header + html

    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(out_html, encoding="utf-8")

    print(f"Wrote bundled file to: {out_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))