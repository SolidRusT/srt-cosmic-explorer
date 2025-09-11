/**
 * Modal Diagnostic Tool
 * Helps diagnose issues with empty choice modals
 */

class ModalDiagnostic {
    constructor() {
        this.interceptedEvents = [];
        this.modalCalls = [];
        this.setupInterceptors();
    }
    
    setupInterceptors() {
        // Intercept socket events
        if (window.gameEngine && window.gameEngine.socketHandler && window.gameEngine.socketHandler.socket) {
            const originalOn = window.gameEngine.socketHandler.socket.on;
            const self = this;
            
            window.gameEngine.socketHandler.socket.on = function(event, handler) {
                if (event === 'game_event') {
                    const wrappedHandler = function(data) {
                        console.log('[ModalDiagnostic] Intercepted game_event:', data);
                        self.interceptedEvents.push({
                            timestamp: new Date().toISOString(),
                            event: 'game_event',
                            data: data
                        });
                        return handler.call(this, data);
                    };
                    return originalOn.call(this, event, wrappedHandler);
                }
                return originalOn.call(this, event, handler);
            };
        }
        
        // Intercept modal manager calls
        if (window.uiManager && window.uiManager.modalManager) {
            const originalShow = window.uiManager.modalManager.showChoiceModal;
            const self = this;
            
            window.uiManager.modalManager.showChoiceModal = function(title, choices, callback) {
                console.log('[ModalDiagnostic] showChoiceModal called:', {
                    title,
                    choices,
                    choicesType: typeof choices,
                    choicesIsArray: Array.isArray(choices),
                    choicesLength: choices ? choices.length : 'N/A',
                    stackTrace: new Error().stack
                });
                
                self.modalCalls.push({
                    timestamp: new Date().toISOString(),
                    title,
                    choices,
                    stack: new Error().stack
                });
                
                return originalShow.call(this, title, choices, callback);
            };
        }
        
        console.log('[ModalDiagnostic] Interceptors installed');
    }
    
    report() {
        console.group('Modal Diagnostic Report');
        
        console.log('Intercepted Events:', this.interceptedEvents);
        console.log('Modal Calls:', this.modalCalls);
        
        // Check for events with empty or invalid choices
        const problematicEvents = this.interceptedEvents.filter(e => {
            const data = e.data;
            return data && data.choices && (!Array.isArray(data.choices) || data.choices.length === 0 || 
                   data.choices.some(c => !c || typeof c !== 'string'));
        });
        
        if (problematicEvents.length > 0) {
            console.warn('Found problematic events:', problematicEvents);
        }
        
        // Check for modal calls with empty choices
        const problematicCalls = this.modalCalls.filter(c => {
            return !c.choices || !Array.isArray(c.choices) || c.choices.length === 0 ||
                   c.choices.some(choice => !choice || typeof choice !== 'string');
        });
        
        if (problematicCalls.length > 0) {
            console.warn('Found problematic modal calls:', problematicCalls);
        }
        
        console.groupEnd();
    }
    
    clear() {
        this.interceptedEvents = [];
        this.modalCalls = [];
        console.log('[ModalDiagnostic] Cleared diagnostic data');
    }
    
    checkModalState() {
        const modal = document.getElementById('choice-modal');
        const choiceList = document.getElementById('choice-list');
        const title = document.getElementById('choice-title');
        
        console.group('Modal State Check');
        console.log('Modal element exists:', !!modal);
        console.log('Modal display:', modal ? modal.style.display : 'N/A');
        console.log('Modal visible:', modal ? (modal.style.display !== 'none') : false);
        console.log('Choice list exists:', !!choiceList);
        console.log('Choice list HTML:', choiceList ? choiceList.innerHTML : 'N/A');
        console.log('Choice list children:', choiceList ? choiceList.children.length : 'N/A');
        console.log('Title element exists:', !!title);
        console.log('Title text:', title ? title.textContent : 'N/A');
        console.groupEnd();
    }
    
    forceCloseModal() {
        const modal = document.getElementById('choice-modal');
        if (modal) {
            modal.style.display = 'none';
            console.log('[ModalDiagnostic] Force closed modal');
        }
        
        // Clear modal manager state
        if (window.uiManager && window.uiManager.modalManager) {
            window.uiManager.modalManager.isShowingModal = false;
            window.uiManager.modalManager.modalQueue = [];
            window.uiManager.modalManager.activeModals = [];
            console.log('[ModalDiagnostic] Reset modal manager state');
        }
    }
}

// Auto-install on load
if (typeof window !== 'undefined') {
    window.modalDiagnostic = new ModalDiagnostic();
    console.log('[ModalDiagnostic] Diagnostic tool installed. Use window.modalDiagnostic to access.');
    console.log('Available methods:');
    console.log('  - modalDiagnostic.report() - Show diagnostic report');
    console.log('  - modalDiagnostic.checkModalState() - Check current modal state');
    console.log('  - modalDiagnostic.forceCloseModal() - Force close the modal');
    console.log('  - modalDiagnostic.clear() - Clear diagnostic data');
}

export default ModalDiagnostic;
