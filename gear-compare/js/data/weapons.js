'use strict';


// Fixed-stat weapons (stats baked in, only vary by 2h/1h)
// pvpStat/pveStat: which pvp/pve stat keys the bonus/enchant values map to
var WEAPON_STATS_FIXED = {
    'spiked':          { baseAtk: 4796, bonusAtk: 275, pvpStat: true, pvpPveAtk2h: 176, pvpPveDef2h: 176, pvpPveAtk1h: 88, pvpPveDef1h: 88, enchPvpPveAtk2h: 371, enchPvpPveDef2h: 101, enchPvpPveAtk1h: 223, enchPvpPveDef1h: 61, enchHp: 1917, enchCrit: 363, baseDef: 177, baseAcc: 2675, bonusAcc: 0 },
    'ciclonica-helper':{ baseAtk: 4796, bonusAtk: 275, pveStat: true, pvpPveAtk2h: 176, pvpPveDef2h: 176, pvpPveAtk1h: 88, pvpPveDef1h: 88, enchPvpPveAtk2h: 371, enchPvpPveDef2h: 101, enchPvpPveAtk1h: 223, enchPvpPveDef1h: 61, enchHp: 1917, enchCrit: 363, baseDef: 177, baseAcc: 2675, bonusAcc: 0 },
    'fighting-spirit': { baseAtk: 5515, enchAtk2h: 350, enchDef2h: 175, enchAtk1h: 230, enchDef1h: 120, enchHp: 0, baseDef: 0, baseAcc: 2675,
        maxBonuses: 3,
        bonuses: [
            { key: 'accuracy',     name: 'Accuracy',      stat: 'accuracy',     value: 411 },
            { key: 'crit',         name: 'Crit',          stat: 'crit',          value: 363 },
            { key: 'attack',       name: 'Attack',        stat: 'attack',        value: 275 },
            { key: 'healingBoost', name: 'Healing Boost',  stat: 'healingBoost',  value: 183 },
            { key: 'parry',        name: 'Parry',         stat: 'parry',         value: 716 }
        ]
    },
    'vision':          { baseAtk: 4605, bonusAtk: 275, pveStat: true, pvpPveAtk2h: 176, pvpPveDef2h: 176, pvpPveAtk1h: 88, pvpPveDef1h: 88, enchPvpPveAtk2h: 378, enchPvpPveDef2h: 103, enchPvpPveAtk1h: 227, enchPvpPveDef1h: 62, enchHp: 1917, enchCrit: 0, baseDef: 170, baseAcc: 2568, bonusAcc: 411 },
    'salvation':       { baseAtk: 5791, enchAtk2h: 350, enchDef2h: 175, enchAtk1h: 230, enchDef1h: 120, enchHp: 0, baseDef: 112, baseAcc: 2729,
        maxBonuses: 3,
        bonuses: [
            { key: 'accuracy',     name: 'Accuracy',      stat: 'accuracy',     value: 473 },
            { key: 'crit',         name: 'Crit',          stat: 'crit',          value: 417 },
            { key: 'attack',       name: 'Attack',        stat: 'attack',        value: 316 },
            { key: 'healingBoost', name: 'Healing Boost',  stat: 'healingBoost',  value: 187 },
            { key: 'parry',        name: 'Parry',         stat: 'parry',         value: 730 }
        ]
    }
};

// Jorgoth: shared enchant bonuses (applied on top of per-weapon data)
var JORGOTH_ENCHANT = { enchAtk1h: 223, enchAtk2h: 371, enchDef1h: 61, enchDef2h: 101 };

// Jorgoth: per weapon type * variant (v1=left in item manual, v3=right)
// Each entry: { baseAtk, hp, bonusDef, bonusAtk, crit, acc, healingBoost?, tag? }
// tag: 'extended' = Extended weapon, 'masterpiece' = Jorgoth's Masterpiece buff
// Common: baseDef=170, baseAcc=2568 (added in getWeaponStats)
var JORGOTH_WEAPONS = {
    dagger: {
        v1: { baseAtk: 5200, hp: 1917, bonusDef: 0,   bonusAtk: 275, crit: 617, acc: 411, tag: 'extended' },
        v2: { baseAtk: 5200, hp: 1917, bonusDef: 0,   bonusAtk: 399, crit: 454, acc: 411, tag: 'extended' },
        v3: { baseAtk: 5200, hp: 1917, bonusDef: 0,   bonusAtk: 467, crit: 363, acc: 411, tag: 'extended' }
    },
    sword: {
        v1: { baseAtk: 5200, hp: 1917, bonusDef: 176, bonusAtk: 0,   crit: 617, acc: 411, tag: 'extended' },
        v2: { baseAtk: 5200, hp: 1917, bonusDef: 176, bonusAtk: 0,   crit: 363, acc: 698, tag: 'extended' },
        v3: { baseAtk: 5200, hp: 1917, bonusDef: 176, bonusAtk: 0,   crit: 454, acc: 595, tag: 'extended' }
    },
    mace: {
        v1: { baseAtk: 5200, hp: 2396, bonusDef: 176, bonusAtk: 0,   crit: 363, acc: 411, healingBoost: 82, tag: 'extended' },
        v2: { baseAtk: 5200, hp: 1917, bonusDef: 280, bonusAtk: 0,   crit: 363, acc: 411, healingBoost: 128 },
        v3: { baseAtk: 5200, hp: 3258, bonusDef: 176, bonusAtk: 0,   crit: 363, acc: 411, healingBoost: 128 }
    },
    revolver: {
        v1: { baseAtk: 5200, hp: 1917, bonusDef: 176, bonusAtk: 0,   crit: 526, acc: 514, tag: 'masterpiece' },
        v2: { baseAtk: 5200, hp: 1917, bonusDef: 176, bonusAtk: 0,   crit: 517, acc: 698 },
        v3: { baseAtk: 2250, hp: 1917, bonusDef: 176, bonusAtk: 683, crit: 363, acc: 411 }
    },
    orb: {
        v1: { baseAtk: 5200, hp: 1917, bonusDef: 176, bonusAtk: 399, crit: 454, acc: 0, tag: 'masterpiece' },
        v2: { baseAtk: 5200, hp: 1917, bonusDef: 176, bonusAtk: 467, crit: 617, acc: 0 },
        v3: { baseAtk: 2250, hp: 1917, bonusDef: 176, bonusAtk: 958, crit: 363, acc: 0 }
    },
    spellbook: {
        v1: { baseAtk: 2250, hp: 1917, bonusDef: 176, bonusAtk: 683, crit: 363, acc: 411 },
        v2: { baseAtk: 5200, hp: 1917, bonusDef: 176, bonusAtk: 0,   crit: 454, acc: 595, tag: 'masterpiece' },
        v3: { baseAtk: 5200, hp: 1917, bonusDef: 176, bonusAtk: 0,   crit: 517, acc: 698 }
    },
    greatsword: {
        v1: { baseAtk: 5200, hp: 1917, bonusDef: 176, bonusAtk: 467, crit: 0,   acc: 411, tag: 'extended' },
        v2: { baseAtk: 5200, hp: 1917, bonusDef: 176, bonusAtk: 343, crit: 0,   acc: 595, tag: 'extended' },
        v3: { baseAtk: 5200, hp: 1917, bonusDef: 176, bonusAtk: 275, crit: 0,   acc: 698, tag: 'extended' }
    },
    polearm: {
        v1: { baseAtk: 5200, hp: 1917, bonusDef: 176, bonusAtk: 275, crit: 617, acc: 0, tag: 'extended' },
        v2: { baseAtk: 5200, hp: 1917, bonusDef: 176, bonusAtk: 467, crit: 363, acc: 0, tag: 'extended' },
        v3: { baseAtk: 5200, hp: 1917, bonusDef: 176, bonusAtk: 399, crit: 454, acc: 0, tag: 'extended' }
    },
    staff: {
        v1: { baseAtk: 5200, hp: 1917, bonusDef: 176, bonusAtk: 275, crit: 617, acc: 411, tag: 'extended' },
        v2: { baseAtk: 5200, hp: 3258, bonusDef: 176, bonusAtk: 275, crit: 363, acc: 411, tag: 'extended' },
        v3: { baseAtk: 5200, hp: 2396, bonusDef: 176, bonusAtk: 275, crit: 526, acc: 411, tag: 'extended' }
    },
    bow: {
        v1: { baseAtk: 5200, hp: 1917, bonusDef: 0,   bonusAtk: 399, crit: 454, acc: 411, tag: 'masterpiece' },
        v2: { baseAtk: 5200, hp: 1917, bonusDef: 0,   bonusAtk: 467, crit: 617, acc: 411 },
        v3: { baseAtk: 2250, hp: 1917, bonusDef: 0,   bonusAtk: 958, crit: 363, acc: 411 }
    },
    aetherKey: {
        v1: { baseAtk: 5200, hp: 1917, bonusDef: 176, bonusAtk: 399, crit: 454, acc: 0, tag: 'masterpiece' },
        v2: { baseAtk: 5200, hp: 1917, bonusDef: 176, bonusAtk: 467, crit: 617, acc: 0 },
        v3: { baseAtk: 2250, hp: 1917, bonusDef: 176, bonusAtk: 958, crit: 363, acc: 0 }
    },
    cannon: {
        v1: { baseAtk: 5200, hp: 1917, bonusDef: 176, bonusAtk: 399, crit: 454, acc: 0, tag: 'masterpiece' },
        v2: { baseAtk: 5200, hp: 1917, bonusDef: 176, bonusAtk: 467, crit: 617, acc: 0 },
        v3: { baseAtk: 2250, hp: 1917, bonusDef: 176, bonusAtk: 958, crit: 363, acc: 0 }
    },
    paintRings: {
        v1: { baseAtk: 5200, hp: 1917, bonusDef: 176, bonusAtk: 399, crit: 454, acc: 0, tag: 'masterpiece' },
        v2: { baseAtk: 5200, hp: 1917, bonusDef: 176, bonusAtk: 467, crit: 617, acc: 0 },
        v3: { baseAtk: 2250, hp: 1917, bonusDef: 176, bonusAtk: 958, crit: 363, acc: 0 }
    },
    harp: {
        v1: { baseAtk: 5200, hp: 1917, bonusDef: 176, bonusAtk: 399, crit: 0,   acc: 514, tag: 'masterpiece' },
        v2: { baseAtk: 5200, hp: 1917, bonusDef: 176, bonusAtk: 467, crit: 0,   acc: 698 },
        v3: { baseAtk: 2250, hp: 1917, bonusDef: 176, bonusAtk: 958, crit: 0,   acc: 411 }
    }
};

// Helper: get Jorgoth tag for display
function getJorgothTag(weaponType, setKey) {
    var vKey = null;
    if (setKey === 'jorgoth-t4-v1' || setKey === 'jorgoth-t3-v1') vKey = 'v1';
    else if (setKey === 'jorgoth-t4-v2' || setKey === 'jorgoth-t3-v2') vKey = 'v2';
    else if (setKey === 'jorgoth-t4-v3' || setKey === 'jorgoth-t3-v3') vKey = 'v3';
    if (!vKey || !JORGOTH_WEAPONS[weaponType]) return null;
    var w = JORGOTH_WEAPONS[weaponType][vKey];
    return w ? (w.tag || null) : null;
}

// Acrimony weapon enchant table (level 1-15): attack, def, hp, crit
var ACRI_WEAPON_ENCHANT = {
    1:  { attack: 66,   def: 14,  hp: 265,   crit: 61 },
    2:  { attack: 131,  def: 28,  hp: 531,   crit: 121 },
    3:  { attack: 197,  def: 42,  hp: 796,   crit: 182 },
    4:  { attack: 295,  def: 63,  hp: 1194,  crit: 273 },
    5:  { attack: 426,  def: 91,  hp: 1725,  crit: 394 },
    6:  { attack: 590,  def: 126, hp: 2389,  crit: 545 },
    7:  { attack: 804,  def: 172, hp: 3251,  crit: 742 },
    8:  { attack: 1066, def: 228, hp: 4313,  crit: 985 },
    9:  { attack: 1328, def: 284, hp: 5374,  crit: 1227 },
    10: { attack: 1591, def: 340, hp: 6436,  crit: 1470 },
    11: { attack: 1853, def: 396, hp: 7498,  crit: 1712 },
    12: { attack: 2116, def: 452, hp: 8559,  crit: 1954 },
    13: { attack: 2378, def: 508, hp: 9621,  crit: 2197 },
    14: { attack: 2640, def: 564, hp: 10682, crit: 2439 },
    15: { attack: 2903, def: 620, hp: 11744, crit: 2682 }
};

// Presumption weapon enchant: same attack/hp as acrimony, different def, crit=0
var PRES_WEAPON_ENCHANT = {
    1:  { attack: 66,   def: 21,  hp: 265,   crit: 0 },
    2:  { attack: 131,  def: 42,  hp: 531,   crit: 0 },
    3:  { attack: 197,  def: 64,  hp: 796,   crit: 0 },
    4:  { attack: 295,  def: 95,  hp: 1194,  crit: 0 },
    5:  { attack: 426,  def: 138, hp: 1725,  crit: 0 },
    6:  { attack: 590,  def: 191, hp: 2389,  crit: 0 },
    7:  { attack: 804,  def: 260, hp: 3251,  crit: 0 },
    8:  { attack: 1066, def: 345, hp: 4313,  crit: 0 },
    9:  { attack: 1328, def: 429, hp: 5374,  crit: 0 },
    10: { attack: 1591, def: 514, hp: 6436,  crit: 0 },
    11: { attack: 1853, def: 599, hp: 7498,  crit: 0 },
    12: { attack: 2116, def: 684, hp: 8559,  crit: 0 },
    13: { attack: 2378, def: 769, hp: 9621,  crit: 0 },
    14: { attack: 2640, def: 853, hp: 10682, crit: 0 },
    15: { attack: 2903, def: 938, hp: 11744, crit: 0 }
};

// Acrimony/Presumption weapon base values
var EXTREME_WEAPON_BASE = { baseAtk: 4950, bonusAtk: 20, baseDef: 170, baseAcc: 2568 };
