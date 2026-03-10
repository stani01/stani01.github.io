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
// Format: { key, name, stat, value, forms?, gradeReq?, bonus? }
//   key      — unique identifier (string)
//   name     — collection title
//   stat     — comparison stat key (attack, crit, critDmg, physicalDef, magicalDef, …)
//   value    — flat bonus applied when collection is active
//   forms    — (optional) array of form IDs required to complete this collection
//   gradeReq — (optional) { grade, count } for grade-based conqueror collections
//   bonus    — (optional) extra reward text shown in the UI
var TF_COLLECTIONS = [
    // ── 1–6: Basic collections ──
    { key: 'tf-dog-bunny', name: 'Time of Dog and Bunny', stat: 'parry', value: 108,
      forms: [982051, 982024] },
    { key: 'tf-games-begin', name: 'Let the games begin!', stat: 'block', value: 108,
      forms: [982052, 982018] },
    { key: 'tf-full-gift', name: 'Full Gift Set', stat: 'magicalDef', value: 38,
      forms: [982052, 982025, 982022, 982021] },
    { key: 'tf-guardian-shorty', name: 'Guardian and Shorty Legions', stat: 'magicResist', value: 108,
      forms: [982054, 982019, 982020] },
    { key: 'tf-archon-shorty', name: 'Archon and Shorty Legions', stat: 'magicalDef', value: 76,
      forms: [982055, 982019, 982020] },
    { key: 'tf-wretched-minions', name: 'Wretched Minions Assembly', stat: 'physicalDef', value: 76,
      forms: [982056, 982023, 982029, 982034] },

    // ── 7–10: Balaur faction collections (with bonus) ──
    { key: 'tf-ereshkigal-warriors', name: 'Ereshkigal\'s Warriors', stat: 'parry', value: 538,
      bonus: '(Level 1) Flame of Illusion: Prigga',
      forms: [982042, 982057, 982034, 982061] },
    { key: 'tf-what-up-to', name: 'What are you up to?', stat: 'accuracy', value: 110,
      bonus: '(Level 1) Flame of Illusion: Ereshkigal',
      forms: [982059, 982057, 982058, 982043, 982040, 982041] },
    { key: 'tf-balaur-never-die', name: 'Balaur Never Die', stat: 'magicResist', value: 538,
      bonus: '(Final) Flame of Illusion: Prigga',
      forms: [982059, 982057, 982058, 982046, 982049, 982061] },
    { key: 'tf-magical-expert', name: 'Magical Transformation Expert', stat: 'accuracy', value: 551,
      bonus: '(Level 2) Cursed Cyclone',
      forms: [982032, 982057, 982062, 982048, 982046, 982044] },

    // ── 11–13: Grade conquerors ──
    { key: 'tf-common-conqueror', name: 'Common Transformation Conqueror', stat: 'evasion', value: 108,
      gradeReq: { grade: 'normal', count: 18 } },
    { key: 'tf-highrank-conqueror', name: 'High-ranking Transformation Conqueror', stat: 'healingBoost', value: 49,
      gradeReq: { grade: 'large', count: 16 } },
    { key: 'tf-ancient-conqueror', name: 'Ancient Transformation Conqueror', stat: 'healingBoost', value: 123,
      gradeReq: { grade: 'ancient', count: 18 } },

    // ── 14–25: Mixed collections ──
    { key: 'tf-we-are-one', name: 'We are one, though we are not the same.', stat: 'physicalDef', value: 152,
      forms: [982026, 982034, 982057, 982063] },
    { key: 'tf-rgb', name: 'RGB (if painted)', stat: 'accuracy', value: 220,
      forms: [982020, 982018, 982066] },
    { key: 'tf-too-callous', name: 'You\'re too callous', stat: 'accuracy', value: 331,
      forms: [982071, 982061, 982042, 982057] },
    { key: 'tf-eternal-death', name: 'Eternal Death', stat: 'spellFortitude', value: 30,
      forms: [982088, 982061, 982039, 982018] },
    { key: 'tf-muscles-outfit', name: 'Muscles complement the outfit perfectly', stat: 'strikeFortitude', value: 30,
      forms: [982089, 982043, 982057] },
    { key: 'tf-not-rodents', name: 'It doesn\'t refer to rodents.', stat: 'evasion', value: 215,
      forms: [982092, 982019, 982020] },
    { key: 'tf-keyboard-ranger', name: 'Eliminate the Keyboard Ranger!', stat: 'magicResist', value: 215,
      forms: [982093, 982023, 982029] },
    { key: 'tf-ereshkigal-legion', name: 'Ereshkigal Legion', stat: 'critDmg', value: 20,
      forms: [982094, 982061, 982042, 982057] },
    { key: 'tf-kitten', name: 'Kitten', stat: 'physicalDef', value: 152,
      forms: [982100, 982067, 982037, 982033, 982020] },
    { key: 'tf-hand-of-life', name: 'Hand of Life', stat: 'attack', value: 391,
      forms: [982111, 982088, 982062, 982039, 982007] },
    { key: 'tf-wise-ones', name: 'Wise Ones', stat: 'attack', value: 391,
      forms: [982110, 982091, 982061, 982038, 982005] },
    { key: 'tf-life-death', name: 'Life and Death', stat: 'spellFortitude', value: 60,
      forms: [982113, 982089, 982044, 982029, 982023] },

    // ── 26–29: More basic + Tiamat/Beritra ──
    { key: 'tf-tin-bunny', name: 'Tin Man with Bunny', stat: 'physicalDef', value: 38,
      forms: [982051, 982031, 982052, 982025] },
    { key: 'tf-cute-perfect', name: 'You\'re so cute, you\'re perfect', stat: 'magicResist', value: 215,
      forms: [982032, 982053, 982038, 982027, 982026] },
    { key: 'tf-sapiens', name: 'Sapiens Exhibition', stat: 'evasion', value: 215,
      forms: [982030, 982028, 982036, 982039, 982035, 982056] },
    { key: 'tf-tiamat-warriors', name: 'Tiamat\'s Warriors', stat: 'block', value: 538,
      bonus: '(Level 1) Flame of Illusion: Tower of Challenge',
      forms: [982040, 982059, 982034, 982046] },

    // ── 30–39: Legendary-tier collections with bonuses ──
    { key: 'tf-beritra-warriors', name: 'Beritra\'s Warriors', stat: 'accuracy', value: 110,
      bonus: '(Level 1) Flame of Illusion: Beritra',
      forms: [982041, 982058, 982034, 982049] },
    { key: 'tf-fantastic-agents', name: 'Fantastic Agents', stat: 'accuracy', value: 331,
      bonus: '(Level 2) Flame of Illusion: Tower of Challenge',
      forms: [982060, 982047, 982048] },
    { key: 'tf-transform-me', name: 'Now Transform into Me', stat: 'attack', value: 78,
      bonus: '(Level 2) Flame of Illusion: Prigga',
      forms: [982060, 982061, 982062] },
    { key: 'tf-schemer-flash', name: 'A Schemer Vanished in a Flash', stat: 'evasion', value: 538,
      bonus: '(Final) Flame of Illusion: Tower of Challenge',
      forms: [982056, 982059, 982046, 982047, 982043, 982044] },
    { key: 'tf-famous-women', name: 'Famous Women', stat: 'physicalDef', value: 190,
      bonus: '(Final) Flame of Illusion: Beritra',
      forms: [982060, 982061, 982062, 982045, 982048, 982049] },
    { key: 'tf-old-boss', name: 'This Old Boss', stat: 'crit', value: 308,
      bonus: '(Level 2) Flame of Illusion: Beritra',
      forms: [982056, 982062, 982049, 982046] },
    { key: 'tf-phys-expert', name: 'Physical Transformation Expert', stat: 'accuracy', value: 551,
      bonus: '(Level 2) Flame of Illusion: Ereshkigal',
      forms: [982037, 982055, 982061, 982047, 982045, 982043] },
    { key: 'tf-eternal-war', name: 'Eternal War', stat: 'accuracy', value: 331,
      bonus: '(Level 1) Cursed Cyclone',
      forms: [982054, 982048, 982055, 982047] },
    { key: 'tf-im-legendary', name: 'I\'m Legendary', stat: 'magicalDef', value: 190,
      bonus: '(Final) Flame of Illusion: Ereshkigal',
      forms: [982060, 982061, 982062, 982043, 982045, 982046] },
    { key: 'tf-lords-favourite', name: 'Lord\'s Favourite', stat: 'crit', value: 513,
      bonus: 'Blessed Light',
      forms: [982054, 982055, 982047, 982048, 982060, 982050] },

    // ── 40: Legendary grade conqueror ──
    { key: 'tf-legendary-conqueror', name: 'Legendary Class Conqueror', stat: 'attack', value: 195,
      bonus: '(Final) Cursed Cyclone',
      gradeReq: { grade: 'legendary', count: 10 } },

    // ── 41–54: Pixel, Apostle, and mixed collections ──
    { key: 'tf-pixel-what', name: 'What is a Pixel anyway?', stat: 'magicalDef', value: 152,
      forms: [982052, 982053, 982056, 982064] },
    { key: 'tf-pixel-100days', name: 'Another Pixel after 100 days of prayer.', stat: 'attack', value: 152,
      forms: [982054, 982055, 982034, 982065] },
    { key: 'tf-hanbok-right', name: 'Welcome! You don\'t know Hanbok yet, right?', stat: 'crit', value: 411,
      forms: [982063, 982064, 982065] },
    { key: 'tf-archers', name: 'Archers, attack!', stat: 'attack', value: 171,
      forms: [982067, 982043, 982044, 982035, 982039, 982056] },
    { key: 'tf-other-half', name: 'How the other half lives', stat: 'magicResist', value: 323,
      forms: [982068, 982060, 982066] },
    { key: 'tf-redhead', name: 'Pretty redhead...?', stat: 'crit', value: 154,
      forms: [982069, 982045, 982044, 982036] },
    { key: 'tf-hermit', name: 'Hermit', stat: 'evasion', value: 323,
      forms: [982070, 982049, 982056] },
    { key: 'tf-i-call-shots', name: 'I call the shots around here', stat: 'critDmg', value: 30,
      forms: [982072, 982067, 982062, 982045] },
    { key: 'tf-young-heart', name: 'Young at heart', stat: 'block', value: 323,
      forms: [982073, 982047, 982059, 982035] },
    { key: 'tf-agent-light', name: 'Agent of Light', stat: 'spellFortitude', value: 50,
      forms: [982068, 982071, 982073, 982048] },
    { key: 'tf-agent-darkness', name: 'Agent of Darkness', stat: 'strikeFortitude', value: 50,
      forms: [982069, 982070, 982072, 982047] },
    { key: 'tf-face-outfit', name: 'The face complements the outfit perfectly', stat: 'accuracy', value: 551,
      forms: [982074, 982073, 982043, 982046, 982039, 982041] },
    { key: 'tf-elyos-asmo', name: 'Battle between Elyos and Asmodians', stat: 'critDmg', value: 80,
      forms: [982050, 982074, 982071, 982069, 982054, 982055] },
    { key: 'tf-ours-best', name: 'Ours are the best!', stat: 'critDmg', value: 20,
      bonus: 'Rapid Return',
      forms: [982063, 982064, 982065, 982078] },

    // ── 55–57: Halloween collections ──
    { key: 'tf-halloween-4', name: 'Halloween 4', stat: 'attack', value: 156,
      forms: [982079, 982080, 982081, 982082] },
    { key: 'tf-shadows-grow', name: 'The Shadows Grow', stat: 'parry', value: 538,
      forms: [982079, 982081] },
    { key: 'tf-last-dance', name: 'Our Last Dance', stat: 'block', value: 538,
      forms: [982080, 982082] },

    // ── 58–64: Apostle-themed collections ──
    { key: 'tf-pyjama-party', name: 'Pyjama Party', stat: 'evasion', value: 323,
      forms: [982090, 982062, 982060] },
    { key: 'tf-know-way', name: 'Do you know the way?', stat: 'magicResist', value: 323,
      forms: [982091, 982049, 982056] },
    { key: 'tf-black-white', name: 'Black & White Theory', stat: 'critDmg', value: 50,
      forms: [982086, 982087, 982054, 982055] },
    { key: 'tf-ball-costume', name: 'Extravagant Ball Costume', stat: 'healingBoost', value: 74,
      forms: [982088, 982089, 982046, 982035, 982023] },
    { key: 'tf-polyamorous', name: 'Polyamorous', stat: 'magicalDef', value: 171,
      forms: [982090, 982091, 982045, 982048, 982058] },
    { key: 'tf-gods-fantasy', name: 'Gods and Apostles of Fantasy', stat: 'spellFortitude', value: 80,
      forms: [982050, 982088, 982090, 982073, 982072] },
    { key: 'tf-gods-fate', name: 'Gods and Apostles of Fate', stat: 'strikeFortitude', value: 80,
      forms: [982074, 982089, 982091, 982070, 982068] },

    // ── 65–67: Rangers + Tiamat/Ereshkigal ──
    { key: 'tf-ready-4', name: 'Ready Player Four', stat: 'crit', value: 205,
      bonus: '[Extra] Collection Blessing',
      forms: [982092, 982093, 982025, 982052] },
    { key: 'tf-tiamat-legion', name: 'Tiamat Legion', stat: 'critDmg', value: 20,
      forms: [982095, 982046, 982040, 982059] },
    { key: 'tf-here-raid', name: 'Here for Raid', stat: 'critDmg', value: 40,
      forms: [982094, 982095, 982073, 982068, 982070] },

    // ── 68–76: Animal-themed collections ──
    { key: 'tf-cat-butler', name: 'The Cat and Her Butler', stat: 'magicalDef', value: 152,
      forms: [982101, 982061, 982045, 982062, 982060] },
    { key: 'tf-kitty-practice', name: 'Kitty Practice', stat: 'hp', value: 6600,
      forms: [982100, 982101] },
    { key: 'tf-cuddly-baa', name: 'Cuddly Baa', stat: 'physicalDef', value: 152,
      forms: [982103, 982043, 982032, 982027] },
    { key: 'tf-cuddly-moo', name: 'Cuddly Moo', stat: 'magicalDef', value: 152,
      forms: [982104, 982048, 982032, 982031] },
    { key: 'tf-cuddly-mau', name: 'Cuddly Mau', stat: 'hp', value: 5000,
      forms: [982103, 982104] },
    { key: 'tf-perfect-winter', name: 'Perfect Winter', stat: 'hp', value: 5000,
      forms: [982105, 982106] },
    { key: 'tf-warm-winter', name: 'Warm Winter', stat: 'physicalDef', value: 152,
      forms: [982105, 982044, 982047, 982025] },
    { key: 'tf-beautiful-winter', name: 'Beautiful Winter', stat: 'magicalDef', value: 152,
      forms: [982106, 982046, 982049, 982026] },
    { key: 'tf-prehistoric', name: 'Prehistoric Animal Protectorate', stat: 'accuracy', value: 331,
      forms: [982100, 982101, 982103, 982104, 982105, 982106] },

    // ── 77–84: Ultimate god collections ──
    { key: 'tf-ulti-assassin', name: 'Ultimate Assassin', stat: 'strikeFortitude', value: 60,
      forms: [982108, 982070, 982045, 982040, 982023] },
    { key: 'tf-ulti-protector', name: 'Ultimate Protector', stat: 'spellFortitude', value: 60,
      forms: [982107, 982073, 982046, 982059, 982025] },
    { key: 'tf-clash', name: 'Clash', stat: 'critDmg', value: 40,
      forms: [982107, 982108, 982070, 982073] },
    { key: 'tf-magnificent', name: 'Magnificent', stat: 'critDmg', value: 120,
      forms: [982110, 982111, 982091, 982088] },
    { key: 'tf-tyrant', name: 'Tyrant', stat: 'strikeFortitude', value: 60,
      forms: [982112, 982090, 982067, 982022, 982031] },
    { key: 'tf-promising', name: 'Promising Encounter', stat: 'attack', value: 419,
      forms: [982112, 982113, 982090, 982089] },
    { key: 'tf-time-light', name: 'Time of Light', stat: 'spellFortitude', value: 70,
      forms: [982114, 982086] },
    { key: 'tf-time-shadows', name: 'Time of Shadows', stat: 'strikeFortitude', value: 70,
      forms: [982115, 982087] },

    // ── 85–87: Faction lord collections ──
    { key: 'tf-lady-elysea', name: 'Lady of Elysea', stat: 'attack', value: 350,
      forms: [982114, 982112, 982111, 982107, 982050] },
    { key: 'tf-lord-asmodae', name: 'Lord of Asmodae', stat: 'physicalDef', value: 350,
      forms: [982115, 982113, 982110, 982108, 982074] },
    { key: 'tf-ulti-conqueror', name: 'Ultimate Transformation Conqueror', stat: 'hp', value: 10000,
      bonus: 'Summon: Alliance',
      gradeReq: { grade: 'ultimate', count: 12 } },

    // ── 88–89: Fire Dragon collections ──
    { key: 'tf-red-flame', name: 'Spread of the Red Flame', stat: 'attack', value: 200,
      forms: [982148, 982070, 982045, 982040, 982059, 982034] },
    { key: 'tf-hot-cold', name: 'Hot and Cold', stat: 'strikeFortitude', value: 70,
      forms: [982148, 982095, 982110] },
];

// ── Collection completion helpers ──
// Check if a collection is complete based on owned forms
function isCollectionComplete(coll, ownedForms) {
    if (coll.gradeReq) {
        // Grade-based: count owned forms of that grade
        var gradeForms = TRANSFORMS_BY_GRADE[coll.gradeReq.grade] || [];
        var ownedCount = gradeForms.filter(function(f) { return !!ownedForms[f.id]; }).length;
        return ownedCount >= coll.gradeReq.count;
    }
    if (coll.forms) {
        return coll.forms.every(function(id) { return !!ownedForms[id]; });
    }
    return false;
}

// Get progress info for a collection: { owned, total, pct }
function getCollectionProgress(coll, ownedForms) {
    if (coll.gradeReq) {
        var gradeForms = TRANSFORMS_BY_GRADE[coll.gradeReq.grade] || [];
        var ownedCount = gradeForms.filter(function(f) { return !!ownedForms[f.id]; }).length;
        var total = coll.gradeReq.count;
        return { owned: Math.min(ownedCount, total), total: total, pct: Math.min(100, Math.round(ownedCount / total * 100)) };
    }
    if (coll.forms) {
        var owned = coll.forms.filter(function(id) { return !!ownedForms[id]; }).length;
        return { owned: owned, total: coll.forms.length, pct: Math.round(owned / coll.forms.length * 100) };
    }
    return { owned: 0, total: 0, pct: 0 };
}

// Get form names for a collection's required forms
function getCollectionFormNames(coll) {
    if (coll.gradeReq) {
        var g = FORM_GRADES.find(function(fg) { return fg.key === coll.gradeReq.grade; });
        return 'Collect ' + coll.gradeReq.count + ' ' + (g ? g.name : coll.gradeReq.grade) + ' grade transformations.';
    }
    if (coll.forms) {
        return coll.forms.map(function(id) {
            var f = TRANSFORMS_BY_ID[id];
            return f ? f.name : '?';
        }).join(' \u00B7 ');
    }
    return '';
}

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
