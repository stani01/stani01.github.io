'use strict';

// ===============================================================================
// SKILL BUFFS & DEBUFFS DATABASE
//
// Each skill entry contains:
//   - name, icon, id, class, category, usageCost, castTime, cooldown, description
//     (for the info popup - same format as aion-calc)
//   - type: 'buff' | 'debuff'  (buff = adds stats, debuff = reduces enemy stats)
//   - value: short display text shown on the buff item
//   - stats: { statKey: amount }  - flat stat additions applied to the profile
//
// Stats keys match STAT_KEYS from constants.js:
//   hp, attack, accuracy, crit, critDmg, healingBoost, pvpAttack, pveAttack,
//   physicalDef, strikeFortitude, evasion, increasedRegen, magicalDef,
//   spellFortitude, magicResist, block, parry, pvpDefence, pveDefence, dp
//
// Enchantable skills: some skills scale with enchant level.
// Add an 'enchant' property to the buff definition:
//   enchant: { stat: 'attack', perLevel: 10, maxLevel: 26, defaultLevel: 20 }
// The stat value in 'stats' is the *base* at +0. The enchant bonus is added on top.
// Available enchant breakpoints (matching aion-calc):
var SKILL_ENCHANT_LEVELS = [0, 10, 12, 14, 17, 20, 26];
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
        description: 'HP +500<br>Speed +5%<br>Attack Speed +3%<br>Casting Speed +3%<br>'
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
        description: 'Speed +%<br>Attack Speed +4%<br>Casting Speed +4%<br>HP +8000'
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
        description: 'Speed +6%<br>Attack Speed +4%<br>Casting Speed +4%<br>Add. PvP Attack +400<>br>Add. PvE Attack +400<br>HP +6000'
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
    'fireDragon': {
        name: 'Draconic: Will of the Red Flame',
        icon: '../assets/icons/all_trans_dragon_buff_fire.png',
        id: '-',
        class: '-',
        category: 'Party Buff',
        usageCost: '-',
        castTime: 'Cast Instantly',
        cooldown: '0s',
        description: `Increases Physical Attack of group members by 500 for 30 min.<br>
                      Increases Magic Attack by 500.<br>
                      Increases Evasion by 400.<br>
                      Increases Magic Resist by 400.<br>
                      Increases HP by 2400.`
    },
    'darkDragon': {
        name: 'Verb: Shadow\'s Will',
        icon: '../assets/icons/all_trans_dragon_buff_dark.png',
        id: '-',
        class: '-',
        category: 'Party Buff',
        usageCost: '-',
        castTime: 'Cast Instantly',
        cooldown: '0s',
        description: `Increases Physical Attack of group members by 700 for 30 min.<br>
                      Increases Magic Attack by 700.<br>
                      Increases Evasion by 200.<br>
                      Increases Magic Resist by 200.<br>
                      Increases HP by 1200.`
    },
    'divineProtectionUniversal': {
        name: '(Improved) Divine Protection',
        icon: '../assets/icons/all_heaven_blessing_g2.png',
        id: '5869',
        class: '-',
        category: 'Magical Heal',
        usageCost: '20% HP',
        castTime: 'Cast Instantly',
        cooldown: '5m',
        description: 'Restores 10% of your HP and MP every 2s for 10s.<br>Your crit strike and crit spell are also increased by 5,000'
    },
    'vaizelCall': {
        name: 'Vaizel\'s Call',
        icon: '../assets/icons/icon_buff_lf_godstadisman_01.png',
        id: '-',
        class: '-',
        category: 'Magical Buff',
        usageCost: '-',
        castTime: 'Cast Instantly',
        cooldown: '5m',
        description: 'Increases Physical Attack and Magic Attack by 800, Physical Defence and Magic Defence by 400, and Evasion by 120 for 40s.'
    },
    'blessedLight': {
        name: 'Blessed Light',
        icon: '../assets/icons/cbt_npc_d_pr_immortalblessing_g1.png',
        id: '-',
        class: '-',
        category: 'Magical Buff',
        usageCost: '-',
        castTime: 'Cast Instantly',
        cooldown: '5m',
        description: `Increases Physical Attack by 500 for 10s.<br>
                      Increases Magic Attack by 500.`
    },
    'joltingStrike': {
        name: '[Evolution] Repeated Jolting Strike (Level 1)',
        icon: '../assets/icons/cros_buff_g1.png',
        id: '-',
        class: '-',
        category: 'Magical Buff',
        usageCost: '-',
        castTime: 'Cast Instantly',
        cooldown: '5m',
        description: `Increases Add. PvP Atk. by 600 for 15s.<br>
                      Increases Add. PvE Atk. by 600.<br>
                      Group members receive 50% of the effect.`
    },
    'soulWave': {
        name: '[Evolution] Soul Wave (Level 1)',
        icon: '../assets/icons/shis_buff_g1.png',
        id: '-',
        class: '-',
        category: 'Magical Buff',
        usageCost: '-',
        castTime: 'Cast Instantly',
        cooldown: '5m',
        description: `Increases Add. PvP Atk. by 600 for 15s.<br>
                      Increases Add. PvE Atk. by 600.<br>
                      Group members receive 50% of the effect.`
    },
    'blessingOfStone': {
        name: '[Improved] Blessing of Stone',
        icon: '../assets/icons/live_ch_a_blessprotect_g1.png',
        id: '6156',
        class: 'Chanter',
        category: 'Magical Buff',
        usageCost: '181 MP',
        castTime: 'Cast Instantly',
        cooldown: '0s',
        description: `Increases The target's HP by 25% for 30m.<br>
                      Increases Physical Defence by 350.<br>
                      Increases Magic Defence by 350.`
    },
    'prayerOfProtection': {
        name: 'Prayer of Protection',
        icon: '../assets/icons/cbt_cl_blessofhealth_g1.png',
        id: '1689',
        class: 'Chanter',
        category: 'Magical Buff',
        usageCost: '102 MP',
        castTime: 'Cast Instantly',
        cooldown: '0s',
        description: `Increases The target's HP by 15% for 60m.<br>
                      Increases Physical Defence by 200.<br>
                      Increases Magic Defence by 200.`
    },
    'blessingOfRock': {
        name: 'Blessing of Rock',
        icon: '../assets/icons/cbt_cl_blessofrock_g1.png',
        id: '1684',
        class: 'Cleric',
        category: 'Magical Buff',
        usageCost: '34 MP',
        castTime: 'Cast Instantly',
        cooldown: '0s',
        description: `Increases The target's HP by 10% for 60m.<br>
                      Increases Physical Defence by 150.<br>
                      Increases Magic Defence by 150.`
    },
    'melodyOfLife': {
        name: 'Melody of Life',
        icon: '../assets/icons/live_ba_songofstamina_g1.png',
        id: '4449',
        class: 'Bard',
        category: 'Magical Buff',
        usageCost: '289 MP',
        castTime: 'Cast Instantly',
        cooldown: '0s',
        description: `Increases The target's HP by 15% for 60m.<br>
                      Increases Physical Defence by 500.`
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
        id: '1666',
        class: 'Chanter',
        category: 'Active - Mantra',
        usageCost: '0 MP',
        castTime: 'Cast Instantly',
        cooldown: '0s',
        description: 'Increases Physical Defence by 250.<br>Increases Block by 500.<br>Increases Parry by 500.<br>Increases Evasion by 450.<br>Active Skill.'
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
    'devotion': {
        name: 'Devotion',
        icon: '../assets/icons/cbt_sc_invokepower_g1.png',
        id: '3235',
        class: 'Assassin+Ranger',
        category: 'Active',
        usageCost: '144 MP',
        castTime: 'Cast Instantly',
        cooldown: '28s',
        description: 'Increases Physical Attack by 450 (+10 per enchantment) for 10s.<br>Increases Weapon Attack by 1500.'
    },
    'deadlyAbandon': {
        name: '(Improved) Deadly Abandon',
        icon: '../assets/icons/live_as_a_stabstance_g1.png',
        id: '6074',
        class: 'Assassin',
        category: 'Normal Stigma',
        usageCost: '0 MP',
        castTime: 'Cast Instantly',
        cooldown: '10s',
        description: 'Increases Physical Attack by 350.<br>Reduces Evasion by 800.<br>Active Skill.'
    },
    'flurry': {
        name: 'Flurry',
        icon: '../assets/icons/cbt_as_quickmove_g1.png',
        id: '3355',
        class: 'Assassin',
        category: 'Active',
        usageCost: '193 MP',
        castTime: 'Cast Instantly',
        cooldown: '2m',
        description: 'Increases Attack Speed by 20% for 30s.<br>Increases Crit Strike by 1500.<br>Increases Weapon Attack by 1500.'
    },
    'mistButcher': {
        name: 'Mist Butcher',
        icon: '../assets/icons/live_as_light_defendroar_g1.png',
        id: '4878',
        class: 'Assassin',
        category: 'Active',
        usageCost: '183 MP',
        castTime: 'Cast Instantly',
        cooldown: '2m',
        description: 'Increases Attack Speed by 20% for 1m.<br>Increases Magical Accuracy by 2000.<br>Increases HP by 5000.<br>Increases MP regeneration.<br>Increases your weapon range by 2m.<br>Increases Physical Attack skills 1 time by 100% for 15 seconds.'
    },
    'eyeOfWrath': {
        name: '(Improved) Eye of Wrath',
        icon: '../assets/icons/cbt_as_a_visiouseye_g1.png',
        id: '6079',
        class: 'Assassin',
        category: 'Normal Stigma',
        usageCost: '99 MP',
        castTime: 'Cast Instantly',
        cooldown: '37.8s',
        description: 'Boosts the effect of Physical Attack skill by 60% 2 times for 15s.<br>Reduces Crit Strike by 700.'
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
    'strengtheningEye': {
        name: 'Strengthening Eye',
        icon: '../assets/icons/cbt_ra_snakeeye_g1.png',
        id: '796',
        class: 'Ranger',
        category: 'Active',
        usageCost: '163 MP',
        castTime: 'Cast Instantly',
        cooldown: '1s',
        description: 'Increases Physical Attack by 200 for 1m.'
    },
    'mauGlory': {
        name: '(Improved) Mau\'s Glory',
        icon: '../assets/icons/ev_ra_sabageroar_custom_b_up.png',
        id: '5984',
        class: 'Ranger',
        category: 'Active',
        usageCost: '1000 DP every 3s',
        castTime: 'Cast Instantly',
        cooldown: '30s',
        description: 'Removes immobilisation.<br>You are immobilised and cannot cause immobilisation.<br>Increases Physical Attack by 4000.<br>Increases Crit Strike by 4000.<br>Increases Resistance to Pull by 1000.<br>Reduces Attack range of Bow by 5m.<br>1000 DP are used every 3 seconds.<br>Active Skill.'
    },
    'mauHonour': {
        name: '(Improved) Mau\'s Honour',
        icon: '../assets/icons/ev_ra_sabageroar_custom_a_up.png',
        id: '5983',
        class: 'Ranger',
        category: 'Active',
        usageCost: '500 DP every 3s',
        castTime: 'Cast Instantly',
        cooldown: '8s',
        description: 'Increases Physical Attack by 800.<br>Incrases Accuracy by 2000.<br>Increases Evasion by 800.<br>Increases Attack Speed by 30%.<br>Increases Speed by 40%.<br>500 DP are used every 3 seconds.<br>Active Skill.'
    },
    'sharpenArrows': {
        name: '(Improved) Sharpen Arrows',
        icon: '../assets/icons/live_ra_a_trackermind_g1.png',
        id: '6093',
        class: 'Ranger',
        category: 'Greater Stigma',
        usageCost: '99 MP',
        castTime: 'Cast Instantly',
        cooldown: '1s',
        description: 'Increases Physical Attack of Bow by 500.<br>Increases Crit Strike by 650.<br>Increases Additional PvE Attack by 650.<br>Active Skill.'
    },
    'focusedShots': {
        name: '(Improved) Focused Shots',
        icon: '../assets/icons/cbt_sc_a_trueshotmind_g1.png',
        id: '6094',
        class: 'Ranger',
        category: 'Normal Stigma',
        usageCost: '342 MP',
        castTime: 'Cast Instantly',
        cooldown: '1s',
        description: 'Increases the effect of Physical Attack Skill by 33% 5 times for 1m.<br>Increases Accuracy by 2600.<br>Increases Magical Accuracy by 2600.<br>Reduces Physical Defence by 6%.'
    },

    // -- Sorcerer --
    'vaizelGift': {
        name: 'Vaizel Gift',
        icon: '../assets/icons/cbt_wi_arcaneboost_g1.png',
        id: '5155',
        class: 'Sorcerer',
        category: 'Active',
        usageCost: '481 MP',
        castTime: 'Cast Instantly',
        cooldown: '30s',
        description: 'Increases the target\'s casting time for all magical skills by 25% for 20s.<br>Also reduces MP consumption by 20%.<br>Increases Additional PvE Attack by 500 (+10 per enchant level).'
    },
    'arcaneCombustion': {
        name: '(Improved) Arcane Combustion',
        icon: '../assets/icons/wi_manaboost_custom_b_up.png',
        id: '5781',
        class: 'Sorcerer',
        category: 'Active',
        usageCost: '1060 MP',
        castTime: 'Cast Instantly',
        cooldown: '2m',
        description: 'Reduces spell casting time by 30% for 1m.<br>Increases Magic Attack by 700.<br>Increases Magical Accuracy by 4500.<br>During an attack, there is a chance that the cooldowns for some skills will be reduced by 7%.<br>(Hell Flame of Wrath, Glacial Shard, Cyclone Strike, Flame Spray).'
    },
    'arcaneGrowth': {
        name: '(Improved) Arcane Growth',
        icon: '../assets/icons/wi_manaboost_custom_a_up.png',
        id: '5780',
        class: 'Sorcerer',
        category: 'Active',
        usageCost: '1060 MP',
        castTime: 'Cast Instantly',
        cooldown: '1m12s',
        description: 'Reduces spell casting time by 10% for 30s.<br>Increases Magic Attack by 1500.<br>Increases Crit Spell by 1500.<br>When attacked, there is a chance the casting time will be reduced by 50%.'
    },
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
    'amplification': {
        name: 'Amplification',
        icon: '../assets/icons/live_pr_prepareholywar_g1.png',
        id: '3895',
        class: 'Cleric',
        category: 'Active',
        usageCost: '697 MP',
        castTime: 'Cast Instantly',
        cooldown: '1m',
        description: 'Increases Magic Attack by 700 (+14 per enchant level) for 10s.<br>Increases Healing Boost by 1100.<br>Restores 5628 MP.'
    },
    'benevolence': {
        name: '(Improved) Benevolence',
        icon: '../assets/icons/live_pr_a_healershand_g1.png',
        id: '3895',
        class: 'Cleric',
        category: 'Passive',
        usageCost: '-',
        castTime: 'Cast Instantly',
        cooldown: '0s',
        description: 'Increases Healing Boost by 650.<br>Reduces Magic Attack by 1500.<br>Active Skill.'
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
    'divineProtection': {
        name: 'Divine Protection',
        icon: '../assets/icons/cbt_ch_abyssgloria_g1.png',
        id: '1638',
        class: 'Chanter',
        category: 'Active',
        usageCost: '3000 DP',
        castTime: 'Cast Instantly',
        cooldown: '2m',
        description: 'Increases Physical Attack by 2000 for 30s.<br>Increases Speed by 20%.<br>Increases Attack Speed by 20%.'
    },
    'wordInspiration': {
        name: '(Improved) Word of Inspiration',
        icon: '../assets/icons/cbt_ch_a_improvedallattack_g1.png',
        id: '6163',
        class: 'Chanter',
        category: 'Normal Stigma',
        usageCost: '504 MP',
        castTime: 'Cast Instantly',
        cooldown: '30s',
        description: 'Increases Physical Attack by 750.<br>Increases Accuracy by 600.<br>Increases Crit Strike by 600.<br>Increases Additional PvE Attack by 500.<br>Reduces Healing Boost by 1000.<br>Active Skill.'
    },

    // -- Aethertech --
    'limitlessPower': {
        name: '(Improved) Limitless Power',
        icon: '../assets/icons/ev_ri_highendoverdrive_custom_b_up.png',
        id: '6020',
        class: 'Aethertech',
        category: 'Active',
        usageCost: '1000 DP every 3s',
        castTime: 'Cast Instantly',
        cooldown: '30s',
        description: 'Removes immobilisation.<br>You are immobilised and cannot cause immobilisation.<br>Increases Attack Speed by 25%.<br>Increases Magic Attack by 5000.<br>Increases Magical Accuracy by 3000.<br>Increases Resistance to Pull by 1000.<br>Each time you attack, you have a 10% chance of stunning the target.<br>1000 DP are used every 3 seconds.<br>Active Skill.'
    },
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
    'powerIncrease': {
        name: '(Improved) Power Increase',
        icon: '../assets/icons/ri_a_overcharge_g1.png',
        id: '6258',
        class: 'Aethertech',
        category: 'Greater Stigma',
        usageCost: '399 MP',
        castTime: 'Cast Instantly',
        cooldown: '56.7s',
        description: 'Increases Attack Speed by 10% for 12s.<br>Increases Magic Attack by 900<br>Increases Additional PvP Attack by 300.'
    },
    'extremeEffort': {
        name: '(Improved) Extreme Effort',
        icon: '../assets/icons/ev_ri_highendoverdrive_custom_a_up.png',
        id: '6019',
        class: 'Aethertech',
        category: 'Active',
        usageCost: '500 DP every 3 seconds',
        castTime: 'Cast Instantly',
        cooldown: '8s',
        description: 'Increases movement and flight speed by 25%.<br>Increases Attack Speed by 25%.<br>Increases Magic Attack by 900<br>Increases Magical Accuracy by 1200.<br>500 DP are used every 3 seconds.<br>Active Skill.'
    },
    'alertDialog': {
        name: 'Alert Dialog',
        icon: '../assets/icons/ri_warningalarm_g1.png',
        id: '2848',
        class: 'Aethertech',
        category: 'Active',
        usageCost: '-',
        castTime: 'Cast Instantly',
        cooldown: '10s',
        description: 'The Enmity caused by your attack is increased..<br>Increases Add. PvE Def. by 2500.<br>Reduces Magic Attack by 200<br>Active Skill.'
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
    'magicBlessing': {
        name: '(Improved) Magic\'s Blessing',
        icon: '../assets/icons/gu_magicalstrength_custom_a_up.png',
        id: '6015',
        class: 'Gunner',
        category: 'Active',
        usageCost: '3000 DP',
        castTime: 'Cast Instantly',
        cooldown: '2m',
        description: 'Increases Magic Attack by 700 for 2m.<br>Increases Attack Speed by 15%.<br>Increases Magical Accuracy by 800.'
    },
    'enhanceMagicProjectile': {
        name: '(Improved) Enhance Magic Projectile',
        icon: '../assets/icons/live_gu_a_empowerammo_g1.png',
        id: '6206',
        class: 'Gunner',
        category: 'Greater Stigma',
        usageCost: '249 MP',
        castTime: 'Cast Instantly',
        cooldown: '21s',
        description: 'Deals additional damage with each attack for 1689 for 10s.<br>Increases Additional PvP Attack by 500.<br>Increases Additional PvE Attack by 500.'
    },
    'giftMagic': {
        name: 'Gift of Magic Power',
        icon: '../assets/icons/live_gu_a_empowermagic_g1.png',
        id: '6207',
        class: 'Gunner',
        category: 'Greater Stigma',
        usageCost: '128 MP',
        castTime: 'Cast Instantly',
        cooldown: '37.8s',
        description: 'Boosts the effect of Magical Attack Skill by 20% 6 times for 30s.'
    },

    // -- Bard --
    'cheeryMelody': {
        name: 'Cheery Melody',
        icon: '../assets/icons/ba_excitingmelody_g1.png',
        id: '4793',
        class: 'Bard',
        category: 'Active',
        usageCost: '303 MP',
        castTime: 'Cast Instantly',
        cooldown: '30s',
        description: 'Increases Attack Speed by 20% for 15s.<br>Reduces the casting time by 20%.<br>Increases Additional PvE Attack by 1000 (+20 per enchant level).<br>Reduces the MP consumption of your skills by 20%.'
    },
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
    },
    'attackColourBoost': {
        name: '(Improved) Attack Colour Boost',
        icon: '../assets/icons/pa_paintshower_custom_b_up.png',
        id: '6008',
        class: 'Painter',
        category: 'Active',
        usageCost: '3000 DP',
        castTime: 'Cast Instantly',
        cooldown: '2m',
        description: 'Increases Physical Attack by 2000 for 10s.<br>Increases Attack Speed by 30%.<br>Increases Crit Strike by 2000.'
    },
};

// ===============================================================================
// SKILL BUFF DEFINITIONS PER CLASS
// ===============================================================================

var GC_SKILL_BUFFS = {
    // Universal buffs: shown for every class
    universal: [
        { key: 'fireDragon', value: '+500 Attack / +400 Evasion, MR / +2400 HP', stats: { attack: 500, evasion: 400, magicResist: 400, hp: 2400 }, defaultActive: false, excludes: ['darkDragon'] },
        { key: 'darkDragon', value: '+700 Attack / +200 Evasion, MR / +1200 HP', stats: { attack: 700, evasion: 200, magicResist: 200, hp: 1200 }, defaultActive: false, excludes: ['fireDragon'] },
        { key: 'ascensionJamPvE', value: '+500 PvE Attack / +1000 PvE Def / +10000 HP', stats: { pveAttack: 500, pveDefence: 1000, hp: 10000 }, defaultActive: false, excludes: ['ascensionJamPvP']  },
        { key: 'ascensionJamPvP', value: '+500 PvP Attack / +1000 PvP Def / +10000 HP', stats: { pvpAttack: 500, pvpDefence: 1000, hp: 10000 }, defaultActive: false, excludes: ['ascensionJamPvE'] },
        { key: 'lunaBuff', value: '+380 Attack / +1000 Crit / +5000 HP and more', stats: { hp: 5000, healingBoost: 240, attack: 380, physicalDef: 380, magicalDef: 380, crit: 1000, accuracy: 1100, block: 1100, parry: 1100, evasion: 1100, magicResist:1100 }, defaultActive: false },
        { key: 'leiboJam', value: '+150 PvE Attack / +150 PvE Def', stats: { pveAttack: 150, pveDefence: 150 }, defaultActive: false },
        { key: 'daevaConqueror', value: '+400 PvE Attack / +400 PvP Attack / +6000 HP', stats: { pveAttack: 400, pvpAttack: 400, hp: 6000 }, defaultActive: false, excludes: ['conqAphsa', 'no1inAion', 'conqTorm'] },
        { key: 'conqAphsa', value: '+8000 HP', stats: { hp: 8000 }, defaultActive: false, excludes: ['daevaConqueror', 'no1inAion', 'conqTorm'] },
        { key: 'no1inAion', value: '+500 HP', stats: { hp: 500 }, defaultActive: false, excludes: ['daevaConqueror', 'conqAphsa', 'conqTorm'] },
        { key: 'conqTorm', value: '+19 Attack', stats: { attack: 19 }, defaultActive: false, excludes: ['daevaConqueror', 'conqAphsa', 'no1inAion'] },
        { key: 'roastChicken', value: '+150 Attack / +2000 HP', stats: { attack: 150, hp: 2000 }, defaultActive: false, excludes: ['suspiciousSteak', 'poscaParty'] },
        { key: 'suspiciousSteak', value: '+550 Crit / +2000 HP', stats: { crit: 550, hp: 2000 }, defaultActive: false, excludes: ['roastChicken', 'poscaParty'] },
        { key: 'poscaParty', value: '+180 Attack / +2300 HP', stats: { attack: 180, hp: 2300 }, defaultActive: false, excludes: ['roastChicken', 'suspiciousSteak'] },
        { key: 'divineProtectionUniversal', value: '+5000 Crit', stats: { crit: 5000 }, defaultActive: false },
        { key: 'vaizelCall', value: '+800 Attack / +400 Defs / +120 Evasion ', stats: { attack: 800, physicalDef: 400, magicalDef: 400, evasion: 120 }, defaultActive: false },
        { key: 'blessedLight', value: '+500 Attack', stats: { attack: 500 }, defaultActive: false },
        { key: 'joltingStrike', value: '+600 PvP Attack, +600 PvE Attack', stats: { pvpAttack: 600, pveAttack: 600 }, defaultActive: false },
        { key: 'soulWave', value: '+600 PvP Attack, +600 PvE Attack', stats: { pvpAttack: 600, pveAttack: 600 }, defaultActive: false },
        { key: 'blessingOfStone', value: '+350 Defs, +25% HP', stats: { physicalDef: 350, magicalDef: 350, hpIncreasePercent: 25 }, defaultActive: false,  excludes: ['prayerOfProtection', 'blessingOfRock', 'melodyOfLife'] },
        { key: 'prayerOfProtection', value: '+200 Defs, +15% HP', stats: { physicalDef: 200, magicalDef: 200, hpIncreasePercent: 15 }, defaultActive: false,  excludes: ['blessingOfRock', 'melodyOfLife', 'blessingOfStone'] },
        { key: 'blessingOfRock', value: '+150 Defs, +10% HP', stats: { physicalDef: 150, magicalDef: 150, hpIncreasePercent: 10 }, defaultActive: false,  excludes: ['prayerOfProtection', 'melodyOfLife', 'blessingOfStone'] },
        { key: 'melodyOfLife', value: '+500 physDef, +15% HP', stats: { physicalDef: 500, hpIncreasePercent: 15 }, defaultActive: false,  excludes: ['prayerOfProtection', 'blessingOfRock', 'blessingOfStone'] },
    ],

    // Universal buffs shown only to PHYSICAL classes (gladiator, templar, assassin, ranger, chanter, painter)
    // TODO: invincibility mantra, wall of protection, magic of incitement, wind harmony
    universal_phys: [
        { key: 'magicIncitement',  value: '+800 Crit, Acc / +600 Attack', stats: { attack: 600, crit: 800, accuracy: 800 }, defaultActive: false, excludes: ['wordInspiration'] },
        { key: 'invincibilityMantra',  value: '+180 Attack / +250 PDef', stats: { attack: 180, physicalDef: 250 }, defaultActive: false, },
        { key: 'shieldMantra',  value: '+250 PDef / +500 Block, Parry / +450 Evasion', stats: { physicalDef: 250, block: 500, parry: 500, evasion: 450 }, defaultActive: false, },
        { key: 'wallProtection',  value: '+360 Attack', stats: { attack: 360 }, defaultActive: false, },
        { key: 'windHarmony',  value: '+121 Attack', stats: { attack: 121 }, defaultActive: false, },
    ],

    // Universal buffs shown only to MAGICAL classes (sorcerer, spiritmaster, cleric, aethertech, gunner, bard)
    // TODO: hmm, we do not have stats boost for magical only, we keep it empty for now.
    universal_mag: [],

    gladiator: [
        { key: 'combatPrep',    value: '+800 Attack / +800 PvP Attack / -600 PvP Def', stats: { attack: 800, pvpAttack: 800, pvpDefence: -600 },  defaultActive: false, excludes: ['defencePrep'] },
        { key: 'defencePrep',    value: '+800 Defs / +800 PvP def / -600 PvP Attack', stats: { defense: 800, pvpDefence: 800, pvpAttack: -600 },  defaultActive: false, excludes: ['combatPrep'] },
        { key: 'attackPosition', value: '+1800 Attack / +1200 Acc / +1200 Crit', stats: { attack: 1800, accuracy: 1200, crit: 1200 },  defaultActive: false },
    ],
    templar: [
        { key: 'divineFury', value: '+550 Attack', stats: { attack: 550 }, defaultActive: false },
        { key: 'empyreanFury', value: '+900 Attack / +1000 Acc / +1000 Crit', stats: { attack: 900, accuracy: 1000, crit: 1000 }, defaultActive: false },
        { key: 'menacingPosture', value: '+1500 PvE Attack / +2500 PvE Def / -1000 Attack', stats: { pveAttack: 1500, pveDefence: 2500, attack: -1000 }, defaultActive: false },
    ],
    assassin: [
        { key: 'deadlyFocus', value: '+2000 Attack / +200 Acc', stats: { attack: 2000, accuracy: 200 }, defaultActive: false },
        { key: 'devotion', value: '+450 Attack / +1500 Weapon Attack', stats: { attack: 450, weaponAttack: 1500 }, defaultActive: false, enchant: { stat: 'attack', perLevel: 10, maxLevel: 26, defaultLevel: 20 } },
        { key: 'deadlyAbandon', value: '+350 Attack / -800 Evasion', stats: { attack: 350, evasion: -800 }, defaultActive: false },
        { key: 'flurry', value: '+1500 Crit / +1500 Weapon Attack', stats: { crit: 1500, weaponAttack: 1500 }, defaultActive: false },
        { key: 'mistButcher', value: '+2000 Magic Acc / +5000 HP', stats: { magicAccuracy: 2000, hp: 5000 }, defaultActive: false },
        { key: 'eyeOfWrath', value: '-700 Crit', stats: { crit: -700}, defaultActive: false },
    ],
    ranger: [    
        { key: 'bowOfBlessing', value: '+480 Attack / +1200 Crit', stats: { attack: 480, crit: 1200 }, defaultActive: false },
        { key: 'strengtheningEye', value: '+200 Attack', stats: { attack: 200 }, defaultActive: false },
        { key: 'mauGlory', value: '+4000 Attack / +4000 Crit', stats: { attack: 4000, crit: 4000 }, defaultActive: false, excludes: ['mauHonour']  },
        { key: 'mauHonour', value: '+800 Attack / +2000 Accuracy / +800 Evasion', stats: { attack: 800, accuracy: 2000, evasion: 800 }, defaultActive: false, excludes: ['mauGlory'] },
        { key: 'sharpenArrows', value: '+500 Attack / +650 Crit / +650 PvE Attack', stats: { attack: 500, crit: 650, pveAttack: 650 }, defaultActive: false },
        { key: 'devotion', value: '+450 Attack / +1500 Weapon Attack', stats: { attack: 450, weaponAttack: 1500 }, defaultActive: false, enchant: { stat: 'attack', perLevel: 10, maxLevel: 26, defaultLevel: 20 } },
        { key: 'focusedShots', value: '+2600 Accuracy / 6% Physical Defence Reduction', stats: { accuracy: 2600, physicalDefPercentRed: 6 }, defaultActive: false },
    ],
    sorcerer: [
        { key: 'vaizelGift', value: '+25% cast / +500 PvE Attack', stats: { pveAttack: 500 }, defaultActive: false, enchant: { stat: 'pveAttack', perLevel: 10, maxLevel: 26, defaultLevel: 20 } },
        { key: 'arcaneCombustion', value: '+700 Attack / +4500 Accuracy', stats: { attack: 700, accuracy: 4500 }, defaultActive: false, excludes: ['arcaneGrowth'] },
        { key: 'arcaneGrowth', value: '+1500 Attack / +1500 Crit', stats: { attack: 1500, crit: 1500 }, defaultActive: false, excludes : ['arcaneCombustion'] },
        { key: 'boonFlame', value: '+1000 Crit', stats: { crit: 1000 }, defaultActive: false },
    ],
    spiritmaster: [
        { key: 'spiritBundle', value: '+1000 Attack / +1000 Acc / +500 Crit / +12000 HP', stats: { attack: 1000, accuracy: 1000, crit: 500, hp: 12000 }, defaultActive: false },
    ],
    cleric: [
        { key: 'sacrificialPower', value: '+1600 Attack / +1800 Acc / +1250 Crit / +600 PvE Attack / -1500 Heal', stats: { attack: 1600, accuracy: 1800, crit: 1250, pveAttack: 600, healingBoost: -1500 }, defaultActive: false },
        { key: 'benevolence', value: '-1500 Attack / +650 HealingBoost', stats: { attack: -1500, healingBoost: 650 }, defaultActive: false },
        { key: 'amplification', value: '+700 Attack / +1100 HealingBoost', stats: { attack: 700, healingBoost: 1100 }, defaultActive: false, enchant: { stat: 'attack', perLevel: 14, maxLevel: 26, defaultLevel: 20 } },
    ],
    chanter: [
        { key: 'blessingWind', value: '+800 Attack', stats: { attack: 800 }, defaultActive: false },
        { key: 'divineProtection', value: '+2000 Attack', stats: { attack: 2000 }, defaultActive: false },
        { key: 'wordInspiration', value: '+750 Attack / +600 Accuracy / +600 Crit / +500 PvE Attack / -1000 Healing Boost', stats: { attack: 750, accuracy: 600, crit: 600, pveAttack: 500, healingBoost: -1000 }, defaultActive: false, excludes: ['magicIncitement'] },
    ],
    aethertech: [
        { key: 'limitlessPower', value: '+5000 Attack / +3000 Accuracy', stats: { attack: 5000, accuracy: 3000 }, defaultActive: false, excludes: ['extremeEffort'] },
        { key: 'combatPowerMax', value: '+800 Attack / +550 PvP Attack', stats: { attack: 800, pvpAttack: 550 }, defaultActive: false },
        { key: 'powerIncrease', value: '+900 Attack / +300 PvP Attack', stats: { attack: 900, pvpAttack: 300 }, defaultActive: false },
        { key: 'extremeEffort', value: '+900 Attack / +1200 Accuracy', stats: { attack: 900, accuracy: 1200 }, defaultActive: false, excludes: ['limitlessPower'] },
        { key: 'alertDialog', value: '+2500 PvE Defence / -200 Attack', stats: { pveDefence: 2500, attack: -200 }, defaultActive: false },
    ],
    gunner: [
        { key: 'focusedMagic', value: '+1200 Attack', stats: { attack: 1200 }, defaultActive: false },
        { key: 'magicBlessing', value: '+700 Attack / +800 Accuracy', stats: { attack: 700, accuracy: 800 }, defaultActive: false },
        { key: 'enhanceMagicProjectile ', value: '+500 PvP Attack / +500 PvE Attack', stats: { pvpAttack: 500, pveAttack: 500 }, defaultActive: false },
        { key: 'giftMagic', value: '+1000 Crit', stats: {  }, defaultActive: false },
    ],
    bard: [
        { key: 'cheeryMelody', value: '+1000 PvE Attack', stats: { pveAttack: 1000 }, defaultActive: false, enchant: { stat: 'pveAttack', perLevel: 20, maxLevel: 26, defaultLevel: 20 } },
        { key: 'magicBoostMode', value: '+1150 Attack / +2800 Acc / -800 Heal', stats: { attack: 1150, accuracy: 2800, healingBoost: -800 }, defaultActive: false },
    ],
    painter: [
        { key: 'precisionColourBoost', value: '+700 Attack / +2000 Crit / +1000 Acc', stats: { attack: 700, crit: 2000, accuracy: 1000 }, defaultActive: false },
        { key: 'attackColourBoost', value: '+2000 Attack / +2000 Crit', stats: { attack: 2000, crit: 2000 }, defaultActive: false },
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

// Build ordered list of enchantable skill keys (subset of GC_SKILL_KEYS, same order)
// Used by share.js to encode/decode enchant levels in a stable order.
var GC_ENCHANTABLE_KEYS = (function() {
    var enchantMap = {};
    Object.keys(GC_SKILL_BUFFS).forEach(function(group) {
        GC_SKILL_BUFFS[group].forEach(function(buff) {
            if (buff.enchant && !enchantMap[buff.key]) {
                enchantMap[buff.key] = true;
            }
        });
    });
    var keys = [];
    GC_SKILL_KEYS.forEach(function(k) {
        if (enchantMap[k]) keys.push(k);
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
