'use strict';

(function() {
    var STORAGE_KEY = 'stigma-builder-state-v1';
    var selectedClass = 'gladiator';
    var buildsByClass = {};

    // Tuned to the current stigma board background artwork.
    var STIGMA_LAYOUT = {
        width: 400,
        height: 315,
        slots: [
            { tier: 'gold', index: 0, x: 155, y: 11 },
            { tier: 'blue', index: 0, x: 48, y: 80 },
            { tier: 'blue', index: 1, x: 257, y: 80 },
            { tier: 'green', index: 0, x: 60, y: 189 },
            { tier: 'green', index: 1, x: 155, y: 235 },
            { tier: 'green', index: 2, x: 251, y: 189 },
            { tier: 'green', index: 3, x: 375, y: 11 },
            { tier: 'blue', index: 2, x: 375, y: 120 },
            { tier: 'green', index: 4, x: 375, y: 235 }
        ],
        vision: { x: 202, y: 159 }
    };

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function renderStigmaTooltipCard(def) {
        if (!def) return '';
        var html = '<div class="gc-item-tooltip-card">';
        html += '<div class="gc-item-tooltip-title-row">';
        html += '<span class="gc-item-tooltip-title">' + escapeHtml(def.name || '') + '</span>';
        html += '</div>';
        html += '<div class="gc-item-tooltip-media-row">';
        html += '<div class="gc-item-tooltip-item-icons">';
        html += '<img src="../assets/icons/icon_frame_2.png" class="gc-item-tooltip-item-icon-back" alt="">';
        html += '<img src="' + (def.icon) + '" class="gc-item-tooltip-item-icon" alt="">';
        html += '</div>';
        html += '<div class="gc-item-tooltip-meta">';
        if (def.cooldown) html += '<div class="gc-item-tooltip-meta-line">Cooldown: ' + escapeHtml(def.cooldown) + '</div>';
        if (def.castTime) html += '<div class="gc-item-tooltip-meta-line">Cast Time: ' + escapeHtml(def.castTime) + '</div>';
        html += '</div>';
        html += '</div>';
        if (def.description) {
            html += '<hr class="gc-item-tooltip-separator">';
            html += '<div class="gc-item-tooltip-wide">' + escapeHtml(def.description) + '</div>';
        }
        html += '</div>';
        return html;
    }

    function buildStigmaTooltipHtml(def) {
        if (!def) return '';
        var entries = [def];
        if (Array.isArray(def.linkedTooltips)) entries = entries.concat(def.linkedTooltips);
        if (entries.length <= 1) return renderStigmaTooltipCard(entries[0]);
        return '<div class="gc-stigma-tooltip-grid">' + entries.map(function(item) { return renderStigmaTooltipCard(item); }).join('') + '</div>';
    }

    function buildActionTooltipHtml(title, description) {
        var html = '<div class="gc-item-tooltip-card">';
        html += '<div class="gc-item-tooltip-title-row">';
        html += '<span class="gc-item-tooltip-title">' + escapeHtml(title || '') + '</span>';
        html += '</div>';
        if (description) html += '<div class="gc-item-tooltip-wide">' + escapeHtml(description) + '</div>';
        html += '</div>';
        return html;
    }

    function toPercent(value, total) {
        if (!total) return '0%';
        return (value / total * 100).toFixed(4) + '%';
    }

    function getFirstSupportedClass() {
        for (var i = 0; i < CLASS_ORDER.length; i++) {
            if (classHasStigmas(CLASS_ORDER[i])) return CLASS_ORDER[i];
        }
        return 'gladiator';
    }

    function ensureClassBuild(className) {
        if (!classHasStigmas(className)) return null;
        if (!buildsByClass[className]) buildsByClass[className] = createDefaultStigmaBuild(className);
        normalizeStigmaBuild(className, buildsByClass[className]);
        return buildsByClass[className];
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                selectedClass: selectedClass,
                buildsByClass: buildsByClass
            }));
        } catch (e) {
            // Ignore private mode / quota failures.
        }
    }

    function loadState() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            var parsed = JSON.parse(raw);
            if (!parsed || typeof parsed !== 'object') return;

            if (parsed.selectedClass && CLASS_DATA[parsed.selectedClass]) {
                selectedClass = parsed.selectedClass;
            }

            if (parsed.buildsByClass && typeof parsed.buildsByClass === 'object') {
                Object.keys(parsed.buildsByClass).forEach(function(className) {
                    if (!classHasStigmas(className)) return;
                    var savedBuild = parsed.buildsByClass[className];
                    if (!savedBuild || typeof savedBuild !== 'object') return;

                    var base = createDefaultStigmaBuild(className);
                    ['gold', 'blue', 'green'].forEach(function(tier) {
                        if (!Array.isArray(base[tier]) || !Array.isArray(savedBuild[tier])) return;
                        for (var i = 0; i < base[tier].length; i++) {
                            var key = savedBuild[tier][i];
                            if (typeof key === 'string' || key === null) base[tier][i] = key;
                        }
                    });
                    buildsByClass[className] = base;
                    normalizeStigmaBuild(className, buildsByClass[className]);
                });
            }
        } catch (e) {
            // Ignore corrupted storage.
        }
    }

    function renderClassSelector() {
        var el = document.getElementById('class-selector');
        if (!el) return;

        var html = '<div class="gc-section-label" style="margin-bottom:10px">Choose Class</div>';
        html += '<div class="gc-class-grid">';
        CLASS_ORDER.forEach(function(classKey) {
            var cls = CLASS_DATA[classKey];
            if (!cls) return;
            var selected = classKey === selectedClass ? ' selected' : '';
            var noData = classHasStigmas(classKey) ? '' : ' style="opacity:0.45"';
            var title = classHasStigmas(classKey) ? cls.name : (cls.name + ' (No stigma data yet)');

            html += '<div class="gc-class-btn' + selected + '" onclick="StigmaApp.selectClass(\'' + classKey + '\')" title="' + escapeHtml(title) + '"' + noData + '>';
            html += '<img src="' + escapeHtml(cls.icon) + '" alt="' + escapeHtml(cls.name) + '">';
            html += '<span class="gc-class-label">' + escapeHtml(cls.name) + '</span>';
            html += '</div>';
        });
        html += '</div>';

        el.innerHTML = html;
    }

    function renderSlot(tier, slotIndex, build) {
        var locked = isStigmaSlotLocked(selectedClass, tier, slotIndex, build);
        var current = build[tier][slotIndex] || '';
        var options = getStigmaOptions(selectedClass, tier, slotIndex, build);
        var selectedDef = getStigmaDefinition(selectedClass, current);
        var slotHasIcon = !!(selectedDef && selectedDef.icon);
        var slotTitle = selectedDef ? (selectedDef.name + ' | ' + (selectedDef.cooldown || '-') + ' | ' + (selectedDef.description || '')) : 'No stigma selected';
        var slotTooltipHtml = selectedDef ? buildStigmaTooltipHtml(selectedDef) : '';
        var canClear = !!current;
        var optionCols = Math.max(1, Math.min(options.length, 4));

        var html = '<div class="gc-stigma-slot gc-stigma-map-node">';
        html += '<div class="gc-stigma-current gc-stigma-tier-' + tier + (selectedDef ? ' is-filled gc-item-tooltip-trigger' : '') + '" tabindex="0" role="button" aria-label="' + escapeHtml(slotTitle) + '"' + (slotTooltipHtml ? ' data-tooltip-html="' + escapeHtml(slotTooltipHtml) + '"' : '') + '>';
        if (slotHasIcon) html += '<img src="' + selectedDef.icon + '" class="gc-stigma-current-icon" alt="">';
        html += '</div>';
        if (canClear) {
            html += '<button type="button" class="gc-stigma-clear-btn" aria-label="Remove stigma" title="Remove stigma" onclick="StigmaApp.clearStigma(\'' + tier + '\',' + slotIndex + ')">✕</button>';
        }

        html += '<div class="gc-stigma-option-grid" style="--stigma-option-cols:' + optionCols + ';">';
        options.forEach(function(def) {
            var defTitle = def.name + ' | ' + (def.cooldown || '-') + ' | ' + (def.description || '');
            var optionTooltipHtml = buildStigmaTooltipHtml(def);
            html += '<button class="gc-stigma-option gc-item-tooltip-trigger gc-stigma-tier-' + tier + (def.key === current ? ' selected' : '') + '" ' + (locked ? 'disabled' : '') + ' data-tooltip-html="' + escapeHtml(optionTooltipHtml) + '" aria-label="' + escapeHtml(defTitle) + '" onclick="StigmaApp.setStigma(\'' + tier + '\',' + slotIndex + ',\'' + def.key + '\')">';
            html += '<img src="' + def.icon + '" class="gc-stigma-option-icon" alt="">';
            html += '</button>';
        });

        html += '</div>';
        if (locked) html += '<div class="gc-stigma-slot-note">Locked</div>';
        html += '</div>';
        return html;
    }

    function buildVisionLegendData(className) {
        var cfg = getStigmaConfig(className);
        if (!cfg) return { groups: [], fallbackVisionKey: 'summon-battlefield-flag' };

        var goldDefs = cfg.tiers.gold || [];
        var blueDefs = cfg.tiers.blue || [];
        var fallbackVisionKey = 'summon-battlefield-flag';
        var grouped = {};

        for (var g = 0; g < goldDefs.length; g++) {
            for (var i = 0; i < blueDefs.length; i++) {
                for (var j = i + 1; j < blueDefs.length; j++) {
                    var sampleBuild = createDefaultStigmaBuild(className);
                    sampleBuild.gold[0] = goldDefs[g].key;
                    sampleBuild.blue[0] = blueDefs[i].key;
                    sampleBuild.blue[1] = blueDefs[j].key;
                    var visionKey = resolveStigmaVisionKey(className, sampleBuild) || fallbackVisionKey;

                    if (visionKey === 'summon-battlefield-flag') continue;
                    if (!grouped[visionKey]) grouped[visionKey] = [];

                    grouped[visionKey].push({
                        gold: goldDefs[g],
                        blueA: blueDefs[i],
                        blueB: blueDefs[j]
                    });
                }
            }
        }

        var groups = Object.keys(grouped).map(function(visionKey) {
            return {
                visionKey: visionKey,
                visionDef: getStigmaDefinition(className, visionKey),
                combos: grouped[visionKey]
            };
        });

        return {
            groups: groups,
            fallbackVisionKey: fallbackVisionKey,
            fallbackVisionDef: getStigmaDefinition(className, fallbackVisionKey)
        };
    }

    function renderLegendIcon(def, extraClass, extraAttrs) {
        if (!def) return '';
        var tooltipHtml = buildStigmaTooltipHtml(def);
        var label = def.name + ' | ' + (def.cooldown || '-') + ' | ' + (def.description || '');
        var cls = 'stigma-legend-icon gc-item-tooltip-trigger';
        if (extraClass) cls += ' ' + extraClass;
        var html = '<button type="button" class="' + cls + '" data-tooltip-html="' + escapeHtml(tooltipHtml) + '" aria-label="' + escapeHtml(label) + '"' + (extraAttrs || '') + '>';
        html += '<img src="' + def.icon + '" alt="">';
        html += '</button>';
        return html;
    }

    function renderVisionLegend(className) {
        var data = buildVisionLegendData(className);
        var html = '<div class="stigma-legend">';
        html += '<div class="stigma-legend-title">Vision Legend</div>';

        if (!data.groups.length) {
            html += '<div class="stigma-legend-empty">No special blue combinations for this class.</div>';
        } else {
            data.groups.forEach(function(group, groupIndex) {
                var firstCombo = (group.combos && group.combos.length) ? group.combos[0] : null;
                var autoAttrs = '';
                if (groupIndex < 2 && firstCombo) {
                    autoAttrs = ' onclick="StigmaApp.applyVisionLegendFirstCombo(\'' + firstCombo.gold.key + '\',\'' + firstCombo.blueA.key + '\',\'' + firstCombo.blueB.key + '\')"';
                }
                html += '<div class="stigma-vision-group' + (groupIndex > 0 ? ' stigma-vision-group-delimited' : '') + '">';
                html += '<div class="stigma-legend-row stigma-legend-row-main">';
                html += '<div class="stigma-legend-target">' + renderLegendIcon(group.visionDef, 'stigma-legend-icon-vision', autoAttrs) + '</div>';
                html += '<div class="stigma-legend-arrow">&larr;</div>';
                html += '<div class="stigma-legend-combos">';
                (group.combos || []).forEach(function(combo) {
                    html += '<div class="stigma-legend-combo">';
                    html += renderLegendIcon(combo.gold);
                    html += '<span class="stigma-legend-plus">+</span>';
                    html += renderLegendIcon(combo.blueA);
                    html += '<span class="stigma-legend-plus">+</span>';
                    html += renderLegendIcon(combo.blueB);
                    html += '</div>';
                });
                html += '</div>';
                html += '</div>';
                html += '</div>';
            });
        }

        html += '<div class="stigma-legend-row stigma-legend-row-fallback">';
        html += '<div class="stigma-legend-target">' + renderLegendIcon(data.fallbackVisionDef, 'stigma-legend-icon-vision') + '</div>';
        html += '<div class="stigma-legend-arrow">&larr;</div>';
        html += '<div class="stigma-legend-fallback-text">Everything else</div>';
        html += '</div>';

        html += '</div>';
        return html;
    }

    function renderBuilder() {
        var el = document.getElementById('stigma-builder');
        if (!el) return;

        if (!classHasStigmas(selectedClass)) {
            el.innerHTML = '<div class="gc-stigma-panel"><div class="gc-stigma-title">No stigma data for this class yet</div></div>';
            return;
        }

        var build = ensureClassBuild(selectedClass);
        if (!build) {
            el.innerHTML = '';
            return;
        }

        var className = CLASS_DATA[selectedClass] ? CLASS_DATA[selectedClass].name : selectedClass;
        var unlocked = isStigmaExtraUnlocked(selectedClass, build);
        var visionKey = resolveStigmaVisionKey(selectedClass, build);
        var vision = getStigmaDefinition(selectedClass, visionKey);
        var visionActive = !!unlocked;

        var html = '<div class="gc-stigma-panel">';
        html += '<div class="stigma-builder-head">';
        html += '<button class="gc-reset-btn gc-item-tooltip-trigger" onclick="StigmaApp.resetClassStigmas()" aria-label="Reset current class stigmas" title="Reset current class stigmas" data-tooltip-html="' + escapeHtml(buildActionTooltipHtml('Reset Build', 'Clears the current class stigma selection and restores an empty board.')) + '">↺</button>';
        html += '</div>';

        html += '<div class="stigma-two-col">';
        html += '<div class="stigma-left">';
        html += '<div class="gc-stigma-layout">';
        html += '<div class="gc-stigma-main-map' + (visionActive ? ' is-vision-active' : '') + '" style="--stigma-base-width:' + STIGMA_LAYOUT.width + ';--stigma-base-height:' + STIGMA_LAYOUT.height + ';">';

        STIGMA_LAYOUT.slots.forEach(function(slot) {
            html += '<div class="gc-stigma-map-slot" style="left:' + toPercent(slot.x, STIGMA_LAYOUT.width) + ';top:' + toPercent(slot.y, STIGMA_LAYOUT.height) + ';">';
            html += renderSlot(slot.tier, slot.index, build);
            html += '</div>';
        });

            if (unlocked && vision && vision.icon) {
                var visionTooltipHtml = buildStigmaTooltipHtml(vision);
                var visionLabel = vision.name + ' | ' + (vision.cooldown || '-') + ' | ' + (vision.description || '');
                html += '<div class="gc-stigma-map-slot gc-stigma-vision-marker" style="left:' + toPercent(STIGMA_LAYOUT.vision.x, STIGMA_LAYOUT.width) + ';top:' + toPercent(STIGMA_LAYOUT.vision.y, STIGMA_LAYOUT.height) + ';">';
                html += '<button type="button" class="gc-stigma-vision-trigger gc-item-tooltip-trigger" tabindex="0" aria-label="' + escapeHtml(visionLabel) + '" data-tooltip-html="' + escapeHtml(visionTooltipHtml) + '">';
                html += '<img src="' + vision.icon + '" class="gc-stigma-vision-icon" alt="">';
                html += '</button>';
                html += '</div>';
            }

        html += '</div>';
        html += '</div>';
        html += '</div>';

        html += renderVisionLegend(selectedClass);
        html += '</div>';
        html += '</div>';
        
        el.innerHTML = html;
    }

    window.StigmaApp = {
        selectClass: function(className) {
            if (!CLASS_DATA[className]) return;
            selectedClass = className;
            ensureClassBuild(className);
            saveState();
            renderClassSelector();
            renderBuilder();
        },

        setStigma: function(tier, slotIndex, key) {
            var build = ensureClassBuild(selectedClass);
            if (!build) return;
            if (!build[tier] || slotIndex < 0 || slotIndex >= build[tier].length) return;

            var nextKey = key || null;
            if (build[tier][slotIndex] && build[tier][slotIndex] === nextKey) nextKey = null;

            var locked = isStigmaSlotLocked(selectedClass, tier, slotIndex, build);
            if (locked && nextKey) return;

            if (nextKey) {
                var def = getStigmaDefinition(selectedClass, nextKey);
                var tierMap = getStigmaTierMap(selectedClass);
                if (!def || tierMap[nextKey] !== tier) return;

                var duplicate = false;
                ['gold', 'blue', 'green'].forEach(function(t) {
                    build[t].forEach(function(existingKey, i) {
                        if (t === tier && i === slotIndex) return;
                        if (existingKey && existingKey === nextKey) duplicate = true;
                    });
                });
                if (duplicate) return;
            }

            build[tier][slotIndex] = nextKey;
            normalizeStigmaBuild(selectedClass, build);
            saveState();
            renderBuilder();
        },

        resetClassStigmas: function() {
            if (!classHasStigmas(selectedClass)) return;
            buildsByClass[selectedClass] = createDefaultStigmaBuild(selectedClass);
            normalizeStigmaBuild(selectedClass, buildsByClass[selectedClass]);
            saveState();
            renderBuilder();
        },

        clearStigma: function(tier, slotIndex) {
            StigmaApp.setStigma(tier, slotIndex, '');
        },

        applyVisionLegendFirstCombo: function(goldKey, blueAKey, blueBKey) {
            var build = ensureClassBuild(selectedClass);
            if (!build) return;
            if (!goldKey || !blueAKey || !blueBKey) return;

            var goldDef = getStigmaDefinition(selectedClass, goldKey);
            var blueADef = getStigmaDefinition(selectedClass, blueAKey);
            var blueBDef = getStigmaDefinition(selectedClass, blueBKey);
            if (!goldDef || !blueADef || !blueBDef) return;

            var tierMap = getStigmaTierMap(selectedClass);
            if (tierMap[goldKey] !== 'gold' || tierMap[blueAKey] !== 'blue' || tierMap[blueBKey] !== 'blue') return;

            build.gold[0] = goldKey;
            build.blue[0] = blueAKey;
            build.blue[1] = blueBKey;

            if (build.blue[2] === blueAKey || build.blue[2] === blueBKey) {
                build.blue[2] = null;
            }

            normalizeStigmaBuild(selectedClass, build);
            saveState();
            renderBuilder();
        }
    };

    loadState();
    if (!CLASS_DATA[selectedClass]) selectedClass = getFirstSupportedClass();
    if (!classHasStigmas(selectedClass)) selectedClass = getFirstSupportedClass();
    ensureClassBuild(selectedClass);

    renderClassSelector();
    renderBuilder();

    // Global item tooltip mounted on body to avoid clipping behind panel layers.
    var globalItemTooltip = document.getElementById('gc-global-item-tooltip');
    if (!globalItemTooltip) {
        globalItemTooltip = document.createElement('div');
        globalItemTooltip.id = 'gc-global-item-tooltip';
        globalItemTooltip.className = 'gc-global-item-tooltip';
        document.body.appendChild(globalItemTooltip);
    }
    var activeItemTooltipTrigger = null;

    function positionGlobalItemTooltip(trigger) {
        if (!trigger || !globalItemTooltip || globalItemTooltip.style.display !== 'block') return;
        var margin = 8;
        var rect = trigger.getBoundingClientRect();
        var tipW = globalItemTooltip.offsetWidth;
        var tipH = globalItemTooltip.offsetHeight;

        var top = rect.top - tipH - margin;
        if (top < margin) top = rect.bottom + margin;

        var left = rect.left + (rect.width / 2) - (tipW / 2);
        var minLeft = margin;
        var maxLeft = window.innerWidth - tipW - margin;
        if (left < minLeft) left = minLeft;
        if (left > maxLeft) left = Math.max(minLeft, maxLeft);

        globalItemTooltip.style.top = top + 'px';
        globalItemTooltip.style.left = left + 'px';
    }

    function showGlobalItemTooltip(trigger) {
        if (!trigger) return;
        var tooltipHtml = trigger.getAttribute('data-tooltip-html');
        if (!tooltipHtml) return;
        activeItemTooltipTrigger = trigger;
        globalItemTooltip.innerHTML = tooltipHtml;
        globalItemTooltip.style.display = 'block';
        globalItemTooltip.classList.add('gc-global-item-tooltip-visible');
        positionGlobalItemTooltip(trigger);
    }

    function hideGlobalItemTooltip() {
        activeItemTooltipTrigger = null;
        globalItemTooltip.classList.remove('gc-global-item-tooltip-visible');
        globalItemTooltip.style.display = 'none';
        globalItemTooltip.innerHTML = '';
    }

    document.addEventListener('mouseover', function(e) {
        var trigger = e.target.closest('.gc-item-tooltip-trigger[data-tooltip-html]');
        if (!trigger) return;
        if (activeItemTooltipTrigger === trigger) {
            positionGlobalItemTooltip(trigger);
            return;
        }
        showGlobalItemTooltip(trigger);
    });

    document.addEventListener('mouseout', function(e) {
        if (!activeItemTooltipTrigger) return;
        var leftTrigger = e.target.closest('.gc-item-tooltip-trigger[data-tooltip-html]');
        if (!leftTrigger || leftTrigger !== activeItemTooltipTrigger) return;
        if (e.relatedTarget && activeItemTooltipTrigger.contains(e.relatedTarget)) return;
        hideGlobalItemTooltip();
    });

    document.addEventListener('focusin', function(e) {
        var trigger = e.target.closest('.gc-item-tooltip-trigger[data-tooltip-html]');
        if (!trigger) return;
        showGlobalItemTooltip(trigger);
    });

    document.addEventListener('focusout', function(e) {
        var trigger = e.target.closest('.gc-item-tooltip-trigger[data-tooltip-html]');
        if (!trigger) return;
        if (e.relatedTarget && trigger.contains(e.relatedTarget)) return;
        hideGlobalItemTooltip();
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.gc-item-tooltip-trigger')) {
            hideGlobalItemTooltip();
        }
    });

    window.addEventListener('scroll', function() {
        hideGlobalItemTooltip();
    }, true);

    window.addEventListener('resize', function() {
        if (activeItemTooltipTrigger) positionGlobalItemTooltip(activeItemTooltipTrigger);
    });
})();
