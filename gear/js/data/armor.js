'use strict';

// -- Apsu Illusion data: stat deltas vs Fighting Spirit, per class --
var APSU_DATA = {
    gladiator:    { slot: 'chest',     stats: { hp: 1000, attack: 20 }, bonusOverride: { hp: 5000 } },
    templar:      { slot: 'chest',     stats: { hp: 1000, attack: 20 }, bonusOverride: { hp: 5000 } },
    aethertech:   { slot: 'chest',     stats: { hp: 1000, attack: 20 } },
    chanter:      { slot: 'gloves',    stats: { attack: 20, magicalDef: 46, physicalDef: 3 } },
    cleric:       { slot: 'gloves',    stats: { attack: 20, physicalDef: 50 } },
    bard:         { slot: 'pants',     stats: { hp: 645, attack: 20, magicalDef: -368, physicalDef: 214 } },
    painter:      { slot: 'shoulders', stats: { magicalDef: 50, attack: 20 } },
    ranger:       { slot: 'boots',     stats: { magicalDef: 97, attack: 20, physicalDef: -46 } },
    assassin:     { slot: 'boots',     stats: { magicalDef: 97, attack: 20, physicalDef: -46 } },
    gunner:       { slot: 'shoulders', stats: { attack: 20, magicalDef: 50 } },
    sorcerer:     { slot: 'helmet',    stats: { hp: 1000, attack: 20 } },
    spiritmaster: { slot: 'helmet',    stats: { hp: 1000, attack: 20 } }
};

function getApsuSlotForClass(className) {
    var data = APSU_DATA[className];
    return data ? data.slot : null;
}

// Fighting Spirit: slot tier mapping
var FS_TIER = {
    helmet: 'high', chest: 'high', pants: 'high',
    shoulders: 'low', gloves: 'low', boots: 'low'
};

// Fighting Spirit: [pDef, mDef] per armor type and tier
var FS_DEF = {
    'physical-plate':   { high: [2229, 1911], low: [1620, 1387] },
    'magical-plate':    { high: [2229, 1911], low: [1620, 1387] },
    'physical-chain':   { high: [2166, 1676], low: [1574, 1435] },
    'magical-chain':    { high: [2101, 2038], low: [1527, 1481] },
    'physical-leather': { high: [2038, 2101], low: [1481, 1527] },
    'magical-leather':  { high: [1974, 2166], low: [1435, 1574] },
    'physical-cloth':   { high: [1974, 2166], low: [1435, 1574] },
    'magical-cloth':    { high: [1911, 2229], low: [1387, 1620] }
};

// Fighting Spirit: common stats by tier (same for all armor types)
var FS_COMMON = {
    high: { hp: 2368, attack: 1676, enchDef: 175, enchAtk: 175 },
    low:  { hp: 0,    attack: 1200, enchDef: 175, enchAtk: 175 }
};

var FS_BONUSES_HIGH = [
    { key: 'hp', name: 'HP', stat: 'hp', value: 1344 },
    { key: 'accuracy', name: 'Accuracy', stat: 'accuracy', value: 288 },
    { key: 'crit',     name: 'Crit', stat: 'crit', value: 254 },
    { key: 'physicalDef',   name: 'Physical Defence', stat: 'physicalDef', value: 210 },
    { key: 'magicalDef',   name: 'Magical Defence', stat: 'magicalDef', value: 210 },
    { key: 'evasion',   name: 'Evasion', stat: 'evasion', value: 356 },
    { key: 'magicResist',   name: 'Magic Resist', stat: 'magicResist', value: 356 },
    { key: 'increasedRegen', name: 'Increased Regen', stat: 'increasedRegen', value: 30 }
];

var FS_BONUSES_LOW = [
    { key: 'accuracy', name: 'Accuracy', stat: 'accuracy', value: 144 },
    { key: 'crit',     name: 'Crit', stat: 'crit', value: 127 },
    { key: 'physicalDef',   name: 'Physical Defence', stat: 'physicalDef', value: 210 },
    { key: 'magicalDef',   name: 'Magical Defence', stat: 'magicalDef', value: 210 },
    { key: 'evasion',   name: 'Evasion', stat: 'evasion', value: 178 },
    { key: 'magicResist',   name: 'Magic Resist', stat: 'magicResist', value: 178 },
    { key: 'increasedRegen', name: 'Increased Regen', stat: 'increasedRegen', value: 10 }
];
// Extreme gear (Acrimony/Presumption): slot tier mapping
var EX_TIER = {
    helmet: 'high', chest: 'high',
    pants: 'mid',
    shoulders: 'low', gloves: 'low', boots: 'low'
};

// Extreme gear: base [pDef, mDef] per armor type and tier
var EX_BASE_DEF = {
    'physical-plate':   { high: [2294, 1965], mid: [1971, 1689], low: [1665, 1428] },
    'magical-plate':    { high: [2228, 2031], mid: [1914, 1745], low: [1619, 1476] },
    'physical-chain':   { high: [2228, 2031], mid: [1914, 1745], low: [1619, 1476] },
    'magical-chain':    { high: [2162, 2097], mid: [1857, 1802], low: [1571, 1523] },
    'physical-leather': { high: [2097, 2162], mid: [1802, 1857], low: [1523, 1571] },
    'magical-leather':  { high: [2031, 2228], mid: [1745, 1914], low: [1476, 1619] },
    'physical-cloth':   { high: [2031, 2228], mid: [1745, 1914], low: [1476, 1619] },
    'magical-cloth':    { high: [1965, 2294], mid: [1689, 1971], low: [1428, 1665] }
};

// Extreme gear common stats per tier (applies to both acrimony and presumption)
var EX_COMMON = {
    high: { hp: 2273, attack: 1532 },
    mid:  { hp: 1933, attack: 1297 },
    low:  { hp: 1380, attack: 1097 }
};

// Acrimony enchant bonuses: { attack, def, hp, crit } each with { low, mid, high }
var ACRI_ENCHANT = {
    8:  { attack: { low: 195, mid: 241, high: 270 }, def: { low: 306, mid: 387, high: 419 }, hp: { low: 2155, mid: 2480, high: 2802 }, crit: { low: 647, mid: 816, high: 884 } },
    9:  { attack: { low: 243, mid: 300, high: 336 }, def: { low: 381, mid: 482, high: 522 }, hp: { low: 2685, mid: 3090, high: 3491 }, crit: { low: 806, mid: 1017, high: 1102 } },
    10: { attack: { low: 291, mid: 359, high: 403 }, def: { low: 456, mid: 577, high: 626 }, hp: { low: 3216, mid: 3701, high: 4181 }, crit: { low: 965, mid: 1217, high: 1319 } },
    11: { attack: { low: 339, mid: 418, high: 469 }, def: { low: 531, mid: 672, high: 729 }, hp: { low: 3746, mid: 4311, high: 4870 }, crit: { low: 1124, mid: 1418, high: 1537 } },
    12: { attack: { low: 387, mid: 477, high: 535 }, def: { low: 606, mid: 768, high: 832 }, hp: { low: 4276, mid: 4921, high: 5560 }, crit: { low: 1284, mid: 1619, high: 1754 } },
    13: { attack: { low: 435, mid: 537, high: 602 }, def: { low: 682, mid: 863, high: 935 }, hp: { low: 4807, mid: 5532, high: 6250 }, crit: { low: 1443, mid: 1820, high: 1972 } },
    14: { attack: { low: 483, mid: 596, high: 668 }, def: { low: 757, mid: 958, high: 1038 }, hp: { low: 5337, mid: 6142, high: 6939 }, crit: { low: 1602, mid: 2021, high: 2190 } },
    15: { attack: { low: 531, mid: 655, high: 735 }, def: { low: 832, mid: 1053, high: 1142 }, hp: { low: 5868, mid: 6753, high: 7629 }, crit: { low: 1761, mid: 2221, high: 2407 } }
};

// Presumption enchant bonuses: { attack, def, hp } each with { low, mid, high }
var PRES_ENCHANT = {
    8:  { attack: { low: 195, mid: 241, high: 270 }, def: { low: 468, mid: 592, high: 640 }, hp: { low: 2155, mid: 2480, high: 2802 } },
    9:  { attack: { low: 243, mid: 300, high: 336 }, def: { low: 583, mid: 737, high: 798 }, hp: { low: 2685, mid: 3090, high: 3491 } },
    10: { attack: { low: 291, mid: 359, high: 403 }, def: { low: 698, mid: 883, high: 955 }, hp: { low: 3216, mid: 3701, high: 4181 } },
    11: { attack: { low: 339, mid: 418, high: 469 }, def: { low: 814, mid: 1028, high: 1113 }, hp: { low: 3746, mid: 4311, high: 4870 } },
    12: { attack: { low: 387, mid: 477, high: 535 }, def: { low: 929, mid: 1174, high: 1271 }, hp: { low: 4276, mid: 4921, high: 5560 } },
    13: { attack: { low: 435, mid: 537, high: 602 }, def: { low: 1044, mid: 1320, high: 1428 }, hp: { low: 4807, mid: 5532, high: 6250 } },
    14: { attack: { low: 483, mid: 596, high: 668 }, def: { low: 1159, mid: 1465, high: 1586 }, hp: { low: 5337, mid: 6142, high: 6939 } },
    15: { attack: { low: 531, mid: 655, high: 735 }, def: { low: 1274, mid: 1611, high: 1743 }, hp: { low: 5868, mid: 6753, high: 7629 } }
};

// Obstinacy enchant bonuses: { mr, def, hp } each with { low, mid, high }
var OBST_ENCHANT = {
    8:  { magicResist: { low: 933, mid: 1024, high: 1212 }, def: { low: 387, mid: 491, high: 530 }, hp: { low: 2155, mid: 2480, high: 2802 } },
    9:  { magicResist: { low: 1162, mid: 1276, high: 1511 }, def: { low: 482, mid: 612, high: 660 }, hp: { low: 2685, mid: 3090, high: 3491 } },
    10: { magicResist: { low: 1392, mid: 1528, high: 1809 }, def: { low: 577, mid: 732, high: 791 }, hp: { low: 3216, mid: 3701, high: 4181 } },
    11: { magicResist: { low: 1622, mid: 1780, high: 2107 }, def: { low: 672, mid: 853, high: 921 }, hp: { low: 3746, mid: 4311, high: 4870 } },
    12: { magicResist: { low: 1851, mid: 2032, high: 2406 }, def: { low: 768, mid: 974, high: 1051 }, hp: { low: 4276, mid: 4921, high: 5560 } },
    13: { magicResist: { low: 2081, mid: 2284, high: 2704 }, def: { low: 863, mid: 1095, high: 1182 }, hp: { low: 4807, mid: 5532, high: 6250 } },
    14: { magicResist: { low: 2310, mid: 2536, high: 3003 }, def: { low: 958, mid: 1216, high: 1312 }, hp: { low: 5337, mid: 6142, high: 6939 } },
    15: { magicResist: { low: 2540, mid: 2788, high: 3301 }, def: { low: 1053, mid: 1336, high: 1443 }, hp: { low: 5868, mid: 6753, high: 7629 } }
};

// Extreme armor bonus stats (item-level bonuses, always shown)
// These are separate from enchant bonuses and shown in optional stats
var EXTREME_ARMOR_BONUS = {
    acrimony: { bonusAtk: 20, bonusPDef: 10, bonusMDef: 10, bonusHp: 20, bonusCrit: 20 },
    presumption: { bonusAtk: 20, bonusPDef: 20, bonusMDef: 20, bonusHp: 20 },
    obstinacy: { bonusMagicResist: 30, bonusPDef: 15, bonusMDef: 15, bonusHp: 20 }
};

// Calculate actual stats for one armor slot
function getArmorSlotStats(armorType, setKey, slotKey, enchantLevel, selectedBonuses, bonusValues) {
    var s = emptyStats();
    s.hpBase = 0;
    s.hpBonus = 0;

    // No armor equipped - return zero stats
    if (setKey === 'none') return s;

    if (setKey === 'fighting-spirit') {
        var tier = FS_TIER[slotKey];
        var def = FS_DEF[armorType];
        if (!def) return s;
        var d = def[tier];
        var c = FS_COMMON[tier];
        s.hpBase = c.hp;
        s.hp = s.hpBase;
        s.attack = c.attack + c.enchAtk;
        s.physicalDef = d[0] + c.enchDef;
        s.magicalDef = d[1] + c.enchDef;

        // All other stats come from selected bonuses
        if (selectedBonuses && selectedBonuses.length > 0) {
            var isHigh = (slotKey === 'helmet' || slotKey === 'chest' || slotKey === 'pants');
            var bonusList = isHigh ? FS_BONUSES_HIGH : FS_BONUSES_LOW;
            selectedBonuses.forEach(function(bKey) {
                var found = bonusList.find(function(b) { return b.key === bKey; });
                if (found && found.stat) {
                    var bv = (bonusValues && typeof bonusValues[bKey] === 'number') ? bonusValues[bKey] : found.value;
                    if (found.stat === 'hp') {
                        s.hpBonus += bv;
                    } else {
                        s[found.stat] += bv;
                    }
                }
            });
        }
        s.hp += s.hpBonus;
    } else if (setKey === 'acrimony' || setKey === 'presumption' || setKey === 'obstinacy') {
        var tier = EX_TIER[slotKey];
        var baseDef = EX_BASE_DEF[armorType];
        if (!baseDef) return s;
        var bd = baseDef[tier];
        var ec = EX_COMMON[tier];
        s.physicalDef = bd[0];
        s.magicalDef = bd[1];
        s.hpBase = ec.hp;
        s.hp = s.hpBase;
        s.attack = ec.attack;
        // Base bonus
        if (setKey === 'acrimony') {
            s.attack += 20; s.physicalDef += 10; s.magicalDef += 10; s.hpBonus += 20; s.crit += 20;
        } else if (setKey === 'presumption') {
            s.attack += 20; s.physicalDef += 20; s.magicalDef += 20; s.hpBonus += 20;
        } else if (setKey === 'obstinacy') {
            s.magicResist += 30; s.physicalDef += 15; s.magicalDef += 15; s.hpBonus += 20;
        }
        // Enchant bonuses (+8 to +15)
        var bonusTable = (setKey === 'acrimony') ? ACRI_ENCHANT : (setKey === 'presumption') ? PRES_ENCHANT : OBST_ENCHANT;
        if (enchantLevel >= 8 && bonusTable[enchantLevel]) {
            var b = bonusTable[enchantLevel];
            if (setKey === 'obstinacy') {
                s.magicResist += b.magicResist[tier];
            }else {
                s.attack += b.attack[tier];
            }
            s.physicalDef += b.def[tier];
            s.magicalDef += b.def[tier];
            s.hpBonus += b.hp[tier];
            if (setKey === 'acrimony' && b.crit) {
                s.crit += b.crit[tier];
            }
        }
        s.hp += s.hpBonus;
    }
    return s;
}
