'use strict';

(function(global) {
    var LOCKED_ICON = '../assets/icons/locked_daevanion.png';
    var DUMMY_ICON = '../assets/icons/icon_ui_skills.png';

    function d(text) {
        var value = String(text == null ? '' : text).replace(/\r\n?/g, '\n');
        value = value.replace(/\\n/g, '\n');
        value = value.replace(/^\n+|\n+$/g, '');

        var lines = value.split('\n');
        var minIndent = null;
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (!line.trim()) continue;
            var indentMatch = line.match(/^\s*/);
            var indentLen = indentMatch ? indentMatch[0].length : 0;
            if (minIndent === null || indentLen < minIndent) minIndent = indentLen;
        }

        if (minIndent && minIndent > 0) {
            for (var j = 0; j < lines.length; j++) {
                if (lines[j].length >= minIndent) lines[j] = lines[j].slice(minIndent);
            }
        }

        return lines.join('\n');
    }

    var data = {
        gladiator: [
            {
                key: 'explosionOfRage',
                defaultSkill: {
                    name: 'Explosion of Rage',
                    icon: '../assets/icons/cbt_fi_abysalrage_g1.png',
                    description: d(`Has a high chance of hitting the target and then deals 1649 physical damage.
                        Causes the target to stumble.`),
                    usageCost: '3000 DP',
                    cooldown: '1m30s',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Raving Madness',
                            icon: '../assets/icons/fi_abysalrage_custom_a_up.png',
                            description: d(`Has a high chance of hitting the target and then deals 3093 physical damage.
Makes the target stumble for 4 seconds.`),
                            usageCost: '3000 DP',
                            cooldown: '1m30s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Short Fuse',
                            icon: '../assets/icons/fi_abysalrage_custom_b_up.png',
                            description: d(`Has a high chance of hitting the target and then deals 2061 physical damage.
Causes the target stumble.
Resets the cooldown of Wrathful Strike and Explosion of Wrath.`),
                            usageCost: '3000 DP',
                            cooldown: '1m30s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Raving Madness',
                            icon: '../assets/icons/fi_abysalrage_custom_a.png',
                            description: d(`Has a high chance of hitting the target and then deals 2473 (+21) physical damage.
Causes the target stumble.`),
                            usageCost: '3000 DP',
                            cooldown: '1m30s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Short Fuse',
                            icon: '../assets/icons/fi_abysalrage_custom_b.png',
                            description: d(`Has a high chance of hitting the target and then deals 1649 (+14) physical damage.
Causes the target stumble.
Resets the cooldown of Wrathful Strike.`),
                            usageCost: '3000 DP',
                            cooldown: '1m30s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'gladiatorSkill2',
                defaultSkill: {
                    name: 'Crushing Blow',
                    icon: '../assets/icons/live_fi_destructblow_g1.png',
                    description: d(`Deals 1095 physical damage.
Causes the target to stumble.`),
                    usageCost: '423 MP',
                    cooldown: '2m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Shattering Strike',
                            icon: '../assets/icons/fi_destructblow_custom_a_up.png',
                            description: d(`Deals 2443 physical damage.
Causes the target to stumble.
After a hit, the cooldowns of skills that inflict Stumble will be reset.`),
                            usageCost: '423 MP',
                            cooldown: '2m',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Shattering Blow',
                            icon: '../assets/icons/fi_destructblow_custom_b_up.png',
                            description: d(`Deals 611 physical damage.
Causes the target to stumble.
Deals 611 additional damage to the target.
Also restores HP equal to 150% of the additional damage.
Max 10000 HP Absorption.`),
                            usageCost: '423 MP',
                            cooldown: '1m',
                            target: 'Area within a Radius of Target 6 People',
                            usageDistance: '1m',
                            area: '4m',
                            areaIcon: 'targetCircle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Shattering Strike',
                            icon: '../assets/icons/fi_destructblow_custom_a.png',
                            description: d(`Deals 2036 (+18) physical damage.
Causes the target to stumble.
After a hit, the cooldowns of skills that inflict Stumble will be reduced by 50%.
This reduces by another 30% on a critical hit.`),
                            usageCost: '423 MP',
                            cooldown: '2m',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Shattering Blow',
                            icon: '../assets/icons/fi_destructblow_custom_b.png',
                            description: d(`Deals 509 (+4) physical damage.
Causes the target to stumble.
Deals 509 additional damage to the target.
Also restores HP equal to 100% of the additional damage.
Max 10000 HP Absorption.`),
                            usageCost: '423 MP',
                            cooldown: '1m',
                            target: 'Area within a Radius of Target 6 People',
                            usageDistance: '1m',
                            area: '3m',
                            areaIcon: 'targetCircle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'gladiatorSkill3',
                defaultSkill: {
                    name: 'Piercing Rupture',
                    icon: '../assets/icons/live_fi_stigma_shockburst_g1.png',
                    description: d(`Deals 1752 physical damage.
                        Reduces Physical Defence by 350 for 30s.`),
                    usageCost: '371 MP',
                    cooldown: '1m',
                    target: 'Immediate Surroundings 18 People',
                    usageDistance: '1m',
                    area: '10m',
                    areaIcon: 'targetCircle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Absorb Bloodlust',
                            icon: '../assets/icons/fi_shockburst_custom_a_up.png',
                            description: d(`Deals 2733 physical damage.
Restores HP equal to 30% of the damage.
Reduces Physical Defence by 500 for 30s.
Max 10000 HP Absorption.`),
                            usageCost: '371 MP',
                            cooldown: '20s',
                            target: 'Immediate Surroundings 6 People',
                            usageDistance: '1m',
                            area: '10m',
                            areaIcon: 'targetCircle'
                        },
                        type2: {
                            name: '(Improved) Bloodlust Explosion',
                            icon: '../assets/icons/fi_shockburst_custom_b_up.png',
                            description: d(`Deals 2103 physical damage.
Aether's Hold binds the target for 2.5 seconds.
Reduces Physical Defence by 8% for 30s.`),
                            usageCost: '371 MP',
                            cooldown: '40s',
                            target: 'Immediate Surroundings 18 People',
                            usageDistance: '1m',
                            area: '10m',
                            areaIcon: 'targetCircle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Absorb Bloodlust',
                            icon: '../assets/icons/fi_shockburst_custom_a.png',
                            description: d(`Deals 2278 (+20) physical damage.
Restores HP equal to 30% of the damage.
Reduces Physical Defence by 350 for 30s.
Max 10000 HP Absorption.`),
                            usageCost: '371 MP',
                            cooldown: '30s',
                            target: 'Immediate Surroundings 6 People',
                            usageDistance: '1m',
                            area: '10m',
                            areaIcon: 'targetCircle'
                        },
                        type2: {
                            name: 'Bloodlust Explosion',
                            icon: '../assets/icons/fi_shockburst_custom_b.png',
                               description: d(`Deals 1752 (+15) physical damage.
Aether's Hold binds the target for 2 seconds.
Reduces Physical Defence by 8% for 30s.`),
                            usageCost: '371 MP',
                            cooldown: '1m',
                            target: 'Immediate Surroundings 18 People',
                            usageDistance: '1m',
                            area: '10m',
                            areaIcon: 'targetCircle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'gladiatorSkill4',
                defaultSkill: {
                    name: 'Righteous Cleave',
                    icon: '../assets/icons/cbt_fi_stormblade_g1.png',
                    description: d(`Deals 1079 physical damage.`),
                    usageCost: '111 MP',
                    cooldown: '14s',
                    target: 'Selected Target',
                    usageDistance: '15m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: null,
                        type2: {
                            name: '(Improved) Boosted Martial Cleave',
                            icon: '../assets/icons/fi_stormblade_custom_b_up.png',
                            description: d(`Deals 1296 physical damage.
Immobilises the target for 2 seconds. There is only a slight chance this state can be removed.
Decreases the cooldown for skills with Wild Leap by 50%.`),
                            usageCost: '111 MP',
                            cooldown: '14s',
                            target: 'Selected Target',
                            usageDistance: '15m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: {
                            name: '(Improved) Blade Leap',
                            icon: '../assets/icons/fi_stormblade_custom_c_up.png',
                            description: d(`Deals 1296 physical damage.
Causes the target to stumble.`),
                            usageCost: '111 MP',
                            cooldown: '20s',
                            target: 'Selected Target',
                            usageDistance: '17m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        }
                    },
                    normal: {
                        type1: {
                            name: 'Martial Cleave',
                            icon: '../assets/icons/fi_stormblade_custom_a.png',
                            description: d(`Deals 1079 physical damage.
Decreases the cooldown for Wild Leap by 20%.
Immobilises the target for 3 seconds if the attack lands a crit strike.`),
                            usageCost: '111 MP',
                            cooldown: '14s',
                            target: 'Selected Target',
                            usageDistance: '15m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Boosted Martial Cleave',
                            icon: '../assets/icons/fi_stormblade_custom_b.png',
                            description: d(`Deals 1079 (+9) physical damage.
Immobilises the target for 2 seconds. There is only a slight chance this state can be removed.
Decreases the cooldown for skills with Wild Leap by 30%.`),
                            usageCost: '111 MP',
                            cooldown: '24s',
                            target: 'Selected Target',
                            usageDistance: '15m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: {
                            name: 'Blade Leap',
                            icon: '../assets/icons/fi_stormblade_custom_c.png',
                            description: d(`Deals 1079 (+9) physical damage.
Causes the target to stumble.`),
                            usageCost: '111 MP',
                            cooldown: '30s',
                            target: 'Selected Target',
                            usageDistance: '15m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        }
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'gladiatorSkill5',
                defaultSkill: {
                    name: 'Wild Leap',
                    icon: '../assets/icons/fi_flyingslash_g1.png',
                    description: d(`Deals 1808 physical damage.
Perfect Raging Blow.`),
                    usageCost: '381 MP',
                    cooldown: '20s',
                    target: 'Area within a Radius of Target 6 People',
                    usageDistance: '20m',
                    area: '7m',
                    areaIcon: 'targetCircle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Wild Tremor',
                            icon: '../assets/icons/fi_flyingslash_custom_a_up.png',
                            description: d(`Deals 1240 physical damage.
Stuns the target for 1s.`),
                            usageCost: '381 MP',
                            cooldown: '20s',
                            target: 'Area within a Radius of Target 8 People',
                            usageDistance: '22m',
                            area: '7m',
                            areaIcon: 'targetCircle'
                        },
                        type2: {
                            name: '(Improved) Leaping Strike',
                            icon: '../assets/icons/fi_flyingslash_custom_b_up.png',
                            description: d(`Deals 3229 physical damage.`),
                            usageCost: '381 MP',
                            cooldown: '20s',
                            target: 'Area within a Radius of Target 8 People',
                            usageDistance: '8m',
                            area: '8m',
                            areaIcon: 'targetCircle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Wild Tremor',
                            icon: '../assets/icons/fi_flyingslash_custom_a.png',
                            description: d(`Deals 1033 (+10) physical damage.
Stuns the target for 1s.`),
                            usageCost: '381 MP',
                            cooldown: '30s',
                            target: 'Area within a Radius of Target 8 People',
                            usageDistance: '17m',
                            area: '7m',
                            areaIcon: 'targetCircle'
                        },
                        type2: {
                            name: 'Leaping Strike',
                            icon: '../assets/icons/fi_flyingslash_custom_b.png',
                            description: d(`Deals 2691 (+27) physical damage.`),
                            usageCost: '381 MP',
                            cooldown: '20s',
                            target: 'Area within a Radius of Target 8 People',
                            usageDistance: '7m',
                            area: '7m',
                            areaIcon: 'targetCircle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'gladiatorSkill6',
                defaultSkill: {
                    name: 'Daevic Fury',
                    icon: '../assets/icons/live_fi_berserkstance_g1.png',
                    description: d(`ncreases Physical Attack by 1200 for 30s.
Increases Speed by 10%.
Increases Atk. Speed by 10%.
Perfect Shadow Rage.`),
                    usageCost: '0 MP',
                    cooldown: '2m',
                    target: 'Self',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Vow of the Charge',
                            icon: '../assets/icons/fi_berserkstance_custom_a_up.png',
                            description: d(`Increases Physical Attack by 3600 for 12s.
                                Increases Speed by 10%.
                                Increases Atk. Speed by 10%.`),
                            usageCost: '0 MP',
                            cooldown: '1m',
                            target: 'Self',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Attack Position',
                            icon: '../assets/icons/fi_berserkstance_custom_b_up.png',
                            description: d(`Increases Physical Attack by 1800 for 1m.
Increases Speed by 10%.
Increases Atk. Speed by 10%.
Increases Accuracy by 1200.
Increases Crit Strike by 1200.`),
                            usageCost: '0 MP',
                            cooldown: '2m',
                            target: 'Self',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Vow of the Charge',
                            icon: '../assets/icons/fi_berserkstance_custom_a.png',
                            description: d(`Increases Physical Attack by 3000 for 10s.
Increases Speed by 10%.
Increases Atk. Speed by 10%.`),
                            usageCost: '0 MP',
                            cooldown: '1m',
                            target: 'Self',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Attack Position',
                            icon: '../assets/icons/fi_berserkstance_custom_b.png',
                            description: d(`Increases Physical Attack by 1500 for 1m.
Increases Speed by 10%.
Increases Atk. Speed by 10%.
Increases Accuracy by 1000.
Increases Crit Strike by 1000.`),
                            usageCost: '0 MP',
                            cooldown: '2m',
                            target: 'Self',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            }
        ],
        templar: [
            {
                key: 'templarSkill1',
                defaultSkill: {
                    name: 'Bodyguard',
                    icon: '../assets/icons/cbt_kn_grandprotection_g1.png',
                    description: d(`Reduces damage received by a group member within a 25m radius by 100% for 15.
Absorbs 50% of the damage that the group member receives from all attack.`),
                    usageCost: '366 MP',
                    cooldown: '1m',
                    target: 'Area within a Radius of Target 1 People',
                    usageDistance: '25m',
                            area: '10m',
                            areaIcon: 'targetCircle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Comrade\'s Aegis',
                            icon: '../assets/icons/kn_grandprotection_custom_a_up.png',
                            description: d(`Reduces damage received by a group member within a 25m radius by 100% for 15s.
                                Absorbs 50% of the damage that the group member receives from all attack.
                                Increases Speed for you and the protected group member by 20%.
                                Increases Physical Attack by 550.
                                Increases magic damage by 10%.
                                Increases the effect of healing skills by 100%.`),
                            usageCost: '366 MP',
                            cooldown: '48s',
                            target: 'Area within a Radius of Target 1 People',
                            usageDistance: '25m',
                            area: '10m',
                            areaIcon: 'targetCircle'
                        },
                        type2: {
                            name: '(Improved) Cover Comrade',
                            icon: '../assets/icons/kn_grandprotection_custom_b_up.png',
                            description: d(`Reduces the damage received by up to 4 group members within a 25m radius by 100% for 15s.
                                Absorbs 20% of the damage that a group member receives from all attack.
                                Increases your recovery by 30%`),
                            usageCost: '366 MP',
                            cooldown: '48s',
                            target: 'Area within a Radius of Target 4 People',
                            usageDistance: '25m',
                            area: '10m',
                            areaIcon: 'targetCircle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Comrade\'s Aegis',
                            icon: '../assets/icons/kn_grandprotection_custom_a.png',
                            description: d(`Reduces damage received by a group member within a 25m radius by 100% for 15s.
                                Absorbs 50% of the damage that the group member receives from all attack.
                                Increases Speed for you and the protected group member by 20%.
                                Increases Physical Attack by 450.
                                Increases magic damage by 8%.
                                Increases the effect of healing skills by 100%.`),
                            usageCost: '366 MP',
                            cooldown: '1m (-0.6s)',
                            target: 'Area within a Radius of Target 1 People',
                            usageDistance: '25m',
                            area: '10m',
                            areaIcon: 'targetCircle'
                        },
                        type2: {
                            name: 'Cover Comrade',
                            icon: '../assets/icons/kn_grandprotection_custom_b.png',
                            description: d(`Reduces the damage received by up to 3 group members within a 25m radius by 100% for 15s.
                                Absorbs 20% of the damage that a group member receives from all attack.
                                Increases your recovery by 20%.`),
                            usageCost: '366 MP',
                            cooldown: '1m (-0.6s)',
                            target: 'Area within a Radius of Target 3 People',
                            usageDistance: '25m',
                            area: '10m',
                            areaIcon: 'targetCircle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'templarSkill2',
                defaultSkill: {
                    name: 'Shield Bash',
                    icon: '../assets/icons/cbt_kn_shieldcharge_g1.png',
                    description: d(`Deals 1070 physical damage.
Stuns the target for 2s.`),
                    usageCost: '218 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Shield Blow',
                            icon: '../assets/icons/kn_shieldcharge_custom_a_up.png',
                            description: d(`Deals 1284 physical damage.
Stuns the target for 2s.
After a hit, the cooldowns for Swinging Shield Counter, Shield Counter, Shield Blast, Avenging Blow and Bloodthirster Strike are reset.`),
                            usageCost: '218 MP',
                            cooldown: '30s',
                            target: 'Area within a Radius of Target',
                            usageDistance: '1m',
                            area: '3x10m',
                            areaIcon: 'targetRect'
                        },
                        type2: {
                            name: '(Improved) Heavy Shield Blow',
                            icon: '../assets/icons/kn_shieldcharge_custom_b_up.png',
                            description: d(`Deals 2569 physical damage.
Stuns the target for 2s.
Reduces the cooldown for Break Power and Judgment Blow by 80%.
A Crit Strike resets the cooldown.`),
                            usageCost: '218 MP',
                            cooldown: '1m',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Shield Blow',
                            icon: '../assets/icons/kn_shieldcharge_custom_a.png',
                            description: d(`Deals 1070 (+9) physical damage.
Stuns the target for 2s.
After a hit, the cooldowns for Swinging Shield Counter, Shield Counter, Shield Blast, Avenging Blow and Bloodthirster Strike are reduced by 70%.`),
                            usageCost: '218 MP',
                            cooldown: '30s',
                            target: 'Area within a Radius of Target',
                            usageDistance: '1m',
                            area: '3x10m',
                            areaIcon: 'targetRect'
                        },
                        type2: {
                            name: 'Heavy Shield Blow',
                            icon: '../assets/icons/kn_shieldcharge_custom_b.png',
                            description: d(`Deals 2141 (+19) physical damage.
Stuns the target for 2s.
Reduces the cooldown for Break Power and Judgment Blow by 70%.
A crit strike resets the cooldown.`),
                            usageCost: '218 MP',
                            cooldown: '1m',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'templarSkill3',
                defaultSkill: {
                    name: 'Break Power',
                    icon: '../assets/icons/cbt_kn_breakpower_g1.png',
                    description: d(`Deals 2509 physical damage to a stunned or stumbled target.
                        Reduces the target's Physical Attack by 100.
                        Increases your Physical Attack by 100 for 30s.`),
                    usageCost: '173 MP',
                    cooldown: '16s',
                    target: 'Selected Target',
                    usageDistance: '2m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: null,
                        type2: {
                            name: '(Improved) Boosted Shatter Strength',
                            icon: '../assets/icons/kn_breakpower_custom_b_up.png',
                            description: d(`Deals 3345 physical damage to a stunned or stumbled target.
Reduces the target's Physical Attack by 500.
Increases your Physical Attack by 500 for 30s.
Increases the effect of the next attack skill by 40% if the target stumbles.
Landing a critical strike increases the probability that the next attack will also land a critical strike.`),
                            usageCost: '173 MP',
                            cooldown: '16s',
                            target: 'Selected Target',
                            usageDistance: '2m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: {
                            name: '(Improved) Ankle Blow',
                            icon: '../assets/icons/kn_breakpower_custom_c_up.png',
                            description: d(`Deals 3057 physical damage.
Reduces the target's Physical Attack by 500.
Increases your Physical Attack by 500 for 30s.
Deals extra damage if the target stumbles.`),
                            usageCost: '173 MP',
                            cooldown: '32s',
                            target: 'Selected Target',
                            usageDistance: '2m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        }
                    },
                    normal: {
                        type1: {
                            name: 'Shatter Strength',
                            icon: '../assets/icons/kn_breakpower_custom_a.png',
                            description: d(`Deals 2509 physical damage to a stunned or stumbled target.
                                Reduces the target's Physical Attack by 100.
                                Increases your Physical Attack by 100 for 30s.
                                Increases the effect of the next attack skill by 20% if the target has stumbled.
                                Landing a critical strike increases the probability that the next attack will also land a critical strike.`),
                            usageCost: '173 MP',
                            cooldown: '16s',
                            target: 'Selected Target',
                            usageDistance: '2m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Boosted Shatter Strength',
                            icon: '../assets/icons/kn_breakpower_custom_b.png',
                            description: d(`Deals 2787 (+24) physical damage to a stunned or stumbled target.
                                Reduces the target's Physical Attack by 100.
                                Increases your Physical Attack by 100 for 30s.
                                Increases the effect of the next attack skill by 20% if the target has stumbled.
                                Landing a critical strike increases the probability that the next attack will also land a critical strike`),
                            usageCost: '173 MP',
                            cooldown: '16s',
                            target: 'Selected Target',
                            usageDistance: '2m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: {
                            name: 'Ankle Blow',
                            icon: '../assets/icons/kn_breakpower_custom_c.png',
                            description: d(`Deals 2548 (+22) physical damage.
Reduces the target's Physical Attack by 100.
Increases your Physical Attack by 100 for 30s.
Deals extra damage if the target stumbles.`),
                            usageCost: '173 MP',
                            cooldown: '32s',
                            target: 'Selected Target',
                            usageDistance: '2m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        }
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'templarSkill4',
                defaultSkill: {
                    name: 'Iron Skin',
                    icon: '../assets/icons/cbt_kn_ironbody_g1.png',
                    description: d(`Removes all your debuffs.
Reduces your damage by 50% for 10s.`),
                    usageCost: '205 MP',
                    cooldown: '2m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Dual Provocation Armour',
                            icon: '../assets/icons/kn_ironbody_custom_a_up.png',
                            description: d(`Removes all your debuffs.
The damage you receive is reduced by 70% and partially reflected back for 12s.
Additionally, nearby enemies are taunted every 3 seconds.
If the target is a player, their Enmity will be directed at you.`),
                            usageCost: '205 MP',
                            cooldown: '1m36s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Iron Skin',
                            icon: '../assets/icons/kn_ironbody_custom_b_up.png',
                            description: d(`Removes all your debuffs.
Reduces your damage by 70% for 12s.
You resist states which restrict movement.
Restores 3000 HP every 1s.`),
                            usageCost: '205 MP',
                            cooldown: '1m36s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Dual Provocation Armour',
                            icon: '../assets/icons/kn_ironbody_custom_a.png',
                            description: d(`Removes all your debuffs.
The damage you receive is reduced by 50% and partially reflected back for 10s.
Additionally, nearby enemies are taunted every 3 seconds.
If the target is a player, their Enmity will be directed at you.`),
                            usageCost: '205 MP',
                            cooldown: '2m (-1.2s)',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Iron Skin',
                            icon: '../assets/icons/kn_ironbody_custom_b.png',
                            description: d(`Removes all your debuffs.
Reduces your damage by 65% for 10s.
You resist states which restrict movement.
Restores 2000 HP every 1s.`),
                            usageCost: '205 MP',
                            cooldown: '2m (-1.2s)',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'templarSkill5',
                defaultSkill: {
                    name: 'Divine Grasp',
                    icon: '../assets/icons/cbt_kn_landsnacher_g1.png',
                    description: d(`Deals 715 physical damage.
                        Drags an enemy right up in front of you and increases Enmity.
                        Reduces the target's movement speed for 10s.`),
                    usageCost: '2000 DP',
                    cooldown: '5m',
                    target: 'Area within a Radius of Target 18 People',
                    usageDistance: '15m',
                    area: '20m',
                    areaIcon: 'targetCircle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Repeated Divine Grasp',
                            icon: '../assets/icons/kn_landsnacher_custom_a_up.png',
                            description: d(`Deals 1207 physical damage.
Drags an enemy directly in front of you and increases Enmity.
Reduces the target's movement speed for 10s.`),
                            usageCost: '2000 DP',
                            cooldown: '2m',
                            target: 'Area within a Radius of Target 24 People',
                            usageDistance: '17m',
                            area: '20m',
                            areaIcon: 'targetCircle',
                            castTime: '1s'
                        },
                        type2: {
                            name: '(Improved) Concentrated Divine Grasp',
                            icon: '../assets/icons/kn_landsnacher_custom_b_up.png',
                            description: d(`Deals 1207 physical damage.
Drags an enemy directly in front of you and increases Enmity.
Reduces the target's movement speed for 10s.
Resets the cooldown of Capture.`),
                            usageCost: '2000 DP',
                            cooldown: '2m',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle',
                            castTime: '0.8s'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Repeated Divine Grasp',
                            icon: '../assets/icons/kn_landsnacher_custom_a.png',
                            description: d(`Deals 715 (+27) physical damage.
Drags an enemy directly in front of you and increases Enmity.
Reduces the target's movement speed for 10s.`),
                            usageCost: '2000 DP',
                            cooldown: '3m',
                            target: 'Area within a Radius of Target 20 People',
                            usageDistance: '15m',
                            area: '20m',
                            areaIcon: 'targetCircle',
                            castTime: '1.5s'
                        },
                        type2: {
                            name: 'Concentrated Divine Grasp',
                            icon: '../assets/icons/kn_landsnacher_custom_b.png',
                            description: d(`Deals 715 (+27) physical damage.
Drags an enemy directly in front of you and increases Enmity.
Reduces the target's movement speed for 10s.
Resets the cooldown of Capture by 50%.`),
                            usageCost: '2000 DP',
                            cooldown: '2m',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle',
                            castTime: '1.5s'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'templarSkill6',
                defaultSkill: {
                    name: 'Bloodstorm Blow',
                    icon: '../assets/icons/kn_bloodyslash_g1.png',
                    description: d(`Deals 713 physical damage.
Multicast 2 times.
Perfect Bloodsword Slash.`),
                    usageCost: 'HP 209',
                    cooldown: '5s',
                    target: 'Area within a Radius of Target 4 People',
                    usageDistance: '1m',
                    area: '3x7m',
                    areaIcon: 'targetRect'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Bloodstorm Splitter',
                            icon: '../assets/icons/kn_bloodyslash_custom_a_up.png',
                            description: d(`Deals 847 physical damage.
The target has a high probability of being knocked back.
Multicast 3 times.`),
                            usageCost: 'HP 209',
                            cooldown: '5s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Depriving Strike',
                            icon: '../assets/icons/kn_bloodyslash_custom_b_up.png',
                            description: d(`Deals 847 physical damage.
Absorbs HP equal to 20% of the damage.
Multicast 3 times.`),
                            usageCost: 'HP 209',
                            cooldown: '5s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Bloodstorm Splitter',
                            icon: '../assets/icons/kn_bloodyslash_custom_a.png',
                            description: d(`Deals 713 (+6) physical damage.
The target also has a high probability of being knocked back.
Multicast 3 times.`),
                            usageCost: 'HP 209',
                            cooldown: '5s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Depriving Strike',
                            icon: '../assets/icons/kn_bloodyslash_custom_b.png',
                            description: d(`Deals 713 (+6) physical damage.
Absorbs HP equal to 20% of the damage.
Multicast 2 times.`),
                            usageCost: 'HP 209',
                            cooldown: '5s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            }
        ],
        assassin: [
            {
                key: 'assassinSkill1',
                defaultSkill: {
                    name: 'Pain Rune Burst',
                    icon: '../assets/icons/cbt_as_signetburst_g1.png',
                    description: d(`Removes a rune up to level 5 from a target and deals magic damage.
Stuns the target.
The higher the rune level, the higher the probability that the effect occurs.`),
                    usageCost: '270 MP',
                    cooldown: '18s',
                    target: 'Selected Target',
                    usageDistance: '10m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Seal Eruption',
                            icon: '../assets/icons/as_signetburst_custom_a_up.png',
                            description: d(`Removes a rune up to level 5 from a target and deals magic damage.
Stuns the target.
The higher the rune level, the higher the probability that the effect occurs.
Damage is higher than a normal Pain Rune and the cooldown is shorter.`),
                            usageCost: '270 MP',
                            cooldown: '8s',
                            target: 'Selected Target',
                            usageDistance: '10m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Seal Destruction',
                            icon: '../assets/icons/as_signetburst_custom_b_up.png',
                            description: d(`Removes a rune up to level 5 from a target and deals magic damage.
Stuns the target.
Stun lasts longer than after a normal Pain Rune.
When using the skill, the cooldown for Shadowfall is reset.
The higher the rune level, the higher the probability that the effect occurs.`),
                            usageCost: '270 MP',
                            cooldown: '14.4s',
                            target: 'Selected Target',
                            usageDistance: '10m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Seal Eruption',
                            icon: '../assets/icons/as_signetburst_custom_a.png',
                            description: d(`Removes a rune up to level 5 from a target and deals magic damage.
Stuns the target.
The higher the rune level, the higher the probability that the effect occurs.
Damage is higher than a normal Pain Rune and the cooldown is shorter.`),
                            usageCost: '270 MP',
                            cooldown: '10s',
                            target: 'Selected Target',
                            usageDistance: '10m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Seal Destruction',
                            icon: '../assets/icons/as_signetburst_custom_b.png',
                            description: d(`Removes a rune up to level 5 from a target and deals magic damage.
Stuns the target.
Stun lasts longer than after a normal Pain Rune.
When using the skill, the cooldown for Shadowfall is reduced by 70%.
The higher the rune level, the higher the probability that the effect occurs.`),
                            usageCost: '270 MP',
                            cooldown: '18s',
                            target: 'Selected Target',
                            usageDistance: '10m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'assassinSkill2',
                defaultSkill: {
                    name: 'Killing Spree',
                    icon: '../assets/icons/live_as_pollutioncut_g1.png',
                    description: d(`Deals 754 physical damage.
Deals 1391 more damage if the target is poisoned or stunned.
Multicast 3 times.`),
                    usageCost: '142 MP',
                    cooldown: '30s',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: null,
                        type2: {
                            name: '(Improved) Boosted Second Slash',
                            icon: '../assets/icons/as_pollutioncut_custom_b_up.png',
                            description: d(`Deals 1312 physical damage.
Deals 2003 more damage when attacking from behind or if the target is poisoned or stunned.
Temporarily increases the probability that the attack skill deals a crit strike by 100%.
Multicast 3 times`),
                            usageCost: '142 MP',
                            cooldown: '30s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: {
                            name: '(Improved) Soulbreak',
                            icon: '../assets/icons/as_pollutioncut_custom_c_up.png',
                            description: d(`Deals 995 physical damage.
Deals 2003 extra damage if the target is poisoned or its movement speed is reduced.
Stuns the target for 1s.
Multicast 3 times`),
                            usageCost: '142 MP',
                            cooldown: '30s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        }
                    },
                    normal: {
                        type1: {
                            name: 'Second Slash',
                            icon: '../assets/icons/as_pollutioncut_custom_a.png',
                            description: d(`Deals 829 physical damage.
                                Deals 1391 more damage if the target is poisoned or stunned.
                                Temporarily increases the probability that the attack skill deals a crit strike by 50%.
                                Multicast 3 times.`),
                            usageCost: '142 MP',
                            cooldown: '30s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Boosted Second Slash',
                            icon: '../assets/icons/as_pollutioncut_custom_b.png',
                            description: d(`Deals 910 (+8) physical damage.
Deals 1391 more damage when attacking from behind or if the target is poisoned or stunned.
Temporarily increases the probability that the attack skill deals a crit strike by 80%.
Multicast 3 times`),
                            usageCost: '142 MP',
                            cooldown: '30s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: {
                            name: 'Soulbreak',
                            icon: '../assets/icons/as_pollutioncut_custom_c.png',
                            description: d(`Deals 829 (+8) physical damage.
Deals 1391 extra damage if the target is poisoned.
Stuns the target for 1s.
Multicast 3 times`),
                            usageCost: '142 MP',
                            cooldown: '30s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        }
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'assassinSkill3',
                defaultSkill: {
                    name: 'Wind Walk',
                    icon: '../assets/icons/cbt_as_windwalk_g1.png',
                    description: d(`You are in advanced stealth mode for 10s-20s.
You may use up to 3 magical buffs on yourself and still remain in stealth.
Available during battle.`),
                    usageCost: '3000 DP',
                    cooldown: '2m',
                    target: 'Self',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Shadow of Resistance',
                            icon: '../assets/icons/as_windwalk_custom_a_up.png',
                            description: d(`Even if you're attacked for 5s, your improved stealth mode will be maintained.
Available during battle.`),
                            usageCost: '2000 DP',
                            cooldown: '1m30s',
                            target: 'Self',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Speed\'s Shadow',
                            icon: '../assets/icons/as_windwalk_custom_b_up.png',
                            description: d(`You are in a normal stealth mode for 9s.
You may use up to 2 magic buffs on yourself and still remain in stealth mode.
Available during battle.`),
                            usageCost: '1000 DP',
                            cooldown: '40s',
                            target: 'Self',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Shadow of Resistance',
                            icon: '../assets/icons/as_windwalk_custom_a.png',
                            description: d(`Even if you're attacked for 3s, your improved stealth mode will be maintained.
Available during battle.`),
                            usageCost: '3000 DP',
                            cooldown: '2m',
                            target: 'Self',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Speed\'s Shadow',
                            icon: '../assets/icons/as_windwalk_custom_b.png',
                            description: d(`You are in a normal stealth mode for 6s.
You may use up to one magical buff on yourself and still remain in stealth mode.
Available during battle.`),
                            usageCost: '2000 DP',
                            cooldown: '1m',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'assassinSkill4',
                defaultSkill: {
                    name: 'Bloodthirster Surprise Attack',
                    icon: '../assets/icons/cbt_sc_assaultstabber_g1.png',
                    description: d(`Deals 607 physical damage.
Deals 2888 additional damage when attacking from behind.
Restores HP equal to 50% of the additional damage.
Perfect Surprise Attack.`),
                    usageCost: '91 MP',
                    cooldown: '16s',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Bestial Surprise Attack',
                            icon: '../assets/icons/sc_assaultstabber_custom_a_up.png',
                            description: d(`Deals 2185 physical damage.
Restores HP equal to 50% of the damage.`),
                            usageCost: '91 MP',
                            cooldown: '16s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Crushing Surprise Attack',
                            icon: '../assets/icons/sc_assaultstabber_custom_b_up.png',
                            description: d(`Deals 1091 physical damage.
Deals 3466 additional damage and makes the target stumble if they are stunned.`),
                            usageCost: '91 MP',
                            cooldown: '12s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Bestial Surprise Attack',
                            icon: '../assets/icons/sc_assaultstabber_custom_a.png',
                            description: d(`Deals 1821 (+17) physical damage.
Restores HP equal to 30% of the damage.`),
                            usageCost: '91 MP',
                            cooldown: '16s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Crushing Surprise Attack',
                            icon: '../assets/icons/sc_assaultstabber_custom_b.png',
                            description: d(`Deals 607 (+6) physical damage.
Deals 2888 additional damage and makes the target stumble if they are stunned.`),
                            usageCost: '91 MP',
                            cooldown: '16s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'assassinSkill5',
                defaultSkill: {
                    name: 'Swift Ambush',
                    icon: '../assets/icons/cbt_as_blindside_g1.png',
                    description: d(`You get behind the target and deal 816 physical damage to it.
Stuns the target for 3s.
Increases your movement speed by 30% for 5s.
Perfect Ambush.`),
                    usageCost: '228 MP',
                    cooldown: '40s',
                    target: 'Selected Target',
                    usageDistance: '20m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Swift Heavy Attack',
                            icon: '../assets/icons/as_blindside_custom_a_up.png',
                            description: d(`You get behind the target and deal 979 physical damage to it.
Stuns the target for 2s.
Boosts your movement speed by 30% for 4 seconds.
All attack skills deal Crit Strikes for 4 seconds.`),
                            usageCost: '228 MP',
                            cooldown: '40s',
                            target: 'Selected Target',
                            usageDistance: '20m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Swift Storm Attack',
                            icon: '../assets/icons/as_blindside_custom_b_up.png',
                            description: d(`You get behind the target and deal 1862 physical damage to it.
Stuns the target for 3s.
Poisons the target for 8 seconds and reduces its movement speed.
Boosts your movement speed by 30% for 5s.
In addition, resets the cooldowns for Beast Leap, Flash of Speed and Beast Fang when used.`),
                            usageCost: '228 MP',
                            cooldown: '30s',
                            target: 'Selected Target',
                            usageDistance: '20m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Swift Heavy Attack',
                            icon: '../assets/icons/as_blindside_custom_a.png',
                            description: d(`You get behind the target and deal 816 (+8) physical damage to it.
Stuns the target for 2s.
Boosts your movement speed by 30% for 3 seconds.
All attack skills deal Crit Strikes for 3 seconds.`),
                            usageCost: '228 MP',
                            cooldown: '40s',
                            target: 'Selected Target',
                            usageDistance: '20m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Swift Storm Attack',
                            icon: '../assets/icons/as_blindside_custom_b.png',
                            description: d(`You get behind the target and deal 1552 (+16) physical damage to it.
Stuns the target for 3s.
Poisons the target for 8 seconds and reduces its movement speed.
Boosts your movement speed by 30% for 5s.
Resets the cooldowns for Beast Leap and Flash of Speed when used.`),
                            usageCost: '228 MP',
                            cooldown: '40s',
                            target: 'Selected Target',
                            usageDistance: '20m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'assassinSkill6',
                defaultSkill: {
                    name: 'Whirlwind Blow',
                    icon: '../assets/icons/cbt_as_flowingspiner_g1.png',
                    description: d(`Deals 951 physical damage after successful evasion and resist magic.
                        The target suffers the spin effect.
                        Perfect Whirlwind Slash.`),
                    usageCost: '183 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '15m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Whirling Slicer',
                            icon: '../assets/icons/as_flowingspiner_custom_a_up.png',
                            description: d(`Deals 2227 physical damage after successful evasion and resist magic.
                                The target suffers the Spin effect.
                                Resets the cooldown for Focused Evasion, Aethertwisting, Blinding Burst and Sensory Boost.`),
                            usageCost: '183 MP',
                            cooldown: '40s',
                            target: 'Selected Target',
                            usageDistance: '20m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Whirlwind Slash',
                            icon: '../assets/icons/as_flowingspiner_custom_b_up.png',
                            description: d(`Deals 1713 physical damage.
                                A successful attack reduces the cooldown for Swift Ambush, Dash and Slash and Flash of Speed by 20%.
                                A crit strike reduces the cooldown by an additional 20%.
                                Multicast 3 times.`),
                            usageCost: '183 MP',
                            cooldown: '1m',
                            target: 'Selected Target',
                            usageDistance: '20m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Whirling Slicer',
                            icon: '../assets/icons/as_flowingspiner_custom_a.png',
                            description: d(`Deals 1427 (+13) physical damage after successful evasion and resist magic.
                                The target suffers the Spin effect.
                                Reduces the cooldown for Focused Evasion and Aethertwisting by 30%.
                                A crit strike reduces the cooldown by another 30%.`),
                            usageCost: '183 MP',
                            cooldown: '1m',
                            target: 'Selected Target',
                            usageDistance: '15m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Whirlwind Slash',
                            icon: '../assets/icons/as_flowingspiner_custom_b.png',
                            description: d(`Deals 1427 (+13) physical damage.
                                A successful attack reduces the cooldown for Swift Ambush, Dash and Slash and Flash of Speed by 10%.
                                A crit strike reduces the cooldown by an additional 10%.
                                Multicast 3 times.`),
                            usageCost: '183 MP',
                            cooldown: '1m',
                            target: 'Selected Target',
                            usageDistance: '15m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            }
        ],
        ranger: [
            {
                key: 'rangerSkill1',
                defaultSkill: {
                    name: 'Shackle Arrow',
                    icon: '../assets/icons/cbt_ra_rootarrow_g1.png',
                    description: d(`Deals 1125 physical damage.
Immobilises the target for 10s.
Reduces Evasion by 1000.`),
                    usageCost: '292 MP',
                    cooldown: '30s',
                    target: 'Selected Target',
                    usageDistance: 'Default bow range',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Shackling Arrow',
                            icon: '../assets/icons/ra_rootarrow_custom_a_up.png',
                            description: d(`Deals 519 physical damage.
Immobilises the target for 8s. There is only a slight chance this state can be removed.
Reduces Evasion by 2000.
Reduces Physical Defence by 10%.`),
                            usageCost: '292 MP',
                            cooldown: '20s',
                            target: 'Selected Target',
                            usageDistance: '30m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Shackling Arrow Torrent',
                            icon: '../assets/icons/ra_rootarrow_custom_b_up.png',
                            description: d(`Deals 2076 physical damage.
Immobilises the target for 12s.
Reduces Evasion by 2000.`),
                            usageCost: '292 MP',
                            cooldown: '30s',
                            target: 'Area within a Radius of Target 6 People',
                            usageDistance: '30m',
                            area: '7m',
                            areaIcon: 'targetCircle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Shackling Arrow',
                            icon: '../assets/icons/ra_rootarrow_custom_a.png',
                            description: d(`Deals 433 (+5) physical damage.
Immobilises the target for 3.5 seconds. There is only a slight chance this state can be removed.
Reduces Evasion by 1000.
Reduces Physical Defence by 10%.`),
                            usageCost: '292 MP',
                            cooldown: '30s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Shackling Arrow Torrent',
                            icon: '../assets/icons/ra_rootarrow_custom_b.png',
                            description: d(`Deals 1730 (+17) physical damage.
Immobilises the target for 10s.
Reduces Evasion by 1000.`),
                            usageCost: '292 MP',
                            cooldown: '30s',
                            target: 'Area within a Radius of Target 6 People',
                            usageDistance: '30m',
                            area: '7m',
                            areaIcon: 'targetCircle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'rangerSkill2',
                defaultSkill: {
                    name: 'Silencing Shot',
                    icon: '../assets/icons/cbt_ra_silentarrow_g1.png',
                    description: d(`Deals 707 physical damage.
Silences the target for 4s.`),
                    usageCost: '183 MP',
                    cooldown: '18s',
                    target: 'Selected Target',
                    usageDistance: 'Default bow range',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: null,
                        type2: {
                            name: '(Improved) Silencing Thrust',
                            icon: '../assets/icons/ra_silentarrow_custom_b_up.png',
                            description: d(`Deals 1272 physical damage.
Silences the target for 4s.
The effect cannot be removed.`),
                            usageCost: '183 MP',
                            cooldown: '40s',
                            target: 'Selected Target',
                            usageDistance: 'Default bow range',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: {
                            name: '(Improved) Binding Arrow',
                            icon: '../assets/icons/ra_silentarrow_custom_c_up.png',
                            description: d(`Deals 1272 physical damage.
Binds the target for 5s.`),
                            usageCost: '183 MP',
                            cooldown: '20s',
                            target: 'Selected Target',
                            usageDistance: 'Default bow range',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        }
                    },
                    normal: {
                        type1: {
                            name: 'Throwing Daggers of Silence',
                            icon: '../assets/icons/ra_counterslash_custom_a.png',
                            description: d(`Deals 1060 physical damage.
Silences the target for 5s.`),
                            usageCost: '183 MP',
                            cooldown: '18s',
                            target: 'Selected Target',
                            usageDistance: 'Default bow range',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Silencing Thrust',
                            icon: '../assets/icons/ra_silentarrow_custom_b_up.png',
                            description: d(`Deals 1060 (+11) physical damage.
Silences the target for 3s.
Cannot remove the effect.`),
                            usageCost: '183 MP',
                            cooldown: '40s',
                            target: 'Selected Target',
                            usageDistance: 'Default bow range',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: {
                            name: 'Binding Arrow',
                            icon: '../assets/icons/ra_silentarrow_custom_c_up.png',
                            description: d(`Deals 1060 (+11) physical damage.
Binds the target for 4s.`),
                            usageCost: '183 MP',
                            cooldown: '20s',
                            target: 'Selected Target',
                            usageDistance: 'Default bow range',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        }
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'rangerSkill3',
                defaultSkill: {
                    name: 'Retreating Slash',
                    icon: '../assets/icons/cbt_ra_backdashstab_g1.png',
                    description: d(`Deals 90 physical damage.
You are knocked back 25m.
Stuns the target for 1s.`),
                    usageCost: '69 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '6m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Knock-back',
                            icon: '../assets/icons/ra_backdashstab_custom_a_up.png',
                            description: d(`Deals 1440 physical damage.
You are knocked back 15m.
Stuns the target for 3s.
Your next 5 physical attack skills are improved by 30% for 1 min.
Increases Accuracy by 3000
Increases Magical Accuracy by 3000.`),
                            usageCost: '69 MP',
                            cooldown: '1m',
                            target: 'Selected Target',
                            usageDistance: '10m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Rear Strike',
                            icon: '../assets/icons/ra_backdashstab_custom_b_up.png',
                            description: d(`Deals 90 physical damage.
You are knocked back 25m.
Stuns the target for 1s.
Reduces movement speed.
Increases your movement speed by 30% for 10s.
Resets the cooldown of Instant Sprint and Speed of the Wind.`),
                            usageCost: '69 MP',
                            cooldown: '48s',
                            target: 'Selected Target',
                            usageDistance: '6m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Knockback',
                            icon: '../assets/icons/ra_backdashstab_custom_a.png',
                            description: d(`Deals 1200 (+12) physical damage.
You are knocked back 15m.
Stuns the target for 2s.
Your next 5 physical attack skills are improved by 30% for 1 min.
Increases Accuracy by 2000
Increases Magical Accuracy by 2000.`),
                            usageCost: '69 MP',
                            cooldown: '1m',
                            target: 'Selected Target',
                            usageDistance: '10m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Rear Strike',
                            icon: '../assets/icons/ra_backdashstab_custom_b.png',
                            description: d(`Deals 90 physical damage.
You are knocked back 25m.
Stuns the target for 1s.
Reduces movement speed.
Increases your movement speed by 30% for 10s.
Resets the cooldown of Instant Sprint.`),
                            usageCost: '69 MP',
                            cooldown: '1m (-0.6s)',
                            target: 'Selected Target',
                            usageDistance: '6m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'rangerSkill4',
                defaultSkill: {
                    name: 'Rupture Arrow',
                    icon: '../assets/icons/cbt_ra_crushshot_g1.png',
                    description: d(`Deals 1188 random physical damage.
Knocks the target back.`),
                    usageCost: '289 MP',
                    cooldown: '24s',
                    target: 'Selected Target',
                    usageDistance: '20m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Arrow Rain of Destruction',
                            icon: '../assets/icons/ra_crushshot_custom_a_up.png',
                            description: d(`Deals 1568 random physical damage.
Knocks the target back.
Reduces the cooldown for Stunning Shot.`),
                            usageCost: '289 MP',
                            cooldown: '24s',
                            target: 'Area within a Radius of Target 6 People',
                            usageDistance: '20m',
                            area: '5m',
                            areaIcon: 'targetCircle'
                        },
                        type2: {
                            name: '(Improved) Sustained Arrow Rain',
                            icon: '../assets/icons/ra_crushshot_custom_b_up.png',
                            description: d(`Deals 1097 random physical damage.
Knocks the target back.
A Crit Strike means the next attack skill will also land a Crit Strike.
Multicast 3 times`),
                            usageCost: '289 MP',
                            cooldown: '24s',
                            target: 'Selected Target',
                            usageDistance: '20m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Arrow Rain of Destruction',
                            icon: '../assets/icons/ra_crushshot_custom_a.png',
                            description: d(`Deals 1188 (+12) random physical damage.
Knocks the target back.
A crit strike resets the cooldown of Stunning Shot.`),
                            usageCost: '289 MP',
                            cooldown: '24s',
                            target: 'Area within a Radius of Target 6 People',
                            usageDistance: '20m',
                            area: '5m',
                            areaIcon: 'targetCircle'
                        },
                        type2: {
                            name: 'Sustained Arrow Rain',
                            icon: '../assets/icons/ra_crushshot_custom_b.png',
                            description: d(`Deals 914 (+9) random physical damage.
Knocks the target back.
A Crit Strike means the next attack skill will also land a Crit Strike.
Multicast 2 times.`),
                            usageCost: '289 MP',
                            cooldown: '24s',
                            target: 'Selected Target',
                            usageDistance: '20m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'rangerSkill5',
                defaultSkill: {
                    name: 'Arrow of Annihilation',
                    icon: '../assets/icons/live_ra_aimshot_g1.png',
                    description: d(`Has a high chance of hitting the target and then deals 2138 physical damage.
                        Perfect Unerring Arrow`),
                    usageCost: '423 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: 'Default bow range',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Arrow of Destruction',
                            icon: '../assets/icons/ra_aimshot_custom_a_up.png',
                            description: d(`Has a high chance of hitting the target and then deals 2563 physical damage.
Removes the target's protective effect.`),
                            usageCost: '423 MP',
                            cooldown: '1m10s',
                            target: 'Selected Target',
                            usageDistance: 'Default bow range',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Arrow of Death',
                            icon: '../assets/icons/ra_aimshot_custom_b_up.png',
                            description: d(`Has a high chance of hitting the target and then deals 1537 physical damage.
Multicast 2 times.`),
                            usageCost: '423 MP',
                            cooldown: '20s',
                            target: 'Selected Target',
                            usageDistance: '30m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Arrow of Destruction',
                            icon: '../assets/icons/ra_aimshot_custom_a.png',
                            description: d(`Has a high chance of hitting the target and then deals 2136 (+21) physical damage.
Removes the target's protective effect.`),
                            usageCost: '423 MP',
                            cooldown: '1m30s',
                            target: 'Selected Target',
                            usageDistance: 'Default bow range',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Arrow of Death',
                            icon: '../assets/icons/ra_aimshot_custom_b.png',
                            description: d(`Has a high chance of hitting the target and then deals 1281 (+13) physical damage.`),
                            usageCost: '423 MP',
                            cooldown: '30s',
                            target: 'Selected Target',
                            usageDistance: '30m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'rangerSkill6',
                defaultSkill: {
                    name: 'Mau\'s Blessing',
                    icon: '../assets/icons/cbt_ra_sabageroar_g1.png',
                    description: d(`Increases Physical Attack by 600.
Increases Atk. Speed by 26%.
Increases Speed by 39%.
500 DP are used every 3 sec.
Active Skill.
Transformation: Perfect Mau.`),
                    usageCost: '500 DP (every 3s)',
                    cooldown: '10s',
                    target: 'Self',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Mau\'s Honour',
                            icon: '../assets/icons/ev_ra_sabageroar_custom_a_up.png',
                            description: d(`Increases Physical Attack by 800.
Increases Accuracy by 2000.
Increases Evasion by 800.
Increases Atk. Speed by 30%.
Increases Speed by 40%.
500 DP are used every 3 sec.
Active Skill.`),
                            usageCost: '500 DP (every 3s)',
                            cooldown: '10s',
                            target: 'Self',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Mau\'s Glory',
                            icon: '../assets/icons/ev_ra_sabageroar_custom_b_up.png',
                            description: d(`Removes immobilisation.
You are immobilised and cannot cause immobilisation.
Increases Physical Attack by 4000.
Increases Crit Strike by 4000.
Increases Resistance to Pull by 1000.
Reduces Atk Range of Bow by 5m.
1000 DP are used every 3 sec.
Active Skill.`),
                            usageCost: '1000 DP (every 3s)',
                            cooldown: '30s',
                            target: 'Self',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Mau\'s Honour',
                            icon: '../assets/icons/ev_ra_sabageroar_custom_a.png',
                            description: d(`ncreases Physical Attack by 700 (+6).
Increases Accuracy by 1000.
Increases Evasion by 500.
Increases Atk. Speed by 26%.
Increases Speed by 39%.
500 DP are used every 3 sec.
Active Skill.`),
                            usageCost: '500 DP (every 3s)',
                            cooldown: '10s',
                            target: 'Self',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Mau\'s Glory',
                            icon: '../assets/icons/ev_ra_sabageroar_custom_b.png',
                            description: d(`Removes immobilisation.
You are immobilised and cannot cause immobilisation.
Increases Physical Attack by 3000 (+30).
Increases Crit Strike by 3000.
Increases Resistance to Pull by 1000.
Reduces Atk Range of Bow by 7m.
1000 DP are used every 3 sec.
Active Skill.`),
                            usageCost: '1000 DP (every 3s)',
                            cooldown: '30s',
                            target: 'Self',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            }
        ],
        sorcerer: [
            {
                key: 'sorcererSkill1',
                defaultSkill: {
                    name: 'Freezing Wind',
                    icon: '../assets/icons/cbt_wi_hydroimpact_g1.png',
                    description: d(`Deals 1425 magical water damage..`),
                    usageCost: '554 MP',
                    cooldown: '2s',
                    target: 'Selected Target',
                    usageDistance: '3m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Summon Heat',
                            icon: '../assets/icons/wi_hydroimpact_custom_a_up.png',
                            description: d(`Deals 3224 magical fire damage.
Attacks the target every second.
If the attack lands a Crit Strike, casting time for magic skills is reduced by 30% for 5 seconds.`),
                            usageCost: '554 MP',
                            cooldown: '2s',
                            target: 'Selected Target',
                            usageDistance: '3m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Frosty Fire',
                            icon: '../assets/icons/wi_hydroimpact_custom_b_up.png',
                            description: d(`Deals 2052 magical water damage.
After a hit, the target's movement speed is reduced by 20% for 8 seconds.`),
                            usageCost: '554 MP',
                            cooldown: '2s',
                            target: 'Selected Target',
                            usageDistance: '20m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Summon Heat',
                            icon: '../assets/icons/wi_hydroimpact_custom_a.png',
                            description: d(`Deals 2686 (+26) magical fire damage.
Attacks the target every second.
If the attack lands a crit strike, casting time for magic skills is reduced by 30% for 3 seconds.`),
                            usageCost: '554 MP',
                            cooldown: '2s',
                            target: 'Selected Target',
                            usageDistance: '3m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Frosty Fire',
                            icon: '../assets/icons/wi_hydroimpact_custom_b.png',
                            description: d(`Deals 1710 (+16) magical water damage.
After a crit strike, the target's movement speed is reduced by 30% for 3 seconds.`),
                            usageCost: '554 MP',
                            cooldown: '2s',
                            target: 'Selected Target',
                            usageDistance: '20m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'sorcererSkill2',
                defaultSkill: {
                    name: 'Magic Assist',
                    icon: '../assets/icons/live_wi_manaboost_g1.png',
                    description: d(`Reduces spell casting time by 10% for 1m.
Increases Magic Attack by 500.
Increases Magical Acc by 3400.
Increases Crit Spell by 300.`),
                    usageCost: '1060 MP',
                    cooldown: '3m',
                    target: 'Self',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Arcane Growth',
                            icon: '../assets/icons/wi_manaboost_custom_a_up.png',
                            description: d(`Reduces spell casting time by 10% for 30s.
Increases Magic Attack by 1500.
Increases Crit Spell by 1500.
When attacked, there is a chance the casting time will be reduced by 50%.`),
                            usageCost: '1060 MP',
                            cooldown: '1m12s',
                            target: 'Self',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Arcane Combustion',
                            icon: '../assets/icons/wi_manaboost_custom_b_up.png',
                            description: d(`Reduces spell casting time by 30% for 1m.
Increases Magic Attack by 700.
Increases Magical Acc by 4500.
During an attack, there is a chance that the cooldowns for some skills will be reduced by 7%.
(Hell Flame of Wrath, Glacial Shard, Cyclone Strike, Flame Spray).`),
                            usageCost: '1060 MP',
                            cooldown: '2m',
                            target: 'Self',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Arcane Growth',
                            icon: '../assets/icons/wi_manaboost_custom_a.png',
                            description: d(`Reduces spell casting time by 10% for 30s.
Increases Magic Attack by 1200.
Increases Crit Spell by 1200.
When attacked, there is a chance the casting time will be reduced by 50%.`),
                            usageCost: '1060 MP',
                            cooldown: '1m30s (-0.9s)',
                            target: 'Self',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Arcane Combustion',
                            icon: '../assets/icons/wi_manaboost_custom_b.png',
                            description: d(`Reduces spell casting time by 30% for 1m.
Increases Magic Attack by 500.
Increases Magical Acc by 4000.
During an attack, there is a chance that the cooldowns for some skills will be reduced by 5%.
(Hell Flame of Wrath, Glacial Shard, Cyclone Strike, Flame Spray).`),
                            usageCost: '1060 MP',
                            cooldown: '2m30s (-1.5s)',
                            target: 'Self',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'sorcererSkill3',
                defaultSkill: {
                    name: 'Tranquillising Cloud',
                    icon: '../assets/icons/cbt_wi_sleepingcloud_g1.png',
                    description: d(`Puts the target to sleep for 10s-20s.`),
                    usageCost: '3000 DP',
                    cooldown: '5m',
                    target: 'Area within a Radius of Target',
                    usageDistance: '25m',
                    area: '5m',
                    areaIcon: 'targetCircle',
                    castTime: '2s'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Greater Tranquillising Cloud',
                            icon: '../assets/icons/wi_sleepingcloud_custom_a_up.png',
                            description: d(`Puts the target to sleep for 12s-24s.`),
                            usageCost: '3000 DP',
                            cooldown: '3m',
                            target: 'Area within a Radius of Target',
                            usageDistance: '25m',
                            area: '10m',
                            areaIcon: 'targetCircle',
                            castTime: '2s'
                        },
                        type2: {
                            name: '(Improved) Concentrated Tranquillising Cloud',
                            icon: '../assets/icons/wi_sleepingcloud_custom_b_up.png',
                            description: d(`Puts the target to sleep for 5s-10s.
The probability of resisting this skill is low.`),
                            usageCost: '1000 DP',
                            cooldown: '3m',
                            target: 'Selected Target',
                            usageDistance: '25m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle',
                            castTime: '2s'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Greater Tranquillising Cloud',
                            icon: '../assets/icons/wi_sleepingcloud_custom_a.png',
                            description: d(`Puts the target to sleep for 10s-20s.`),
                            usageCost: '3000 DP',
                            cooldown: '4m (-2.4s)',
                            target: 'Area within a Radius of Target',
                            usageDistance: '25m',
                            area: '8m',
                            areaIcon: 'targetCircle',
                            castTime: '2s'
                        },
                        type2: {
                            name: 'Concentrated Tranquillising Cloud',
                            icon: '../assets/icons/wi_sleepingcloud_custom_b.png',
                            description: d(`Puts the target to sleep for 5s-10s.
The probability of resisting this skill is low.`),
                            usageCost: '2000 DP',
                            cooldown: '4m (-2.4s)',
                            target: 'Selected Target',
                            usageDistance: '25m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle',
                            castTime: '2s'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'sorcererSkill4',
                defaultSkill: {
                    name: 'Big Magma Eruption',
                    icon: '../assets/icons/live_wi_light_stigma_volcanicflame_g1.png',
                    description: d(`Deals 3155 magical fire damage after 4s.`),
                    usageCost: '1205 MP',
                    cooldown: '30s',
                    castTime: '2s',
                    target: 'Area within a Radius of Target',
                    usageDistance: '25m',
                    area: '10m',
                    areaIcon: 'targetCircle'
                },
                rows: {
                    improved: {
                        type1: null,
                        type2: {
                            name: '(Improved) Boosted Major Eruption',
                            icon: '../assets/icons/wi_volcanicflame_custom_b_up.png',
                            description: d(`Deals 3786 magical fire damage after 4s.
Aether's Hold binds the target for 2.5 seconds.`),
                            usageCost: '1205 MP',
                            cooldown: '30s',
                            castTime: '2s',
                            target: 'Area within a Radius of Target',
                            usageDistance: '25m',
                            area: '10m',
                            areaIcon: 'targetCircle'
                        },
                        type3: {
                            name: '(Improved) Massive Seismic Blast',
                            icon: '../assets/icons/wi_volcanicflame_custom_c_up.png',
                            description: d(`Deals 3176 magical fire damage.
Knocks the target back.`),
                            usageCost: '1205 MP',
                            cooldown: '16s',
                            castTime: '1.5s',
                            target: 'Area within a Radius of Target',
                            usageDistance: '25m',
                            area: '7m',
                            areaIcon: 'targetCircle'
                        }
                    },
                    normal: {
                        type1: {
                            name: 'Major Eruption',
                            icon: '../assets/icons/wi_volcanicflame_custom_a.png',
                            description: d(`Deals 3155 magical fire damage after 4s.
Aether's Hold binds the target for 1.5 seconds.`),
                            usageCost: '1205 MP',
                            cooldown: '30s',
                            castTime: '2s',
                            target: 'Area within a Radius of Target',
                            usageDistance: '25m',
                            area: '10m',
                            areaIcon: 'targetCircle'
                        },
                        type2: {
                            name: 'Boosted Major Eruption',
                            icon: '../assets/icons/wi_volcanicflame_custom_b.png',
                            description: d(`Deals 3155 (+32) magical fire damage after 4s.
Aether's Hold binds the target for 2 seconds.`),
                            usageCost: '1205 MP',
                            cooldown: '30s',
                            castTime: '2s',
                            target: 'Area within a Radius of Target',
                            usageDistance: '25m',
                            area: '10m',
                            areaIcon: 'targetCircle'
                        },
                        type3: {
                            name: 'Massive Seismic Blast',
                            icon: '../assets/icons/wi_volcanicflame_custom_c.png',
                            description: d(`Deals 1891 (+19) magical fire damage.
Knocks the target back.`),
                            usageCost: '1205 MP',
                            cooldown: '16s',
                            castTime: '2s',
                            target: 'Area within a Radius of Target',
                            usageDistance: '25m',
                            area: '7m',
                            areaIcon: 'targetCircle'
                        }
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'sorcererSkill5',
                defaultSkill: {
                    name: 'Aether Flame',
                    icon: '../assets/icons/cbt_wi_fireshooter_g1.png',
                    description: d(`Deals 1612 magical fire damage to a target bound by Aether's Hold.`),
                    usageCost: '576 MP',
                    cooldown: '0s',
                    target: 'Selected Target',
                    usageDistance: '25m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Flameshot',
                            icon: '../assets/icons/wi_fireshooter_custom_a_up.png',
                            description: d(`Deals 2118 magical fire damage to a target bound by Aether's Hold.
Paralyses the target.`),
                            usageCost: '576 MP',
                            cooldown: '0s',
                            target: 'Area within a Radius of Target',
                            usageDistance: '25m',
                            area: '10m',
                            areaIcon: 'targetCircle'
                        },
                        type2: {
                            name: '(Improved) Flame Spurt',
                            icon: '../assets/icons/wi_fireshooter_custom_b_up.png',
                            description: d(`Deals 3871 magical fire damage to a target bound by Aether's Hold.`),
                            usageCost: '576 MP',
                            cooldown: '40s',
                            target: 'Area within a Radius of Target',
                            usageDistance: '25m',
                            area: '3x35m',
                            areaIcon: 'targetRect'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Flameshot',
                            icon: '../assets/icons/wi_fireshooter_custom_a.png',
                            description: d(`Deals 1471 (+14) magical fire damage to a target bound by Aether's Hold.
Paralyses the target.`),
                            usageCost: '576 MP',
                            cooldown: '0s',
                            target: 'Area within a Radius of Target',
                            usageDistance: '25m',
                            area: '10m',
                            areaIcon: 'targetCircle'
                        },
                        type2: {
                            name: 'Flame Spurt',
                            icon: '../assets/icons/wi_fireshooter_custom_b.png',
                            description: d(`Deals 3225 (+32) magical fire damage to a target bound by Aether's Hold.`),
                            usageCost: '576 MP',
                            cooldown: '1m',
                            target: 'Area within a Radius of Target',
                            usageDistance: '25m',
                            area: '3x35m',
                            areaIcon: 'targetRect'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'sorcererSkill6',
                defaultSkill: {
                    name: 'Storm Spear',
                    icon: '../assets/icons/live_wi_windspear_g1.png',
                    description: d(`Deals 704 magical wind damage.
Has a chance of reducing the target's movement speed.
Absorbs HP equal to 20% of the damage.
Perfect Spear of Wind
Multicast 3 times.`),
                    usageCost: '362 MP',
                    cooldown: '30s',
                    target: 'Selected Target',
                    usageDistance: '25m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Swift Spear',
                            icon: '../assets/icons/wi_windspear_custom_a_up.png',
                            description: d(`Deals 2011 magical wind damage.
Reduces Magic Defence by 600 for 8s.`),
                            usageCost: '362 MP',
                            cooldown: '20s',
                            target: 'Selected Target',
                            usageDistance: '25m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Space-Time Spear',
                            icon: '../assets/icons/wi_windspear_custom_b_up.png',
                            description: d(`Deals 846 magical wind damage.
Has a chance of reducing the target's movement speed.
Absorbs HP equal to 30% of the damage.
When using the skill, the cooldown for Blind Leap is reduced by 10%.
Multicast 3 times.`),
                            usageCost: '362 MP',
                            cooldown: '20s',
                            target: 'Selected Target',
                            usageDistance: '25m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Swift Spear',
                            icon: '../assets/icons/wi_windspear_custom_a.png',
                            description: d(`Deals 1676 (+16) magical wind damage.
Reduces Magic Defence by 300 for 8s.`),
                            usageCost: '362 MP',
                            cooldown: '40s',
                            target: 'Selected Target',
                            usageDistance: '25m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Space-Time Spear',
                            icon: '../assets/icons/wi_windspear_custom_b.png',
                            description: d(`Deals 704 (+7) magical wind damage.
Has a chance of reducing the target's movement speed.
Absorbs HP equal to 20% of the damage.
When using the skill, the cooldown for Blind Leap is reduced by 10%.
Multicast 3 times.`),
                            usageCost: '362 MP',
                            cooldown: '20s',
                            target: 'Selected Target',
                            usageDistance: '25m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            }
        ],
        spiritmaster: [
            {
                key: 'spiritmasterSkill1',
                defaultSkill: {
                    name: 'Weaken Spirit',
                    icon: '../assets/icons/cbt_el_dimisspolymorph_g1.png',
                    description: d(`Deals 2263 magical wind damage.
Deals 665 extra damage if the target is a spirit.`),
                    usageCost: '498 MP',
                    cooldown: '12s',
                    castTime: '2s',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Decaying Mind',
                            icon: '../assets/icons/el_dimisspolymorph_custom_a_up.png',
                            description: d(`Deals 3571 magical wind damage.
Deals 798 extra damage if the target is a spirit.
If you land a Crit Strike, the next skill will also deal a Crit Strike.`),
                            usageCost: '498 MP',
                            cooldown: '12s',
                            castTime: '2s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Paralysed Mind',
                            icon: '../assets/icons/el_dimisspolymorph_custom_b_up.png',
                            description: d(`Deals 2454 magical wind damage.
Immobilises the target for 2s.
Deals 798 extra damage if the target is a spirit.`),
                            usageCost: '498 MP',
                            cooldown: '12s',
                            castTime: '1s',
                            target: 'Area within a Radius of Target 8 People',
                            usageDistance: '1m',
                            area: '3m',
                            areaIcon: 'targetCircle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Decaying Mind',
                            icon: '../assets/icons/el_dimisspolymorph_custom_a.png',
                            description: d(`Deals 2480 (+25) magical wind damage.
Deals 665 extra damage if the target is a spirit.
If you land a Crit Strike, the next skill will also deal a Crit Strike.`),
                            usageCost: '498 MP',
                            cooldown: '12s',
                            castTime: '2s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Paralysed Mind',
                            icon: '../assets/icons/el_dimisspolymorph_custom_b.png',
                            description: d(`Deals 2044 (+20) magical wind damage.
Immobilises the target for 1s. There is only a slight chance this state can be removed.
Deals 665 extra damage if the target is a spirit.`),
                            usageCost: '498 MP',
                            cooldown: '12s',
                            castTime: '1s',
                            target: 'Area within a Radius of Target 8 People',
                            usageDistance: '1m',
                            area: '3m',
                            areaIcon: 'targetCircle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'spiritmasterSkill2',
                defaultSkill: {
                    name: 'Vacuum Choke',
                    icon: '../assets/icons/live_el_vacuumexplosion_g1.png',
                    description: d(`Deals 1642 magical wind damage..`),
                    usageCost: '303 MP',
                    cooldown: '1s',
                    castTime: '2s',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Titanic Vacuum Explosion',
                            icon: '../assets/icons/el_vacuumexplosion_custom_a_up.png',
                            description: d(`Deals 2564 magical wind damage.
Deals 20% additional damage to the terrified target.`),
                            usageCost: '303 MP',
                            cooldown: '1s',
                            castTime: '2s',
                            target: 'Area within a Radius of Target 8 People',
                            usageDistance: '1m',
                            area: '7m',
                            areaIcon: 'targetCircle'
                        },
                        type2: {
                            name: '(Improved) Vacuum Chain Explosion',
                            icon: '../assets/icons/el_vacuumexplosion_custom_b_up.png',
                            description: d(`Deals 1478 magical wind damage.
Increases movement speed by 40% for 3 seconds.
Multicast 2 times`),
                            usageCost: '303 MP',
                            cooldown: '4s',
                            castTime: 'Cast Instantly',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Titanic Vacuum Explosion',
                            icon: '../assets/icons/el_vacuumexplosion_custom_a.png',
                            description: d(`Deals 2136 (+21) magical wind damage.
Deals 10% additional damage to the terrified target.`),
                            usageCost: '303 MP',
                            cooldown: '1s',
                            castTime: '2s',
                            target: 'Area within a Radius of Target 8 People',
                            usageDistance: '1m',
                            area: '7m',
                            areaIcon: 'targetCircle'
                        },
                        type2: {
                            name: 'Vacuum Chain Explosion',
                            icon: '../assets/icons/el_vacuumexplosion_custom_b.png',
                            description: d(`Deals 1232 (+12) magical wind damage.
Increases movement speed by 30% for 3 seconds.
Multicast 2 times`),
                            usageCost: '303 MP',
                            cooldown: '4s',
                            castTime: 'Cast Instantly',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'spiritmasterSkill3',
                defaultSkill: {
                    name: 'Soul Torrent',
                    icon: '../assets/icons/live_el_soulsteal_g1.png',
                    description: d(`Deals 899 magical water damage.
Multicast 5 times.`),
                    usageCost: '67 MP',
                    cooldown: '24s',
                    castTime: 'Cast Instantly',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: null,
                        type2: {
                            name: '(Improved) Boosted Soul Theft',
                            icon: '../assets/icons/el_soulsteal_custom_b_up.png',
                            description: d(`Deals 1791 magical water damage.
Reduces the cooldown for skills with Weaken Spirit and Elemental Smash by 3 seconds.
Multicast 3 times`),
                            usageCost: '67 MP',
                            cooldown: '20s',
                            castTime: 'Cast Instantly',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: {
                            name: '(Improved) Soul Burn',
                            icon: '../assets/icons/el_soulsteal_custom_c_up.png',
                            description: d(`Deals 1078 magical water damage.
A hit reduces the cooldown of Dispel Magic, Ignite Aether, Magic Implosion and Magic Explosion by 5 seconds.
Multicast 5 times`),
                            usageCost: '67 MP',
                            cooldown: '30s',
                            castTime: 'Cast Instantly',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        }
                    },
                    normal: {
                        type1: {
                            name: 'Soul Theft',
                            icon: '../assets/icons/el_soulsteal_custom_a.png',
                            description: d(`Deals 899 magical water damage.
Reduces the cooldown for skills with Weaken Spirit and Elemental Smash by 1 second.
A crit strike reduces the cooldown by 2 seconds.
Multicast 5 times`),
                            usageCost: '67 MP',
                            cooldown: '24s',
                            castTime: 'Cast Instantly',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Boosted Soul Theft',
                            icon: '../assets/icons/el_soulsteal_custom_b.png',
                            description: d(`Deals 1492 (+14) magical water damage.
Reduces the cooldown for skills with Weaken Spirit and Elemental Smash by 3 seconds.
Multicast 3 times`),
                            usageCost: '67 MP',
                            cooldown: '24s',
                            castTime: 'Cast Instantly',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: {
                            name: 'Soul Burn',
                            icon: '../assets/icons/el_soulsteal_custom_c.png',
                            description: d(`Deals 899 (+9) magical water damage.
A crit strike reduces the cooldown of Dispel Magic, Ignite Aether, Magic Implosion and Magic Explosion by 5 seconds.
Multicast 5 times`),
                            usageCost: '67 MP',
                            cooldown: '24s',
                            castTime: 'Cast Instantly',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        }
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'spiritmasterSkill4',
                defaultSkill: {
                    name: 'Disenchant',
                    icon: '../assets/icons/cbt_el_disenchantment_g1.png',
                    description: d(`Removes two big magic buffs from the target..`),
                    usageCost: '3000 DP',
                    cooldown: '8m',
                    castTime: '0.5s',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Greater Disenchantment',
                            icon: '../assets/icons/el_disenchantment_custom_a_up.png',
                            description: d(`Removes three big magic buffs from the target.`),
                            usageCost: '3000 DP',
                            cooldown: '4m',
                            castTime: '0.5s',
                            target: 'Area within a Radius of Target 24 People',
                            usageDistance: '1m',
                            area: '25m',
                            areaIcon: 'targetCircle'
                        },
                        type2: {
                            name: '(Improved) Concentrated Disenchantment',
                            icon: '../assets/icons/el_disenchantment_custom_b_up.png',
                            description: d(`Removes a big magic buffs from the target.`),
                            usageCost: '2000 DP',
                            cooldown: '1m30s',
                            castTime: '0.5s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Greater Disenchantment',
                            icon: '../assets/icons/el_disenchantment_custom_a.png',
                            description: d(`Removes two big magic buffs from the target.`),
                            usageCost: '3000 DP',
                            cooldown: '5m (-3s)',
                            castTime: '0.5s',
                            target: 'Area within a Radius of Target 24 People',
                            usageDistance: '1m',
                            area: '25m',
                            areaIcon: 'targetCircle'
                        },
                        type2: {
                            name: 'Concentrated Disenchantment',
                            icon: '../assets/icons/el_disenchantment_custom_b.png',
                            description: d(`Removes a big magic buffs from the target.`),
                            usageCost: '2000 DP',
                            cooldown: '2m (-1.2s)',
                            castTime: '0.5s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'spiritmasterSkill5',
                defaultSkill: {
                    name: 'Order: Elemental Discharge',
                    icon: '../assets/icons/el_order_explode_g1.png',
                    description: d(`Commands the spirit to use its Attack Skill.
                        Every spirit can knock back enemies.
                        Order: Perfect Storm of the Elements.

Water Spirit: Magical Water Damage
Wind Spirit: Magical Wind Damage
Earth Spirit: Magical Earth Damage
Fire Spirit: Magical Fire Damage
Magma Spirit: Magical Fire Damage
Tempest Spirit: Magical wind Damage.`),
                    usageCost: '1007 MP',
                    cooldown: '3m',
                    castTime: '1s',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Command: Elemental Destruction',
                            icon: '../assets/icons/el_order_explode_custom_a_up.png',
                            description: d(`Commands the spirit to use its attack skill.

Water Spirit: Removes Magical Water Damage, Knock-back and Magic Boost
Wind Spirit: Removes Magical Wind Damage, Knock-back and Magic Boost
Earth Spirit: Removes Magical Earth Damage, Knock-back and Magic Boost
Fire Spirit: Removes Magical Fire Damage, Knock-back and Magic Boost
Magma Spirit: Removes Magical Fire Damage, Knock-back and Magic Boost
Tempest Spirit: Removes Magical Wind Damage, Knock-back and Magic Boost`),
                            usageCost: '1258 MP',
                            cooldown: '1m',
                            castTime: '1s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Command: Elemental Wave',
                            icon: '../assets/icons/el_order_explode_custom_b_up.png',
                            description: d(`Commands the spirit to use its attack skill.

Water Spirit: Magical Water Damage, Aether's Hold
Wind Spirit: Magical Wind Damage, Aether's Hold
Earth Spirit: Magical Earth Damage, Aether's Hold
Fire Spirit: Magical Fire Damage, Aether's Hold
Magma Spirit: Fire Damage, Aether's Hold
Tempest Spirit: Magical Wind Damage, Aether's Hold`),
                            usageCost: '1258 MP',
                            cooldown: '40s',
                            castTime: '1s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle',
                            linkedTooltips: [
                                {
                                    spirit: 'fire',
                                    name: '(Improved) Command: Fire Elemental Wave',
                                    icon: '../assets/icons/el_order_explode_custom_b_up.png',
                                    description: `Deals 8033 magical fire damage.
                                                  Aether's Hold binds the target.`,
                                    castTime: '0s',
                                    target: 'Area within a Radius of Target 6 People',
                                    usageDistance: '10m',
                                    area: '15m',
                                    areaIcon: 'targetCircle'
                                },
                                {
                                    spirit: 'water',
                                    name: '(Improved) Command: Water Elemental Wave',
                                    icon: '../assets/icons/el_order_explode_custom_b_up.png',
                                    description: `Deals 6906 magical water damage.
                                                  Aether's Hold binds the target.`,
                                    castTime: '0s',
                                    target: 'Area within a Radius of Target 6 People',
                                    usageDistance: '10m',
                                    area: '15m',
                                    areaIcon: 'targetCircle'
                                },
                                {
                                    spirit: 'wind',
                                    name: '(Improved) Command: Wind Elemental Wave',
                                    icon: '../assets/icons/el_order_explode_custom_b_up.png',
                                    description: `Deals 7256 magical wind damage.
                                                  Aether's Hold binds the target.`,
                                    castTime: '0s',
                                    target: 'Area within a Radius of Target 6 People',
                                    usageDistance: '10m',
                                    area: '15m',
                                    areaIcon: 'targetCircle'
                                },
                                {
                                    spirit: 'earth',
                                    name: '(Improved) Command: Earth Elemental Wave',
                                    icon: '../assets/icons/el_order_explode_custom_b_up.png',
                                    description: `Deals 7406 magical earth damage.
                                                  Aether's Hold binds the target.`,
                                    castTime: '0s',
                                    target: 'Area within a Radius of Target 6 People',
                                    usageDistance: '10m',
                                    area: '15m',
                                    areaIcon: 'targetCircle'
                                },
                                {
                                    spirit: 'tempest',
                                    name: '(Improved) Command: Storm Elemental Wave',
                                    icon: '../assets/icons/el_order_explode_custom_b_up.png',
                                    description: `Deals 8447 magical wind damage.
                                                  Aether's Hold binds the target.`,
                                    castTime: '0s',
                                    target: 'Area within a Radius of Target 6 People',
                                    usageDistance: '10m',
                                    area: '15m',
                                    areaIcon: 'targetCircle'
                                },
                                {
                                    spirit: 'magma',
                                    name: '(Improved) Command: Lava Elemental Wave',
                                    icon: '../assets/icons/el_order_explode_custom_b_up.png',
                                    description: `Deals 8447 magical fire damage.
                                                  Aether's Hold binds the target.`,
                                    castTime: '0s',
                                    target: 'Area within a Radius of Target 6 People',
                                    usageDistance: '10m',
                                    area: '15m',
                                    areaIcon: 'targetCircle'
                                }
                            ]
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Command: Elemental Destruction',
                            icon: '../assets/icons/el_order_explode_custom_a.png',
                            description: d(`Commands the spirit to use its Attack Skill.

Water Spirit: Removes Magical Water Damage, Knock-back and Magic Boost
Wind Spirit: Removes Magical Wind Damage, Knock-back and Magic Boost
Earth Spirit: Removes Magical Earth Damage, Knock-back and Magic Boost
Fire Spirit: Removes Magical Fire Damage, Knock-back and Magic Boost
Magma Spirit: Removes Magical Fire Damage, Knock-back and Magic Boost
Tempest Spirit: Removes Magical Wind Damage, Knock-back and Magic Boost`),
                            usageCost: '1258 MP',
                            cooldown: '1m30s (-0.9s)',
                            castTime: '1s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Command: Elemental Wave',
                            icon: '../assets/icons/el_order_explode_custom_b.png',
                            description: d(`Commands the spirit to use its Attack Skill.

Water Spirit: Magical Water Damage, Aether's Hold
Wind Spirit: Magical Wind Damage, Aether's Hold
Earth Spirit: Magical Earth Damage, Aether's Hold
Fire Spirit: Magical Fire Damage, Aether's Hold
Magma Spirit: Fire Damage, Aether's Hold
Tempest Spirit: Magical Wind Damage, Aether's Hold`),
                            usageCost: '1258 MP',
                            cooldown: '1m (-0.6s)',
                            castTime: '1s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'spiritmasterSkill6',
                defaultSkill: {
                    name: 'Nightmare Scream',
                    icon: '../assets/icons/cbt_el_terrorspirit_g1.png',
                    description: d(`Terrifies the target for 13s-14s.
Reduces the target's movement speed.
Increases the target's Magic Defence by 2000.
Increases the target's Physical Defence by 2000.
The duration is reduced by 50% when applied to a player.
Perfect Fear Shriek.`),
                    usageCost: '1092 MP',
                    cooldown: '45s',
                    castTime: '1.5s',
                    pvpDuration: '50%',
                    target: 'Area within a Radius of Target',
                    usageDistance: '1m',
                    area: '15m',
                    areaIcon: 'targetCircle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Nightmare Curse',
                            icon: '../assets/icons/el_terrorspirit_custom_a_up.png',
                            description: d(`Terrifies the target for 14s-15s.
Greatly reduces the target's movement speed.
Increases the target's Magic Defence by 2000.
Increases the target's Physical Defence by 2000.
The probability of resisting this skill is low.
The duration is reduced by 50% when applied to a player.`),
                            usageCost: '1092 MP',
                            cooldown: '45s',
                            castTime: '1.5s',
                            pvpDuration: '50%',
                            target: 'Area within a Radius of Target',
                            usageDistance: '1m',
                            area: '15m',
                            areaIcon: 'targetCircle'
                        },
                        type2: {
                            name: '(Improved) Nightmare Sorrow',
                            icon: '../assets/icons/el_terrorspirit_custom_b_up.png',
                            description: d(`Terrifies the target for 10s-11s.
Reduces the target's movement speed.
Increases the target's Magic Defence by 2000.
Increases the target's Physical Defence by 2000.
The duration is reduced by 50% when applied to a player.`),
                            usageCost: '1092 MP',
                            cooldown: '45s',
                            castTime: '0.5s',
                            pvpDuration: '50%',
                            target: 'Area within a Radius of Target',
                            usageDistance: '1m',
                            area: '15m',
                            areaIcon: 'targetCircle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Nightmare Curse',
                            icon: '../assets/icons/el_terrorspirit_custom_a.png',
                            description: d(`Terrifies the target for 13s-14s.
Greatly reduces the target's movement speed.
Increases the target's Magic Defence by 2000.
Increases the target's Physical Defence by 2000.
The probability of resisting this skill is low.
The duration is reduced by 50% when applied to a player.`),
                            usageCost: '1092 MP',
                            cooldown: '1m (-0.6s)',
                            castTime: '1.5s',
                            pvpDuration: '50%',
                            target: 'Area within a Radius of Target',
                            usageDistance: '1m',
                            area: '15m',
                            areaIcon: 'targetCircle'
                        },
                        type2: {
                            name: 'Nightmare Sorrow',
                            icon: '../assets/icons/el_terrorspirit_custom_b.png',
                            description: d(`Terrifies the target for 9s-10s.
Reduces the target's movement speed.
Increases the target's Magic Defence by 2000.
Increases the target's Physical Defence by 2000.
The duration is reduced by 50% when applied to a player.`),
                            usageCost: '1092 MP',
                            cooldown: '1m (-0.6s)',
                            castTime: '0.5s',
                            pvpDuration: '50%',
                            target: 'Area within a Radius of Target',
                            usageDistance: '1m',
                            area: '15m',
                            areaIcon: 'targetCircle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            }
        ],
        cleric: [
            {
                key: 'clericSkill1',
                defaultSkill: {
                    name: 'Immortal Shroud',
                    icon: '../assets/icons/live_pr_invinsiblewall_g1.png',
                    description: d(`DummydefaultskillforClericSkill1.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Indestructible Shield Wall',
                            icon: '../assets/icons/pr_invinsiblewall_custom_a_up.png',
                            description: d(`DummydescriptionClericSkill1Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Indestructible Protective Shield',
                            icon: '../assets/icons/pr_invinsiblewall_custom_b_up.png',
                            description: d(`DummydescriptionClericSkill1Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Indestructible Shield Wall',
                            icon: '../assets/icons/pr_invinsiblewall_custom_a.png',
                            description: d(`DummydescriptionClericSkill1Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Indestructible Protective Shield',
                            icon: '../assets/icons/pr_invinsiblewall_custom_b.png',
                            description: d(`DummydescriptionClericSkill1Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'clericSkill2',
                defaultSkill: {
                    name: 'Salvation',
                    icon: '../assets/icons/cbt_pr_secretprecept_g1.png',
                    description: d(`DummydefaultskillforClericSkill2.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Swift Intervention',
                            icon: '../assets/icons/pr_secretprecept_custom_a_up.png',
                            description: d(`DummydescriptionClericSkill2Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Guarding Intervention',
                            icon: '../assets/icons/pr_secretprecept_custom_b_up.png',
                            description: d(`DummydescriptionClericSkill2Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Swift Intervention',
                            icon: '../assets/icons/pr_secretprecept_custom_a.png',
                            description: d(`DummydescriptionClericSkill2Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Guarding Intervention',
                            icon: '../assets/icons/pr_secretprecept_custom_b.png',
                            description: d(`DummydescriptionClericSkill2Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'clericSkill3',
                defaultSkill: {
                    name: 'Flash of Recovery',
                    icon: '../assets/icons/cbt_pr_firstaid_g1.png',
                    description: d(`DummydefaultskillforClericSkill3.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Ray of Restoration',
                            icon: '../assets/icons/pr_firstaid_custom_a_up.png',
                            description: d(`DummydescriptionClericSkill3Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Restoration Strike',
                            icon: '../assets/icons/pr_firstaid_custom_b_up.png',
                            description: d(`DummydescriptionClericSkill3Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Ray of Restoration',
                            icon: '../assets/icons/pr_firstaid_custom_a.png',
                            description: d(`DummydescriptionClericSkill3Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Restoration Strike',
                            icon: '../assets/icons/pr_firstaid_custom_b.png',
                            description: d(`DummydescriptionClericSkill3Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'clericSkill4',
                defaultSkill: {
                    name: 'Divine Spark',
                    icon: '../assets/icons/cbt_pr_divinespark_g1.png',
                    description: d(`DummydefaultskillforClericSkill4.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Discharge Paralysis',
                            icon: '../assets/icons/pr_divinespark_custom_a_up.png',
                            description: d(`DummydescriptionClericSkill4Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Chain Discharge',
                            icon: '../assets/icons/pr_divinespark_custom_b_up.png',
                            description: d(`DummydescriptionClericSkill4Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Discharge Paralysis',
                            icon: '../assets/icons/pr_divinespark_custom_a.png',
                            description: d(`DummydescriptionClericSkill4Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Chain Discharge',
                            icon: '../assets/icons/pr_divinespark_custom_b.png',
                            description: d(`DummydescriptionClericSkill4Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'clericSkill5',
                defaultSkill: {
                    name: 'Divine Touch',
                    icon: '../assets/icons/cbt_pr_divinetouch_g1.png',
                    description: d(`DummydefaultskillforClericSkill5.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: null,
                        type2: {
                            name: '(Improved) Boosted Thunder',
                            icon: '../assets/icons/pr_divinetouch_custom_b_up.png',
                            description: d(`DummydescriptionClericSkill5Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: {
                            name: '(Improved) Chain Lightning',
                            icon: '../assets/icons/pr_divinetouch_custom_c_up.png',
                            description: d(`DummydescriptionClericSkill5Type3improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        }
                    },
                    normal: {
                        type1: {
                            name: 'Thunder',
                            icon: '../assets/icons/pr_soniceruption_custom_a.png',
                            description: d(`DummydescriptionClericSkill5Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Boosted Thunder',
                            icon: '../assets/icons/pr_divinetouch_custom_b.png',
                            description: d(`DummydescriptionClericSkill5Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: {
                            name: 'Chain Lightning',
                            icon: '../assets/icons/pr_divinetouch_custom_c.png',
                            description: d(`DummydescriptionClericSkill5Type3normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        }
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'clericSkill6',
                defaultSkill: {
                    name: 'Light of Recovery',
                    icon: '../assets/icons/cbt_pr_emergentheal_g1.png',
                    description: d(`DummydefaultskillforClericSkill6.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Miracle Healing',
                            icon: '../assets/icons/pr_emergentheal_custom_a_up.png',
                            description: d(`DummydescriptionClericSkill6Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Hand of Healing',
                            icon: '../assets/icons/pr_emergentheal_custom_b_up.png',
                            description: d(`DummydescriptionClericSkill6Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Miracle Healing',
                            icon: '../assets/icons/pr_emergentheal_custom_a.png',
                            description: d(`DummydescriptionClericSkill6Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Hand of Healing',
                            icon: '../assets/icons/pr_emergentheal_custom_b.png',
                            description: d(`DummydescriptionClericSkill6Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            }
        ],
        chanter: [
            {
                key: 'chanterSkill1',
                defaultSkill: {
                    name: 'Inescapable Judgment',
                    icon: '../assets/icons/cbt_ch_mortalstrike_g1.png',
                    description: d(`DummydefaultskillforChanterSkill1.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Penetrating Wave',
                            icon: '../assets/icons/ch_mortalstrike_custom_a_up.png',
                            description: d(`DummydescriptionChanterSkill1Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Blind Breakthrough',
                            icon: '../assets/icons/ch_mortalstrike_custom_b_up.png',
                            description: d(`DummydescriptionChanterSkill1Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Penetrating Wave',
                            icon: '../assets/icons/ch_mortalstrike_custom_a.png',
                            description: d(`DummydescriptionChanterSkill1Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Blind Breakthrough',
                            icon: '../assets/icons/ch_mortalstrike_custom_b.png',
                            description: d(`DummydescriptionChanterSkill1Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'chanterSkill2',
                defaultSkill: {
                    name: 'Seismic Crash',
                    icon: '../assets/icons/live_ch_presssmash_g1.png',
                    description: d(`DummydefaultskillforChanterSkill2.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Seismic Blast',
                            icon: '../assets/icons/ch_presssmash_custom_a_up.png',
                            description: d(`DummydescriptionChanterSkill2Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Seismic Termination',
                            icon: '../assets/icons/ch_presssmash_custom_b_up.png',
                            description: d(`DummydescriptionChanterSkill2Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Seismic Blast',
                            icon: '../assets/icons/ch_presssmash_custom_a.png',
                            description: d(`DummydescriptionChanterSkill2Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Seismic Termination',
                            icon: '../assets/icons/ch_presssmash_custom_b.png',
                            description: d(`DummydescriptionChanterSkill2Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'chanterSkill3',
                defaultSkill: {
                    name: 'Recovery Magic',
                    icon: '../assets/icons/live_ch_stigma_recoverword_g1.png',
                    description: d(`DummydefaultskillforChanterSkill3.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Dissolution Spell',
                            icon: '../assets/icons/ch_recoverword_custom_a_up.png',
                            description: d(`DummydescriptionChanterSkill3Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Protection Spell',
                            icon: '../assets/icons/ch_recoverword_custom_b_up.png',
                            description: d(`DummydescriptionChanterSkill3Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Dissolution Spell',
                            icon: '../assets/icons/ch_recoverword_custom_a.png',
                            description: d(`DummydescriptionChanterSkill3Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Protection Spell',
                            icon: '../assets/icons/ch_recoverword_custom_b.png',
                            description: d(`DummydescriptionChanterSkill3Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'chanterSkill4',
                defaultSkill: {
                    name: 'Resonance Attack',
                    icon: '../assets/icons/cbt_ch_sonicgenoside_g1.png',
                    description: d(`DummydefaultskillforChanterSkill4.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: null,
                        type2: {
                            name: '(Improved) Boosted Resonance Disruption',
                            icon: '../assets/icons/ch_sonicgenoside_custom_b_up.png',
                            description: d(`DummydescriptionChanterSkill4Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: {
                            name: '(Improved) Second Resonance Slash',
                            icon: '../assets/icons/ch_sonicgenoside_custom_c_up.png',
                            description: d(`DummydescriptionChanterSkill4Type3improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        }
                    },
                    normal: {
                        type1: {
                            name: 'Resonance Disruption',
                            icon: '../assets/icons/ch_sonicgenoside_custom_a.png',
                            description: d(`DummydescriptionChanterSkill4Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Boosted Resonance Disruption',
                            icon: '../assets/icons/ch_sonicgenoside_custom_b.png',
                            description: d(`DummydescriptionChanterSkill4Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: {
                            name: 'Second Resonance Slash',
                            icon: '../assets/icons/ch_sonicgenoside_custom_c.png',
                            description: d(`DummydescriptionChanterSkill4Type3normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        }
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'chanterSkill5',
                defaultSkill: {
                    name: 'Chain Strike',
                    icon: '../assets/icons/ch_rapidthrust_g1.png',
                    description: d(`DummydefaultskillforChanterSkill5.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Chain Decapitation',
                            icon: '../assets/icons/ch_rapidthrust_custom_a_up.png',
                            description: d(`DummydescriptionChanterSkill5Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Blind Pursuit',
                            icon: '../assets/icons/ch_rapidthrust_custom_b_up.png',
                            description: d(`DummydescriptionChanterSkill5Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Chain Decapitation',
                            icon: '../assets/icons/ch_rapidthrust_custom_a.png',
                            description: d(`DummydescriptionChanterSkill5Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Blind Pursuit',
                            icon: '../assets/icons/ch_rapidthrust_custom_b.png',
                            description: d(`DummydescriptionChanterSkill5Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'chanterSkill6',
                defaultSkill: {
                    name: 'Protection Zone',
                    icon: '../assets/icons/live_ch_protectself_g8.png',
                    description: d(`DummydefaultskillforChanterSkill6.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Shelter of Regeneration',
                            icon: '../assets/icons/ev_ch_protectself_custom_a_up.png',
                            description: d(`DummydescriptionChanterSkill6Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Shelter of Resistance',
                            icon: '../assets/icons/ev_ch_protectself_custom_b_up.png',
                            description: d(`DummydescriptionChanterSkill6Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Shelter of Regeneration',
                            icon: '../assets/icons/ev_ch_protectself_custom_a.png',
                            description: d(`DummydescriptionChanterSkill6Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Shelter of Resistance',
                            icon: '../assets/icons/ev_ch_protectself_custom_b.png',
                            description: d(`DummydescriptionChanterSkill6Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            }
        ],
        gunner: [
            {
                key: 'gunnerSkill1',
                defaultSkill: {
                    name: 'Gunner Skill 1 Default',
                    icon: '../assets/icons/live_gu_magicalstrength_g1.png',
                    description: d(`DummydefaultskillforGunnerSkill1.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Magic\'s Blessing',
                            icon: '../assets/icons/gu_magicalstrength_custom_a_up.png',
                            description: d(`DummydescriptionGunnerSkill1Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Focused Magic',
                            icon: '../assets/icons/gu_magicalstrength_custom_b_up.png',
                            description: d(`DummydescriptionGunnerSkill1Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Magic\'s Blessing',
                            icon: '../assets/icons/gu_magicalstrength_custom_a.png',
                            description: d(`DummydescriptionGunnerSkill1Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Focused Magic',
                            icon: '../assets/icons/gu_magicalstrength_custom_b.png',
                            description: d(`DummydescriptionGunnerSkill1Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'gunnerSkill2',
                defaultSkill: {
                    name: 'Insert Magic Projectile',
                    icon: '../assets/icons/live_gu_firechainreload_g1.png',
                    description: d(`DummydefaultskillforGunnerSkill2.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Load Cannonball',
                            icon: '../assets/icons/gu_firechainreload_custom_a_up.png',
                            description: d(`DummydescriptionGunnerSkill2Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Load Magic Projectile',
                            icon: '../assets/icons/gu_firechainreload_custom_b_up.png',
                            description: d(`DummydescriptionGunnerSkill2Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Load Cannonball',
                            icon: '../assets/icons/gu_firechainreload_custom_a.png',
                            description: d(`DummydescriptionGunnerSkill2Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Load Magic Projectile',
                            icon: '../assets/icons/gu_firechainreload_custom_b.png',
                            description: d(`DummydescriptionGunnerSkill2Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'gunnerSkill3',
                defaultSkill: {
                    name: 'Headshot',
                    icon: '../assets/icons/live_gu_foreheadsnipe_g1.png',
                    description: d(`DummydefaultskillforGunnerSkill3.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Fire Head Throughshot',
                            icon: '../assets/icons/gu_foreheadsnipe_custom_a_up.png',
                            description: d(`DummydescriptionGunnerSkill3Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Concentrated Headshot',
                            icon: '../assets/icons/gu_foreheadsnipe_custom_b_up.png',
                            description: d(`DummydescriptionGunnerSkill3Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Fire Head Throughshot',
                            icon: '../assets/icons/gu_foreheadsnipe_custom_a.png',
                            description: d(`DummydescriptionGunnerSkill3Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Concentrated Headshot',
                            icon: '../assets/icons/gu_foreheadsnipe_custom_b.png',
                            description: d(`DummydescriptionGunnerSkill3Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'gunnerSkill4',
                defaultSkill: {
                    name: 'Snow Projectile',
                    icon: '../assets/icons/live_gu_iceballcannon_g1.png',
                    description: d(`DummydefaultskillforGunnerSkill4.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Paralysing Projectile',
                            icon: '../assets/icons/gu_iceballcannon_custom_a_up.png',
                            description: d(`DummydescriptionGunnerSkill4Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Binding Projectile',
                            icon: '../assets/icons/gu_iceballcannon_custom_b_up.png',
                            description: d(`DummydescriptionGunnerSkill4Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Paralysing Projectile',
                            icon: '../assets/icons/gu_iceballcannon_custom_a.png',
                            description: d(`DummydescriptionGunnerSkill4Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Binding Projectile',
                            icon: '../assets/icons/gu_iceballcannon_custom_b.png',
                            description: d(`DummydescriptionGunnerSkill4Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'gunnerSkill5',
                defaultSkill: {
                    name: 'Restoration Volley',
                    icon: '../assets/icons/live_gu_drainattack_g1.png',
                    description: d(`DummydefaultskillforGunnerSkill5.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: null,
                        type2: {
                            name: '(Improved) Boosted Rapid Fire of Restoration',
                            icon: '../assets/icons/gu_drainattack_custom_b_up.png',
                            description: d(`DummydescriptionGunnerSkill5Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: {
                            name: '(Improved) Gun Salute',
                            icon: '../assets/icons/gu_drainattack_custom_c_up.png',
                            description: d(`DummydescriptionGunnerSkill5Type3improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        }
                    },
                    normal: {
                        type1: {
                            name: 'Rapid Fire of Restoration',
                            icon: '../assets/icons/gu_drainattack_custom_a.png',
                            description: d(`DummydescriptionGunnerSkill5Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Boosted Rapid Fire of Restoration',
                            icon: '../assets/icons/gu_drainattack_custom_b.png',
                            description: d(`DummydescriptionGunnerSkill5Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: {
                            name: 'Gun Salute',
                            icon: '../assets/icons/gu_drainattack_custom_c.png',
                            description: d(`DummydescriptionGunnerSkill5Type3normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        }
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'gunnerSkill6',
                defaultSkill: {
                    name: 'Concentrated Cannon Shot',
                    icon: '../assets/icons/live_gu_snipingshot_g1.png',
                    description: d(`DummydefaultskillforGunnerSkill6.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Gunner Skill 6 Type 1',
                            icon: '../assets/icons/gu_snipingshot_custom_a_up.png',
                            description: d(`DummydescriptionGunnerSkill6Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Gunner Skill 6 Type 2',
                            icon: '../assets/icons/gu_snipingshot_custom_b_up.png',
                            description: d(`DummydescriptionGunnerSkill6Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Gunner Skill 6 Type 1',
                            icon: '../assets/icons/gu_snipingshot_custom_a.png',
                            description: d(`DummydescriptionGunnerSkill6Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Gunner Skill 6 Type 2',
                            icon: '../assets/icons/gu_snipingshot_custom_b.png',
                            description: d(`DummydescriptionGunnerSkill6Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            }
        ],
        aethertech: [
            {
                key: 'aethertechSkill1',
                defaultSkill: {
                    name: 'Cannon Shot Riposte',
                    icon: '../assets/icons/ri_breakingattack_g1.png',
                    description: d(`DummydefaultskillforAethertechSkill1.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: null,
                        type2: {
                            name: '(Improved) Aethertech Skill 1 Type 2',
                            icon: '../assets/icons/ri_breakingattack_custom_b_up.png',
                            description: d(`DummydescriptionAethertechSkill1Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: {
                            name: '(Improved) Aethertech Skill 1 Type 3',
                            icon: '../assets/icons/ri_breakingattack_custom_c_up.png',
                            description: d(`DummydescriptionAethertechSkill1Type3improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        }
                    },
                    normal: {
                        type1: {
                            name: 'Counter Cannon Fire',
                            icon: '../assets/icons/ri_breakingattack_custom_a.png',
                            description: d(`DummydescriptionAethertechSkill1Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Boosted Counter Cannon Fire',
                            icon: '../assets/icons/ri_breakingattack_custom_b.png',
                            description: d(`DummydescriptionAethertechSkill1Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: {
                            name: 'Large-scale Cannon Shot',
                            icon: '../assets/icons/ri_breakingattack_custom_c.png',
                            description: d(`DummydescriptionAethertechSkill1Type3normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        }
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'aethertechSkill2',
                defaultSkill: {
                    name: 'Protective Veil',
                    icon: '../assets/icons/ri_protectioncurtain_g1.png',
                    description: d(`DummydefaultskillforAethertechSkill2.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Emergency Shroud of Protection',
                            icon: '../assets/icons/ri_protectioncurtain_custom_a_up.png',
                            description: d(`DummydescriptionAethertechSkill2Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Protective Shroud of Resistance',
                            icon: '../assets/icons/ri_protectioncurtain_custom_b_up.png',
                            description: d(`DummydescriptionAethertechSkill2Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Emergency Shroud of Protection',
                            icon: '../assets/icons/ri_protectioncurtain_custom_a.png',
                            description: d(`DummydescriptionAethertechSkill2Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Protective Shroud of Resistance',
                            icon: '../assets/icons/ri_protectioncurtain_custom_b.png',
                            description: d(`DummydescriptionAethertechSkill2Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'aethertechSkill3',
                defaultSkill: {
                    name: 'Repeated Cannon Shot',
                    icon: '../assets/icons/ri_chainfire_g1.png',
                    description: d(`DummydefaultskillforAethertechSkill3.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Chain Shot',
                            icon: '../assets/icons/ri_chainfire_custom_a_up.png',
                            description: d(`DummydescriptionAethertechSkill3Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Loaded Cannon Fire',
                            icon: '../assets/icons/ri_chainfire_custom_b_up.png',
                            description: d(`DummydescriptionAethertechSkill3Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Chain Shot',
                            icon: '../assets/icons/ri_chainfire_custom_a.png',
                            description: d(`DummydescriptionAethertechSkill3Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Loaded Cannon Fire',
                            icon: '../assets/icons/ri_chainfire_custom_b.png',
                            description: d(`DummydescriptionAethertechSkill3Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'aethertechSkill4',
                defaultSkill: {
                    name: 'Silence Smash',
                    icon: '../assets/icons/ri_shockstrike_g1.png',
                    description: d(`DummydefaultskillforAethertechSkill4.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Heavy Silencing Blow',
                            icon: '../assets/icons/ri_shockstrike_custom_a_up.png',
                            description: d(`DummydescriptionAethertechSkill4Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Silencing Cannon Fire',
                            icon: '../assets/icons/ri_shockstrike_custom_b_up.png',
                            description: d(`DummydescriptionAethertechSkill4Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Heavy Silencing Blow',
                            icon: '../assets/icons/ri_shockstrike_custom_a.png',
                            description: d(`DummydescriptionAethertechSkill4Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Silencing Cannon Fire',
                            icon: '../assets/icons/ri_shockstrike_custom_b.png',
                            description: d(`DummydescriptionAethertechSkill4Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'aethertechSkill5',
                defaultSkill: {
                    name: 'Idium Strike',
                    icon: '../assets/icons/ri_chargedpunch_g1.png',
                    description: d(`DummydefaultskillforAethertechSkill5.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Idium Blow',
                            icon: '../assets/icons/ri_chargedpunch_1_custom_a_up.png',
                            description: d(`DummydescriptionAethertechSkill5Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Idium Surface Strike',
                            icon: '../assets/icons/ri_chargedpunch_1_custom_b_up.png',
                            description: d(`DummydescriptionAethertechSkill5Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Idium Blow',
                            icon: '../assets/icons/ri_chargedpunch_1_custom_a.png',
                            description: d(`DummydescriptionAethertechSkill5Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Idium Surface Strike',
                            icon: '../assets/icons/ri_chargedpunch_1_custom_b.png',
                            description: d(`DummydescriptionAethertechSkill5Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'aethertechSkill6',
                defaultSkill: {
                    name: 'Overcoming Limits',
                    icon: '../assets/icons/ri_highendoverdrive_g1.png',
                    description: d(`DummydefaultskillforAethertechSkill6.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Extreme Effort',
                            icon: '../assets/icons/ev_ri_highendoverdrive_custom_a_up.png',
                            description: d(`DummydescriptionAethertechSkill6Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Limitless Power',
                            icon: '../assets/icons/ev_ri_highendoverdrive_custom_b_up.png',
                            description: d(`DummydescriptionAethertechSkill6Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Extreme Effort',
                            icon: '../assets/icons/ev_ri_highendoverdrive_custom_a.png',
                            description: d(`DummydescriptionAethertechSkill6Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Limitless Power',
                            icon: '../assets/icons/ev_ri_highendoverdrive_custom_b.png',
                            description: d(`DummydescriptionAethertechSkill6Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            }
        ],
        bard: [
            {
                key: 'bardSkill1',
                defaultSkill: {
                    name: 'Harmony of Destruction',
                    icon: '../assets/icons/live_ba_songofmentalic_g1.png',
                    description: d(`DummydefaultskillforBardSkill1.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Ironclad Tank Harmony',
                            icon: '../assets/icons/ba_songofmentalic_custom_a_up.png',
                            description: d(`DummydescriptionBardSkill1Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Harmony of Vengeance',
                            icon: '../assets/icons/ba_songofmentalic_custom_b_up.png',
                            description: d(`DummydescriptionBardSkill1Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Ironclad Tank Harmony',
                            icon: '../assets/icons/ba_songofmentalic_custom_a.png',
                            description: d(`DummydescriptionBardSkill1Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Harmony of Vengeance',
                            icon: '../assets/icons/ba_songofmentalic_custom_b.png',
                            description: d(`DummydescriptionBardSkill1Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'bardSkill2',
                defaultSkill: {
                    name: 'Gentle Echo',
                    icon: '../assets/icons/live_ar_songofheal_g1.png',
                    description: d(`DummydefaultskillforBardSkill2.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Soft Resonance',
                            icon: '../assets/icons/ba_songofheal_custom_a_up.png',
                            description: d(`DummydescriptionBardSkill2Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Soft Reverb',
                            icon: '../assets/icons/ba_songofheal_custom_b_up.png',
                            description: d(`DummydescriptionBardSkill2Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Soft Resonance',
                            icon: '../assets/icons/ba_songofheal_custom_a.png',
                            description: d(`DummydescriptionBardSkill2Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Soft Reverb',
                            icon: '../assets/icons/ba_songofheal_custom_b.png',
                            description: d(`DummydescriptionBardSkill2Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'bardSkill3',
                defaultSkill: {
                    name: 'Symphony of Wrath',
                    icon: '../assets/icons/live_ba_songofanger_g1.png',
                    description: d(`DummydefaultskillforBardSkill3.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Symphony of Rage',
                            icon: '../assets/icons/ba_songofanger_custom_a_up.png',
                            description: d(`DummydescriptionBardSkill3Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Aether Symphony',
                            icon: '../assets/icons/ba_songofanger_custom_b_up.png',
                            description: d(`DummydescriptionBardSkill3Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Symphony of Rage',
                            icon: '../assets/icons/ba_songofanger_custom_a.png',
                            description: d(`DummydescriptionBardSkill3Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Aether Symphony',
                            icon: '../assets/icons/ba_songofanger_custom_b.png',
                            description: d(`DummydescriptionBardSkill3Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'bardSkill4',
                defaultSkill: {
                    name: 'Illusion Variation',
                    icon: '../assets/icons/live_ba_requiem_g1.png',
                    description: d(`DummydefaultskillforBardSkill4.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Illusion Ensemble',
                            icon: '../assets/icons/ba_requiem_1_custom_a_up.png',
                            description: d(`DummydescriptionBardSkill4Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Illusion Symphony',
                            icon: '../assets/icons/ba_requiem_1_custom_b_up.png',
                            description: d(`DummydescriptionBardSkill4Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Illusion Ensemble',
                            icon: '../assets/icons/ba_requiem_1_custom_a.png',
                            description: d(`DummydescriptionBardSkill4Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Illusion Symphony',
                            icon: '../assets/icons/ba_requiem_1_custom_b.png',
                            description: d(`DummydescriptionBardSkill4Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'bardSkill5',
                defaultSkill: {
                    name: 'Storm Requiem',
                    icon: '../assets/icons/live_ba_songofgust_g1.png',
                    description: d(`DummydefaultskillforBardSkill5.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: null,
                        type2: {
                            name: '(Improved) Boosted Storm Variation',
                            icon: '../assets/icons/ba_songofgust_custom_b_up.png',
                            description: d(`DummydescriptionBardSkill5Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: {
                            name: '(Improved) Storm Harmony',
                            icon: '../assets/icons/ba_songofgust_custom_c_up.png',
                            description: d(`DummydescriptionBardSkill5Type3improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        }
                    },
                    normal: {
                        type1: {
                            name: 'Storm Variation',
                            icon: '../assets/icons/ba_songofgust_custom_a.png',
                            description: d(`DummydescriptionBardSkill5Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Boosted Storm Variation',
                            icon: '../assets/icons/ba_songofgust_custom_b.png',
                            description: d(`DummydescriptionBardSkill5Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: {
                            name: 'Storm Harmony',
                            icon: '../assets/icons/ba_songofgust_custom_c.png',
                            description: d(`DummydescriptionBardSkill5Type3normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        }
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'bardSkill6',
                defaultSkill: {
                    name: 'Snowflower Melody',
                    icon: '../assets/icons/live_ba_sanctuary_g1.png',
                    description: d(`DummydefaultskillforBardSkill6.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Purifying Snowflower Melody',
                            icon: '../assets/icons/ba_sanctuary_custom_a_up.png',
                            description: d(`DummydescriptionBardSkill6Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Protective Snowflower Melody',
                            icon: '../assets/icons/ba_sanctuary_custom_b_up.png',
                            description: d(`DummydescriptionBardSkill6Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Purifying Snowflower Melody',
                            icon: '../assets/icons/ba_sanctuary_custom_a.png',
                            description: d(`DummydescriptionBardSkill6Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Protective Snowflower Melody',
                            icon: '../assets/icons/ba_sanctuary_custom_b.png',
                            description: d(`DummydescriptionBardSkill6Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            }
        ],
        painter: [
            {
                key: 'painterSkill1',
                defaultSkill: {
                    name: 'Band of Rage',
                    icon: '../assets/icons/pa_paintshooter_g1.png',
                    description: d(`DummydefaultskillforPainterSkill1.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Band of Fierceness',
                            icon: '../assets/icons/pa_paintshooter_custom_a_up.png',
                            description: d(`DummydescriptionPainterSkill1Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Band of Forbearance',
                            icon: '../assets/icons/pa_paintshooter_custom_b_up.png',
                            description: d(`DummydescriptionPainterSkill1Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Band of Rage',
                            icon: '../assets/icons/pa_paintshooter_custom_a.png',
                            description: d(`DummydescriptionPainterSkill1Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Band of Forbearance',
                            icon: '../assets/icons/pa_paintshooter_custom_b.png',
                            description: d(`DummydescriptionPainterSkill1Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'painterSkill2',
                defaultSkill: {
                    name: 'Time Holding',
                    icon: '../assets/icons/pa_viscidpaintshooter_g1.png',
                    description: d(`DummydefaultskillforPainterSkill2.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Gravity Binding',
                            icon: '../assets/icons/pa_viscidpaintshooter_custom_a_up.png',
                            description: d(`DummydescriptionPainterSkill2Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Time Binding',
                            icon: '../assets/icons/pa_viscidpaintshooter_custom_b_up.png',
                            description: d(`DummydescriptionPainterSkill2Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Gravity Binding',
                            icon: '../assets/icons/pa_viscidpaintshooter_custom_a.png',
                            description: d(`DummydescriptionPainterSkill2Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Time Binding',
                            icon: '../assets/icons/pa_viscidpaintshooter_custom_b.png',
                            description: d(`DummydescriptionPainterSkill2Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'painterSkill3',
                defaultSkill: {
                    name: 'Colour Immersion',
                    icon: '../assets/icons/pa_sprinklepaint_g1.png',
                    description: d(`DummydefaultskillforPainterSkill3.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Sustained Colour Immersion',
                            icon: '../assets/icons/pa_sprinklepaint_custom_a_up.png',
                            description: d(`DummydescriptionPainterSkill3Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Colour Explosion',
                            icon: '../assets/icons/pa_sprinklepaint_custom_b_up.png',
                            description: d(`DummydescriptionPainterSkill3Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Sustained Colour Immersion',
                            icon: '../assets/icons/pa_sprinklepaint_custom_a.png',
                            description: d(`DummydescriptionPainterSkill3Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Colour Explosion',
                            icon: '../assets/icons/pa_sprinklepaint_custom_b.png',
                            description: d(`DummydescriptionPainterSkill3Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'painterSkill4',
                defaultSkill: {
                    name: 'Surprise Attack',
                    icon: '../assets/icons/pa_scaringatk_g1.png',
                    description: d(`DummydefaultskillforPainterSkill4.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Sudden Smash',
                            icon: '../assets/icons/pa_scaringatk_custom_a_up.png',
                            description: d(`DummydescriptionPainterSkill4Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Shocking Blast',
                            icon: '../assets/icons/pa_scaringatk_custom_b_up.png',
                            description: d(`DummydescriptionPainterSkill4Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Sudden Smash',
                            icon: '../assets/icons/pa_scaringatk_custom_a.png',
                            description: d(`DummydescriptionPainterSkill4Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Shocking Blast',
                            icon: '../assets/icons/pa_scaringatk_custom_b.png',
                            description: d(`DummydescriptionPainterSkill4Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'painterSkill5',
                defaultSkill: {
                    name: 'Portrait of Resurrection',
                    icon: '../assets/icons/pa_paintcovering_g1.png',
                    description: d(`DummydefaultskillforPainterSkill5.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Colour of Transcendence',
                            icon: '../assets/icons/pa_paintcovering_custom_a_up.png',
                            description: d(`DummydescriptionPainterSkill5Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Colour of Resistance',
                            icon: '../assets/icons/pa_paintcovering_custom_b_up.png',
                            description: d(`DummydescriptionPainterSkill5Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Colour of Transcendence',
                            icon: '../assets/icons/pa_paintcovering_custom_a.png',
                            description: d(`DummydescriptionPainterSkill5Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Colour of Resistance',
                            icon: '../assets/icons/pa_paintcovering_custom_b.png',
                            description: d(`DummydescriptionPainterSkill5Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: {
                            name: 'Colour of Agility',
                            icon: '../assets/icons/pa_paintcovering_custom_c.png',
                            description: d(`DummydescriptionPainterSkill5Type3normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        }
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            },
            {
                key: 'painterSkill6',
                defaultSkill: {
                    name: 'Colour Boost',
                    icon: '../assets/icons/pa_paintshower_g1.png',
                    description: d(`DummydefaultskillforPainterSkill6.`),
                    usageCost: '2000 MP',
                    cooldown: '1m',
                    target: 'Selected Target',
                    usageDistance: '1m',
                    area: 'Single Target',
                    areaIcon: 'targetSingle'
                },
                rows: {
                    improved: {
                        type1: {
                            name: '(Improved) Painter Skill 6 Type 1',
                            icon: '../assets/icons/pa_paintshower_custom_a_up.png',
                            description: d(`DummydescriptionPainterSkill6Type1improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: '(Improved) Painter Skill 6 Type 2',
                            icon: '../assets/icons/pa_paintshower_custom_b_up.png',
                            description: d(`DummydescriptionPainterSkill6Type2improved`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    },
                    normal: {
                        type1: {
                            name: 'Painter Skill 6 Type 1',
                            icon: '../assets/icons/pa_paintshower_custom_a.png',
                            description: d(`DummydescriptionPainterSkill6Type1normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type2: {
                            name: 'Painter Skill 6 Type 2',
                            icon: '../assets/icons/pa_paintshower_custom_b.png',
                            description: d(`DummydescriptionPainterSkill6Type2normal`),
                            usageCost: '2000 MP',
                            cooldown: '45s',
                            target: 'Selected Target',
                            usageDistance: '1m',
                            area: 'Single Target',
                            areaIcon: 'targetSingle'
                        },
                        type3: null
                    }
                },
                defaultUsed: {
                    row: 'improved',
                    type: 'type1'
                }
            }
        ]
    };

    global.DAEVANION_LOCKED_ICON = LOCKED_ICON;
    global.DAEVANION_SKILLS_BY_CLASS = data;
})(window);