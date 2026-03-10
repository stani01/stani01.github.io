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
        minions: { main: 'crit-sita', secondary: 'crit-sita' },
        armorType: CLASS_DATA[className].armorTypes[0],
        armor: {},
        mainWeapon: { set: 'fighting-spirit', enchant: 9, bonuses: getDefaultWeaponBonuses('fighting-spirit') },
        offHand: { set: 'fighting-spirit', enchant: 9, bonuses: getDefaultWeaponBonuses('fighting-spirit') },
        shield: { set: 'fighting-spirit', type: 'battle', bonuses: getDefaultShieldBonuses('fighting-spirit', 'battle') },
        oath: { shoulders: 'silent-skill', helmet: 'silent-skill', chest: 'ultimate-3', pants: 'ultimate-3', gloves: 'ultimate-3', boots: 'ultimate-3' },
        manastones: {},
        transform: 'none',
        transformEnchant: 10,
        bonusCollapsed: { mainWeapon: false, offHand: false, shield: false },
        accessories: {},
        glyph: {
            bonuses: ['attack'], 
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
        bonuses: getDefaultArmorBonuses(slot.key)
    };
    });
    // Initialize accessories
    ALL_ACCESSORY_KEYS.forEach(function(accKey) {
        profile.accessories[accKey] = {
            set: 'aeon-guardian',
            bonuses: getDefaultAccBonuses('aeon-guardian', accKey)
        };
    });
    // Initialize manastone arrays for all gear slots
    // Default: Full Crit for all classes, Full Attack for assassin/ranger
    var defaultMana = (className === 'assassin' || className === 'ranger') ? 'attack' : 'crit';
    ARMOR_SLOTS.forEach(function(slot) {
        profile.manastones[slot.key] = [defaultMana, defaultMana, defaultMana];
    });
    profile.manastones.mainWeapon = [defaultMana, defaultMana, defaultMana];
    profile.manastones.offHand = [defaultMana, defaultMana, defaultMana];
    // Initialize acc manastones (3 slots each)
    ALL_ACCESSORY_KEYS.forEach(function(accKey) {
        profile.manastones[accKey] = [defaultMana, defaultMana, defaultMana];
    });
    // Initialize collections state
    profile.collections = { tfToggled: {}, itemColl: {} };
    profile.collLevels = { normal: 6, large: 6, powerful: 6 };
    ITEM_COLL_STATS.forEach(function(cs) { profile.collections.itemColl[cs.key] = cs.max; });
    TF_COLLECTIONS.forEach(function(coll) { profile.collections.tfToggled[coll.key] = true; });
    // Initialize relic state
    profile.relic = { level: 300 };
    // Initialize trait selections (default: first column for each level)
    profile.traitSelections = {};
    [81, 82, 83, 84, 85].forEach(function(lvl) {
        profile.traitSelections[lvl] = 0;
    });
    // Initialize skill buff toggles
    profile.skillBuffs = {};
    var allBuffs = getSkillBuffsForClass(className);
    allBuffs.forEach(function(buff) {
        profile.skillBuffs[buff.key] = !!buff.defaultActive;
    });
    return profile;
}

var STORAGE_KEY = 'gc-state-v3';

function saveState() {
    try {
        var data = { selectedClass: selectedClass, weaponConfig: weaponConfig, profiles: { 1: state[1], 2: state[2] }, activeTab: activeTab };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* quota exceeded or private mode */ }
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
        // Restore weapon config
        if (data.weaponConfig) {
            var wc = data.weaponConfig;
            weaponConfig = createDefaultWeaponConfig(selectedClass);
            if (wc.mainType && cls.weapons.indexOf(wc.mainType) !== -1) weaponConfig.mainType = wc.mainType;
            if (['none','fuse','weapon','shield'].indexOf(wc.offHandType) !== -1) weaponConfig.offHandType = wc.offHandType;
            if (wc.offHandWeaponType && WEAPON_TYPE_KEYS.indexOf(wc.offHandWeaponType) !== -1) weaponConfig.offHandWeaponType = wc.offHandWeaponType;
            // Validate off-hand type against current rules
            var allowed = getAllowedOffHand(weaponConfig.mainType, selectedClass);
            if (allowed.indexOf(weaponConfig.offHandType) === -1) {
                weaponConfig.offHandType = getDefaultOffHand(weaponConfig.mainType, selectedClass);
            }
        }
        [1, 2].forEach(function(id) {
            var saved = data.profiles[id];
            if (!saved) return;
            var p = createDefaultProfile(selectedClass);
            if (saved.armorType && cls.armorTypes.indexOf(saved.armorType) !== -1) {
                p.armorType = saved.armorType;
            }
            if (saved.armor) {
                ARMOR_SLOTS.forEach(function(slot) {
                    var sa = saved.armor[slot.key];
                    if (sa) {
                        if (sa.set && ARMOR_SET_KEYS.indexOf(sa.set) !== -1) p.armor[slot.key].set = sa.set;
                        if (typeof sa.enchant === 'number' && sa.enchant >= 8 && sa.enchant <= 15) p.armor[slot.key].enchant = sa.enchant;
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
                var allGearKeys = ARMOR_SLOT_KEYS.concat(['mainWeapon', 'offHand']);
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
                    }
                });
            }
            // Restore collections state
            if (saved.collections) {
                // TF collection toggles
                if (saved.collections.tfToggled && typeof saved.collections.tfToggled === 'object') {
                    var validTFKeys = TF_COLLECTIONS.map(function(c) { return c.key; });
                    validTFKeys.forEach(function(k) {
                        if (typeof saved.collections.tfToggled[k] === 'boolean') {
                            p.collections.tfToggled[k] = saved.collections.tfToggled[k];
                        }
                    });
                }
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
            // Restore skill buff toggles
            if (saved.skillBuffs && typeof saved.skillBuffs === 'object') {
                var validKeys = getSkillBuffsForClass(selectedClass).map(function(b) { return b.key; });
                validKeys.forEach(function(k) {
                    if (typeof saved.skillBuffs[k] === 'boolean') {
                        p.skillBuffs[k] = saved.skillBuffs[k];
                    }
                });
            }
            state[id] = p;
        });
        if (data.activeTab === 'equipment' || data.activeTab === 'transforms' ||
            data.activeTab === 'collections' || data.activeTab === 'relic' || data.activeTab === 'trait' || data.activeTab === 'skill-buffs') {
            activeTab = data.activeTab;
        }
        return true;
    } catch (e) { return false; }
}

var selectedClass = 'gladiator';
var activeTab = 'equipment';
var weaponConfig = createDefaultWeaponConfig('gladiator');
var state = {
    1: createDefaultProfile('gladiator'),
    2: createDefaultProfile('gladiator')
};
