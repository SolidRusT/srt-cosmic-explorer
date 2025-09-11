# Cosmic Explorer Tools

This directory contains utility scripts and tools for development and asset generation.

## Files

### `favicon_generator.html`
An interactive HTML tool for generating favicon images. Open this file in a browser to:
- Design custom favicons using Canvas
- Export as different sizes
- Preview how the favicon looks

### `generate_favicon.py`
Python script for generating favicon.ico files programmatically.
- Creates multi-resolution ICO files
- Supports 16x16, 32x32, and 48x48 sizes
- Uses PIL/Pillow for image processing

Usage:
```bash
python generate_favicon.py
```

### `create_favicon.sh`
Bash script wrapper for favicon generation.
- Checks dependencies
- Runs the Python favicon generator
- Copies output to appropriate directories

Usage:
```bash
./create_favicon.sh
```

### `POD_MODS_DEBUG.js`
Debugging utility for the Pod Modifications system.
- Tests pod mod functionality
- Validates augmentation data
- Helps diagnose UI issues

### `music_debug_helper.js`
Comprehensive music system debugging tool.
- Test all music tracks quickly
- Simulate different game states
- Check audio visualizer data
- Volume controls and status monitoring

Usage:
```javascript
// Copy entire file contents to browser console, then:
musicDebug.testAll()     // Test all tracks
musicDebug.status()      // Show current status
musicDebug.play('combat') // Play specific track
```

### `modal_debug_helper.js`
Modal system debugging and repair tool.
- Test modal functionality
- Fix stuck/broken modals
- Check modal state and positioning
- Simulate choice events

Usage:
```javascript
// Load in browser console:
const script = document.createElement('script');
script.src = '/static/tools/modal_debug_helper.js';
document.head.appendChild(script);

// Common commands:
modalDebug.help()           // Show all commands
modalDebug.fixStuckModal()  // Fix stuck modal
modalDebug.checkState()     // Check modal state
modalDebug.testValidModal() // Test working modal
```

### `modal_fix_utility.js` (NEW - June 2025)
Comprehensive modal fix and debugging utility.
- Emergency modal close functionality
- Enhanced debugging information
- Permanent fix application
- Close button position correction

Usage:
```javascript
// Copy entire file contents to browser console, then:
modalFix.closeAll()           // Emergency close all modals
modalFix.fixChoiceModal()     // Fix stuck choice modal with close button
modalFix.debug()              // Show detailed debug information
modalFix.test()               // Test modal functionality
modalFix.applyPermanentFixes() // Apply permanent fixes to modal system
```

### `modal_test_suite.js` (NEW - June 2025)
Automated test suite for modal functionality.
- Tests basic modal operations
- Validates empty modal prevention
- Checks all close methods (X button, backdrop, ESC)
- Provides detailed test results

Usage:
```javascript
// Copy entire file contents to browser console, then:
modalTests.runAll()           // Run complete test suite
modalTests.testBasicModal()   // Test basic functionality
modalTests.testEmptyModalPrevention() // Test empty modal blocking
modalTests.testCloseMethod()  // Test all close methods
```

## Emergency Modal Recovery

If you get stuck in a modal during gameplay:

### Quick Fix (Built-in)
```javascript
// Press F12 to open console and run:
window.uiManager.closeAllModals()
```

### Comprehensive Fix
```javascript
// Copy modal_fix_utility.js contents to console, then:
modalFix.closeAll()           // Close all modals
modalFix.fixChoiceModal()     // Fix close button if needed
```

### Keyboard Shortcut
- Press `ESC` key to close modals
- Press `Ctrl+Shift+C` for emergency modal close (if implemented)

## Adding New Tools

When adding new utility scripts:

1. Place them in this directory
2. Update this README with documentation
3. Make shell scripts executable: `chmod +x script.sh`
4. Add any required dependencies to `requirements-dev.txt`

## Development Utilities Wishlist

- [ ] Sprite sheet generator
- [ ] Sound effect generator
- [ ] Save file inspector/editor
- [ ] Performance profiler
- [ ] Automated screenshot tool
- [ ] Release packager
