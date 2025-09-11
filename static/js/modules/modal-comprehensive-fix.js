/**
 * Comprehensive Modal Fix for Cosmic Explorer
 * Ensures modals work properly and never show empty
 */

(function() {
    'use strict';
    
    console.log('[ModalFix] Initializing comprehensive modal fix...');
    
    // Wait for everything to be ready
    function waitForDependencies(callback) {
        let attempts = 0;
        const maxAttempts = 50;
        
        const checkInterval = setInterval(() => {
            attempts++;
            
            if (window.uiManager && window.gameEngine && window.gameUI) {
                clearInterval(checkInterval);
                callback();
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                console.error('[ModalFix] Timeout waiting for dependencies');
            }
        }, 100);
    }
    
    function applyModalFixes() {
        console.log('[ModalFix] Applying comprehensive fixes...');
        
        // 1. Fix the modal manager's showChoiceModal method
        if (window.uiManager && window.uiManager.modalManager) {
            const modalManager = window.uiManager.modalManager;
            const originalShow = modalManager.showChoiceModal.bind(modalManager);
            
            modalManager.showChoiceModal = function(title, choices, callback) {
                console.log('[ModalFix] Intercepting showChoiceModal:', { title, choices });
                
                // Strict validation
                if (!choices) {
                    console.error('[ModalFix] Blocked modal - choices is null/undefined');
                    return;
                }
                
                if (!Array.isArray(choices)) {
                    console.error('[ModalFix] Blocked modal - choices is not an array:', choices);
                    return;
                }
                
                if (choices.length === 0) {
                    console.error('[ModalFix] Blocked modal - choices array is empty');
                    return;
                }
                
                // Filter and validate choices
                const validChoices = choices.filter(choice => {
                    return choice != null && 
                           typeof choice === 'string' && 
                           choice.trim().length > 0;
                });
                
                if (validChoices.length === 0) {
                    console.error('[ModalFix] Blocked modal - no valid choices after filtering:', choices);
                    return;
                }
                
                // Ensure we're in the right state
                const currentScreen = window.gameUI?.screenManager?.getCurrentScreen?.();
                if (currentScreen !== 'game') {
                    console.warn('[ModalFix] Blocked modal - not in game screen:', currentScreen);
                    return;
                }
                
                // Ensure game is not initializing
                if (window.gameEngine.isInitializing) {
                    console.warn('[ModalFix] Blocked modal - game is initializing');
                    return;
                }
                
                // Call original with validated choices
                return originalShow(title, validChoices, callback);
            };
        }
        
        // 2. Fix the close button functionality
        function fixCloseButton() {
            const modal = document.getElementById('choice-modal');
            if (!modal) return;
            
            const closeBtn = modal.querySelector('.modal-close');
            if (!closeBtn) return;
            
            // Remove all existing listeners
            const newCloseBtn = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
            
            // Add new listener with capture phase
            newCloseBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('[ModalFix] Close button clicked');
                
                // Hide the modal
                modal.style.display = 'none';
                
                // Clear modal content
                const choiceList = document.getElementById('choice-list');
                if (choiceList) {
                    choiceList.innerHTML = '';
                }
                
                // Reset modal manager state
                if (window.uiManager?.modalManager) {
                    window.uiManager.modalManager.isShowingModal = false;
                    window.uiManager.modalManager.untrackModal(modal);
                }
            }, true);
            
            // Also add mousedown handler as backup
            newCloseBtn.addEventListener('mousedown', function(e) {
                e.preventDefault();
                e.stopPropagation();
            }, true);
            
            // Ensure button is styled correctly
            newCloseBtn.style.position = 'absolute';
            newCloseBtn.style.top = '1rem';
            newCloseBtn.style.right = '1rem';
            newCloseBtn.style.left = 'auto';
            newCloseBtn.style.cursor = 'pointer';
            newCloseBtn.style.pointerEvents = 'auto';
            newCloseBtn.style.zIndex = '10';
            
            console.log('[ModalFix] Close button fixed');
        }
        
        // 3. Monitor for empty modals and auto-close them
        function monitorModal() {
            const modal = document.getElementById('choice-modal');
            if (!modal) return;
            
            // Create observer to watch for display changes
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        if (modal.style.display !== 'none') {
                            // Modal is being shown, check if it has content
                            setTimeout(() => {
                                const choiceList = document.getElementById('choice-list');
                                if (choiceList && choiceList.children.length === 0) {
                                    console.warn('[ModalFix] Empty modal detected, auto-closing');
                                    modal.style.display = 'none';
                                    
                                    if (window.uiManager?.modalManager) {
                                        window.uiManager.modalManager.isShowingModal = false;
                                    }
                                }
                            }, 100);
                        }
                    }
                });
            });
            
            observer.observe(modal, { attributes: true });
            console.log('[ModalFix] Modal monitor installed');
        }
        
        // 4. Fix socket handler to prevent invalid events
        if (window.gameEngine?.socketHandler) {
            const socketHandler = window.gameEngine.socketHandler;
            const originalHandleEvent = socketHandler.handleGameEvent.bind(socketHandler);
            
            socketHandler.handleGameEvent = function(event) {
                console.log('[ModalFix] Filtering game event:', event);
                
                // If event has choices, validate them
                if (event.choices !== undefined) {
                    if (!Array.isArray(event.choices)) {
                        console.warn('[ModalFix] Removing invalid choices from event');
                        delete event.choices;
                    } else if (event.choices.length === 0) {
                        console.warn('[ModalFix] Removing empty choices from event');
                        delete event.choices;
                    } else {
                        // Validate each choice
                        const validChoices = event.choices.filter(c => 
                            c != null && typeof c === 'string' && c.trim().length > 0
                        );
                        
                        if (validChoices.length === 0) {
                            console.warn('[ModalFix] All choices invalid, removing from event');
                            delete event.choices;
                        } else if (validChoices.length !== event.choices.length) {
                            console.warn('[ModalFix] Some choices invalid, filtering');
                            event.choices = validChoices;
                        }
                    }
                }
                
                return originalHandleEvent(event);
            };
        }
        
        // Apply all fixes
        fixCloseButton();
        monitorModal();
        
        // 5. Add emergency close function to window
        window.emergencyCloseModal = function() {
            const modal = document.getElementById('choice-modal');
            if (modal) {
                modal.style.display = 'none';
                const choiceList = document.getElementById('choice-list');
                if (choiceList) {
                    choiceList.innerHTML = '';
                }
            }
            
            if (window.uiManager?.modalManager) {
                window.uiManager.modalManager.closeAllModals();
                window.uiManager.modalManager.isShowingModal = false;
                window.uiManager.modalManager.modalQueue = [];
                window.uiManager.modalManager.activeModals = [];
            }
            
            console.log('[ModalFix] Emergency close executed');
        };
        
        console.log('[ModalFix] All fixes applied successfully');
        console.log('[ModalFix] If modal gets stuck, use: window.emergencyCloseModal()');
    }
    
    // Initialize fixes when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            waitForDependencies(applyModalFixes);
        });
    } else {
        waitForDependencies(applyModalFixes);
    }
    
    // Also hook into UI ready event
    document.addEventListener('uiReady', () => {
        setTimeout(applyModalFixes, 500);
    });
    
})();
