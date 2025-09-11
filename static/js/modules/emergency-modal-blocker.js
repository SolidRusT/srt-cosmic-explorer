/**
 * Emergency Modal Blocker
 * Prevents any modal from showing during game initialization
 */

(function() {
    'use strict';
    
    console.log('[ModalBlocker] Installing emergency modal blocker...');
    
    // Completely override the choice modal display
    const modal = document.getElementById('choice-modal');
    if (modal) {
        // Force hide it
        modal.style.display = 'none !important';
        
        // Override the style property
        Object.defineProperty(modal.style, 'display', {
            get: function() { return 'none'; },
            set: function(value) {
                if (value !== 'none') {
                    console.warn('[ModalBlocker] Blocked attempt to show modal with display:', value);
                    
                    // Check if we're in game screen
                    const currentScreen = window.gameUI?.screenManager?.getCurrentScreen?.();
                    if (currentScreen !== 'game') {
                        console.warn('[ModalBlocker] Not in game screen, keeping modal hidden');
                        return;
                    }
                    
                    // Check if there are actual choices
                    const choiceList = document.getElementById('choice-list');
                    if (!choiceList || choiceList.children.length === 0) {
                        console.warn('[ModalBlocker] No choices in modal, keeping hidden');
                        return;
                    }
                    
                    // Only allow if there are real choices
                    console.log('[ModalBlocker] Modal has', choiceList.children.length, 'choices, allowing display');
                    this._display = value;
                } else {
                    this._display = value;
                }
            }
        });
    }
    
    // Block modal manager from showing empty modals
    let blockCount = 0;
    const maxBlocks = 10; // Prevent first 10 modal attempts
    
    function interceptModalManager() {
        if (window.uiManager?.modalManager) {
            const original = window.uiManager.modalManager.showChoiceModal;
            
            window.uiManager.modalManager.showChoiceModal = function(title, choices, callback) {
                console.log('[ModalBlocker] Intercepted showChoiceModal:', {
                    title,
                    choices,
                    blockCount,
                    gameScreen: window.gameUI?.screenManager?.getCurrentScreen?.()
                });
                
                // Block first few attempts during initialization
                if (blockCount < maxBlocks) {
                    blockCount++;
                    
                    // Check if this is a legitimate modal
                    if (!choices || !Array.isArray(choices) || choices.length === 0) {
                        console.warn('[ModalBlocker] Blocked modal attempt #' + blockCount + ' - no valid choices');
                        return;
                    }
                    
                    // Check if we're actually in the game
                    const screen = window.gameUI?.screenManager?.getCurrentScreen?.();
                    if (screen !== 'game') {
                        console.warn('[ModalBlocker] Blocked modal attempt #' + blockCount + ' - not in game screen');
                        return;
                    }
                    
                    // Check if game is initialized
                    if (window.gameEngine?.isInitializing) {
                        console.warn('[ModalBlocker] Blocked modal attempt #' + blockCount + ' - game initializing');
                        return;
                    }
                }
                
                // After initial blocks, use normal validation
                if (choices && Array.isArray(choices) && choices.length > 0) {
                    const validChoices = choices.filter(c => c && typeof c === 'string' && c.trim());
                    if (validChoices.length > 0) {
                        return original.call(this, title, validChoices, callback);
                    }
                }
                
                console.warn('[ModalBlocker] Blocked modal - invalid choices');
            };
            
            console.log('[ModalBlocker] Modal manager intercepted');
        }
    }
    
    // Install blocker immediately
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Try to intercept modal manager multiple times
    interceptModalManager();
    setTimeout(interceptModalManager, 100);
    setTimeout(interceptModalManager, 500);
    setTimeout(interceptModalManager, 1000);
    setTimeout(interceptModalManager, 2000);
    
    // Add global function to disable blocker
    window.disableModalBlocker = function() {
        blockCount = maxBlocks;
        console.log('[ModalBlocker] Blocker disabled, modals can now show normally');
    };
    
    // Auto-disable after 5 seconds (game should be initialized by then)
    setTimeout(() => {
        blockCount = maxBlocks;
        console.log('[ModalBlocker] Auto-disabled after 5 seconds');
    }, 5000);
    
    console.log('[ModalBlocker] Emergency blocker installed');
    console.log('[ModalBlocker] Type window.disableModalBlocker() to allow modals');
    
})();
