'use strict';

(function(global) {
    var LOCKED_ICON = '../assets/icons/locked_daevanion.png';
    var DUMMY_ICON = '../assets/icons/icon_ui_skills.png';

    var data = {
        gladiator: [
            {
                key: 'explosionOfRage',
                defaultSkill: {
                    name: 'Explosion of Rage',
                    icon: '../assets/icons/cbt_fi_abysalrage_g1.png',
                    description: 'Has a high chance of hitting the target and then deals 1649 physical damage.\nCauses the target to stumble.',
                    usageCost: 'DP 3000',
                    cooldown: '1m30s'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Raving Madness',
                            icon: '../assets/icons/fi_abysalrage_custom_a_up.png',
                            description: 'Has a high chance of hitting the target and then deals 3093 physical damage.\nMakes the target stumble for 4 seconds.',
                            usageCost: 'DP 3000',
                            cooldown: '1m30s'
                        },
                        type2: {
                            name: '(Improved) Short Fuse',
                            icon: '../assets/icons/fi_abysalrage_custom_b_up.png',
                            description: 'Has a high chance of hitting the target and then deals 2061 physical damage.\nCauses the target stumble.\nResets the cooldown of Wrathful Strike and Explosion of Wrath.',
                            usageCost: 'DP 3000',
                            cooldown: '1m30s'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Raving Madness',
                            icon: '../assets/icons/fi_abysalrage_custom_a.png',
                            description: 'Has a high chance of hitting the target and then deals 2473 physical damage.\nCauses the target stumble.',
                            usageCost: 'DP 3000',
                            cooldown: '1m30s'
                        },
                        type2: {
                            name: 'Short Fuse',
                            icon: '../assets/icons/fi_abysalrage_custom_b.png',
                            description: 'Has a high chance of hitting the target and then deals 1649 physical damage.\nCauses the target stumble.\nResets the cooldown of Wrathful Strike.',
                            usageCost: 'DP 3000',
                            cooldown: '1m30s'
                        },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'gladiatorSkill2',
                defaultSkill: {
                    name: 'Crushing Blow',
                    icon: '../assets/icons/live_fi_destructblow_g1.png',
                    description: 'Dummy default skill for Gladiator Skill 2.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Shattering Strike', icon: '../assets/icons/fi_destructblow_custom_a_up.png', description: 'Dummy description Gladiator Skill 2 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Shattering Blow', icon: '../assets/icons/fi_destructblow_custom_b_up.png', description: 'Dummy description Gladiator Skill 2 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Shattering Strike', icon: '../assets/icons/fi_destructblow_custom_a.png', description: 'Dummy description Gladiator Skill 2 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Shattering Blow', icon: '../assets/icons/fi_destructblow_custom_b.png', description: 'Dummy description Gladiator Skill 2 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'gladiatorSkill3',
                defaultSkill: {
                    name: 'Piercing Rupture',
                    icon: '../assets/icons/live_fi_stigma_shockburst_g1.png',
                    description: 'Dummy default skill for Gladiator Skill 3.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Absorb Bloodlust', icon: '../assets/icons/fi_shockburst_custom_a_up.png', description: 'Dummy description Gladiator Skill 3 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Bloodlust Explosion', icon: '../assets/icons/fi_shockburst_custom_b_up.png', description: 'Dummy description Gladiator Skill 3 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Absorb Bloodlust', icon: '../assets/icons/fi_shockburst_custom_a.png', description: 'Dummy description Gladiator Skill 3 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Bloodlust Explosion', icon: '../assets/icons/fi_shockburst_custom_b.png', description: 'Dummy description Gladiator Skill 3 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'gladiatorSkill4',
                defaultSkill: {
                    name: 'Righteous Cleave',
                    icon: '../assets/icons/cbt_fi_stormblade_g1.png',
                    description: 'Deals 1079 physical damage.',
                    usageCost: 'MP 111',
                    cooldown: '14s'
                },
                rows: {
                    improved: {
                        type1: null,
                        type2: { name: '(Improved) Boosted Martial Cleave', icon: '../assets/icons/fi_stormblade_custom_b_up.png', description: 'Dummy description Gladiator Skill 4 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Blade Leap', icon: '../assets/icons/fi_stormblade_custom_c_up.png', description: 'Dummy description Gladiator Skill 4 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Martial Cleave', icon: '../assets/icons/fi_stormblade_custom_a.png', description: 'Dummy description Gladiator Skill 4 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Boosted Martial Cleave', icon: '../assets/icons/fi_stormblade_custom_b.png', description: 'Dummy description Gladiator Skill 4 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Blade Leap', icon: '../assets/icons/fi_stormblade_custom_c.png', description: 'Dummy description Gladiator Skill 4 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'gladiatorSkill5',
                defaultSkill: {
                    name: 'Wild Leap',
                    icon: '../assets/icons/fi_flyingslash_g1.png',
                    description: 'Dummy default skill for Gladiator Skill 5.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Wild Tremor', icon: '../assets/icons/fi_flyingslash_custom_a_up.png', description: 'Dummy description Gladiator Skill 5 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Leaping Strike', icon: '../assets/icons/fi_flyingslash_custom_b_up.png', description: 'Dummy description Gladiator Skill 5 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Wild Tremor', icon: '../assets/icons/fi_flyingslash_custom_a.png', description: 'Dummy description Gladiator Skill 5 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Leaping Strike', icon: '../assets/icons/fi_flyingslash_custom_b.png', description: 'Dummy description Gladiator Skill 5 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'gladiatorSkill6',
                defaultSkill: {
                    name: 'Daevic Fury',
                    icon: '../assets/icons/live_fi_berserkstance_g1.png',
                    description: 'Dummy default skill for Gladiator Skill 6.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Vow of the Charge', icon: '../assets/icons/fi_berserkstance_custom_a_up.png', description: 'Dummy description Gladiator Skill 6 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Attack Position', icon: '../assets/icons/fi_berserkstance_custom_b_up.png', description: 'Dummy description Gladiator Skill 6 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Vow of the Charge', icon: '../assets/icons/fi_berserkstance_custom_a.png', description: 'Dummy description Gladiator Skill 6 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Attack Position', icon: '../assets/icons/fi_berserkstance_custom_b.png', description: 'Dummy description Gladiator Skill 6 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            }
        ],
        templar: [
            {
                key: 'templarSkill1',
                defaultSkill: {
                    name: 'Bodyguard',
                    icon: '../assets/icons/cbt_kn_grandprotection_g1.png',
                    description: 'Dummy default skill for Templar Skill 1.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Comrade\'s Aegis', icon: '../assets/icons/kn_grandprotection_custom_a_up.png', description: 'Dummy description Templar Skill 1 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Cover Comrade', icon: '../assets/icons/kn_grandprotection_custom_b_up.png', description: 'Dummy description Templar Skill 1 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Comrade\'s Aegis', icon: '../assets/icons/kn_grandprotection_custom_a.png', description: 'Dummy description Templar Skill 1 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Cover Comrade', icon: '../assets/icons/kn_grandprotection_custom_b.png', description: 'Dummy description Templar Skill 1 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'templarSkill2',
                defaultSkill: {
                    name: 'Shield Bash',
                    icon: '../assets/icons/cbt_kn_shieldcharge_g1.png',
                    description: 'Dummy default skill for Templar Skill 2.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Shield Blow', icon: '../assets/icons/kn_shieldcharge_custom_a_up.png', description: 'Dummy description Templar Skill 2 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Heavy Shield Blow', icon: '../assets/icons/kn_shieldcharge_custom_b_up.png', description: 'Dummy description Templar Skill 2 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Shield Blow', icon: '../assets/icons/kn_shieldcharge_custom_a.png', description: 'Dummy description Templar Skill 2 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Heavy Shield Blow', icon: '../assets/icons/kn_shieldcharge_custom_b.png', description: 'Dummy description Templar Skill 2 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'templarSkill3',
                defaultSkill: {
                    name: 'Break Power',
                    icon: '../assets/icons/cbt_kn_breakpower_g1.png',
                    description: 'Dummy default skill for Templar Skill 3.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: null,
                        type2: { name: '(Improved) Boosted Shatter Strength', icon: '../assets/icons/kn_breakpower_custom_b_up.png', description: 'Dummy description Templar Skill 3 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Ankle Blow', icon: '../assets/icons/kn_breakpower_custom_c_up.png', description: 'Dummy description Templar Skill 3 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Shatter Strength', icon: '../assets/icons/kn_breakpower_custom_a.png', description: 'Dummy description Templar Skill 3 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Boosted Shatter Strength', icon: '../assets/icons/kn_breakpower_custom_b.png', description: 'Dummy description Templar Skill 3 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Ankle Blow', icon: '../assets/icons/kn_breakpower_custom_c.png', description: 'Dummy description Templar Skill 3 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'templarSkill4',
                defaultSkill: {
                    name: 'Iron Skin',
                    icon: '../assets/icons/cbt_kn_ironbody_g1.png',
                    description: 'Dummy default skill for Templar Skill 4.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Dual Provocation Armour', icon: '../assets/icons/kn_ironbody_custom_a_up.png', description: 'Dummy description Templar Skill 4 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Iron Skin', icon: '../assets/icons/kn_ironbody_custom_b_up.png', description: 'Dummy description Templar Skill 4 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Dual Provocation Armour', icon: '../assets/icons/kn_ironbody_custom_a.png', description: 'Dummy description Templar Skill 4 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Iron Skin', icon: '../assets/icons/kn_ironbody_custom_b.png', description: 'Dummy description Templar Skill 4 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'templarSkill5',
                defaultSkill: {
                    name: 'Divine Grasp',
                    icon: '../assets/icons/cbt_kn_landsnacher_g1.png',
                    description: 'Dummy default skill for Templar Skill 5.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Repeated Divine Grasp', icon: '../assets/icons/kn_landsnacher_custom_a_up.png', description: 'Deals 1,207 physical damage. Drags an enemy directly in front of you and increases Enmity. Reduces the target\'s movement speed for 10s.', usageCost: 'DP 2000', cooldown: '2m', castTime: "1s" },
                        type2: { name: '(Improved) Concentrated Divine Grasp', icon: '../assets/icons/kn_landsnacher_custom_b_up.png', description: 'Deals 1,207 physical damage. Drags an enemy directly in front of you and increases Enmity. Reduces the target\'s movement speed for 10s. Resets the cooldown of Capture.', usageCost: 'DP 2000', cooldown: '2m', castTime: "0.8s" },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Repeated Divine Grasp', icon: '../assets/icons/kn_landsnacher_custom_a.png', description: 'Deals 715 (+27) physical damage. Drags an enemy directly in front of you and increases Enmity. Reduces the target\'s movement speed for 10s.', usageCost: 'DP 2000', cooldown: '3m', castTime: "1.5s" },
                        type2: { name: 'Concentrated Divine Grasp', icon: '../assets/icons/kn_landsnacher_custom_b.png', description: 'Deals 715 (+27) physical damage. Drags an enemy directly in front of you and increases Enmity. Reduces the target\'s movement speed for 10s. Resets the cooldown of Capture by 50%.', usageCost: 'DP 2000', cooldown: '2m', castTime: "1.5s" },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'templarSkill6',
                defaultSkill: {
                    name: 'Bloodstorm Blow',
                    icon: '../assets/icons/kn_bloodyslash_g1.png',
                    description: 'Deals 713 physical damage. Multicast 2 times. Perfect Bloodsword Slash',
                    usageCost: 'HP 209',
                    cooldown: '5s'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Bloodstorm Splitter', icon: '../assets/icons/kn_bloodyslash_custom_a_up.png', description: 'Deals 847 physical damage. The target has a high probability of being knocked back. Multicast 3 times', usageCost: 'HP 209', cooldown: '5s' },
                        type2: { name: '(Improved) Depriving Strike', icon: '../assets/icons/kn_bloodyslash_custom_b_up.png', description: 'Deals 847 physical damage. Absorbs HP equal to 20% of the damage. Multicast 3 times', usageCost: 'HP 209', cooldown: '5s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Bloodstorm Splitter', icon: '../assets/icons/kn_bloodyslash_custom_a.png', description: 'Deals 713 (+6) physical damage. The target also has a high probability of being knocked back. Multicast 3 times', usageCost: 'HP 209', cooldown: '5s' },
                        type2: { name: 'Depriving Strike', icon: '../assets/icons/kn_bloodyslash_custom_b.png', description: 'Deals 713 (+6) physical damage. Absorbs HP equal to 20% of the damage. Multicast 2 times', usageCost: 'HP 209', cooldown: '5s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            }
        ],
        assassin: [
            {
                key: 'assassinSkill1',
                defaultSkill: {
                    name: 'Pain Rune Burst',
                    icon: '../assets/icons/cbt_as_signetburst_g1.png',
                    description: 'Dummy default skill for Assassin Skill 1.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Seal Eruption', icon: '../assets/icons/as_signetburst_custom_a_up.png', description: 'Dummy description Assassin Skill 1 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Seal Destruction', icon: '../assets/icons/as_signetburst_custom_b_up.png', description: 'Dummy description Assassin Skill 1 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Seal Eruption', icon: '../assets/icons/as_signetburst_custom_a.png', description: 'Dummy description Assassin Skill 1 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Seal Destruction', icon: '../assets/icons/as_signetburst_custom_b.png', description: 'Dummy description Assassin Skill 1 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'assassinSkill2',
                defaultSkill: {
                    name: 'Killing Spree',
                    icon: '../assets/icons/live_as_pollutioncut_g1.png',
                    description: 'Dummy default skill for Assassin Skill 2.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: null,
                        type2: { name: '(Improved) Boosted Second Slash', icon: '../assets/icons/as_pollutioncut_custom_b_up.png', description: 'Dummy description Assassin Skill 2 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Soulbreak', icon: '../assets/icons/as_pollutioncut_custom_c_up.png', description: 'Dummy description Assassin Skill 2 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Second Slash', icon: '../assets/icons/as_pollutioncut_custom_a.png', description: 'Dummy description Assassin Skill 2 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Boosted Second Slash', icon: '../assets/icons/as_pollutioncut_custom_b.png', description: 'Dummy description Assassin Skill 2 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Soulbreak', icon: '../assets/icons/as_pollutioncut_custom_c.png', description: 'Dummy description Assassin Skill 2 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'assassinSkill3',
                defaultSkill: {
                    name: 'Wind Walk',
                    icon: '../assets/icons/cbt_as_windwalk_g1.png',
                    description: 'Dummy default skill for Assassin Skill 3.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Shadow of Resistance', icon: '../assets/icons/as_windwalk_custom_a_up.png', description: 'Dummy description Assassin Skill 3 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Speed\'s Shadow', icon: '../assets/icons/as_windwalk_custom_b_up.png', description: 'Dummy description Assassin Skill 3 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Shadow of Resistance', icon: '../assets/icons/as_windwalk_custom_a.png', description: 'Dummy description Assassin Skill 3 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Speed\'s Shadow', icon: '../assets/icons/as_windwalk_custom_b.png', description: 'Dummy description Assassin Skill 3 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'assassinSkill4',
                defaultSkill: {
                    name: 'Bloodthirster Surprise Attack',
                    icon: '../assets/icons/cbt_sc_assaultstabber_g1.png',
                    description: 'Dummy default skill for Assassin Skill 4.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Bestial Surprise Attack', icon: '../assets/icons/sc_assaultstabber_custom_a_up.png', description: 'Dummy description Assassin Skill 4 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Crushing Surprise Attack', icon: '../assets/icons/sc_assaultstabber_custom_b_up.png', description: 'Dummy description Assassin Skill 4 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Bestial Surprise Attack', icon: '../assets/icons/sc_assaultstabber_custom_a.png', description: 'Dummy description Assassin Skill 4 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Crushing Surprise Attack', icon: '../assets/icons/sc_assaultstabber_custom_b.png', description: 'Dummy description Assassin Skill 4 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'assassinSkill5',
                defaultSkill: {
                    name: 'Swift Ambush',
                    icon: '../assets/icons/cbt_as_blindside_g1.png',
                    description: 'Dummy default skill for Assassin Skill 5.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Swift Heavy Attack', icon: '../assets/icons/as_blindside_custom_a_up.png', description: 'Dummy description Assassin Skill 5 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Swift Storm Attack', icon: '../assets/icons/as_blindside_custom_b_up.png', description: 'Dummy description Assassin Skill 5 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Swift Heavy Attack', icon: '../assets/icons/as_blindside_custom_a.png', description: 'Dummy description Assassin Skill 5 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Swift Storm Attack', icon: '../assets/icons/as_blindside_custom_b.png', description: 'Dummy description Assassin Skill 5 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'assassinSkill6',
                defaultSkill: {
                    name: 'Whirlwind Blow',
                    icon: '../assets/icons/cbt_as_flowingspiner_g1.png',
                    description: 'Dummy default skill for Assassin Skill 6.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Whirling Slicer', icon: '../assets/icons/as_flowingspiner_custom_a_up.png', description: 'Dummy description Assassin Skill 6 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Whirlwind Slash', icon: '../assets/icons/as_flowingspiner_custom_b_up.png', description: 'Dummy description Assassin Skill 6 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Assassin Whirling Slicer', icon: '../assets/icons/as_flowingspiner_custom_a.png', description: 'Dummy description Assassin Skill 6 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Assassin Whirlwind Slash', icon: '../assets/icons/as_flowingspiner_custom_b.png', description: 'Dummy description Assassin Skill 6 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            }
        ],
        ranger: [
            {
                key: 'rangerSkill1',
                defaultSkill: {
                    name: 'Shackle Arrow',
                    icon: '../assets/icons/cbt_ra_rootarrow_g1.png',
                    description: 'Dummy default skill for Ranger Skill 1.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Shackling Arrow', icon: '../assets/icons/ra_rootarrow_custom_a_up.png', description: 'Dummy description Ranger Skill 1 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Shackling Arrow Torrent', icon: '../assets/icons/ra_rootarrow_custom_b_up.png', description: 'Dummy description Ranger Skill 1 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Shackling Arrow', icon: '../assets/icons/ra_rootarrow_custom_a.png', description: 'Dummy description Ranger Skill 1 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Shackling Arrow Torrent', icon: '../assets/icons/ra_rootarrow_custom_b.png', description: 'Dummy description Ranger Skill 1 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'rangerSkill2',
                defaultSkill: {
                    name: 'Silencing Shot',
                    icon: '../assets/icons/cbt_ra_silentarrow_g1.png',
                    description: 'Dummy default skill for Ranger Skill 2.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: null,
                        type2: { name: '(Improved) Silencing Thrust', icon: '../assets/icons/ra_silentarrow_custom_b_up.png', description: 'Dummy description Ranger Skill 2 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Binding Arrow', icon: '../assets/icons/ra_silentarrow_custom_c_up.png', description: 'Dummy description Ranger Skill 2 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Throwing Daggers of Silence', icon: '../assets/icons/ra_counterslash_custom_a.png', description: 'Dummy description Ranger Skill 2 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Silencing Thrust', icon: '../assets/icons/ra_silentarrow_custom_b_up.png', description: 'Dummy description Ranger Skill 2 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Binding Arrow', icon: '../assets/icons/ra_silentarrow_custom_c_up.png', description: 'Dummy description Ranger Skill 2 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'rangerSkill3',
                defaultSkill: {
                    name: 'Retreating Slash',
                    icon: '../assets/icons/cbt_ra_backdashstab_g1.png',
                    description: 'Dummy default skill for Ranger Skill 3.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Knock-back', icon: '../assets/icons/ra_backdashstab_custom_a_up.png', description: 'Dummy description Ranger Skill 3 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Rear Strike', icon: '../assets/icons/ra_backdashstab_custom_b_up.png', description: 'Dummy description Ranger Skill 3 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Knockback', icon: '../assets/icons/ra_backdashstab_custom_a.png', description: 'Dummy description Ranger Skill 3 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Rear Strike', icon: '../assets/icons/ra_backdashstab_custom_b.png', description: 'Dummy description Ranger Skill 3 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'rangerSkill4',
                defaultSkill: {
                    name: 'Rupture Arrow',
                    icon: '../assets/icons/cbt_ra_crushshot_g1.png',
                    description: 'Dummy default skill for Ranger Skill 4.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Arrow Rain of Destruction', icon: '../assets/icons/ra_crushshot_custom_a_up.png', description: 'Dummy description Ranger Skill 4 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Sustained Arrow Rain', icon: '../assets/icons/ra_crushshot_custom_b_up.png', description: 'Dummy description Ranger Skill 4 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Arrow Rain of Destruction', icon: '../assets/icons/ra_crushshot_custom_a.png', description: 'Dummy description Ranger Skill 4 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Sustained Arrow Rain', icon: '../assets/icons/ra_crushshot_custom_b.png', description: 'Dummy description Ranger Skill 4 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'rangerSkill5',
                defaultSkill: {
                    name: 'Arrow of Annihilation',
                    icon: '../assets/icons/live_ra_aimshot_g1.png',
                    description: 'Dummy default skill for Ranger Skill 5.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Arrow of Destruction', icon: '../assets/icons/ra_aimshot_custom_a_up.png', description: 'Dummy description Ranger Skill 5 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Arrow of Death', icon: '../assets/icons/ra_aimshot_custom_b_up.png', description: 'Dummy description Ranger Skill 5 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Arrow of Destruction', icon: '../assets/icons/ra_aimshot_custom_a.png', description: 'Dummy description Ranger Skill 5 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Arrow of Death', icon: '../assets/icons/ra_aimshot_custom_b.png', description: 'Dummy description Ranger Skill 5 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'rangerSkill6',
                defaultSkill: {
                    name: 'Mau\'s Blessing',
                    icon: '../assets/icons/cbt_ra_sabageroar_g1.png',
                    description: 'Dummy default skill for Ranger Skill 6.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Mau\'s Honour', icon: '../assets/icons/ev_ra_sabageroar_custom_a_up.png', description: 'Dummy description Ranger Skill 6 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Mau\'s Glory', icon: '../assets/icons/ev_ra_sabageroar_custom_b_up.png', description: 'Dummy description Ranger Skill 6 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Mau\'s Honour', icon: '../assets/icons/ev_ra_sabageroar_custom_a.png', description: 'Dummy description Ranger Skill 6 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Mau\'s Glory', icon: '../assets/icons/ev_ra_sabageroar_custom_b.png', description: 'Dummy description Ranger Skill 6 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            }
        ],
        sorcerer: [
            {
                key: 'sorcererSkill1',
                defaultSkill: {
                    name: 'Freezing Wind',
                    icon: '../assets/icons/cbt_wi_hydroimpact_g1.png',
                    description: 'Dummy default skill for Sorcerer Skill 1.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Summon Heat', icon: '../assets/icons/wi_hydroimpact_custom_a_up.png', description: 'Dummy description Sorcerer Skill 1 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Frosty Fire', icon: '../assets/icons/wi_hydroimpact_custom_b_up.png', description: 'Dummy description Sorcerer Skill 1 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Summon Heat', icon: '../assets/icons/wi_hydroimpact_custom_a.png', description: 'Dummy description Sorcerer Skill 1 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Frosty Fire', icon: '../assets/icons/wi_hydroimpact_custom_b.png', description: 'Dummy description Sorcerer Skill 1 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'sorcererSkill2',
                defaultSkill: {
                    name: 'Magic Assist',
                    icon: '../assets/icons/live_wi_manaboost_g1.png',
                    description: 'Dummy default skill for Sorcerer Skill 2.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Arcane Growth', icon: '../assets/icons/wi_manaboost_custom_a_up.png', description: 'Dummy description Sorcerer Skill 2 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Arcane Combustion', icon: '../assets/icons/wi_manaboost_custom_b_up.png', description: 'Dummy description Sorcerer Skill 2 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Arcane Growth', icon: '../assets/icons/wi_manaboost_custom_a.png', description: 'Dummy description Sorcerer Skill 2 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Arcane Combustion', icon: '../assets/icons/wi_manaboost_custom_b.png', description: 'Dummy description Sorcerer Skill 2 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'sorcererSkill3',
                defaultSkill: {
                    name: 'Tranquillising Cloud',
                    icon: '../assets/icons/cbt_wi_sleepingcloud_g1.png',
                    description: 'Dummy default skill for Sorcerer Skill 3.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Greater Tranquillising Cloud', icon: '../assets/icons/wi_sleepingcloud_custom_a_up.png', description: 'Dummy description Sorcerer Skill 3 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Concentrated Tranquillising Cloud', icon: '../assets/icons/wi_sleepingcloud_custom_b_up.png', description: 'Dummy description Sorcerer Skill 3 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Greater Tranquillising Cloud', icon: '../assets/icons/wi_sleepingcloud_custom_a.png', description: 'Dummy description Sorcerer Skill 3 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Concentrated Tranquillising Cloud', icon: '../assets/icons/wi_sleepingcloud_custom_b.png', description: 'Dummy description Sorcerer Skill 3 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'sorcererSkill4',
                defaultSkill: {
                    name: 'Big Magma Eruption',
                    icon: '../assets/icons/live_wi_light_stigma_volcanicflame_g1.png',
                    description: 'Dummy default skill for Sorcerer Skill 4.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: null,
                        type2: { name: '(Improved) Boosted Major Eruption', icon: '../assets/icons/wi_volcanicflame_custom_b_up.png', description: 'Dummy description Sorcerer Skill 4 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Massive Seismic Blast', icon: '../assets/icons/wi_volcanicflame_custom_c_up.png', description: 'Dummy description Sorcerer Skill 4 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Major Eruption', icon: '../assets/icons/wi_volcanicflame_custom_a.png', description: 'Dummy description Sorcerer Skill 4 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Boosted Major Eruption', icon: '../assets/icons/wi_volcanicflame_custom_b.png', description: 'Dummy description Sorcerer Skill 4 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Massive Seismic Blast', icon: '../assets/icons/wi_volcanicflame_custom_c.png', description: 'Dummy description Sorcerer Skill 4 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'sorcererSkill5',
                defaultSkill: {
                    name: 'Aether Flame',
                    icon: '../assets/icons/cbt_wi_fireshooter_g1.png',
                    description: 'Dummy default skill for Sorcerer Skill 5.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Flameshot', icon: '../assets/icons/wi_fireshooter_custom_a_up.png', description: 'Dummy description Sorcerer Skill 5 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Flame Spurt', icon: '../assets/icons/wi_fireshooter_custom_b_up.png', description: 'Dummy description Sorcerer Skill 5 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Flameshot', icon: '../assets/icons/wi_fireshooter_custom_a.png', description: 'Dummy description Sorcerer Skill 5 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Flame Spurt', icon: '../assets/icons/wi_fireshooter_custom_b.png', description: 'Dummy description Sorcerer Skill 5 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'sorcererSkill6',
                defaultSkill: {
                    name: 'Storm Spear',
                    icon: '../assets/icons/live_wi_windspear_g1.png',
                    description: 'Dummy default skill for Sorcerer Skill 6.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Swift Spear', icon: '../assets/icons/wi_windspear_custom_a_up.png', description: 'Dummy description Sorcerer Skill 6 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Space-Time Spear', icon: '../assets/icons/wi_windspear_custom_b_up.png', description: 'Dummy description Sorcerer Skill 6 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Swift Spear', icon: '../assets/icons/wi_windspear_custom_a.png', description: 'Dummy description Sorcerer Skill 6 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Space-Time Spear', icon: '../assets/icons/wi_windspear_custom_b.png', description: 'Dummy description Sorcerer Skill 6 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            }
        ],
        spiritmaster: [
            {
                key: 'spiritmasterSkill1',
                defaultSkill: {
                    name: 'Weaken Spirit',
                    icon: '../assets/icons/cbt_el_dimisspolymorph_g1.png',
                    description: 'Dummy default skill for Spiritmaster Skill 1.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Decaying Mind', icon: '../assets/icons/el_dimisspolymorph_custom_a_up.png', description: 'Dummy description Spiritmaster Skill 1 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Paralysed Mind', icon: '../assets/icons/el_dimisspolymorph_custom_b_up.png', description: 'Dummy description Spiritmaster Skill 1 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Decaying Mind', icon: '../assets/icons/el_dimisspolymorph_custom_a.png', description: 'Dummy description Spiritmaster Skill 1 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Paralysed Mind', icon: '../assets/icons/el_dimisspolymorph_custom_b.png', description: 'Dummy description Spiritmaster Skill 1 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'spiritmasterSkill2',
                defaultSkill: {
                    name: 'Vacuum Choke',
                    icon: '../assets/icons/live_el_vacuumexplosion_g1.png',
                    description: 'Dummy default skill for Spiritmaster Skill 2.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Titanic Vacuum Explosion', icon: '../assets/icons/el_vacuumexplosion_custom_a_up.png', description: 'Dummy description Spiritmaster Skill 2 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Vacuum Chain Explosion', icon: '../assets/icons/el_vacuumexplosion_custom_b_up.png', description: 'Dummy description Spiritmaster Skill 2 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Titanic Vacuum Explosion', icon: '../assets/icons/el_vacuumexplosion_custom_a.png', description: 'Dummy description Spiritmaster Skill 2 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Vacuum Chain Explosion', icon: '../assets/icons/el_vacuumexplosion_custom_b.png', description: 'Dummy description Spiritmaster Skill 2 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'spiritmasterSkill3',
                defaultSkill: {
                    name: 'Soul Torrent',
                    icon: '../assets/icons/live_el_soulsteal_g1.png',
                    description: 'Dummy default skill for Spiritmaster Skill 3.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: null,
                        type2: { name: '(Improved) Boosted Soul Theft', icon: '../assets/icons/el_soulsteal_custom_b_up.png', description: 'Dummy description Spiritmaster Skill 3 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Soul Burn', icon: '../assets/icons/el_soulsteal_custom_c_up.png', description: 'Dummy description Spiritmaster Skill 3 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Soul Theft', icon: '../assets/icons/el_soulsteal_custom_a.png', description: 'Dummy description Spiritmaster Skill 3 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Boosted Soul Theft', icon: '../assets/icons/el_soulsteal_custom_b.png', description: 'Dummy description Spiritmaster Skill 3 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Soul Burn', icon: '../assets/icons/el_soulsteal_custom_c.png', description: 'Dummy description Spiritmaster Skill 3 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'spiritmasterSkill4',
                defaultSkill: {
                    name: 'Disenchant',
                    icon: '../assets/icons/cbt_el_disenchantment_g1.png',
                    description: 'Dummy default skill for Spiritmaster Skill 4.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Greater Disenchantment', icon: '../assets/icons/el_disenchantment_custom_a_up.png', description: 'Dummy description Spiritmaster Skill 4 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Concentrated Disenchantment', icon: '../assets/icons/el_disenchantment_custom_b_up.png', description: 'Dummy description Spiritmaster Skill 4 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Greater Disenchantment', icon: '../assets/icons/el_disenchantment_custom_a.png', description: 'Dummy description Spiritmaster Skill 4 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Concentrated Disenchantment', icon: '../assets/icons/el_disenchantment_custom_b.png', description: 'Dummy description Spiritmaster Skill 4 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'spiritmasterSkill5',
                defaultSkill: {
                    name: 'Order: Elemental Discharge',
                    icon: '../assets/icons/el_order_explode_g1.png',
                    description: 'Dummy default skill for Spiritmaster Skill 5.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Command: Elemental Destruction', icon: '../assets/icons/el_order_explode_custom_a_up.png', description: 'Dummy description Spiritmaster Skill 5 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Command: Elemental Wave', icon: '../assets/icons/el_order_explode_custom_b_up.png', description: 'Dummy description Spiritmaster Skill 5 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Command: Elemental Destruction', icon: '../assets/icons/el_order_explode_custom_a.png', description: 'Dummy description Spiritmaster Skill 5 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Command: Elemental Wave', icon: '../assets/icons/el_order_explode_custom_b.png', description: 'Dummy description Spiritmaster Skill 5 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'spiritmasterSkill6',
                defaultSkill: {
                    name: 'Nightmare Scream',
                    icon: '../assets/icons/cbt_el_terrorspirit_g1.png',
                    description: 'Dummy default skill for Spiritmaster Skill 6.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Nightmare Curse', icon: '../assets/icons/el_terrorspirit_custom_a_up.png', description: 'Dummy description Spiritmaster Skill 6 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Nightmare Sorrow', icon: '../assets/icons/el_terrorspirit_custom_b_up.png', description: 'Dummy description Spiritmaster Skill 6 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Nightmare Curse', icon: '../assets/icons/el_terrorspirit_custom_a.png', description: 'Dummy description Spiritmaster Skill 6 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Nightmare Sorrow', icon: '../assets/icons/el_terrorspirit_custom_b.png', description: 'Dummy description Spiritmaster Skill 6 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            }
        ],
        cleric: [
            {
                key: 'clericSkill1',
                defaultSkill: {
                    name: 'Immortal Shroud',
                    icon: '../assets/icons/live_pr_invinsiblewall_g1.png',
                    description: 'Dummy default skill for Cleric Skill 1.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Indestructible Shield Wall', icon: '../assets/icons/pr_invinsiblewall_custom_a_up.png', description: 'Dummy description Cleric Skill 1 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Indestructible Protective Shield', icon: '../assets/icons/pr_invinsiblewall_custom_b_up.png', description: 'Dummy description Cleric Skill 1 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Indestructible Shield Wall', icon: '../assets/icons/pr_invinsiblewall_custom_a.png', description: 'Dummy description Cleric Skill 1 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Indestructible Protective Shield', icon: '../assets/icons/pr_invinsiblewall_custom_b.png', description: 'Dummy description Cleric Skill 1 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'clericSkill2',
                defaultSkill: {
                    name: 'Salvation',
                    icon: '../assets/icons/cbt_pr_secretprecept_g1.png',
                    description: 'Dummy default skill for Cleric Skill 2.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Swift Intervention', icon: '../assets/icons/pr_secretprecept_custom_a_up.png', description: 'Dummy description Cleric Skill 2 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Guarding Intervention', icon: '../assets/icons/pr_secretprecept_custom_b_up.png', description: 'Dummy description Cleric Skill 2 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Swift Intervention', icon: '../assets/icons/pr_secretprecept_custom_a.png', description: 'Dummy description Cleric Skill 2 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Guarding Intervention', icon: '../assets/icons/pr_secretprecept_custom_b.png', description: 'Dummy description Cleric Skill 2 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'clericSkill3',
                defaultSkill: {
                    name: 'Flash of Recovery',
                    icon: '../assets/icons/cbt_pr_firstaid_g1.png',
                    description: 'Dummy default skill for Cleric Skill 3.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Ray of Restoration', icon: '../assets/icons/pr_firstaid_custom_a_up.png', description: 'Dummy description Cleric Skill 3 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Restoration Strike', icon: '../assets/icons/pr_firstaid_custom_b_up.png', description: 'Dummy description Cleric Skill 3 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Ray of Restoration', icon: '../assets/icons/pr_firstaid_custom_a.png', description: 'Dummy description Cleric Skill 3 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Restoration Strike', icon: '../assets/icons/pr_firstaid_custom_b.png', description: 'Dummy description Cleric Skill 3 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'clericSkill4',
                defaultSkill: {
                    name: 'Divine Spark',
                    icon: '../assets/icons/cbt_pr_divinespark_g1.png',
                    description: 'Dummy default skill for Cleric Skill 4.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Discharge Paralysis', icon: '../assets/icons/pr_divinespark_custom_a_up.png', description: 'Dummy description Cleric Skill 4 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Chain Discharge', icon: '../assets/icons/pr_divinespark_custom_b_up.png', description: 'Dummy description Cleric Skill 4 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Discharge Paralysis', icon: '../assets/icons/pr_divinespark_custom_a.png', description: 'Dummy description Cleric Skill 4 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Chain Discharge', icon: '../assets/icons/pr_divinespark_custom_b.png', description: 'Dummy description Cleric Skill 4 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'clericSkill5',
                defaultSkill: {
                    name: 'Divine Touch',
                    icon: '../assets/icons/cbt_pr_divinetouch_g1.png',
                    description: 'Dummy default skill for Cleric Skill 5.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: null,
                        type2: { name: '(Improved) Boosted Thunder', icon: '../assets/icons/pr_divinetouch_custom_b_up.png', description: 'Dummy description Cleric Skill 5 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Chain Lightning', icon: '../assets/icons/pr_divinetouch_custom_c_up.png', description: 'Dummy description Cleric Skill 5 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Thunder', icon: '../assets/icons/pr_soniceruption_custom_a.png', description: 'Dummy description Cleric Skill 5 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Boosted Thunder', icon: '../assets/icons/pr_divinetouch_custom_b.png', description: 'Dummy description Cleric Skill 5 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Chain Lightning', icon: '../assets/icons/pr_divinetouch_custom_b.png', description: 'Dummy description Cleric Skill 5 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'clericSkill6',
                defaultSkill: {
                    name: 'Light of Recovery',
                    icon: '../assets/icons/cbt_pr_emergentheal_g1.png',
                    description: 'Dummy default skill for Cleric Skill 6.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Miracle Healing', icon: '../assets/icons/pr_emergentheal_custom_a_up.png', description: 'Dummy description Cleric Skill 6 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Hand of Healing', icon: '../assets/icons/pr_emergentheal_custom_b_up.png', description: 'Dummy description Cleric Skill 6 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Miracle Healing', icon: '../assets/icons/pr_emergentheal_custom_a.png', description: 'Dummy description Cleric Skill 6 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Hand of Healing', icon: '../assets/icons/pr_emergentheal_custom_b.png', description: 'Dummy description Cleric Skill 6 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            }
        ],
        chanter: [
            {
                key: 'chanterSkill1',
                defaultSkill: {
                    name: 'Inescapable Judgment',
                    icon: '../assets/icons/cbt_ch_mortalstrike_g1.png',
                    description: 'Dummy default skill for Chanter Skill 1.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Penetrating Wave', icon: '../assets/icons/ch_mortalstrike_custom_a_up.png', description: 'Dummy description Chanter Skill 1 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Blind Breakthrough', icon: '../assets/icons/ch_mortalstrike_custom_b_up.png', description: 'Dummy description Chanter Skill 1 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Penetrating Wave', icon: '../assets/icons/ch_mortalstrike_custom_a.png', description: 'Dummy description Chanter Skill 1 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Blind Breakthrough', icon: '../assets/icons/ch_mortalstrike_custom_b.png', description: 'Dummy description Chanter Skill 1 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'chanterSkill2',
                defaultSkill: {
                    name: 'Seismic Crash',
                    icon: '../assets/icons/live_ch_presssmash_g1.png',
                    description: 'Dummy default skill for Chanter Skill 2.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Seismic Blast', icon: '../assets/icons/ch_presssmash_custom_a_up.png', description: 'Dummy description Chanter Skill 2 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Seismic Termination', icon: '../assets/icons/ch_presssmash_custom_b_up.png', description: 'Dummy description Chanter Skill 2 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Seismic Blast', icon: '../assets/icons/ch_presssmash_custom_a.png', description: 'Dummy description Chanter Skill 2 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Seismic Termination', icon: '../assets/icons/ch_presssmash_custom_b.png', description: 'Dummy description Chanter Skill 2 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'chanterSkill3',
                defaultSkill: {
                    name: 'Recovery Magic',
                    icon: '../assets/icons/live_ch_stigma_recoverword_g1.png',
                    description: 'Dummy default skill for Chanter Skill 3.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Dissolution Spell', icon: '../assets/icons/ch_recoverword_custom_a_up.png', description: 'Dummy description Chanter Skill 3 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Protection Spell', icon: '../assets/icons/ch_recoverword_custom_b_up.png', description: 'Dummy description Chanter Skill 3 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Dissolution Spell', icon: '../assets/icons/ch_recoverword_custom_a.png', description: 'Dummy description Chanter Skill 3 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Protection Spell', icon: '../assets/icons/ch_recoverword_custom_b.png', description: 'Dummy description Chanter Skill 3 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'chanterSkill4',
                defaultSkill: {
                    name: 'Resonance Attack',
                    icon: '../assets/icons/cbt_ch_sonicgenoside_g1.png',
                    description: 'Dummy default skill for Chanter Skill 4.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: null,
                        type2: { name: '(Improved) Boosted Resonance Disruption', icon: '../assets/icons/ch_sonicgenoside_custom_b_up.png', description: 'Dummy description Chanter Skill 4 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Second Resonance Slash', icon: '../assets/icons/ch_sonicgenoside_custom_c_up.png', description: 'Dummy description Chanter Skill 4 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Resonance Disruption', icon: '../assets/icons/ch_sonicgenoside_custom_a.png', description: 'Dummy description Chanter Skill 4 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Boosted Resonance Disruption', icon: '../assets/icons/ch_sonicgenoside_custom_b.png', description: 'Dummy description Chanter Skill 4 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Second Resonance Slash', icon: '../assets/icons/ch_sonicgenoside_custom_c.png', description: 'Dummy description Chanter Skill 4 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'chanterSkill5',
                defaultSkill: {
                    name: 'Chain Strike',
                    icon: '../assets/icons/ch_rapidthrust_g1.png',
                    description: 'Dummy default skill for Chanter Skill 5.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Chain Decapitation', icon: '../assets/icons/ch_rapidthrust_custom_a_up.png', description: 'Dummy description Chanter Skill 5 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Blind Pursuit', icon: '../assets/icons/ch_rapidthrust_custom_b_up.png', description: 'Dummy description Chanter Skill 5 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Chain Decapitation', icon: '../assets/icons/ch_rapidthrust_custom_a.png', description: 'Dummy description Chanter Skill 5 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Blind Pursuit', icon: '../assets/icons/ch_rapidthrust_custom_b.png', description: 'Dummy description Chanter Skill 5 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'chanterSkill6',
                defaultSkill: {
                    name: 'Protection Zone',
                    icon: '../assets/icons/live_ch_protectself_g8.png',
                    description: 'Dummy default skill for Chanter Skill 6.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Shelter of Regeneration', icon: '../assets/icons/ev_ch_protectself_custom_a_up.png', description: 'Dummy description Chanter Skill 6 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Shelter of Resistance', icon: '../assets/icons/ev_ch_protectself_custom_b_up.png', description: 'Dummy description Chanter Skill 6 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Shelter of Regeneration', icon: '../assets/icons/ev_ch_protectself_custom_a.png', description: 'Dummy description Chanter Skill 6 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Shelter of Resistance', icon: '../assets/icons/ev_ch_protectself_custom_b.png', description: 'Dummy description Chanter Skill 6 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            }
        ],
        gunner: [
            {
                key: 'gunnerSkill1',
                defaultSkill: {
                    name: 'Gunner Skill 1 Default',
                    icon: '../assets/icons/live_gu_magicalstrength_g1.png',
                    description: 'Dummy default skill for Gunner Skill 1.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Magic\'s Blessing', icon: '../assets/icons/gu_magicalstrength_custom_a_up.png', description: 'Dummy description Gunner Skill 1 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Focused Magic', icon: '../assets/icons/gu_magicalstrength_custom_b_up.png', description: 'Dummy description Gunner Skill 1 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Magic\'s Blessing', icon: '../assets/icons/gu_magicalstrength_custom_a.png', description: 'Dummy description Gunner Skill 1 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Focused Magic', icon: '../assets/icons/gu_magicalstrength_custom_b.png', description: 'Dummy description Gunner Skill 1 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'gunnerSkill2',
                defaultSkill: {
                    name: 'Insert Magic Projectile',
                    icon: '../assets/icons/live_gu_firechainreload_g1.png',
                    description: 'Dummy default skill for Gunner Skill 2.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Load Cannonball', icon: '../assets/icons/gu_firechainreload_custom_a_up.png', description: 'Dummy description Gunner Skill 2 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Load Magic Projectile', icon: '../assets/icons/gu_firechainreload_custom_b_up.png', description: 'Dummy description Gunner Skill 2 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Load Cannonball', icon: '../assets/icons/gu_firechainreload_custom_a.png', description: 'Dummy description Gunner Skill 2 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Load Magic Projectile', icon: '../assets/icons/gu_firechainreload_custom_b.png', description: 'Dummy description Gunner Skill 2 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'gunnerSkill3',
                defaultSkill: {
                    name: 'Headshot',
                    icon: '../assets/icons/live_gu_foreheadsnipe_g1.png',
                    description: 'Dummy default skill for Gunner Skill 3.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Fire Head Throughshot', icon: '../assets/icons/gu_foreheadsnipe_custom_a_up.png', description: 'Dummy description Gunner Skill 3 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Concentrated Headshot', icon: '../assets/icons/gu_foreheadsnipe_custom_b_up.png', description: 'Dummy description Gunner Skill 3 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Fire Head Throughshot', icon: '../assets/icons/gu_foreheadsnipe_custom_a.png', description: 'Dummy description Gunner Skill 3 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Concentrated Headshot', icon: '../assets/icons/gu_foreheadsnipe_custom_b.png', description: 'Dummy description Gunner Skill 3 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'gunnerSkill4',
                defaultSkill: {
                    name: 'Snow Projectile',
                    icon: '../assets/icons/live_gu_iceballcannon_g1.png',
                    description: 'Dummy default skill for Gunner Skill 4.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Paralysing Projectile', icon: '../assets/icons/gu_iceballcannon_custom_a_up.png', description: 'Dummy description Gunner Skill 4 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Binding Projectile', icon: '../assets/icons/gu_iceballcannon_custom_b_up.png', description: 'Dummy description Gunner Skill 4 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Paralysing Projectile', icon: '../assets/icons/gu_iceballcannon_custom_a.png', description: 'Dummy description Gunner Skill 4 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Binding Projectile', icon: '../assets/icons/gu_iceballcannon_custom_b.png', description: 'Dummy description Gunner Skill 4 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'gunnerSkill5',
                defaultSkill: {
                    name: 'Restoration Volley',
                    icon: '../assets/icons/live_gu_drainattack_g1.png',
                    description: 'Dummy default skill for Gunner Skill 5.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: null,
                        type2: { name: '(Improved) Boosted Rapid Fire of Restoration', icon: '../assets/icons/gu_drainattack_custom_b_up.png', description: 'Dummy description Gunner Skill 5 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Gun Salute', icon: '../assets/icons/gu_drainattack_custom_c_up.png', description: 'Dummy description Gunner Skill 5 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Rapid Fire of Restoration', icon: '../assets/icons/gu_drainattack_custom_a.png', description: 'Dummy description Gunner Skill 5 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Boosted Rapid Fire of Restoration', icon: '../assets/icons/gu_drainattack_custom_b.png', description: 'Dummy description Gunner Skill 5 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Gun Salute', icon: '../assets/icons/gu_drainattack_custom_c.png', description: 'Dummy description Gunner Skill 5 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'gunnerSkill6',
                defaultSkill: {
                    name: 'Concentrated Cannon Shot',
                    icon: '../assets/icons/live_gu_snipingshot_g1.png',
                    description: 'Dummy default skill for Gunner Skill 6.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Gunner Skill 6 Type 1', icon: '../assets/icons/gu_snipingshot_custom_a_up.png', description: 'Dummy description Gunner Skill 6 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Gunner Skill 6 Type 2', icon: '../assets/icons/gu_snipingshot_custom_b_up.png', description: 'Dummy description Gunner Skill 6 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Gunner Skill 6 Type 1', icon: '../assets/icons/gu_snipingshot_custom_a.png', description: 'Dummy description Gunner Skill 6 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Gunner Skill 6 Type 2', icon: '../assets/icons/gu_snipingshot_custom_b.png', description: 'Dummy description Gunner Skill 6 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            }
        ],
        aethertech: [
            {
                key: 'aethertechSkill1',
                defaultSkill: {
                    name: 'Cannon Shot Riposte',
                    icon: '../assets/icons/ri_breakingattack_g1.png',
                    description: 'Dummy default skill for Aethertech Skill 1.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: null,
                        type2: { name: '(Improved) Aethertech Skill 1 Type 2', icon: '../assets/icons/ri_breakingattack_custom_b_up.png', description: 'Dummy description Aethertech Skill 1 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Aethertech Skill 1 Type 3', icon: '../assets/icons/ri_breakingattack_custom_c_up.png', description: 'Dummy description Aethertech Skill 1 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Counter Cannon Fire', icon: '../assets/icons/ri_breakingattack_custom_a.png', description: 'Dummy description Aethertech Skill 1 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Boosted Counter Cannon Fire', icon: '../assets/icons/ri_breakingattack_custom_b.png', description: 'Dummy description Aethertech Skill 1 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Large-scale Cannon Shot', icon: '../assets/icons/ri_breakingattack_custom_c.png', description: 'Dummy description Aethertech Skill 1 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'aethertechSkill2',
                defaultSkill: {
                    name: 'Protective Veil',
                    icon: '../assets/icons/ri_protectioncurtain_g1.png',
                    description: 'Dummy default skill for Aethertech Skill 2.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Emergency Shroud of Protection', icon: '../assets/icons/ri_protectioncurtain_custom_a_up.png', description: 'Dummy description Aethertech Skill 2 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Protective Shroud of Resistance', icon: '../assets/icons/ri_protectioncurtain_custom_b_up.png', description: 'Dummy description Aethertech Skill 2 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Emergency Shroud of Protection', icon: '../assets/icons/ri_protectioncurtain_custom_a.png', description: 'Dummy description Aethertech Skill 2 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Protective Shroud of Resistance', icon: '../assets/icons/ri_protectioncurtain_custom_b.png', description: 'Dummy description Aethertech Skill 2 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'aethertechSkill3',
                defaultSkill: {
                    name: 'Repeated Cannon Shot',
                    icon: '../assets/icons/ri_chainfire_g1.png',
                    description: 'Dummy default skill for Aethertech Skill 3.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Chain Shot', icon: '../assets/icons/ri_chainfire_custom_a_up.png', description: 'Dummy description Aethertech Skill 3 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Loaded Cannon Fire', icon: '../assets/icons/ri_chainfire_custom_b_up.png', description: 'Dummy description Aethertech Skill 3 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Chain Shot', icon: '../assets/icons/ri_chainfire_custom_a.png', description: 'Dummy description Aethertech Skill 3 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Loaded Cannon Fire', icon: '../assets/icons/ri_chainfire_custom_b.png', description: 'Dummy description Aethertech Skill 3 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'aethertechSkill4',
                defaultSkill: {
                    name: 'Silence Smash',
                    icon: '../assets/icons/ri_shockstrike_g1.png',
                    description: 'Dummy default skill for Aethertech Skill 4.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Heavy Silencing Blow', icon: '../assets/icons/ri_shockstrike_custom_a_up.png', description: 'Dummy description Aethertech Skill 4 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Silencing Cannon Fire', icon: '../assets/icons/ri_shockstrike_custom_b_up.png', description: 'Dummy description Aethertech Skill 4 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Heavy Silencing Blow', icon: '../assets/icons/ri_shockstrike_custom_a.png', description: 'Dummy description Aethertech Skill 4 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Silencing Cannon Fire', icon: '../assets/icons/ri_shockstrike_custom_b.png', description: 'Dummy description Aethertech Skill 4 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'aethertechSkill5',
                defaultSkill: {
                    name: 'Idium Strike',
                    icon: '../assets/icons/ri_chargedpunch_g1.png',
                    description: 'Dummy default skill for Aethertech Skill 5.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Idium Blow', icon: '../assets/icons/ri_chargedpunch_1_custom_a_up.png', description: 'Dummy description Aethertech Skill 5 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Idium Surface Strike', icon: '../assets/icons/ri_chargedpunch_1_custom_b_up.png', description: 'Dummy description Aethertech Skill 5 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Idium Blow', icon: '../assets/icons/ri_chargedpunch_1_custom_a.png', description: 'Dummy description Aethertech Skill 5 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Idium Surface Strike', icon: '../assets/icons/ri_chargedpunch_1_custom_b.png', description: 'Dummy description Aethertech Skill 5 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'aethertechSkill6',
                defaultSkill: {
                    name: 'Overcoming Limits',
                    icon: '../assets/icons/ri_highendoverdrive_g1.png',
                    description: 'Dummy default skill for Aethertech Skill 6.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Extreme Effort', icon: '../assets/icons/ev_ri_highendoverdrive_custom_a_up.png', description: 'Dummy description Aethertech Skill 6 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Limitless Power', icon: '../assets/icons/ev_ri_highendoverdrive_custom_b_up.png', description: 'Dummy description Aethertech Skill 6 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Extreme Effort', icon: '../assets/icons/ev_ri_highendoverdrive_custom_a.png', description: 'Dummy description Aethertech Skill 6 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Limitless Power', icon: '../assets/icons/ev_ri_highendoverdrive_custom_b.png', description: 'Dummy description Aethertech Skill 6 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            }
        ],
        bard: [
            {
                key: 'bardSkill1',
                defaultSkill: {
                    name: 'Harmony of Destruction',
                    icon: '../assets/icons/live_ba_songofmentalic_g1.png',
                    description: 'Dummy default skill for Bard Skill 1.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Ironclad Tank Harmony', icon: '../assets/icons/ba_songofmentalic_custom_a_up.png', description: 'Dummy description Bard Skill 1 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Harmony of Vengeance', icon: '../assets/icons/ba_songofmentalic_custom_b_up.png', description: 'Dummy description Bard Skill 1 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Ironclad Tank Harmony', icon: '../assets/icons/ba_songofmentalic_custom_a.png', description: 'Dummy description Bard Skill 1 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Harmony of Vengeance', icon: '../assets/icons/ba_songofmentalic_custom_b.png', description: 'Dummy description Bard Skill 1 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'bardSkill2',
                defaultSkill: {
                    name: 'Gentle Echo',
                    icon: '../assets/icons/live_ar_songofheal_g1.png',
                    description: 'Dummy default skill for Bard Skill 2.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Soft Resonance', icon: '../assets/icons/ba_songofheal_custom_a_up.png', description: 'Dummy description Bard Skill 2 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Soft Reverb', icon: '../assets/icons/ba_songofheal_custom_b_up.png', description: 'Dummy description Bard Skill 2 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Soft Resonance', icon: '../assets/icons/ba_songofheal_custom_a.png', description: 'Dummy description Bard Skill 2 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Soft Reverb', icon: '../assets/icons/ba_songofheal_custom_b.png', description: 'Dummy description Bard Skill 2 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'bardSkill3',
                defaultSkill: {
                    name: 'Symphony of Wrath',
                    icon: '../assets/icons/live_ba_songofanger_g1.png',
                    description: 'Dummy default skill for Bard Skill 3.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Symphony of Rage', icon: '../assets/icons/ba_songofanger_custom_a_up.png', description: 'Dummy description Bard Skill 3 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Aether Symphony', icon: '../assets/icons/ba_songofanger_custom_b_up.png', description: 'Dummy description Bard Skill 3 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Symphony of Rage', icon: '../assets/icons/ba_songofanger_custom_a.png', description: 'Dummy description Bard Skill 3 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Aether Symphony', icon: '../assets/icons/ba_songofanger_custom_b.png', description: 'Dummy description Bard Skill 3 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'bardSkill4',
                defaultSkill: {
                    name: 'Illusion Variation',
                    icon: '../assets/icons/live_ba_requiem_g1.png',
                    description: 'Dummy default skill for Bard Skill 4.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Illusion Ensemble', icon: '../assets/icons/ba_requiem_1_custom_a_up.png', description: 'Dummy description Bard Skill 4 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Illusion Symphony', icon: '../assets/icons/ba_requiem_1_custom_b_up.png', description: 'Dummy description Bard Skill 4 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Illusion Ensemble', icon: '../assets/icons/ba_requiem_1_custom_a.png', description: 'Dummy description Bard Skill 4 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Illusion Symphony', icon: '../assets/icons/ba_requiem_1_custom_b.png', description: 'Dummy description Bard Skill 4 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'bardSkill5',
                defaultSkill: {
                    name: 'Storm Requiem',
                    icon: '../assets/icons/live_ba_songofgust_g1.png',
                    description: 'Dummy default skill for Bard Skill 5.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: null,
                        type2: { name: '(Improved) Boosted Storm Variation', icon: '../assets/icons/ba_songofgust_custom_b_up.png', description: 'Dummy description Bard Skill 5 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Storm Harmony', icon: '../assets/icons/ba_songofgust_custom_c_up.png', description: 'Dummy description Bard Skill 5 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Storm Variation', icon: '../assets/icons/ba_songofgust_custom_a.png', description: 'Dummy description Bard Skill 5 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Boosted Storm Variation', icon: '../assets/icons/ba_songofgust_custom_b.png', description: 'Dummy description Bard Skill 5 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Storm Harmony', icon: '../assets/icons/ba_songofgust_custom_c.png', description: 'Dummy description Bard Skill 5 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'bardSkill6',
                defaultSkill: {
                    name: 'Snowflower Melody',
                    icon: '../assets/icons/live_ba_sanctuary_g1.png',
                    description: 'Dummy default skill for Bard Skill 6.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Purifying Snowflower Melody', icon: '../assets/icons/ba_sanctuary_custom_a_up.png', description: 'Dummy description Bard Skill 6 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Protective Snowflower Melody', icon: '../assets/icons/ba_sanctuary_custom_b_up.png', description: 'Dummy description Bard Skill 6 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Purifying Snowflower Melody', icon: '../assets/icons/ba_sanctuary_custom_a.png', description: 'Dummy description Bard Skill 6 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Protective Snowflower Melody', icon: '../assets/icons/ba_sanctuary_custom_b.png', description: 'Dummy description Bard Skill 6 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            }
        ],
        painter: [
            {
                key: 'painterSkill1',
                defaultSkill: {
                    name: 'Band of Rage',
                    icon: '../assets/icons/pa_paintshooter_g1.png',
                    description: 'Dummy default skill for Painter Skill 1.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Band of Fierceness', icon: '../assets/icons/pa_paintshooter_custom_a_up.png', description: 'Dummy description Painter Skill 1 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Band of Forbearance', icon: '../assets/icons/pa_paintshooter_custom_b_up.png', description: 'Dummy description Painter Skill 1 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Band of Rage', icon: '../assets/icons/pa_paintshooter_custom_a.png', description: 'Dummy description Painter Skill 1 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Band of Forbearance', icon: '../assets/icons/pa_paintshooter_custom_b.png', description: 'Dummy description Painter Skill 1 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'painterSkill2',
                defaultSkill: {
                    name: 'Time Holding',
                    icon: '../assets/icons/pa_viscidpaintshooter_g1.png',
                    description: 'Dummy default skill for Painter Skill 2.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Gravity Binding', icon: '../assets/icons/pa_viscidpaintshooter_custom_a_up.png', description: 'Dummy description Painter Skill 2 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Time Binding', icon: '../assets/icons/pa_viscidpaintshooter_custom_b_up.png', description: 'Dummy description Painter Skill 2 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Gravity Binding', icon: '../assets/icons/pa_viscidpaintshooter_custom_a.png', description: 'Dummy description Painter Skill 2 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Time Binding', icon: '../assets/icons/pa_viscidpaintshooter_custom_b.png', description: 'Dummy description Painter Skill 2 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'painterSkill3',
                defaultSkill: {
                    name: 'Colour Immersion',
                    icon: '../assets/icons/pa_sprinklepaint_g1.png',
                    description: 'Dummy default skill for Painter Skill 3.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Sustained Colour Immersion', icon: '../assets/icons/pa_sprinklepaint_custom_a_up.png', description: 'Dummy description Painter Skill 3 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Colour Explosion', icon: '../assets/icons/pa_sprinklepaint_custom_b_up.png', description: 'Dummy description Painter Skill 3 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Sustained Colour Immersion', icon: '../assets/icons/pa_sprinklepaint_custom_a.png', description: 'Dummy description Painter Skill 3 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Colour Explosion', icon: '../assets/icons/pa_sprinklepaint_custom_b.png', description: 'Dummy description Painter Skill 3 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'painterSkill4',
                defaultSkill: {
                    name: 'Surprise Attack',
                    icon: '../assets/icons/pa_scaringatk_g1.png',
                    description: 'Dummy default skill for Painter Skill 4.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Sudden Smash', icon: '../assets/icons/pa_scaringatk_custom_a_up.png', description: 'Dummy description Painter Skill 4 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Shocking Blast', icon: '../assets/icons/pa_scaringatk_custom_b_up.png', description: 'Dummy description Painter Skill 4 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Sudden Smash', icon: '../assets/icons/pa_scaringatk_custom_a.png', description: 'Dummy description Painter Skill 4 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Shocking Blast', icon: '../assets/icons/pa_scaringatk_custom_b.png', description: 'Dummy description Painter Skill 4 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'painterSkill5',
                defaultSkill: {
                    name: 'Portrait of Resurrection',
                    icon: '../assets/icons/pa_paintcovering_g1.png',
                    description: 'Dummy default skill for Painter Skill 5.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Colour of Transcendence', icon: '../assets/icons/pa_paintcovering_custom_a_up.png', description: 'Dummy description Painter Skill 5 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Colour of Resistance', icon: '../assets/icons/pa_paintcovering_custom_b_up.png', description: 'Dummy description Painter Skill 5 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Colour of Transcendence', icon: '../assets/icons/pa_paintcovering_custom_a.png', description: 'Dummy description Painter Skill 5 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Colour of Resistance', icon: '../assets/icons/pa_paintcovering_custom_b.png', description: 'Dummy description Painter Skill 5 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Colour of Agility', icon: '../assets/icons/pa_paintcovering_custom_c.png', description: 'Dummy description Painter Skill 5 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'painterSkill6',
                defaultSkill: {
                    name: 'Colour Boost',
                    icon: '../assets/icons/pa_paintshower_g1.png',
                    description: 'Dummy default skill for Painter Skill 6.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Painter Skill 6 Type 1', icon: '../assets/icons/pa_paintshower_custom_a_up.png', description: 'Dummy description Painter Skill 6 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Painter Skill 6 Type 2', icon: '../assets/icons/pa_paintshower_custom_b_up.png', description: 'Dummy description Painter Skill 6 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Painter Skill 6 Type 1', icon: '../assets/icons/pa_paintshower_custom_a.png', description: 'Dummy description Painter Skill 6 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Painter Skill 6 Type 2', icon: '../assets/icons/pa_paintshower_custom_b.png', description: 'Dummy description Painter Skill 6 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            }
        ]
    };

    global.DAEVANION_LOCKED_ICON = LOCKED_ICON;
    global.DAEVANION_SKILLS_BY_CLASS = data;
})(window);