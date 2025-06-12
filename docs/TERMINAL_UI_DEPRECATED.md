# 🚨 Terminal UI Deprecation Notice

## ⚠️ DEPRECATED FILES
- **`ui.py`** - Terminal UI rendering (ASCII art, colored text)
- **`game.py`** - Terminal game runner (input() based)

## ✅ CURRENT WAY TO RUN THE GAME
```bash
python api/app.py
```
Then open: http://localhost:5000

## ❌ DO NOT USE
```bash
python game.py  # DEPRECATED - Terminal version
```

## 📝 What Changed
- Removed `blessed` dependency from requirements.txt
- Added deprecation headers to ui.py and game.py
- Updated README with deprecation notice
- All game features now in web interface only

## 🗑️ Optional Cleanup
If you want to remove deprecated files:
```bash
rm ui.py game.py
```

## 📚 Documentation
- Full details: `/docs/archive/deprecation/terminal-ui-deprecation.md`
- Original notice: `/docs/archive/feature-docs/terminal-ui-deprecated.md`

---
*Terminal UI served us well, but the future is web-based! 🚀*
