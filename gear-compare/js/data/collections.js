'use strict';


// Transformation Collection buttons — each entry is a toggleable bonus.
// Stat categories represented: 'attack', 'crit', 'physicalDef'+'magicalDef' (add both),
// 'physicalDef', 'magicalDef', or any other COMPARISON_STATS key.
// For collections that boost both defences use two entries with the same visual grouping.
// Add new entries by appending — do NOT remove or reorder existing entries.
//
// Format: { key, name, stat, value }
//   key   — unique identifier (string, append-only)
//   name  — label shown on the toggle button
//   stat  — comparison stat key the bonus is added to
//   value — flat bonus applied when toggled ON
//
// Example:
//   { key: 'tf-atk-1', name: 'Fighter Coll. I',  stat: 'attack',      value:  50 },
//   { key: 'tf-def-1', name: 'Guardian Coll. I', stat: 'physicalDef', value: 100 },
var TF_COLLECTIONS = [
    // Format: { key, name, stat, value }
    // stat must be a key from COMPARISON_STATS (e.g. 'attack', 'crit', 'parry', 'physicalDef', ...)
    // Append-only — do NOT remove or reorder existing entries.
    //{ key: 'tf-coll-dog-bunny', name: 'Time of Dog and Bunny', stat: 'parry', value: 108 },
    { key: 'tf-col-tin-bunny', name: 'Tin Man with Bunny', stat: 'physicalDef', value: 38 },
    { key: 'tf-col-gift-set', name: 'Full Gift Set', stat: 'magicalDef', value: 38 },
    { key: 'tf-col-archon-shorty', name: 'Archon and Shorty Legions', stat: 'magicalDef', value: 76 },
    { key: 'tf-col-wretched-minion', name: 'Wretched Minions Assembly', stat: 'physicalDef', value: 76 },
    { key: 'tf-col-transfor-into', name: 'Now Transform into Me', stat: 'attack', value: 78 },
    { key: 'tf-col-famous-women', name: 'Famous Women', stat: 'physicalDef', value: 190 },
    { key: 'tf-col-old-boss', name: 'The Old Boss', stat: 'critStrike', value: 308 },
    { key: 'tf-col-im-legendary', name: 'I\'m Legendary', stat: 'magicalDef', value: 190 },
    { key: 'tf-col-lords-favourite', name: 'Lord\'s Favourite', stat: 'critStrike', value: 513 },
    { key: 'tf-col-legendary-class-conqueror', name: 'Legendary Class Conqueror', stat: 'attack', value: 195 },
    { key: 'tf-col-pixel-pdef', name: 'We are one, though we are not the same', stat: 'physicalDef', value: 152 },
    { key: 'tf-col-pixel-mdef', name: 'What is a Pixel anyway?', stat: 'magicalDef', value: 152 },
    { key: 'tf-col-pixel-attack', name: 'Another Pixel after 100 days of prayer', stat: 'attack', value: 152 },
    { key: 'tf-col-pixels-crit', name: 'Welcome! You don\'t know Hanbok yet, right?', stat: 'crit', value: 411 },
    { key: 'tf-col-archers-attack', name: 'Archers, attack!', stat: 'attack', value: 171 },
    { key: 'tf-col-pretty-redhead', name: 'Pretty redhead...?', stat: 'crit', value: 154 },
    { key: 'tf-col-i-call-the-shots', name: 'I call the shots around here', stat: 'critDmg', value: 30 },
    { key: 'tf-col-agent-of-light', name: 'Agent of Light', stat: 'spellFortitude', value: 50 },
    { key: 'tf-col-agent-of-darkness', name: 'Agent of Darkness', stat: 'strikeFortitude', value: 50 },
    { key: 'tf-col-battle-elyos-asmo', name: 'Battle between Elyos and Asmodians', stat: 'critDmg', value: 80 },
    { key: 'tf-col-pixels-critdmg', name: 'Ours are the best!', stat: 'critDmg', value: 20 },
    { key: 'tf-col-halloween-attack', name: 'Halloween 4', stat: 'attack', value: 156 },
    { key: 'tf-col-ethernal-death', name: 'Ethernal Death', stat: 'spellFortitude', value: 30 },
    { key: 'tf-col-muscles-complement-outfit', name: 'Muscles complement the outfit perfectly', stat: 'strikeFortitude', value: 30 },
    { key: 'tf-col-black-white-theory', name: 'Black & White Theory', stat: 'critDmg', value: 50 },
    { key: 'tf-col-polyamorous', name: 'Polyamorous', stat: 'magicalDef', value: 171 },
    { key: 'tf-col-kaisinel-forti', name: 'Gods and Apostles of Fantasy', stat: 'spellFortitude', value: 80 },
    { key: 'tf-col-marchutan-forti', name: 'Gods and Apostles of Fate', stat: 'strikeFortitude', value: 80 },
    { key: 'tf-col-ereshkigal-critdmg', name: 'Ereshkigal Legion', stat: 'critDmg', value: 20 },
    { key: 'tf-col-rangers-crit', name: 'Ready Player Four', stat: 'crit', value: 205 },
    { key: 'tf-col-tiamat-critdmg', name: 'Tiamat Legion', stat: 'critDmg', value: 20 },
    { key: 'tf-col-eresh-tiamat-critdmg', name: 'Here for Raid', stat: 'critDmg', value: 40 },
    { key: 'tf-col-cat-pdef', name: 'Kitten', stat: 'physicalDef', value: 152 },
    { key: 'tf-col-cat-mdef', name: 'The Cat and Her Butler', stat: 'magicalDef', value: 152 },
    { key: 'tf-col-cat-hp', name: 'Kitty Practice', stat: 'hp', value: 6600 },
    { key: 'tf-col-baa-pdef', name: 'Cuddly Baa', stat: 'physicalDef', value: 152 },
    { key: 'tf-col-baa-mdef', name: 'Cuddly Moo', stat: 'magicalDef', value: 152 },
    { key: 'tf-col-baa-hp', name: 'Cuddly Mau', stat: 'hp', value: 5000 },
    { key: 'tf-col-fox-hp', name: 'Perfect Winter', stat: 'hp', value: 5000 },
    { key: 'tf-col-fox-pdef', name: 'Warm Winter', stat: 'physicalDef', value: 152 },
    { key: 'tf-col-fox-mdef', name: 'Beautiful Winter', stat: 'magicalDef', value: 152 },
    { key: 'tf-col-zikel-forti', name: 'Ultimate Assassin', stat: 'strikeFortitude', value: 60 },
    { key: 'tf-col-nezekan-forti', name: 'Ultimate Protector', stat: 'spellFortitude', value: 60 },
    { key: 'tf-col-nezekan-zikel-critdmg', name: 'Clash', stat: 'critDmg', value: 40 },
    { key: 'tf-col-yustiel-atk', name: 'Hand of Life', stat: 'attack', value: 391 },
    { key: 'tf-col-lumiel-atk', name: 'Wise Ones', stat: 'attack', value: 391 },
    { key: 'tf-col-yustiel-lumiel-critdmg', name: 'Magnificent', stat: 'critDmg', value: 120 },
    { key: 'tf-col-vaizel-forti', name: 'Tyrant', stat: 'strikeFortitude', value: 60 },
    { key: 'tf-col-triniel-forti', name: 'Life and Death', stat: 'spellFortitude', value: 60 },
    { key: 'tf-col-vaizel-triniel-atk', name: 'Promising Encounter', stat: 'attack', value: 419 },
    { key: 'tf-col-ariel-forti', name: 'Time of Light', stat: 'spellFortitude', value: 70 },
    { key: 'tf-col-azphel-forti', name: 'Time of Shadows', stat: 'strikeFortitude', value: 70 },
    { key: 'tf-col-ariel-yustiel-atk', name: 'Lady of Elysea', stat: 'attack', value: 350 },
    { key: 'tf-col-azphel-lumiel-def', name: 'Lord of Asmodae', stat: 'defence', value: 350 },
    { key: 'tf-col-10-ulti-hp', name: 'Ultimate Transformation Conqueror', stat: 'hp', value: 10000 },
    { key: 'tf-col-fire-dragon-atk', name: 'Spread of the Red Flame', stat: 'physicalAttack', value: 200 },
    { key: 'tf-col-fire-dragon-forti', name: 'Hot and Cold', stat: 'strikeFortitude', value: 70 },
];

// Item Collection stat inputs.
// Each entry defines one numeric input field in the Item Collections panel.
// The collected value is clamped to [0, max] and added to the comparison stat
// identified by statKey.  Both physicalAttack and magicAttack map to 'attack';
// critStrike and critSpell both map to 'crit'.  Add new rows by appending.
//
// Format: { key, name, max, statKey }
//   key     — unique identifier used in state storage
//   name    — label shown next to the input
//   max     — maximum allowed value (enforced on input)
//   statKey — comparison stat key this input feeds into
var ITEM_COLL_STATS = [
    { key: 'physicalAttack', name: 'Physical Attack',  max: 307,  statKey: 'attack'      },
    { key: 'physicalDef',    name: 'Physical Defence', max: 415,  statKey: 'physicalDef' },
    { key: 'critStrike',     name: 'Crit Strike',      max: 1090, statKey: 'crit'        },
    { key: 'magicAttack',    name: 'Magic Attack',     max: 307,  statKey: 'attack'      },
    { key: 'magicalDef',     name: 'Magical Defence',  max: 415,  statKey: 'magicalDef'  },
    { key: 'critSpell',      name: 'Crit Spell',       max: 1090, statKey: 'crit'        },
];

// ═══════════════════════════════════════════════════════════
// RELIC DATA
// ═══════════════════════════════════════════════════════════

var RELIC_LEVEL_STAT_RANGES = [
    { from: 1, to: 50, stats: { hp: 100, attack: 3, crit: 2 } },
    { from: 51, to: 100, stats: { crit: 2, magicalDef: 3, physicalDef: 3 } },
    { from: 101, to: 150, stats: { accuracy: 2, hp: 40 } },
    { from: 151, to: 200, stats: { evasion: 6, magicResist: 6 } },
    { from: 201, to: 250, stats: { magicalDef: 2, physicalDef: 2, crit: 4 } },
    { from: 251, to: 300, stats: { hp: 40, attack: 2} },
];

// Expand ranges into flat array
function expandRelicLevelStats(ranges) {
    var arr = [];
    ranges.forEach(function(r) {
        for (var lvl = r.from; lvl <= r.to; lvl++) {
            for (var stat in r.stats) {
                arr.push({ level: lvl, stat: stat, value: r.stats[stat] });
            }
        }
    });
    return arr;
}

var RELIC_LEVEL_STATS = expandRelicLevelStats(RELIC_LEVEL_STAT_RANGES);

// Milestone bonuses unlocked when a specific relic level is reached.
// Active milestones (≤ current level) are shown with their icons.
// Upcoming milestones (> current level) appear greyed-out.
// Append-only — do NOT remove or reorder existing entries.
//
// Format: { level, name, icon, stats }
//   level — relic level required to unlock this bonus
//   name  — milestone label
//   icon  — URL string for the buff icon (use '../assets/icons/...' paths)
//   stats — object { statKey: value } added to the comparison totals
//           (may be omitted if the milestone is display-only)
//
// Example:
//   { level:  50, name: 'Relic Awakening I',  icon: '../assets/icons/relic_buff_01.png', stats: { attack: 100, crit: 200 } },
//   { level: 100, name: 'Relic Awakening II', icon: '../assets/icons/relic_buff_02.png', stats: { physicalDef: 150, magicalDef: 150 } },
// Stat caps for the relic progress bars (max value achievable at level 300)
// These are used only for the progress bar display inside renderRelic.
var RELIC_STAT_DEFS = [
    { stat: 'hp',          name: 'HP',               max: 9000 },
    { stat: 'crit',        name: 'Crit',             max: 400  },
    { stat: 'physicalDef', name: 'Physical Defence', max: 250  },
    { stat: 'attack',      name: 'Attack',           max: 250  },
    { stat: 'magicalDef',  name: 'Magical Defence',  max: 250  },
    { stat: 'magicResist', name: 'Magic Resist',     max: 300  },
    { stat: 'evasion',     name: 'Evasion',          max: 300  },
    { stat: 'accuracy',    name: 'Accuracy',         max: 100  },
];

var RELIC_MILESTONES = [
    // Format: { level, name, icon, stats }
    { level: 15, name: 'Relic: Increased physical attack I', icon: '../assets/icons/sacredstone_phy_atk_lv1.png', stats: { attack: 250 }, type: 'physical' },
    { level: 15, name: 'Relic: Increased magical attack I', icon: '../assets/icons/sacredstone_mag_atk_lv1.png', stats: { attack: 250 }, type: 'magical' },
    { level: 30, name: 'Relic: Increased physical crit hit I', icon: '../assets/icons/sacredstone_phy_cri_lv1.png', stats: { crit: 400 }, type: 'physical' },
    { level: 30, name: 'Relic: Increased magical crit hit I', icon: '../assets/icons/sacredstone_mag_cri_lv1.png', stats: { crit: 400 }, type: 'magical' },
    { level: 45, name: 'Relic: Increased physical defence I', icon: '../assets/icons/sacredstone_phy_def_lv1.png', stats: { physicalDef: 250 }, type: 'both' },
    { level: 60, name: 'Relic: Increased magical defence I', icon: '../assets/icons/sacredstone_mag_def_lv1.png', stats: { magicalDef: 250 }, type: 'both' },
    { level: 75, name: 'Relic: Increased max HP II', icon: '../assets/icons/sacredstone_maxhp_lv2.png', stats: { hp: 4000 }, type: 'both' },
    { level: 90, name: 'Relic: Increased resist magic I', icon: '../assets/icons/sacredstone_resist_lv1.png', stats: { magicResist: 200 }, type: 'both' },
    { level: 105, name: 'Relic: Increased evasion I', icon: '../assets/icons/sacredstone_dodge_lv1.png', stats: { evasion: 200 }, type: 'both' },
    { level: 120, name: 'Relic: Increased physical defence II', icon: '../assets/icons/sacredstone_phy_def_lv2.png', stats: { physicalDef: 150 }, type: 'both' },
    { level: 135, name: 'Relic: Increased magical defence II', icon: '../assets/icons/sacredstone_mag_def_lv2.png', stats: { magicalDef: 150 }, type: 'both' },
    { level: 150, name: 'Relic: Increased physical attack II', icon: '../assets/icons/sacredstone_phy_atk_lv2.png', stats: { attack: 100 }, type: 'physical' },
    { level: 150, name: 'Relic: Increased magical attack II', icon: '../assets/icons/sacredstone_mag_atk_lv2.png', stats: { attack: 100 }, type: 'magical' },
    { level: 165, name: 'Relic: Increased physical crit hit II', icon: '../assets/icons/sacredstone_phy_cri_lv2.png', stats: { crit: 200 }, type: 'physical' },
    { level: 165, name: 'Relic: Increased magical crit hit II', icon: '../assets/icons/sacredstone_mag_cri_lv2.png', stats: { crit: 200 }, type: 'magical' },
    { level: 180, name: 'Relic: Increased max HP I', icon: '../assets/icons/sacredstone_maxhp_lv1.png', stats: { hp: 2000 }, type: 'both' },
    { level: 210, name: 'Relic: Increased accuracy I', icon: '../assets/icons/sacredstone_phy_acc_lv1.png', stats: { accuracy: 300 }, type: 'physical' },
    { level: 210, name: 'Relic: Increased magical accuracy I', icon: '../assets/icons/sacredstone_mag_acc_lv1.png', stats: { magicAccuracy: 300 }, type: 'magical' },
    { level: 240, name: 'Relic: Increased max DP I', icon: '../assets/icons/sacredstone_maxdp_lv1.png', stats: { dp: 1000 }, type: 'both' },
    { level: 270, name: 'Relic: Increased physical attack III', icon: '../assets/icons/sacredstone_phy_atk_lv3.png', stats: { attack: 50 }, type: 'physical' },
    { level: 270, name: 'Relic: Increased magical attack III', icon: '../assets/icons/sacredstone_mag_atk_lv3.png', stats: { attack: 50 }, type: 'magical' },
    { level: 300, name: 'Relic: Increased max DP II', icon: '../assets/icons/sacredstone_maxdp_lv2.png', stats: { dp: 1000 }, type: 'both' },
];

var MINIONS = [
    { key: 'pve-kromede',   name: 'Kromede of Challenge (PvE)',   type: 'kromede', variant: 'pve', icon: '../assets/icons/icon_familiar_s_kromede_01.png' },
    { key: 'pvp-kromede',   name: 'Kromede of Challenge (PvP)',   type: 'kromede', variant: 'pvp', icon: '../assets/icons/icon_familiar_s_kromede_01.png' },
    { key: 'pve-hyperion',  name: 'Hyperion of Challenge (PvE)',  type: 'hyperion', variant: 'pve', icon: '../assets/icons/icon_familiar_s_hyperion_01.png' },
    { key: 'pvp-hyperion',  name: 'Hyperion of Challenge (PvP)',  type: 'hyperion', variant: 'pvp', icon: '../assets/icons/icon_familiar_s_hyperion_01.png' },
    { key: 'crit-sita',     name: 'Sita of Death (crit)',     type: 'sita', variant: 'crit', icon: '../assets/icons/icon_familiar_s_sita_01.png' },
    { key: 'acc-sita',      name: 'Sita of Change (accuracy)', type: 'sita', variant: 'acc', icon: '../assets/icons/icon_familiar_s_sita_01.png' },
    { key: 'eva-grendal',   name: 'Evading Grendal', type: 'grendal', variant: 'eva', icon: '../assets/icons/icon_familiar_s_grendal_01.png' },
    { key: 'res-grendal',   name: 'Resist Grendal',    type: 'grendal', variant: 'res', icon: '../assets/icons/icon_familiar_s_grendal_01.png' },
    { key: 'hp-weda',       name: 'Weda of Life (HP)',       type: 'weda', variant: 'hp', icon: '../assets/icons/icon_familiar_s_weda_01.png' },
    { key: 'heal-weda',     name: 'Healing Weda (HB)',  type: 'weda', variant: 'heal', icon: '../assets/icons/icon_familiar_s_weda_01.png' }
];

// Calculate cumulative relic stats for a given level (sums all entries ≤ level)
// Sums only RELIC_LEVEL_STATS thresholds — used for the stats bars display.
function getRelicLevelStats(level) {
    var out = emptyStats();
    RELIC_LEVEL_STATS.forEach(function(entry) {
        if (entry.level <= level && out[entry.stat] !== undefined) {
            out[entry.stat] += entry.value;
        }
    });
    return out;
}

// Full relic stats (level thresholds + milestone skills) — used for comparison totals.
function getRelicStats(level, isPhy) {
    var out = getRelicLevelStats(level);
    RELIC_MILESTONES.forEach(function(ms) {
        // Only apply milestones for this class type or for both
        if (
            ms.level <= level && ms.stats &&
            (
                !ms.type || ms.type === 'both' ||
                (ms.type === 'physical' && isPhy) ||
                (ms.type === 'magical' && !isPhy)
            )
        ) {
            for (var k in ms.stats) {
                if (out[k] !== undefined) out[k] += ms.stats[k];
            }
        }
    });
    return out;
}

// Returns only the milestones whose level is ≤ the supplied level and match class type
function getActiveMilestones(level, isPhy) {
    return RELIC_MILESTONES.filter(function(ms) {
        return ms.level <= level && (
            !ms.type || ms.type === 'both' ||
            (ms.type === 'physical' && isPhy) ||
            (ms.type === 'magical' && !isPhy)
        );
    });
}

function getTraitStats(pid) {
    let totals = { 
        hp: 0, attack: 0, physicalDef: 0, magicalDef: 0, 
        accuracy: 0, crit: 0, evasion: 0, parry: 0, 
        magicResist: 0, dp: 0 
    };

    const className = (typeof selectedClass === 'string' ? selectedClass.toLowerCase() : "gladiator");
    const classSkills = DAEVANION_SKILLS[className];
    const selections = traitSelections[pid];

    if (!classSkills) return totals;

    // Check each level (81-85)
    Object.keys(selections).forEach(lvl => {
        const selectedIdx = selections[lvl];
        if (selectedIdx !== null && classSkills[lvl]) {
            const skillName = classSkills[lvl][selectedIdx];
            const bonuses = TRAIT_STAT_DATA[skillName];

            if (bonuses) {
                for (const stat in bonuses) {
                    if (totals.hasOwnProperty(stat)) {
                        totals[stat] += bonuses[stat];
                    }
                }
            }
        }
    });

    return totals;
}


// Build keys lists
var ARMOR_TYPE_KEYS = ARMOR_TYPE_OPTIONS.map(function(o) { return o.key; });
var ARMOR_SET_KEYS  = ARMOR_SETS.map(function(o) { return o.key; });
var ARMOR_SLOT_KEYS = ARMOR_SLOTS.map(function(o) { return o.key; });
var WEAPON_SET_KEYS = WEAPON_SETS.map(function(o) { return o.key; });
var WEAPON_TYPE_KEYS = Object.keys(WEAPON_TYPES);
