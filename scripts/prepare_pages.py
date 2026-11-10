from pathlib import Path
import shutil

root = Path(__file__).resolve().parents[1]
docs = root / "docs"
docs.mkdir(exist_ok=True)
html = (root / "apps/playground/index.html").read_text(encoding="utf-8")
html = html.replace("../../packages/tokens-css/tokens.css", "./tokens.css")
(docs / "index.html").write_text(html, encoding="utf-8")
shutil.copy2(root / "packages/tokens-css/tokens.css", docs / "tokens.css")
(docs / ".nojekyll").touch()
print("GitHub Pages site prepared in docs/")
