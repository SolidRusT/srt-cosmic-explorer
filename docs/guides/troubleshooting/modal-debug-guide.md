# Modal Debug System Usage Guide

## Overview
The Modal Debug System helps identify and fix issues with unwanted popups/modals that prevent gameplay in Cosmic Explorer.

## Features

### 1. Modal Debug Overlay
- **Toggle**: Press `Ctrl+Shift+M` to show/hide the debug overlay
- Shows active modal count, total modals shown, and recent modal history
- Displays real-time modal activity with color coding

### 2. Emergency Modal Controls
- **Force Close All**: Press `Ctrl+Shift+C` to immediately close all modals
- **Triple ESC**: Press ESC three times quickly to emergency close all modals
- **Debug Dump**: Press `Ctrl+Shift+D` to dump modal history to console and clipboard

### 3. Automatic Problem Detection
- Detects empty choice modals (no choices provided)
- Identifies rapid modal spawning (>5 modals in 1 second)
- Warns about modals during loading screens
- Suppresses duplicate modals

### 4. Console Logging
When verbose mode is enabled, the debugger logs:
- Every modal event with full details
- Stack traces to identify what triggered the modal
- Game state when modal was shown
- Automatic problem detection alerts

## How to Use

### Starting a Debug Session
1. Load the game normally
2. Press `Ctrl+Shift+M` to open the debug overlay
3. Try to reproduce the modal issue
4. Watch the overlay for problematic patterns

### When You Get Stuck
1. Press `Ctrl+Shift+C` to force close all modals
2. Check the debug overlay for what triggered the modal
3. Press `Ctrl+Shift+D` to dump the full history

### Reading the Debug Output
```javascript
🔲 Modal Event: choice
Data: {
  title: "Make a Choice",
  choices: [],  // <-- Empty! This is the problem
  hasCallback: true,
  stackTrace: "..." // Shows where it was called from
}
Game State: {
  screen: "mainMenu",  // <-- Modal shown on wrong screen
  inCombat: false,
  hasChoices: false,
  socketConnected: true,
  location: "unknown"
}
```

## Common Issues and Solutions

### Issue: Empty Choice Modal on Game Start
**Symptoms**: "Make a Choice" modal with no options appears when starting new game

**Solution Applied**:
- Added validation to reject empty choice arrays
- Added screen check to prevent modals outside game screen
- Force close modals on screen transitions

### Issue: Rapid Modal Spawning
**Symptoms**: Multiple modals appear quickly, overwhelming the UI

**Solution Applied**:
- Rate limiting to prevent modals spawning within 100ms
- Duplicate detection to suppress repeated modals
- Automatic cleanup on screen changes

### Issue: Modal During Loading
**Symptoms**: Modals appear while game is still loading

**Solution Applied**:
- Screen state validation before showing modals
- Suppress all modals during loading screen
- Clear modal queue on game start

## Startup Modal Fix

The `startup-modal-fix.js` module provides additional safeguards:

1. **Screen Transition Cleanup**: Automatically closes all modals when switching screens
2. **Game Start Cleanup**: Clears all modals when starting/continuing a game
3. **Safety Validation**: Additional checks before any modal can be shown
4. **Rate Limiting**: Prevents rapid modal spawning

## Testing the Fix

1. Start the game and click "New Journey"
2. If no modal appears, the fix is working
3. If a modal does appear:
   - Press `Ctrl+Shift+C` to close it
   - Check the debug overlay for details
   - Report the modal type and trigger

## Disabling the Debug System

Once the modal issues are resolved, you can disable the debug system by:
1. Removing the script tags from `index.html`
2. Or setting `window.modalDebugger.enabled = false` in console

## For Developers

The debug system hooks into:
- `UIManager.showChoiceModal()`
- `UIManager.showNotification()`
- `UIManager.showSaveLoadModal()`
- DOM mutations for modal visibility changes

To add debugging for new modal types:
1. Add override in `hookModalSystem()`
2. Add modal ID to `forceCloseAll()`
3. Add specific problem detection if needed
