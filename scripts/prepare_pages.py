from pathlib import Path
import subprocess
import sys

root = Path(__file__).resolve().parents[1]
docs = root / "docs"
docs.mkdir(exist_ok=True)
subprocess.run([sys.executable, str(root / "scripts/build_css.py")], check=True)
(docs / ".nojekyll").touch()
required = (docs / "index.html", docs / "styles.css", docs / "app.js", docs / "tokens.css")
missing = [path.name for path in required if not path.is_file()]
if missing:
    raise SystemExit(f"Missing documentation assets: {', '.join(missing)}")
print("GitHub Pages documentation prepared in docs/")
