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
                    name: 'Assassin Skill 1 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Assassin Skill 1.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Assassin Skill 1 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Assassin Skill 1 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Assassin Skill 1 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Assassin Skill 1 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Assassin Skill 1 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Assassin Skill 1 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Assassin Skill 1 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Assassin Skill 1 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'assassinSkill2',
                defaultSkill: {
                    name: 'Assassin Skill 2 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Assassin Skill 2.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: null,
                        type2: { name: '(Improved) Assassin Skill 2 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Assassin Skill 2 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Assassin Skill 2 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Assassin Skill 2 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Assassin Skill 2 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Assassin Skill 2 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Assassin Skill 2 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Assassin Skill 2 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Assassin Skill 2 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Assassin Skill 2 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'assassinSkill3',
                defaultSkill: {
                    name: 'Assassin Skill 3 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Assassin Skill 3.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Assassin Skill 3 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Assassin Skill 3 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Assassin Skill 3 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Assassin Skill 3 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Assassin Skill 3 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Assassin Skill 3 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Assassin Skill 3 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Assassin Skill 3 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'assassinSkill4',
                defaultSkill: {
                    name: 'Assassin Skill 4 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Assassin Skill 4.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Assassin Skill 4 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Assassin Skill 4 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Assassin Skill 4 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Assassin Skill 4 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Assassin Skill 4 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Assassin Skill 4 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Assassin Skill 4 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Assassin Skill 4 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'assassinSkill5',
                defaultSkill: {
                    name: 'Assassin Skill 5 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Assassin Skill 5.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Assassin Skill 5 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Assassin Skill 5 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Assassin Skill 5 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Assassin Skill 5 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Assassin Skill 5 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Assassin Skill 5 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Assassin Skill 5 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Assassin Skill 5 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'assassinSkill6',
                defaultSkill: {
                    name: 'Assassin Skill 6 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Assassin Skill 6.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Assassin Skill 6 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Assassin Skill 6 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Assassin Skill 6 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Assassin Skill 6 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: null
                    },
                    normal: {
                        type1: { name: 'Assassin Skill 6 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Assassin Skill 6 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Assassin Skill 6 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Assassin Skill 6 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
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
                    name: 'Ranger Skill 1 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Ranger Skill 1.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Ranger Skill 1 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 1 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Ranger Skill 1 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 1 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Ranger Skill 1 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 1 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Ranger Skill 1 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 1 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Ranger Skill 1 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 1 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Ranger Skill 1 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 1 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'rangerSkill2',
                defaultSkill: {
                    name: 'Ranger Skill 2 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Ranger Skill 2.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Ranger Skill 2 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 2 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Ranger Skill 2 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 2 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Ranger Skill 2 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 2 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Ranger Skill 2 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 2 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Ranger Skill 2 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 2 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Ranger Skill 2 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 2 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'rangerSkill3',
                defaultSkill: {
                    name: 'Ranger Skill 3 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Ranger Skill 3.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Ranger Skill 3 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 3 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Ranger Skill 3 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 3 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Ranger Skill 3 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 3 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Ranger Skill 3 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 3 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Ranger Skill 3 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 3 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Ranger Skill 3 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 3 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'rangerSkill4',
                defaultSkill: {
                    name: 'Ranger Skill 4 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Ranger Skill 4.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Ranger Skill 4 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 4 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Ranger Skill 4 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 4 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Ranger Skill 4 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 4 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Ranger Skill 4 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 4 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Ranger Skill 4 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 4 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Ranger Skill 4 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 4 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'rangerSkill5',
                defaultSkill: {
                    name: 'Ranger Skill 5 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Ranger Skill 5.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Ranger Skill 5 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 5 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Ranger Skill 5 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 5 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Ranger Skill 5 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 5 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Ranger Skill 5 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 5 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Ranger Skill 5 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 5 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Ranger Skill 5 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 5 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'rangerSkill6',
                defaultSkill: {
                    name: 'Ranger Skill 6 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Ranger Skill 6.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Ranger Skill 6 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 6 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Ranger Skill 6 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 6 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Ranger Skill 6 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 6 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Ranger Skill 6 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 6 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Ranger Skill 6 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 6 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Ranger Skill 6 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Ranger Skill 6 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            }
        ],
        sorcerer: [
            {
                key: 'sorcererSkill1',
                defaultSkill: {
                    name: 'Sorcerer Skill 1 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Sorcerer Skill 1.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Sorcerer Skill 1 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 1 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Sorcerer Skill 1 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 1 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Sorcerer Skill 1 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 1 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Sorcerer Skill 1 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 1 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Sorcerer Skill 1 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 1 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Sorcerer Skill 1 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 1 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'sorcererSkill2',
                defaultSkill: {
                    name: 'Sorcerer Skill 2 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Sorcerer Skill 2.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Sorcerer Skill 2 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 2 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Sorcerer Skill 2 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 2 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Sorcerer Skill 2 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 2 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Sorcerer Skill 2 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 2 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Sorcerer Skill 2 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 2 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Sorcerer Skill 2 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 2 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'sorcererSkill3',
                defaultSkill: {
                    name: 'Sorcerer Skill 3 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Sorcerer Skill 3.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Sorcerer Skill 3 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 3 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Sorcerer Skill 3 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 3 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Sorcerer Skill 3 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 3 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Sorcerer Skill 3 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 3 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Sorcerer Skill 3 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 3 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Sorcerer Skill 3 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 3 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'sorcererSkill4',
                defaultSkill: {
                    name: 'Sorcerer Skill 4 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Sorcerer Skill 4.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Sorcerer Skill 4 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 4 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Sorcerer Skill 4 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 4 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Sorcerer Skill 4 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 4 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Sorcerer Skill 4 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 4 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Sorcerer Skill 4 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 4 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Sorcerer Skill 4 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 4 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'sorcererSkill5',
                defaultSkill: {
                    name: 'Sorcerer Skill 5 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Sorcerer Skill 5.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Sorcerer Skill 5 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 5 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Sorcerer Skill 5 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 5 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Sorcerer Skill 5 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 5 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Sorcerer Skill 5 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 5 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Sorcerer Skill 5 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 5 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Sorcerer Skill 5 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 5 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'sorcererSkill6',
                defaultSkill: {
                    name: 'Sorcerer Skill 6 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Sorcerer Skill 6.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Sorcerer Skill 6 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 6 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Sorcerer Skill 6 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 6 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Sorcerer Skill 6 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 6 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Sorcerer Skill 6 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 6 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Sorcerer Skill 6 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 6 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Sorcerer Skill 6 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Sorcerer Skill 6 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            }
        ],
        spiritmaster: [
            {
                key: 'spiritmasterSkill1',
                defaultSkill: {
                    name: 'Spiritmaster Skill 1 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Spiritmaster Skill 1.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Spiritmaster Skill 1 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 1 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Spiritmaster Skill 1 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 1 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Spiritmaster Skill 1 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 1 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Spiritmaster Skill 1 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 1 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Spiritmaster Skill 1 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 1 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Spiritmaster Skill 1 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 1 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'spiritmasterSkill2',
                defaultSkill: {
                    name: 'Spiritmaster Skill 2 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Spiritmaster Skill 2.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Spiritmaster Skill 2 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 2 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Spiritmaster Skill 2 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 2 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Spiritmaster Skill 2 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 2 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Spiritmaster Skill 2 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 2 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Spiritmaster Skill 2 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 2 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Spiritmaster Skill 2 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 2 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'spiritmasterSkill3',
                defaultSkill: {
                    name: 'Spiritmaster Skill 3 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Spiritmaster Skill 3.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Spiritmaster Skill 3 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 3 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Spiritmaster Skill 3 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 3 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Spiritmaster Skill 3 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 3 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Spiritmaster Skill 3 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 3 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Spiritmaster Skill 3 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 3 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Spiritmaster Skill 3 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 3 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'spiritmasterSkill4',
                defaultSkill: {
                    name: 'Spiritmaster Skill 4 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Spiritmaster Skill 4.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Spiritmaster Skill 4 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 4 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Spiritmaster Skill 4 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 4 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Spiritmaster Skill 4 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 4 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Spiritmaster Skill 4 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 4 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Spiritmaster Skill 4 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 4 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Spiritmaster Skill 4 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 4 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'spiritmasterSkill5',
                defaultSkill: {
                    name: 'Spiritmaster Skill 5 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Spiritmaster Skill 5.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Spiritmaster Skill 5 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 5 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Spiritmaster Skill 5 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 5 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Spiritmaster Skill 5 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 5 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Spiritmaster Skill 5 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 5 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Spiritmaster Skill 5 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 5 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Spiritmaster Skill 5 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 5 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'spiritmasterSkill6',
                defaultSkill: {
                    name: 'Spiritmaster Skill 6 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Spiritmaster Skill 6.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Spiritmaster Skill 6 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 6 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Spiritmaster Skill 6 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 6 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Spiritmaster Skill 6 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 6 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Spiritmaster Skill 6 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 6 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Spiritmaster Skill 6 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 6 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Spiritmaster Skill 6 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Spiritmaster Skill 6 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            }
        ],
        cleric: [
            {
                key: 'clericSkill1',
                defaultSkill: {
                    name: 'Cleric Skill 1 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Cleric Skill 1.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Cleric Skill 1 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 1 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Cleric Skill 1 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 1 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Cleric Skill 1 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 1 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Cleric Skill 1 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 1 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Cleric Skill 1 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 1 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Cleric Skill 1 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 1 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'clericSkill2',
                defaultSkill: {
                    name: 'Cleric Skill 2 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Cleric Skill 2.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Cleric Skill 2 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 2 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Cleric Skill 2 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 2 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Cleric Skill 2 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 2 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Cleric Skill 2 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 2 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Cleric Skill 2 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 2 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Cleric Skill 2 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 2 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'clericSkill3',
                defaultSkill: {
                    name: 'Cleric Skill 3 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Cleric Skill 3.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Cleric Skill 3 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 3 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Cleric Skill 3 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 3 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Cleric Skill 3 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 3 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Cleric Skill 3 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 3 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Cleric Skill 3 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 3 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Cleric Skill 3 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 3 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'clericSkill4',
                defaultSkill: {
                    name: 'Cleric Skill 4 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Cleric Skill 4.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Cleric Skill 4 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 4 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Cleric Skill 4 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 4 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Cleric Skill 4 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 4 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Cleric Skill 4 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 4 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Cleric Skill 4 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 4 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Cleric Skill 4 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 4 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'clericSkill5',
                defaultSkill: {
                    name: 'Cleric Skill 5 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Cleric Skill 5.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Cleric Skill 5 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 5 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Cleric Skill 5 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 5 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Cleric Skill 5 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 5 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Cleric Skill 5 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 5 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Cleric Skill 5 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 5 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Cleric Skill 5 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 5 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'clericSkill6',
                defaultSkill: {
                    name: 'Cleric Skill 6 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Cleric Skill 6.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Cleric Skill 6 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 6 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Cleric Skill 6 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 6 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Cleric Skill 6 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 6 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Cleric Skill 6 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 6 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Cleric Skill 6 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 6 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Cleric Skill 6 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Cleric Skill 6 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            }
        ],
        chanter: [
            {
                key: 'chanterSkill1',
                defaultSkill: {
                    name: 'Chanter Skill 1 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Chanter Skill 1.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Chanter Skill 1 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 1 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Chanter Skill 1 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 1 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Chanter Skill 1 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 1 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Chanter Skill 1 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 1 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Chanter Skill 1 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 1 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Chanter Skill 1 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 1 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'chanterSkill2',
                defaultSkill: {
                    name: 'Chanter Skill 2 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Chanter Skill 2.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Chanter Skill 2 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 2 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Chanter Skill 2 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 2 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Chanter Skill 2 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 2 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Chanter Skill 2 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 2 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Chanter Skill 2 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 2 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Chanter Skill 2 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 2 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'chanterSkill3',
                defaultSkill: {
                    name: 'Chanter Skill 3 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Chanter Skill 3.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Chanter Skill 3 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 3 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Chanter Skill 3 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 3 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Chanter Skill 3 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 3 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Chanter Skill 3 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 3 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Chanter Skill 3 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 3 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Chanter Skill 3 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 3 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'chanterSkill4',
                defaultSkill: {
                    name: 'Chanter Skill 4 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Chanter Skill 4.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Chanter Skill 4 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 4 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Chanter Skill 4 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 4 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Chanter Skill 4 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 4 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Chanter Skill 4 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 4 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Chanter Skill 4 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 4 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Chanter Skill 4 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 4 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'chanterSkill5',
                defaultSkill: {
                    name: 'Chanter Skill 5 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Chanter Skill 5.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Chanter Skill 5 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 5 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Chanter Skill 5 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 5 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Chanter Skill 5 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 5 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Chanter Skill 5 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 5 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Chanter Skill 5 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 5 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Chanter Skill 5 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 5 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'chanterSkill6',
                defaultSkill: {
                    name: 'Chanter Skill 6 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Chanter Skill 6.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Chanter Skill 6 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 6 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Chanter Skill 6 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 6 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Chanter Skill 6 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 6 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Chanter Skill 6 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 6 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Chanter Skill 6 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 6 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Chanter Skill 6 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Chanter Skill 6 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            }
        ],
        aethertech: [
            {
                key: 'aethertechSkill1',
                defaultSkill: {
                    name: 'Aethertech Skill 1 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Aethertech Skill 1.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Aethertech Skill 1 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 1 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Aethertech Skill 1 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 1 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Aethertech Skill 1 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 1 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Aethertech Skill 1 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 1 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Aethertech Skill 1 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 1 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Aethertech Skill 1 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 1 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'aethertechSkill2',
                defaultSkill: {
                    name: 'Aethertech Skill 2 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Aethertech Skill 2.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Aethertech Skill 2 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 2 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Aethertech Skill 2 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 2 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Aethertech Skill 2 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 2 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Aethertech Skill 2 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 2 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Aethertech Skill 2 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 2 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Aethertech Skill 2 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 2 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'aethertechSkill3',
                defaultSkill: {
                    name: 'Aethertech Skill 3 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Aethertech Skill 3.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Aethertech Skill 3 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 3 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Aethertech Skill 3 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 3 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Aethertech Skill 3 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 3 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Aethertech Skill 3 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 3 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Aethertech Skill 3 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 3 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Aethertech Skill 3 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 3 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'aethertechSkill4',
                defaultSkill: {
                    name: 'Aethertech Skill 4 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Aethertech Skill 4.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Aethertech Skill 4 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 4 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Aethertech Skill 4 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 4 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Aethertech Skill 4 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 4 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Aethertech Skill 4 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 4 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Aethertech Skill 4 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 4 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Aethertech Skill 4 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 4 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'aethertechSkill5',
                defaultSkill: {
                    name: 'Aethertech Skill 5 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Aethertech Skill 5.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Aethertech Skill 5 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 5 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Aethertech Skill 5 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 5 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Aethertech Skill 5 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 5 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Aethertech Skill 5 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 5 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Aethertech Skill 5 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 5 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Aethertech Skill 5 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 5 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'aethertechSkill6',
                defaultSkill: {
                    name: 'Aethertech Skill 6 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Aethertech Skill 6.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Aethertech Skill 6 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 6 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Aethertech Skill 6 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 6 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Aethertech Skill 6 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 6 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Aethertech Skill 6 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 6 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Aethertech Skill 6 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 6 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Aethertech Skill 6 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Aethertech Skill 6 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
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
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Gunner Skill 1.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Gunner Skill 1 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 1 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Gunner Skill 1 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 1 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Gunner Skill 1 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 1 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Gunner Skill 1 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 1 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Gunner Skill 1 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 1 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Gunner Skill 1 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 1 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'gunnerSkill2',
                defaultSkill: {
                    name: 'Gunner Skill 2 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Gunner Skill 2.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Gunner Skill 2 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 2 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Gunner Skill 2 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 2 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Gunner Skill 2 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 2 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Gunner Skill 2 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 2 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Gunner Skill 2 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 2 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Gunner Skill 2 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 2 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'gunnerSkill3',
                defaultSkill: {
                    name: 'Gunner Skill 3 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Gunner Skill 3.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Gunner Skill 3 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 3 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Gunner Skill 3 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 3 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Gunner Skill 3 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 3 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Gunner Skill 3 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 3 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Gunner Skill 3 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 3 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Gunner Skill 3 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 3 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'gunnerSkill4',
                defaultSkill: {
                    name: 'Gunner Skill 4 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Gunner Skill 4.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Gunner Skill 4 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 4 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Gunner Skill 4 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 4 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Gunner Skill 4 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 4 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Gunner Skill 4 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 4 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Gunner Skill 4 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 4 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Gunner Skill 4 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 4 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'gunnerSkill5',
                defaultSkill: {
                    name: 'Gunner Skill 5 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Gunner Skill 5.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Gunner Skill 5 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 5 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Gunner Skill 5 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 5 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Gunner Skill 5 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 5 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Gunner Skill 5 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 5 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Gunner Skill 5 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 5 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Gunner Skill 5 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 5 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'gunnerSkill6',
                defaultSkill: {
                    name: 'Gunner Skill 6 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Gunner Skill 6.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Gunner Skill 6 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 6 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Gunner Skill 6 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 6 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Gunner Skill 6 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 6 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Gunner Skill 6 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 6 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Gunner Skill 6 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 6 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Gunner Skill 6 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Gunner Skill 6 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            }
        ],
        bard: [
            {
                key: 'bardSkill1',
                defaultSkill: {
                    name: 'Bard Skill 1 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Bard Skill 1.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Bard Skill 1 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 1 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Bard Skill 1 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 1 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Bard Skill 1 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 1 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Bard Skill 1 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 1 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Bard Skill 1 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 1 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Bard Skill 1 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 1 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'bardSkill2',
                defaultSkill: {
                    name: 'Bard Skill 2 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Bard Skill 2.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Bard Skill 2 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 2 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Bard Skill 2 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 2 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Bard Skill 2 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 2 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Bard Skill 2 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 2 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Bard Skill 2 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 2 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Bard Skill 2 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 2 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'bardSkill3',
                defaultSkill: {
                    name: 'Bard Skill 3 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Bard Skill 3.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Bard Skill 3 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 3 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Bard Skill 3 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 3 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Bard Skill 3 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 3 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Bard Skill 3 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 3 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Bard Skill 3 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 3 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Bard Skill 3 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 3 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'bardSkill4',
                defaultSkill: {
                    name: 'Bard Skill 4 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Bard Skill 4.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Bard Skill 4 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 4 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Bard Skill 4 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 4 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Bard Skill 4 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 4 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Bard Skill 4 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 4 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Bard Skill 4 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 4 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Bard Skill 4 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 4 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'bardSkill5',
                defaultSkill: {
                    name: 'Bard Skill 5 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Bard Skill 5.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Bard Skill 5 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 5 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Bard Skill 5 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 5 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Bard Skill 5 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 5 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Bard Skill 5 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 5 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Bard Skill 5 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 5 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Bard Skill 5 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 5 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'bardSkill6',
                defaultSkill: {
                    name: 'Bard Skill 6 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Bard Skill 6.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Bard Skill 6 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 6 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Bard Skill 6 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 6 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Bard Skill 6 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 6 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Bard Skill 6 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 6 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Bard Skill 6 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 6 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Bard Skill 6 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Bard Skill 6 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            }
        ],
        painter: [
            {
                key: 'painterSkill1',
                defaultSkill: {
                    name: 'Painter Skill 1 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Painter Skill 1.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Painter Skill 1 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 1 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Painter Skill 1 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 1 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Painter Skill 1 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 1 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Painter Skill 1 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 1 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Painter Skill 1 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 1 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Painter Skill 1 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 1 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'painterSkill2',
                defaultSkill: {
                    name: 'Painter Skill 2 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Painter Skill 2.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Painter Skill 2 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 2 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Painter Skill 2 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 2 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Painter Skill 2 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 2 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Painter Skill 2 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 2 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Painter Skill 2 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 2 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Painter Skill 2 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 2 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'painterSkill3',
                defaultSkill: {
                    name: 'Painter Skill 3 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Painter Skill 3.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Painter Skill 3 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 3 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Painter Skill 3 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 3 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Painter Skill 3 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 3 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Painter Skill 3 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 3 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Painter Skill 3 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 3 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Painter Skill 3 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 3 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'painterSkill4',
                defaultSkill: {
                    name: 'Painter Skill 4 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Painter Skill 4.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Painter Skill 4 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 4 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Painter Skill 4 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 4 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Painter Skill 4 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 4 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Painter Skill 4 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 4 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Painter Skill 4 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 4 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Painter Skill 4 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 4 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'painterSkill5',
                defaultSkill: {
                    name: 'Painter Skill 5 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Painter Skill 5.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Painter Skill 5 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 5 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Painter Skill 5 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 5 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Painter Skill 5 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 5 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Painter Skill 5 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 5 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Painter Skill 5 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 5 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Painter Skill 5 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 5 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            },
            {
                key: 'painterSkill6',
                defaultSkill: {
                    name: 'Painter Skill 6 Default',
                    icon: '../assets/icons/dummyPng',
                    description: 'Dummy default skill for Painter Skill 6.',
                    usageCost: 'DP 2000',
                    cooldown: '1m'
                },
                rows: {
                    improved: {
                        type1: { name: '(Improved) Painter Skill 6 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 6 Type 1 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: '(Improved) Painter Skill 6 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 6 Type 2 improved.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: '(Improved) Painter Skill 6 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 6 Type 3 improved.', usageCost: 'DP 2000', cooldown: '45s' }
                    },
                    normal: {
                        type1: { name: 'Painter Skill 6 Type 1', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 6 Type 1 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type2: { name: 'Painter Skill 6 Type 2', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 6 Type 2 normal.', usageCost: 'DP 2000', cooldown: '45s' },
                        type3: { name: 'Painter Skill 6 Type 3', icon: '../assets/icons/dummyPng', description: 'Dummy description Painter Skill 6 Type 3 normal.', usageCost: 'DP 2000', cooldown: '45s' }
                    }
                },
                defaultUsed: { row: 'improved', type: 'type1' }
            }
        ]
    };

    global.DAEVANION_LOCKED_ICON = LOCKED_ICON;
    global.DAEVANION_SKILLS_BY_CLASS = data;
})(window);