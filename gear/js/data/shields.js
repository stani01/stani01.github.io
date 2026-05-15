'use strict';


var SHIELD_SETS = [
    { key: 'none',             name: 'None' },
    { key: 'spiked',          name: 'Spiked (PvP)' },
    { key: 'ciclonica',       name: 'Ciclonica (PvE)' },
    { key: 'fighting-spirit',  name: 'Fighting Spirit' },
    { key: 'salvation',        name: 'Salvation' }
];
var SHIELD_SET_KEYS = SHIELD_SETS.map(function(s) { return s.key; });

// Each shield set defines: base stats, enchant bonuses (flat totals),
// selectable bonuses (max picks), and optional pvp/pve base stats.
// battle vs scale: pDef↔mDef swapped in base, accuracy->accuracy stays same key,
//   but attack->attack stays same key (unified). The BONUS list differs:
//   battle: accuracy + attack (physical), scale: accuracy + attack (magical)
//   We store them in the same unified keys since class context determines interpretation.
var SHIELD_STATS = {
    'spiked': {
        maxBonuses: 4,
        base: {
            battle: { hp: 2213, physicalDef: 592, magicalDef: 296, block: 2675 },
            scale:  { hp: 2213, physicalDef: 296, magicalDef: 592, block: 2675 }
        },
        pvpBase: { pvpAttack: 88, pvpDefence: 88 },
        enchant: {
            flat: { pvpAttack: 36, pvpDefence: 158 }
        },
        bonuses: {
            battle: [
                { key: 'hp', name: 'HP', value: 1344 },
                { key: 'block', name: 'Block', value: 1433 },
                { key: 'accuracy', name: 'Accuracy', value: 288 },
                { key: 'crit', name: 'Crit', value: 254 },
                { key: 'attack', name: 'Attack', value: 210 },
                { key: 'healingBoost', name: 'Healing Boost', value: 183 },
                { key: 'physicalDef', name: 'Physical Defence', value: 210 },
                { key: 'magicalDef', name: 'MagicalDefence', value: 210 }
            ],
            scale: [
                { key: 'hp', name: 'HP', value: 1344 },
                { key: 'block', name: 'Block', value: 1433 },
                { key: 'accuracy', name: 'Accuracy', value: 288 },
                { key: 'crit', name: 'Crit', value: 254 },
                { key: 'attack', name: 'Attack', value: 210 },
                { key: 'healingBoost', name: 'Healing Boost', value: 183 },
                { key: 'physicalDef', name: 'Physical Defence', value: 210 },
                { key: 'magicalDef', name: 'MagicalDefence', value: 210 }
            ]
        }
    },
    'ciclonica': {
        maxBonuses: 4,
        base: {
            battle: { hp: 2213, physicalDef: 592, magicalDef: 296, block: 2675 },
            scale:  { hp: 2213, physicalDef: 296, magicalDef: 592, block: 2675 }
        },
        pveBase: { pveAttack: 88, pveDefence: 88 },
        enchant: {
            flat: { pveAttack: 36, pveDefence: 158 }
        },
        bonuses: {
            battle: [
                { key: 'hp', name: 'HP', value: 1344 },
                { key: 'block', name: 'Block', value: 1433 },
                { key: 'accuracy', name: 'Accuracy', value: 288 },
                { key: 'crit', name: 'Crit', value: 254 },
                { key: 'attack', name: 'Attack', value: 210 },
                { key: 'healingBoost', name: 'Healing Boost', value: 183 },
                { key: 'physicalDef', name: 'Physical Defence', value: 210 },
                { key: 'magicalDef', name: 'MagicalDefence', value: 210 }
            ],
            scale: [
                { key: 'hp', name: 'HP', value: 1344 },
                { key: 'block', name: 'Block', value: 1433 },
                { key: 'accuracy', name: 'Accuracy', value: 288 },
                { key: 'crit', name: 'Crit', value: 254 },
                { key: 'attack', name: 'Attack', value: 210 },
                { key: 'healingBoost', name: 'Healing Boost', value: 183 },
                { key: 'physicalDef', name: 'Physical Defence', value: 210 },
                { key: 'magicalDef', name: 'MagicalDefence', value: 210 }
            ]
        }
    },
    'fighting-spirit': {
        maxBonuses: 3,
        base: {
            battle: { physicalDef: 829, magicalDef: 414, block: 2675 },
            scale:  { physicalDef: 829, magicalDef: 414, block: 2675 }
        },
        enchant: {
            flat: { attack: 175, physicalDef: 175, magicalDef: 175 }
        },
        bonuses: {
            battle: [
                { key: 'hp', name: 'HP', value: 1344 },
                { key: 'block', name: 'Block', value: 1433 },
                { key: 'accuracy', name: 'Accuracy', value: 288 },
                { key: 'crit', name: 'Crit', value: 254 },
                { key: 'attack', name: 'Attack', value: 210 },
                { key: 'healingBoost', name: 'Healing Boost', value: 183 },
                { key: 'physicalDef', name: 'Physical Defence', value: 210 },
                { key: 'magicalDef', name: 'MagicalDefence', value: 210 },
                { key: 'increasedRegen', name: 'Increased Regen', value: 10 }
            ],
            scale: [
                { key: 'hp', name: 'HP', value: 1344 },
                { key: 'block', name: 'Block', value: 1433 },
                { key: 'accuracy', name: 'Accuracy', value: 288 },
                { key: 'crit', name: 'Crit', value: 254 },
                { key: 'attack', name: 'Attack', value: 210 },
                { key: 'healingBoost', name: 'Healing Boost', value: 183 },
                { key: 'physicalDef', name: 'Physical Defence', value: 210 },
                { key: 'magicalDef', name: 'MagicalDefence', value: 210 },
                { key: 'increasedRegen', name: 'Increased Regen', value: 10 }
            ]
        }
    },
    'salvation': {
        maxBonuses: 3,
        base: {
            battle: { physicalDef: 870, magicalDef: 434, block: 2809 },
            scale:  { physicalDef: 870, magicalDef: 434, block: 2809 }
        },
        enchant: {
            flat: { attack: 175, physicalDef: 175, magicalDef: 175 }
        },
        bonuses: {
            battle: [
                { key: 'hp', name: 'HP', value: 1371 },
                { key: 'block', name: 'Block', value: 1462 },
                { key: 'accuracy', name: 'Accuracy', value: 294 },
                { key: 'crit', name: 'Crit', value: 292 },
                { key: 'attack', name: 'Attack', value: 214 },
                { key: 'healingBoost', name: 'Healing Boost', value: 187 },
                { key: 'physicalDef', name: 'Physical Defence', value: 214 },
                { key: 'magicalDef', name: 'MagicalDefence', value: 214 },
                { key: 'increasedRegen', name: 'Increased Regen', value: 11 }
            ],
            scale: [
                { key: 'hp', name: 'HP', value: 1371 },
                { key: 'block', name: 'Block', value: 1462 },
                { key: 'accuracy', name: 'Accuracy', value: 294 },
                { key: 'crit', name: 'Crit', value: 292 },
                { key: 'attack', name: 'Attack', value: 214 },
                { key: 'healingBoost', name: 'Healing Boost', value: 187 },
                { key: 'physicalDef', name: 'Physical Defence', value: 214 },
                { key: 'magicalDef', name: 'MagicalDefence', value: 214 },
                { key: 'increasedRegen', name: 'Increased Regen', value: 11 }
            ]
        }
    }
};

// Calculate total shield stats for a given configuration
// classPhysical: true if class is physical, false if magical
//   battle shield -> attack/crit/accuracy are physical; if class is magical -> zero them
//   scale shield  -> attack/crit/accuracy are magical; if class is physical -> zero them
function getShieldStats(shieldSet, shieldType, selectedBonuses, classPhysical, bonusValues) {
    var stats = emptyStats();
    stats.hpBase = 0;
    stats.hpBonus = 0;
    if (shieldSet === 'none') return stats;
    var data = SHIELD_STATS[shieldSet];
    if (!data) return stats;

    var typeKey = shieldType === 'scale' ? 'scale' : 'battle';
    // Shield attack/crit counts only if shield type matches class type
    var shieldMatchesClass = (typeKey === 'battle') ? classPhysical : !classPhysical;

    // Base stats
    var base = data.base[typeKey];
    if (base) {
        STAT_KEYS.forEach(function(k) { stats[k] += (base[k] || 0); });
        if (base.hp) stats.hpBase += base.hp;
    }

    // PvP/PvE base (spiked or ciclonica)
    if (data.pvpBase) {
        STAT_KEYS.forEach(function(k) { stats[k] += (data.pvpBase[k] || 0); });
    }
    if (data.pveBase) {
        STAT_KEYS.forEach(function(k) { stats[k] += (data.pveBase[k] || 0); });
    }

    // Enchant bonuses (flat totals)
    if (data.enchant && data.enchant.flat) {
        var flatVals = data.enchant.flat;
        STAT_KEYS.forEach(function(k) { stats[k] += (flatVals[k] || 0); });
    }

    // Zero out attack/crit/accuracy if shield type doesn't match class type
    if (!shieldMatchesClass) {
        stats.attack = 0;
        stats.crit = 0;
        stats.accuracy = 0;
    }

    // Selected bonuses
    var bonusList = data.bonuses[typeKey] || [];
    (selectedBonuses || []).forEach(function(bKey) {
        var bonus = bonusList.find(function(b) { return b.key === bKey; });
        if (bonus) {
            // attack/crit/accuracy bonuses only count if shield matches class
            if ((bonus.key === 'attack' || bonus.key === 'crit' || bonus.key === 'accuracy') && !shieldMatchesClass) return;
            var bv = (bonusValues && typeof bonusValues[bKey] === 'number') ? bonusValues[bKey] : bonus.value;
            stats[bonus.key] += bv;
            if (bonus.key === 'hp') stats.hpBonus += bv;
        }
    });

    return stats;
}

// Get default shield bonuses (first N from the list)
function getDefaultShieldBonuses(setKey, typeKey) {
    if (setKey === 'none') return [];
    var data = SHIELD_STATS[setKey];
    if (!data) return [];
    var bonusList = data.bonuses[typeKey] || [];
    return bonusList.slice(0, data.maxBonuses).map(function(b) { return b.key; });
}

function getDefaultWeaponBonuses(setKey) {
    if (setKey === 'none') return [];
    var fixed = WEAPON_STATS_FIXED[setKey];
    if (!fixed || !fixed.bonuses) return [];
    return fixed.bonuses.slice(0, fixed.maxBonuses).map(function(b) { return b.key; });
}

function getDefaultAccBonuses(setKey, slotKey) {
    if (setKey === 'none') return [];
    var statsType = ACC_STATS_TYPE[slotKey] || slotKey;
    var setData = ACCESSORY_STATS[setKey];
    if (!setData) return [];
    var slotData = setData[statsType];
    if (!slotData || !slotData.bonuses) return [];
    if (statsType === 'feather') return ['physicalDef', 'magicalDef', 'hp', 'crit'].slice(0, slotData.maxBonuses);
    return ['hp', 'crit', 'attack', 'accuracy'].slice(0, slotData.maxBonuses);
}

function getDefaultArmorBonuses(slotKey) {
    // High: helmet, chest, pants; Low: shoulders, gloves, boots
    var isHigh = (slotKey === 'helmet' || slotKey === 'chest' || slotKey === 'pants');
    if (isHigh) {
        // hp, crit, physicalDef, magicalDef
        return ['hp', 'crit', 'physicalDef', 'magicalDef'];
    } else {
        // crit, physicalDef, magicalDef, increasedRegen
        return ['crit', 'physicalDef', 'magicalDef', 'increasedRegen'];
    }
}
