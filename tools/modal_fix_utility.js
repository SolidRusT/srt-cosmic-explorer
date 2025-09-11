/**
 * Modal Fix Utility for Cosmic Explorer
 * 
 * This utility provides emergency fixes and debugging tools for modal issues.
 * Load this script in the browser console to access the modalFix tools.
 * 
 * Usage:
 * 1. Open browser console (F12)
 * 2. Copy and paste this entire script
 * 3. Use the commands below
 */

window.modalFix = {
    /**
     * Emergency close all modals
     */
    closeAll: function() {
        console.log('🚨 Emergency modal close activated');
        
        // Close all modals
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
            modal.style.animation = 'none';
        });
        
        // Clear modal manager state
        if (window.uiManager?.modalManager) {
            window.uiManager.modalManager.activeModals = [];
            window.uiManager.modalManager.currentModalZIndex = 1000;
            window.uiManager.modalManager.isShowingModal = false;
            window.uiManager.modalManager.modalQueue = [];
        }
        
        // Remove any stuck overlays
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
            backdrop.style.display = 'none';
        });
        
        console.log('✅ All modals closed');
    },
    
    /**
     * Fix stuck choice modal
     */
    fixChoiceModal: function() {
        console.log('🔧 Fixing choice modal...');
        
        const modal = document.getElementById('choice-modal');
        if (!modal) {
            console.error('❌ Choice modal not found');
            return;
        }
        
        // Reset modal structure
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            // Fix positioning
            closeBtn.style.cssText = `
                position: absolute !important;
                top: 1rem !important;
                right: 1rem !important;
                left: auto !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                width: 36px !important;
                height: 36px !important;
                cursor: pointer !important;
                pointer-events: auto !important;
                z-index: 10 !important;
                opacity: 1 !important;
            `;
            
            // Add click handler
            closeBtn.onclick = () => {
                console.log('Close button clicked');
                this.closeAll();
            };
            
            console.log('✅ Close button fixed');
        } else {
            console.error('❌ Close button not found');
        }
        
        // Fix backdrop
        const backdrop = modal.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.style.cursor = 'pointer';
            backdrop.onclick = (e) => {
                if (e.target === backdrop) {
                    console.log('Backdrop clicked');
                    this.closeAll();
                }
            };
            console.log('✅ Backdrop click fixed');
        }
        
        // Add ESC key handler
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                console.log('ESC pressed');
                this.closeAll();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
        console.log('✅ ESC key handler added');
        
        console.log('✅ Choice modal fixes applied');
    },
    
    /**
     * Debug modal state
     */
    debug: function() {
        console.log('🔍 Modal Debug Information:');
        
        // Check modal manager state
        if (window.uiManager?.modalManager) {
            const mm = window.uiManager.modalManager;
            console.log('Modal Manager State:', {
                activeModals: mm.activeModals.length,
                currentZIndex: mm.currentModalZIndex,
                isShowingModal: mm.isShowingModal,
                queueLength: mm.modalQueue.length
            });
        }
        
        // Check visible modals
        const visibleModals = [];
        document.querySelectorAll('.modal').forEach(modal => {
            if (modal.style.display !== 'none') {
                visibleModals.push({
                    id: modal.id,
                    display: modal.style.display,
                    zIndex: modal.style.zIndex,
                    hasCloseButton: !!modal.querySelector('.modal-close'),
                    hasBackdrop: !!modal.querySelector('.modal-backdrop')
                });
            }
        });
        console.log('Visible Modals:', visibleModals);
        
        // Check game state
        if (window.gameEngine) {
            console.log('Game State:', {
                isInitializing: window.gameEngine.isInitializing,
                isLoadingGame: window.gameEngine.isLoadingGame,
                hasGameState: !!window.gameEngine.gameState,
                currentScreen: window.gameUI?.screenManager?.getCurrentScreen?.()
            });
        }
        
        // Check for event handlers
        const choiceModal = document.getElementById('choice-modal');
        if (choiceModal) {
            const closeBtn = choiceModal.querySelector('.modal-close');
            console.log('Choice Modal:', {
                exists: true,
                isVisible: choiceModal.style.display !== 'none',
                hasCloseButton: !!closeBtn,
                closeButtonPosition: closeBtn ? {
                    position: closeBtn.style.position,
                    top: closeBtn.style.top,
                    right: closeBtn.style.right,
                    left: closeBtn.style.left
                } : null
            });
        }
    },
    
    /**
     * Test modal functionality
     */
    test: function() {
        console.log('🧪 Testing modal functionality...');
        
        // Test showing a modal
        if (window.uiManager) {
            window.uiManager.showChoiceModal(
                'Test Modal',
                ['Option 1', 'Option 2', 'Option 3'],
                (choice) => {
                    console.log('Choice selected:', choice);
                    this.closeAll();
                }
            );
            console.log('✅ Test modal shown');
            
            // Check if close button works
            setTimeout(() => {
                const modal = document.getElementById('choice-modal');
                const closeBtn = modal?.querySelector('.modal-close');
                if (closeBtn) {
                    console.log('Close button found, testing click...');
                    closeBtn.click();
                }
            }, 1000);
        } else {
            console.error('❌ UI Manager not found');
        }
    },
    
    /**
     * Apply permanent fixes
     */
    applyPermanentFixes: function() {
        console.log('🔧 Applying permanent modal fixes...');
        
        // Override showChoiceModal to add extra validation
        if (window.ModalManager?.prototype?.showChoiceModal) {
            const original = window.ModalManager.prototype.showChoiceModal;
            window.ModalManager.prototype.showChoiceModal = function(title, choices, callback) {
                console.log('Modal requested:', { title, choices });
                
                // Extra validation
                if (!choices || !Array.isArray(choices) || choices.length === 0) {
                    console.error('Blocked empty modal');
                    return;
                }
                
                // Ensure we're in game screen
                const screen = window.gameUI?.screenManager?.getCurrentScreen?.();
                if (screen !== 'game') {
                    console.warn('Blocked modal - not in game screen');
                    return;
                }
                
                // Call original with fixes
                const result = original.call(this, title, choices, callback);
                
                // Ensure close button works
                setTimeout(() => {
                    modalFix.fixChoiceModal();
                }, 100);
                
                return result;
            };
            console.log('✅ showChoiceModal override applied');
        }
        
        console.log('✅ Permanent fixes applied');
    }
};

// Auto-apply fixes if modal is stuck on load
setTimeout(() => {
    const choiceModal = document.getElementById('choice-modal');
    if (choiceModal && choiceModal.style.display !== 'none') {
        console.warn('⚠️ Stuck modal detected on load, applying fixes...');
        modalFix.fixChoiceModal();
    }
}, 1000);

console.log(`
🎮 Modal Fix Utility Loaded!

Available commands:
- modalFix.closeAll()          : Emergency close all modals
- modalFix.fixChoiceModal()    : Fix stuck choice modal
- modalFix.debug()             : Show debug information
- modalFix.test()              : Test modal functionality
- modalFix.applyPermanentFixes() : Apply permanent fixes

If you're stuck in a modal, run: modalFix.closeAll()
`);
