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

    var STIGMA_PRESET_BUILD_MAP = {
        gladiator: {
            pve: {
                gold: ['drainingSword'],
                blue: ['sharpStrike', 'sureStrike', 'exhaustingWave'],
                green: ['lockdown', 'magicDefence', 'howl', 'earthquakeWave', 'siegebreaker']
            },
            pvp: {
                gold: ['whirlingStrike'],
                blue: ['severePrecisionCut', 'tendonSlice', 'sharpStrike'],
                green: ['lockdown', 'magicDefence', 'howl', 'ankleSnare', 'cripplingCut']
            }
        },
        templar: {
            pve: {
                gold: ['empyreanProvidence'],
                blue: ['shieldOfFaith', 'prayerOfVictory', 'punishingWave'],
                green: ['punishment', 'eliminationStrike', 'divineFury', 'inquisitorBlow', 'incurWrath']
            },
            pvp: {
                gold: ['shieldBlast'],
                blue: ['magicSmash', 'punishingWave', 'prayerOfVictory'],
                green: ['punishment', 'eliminationStrike', 'divineFury', 'aetherArmour', 'barricadeOfSteel']
            }
        },
        assassin: {
            pve: {
                gold: ['quickeningDoom'],
                blue: ['dashAndSlash', 'applyLethalVenom', 'lightningSlash'],
                green: ['deadlyAbandon', 'runeCarveSigilStrike', 'eyeOfWrath', 'venomousStrike', 'shadowWalk']
            },
            pvp: {
                gold: ['daggerOath'],
                blue: ['fleeingPosture', 'sensoryBoost', 'dashAndSlash'],
                green: ['deadlyAbandon', 'runeCarveSigilStrike', 'shadowfall', 'ambushRaid', 'shadowWalk']
            }
        },
        ranger: {
            pve: {
                gold: ['lethalArrow'],
                blue: ['explosiveArrow', 'sharpenArrows', 'galeArrow'],
                green: ['focusedShots', 'arrowDeluge', 'bowOfBlessing', 'sealArrow', 'naturesResolve']
            },
            pvp: {
                gold: ['agonisingArrow'],
                blue: ['lethalArrow', 'explosiveArrow', 'ragingWindArrow'],
                green: ['focusedShots', 'arrowDeluge', 'bowOfBlessing', 'sealArrow', 'naturesResolve']
            }
        },
        sorcerer: {
            pve: {
                gold: ['glacialShard'],
                blue: ['flameSpray', 'summonStone', 'windCutDown'],
                green: ['cycloneStrike', 'arcaneThunderbolt', 'iceHarpoon', 'exchangeVitality', 'elementalWard']
            },
            pvp: {
                gold: ['winterArmour'],
                blue: ['sleepingStorm', 'windCutDown', 'summonWhirlwind'],
                green: ['cycloneStrike', 'arcaneThunderbolt', 'iceHarpoon', 'iceSheet', 'elementalWard']
            }
        },
        spiritmaster: {
            pve: {
                gold: ['infernalBlight'],
                blue: ['magicImplosion', 'infernalPain', 'cycloneServant'],
                green: ['curseOfMagicPower', 'cycloneOfWrath', 'wildernessRage', 'commandWallOfProtection', 'enmitySwap']
            },
            pvp: {
                gold: ['infernalBlight'],
                blue: ['magicImplosion', 'infernalPain', 'shackleOfVulnerability'],
                green: ['curseOfMagicPower', 'cycloneOfWrath', 'wildernessRage', 'witheringGloom', 'earthProtection']
            }
        },
        cleric: {
            pve: {
                gold: ['callLightning'],
                blue: ['sacrificialPower', 'chainOfSuffering', 'rippleOfPurification'],
                green: ['lightningBoltOfRetaliation', 'savingGrace', 'nobleGrace', 'festeringWound', 'enfeeblingBurst']
            },
            pvp: {
                gold: ['callLightning'],
                blue: ['sacrificialPower', 'chainOfSuffering', 'rippleOfPurification'],
                green: ['lightningBoltOfRetaliation', 'savingGrace', 'nobleGrace', 'festeringWound', 'enfeeblingBurst']
            }
        },
        chanter: {
            pve: {
                gold: ['numbingBlow'],
                blue: ['blessingOfWind', 'mountainCrash', 'healingBurst'],
                green: ['healingConduit', 'annihilation', 'soulLock', 'deadlyBlow', 'wordOfInspiration']
            },
            pvp: {
                gold: ['numbingBlow'],
                blue: ['blessingOfWind', 'mountainCrash', 'healingBurst'],
                green: ['wordOfLife', 'annihilation', 'soulLock', 'rise', 'wordOfInspiration']
            }
        },
        aethertech: {
            pve: {
                gold: ['leapOfDestruction'],
                blue: ['powerIncrease', 'lifelineSlash', 'stormStrike'],
                green: ['idiumBombardment', 'idiumRay', 'waveOfDestruction', 'magicFocus', 'cleaveArmour']
            },
            pvp: {
                gold: ['idShield'],
                blue: ['powerIncrease', 'magicVeil', 'mobilityBoost'],
                green: ['idiumBombardment', 'idiumRay', 'waveOfDestruction', 'absorbingReflectorShield', 'cleaveArmour']
            }
        },
        gunner: {
            pve: {
                gold: ['soulCannon'],
                blue: ['fissureCannonball', 'giftOfMagicPower', 'enhanceMagicProjectile'],
                green: ['spiritCannon', 'frostCannon', 'flameBombardment', 'rapidVolley', 'soulsuckerShot']
            },
            pvp: {
                gold: ['soulCannon'],
                blue: ['fissureCannonball', 'giftOfMagicPower', 'bindingCannonball'],
                green: ['spiritCannon', 'frostCannon', 'flameBombardment', 'shockCannon', 'soulsuckerShot']
            }
        },
        bard: {
            pve: {
                gold: ['disharmony'],
                blue: ['magicBoostMode', 'moskieRequiem', 'melodyOfJoy'],
                green: ['marchOfTheBees', 'harmonyOfDesolation', 'requiemOfOblivion', 'variationOfPeace', 'healingVariation']
            },
            pvp: {
                gold: ['disharmony'],
                blue: ['magicBoostMode', 'moskieRequiem', 'paralysisResonation'],
                green: ['marchOfTheBees', 'harmonyOfDesolation', 'requiemOfOblivion', 'danceOfTheJester', 'melodyOfDiscipline']
            }
        },
        painter: {
            pve: {
                gold: ['colourFist'],
                blue: ['colourOutbreak', 'flashPortrait', 'intoTheBlack'],
                green: ['lifeBinding', 'colourFight', 'colourOfSilence', 'colourProtectionShield', 'colourfulRain']
            },
            pvp: {
                gold: ['imprisonment'],
                blue: ['newWork', 'intoTheBlack', 'colourOutbreak'],
                green: ['lifeBinding', 'colourFight', 'colourOfSilence', 'colourProtectionShield', 'colourfulRain']
            }
        },
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
        return '<div class="stigma-tooltip-grid">' + entries.map(function(item) { return renderStigmaTooltipCard(item); }).join('') + '</div>';
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

    function createPresetStigmaBuild(className, type) {
        var cfg = getStigmaConfig(className);
        if (!cfg) return createDefaultStigmaBuild(className);

        var build = createDefaultStigmaBuild(className);
        if (!build) return null;

        var presetData = (STIGMA_PRESET_BUILD_MAP[className] || {})[type] || null;
        if (presetData) {
            GC_STIGMA_TIERS.forEach(function(tier) {
                var tierPreset = Array.isArray(presetData[tier]) ? presetData[tier] : [];
                for (var i = 0; i < build[tier].length; i++) {
                    build[tier][i] = tierPreset[i] || null;
                }
            });
        }

        normalizeStigmaBuild(className, build);
        return build;
    }

    var STIGMA_SHORT_SHARE_SLOT_ORDER = [
        { tier: 'gold', index: 0 },
        { tier: 'blue', index: 0 },
        { tier: 'blue', index: 1 },
        { tier: 'blue', index: 2 },
        { tier: 'green', index: 0 },
        { tier: 'green', index: 1 },
        { tier: 'green', index: 2 },
        { tier: 'green', index: 3 },
        { tier: 'green', index: 4 }
    ];

    function encodeShortStigmaShare(className, build) {
        var classIndex = CLASS_ORDER.indexOf(className);
        if (classIndex < 0) return null;

        var code = classIndex.toString(36);
        var cfg = getStigmaConfig(className);
        STIGMA_SHORT_SHARE_SLOT_ORDER.forEach(function(slot) {
            var value = '0';
            if (build && build[slot.tier] && build[slot.tier][slot.index]) {
                var key = build[slot.tier][slot.index];
                var tierList = cfg ? (cfg.tiers[slot.tier] || []) : [];
                var optionIndex = tierList.findIndex(function(def) { return def.key === key; });
                if (optionIndex !== -1) {
                    value = (optionIndex + 1).toString(36);
                }
            }
            code += value;
        });
        return code;
    }

    function decodeShortStigmaShare(code) {
        if (typeof code !== 'string' || code.length !== 10) return null;
        code = code.toLowerCase();

        var classIndex = parseInt(code[0], 36);
        if (isNaN(classIndex) || classIndex < 0 || classIndex >= CLASS_ORDER.length) return null;

        var className = CLASS_ORDER[classIndex];
        if (!classHasStigmas(className)) return null;

        var cfg = getStigmaConfig(className);
        if (!cfg) return null;

        var build = createDefaultStigmaBuild(className);
        if (!build) return null;

        STIGMA_SHORT_SHARE_SLOT_ORDER.forEach(function(slot, index) {
            var char = code[index + 1];
            var value = parseInt(char, 36);
            if (!isNaN(value) && value > 0) {
                var optionIndex = value - 1;
                var tierList = cfg.tiers[slot.tier] || [];
                if (optionIndex >= 0 && optionIndex < tierList.length) {
                    build[slot.tier][slot.index] = tierList[optionIndex].key;
                }
            }
        });

        normalizeStigmaBuild(className, build);
        return { className: className, build: build };
    }

    function decodeSharedBuildFromUrl() {
        if (typeof URLSearchParams === 'undefined') return false;
        try {
            var params = new URLSearchParams(window.location.search);
            var code = params.get('stigma');
            if (!code) return false;

            var decoded = decodeShortStigmaShare(code);
            if (!decoded) return false;

            selectedClass = decoded.className;
            buildsByClass[selectedClass] = decoded.build;
            return true;
        } catch (e) {
            return false;
        }
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
        var optionGroups = getStigmaOptionGroups(selectedClass, tier, slotIndex, build);
        var selectedDef = getStigmaDefinition(selectedClass, current);
        var slotHasIcon = !!(selectedDef && selectedDef.icon);
        var slotTitle = selectedDef ? (selectedDef.name + ' | ' + (selectedDef.cooldown || '-') + ' | ' + (selectedDef.description || '')) : 'No stigma selected';
        var slotTooltipHtml = selectedDef ? buildStigmaTooltipHtml(selectedDef) : '';
        var canClear = !!current;
        var optionCount = optionGroups.reduce(function(count, group) { return count + group.defs.length; }, 0);
        var optionCols = Math.max(1, Math.min(optionCount, 4));

        var html = '<div class="stigma-slot stigma-map-node">';
        html += '<div class="stigma-current stigma-tier-' + tier + (selectedDef ? ' is-filled gc-item-tooltip-trigger' : '') + '" tabindex="0" role="button" onclick="StigmaApp.toggleSlotOptions(\'' + tier + '\',' + slotIndex + ')" aria-label="' + escapeHtml(slotTitle) + '"' + (slotTooltipHtml ? ' data-tooltip-html="' + escapeHtml(slotTooltipHtml) + '"' : '') + '>';
        if (slotHasIcon) html += '<img src="' + selectedDef.icon + '" class="stigma-current-icon" alt="">';
        html += '</div>';
        if (canClear) {
            html += '<button type="button" class="stigma-clear-btn" aria-label="Remove stigma" title="Remove stigma" onclick="StigmaApp.clearStigma(\'' + tier + '\',' + slotIndex + ')">✕</button>';
        }

        html += '<div class="stigma-option-grid" style="--stigma-option-cols:' + optionCols + ';">';
        optionGroups.forEach(function(group) {
            html += '<div class="stigma-option-group-label">' + escapeHtml(group.tier.charAt(0).toUpperCase() + group.tier.slice(1)) + '</div>';
            group.defs.forEach(function(def) {
                var defTitle = def.name + ' | ' + (def.cooldown || '-') + ' | ' + (def.description || '');
                var optionTooltipHtml = buildStigmaTooltipHtml(def);
                html += '<button class="stigma-option gc-item-tooltip-trigger stigma-tier-' + group.tier + (def.key === current ? ' selected' : '') + '" ' + (locked ? 'disabled' : '') + ' data-tooltip-html="' + escapeHtml(optionTooltipHtml) + '" aria-label="' + escapeHtml(defTitle) + '" onclick="StigmaApp.setStigma(\'' + tier + '\',' + slotIndex + ',\'' + def.key + '\')">';
                html += '<img src="' + def.icon + '" class="stigma-option-icon" alt="">';
                html += '</button>';
            });
        });

        html += '</div>';
        if (locked) html += '<div class="stigma-slot-note">Locked</div>';
        html += '</div>';
        return html;
    }

    function isMobileScreen() {
        return !!(
            (window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches) ||
            ((window.innerWidth || 0) <= 768)
        );
    }

    var stigmaMobileModal = null;
    var stigmaMobileModalTitle = null;
    var stigmaMobileModalContent = null;

    function createStigmaMobileModal() {
        if (stigmaMobileModal) return;

        var existing = document.getElementById('stigma-mobile-modal');
        if (existing) {
            stigmaMobileModal = existing;
        } else {
            stigmaMobileModal = document.createElement('div');
            stigmaMobileModal.id = 'stigma-mobile-modal';
            stigmaMobileModal.className = 'stigma-mobile-modal';
            stigmaMobileModal.innerHTML =
                '<div class="stigma-mobile-modal-backdrop"></div>' +
                '<div class="stigma-mobile-modal-dialog">' +
                    '<button type="button" class="stigma-mobile-close" aria-label="Close">✕</button>' +
                    '<div class="stigma-mobile-dialog-title"></div>' +
                    '<div class="stigma-mobile-dialog-content"></div>' +
                '</div>';
            document.body.appendChild(stigmaMobileModal);
        }

        stigmaMobileModalTitle = stigmaMobileModal.querySelector('.stigma-mobile-dialog-title');
        stigmaMobileModalContent = stigmaMobileModal.querySelector('.stigma-mobile-dialog-content');

        var closeButton = stigmaMobileModal.querySelector('.stigma-mobile-close');
        var backdrop = stigmaMobileModal.querySelector('.stigma-mobile-modal-backdrop');
        if (closeButton) closeButton.addEventListener('click', closeStigmaMobileModal);
        if (backdrop) backdrop.addEventListener('click', closeStigmaMobileModal);
    }

    function openStigmaMobileModal(title, html) {
        createStigmaMobileModal();
        if (stigmaMobileModalTitle) stigmaMobileModalTitle.textContent = title || '';
        if (stigmaMobileModalContent) stigmaMobileModalContent.innerHTML = html || '';
        stigmaMobileModal.classList.add('is-open');
        document.body.classList.add('stigma-modal-open');
    }

    function closeStigmaMobileModal() {
        if (!stigmaMobileModal) return;
        stigmaMobileModal.classList.remove('is-open');
        document.body.classList.remove('stigma-modal-open');
    }

    function openStigmaTooltipModal(tooltipHtml, title) {
        if (!tooltipHtml) return;
        openStigmaMobileModal(title || 'Details', tooltipHtml);
    }

    function renderStigmaSlotModal(tier, slotIndex) {
        var build = ensureClassBuild(selectedClass);
        if (!build) return;

        var locked = isStigmaSlotLocked(selectedClass, tier, slotIndex, build);
        var current = build[tier][slotIndex] || '';
        var optionGroups = getStigmaOptionGroups(selectedClass, tier, slotIndex, build);
        var title = 'Choose ' + tier + ' stigma';

        var html = '<div class="stigma-mobile-modal-body">';
        html += '<div class="stigma-mobile-dialog-header">';
        html += '<div class="stigma-mobile-dialog-title-text">' + escapeHtml(title) + '</div>';
        if (current) {
            html += '<button type="button" class="stigma-mobile-action-button" onclick="StigmaApp.clearStigma(\'' + tier + '\',' + slotIndex + ')">Remove</button>';
        }
        html += '</div>';

        if (!optionGroups.length) {
            html += '<div class="stigma-mobile-empty">No stigmas available.</div>';
        } else {
            optionGroups.forEach(function(group) {
                html += '<div class="stigma-mobile-group">';
                html += '<div class="stigma-mobile-group-label">' + escapeHtml(group.tier.charAt(0).toUpperCase() + group.tier.slice(1)) + '</div>';
                html += '<div class="stigma-option-grid-mobile">';
                group.defs.forEach(function(def) {
                    html += '<button type="button" class="stigma-option stigma-tier-' + group.tier + (def.key === current ? ' selected' : '') + '" ' + (locked ? 'disabled' : '') + ' onclick="StigmaApp.setStigma(\'' + tier + '\',' + slotIndex + ',\'' + def.key + '\')">';
                    html += '<img src="' + def.icon + '" class="stigma-option-icon" alt="">';
                    html += '</button>';
                });
                html += '</div>';
                html += '</div>';
            });
        }

        html += '</div>';
        openStigmaMobileModal(title, html);
    }

    function buildVisionLegendData(className) {
        var cfg = getStigmaConfig(className);
        if (!cfg) return { groups: [], fallbackVisionKey: null };

        var goldDefs = cfg.tiers.gold || [];
        var blueDefs = cfg.tiers.blue || [];
        var fallbackVisionKey = resolveStigmaVisionKey(className, createDefaultStigmaBuild(className)) || (cfg.tiers.vision && cfg.tiers.vision[0] ? cfg.tiers.vision[0].key : null);
        var grouped = {};

        for (var g = 0; g < goldDefs.length; g++) {
            for (var i = 0; i < blueDefs.length; i++) {
                for (var j = i + 1; j < blueDefs.length; j++) {
                    var sampleBuild = createDefaultStigmaBuild(className);
                    sampleBuild.gold[0] = goldDefs[g].key;
                    sampleBuild.blue[0] = blueDefs[i].key;
                    sampleBuild.blue[1] = blueDefs[j].key;
                    var visionKey = resolveStigmaVisionKey(className, sampleBuild) || fallbackVisionKey;

                    if (visionKey === fallbackVisionKey) continue;
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
        var html = '<button type="button" class="' + cls + '" data-tooltip-html="' + escapeHtml(tooltipHtml) + '" data-tooltip-title="' + escapeHtml(def.name) + '" aria-label="' + escapeHtml(label) + '"' + (extraAttrs || '') + '>';
        html += '<img src="' + def.icon + '" alt="">';
        html += '</button>';
        return html;
    }

    function renderMobileSkillDetailCard(def) {
        if (!def) return '';
        var html = '<div class="stigma-mobile-skill-card">';
        html += '<div class="stigma-mobile-skill-card-header">';
        html += '<img src="' + def.icon + '" class="stigma-mobile-skill-icon" alt="">';
        html += '<div class="stigma-mobile-skill-title">' + escapeHtml(def.name) + '</div>';
        html += '</div>';
        html += '<div class="stigma-mobile-skill-meta">';
        if (def.cooldown) html += '<div class="stigma-mobile-skill-meta-line">Cooldown: ' + escapeHtml(def.cooldown) + '</div>';
        if (def.castTime) html += '<div class="stigma-mobile-skill-meta-line">Cast Time: ' + escapeHtml(def.castTime) + '</div>';
        html += '</div>';
        if (def.description) html += '<div class="stigma-mobile-skill-description">' + escapeHtml(def.description) + '</div>';
        html += '</div>';
        return html;
    }

    function renderSkillDetailsForClass(className) {
        var cfg = getStigmaConfig(className);
        if (!cfg) return '<div class="stigma-mobile-empty">No skills available for this class.</div>';
        var html = '';
        ['vision', 'gold', 'blue', 'green'].forEach(function(tier) {
            var defs = cfg.tiers[tier] || [];
            if (!defs.length) return;
            var label = tier === 'vision' ? 'Vision Skills' : (tier.charAt(0).toUpperCase() + tier.slice(1) + ' Skills');
            html += '<div class="stigma-mobile-group">';
            html += '<div class="stigma-mobile-group-label">' + escapeHtml(label) + '</div>';
            defs.forEach(function(def) {
                html += renderMobileSkillDetailCard(def);
            });
            html += '</div>';
        });
        return html;
    }

    function renderVisionLegend(className, showMobileLegendButton) {
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
                (group.combos || []).forEach(function(combo, index) {
                    html += '<div class="stigma-legend-combo">';
                    //html += renderLegendIcon(combo.gold);
                    if (index === 1) {
                        html += renderLegendIcon(combo.gold);
                        html += '<span class="stigma-legend-plus">+</span>';
                    }else {
                        html += '<div class="stigma-legend-icon-placeholder"></div>';
                        html += '<span class="stigma-legend-plus is-hidden">+</span>';
                    }
                    //html += '<span class="stigma-legend-plus">+</span>';
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

        if (showMobileLegendButton && isMobileScreen()) {
            html += '<button type="button" class="stigma-mobile-open-btn" onclick="StigmaApp.openSkillLegendMobile()">Show Skills Details</button>';
        }

        html += '</div>';
        return html;
    }

    function renderBuilder() {
        var el = document.getElementById('stigma-builder');
        if (!el) return;

        if (!classHasStigmas(selectedClass)) {
            el.innerHTML = '<div class="stigma-panel"><div class="stigma-title">No stigma data for this class yet</div></div>';
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

        var html = '<div class="stigma-panel">';
        html += '<div class="stigma-builder-head">';
        html += '<div class="stigma-preset-actions">';
        html += '<button type="button" class="stigma-preset-btn stigma-preset-btn-pve" onclick="StigmaApp.applyPresetBuild(\'pve\')" aria-label="Developer\'s PvE build" title="Developer\'s PvE build">';
        html += '<img src="../assets/icons/icon_pve.png" alt="PVE">';
        html += '</button>';
        html += '<button type="button" class="stigma-preset-btn stigma-preset-btn-pvp" onclick="StigmaApp.applyPresetBuild(\'pvp\')" aria-label="Developer\'s PvP build" title="Developer\'s PvP build">';
        html += '<img src="../assets/icons/icon_pvp.png" alt="PVP">';
        html += '</button>';
        html += '<button type="button" class="stigma-preset-btn stigma-share-btn" onclick="StigmaApp.shareCurrentBuild()" aria-label="Share current setup" title="Share current setup">';
        html += '<span class="stigma-share-label">Share Build</span>';
        html += '</button>';
        html += '</div>';
        html += '<button class="gc-reset-btn" onclick="StigmaApp.resetClassStigmas()" aria-label="Reset current class stigmas" title="Reset current class stigmas" data-tooltip-html="' + escapeHtml(buildActionTooltipHtml('Reset Build', 'Clears the current class stigma selection and restores an empty board.')) + '">↺</button>';
        html += '</div>';

        html += '<div class="stigma-two-col">';
        html += '<div class="stigma-left">';
        html += '<div class="stigma-layout">';
        html += '<div class="stigma-main-map' + (visionActive ? ' is-vision-active' : '') + '" style="--stigma-base-width:' + STIGMA_LAYOUT.width + ';--stigma-base-height:' + STIGMA_LAYOUT.height + ';">';

        STIGMA_LAYOUT.slots.forEach(function(slot) {
            html += '<div class="stigma-map-slot" style="left:' + toPercent(slot.x, STIGMA_LAYOUT.width) + ';top:' + toPercent(slot.y, STIGMA_LAYOUT.height) + ';">';
            html += renderSlot(slot.tier, slot.index, build);
            html += '</div>';
        });

            if (unlocked && vision && vision.icon) {
                var visionTooltipHtml = buildStigmaTooltipHtml(vision);
                var visionLabel = vision.name + ' | ' + (vision.cooldown || '-') + ' | ' + (vision.description || '');
                html += '<div class="stigma-map-slot stigma-vision-marker" style="left:' + toPercent(STIGMA_LAYOUT.vision.x, STIGMA_LAYOUT.width) + ';top:' + toPercent(STIGMA_LAYOUT.vision.y, STIGMA_LAYOUT.height) + ';">';
                html += '<button type="button" class="stigma-vision-trigger gc-item-tooltip-trigger" tabindex="0" aria-label="' + escapeHtml(visionLabel) + '" data-tooltip-title="' + escapeHtml(vision.name) + '" data-tooltip-html="' + escapeHtml(visionTooltipHtml) + '">';
                html += '<img src="' + vision.icon + '" class="stigma-vision-icon" alt="">';
                html += '</button>';
                html += '</div>';
            }

        html += '</div>';
        html += '</div>';
        html += '</div>';

        html += renderVisionLegend(selectedClass, true);
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
            if (build[tier][slotIndex] && build[tier][slotIndex] === nextKey) return;

            var locked = isStigmaSlotLocked(selectedClass, tier, slotIndex, build);
            if (locked && nextKey) return;

            if (nextKey) {
                var def = getStigmaDefinition(selectedClass, nextKey);
                var tierMap = getStigmaTierMap(selectedClass);
                var stigmaTier = tierMap[nextKey];
                if (!def || !isStigmaSlotCompatible(tier, stigmaTier)) return;

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
            closeStigmaMobileModal();
            renderBuilder();
        },

        resetClassStigmas: function() {
            if (!classHasStigmas(selectedClass)) return;
            buildsByClass[selectedClass] = createDefaultStigmaBuild(selectedClass);
            normalizeStigmaBuild(selectedClass, buildsByClass[selectedClass]);
            saveState();
            renderBuilder();
        },

        shareCurrentBuild: function() {
            var build = ensureClassBuild(selectedClass);
            if (!build) return;

            var code = encodeShortStigmaShare(selectedClass, build);
            if (!code) return;

            var baseUrl = window.location.href.split('?')[0];
            var shareUrl = baseUrl + '?stigma=' + encodeURIComponent(code);

            function fallbackCopy(text) {
                try {
                    var ta = document.createElement('textarea');
                    ta.style.position = 'fixed';
                    ta.style.top = 0;
                    ta.style.left = 0;
                    ta.style.width = '2em';
                    ta.style.height = '2em';
                    ta.style.padding = 0;
                    ta.style.border = 'none';
                    ta.style.outline = 'none';
                    ta.style.boxShadow = 'none';
                    ta.style.background = 'transparent';
                    ta.value = text;
                    document.body.appendChild(ta);
                    ta.select();
                    var ok = document.execCommand('copy');
                    document.body.removeChild(ta);
                    return !!ok;
                } catch (e) {
                    try { if (ta && ta.parentNode) ta.parentNode.removeChild(ta); } catch (e2) {}
                    return false;
                }
            }

            var btn = document.querySelector('.stigma-preset-actions .stigma-share-btn') || document.querySelector('.stigma-share-btn');

            function animateButton() {
                if (!btn) return;
                btn.classList.remove('copied');
                // force reflow to restart animation
                // eslint-disable-next-line no-unused-expressions
                btn.offsetWidth;
                btn.classList.add('copied');
                setTimeout(function() {
                    btn.classList.remove('copied');
                }, 1500);
            }

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(shareUrl).then(function() {
                    if (typeof showShareToast === 'function') showShareToast('✓ Link copied to clipboard!');
                    animateButton();
                    var labelEl = btn ? btn.querySelector('.stigma-share-label') : null;
                    var original = labelEl ? labelEl.textContent : null;
                    if (labelEl) {
                        labelEl.textContent = 'Link copied ✓';
                        setTimeout(function() {
                            if (labelEl) labelEl.textContent = original;
                        }, 1500);
                    }
                }).catch(function() {
                    var ok = fallbackCopy(shareUrl);
                    if (ok) {
                        if (typeof showShareToast === 'function') showShareToast('✓ Link copied to clipboard!');
                        animateButton();
                        var labelEl = btn ? btn.querySelector('.stigma-share-label') : null;
                        var original = labelEl ? labelEl.textContent : null;
                        if (labelEl) {
                            labelEl.textContent = 'Link copied ✓';
                            setTimeout(function() {
                                if (labelEl) labelEl.textContent = original;
                            }, 1500);
                        }
                    } else {
                        if (typeof showShareToast === 'function') showShareToast('Could not copy link', true);
                    }
                });
            } else {
                var ok = fallbackCopy(shareUrl);
                if (ok) {
                    if (typeof showShareToast === 'function') showShareToast('✓ Link copied to clipboard!');
                    animateButton();
                    var labelEl = btn ? btn.querySelector('.stigma-share-label') : null;
                    var original = labelEl ? labelEl.textContent : null;
                    if (labelEl) {
                        labelEl.textContent = 'Link copied ✓';
                        setTimeout(function() {
                            if (labelEl) labelEl.textContent = original;
                        }, 1500);
                    }
                } else {
                    if (typeof showShareToast === 'function') showShareToast('Could not copy link', true);
                }
            }
        },

        openSkillLegendMobile: function() {
            var legendHtml = renderSkillDetailsForClass(selectedClass);
            openStigmaMobileModal('All Stigmas Details', legendHtml);
        },

        clearStigma: function(tier, slotIndex) {
            StigmaApp.setStigma(tier, slotIndex, '');
        },

        toggleSlotOptions: function(tier, slotIndex) {
            if (isMobileScreen()) {
                renderStigmaSlotModal(tier, slotIndex);
            }
        },

        applyPresetBuild: function(type) {
            if (!classHasStigmas(selectedClass)) return;
            if (type !== 'pve' && type !== 'pvp') return;

            var build = createPresetStigmaBuild(selectedClass, type);
            if (!build) return;

            buildsByClass[selectedClass] = build;
            normalizeStigmaBuild(selectedClass, build);
            saveState();
            renderBuilder();
        },

        applyVisionLegendFirstCombo: function(goldKey, blueAKey, blueBKey) {
            var build = ensureClassBuild(selectedClass);
            if (!build) return;
            if (!goldKey || !blueAKey || !blueBKey) return;

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
    decodeSharedBuildFromUrl();
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

    function canUseInteractiveTooltips() {
        return !isMobileScreen() && !!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    }

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
        if (!canUseInteractiveTooltips()) return;
        var trigger = e.target.closest('.gc-item-tooltip-trigger[data-tooltip-html]');
        if (!trigger) return;
        if (activeItemTooltipTrigger === trigger) {
            positionGlobalItemTooltip(trigger);
            return;
        }
        showGlobalItemTooltip(trigger);
    });

    document.addEventListener('mouseout', function(e) {
        if (!canUseInteractiveTooltips()) return;
        if (!activeItemTooltipTrigger) return;
        var leftTrigger = e.target.closest('.gc-item-tooltip-trigger[data-tooltip-html]');
        if (!leftTrigger || leftTrigger !== activeItemTooltipTrigger) return;
        if (e.relatedTarget && activeItemTooltipTrigger.contains(e.relatedTarget)) return;
        hideGlobalItemTooltip();
    });

    document.addEventListener('focusin', function(e) {
        if (!canUseInteractiveTooltips()) return;
        var trigger = e.target.closest('.gc-item-tooltip-trigger[data-tooltip-html]');
        if (!trigger) return;
        showGlobalItemTooltip(trigger);
    });

    document.addEventListener('focusout', function(e) {
        if (!canUseInteractiveTooltips()) return;
        var trigger = e.target.closest('.gc-item-tooltip-trigger[data-tooltip-html]');
        if (!trigger) return;
        if (e.relatedTarget && trigger.contains(e.relatedTarget)) return;
        hideGlobalItemTooltip();
    });

    document.addEventListener('click', function(e) {
        if (isMobileScreen()) {
            var legendTrigger = e.target.closest('.stigma-legend-icon.gc-item-tooltip-trigger, .stigma-vision-trigger.gc-item-tooltip-trigger');
            if (legendTrigger && !e.target.closest('#stigma-mobile-modal')) {
                openStigmaTooltipModal(
                    legendTrigger.getAttribute('data-tooltip-html'),
                    legendTrigger.getAttribute('data-tooltip-title') || legendTrigger.getAttribute('aria-label')
                );
                return;
            }
        }

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
