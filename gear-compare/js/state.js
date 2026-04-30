'use strict';

function createDefaultWeaponConfig(className) {
    var cls = CLASS_DATA[className];
    var mainType = cls.weapons[0];
    return {
        mainType: mainType,
        offHandType: getDefaultOffHand(mainType, className),
        offHandWeaponType: getDefaultOffHandWeapon(mainType, className)
    };
}

function createDefaultProfile(className) {
    var profile = {
        weaponConfig: createDefaultWeaponConfig(className),
        minions: { main: 'crit-sita', secondary: 'crit-sita' },
        armorType: CLASS_DATA[className].armorTypes[0],
        armor: {},
        mainWeapon: { set: 'fighting-spirit', enchant: 9, bonuses: getDefaultWeaponBonuses('fighting-spirit'), bonusValues: {} },
        offHand: { set: 'fighting-spirit', enchant: 9, bonuses: getDefaultWeaponBonuses('fighting-spirit'), bonusValues: {} },
        shield: { set: 'fighting-spirit', type: 'battle', bonuses: getDefaultShieldBonuses('fighting-spirit', 'battle'), bonusValues: {} },
        oath: { shoulders: 'silent-skill', helmet: 'silent-skill', chest: 'ultimate-3', pants: 'ultimate-3', gloves: 'ultimate-3', boots: 'ultimate-3' },
        manastones: {},
        transform: 'none',
        transformEnchant: 10,
        bonusCollapsed: { mainWeapon: false, offHand: false, shield: false },
        accessories: {},
        glyph: {
            enabled: true,
            bonuses: ['attack'], 
            bonusValues: {},
            extra: {
                attack: 210,      // Enchant Attack
                physicalDef: 150, // Enchant P.Def
                magicalDef: 150   // Enchant M.Def
            }
        },
    };
    ARMOR_SLOTS.forEach(function(slot) {
        profile.armor[slot.key] = {
        set: 'fighting-spirit',
        bonuses: getDefaultArmorBonuses(slot.key),
        bonusValues: {}
    };
    });
    // Initialize accessories
    ALL_ACCESSORY_KEYS.forEach(function(accKey) {
        profile.accessories[accKey] = {
            set: 'aeon-guardian',
            bonuses: getDefaultAccBonuses('aeon-guardian', accKey),
            bonusValues: {}
        };
    });
    // Initialize manastone arrays for all gear slots
    // Default: Full Crit for all classes, Full Attack for assassin/ranger
    var defaultMana = (className === 'assassin' || className === 'ranger') ? 'attack' : 'crit';
    ARMOR_SLOTS.forEach(function(slot) {
        profile.manastones[slot.key] = [defaultMana, defaultMana, defaultMana];
    });
    profile.apsuEnabled = false;
    profile.manastones.mainWeapon = [defaultMana, defaultMana, defaultMana];
    profile.manastones.offHand = [defaultMana, defaultMana, defaultMana];
    // Initialize acc manastones (3 slots each)
    ALL_ACCESSORY_KEYS.forEach(function(accKey) {
        profile.manastones[accKey] = [defaultMana, defaultMana, defaultMana];
    });
    // Initialize collections state
    profile.collections = { itemColl: {} };
    profile.collLevels = { normal: 7, large: 7, powerful: 7 };
    ITEM_COLL_STATS.forEach(function(cs) { profile.collections.itemColl[cs.key] = cs.max; });
    // Initialize relic state
    profile.relic = { level: 300 };
    // Initialize trait selections (default: first column for each level)
    profile.traitSelections = {};
    [81, 82, 83, 84, 85].forEach(function(lvl) {
        profile.traitSelections[lvl] = 0;
    });
    // Initialize skill buff toggles
    profile.skillBuffs = {};
    profile.skillBuffEnchants = {};
    var allBuffs = getSkillBuffsForClass(className);
    allBuffs.forEach(function(buff) {
        profile.skillBuffs[buff.key] = !!buff.defaultActive;
        if (buff.enchant) {
            profile.skillBuffEnchants[buff.key] = buff.enchant.defaultLevel;
        }
    });
    // Initialize owned forms (all selected by default)
    profile.ownedForms = {};
    ALL_FORM_IDS.forEach(function(id) { profile.ownedForms[id] = true; });
    return profile;
}

var STORAGE_KEY = 'gc-state-v4';
var MAX_SETS = 5;
var setOrder = [1, 2];
var setNames = { 1: 'Set 1', 2: 'Set 2' };
var comparisonPair = { a: 1, b: 2 };
var nextSetId = 3;
var activeSetId = 1;

function getSetName(id) { return setNames[id] || ('Set ' + id); }

function addSet() {
    if (setOrder.length >= MAX_SETS) return null;
    var id = nextSetId++;
    setOrder.push(id);
    setNames[id] = 'Set ' + id;
    state[id] = createDefaultProfile(selectedClass);
    if (typeof traitSelections !== 'undefined') {
        traitSelections[id] = {};
        [81,82,83,84,85].forEach(function(lvl) { traitSelections[id][lvl] = 0; });
    }
    if (typeof formsActiveGrade !== 'undefined') formsActiveGrade[id] = 'ultimate';
    return id;
}

function removeSet(id) {
    if (setOrder.length <= 2) return false;
    var idx = setOrder.indexOf(id);
    if (idx === -1) return false;
    setOrder.splice(idx, 1);
    delete state[id];
    delete setNames[id];
    if (typeof traitSelections !== 'undefined') delete traitSelections[id];
    if (typeof formsActiveGrade !== 'undefined') delete formsActiveGrade[id];
    // Clean up orphaned buff-collapse localStorage keys
    try {
        ['universal', 'typed', 'class'].forEach(function(sec) {
            localStorage.removeItem('gcBuffCollapsed_' + sec + '_' + id);
        });
    } catch (e) {}
    // Fix comparison pair
    if (comparisonPair.a === id) comparisonPair.a = setOrder[0];
    if (comparisonPair.b === id) comparisonPair.b = setOrder[Math.min(1, setOrder.length - 1)];
    // Fix active set view
    if (activeSetId === id) activeSetId = setOrder[0];
    return true;
}

function saveState() {
    try {
        var profiles = {};
        setOrder.forEach(function(id) { profiles[id] = state[id]; });
        var data = {
            selectedClass: selectedClass,
            profiles: profiles,
            activeTab: activeTab,
            setOrder: setOrder,
            setNames: setNames,
            comparisonPair: comparisonPair,
            nextSetId: nextSetId,
            activeSetId: activeSetId,
            formsActiveGrade: (typeof formsActiveGrade !== 'undefined') ? formsActiveGrade : {}
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* quota exceeded or private mode */ }
}

// Helper: restore bonusValues from saved data, validating against a bonus definition list
function restoreBonusValues(target, saved, bonusDefs) {
    if (!saved || typeof saved !== 'object') return;
    var maxMap = {};
    bonusDefs.forEach(function(b) { maxMap[b.key] = b.value; });
    Object.keys(saved).forEach(function(k) {
        if (typeof saved[k] === 'number' && maxMap[k] !== undefined) {
            target[k] = Math.max(0, Math.min(maxMap[k], saved[k]));
        }
    });
}

function loadState() {
    try {
        var raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return false;
        var data = JSON.parse(raw);
        if (!data || !data.selectedClass || !data.profiles) return false;
        if (!CLASS_DATA[data.selectedClass]) return false;
        selectedClass = data.selectedClass;
        var cls = CLASS_DATA[selectedClass];
        // Legacy global weapon config fallback (v3 data)
        var legacyWeaponConfig = null;
        if (data.weaponConfig) {
            var wc = data.weaponConfig;
            legacyWeaponConfig = createDefaultWeaponConfig(selectedClass);
            if (wc.mainType && cls.weapons.indexOf(wc.mainType) !== -1) legacyWeaponConfig.mainType = wc.mainType;
            if (['none','fuse','weapon','shield'].indexOf(wc.offHandType) !== -1) legacyWeaponConfig.offHandType = wc.offHandType;
            if (wc.offHandWeaponType && WEAPON_TYPE_KEYS.indexOf(wc.offHandWeaponType) !== -1) legacyWeaponConfig.offHandWeaponType = wc.offHandWeaponType;
            // Validate off-hand type against current rules
            var allowed = getAllowedOffHand(legacyWeaponConfig.mainType, selectedClass);
            if (allowed.indexOf(legacyWeaponConfig.offHandType) === -1) {
                legacyWeaponConfig.offHandType = getDefaultOffHand(legacyWeaponConfig.mainType, selectedClass);
            }
        }
        // Restore multi-set state (backward compat with pre-multiset saves)
        if (data.setOrder && Array.isArray(data.setOrder) && data.setOrder.length >= 2) {
            setOrder = data.setOrder;
        } else {
            setOrder = [1, 2];
        }
        if (data.setNames && typeof data.setNames === 'object') {
            setNames = {};
            setOrder.forEach(function(id) {
                setNames[id] = data.setNames[id] || ('Set ' + id);
            });
        } else {
            setNames = {};
            setOrder.forEach(function(id) { setNames[id] = 'Set ' + id; });
        }
        if (data.comparisonPair && typeof data.comparisonPair === 'object') {
            comparisonPair = { a: data.comparisonPair.a, b: data.comparisonPair.b };
            if (setOrder.indexOf(comparisonPair.a) === -1) comparisonPair.a = setOrder[0];
            if (setOrder.indexOf(comparisonPair.b) === -1) comparisonPair.b = setOrder[Math.min(1, setOrder.length - 1)];
        } else {
            comparisonPair = { a: setOrder[0], b: setOrder[Math.min(1, setOrder.length - 1)] };
        }
        if (typeof data.nextSetId === 'number') {
            nextSetId = data.nextSetId;
        } else {
            nextSetId = Math.max.apply(null, setOrder) + 1;
        }
        if (typeof data.activeSetId === 'number' && setOrder.indexOf(data.activeSetId) !== -1) {
            activeSetId = data.activeSetId;
        } else {
            activeSetId = setOrder[0];
        }
        // Initialize state with defaults for all sets
        state = {};
        setOrder.forEach(function(id) {
            state[id] = createDefaultProfile(selectedClass);
        });
        // Restore each profile
        setOrder.forEach(function(id) {
            var saved = data.profiles[id];
            if (!saved) return;
            restoreProfile(id, saved, cls);
            if (legacyWeaponConfig && !saved.weaponConfig) {
                state[id].weaponConfig = {
                    mainType: legacyWeaponConfig.mainType,
                    offHandType: legacyWeaponConfig.offHandType,
                    offHandWeaponType: legacyWeaponConfig.offHandWeaponType
                };
            }
        });
        if (data.activeTab === 'equipment' || data.activeTab === 'transforms' ||
            data.activeTab === 'collections' || data.activeTab === 'relic' || data.activeTab === 'trait' || data.activeTab === 'skill-buffs') {
            activeTab = data.activeTab;
        }
        // Restore formsActiveGrade per set
        if (typeof formsActiveGrade !== 'undefined' && data.formsActiveGrade && typeof data.formsActiveGrade === 'object') {
            var validGrades = ['normal', 'large', 'ancient', 'legendary', 'ultimate'];
            setOrder.forEach(function(id) {
                var g = data.formsActiveGrade[id];
                if (g && validGrades.indexOf(g) !== -1) {
                    formsActiveGrade[id] = g;
                }
            });
        }
        return true;
    } catch (e) { return false; }
}

// Restore a single profile from saved data
function restoreProfile(id, saved, cls) {
    var p = createDefaultProfile(selectedClass);
            // Restore minions
            if (saved.minions && typeof saved.minions === 'object') {
                var minionKeys = MINIONS.map(function(m) { return m.key; });
                if (saved.minions.main && minionKeys.indexOf(saved.minions.main) !== -1) p.minions.main = saved.minions.main;
                if (saved.minions.secondary && minionKeys.indexOf(saved.minions.secondary) !== -1) p.minions.secondary = saved.minions.secondary;
            }
            if (saved.armorType && cls.armorTypes.indexOf(saved.armorType) !== -1) {
                p.armorType = saved.armorType;
            }
            if (saved.weaponConfig && typeof saved.weaponConfig === 'object') {
                var wc = createDefaultWeaponConfig(selectedClass);
                if (saved.weaponConfig.mainType && cls.weapons.indexOf(saved.weaponConfig.mainType) !== -1) {
                    wc.mainType = saved.weaponConfig.mainType;
                }
                if (saved.weaponConfig.offHandType && ['none', 'fuse', 'weapon', 'shield'].indexOf(saved.weaponConfig.offHandType) !== -1) {
                    wc.offHandType = saved.weaponConfig.offHandType;
                }
                if (saved.weaponConfig.offHandWeaponType && WEAPON_TYPE_KEYS.indexOf(saved.weaponConfig.offHandWeaponType) !== -1) {
                    wc.offHandWeaponType = saved.weaponConfig.offHandWeaponType;
                }
                var allowedWc = getAllowedOffHand(wc.mainType, selectedClass);
                if (allowedWc.indexOf(wc.offHandType) === -1) {
                    wc.offHandType = getDefaultOffHand(wc.mainType, selectedClass);
                }
                p.weaponConfig = wc;
            }
            if (typeof saved.apsuEnabled === 'boolean') {
                p.apsuEnabled = saved.apsuEnabled;
            }
            if (saved.armor) {
                var apsuInfoRestore = p.apsuEnabled ? APSU_DATA[selectedClass] : null;
                ARMOR_SLOTS.forEach(function(slot) {
                    var sa = saved.armor[slot.key];
                    if (sa) {
                        if (sa.set && ARMOR_SET_KEYS.indexOf(sa.set) !== -1) p.armor[slot.key].set = sa.set;
                        if (typeof sa.enchant === 'number' && sa.enchant >= 8 && sa.enchant <= 15) p.armor[slot.key].enchant = sa.enchant;
                        if (Array.isArray(sa.bonuses)) {
                            var isHigh = (slot.key === 'helmet' || slot.key === 'chest' || slot.key === 'pants');
                            var validBonusKeys = (isHigh ? FS_BONUSES_HIGH : FS_BONUSES_LOW).map(function(b) { return b.key; });
                            p.armor[slot.key].bonuses = sa.bonuses.filter(function(k) { return validBonusKeys.indexOf(k) !== -1; }).slice(0, 4);
                        }
                        if (sa.bonusValues) {
                            var isHighBV = (slot.key === 'helmet' || slot.key === 'chest' || slot.key === 'pants');
                            var baseBonusList = isHighBV ? FS_BONUSES_HIGH : FS_BONUSES_LOW;
                            // If Apsu is active for this slot, temporarily raise caps for overridden bonuses
                            var apsuOvrRestore = (apsuInfoRestore && apsuInfoRestore.slot === slot.key && apsuInfoRestore.bonusOverride) ? apsuInfoRestore.bonusOverride : null;
                            if (apsuOvrRestore) {
                                var adjustedList = baseBonusList.map(function(b) {
                                    if (apsuOvrRestore[b.key]) return { key: b.key, value: apsuOvrRestore[b.key] };
                                    return b;
                                });
                                restoreBonusValues(p.armor[slot.key].bonusValues, sa.bonusValues, adjustedList);
                            } else {
                                restoreBonusValues(p.armor[slot.key].bonusValues, sa.bonusValues, baseBonusList);
                            }
                        }
                    }
                });
            }
            if (saved.mainWeapon) {
                var mwSet = saved.mainWeapon.set;
                // Map legacy spiked-helper to separate sets
                if (mwSet === 'spiked-helper') mwSet = (saved.mainWeapon.variant === 'pve') ? 'ciclonica-helper' : 'spiked';
                if (mwSet && WEAPON_SET_KEYS.indexOf(mwSet) !== -1 && MAINHAND_EXCLUDED_SETS.indexOf(mwSet) === -1) p.mainWeapon.set = mwSet;
                if (typeof saved.mainWeapon.enchant === 'number' && saved.mainWeapon.enchant >= 8 && saved.mainWeapon.enchant <= 15) p.mainWeapon.enchant = saved.mainWeapon.enchant;
                if (Array.isArray(saved.mainWeapon.bonuses)) {
                    var mwFixed = WEAPON_STATS_FIXED[p.mainWeapon.set];
                    if (mwFixed && mwFixed.bonuses) {
                        var mwValidKeys = mwFixed.bonuses.map(function(b) { return b.key; });
                        p.mainWeapon.bonuses = saved.mainWeapon.bonuses.filter(function(k) { return mwValidKeys.indexOf(k) !== -1; }).slice(0, mwFixed.maxBonuses);
                    }
                }
                if (saved.mainWeapon.bonusValues) {
                    var mwBonusDefs = (WEAPON_STATS_FIXED[p.mainWeapon.set] || {}).bonuses || [];
                    restoreBonusValues(p.mainWeapon.bonusValues, saved.mainWeapon.bonusValues, mwBonusDefs);
                }
            }
            if (saved.offHand) {
                var ohSet = saved.offHand.set;
                // Map legacy spiked-helper to separate sets
                if (ohSet === 'spiked-helper') ohSet = (saved.offHand.variant === 'pve') ? 'ciclonica-helper' : 'spiked';
                if (ohSet && WEAPON_SET_KEYS.indexOf(ohSet) !== -1 && OFFHAND_EXCLUDED_SETS.indexOf(ohSet) === -1) {
                    p.offHand.set = ohSet;
                }
                if (typeof saved.offHand.enchant === 'number' && saved.offHand.enchant >= 8 && saved.offHand.enchant <= 15) p.offHand.enchant = saved.offHand.enchant;
                if (Array.isArray(saved.offHand.bonuses)) {
                    var ohFixed = WEAPON_STATS_FIXED[p.offHand.set];
                    if (ohFixed && ohFixed.bonuses) {
                        var ohValidKeys = ohFixed.bonuses.map(function(b) { return b.key; });
                        p.offHand.bonuses = saved.offHand.bonuses.filter(function(k) { return ohValidKeys.indexOf(k) !== -1; }).slice(0, ohFixed.maxBonuses);
                    }
                }
                if (saved.offHand.bonusValues) {
                    var ohBonusDefs = (WEAPON_STATS_FIXED[p.offHand.set] || {}).bonuses || [];
                    restoreBonusValues(p.offHand.bonusValues, saved.offHand.bonusValues, ohBonusDefs);
                }
            }
            if (saved.shield) {
                var savedShieldSet = saved.shield.set;
                // Map legacy spiked-ciclonica to separate sets
                if (savedShieldSet === 'spiked-ciclonica') {
                    savedShieldSet = (saved.shield.variant === 'pve') ? 'ciclonica' : 'spiked';
                }
                if (savedShieldSet && SHIELD_SET_KEYS.indexOf(savedShieldSet) !== -1) p.shield.set = savedShieldSet;
                if (saved.shield.type === 'battle' || saved.shield.type === 'scale') p.shield.type = saved.shield.type;
                if (Array.isArray(saved.shield.bonuses)) {
                    var shData = SHIELD_STATS[p.shield.set];
                    var typeKey = p.shield.type === 'scale' ? 'scale' : 'battle';
                    var validBonusKeys = shData ? shData.bonuses[typeKey].map(function(b) { return b.key; }) : [];
                    var maxB = shData ? shData.maxBonuses : 0;
                    p.shield.bonuses = saved.shield.bonuses.filter(function(k) { return validBonusKeys.indexOf(k) !== -1; }).slice(0, maxB);
                }
                if (saved.shield.bonusValues) {
                    var shDataBV = SHIELD_STATS[p.shield.set];
                    var typeKeyBV = p.shield.type === 'scale' ? 'scale' : 'battle';
                    var shBonusDefs = shDataBV ? shDataBV.bonuses[typeKeyBV] : [];
                    restoreBonusValues(p.shield.bonusValues, saved.shield.bonusValues, shBonusDefs);
                }
            }
            if (saved.oath) {
                var oathKeys = OATH_OPTIONS.map(function(o) { return o.key; });
                ARMOR_SLOTS.forEach(function(slot) {
                    if (saved.oath[slot.key] && oathKeys.indexOf(saved.oath[slot.key]) !== -1) {
                        p.oath[slot.key] = saved.oath[slot.key];
                    }
                });
            }
            if (saved.manastones) {
                var allGearKeys = ARMOR_SLOT_KEYS.concat(['mainWeapon', 'offHand']).concat(ALL_ACCESSORY_KEYS);
                allGearKeys.forEach(function(gk) {
                    if (saved.manastones[gk] && Array.isArray(saved.manastones[gk])) {
                        var arr = saved.manastones[gk];
                        for (var mi = 0; mi < 3; mi++) {
                            if (arr[mi] && (arr[mi] === 'none' || MANASTONE_KEYS.indexOf(arr[mi]) !== -1)) {
                                p.manastones[gk][mi] = arr[mi];
                            }
                        }
                    }
                });
            }
            if (saved.transform && TRANSFORM_KEYS.indexOf(saved.transform) !== -1) {
                p.transform = saved.transform;
            }
            if (typeof saved.transformEnchant === 'number' && saved.transformEnchant >= 0 && saved.transformEnchant <= 20) {
                p.transformEnchant = saved.transformEnchant;
            }
            if (saved.bonusCollapsed && typeof saved.bonusCollapsed === 'object') {
                ['mainWeapon', 'offHand', 'shield'].concat(ALL_ACCESSORY_KEYS).forEach(function(k) {
                    if (typeof saved.bonusCollapsed[k] === 'boolean') p.bonusCollapsed[k] = saved.bonusCollapsed[k];
                });
            }
            if (saved.accessories) {
                ALL_ACCESSORY_KEYS.forEach(function(accKey) {
                    var sa = saved.accessories[accKey];
                    if (sa) {
                        if (sa.set && ACCESSORY_SET_KEYS.indexOf(sa.set) !== -1) p.accessories[accKey].set = sa.set;
                        if (Array.isArray(sa.bonuses)) {
                            var statsType = ACC_STATS_TYPE[accKey];
                            var setData = ACCESSORY_STATS[p.accessories[accKey].set];
                            if (setData && setData[statsType] && setData[statsType].bonuses) {
                                var validKeys = setData[statsType].bonuses.map(function(b) { return b.key; });
                                var maxB = setData[statsType].maxBonuses;
                                p.accessories[accKey].bonuses = sa.bonuses.filter(function(k) { return validKeys.indexOf(k) !== -1; }).slice(0, maxB);
                            }
                        }
                        if (sa.bonusValues) {
                            var statsTypeBV = ACC_STATS_TYPE[accKey];
                            var setDataBV = ACCESSORY_STATS[p.accessories[accKey].set];
                            if (setDataBV && setDataBV[statsTypeBV] && setDataBV[statsTypeBV].bonuses) {
                                restoreBonusValues(p.accessories[accKey].bonusValues, sa.bonusValues, setDataBV[statsTypeBV].bonuses);
                            }
                        }
                    }
                });
            }
            // Restore collections state
            if (saved.collections) {
                // Item collection inputs
                if (saved.collections.itemColl && typeof saved.collections.itemColl === 'object') {
                    ITEM_COLL_STATS.forEach(function(cs) {
                        var val = parseInt(saved.collections.itemColl[cs.key]);
                        if (!isNaN(val)) {
                            p.collections.itemColl[cs.key] = Math.max(0, Math.min(cs.max, val));
                        }
                    });
                }
            }
            // item collection levels
            if (saved.collLevels) {
                ['normal', 'large', 'powerful'].forEach(function(levelKey) {
                    if (typeof saved.collLevels[levelKey] === 'number') {
                        p.collLevels[levelKey] = Math.max(0, Math.min(10, saved.collLevels[levelKey]));
                    }
                });
            }
            // Restore relic state
            if (saved.relic && typeof saved.relic.level === 'number') {
                var relicLvl = Math.max(1, Math.min(300, saved.relic.level));
                p.relic.level = relicLvl;
            }
            // Restore glyph state
            if (saved.glyph && typeof saved.glyph === 'object') {
                if (typeof saved.glyph.enabled === 'boolean') {
                    p.glyph.enabled = saved.glyph.enabled;
                }
                if (Array.isArray(saved.glyph.bonuses) && saved.glyph.bonuses.length > 0) {
                    var glyphBonusKeys = ACC_BONUSES_GLYPH.map(function(b) { return b.key; });
                    var validGlyphBonuses = saved.glyph.bonuses.filter(function(k) { return glyphBonusKeys.indexOf(k) !== -1; });
                    if (validGlyphBonuses.length > 0) p.glyph.bonuses = validGlyphBonuses;
                }
                if (saved.glyph.extra && typeof saved.glyph.extra === 'object') {
                    ['attack', 'physicalDef', 'magicalDef'].forEach(function(stat) {
                        if (typeof saved.glyph.extra[stat] === 'number') {
                            p.glyph.extra[stat] = Math.max(0, Math.min(250, saved.glyph.extra[stat]));
                        }
                    });
                }
                // Restore glyph bonusValues
                restoreBonusValues(p.glyph.bonusValues, saved.glyph.bonusValues, ACC_BONUSES_GLYPH);
            }
            // Restore skill buff toggles
            if (saved.skillBuffs && typeof saved.skillBuffs === 'object') {
                var validKeys = getSkillBuffsForClass(selectedClass).map(function(b) { return b.key; });
                validKeys.forEach(function(k) {
                    if (typeof saved.skillBuffs[k] === 'boolean') {
                        p.skillBuffs[k] = saved.skillBuffs[k];
                    }
                });
            }
            // Restore skill buff enchant levels
            if (saved.skillBuffEnchants && typeof saved.skillBuffEnchants === 'object') {
                var enchBuffs = getSkillBuffsForClass(selectedClass).filter(function(b) { return !!b.enchant; });
                enchBuffs.forEach(function(b) {
                    var val = saved.skillBuffEnchants[b.key];
                    if (typeof val === 'number' && val >= 0 && val <= b.enchant.maxLevel) {
                        p.skillBuffEnchants[b.key] = val;
                    }
                });
            }
            // Restore owned forms
            if (saved.ownedForms && typeof saved.ownedForms === 'object') {
                for (var fid in saved.ownedForms) {
                    var numId = parseInt(fid);
                    if (ALL_FORM_IDS.indexOf(numId) !== -1 && typeof saved.ownedForms[fid] === 'boolean') {
                        p.ownedForms[numId] = saved.ownedForms[fid];
                    }
                }
            }
            state[id] = p;
}

var selectedClass = 'gladiator';
var activeTab = 'equipment';
var state = {
    1: createDefaultProfile('gladiator'),
    2: createDefaultProfile('gladiator')
};
