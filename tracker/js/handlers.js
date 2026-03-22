'use strict';

// Modal state
var modalState = {
    action: null,
    charId: null,
    tabId: null,
    currentValue: '',
    fieldType: null,
    fieldLabel: null,
    fieldMaxValue: null,
    fieldOptions: [],
    modalType: 'input' // 'input', 'confirm', 'alert'
};

function showModal(title, placeholder, currentValue, action, charId, tabId, modalType) {
    modalType = modalType || 'input';
    
    var modalEl = document.getElementById('tracker-modal');
    var footerEl = document.getElementById('tracker-modal-footer');
    var bodyEl = document.getElementById('tracker-modal-body');
    
    document.getElementById('tracker-modal-title').textContent = title;
    
    // Clear and set up body based on modal type
    bodyEl.innerHTML = '';
    
    if (modalType === 'alert') {
        // Alert modal - just text
        var msg = document.createElement('p');
        msg.style.margin = '0';
        msg.textContent = currentValue;
        bodyEl.appendChild(msg);
    } else {
        // Input modal
        var input = document.createElement('input');
        input.type = 'text';
        input.className = 'tracker-modal-input';
        input.id = 'tracker-modal-input';
        input.placeholder = placeholder || '';
        input.value = currentValue || '';
        bodyEl.appendChild(input);
        input.focus();
        
        // Allow Enter key to confirm
        input.onkeypress = function(e) {
            if (e.key === 'Enter') processModalConfirm();
        };
    }
    
    // Set up footer based on modal type
    footerEl.innerHTML = '';
    
    var cancelBtn = document.createElement('button');
    cancelBtn.className = 'tracker-modal-btn tracker-modal-btn-cancel';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.onclick = function() { TK.closeModal(); };
    footerEl.appendChild(cancelBtn);
    
    var confirmBtn = document.createElement('button');
    confirmBtn.className = 'tracker-modal-btn tracker-modal-btn-confirm';
    confirmBtn.textContent = modalType === 'alert' ? 'OK' : 'Confirm';
    confirmBtn.onclick = function() { processModalConfirm(); };
    footerEl.appendChild(confirmBtn);
    
    // Hide cancel button for alerts
    if (modalType === 'alert') {
        cancelBtn.style.display = 'none';
    }
    
    // Store state
    modalState.action = action;
    modalState.charId = charId;
    modalState.tabId = tabId;
    modalState.currentValue = currentValue;
    modalState.modalType = modalType;
    
    document.getElementById('tracker-modal-overlay').classList.add('active');
    modalEl.classList.add('active');
}

function processModalConfirm() {
    if (modalState.modalType === 'alert') {
        TK.closeModal();
        return;
    }
    
    var input = document.getElementById('tracker-modal-input');
    var value = input ? input.value.trim() : '';
    
    if (!value && modalState.action !== 'rename-character') {
        showModalError('Please enter a value');
        return;
    }
    
    // Process based on action
    processModalAction(value);
}

function processModalAction(value) {
    switch (modalState.action) {
        case 'add-character':
            var charId = addCharacter(value);
            if (charId) {
                switchCharacter(charId);
                renderDucatTab(
                    document.getElementById('tracker-content'),
                    trackerState.ducat
                );
                TK.closeModal();
            } else {
                showModalError('Maximum 10 characters allowed');
            }
            break;
        
        case 'rename-character':
            if (value && value !== modalState.currentValue) {
                renameCharacter(modalState.charId, value);
                renderDucatTab(
                    document.getElementById('tracker-content'),
                    trackerState.ducat
                );
                TK.closeModal();
            } else {
                TK.closeModal();
            }
            break;
        
        case 'add-field-type':
            if (['text', 'number', 'dropdown'].indexOf(value.toLowerCase()) !== -1) {
                modalState.fieldType = value.toLowerCase();
                showModal('Field Label', 'e.g., Character Level', '', 'add-field-label', null, modalState.tabId, 'input');
            } else {
                showModalError('Invalid field type. Use: text, number, or dropdown');
            }
            break;
        
        case 'add-field-label':
            modalState.fieldLabel = value;
            if (modalState.fieldType === 'number') {
                showModal('Max Value (for number field)', 'e.g., 100', '100', 'add-field-max', null, modalState.tabId, 'input');
            } else if (modalState.fieldType === 'dropdown') {
                showModal('Dropdown Options (comma-separated)', 'e.g., Option1, Option2, Option3', '', 'add-field-options', null, modalState.tabId, 'input');
            } else {
                // Text field - done
                addFieldToTab(modalState.tabId, modalState.fieldType, modalState.fieldLabel);
                renderActiveTabContent();
                TK.closeModal();
            }
            break;
        
        case 'add-field-max':
            var max = parseInt(value);
            if (isNaN(max) || max < 1) {
                showModalError('Please enter a valid number greater than 0');
            } else {
                addFieldToTab(modalState.tabId, modalState.fieldType, modalState.fieldLabel, max, null);
                renderActiveTabContent();
                TK.closeModal();
            }
            break;
        
        case 'add-field-options':
            var options = value.split(',').map(function(opt) { return opt.trim(); }).filter(function(opt) { return opt.length > 0; });
            if (options.length === 0) {
                showModalError('Please enter at least one option');
            } else {
                addFieldToTab(modalState.tabId, modalState.fieldType, modalState.fieldLabel, null, options);
                renderActiveTabContent();
                TK.closeModal();
            }
            break;
        
        case 'configure-dropdown-options':
            var parts = modalState.tabId.split('|');
            var tId = parts[0];
            var fIndex = parseInt(parts[1]);
            var opts = value.split(',').map(function(opt) { return opt.trim(); }).filter(function(opt) { return opt.length > 0; });
            if (opts.length === 0) {
                showModalError('Please enter at least one option');
            } else {
                updateFieldProperties(tId, fIndex, { options: opts });
                renderActiveTabContent();
                TK.closeModal();
            }
            break;
        
        case 'add-tab':
            if (value.trim()) {
                addCustomTab(value.trim());
                renderAll();
                TK.closeModal();
            } else {
                showModalError('Please enter a tab name');
            }
            break;
        
        case 'confirm-remove-tab':
            removeTab(modalState.tabId);
            renderAll();
            TK.closeModal();
            break;
        
        case 'confirm-remove-char':
            removeCharacter(modalState.charId);
            renderDucatTab(
                document.getElementById('tracker-content'),
                trackerState.ducat
            );
            TK.closeModal();
            break;
        
        case 'confirm-remove-field':
            removeField(modalState.tabId, parseInt(modalState.charId));
            renderActiveTabContent();
            TK.closeModal();
            break;
        
        case 'confirm-reset-ducat':
            resetDucatRuns();
            renderDucatTab(
                document.getElementById('tracker-content'),
                trackerState.ducat
            );
            TK.closeModal();
            break;
    }
}

function showModalError(message) {
    var input = document.getElementById('tracker-modal-input');
    if (input) {
        input.style.borderColor = '#ff4444';
        var errorMsg = document.querySelector('.tracker-modal-error') || document.createElement('div');
        errorMsg.className = 'tracker-modal-error';
        errorMsg.textContent = message;
        errorMsg.style.color = '#ff4444';
        errorMsg.style.marginTop = '10px';
        errorMsg.style.fontSize = '12px';
        if (!document.querySelector('.tracker-modal-error')) {
            input.parentNode.appendChild(errorMsg);
        }
        input.focus();
    }
}

window.TK = {
    // Show/hide modal
    closeModal: function() {
        document.getElementById('tracker-modal-overlay').classList.remove('active');
        document.getElementById('tracker-modal').classList.remove('active');
        var input = document.getElementById('tracker-modal-input');
        if (input) input.style.borderColor = '';
        var errorMsg = document.querySelector('.tracker-modal-error');
        if (errorMsg) errorMsg.remove();
        modalState = { 
            action: null, charId: null, tabId: null, currentValue: '', 
            fieldType: null, fieldLabel: null, fieldMaxValue: null, fieldOptions: [],
            modalType: 'input'
        };
    },

    // Increment runs for an instance
    incrementRuns: function(instanceId) {
        var instance = DUCAT_INSTANCES.find(function(i) { return i.id === instanceId; });
        if (!instance) return;
        var current = getDucatRuns(instanceId);
        var newValue = Math.min(current + 1, instance.maxRuns);
        setDucatRuns(instanceId, newValue);
        updateInputValue(instanceId, newValue);
    },

    // Decrement runs for an instance
    decrementRuns: function(instanceId) {
        var current = getDucatRuns(instanceId);
        var newValue = Math.max(current - 1, 0);
        setDucatRuns(instanceId, newValue);
        updateInputValue(instanceId, newValue);
    },

    // Set runs for an instance
    setRuns: function(instanceId, value) {
        setDucatRuns(instanceId, value);
        var instance = DUCAT_INSTANCES.find(function(i) { return i.id === instanceId; });
        if (instance) {
            var newValue = Math.max(0, Math.min(parseInt(value) || 0, instance.maxRuns));
            updateInputValue(instanceId, newValue);
        }
    },

    // Reset all ducat runs for current character
    resetDucatChar: function() {
        showModal(
            'Reset All Runs?',
            '',
            'This will reset all instance runs for this character to 0.',
            'confirm-reset-ducat',
            null,
            null,
            'confirm'
        );
    },

    // Switch to a character
    switchCharacter: function(charId) {
        switchCharacter(charId);
        renderDucatTab(
            document.getElementById('tracker-content'),
            trackerState.ducat
        );
    },

    // Add a new character
    openAddCharDialog: function() {
        showModal(
            'Add Character',
            'Character ' + (Object.keys(trackerState.ducat.characters).length + 1),
            '',
            'add-character',
            null,
            null,
            'input'
        );
    },

    // Remove a character
    removeCharacter: function(charId) {
        var char = trackerState.ducat.characters[charId];
        if (!char) return;
        modalState.charId = charId;
        showModal(
            'Remove Character?',
            '',
            'Remove character "' + char.name + '"? This cannot be undone.',
            'confirm-remove-char',
            charId,
            null,
            'confirm'
        );
    },

    // Rename a character (double-click handler)
    openRenameCharDialog: function(charId) {
        var char = trackerState.ducat.characters[charId];
        if (!char) return;
        
        showModal(
            'Rename Character',
            'New character name',
            char.name,
            'rename-character',
            charId,
            null,
            'input'
        );
    },

    // Update custom field value and save to localStorage
    updateField: function(inputElement) {
        var tabId = inputElement.getAttribute('data-tab-id');
        var fieldIndex = parseInt(inputElement.getAttribute('data-field-index'));
        var value = inputElement.value;
        
        updateCustomField(tabId, fieldIndex, value);
    },

    // Remove a field from custom tab
    removeField: function(tabId, fieldIndex) {
        modalState.tabId = tabId;
        modalState.charId = fieldIndex;
        showModal(
            'Remove Field?',
            '',
            'Remove this field? This cannot be undone.',
            'confirm-remove-field',
            fieldIndex,
            tabId,
            'confirm'
        );
    },

    // Open dialog to add a new field to custom tab
    openAddFieldDialog: function(tabId) {
        modalState.tabId = tabId;
        modalState.fieldType = null;
        modalState.fieldLabel = null;
        modalState.fieldMaxValue = null;
        modalState.fieldOptions = [];
        showModal(
            'Field Type',
            'text, number, or dropdown',
            '',
            'add-field-type',
            null,
            tabId,
            'input'
        );
    },

    // Open dropdown configuration dialog
    openConfigureDropdown: function(tabId, fieldIndex, fieldLabel) {
        var tab = trackerState[tabId];
        if (!tab || fieldIndex >= tab.fields.length) return;
        
        var field = tab.fields[fieldIndex];
        var options = (field.options || []).join(', ');
        
        showModal(
            'Configure: ' + fieldLabel,
            'comma-separated values',
            options,
            'configure-dropdown-options',
            null,
            tabId + '|' + fieldIndex,
            'input'
        );
    },

    // Add a new tab
    openAddTabDialog: function() {
        showModal(
            'Add New Tab',
            'Enter tab name',
            '',
            'add-tab',
            null,
            null,
            'input'
        );
    },

    // Remove a tab
    removeTab: function(tabId) {
        var tab = trackerState[tabId];
        if (!tab) return;
        modalState.tabId = tabId;
        showModal(
            'Remove Tab?',
            '',
            'Remove tab "' + tab.name + '"? This cannot be undone.',
            'confirm-remove-tab',
            null,
            tabId,
            'confirm'
        );
    }
};
