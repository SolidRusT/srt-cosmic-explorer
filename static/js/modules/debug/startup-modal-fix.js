/**
 * Startup Modal Fix for Cosmic Explorer
 * Ensures clean game starts without lingering modals
 */

class StartupModalFix {
    constructor() {
        this.initialized = false;
        this.setupFixes();
    }
    
    setupFixes() {
        // Hook into screen transitions
        this.hookScreenTransitions();
        
        // Clear modals on game start
        this.hookGameStart();
        
        // Add safety checks to modal system
        this.addModalSafetyChecks();
        
        console.log('✅ Startup Modal Fix initialized');
    }
    
    hookScreenTransitions() {
        // Store original showScreen method
        const originalShowScreen = window.UIManager?.prototype?.showScreen;
        
        if (originalShowScreen) {
            window.UIManager.prototype.showScreen = function(screenName) {
                console.log(`Transitioning to screen: ${screenName}`);
                
                // Always close all modals when changing screens
                if (this.modalManager) {
                    this.modalManager.closeAllModals();
                }
                
                // Clear any lingering notifications
                document.querySelectorAll('.notification').forEach(n => n.remove());
                
                // Call original method
                const result = originalShowScreen.call(this, screenName);
                
                // Extra cleanup for specific screens
                if (screenName === 'game') {
                    // Ensure no modals are visible when entering game
                    setTimeout(() => {
                        document.querySelectorAll('.modal').forEach(modal => {
                            if (modal.style.display !== 'none') {
                                console.warn('Found lingering modal on game start:', modal.id);
                                modal.style.display = 'none';
                            }
                        });
                    }, 100);
                }
                
                return result;
            };
        }
    }
    
    hookGameStart() {
        // Hook into startNewGame
        const originalStartNewGame = window.GameActions?.prototype?.startNewGame;
        
        if (originalStartNewGame) {
            window.GameActions.prototype.startNewGame = async function() {
                console.log('Starting new game - clearing all modals');
                
                // Force close everything
                if (this.gameEngine.uiManager) {
                    this.gameEngine.uiManager.closeAllModals();
                }
                
                // Clear modal history if debugger exists
                if (window.modalDebugger) {
                    window.modalDebugger.clearHistory();
                }
                
                // Call original
                return await originalStartNewGame.call(this);
            };
        }
        
        // Also hook continueGame
        const originalContinueGame = window.UIManager?.prototype?.continueGame;
        
        if (originalContinueGame) {
            window.UIManager.prototype.continueGame = function() {
                console.log('Continuing game - clearing modals');
                
                // Close all modals
                if (this.modalManager) {
                    this.modalManager.closeAllModals();
                }
                
                // Call original
                return originalContinueGame.call(this);
            };
        }
    }
    
    addModalSafetyChecks() {
        // Add validation to showChoiceModal
        const originalShowChoiceModal = window.ModalManager?.prototype?.showChoiceModal;
        
        if (originalShowChoiceModal) {
            window.ModalManager.prototype.showChoiceModal = function(title, choices, callback) {
                // Additional validation
                if (!choices || !Array.isArray(choices) || choices.length === 0) {
                    console.error('Blocked empty choice modal:', { title, choices });
                    return;
                }
                
                // Check if we're in a valid state to show modals
                const currentScreen = window.gameUI?.screenManager?.getCurrentScreen?.();
                if (!currentScreen || currentScreen === 'loading') {
                    console.warn('Blocked modal during loading/transition');
                    return;
                }
                
                // Check for rapid modal spawning
                if (this._lastModalTime && Date.now() - this._lastModalTime < 100) {
                    console.warn('Blocked rapid modal spawn');
                    return;
                }
                this._lastModalTime = Date.now();
                
                // Call original
                return originalShowChoiceModal.call(this, title, choices, callback);
            };
        }
    }
}

// Initialize on load
let startupFixInitialized = false;

function initializeStartupFix() {
    if (startupFixInitialized) return;
    
    window.startupModalFix = new StartupModalFix();
    startupFixInitialized = true;
}

// Try multiple initialization points
if (window.UIManager && window.GameActions) {
    initializeStartupFix();
} else {
    // Wait for UI ready
    document.addEventListener('uiReady', initializeStartupFix);
    
    // Also try on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeStartupFix, 500);
    });
}

// Export
export default StartupModalFix;
