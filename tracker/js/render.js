'use strict';

function renderAll() {
    renderTabs();
    renderActiveTabContent();
}

function renderTabs() {
    var tabBar = document.getElementById('tracker-tab-bar');
    if (!tabBar) return;

    tabBar.innerHTML = '';

    tabs.forEach(function(tabId) {
        var tabData = trackerState[tabId];
        if (!tabData) return;

        var btn = document.createElement('button');
        btn.className = 'tracker-tab' + (activeTab === tabId ? ' tracker-tab-active' : '');
        btn.onclick = function() { activateTab(tabId); };

        // Icon and label
        if (tabId === 'ducat') {
            btn.innerHTML = '<img src="../assets/icons/coin_05.png" class="tracker-tab-icon" alt=""> Ducat';
        } else {
            btn.innerHTML = tabData.name;
            // Add remove button for custom tabs
            var removeBtn = document.createElement('span');
            removeBtn.className = 'tracker-tab-remove';
            removeBtn.innerHTML = '✕';
            removeBtn.onclick = function(e) {
                e.stopPropagation();
                TK.removeTab(tabId);
            };
            btn.appendChild(removeBtn);
        }

        tabBar.appendChild(btn);
    });

    // Add new tab button
    var addBtn = document.createElement('button');
    addBtn.className = 'tracker-tab-add';
    addBtn.innerHTML = '+';
    addBtn.onclick = function() {
        TK.openAddTabDialog();
    };
    tabBar.appendChild(addBtn);
}

function renderActiveTabContent() {
    var content = document.getElementById('tracker-content');
    if (!content) return;

    var tabData = trackerState[activeTab];
    if (!tabData) return;

    if (activeTab === 'ducat') {
        renderDucatTab(content, tabData);
    } else {
        renderCustomTab(content, tabData);
    }
}

function renderDucatTab(container, tabData) {
    var html = '';

    html += '<div class="tracker-ducat-header">';
    html += '    <h2>Ducat Tracking</h2>';
    html += '    <button class="tracker-reset-all-btn" onclick="TK.resetDucatChar()" title="Reset all runs to 0">🔄 Reset All</button>';
    html += '</div>';

    // Character selection tabs
    html += '<div class="tracker-char-tabs-wrapper">';
    html += '    <div class="tracker-char-tabs">';

    var characters = getAllCharacters();
    characters.forEach(function(char, index) {
        var isActive = trackerState.ducat.activeCharacterId === char.id;
        html += '        <button class="tracker-char-tab' + (isActive ? ' tracker-char-tab-active' : '') + '" ';
        html += '                draggable="true" ';
        html += '                data-char-id="' + char.id + '" ';
        html += '                data-char-index="' + index + '" ';
        html += '                ondragstart="TK.dragStartChar(event)" ';
        html += '                ondragover="TK.dragOverChar(event)" ';
        html += '                ondrop="TK.dropChar(event)" ';
        html += '                ondragend="TK.dragEndChar(event)" ';
        html += '                onclick="TK.switchCharacter(\'' + char.id + '\')" ';
        html += '                title="' + char.name + '">';
        html += '            <span class="tracker-char-name" ondblclick="event.stopPropagation(); TK.openRenameCharDialog(\'' + char.id + '\')" title="Double-click to rename">' + char.name + '</span>';
        if (characters.length > 1) {
            html += '            <span class="tracker-char-remove" onclick="event.stopPropagation(); TK.removeCharacter(\'' + char.id + '\')">✕</span>';
        }
        html += '        </button>';
    });

    if (characters.length < 10) {
        html += '        <button class="tracker-char-add" onclick="TK.openAddCharDialog()">+ Add Char</button>';
    }

    html += '    </div>';
    html += '</div>';

    // Instances grid
    html += '<div class="tracker-instances-grid">';

    var activeChar = getActiveCharacter();
    if (activeChar) {
        DUCAT_INSTANCES.forEach(function(instance) {
            var runs = getDucatRuns(instance.id, activeChar.id);

            html += '    <div class="tracker-instance-card">';
            html += '        <div class="tracker-instance-name">' + instance.name + '</div>';
            html += '        <div class="tracker-instance-subtitle">Max runs: ' + instance.maxRuns + '</div>';
            html += '        <div class="tracker-runs-input">';
            html += '            <button class="tracker-btn-minus" onclick="TK.decrementRuns(\'' + instance.id + '\')">−</button>';
            html += '            <input type="number" class="tracker-runs-value" id="runs-' + instance.id + '" ';
            html += '                   value="' + runs + '" min="0" max="' + instance.maxRuns + '" ';
            html += '                   onchange="TK.setRuns(\'' + instance.id + '\', this.value)" />';
            html += '            <button class="tracker-btn-plus" onclick="TK.incrementRuns(\'' + instance.id + '\')">+</button>';
            html += '        </div>';
            html += '    </div>';
        });
    }

    html += '</div>';

    // Total ducats section
    html += '<div class="tracker-total-ducats-section">';
    html += '    <div class="tracker-total-ducats-label">Total Ducats<img src="../assets/icons/coin_05.png"></div> ';
    var totalDucats = getTotalDucats();
    html += '    <div class="tracker-total-ducats-input-group">';
    html += '        <button class="tracker-btn-minus" onclick="TK.decrementTotalDucats()">−</button>';
    html += '        <input type="number" class="tracker-total-ducats-input" ';
    html += '               id="tracker-total-ducats" ';
    html += '               value="' + totalDucats + '" min="0" max="1000" ';
    html += '               onchange="TK.setTotalDucats(this.value)" />';
    html += '        <button class="tracker-btn-plus" onclick="TK.incrementTotalDucats()">+</button>';
    html += '        <span class="tracker-total-ducats-max">/1000</span>';
    html += '    </div>';
    html += '</div>';

    container.innerHTML = html;
}

function renderCustomTab(container, tabData) {
    var html = '';

    html += '<div class="tracker-custom-header">';
    html += '    <h2>' + tabData.name + '</h2>';
    html += '    <button class="tracker-add-field-btn" onclick="TK.openAddFieldDialog(\'' + tabData.id + '\')">+ Add Field</button>';
    html += '</div>';

    html += '<div class="tracker-custom-fields">';

    if (tabData.fields.length === 0) {
        html += '    <p class="tracker-empty-message">No fields yet. Click "+ Add Field" to get started.</p>';
    } else {
        tabData.fields.forEach(function(field, index) {
            html += '    <div class="tracker-custom-field" ';
            html += '        draggable="true" ';
            html += '        data-tab-id="' + tabData.id + '" ';
            html += '        data-field-index="' + index + '" ';
            html += '        ondragstart="TK.dragStartField(event)" ';
            html += '        ondragover="TK.dragOverField(event)" ';
            html += '        ondrop="TK.dropField(event)" ';
            html += '        ondragend="TK.dragEndField(event)">';
            html += '        <div class="tracker-custom-field-header">';
            html += '            <label>' + field.label + ' <span class="tracker-drag-handle">⋮⋮</span></label>';
            html += '            <button class="tracker-field-delete" onclick="TK.removeField(\'' + tabData.id + '\', ' + index + ')">✕</button>';
            html += '        </div>';

            if (field.type === 'text') {
                html += '        <input type="text" class="tracker-field-input" data-tab-id="' + tabData.id + '" data-field-index="' + index + '" value="' + (field.value || '') + '" onchange="TK.updateField(this)" />';
            } else if (field.type === 'number') {
                var maxAttr = field.maxValue ? ' max="' + field.maxValue + '"' : '';
                html += '        <input type="number" class="tracker-field-input" data-tab-id="' + tabData.id + '" data-field-index="' + index + '" value="' + (field.value || '') + '"' + maxAttr + ' onchange="TK.updateField(this)" />';
                if (field.maxValue) {
                    html += '        <div class="tracker-field-info">Max: ' + field.maxValue + '</div>';
                }
            } else if (field.type === 'dropdown') {
                html += '        <select class="tracker-field-input" data-tab-id="' + tabData.id + '" data-field-index="' + index + '" onchange="TK.updateField(this)">';
                if (field.options && Array.isArray(field.options) && field.options.length > 0) {
                    field.options.forEach(function(opt) {
                        var selected = opt === field.value ? ' selected' : '';
                        html += '            <option value="' + opt + '"' + selected + '>' + opt + '</option>';
                    });
                } else {
                    html += '            <option value="">-- No options configured --</option>';
                }
                html += '        </select>';
                html += '        <button class="tracker-field-config" onclick="TK.openConfigureDropdown(\'' + tabData.id + '\', ' + index + ', \'' + field.label + '\')">⚙ Configure</button>';
            }

            html += '    </div>';
        });
    }

    html += '</div>';

    container.innerHTML = html;
}

function activateTab(tabId) {
    if (tabs.indexOf(tabId) === -1) return;
    activeTab = tabId;
    saveTrackerState();
    renderActiveTabContent();
    var tabButtons = document.querySelectorAll('.tracker-tab');
    tabButtons.forEach(function(btn) { btn.classList.remove('tracker-tab-active'); });
    // Find and mark the active tab
    var activeBtn = Array.from(tabButtons).find(function(btn) {
        return btn.textContent.includes(trackerState[tabId].name || 'Ducat');
    });
    if (activeBtn) activeBtn.classList.add('tracker-tab-active');
}

// Helper to update input value on buttons
function updateInputValue(instanceId, newValue) {
    var input = document.getElementById('runs-' + instanceId);
    if (input) input.value = newValue;
}
