# Cosmic Explorer 🚀

A stunning space exploration game with beautiful web-based graphics, procedural music, and immersive gameplay!

## ✨ Features

### 🎮 Gameplay
- **Open-world space exploration** with dynamic encounters
- **Real-time combat** with multiple weapon types
- **Pod augmentation system** for ship upgrades
- **Trading economy** across different space stations
- **Quest system** with branching storylines
- **Save/Load functionality** with 5 save slots

### 🎨 Visual Experience
- **Dynamic space environment** with animated stars and colorful nebulae
- **Smooth ship animations** with particle thrust effects
- **Procedurally generated universe** with planets, stations, and asteroid fields
- **Visual damage system** showing ship condition in real-time
- **Glass-morphism UI** with modern, translucent interface panels

### 🎵 Audio System
- **Procedural Music Engine**
  - 5 dynamic tracks that adapt to gameplay
  - 40+ musical layers across all tracks
  - Advanced music theory with complex chord progressions
  - Real-time adaptation to game state
  
- **Sound Effects System**
  - 20+ procedural sound effects
  - Contextual audio for different actions
  - Dynamic warnings and alerts
  - 100% Web Audio API - no external files

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone and enter the repository
cd cosmic-explorer

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Running the Game

```bash
# Start the game server
./start_game.sh      # Linux/Mac
start_game.bat       # Windows
python api/app.py    # Manual start

# Open in browser
http://localhost:5000
```

## 🎮 Controls

### Keyboard Shortcuts
- `1-6` - Quick actions (navigate, scan, repair, inventory, quests, star map)
- `ESC` - Return to main menu
- `Ctrl+Shift+C` - Emergency modal close (if stuck)
- `Ctrl+Shift+M` - Toggle debug overlay

### Mouse
- Click buttons and navigate menus
- Hover for tooltips and information

## 🏗️ Architecture

The game features a modern, modular architecture:

### Backend (Python/Flask)
- RESTful API with WebSocket support
- Game state management
- Save/Load system
- Real-time synchronization

### Frontend (JavaScript)
- **Modular UI system** - Clean component architecture
- **Canvas rendering engine** - Smooth 60fps graphics
- **Particle effects system** - Dynamic visual effects
- **Procedural audio** - Real-time sound generation

### Key Systems
- `static/js/modules/` - Modularized JavaScript components
- `api/` - Python backend with game logic
- `static/css/` - Responsive styling with CSS variables

## 📚 Documentation

Comprehensive documentation is available in the `docs/` folder:

- **[Architecture Overview](docs/architecture/overview.md)** - System design
- **[Getting Started Guide](docs/guides/getting-started/quickstart.md)** - Detailed setup
- **[API Reference](docs/references/api/endpoints.md)** - Backend endpoints
- **[Troubleshooting](docs/guides/troubleshooting/common-issues.md)** - Common issues

## 🛠️ Development

### Adding Features
- **Visual Effects**: Add to `static/js/particles.js`
- **Sound Effects**: Extend `static/js/modules/audio/`
- **UI Components**: Create in `static/js/modules/ui/`
- **Game Logic**: Update `api/` Python files

### Project Structure
```
cosmic-explorer/
├── api/                 # Python backend
├── static/              # Frontend assets
│   ├── js/modules/     # Modular JavaScript
│   ├── css/            # Styling
│   └── sounds/         # Audio assets
├── templates/          # HTML templates
└── docs/              # Documentation
```

## 🎯 Roadmap

### Completed ✅
- Web-based UI migration
- Procedural music system
- Sound effects engine
- Save/Load functionality
- Modal system improvements
- UI modularization

### In Progress 🚧
- Interactive star map
- Enhanced combat visuals

### Planned 📋
- Sprite-based graphics
- Ship customization UI
- Multiplayer support
- Mobile touch controls
- Achievement system

## 🤝 Contributing

Contributions are welcome! Please check the [documentation](docs/README.md) for coding standards and guidelines.

## 📄 License

This project is open source and available under the MIT License.

---

**Ready to explore the cosmos?** Start the game and embark on your space adventure! 🌟

*Created with the assistance of Anthropic's Claude and xAI's Grok.*
