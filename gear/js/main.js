'use strict';

if (loadShareFromURL()) {
    saveState();
    saveTraitSelections();
} else {
    loadState();
}
renderAll();
var startupTab = activeTab;
if (!document.querySelector('.gc-tab[data-tab="' + startupTab + '"]') || !document.getElementById('tab-' + startupTab)) {
    var firstTab = document.querySelector('.gc-tab');
    startupTab = firstTab ? firstTab.getAttribute('data-tab') : 'equipment';
}
if (startupTab) activateTab(startupTab);
if (typeof updateUndoResetButtonState === 'function') updateUndoResetButtonState();