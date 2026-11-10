import json, unittest
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
if __name__=='__main__':unittest.main()
