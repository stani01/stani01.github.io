'use strict';

if (!loadShareFromURL()) {
    loadState();
}
renderAll();
if (activeTab !== 'equipment') activateTab(activeTab);