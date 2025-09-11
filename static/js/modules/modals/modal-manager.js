/**
 * ModalManager - Base class for modal management with z-index handling
 */
export class ModalManager {
    constructor() {
        // Modal z-index management
        this.modalZIndexBase = 1000;
        this.currentModalZIndex = this.modalZIndexBase;
        this.activeModals = [];
        
        // Modal queue to prevent overlapping modals
        this.modalQueue = [];
        this.isShowingModal = false;
    }
    
    /**
     * Track a modal as active and set its z-index
     * @param {HTMLElement} modal - The modal element to track
     */
    trackModal(modal) {
        // Ensure this modal appears on top of all other modals
        this.currentModalZIndex += 10;
        modal.style.zIndex = this.currentModalZIndex;
        
        // Track this modal
        if (!this.activeModals.includes(modal)) {
            this.activeModals.push(modal);
        }
        
        // Show modal with proper display
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.animation = 'fade-in 0.3s ease-out';
    }
    
    /**
     * Remove a modal from tracking
     * @param {HTMLElement} modal - The modal element to untrack
     */
    untrackModal(modal) {
        // Remove from active modals
        const index = this.activeModals.indexOf(modal);
        if (index > -1) {
            this.activeModals.splice(index, 1);
        }
        
        // Reset z-index if no other modals are active
        if (this.activeModals.length === 0) {
            this.currentModalZIndex = this.modalZIndexBase;
        }
    }
    
    /**
     * Hide a modal with animation
     * @param {HTMLElement} modal - The modal element to hide
     * @param {boolean} removeFromDOM - Whether to remove the modal from DOM after hiding
     */
    hideModal(modal, removeFromDOM = false) {
        if (!modal) return;
        
        this.untrackModal(modal);
        
        modal.style.animation = 'fade-out 0.3s ease-out';
        setTimeout(() => {
            modal.style.display = 'none';
            if (removeFromDOM) {
                modal.remove();
            }
        }, 300);
    }
    
    /**
     * Close all open modals
     */
    closeAllModals() {
        // List of all modal IDs in the game
        const modalIds = [
            'choice-modal',
            'save-load-modal',
            'pod-mods-modal',
            'food-modal',
            'ship-modal',
            'star-map-modal'
        ];
        
        modalIds.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                // Remove any animations first
                modal.style.animation = 'none';
                modal.style.display = 'none';
                
                // Clear any modal content to prevent stale data
                if (modalId === 'choice-modal') {
                    const choiceList = document.getElementById('choice-list');
                    if (choiceList) {
                        choiceList.innerHTML = '';
                    }
                }
                
                // For dynamically created modals, remove them from DOM
                if (modalId === 'save-load-modal' || 
                    modalId === 'pod-mods-modal' || 
                    modalId === 'food-modal' || 
                    modalId === 'ship-modal' || 
                    modalId === 'star-map-modal') {
                    modal.remove();
                }
            }
        });
        
        // Clear active modals array
        this.activeModals = [];
        this.currentModalZIndex = this.modalZIndexBase;
        
        // Also remove any stray notifications
        document.querySelectorAll('.notification').forEach(notif => notif.remove());
    }
    
    /**
     * Show the choice modal
     * @param {string} title - The title of the choice modal
     * @param {Array<string>} choices - The choices to display
     * @param {Function} callback - The callback function when a choice is made
     */
    showChoiceModal(title, choices, callback) {
        console.log('[ModalManager] showChoiceModal called with:', { title, choices });
        
        // Enhanced validation - reject if we're in wrong state
        const currentScreen = window.gameUI?.screenManager?.getCurrentScreen?.();
        console.log('[ModalManager] Current screen:', currentScreen);
        
        if (!currentScreen || currentScreen === 'loading' || currentScreen === 'mainMenu') {
            console.warn('[ModalManager] Blocked modal - invalid screen state:', currentScreen);
            return;
        }
        
        // Extra validation - don't show if choices are undefined, null, or not an array
        if (!choices || !Array.isArray(choices)) {
            console.error('[ModalManager] Blocked modal - choices is not an array:', choices);
            return;
        }
        
        // Queue the modal if another modal is being shown
        if (this.isShowingModal) {
            console.log('[ModalManager] Queuing choice modal:', title);
            this.modalQueue.push(() => this.showChoiceModal(title, choices, callback));
            return;
        }
        
        this.isShowingModal = true;
        
        // Ensure any previous modals are properly closed
        this.cleanupAllModals();
        
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            const modal = document.getElementById('choice-modal');
            const titleEl = document.getElementById('choice-title');
            const choiceList = document.getElementById('choice-list');
            const modalFooter = modal?.querySelector('.modal-footer');
            const closeBtn = modal?.querySelector('.modal-close');
            
            if (!modal || !titleEl || !choiceList) {
                console.error('[ModalManager] Choice modal elements not found');
                this.isShowingModal = false;
                this.processModalQueue();
                return;
            }
            
            // Clear any existing content first
            choiceList.innerHTML = '';
            
            // Validate choices array
            if (!Array.isArray(choices) || choices.length === 0) {
                console.error('[ModalManager] Invalid choices array:', choices);
                // Don't show the modal if there are no valid choices
                this.isShowingModal = false;
                this.processModalQueue();
                return;
            }
            
            // Filter out any empty or invalid choices
            const validChoices = choices.filter(choice => 
                typeof choice === 'string' && choice.trim().length > 0
            );
            
            if (validChoices.length === 0) {
                console.error('[ModalManager] No valid choices after filtering:', choices);
                this.isShowingModal = false;
                this.processModalQueue();
                return;
            }
            
            console.log('[ModalManager] Showing modal with valid choices:', validChoices);
            
            // Set title
            titleEl.textContent = title || 'Make a Choice';
            
            // Hide footer for normal choices
            if (modalFooter) modalFooter.style.display = 'none';
            
            // Ensure close button is visible and properly positioned
            if (closeBtn) {
                closeBtn.style.display = 'flex';
                closeBtn.style.position = 'absolute';
                closeBtn.style.top = '1rem';
                closeBtn.style.right = '1rem';
                closeBtn.style.left = 'auto';
                closeBtn.style.zIndex = '10';
            }
            
            // Add choices
            validChoices.forEach((choice, index) => {
                const btn = document.createElement('button');
                btn.className = 'choice-btn';
                btn.textContent = `${index + 1}. ${choice}`;
                btn.onclick = () => {
                    this.hideChoiceModal();
                    if (callback) callback(index + 1);
                };
                choiceList.appendChild(btn);
            });
            
            // Set up close handlers
            this.setupChoiceModalHandlers(modal, callback);
            
            this.trackModal(modal);
        }, 50); // 50ms delay to ensure DOM is ready
    }
    
    /**
     * Set up event handlers for the choice modal
     * @param {HTMLElement} modal - The modal element
     * @param {Function} callback - The callback function
     */
    setupChoiceModalHandlers(modal, callback) {
        // Remove any existing handlers
        this.cleanupChoiceModalHandlers();
        
        // Close button handler - use event delegation to ensure it works
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            this._choiceCloseHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('[ModalManager] Close button clicked');
                this.hideChoiceModal();
            };
            // Use both click and mousedown to ensure it fires
            closeBtn.addEventListener('click', this._choiceCloseHandler, true);
            closeBtn.addEventListener('mousedown', this._choiceCloseHandler, true);
            
            // Make sure button is interactive
            closeBtn.style.pointerEvents = 'auto';
            closeBtn.style.cursor = 'pointer';
        } else {
            console.error('[ModalManager] Close button not found!');
        }
        
        // Backdrop click handler
        const backdrop = modal.querySelector('.modal-backdrop');
        if (backdrop) {
            this._choiceBackdropHandler = (e) => {
                if (e.target === backdrop) {
                    console.log('[ModalManager] Backdrop clicked');
                    this.hideChoiceModal();
                }
            };
            backdrop.addEventListener('click', this._choiceBackdropHandler);
        }
        
        // ESC key handler
        this._choiceEscHandler = (e) => {
            if (e.key === 'Escape' && this.activeModals.includes(modal)) {
                e.preventDefault();
                console.log('[ModalManager] ESC key pressed');
                this.hideChoiceModal();
            }
        };
        document.addEventListener('keydown', this._choiceEscHandler);
    }
    
    /**
     * Clean up choice modal event handlers
     */
    cleanupChoiceModalHandlers() {
        const modal = document.getElementById('choice-modal');
        if (!modal) return;
        
        const closeBtn = modal.querySelector('.modal-close');
        const backdrop = modal.querySelector('.modal-backdrop');
        
        if (closeBtn && this._choiceCloseHandler) {
            closeBtn.removeEventListener('click', this._choiceCloseHandler, true);
            closeBtn.removeEventListener('mousedown', this._choiceCloseHandler, true);
        }
        
        if (backdrop && this._choiceBackdropHandler) {
            backdrop.removeEventListener('click', this._choiceBackdropHandler);
        }
        
        if (this._choiceEscHandler) {
            document.removeEventListener('keydown', this._choiceEscHandler);
        }
        
        this._choiceCloseHandler = null;
        this._choiceBackdropHandler = null;
        this._choiceEscHandler = null;
    }
    
    /**
     * Hide the choice modal
     */
    hideChoiceModal() {
        const modal = document.getElementById('choice-modal');
        this.cleanupChoiceModalHandlers();
        this.hideModal(modal, false);
        this.isShowingModal = false;
        
        // Process any queued modals
        setTimeout(() => {
            this.processModalQueue();
        }, 100);
    }
    
    /**
     * Process any modals waiting in the queue
     */
    processModalQueue() {
        if (this.modalQueue.length > 0 && !this.isShowingModal) {
            const nextModal = this.modalQueue.shift();
            if (nextModal) {
                console.log('[ModalManager] Processing queued modal');
                nextModal();
            }
        }
    }
    
    /**
     * Clean up all modals and their content
     */
    cleanupAllModals() {
        // Clean up choice modal
        const choiceModal = document.getElementById('choice-modal');
        if (choiceModal) {
            const choiceList = document.getElementById('choice-list');
            if (choiceList) {
                choiceList.innerHTML = '';
            }
            choiceModal.style.display = 'none';
            choiceModal.style.animation = 'none';
        }
        
        // Clean up any other dynamic modals
        ['save-load-modal', 'pod-mods-modal', 'food-modal', 'ship-modal', 'star-map-modal'].forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'none';
                modal.style.animation = 'none';
            }
        });
    }
}
