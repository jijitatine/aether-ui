import json, subprocess, sys, unittest
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
class TokensTest(unittest.TestCase):
    def test_all_json_valid(self):
        for file in (ROOT/'tokens').rglob('*.json'):
            with self.subTest(file=file):
                self.assertIsInstance(json.loads(file.read_text()), dict)
    def test_theme_keys_match(self):
        light=json.loads((ROOT/'tokens/semantic/light.json').read_text())['semantic']
        dark=json.loads((ROOT/'tokens/semantic/dark.json').read_text())['semantic']
        self.assertEqual(set(light),set(dark))
    def test_generated_css_is_valid_shape(self):
        subprocess.run([sys.executable, str(ROOT/'scripts/build_css.py')], check=True)
        css=(ROOT/'packages/tokens-css/tokens.css').read_text()
        self.assertIn('--aether-font-family-primary: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;', css)
        self.assertIn('--aether-shadow-card: 0px 4px 16px 0px #00000014;', css)
        self.assertIn('--aether-shadow-glass: 0px 18px 48px -12px #0A193326;', css)
        self.assertIn('--aether-glass-blur-medium: 24px;', css)
        self.assertIn('--aether-semantic-glass-surface:', css)
        self.assertIn('--aether-semantic-glass-surface-strong:', css)
        self.assertIn('--aether-semantic-glass-border:', css)
        self.assertIn('--aether-semantic-glass-highlight:', css)
        self.assertNotIn("{'color':", css)
        self.assertEqual(css, (ROOT/'docs/tokens.css').read_text())
    def test_glass_theme_contract(self):
        required = {'glass-surface', 'glass-surface-strong', 'glass-border', 'glass-highlight'}
        for mode in ('light', 'dark'):
            semantic=json.loads((ROOT/f'tokens/semantic/{mode}.json').read_text())['semantic']
            self.assertTrue(required <= set(semantic))
        glass=json.loads((ROOT/'tokens/core/glass.json').read_text())['glass']
        self.assertEqual({'small', 'medium', 'large'}, set(glass['blur']))
    def test_agent_entry_points_and_docs_exist(self):
        required = (
            ROOT/'AGENTS.md', ROOT/'CLAUDE.md', ROOT/'ai/integration-guide.md',
            ROOT/'ai/review-checklist.md', ROOT/'docs/index.html',
            ROOT/'docs/styles.css', ROOT/'docs/app.js',
        )
        for path in required:
            with self.subTest(path=path):
                self.assertTrue(path.is_file())
                self.assertGreater(path.stat().st_size, 0)
if __name__=='__main__':unittest.main()
