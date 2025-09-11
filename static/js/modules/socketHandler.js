// Socket Handler Module for Cosmic Explorer
// Manages all WebSocket communication with the server

class SocketHandler {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.socket = null;
        this.isConnected = false;
    }
    
    init() {
        console.log('Initializing socket connection...');
        this.socket = io();
        this.setupHandlers();
        return this.socket;
    }
    
    setupHandlers() {
        this.socket.on('connect', () => {
            console.log('Connected to server');
            this.isConnected = true;
            this.joinSession(this.gameEngine.sessionId);
        });
        
        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
            this.isConnected = false;
        });
        
        this.socket.on('game_state', (state) => {
            this.handleGameState(state);
        });
        
        this.socket.on('game_event', (event) => {
            this.handleGameEvent(event);
        });
        
        this.socket.on('joined_session', (data) => {
            console.log('Joined session:', data.session_id);
        });
    }
    
    joinSession(sessionId) {
        if (this.socket && this.isConnected) {
            this.socket.emit('join_session', { session_id: sessionId });
        }
    }
    
    handleGameState(state) {
        this.gameEngine.gameState = state;
        this.gameEngine.uiManager.updateHUD(state);
        
        // Dispatch custom event for other components
        document.dispatchEvent(new CustomEvent('gameStateUpdated', {
            detail: state
        }));
        
        // Update music based on game state
        if (this.gameEngine.audioManager) {
            this.gameEngine.audioManager.updateMusicForGameState(state);
        }
        
        // Check for game over or victory
        if (state.game_over) {
            if (state.victory) {
                this.gameEngine.uiManager.showVictory('Victory! You have amassed great wealth!');
            } else {
                this.gameEngine.uiManager.showGameOver('Your journey has ended.');
            }
        }
    }
    
    handleGameEvent(event) {
        console.log('[SocketHandler] Received game event:', event);
        
        // Add to event log
        this.gameEngine.uiManager.addEventMessage(event.message, event.type);
        
        // Pass combat state if available
        if (event.combat_state) {
            event.combat_state = event.combat_state;
        } else if (event.result && event.result.combat_state) {
            event.combat_state = event.result.combat_state;
        }
        
        // Delegate to effects manager for visual/audio effects
        this.gameEngine.effectsManager.handleEventEffects(event);
        
        // Handle combat events specially
        if (event.type === 'combat_start' || event.type === 'combat' || event.type === 'combat_end') {
            this.handleCombatEvent(event);
        }
        
        // Show choices if available (except for combat which uses its own UI)
        // Ensure choices exist, are an array, and have at least one element
        if (event.choices && Array.isArray(event.choices) && event.choices.length > 0 && 
            event.type !== 'combat_start' && event.type !== 'combat') {
            console.log('[SocketHandler] Event has choices:', event.choices);
            
            // Validate that choices are strings and not empty
            const validChoices = event.choices.filter(choice => 
                typeof choice === 'string' && choice.trim().length > 0
            );
            
            console.log('[SocketHandler] Valid choices after filtering:', validChoices);
            
            if (validChoices.length > 0) {
                // Only show modal if we have a valid message/title AND we're in the game screen
                const modalTitle = event.message || event.title || 'Make a Choice';
                const currentScreen = this.gameEngine.uiManager?.screenManager?.getCurrentScreen?.();
                
                console.log('[SocketHandler] Current screen:', currentScreen);
                console.log('[SocketHandler] Is initializing:', this.gameEngine.isInitializing);
                console.log('[SocketHandler] Is loading game:', this.gameEngine.isLoadingGame);
                console.log('[SocketHandler] Has game state:', !!this.gameEngine.gameState);
                
                // Don't show modals during loading or on main menu
                if (currentScreen !== 'game') {
                    console.warn('[SocketHandler] Ignoring choice modal - not in game screen:', currentScreen);
                    return;
                }
                
                // Additional check - don't show modals during game initialization
                if (this.gameEngine.isInitializing || this.gameEngine.isLoadingGame) {
                    console.warn('[SocketHandler] Ignoring choice modal - game is initializing');
                    return;
                }
                
                // Check if this is a stale event (e.g., from previous game session)
                if (!this.gameEngine.gameState || !this.gameEngine.gameState.session_id) {
                    console.warn('[SocketHandler] Ignoring choice modal - no active game session');
                    return;
                }
                
                if (modalTitle && modalTitle.trim().length > 0) {
                    console.log('[SocketHandler] Showing choice modal with title:', modalTitle);
                    // Add a small delay to ensure game screen is fully loaded
                    setTimeout(() => {
                        this.gameEngine.uiManager.showChoiceModal(
                            modalTitle, 
                            validChoices, 
                            (choice) => {
                                this.gameEngine.sendAction('choice', { choice });
                            }
                        );
                    }, 100);
                } else {
                    console.warn('[SocketHandler] Event had no valid title/message for choices:', event);
                }
            } else {
                console.warn('[SocketHandler] Event had invalid choices:', event.choices);
            }
        }
    }
    
    handleCombatEvent(event) {
        const combatUI = this.gameEngine.combatUI;
        if (!combatUI) return;
        
        switch (event.type) {
            case 'combat_start':
                const combatState = event.combat_state || (event.result && event.result.combat_state);
                if (combatState) {
                    combatUI.showCombat(combatState, event.choices || ['Attack', 'Flee', 'Negotiate']);
                }
                break;
                
            case 'combat':
                const ongoingCombatState = event.combat_state || (event.result && event.result.combat_state);
                if (ongoingCombatState) {
                    combatUI.updateCombatDisplay(ongoingCombatState);
                    combatUI.updateCombatActions(event.choices || ['Attack', 'Flee', 'Negotiate']);
                    
                    // Update enemy health on renderer
                    if (this.gameEngine.renderer) {
                        this.gameEngine.renderer.updateEnemyHealth(
                            ongoingCombatState.enemy_hp,
                            ongoingCombatState.enemy_max_hp
                        );
                    }
                    
                    // Add log entries for combat messages
                    if (event.message) {
                        const messages = event.message.split('\n').filter(m => m.trim());
                        messages.forEach(msg => {
                            const type = msg.includes('damage') || msg.includes('Hit') ? 'damage' : 
                                       msg.includes('Missed') || msg.includes('evade') ? 'normal' : 'success';
                            combatUI.addLogEntry(msg, type);
                        });
                    }
                }
                break;
                
            case 'combat_end':
                if (event.rewards) {
                    combatUI.showCombatRewards(event.rewards);
                } else {
                    combatUI.hideCombat();
                }
                break;
        }
    }
    
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }
}

// Export for use in other modules
export default SocketHandler;
