'use strict';

// ===============================================================================
// SKILL BUFFS & DEBUFFS DATABASE
//
// Each skill entry contains:
//   - name, icon, id, class, category, usageCost, castTime, cooldown, description
//     (for the info popup — same format as aion-calc)
//   - type: 'buff' | 'debuff'  (buff = adds stats, debuff = reduces enemy stats)
//   - value: short display text shown on the buff item
//   - stats: { statKey: amount }  — flat stat additions applied to the profile
//
// Stats keys match STAT_KEYS from constants.js:
//   hp, attack, accuracy, crit, critDmg, healingBoost, pvpAttack, pveAttack,
//   physicalDef, strikeFortitude, evasion, increasedRegen, magicalDef,
//   spellFortitude, magicResist, block, parry, pvpDefense, pveDefense, dp
//
// ===============================================================================

var GC_SKILL_DATABASE = {
    // -- Universal buffs (shown for ALL classes) --
    'ascensionJamPvP': {
        name: 'Ascension Jam (PvP)',
        icon: '../assets/icons/icon_cash_item_2stenchant_attackdelay.png',
        id: '160020034',
        class: '-',
        category: 'Item buff',
        usageCost: '-',
        castTime: 'Cast Instantly',
        cooldown: '10m',
        description: 'Increases additional PvP attack by 500, additional PvP defence by 1000 and HP by 10000 for 60 minutes.<br>The effect remains even after death.'
    },
    'ascensionJamPvE': {
        name: 'Ascension Jam (PvE)',
        icon: '../assets/icons/icon_cash_item_2stenchant_boostcastingtime.png',
        id: '160020035',
        class: '-',
        category: 'Item buff',
        usageCost: '-',
        castTime: 'Cast Instantly',
        cooldown: '10m',
        description: 'Increases additional PvE attack by 500, additional PvE defence by 1000 and HP by 10000 for 60 minutes.<br>The effect remains even after death.'
    },
    'lunaBuff': {
        name: 'Lunamonerk Cheer',
        icon: '../assets/icons/icon_item_lunabox_01.png',
        id: '-',
        class: '-',
        category: 'Instance Buff',
        usageCost: '-',
        castTime: 'Cast Instantly',
        cooldown: '1s',
        description: `Your abilities will be enhanced by the Lunamonerk Cheer. 
        The effect vanishes as soon as you leave the instance.<br>(will reapply if you rejoin the same opened instance)<br><br>
        HP +5000<br>
        Healing boost +240<br>
        Attack +380<br>
        Physical Defence +380<br>
        Magical Defence +380<br>
        Crit +1000<br>
        Accuracy +1100<br>
        Block +1100<br>
        Parry +1100<br>
        Evasion +1100<br>
        Magic Resist +1100`
    },
    'leiboJam': {
        name: 'Leibo Jam - Special Boost Buff',
        icon: '../assets/icons/icon_item_coin_lugbug_request_01.png',
        id: '164010045',
        class: '-',
        category: 'Item buff',
        usageCost: '-',
        castTime: 'Cast Instantly',
        cooldown: '30s',
        description: 'The Bonus PvE Attack and Bonus PvE Defence is increased by 150 points for 30m.'
    },
    'no1inAion': {
        name: 'No. 1 in Aion',
        icon: '../assets/icons/reward-title.png',
        id: '268',
        class: '-',
        category: 'Title',
        usageCost: '-',
        castTime: '-',
        cooldown: '-',
        description: 'HP +500<br>Speed +5%<br>Atk. Speed +3%<br>Casting Speed +3%<br>'
    },
    'conqAphsa': {
        name: 'Conqueror of Aphsaranta',
        icon: '../assets/icons/reward-title.png',
        id: '646',
        class: '-',
        category: 'Title',
        usageCost: '-',
        castTime: '-',
        cooldown: '-',
        description: 'Speed +%<br>Atk. Speed +4%<br>Casting Speed +4%<br>HP +8000'
    },
    'daevaConqueror': {
        name: 'Daeva Conqueror',
        icon: '../assets/icons/reward-title.png',
        id: '660',
        class: '-',
        category: 'Title',
        usageCost: '-',
        castTime: '-',
        cooldown: '-',
        description: 'Speed +6%<br>Atk. Speed +4%<br>Casting Speed +4%<br>Add. PvP Atk. +400<>br>Add. PvE Atk. +400<br>HP +6000'
    },
    'conqTorm': {
        name: 'Conqueror of Torment',
        icon: '../assets/icons/reward-title.png',
        id: '381',
        class: '-',
        category: 'Title',
        usageCost: '-',
        castTime: '-',
        cooldown: '-',
        description: 'Attack +19.'
    },
    'roastChicken': {
        name: 'Roast Chicken',
        icon: '../assets/icons/icon_item_dish14.png',
        id: '160020085',
        class: '-',
        category: 'Food',
        usageCost: '-',
        castTime: 'Cast Instantly',
        cooldown: '5s',
        description: 'HP is increased by 2000 points, MP by 1000 points, Physical Attack by 150 points and Magic Attack by 150 points for 10m.'
    },
    'suspiciousSteak': {
        name: 'Suspicious Steak',
        icon: '../assets/icons/icon_item_dish08.png',
        id: '160020074',
        class: '-',
        category: 'Food',
        usageCost: '-',
        castTime: 'Cast Instantly',
        cooldown: '5s',
        description: 'Increases Crit Strike by 550 points, Crit Spell by 550 points and HP by 2000 points for 30m.'
    },
    'poscaParty': {
        name: 'Posca Party Cake',
        icon: '../assets/icons/icon_item_housing_birthcake_001.png',
        id: '160020089',
        class: '-',
        category: 'Food',
        usageCost: '-',
        castTime: 'Cast Instantly',
        cooldown: '5s',
        description: 'A cake celebrating honoured Daevas.<br>HP is increased by 2300 points, MP by 1000 points, Physical Attack by 180 points and Magic Attack by 180 points for 10m.'
    },

    // -- Universal buffs for physical classes --
    'magicIncitement': {
        name: '(Improved) Magic of Incitement',
        icon: '../assets/icons/ch_a_physicalenhancement_g1.png',
        id: '6153',
        class: 'Chanter',
        category: 'Vision Stigma',
        usageCost: '561 MP',
        castTime: 'Cast Instantly',
        cooldown: '42s',
        description: 'Increases Crit Strike of group members by 800 for 5m.<br>Increases Accuracy by 800.<br>Increases Physical Attack by 600.'
    },
    'invincibilityMantra': {
        name: 'Invincibility Mantra',
        icon: '../assets/icons/live_ch_chant_invincible_g1.png',
        id: '4642',
        class: 'Chanter',
        category: 'Active - Mantra',
        usageCost: '0 MP',
        castTime: 'Cast Instantly',
        cooldown: '0s',
        description: 'Restores 302 MP.<br>Increases Physical Defence by 180.<br>Increases Block by 250.<br>Increases Parry by 250.<br>Increases Evasion by 120.<br>Active Skill.'
    },
    'shieldMantra': {
        name: 'Shield Mantra',
        icon: '../assets/icons/cbt_ch_chant_improveddefend_g1.png',
        id: '1657',
        class: 'Chanter',
        category: 'Active - Mantra',
        usageCost: '0 MP',
        castTime: 'Cast Instantly',
        cooldown: '0s',
        description: 'Restores 302 MP.<br>Increases Physical Attack by 180.<br>Increases Physical Defence by 250.<br>Active Skill.'
    },
    'wallProtection': {
        name: '(Improved) Wall of Protection',
        icon: '../assets/icons/cbt_el_a_order_elementalfield_g1.png',
        id: '22065',
        class: 'Spiritmaster',
        category: 'Normal Stigma',
        usageCost: '370 MP',
        castTime: '0.8s',
        cooldown: '43.2s',
        description: 'Usage - Command: Fire Wall of Protection.<br>Fire Reflects 100 damage for 1min.<br>Increases Physical Attack by 360.'
    },
    'magicIncitement': {
        name: '(Improved) Magic of Incitement',
        icon: '../assets/icons/ch_a_physicalenhancement_g1.png',
        id: '6153',
        class: 'Chanter',
        category: 'Vision Stigma',
        usageCost: '561 MP',
        castTime: 'Cast Instantly',
        cooldown: '42s',
        description: 'Increases Crit Strike of group members by 800 for 5m.<br>Increases Accuracy by 800.<br>Increases Physical Attack by 600.'
    },

    // -- Gladiator --
    'attackPosition': {
        name: '(Improved) Attack Position',
        icon: '../assets/icons/fi_berserkstance_custom_b_up.png',
        id: '5723',
        class: 'Gladiator',
        category: 'Active',
        usageCost: '0 MP',
        castTime: 'Cast Instantly',
        cooldown: '2m',
        description: 'Increases Physical Attack by 1800 for 1m.<br>Increases Speed by 10%.<br>Increases Attack Speed by 10%.<br>Increases Accuracy by 1200.<br>Increases Crit Strike by 1200.'
    },
    'combatPrep': {
        name: 'Combat Preparation',
        icon: '../assets/icons/cbt_fi_blademode_g1.png',
        id: '697',
        class: 'Gladiator',
        category: 'Active',
        usageCost: '0 MP',
        castTime: 'Cast Instantly',
        cooldown: '7s',
        description: 'Increases Physical Attack by 800.<br>Increases Additional PvP Attack by 800.<br>Reduces Additional PvP Defence by 600.<br>Active Skill.'
    },
    'defencePrep': {
        name: 'Defence Preparation',
        icon: '../assets/icons/cbt_fi_defensemode_g1.png',
        id: '619',
        class: 'Gladiator',
        category: 'Active',
        usageCost: '0 MP',
        castTime: 'Cast Instantly',
        cooldown: '7s',
        description: 'Increases Magic and Physical Defence by 800.<br>Increases Additional PvP Defence by 800.<br>Reduces Additional PvP Attack by 600.<br>Active Skill.'
    },

    // -- Templar --
    'divineFury': {
        name: '(Improved) Divine Fury',
        icon: '../assets/icons/cbt_kn_a_divinepower_g1.png',
        id: '6055',
        class: 'Templar',
        category: 'Active',
        usageCost: '144 MP',
        castTime: 'Cast Instantly',
        cooldown: '48s',
        description: 'Increases Physical Attack by 550 for 30s.'
    },
    'empyreanFury': {
        name: 'Empyrean Fury',
        icon: '../assets/icons/live_kn_destructwish_g1.png',
        id: '2933',
        class: 'Templar',
        category: 'Active',
        usageCost: '1000 DP',
        castTime: 'Cast Instantly',
        cooldown: '1m30s',
        description: 'Increases Physical Attack by 900 for 30s.<br>Increases Crit Strike by 1000.<br>Increases Accuracy by 1000.<br>Increases Magical Accuracy by 1000.'
    },
    'menacingPosture': {
        name: 'Menacing Posture',
        icon: '../assets/icons/cbt_fi_defensemode_g1.png',
        id: '3048',
        class: 'Templar',
        category: 'Active',
        usageCost: '0 MP',
        castTime: 'Cast Instantly',
        cooldown: '5s',
        description: 'The Enmity caused by your attack is increased.<br>Increases Additional PvE Defence by 2500.<br>Increases Additional PvE Attack by 1500.<br>Reduces Physical Attack by 1000.<br>Active Skill.'
    },

    // -- Assassin --
    'deadlyFocus': {
        name: 'Deadly Focus',
        icon: '../assets/icons/live_as_raidstance_g1.png',
        id: '3469',
        class: 'Assassin',
        category: 'Active',
        usageCost: '1018 MP',
        castTime: 'Cast Instantly',
        cooldown: '2m',
        description: 'Increases Physical Attack by 2000 for 15s.<br>Increases Accuracy by 200.<br>Increases Magical Accuracy by 200.'
    },

    // -- Ranger --
    'bowOfBlessing': {
        name: '(Improved) Bow of Blessing',
        icon: '../assets/icons/live_ra_a_enchantbow_g1.png',
        id: '6103',
        class: 'Ranger',
        category: 'Normal Stigma',
        usageCost: '216 MP',
        castTime: 'Cast Instantly',
        cooldown: '43.2s',
        description: 'Increases Physical Attack by 480 for 40s.<br>Increases Crit Strike by 1200.'
    },

    // -- Sorcerer --
    'boonFlame': {
        name: '(Improved) Boon of Flame',
        icon: '../assets/icons/wi_a_fireshield_g1.png',
        id: '6107',
        class: 'Sorcerer',
        category: 'Vision Stigma',
        usageCost: '0 MP',
        castTime: 'Cast Instantly',
        cooldown: '1s',
        description: 'Increases magic damage by 18% for 30s.<br>Also reduces MP consumption by 50%.<br>Increases Crit Spell by 1000.'
    },

    // -- Spiritmaster --
    'spiritBundle': {
        name: '(Improved) Spirit Bundling',
        icon: '../assets/icons/el_a_soulking_g1.png',
        id: '6129',
        class: 'Spiritmaster',
        category: 'Vision Stigma',
        usageCost: '1199 MP',
        castTime: 'Cast Instantly',
        cooldown: '1m12s',
        description: 'Increases Magical Accuracy by 1000 for 3m.<br>Increases Magic Attack by 1000.<br>Increases Crit Spell by 500.<br>Increases HP by 12000.'
    },

    // -- Cleric --
    'sacrificialPower': {
        name: '(Improved) Sacrificial Power',
        icon: '../assets/icons/live_pr_a_offensivemode_g1.png',
        id: '6178',
        class: 'Cleric',
        category: 'Greater Stigma',
        usageCost: '0 MP',
        castTime: 'Cast Instantly',
        cooldown: '30s',
        description: 'Increases Magical Accuracy by 1800.<br>Increases Additional PvE Attack by 600.<br>Increases Magic Attack by 1600.<br>Increases Crit Spell by 1250.<br>Reduces Healing Boost by 1500.<br>Active Skill.'
    },

    // -- Chanter --
    'blessingWind': {
        name: '(Improved) Blessing of Wind',
        icon: '../assets/icons/live_ch_a_imbuepower_g1.png',
        id: '6157',
        class: 'Chanter',
        category: 'Greater Stigma',
        usageCost: '857 MP',
        castTime: 'Cast Instantly',
        cooldown: '1m3s',
        description: 'Increases Physical Attack by 800 for 30s.<br>Also deals 2619 additional damage for each attack.'
    },

    // -- Aethertech --
    'combatPowerMax': {
        name: 'Combat Power Maximisation',
        icon: '../assets/icons/ri_poweroverdrive_g1.png',
        id: '4794',
        class: 'Aethertech',
        category: 'Active',
        usageCost: '2% MP every 4 seconds',
        castTime: 'Cast Instantly',
        cooldown: '30s',
        description: 'Increases Magic Attack by 800 for a maximum of 30s.<br>Increases Additional PvP Attack by 550.<br>Increases Attack Speed by 10%.<br>Active Skill.'
    },

    // -- Gunner --
    'focusedMagic': {
        name: '(Improved) Focused Magic',
        icon: '../assets/icons/gu_magicalstrength_custom_b_up.png',
        id: '6016',
        class: 'Gunner',
        category: 'Active',
        usageCost: '3000 DP',
        castTime: 'Cast Instantly',
        cooldown: '2m',
        description: 'Increases Magic Attack by 1200 for 15s.<br>Increases Attack Speed by 15%.'
    },

    // -- Bard --
    'magicBoostMode': {
        name: '(Improved) Magic Boost Mode',
        icon: '../assets/icons/live_ba_a_playingstyleschangeb_g1.png',
        id: '6237',
        class: 'Bard',
        category: 'Greater Stigma',
        usageCost: '0 MP',
        castTime: 'Cast Instantly',
        cooldown: '30s',
        description: 'Increases Magic Attack by 1150.<br>Increases Magical Accuracy by 2800.<br>Reduces Healing Boost by 800.<br>Active Skill.'
    },

    // -- Painter --
    'precisionColourBoost': {
        name: '(Improved) Precision Colour Boost',
        icon: '../assets/icons/pa_paintshower_custom_a_up.png',
        id: '6007',
        class: 'Painter',
        category: 'Active',
        usageCost: '3000 DP',
        castTime: 'Cast Instantly',
        cooldown: '2m',
        description: 'Increases Physical Attack by 700 for 30s.<br>Increases Attack Speed by 30%.<br>Increases Crit Strike by 2000.<br>Increases Accuracy by 1000.'
    }
};

// ===============================================================================
// SKILL BUFF DEFINITIONS PER CLASS
// ===============================================================================

var GC_SKILL_BUFFS = {
    // Universal buffs: shown for every class
    universal: [
        { key: 'ascensionJamPvE',  value: '+500 PvE Atk / +1000 PvE Def / +10000 HP', stats: { pveAttack: 500, pveDefense: 1000, hp: 10000 }, defaultActive: false, excludes: ['ascensionJamPvP']  },
        { key: 'ascensionJamPvP',  value: '+500 PvP Atk / +1000 PvP Def / +10000 HP', stats: { pvpAttack: 500, pvpDefense: 1000, hp: 10000 }, defaultActive: false, excludes: ['ascensionJamPvE'] },
        { key: 'lunaBuff',         value: '+380 Atk / +1000 Crit / +5000 HP and more', stats: { hp: 5000, healingBoost: 240, attack: 380, physicalDef: 380, magicalDef: 380, crit: 1000, accuracy: 1100, block: 1100, parry: 1100, evasion: 1100, magicResist:1100 }, defaultActive: false },
        { key: 'leiboJam',  value: '+150 PvE Atk / +150 PvE Def', stats: { pveAttack: 150, pveDefense: 150 }, defaultActive: false },
        { key: 'daevaConqueror',  value: '+400 PvE Atk / +400 PvP Atk / +6000 HP', stats: { pveAttack: 400, pvpAttack: 400, hp: 6000 }, defaultActive: false, excludes: ['conqAphsa', 'no1inAion'] },
        { key: 'conqAphsa',  value: '+8000 HP', stats: { hp: 8000 }, defaultActive: false, excludes: ['daevaConqueror', 'no1inAion', 'conqTorm'] },
        { key: 'no1inAion',  value: '+500 HP', stats: { hp: 500 }, defaultActive: true, excludes: ['daevaConqueror', 'conqAphsa', 'conqTorm'] },
        { key: 'conqTorm',  value: '+19 Atk', stats: { attack: 19 }, defaultActive: false, excludes: ['daevaConqueror', 'conqAphsa', 'no1inAion'] },
        { key: 'roastChicken',  value: '+150 Atk / +2000 HP', stats: { attack: 150, hp: 2000 }, defaultActive: false, excludes: ['suspiciousSteak', 'poscaParty'] },
        { key: 'suspiciousSteak',  value: '+550 Crit / +2000 HP', stats: { crit: 550, hp: 2000 }, defaultActive: true, excludes: ['roastChicken', 'poscaParty'] },
        { key: 'poscaParty',  value: '+180 Atk / +2300 HP', stats: { attack: 180, hp: 2300 }, defaultActive: false, excludes: ['roastChicken', 'suspiciousSteak'] },
    ],

    // Universal buffs shown only to PHYSICAL classes (gladiator, templar, assassin, ranger, chanter)
    // TODO: invincibility mantra, wall of protection, magic of incitement, wind harmony
    universal_phys: [
        { key: 'magicIncitement',  value: '+800 Crit, Acc / +600 Attack', stats: { attack: 600, crit: 800, accuracy: 800 }, defaultActive: false, },
        { key: 'invincibilityMantra',  value: '+180 Atk / +250 PDef', stats: { attack: 180, physicalDef: 250 }, defaultActive: false, },
        { key: 'shieldMantra',  value: '+180 PDef, Block, Parry / +120 Evasion', stats: { physicalDef: 180, block: 180, parry: 180, evasion: 120 }, defaultActive: false, },
        { key: 'wallProtection',  value: '+360 Attack', stats: { attack: 360 }, defaultActive: false, },
        { key: 'windHarmony',  value: '+121 Attack', stats: { attack: 121 }, defaultActive: false, },
    ],

    // Universal buffs shown only to MAGICAL classes (sorcerer, spiritmaster, cleric, aethertech, gunner, bard, painter)
    // TODO: hmm, we do not have stats boost for magical only, we keep it empty for now.
    universal_mag: [],

    // One dummy skill per class — populate the rest later
    // Increases Physical Attack by 800.<br>Increases Additional PvP Attack by 800.<br>Reduces Additional PvP Defence by 600.<br>Active Skill.'
    gladiator: [
        { key: 'combatPrep',    value: '+800 Attack / +800 PvP Atk / -600 PvP Def', stats: { attack: 800, pvpAttack: 800, pvpDefense: -600 },  defaultActive: true, excludes: ['defencePrep'] },
        { key: 'defencePrep',    value: '+800 Defs / +800 PvP def / -600 PvP Atk', stats: { defense: 800, pvpDefense: 800, pvpAttack: -600 },  defaultActive: false, excludes: ['combatPrep'] },
        { key: 'attackPosition', value: '+1800 Atk / +1200 Acc / +1200 Crit', stats: { attack: 1800, accuracy: 1200, crit: 1200 },  defaultActive: false },
    ],
    templar: [
        { key: 'divineFury', value: '+550 Attack', stats: { attack: 550 }, defaultActive: false },
        { key: 'empyreanFury', value: '+900 Atk / +1000 Acc / +1000 Crit', stats: { attack: 900, accuracy: 1000, crit: 1000 }, defaultActive: false },
        { key: 'menacingPosture', value: '+1500 PvE Atk / +2500 PvE Def / -1000 Atk', stats: { pveAttack: 1500, pveDefense: 2500, attack: -1000 }, defaultActive: true },
    ],
    assassin: [
        { key: 'deadlyFocus', value: '+2000 Atk / +200 Acc', stats: { attack: 2000, accuracy: 200 }, defaultActive: false },
    ],
    ranger: [
        { key: 'bowOfBlessing', value: '+480 Atk / +1200 Crit', stats: { attack: 480, crit: 1200 }, defaultActive: false },
    ],
    sorcerer: [
        { key: 'boonFlame', value: '+1000 Crit', stats: { crit: 1000 }, defaultActive: false },
    ],
    spiritmaster: [
        { key: 'spiritBundle', value: '+1000 Atk / +1000 Acc / +500 Crit / +12000 HP', stats: { attack: 1000, accuracy: 1000, crit: 500, hp: 12000 }, defaultActive: false },
    ],
    cleric: [
        { key: 'sacrificialPower', value: '+1600 Atk / +1800 Acc / +1250 Crit / +600 PvE Atk / -1500 Heal', stats: { attack: 1600, accuracy: 1800, crit: 1250, pveAttack: 600, healingBoost: -1500 }, defaultActive: false },
    ],
    chanter: [
        { key: 'blessingWind', value: '+800 Attack', stats: { attack: 800 }, defaultActive: false },
    ],
    aethertech: [
        { key: 'combatPowerMax', value: '+800 Atk / +550 PvP Atk', stats: { attack: 800, pvpAttack: 550 }, defaultActive: false },
    ],
    gunner: [
        { key: 'focusedMagic', value: '+1200 Attack', stats: { attack: 1200 }, defaultActive: false },
    ],
    bard: [
        { key: 'magicBoostMode', value: '+1150 Atk / +2800 Acc / -800 Heal', stats: { attack: 1150, accuracy: 2800, healingBoost: -800 }, defaultActive: false },
    ],
    painter: [
        { key: 'precisionColourBoost', value: '+700 Atk / +2000 Crit / +1000 Acc', stats: { attack: 700, crit: 2000, accuracy: 1000 }, defaultActive: false },
    ]
};

// Build flat ordered list of all unique skill keys (for share encoding)
// Order: universal first, then by CLASS_ORDER
var GC_SKILL_KEYS = (function() {
    var keys = [];
    var seen = {};
    function add(arr) {
        arr.forEach(function(s) {
            if (!seen[s.key]) { keys.push(s.key); seen[s.key] = true; }
        });
    }
    add(GC_SKILL_BUFFS.universal);
    add(GC_SKILL_BUFFS.universal_phys);
    add(GC_SKILL_BUFFS.universal_mag);
    CLASS_ORDER.forEach(function(cls) {
        if (GC_SKILL_BUFFS[cls]) add(GC_SKILL_BUFFS[cls]);
    });
    return keys;
})();

// Helper: get all skill entries relevant for a class (universal + class-specific)
function getSkillBuffsForClass(className) {
    var list = GC_SKILL_BUFFS.universal.slice();
    if (isPhysicalClass(className)) {
        list = list.concat(GC_SKILL_BUFFS.universal_phys);
    } else {
        list = list.concat(GC_SKILL_BUFFS.universal_mag);
    }
    if (GC_SKILL_BUFFS[className]) {
        list = list.concat(GC_SKILL_BUFFS[className]);
    }
    return list;
}
