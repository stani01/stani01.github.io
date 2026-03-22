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
    fieldOptions: []
};

function showModal(title, placeholder, currentValue, action, charId, tabId) {
    document.getElementById('tracker-modal-title').textContent = title;
    var input = document.getElementById('tracker-modal-input');
    input.placeholder = placeholder;
    input.value = currentValue || '';
    input.focus();
    
    modalState.action = action;
    modalState.charId = charId;
    modalState.tabId = tabId;
    modalState.currentValue = currentValue;
    
    document.getElementById('tracker-modal-overlay').classList.add('active');
    document.getElementById('tracker-modal').classList.add('active');
    
    // Allow Enter key to confirm
    input.onkeypress = function(e) {
        if (e.key === 'Enter') TK.confirmModal();
    };
}

window.TK = {
    // Show/hide modal
    closeModal: function() {
        document.getElementById('tracker-modal-overlay').classList.remove('active');
        document.getElementById('tracker-modal').classList.remove('active');
        modalState = { action: null, charId: null, tabId: null, currentValue: '' };
    },

    confirmModal: function() {
        var input = document.getElementById('tracker-modal-input');
        var value = input.value.trim();
        
        if (!value) {
            alert('Please enter a value');
            return;
        }
        
        switch (modalState.action) {
            case 'add-character':
                var charId = addCharacter(value);
                if (charId) {
                    switchCharacter(charId);
                    renderDucatTab(
                        document.getElementById('tracker-content'),
                        trackerState.ducat
                    );
                } else {
                    alert('Maximum 10 characters allowed');
                }
                break;
            
            case 'rename-character':
                if (value !== modalState.currentValue) {
                    renameCharacter(modalState.charId, value);
                    renderDucatTab(
                        document.getElementById('tracker-content'),
                        trackerState.ducat
                    );
                }
                break;
            
            case 'add-field-type':
                if (['text', 'number', 'dropdown'].indexOf(value.toLowerCase()) !== -1) {
                    modalState.fieldType = value.toLowerCase();
                    showModal('Field Label', 'e.g., Character Level', '', 'add-field-label', null, modalState.tabId);
                } else {
                    alert('Invalid field type. Use: text, number, or dropdown');
                }
                break;
            
            case 'add-field-label':
                modalState.fieldLabel = value;
                if (modalState.fieldType === 'number') {
                    showModal('Max Value (for number field)', 'e.g., 100', '100', 'add-field-max', null, modalState.tabId);
                } else if (modalState.fieldType === 'dropdown') {
                    showModal('Dropdown Options (comma-separated)', 'e.g., Option1, Option2, Option3', '', 'add-field-options', null, modalState.tabId);
                } else {
                    // Text field - done
                    addFieldToTab(modalState.tabId, modalState.fieldType, modalState.fieldLabel);
                    renderActiveTabContent();
                }
                break;
            
            case 'add-field-max':
                var max = parseInt(value);
                if (isNaN(max) || max < 1) {
                    alert('Please enter a valid number greater than 0');
                    return;
                }
                addFieldToTab(modalState.tabId, modalState.fieldType, modalState.fieldLabel, max, null);
                renderActiveTabContent();
                break;
            
            case 'add-field-options':
                var options = value.split(',').map(function(opt) { return opt.trim(); }).filter(function(opt) { return opt.length > 0; });
                if (options.length === 0) {
                    alert('Please enter at least one option');
                    return;
                }
                addFieldToTab(modalState.tabId, modalState.fieldType, modalState.fieldLabel, null, options);
                renderActiveTabContent();
                break;
            
            case 'configure-dropdown-options':
                var parts = modalState.tabId.split('|');
                var tId = parts[0];
                var fIndex = parseInt(parts[1]);
                var opts = value.split(',').map(function(opt) { return opt.trim(); }).filter(function(opt) { return opt.length > 0; });
                if (opts.length === 0) {
                    alert('Please enter at least one option');
                    return;
                }
                updateFieldProperties(tId, fIndex, { options: opts });
                renderActiveTabContent();
                break;
        }
        
        TK.closeModal();
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
        if (confirm('Reset all instance runs for this character to 0?')) {
            resetDucatRuns();
            renderDucatTab(
                document.getElementById('tracker-content'),
                trackerState.ducat
            );
        }
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
            'add-character'
        );
    },

    // Remove a character
    removeCharacter: function(charId) {
        var char = trackerState.ducat.characters[charId];
        if (!char) return;
        if (confirm('Remove character "' + char.name + '"?')) {
            removeCharacter(charId);
            renderDucatTab(
                document.getElementById('tracker-content'),
                trackerState.ducat
            );
        }
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
            charId
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
        if (confirm('Remove this field?')) {
            removeField(tabId, fieldIndex);
            renderActiveTabContent();
        }
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
            'add-field-type'
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
            tabId + '|' + fieldIndex
        );
    }
};
