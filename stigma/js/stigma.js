'use strict';

var GC_STIGMA_ICON_PLACEHOLDER = '../assets/icons/icon_ui_skills.png';
var GC_STIGMA_TIERS = ['gold', 'blue', 'green'];

function getStigmaEmptySlotIcon(tier) {
    if (tier === 'green') return '../assets/icons/green_slots.png';
    if (tier === 'blue') return '../assets/icons/blue_slots.png';
    if (tier === 'gold') return '../assets/icons/gold_slots.png';
    return GC_STIGMA_ICON_PLACEHOLDER;
}

var GC_STIGMA_REGISTRY = {
    gladiator: {
        displayName: 'Gladiator',
        slots: { gold: 1, blue: 3, green: 5 },
        baseUnlocked: { gold: 1, blue: 2, green: 3 },
        tiers: {
            green: [
                {
                    key: 'ankleSnare',
                    name: '(Improved) Ankle Snare',
                    icon: '../assets/icons/cbt_fi_a_anklegrab_g1.png',
                    cooldown: '51s',
                    description: 'Immobilises the target for 10s. There is only a slight chance this state can be removed. Reduces enemy evasion by 2200.'
                },
                {
                    key: 'cripplingCut',
                    name: '(Improved) Crippling Cut',
                    icon: '../assets/icons/cbt_fi_a_cripplingcut_g1.png',
                    cooldown: '12.6s',
                    description: 'Deals 2222 physical damage to a stumbled target.',
                    combat: { type: 'attack', damage: 2222, cooldownSec: 12.6, executeTimeSec: 1, priority: 30, requiresTargetState: 'stumble' }
                },
                {
                    key: 'dauntlessSpirit',
                    name: '(Improved) Dauntless Spirit',
                    icon: '../assets/icons/live_fi_a_ragespirit_g1.png',
                    cooldown: '42s',
                    description: 'Confers a protective shield for 10s. Grants up to 4208 protection.'
                },
                {
                    key: 'drainingBlow',
                    name: '(Improved) Draining Blow',
                    icon: '../assets/icons/live_fi_a_stigma_draincut_g1.png',
                    cooldown: '21s',
                    description: 'Deals 1656 physical damage to a stumbled target. Absorbs HP equal to 100% of the damage.',
                    combat: { type: 'attack', damage: 1656, cooldownSec: 21, executeTimeSec: 1, priority: 31, requiresTargetState: 'stumble' }
                },
                {
                    key: 'earthquakeWave',
                    name: '(Improved) Earthquake Wave',
                    icon: '../assets/icons/cbt_fi_a_heavyimpact_g1.png',
                    cooldown: '30s',
                    description: 'Deals 1653 physical damage. Reduces the target movement speed for 8s to 10s.',
                    combat: { type: 'attack', damage: 1653, cooldownSec: 30, executeTimeSec: 1, priority: 32 }
                },
                {
                    key: 'howl',
                    name: '(Improved) Howl',
                    icon: '../assets/icons/cbt_fi_a_howling_g1.png',
                    cooldown: '34s',
                    description: 'Reduces physical attack and magic attack by 550 for 15s.'
                },
                {
                    key: 'lockdown',
                    name: '(Improved) Lockdown',
                    icon: '../assets/icons/cbt_fi_a_lockdownimpact_g1.png',
                    cooldown: '8.4s',
                    description: 'Deals 1323 physical damage. Binds the target for 3s.',
                    combat: { type: 'attack', damage: 1323, cooldownSec: 8.4, executeTimeSec: 1, priority: 33 }
                },
                {
                    key: 'magicDefence',
                    name: '(Improved) Magic Defence',
                    icon: '../assets/icons/fi_a_magicalbarrier_g1.png',
                    cooldown: '51s',
                    description: 'Increases magic defence by 2200 for 12s. Increases sleep resist by 1000. Increases fear resist by 1000.'
                },
                {
                    key: 'siegebreaker',
                    name: '(Improved) Siegebreaker',
                    icon: '../assets/icons/cbt_wa_a_gatecrush_g1.png',
                    cooldown: '8.4s',
                    description: 'Deals 417 physical damage. Deals 33750 additional damage if the target is a castle gate.',
                    combat: { type: 'attack', damage: 417, cooldownSec: 8.4, executeTimeSec: 1, priority: 34 }
                }
            ],
            blue: [
                {
                    key: 'exhaustingWave',
                    name: '(Improved) Exhausting Wave',
                    icon: '../assets/icons/live_fi_a_whirldrain_g1.png',
                    cooldown: '48s',
                    description: 'Deals 1311 physical damage. Absorbs HP equal to 25% of the damage. Multicast 3 times. Max 7000 HP absorption.',
                    linkedTooltips: [
                        {
                            key: 'revivalWave',
                            name: '(Improved) Revival Wave',
                            icon: '../assets/icons/live_fi_a_whirltornado_g1.png',
                            cooldown: '48s',
                            description: 'Deals 2367 physical damage. Absorbs HP equal to 25% of the damage. Max 10000 HP absorption.',
                            combat: { type: 'attack', damage: 2367,heal: 2367 * 0.25, cooldownSec: 48, executeTimeSec: 1, priority: 23 }
                        }
                    ],
                    combat: { type: 'attack', damage: 1311, hits: 3, cooldownSec: 48, executeTimeSec: 1, priority: 23 }
                },
                {
                    key: 'severePrecisionCut',
                    name: '(Improved) Severe Precision Cut',
                    icon: '../assets/icons/live_fi_a_chargingshock_g1.png',
                    cooldown: '42s',
                    description: 'Has a high chance to hit and deals 3114 physical damage. The target has a high probability of stumbling.',
                    combat: {
                        type: 'attack',
                        damage: 3114,
                        cooldownSec: 42,
                        executeTimeSec: 1,
                        priority: 24,
                        appliesTargetState: { key: 'stumble', durationSec: 4 },
                        unlocks: ['energyExplosion']
                    }
                },
                {
                    key: 'sharpStrike',
                    name: '(Improved) Sharp Strike',
                    icon: '../assets/icons/live_fi_a_sharpnesshit_g1.png',
                    cooldown: '11.2s',
                    description: 'Deals 1533 physical damage. Multicast 2 times.',
                    combat: { type: 'attack', damage: 1533, hits: 2, cooldownSec: 11.2, executeTimeSec: 1, priority: 25 }
                },
                {
                    key: 'sureStrike',
                    name: '(Improved) Sure Strike',
                    icon: '../assets/icons/live_fi_a_burserklance_g1.png',
                    cooldown: '21s',
                    description: 'Has a high chance to hit and deals 3533 physical damage.',
                    combat: { type: 'attack', damage: 3533, cooldownSec: 21, executeTimeSec: 1, priority: 11, unlocks: ['energyExplosion'] }
                },
                {
                    key: 'spiteStrike',
                    name: '(Improved) Spite Strike',
                    icon: '../assets/icons/live_fi_a_technicalcounter_g1.png',
                    cooldown: '7s',
                    description: 'After a successful parry, deals 1905 physical damage. Causes the target to stumble.',
                    combat: { type: 'attack', damage: 1905, cooldownSec: 7, executeTimeSec: 1, priority: 26, appliesTargetState: { key: 'stumble', durationSec: 4 } }
                },
                {
                    key: 'tendonSlice',
                    name: '(Improved) Tendon Slice',
                    icon: '../assets/icons/live_fi_a_kneecrash_g1.png',
                    cooldown: '21s',
                    description: 'Deals 1668 physical damage. Immobilises the target for 8s. There is only a slight chance this state can be removed.',
                    combat: { type: 'attack', damage: 1668, cooldownSec: 21, executeTimeSec: 1, priority: 27 }
                }
            ],
            gold: [
                {
                    key: 'drainingSword',
                    name: '(Improved) Draining Sword',
                    icon: '../assets/icons/live_fi_a_drainsword_g1.png',
                    cooldown: '42s',
                    description: 'Deals 2522 physical damage. Absorbs HP equal to 20% of the damage. Multicast 2 times.',
                    combat: { type: 'attack', damage: 2522, hits: 2, cooldownSec: 42, executeTimeSec: 1, priority: 15 }
                },
                {
                    key: 'whirlingStrike',
                    name: '(Improved) Whirling Strike',
                    icon: '../assets/icons/live_fi_a_jumpattack_g1.png',
                    cooldown: '21s',
                    description: 'Deals 2704 physical damage.',
                    combat: { type: 'attack', damage: 2704, cooldownSec: 21, executeTimeSec: 1, priority: 16 }
                }
            ],
            vision: [
                {
                    key: 'bladeAllRoundStrike',
                    name: '(Improved) Blade All-round Strike',
                    icon: '../assets/icons/fi_a_bladeshock_g1.png',
                    castTime: '0.5s',
                    cooldown: '28s',
                    description: 'Has a high chance to hit and deals 4497 physical damage. Causes the target to stumble. A successful attack resets Springing Slice cooldown.',
                    combat: { type: 'attack', damage: 4497, cooldownSec: 28, executeTimeSec: 0.5, priority: 8, appliesTargetState: { key: 'stumble', durationSec: 4 } }
                },
                {
                    key: 'manglingCyclone',
                    name: '(Improved) Mangling Cyclone',
                    icon: '../assets/icons/fi_a_movewhirl_g1.png',
                    cooldown: '1m3s',
                    description: 'Deals 2146 physical damage. Multicast 3 times.',
                    combat: { type: 'attack', damage: 2146, hits: 3, cooldownSec: 63, executeTimeSec: 1, priority: 14 }
                },
                {
                    key: 'summonBattlefieldFlag',
                    name: '(Improved) Summon Battlefield Flag',
                    icon: '../assets/icons/fi_a_warflag_g1.png',
                    cooldown: '42s',
                    description: 'Reduces target healing boost by 1200. Reduces additional PvP defence by 600. The effect cannot be removed.'
                }
            ]
        },
        resolveVision: function(build) {
            if (!build) return 'summonBattlefieldFlag';

            var gold = build.gold[0];
            var blue = (build.blue || []).slice(0, 2).filter(Boolean);
            var has = function(key) { return blue.indexOf(key) !== -1; };

            if (gold === 'whirlingStrike') {
                if ((has('severePrecisionCut') && has('exhaustingWave')) ||
                    (has('severePrecisionCut') && has('exhaustingWave')) ||
                    (has('severePrecisionCut') && has('exhaustingWave')) ||
                    (has('severePrecisionCut') && has('tendonSlice')) ||
                    (has('tendonSlice') && has('exhaustingWave'))) {
                    return 'manglingCyclone';
                }
            }

            if (gold === 'drainingSword') {
                if ((has('sharpStrike') && has('spiteStrike')) ||
                    (has('sharpStrike') && has('sureStrike')) ||
                    (has('spiteStrike') && has('sureStrike'))) {
                    return 'bladeAllRoundStrike';
                }
            }

            return 'summonBattlefieldFlag';
        }
    },
    templar: {
        displayName: 'Templar',
        slots: { gold: 1, blue: 3, green: 5 },
        baseUnlocked: { gold: 1, blue: 2, green: 3 },
        tiers: {
            green: [
                {
                    key: 'barricadeOfSteel',
                    name: '(Improved) Barricade of Steel',
                    icon: '../assets/icons/live_kn_a_reflectshield_g1.png',
                    cooldown: '11s',
                    description: 'Increases block by 4400, physical defence by 550, stun knock back stumble spin aetherhold and immobilization resists by 1500, slowing resistance by 1000. You cannot jump when using the skill. Active skill.' 
                },
                {
                    key: 'holyShield',
                    name: '(Improved) Holy Shield',
                    icon: '../assets/icons/cbt_kn_a_holywrath_g1.png',
                    cooldown: '42s',
                    description: 'For 20s, reflects 678 damage back to an opponent within 5m that attacks you.'
                },
                {
                    key: 'divineFury',
                    name: '(Improved) Divine Fury',
                    icon: '../assets/icons/cbt_kn_a_divinepower_g1.png',
                    cooldown: '48s',
                    description: 'Increases Physical Attack by 550 for 30s.'
                },
                {
                    key: 'incurWrath',
                    name: '(Improved) Incur Wrath',
                    icon: '../assets/icons/live_kn_a_highprovoke_g1.png',
                    cooldown: '7s',
                    description: 'Taunts an enemy to increase their enmity towards you. Increases the additional PvE def by 1500. If the target is a player, their Enmity will probably be directed at you.'
                },
                {
                    key: 'eliminationStrike',
                    name: '(Improved) Elimination Strike',
                    icon: '../assets/icons/kn_a_executionalstrike_g1.png',
                    cooldown: '42s',
                    description: 'Deals 3022 physical damage.'
                },
                {
                    key: 'punishment',
                    name: '(Improved) Punishment',
                    icon: '../assets/icons/cbt_kn_a_divineslash_g1.png',
                    cooldown: '10s',
                    description: 'Deals 2749 physical damage. High probability of a crit strike. Multicast 2 times.'
                },
                {
                    key: 'aetherArmour',
                    name: '(Improved) Aether Armour',
                    icon: '../assets/icons/live_kn_a_stigma_resistarmor_g1.png',
                    cooldown: '43s',
                    description: 'Increases magic resist by 4400 for 20s. Increases magic def by 1000.'
                },
                {
                    key: 'inquisitorBlow',
                    name: '(Improved) Inquisitor\'s Blow',
                    icon: '../assets/icons/live_kn_a_thunderblade_g1.png',
                    cooldown: '21s',
                    description: 'Deals 1672 physical damage.'
                },
                {
                    key: 'siegebreaker',
                    name: '(Improved) Siegebreaker',
                    icon: '../assets/icons/cbt_wa_a_gatecrush_g1.png',
                    cooldown: '8.4s',
                    description: 'Deals 417 physical damage. Deals 33750 additional damage if the target is a castle gate.'
                }
            ],
            blue: [
                {
                    key: 'prayerOfResilience',
                    name: '(Improved) Prayer of Resilience',
                    icon: '../assets/icons/live_kn_a_recover_g1.png',
                    cooldown: '48s',
                    description: 'Restores 8775 HP'
                },
                {
                    key: 'prayerOfVictory',
                    name: '(Improved) Prayer of Victory',
                    icon: '../assets/icons/live_kn_a_sentinel_a_g1.png',
                    cooldown: '1m12s',
                    description: 'Increases HP by 3510 for 2m. Increases add pvp def and pve def by 300.'
                },
                {
                    key: 'divineJustice',
                    name: '(Improved) Divine Justice',
                    icon: '../assets/icons/live_kn_a_brainstorm_g1.png',
                    cooldown: '48s',
                    castTime: '0.5s',
                    description: 'Deals 1503 physical damage. Stuns the target for 2s.'
                },
                {
                    key: 'magicSmash',
                    name: '(Improved) Magic Smash',
                    icon: '../assets/icons/live_kn_a_powersink_g1.png',
                    cooldown: '21s',
                    description: 'Reduces Healing Boost by 800 for 8s. Deals 1584 physical damage. The effect cannot be removed.'
                },
                {
                    key: 'punishingWave',
                    name: '(Improved) Punishing Wave',
                    icon: '../assets/icons/live_kn_a_fortitudewave_g1.png',
                    cooldown: '1m3s',
                    description: 'Deals 1584 physical damage. Immobilises the target for 10s. There is only a slight chance this state can be removed.'
                },
                {
                    key: 'shieldOfFaith',
                    name: '(Improved) Shield of Faith',
                    icon: '../assets/icons/live_kn_a_invinsibleshield_g1.png',
                    cooldown: '1m30s',
                    description: 'You block 12 times for 20s.'
                }
            ],
            gold: [
                {
                    key: 'empyreanProvidence',
                    name: '(Improved) Empyrean Providence',
                    icon: '../assets/icons/live_kn_a_invinsibleprotect_g1.png',
                    cooldown: '2m42s',
                    description: 'Reduces your damage by 50% for 12s. Increases stun, knockback, stumble, spin and aether hold resists by 1500.'
                },
                {
                    key: 'shieldBlast',
                    name: '(Improved) Shield Blast',
                    icon: '../assets/icons/live_kn_a_destructshield_g1.png',
                    cooldown: '28s',
                    description: 'Has a high chance of hitting the target and then deals 2026 physical damage. Causes the target to stumble.'
                }
            ],
            vision: [
                {
                    key: 'bloodsuckingPunishment',
                    name: '(Improved) Bloodsucking Punishment',
                    icon: '../assets/icons/kn_a_godpunishment_g1.png',
                    cooldown: '12s',
                    description: 'Deals 2185 physical damage. Absorbs HP equal to 50% of the damage. Aborbs MP equal to 30% of the damage.'
                },
                {
                    key: 'barrierShield',
                    name: '(Improved) Barrier Shield',
                    icon: '../assets/icons/kn_a_standingshield_g1.png',
                    cooldown: '1m12s',
                    description: 'Reduces your damage by 80% for 15s. Drastically reduces your movement speed. Grants up to 50000 protection.'
                },
                {
                    key: 'reflectionOfChastisement',
                    name: '(Improved) Reflection of Chastisement',
                    icon: '../assets/icons/kn_a_skillreflector_g1.png',
                    cooldown: '1m24s',
                    description: 'When you are attacked, the effect of attack skills is reflected back on the enemy for 5s.'
                }
            ]
        },
        resolveVision: function(build) {
            if (!build) return 'barrierShield';

            var gold = build.gold[0];
            var blue = (build.blue || []).slice(0, 2).filter(Boolean);
            var has = function(key) { return blue.indexOf(key) !== -1; };

            if (gold === 'empyreanProvidence') {
                if ((has('prayerOfVictory') && has('prayerOfResilience')) ||
                    (has('prayerOfVictory') && has('shieldOfFaith')) ||
                    (has('prayerOfResilience') && has('shieldOfFaith'))) {
                    return 'bloodsuckingPunishment';
                }
            }

            if (gold === 'shieldBlast') {
                if ((has('divineJustice') && has('punishingWave')) ||
                    (has('divineJustice') && has('magicSmash')) ||
                    (has('punishingWave') && has('magicSmash'))) {
                    return 'reflectionOfChastisement';
                }
            }

            return 'barrierShield';
        }
    },
    assassin: {
        displayName: 'Assassin',
        slots: { gold: 1, blue: 3, green: 5 },
        baseUnlocked: { gold: 1, blue: 2, green: 3 },
        tiers: {
            green: [
                {
                    key: 'runeCarveSigilStrike',
                    name: '(Improved) Rune Carve - Sigil Strike',
                    icon: '../assets/icons/cbt_as_a_carvesignetchain_g1.png',
                    cooldown: '5s',
                    description: 'Deals 1878 physical damage. Inflicts a Rune Carve up to level 3 on the target.' 
                },
                {
                    key: 'deadlyAbandon',
                    name: '(Improved) Deadly Abandon',
                    icon: '../assets/icons/live_as_a_stabstance_g1.png',
                    cooldown: '10s',
                    description: 'Increases Physical Attack by 350. Reduces Evasion by 800. Active skill.'
                },
                {
                    key: 'oathOfAccuracy',
                    name: '(Improved) Oath of Accuracy',
                    icon: '../assets/icons/live_as_a_hitmanmind_g1.png',
                    cooldown: '50s',
                    description: 'Increases Accuracy by 4000 for 20s. Increases Magical Acc by 6000.'
                },
                {
                    key: 'shadowWalk',
                    name: '(Improved) Shadow Walk',
                    icon: '../assets/icons/live_as_a_stigma_shadowwalk_g1.png',
                    cooldown: '1m4s',
                    description: 'You are in advanced stealth mode for 5m. Reduces the movement speed by 20%. You may use up to 3 magical buffs on yourself and still remain in stealth mode. Not available in battle.'
                },
                {
                    key: 'shadowfall',
                    name: '(Improved) Shadowfall',
                    icon: '../assets/icons/live_as_a_shadowdrop_g1.png',
                    cooldown: '42s',
                    description: 'Deals 1714 physical damage to a stunned target. Causes the target to stumble.'
                },
                {
                    key: 'venomousStrike',
                    name: '(Improved) Venomous Strike',
                    icon: '../assets/icons/live_as_a_venomstab_g1.png',
                    cooldown: '42s',
                    description: 'Deals 1107 physical damage. Deals 3450 additional damage when attacking the target from behind. Poisons the target for 15s.'
                },
                {
                    key: 'eyeOfWrath',
                    name: '(Improved) Eye of Wrath',
                    icon: '../assets/icons/cbt_as_a_visiouseye_g1.png',
                    cooldown: '42s',
                    description: 'Boosts the effect of Physical by 60% 2 times for 15s. Reduces Crit Strike by 700.'
                },
                {
                    key: 'runeKnife',
                    name: '(Improved) Rune Knife',
                    icon: '../assets/icons/cbt_as_a_signetwave_g1.png',
                    cooldown: '7s',
                    description: 'Deals 1549 physical damage. Inflicts a Rune Carve up to level 3 on the target.'
                },
                {
                    key: 'ambushRaid',
                    name: '(Improved) Ambush Raid',
                    icon: '../assets/icons/as_a_backblow_g1.png',
                    cooldown: '21s',
                    description: 'Inflicts 2130 physical damage while you are in stealth mode. Stuns the target for 15s.'
                }
            ],
            blue: [
                {
                    key: 'lightningSlash',
                    name: '(Improved) Lightning Slash',
                    icon: '../assets/icons/live_as_a_flashslash_g1 (1).png',
                    cooldown: '16s',
                    description: 'Deals 1380 physical damage. Reduces evasion and physical defence by 1000 for 15s.'
                },
                {
                    key: 'applyLethalVenom',
                    name: '(Improved) Apply Lethal Venom',
                    icon: '../assets/icons/live_as_a_explosionpoison_g1.png',
                    cooldown: '48s',
                    description: 'Has a 30% chance to inflict 8894 additional damage for 30s.'
                },
                {
                    key: 'dashAndSlash',
                    name: '(Improved) Dash and Slash',
                    icon: '../assets/icons/live_as_a_assaultslash_g1.png',
                    cooldown: '28s',
                    description: 'Deals 1492 physical damage. Multicast 2 times.'
                },
                {
                    key: 'agonyRune',
                    name: '(Improved) Agony Rune',
                    icon: '../assets/icons/live_as_a_chainsignetburst_g1.png',
                    cooldown: '8s',
                    description: 'Deals 8361 magical fire damage.'
                },
                {
                    key: 'fleeingPosture',
                    name: '(Improved) Fleeing Posture',
                    icon: '../assets/icons/as_a_runnersstance_g1.png',
                    cooldown: '56s',
                    description: 'Removes movement-restricting states. Increases resistance to shock states by 1200 for 12s.'
                },
                {
                    key: 'sensoryBoost',
                    name: '(Improved) Sensory Boost',
                    icon: '../assets/icons/live_as_a_senseboost_g1.png',
                    cooldown: '43s',
                    description: 'Increases Evasion and Magic Resist by 3600, Physical defence and stumble resist by 1200 for 15s.'
                }
            ],
            gold: [
                {
                    key: 'quickeningDoom',
                    name: '(Improved) Quickening Doom',
                    icon: '../assets/icons/live_as_a_venomslash_g1.png',
                    cooldown: '42s',
                    description: 'Deals 1628 physical damage. Deals 3054 additional damage and stuns the target if it is poisoned.'
                },
                {
                    key: 'daggerOath',
                    name: '(Improved) Dagger Oath',
                    icon: '../assets/icons/as_a_clearfocus_g1.png',
                    cooldown: '48s',
                    description: 'Has a 60% chance of dealing 7135 additional damage for 30s when attacking from behind.'
                }
            ],
            vision: [
                {
                    key: 'lightningAmbush',
                    name: '(Improved) Lightning Ambush',
                    icon: '../assets/icons/as_a_returnattack_g1.png',
                    cooldown: '48s',
                    description: 'You get behind the target and deal 1785 physical damage to it. Silences teh target for 3 seconds.'
                },
                {
                    key: 'flashGrenade',
                    name: '(Improved) Flash Grenade',
                    icon: '../assets/icons/as_a_widenewblindingburst_g1.png',
                    cooldown: '42s',
                    description: 'Blinds the target for 5s. Reduces Magical Acc by 3000. If the target is a player, their targeting is cancelled for a moment.'
                },
                {
                    key: 'repeatedRuneCarve',
                    name: '(Improved) Repeated Rune Carve',
                    icon: '../assets/icons/as_a_resignetassault_g1.png',
                    cooldown: '48s',
                    description: 'When you are attacked, the effect of attack skills is reflected back on the enemy for 5s.'
                }
            ]
        },
        resolveVision: function(build) {
            if (!build) return 'repeatedRuneCarve';

            var gold = build.gold[0];
            var blue = (build.blue || []).slice(0, 2).filter(Boolean);
            var has = function(key) { return blue.indexOf(key) !== -1; };

            if (gold === 'quickeningDoom') {
                if ((has('applyLethalVenom') && has('dashAndSlash')) ||
                    (has('applyLethalVenom') && has('agonyRune')) ||
                    (has('dashAndSlash') && has('agonyRune'))) {
                    return 'lightningAmbush';
                }
            }

            if (gold === 'daggerOath') {
                if ((has('sensoryBoost') && has('fleeingPosture')) ||
                    (has('sensoryBoost') && has('lightningSlash')) ||
                    (has('fleeingPosture') && has('lightningSlash'))) {
                    return 'flashGrenade';
                }
            }

            return 'repeatedRuneCarve';
        }
    },
    ranger: {
        displayName: 'Ranger',
        slots: { gold: 1, blue: 3, green: 5 },
        baseUnlocked: { gold: 1, blue: 2, green: 3 },
        tiers: {
            green: [
                { key: 'focusedShots', name: '(Improved) Focused Shots', icon: '../assets/icons/cbt_sc_a_trueshotmind_g1.png', cooldown: '1s', description: 'Increases the effect of Physical by 33% 5 times for 1m. Increases accuracy, magical acc by 2600, reduces physical defence by 6%.' },
                { key: 'trapOfSlowing', name: '(Improved) Trap of Slowing', icon: '../assets/icons/live_ra_a_light_throwingtrap_g1.png', cooldown: '37s', description: 'The trap is active for 1m. Immobilises the target and reduces it\'s evasion.' },
                { key: 'sealArrow', name: '(Improved) Seal Arrow', icon: '../assets/icons/ra_a_sealingarrow_g1.png', cooldown: '21s', description: 'Deals 906 physical damage. Increases the casting time by 100% for 6s~8s. Reduces the attack speed.' },
                { key: 'skyboundTrap', name: '(Improved) Skybound Trap', icon: '../assets/icons/live_ra_a_snakebitetrap_g1.png', cooldown: '43s', castTime: '2s', description: 'The trap is active for 1m. Aether\'s Hold binds the target.' },
                { key: 'blazingTrap', name: '(Improved) Blazing Trap', icon: '../assets/icons/live_ra_a_light_blazingtrap_g1.png', cooldown: '12s', description: 'The trap is active for 1m. Deals magic damage to the target.' },
                { key: 'naturesResolve', name: '(Improved) Nature\'s Resolve', icon: '../assets/icons/cbt_ra_a_resistmind_g1.png', cooldown: '48s', description: 'Removes one altered physical state. You also resist 2 magic attacks for 12s.' },
                { key: 'bowOfBlessing', name: '(Improved) Bow of Blessing', icon: '../assets/icons/live_ra_a_enchantbow_g1.png', cooldown: '43s', description: 'Increases Physical Attack by 480s for 40s. Increases Crit Strike by 1200.' },
                { key: 'trapOfClairvoyance', name: '(Improved) Trap of Clairvoyance', icon: '../assets/icons/cbt_ra_a_light_fairyflare_g1.png', cooldown: '25s', description: 'The trap is active for 1m. Removes the target\'s stealth mode.' },
                { key: 'arrowDeluge', name: '(Improved) Arrow Deluge', icon: '../assets/icons/cbt_ra_a_spoutarrow_g1.png', cooldown: '12s', description: 'Deals 1370 physical damage. Multicast 3 times.' }
            ],
            blue: [
                { key: 'lethalArrow', name: '(Improved) Lethal Arrow', icon: '../assets/icons/live_ra_a_massexplosionarrow_g1.png', cooldown: '16s', description: 'Has a high chance of hitting the target and then deals 1903 physical damage.' },
                { key: 'ragingWindArrow', name: '(Improved) Raging Wind Arrow', icon: '../assets/icons/live_ra_a_shadowarrow_g1.png', cooldown: '14s', description: 'Deals 1545 physical damage. Decreases the cooldown for Retreating Slkash by 70%.' },
                { key: 'huntersMight', name: '(Improved) Hunter\'s Might', icon: '../assets/icons/live_ra_a_huntermind_g1.png', cooldown: '37s', description: 'Physical attack skills deal crit strikes 3 times for 20s.' },
                { key: 'galeArrow', name: '(Improved) Gale Arrow', icon: '../assets/icons/live_ra_a_movingshot_g1.png', cooldown: '7s', description: 'Deals 1229 physical damage. Multicast 2 times.' },
                { key: 'explosiveArrow', name: '(Improved) Explosive Arrow', icon: '../assets/icons/live_ra_a_explosionarrow_g1.png', cooldown: '12s', description: 'Deals 2350 physical damage.' },
                { key: 'sharpenArrows', name: '(Improved) Sharpen Arrows', icon: '../assets/icons/live_ra_a_trackermind_g1.png', cooldown: '1s', description: 'Increases Physical Attack of Bow by 500. Increases Crit Strike by 650. Increases Add. PvE Atk. by 650. Active skill.' }
            ],
            gold: [
                { key: 'agonisingArrow', name: '(Improved) Agonising Arrow', icon: '../assets/icons/live_ra_a_painarrow_g1.png', cooldown: '16s', description: 'Deals 2004 physical damage. Reduces the target\'s healing by 50% for 6s. The effect cannot be removed' },
                { key: 'lightningArrow', name: '(Improved) Lightning Arrow', icon: '../assets/icons/live_ra_a_lightningshot_g1.png', cooldown: '21s', description: 'Deals 1408 physical damage. Stuns the target for 1s.' }
            ],
            vision: [
                { key: 'shadowbound', name: '(Improved) Shadowbound', icon: '../assets/icons/ra_a_fasthide_g1.png', cooldown: '1m3s', description: 'Even if you\'re being attacked for 6s, your improved stealth mode will be maintained. Available during battle.' },
                { key: 'spearOfPenetration', name: '(Improved) Spear of Penetration', icon: '../assets/icons/ra_a_heavysnipe_g1.png', cooldown: '1m3s', castTime: '0.5s', description: 'Has a high chance of hitting the target and then deals 2644 physical damage. May stun the target for 3s.' },
                { key: 'collisionTrap', name: '(Improved) Collision Trap', icon: '../assets/icons/ra_a_shockwavetrap_g1.png', cooldown: '48s', description: 'Sets a trap that knocks opponents back.' }
            ]
        },
        resolveVision: function(build) {
            if (!build) return 'collisionTrap';

            var gold = build.gold[0];
            var blue = (build.blue || []).slice(0, 2).filter(Boolean);
            var has = function(key) { return blue.indexOf(key) !== -1; };

            if (gold === 'agonisingArrow') {
                if ((has('huntersMight') && has('lethalArrow')) ||
                    (has('huntersMight') && has('explosiveArrow')) ||
                    (has('lethalArrow') && has('explosiveArrow'))) {
                    return 'spearOfPenetration';
                }
            }

            if (gold === 'lightningArrow') {
                if ((has('ragingWindArrow') && has('galeArrow')) ||
                    (has('ragingWindArrow') && has('sharpenArrows')) ||
                    (has('galeArrow') && has('sharpenArrows'))) {
                    return 'shadowbound';
                }
            }

            return 'collisionTrap';
        }
    },
    sorcerer: {
        displayName: 'Sorcerer',
        slots: { gold: 1, blue: 3, green: 5 },
        baseUnlocked: { gold: 1, blue: 2, green: 3 },
        tiers: {
            green: [
                { key: 'arcaneThunderbolt', name: '(Improved) Arcane Thunderbolt', icon: '../assets/icons/live_wi_a_stormshock_g1.png', cooldown: '1m3s', castTime: '1s', description: 'Deals 2725 magical wind damage. Stunes the target for 3s.' },
                { key: 'absoluteZero', name: '(Improved) Absolute Zero', icon: '../assets/icons/live_wi_a_hibernation_g1.png', cooldown: '54s', description: 'You are stunned and cannot be attacked for 6s.' },
                { key: 'iceSheet', name: '(Improved) Ice Sheet', icon: '../assets/icons/cbt_wi_a_light_frostpillar_g1.png', cooldown: '1m4s', description: 'Deals magical water damage to the target. Reduces the target\'s movement speed.' },
                { key: 'exchangeVitality', name: '(Improved) Exchange Vitality', icon: '../assets/icons/live_wi_a_hpmpexchange_g1.png', cooldown: '1m48s', description: 'Swaps around your current HP and MP.' },
                { key: 'curseOfWeakness', name: '(Improved) Curse of Weakness', icon: '../assets/icons/cbt_wi_a_countermagic_g1.png', cooldown: '1m4s', description: 'Whenever the target uses a magic attack, it sustains magic damage equal to 15% of its maximum HP for 30s. The maximum magic damage is 4000.' },
                { key: 'boonOfQuickness', name: '(Improved) Boon of Quickness', icon: '../assets/icons/cbt_wi_a_dark_icyveins_g1.png', cooldown: '1m15s', description: 'Increases the target\'s casting time for all magical skills by 50% for 15s.' },
                { key: 'iceHarpoon', name: '(Improved) Ice Harpoon', icon: '../assets/icons/live_wi_a_stigma_icelance_g1.png', cooldown: '6s', castTime: '2.5s', description: 'Deals 4419 magical water damage.' },
                { key: 'elementalWard', name: '(Improved) Elemental Ward', icon: '../assets/icons/live_wi_a_elementalseal_g1.png', cooldown: '48s', description: 'Increases Magic Defence and Magic Resist by 1800 for 15s.' },
                { key: 'cycloneStrike', name: '(Improved) Cyclone Strike', icon: '../assets/icons/live_wi_a_cyclonestrike_g1.png', cooldown: '1m3s', castTime: '4s', description: 'Deals 8046 magical wind damage.' }
            ],
            blue: [
                { key: 'sleepingStorm', name: '(Improved) Sleeping Storm', icon: '../assets/icons/live_wi_a_sleepingstorm_g1.png', cooldown: '1m4s', castTime: '1s', description: 'Puts the target to sleep for 16s. The duration is reduced by 50% when applied to a player.' },
                { key: 'summonStone', name: '(Improved) Summon Stone', icon: '../assets/icons/live_wi_a_rockfall_g1.png', cooldown: '12s', description: 'Deal 2092 magical earth damage.' },
                { key: 'summonWhirlwind', name: '(Improved) Summon Whirlwind', icon: '../assets/icons/live_wi_a_summontornado_g1.png', cooldown: '1m8s', description: 'Summons a whirlwind for 3s. Deals magical wind damage to the target and stuns it.' },
                { key: 'flameSpray', name: '(Improved) Flame Spray', icon: '../assets/icons/live_wi_a_flamestrike_g1.png', cooldown: '21s', castTime: '3.5s', description: 'Deals 6277 magical fire damage.' },
                { key: 'illusionStorm', name: '(Improved) Illusion Storm', icon: '../assets/icons/live_wi_a_illusionstorm_g1.png', cooldown: '1m24s', description: 'Deals 1702 magical fire damage. Stuns the target for 3s.' },
                { key: 'windCutDown', name: '(Improved) Wind Cut Down', icon: '../assets/icons/live_wi_a_windcutter_g1.png', cooldown: '16s', castTime: '1s', description: 'Deals 2658 magical wind damage. Reduces Magic Defence by 350 for 5s~7s.' }
            ],
            gold: [
                { key: 'winterArmour', name: '(Improved) Winter Armour', icon: '../assets/icons/live_wi_a_icyshield_g1.png', cooldown: '1m12s', description: 'Reflects 3569 damage at the enemies attacking you up to 5 away for 15s. Reduces the target\'s movement and attack speed for 2s' },
                { key: 'glacialShard', name: '(Improved) Glacial Shard', icon: '../assets/icons/live_wi_a_zeropoint_g1.png', cooldown: '42s', castTime: '4s', description: 'Deals 8437 magical water damage.' }
            ],
            vision: [
                { key: 'windOfTorpor', name: '(Improved) Wind of Torpor', icon: '../assets/icons/wi_a_windsleep_g1.png', cooldown: '2m', description: 'Puts the target to sleep for 16s. The next magic attack lands a crit strike. The duration is reduced by 50% when applied to a player.' },
                { key: 'boonOfFlame', name: '(Improved) Boon of Flame', icon: '../assets/icons/wi_a_fireshield_g1.png', cooldown: '1s', description: 'Increases magic dmg by 18%. Also reduces MP consumption by 50%. Increases Crit Spell by 1000.' },
                { key: 'refugeBarrier', name: '(Improved) Refuge Barrier', icon: '../assets/icons/wi_a_stonebarrier_g1.png', cooldown: '1m24s', description: 'Increases your casting time by 100% for 6s but grants you a protective shield. Grants up to 150000 protection. Enemies within 10m who attack the protective shield are petrified.' }
            ]
        },
        resolveVision: function(build) {
            if (!build) return 'refugeBarrier';

            var gold = build.gold[0];
            var blue = (build.blue || []).slice(0, 2).filter(Boolean);
            var has = function(key) { return blue.indexOf(key) !== -1; };

            if (gold === 'winterArmour') {
                if ((has('sleepingStorm') && has('windCutDown')) ||
                    (has('sleepingStorm') && has('illusionStorm')) ||
                    (has('windCutDown') && has('illusionStorm'))) {
                    return 'windOfTorpor';
                }
            }

            if (gold === 'glacialShard') {
                if ((has('summonStone') && has('flameSpray')) ||
                    (has('summonStone') && has('summonWhirlwind')) ||
                    (has('flameSpray') && has('summonWhirlwind'))) {
                    return 'boonOfFlame';
                }
            }

            return 'refugeBarrier';
        }
    },
    spiritmaster: {
        displayName: 'Spiritmaster',
        slots: { gold: 1, blue: 3, green: 5 },
        baseUnlocked: { gold: 1, blue: 2, green: 3 },
        tiers: {
            green: [
                { key: 'enmitySwap', name: '(Improved) Enmity Swap', icon: '../assets/icons/cbt_el_a_sympatheticswitch_a_g1.png', cooldown: '42s', castTime: '0s', description: 'Restores the target\'s HP by 10800. The summoned spirit vanishes when the skill ends.' },
                { key: 'earthProtection', name: '(Improved) Earth Protection', icon: '../assets/icons/el_a_earthguardiance_g1.png', cooldown: '56s', castTime: '1.5s', description: 'Removes states which restrict your movement. Increases Immobilization Resist by 1000 for 12s. Increases Slowing Resistance by 1000.' },
                { key: 'curseOfMagicPower', name: '(Improved) Curse of Magic Power', icon: '../assets/icons/el_a_magicalbreakdown_g1.png', cooldown: '37s', castTime: '0.8s', description: 'Reduces the target\'s Magic Defence by 600 for 15s.' },
                { key: 'wildernessRage', name: '(Improved) Wilderness Rage', icon: '../assets/icons/el_a_cursedbreath_1_g1.png', cooldown: '21s', castTime: '1.1s | Level 1 - 1.6s | Level 2 - 1.6s | Level 3 - 5s', description: 'Deals 3612/4740/6459 magical earth damage.' },
                { key: 'commandBurnToAshes', name: '(Improved) Command: Burn-to-Ashes', icon: '../assets/icons/live_el_a_stigma_order_ethereruption_g1.png', cooldown: '37s', castTime: '2s', description: 'Water Spirit: Magical Water Damage. Wind Spirit: Magical Wind Damage. Earth Spirit: Magical Earth Damage. Fire Spirit: Magical Fire Damage. Magma Spirit: Magical Earth Damage. Tempest Spirit: Magical Water Damage.' },
                { key: 'cycloneOfWrath', name: '(Improved) Cyclone of Wrath', icon: '../assets/icons/live_el_a_stigma_stormblade_g1.png', cooldown: '8s', castTime: '2s', description: 'Deals 1086 magical wind damage. Deals 886 additional damage every 2s for 8s.' },
                { key: 'witheringGloom', name: '(Improved) Withering Gloom', icon: '../assets/icons/live_el_a_enervationcurse_g1.png', cooldown: '1m3s', castTime: '2s', description: 'Reduces the target\'s maximum HP and MP by 5000 for 30s. Reduces the target\'s recovery by 15%. MP regeneration is not possible. The effect cannot be removed.' },
                { key: 'commandWallOfProtection', name: '(Improved) Command: Wall of Protection', icon: '../assets/icons/cbt_el_a_order_elementalfield_g1.png', cooldown: '43s', castTime: '0.8s', description: 'Commands the spirit to use its magical buff. Water Spirit: Increases Magical Accuracy and Resist Magic. Wind Spirit: Increases Accuracy and Evasion. Earth Spirit: HP regeneration, removes physical and mental altered states. Fire Spirit: Increases Physical Attack and reflects damage. Magma Spirit: Increases Physical Attack and removes physical and mental altered states. Tempest Spirit: Increases Physical Attack and removes physical and mental altered states.' },
                { key: 'cloakingWord', name: '(Improved) Cloaking Word', icon: '../assets/icons/live_el_a_escape_g1.png', cooldown: '21s', castTime: '0.5s', description: 'Puts the target in normal stealth mode for 30s. Reduces movement speed. Not available in battle.' }
            ],
            blue: [
                { key: 'magicImplosion', name: '(Improved) Magic Implosion', icon: '../assets/icons/live_el_a_manareverse_g1.png', cooldown: '21s', castTime: '0s', description: 'Removes big magic buffs and debuffs from the target and deals 1885 magic damage. Deals 1464 additional damage to the target every 3s for 30s. It can be removed with skills that dispel magical buffs or debuffs.' },
                { key: 'infernalPain', name: '(Improved) Infernal Pain', icon: '../assets/icons/live_el_a_hellpain_g1.png', cooldown: '21s', castTime: '1.5s', description: 'DescrDeals 1357 magical earth damage. Deals 1244 additional damage every 3s for 12s. The effect cannot be removed.' },
                { key: 'commandRuinousOffensive', name: '(Improved) Command: Ruinous Offensive', icon: '../assets/icons/live_el_a_stigma_order_destructimpact_g1.png', cooldown: '18s', castTime: '0.8s', description: 'Commands the spirit to use its attack skill. Water Spirit: Magical Water Damage, reduce Magic Defence. Wind Spirit: Magical Wind Damage, reduce Magic Defence. Earth Spirit: Magical Earth Damage, reduce Physical Defence. Fire Spirit: Magical Fire Damage, reduce Physical Defence. Magma Spirit: Magical Fire Damage, Physical Defence, reduce Magic Defence. Tempest Spirit: Magical Wind Damage, Physical Defence, reduce Magic Defence.' },
                { key: 'cycloneServant', name: '(Improved) Summon Cyclone Servant', icon: '../assets/icons/live_el_a_light_slave_stormservent_g1.png', cooldown: '21s', castTime: '0s', description: 'Deals 1210 magical wind damage every 3 seconds for 10 seconds. The effect cannot be removed.' },
                { key: 'healingSpirit', name: '(Improved) Healing Spirit', icon: '../assets/icons/live_el_a_elementalcharge_g1.png', cooldown: '32s', castTime: '0s', description: 'Restores 100% of the spirit\'s HP. Removes all magical debuffs.' },
                { key: 'shackleOfVulnerability', name: '(Improved) Shackle of Vulnerability', icon: '../assets/icons/live_el_a_enfeeblement_g1.png', cooldown: '18s', castTime: '1s', description: 'Reduces the attack speed of the target for 20s. Increases the target\'s casting time for all magical skills. Reduces Magic Defence by 660. It can be removed with skills that dispel magical buffs or debuffs.' }
            ],
            gold: [
                { key: 'infernalBlight', name: '(Improved) Infernal Blight', icon: '../assets/icons/live_el_a_hellcurse_g1.png', cooldown: '37s', castTime: '1s', description: 'Reduces the target\'s Physical Defence by 900 for 30s. Reduces Magic Defence by 900. Reduces Magic Resist by 800.' },
                { key: 'strengtheningSpirit', name: '(Improved) Strengthening Spirit: Spirit Armour', icon: '../assets/icons/live_el_a_enchantarmor_g1.png', cooldown: '37s', castTime: '1s', description: 'Increases the spirit\'s Physical Attack by 1500 for 5m. Increases Magic Attack by 1500. Increases Physical Defence by 1200. Increases Magic Defence by 1200. Increases Speed by 30%. Increases Magical Acc by 5500. Increases Accuracy by 5500.' }
            ],
            vision: [
                { key: 'spiritBundling', name: '(Improved) Spirit Bundling', icon: '../assets/icons/el_a_soulking_g1.png', cooldown: '1m12s', description: 'Increases Magical Acc by 1,000 for 3m. Increases Magic Attack by 1,000. Increases Crit Spell by 500. Increases HP by 12,000. Increases Speed by 10%. Increases magic damage by 12%. If you summon a spirit, the skill effect disappears.' },
                { key: 'commandFaithfulSubstitution', name: '(Improved) Command: Faithful Substitution', icon: '../assets/icons/el_a_order_sacrifice_g1.png', cooldown: '48s', description: 'Commands the spirit to protect the target. The spirit absorbs 70% of the damage instead of the caster.' },
                { key: 'largeScaleAbsorption', name: '(Improved) Large-Scale Absorption', icon: '../assets/icons/el_a_energysink_g1.png', cooldown: '48s', description: 'Deals 675 damage to the target every 2 for 15s. Absorbs HP from the enemy equal to the amount of damage dealt. Max. 10,000 HP Absorption.' }
            ]
        },
        resolveVision: function(build) {
            if (!build) return 'largeScaleAbsorption';

            var gold = build.gold[0];
            var blue = (build.blue || []).slice(0, 2).filter(Boolean);
            var has = function(key) { return blue.indexOf(key) !== -1; };

            if (gold === 'infernalBlight') {
                if ((has('infernalPain') && has('shackleOfVulnerability')) ||
                    (has('infernalPain') && has('magicImplosion')) ||
                    (has('shackleOfVulnerability') && has('magicImplosion'))) {
                    return 'spiritBundling';
                }
            }

            if (gold === 'strengtheningSpirit') {
                if ((has('healingSpirit') && has('cycloneServant')) ||
                    (has('healingSpirit') && has('commandRuinousOffensive')) ||
                    (has('cycloneServant') && has('commandRuinousOffensive'))) {
                    return 'commandFaithfulSubstitution';
                }
            }

            return 'largeScaleAbsorption';
        }
    },
    cleric: {
        displayName: 'Cleric',
        slots: { gold: 1, blue: 3, green: 5 },
        baseUnlocked: { gold: 1, blue: 2, green: 3 },
        tiers: {
            green: [
                { key: 'sprintSkill', name: '(Improved) Sprint Skill', icon: '../assets/icons/pr_a_sprint_g1.png', cooldown: '56s', description: 'Increases movement speed by 30% for 15 seconds.' },
                { key: 'reverseCondition', name: '(Improved) Reverse Condition', icon: '../assets/icons/cbt_pr_a_reversecondition_g1.png', cooldown: '1m4s', description: 'Swaps around HP and MP.' },
                { key: 'savingGrace', name: '(Improved) Saving Grace', icon: '../assets/icons/live_pr_a_restorelife_g1.png', cooldown: '8s', description: 'Activated when Block and Resist Magic are performed successfully. For 15s, you absorb 500 HP each time you are hit. Increases Physical Defence and Magic Defence by 950. Increases healing by 10%.' },
                { key: 'sympatheticHeal', name: '(Improved) Sympathetic Heal', icon: '../assets/icons/cbt_pr_a_bindingheal_g1.png', cooldown: '7s', castTime: '2s', description: 'Restores 2924 HP to allies. Regenerates part of your HP.' },
                { key: 'festeringWound', name: '(Improved) Festering Wound', icon: '../assets/icons/cbt_pr_a_coursewound_g1.png', cooldown: '32s', description: 'Reduces the target\'s recovery by 50% for 1m.' },
                { key: 'blindingLight', name: '(Improved) Blinding Light', icon: '../assets/icons/cbt_pr_a_blindinglight_g1.png', cooldown: '1m15s', description: 'Blinds the target for 15s.' },
                { key: 'lightningBoltOfRetaliation', name: '(Improved) Lightning Bolt of Retaliation', icon: '../assets/icons/pr_a_thunderofpunishment_g1.png', cooldown: '14s', description: 'Deals 2965 magical wind damage.' },
                { key: 'enfeeblingBurst', name: '(Improved) Enfeebling Burst', icon: '../assets/icons/live_pr_a_suffermemory_g1.png', cooldown: '40s', castTime: '1s', description: 'Reduces the target\'s Physical Attack by 1000 for 20s. Reduces Magic Attack by 1000.' },
                { key: 'nobleGrace', name: '(Improved) Noble Grace', icon: '../assets/icons/live_pr_a_healinggrace_g1.png', cooldown: '1m12s', description: 'Increases HP by 10000 for 15s. Increases Healing Boost by 500.' }
            ],
            blue: [
                { key: 'sacrificialPower', name: '(Improved) Sacrificial Power', icon: '../assets/icons/live_pr_a_offensivemode_g1.png', cooldown: '30s', description: 'Increases Magical Acc by 1800. Increases Add. PvE Atk. by 800. Increases Magic Attack by 1600. Increases Crit Spell by 1250. Reduces Healing Boost by 1500. Active Skill.' },
                { key: 'summonHealingServant', name: '(Improved) Summon Healing Servant', icon: '../assets/icons/live_pr_a_light_healingservent_g1.png', cooldown: '42s', castTime: '1s', description: 'Summons a spirit that restores 1485 HP. It vanishes after a while.' },
                { key: 'rippleOfPurification', name: '(Improved) Ripple of Purification', icon: '../assets/icons/live_pr_a_tranquility_g1.png', cooldown: '48s', castTime: '1s', description: 'Removes altered states from a group member. Restores 4843 HP. Also restores an additional 2897 HP every 2s for 15s.' },
                { key: 'splendourOfRebirth', name: '(Improved) Splendour of Rebirth', icon: '../assets/icons/live_pr_a_regeneraitionshine_g1.png', cooldown: '42s', description: 'Restores 1702 HP. Restores an additional 1702 HP for you every 2s for 15s.' },
                { key: 'chainOfSuffering', name: '(Improved) Chain of Suffering', icon: '../assets/icons/live_pr_a_painlinks_g1.png', cooldown: '48s', castTime: '2s', description: 'Deals 1736 magical earth damage. Deals 1654 additional damage every 2s for 30s. If the target is another player and you die while it is in effect, you are resurrected at the Kisk or Obelisk.' },
                { key: 'summonNobleEnergy', name: '(Improved) Summon Noble Energy', icon: '../assets/icons/live_pr_a_light_eternalservent_g1.png', cooldown: '21s', description: 'Summons a spirit that deals 5435 magical fire damage. The spirit vanishes after a while and consumes part of its own HP with each attack.' }
            ],
            gold: [
                { key: 'benevolence', name: '(Improved) Benevolence', icon: '../assets/icons/live_pr_a_healershand_g1.png', cooldown: '0s', description: 'Increases Healing Boost by 650. Reduces Magic Attack by 1500. Active Skill.' },
                { key: 'callLightning', name: '(Improved) Call Lightning', icon: '../assets/icons/live_pr_a_calllightning_g1.png', cooldown: '42s', castTime: '2.5s', description: 'Deals 5405 magical wind damage.' }
            ],
            vision: [
                { key: 'sealOfJudgement', name: '(Improved) Seal of Judgement', icon: '../assets/icons/pr_a_punishinglight_g1.png', cooldown: '21s', description: 'Reduces Magic Resist by 5000 for 12s. Reduces Magic Defence by 500. Reduces Physical Defence by 500. The effect cannot be removed.' },
                { key: 'lifeSavingSplendour', name: '(Improved) Life-Saving Splendour', icon: '../assets/icons/pr_a_keeplife_g1.png', cooldown: '1m12s', description: 'Restores 20000 HP if the HP of group members falls below 50%.' },
                { key: 'summonTauntingEnergy', name: '(Improved) Summon Taunting Energy', icon: '../assets/icons/pr_a_provokeservent_g1.png', cooldown: '1m3s', description: 'Summons a spirit that provokes enemies. The effect has a 50% probability of affecting the target.' }
            ]
        },
        resolveVision: function(build) {
            if (!build) return 'summonTauntingEnergy';

            var gold = build.gold[0];
            var blue = (build.blue || []).slice(0, 2).filter(Boolean);
            var has = function(key) { return blue.indexOf(key) !== -1; };

            if (gold === 'callLightning') {
                if ((has('chainOfSuffering') && has('sacrificialPower')) ||
                    (has('chainOfSuffering') && has('summonNobleEnergy')) ||
                    (has('sacrificialPower') && has('summonNobleEnergy'))) {
                    return 'sealOfJudgement';
                }
            }

            if (gold === 'benevolence') {
                if ((has('summonHealingServant') && has('splendourOfRebirth')) ||
                    (has('summonHealingServant') && has('rippleOfPurification')) ||
                    (has('splendourOfRebirth') && has('rippleOfPurification'))) {
                    return 'lifeSavingSplendour';
                }
            }

            return 'summonTauntingEnergy';
        }
    },
    chanter: {
        displayName: 'Chanter',
        slots: { gold: 1, blue: 3, green: 5 },
        baseUnlocked: { gold: 1, blue: 2, green: 3 },
        tiers: {
            green: [
                { key: 'ragingEncouragement', name: '(Improved) Raging Encouragement', icon: '../assets/icons/live_ch_a_encouragerun_g1.png', cooldown: '56s', description: 'Increases the target\'s Speed by 30% for 12s.' },
                { key: 'wordOfInspiration', name: '(Improved) Word of Inspiration', icon: '../assets/icons/cbt_ch_a_improvedallattack_g1.png', cooldown: '30s', description: 'Increases Physical Attack by 750. Increases Accuracy and Crit Strike by 600. Increases Add. PvE Atk. by 500. Reduces Healing Boost by 1000. Active Skill.' },
                { key: 'wordOfLife', name: '(Improved) Word of Life', icon: '../assets/icons/cbt_ch_a_improvedlifestream_g1.png', cooldown: '42s', description: 'Restores your HP by 2334 every 2s for 10s.' },
                { key: 'rise', name: '(Improved) Rise', icon: '../assets/icons/live_ch_a_phoenixstep_g1.png', cooldown: '1m4s', description: 'Removes a shock state and increases Stun, Knock Back, Stumble, Spin, and Aether\'s Hold Resists by 2000 for 7s.' },
                { key: 'soulLock', name: '(Improved) Soul Lock', icon: '../assets/icons/live_ch_a_soaredrock_g1.png', cooldown: '21s', description: 'Deals 1153 physical damage. Binds the target for 3s.' },
                { key: 'splashSwing', name: '(Improved) Splash Swing', icon: '../assets/icons/live_ch_a_splashswing_g1.png', cooldown: '11s', description: 'After a successful parry, deals 2875 physical damage.' },
                { key: 'annihilation', name: '(Improved) Annihilation', icon: '../assets/icons/live_ch_a_triplethrust_g1.png', cooldown: '42s', description: 'Deals 916 physical damage. Multicast 3 times.',
                    linkedTooltips: [
                        {
                            key: 'blast', name: '(Improved) Blast', icon: '../assets/icons/live_ch_a_thruststrike_g1.png', cooldown: '42s', description: 'Deals 1101 physical damage. Stuns the target for 2s.'
                        }
                    ],
                },
                { key: 'deadlyBlow', name: '(Improved) Deadly Blow', icon: '../assets/icons/ch_a_harshthrust_1_g1.png', cooldown: '21s', castTime: '0.3s', description: 'Has a high chance of hitting the target and then deals 1485 physical damage. Causes the target to stumble.' },
                { key: 'healingConduit', name: '(Improved) Healing Conduit', icon: '../assets/icons/cbt_ch_a_healingtank_g1.png', cooldown: '48s', description: 'Restores 810 HP of allies provided the target is within 15m and sustains damage for 10s.' }
            ],
            blue: [
                { key: 'blessingOfStone', name: '(Improved) Blessing of Stone', icon: '../assets/icons/live_ch_a_blessprotect_g1.png', cooldown: '0s', description: 'Increases the target\'s HP by 25% for 30m. Increases Physical and Magic Defence by 350.' },
                { key: 'blessingOfWind', name: '(Improved) Blessing of Wind', icon: '../assets/icons/live_ch_a_imbuepower_g1.png', cooldown: '1m3s', description: 'Increases Physical Attack by 800 for 30s. Also deals 2244 additional damage for each attack.' },
                { key: 'wordOfProtection', name: '(Improved) Word of Protection', icon: '../assets/icons/cbt_ch_a_improvedalldefend_g1.png', cooldown: '30s', description: 'Increases Evasion, Parry, Block of group members by 350 for 1m. Increases Stun Resist by 280.' },
                { key: 'mountainCrash', name: '(Improved) Mountain Crash', icon: '../assets/icons/live_ch_a_mountaincrash_g1.png', cooldown: '21s', description: 'Deals 3015 physical damage. Reduces Physical Defence by 350 for 12s.' },
                { key: 'disorientatingBlow', name: '(Improved) Disorientating Blow', icon: '../assets/icons/live_ch_a_shockwave_g1.png', cooldown: '42s', description: 'Deals 954 physical damage. Causes the target to stumble.' },
                { key: 'healingBurst', name: '(Improved) Healing Burst', icon: '../assets/icons/live_ch_a_surperiorheal_g1.png', cooldown: '7s', castTime: '2s', description: 'Restores 6894 HP.' }
            ],
            gold: [
                { key: 'numbingBlow', name: '(Improved) Numbing Blow', icon: '../assets/icons/live_ch_a_slowcrash_g1.png', cooldown: '28s', description: 'Deals 2267 physical damage. Reduces the target\'s attack speed for 10s. Increases magic casting time by 50%.' },
                { key: 'elementalScreen', name: '(Improved) Elemental Screen', icon: '../assets/icons/live_ch_a_improvedbody_g1.png', cooldown: '1m15s', description: 'Increases Physical and Magic Defence of group members by 1,500 for 30s.' }
            ],
            vision: [
                { key: 'roaringWindBludgeon', name: '(Improved) Roaring Wind Bludgeon', icon: '../assets/icons/ch_a_tornado_g1.png', cooldown: '21s', description: 'Deals 3644 physical damage.' },
                { key: 'magicOfIncitement', name: '(Improved) Magic of Incitement', icon: '../assets/icons/ch_a_physicalenhancement_g1.png', cooldown: '42s', description: 'Increases Crit Strike of group members by 800 for 5m. Increases Accuracy by 800. Increases Physical Attack by 600.' },
                { key: 'blastSpell', name: '(Improved) Blast Spell', icon: '../assets/icons/ch_a_brand_g1.png', cooldown: '1m3s', description: 'Reduces Accuracy by 1,000 for 15s. Reduces Magical Acc by 1000. Reduces Physical Defence by 1200. Reduces Magic Defence by 1200.' }
            ]
        },
        resolveVision: function(build) {
            if (!build) return 'blastSpell';

            var gold = build.gold[0];
            var blue = (build.blue || []).slice(0, 2).filter(Boolean);
            var has = function(key) { return blue.indexOf(key) !== -1; };

            if (gold === 'numbingBlow') {
                if ((has('blessingOfWind') && has('mountainCrash')) ||
                    (has('blessingOfWind') && has('disorientatingBlow')) ||
                    (has('mountainCrash') && has('disorientatingBlow'))) {
                    return 'roaringWindBludgeon';
                }
            }

            if (gold === 'elementalScreen') {
                if ((has('healingBurst') && has('blessingOfStone')) ||
                    (has('healingBurst') && has('wordOfProtection')) ||
                    (has('blessingOfStone') && has('wordOfProtection'))) {
                    return 'magicOfIncitement';
                }
            }

            return 'blastSpell';
        }
    },
    aethertech: {
        displayName: 'Aethertech',
        slots: { gold: 1, blue: 3, green: 5 },
        baseUnlocked: { gold: 1, blue: 2, green: 3 },
        tiers: {
            green: [
                { key: 'idiumRay', name: '(Improved) Idium Ray', icon: '../assets/icons/ri_a_eathiumbeam_g1.png', cooldown: '21s', castTime: '1.1s | Level 1 1.1s | Level 2 1.7s | Level 3 5s', description: 'Deals 3148/4342/8911 magical wind damage. Deals 457/874/1620 additional damage if the target is a Balaur.' },
                { key: 'idiumBombardment', name: '(Improved) Idium Bombardment', icon: '../assets/icons/ri_a_eathiumblast_g1.png', cooldown: '21s', castTime: '1.1s | Level 1 1.1s | Level 2 1.7s | Level 3 5s', description: 'Deals 4595/9088/9518 magical wind damage.' },
                { key: 'waveOfDestruction', name: '(Improved) Wave of Destruction', icon: '../assets/icons/ri_a_forwardstrike_g1.png', cooldown: '10s', description: 'Deals 2,420 magical water damage. Deals additional damage if the target is a Balaur.' },
                { key: 'cleaveArmour', name: '(Improved) Cleave Armour', icon: '../assets/icons/ri_a_shielddestroyer_g1.png', cooldown: '21s', description: 'Deals 1,398 magical earth damage. Stuns the target for 3s. Removes the target\’s protective effect.' },
                { key: 'perceptionBoost', name: '(Improved) Perception Boost', icon: '../assets/icons/ri_a_tunesensor_g1.png', cooldown: '1m4s', description: 'Increases Magical Acc by 2,500 for 1m.' },
                { key: 'absorbingReflectorShield', name: '(Improved) Absorbing Reflector Shield', icon: '../assets/icons/ri_a_itheumreflector_g1.png', cooldown: '1m12s', description: 'Decreases the target\'s MP for all damage inflicted upon you by 2400 for 10s.' },
                { key: 'idiumWhip', name: '(Improved) Idium Whip', icon: '../assets/icons/ri_a_flamethrow_g1.png', cooldown: '21s', castTime: '1.1s | Level 1 1.1s | Level 2 1.7s | Level 3 5s',  description: 'Deals 1130/1130/2674 magical wind damage. May stun the target for 3s.' },
                { key: 'magicFocus', name: '(Improved) Magic Focus', icon: '../assets/icons/ri_a_eathiumcompress_g1.png', cooldown: '48s', description: 'Increases MP by 10881 for 1m. Increases Natural Mana Treatment by 211. Increases Natural Healing by 421.' },
                { key: 'magicRegeneration', name: '(Improved) Magic Regeneration', icon: '../assets/icons/ri_a_eathiumreactive_g1.png', cooldown: '42s', castTime: '1.1s | Level 1 1.1s | Level 2 1.7s | Level 3 5s', description: 'Restores 5062/10125/20250 MP.' }
            ],
            blue: [
                { key: 'electricBinding', name: '(Improved) Electric Binding', icon: '../assets/icons/ri_a_bindingslam_g1.png', cooldown: '42s', description: 'Deals 777 magical wind damage. Immobilises the target for 5s. There is only a slight chance this state can be removed.' },
                { key: 'magicVeil', name: '(Improved) Magic Veil', icon: '../assets/icons/ri_a_magneticfield_g1.png', cooldown: '43s', description: 'Increases Parry by 2,000 for 25s. Increases Add. PvP Def. by 500. Increases Stun, Bind and Resist Fear by 500.' },
                { key: 'powerIncrease', name: '(Improved) Power Increase', icon: '../assets/icons/ri_a_overcharge_g1.png', cooldown: '56s', description: 'Increases Atk. Speed by 10% for 12s. Increases Magic Attack by 900. Increases Add. PvP Atk. by 300.' },
                { key: 'stormStrike', name: '(Improved) Storm Strike', icon: '../assets/icons/ri_a_rapidattack_g1.png', cooldown: '12s', description: 'Deals 1760 magical earth damage. Multicast 3 times.' },
                { key: 'mobilityBoost', name: '(Improved) Mobility Boost', icon: '../assets/icons/ri_a_speedoverdrive_g1.png', cooldown: '36s', description: 'Increases movement and flight speed by 35% for a maximum of 10 seconds. Increases Knock Back Resist by 300. Reduces Immobilization Resist by 200. Active Skill.' },
                { key: 'lifelineSlash', name: '(Improved) Lifeline Slash', icon: '../assets/icons/ri_a_weaponsmash_g1.png', cooldown: '42s', description: 'Deals 1258 magical wind damage. Reduces Physical Attack by 500 for 18s. Reduces Magic Attack by 500.' }
            ],
            gold: [
                { key: 'leapOfDestruction', name: '(Improved) Leap of Destruction', icon: '../assets/icons/ri_a_powerslam_g1.png', cooldown: '21', description: 'Deals 3114 magical fire damage.' },
                { key: 'idShield', name: '(Improved) Id Shield', icon: '../assets/icons/ri_a_eathiumwall_g1.png', cooldown: '1m53s', description: 'Each time you receive all attack, generates a protective shield effect of 55% for up to 30 seconds. Grants up to 120000 protection. Consumes MP equal to 8% of the absorbed damage. While the shield is active, your resistance to shock states is increased by 300. Active Skill.' }
            ],
            vision: [
                { key: 'idiumExplosion', name: '(Improved) Idium Explosion', icon: '../assets/icons/ri_a_overloadexplosion_g1.png', cooldown: '42s', castTime: '1.1s | Level 1 1.9s | Level 2 1.8s | Level 3 7s', description: 'Deals 3585/6301/10866 magical wind damage. May knock back the targer. Small probability of a crit strike.' },
                { key: 'quickRecharge', name: '(Improved) Quick Recharge', icon: '../assets/icons/ri_a_eathiumcharge_g1.png', cooldown: '1m3s', description: 'Restores 50% of MP. Restores 5% of MP every 3s for 15s. Restores 20000 HP.' },
                { key: 'electricAirWave', name: '(Improved) Electric Air Wave', icon: '../assets/icons/ri_a_eathiumnet_g1.png', cooldown: '1m12s', description: 'Deals 3352 magical wind damage. Paralyses the target for 2.5 seconds.' }
            ]
        },
        resolveVision: function(build) {
            if (!build) return 'electricAirWave';

            var gold = build.gold[0];
            var blue = (build.blue || []).slice(0, 2).filter(Boolean);
            var has = function(key) { return blue.indexOf(key) !== -1; };

            if (gold === 'leapOfDestruction') {
                if ((has('powerIncrease') && has('electricBinding')) ||
                    (has('powerIncrease') && has('stormStrike')) ||
                    (has('electricBinding') && has('stormStrike'))) {
                    return 'idiumExplosion';
                }
            }

            if (gold === 'idShield') {
                if ((has('lifelineSlash') && has('magicVeil')) ||
                    (has('lifelineSlash') && has('mobilityBoost')) ||
                    (has('magicVeil') && has('mobilityBoost'))) {
                    return 'quickRecharge';
                }
            }

            return 'electricAirWave';
        }
    },
    gunner: {
        displayName: 'Gunner',
        slots: { gold: 1, blue: 3, green: 5 },
        baseUnlocked: { gold: 1, blue: 2, green: 3 },
        tiers: {
            green: [
                { key: 'trueshotMagicEye', name: '(Improved) Trueshot Magic Eye', icon: '../assets/icons/live_gu_a_bullseye_g1.png', cooldown: '37s', description: 'Increases Magical Acc by 2,400 for 20s.' },
                { key: 'firebugCannon', name: '(Improved) Firebug Cannon', icon: '../assets/icons/live_gu_a_flamecannon_1_g1.png', cooldown: '16s', castTime: '1.2s | Level 1 1.5s | Level 2 1.4s | Level 3 7s', description: 'Deals 2014/3442/5001 magical fire damage. Reduces the target\'s Magic Defence by 150/200/250 for 10s.' },
                { key: 'frostCannon', name: '(Improved) Frost Cannon', icon: '../assets/icons/live_gu_a_icecannon_g1.png', cooldown: '21s', description: 'Deals 1891 magical water damage. Immobilises the target for 5s. There is only a slight chance this state can be removed.' },
                { key: 'breathOfMagicPower', name: '(Improved) Breath of Magic Power', icon: '../assets/icons/live_gu_a_magicalbreathing_g1.png', cooldown: '42s', description: 'Increases HP by 3661 for 5m. Increases Natural Healing by 594. Increases Natural Mana Treatment by 297.' },
                { key: 'soulsuckerShot', name: '(Improved) Soulsucker Shot', icon: '../assets/icons/live_gu_a_mentalsnatcher_g1.png', cooldown: '21s', description: 'Deals 1112 magical water damage. Absorbs HP equal to 40% of the damage. Absorbs MP equal to 50% of the damage.' },
                { key: 'rapidVolley', name: '(Improved) Rapid Volley', icon: '../assets/icons/live_gu_a_onepointrapidfire_g1.png', cooldown: '21s', description: 'Deals 908 magical earth damage. Deals additional damage if the target is a Balaur. Multicast 5 times.' },
                { key: 'shockCannon', name: '(Improved) Shock Cannon', icon: '../assets/icons/live_gu_a_shockcannon_1_g1.png', cooldown: '28s', castTime: '0.5s | Level 1 1.5s | Level 2 1.4s | Level 3 7s', description: 'Deals 2343/3122/4685 magical fire damage. Stuns/Knocks back/Knocks back the target for 2/2/4s' },
                { key: 'spiritCannon', name: '(Improved) Spirit Cannon', icon: '../assets/icons/live_gu_a_soulbreakcannon_1_g1.png', cooldown: '48s', castTime: '1.5s | Level 1 1.9s | Level 2 1.8s | Level 3 7s', description: 'Deals 4116/4941/6864 magical water damage.' },
                { key: 'flameBombardment', name: '(Improved) Flame Bombardment', icon: '../assets/icons/live_gu_a_vassblaster_1_g1.png', cooldown: '21s', castTime: '1.2s | Level 1 1.5s | Level 2 1.4s | Level 3 7s', description: 'Deals 3134/4075/5297 magical fire damage.' }
            ],
            blue: [
                { key: 'bindingCannonball', name: '(Improved) Binding Cannonball', icon: '../assets/icons/live_gu_a_antigravitycannon_g1.png', cooldown: '48s', description: 'Deals 1099 magical earth damage. The target suffers the Aether\'s Hold effect.' },
                { key: 'fissureCannonball', name: '(Improved) Fissure Cannonball', icon: '../assets/icons/live_gu_a_armorbreak_g1.png', cooldown: '21s', description: 'Deals 2633 magical wind damage. Reduces the target\'s Magic Defence by 600 for 18s. Reduces the target\'s healing effects by 50%.' },
                { key: 'enhanceMagicProjectile', name: '(Improved) Enhance Magic Projectile', icon: '../assets/icons/live_gu_a_empowerammo_g1.png', cooldown: '21s', description: 'Deals additional damage with each attack for 1689 for 10s. Increases Additional PvP and PvE Attack by 500.' },
                { key: 'giftOfMagicPower', name: '(Improved) Gift of Magic Power', icon: '../assets/icons/live_gu_a_empowermagic_g1.png', cooldown: '37s', description: 'Boosts the effect of Magical by 20% 6 times for 30s.' },
                { key: 'loadMagicProjectile', name: '(Improved) Load Magic Projectile', icon: '../assets/icons/live_gu_a_firechainrefresh_g1.png', cooldown: '32s', description: 'Resets the cooldown of Pistol Shot. Resets the cooldown of Headshot. Resets the cooldown of Soul Shot.' },
                { key: 'lifelinePenetration', name: '(Improved) Lifeline Penetration', icon: '../assets/icons/live_gu_a_veinsnipe_g1.png', cooldown: '21s', description: 'Deals 2713 magical earth damage. Causes the target to bleed for 9s.' }
            ],
            gold: [
                { key: 'betweenTheEyes', name: '(Improved) Between the Eyes', icon: '../assets/icons/live_gu_a_sunningshot_g1.png', cooldown: '28s', description: 'Deals 1140 magical fire damage. Knocks the target back.' },
                { key: 'soulCannon', name: '(Improved) Soul Cannon', icon: '../assets/icons/live_gu_a_mentaliccannon_1_g1.png', cooldown: '16s', castTime: '1.2s | Level 1 1.5s | Level 2 1.4s | Level 3 7s', description: 'Deals 4588/6482/8718 magical wind damage. Reduces MP by 8/10/15%.' }
            ],
            vision: [
                { key: 'pursuitStance', name: '(Improved) Pursuit Stance', icon: '../assets/icons/gu_a_pursuit_g1.png', cooldown: '1m24s', description: 'Increases Atk. Speed by 30% for 10s. Increases Speed by 30%. Increases Immobilization Resist by 1,000. Increases Slowing Resistance by 1000.' },
                { key: 'repeatedBombardment', name: '(Improved) Repeated Bombardment', icon: '../assets/icons/gu_a_supportfire_g1.png', cooldown: '42s', castTime: '1.2s | Level 1 1.9s | Level 2 1.8s | Level 3 7s', description: 'Deals 2666/4911/10008 magical fire dmg.' },
                { key: 'wildMagicProjectile', name: '(Improved) Wild Magic Projectile', icon: '../assets/icons/gu_a_blindlyshot_g1.png', cooldown: '42s', description: 'Deals 2367 magical fire damage. Absorbs HP equal to 40% of the damage. Multicast 2 times. Max. 8000 HP Absorption.' }
            ]
        },
        resolveVision: function(build) {
            if (!build) return 'wildMagicProjectile';

            var gold = build.gold[0];
            var blue = (build.blue || []).slice(0, 2).filter(Boolean);
            var has = function(key) { return blue.indexOf(key) !== -1; };

            if (gold === 'betweenTheEyes') {
                if ((has('loadMagicProjectile') && has('lifelinePenetration')) ||
                    (has('loadMagicProjectile') && has('enhanceMagicProjectile')) ||
                    (has('lifelinePenetration') && has('enhanceMagicProjectile'))) {
                    return 'pursuitStance';
                }
            }

            if (gold === 'soulCannon') {
                if ((has('bindingCannonball') && has('giftOfMagicPower')) ||
                    (has('bindingCannonball') && has('fissureCannonball')) ||
                    (has('giftOfMagicPower') && has('fissureCannonball'))) {
                    return 'repeatedBombardment';
                }
            }

            return 'wildMagicProjectile';
        }
    },
    bard: {
        displayName: 'Bard',
        slots: { gold: 1, blue: 3, green: 5 },
        baseUnlocked: { gold: 1, blue: 2, green: 3 },
        tiers: {
            green: [
                { key: 'variationOfPeace', name: '(Improved) Variation of Peace', icon: '../assets/icons/live_ba_a_songofserenity_g1.png', cooldown: '42s', description: 'Restores 6447 MP.' },
                { key: 'melodyOfCourage', name: '(Improved) Melody of Courage', icon: '../assets/icons/live_ba_a_songofbrave_g1.png', cooldown: '12s', description: 'Increases Resist Fear by 430 for 5m. Increases Sleep Resist and Paralysis Resistance by 545.' },
                { key: 'melodyOfDiscipline', name: '(Improved) Melody of Discipline', icon: '../assets/icons/live_ba_a_songoffirm_g1.png', cooldown: '12s', description: 'Increases Stumble and Knock Back Resist by 330 for 5m. Increases Silence Resistance by 545.' },
                { key: 'healingVariation', name: '(Improved) Healing Variation', icon: '../assets/icons/live_ba_a_songofmassheal_g1.png', cooldown: '3s', castTime: '1s | Level 1 1.6s | Level 2 1.6s | Level 3 7s', description: 'Restores 2624/3935/9021 HP.' },
                { key: 'danceOfTheJester', name: '(Improved) Dance of the Jester', icon: '../assets/icons/live_ba_a_lullaby_g1.png', cooldown: '13s', castTime: '1.7s', description: 'Puts the target to sleep for 11s. The duration is reduced by 50% when applied to a player.' },
                { key: 'attackMelody', name: '(Improved) Attack Melody', icon: '../assets/icons/live_ba_a_songofadvance_g1.png', cooldown: '18s', description: 'Increases Speed by 25%.' },
                { key: 'requiemOfOblivion', name: '(Improved) Requiem of Oblivion', icon: '../assets/icons/live_ba_a_songofmanareverse_g1.png', cooldown: '16s', description: 'Removes a big magic buff from the target.' },
                { key: 'marchOfTheBees', name: '(Improved) March of the Bees', icon: '../assets/icons/live_ba_a_songofearth_g1.png', cooldown: '21s', description: 'Deals 1133 magical earth damage. Reduces Magic Resist by 750 for 8s. Reduces Magic Defence by 550.' },
                { key: 'harmonyOfDesolation', name: '(Improved) Harmony of Desolation', icon: '../assets/icons/live_ba_a_songofdestroy_g1.png', cooldown: '21s', description: 'Deals 2110 magical fire damage.' }
            ],
            blue: [
                { key: 'melodyOfJoy', name: '(Improved) Melody of Joy', icon: '../assets/icons/ba_a_songofwarmth_g1.png', cooldown: '16s', description: 'Increases magic defence by 300 for 30 seconds. Increases resist magic by 400. Increases maximum HP by 2025. Increases recovery by 12%.' },
                { key: 'paralysisResonation', name: '(Improved) Paralysis Resonation', icon: '../assets/icons/live_ba_a_delayparalyze_g1.png', cooldown: '43s', castTime: '1s', description: 'After 6 seconds, paralyses the target for 5 seconds.' },
                { key: 'moskieRequiem', name: '(Improved) Moskie Requiem', icon: '../assets/icons/live_ba_a_songofpain_g1.png', cooldown: '42s', castTime: '1s', description: 'Deals 1185 damage to the target every 2s for 8s. Deals 2588 damage after 8s.' },
                { key: 'rejuvenationMelody', name: '(Improved) Rejuvenation Melody', icon: '../assets/icons/live_ba_a_songofregeneration_g1.png', cooldown: '42s', description: 'Restores 3847 HP. Restores an additional 1849 HP every 2s for 8s.' },
                { key: 'healingMode', name: '(Improved) Healing Mode', icon: '../assets/icons/live_ba_a_playingstyleschangea_g1.png', cooldown: '30s', description: 'Increases Healing Boost by 700. Increases HP by 4000. Reduces Magic Attack by 800. Active Skill.' },
                { key: 'magicBoostMode', name: '(Improved) Magic Boost Mode', icon: '../assets/icons/live_ba_a_playingstyleschangeb_g1.png', cooldown: '30s', description: 'Increases Magic Attack by 1150. Increases Magical Acc by 2800. Reduces Healing Boost by 800. Active Skill.' }
            ],
            gold: [
                { key: 'disharmony', name: '(Improved) Disharmony', icon: '../assets/icons/live_ba_a_songofgale_g1.png', cooldown: '42s', description: 'Deals 6263 magical wind damage. Small probability of a crit strike.' },
                { key: 'clearingMelody', name: '(Improved) Clearing Melody', icon: '../assets/icons/live_ba_a_songofbless_g1.png', cooldown: '42s', description: 'Removes 5 altered states from you and your group members. Restores 5181 HP. Increases the target\'s healing effects for 15s.' }
            ],
            vision: [
                { key: 'fantasticVariation', name: '(Improved) Fantastic Variation', icon: '../assets/icons/ba_a_requiem_g1.png', cooldown: '20s', castTime: '1s', description: 'Deals 7155 magical fire damage. Small probability of a crit strike.' },
                { key: 'serenadeOfPurification', name: '(Improved) Serenade of Purification', icon: '../assets/icons/ba_a_massdispel_a_g1.png', cooldown: '10s', description: 'Removes all altered states from the target.' },
                { key: 'illusionTone', name: '(Improved) Illusion Tone', icon: '../assets/icons/ba_a_songofstatdownmsbr_g1.png', cooldown: '21s', description: 'Reduces the target\'s Physical and Magic Attack by 1000 for 15s.' }
            ]
        },
        resolveVision: function(build) {
            if (!build) return 'illusionTone';

            var gold = build.gold[0];
            var blue = (build.blue || []).slice(0, 2).filter(Boolean);
            var has = function(key) { return blue.indexOf(key) !== -1; };

            if (gold === 'disharmony') {
                if ((has('paralysisResonation') && has('magicBoostMode')) ||
                    (has('paralysisResonation') && has('moskieRequiem')) ||
                    (has('magicBoostMode') && has('moskieRequiem'))) {
                    return 'fantasticVariation';
                }
            }

            if (gold === 'clearingMelody') {
                if ((has('rejuvenationMelody') && has('healingMode')) ||
                    (has('rejuvenationMelody') && has('melodyOfJoy')) ||
                    (has('healingMode') && has('melodyOfJoy'))) {
                    return 'serenadeOfPurification';
                }
            }

            return 'illusionTone';
        }
    },
    painter: {
        displayName: 'Painter',
        slots: { gold: 1, blue: 3, green: 5 },
        baseUnlocked: { gold: 1, blue: 2, green: 3 },
        tiers: {
            green: [
                { key: 'colourProtectionShield', name: '(Improved) Colour Protection Shield', icon: '../assets/icons/pa_a_paintshield_g1.png', cooldown: '56s', description: 'Reduces your damage by 60% for 10s. Increases Binding resistance by 1000.' },
                { key: 'lifeBinding', name: '(Improved) Life Binding', icon: '../assets/icons/pa_a_stabstraw_g1.png', cooldown: '21s', castTime: '0.5s', description: 'For the duration of the movement, has a high probability of hitting the targe tand deals 2115 physical damage. Absorbs HP equal to 20% of the damage dealt to the opponent. Small probability of a Crit Strike.' },
                { key: 'colourFight', name: '(Improved) Colour Fight', icon: '../assets/icons/pa_a_wildshooter_g1.png', cooldown: '16s', description: 'Deals 2444 physical damage. Multicast 4 times.' },
                { key: 'timeBomb', name: '(Improved) Time Bomb', icon: '../assets/icons/pa_a_screwpierce_g1.png', cooldown: '21s', description: 'Hits the target after 2s. Deals 11550 magic damage. Stunned for 2s.' },
                { key: 'colourfulRain', name: '(Improved) Colourful Rain', icon: '../assets/icons/pa_a_paintshower2_g1.png', cooldown: '18s', description: 'Removes one altered state from you. Increases Movememt Speed, Flight Speed by 60 for 10s. 1 magical debuff is removed from the target every 3 seconds.' },
                { key: 'colourOfSilence', name: '(Improved) Colour of Silence', icon: '../assets/icons/pa_a_ballooned_g1.png', cooldown: '21s', description: 'Deals 1309 physical damage. Silences the target for 4s.' },
                { key: 'glazeCoating', name: '(Improved) Glaze Coating', icon: '../assets/icons/pa_a_rapidhardening_g1.png', cooldown: '18s', description: 'You evade 1 physical attacks and 3 magic attacks for 3s.' },
                { key: 'healingSeal', name: '(Improved) Healing Seal', icon: '../assets/icons/pa_a_repressedcure_g1.png', cooldown: '18s', description: 'Increases the casting time for healing skills by 100% for 6s. Reduces Healing Boost by 300.' }
            ],
            blue: [
                { key: 'workDestruction', name: '(Improved) Work Destruction', icon: '../assets/icons/pa_a_paintburst_g1.png', cooldown: '42s', description: 'Deals 2011 physical damage. Deals high additional damage and knocks the target back for 4s if it is petrified. Small probability of a crit strike.' },
                { key: 'flashPortrait', name: '(Improved) Flash Portrait', icon: '../assets/icons/pa_a_drawingthunder_g1.png', cooldown: '1m3s', description: 'Deals 2200 physical damage. Deals physical damage to the target every 3 for 12s. Temporarily stuns the target.' },
                { key: 'colourOutbreak', name: '(Improved) Colour Outbreak', icon: '../assets/icons/pa_a_paintfountain_g1.png', cooldown: '48s', description: 'Deals 2682 physical damage. Aether\'s Hold binds the target.' },
                { key: 'intoTheBlack', name: '(Improved) Into the Black', icon: '../assets/icons/pa_a_targetselecting_g1.png', cooldown: '43s', description: 'Increases damage dealt to the target by 30% for 30 seconds.' },
                { key: 'newWork', name: '(Improved) New Work', icon: '../assets/icons/pa_a_chargingplaster_1_g1.png', cooldown: '37s', castTime: '1.1s', description: 'Petrifies the target for 2/4/7s. Increases the petrified target\'s physical and magic defence.' },
                { key: 'viscousColour', name: '(Improved) Viscous Colour', icon: '../assets/icons/pa_a_paintpuddle_g1.png', cooldown: '24s', description: 'Deals 2416 physical damage. Reduces the target\'s Movement Speed by for 6s. Immobilises the target after 6s.' }
            ],
            gold: [
                { key: 'colourFist', name: '(Improved) Colour Fist', icon: '../assets/icons/pa_a_hugehammer_g1.png', cooldown: '21s', description: 'Deals 7666 physical damage. Small probability of a crit strike.' },
                { key: 'imprisonment', name: '(Improved) Imprisonment', icon: '../assets/icons/pa_a_plastershooter_g1.png', cooldown: '36s', castTime: '0.5s', description: 'The target is petrified while the skill is active. Increases the petrified target\'s physical and magic defence.' }
            ],
            vision: [
                { key: 'colorMonster', name: '(Improved) Color Monster', icon: '../assets/icons/pa_a_rushofslime_1_g1.png', cooldown: '42s', castTime: '1.1s', description: 'Deals 2552/5265/14918 physical damage. Small probability of a crit strike.' },
                { key: 'portraitOfGravity', name: '(Improved) Portrait of Gravity', icon: '../assets/icons/pa_a_light_drawingblackhole_g1.png', cooldown: '1m3s', description: 'Deals 4760 physical damage. Drags the target and nearby opponents to a selected position. Reduces movement speed for 7s. Deals 4760 additional damage every second for 12s.' },
                { key: 'flashBand', name: '(Improved) Flash Band', icon: '../assets/icons/pa_a_light_electricpaint_g1.png', cooldown: '42s', castTime: '0.7s', description: 'While the skill is active, colour will be sprayed continuously. Deals 10440 damage every second for 7s. Has a chance of stunning the target temporarily' }
            ]
        },
        resolveVision: function(build) {
            if (!build) return 'flashBand';

            var gold = build.gold[0];
            var blue = (build.blue || []).slice(0, 2).filter(Boolean);
            var has = function(key) { return blue.indexOf(key) !== -1; };

            if (gold === 'colourFist') {
                if ((has('colourOutbreak') && has('flashPortrait')) ||
                    (has('colourOutbreak') && has('workDestruction')) ||
                    (has('flashPortrait') && has('workDestruction'))) {
                    return 'colorMonster';
                }
            }

            if (gold === 'imprisonment') {
                if ((has('viscousColour') && has('newWork')) ||
                    (has('viscousColour') && has('intoTheBlack')) ||
                    (has('newWork') && has('intoTheBlack'))) {
                    return 'portraitOfGravity';
                }
            }

            return 'flashBand';
        }
    }
};

function getStigmaConfig(className) {
    return GC_STIGMA_REGISTRY[className] || null;
}

function buildStigmaTierMap(className) {
    var cfg = getStigmaConfig(className);
    var map = {};
    if (!cfg) return map;
    ['green', 'blue', 'gold', 'vision'].forEach(function(tier) {
        (cfg.tiers[tier] || []).forEach(function(def) {
            map[def.key] = tier;
        });
    });
    return map;
}

function getAllowedStigmaTiersForSlot(slotTier) {
    if (slotTier === 'gold') return ['gold', 'blue', 'green'];
    if (slotTier === 'blue') return ['blue', 'green'];
    if (slotTier === 'green') return ['green'];
    return [];
}

function isStigmaSlotCompatible(slotTier, stigmaTier) {
    if (!slotTier || !stigmaTier) return false;
    var allowed = getAllowedStigmaTiersForSlot(slotTier);
    return allowed.indexOf(stigmaTier) !== -1;
}

function classHasStigmas(className) {
    return !!getStigmaConfig(className);
}

function createDefaultStigmaBuild(className) {
    var cfg = getStigmaConfig(className);
    if (!cfg) return null;
    return {
        gold: new Array(cfg.slots.gold).fill(null),
        blue: new Array(cfg.slots.blue).fill(null),
        green: new Array(cfg.slots.green).fill(null),
        vision: null
    };
}

function ensureStigmaBuild(profile, className) {
    var cfg = getStigmaConfig(className);
    if (!profile || !cfg) {
        if (profile) profile.stigmas = null;
        return null;
    }

    if (!profile.stigmas || profile.stigmasClass !== className) {
        profile.stigmas = createDefaultStigmaBuild(className);
    }

    GC_STIGMA_TIERS.forEach(function(tier) {
        var expected = cfg.slots[tier];
        if (!Array.isArray(profile.stigmas[tier]) || profile.stigmas[tier].length !== expected) {
            profile.stigmas[tier] = new Array(expected).fill(null);
        }
    });

    if (typeof profile.stigmas.vision !== 'string') profile.stigmas.vision = null;
    profile.stigmasClass = className;
    normalizeStigmaBuild(className, profile.stigmas);
    return profile.stigmas;
}

function normalizeStigmaBuild(className, build) {
    var cfg = getStigmaConfig(className);
    if (!cfg || !build) return;

    var tierMap = buildStigmaTierMap(className);
    GC_STIGMA_TIERS.forEach(function(tier) {
        build[tier] = (build[tier] || []).map(function(key) {
            if (!key) return null;
            var stigmaTier = tierMap[key];
            return isStigmaSlotCompatible(tier, stigmaTier) ? key : null;
        });
    });

    var used = {};
    GC_STIGMA_TIERS.forEach(function(tier) {
        for (var i = 0; i < build[tier].length; i++) {
            var key = build[tier][i];
            if (!key) continue;
            if (used[key]) build[tier][i] = null;
            else used[key] = true;
        }
    });

    if (!isStigmaExtraUnlocked(className, build)) {
        for (var blueIndex = cfg.baseUnlocked.blue; blueIndex < cfg.slots.blue; blueIndex++) build.blue[blueIndex] = null;
        for (var greenIndex = cfg.baseUnlocked.green; greenIndex < cfg.slots.green; greenIndex++) build.green[greenIndex] = null;
    }

    build.vision = resolveStigmaVisionKey(className, build);
}

function getStigmaDefinition(className, key) {
    if (!key) return null;
    var cfg = getStigmaConfig(className);
    var tier = buildStigmaTierMap(className)[key];
    if (!cfg || !tier) return null;
    return (cfg.tiers[tier] || []).find(function(def) { return def.key === key; }) || null;
}

function getStigmaOptions(className, tier, slotIndex, build) {
    var cfg = getStigmaConfig(className);
    if (!cfg) return [];

    var current = build && build[tier] ? build[tier][slotIndex] : null;
    var selected = {};
    GC_STIGMA_TIERS.forEach(function(listTier) {
        (build && build[listTier] || []).forEach(function(key) {
            if (key) selected[key] = true;
        });
    });

    var allowedTiers = getAllowedStigmaTiersForSlot(tier);
    var options = [];
    allowedTiers.forEach(function(allowedTier) {
        (cfg.tiers[allowedTier] || []).forEach(function(def) {
            options.push(def);
        });
    });

    return options.filter(function(def) {
        return !selected[def.key] || def.key === current;
    });
}

function getStigmaOptionGroups(className, tier, slotIndex, build) {
    var cfg = getStigmaConfig(className);
    if (!cfg) return [];

    var current = build && build[tier] ? build[tier][slotIndex] : null;
    var selected = {};
    GC_STIGMA_TIERS.forEach(function(listTier) {
        (build && build[listTier] || []).forEach(function(key) {
            if (key) selected[key] = true;
        });
    });

    var allowedTiers = getAllowedStigmaTiersForSlot(tier);
    var groups = [];
    allowedTiers.forEach(function(allowedTier) {
        var defs = (cfg.tiers[allowedTier] || []).filter(function(def) {
            return !selected[def.key] || def.key === current;
        });
        if (defs.length) {
            groups.push({ tier: allowedTier, defs: defs });
        }
    });
    return groups;
}

function isStigmaExtraUnlocked(className, build) {
    var cfg = getStigmaConfig(className);
    if (!cfg || !build) return false;
    return !!(build.gold[0] && build.blue[0] && build.blue[1] && build.green[0] && build.green[1] && build.green[2]);
}

function isStigmaSlotLocked(className, tier, slotIndex, build) {
    var cfg = getStigmaConfig(className);
    if (!cfg) return true;
    if (slotIndex < cfg.baseUnlocked[tier]) return false;
    return !isStigmaExtraUnlocked(className, build);
}

function resolveStigmaVisionKey(className, build) {
    var cfg = getStigmaConfig(className);
    if (!cfg) return null;
    return typeof cfg.resolveVision === 'function' ? cfg.resolveVision(build) : null;
}

function getStigmaTierMap(className) {
    return buildStigmaTierMap(className);
}

function getEquippedStigmaDefinitions(className, build) {
    var defs = [];
    if (!build) return defs;

    GC_STIGMA_TIERS.forEach(function(tier) {
        (build[tier] || []).forEach(function(key) {
            var def = getStigmaDefinition(className, key);
            if (def) defs.push(def);
        });
    });

    var visionKey = resolveStigmaVisionKey(className, build);
    var vision = getStigmaDefinition(className, visionKey);
    if (vision) defs.push(vision);
    return defs;
}