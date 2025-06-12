---
title: Troubleshooting Guide
tags: [troubleshooting, guides, debugging, support]
created: 2025-06-12
updated: 2025-06-12
status: active
---

# Troubleshooting Guide

This section contains guides for debugging and fixing common issues in Cosmic Explorer.

## 📚 Available Guides

### General Issues
- **[[common-issues|Common Issues & Solutions]]** - Quick fixes for frequent problems
  - Game won't start
  - Save/Load problems
  - Gameplay issues
  - Performance problems

### Modal System Issues
The modal (popup) system has been extensively debugged and improved. Here are resources for dealing with modal-related problems:

1. **[[modal-debug-quickref|Modal Debug Quick Reference]]** 🚨
   - Emergency hotkeys (Ctrl+Shift+C)
   - Quick start guide
   - Common fixes at a glance

2. **[[modal-debug-guide|Modal Debug Guide]]**
   - Comprehensive debugging system
   - How to use the debug overlay
   - Reporting modal issues

3. **[[modal-issues|Modal Issues Overview]]**
   - History of modal problems
   - Architecture improvements
   - Prevention strategies

## 🔧 Debug Tools

### Built-in Debugging
- **Ctrl+Shift+M** - Toggle debug overlay
- **Ctrl+Shift+C** - Force close all modals
- **Ctrl+Shift+D** - Dump modal history
- **F12** - Browser developer console

### Quick Fixes
| Problem | Solution |
|---------|----------|
| Stuck in modal | Press Ctrl+Shift+C |
| Empty choice popup | Already auto-suppressed |
| Can't click anything | Triple-press ESC |
| Debug what's happening | Press Ctrl+Shift+M |

## 🎯 Troubleshooting Process

1. **Identify the Issue**
   - Note exact error message
   - Check browser console (F12)
   - Try emergency hotkeys

2. **Apply Quick Fix**
   - Use appropriate debug tool
   - Check common issues guide
   - Try browser refresh

3. **Document if Persists**
   - Enable debug overlay
   - Reproduce the issue
   - Capture debug dump
   - Report with details

## 📋 Related Resources

- [[../../guides/getting-started/quickstart|Getting Started]] - Initial setup
- [[../../components/frontend/index|Frontend Architecture]] - Understanding the UI
- [[../../references/api/endpoints|API Reference]] - Backend communication
- [[../../archive/bug-fixes/index|Bug Fix Archive]] - Historical fixes

## 🚨 Emergency Contacts

If you're completely stuck:
1. Force refresh: Ctrl+F5
2. Clear browser cache
3. Restart game server
4. Check for updates

---

Parent: [[../index|Guides]]  
See Also: [[../../README|Main Documentation]]
