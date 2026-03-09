'use strict';


// Stat display definitions — [base, perEnchant] format in each transform
// Physical stats: accuracy, critStrike → map to comparison 'accuracy', 'crit'
// Magical stats:  magicAccuracy, critSpell → map to comparison 'accuracy', 'crit' for magic classes
// Display-only: attackSpeed, castSpeed, moveSpeed (not enchantable)
var TRANSFORM_STAT_DEFS = [
    { key: 'attackSpeed',   name: 'Atk. Speed',      unit: '%',  display: true },
    { key: 'castSpeed',     name: 'Cast Speed',      unit: '%',  display: true },
    { key: 'moveSpeed',     name: 'Speed',           unit: '%',  display: true },
    { key: 'accuracy',      name: 'Accuracy',        unit: '',   display: false },
    { key: 'magicAccuracy', name: 'Magical Acc.',     unit: '',  display: false },
    { key: 'critStrike',    name: 'Crit Strike',     unit: '',   display: false },
    { key: 'critSpell',     name: 'Crit Spell',      unit: '',   display: false },
    { key: 'hp',            name: 'HP',              unit: '',   display: false },
    { key: 'healingBoost',  name: 'Healing Boost',   unit: '',   display: false },
    { key: 'pvpAttack',     name: 'Add. PvP Atk',   unit: '',   display: false },
    { key: 'pveAttack',     name: 'Add. PvE Atk',   unit: '',   display: false },
    { key: 'pvpDefense',    name: 'Add. PvP Def',   unit: '',   display: false },
    { key: 'pveDefense',    name: 'Add. PvE Def',   unit: '',   display: false },
    { key: 'magicResist',   name: 'Magic Resist',   unit: '',   display: false },
    { key: 'evasion',       name: 'Evasion',        unit: '',   display: false }
];

// Physical classes use accuracy + critStrike; magical classes use magicAccuracy + critSpell
var PHYSICAL_CLASSES = ['gladiator', 'templar', 'assassin', 'ranger', 'chanter'];
function isPhysicalClass(cls) { return PHYSICAL_CLASSES.indexOf(cls) !== -1; }

var TF_NONE_ICON = '../assets/icons/icon_frame_2.png';

// All 14 ultimate transforms (display order: Kaisinel → Dark Dragon King)
// Stats format: [base, perEnchant] — total at enchant N = base + perEnchant × N
// Display-only speeds are flat numbers (no enchant scaling)
var TRANSFORMS = [
    { key: 'none', name: 'None', icon: TF_NONE_ICON, stats: {} },
    { key: 'kaisinel', name: 'Kaisinel', icon: '../assets/icons/trans_finality_kaisinel.png', stats: {
        attackSpeed: 60, castSpeed: 45, moveSpeed: 100,
        accuracy: [378, 19], magicAccuracy: [378, 19], critStrike: [331, 17], critSpell: [331, 17],
        healingBoost: [80, 4], pvpAttack: [236, 12], pveAttack: [236, 12],
        pvpDefense: [241, 12], pveDefense: [241, 12]
    }},
    { key: 'marchutan', name: 'Marchutan', icon: '../assets/icons/trans_finality_marchutan.png', stats: {
        attackSpeed: 50, castSpeed: 55, moveSpeed: 100,
        accuracy: [378, 19], magicAccuracy: [378, 19], critStrike: [331, 17], critSpell: [331, 17],
        healingBoost: [80, 4], pvpAttack: [236, 12], pveAttack: [236, 12],
        pvpDefense: [241, 12], pveDefense: [241, 12]
    }},
    { key: 'ereshkigal', name: 'Ereshkigal', icon: '../assets/icons/trans_finality_eresh.png', stats: {
        attackSpeed: 55, castSpeed: 50, moveSpeed: 100,
        accuracy: [378, 19], magicAccuracy: [378, 19], critStrike: [331, 17], critSpell: [331, 17],
        healingBoost: [80, 4], pvpAttack: [472, 24], pveAttack: [180, 9],
        pveDefense: [180, 9]
    }},
    { key: 'tiamat', name: 'Tiamat', icon: '../assets/icons/trans_finality_tiamat.png', stats: {
        attackSpeed: 55, castSpeed: 50, moveSpeed: 100,
        accuracy: [378, 19], magicAccuracy: [378, 19], critStrike: [331, 17], critSpell: [331, 17],
        healingBoost: [80, 4], pvpAttack: [180, 9], pveAttack: [472, 24],
        pvpDefense: [180, 9]
    }},
    { key: 'nezekan', name: 'Nezekan', icon: '../assets/icons/trans_finality_nejakan.png', stats: {
        attackSpeed: 50, castSpeed: 55, moveSpeed: 100,
        critStrike: [331, 17], critSpell: [331, 17],
        healingBoost: [80, 4], hp: [4400, 220], magicResist: [341, 17],
        pvpAttack: [236, 11], pveAttack: [236, 11],
        pvpDefense: [241, 12], pveDefense: [241, 12]
    }},
    { key: 'zikel', name: 'Zikel', icon: '../assets/icons/trans_finality_zikel.png', stats: {
        attackSpeed: 60, castSpeed: 45, moveSpeed: 100,
        critStrike: [420, 21], critSpell: [420, 21],
        healingBoost: [80, 4], pvpAttack: [236, 11], pveAttack: [236, 11],
        pvpDefense: [241, 12], pveDefense: [241, 12]
    }},
    { key: 'lumiel', name: 'Lumiel', icon: '../assets/icons/trans_finality_lumiel.png', stats: {
        attackSpeed: 50, castSpeed: 55, moveSpeed: 100,
        accuracy: [378, 19], magicAccuracy: [520, 26], critStrike: [420, 21], critSpell: [420, 21],
        healingBoost: [80, 4], pvpAttack: [620, 31], pveAttack: [420, 21],
        pvpDefense: [170, 9], pveDefense: [170, 9]
    }},
    { key: 'yustiel', name: 'Yustiel', icon: '../assets/icons/trans_finality_yustiel.png', stats: {
        attackSpeed: 55, castSpeed: 50, moveSpeed: 100,
        accuracy: [520, 26], magicAccuracy: [378, 19], critStrike: [420, 21], critSpell: [420, 21],
        healingBoost: [90, 5], pvpAttack: [620, 31], pveAttack: [420, 21],
        pvpDefense: [170, 9], pveDefense: [170, 9]
    }},
    { key: 'vaizel', name: 'Vaizel', icon: '../assets/icons/trans_finality_vaizel.png', stats: {
        attackSpeed: 55, castSpeed: 50, moveSpeed: 100,
        accuracy: [361, 19], critStrike: [350, 18], critSpell: [330, 17],
        pvpAttack: [378, 19], pveAttack: [189, 10],
        pvpDefense: [217, 11], pveDefense: [193, 10],
        evasion: [352, 18], magicResist: [341, 18]
    }},
    { key: 'triniel', name: 'Triniel', icon: '../assets/icons/trans_finality_triniel.png', stats: {
        attackSpeed: 55, castSpeed: 50, moveSpeed: 100,
        magicAccuracy: [361, 19], critStrike: [330, 17], critSpell: [350, 18],
        pvpAttack: [378, 19], pveAttack: [189, 10],
        pvpDefense: [217, 11], pveDefense: [193, 10],
        evasion: [341, 18], magicResist: [352, 18]
    }},
    { key: 'ariel', name: 'Ariel', icon: '../assets/icons/trans_finality_ariel.png', stats: {
        attackSpeed: 60, castSpeed: 55, moveSpeed: 100,
        accuracy: [378, 19], magicAccuracy: [413, 21], critStrike: [365, 19], critSpell: [415, 21],
        healingBoost: [82, 4], pvpAttack: [420, 21], pveAttack: [620, 31],
        pvpDefense: [217, 11], pveDefense: [217, 11]
    }},
    { key: 'azphel', name: 'Azphel', icon: '../assets/icons/trans_finality_azphel.png', stats: {
        attackSpeed: 60, castSpeed: 55, moveSpeed: 100,
        accuracy: [413, 21], magicAccuracy: [378, 19], critStrike: [415, 21], critSpell: [365, 19],
        healingBoost: [82, 4], pvpAttack: [420, 21], pveAttack: [620, 31],
        pvpDefense: [217, 11], pveDefense: [217, 11]
    }},
    { key: 'firedragon', name: 'Fire Dragon King', icon: '../assets/icons/trans_finality_firedragon.png', stats: {
        attackSpeed: 60, castSpeed: 55, moveSpeed: 100,
        accuracy: [520, 26], magicAccuracy: [520, 26], critStrike: [420, 21], critSpell: [420, 21],
        healingBoost: [90, 5], pvpAttack: [620, 31], pveAttack: [620, 31],
        pvpDefense: [241, 12], pveDefense: [241, 12]
    }},
    { key: 'darkdragon', name: 'Dark Dragon King', icon: '../assets/icons/trans_finality_darkdragon.png', stats: {
        attackSpeed: 60, castSpeed: 55, moveSpeed: 100,
        accuracy: [520, 26], magicAccuracy: [520, 26], critStrike: [420, 21], critSpell: [420, 21],
        healingBoost: [90, 5], pvpAttack: [620, 31], pveAttack: [620, 31],
        pvpDefense: [241, 12], pveDefense: [241, 12]
    }}
];
var TRANSFORM_KEYS = TRANSFORMS.map(function(t) { return t.key; });

// Get a transform stat value at a given enchant level
// Stats are either flat numbers (speeds) or [base, perEnchant] arrays
function tfStatVal(raw, enchLvl) {
    if (Array.isArray(raw)) return raw[0] + raw[1] * enchLvl;
    return raw || 0;
}

// Map transform stats to comparison stats, based on class type and enchant
function getTransformComparisonStats(transformKey, className, enchantLevel) {
    var tf = TRANSFORMS.find(function(t) { return t.key === transformKey; });
    var out = emptyStats();
    if (!tf || !tf.stats) return out;
    var s = tf.stats;
    var e = enchantLevel || 0;
    var phys = isPhysicalClass(className);
    out.accuracy     = phys ? tfStatVal(s.accuracy, e) : tfStatVal(s.magicAccuracy, e);
    out.crit         = phys ? tfStatVal(s.critStrike, e) : tfStatVal(s.critSpell, e);
    out.hp           = tfStatVal(s.hp, e);
    out.healingBoost = tfStatVal(s.healingBoost, e);
    out.pvpAttack    = tfStatVal(s.pvpAttack, e);
    out.pveAttack    = tfStatVal(s.pveAttack, e);
    out.pvpDefense   = tfStatVal(s.pvpDefense, e);
    out.pveDefense   = tfStatVal(s.pveDefense, e);
    out.magicResist  = tfStatVal(s.magicResist, e);
    out.evasion      = tfStatVal(s.evasion, e);
    return out;
}

// Get minion stats based on equipped minions
function getMinionStats(m1Key, m2Key) {
    // 1. Universal Base Stats (Apply from any combination)
    var stats = { 
        hp: 18000, 
        attack: 460, 
        accuracy: 530, 
        crit: 480, 
        pveAttack: 0, pvpAttack: 0, 
        pveDefense: 0, pvpDefense: 0, 
        healingBoost: 0, 
        evasion: 0, magicResist: 0 
    };

    var m1 = MINIONS.find(function(m) { return m.key === m1Key; });
    var m2 = MINIONS.find(function(m) { return m.key === m2Key; });

    // 2. MAIN SLOT LOGIC
    // The "Extra Stats" are strictly determined by the MAIN minion (m1).
    // The Secondary minion (m2) only acts as a multiplier if it matches m1.

    // --- Kromede (Attack) ---
    if (m1.type === 'kromede') {
        if (m2.type === 'kromede') {
            // Synergy: Both are Kromede
            if (m1.variant === m2.variant) {
                stats[m1.variant + 'Attack'] += 380;
            } else {
                // One PvE, One PvP
                stats.pveAttack += 190;
                stats.pvpAttack += 190;
            }
        } else {
            // Solo: Only Main is Kromede
            stats[m1.variant + 'Attack'] += 190;
        }
    }

    // --- Hyperion (Defense) ---
    else if (m1.type === 'hyperion') {
        if (m2.type === 'hyperion') {
            // Synergy: Both are Hyperion
            if (m1.variant === m2.variant) {
                stats[m1.variant + 'Defense'] += 380;
            } else {
                stats.pveDefense += 190;
                stats.pvpDefense += 190;
            }
        } else {
            // Solo: Only Main is Hyperion
            stats[m1.variant + 'Defense'] += 190;
        }
    }

    // --- Weda (HP/Heal) ---
    else if (m1.type === 'weda') {
        stats.hp = 20500; // Standard Main Weda HP
        if (m1.variant === 'heal') stats.healingBoost += 95;

        if (m2.type === 'weda') {
            // Synergy: Double Weda
            if (m1.key === 'hp-weda' && m2.key === 'hp-weda') stats.hp = 23000;
            if (m2.variant === 'heal') stats.healingBoost += 95;
        }
    }

    // --- Sita (Crit/Acc) ---
    else if (m1.type === 'sita') {
        if (m1.variant === 'crit') stats.crit = 860;
        else stats.accuracy = 1190;

        if (m2.type === 'sita') {
            // Synergy: Double Sita
            if (m1.variant === 'crit' && m2.variant === 'crit') stats.crit = 1240;
            else if (m1.variant === 'acc' && m2.variant === 'acc') stats.accuracy = 1850;
            else {
                // One Crit, One Acc
                stats.crit = 860;
                stats.accuracy = 1190;
            }
        }
    }

    // --- Grendal (Eva/MR) ---
    else if (m1.type === 'grendal') {
        if (m1.variant === 'eva') stats.evasion += 660;
        else stats.magicResist += 660;

        if (m2.type === 'grendal') {
            // Synergy: Double Grendal
            if (m1.variant === m2.variant) {
                if (m1.variant === 'eva') stats.evasion += 660; // Total 1320
                else stats.magicResist += 660; // Total 1320
            } else {
                // One Evasion, One Resist
                if (m1.variant === 'eva') stats.magicResist += 660;
                else stats.evasion += 660;
            }
        }
    }

    return stats;
}
