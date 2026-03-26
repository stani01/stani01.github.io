'use strict';

var STORAGE_KEY = 'tracker-state-v1';

// Global state
var trackerState = {};
var tabs = ['ducat']; // Ducat is default and always first
var activeTab = 'ducat';
var nextTabId = 1;

// Initialize default character data for ducat
function createDefaultCharacterData(charId, charName) {
    var data = { id: charId, name: charName, classKey: 'gladiator', runs: {}, totalDucats: 0 };
    DUCAT_INSTANCES.forEach(function(inst) {
        data.runs[inst.id] = 0;
    });
    return data;
}

// Initialize default ducat tab data with characters
function createDefaultDucatData() {
    var data = {
        id: 'ducat',
        name: 'Ducat',
        isDefault: true,
        characters: {},
        activeCharacterId: 'char-1',
        nextCharId: 2
    };
    // Create first default character
    data.characters['char-1'] = createDefaultCharacterData('char-1', 'Character 1');
    return data;
}

// Initialize custom tab data (empty)
function createCustomTab(id, name) {
    return { id: id, name: name, isDefault: false, fields: [] };
}

// Save state to localStorage
function saveTrackerState() {
    try {
        var data = {
            tabs: tabs,
            activeTab: activeTab,
            tabData: trackerState,
            nextTabId: nextTabId
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* quota exceeded or private mode */ }
}

// Load state from localStorage
function loadTrackerState() {
    try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return false;
        }
        var data = JSON.parse(raw);
        if (!data || !data.tabs || !Array.isArray(data.tabs)) {
            return false;
        }

        // Validate tabs array has at least ducat
        if (data.tabs.indexOf('ducat') === -1) {
            return false;
        }

        tabs = data.tabs;
        activeTab = data.activeTab && data.tabs.indexOf(data.activeTab) !== -1 ? data.activeTab : 'ducat';
        trackerState = data.tabData || {};
        nextTabId = data.nextTabId || 1;

        // Ensure ducat tab exists and is properly structured
        if (!trackerState.ducat) {
            trackerState.ducat = createDefaultDucatData();
        } else {
            // Validate and migrate ducat data structure
            var ducatData = trackerState.ducat;
            
            // Migrate old structure (runs at top level) to new character-based structure
            if (ducatData.runs && !ducatData.characters) {
                var oldRuns = ducatData.runs;
                ducatData.characters = {};
                ducatData.characters['char-1'] = createDefaultCharacterData('char-1', 'Character 1');
                ducatData.characters['char-1'].runs = oldRuns;
                ducatData.activeCharacterId = 'char-1';
                ducatData.nextCharId = 2;
                delete ducatData.runs;
            }
            
            // Ensure characters object exists
            if (!ducatData.characters || typeof ducatData.characters !== 'object') {
                ducatData.characters = {};
                ducatData.characters['char-1'] = createDefaultCharacterData('char-1', 'Character 1');
            }
            
            // Ensure all characters have proper instance data
            for (var charId in ducatData.characters) {
                if (ducatData.characters.hasOwnProperty(charId)) {
                    var char = ducatData.characters[charId];
                    if (!char.runs || typeof char.runs !== 'object') {
                        char.runs = {};
                    }
                    DUCAT_INSTANCES.forEach(function(inst) {
                        if (typeof char.runs[inst.id] !== 'number') {
                            char.runs[inst.id] = 0;
                        }
                    });
                    // Ensure totalDucats exists
                    if (typeof char.totalDucats !== 'number') {
                        char.totalDucats = 0;
                    }
                    // Ensure classKey exists and is valid
                    if (typeof char.classKey !== 'string' || !isValidCharacterClass(char.classKey)) {
                        char.classKey = 'gladiator';
                    }
                }
            }
            
            // Set active character if not set
            if (!ducatData.activeCharacterId) {
                ducatData.activeCharacterId = Object.keys(ducatData.characters)[0] || 'char-1';
            }
            
            // Ensure nextCharId is set
            if (!ducatData.nextCharId) {
                var maxId = 1;
                for (var id in ducatData.characters) {
                    var match = id.match(/char-(\d+)/);
                    if (match) {
                        var num = parseInt(match[1]);
                        if (num >= maxId) maxId = num + 1;
                    }
                }
                ducatData.nextCharId = maxId;
            }
        }

        return true;
    } catch (e) {
        return false;
    }
}

// Initialize tracker - load existing or create new
function initializeTracker() {
    if (!loadTrackerState()) {
        // Create fresh state
        trackerState.ducat = createDefaultDucatData();
        tabs = ['ducat'];
        activeTab = 'ducat';
        nextTabId = 1;
        saveTrackerState();
    }
}

// Add a new custom tab
function addCustomTab(name) {
    var tabId = 'tab-' + (nextTabId++);
    tabs.push(tabId);
    trackerState[tabId] = createCustomTab(tabId, name);
    activeTab = tabId;
    saveTrackerState();
    return tabId;
}

// Remove a custom tab
function removeTab(tabId) {
    if (tabId === 'ducat' || tabs.indexOf(tabId) === -1) return false;
    var idx = tabs.indexOf(tabId);
    if (idx !== -1) {
        tabs.splice(idx, 1);
        delete trackerState[tabId];
        if (activeTab === tabId) {
            activeTab = tabs[Math.max(0, idx - 1)];
        }
        saveTrackerState();
        return true;
    }
    return false;
}

// Remove a field from custom tab
function removeField(tabId, fieldIndex) {
    var tab = trackerState[tabId];
    if (!tab || tab.isDefault || fieldIndex >= tab.fields.length || fieldIndex < 0) return;
    tab.fields.splice(fieldIndex, 1);
    saveTrackerState();
}

// Update ducat runs for specific character
function setDucatRuns(instanceId, value, charId) {
    if (!trackerState.ducat || !trackerState.ducat.characters) return;
    var char = charId ? trackerState.ducat.characters[charId] : trackerState.ducat.characters[trackerState.ducat.activeCharacterId];
    if (!char || !char.runs) return;
    
    var instance = DUCAT_INSTANCES.find(function(i) { return i.id === instanceId; });
    if (!instance) return;

    // Clamp value between 0 and maxRuns
    value = Math.max(0, Math.min(parseInt(value) || 0, instance.maxRuns));
    char.runs[instanceId] = value;
    saveTrackerState();
}

// Get ducat runs for specific character
function getDucatRuns(instanceId, charId) {
    if (!trackerState.ducat || !trackerState.ducat.characters) return 0;
    var char = charId ? trackerState.ducat.characters[charId] : trackerState.ducat.characters[trackerState.ducat.activeCharacterId];
    if (!char || !char.runs) return 0;
    return char.runs[instanceId] || 0;
}

// Reset all ducat runs for specific character
function resetDucatRuns(charId) {
    if (!trackerState.ducat || !trackerState.ducat.characters) return;
    var char = charId ? trackerState.ducat.characters[charId] : trackerState.ducat.characters[trackerState.ducat.activeCharacterId];
    if (!char || !char.runs) return;
    DUCAT_INSTANCES.forEach(function(inst) {
        char.runs[inst.id] = 0;
    });
    saveTrackerState();
}

// Reset all ducat runs for ALL characters (maintenance reset)
function resetAllCharacterRuns() {
    if (!trackerState.ducat || !trackerState.ducat.characters) return;
    for (var charId in trackerState.ducat.characters) {
        if (trackerState.ducat.characters.hasOwnProperty(charId)) {
            DUCAT_INSTANCES.forEach(function(inst) {
                trackerState.ducat.characters[charId].runs[inst.id] = 0;
            });
        }
    }
    saveTrackerState();
}

// Set total ducats for specific character
function setTotalDucats(value, charId) {
    if (!trackerState.ducat || !trackerState.ducat.characters) return;
    var char = charId ? trackerState.ducat.characters[charId] : trackerState.ducat.characters[trackerState.ducat.activeCharacterId];
    if (!char) return;
    
    // Clamp value between 0 and 1000
    value = Math.max(0, Math.min(parseInt(value) || 0, 1000));
    char.totalDucats = value;
    saveTrackerState();
}

// Get total ducats for specific character
function getTotalDucats(charId) {
    if (!trackerState.ducat || !trackerState.ducat.characters) return 0;
    var char = charId ? trackerState.ducat.characters[charId] : trackerState.ducat.characters[trackerState.ducat.activeCharacterId];
    if (!char) return 0;
    return char.totalDucats || 0;
}

// Add a new character
function addCharacter(charName) {
    if (!trackerState.ducat || !trackerState.ducat.characters) return null;
    if (Object.keys(trackerState.ducat.characters).length >= 10) {
        return null; // Max 10 characters
    }
    var charId = 'char-' + (trackerState.ducat.nextCharId++);
    trackerState.ducat.characters[charId] = createDefaultCharacterData(charId, charName);
    saveTrackerState();
    return charId;
}

// Remove a character
function removeCharacter(charId) {
    if (!trackerState.ducat || !trackerState.ducat.characters) return false;
    if (Object.keys(trackerState.ducat.characters).length <= 1) return false; // Keep at least one
    if (!trackerState.ducat.characters[charId]) return false;
    
    delete trackerState.ducat.characters[charId];
    
    // Switch to another character if this was active
    if (trackerState.ducat.activeCharacterId === charId) {
        var firstCharId = Object.keys(trackerState.ducat.characters)[0];
        trackerState.ducat.activeCharacterId = firstCharId;
    }
    
    saveTrackerState();
    return true;
}

// Switch active character
function switchCharacter(charId) {
    if (!trackerState.ducat || !trackerState.ducat.characters) return false;
    if (!trackerState.ducat.characters[charId]) return false;
    
    trackerState.ducat.activeCharacterId = charId;
    saveTrackerState();
    return true;
}

// Rename a character
function renameCharacter(charId, newName) {
    if (!trackerState.ducat || !trackerState.ducat.characters) return false;
    if (!trackerState.ducat.characters[charId]) return false;
    
    trackerState.ducat.characters[charId].name = newName;
    saveTrackerState();
    return true;
}

function getCharacterClassKeys() {
    if (typeof CLASS_ORDER !== 'undefined' && Array.isArray(CLASS_ORDER) && CLASS_ORDER.length > 0) {
        return CLASS_ORDER.slice();
    }
    if (typeof CLASS_DATA !== 'undefined' && CLASS_DATA && typeof CLASS_DATA === 'object') {
        return Object.keys(CLASS_DATA);
    }
    return ['gladiator'];
}

function isValidCharacterClass(classKey) {
    return getCharacterClassKeys().indexOf(classKey) !== -1;
}

function getCharacterClass(charId) {
    if (!trackerState.ducat || !trackerState.ducat.characters) return 'gladiator';
    var char = trackerState.ducat.characters[charId] || trackerState.ducat.characters[trackerState.ducat.activeCharacterId];
    if (!char || !isValidCharacterClass(char.classKey)) return 'gladiator';
    return char.classKey;
}

function setCharacterClass(charId, classKey) {
    if (!trackerState.ducat || !trackerState.ducat.characters) return false;
    if (!trackerState.ducat.characters[charId]) return false;
    if (!isValidCharacterClass(classKey)) return false;

    trackerState.ducat.characters[charId].classKey = classKey;
    saveTrackerState();
    return true;
}

// Get active character
function getActiveCharacter() {
    if (!trackerState.ducat || !trackerState.ducat.characters) return null;
    return trackerState.ducat.characters[trackerState.ducat.activeCharacterId] || null;
}

// Get all characters
function getAllCharacters() {
    if (!trackerState.ducat || !trackerState.ducat.characters) return [];
    return Object.keys(trackerState.ducat.characters).map(function(charId) {
        return trackerState.ducat.characters[charId];
    });
}

// Get tab data
function getTabData(tabId) {
    return trackerState[tabId] || null;
}

// Update custom tab field
function updateCustomField(tabId, fieldIndex, value) {
    var tab = trackerState[tabId];
    if (!tab || tab.isDefault || fieldIndex >= tab.fields.length) return;
    
    var field = tab.fields[fieldIndex];
    
    // For number fields with maxValue, clamp the value
    if (field.type === 'number' && field.maxValue) {
        var numValue = parseInt(value) || 0;
        value = Math.max(0, Math.min(numValue, field.maxValue));
    }
    
    field.value = value;
    saveTrackerState();
}

// Add field to custom tab
function addFieldToTab(tabId, fieldType, fieldLabel, maxValue, options) {
    var tab = trackerState[tabId];
    if (!tab || tab.isDefault) return;

    var defaultValue = '';
    if (fieldType === 'checkbox') defaultValue = false;
    else if (fieldType === 'checklist') defaultValue = {};

    var field = {
        id: 'field-' + Date.now(),
        type: fieldType, // 'text', 'number', 'dropdown', 'checkbox', 'checklist', 'note'
        label: fieldLabel,
        value: defaultValue,
        maxValue: maxValue || null,
        options: options || []
    };

    tab.fields.push(field);
    saveTrackerState();
}

// Toggle a checkbox field
function toggleCheckboxField(tabId, fieldIndex) {
    var tab = trackerState[tabId];
    if (!tab || tab.isDefault || fieldIndex < 0 || fieldIndex >= tab.fields.length) return;
    tab.fields[fieldIndex].value = !tab.fields[fieldIndex].value;
    saveTrackerState();
}

// Toggle one item in a checklist field
function toggleChecklistItem(tabId, fieldIndex, optionKey) {
    var tab = trackerState[tabId];
    if (!tab || tab.isDefault || fieldIndex < 0 || fieldIndex >= tab.fields.length) return;
    var field = tab.fields[fieldIndex];
    if (!field.value || typeof field.value !== 'object') field.value = {};
    field.value[optionKey] = !field.value[optionKey];
    saveTrackerState();
}

// Update field properties (for max value or options)
function updateFieldProperties(tabId, fieldIndex, properties) {
    var tab = trackerState[tabId];
    if (!tab || tab.isDefault || fieldIndex >= tab.fields.length) return;
    
    var field = tab.fields[fieldIndex];
    if (properties.maxValue !== undefined) field.maxValue = properties.maxValue;
    if (properties.options !== undefined) field.options = properties.options;
    
    saveTrackerState();
}

// Reorder characters in ducat
function reorderCharacters(fromIndex, toIndex) {
    if (!trackerState.ducat || !trackerState.ducat.characters) return;
    
    var charIds = Object.keys(trackerState.ducat.characters);
    if (fromIndex < 0 || fromIndex >= charIds.length || toIndex < 0 || toIndex >= charIds.length) return;
    
    // Get the character ID to move
    var charId = charIds[fromIndex];
    
    // Remove from old position
    charIds.splice(fromIndex, 1);
    
    // Insert at new position
    charIds.splice(toIndex, 0, charId);
    
    // Rebuild the characters object in new order
    var newCharacters = {};
    charIds.forEach(function(id) {
        newCharacters[id] = trackerState.ducat.characters[id];
    });
    trackerState.ducat.characters = newCharacters;
    
    saveTrackerState();
}

// Reorder fields in custom tab
function reorderFields(tabId, fromIndex, toIndex) {
    var tab = trackerState[tabId];
    if (!tab || !tab.fields || fromIndex < 0 || fromIndex >= tab.fields.length) return;
    if (toIndex < 0 || toIndex >= tab.fields.length) return;
    
    // Get the field to move
    var field = tab.fields[fromIndex];
    
    // Remove from old position
    tab.fields.splice(fromIndex, 1);
    
    // Insert at new position
    tab.fields.splice(toIndex, 0, field);
    
    saveTrackerState();
}
