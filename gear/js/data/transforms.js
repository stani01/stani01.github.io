'use strict';


// Stat display definitions - [base, perEnchant] format in each transform
// Physical stats: accuracy, critStrike -> map to comparison 'accuracy', 'crit'
// Magical stats:  magicAccuracy, critSpell -> map to comparison 'accuracy', 'crit' for magic classes
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
    { key: 'pvpDefence',    name: 'Add. PvP Def',   unit: '',   display: false },
    { key: 'pveDefence',    name: 'Add. PvE Def',   unit: '',   display: false },
    { key: 'magicResist',   name: 'Magic Resist',   unit: '',   display: false },
    { key: 'evasion',       name: 'Evasion',        unit: '',   display: false }
];

// Physical classes use accuracy + critStrike; magical classes use magicAccuracy + critSpell
var PHYSICAL_CLASSES = ['gladiator', 'templar', 'assassin', 'ranger', 'chanter', 'painter'];
function isPhysicalClass(cls) { return PHYSICAL_CLASSES.indexOf(cls) !== -1; }



// Grade definitions for the Forms Collection UI
var FORM_GRADES = [
    { key: 'normal',    name: 'Normal',    color: '#c7c7c7' },
    { key: 'large',     name: 'Greater',   color: '#66bb6a' },
    { key: 'ancient',   name: 'Ancient',   color: '#ffd700' },
    { key: 'legendary', name: 'Legendary', color: '#bc3bff' },
    { key: 'ultimate',  name: 'Ultimate',  color: '#f35d50' }
];

// ===============================================================================
// UNIFIED TRANSFORMS DATABASE
//
// All forms in the game - ultimates have full stats, others have stats: {} for now.
// Used for BOTH the transform picker (ultimates + 'none') AND the forms collection.
//
// Stats format: [base, perEnchant] - total at enchant N = base + perEnchant * N
// Display-only speeds are flat numbers (no enchant scaling)
// ===============================================================================
var TRANSFORMS = [
    // -- Special None entry (transform picker only) --
    { key: 'none', name: 'None', icon: '../assets/icons/icon_frame_2.png', grade: null, stats: {} },

    // -- Ultimate --
    { key: 'kaisinel', id: 982050, name: 'Kaisinel', grade: 'ultimate', icon: '../assets/icons/trans_finality_kaisinel.png', stats: {
        attackSpeed: 60, castSpeed: 45, moveSpeed: 100,
        accuracy: [378, 19], magicAccuracy: [378, 19], critStrike: [331, 17], critSpell: [331, 17],
        healingBoost: [80, 4], pvpAttack: [236, 12], pveAttack: [236, 12],
        pvpDefence: [241, 12], pveDefence: [241, 12]
    }},
    { key: 'marchutan', id: 982074, name: 'Marchutan', grade: 'ultimate', icon: '../assets/icons/trans_finality_marchutan.png', stats: {
        attackSpeed: 50, castSpeed: 55, moveSpeed: 100,
        accuracy: [378, 19], magicAccuracy: [378, 19], critStrike: [331, 17], critSpell: [331, 17],
        healingBoost: [80, 4], pvpAttack: [236, 12], pveAttack: [236, 12],
        pvpDefence: [241, 12], pveDefence: [241, 12]
    }},
    { key: 'ereshkigal', id: 982094, name: 'Ereshkigal', grade: 'ultimate', icon: '../assets/icons/trans_finality_eresh.png', stats: {
        attackSpeed: 55, castSpeed: 50, moveSpeed: 100,
        accuracy: [378, 19], magicAccuracy: [378, 19], critStrike: [331, 17], critSpell: [331, 17],
        healingBoost: [80, 4], pvpAttack: [472, 24], pveAttack: [180, 9],
        pveDefence: [180, 9]
    }},
    { key: 'tiamat', id: 982095, name: 'Tiamat', grade: 'ultimate', icon: '../assets/icons/trans_finality_tiamat.png', stats: {
        attackSpeed: 55, castSpeed: 50, moveSpeed: 100,
        accuracy: [378, 19], magicAccuracy: [378, 19], critStrike: [331, 17], critSpell: [331, 17],
        healingBoost: [80, 4], pvpAttack: [180, 9], pveAttack: [472, 24],
        pvpDefence: [180, 9]
    }},
    { key: 'nezekan', id: 982107, name: 'Nezekan', grade: 'ultimate', icon: '../assets/icons/trans_finality_nejakan.png', stats: {
        attackSpeed: 50, castSpeed: 55, moveSpeed: 100,
        critStrike: [331, 17], critSpell: [331, 17],
        healingBoost: [80, 4], hp: [4400, 220], magicResist: [341, 17],
        pvpAttack: [236, 11], pveAttack: [236, 11],
        pvpDefence: [241, 12], pveDefence: [241, 12]
    }},
    { key: 'zikel', id: 982108, name: 'Zikel', grade: 'ultimate', icon: '../assets/icons/trans_finality_zikel.png', stats: {
        attackSpeed: 60, castSpeed: 45, moveSpeed: 100,
        critStrike: [420, 21], critSpell: [420, 21],
        healingBoost: [80, 4], pvpAttack: [236, 11], pveAttack: [236, 11],
        pvpDefence: [241, 12], pveDefence: [241, 12]
    }},
    { key: 'lumiel', id: 982110, name: 'Lumiel', grade: 'ultimate', icon: '../assets/icons/trans_finality_lumiel.png', stats: {
        attackSpeed: 50, castSpeed: 55, moveSpeed: 100,
        accuracy: [378, 19], magicAccuracy: [520, 26], critStrike: [420, 21], critSpell: [420, 21],
        healingBoost: [80, 4], pvpAttack: [620, 31], pveAttack: [420, 21],
        pvpDefence: [170, 9], pveDefence: [170, 9]
    }},
    { key: 'yustiel', id: 982111, name: 'Yustiel', grade: 'ultimate', icon: '../assets/icons/trans_finality_yustiel.png', stats: {
        attackSpeed: 55, castSpeed: 50, moveSpeed: 100,
        accuracy: [520, 26], magicAccuracy: [378, 19], critStrike: [420, 21], critSpell: [420, 21],
        healingBoost: [90, 5], pvpAttack: [620, 31], pveAttack: [420, 21],
        pvpDefence: [170, 9], pveDefence: [170, 9]
    }},
    { key: 'vaizel', id: 982112, name: 'Vaizel', grade: 'ultimate', icon: '../assets/icons/trans_finality_vaizel.png', stats: {
        attackSpeed: 55, castSpeed: 50, moveSpeed: 100,
        accuracy: [361, 19], critStrike: [350, 18], critSpell: [330, 17],
        pvpAttack: [378, 19], pveAttack: [189, 10],
        pvpDefence: [217, 11], pveDefence: [193, 10],
        evasion: [352, 18], magicResist: [341, 18]
    }},
    { key: 'triniel', id: 982113, name: 'Triniel', grade: 'ultimate', icon: '../assets/icons/trans_finality_triniel.png', stats: {
        attackSpeed: 55, castSpeed: 50, moveSpeed: 100,
        magicAccuracy: [361, 19], critStrike: [330, 17], critSpell: [350, 18],
        pvpAttack: [378, 19], pveAttack: [189, 10],
        pvpDefence: [217, 11], pveDefence: [193, 10],
        evasion: [341, 18], magicResist: [352, 18]
    }},
    { key: 'ariel', id: 982114, name: 'Ariel', grade: 'ultimate', icon: '../assets/icons/trans_finality_ariel.png', stats: {
        attackSpeed: 60, castSpeed: 55, moveSpeed: 100,
        accuracy: [378, 19], magicAccuracy: [413, 21], critStrike: [365, 19], critSpell: [415, 21],
        healingBoost: [82, 4], pvpAttack: [420, 21], pveAttack: [620, 31],
        pvpDefence: [217, 11], pveDefence: [217, 11]
    }},
    { key: 'azphel', id: 982115, name: 'Azphel', grade: 'ultimate', icon: '../assets/icons/trans_finality_azphel.png', stats: {
        attackSpeed: 60, castSpeed: 55, moveSpeed: 100,
        accuracy: [413, 21], magicAccuracy: [378, 19], critStrike: [415, 21], critSpell: [365, 19],
        healingBoost: [82, 4], pvpAttack: [420, 21], pveAttack: [620, 31],
        pvpDefence: [217, 11], pveDefence: [217, 11]
    }},
    { key: 'firedragon', id: 982148, name: 'Fire Dragon King', grade: 'ultimate', icon: '../assets/icons/trans_finality_firedragon.png', stats: {
        attackSpeed: 60, castSpeed: 55, moveSpeed: 100,
        accuracy: [520, 26], magicAccuracy: [520, 26], critStrike: [420, 21], critSpell: [420, 21],
        healingBoost: [90, 5], pvpAttack: [620, 31], pveAttack: [620, 31],
        pvpDefence: [241, 12], pveDefence: [241, 12]
    }},
    { key: 'darkdragon', id: 982149, name: 'Dark Dragon King', grade: 'ultimate', icon: '../assets/icons/trans_finality_darkdragon.png', stats: {
        attackSpeed: 60, castSpeed: 55, moveSpeed: 100,
        accuracy: [520, 26], magicAccuracy: [520, 26], critStrike: [420, 21], critSpell: [420, 21],
        healingBoost: [90, 5], pvpAttack: [620, 31], pveAttack: [620, 31],
        pvpDefence: [241, 12], pveDefence: [241, 12]
    }},

    // -- Legendary (stats TBD) --
    { key: 'hamerun',              id: 982043, name: 'Hamerun',              grade: 'legendary', icon: '../assets/icons/trans_relic_hamerun.png', stats: {} },
    { key: 'bollvig',              id: 982044, name: 'Bollvig',              grade: 'legendary', icon: '../assets/icons/trans_relic_vampire.png', stats: {} },
    { key: 'kromede',              id: 982045, name: 'Kromede',              grade: 'legendary', icon: '../assets/icons/trans_relic_cromede.png', stats: {} },
    { key: 'tahabata',             id: 982046, name: 'Tahabata',             grade: 'legendary', icon: '../assets/icons/trans_relic_tahabata.png', stats: {} },
    { key: 'mastarius',            id: 982047, name: 'Mastarius',            grade: 'legendary', icon: '../assets/icons/trans_relic_tegrak.png', stats: {} },
    { key: 'veille',               id: 982048, name: 'Veille',               grade: 'legendary', icon: '../assets/icons/trans_relic_herenas.png', stats: {} },
    { key: 'sita-form',            id: 982049, name: 'Sita',                 grade: 'legendary', icon: '../assets/icons/trans_relic_xita.png', stats: {} },
    { key: 'weda-form',            id: 982060, name: 'Weda',                 grade: 'legendary', icon: '../assets/icons/trans_relic_weatha.png', stats: {} },
    { key: 'prigga',               id: 982061, name: 'Prigga',               grade: 'legendary', icon: '../assets/icons/trans_relic_prigida.png', stats: {} },
    { key: 'grendal-form',         id: 982062, name: 'Grendal',              grade: 'legendary', icon: '../assets/icons/trans_relic_grandal.png', stats: {} },
    { key: 'valiant-hanbok-pixel', id: 982063, name: 'Valiant Hanbok Pixel', grade: 'legendary', icon: '../assets/icons/trans_relic_brick02.png', stats: {} },
    { key: 'wise-hanbok-pixel',    id: 982064, name: 'Wise Hanbok Pixel',    grade: 'legendary', icon: '../assets/icons/trans_relic_brick03.png', stats: {} },
    { key: 'cunning-hanbok-pixel', id: 982065, name: 'Cunning Hanbok Pixel', grade: 'legendary', icon: '../assets/icons/trans_relic_brick04.png', stats: {} },
    { key: 'irunin',               id: 982067, name: 'Irunin',               grade: 'legendary', icon: '../assets/icons/trans_relic_irrnyn.png', stats: {} },
    { key: 'israphels-apostle',    id: 982068, name: 'Israphel\'s Apostle',  grade: 'legendary', icon: '../assets/icons/trans_relic_israphelapostle.png', stats: {} },
    { key: 'marchutans-apostle',   id: 982069, name: 'Marchutan\'s Apostle', grade: 'legendary', icon: '../assets/icons/trans_relic_marchutanapostle.png', stats: {} },
    { key: 'zikels-apostle',       id: 982070, name: 'Zikel\'s Apostle',     grade: 'legendary', icon: '../assets/icons/trans_relic_zikelapostle.png', stats: {} },
    { key: 'kaisinels-apostle',    id: 982071, name: 'Kaisinel\'s Apostle',  grade: 'legendary', icon: '../assets/icons/trans_relic_kaisinelapostle.png', stats: {} },
    { key: 'siels-apostle',        id: 982072, name: 'Siel\'s Apostle',      grade: 'legendary', icon: '../assets/icons/trans_relic_sielapostle.png', stats: {} },
    { key: 'nezekans-apostle',     id: 982073, name: 'Nezekan\'s Apostle',   grade: 'legendary', icon: '../assets/icons/trans_relic_nezekanapostle.png', stats: {} },
    { key: 'raging-hanbok-pixel',  id: 982078, name: 'Raging Hanbok Pixel',  grade: 'legendary', icon: '../assets/icons/trans_relic_brick05.png', stats: {} },
    { key: 'frightchamun',         id: 982079, name: 'Frightchamun',         grade: 'legendary', icon: '../assets/icons/trans_relic_mummy.png', stats: {} },
    { key: 'jack-nox',             id: 982080, name: 'Jack Nox',             grade: 'legendary', icon: '../assets/icons/trans_relic_pumpkin.png', stats: {} },
    { key: 'frankenshock',         id: 982081, name: 'Frankenshock',         grade: 'legendary', icon: '../assets/icons/trans_relic_frankenstein.png', stats: {} },
    { key: 'vampirina',            id: 982082, name: 'Vampirina',            grade: 'legendary', icon: '../assets/icons/trans_relic_vampire02.png', stats: {} },
    { key: 'ariels-apostle',       id: 982086, name: 'Ariel\'s Apostle',     grade: 'legendary', icon: '../assets/icons/trans_relic_arielapostle.png', stats: {} },
    { key: 'azphels-apostle',      id: 982087, name: 'Azphel\'s Apostle',    grade: 'legendary', icon: '../assets/icons/trans_relic_azphelapostle.png', stats: {} },
    { key: 'yustiels-apostle',     id: 982088, name: 'Yustiel\'s Apostle',   grade: 'legendary', icon: '../assets/icons/trans_relic_yustielapostle.png', stats: {} },
    { key: 'triniels-apostle',     id: 982089, name: 'Triniel\'s Apostle',   grade: 'legendary', icon: '../assets/icons/trans_relic_trinielapostle.png', stats: {} },
    { key: 'vaizels-apostle',      id: 982090, name: 'Vaizel\'s Apostle',    grade: 'legendary', icon: '../assets/icons/trans_relic_vaizelapostle.png', stats: {} },
    { key: 'lumiels-apostle',      id: 982091, name: 'Lumiel\'s Apostle',    grade: 'legendary', icon: '../assets/icons/trans_relic_lumielapostle.png', stats: {} },
    { key: 'mouse-ranger',         id: 982092, name: 'Mouse Ranger',         grade: 'legendary', icon: '../assets/icons/trans_relic_mouseranger.png', stats: {} },
    { key: 'keyboard-ranger',      id: 982093, name: 'Keyboard Ranger',      grade: 'legendary', icon: '../assets/icons/trans_relic_keyboardranger.png', stats: {} },
    { key: 'aphsaranta-adventurer', id: 982109, name: 'Aphsaranta Adventurer', grade: 'legendary', icon: '../assets/icons/trans_finality_foxaviator.png', stats: {} },

    // -- Ancient (stats TBD) --
    { key: 'baa',                  id: 982032, name: 'Baa',                    grade: 'ancient', icon: '../assets/icons/trans_ancient_sheep.png', stats: {} },
    { key: 'desert-fox',           id: 982033, name: 'Desert Fox',             grade: 'ancient', icon: '../assets/icons/trans_ancient_fox.png', stats: {} },
    { key: 'tiamat-dragonbound',   id: 982034, name: 'Tiamat Dragonbound',     grade: 'ancient', icon: '../assets/icons/trans_ancient_fanatic.png', stats: {} },
    { key: 'tarha',                id: 982035, name: 'Tarha',                  grade: 'ancient', icon: '../assets/icons/trans_ancient_ancientkrall.png', stats: {} },
    { key: 'black-mane',           id: 982036, name: 'Black Mane',             grade: 'ancient', icon: '../assets/icons/trans_ancient_ancientlycan.png', stats: {} },
    { key: 'cat',                  id: 982037, name: 'Cat',                    grade: 'ancient', icon: '../assets/icons/trans_ancient_cat.png', stats: {} },
    { key: 'popoku',               id: 982038, name: 'Popoku',                 grade: 'ancient', icon: '../assets/icons/trans_ancient_popoku.png', stats: {} },
    { key: 'aquan',                id: 982039, name: 'Aquan',                  grade: 'ancient', icon: '../assets/icons/trans_ancient_merman.png', stats: {} },
    { key: 'tiamat-drakan',        id: 982040, name: 'Tiamat Drakan',          grade: 'ancient', icon: '../assets/icons/trans_ancient_drakantiamat.png', stats: {} },
    { key: 'beritra-drakan',       id: 982041, name: 'Beritra Drakan',         grade: 'ancient', icon: '../assets/icons/trans_ancient_drakanvritra.png', stats: {} },
    { key: 'ereshkigal-drakan',    id: 982042, name: 'Ereshkigal Drakan',      grade: 'ancient', icon: '../assets/icons/trans_ancient_drakaneresh.png', stats: {} },
    { key: 'pixel',                id: 982053, name: 'Pixel',                  grade: 'ancient', icon: '../assets/icons/trans_ancient_brick.png', stats: {} },
    { key: 'light-field-warden',   id: 982054, name: 'Light Field Warden',     grade: 'ancient', icon: '../assets/icons/trans_ancient_lightguard.png', stats: {} },
    { key: 'dark-field-warden',    id: 982055, name: 'Dark Field Warden',      grade: 'ancient', icon: '../assets/icons/trans_ancient_darkguard.png', stats: {} },
    { key: 'minion-of-oblivion',   id: 982056, name: 'Minion of Oblivion',     grade: 'ancient', icon: '../assets/icons/trans_ancient_shadow.png', stats: {} },
    { key: 'ereshkigals-apostle',  id: 982057, name: 'Ereshkigal\'s Apostle',  grade: 'ancient', icon: '../assets/icons/trans_ancient_ereshcleric.png', stats: {} },
    { key: 'beritras-apostle',     id: 982058, name: 'Beritra\'s Apostle',     grade: 'ancient', icon: '../assets/icons/trans_ancient_vritracleric.png', stats: {} },
    { key: 'tiamats-apostle',      id: 982059, name: 'Tiamat\'s Apostle',      grade: 'ancient', icon: '../assets/icons/trans_ancient_tiamatcleric.png', stats: {} },
    { key: 'blurs-of-colour',      id: 982066, name: 'Blurs of Colour',        grade: 'ancient', icon: '../assets/icons/trans_ancient_paint.png', stats: {} },
    { key: 'dr-murr',              id: 982100, name: 'Dr Murr',                grade: 'ancient', icon: '../assets/icons/trans_ancient_catdoctor01.png', stats: {} },
    { key: 'sister-meow',          id: 982101, name: 'Sister Meow',            grade: 'ancient', icon: '../assets/icons/trans_ancient_catnurse01.png', stats: {} },
    { key: 'hanbok-baa',           id: 982103, name: 'Hanbok Baa',             grade: 'ancient', icon: '../assets/icons/trans_ancient_sheephanbok_f.png', stats: {} },
    { key: 'hanbok-moo',           id: 982104, name: 'Hanbok Moo',             grade: 'ancient', icon: '../assets/icons/trans_ancient_sheephanbok_m.png', stats: {} },
    { key: 'warm-snow-fox',        id: 982105, name: 'Warm Snow Fox',          grade: 'ancient', icon: '../assets/icons/trans_ancient_foxsweater_f.png', stats: {} },
    { key: 'snuggly-snow-fox',     id: 982106, name: 'Snuggly Snow Fox',       grade: 'ancient', icon: '../assets/icons/trans_ancient_foxsweater_m.png', stats: {} },

    // -- Large / Greater (stats TBD) --
    { key: 'wyvern-of-victory',    id: 982018, name: 'Wyvern of Victory', grade: 'large', icon: '../assets/icons/trans_rare_dragonolympic.png', stats: {} },
    { key: 'shugo',                id: 982019, name: 'Shugo',             grade: 'large', icon: '../assets/icons/trans_rare_rabbitshugoblue.png', stats: {} },
    { key: 'super-shugo',          id: 982020, name: 'Super Shugo',       grade: 'large', icon: '../assets/icons/trans_rare_rabbitshugored.png', stats: {} },
    { key: 'luna-patrol',          id: 982021, name: 'Luna Patrol',       grade: 'large', icon: '../assets/icons/trans_rare_luna.png', stats: {} },
    { key: 'jester',               id: 982022, name: 'Jester',            grade: 'large', icon: '../assets/icons/trans_rare_clown.png', stats: {} },
    { key: 'anubite-warrior',      id: 982023, name: 'Anubite Warrior',   grade: 'large', icon: '../assets/icons/trans_rare_skeletonblade.png', stats: {} },
    { key: 'doberman',             id: 982024, name: 'Doberman',          grade: 'large', icon: '../assets/icons/trans_rare_dog01.png', stats: {} },
    { key: 'tin',                  id: 982025, name: 'Tin',               grade: 'large', icon: '../assets/icons/trans_rare_can.png', stats: {} },
    { key: 'chihuahua',            id: 982026, name: 'Chihuahua',         grade: 'large', icon: '../assets/icons/trans_rare_dog02.png', stats: {} },
    { key: 'pomeranian',           id: 982027, name: 'Pomeranian',        grade: 'large', icon: '../assets/icons/trans_rare_dog03.png', stats: {} },
    { key: 'mau',                  id: 982028, name: 'Mau',               grade: 'large', icon: '../assets/icons/trans_rare_lycan.png', stats: {} },
    { key: 'test-subject',         id: 982029, name: 'Test Subject',      grade: 'large', icon: '../assets/icons/trans_rare_testresult.png', stats: {} },
    { key: 'krall',                id: 982030, name: 'Krall',             grade: 'large', icon: '../assets/icons/trans_rare_krallscout.png', stats: {} },
    { key: 'rabbit-bandit',        id: 982031, name: 'Rabbit Bandit',     grade: 'large', icon: '../assets/icons/trans_rare_pinkrabbit.png', stats: {} },
    { key: 'naughty-rabbit',       id: 982051, name: 'Naughty Rabbit',    grade: 'large', icon: '../assets/icons/trans_rare_yellowrabbit.png', stats: {} },
    { key: 'golden-tin',           id: 982052, name: 'Golden Tin',        grade: 'large', icon: '../assets/icons/trans_rare_goldencan.png', stats: {} },

    // -- Normal (stats TBD) --
    { key: 'polar-bear',           id: 982000, name: 'Polar Bear',        grade: 'normal', icon: '../assets/icons/trans_common_whitebear.png', stats: {} },
    { key: 'anubite',              id: 982001, name: 'Anubite',           grade: 'normal', icon: '../assets/icons/trans_common_skeleton.png', stats: {} },
    { key: 'pink-tiger',           id: 982002, name: 'Pink Tiger',        grade: 'normal', icon: '../assets/icons/trans_common_pinktiger.png', stats: {} },
    { key: 'pirate',               id: 982003, name: 'Pirate',            grade: 'normal', icon: '../assets/icons/trans_common_cashseaman.png', stats: {} },
    { key: 'lepharist',            id: 982004, name: 'Lepharist',         grade: 'normal', icon: '../assets/icons/trans_common_lehpar.png', stats: {} },
    { key: 'graveknight',          id: 982005, name: 'Graveknight',       grade: 'normal', icon: '../assets/icons/trans_common_graveknight.png', stats: {} },
    { key: 'kobold',               id: 982006, name: 'Kobold',            grade: 'normal', icon: '../assets/icons/trans_common_brownie.png', stats: {} },
    { key: 'white-tiger',          id: 982007, name: 'White Tiger',       grade: 'normal', icon: '../assets/icons/trans_common_whitetiger.png', stats: {} },
    { key: 'tiger',                id: 982008, name: 'Tiger',             grade: 'normal', icon: '../assets/icons/trans_common_cashtiger.png', stats: {} },
    { key: 'yellow-inquin',        id: 982009, name: 'Yellow Inquin',     grade: 'normal', icon: '../assets/icons/trans_common_penguinyellow.png', stats: {} },
    { key: 'purple-inquin',        id: 982010, name: 'Purple Inquin',     grade: 'normal', icon: '../assets/icons/trans_common_penguinviolet.png', stats: {} },
    { key: 'red-inquin',           id: 982011, name: 'Red Inquin',        grade: 'normal', icon: '../assets/icons/trans_common_penguinred.png', stats: {} },
    { key: 'orange-inquin',        id: 982012, name: 'Orange Inquin',     grade: 'normal', icon: '../assets/icons/trans_common_penguinorange.png', stats: {} },
    { key: 'black-inquin',         id: 982013, name: 'Black Inquin',      grade: 'normal', icon: '../assets/icons/trans_common_penguin.png', stats: {} },
    { key: 'green-inquin',         id: 982014, name: 'Green Inquin',      grade: 'normal', icon: '../assets/icons/trans_common_penguingreen.png', stats: {} },
    { key: 'wyvern',               id: 982015, name: 'Wyvern',            grade: 'normal', icon: '../assets/icons/trans_common_dragon.png', stats: {} },
    { key: 'good-natured-shugo',   id: 982016, name: 'Good-natured Shugo', grade: 'normal', icon: '../assets/icons/trans_common_shugo.png', stats: {} },
    { key: 'powerful-panda',       id: 982017, name: 'Powerful Panda',     grade: 'normal', icon: '../assets/icons/trans_common_eventpanda.png', stats: {} },
];

// -- Derived lookups --
var TRANSFORM_KEYS = TRANSFORMS.map(function(t) { return t.key; });

// Ultimate-only list for the transform picker (includes 'none')
var ULTIMATE_TRANSFORMS = TRANSFORMS.filter(function(t) { return t.key === 'none' || t.grade === 'ultimate'; });

// Forms collection lookups (by numeric ID)
var TRANSFORMS_BY_ID = {};
TRANSFORMS.forEach(function(t) { if (t.id) TRANSFORMS_BY_ID[t.id] = t; });

var TRANSFORMS_BY_GRADE = {};
FORM_GRADES.forEach(function(g) { TRANSFORMS_BY_GRADE[g.key] = []; });
TRANSFORMS.forEach(function(t) { if (t.grade && TRANSFORMS_BY_GRADE[t.grade]) TRANSFORMS_BY_GRADE[t.grade].push(t); });

var ALL_FORM_IDS = TRANSFORMS.filter(function(t) { return t.id; }).map(function(t) { return t.id; });

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
    out.pvpDefence   = tfStatVal(s.pvpDefence, e);
    out.pveDefence   = tfStatVal(s.pveDefence, e);
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
        pveDefence: 0, pvpDefence: 0, 
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
                stats.pveDefence += 190;
                stats.pvpDefence += 190;
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
