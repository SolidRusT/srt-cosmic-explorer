/**
 * Modal System Test Suite
 * 
 * Run these tests to verify the modal system is working correctly
 * after the June 2025 fixes.
 */

const modalTests = {
    /**
     * Test 1: Basic modal functionality
     */
    testBasicModal: function() {
        console.log('🧪 Test 1: Basic Modal Functionality');
        
        if (!window.uiManager) {
            console.error('❌ UI Manager not available');
            return false;
        }
        
        // Show a test modal
        window.uiManager.showChoiceModal(
            'Test Modal',
            ['Option A', 'Option B', 'Option C'],
            (choice) => {
                console.log('✅ Choice selected:', choice);
            }
        );
        
        // Check if modal is visible
        setTimeout(() => {
            const modal = document.getElementById('choice-modal');
            if (modal && modal.style.display !== 'none') {
                console.log('✅ Modal is visible');
                
                // Check close button
                const closeBtn = modal.querySelector('.modal-close');
                if (closeBtn) {
                    const position = window.getComputedStyle(closeBtn);
                    console.log('✅ Close button found');
                    console.log('  Position:', {
                        top: position.top,
                        right: position.right,
                        left: position.left
                    });
                    
                    // Test click
                    closeBtn.click();
                    setTimeout(() => {
                        if (modal.style.display === 'none') {
                            console.log('✅ Close button works');
                        } else {
                            console.error('❌ Close button did not close modal');
                        }
                    }, 100);
                } else {
                    console.error('❌ Close button not found');
                }
            } else {
                console.error('❌ Modal not visible');
            }
        }, 100);
    },
    
    /**
     * Test 2: Empty modal prevention
     */
    testEmptyModalPrevention: function() {
        console.log('\n🧪 Test 2: Empty Modal Prevention');
        
        // Try to show modal with empty choices
        window.uiManager.showChoiceModal('Empty Test', [], () => {});
        
        setTimeout(() => {
            const modal = document.getElementById('choice-modal');
            if (modal && modal.style.display === 'none') {
                console.log('✅ Empty modal was prevented');
            } else {
                console.error('❌ Empty modal was shown');
            }
        }, 100);
    },
    
    /**
     * Test 3: Multiple close methods
     */
    testCloseMethod: function() {
        console.log('\n🧪 Test 3: Multiple Close Methods');
        
        window.uiManager.showChoiceModal(
            'Close Method Test',
            ['Test Option'],
            () => {}
        );
        
        setTimeout(() => {
            // Test ESC key
            const escEvent = new KeyboardEvent('keydown', { key: 'Escape' });
            document.dispatchEvent(escEvent);
            
            setTimeout(() => {
                const modal = document.getElementById('choice-modal');
                if (modal.style.display === 'none') {
                    console.log('✅ ESC key closes modal');
                } else {
                    console.log('⚠️ ESC key did not work, trying backdrop click...');
                    
                    // Test backdrop click
                    const backdrop = modal.querySelector('.modal-backdrop');
                    if (backdrop) {
                        backdrop.click();
                        setTimeout(() => {
                            if (modal.style.display === 'none') {
                                console.log('✅ Backdrop click closes modal');
                            } else {
                                console.error('❌ Backdrop click did not work');
                            }
                        }, 100);
                    }
                }
            }, 100);
        }, 100);
    },
    
    /**
     * Run all tests
     */
    runAll: function() {
        console.log('🚀 Running Modal System Tests...\n');
        
        this.testBasicModal();
        
        setTimeout(() => {
            this.testEmptyModalPrevention();
        }, 2000);
        
        setTimeout(() => {
            this.testCloseMethod();
        }, 3000);
        
        setTimeout(() => {
            console.log('\n✅ All tests completed!');
            console.log('Check the console output above for results.');
        }, 4000);
    }
};

// Export for use
window.modalTests = modalTests;

console.log(`
🧪 Modal Test Suite Loaded!

Run tests with: modalTests.runAll()

Individual tests:
- modalTests.testBasicModal()
- modalTests.testEmptyModalPrevention()
- modalTests.testCloseMethod()
`);
