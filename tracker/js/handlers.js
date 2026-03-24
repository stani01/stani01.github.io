'use strict';

// Modal state
var modalState = {
    action: null,
    charId: null,
    tabId: null,
    currentValue: '',
    selectOptions: [],
    fieldType: null,
    fieldLabel: null,
    fieldMaxValue: null,
    fieldOptions: [],
    modalType: 'input' // 'input', 'confirm', 'alert'
};

// Drag and drop state
var dragState = {
    draggedElement: null,
    draggedOverElement: null,
    dragType: null // 'char' or 'field'
};

function showModal(title, placeholder, currentValue, action, charId, tabId, modalType, selectOptions) {
    modalType = modalType || 'input';
    selectOptions = selectOptions || [];
    
    var bodyEl = document.getElementById('tracker-modal-body');
    var footerEl = document.getElementById('tracker-modal-footer');
    var cancelBtn = document.querySelector('.tracker-modal-btn-cancel');
    var confirmBtn = document.querySelector('.tracker-modal-btn-confirm');
    
    document.getElementById('tracker-modal-title').textContent = title;
    
    // Clear body and set up based on modal type
    bodyEl.innerHTML = '';
    
    if (modalType === 'alert') {
        // Alert modal - just text
        var msg = document.createElement('p');
        msg.style.margin = '0';
        msg.textContent = currentValue;
        bodyEl.appendChild(msg);
        cancelBtn.style.display = 'none';
        confirmBtn.textContent = 'OK';
    } else if (modalType === 'select') {
        var selectEl = document.createElement('select');
        selectEl.className = 'tracker-modal-input';
        selectEl.id = 'tracker-modal-select';

        selectOptions.forEach(function(opt) {
            var optionEl = document.createElement('option');
            optionEl.value = opt.value;
            optionEl.textContent = opt.label;
            if (opt.value === currentValue) optionEl.selected = true;
            selectEl.appendChild(optionEl);
        });

        bodyEl.appendChild(selectEl);

        requestAnimationFrame(function() {
            selectEl.focus();
            selectEl.onkeypress = function(e) {
                if (e.key === 'Enter') processModalConfirm();
            };
        });

        cancelBtn.style.display = '';
        confirmBtn.textContent = 'Confirm';
    } else {
        // Input modal
        var input = document.createElement('input');
        input.type = 'text';
        input.className = 'tracker-modal-input';
        input.id = 'tracker-modal-input';
        input.placeholder = placeholder || '';
        input.value = currentValue || '';
        bodyEl.appendChild(input);
        
        // Allow Enter key to confirm (on next frame to avoid event listener issues)
        requestAnimationFrame(function() {
            input.focus();
            input.onkeypress = function(e) {
                if (e.key === 'Enter') processModalConfirm();
            };
        });
        
        cancelBtn.style.display = '';
        confirmBtn.textContent = 'Confirm';
    }
    
    // Store state
    modalState.action = action;
    modalState.charId = charId;
    modalState.tabId = tabId;
    modalState.currentValue = currentValue;
    modalState.selectOptions = selectOptions;
    modalState.modalType = modalType;
    
    // Show modal (will trigger CSS animation once)
    var overlay = document.getElementById('tracker-modal-overlay');
    var modal = document.getElementById('tracker-modal');
    
    // Prevent scroll on body when modal is open
    document.body.style.overflow = 'hidden';
    
    overlay.classList.add('active');
    modal.classList.add('active');
}

function processModalConfirm() {
    if (modalState.modalType === 'alert') {
        TK.closeModal();
        return;
    }

    var value = '';
    if (modalState.modalType === 'select') {
        var selectEl = document.getElementById('tracker-modal-select');
        value = selectEl ? selectEl.value : '';
    } else {
        var input = document.getElementById('tracker-modal-input');
        value = input ? input.value.trim() : '';
    }
    
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

        case 'set-character-class':
            if (setCharacterClass(modalState.charId, value)) {
                renderDucatTab(
                    document.getElementById('tracker-content'),
                    trackerState.ducat
                );
                TK.closeModal();
            } else {
                showModalError('Please choose a valid class');
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
        var overlay = document.getElementById('tracker-modal-overlay');
        var modal = document.getElementById('tracker-modal');
        var input = document.getElementById('tracker-modal-input');
        
        // Performance: remove classes immediately
        overlay.classList.remove('active');
        modal.classList.remove('active');
        
        // Restore scroll
        document.body.style.overflow = '';
        
        // Clean up
        if (input) input.style.borderColor = '';
        var errorMsg = document.querySelector('.tracker-modal-error');
        if (errorMsg) errorMsg.remove();
        
        // Reset state
        modalState = { 
            action: null, charId: null, tabId: null, currentValue: '', selectOptions: [],
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

    // Set total ducats for current character
    setTotalDucats: function(value) {
        setTotalDucats(value);
        var input = document.getElementById('tracker-total-ducats');
        if (input) input.value = getTotalDucats();
        refreshDucatOverview();
    },

    // Increment total ducats
    incrementTotalDucats: function() {
        var current = getTotalDucats();
        var newValue = Math.min(current + 1, 1000);
        setTotalDucats(newValue);
        var input = document.getElementById('tracker-total-ducats');
        if (input) input.value = newValue;
        refreshDucatOverview();
    },

    // Decrement total ducats
    decrementTotalDucats: function() {
        var current = getTotalDucats();
        var newValue = Math.max(current - 1, 0);
        setTotalDucats(newValue);
        var input = document.getElementById('tracker-total-ducats');
        if (input) input.value = newValue;
        refreshDucatOverview();
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

    // Pick class for a character
    openClassDialog: function(charId) {
        var char = trackerState.ducat.characters[charId];
        if (!char) return;

        var classOptions = getCharacterClassKeys().map(function(classKey) {
            var classData = (typeof CLASS_DATA !== 'undefined' && CLASS_DATA && CLASS_DATA[classKey])
                ? CLASS_DATA[classKey]
                : { name: classKey };
            return { value: classKey, label: classData.name };
        });

        showModal(
            'Choose Class for ' + char.name,
            '',
            getCharacterClass(charId),
            'set-character-class',
            charId,
            null,
            'select',
            classOptions
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
    },

    // === CHARACTER DRAG AND DROP ===
    dragStartChar: function(event) {
        dragState.draggedElement = event.target.closest('.tracker-char-tab');
        dragState.dragType = 'char';
        dragState.draggedElement.style.opacity = '0.5';
        event.dataTransfer.effectAllowed = 'move';
    },

    dragOverChar: function(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        var el = event.target.closest('.tracker-char-tab');
        if (el && el !== dragState.draggedElement) {
            dragState.draggedOverElement = el;
            el.style.borderLeft = '3px solid rgba(150, 200, 255, 0.8)';
        }
    },

    dropChar: function(event) {
        event.preventDefault();
        if (dragState.draggedElement && dragState.draggedOverElement && dragState.draggedElement !== dragState.draggedOverElement) {
            var fromIndex = parseInt(dragState.draggedElement.getAttribute('data-char-index'));
            var toIndex = parseInt(dragState.draggedOverElement.getAttribute('data-char-index'));
            reorderCharacters(fromIndex, toIndex);
            renderDucatTab(
                document.getElementById('tracker-content'),
                trackerState.ducat
            );
        }
    },

    dragEndChar: function(event) {
        dragState.draggedElement.style.opacity = '1';
        if (dragState.draggedOverElement) {
            dragState.draggedOverElement.style.borderLeft = '';
        }
        dragState.draggedElement = null;
        dragState.draggedOverElement = null;
    },

    // === FIELD DRAG AND DROP ===
    dragStartField: function(event) {
        dragState.draggedElement = event.target.closest('.tracker-custom-field');
        dragState.dragType = 'field';
        dragState.draggedElement.style.opacity = '0.5';
        event.dataTransfer.effectAllowed = 'move';
    },

    dragOverField: function(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        var el = event.target.closest('.tracker-custom-field');
        if (el && el !== dragState.draggedElement) {
            dragState.draggedOverElement = el;
            el.style.borderTop = '2px solid rgba(150, 200, 255, 0.8)';
        }
    },

    dropField: function(event) {
        event.preventDefault();
        if (dragState.draggedElement && dragState.draggedOverElement && dragState.draggedElement !== dragState.draggedOverElement) {
            var tabId = dragState.draggedElement.getAttribute('data-tab-id');
            var fromIndex = parseInt(dragState.draggedElement.getAttribute('data-field-index'));
            var toIndex = parseInt(dragState.draggedOverElement.getAttribute('data-field-index'));
            reorderFields(tabId, fromIndex, toIndex);
            renderActiveTabContent();
        }
    },

    dragEndField: function(event) {
        dragState.draggedElement.style.opacity = '1';
        if (dragState.draggedOverElement) {
            dragState.draggedOverElement.style.borderTop = '';
        }
        dragState.draggedElement = null;
        dragState.draggedOverElement = null;
    }
};
