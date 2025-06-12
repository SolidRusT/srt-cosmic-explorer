---
title: Deprecation Archive
tags: [archive, deprecation, history]
created: 2025-06-12
updated: 2025-06-12
status: active
---

# Deprecation Archive

This directory contains documentation for deprecated features and systems in Cosmic Explorer.

## Terminal UI Deprecation (June 2025)

The original terminal-based UI was deprecated in favor of the web-based interface. This was a major architectural change that improved the game experience significantly.

### Documentation

1. **[[terminal-ui-deprecation|Original Deprecation Document]]**
   - First comprehensive deprecation notice
   - Technical details about the transition

2. **[[2025-06-12-terminal-ui-summary|Deprecation Summary]]**
   - Final summary of what was deprecated
   - Impact analysis and migration notes

3. **[[2025-06-12-terminal-ui-quickref|Quick Reference]]**
   - Quick guide for users about the deprecation
   - Simple instructions for running the web version

### Key Changes

- **Removed**: `ui.py` (terminal UI rendering)
- **Removed**: `game.py` (terminal game runner)  
- **Removed**: `blessed` dependency
- **Added**: Full web-based interface at http://localhost:5000

### Related Documents

- [[../../guides/getting-started/quickstart|Getting Started]] - How to run the web version
- [[../../architecture/adrs/001-web-based-ui|ADR-001]] - Decision to move to web UI
- [[../../components/frontend/index|Frontend Architecture]] - New web architecture

---

*All deprecated code has been preserved with deprecation headers for historical reference.*
