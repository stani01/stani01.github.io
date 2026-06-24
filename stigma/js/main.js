'use strict';

(function() {
    var STORAGE_KEY = 'stigma-builder-state-v1';
    var selectedClass = 'gladiator';
    var buildsByClass = {};
    var daevanionUsedByClass = {};
    var stigmaActiveTab = 'stigma';
    var isDaevanionWarningCollapsed = false;
    var activeSpiritKey = 'fire';

    // Currently-shared build code reflected in the URL as the compact "?=CODE"
    // param. Tied to one tab; cleared once the user navigates to the other tab.
    var pendingShareCode = null;
    var pendingShareTab = null;

    var SPIRIT_OPTIONS = [
        { key: 'water', label: 'Water', icon: '../assets/icons/cbt_el_light_summon_waterelemental_g1.png' },
        { key: 'wind', label: 'Wind', icon: '../assets/icons/cbt_el_light_summon_windelemental_g1.png' },
        { key: 'earth', label: 'Earth', icon: '../assets/icons/cbt_el_light_summon_earthelemental_g1.png' },
        { key: 'fire', label: 'Fire', icon: '../assets/icons/cbt_el_light_summon_fireelemental_g1.png' },
        { key: 'magma', label: 'Magma', icon: '../assets/icons/cbt_el_dark_summon_magmaelemental_g1.png' },
        { key: 'tempest', label: 'Tempest', icon: '../assets/icons/cbt_el_light_summon_tempestelemental_g1.png' }
    ];

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
                gold: ['sharpenArrows'],
                blue: ['lethalArrow', 'explosiveArrow', 'galeArrow'],
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

    // One char per daevanion skill (in class skill order), same codes as share links:
    // 0 = no explicit selection (falls back to default), 1-6 = variants, 7 = default skill.
    // Example for 6-skill classes: pve: '111111', pvp: '444444'
    var DAEVANION_PRESET_SHORT_CODE_MAP = {
        gladiator: {
            pve: '112222',
            pvp: '212211'
        },
        templar: {
            pve: '123212',
            pvp: '212221'
        },
        assassin: {
            pve: '121112',
            pvp: '121222'
        },
        ranger: {
            pve: '112222',
            pvp: '112221'
        },
        sorcerer: {
            pve: '112222',
            pvp: '112221'
        },
        spiritmaster: {
            pve: '112222',
            pvp: '112221'
        },
        cleric: {
            pve: '112222',
            pvp: '112221'
        },
        chanter: {
            pve: '112222',
            pvp: '112221'
        },
        aethertech: {
            pve: '112222',
            pvp: '112221'
        },
        gunner: {
            pve: '112222',
            pvp: '112221'
        },
        bard: {
            pve: '112222',
            pvp: '112221'
        },
        painter: {
            pve: '112222',
            pvp: '112221'
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

    function formatTooltipInlineValue(value) {
        return highlightTooltipNumbers(decorateTooltipGrowth(escapeHtml(value || '')));
    }

    function highlightTooltipNumbers(text) {
        return String(text || '').replace(/[0-9]+(?:\.[0-9]+)?/g, function(match, offset, source) {
            if (offset >= 2 && source[offset - 2] === '&' && source[offset - 1] === '#') {
                return match;
            }
            return '<span class="gc-item-tooltip-number">' + match + '</span>';
        });
    }

    function decorateTooltipGrowth(text) {
        return String(text || '').replace(/\(([+-])\s*[^)\n]+\)/gi, function(match, sign) {
            if (/per level/i.test(match)) return match;
            var classes = 'gc-item-tooltip-growth';
            if (sign === '-') classes += ' is-reduction';
            var cleanText = match.replace(/[()]/g, '');
            return '<span class="' + classes + '">' + cleanText + '</span>';
        });
    }

    function formatTooltipDescription(value) {
        var text = formatTooltipInlineValue(value || '');
        return text.replace(/\n/g, '<br>');
    }

    function getEffectiveCastTime(def) {
        if (!def) return 'Cast Instantly';
        return def.castTime || 'Cast Instantly';
    }

    function normalizeSpiritKey(value) {
        var key = String(value || '').toLowerCase();
        for (var i = 0; i < SPIRIT_OPTIONS.length; i++) {
            if (SPIRIT_OPTIONS[i].key === key) return key;
        }
        return 'fire';
    }

    function inferSpiritKeyFromLinkedTooltip(item) {
        if (!item || typeof item !== 'object') return null;
        var text = [item.key, item.name, item.description].filter(Boolean).join(' ').toLowerCase();
        if (!text) return null;

        var matches = [];
        SPIRIT_OPTIONS.forEach(function(option) {
            var rx = new RegExp('\\b' + option.key + '\\b', 'i');
            if (rx.test(text)) matches.push(option.key);
        });
        return matches.length === 1 ? matches[0] : null;
    }

    function matchesActiveSpirit(linkedDef) {
        if (selectedClass !== 'spiritmaster' || !linkedDef || typeof linkedDef !== 'object') return true;

        var explicitKey = normalizeSpiritKey(linkedDef.spirit || linkedDef.spiritKey || linkedDef.spiritType || '');
        if (linkedDef.spirit || linkedDef.spiritKey || linkedDef.spiritType) {
            return explicitKey === activeSpiritKey;
        }

        var spiritList = linkedDef.spirits || linkedDef.onlyForSpirits;
        if (Array.isArray(spiritList) && spiritList.length) {
            for (var i = 0; i < spiritList.length; i++) {
                if (normalizeSpiritKey(spiritList[i]) === activeSpiritKey) return true;
            }
            return false;
        }

        var inferred = inferSpiritKeyFromLinkedTooltip(linkedDef);
        if (inferred) return inferred === activeSpiritKey;
        return true;
    }

    function renderSpiritSelectorControls() {
        if (selectedClass !== 'spiritmaster') return '';

        var html = '<div class="stigma-spirit-selector-wrap">';
        html += '<div class="stigma-spirit-selector-label">Select spirit</div>';
        html += '<div class="stigma-spirit-selector" aria-label="Spirit selection">';
        SPIRIT_OPTIONS.forEach(function(option) {
            var isSelected = activeSpiritKey === option.key;
            html += '<button type="button" class="stigma-spirit-btn' + (isSelected ? ' is-active' : '') + '" onclick="StigmaApp.setSpiritFilter(\'' + option.key + '\')" aria-label="' + escapeHtml(option.label + ' Spirit') + '" title="' + escapeHtml(option.label + ' Spirit') + '">';
            html += '<img src="' + option.icon + '" alt="' + escapeHtml(option.label) + '">';
            html += '</button>';
        });
        html += '</div>';
        html += '</div>';
        return html;
    }

    function renderStigmaTooltipCard(def) {
        if (!def) return '';
        var aoeType = def.areaIcon;
        var aoeText = def.area;
        var showAoe = (aoeType !== undefined || aoeText !== undefined);
        var aoeIconMap = {
            'targetConic': '../assets/icons/targetConic.png',
            'targetCircle': '../assets/icons/targetCircle.png',
            'targetSingle': '../assets/icons/targetSingle.png',
            'targetRect': '../assets/icons/targetRect.png'
        };
        var aoeIcon = aoeType ? aoeIconMap[aoeType] || aoeIconMap['targetConic'] : '';

        var html = '<div class="gc-item-tooltip-card">';
        html += '<table class="gc-item-tooltip-table">';
        html += '<tr class="gc-item-tooltip-table-row-title">';
        html += '<td class="gc-item-tooltip-table-cell-title" colspan="3">' + escapeHtml(def.name || '') + '</td>';
        html += '</tr>';
        html += '<tr class="gc-item-tooltip-table-row-meta">';
        html += '<td class="gc-item-tooltip-table-cell-icon">';
        html += '<div class="gc-item-tooltip-item-icons">';
        html += '<img src="../assets/icons/icon_frame_2.png" class="gc-item-tooltip-item-icon-back" alt="">';
        html += '<img src="' + escapeHtml(def.icon || '') + '" class="gc-item-tooltip-item-icon" alt="">';
        html += '</div>';
        html += '</td>';
        html += '<td class="gc-item-tooltip-table-cell-meta"' + (showAoe ? '' : ' colspan="2"') + '>';
        if (def.target) html += '<div class="gc-item-tooltip-meta-line">Target: ' + formatTooltipInlineValue(def.target) + '</div>';
        if (def.usageDistance) html += '<div class="gc-item-tooltip-meta-line">Usage distance: ' + formatTooltipInlineValue(def.usageDistance) + '</div>';
        if (def.usageCost) html += '<div class="gc-item-tooltip-meta-line">Usage Cost: ' + formatTooltipInlineValue(def.usageCost) + '</div>';
        if (def.cooldown) html += '<div class="gc-item-tooltip-meta-line">Cooldown: ' + formatTooltipInlineValue(def.cooldown) + '</div>';
        html += '<div class="gc-item-tooltip-meta-line">Cast Time: ' + formatTooltipInlineValue(getEffectiveCastTime(def)) + '</div>';
        if (def.pvpDuration) html += '<div class="gc-item-tooltip-meta-line">PvP Duration: ' + formatTooltipInlineValue(def.pvpDuration) + '</div>';
        html += '</td>';
        if (showAoe) {
            html += '<td class="gc-item-tooltip-table-cell-area">';
            html += '<div class="gc-item-tooltip-aoe-title">Area of application</div>';
            if (aoeIcon) html += '<img class="gc-item-tooltip-aoe-icon" src="' + aoeIcon + '" alt="Area of application">';
            if (aoeText) html += '<div class="gc-item-tooltip-aoe-meters">' + formatTooltipInlineValue(aoeText) + '</div>';
            html += '</td>';
        }
        html += '</tr>';
        if (def.description) {
            html += '<tr class="gc-item-tooltip-table-row-desc">';
            html += '<td class="gc-item-tooltip-table-cell-desc" colspan="3">' + formatTooltipDescription(def.description) + '</td>';
            html += '</tr>';
        }
        html += '</table>';
        html += '</div>';
        return html;
    }

    function buildStigmaTooltipHtml(def) {
        if (!def) return '';
        var entries = [def];
        if (Array.isArray(def.linkedTooltips)) {
            entries = entries.concat(def.linkedTooltips.filter(matchesActiveSpirit));
        }
        if (entries.length <= 1) return renderStigmaTooltipCard(entries[0]);
        return '<div class="stigma-tooltip-grid">' + entries.map(function(item) { return renderStigmaTooltipCard(item); }).join('') + '</div>';
    }

    function buildActionTooltipHtml(title, description) {
        var html = '<div class="gc-item-tooltip-card">';
        html += '<div class="gc-item-tooltip-title-row">';
        html += '<span class="gc-item-tooltip-title">' + escapeHtml(title || '') + '</span>';
        html += '</div>';
        if (description) html += '<div class="gc-item-tooltip-wide">' + formatTooltipDescription(description) + '</div>';
        html += '</div>';
        return html;
    }

    function getDaevanionSkillsForClass(className) {
        if (!window.DAEVANION_SKILLS_BY_CLASS) return [];
        var list = window.DAEVANION_SKILLS_BY_CLASS[className];
        return Array.isArray(list) ? list : [];
    }

    function ensureDaevanionClassState(className) {
        var skills = getDaevanionSkillsForClass(className);
        if (!daevanionUsedByClass[className] || typeof daevanionUsedByClass[className] !== 'object') {
            daevanionUsedByClass[className] = {};
        }
        var used = daevanionUsedByClass[className];

        skills.forEach(function(skill) {
            if (!skill || !skill.key) return;
            var current = used[skill.key];
            if (current) {
                if (current.row === 'default' && current.type === 'default' && skill.defaultSkill) return;
                if (getDaevanionSkillVariant(skill, current.row, current.type)) return;
            }

            var fallback = getDaevanionDefaultUsed(skill);
            used[skill.key] = fallback;
        });

        return used;
    }

    function getDaevanionDefaultUsed(skill) {
        if (!skill || !skill.rows) return null;
        var preferred = skill.defaultUsed;
        if (preferred && getDaevanionSkillVariant(skill, preferred.row, preferred.type)) return preferred;

        var rowKeys = ['improved', 'normal'];
        var typeKeys = ['type1', 'type2', 'type3'];
        for (var i = 0; i < rowKeys.length; i++) {
            for (var j = 0; j < typeKeys.length; j++) {
                if (getDaevanionSkillVariant(skill, rowKeys[i], typeKeys[j])) {
                    return { row: rowKeys[i], type: typeKeys[j] };
                }
            }
        }
        return null;
    }

    function getDaevanionDefaultSkillSelection(skill) {
        if (skill && skill.defaultSkill) return { row: 'default', type: 'default' };
        return getDaevanionDefaultUsed(skill);
    }

    function getDaevanionSkillVariant(skill, rowKey, typeKey) {
        if (!skill || !skill.rows || !skill.rows[rowKey]) return null;
        return skill.rows[rowKey][typeKey] || null;
    }

    function getDaevanionSelectedVariant(className, skill) {
        var classState = ensureDaevanionClassState(className);
        if (!classState || !skill || !skill.key) return null;
        var selected = classState[skill.key] || getDaevanionDefaultUsed(skill);
        if (!selected) return null;

        if (selected.row === 'default' && selected.type === 'default' && skill.defaultSkill) {
            return {
                row: 'default',
                type: 'default',
                def: skill.defaultSkill
            };
        }

        var def = getDaevanionSkillVariant(skill, selected.row, selected.type);
        if (def) {
            return {
                row: selected.row,
                type: selected.type,
                def: def
            };
        }

        var fallback = getDaevanionDefaultUsed(skill);
        var fallbackDef = fallback ? getDaevanionSkillVariant(skill, fallback.row, fallback.type) : null;
        return fallback && fallbackDef ? { row: fallback.row, type: fallback.type, def: fallbackDef } : null;
    }

    // Each tab lives at its own clean URL (/stigma/ and /daevanion/) so it can be
    // linked, bookmarked and reloaded directly. Both paths serve the SAME page and
    // shared scripts; only the default tab differs.
    var STIGMA_TAB_PATH = { stigma: '/stigma/', daevanion: '/daevanion/' };
    var STIGMA_TAB_TITLE = { stigma: 'Stigma Skills', daevanion: 'Daevanion Skills' };

    function tabHomePath(tab) {
        return STIGMA_TAB_PATH[tab] || STIGMA_TAB_PATH.stigma;
    }

    // Absolute URL to a tab's canonical page, used for shareable links so they
    // always point at /stigma/ or /daevanion/ regardless of the current page.
    function canonicalTabUrl(tab) {
        var origin = window.location.origin || (window.location.protocol + '//' + window.location.host);
        return origin + tabHomePath(tab);
    }

    // Which tool's page we're currently on, inferred from the URL path.
    function pathTab() {
        var path = (window.location.pathname || '').toLowerCase();
        if (path.indexOf('/daevanion') !== -1) return 'daevanion';
        if (path.indexOf('/stigma') !== -1) return 'stigma';
        return null;
    }

    function activateStigmaTab(tabKey) {
        stigmaActiveTab = (tabKey === 'daevanion') ? 'daevanion' : 'stigma';

        document.querySelectorAll('#stigma-tab-bar .gc-tab').forEach(function(btn) {
            btn.classList.remove('gc-tab-active');
        });
        var activeBtn = document.querySelector('#stigma-tab-bar .gc-tab[data-tab="' + stigmaActiveTab + '"]');
        if (activeBtn) activeBtn.classList.add('gc-tab-active');

        document.querySelectorAll('#tab-stigma, #tab-daevanion').forEach(function(panel) {
            panel.classList.remove('gc-tab-panel-active');
        });
        var activePanel = document.getElementById('tab-' + stigmaActiveTab);
        if (activePanel) activePanel.classList.add('gc-tab-panel-active');

        // Keep the document title and heading in sync so both entry pages (and
        // in-place tab switches) read correctly.
        var title = STIGMA_TAB_TITLE[stigmaActiveTab];
        if (title) {
            document.title = title;
            var heading = document.querySelector('.container > h1');
            if (heading) heading.textContent = title;
        }

        syncTabUrl();
        saveState();
    }

    function syncTabUrl() {
        if (!window.history) return;

        // A share code belongs to a single tab. Once the user moves to the other
        // tab it's no longer relevant, so drop it from the URL.
        if (pendingShareCode && stigmaActiveTab !== pendingShareTab) {
            pendingShareCode = null;
            pendingShareTab = null;
        }

        // Compact share format: the path identifies the tool, so the code rides
        // as an unnamed query param -> /stigma/?=CODE and /daevanion/?=CODE.
        var search = (pendingShareCode && stigmaActiveTab === pendingShareTab)
            ? '?=' + encodeURIComponent(pendingShareCode)
            : '';

        // Legacy links may carry a code for the OTHER tool than the page they
        // landed on (e.g. an old /stigma/?daevanion=CODE before /daevanion/
        // existed). Hard-redirect to the correct dedicated page so the path,
        // nav highlight and loaded scripts all line up.
        var here = pathTab();
        if (here && here !== stigmaActiveTab) {
            window.location.replace(canonicalTabUrl(stigmaActiveTab) + search + (window.location.hash || ''));
            return;
        }

        if (!window.history.replaceState) return;
        var nextUrl = tabHomePath(stigmaActiveTab) + search + (window.location.hash || '');
        var currentUrl = window.location.pathname + window.location.search + (window.location.hash || '');
        if (nextUrl !== currentUrl) {
            window.history.replaceState(null, '', nextUrl);
        }
    }

    function initStigmaTabs() {
        // Tabs are now plain navigation links (anchors to /stigma/ and /daevanion/),
        // so there is no in-page switching to wire up. Each page renders its own
        // builder; the active tab is derived from the URL path on load. Kept as a
        // no-op so the init sequence stays self-documenting.
    }

    function renderDaevanionCell(def, isSelected, extraClasses, clickHandler) {
        var cls = 'daevanion-skill-btn gc-item-tooltip-trigger';
        if (extraClasses) cls += ' ' + extraClasses;
        if (isSelected) cls += ' is-selected';

        var title = def ? (def.name + ' | ' + (def.cooldown || '-') + ' | ' + (def.description || '')) : 'Locked';
        var tooltipHtml = def ? buildStigmaTooltipHtml(def) : buildActionTooltipHtml('Locked', 'This slot is locked.');
        var icon = def ? def.icon : (window.DAEVANION_LOCKED_ICON || '../assets/icons/locked_daevanion.png');

        var html = '<button type="button" class="' + cls + '" aria-label="' + escapeHtml(title) + '" data-tooltip-title="' + escapeHtml(def ? def.name : 'Locked') + '" data-tooltip-html="' + escapeHtml(tooltipHtml) + '"';
        if (clickHandler) {
            html += ' onclick="' + clickHandler + '"';
        } else {
            html += ' disabled';
        }
        html += '>';
        html += '<span class="daevanion-skill-icon-wrap">';
        html += '<img src="' + icon + '" class="daevanion-skill-icon" alt="">';
        html += '</span>';
        html += '</button>';
        return html;
    }

    function renderDaevanionUsedCell(selected) {
        if (!selected || !selected.def) {
            return '<div class="daevanion-used-empty">No selection</div>';
        }

        var def = selected.def;
        var tooltipHtml = buildStigmaTooltipHtml(def);
        var title = def.name + ' | ' + (def.cooldown || '-') + ' | ' + (def.description || '');
        var html = '<div class="daevanion-used-skill gc-item-tooltip-trigger" aria-label="' + escapeHtml(title) + '" data-tooltip-title="' + escapeHtml(def.name) + '" data-tooltip-html="' + escapeHtml(tooltipHtml) + '">';
        html += '<span class="daevanion-used-icon-wrap">';
        html += '<img src="' + escapeHtml(def.icon) + '" class="daevanion-used-icon" alt="">';
        html += '</span>';
        html += '<span class="daevanion-used-name">' + escapeHtml(def.name) + '</span>';
        html += '</div>';
        return html;
    }

    function getDaevanionUsedColumnMinWidth() {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        var fontFamily = getComputedStyle(document.body).fontFamily || 'sans-serif';
        ctx.font = (rootFontSize * 0.84) + 'px ' + fontFamily;

        var allSkills = [];
        if (window.DAEVANION_SKILLS_BY_CLASS && typeof window.DAEVANION_SKILLS_BY_CLASS === 'object') {
            Object.keys(window.DAEVANION_SKILLS_BY_CLASS).forEach(function(classKey) {
                var list = window.DAEVANION_SKILLS_BY_CLASS[classKey];
                if (Array.isArray(list)) {
                    allSkills = allSkills.concat(list);
                }            
            });
        }

        var maxTextWidth = 0;
        allSkills.forEach(function(skill) {
            var allDefs = [];
            if (skill.defaultSkill) allDefs.push(skill.defaultSkill);
            ['improved', 'normal'].forEach(function(row) {
                ['type1', 'type2', 'type3'].forEach(function(type) {
                    var v = getDaevanionSkillVariant(skill, row, type);
                    if (v) allDefs.push(v);
                });
            });
            allDefs.forEach(function(d) {
                if (d && d.name) {
                    var w = ctx.measureText(d.name).width;
                    if (w > maxTextWidth) maxTextWidth = w;
                }
            });
        });
        // icon (72px) + gap (8px) + text + cell padding (24px)
        return Math.ceil(72 + 8 + maxTextWidth + 24);
    }

    function renderDaevanionBuilder() {
        var el = document.getElementById('daevanion-builder');
        if (!el) return;

        var skills = getDaevanionSkillsForClass(selectedClass);
        if (!skills.length) {
            el.innerHTML = '<div class="stigma-panel"><div class="stigma-title">No daevanion skills for this class yet</div></div>';
            return;
        }

        ensureDaevanionClassState(selectedClass);

        var usedColMinWidth = getDaevanionUsedColumnMinWidth();

        //var warningExpanded = !isDaevanionWarningCollapsed;
        //var html = '<div class="daevanion-warning-wrap' + (warningExpanded ? ' is-open' : ' is-collapsed') + '">';
        // html += '<button type="button" class="daevanion-warning-mini-toggle" aria-expanded="' + (warningExpanded ? 'true' : 'false') + '" aria-label="Show warning" title="Show warning" onclick="StigmaApp.toggleDaevanionWarning()">i</button>';
        // html += '<div class="warning-box daevanion-warning-box">';
        // html += '<button type="button" class="daevanion-warning-close" aria-label="Hide warning" title="Hide warning" onclick="StigmaApp.toggleDaevanionWarning()">✕</button>';
        // html += '<div class="daevanion-warning-content">🚧Daevanion tooltip descriptions are under construction. Placeholder data is shown until the page is complete.🚧<br>🚧Found a discrepancy? Let us know!🚧'
        // html += '<br>🚧Classes with missing descriptions so far: '
        // html += '<img src="../assets/icons/bard.png"></img>'
        // html += '<img src="../assets/icons/painter.png"></img>'
        // html += '🚧</div>';
        // html += '</div>';
        // html += '</div>';
        var html = '<div class="stigma-panel daevanion-panel">';
        html += '<div class="stigma-builder-head daevanion-builder-head">';
        html += '<div class="stigma-preset-actions">';
        // html += '<button type="button" class="stigma-preset-btn stigma-preset-btn-pve" onclick="StigmaApp.applyDaevanionPresetBuild(\'pve\')" aria-label="Developer\'s PvE build" title="Developer\'s PvE build">';
        // html += '<img src="../assets/icons/icon_pve.png" alt="PVE">';
        // html += '</button>';
        // html += '<button type="button" class="stigma-preset-btn stigma-preset-btn-pvp" onclick="StigmaApp.applyDaevanionPresetBuild(\'pvp\')" aria-label="Developer\'s PvP build" title="Developer\'s PvP build">';
        // html += '<img src="../assets/icons/icon_pvp.png" alt="PVP">';
        // html += '</button>';
        html += '<div class="stigma-share-spirit-stack">';
        html += '<button type="button" class="stigma-preset-btn stigma-share-btn daevanion-share-btn" onclick="StigmaApp.shareCurrentDaevanionBuild()" aria-label="Share current daevanion build" title="Share current daevanion build">';
        html += '<span class="stigma-share-label">Share Build 🔗</span>';
        html += '</button>';
        html += '</div>';
        html += '</div>';
        html += '<button class="gc-reset-btn" onclick="StigmaApp.resetClassDaevanion()" aria-label="Reset current class daevanion selection" title="Reset current class daevanion selection" data-tooltip-html="' + escapeHtml(buildActionTooltipHtml('Reset Daevanion', 'Resets selected daevanion skills for the current class.')) + '">↺</button>';
        var daevanionSpiritControls = renderSpiritSelectorControls();
        if (daevanionSpiritControls) {
            html += '<div class="stigma-spirit-selector-row">' + daevanionSpiritControls + '</div>';
        }
        html += '</div>';
        html += '<div class="daevanion-table-wrap">';
        html += '<table class="daevanion-table">';
        html += '<thead><tr>';
        html += '<th>Default</th>';
        html += '<th>Type 1</th>';
        html += '<th>Type 2</th>';
        html += '<th>Type 3</th>';
        html += '<th>Skill Used</th>';
        html += '</tr></thead>';
        html += '<tbody>';

        skills.forEach(function(skill) {
            var selected = getDaevanionSelectedVariant(selectedClass, skill);

            html += '<tr>';
            html += '<td rowspan="2" class="daevanion-cell-default">';
            html += renderDaevanionCell(
                skill.defaultSkill,
                !!(selected && selected.row === 'default' && selected.type === 'default'),
                'daevanion-default-skill',
                'StigmaApp.setDaevanionSkill(\'' + selectedClass + '\',\'' + skill.key + '\',\'default\',\'default\')'
            );
            html += '</td>';

            ['type1', 'type2', 'type3'].forEach(function(typeKey) {
                var def = getDaevanionSkillVariant(skill, 'improved', typeKey);
                var isSelected = !!(selected && selected.row === 'improved' && selected.type === typeKey);
                var onclick = def ? ('StigmaApp.setDaevanionSkill(\'' + selectedClass + '\',\'' + skill.key + '\',\'improved\',\'' + typeKey + '\')') : null;
                html += '<td>' + renderDaevanionCell(def, isSelected, 'daevanion-row-improved', onclick) + '</td>';
            });

            html += '<td rowspan="2" class="daevanion-cell-used" style="min-width:' + usedColMinWidth + 'px">' + renderDaevanionUsedCell(selected) + '</td>';
            html += '</tr>';

            html += '<tr>';
            ['type1', 'type2', 'type3'].forEach(function(typeKey) {
                var def = getDaevanionSkillVariant(skill, 'normal', typeKey);
                var isSelected = !!(selected && selected.row === 'normal' && selected.type === typeKey);
                var onclick = def ? ('StigmaApp.setDaevanionSkill(\'' + selectedClass + '\',\'' + skill.key + '\',\'normal\',\'' + typeKey + '\')') : null;
                html += '<td>' + renderDaevanionCell(def, isSelected, 'daevanion-row-normal', onclick) + '</td>';
            });
            html += '</tr>';
        });

        html += '</tbody>';
        html += '</table>';
        html += '</div>';
        html += '</div>';
        el.innerHTML = html;
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

    var DAEVANION_SHORT_VARIANT_ORDER = [
        { row: 'improved', type: 'type1' },
        { row: 'improved', type: 'type2' },
        { row: 'improved', type: 'type3' },
        { row: 'normal', type: 'type1' },
        { row: 'normal', type: 'type2' },
        { row: 'normal', type: 'type3' },
        { row: 'default', type: 'default' }
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

    function getDaevanionSelectionVariantCode(skill, selection) {
        if (!skill || !selection) return 0;
        if (selection.row === 'default' && selection.type === 'default' && skill.defaultSkill) {
            return DAEVANION_SHORT_VARIANT_ORDER.length;
        }
        if (!getDaevanionSkillVariant(skill, selection.row, selection.type)) return 0;
        for (var i = 0; i < DAEVANION_SHORT_VARIANT_ORDER.length; i++) {
            var variant = DAEVANION_SHORT_VARIANT_ORDER[i];
            if (variant.row === selection.row && variant.type === selection.type) return i + 1;
        }
        return 0;
    }

    function getDaevanionSelectionFromVariantCode(skill, code) {
        if (!skill) return null;
        var idx = code - 1;
        if (idx < 0 || idx >= DAEVANION_SHORT_VARIANT_ORDER.length) return null;
        var variant = DAEVANION_SHORT_VARIANT_ORDER[idx];
        if (variant.row === 'default' && variant.type === 'default') {
            return skill.defaultSkill ? { row: 'default', type: 'default' } : null;
        }
        if (!getDaevanionSkillVariant(skill, variant.row, variant.type)) return null;
        return { row: variant.row, type: variant.type };
    }

    function encodeShortDaevanionShare(className, classUsed) {
        var classIndex = CLASS_ORDER.indexOf(className);
        if (classIndex < 0) return null;

        var skills = getDaevanionSkillsForClass(className);
        if (!skills.length) return null;

        var used = classUsed || ensureDaevanionClassState(className);
        var code = classIndex.toString(36);

        skills.forEach(function(skill) {
            var selected = used && skill ? used[skill.key] : null;
            var variantCode = getDaevanionSelectionVariantCode(skill, selected);
            code += variantCode.toString(36);
        });

        return code;
    }

    function decodeShortDaevanionShare(code) {
        if (typeof code !== 'string' || code.length < 2) return null;
        code = code.toLowerCase();

        var classIndex = parseInt(code[0], 36);
        if (isNaN(classIndex) || classIndex < 0 || classIndex >= CLASS_ORDER.length) return null;

        var className = CLASS_ORDER[classIndex];
        if (!CLASS_DATA[className]) return null;

        var skills = getDaevanionSkillsForClass(className);
        if (!skills.length) return null;
        if (code.length !== skills.length + 1) return null;

        var used = {};
        skills.forEach(function(skill, index) {
            if (!skill || !skill.key) return;
            var value = parseInt(code[index + 1], 36);
            var selected = getDaevanionSelectionFromVariantCode(skill, value);
            if (!selected) selected = getDaevanionDefaultUsed(skill);
            used[skill.key] = selected;
        });

        return { className: className, used: used };
    }

    function getDaevanionPresetSelection(skill, presetType) {
        if (!skill) return null;
        var preferred = presetType === 'pvp' ? { row: 'normal', type: 'type1' } : { row: 'improved', type: 'type1' };
        if (getDaevanionSkillVariant(skill, preferred.row, preferred.type)) return preferred;
        return getDaevanionDefaultUsed(skill);
    }

    function getDaevanionPresetFromShortCode(className, presetType, skills) {
        if (!className || !presetType || !Array.isArray(skills) || !skills.length) return null;

        var classPreset = DAEVANION_PRESET_SHORT_CODE_MAP[className];
        if (!classPreset || typeof classPreset !== 'object') return null;

        var code = classPreset[presetType];
        if (typeof code !== 'string') return null;

        code = code.trim().toLowerCase();
        if (code.length !== skills.length) return null;

        var used = {};
        skills.forEach(function(skill, index) {
            if (!skill || !skill.key) return;

            var variantCode = parseInt(code[index], 36);
            var selected = getDaevanionSelectionFromVariantCode(skill, variantCode);
            if (!selected) selected = getDaevanionDefaultSkillSelection(skill);
            if (!selected) selected = getDaevanionDefaultUsed(skill);
            used[skill.key] = selected;
        });

        return used;
    }

    function decodeSharedBuildFromUrl() {
        if (typeof URLSearchParams === 'undefined') return false;
        try {
            var params = new URLSearchParams(window.location.search);
            var applied = false;

            // The page path determines the default tab (/stigma/ vs /daevanion/).
            var path = (window.location.pathname || '').toLowerCase();
            if (path.indexOf('/daevanion') !== -1) stigmaActiveTab = 'daevanion';
            else if (path.indexOf('/stigma') !== -1) stigmaActiveTab = 'stigma';

            if (params.has('tab')) {
                var tabParam = (params.get('tab') || '').toLowerCase();
                if (tabParam === 'daevanion') stigmaActiveTab = 'daevanion';
                if (tabParam === 'stigma') stigmaActiveTab = 'stigma';
            }

            // Support /stigma/?daevanion as a plain tab deep-link without share code.
            if (params.has('daevanion') && !params.get('daevanion')) {
                stigmaActiveTab = 'daevanion';
            }

            var onDaevanionPath = path.indexOf('/daevanion') !== -1;

            // New compact share format: ?=CODE. The tool is inferred from the path
            // (stigma vs daevanion) since the param itself is unnamed.
            var compactCode = params.get('');
            if (compactCode) {
                if (onDaevanionPath) {
                    var decodedCompactDaev = decodeShortDaevanionShare(compactCode);
                    if (decodedCompactDaev) {
                        selectedClass = decodedCompactDaev.className;
                        daevanionUsedByClass[selectedClass] = decodedCompactDaev.used;
                        stigmaActiveTab = 'daevanion';
                        pendingShareCode = compactCode;
                        pendingShareTab = 'daevanion';
                        applied = true;
                    }
                } else {
                    var decodedCompactStig = decodeShortStigmaShare(compactCode);
                    if (decodedCompactStig) {
                        selectedClass = decodedCompactStig.className;
                        buildsByClass[selectedClass] = decodedCompactStig.build;
                        stigmaActiveTab = 'stigma';
                        pendingShareCode = compactCode;
                        pendingShareTab = 'stigma';
                        applied = true;
                    }
                }
            }

            // Legacy explicit formats (?daevanion=CODE / ?stigma=CODE). Still decoded
            // for backwards compatibility, then rewritten to the compact URL via the
            // pendingShare* values picked up by syncTabUrl().
            var daevanionCode = params.get('daevanion');
            if (!applied && daevanionCode) {
                var decodedDaevanion = decodeShortDaevanionShare(daevanionCode);
                if (decodedDaevanion) {
                    selectedClass = decodedDaevanion.className;
                    daevanionUsedByClass[selectedClass] = decodedDaevanion.used;
                    stigmaActiveTab = 'daevanion';
                    pendingShareCode = daevanionCode;
                    pendingShareTab = 'daevanion';
                    applied = true;
                }
            }

            var stigmaCode = params.get('stigma');
            if (!applied && stigmaCode) {
                var decodedStigma = decodeShortStigmaShare(stigmaCode);
                if (decodedStigma) {
                    selectedClass = decodedStigma.className;
                    buildsByClass[selectedClass] = decodedStigma.build;
                    stigmaActiveTab = 'stigma';
                    pendingShareCode = stigmaCode;
                    pendingShareTab = 'stigma';
                    applied = true;
                }
            }

            return applied;
        } catch (e) {
            return false;
        }
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                selectedClass: selectedClass,
                buildsByClass: buildsByClass,
                daevanionUsedByClass: daevanionUsedByClass,
                stigmaActiveTab: stigmaActiveTab,
                isDaevanionWarningCollapsed: isDaevanionWarningCollapsed,
                activeSpiritKey: activeSpiritKey
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

            if (parsed.stigmaActiveTab === 'daevanion' || parsed.stigmaActiveTab === 'stigma') {
                stigmaActiveTab = parsed.stigmaActiveTab;
            }

            if (typeof parsed.isDaevanionWarningCollapsed === 'boolean') {
                isDaevanionWarningCollapsed = parsed.isDaevanionWarningCollapsed;
            }

            if (parsed.activeSpiritKey) {
                activeSpiritKey = normalizeSpiritKey(parsed.activeSpiritKey);
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

            if (parsed.daevanionUsedByClass && typeof parsed.daevanionUsedByClass === 'object') {
                daevanionUsedByClass = parsed.daevanionUsedByClass;
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

    function renderMobileSkillDetailCard(def, isLinked) {
        if (!def) return '';
        var cls = 'stigma-mobile-skill-card';
        if (isLinked) cls += ' stigma-mobile-skill-card-linked';
        var html = '<div class="' + cls + '">';
        html += '<div class="stigma-mobile-skill-card-header">';
        html += '<img src="' + def.icon + '" class="stigma-mobile-skill-icon" alt="">';
        html += '<div class="stigma-mobile-skill-title">' + escapeHtml(def.name) + '</div>';
        html += '</div>';
        html += '<div class="stigma-mobile-skill-meta">';
        if (def.cooldown) html += '<div class="stigma-mobile-skill-meta-line">Cooldown: ' + escapeHtml(def.cooldown) + '</div>';
        html += '<div class="stigma-mobile-skill-meta-line">Cast Time: ' + escapeHtml(getEffectiveCastTime(def)) + '</div>';
        if (def.pvpDuration) html += '<div class="stigma-mobile-skill-meta-line">PvP Duration: ' + escapeHtml(def.pvpDuration) + '</div>';
        html += '</div>';
        if (def.description) html += '<div class="stigma-mobile-skill-description">' + formatTooltipDescription(def.description) + '</div>';
        html += '</div>';
        return html;
    }

    function renderMobileSkillDetailEntry(def) {
        if (!def) return '';
        var html = renderMobileSkillDetailCard(def, false);
        if (Array.isArray(def.linkedTooltips)) {
            def.linkedTooltips.filter(matchesActiveSpirit).forEach(function(linked) {
                html += renderMobileSkillDetailCard(linked, true);
            });
        }
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
                html += renderMobileSkillDetailEntry(def);
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
        html += '<span class="stigma-share-label">Share Build 🔗</span>';
        html += '</button>';
        html += '</div>';
        html += '<button class="gc-reset-btn" onclick="StigmaApp.resetClassStigmas()" aria-label="Reset current class stigmas" title="Reset current class stigmas" data-tooltip-html="' + escapeHtml(buildActionTooltipHtml('Reset Build', 'Clears the current class stigma selection and restores an empty board.')) + '">↺</button>';
        var spiritControls = renderSpiritSelectorControls();
        if (spiritControls) {
            html += '<div class="stigma-spirit-selector-row">' + spiritControls + '</div>';
        }
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

    function copyTextFallback(text) {
        var ta;
        try {
            ta = document.createElement('textarea');
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

    function flashShareButton(btn) {
        if (!btn) return;
        btn.classList.remove('copied');
        // force reflow to restart animation
        btn.offsetWidth;
        btn.classList.add('copied');
        setTimeout(function() {
            btn.classList.remove('copied');
        }, 1500);
    }

    function copyShareUrl(shareUrl, btn) {
        function onSuccess() {
            if (typeof showShareToast === 'function') showShareToast('✓ Link copied to clipboard!');
            flashShareButton(btn);
            var labelEl = btn ? btn.querySelector('.stigma-share-label') : null;
            var original = labelEl ? labelEl.textContent : null;
            if (labelEl) {
                labelEl.textContent = 'Link copied ✓';
                setTimeout(function() {
                    if (labelEl) labelEl.textContent = original;
                }, 1500);
            }
        }
        function onFailure() {
            if (typeof showShareToast === 'function') showShareToast('Could not copy link', true);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareUrl).then(onSuccess).catch(function() {
                if (copyTextFallback(shareUrl)) onSuccess();
                else onFailure();
            });
        } else {
            if (copyTextFallback(shareUrl)) onSuccess();
            else onFailure();
        }
    }

    window.StigmaApp = {
        selectClass: function(className) {
            if (!CLASS_DATA[className]) return;
            selectedClass = className;
            ensureClassBuild(className);
            ensureDaevanionClassState(className);
            saveState();
            renderClassSelector();
            renderBuilder();
            renderDaevanionBuilder();
        },

        setSpiritFilter: function(spiritKey) {
            var next = normalizeSpiritKey(spiritKey);
            if (activeSpiritKey === next) return;
            activeSpiritKey = next;
            saveState();
            renderBuilder();
            renderDaevanionBuilder();
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
            renderDaevanionBuilder();
        },

        resetClassStigmas: function() {
            if (!classHasStigmas(selectedClass)) return;
            buildsByClass[selectedClass] = createDefaultStigmaBuild(selectedClass);
            normalizeStigmaBuild(selectedClass, buildsByClass[selectedClass]);
            saveState();
            renderBuilder();
            renderDaevanionBuilder();
        },

        shareCurrentBuild: function() {
            var build = ensureClassBuild(selectedClass);
            if (!build) return;

            var code = encodeShortStigmaShare(selectedClass, build);
            if (!code) return;

            var shareUrl = canonicalTabUrl('stigma') + '?=' + encodeURIComponent(code);

            var btn = document.querySelector('.stigma-preset-actions .stigma-share-btn') || document.querySelector('.stigma-share-btn');
            copyShareUrl(shareUrl, btn);
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
            renderDaevanionBuilder();
        },

        setDaevanionSkill: function(className, skillKey, rowKey, typeKey) {
            if (!CLASS_DATA[className]) return;
            var skills = getDaevanionSkillsForClass(className);
            var skill = skills.find(function(item) { return item && item.key === skillKey; });
            if (!skill) return;

            if (rowKey === 'default' && typeKey === 'default') {
                if (!skill.defaultSkill) return;
            } else {
                var variant = getDaevanionSkillVariant(skill, rowKey, typeKey);
                if (!variant) return;
            }

            ensureDaevanionClassState(className);
            daevanionUsedByClass[className][skillKey] = { row: rowKey, type: typeKey };
            if (selectedClass !== className) selectedClass = className;
            saveState();
            renderDaevanionBuilder();
        },

        applyDaevanionPresetBuild: function(type) {
            if (type !== 'pve' && type !== 'pvp') return;
            var skills = getDaevanionSkillsForClass(selectedClass);
            if (!skills.length) return;

            var shortPreset = getDaevanionPresetFromShortCode(selectedClass, type, skills);
            if (shortPreset) {
                daevanionUsedByClass[selectedClass] = shortPreset;
            } else {
                ensureDaevanionClassState(selectedClass);
                var used = daevanionUsedByClass[selectedClass];
                skills.forEach(function(skill) {
                    if (!skill || !skill.key) return;
                    used[skill.key] = getDaevanionPresetSelection(skill, type);
                });
            }

            saveState();
            renderDaevanionBuilder();
        },

        resetClassDaevanion: function() {
            var skills = getDaevanionSkillsForClass(selectedClass);
            if (!skills.length) return;

            daevanionUsedByClass[selectedClass] = {};
            skills.forEach(function(skill) {
                if (!skill || !skill.key) return;
                daevanionUsedByClass[selectedClass][skill.key] = getDaevanionDefaultSkillSelection(skill);
            });
            saveState();
            renderDaevanionBuilder();
        },

        shareCurrentDaevanionBuild: function() {
            var skills = getDaevanionSkillsForClass(selectedClass);
            if (!skills.length) return;

            ensureDaevanionClassState(selectedClass);
            var code = encodeShortDaevanionShare(selectedClass, daevanionUsedByClass[selectedClass]);
            if (!code) return;

            var shareUrl = canonicalTabUrl('daevanion') + '?=' + encodeURIComponent(code);

            var btn = document.querySelector('.daevanion-builder-head .daevanion-share-btn') || document.querySelector('.daevanion-share-btn');
            copyShareUrl(shareUrl, btn);
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
            renderDaevanionBuilder();
        },

        toggleDaevanionWarning: function() {
            isDaevanionWarningCollapsed = !isDaevanionWarningCollapsed;
            saveState();
            renderDaevanionBuilder();
        }
    };

    loadState();
    decodeSharedBuildFromUrl();
    if (!CLASS_DATA[selectedClass]) selectedClass = getFirstSupportedClass();
    if (!classHasStigmas(selectedClass)) selectedClass = getFirstSupportedClass();
    ensureClassBuild(selectedClass);
    ensureDaevanionClassState(selectedClass);

    renderClassSelector();
    renderBuilder();
    renderDaevanionBuilder();
    initStigmaTabs();
    activateStigmaTab(stigmaActiveTab);

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
            //var legendTrigger = e.target.closest('.stigma-legend-icon.gc-item-tooltip-trigger, .stigma-vision-trigger.gc-item-tooltip-trigger, .daevanion-skill-btn.gc-item-tooltip-trigger, .daevanion-used-skill.gc-item-tooltip-trigger');
            var legendTrigger = e.target.closest('.stigma-legend-icon.gc-item-tooltip-trigger, .stigma-vision-trigger.gc-item-tooltip-trigger, .daevanion-used-skill.gc-item-tooltip-trigger');
            if (legendTrigger && !e.target.closest('#stigma-mobile-modal')) {
                openStigmaTooltipModal(
                    legendTrigger.getAttribute('data-tooltip-html'),
                    'Skill Details'
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
