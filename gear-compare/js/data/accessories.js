'use strict';


var ACCESSORY_SLOTS_UPPER = [
    { key: 'feather',  name: 'Feather',  icon: '../assets/icons/icon_item_equip_feather_f01.png' },
    { key: 'wings',    name: 'Wings',    icon: '../assets/icons/icon_item_equip_wing_f01.png' },
    { key: 'bracelet', name: 'Bracelet', icon: '../assets/icons/icon_item_equip_bracelet_f01.png' }
];
var ACCESSORY_SLOTS_LOWER_L = [
    { key: 'earring1', name: 'Earring', icon: '../assets/icons/icon_item_equip_earring_f01.png' },
    { key: 'necklace', name: 'Necklace', icon: '../assets/icons/icon_item_equip_necklace_f01.png' },
    { key: 'ring1',    name: 'Ring',     icon: '../assets/icons/icon_item_equip_ring_f01.png' }
];
var ACCESSORY_SLOTS_LOWER_R = [
    { key: 'earring2', name: 'Earring', icon: '../assets/icons/icon_item_equip_earring_f01.png' },
    { key: 'belt',     name: 'Belt',    icon: '../assets/icons/icon_item_equip_belt_f01.png' },
    { key: 'ring2',    name: 'Ring',     icon: '../assets/icons/icon_item_equip_ring_f01.png' }
];

var ALL_ACCESSORY_KEYS = ['feather','wings','bracelet','earring1','necklace','ring1','earring2','belt','ring2'];

var ACCESSORY_SETS = [
    { key: 'none', name: 'None' },
    { key: 'aeon-guardian', name: 'Aeon Guardian' },
    { key: 'burning-altar', name: 'Burning Altar' },
    { key: 'starshine', name: 'Starshine' }
];
var ACCESSORY_SET_KEYS = ACCESSORY_SETS.map(function(s) { return s.key; });

// Map accessory slot key -> stats lookup type
var ACC_STATS_TYPE = {
    'feather': 'feather', 'wings': 'wings', 'bracelet': 'feather',
    'earring1': 'earring', 'earring2': 'earring', 'necklace': 'necklace',
    'ring1': 'ring', 'ring2': 'ring', 'belt': 'ring'
};

// Shared selectable bonus pools (identical for burning-altar and aeon-guardian)
var ACC_BONUSES_WINGS = [
    { key: 'hp',           name: 'HP',            stat: 'hp',           value: 1917 },
    { key: 'accuracy',     name: 'Accuracy',      stat: 'accuracy',     value: 411 },
    { key: 'crit',         name: 'Crit',          stat: 'crit',         value: 363 },
    { key: 'attack',       name: 'Attack',        stat: 'attack',       value: 275 },
    { key: 'healingBoost', name: 'Healing Boost',  stat: 'healingBoost', value: 183 },
    { key: 'evasion',      name: 'Evasion',       stat: 'evasion',      value: 508 },
    { key: 'magicResist',  name: 'Magic Resist',   stat: 'magicResist',  value: 508 }
];
var ACC_BONUSES_FEATHER = [
    { key: 'hp',           name: 'HP',            stat: 'hp',           value: 1522 },
    { key: 'accuracy',     name: 'Accuracy',      stat: 'accuracy',     value: 326 },
    { key: 'crit',         name: 'Crit',          stat: 'crit',         value: 288 },
    { key: 'physicalDef',  name: 'Physical Def',   stat: 'physicalDef',  value: 240 },
    { key: 'magicalDef',   name: 'Magical Def',    stat: 'magicalDef',   value: 240 },
    { key: 'evasion',      name: 'Evasion',       stat: 'evasion',      value: 415 },
    { key: 'magicResist',  name: 'Magic Resist',   stat: 'magicResist',  value: 415 },
    { key: 'healingBoost', name: 'Healing Boost',  stat: 'healingBoost', value: 146 }
];
var ACC_BONUSES_JEWELRY = [
    { key: 'hp',           name: 'HP',            stat: 'hp',           value: 1344 },
    { key: 'accuracy',     name: 'Accuracy',      stat: 'accuracy',     value: 288 },
    { key: 'crit',         name: 'Crit',          stat: 'crit',         value: 254 },
    { key: 'attack',       name: 'Attack',        stat: 'attack',       value: 210 },
    { key: 'healingBoost', name: 'Healing Boost',  stat: 'healingBoost', value: 126 },
    { key: 'evasion',      name: 'Evasion',       stat: 'evasion',      value: 356 },
    { key: 'magicResist',  name: 'Magic Resist',   stat: 'magicResist',  value: 356 },
    { key: 'parry',        name: 'Parry',         stat: 'parry',        value: 670 },
    { key: 'block',        name: 'Block',         stat: 'block',        value: 670 }
];
var ACC_BONUSES_RING = [
    { key: 'hp',           name: 'HP',            stat: 'hp',           value: 672 },
    { key: 'accuracy',     name: 'Accuracy',      stat: 'accuracy',     value: 144 },
    { key: 'crit',         name: 'Crit',          stat: 'crit',         value: 127 },
    { key: 'attack',       name: 'Attack',        stat: 'attack',       value: 210 },
    { key: 'healingBoost', name: 'Healing Boost',  stat: 'healingBoost', value: 64 },
    { key: 'evasion',      name: 'Evasion',       stat: 'evasion',      value: 178 },
    { key: 'magicResist',  name: 'Magic Resist',   stat: 'magicResist',  value: 178 },
    { key: 'parry',        name: 'Parry',         stat: 'parry',        value: 356 },
    { key: 'block',        name: 'Block',         stat: 'block',        value: 356 }
];
var ACC_BONUSES_GLYPH = [
    { key: 'physicalDef',  name: 'Physical Def', stat: 'physicalDef', value: 210 },
    { key: 'magicalDef',   name: 'Magical Def',  stat: 'magicalDef',  value: 210 },
    { key: 'accuracy',     name: 'Accuracy',     stat: 'accuracy',    value: 411 },
    { key: 'attack',       name: 'Attack',       stat: 'attack',      value: 210 },
    { key: 'evasion',      name: 'Evasion',      stat: 'evasion',     value: 415 },
    { key: 'magicResist',  name: 'Magic Resist', stat: 'magicResist', value: 415 },
    { key: 'parry',        name: 'Parry',        stat: 'parry',       value: 670 },
    { key: 'block',        name: 'Block',        stat: 'block',       value: 670 }
];

var ACCESSORY_STATS = {
    'starshine': {
        wings: {
            base: { hp: 4426, attack: 1803, physicalDef: 759, magicalDef: 759 },
            fixed: { hp: 1917, attack: 275, crit: 363, accuracy: 411 }
        },
        feather: {
            base: { hp: 3319, attack: 206, physicalDef: 1764, magicalDef: 1764 },
            fixed: { hp: 1522, crit: 288, accuracy: 326 },
            physDef: 240
        },
        earring: {
            base: { attack: 256, physicalDef: 169, magicalDef: 169, accuracy: 1332, block: 1332, parry: 1332, evasion: 1824, magicResist: 1824 },
            fixed: { hp: 1344, attack: 191, crit: 254, accuracy: 288 }
        },
        necklace: {
            base: { attack: 279, physicalDef: 191, magicalDef: 191, accuracy: 1884, block: 1854, parry: 1854, evasion: 2555, magicResist: 2555 },
            fixed: { hp: 1344, attack: 191, crit: 254, accuracy: 288 }
        },
        ring: {
            base: { attack: 238, physicalDef: 150, magicalDef: 150, accuracy: 932, block: 942, parry: 942, evasion: 1272, magicResist: 1272 },
            fixed: { hp: 672, attack: 191, crit: 127, accuracy: 144 }
        }
    },
    'burning-altar': {
        wings:    { base: { hp: 4426, attack: 1878, physicalDef: 790, magicalDef: 790 }, maxBonuses: 4, bonuses: ACC_BONUSES_WINGS },
        feather:  { base: { hp: 3319, attack: 215, physicalDef: 1837, magicalDef: 1837 }, maxBonuses: 4, bonuses: ACC_BONUSES_FEATHER },
        earring:  { base: { attack: 301, physicalDef: 199, magicalDef: 199, block: 1332, accuracy: 1332, parry: 1332, magicResist: 1824, evasion: 1824 }, maxBonuses: 4, bonuses: ACC_BONUSES_JEWELRY },
        necklace: { base: { attack: 328, physicalDef: 225, magicalDef: 225, block: 1854, accuracy: 1844, parry: 1854, magicResist: 2555, evasion: 2555 }, maxBonuses: 4, bonuses: ACC_BONUSES_JEWELRY },
        ring:     { base: { attack: 280, physicalDef: 177, magicalDef: 177, block: 942, accuracy: 932, parry: 942, magicResist: 1272, evasion: 1272 }, maxBonuses: 4, bonuses: ACC_BONUSES_RING }
    },
    'aeon-guardian': {
        wings:    { base: { hp: 4957, attack: 2103, physicalDef: 885, magicalDef: 885 }, maxBonuses: 4, bonuses: ACC_BONUSES_WINGS },
        feather:  { base: { hp: 3717, attack: 241, physicalDef: 2057, magicalDef: 2057 }, maxBonuses: 4, bonuses: ACC_BONUSES_FEATHER },
        earring:  { base: { attack: 337, physicalDef: 223, magicalDef: 223, block: 1492, accuracy: 1492, parry: 1492, magicResist: 2043, evasion: 2043 }, maxBonuses: 4, bonuses: ACC_BONUSES_JEWELRY },
        necklace: { base: { attack: 394, physicalDef: 270, magicalDef: 270, block: 2225, accuracy: 2261, parry: 2225, magicResist: 3066, evasion: 3066 }, maxBonuses: 4, bonuses: ACC_BONUSES_JEWELRY },
        ring:     { base: { attack: 336, physicalDef: 212, magicalDef: 212, block: 1130, accuracy: 1118, parry: 1130, magicResist: 1526, evasion: 1526 }, maxBonuses: 4, bonuses: ACC_BONUSES_RING }
    }
};
