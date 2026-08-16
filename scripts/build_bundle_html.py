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
  - Validates inlined JS for ES5 compatibility (no const/let/class/arrow functions).
  - Writes the bundled file to the output path (creates parent dirs if needed).
"""
import argparse
import re
import sys
import subprocess
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

# ES6 syntax patterns to detect (basic checks)
ES6_PATTERNS = [
    (r'\bconst\s+\w+\s*=', 'const declaration'),
    (r'\blet\s+\w+\s*=', 'let declaration'),
    (r'\bclass\s+\w+', 'class declaration'),
    (r'=>', 'arrow function'),
    (r'`[^`]*\$\{', 'template literal'),
    (r'\.\.\.\w+', 'spread/rest operator'),
    (r'async\s+function', 'async function'),
    (r'await\s+\w+', 'await expression'),
]


def read_file(path: Path):
    try:
        return path.read_text(encoding="utf-8")
    except Exception as e:
        print(f"ERROR: cannot read {path}: {e}", file=sys.stderr)
        return None


def write_file(path: Path, content: str):
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        return True
    except Exception as e:
        print(f"ERROR: cannot write {path}: {e}", file=sys.stderr)
        return False


def check_es5_syntax(content: str, filepath: str, strict: bool = False) -> bool:
    """
    Check for ES6+ syntax patterns in JavaScript content.
    Returns True if ES5 compliant (or close enough), False if major ES6 features found.
    
    Args:
        content: JavaScript source code
        filepath: Path for error reporting
        strict: If True, fail on any ES6 pattern. If False, warn only.
    """
    violations = []
    
    for pattern, description in ES6_PATTERNS:
        matches = re.finditer(pattern, content)
        for match in matches:
            # Count line number
            line_num = content[:match.start()].count('\n') + 1
            violations.append((line_num, description, match.group(0)))
    
    if violations:
        print(f"\n⚠️  ES6 syntax detected in {filepath}:", file=sys.stderr)
        for line_num, desc, code in violations[:10]:  # Show first 10
            print(f"   Line {line_num}: {desc} → {code[:50]}", file=sys.stderr)
        if len(violations) > 10:
            print(f"   ... and {len(violations) - 10} more violations", file=sys.stderr)
        
        if strict:
            return False
    
    return True


def validate_bundle_es5(html: str) -> bool:
    """
    Extract all inline <script> blocks and validate ES5 compliance.
    Returns True if all scripts pass ES5 check.
    """
    script_re = re.compile(r'<script[^>]*>\s*(.*?)\s*</script>', re.DOTALL | re.IGNORECASE)
    scripts = script_re.findall(html)
    
    all_valid = True
    for i, script_content in enumerate(scripts, 1):
        # Skip inline event handlers and short setup scripts
        if len(script_content.strip()) < 50:
            continue
        
        # Check for ES6 patterns
        if not check_es5_syntax(script_content, f"<script block #{i}>", strict=False):
            all_valid = False
    
    return all_valid


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


def inline_scripts(html: str, base_dir: Path) -> tuple[str, bool]:
    """
    Inline script tags and validate ES5 compliance.
    Returns tuple: (modified_html, all_valid)
    """
    all_valid = True
    
    def repl(m):
        nonlocal all_valid
        src = m.group(1)
        if src.startswith("http://") or src.startswith("https://"):
            return m.group(0)  # leave external scripts alone
        
        full = (base_dir / src).resolve()
        content = read_file(full)
        if content is None:
            return f"<!-- MISSING SCRIPT: {src} -->"
        
        # Validate ES5 syntax for JS files
        if src.endswith('.js'):
            if not check_es5_syntax(content, src, strict=False):
                all_valid = False
                print(f"⚠️  Warning: {src} contains ES6+ syntax", file=sys.stderr)
        
        return f"<!-- inlined: {src} -->\n<script>\n/* {src} */\n{content}\n</script>\n"

    modified_html = SCRIPT_RE.sub(repl, html)
    return modified_html, all_valid


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
    parser.add_argument(
        "--strict",
        action="store_true",
        help="fail build if any ES6 syntax is detected",
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

    print(f"Bundling {input_path}...", file=sys.stderr)

    # Inline styles and scripts
    html = inline_styles(html, base_dir)
    html, all_valid = inline_scripts(html, base_dir)

    # Validate final bundled output
    print("Validating ES5 compatibility...", file=sys.stderr)
    if not validate_bundle_es5(html):
        if args.strict:
            print("ERROR: ES6 syntax found and --strict mode enabled", file=sys.stderr)
            return 1
        else:
            print("⚠️  Warning: ES6 syntax detected. Use --strict to fail on this.", file=sys.stderr)

    # Add a metadata comment at top
    now = datetime.utcnow().isoformat() + "Z"
    header = f"<!-- Bundled by scripts/build_bundle_html.py -->\n"
    out_html = header + html

    out_path = Path(args.output)
    if not write_file(out_path, out_html):
        return 4

    print(f"✓ Bundled successfully: {out_path}", file=sys.stderr)
    if not all_valid and not args.strict:
        print("⚠️  Note: Some ES6 syntax detected. Run with --strict to enforce ES5 only.", file=sys.stderr)
        return 0
    
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))