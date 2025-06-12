/**
 * Modal Debug System for Cosmic Explorer
 * Tracks all modal activity to identify unwanted popups
 */

class ModalDebugger {
    constructor() {
        this.modalHistory = [];
        this.activeModals = new Set();
        this.enabled = true;
        this.verbose = true;
        
        // Initialize debugging UI
        this.initDebugUI();
        
        // Hook into modal system
        this.hookModalSystem();
        
        // Set up emergency hotkeys
        this.setupHotkeys();
        
        console.log('%c🔍 Modal Debugger Initialized', 'color: #00ff00; font-weight: bold');
        console.log('Press Ctrl+Shift+M to toggle modal debug overlay');
        console.log('Press Ctrl+Shift+C to force close all modals');
        console.log('Press Ctrl+Shift+D to dump modal history');
    }
    
    initDebugUI() {
        // Create debug overlay
        const overlay = document.createElement('div');
        overlay.id = 'modal-debug-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.9);
            color: #00ff00;
            padding: 10px;
            border: 2px solid #00ff00;
            font-family: monospace;
            font-size: 12px;
            max-width: 400px;
            max-height: 300px;
            overflow-y: auto;
            z-index: 999999;
            display: none;
        `;
        
        overlay.innerHTML = `
            <h3 style="margin: 0 0 10px 0;">Modal Debug Monitor</h3>
            <div id="modal-debug-stats">
                <div>Active Modals: <span id="active-modal-count">0</span></div>
                <div>Total Shown: <span id="total-modal-count">0</span></div>
                <div>Last Modal: <span id="last-modal-type">None</span></div>
            </div>
            <hr style="border-color: #00ff00; margin: 10px 0;">
            <div id="modal-debug-log" style="max-height: 200px; overflow-y: auto;"></div>
            <hr style="border-color: #00ff00; margin: 10px 0;">
            <button onclick="window.modalDebugger.forceCloseAll()" style="background: #ff0000; color: white; border: none; padding: 5px 10px; cursor: pointer;">Force Close All Modals</button>
            <button onclick="window.modalDebugger.clearHistory()" style="background: #0066cc; color: white; border: none; padding: 5px 10px; cursor: pointer; margin-left: 5px;">Clear History</button>
        `;
        
        document.body.appendChild(overlay);
        this.debugOverlay = overlay;
        
        // Create floating indicator
        const indicator = document.createElement('div');
        indicator.id = 'modal-debug-indicator';
        indicator.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(255, 0, 0, 0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 999998;
            display: none;
        `;
        indicator.textContent = '⚠️ Modal Active';
        document.body.appendChild(indicator);
        this.indicator = indicator;
    }
    
    hookModalSystem() {
        // Store original methods
        const originalShowChoiceModal = window.uiManager?.showChoiceModal;
        const originalShowNotification = window.uiManager?.showNotification;
        const originalShowSaveLoadModal = window.uiManager?.showSaveLoadModal;
        const originalShowFoodModal = window.uiManager?.showFoodModal;
        const originalShowPodModsModal = window.uiManager?.showPodModsModal;
        const originalShowShipModal = window.uiManager?.showShipModal;
        const originalShowStarMap = window.uiManager?.showStarMap;
        
        // Override showChoiceModal
        if (window.uiManager && originalShowChoiceModal) {
            window.uiManager.showChoiceModal = (title, choices, callback) => {
                this.logModal('choice', {
                    title,
                    choices,
                    hasCallback: !!callback,
                    stackTrace: new Error().stack
                });
                
                // Call original if not suppressed
                if (!this.shouldSuppressModal('choice', { title, choices })) {
                    return originalShowChoiceModal.call(window.uiManager, title, choices, callback);
                } else {
                    console.warn('Modal suppressed:', title);
                }
            };
        }
        
        // Override other modal methods similarly
        if (window.uiManager) {
            if (originalShowNotification) {
                window.uiManager.showNotification = (message, type, duration) => {
                    this.logModal('notification', { message, type, duration });
                    return originalShowNotification.call(window.uiManager, message, type, duration);
                };
            }
            
            if (originalShowSaveLoadModal) {
                window.uiManager.showSaveLoadModal = (mode) => {
                    this.logModal('saveLoad', { mode });
                    return originalShowSaveLoadModal.call(window.uiManager, mode);
                };
            }
            
            // Add more overrides as needed
        }
        
        // Also monitor DOM for any modal displays
        this.setupMutationObserver();
    }
    
    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    const element = mutation.target;
                    if (element.classList.contains('modal') || element.id?.includes('modal')) {
                        const display = element.style.display;
                        if (display !== 'none' && display !== '') {
                            this.logModal('dom-change', {
                                elementId: element.id,
                                className: element.className,
                                display: display,
                                content: element.textContent?.substring(0, 100)
                            });
                        }
                    }
                }
            });
        });
        
        // Start observing
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['style'],
            subtree: true
        });
    }
    
    setupHotkeys() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+M - Toggle debug overlay
            if (e.ctrlKey && e.shiftKey && e.key === 'M') {
                e.preventDefault();
                this.toggleDebugOverlay();
            }
            
            // Ctrl+Shift+C - Force close all modals
            if (e.ctrlKey && e.shiftKey && e.key === 'C') {
                e.preventDefault();
                this.forceCloseAll();
            }
            
            // Ctrl+Shift+D - Dump modal history
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.dumpHistory();
            }
            
            // Emergency escape - Triple ESC
            if (e.key === 'Escape') {
                if (!this.escapeCount) this.escapeCount = 0;
                this.escapeCount++;
                
                if (this.escapeCount >= 3) {
                    console.warn('Triple ESC detected - Emergency modal close!');
                    this.forceCloseAll();
                    this.escapeCount = 0;
                }
                
                // Reset counter after 1 second
                clearTimeout(this.escapeTimeout);
                this.escapeTimeout = setTimeout(() => {
                    this.escapeCount = 0;
                }, 1000);
            }
        });
    }
    
    logModal(type, data) {
        const entry = {
            type,
            data,
            timestamp: new Date().toISOString(),
            gameState: this.captureGameState()
        };
        
        this.modalHistory.push(entry);
        
        // Update UI
        this.updateDebugUI();
        
        // Console logging
        if (this.verbose) {
            console.group(`🔲 Modal Event: ${type}`);
            console.log('Data:', data);
            console.log('Game State:', entry.gameState);
            console.groupEnd();
        }
        
        // Check for problematic patterns
        this.checkForProblems(entry);
    }
    
    captureGameState() {
        return {
            screen: window.gameUI?.screenManager?.getCurrentScreen?.() || 'unknown',
            inCombat: window.gameEngine?.gameState?.in_combat || false,
            hasChoices: !!(window.gameEngine?.gameState?.choices?.length),
            socketConnected: window.gameEngine?.socket?.connected || false,
            location: window.gameEngine?.gameState?.current_location?.name || 'unknown'
        };
    }
    
    checkForProblems(entry) {
        // Check for empty choice modals
        if (entry.type === 'choice' && (!entry.data.choices || entry.data.choices.length === 0)) {
            console.error('❌ PROBLEM: Empty choice modal detected!', entry);
            this.showAlert('Empty choice modal detected!');
        }
        
        // Check for rapid modal spawning
        const recentModals = this.modalHistory.filter(m => 
            new Date() - new Date(m.timestamp) < 1000
        );
        
        if (recentModals.length > 5) {
            console.error('❌ PROBLEM: Rapid modal spawning detected!', recentModals);
            this.showAlert('Rapid modal spawning detected!');
        }
        
        // Check for modals during loading
        if (entry.gameState.screen === 'loading') {
            console.warn('⚠️ WARNING: Modal shown during loading screen', entry);
        }
    }
    
    shouldSuppressModal(type, data) {
        // Suppress empty choice modals
        if (type === 'choice' && (!data.choices || data.choices.length === 0)) {
            return true;
        }
        
        // Suppress modals during loading
        if (window.gameUI?.screenManager?.getCurrentScreen?.() === 'loading') {
            return true;
        }
        
        // Check for duplicate modals
        const recentSimilar = this.modalHistory.slice(-5).find(m => 
            m.type === type && 
            JSON.stringify(m.data) === JSON.stringify(data) &&
            new Date() - new Date(m.timestamp) < 500
        );
        
        if (recentSimilar) {
            console.warn('Suppressing duplicate modal:', type, data);
            return true;
        }
        
        return false;
    }
    
    forceCloseAll() {
        console.warn('🔨 Force closing all modals!');
        
        // Close all known modal IDs
        const modalIds = [
            'choice-modal',
            'save-load-modal',
            'pod-mods-modal',
            'food-modal',
            'ship-modal',
            'star-map-modal'
        ];
        
        modalIds.forEach(id => {
            const modal = document.getElementById(id);
            if (modal) {
                modal.style.display = 'none';
                modal.style.animation = 'none';
                
                // Clear content
                const contentAreas = modal.querySelectorAll('.choice-list, .modal-content > div');
                contentAreas.forEach(area => area.innerHTML = '');
            }
        });
        
        // Force close any elements with modal class
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
        
        // Remove notifications
        document.querySelectorAll('.notification').forEach(notif => {
            notif.remove();
        });
        
        // Call UIManager's closeAllModals if available
        if (window.uiManager?.closeAllModals) {
            window.uiManager.closeAllModals();
        }
        
        // Reset modal manager state
        if (window.uiManager?.modalManager) {
            window.uiManager.modalManager.activeModals = [];
            window.uiManager.modalManager.currentModalZIndex = 1000;
        }
        
        this.activeModals.clear();
        this.updateDebugUI();
        
        console.log('✅ All modals force closed');
        this.showAlert('All modals closed!', 'success');
    }
    
    toggleDebugOverlay() {
        const display = this.debugOverlay.style.display;
        this.debugOverlay.style.display = display === 'none' ? 'block' : 'none';
    }
    
    updateDebugUI() {
        if (!this.debugOverlay) return;
        
        // Update stats
        document.getElementById('active-modal-count').textContent = 
            document.querySelectorAll('.modal[style*="display: flex"], .modal[style*="display: block"]').length;
        document.getElementById('total-modal-count').textContent = this.modalHistory.length;
        
        const lastModal = this.modalHistory[this.modalHistory.length - 1];
        document.getElementById('last-modal-type').textContent = lastModal ? lastModal.type : 'None';
        
        // Update log
        const logEl = document.getElementById('modal-debug-log');
        const recentEntries = this.modalHistory.slice(-10).reverse();
        
        logEl.innerHTML = recentEntries.map(entry => `
            <div style="margin-bottom: 5px; padding: 5px; background: rgba(0,255,0,0.1); border-left: 3px solid ${
                entry.type === 'choice' ? '#ff0000' : '#00ff00'
            };">
                <strong>${entry.type}</strong> - ${new Date(entry.timestamp).toLocaleTimeString()}<br>
                <small>${JSON.stringify(entry.data).substring(0, 100)}...</small>
            </div>
        `).join('');
        
        // Update indicator
        const hasActiveModals = document.querySelectorAll('.modal[style*="display: flex"], .modal[style*="display: block"]').length > 0;
        this.indicator.style.display = hasActiveModals ? 'block' : 'none';
    }
    
    dumpHistory() {
        console.group('📋 Modal History Dump');
        console.table(this.modalHistory.map(entry => ({
            Type: entry.type,
            Time: new Date(entry.timestamp).toLocaleTimeString(),
            Screen: entry.gameState.screen,
            Title: entry.data.title || entry.data.message || 'N/A',
            Choices: entry.data.choices?.length || 'N/A'
        })));
        console.log('Full History:', this.modalHistory);
        console.groupEnd();
        
        // Also save to clipboard
        const dump = JSON.stringify(this.modalHistory, null, 2);
        navigator.clipboard.writeText(dump).then(() => {
            this.showAlert('Modal history copied to clipboard!', 'success');
        });
    }
    
    clearHistory() {
        this.modalHistory = [];
        this.updateDebugUI();
        console.log('Modal history cleared');
    }
    
    showAlert(message, type = 'error') {
        const alert = document.createElement('div');
        alert.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${type === 'error' ? '#ff0000' : '#00ff00'};
            color: ${type === 'error' ? 'white' : 'black'};
            padding: 20px;
            border-radius: 5px;
            font-family: monospace;
            font-weight: bold;
            z-index: 999999;
            animation: pulse 0.5s ease-in-out;
        `;
        alert.textContent = message;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
}

// Auto-initialize when UI is ready
let debuggerInitialized = false;

function initializeModalDebugger() {
    if (debuggerInitialized || !window.uiManager) return;
    
    window.modalDebugger = new ModalDebugger();
    debuggerInitialized = true;
}

// Try to initialize immediately if UI is ready
if (window.uiManager) {
    initializeModalDebugger();
} else {
    // Otherwise wait for UI ready event
    document.addEventListener('uiReady', initializeModalDebugger);
    
    // Also try on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeModalDebugger, 1000);
    });
}

// Export for use in other modules
export default ModalDebugger;
