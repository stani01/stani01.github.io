'use strict';

if (loadShareFromURL()) {
    saveState();
    saveTraitSelections();
} else {
    loadState();
}
renderAll();
if (activeTab !== 'equipment') activateTab(activeTab);