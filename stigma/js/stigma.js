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
                    key: 'ankle-snare',
                    name: '(Improved) Ankle Snare',
                    icon: '../assets/icons/cbt_fi_a_anklegrab_g1.png',
                    cooldown: '51s',
                    description: 'Immobilises the target for 10s. There is only a slight chance this state can be removed. Reduces enemy evasion by 2200.'
                },
                {
                    key: 'crippling-cut',
                    name: '(Improved) Crippling Cut',
                    icon: '../assets/icons/cbt_fi_a_cripplingcut_g1.png',
                    cooldown: '12.6s',
                    description: 'Deals 2222 physical damage to a stumbled target.',
                    combat: { type: 'attack', damage: 2222, cooldownSec: 12.6, executeTimeSec: 1, priority: 30, requiresTargetState: 'stumble' }
                },
                {
                    key: 'dauntless-spirit',
                    name: '(Improved) Dauntless Spirit',
                    icon: '../assets/icons/live_fi_a_ragespirit_g1.png',
                    cooldown: '42s',
                    description: 'Confers a protective shield for 10s. Grants up to 4208 protection.'
                },
                {
                    key: 'draining-blow',
                    name: '(Improved) Draining Blow',
                    icon: '../assets/icons/live_fi_a_stigma_draincut_g1.png',
                    cooldown: '21s',
                    description: 'Deals 1656 physical damage to a stumbled target. Absorbs HP equal to 100% of the damage.',
                    combat: { type: 'attack', damage: 1656, cooldownSec: 21, executeTimeSec: 1, priority: 31, requiresTargetState: 'stumble' }
                },
                {
                    key: 'earthquake-wave',
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
                    key: 'magic-defence',
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
                    key: 'exhausting-wave',
                    name: '(Improved) Exhausting Wave',
                    icon: '../assets/icons/live_fi_a_whirldrain_g1.png',
                    cooldown: '48s',
                    description: 'Deals 1311 physical damage. Absorbs HP equal to 25% of the damage. Multicast 3 times. Max 7000 HP absorption.',
                    linkedTooltips: [
                        {
                            key: 'revival-wave',
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
                    key: 'severe-precision-cut',
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
                        unlocks: ['energy-explosion']
                    }
                },
                {
                    key: 'sharp-strike',
                    name: '(Improved) Sharp Strike',
                    icon: '../assets/icons/live_fi_a_sharpnesshit_g1.png',
                    cooldown: '11.2s',
                    description: 'Deals 1533 physical damage. Multicast 2 times.',
                    combat: { type: 'attack', damage: 1533, hits: 2, cooldownSec: 11.2, executeTimeSec: 1, priority: 25 }
                },
                {
                    key: 'sure-strike',
                    name: '(Improved) Sure Strike',
                    icon: '../assets/icons/live_fi_a_burserklance_g1.png',
                    cooldown: '21s',
                    description: 'Has a high chance to hit and deals 3533 physical damage.',
                    combat: { type: 'attack', damage: 3533, cooldownSec: 21, executeTimeSec: 1, priority: 11, unlocks: ['energy-explosion'] }
                },
                {
                    key: 'spite-strike',
                    name: '(Improved) Spite Strike',
                    icon: '../assets/icons/live_fi_a_technicalcounter_g1.png',
                    cooldown: '7s',
                    description: 'After a successful parry, deals 1905 physical damage. Causes the target to stumble.',
                    combat: { type: 'attack', damage: 1905, cooldownSec: 7, executeTimeSec: 1, priority: 26, appliesTargetState: { key: 'stumble', durationSec: 4 } }
                },
                {
                    key: 'tendon-slice',
                    name: '(Improved) Tendon Slice',
                    icon: '../assets/icons/live_fi_a_kneecrash_g1.png',
                    cooldown: '21s',
                    description: 'Deals 1668 physical damage. Immobilises the target for 8s. There is only a slight chance this state can be removed.',
                    combat: { type: 'attack', damage: 1668, cooldownSec: 21, executeTimeSec: 1, priority: 27 }
                }
            ],
            gold: [
                {
                    key: 'draining-sword',
                    name: '(Improved) Draining Sword',
                    icon: '../assets/icons/live_fi_a_drainsword_g1.png',
                    cooldown: '42s',
                    description: 'Deals 2522 physical damage. Absorbs HP equal to 20% of the damage. Multicast 2 times.',
                    combat: { type: 'attack', damage: 2522, hits: 2, cooldownSec: 42, executeTimeSec: 1, priority: 15 }
                },
                {
                    key: 'whirling-strike',
                    name: '(Improved) Whirling Strike',
                    icon: '../assets/icons/live_fi_a_jumpattack_g1.png',
                    cooldown: '21s',
                    description: 'Deals 2704 physical damage.',
                    combat: { type: 'attack', damage: 2704, cooldownSec: 21, executeTimeSec: 1, priority: 16 }
                }
            ],
            vision: [
                {
                    key: 'blade-all-round-strike',
                    name: '(Improved) Blade All-round Strike',
                    icon: '../assets/icons/fi_a_bladeshock_g1.png',
                    castTime: '0.5s',
                    cooldown: '28s',
                    description: 'Has a high chance to hit and deals 4497 physical damage. Causes the target to stumble. A successful attack resets Springing Slice cooldown.',
                    combat: { type: 'attack', damage: 4497, cooldownSec: 28, executeTimeSec: 0.5, priority: 8, appliesTargetState: { key: 'stumble', durationSec: 4 } }
                },
                {
                    key: 'mangling-cyclone',
                    name: '(Improved) Mangling Cyclone',
                    icon: '../assets/icons/fi_a_movewhirl_g1.png',
                    cooldown: '1m3s',
                    description: 'Deals 2146 physical damage. Multicast 3 times.',
                    combat: { type: 'attack', damage: 2146, hits: 3, cooldownSec: 63, executeTimeSec: 1, priority: 14 }
                },
                {
                    key: 'summon-battlefield-flag',
                    name: '(Improved) Summon Battlefield Flag',
                    icon: '../assets/icons/fi_a_warflag_g1.png',
                    cooldown: '42s',
                    description: 'Reduces target healing boost by 1200. Reduces additional PvP defence by 600. The effect cannot be removed.'
                }
            ]
        },
        resolveVision: function(build) {
            if (!build) return 'summon-battlefield-flag';

            var gold = build.gold[0];
            var blue = (build.blue || []).filter(Boolean);
            var has = function(key) { return blue.indexOf(key) !== -1; };

            if (gold === 'whirling-strike') {
                if ((has('severe-precision-cut') && has('exhausting-wave')) ||
                    (has('severe-precision-cut') && has('tendon-slice')) ||
                    (has('tendon-slice') && has('exhausting-wave'))) {
                    return 'mangling-cyclone';
                }
            }

            if (gold === 'draining-sword') {
                if ((has('sharp-strike') && has('spite-strike')) ||
                    (has('sharp-strike') && has('sure-strike')) ||
                    (has('spite-strike') && has('sure-strike'))) {
                    return 'blade-all-round-strike';
                }
            }

            return 'summon-battlefield-flag';
        }
    },
    templar: {
        displayName: 'Templar',
        slots: { gold: 1, blue: 3, green: 5 },
        baseUnlocked: { gold: 1, blue: 2, green: 3 },
        tiers: {
            green: [
                {
                    key: 'baricade-of-steel',
                    name: '(Improved) Baricade of Steel',
                    icon: '../assets/icons/live_kn_a_reflectshield_g1.png',
                    cooldown: '11s',
                    description: 'Increases block by 4400, physical defence by 550, stun knock back stumble spin aetherhold and immobilization resists by 1500, slowing resistance by 1000. You cannot jump when using the skill. Active skill.' 
                },
                {
                    key: 'holy-shield',
                    name: '(Improved) Holy Shield',
                    icon: '../assets/icons/cbt_kn_a_holywrath_g1.png',
                    cooldown: '42s',
                    description: 'For 20s, reflects 678 damage back to an opponent within 5m that attacks you.'
                },
                {
                    key: 'divine-fury',
                    name: '(Improved) Divine Fury',
                    icon: '../assets/icons/cbt_kn_a_divinepower_g1.png',
                    cooldown: '48s',
                    description: 'Increases Physical Attack by 550 for 30s.'
                },
                {
                    key: 'incur-wrath',
                    name: '(Improved) Incur Wrath',
                    icon: '../assets/icons/live_kn_a_highprovoke_g1.png',
                    cooldown: '7s',
                    description: 'Taunts an enemy to increase their enmity towards you. Increases the additional PvE def by 1500. If the target is a player, their Enmity will probably be directed at you.'
                },
                {
                    key: 'elimination-strike',
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
                    key: 'aether-armour',
                    name: '(Improved) Aether Armour',
                    icon: '../assets/icons/live_kn_a_stigma_resistarmor_g1.png',
                    cooldown: '43s',
                    description: 'Increases magic resist by 4400 for 20s. Increases magic def by 1000.'
                },
                {
                    key: 'inquisitor-blow',
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
                    key: 'prayer-of-resilience',
                    name: '(Improved) Prayer of Resilience',
                    icon: '../assets/icons/live_kn_a_recover_g1.png',
                    cooldown: '48s',
                    description: 'Restores 8775 HP'
                },
                {
                    key: 'prayer-of-victory',
                    name: '(Improved) Prayer of Victory',
                    icon: '../assets/icons/live_kn_a_sentinel_a_g1.png',
                    cooldown: '1m12s',
                    description: 'Increases HP by 3510 for 2m. Increases add pvp def and pve def by 300.'
                },
                {
                    key: 'divine-justice',
                    name: '(Improved) Divine Justice',
                    icon: '../assets/icons/live_kn_a_brainstorm_g1.png',
                    cooldown: '48s',
                    castTime: '0.5s',
                    description: 'Deals 1503 physical damage. Stuns the target for 2s.'
                },
                {
                    key: 'magic-smash',
                    name: '(Improved) Magic Smash',
                    icon: '../assets/icons/live_kn_a_powersink_g1.png',
                    cooldown: '21s',
                    description: 'Reduces Healing Boost by 800 for 8s. Deals 1584 physical damage. The effect cannot be removed.'
                },
                {
                    key: 'punishing-wave',
                    name: '(Improved) Punishing Wave',
                    icon: '../assets/icons/live_kn_a_fortitudewave_g1.png',
                    cooldown: '1m3s',
                    description: 'Deals 1584 physical damage. Immobilises the target for 10s. There is only a slight chance this state can be removed.'
                },
                {
                    key: 'shield-of-faith',
                    name: '(Improved) Shield of Faith',
                    icon: '../assets/icons/live_kn_a_invinsibleshield_g1.png',
                    cooldown: '1m30s',
                    description: 'You block 12 times for 20s.'
                }
            ],
            gold: [
                {
                    key: 'empyrean-providence',
                    name: '(Improved) Empyrean Providence',
                    icon: '../assets/icons/live_kn_a_invinsibleprotect_g1.png',
                    cooldown: '2m42s',
                    description: 'Reduces your damage by 50% for 12s. Increases stun, knockback, stumble, spin and aether hold resists by 1500.'
                },
                {
                    key: 'shield-blast',
                    name: '(Improved) Shield Blast',
                    icon: '../assets/icons/live_kn_a_destructshield_g1.png',
                    cooldown: '28s',
                    description: 'Has a high chance of hitting the target and then deals 2026 physical damage. Causes the target to stumble.'
                }
            ],
            vision: [
                {
                    key: 'bloodsucking-punishment',
                    name: '(Improved) Bloodsucking Punishment',
                    icon: '../assets/icons/kn_a_godpunishment_g1.png',
                    cooldown: '12s',
                    description: 'Deals 2185 physical damage. Absorbs HP equal to 50% of the damage. Aborbs MP equal to 30% of the damage.'
                },
                {
                    key: 'barrier-shield',
                    name: '(Improved) Barrier Shield',
                    icon: '../assets/icons/kn_a_standingshield_g1.png',
                    cooldown: '1m12s',
                    description: 'Reduces your damage by 80% for 15s. Drastically reduces your movement speed. Grants up to 50000 protection.'
                },
                {
                    key: 'reflection-of-chastisement',
                    name: '(Improved) Reflection of Chastisement',
                    icon: '../assets/icons/kn_a_skillreflector_g1.png',
                    cooldown: '1m24s',
                    description: 'When you are attacked, the effect of attack skills is reflected back on the enemy for 5s.'
                }
            ]
        },
        resolveVision: function(build) {
            if (!build) return 'barrier-shield';

            var gold = build.gold[0];
            var blue = (build.blue || []).filter(Boolean);
            var has = function(key) { return blue.indexOf(key) !== -1; };

            if (gold === 'empyrean-providence') {
                if ((has('prayer-of-victory') && has('prayer-of-resilience')) ||
                    (has('prayer-of-victory') && has('shield-of-faith')) ||
                    (has('prayer-of-resilience') && has('shield-of-faith'))) {
                    return 'bloodsucking-punishment';
                }
            }

            if (gold === 'shield-blast') {
                if ((has('divine-justice') && has('punishing-wave')) ||
                    (has('divine-justice') && has('magic-smash')) ||
                    (has('punishing-wave') && has('magic-smash'))) {
                    return 'reflection-of-chastisement';
                }
            }

            return 'barrier-shield';
        }
    },
    assassin: {
        displayName: 'Assassin',
        slots: { gold: 1, blue: 3, green: 5 },
        baseUnlocked: { gold: 1, blue: 2, green: 3 },
        tiers: {
            green: [
                {
                    key: 'rune-carve-sigil-strike',
                    name: '(Improved) Rune Carve - Sigil Strike',
                    icon: '../assets/icons/cbt_as_a_carvesignetchain_g1.png',
                    cooldown: '5s',
                    description: 'Deals 1878 physical damage. Inflicts a Rune Carve up to level 3 on the target.' 
                },
                {
                    key: 'deadly-abandon',
                    name: '(Improved) Deadly Abandon',
                    icon: '../assets/icons/live_as_a_stabstance_g1.png',
                    cooldown: '10s',
                    description: 'Increases Physical Attack by 350. Reduces Evasion by 800. Active skill.'
                },
                {
                    key: 'oath-of-accuracy',
                    name: '(Improved) Oath of Accuracy',
                    icon: '../assets/icons/live_as_a_hitmanmind_g1.png',
                    cooldown: '50s',
                    description: 'Increases Accuracy by 4000 for 20s. Increases Magical Acc by 6000.'
                },
                {
                    key: 'shadow-walk',
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
                    key: 'Venomous Strike',
                    name: '(Improved) Venomous Strike',
                    icon: '../assets/icons/live_as_a_venomstab_g1.png',
                    cooldown: '42s',
                    description: 'Deals 1107 physical damage. Deals 3450 additional damage when attacking the target from behind. Poisons the target for 15s.'
                },
                {
                    key: 'eye-of-wrath',
                    name: '(Improved) Eye of Wrath',
                    icon: '../assets/icons/cbt_as_a_visiouseye_g1.png',
                    cooldown: '42s',
                    description: 'Boosts the effect of Physical by 60% 2 times for 15s. Reduces Crit Strike by 700.'
                },
                {
                    key: 'rune-knife',
                    name: '(Improved) Rune Knife',
                    icon: '../assets/icons/cbt_as_a_signetwave_g1.png',
                    cooldown: '7s',
                    description: 'Deals 1549 physical damage. Inflicts a Rune Carve up to level 3 on the target.'
                },
                {
                    key: 'ambush-raid',
                    name: '(Improved) Ambush Raid',
                    icon: '../assets/icons/as_a_backblow_g1.png',
                    cooldown: '21s',
                    description: 'Inflicts 2130 physical damage while you are in stealth mode. Stuns the target for 15s.'
                }
            ],
            blue: [
                {
                    key: 'lightning-slash',
                    name: '(Improved) Lightning Slash',
                    icon: '../assets/icons/live_as_a_flashslash_g1 (1).png',
                    cooldown: '16s',
                    description: 'Deals 1380 physical damage. Reduces evasion and physical defence by 1000 for 15s.'
                },
                {
                    key: 'apply-lethal-venom',
                    name: '(Improved) Apply Lethal Venom',
                    icon: '../assets/icons/live_as_a_explosionpoison_g1.png',
                    cooldown: '48s',
                    description: 'Has a 30% chance to inflict 8894 additional damage for 30s.'
                },
                {
                    key: 'dash-and-slash',
                    name: '(Improved) Dash and Slash',
                    icon: '../assets/icons/live_as_a_assaultslash_g1.png',
                    cooldown: '28s',
                    description: 'Deals 1492 physical damage. Multicast 2 times.'
                },
                {
                    key: 'agony-rune',
                    name: '(Improved) Agony Rune',
                    icon: '../assets/icons/live_as_a_chainsignetburst_g1.png',
                    cooldown: '8s',
                    description: 'Deals 8361 magical fire damage.'
                },
                {
                    key: 'fleeing-posture',
                    name: '(Improved) Fleeing Posture',
                    icon: '../assets/icons/as_a_runnersstance_g1.png',
                    cooldown: '56s',
                    description: 'Removes movement-restricting states. Increases resistance to shock states by 1200 for 12s.'
                },
                {
                    key: 'sensory-boost',
                    name: '(Improved) Sensory Boost',
                    icon: '../assets/icons/live_as_a_senseboost_g1.png',
                    cooldown: '43s',
                    description: 'Increases Evasion and Magic Resist by 3600, Physical defence and stumble resist by 1200 for 15s.'
                }
            ],
            gold: [
                {
                    key: 'quickening-doom',
                    name: '(Improved) Quickening Doom',
                    icon: '../assets/icons/live_as_a_venomslash_g1.png',
                    cooldown: '42s',
                    description: 'Deals 1628 physical damage. Deals 3054 additional damage and stuns the target if it is poisoned.'
                },
                {
                    key: 'dagger-oath',
                    name: '(Improved) Dagger Oath',
                    icon: '../assets/icons/as_a_clearfocus_g1.png',
                    cooldown: '48s',
                    description: 'Has a 60% chance of dealing 7135 additional damage for 30s when attacking from behind.'
                }
            ],
            vision: [
                {
                    key: 'lightning-ambush',
                    name: '(Improved) Lightning Ambush',
                    icon: '../assets/icons/as_a_returnattack_g1.png',
                    cooldown: '48s',
                    description: 'You get behind the target and deal 1785 physical damage to it. Silences teh target for 3 seconds.'
                },
                {
                    key: 'flash-grenade',
                    name: '(Improved) Flash Grenade',
                    icon: '../assets/icons/as_a_widenewblindingburst_g1.png',
                    cooldown: '42s',
                    description: 'Blinds the target for 5s. Reduces Magical Acc by 3000. If the target is a player, their targeting is cancelled for a moment.'
                },
                {
                    key: 'repeated-rune-carve',
                    name: '(Improved) Repeated Rune Carve',
                    icon: '../assets/icons/as_a_resignetassault_g1.png',
                    cooldown: '48s',
                    description: 'When you are attacked, the effect of attack skills is reflected back on the enemy for 5s.'
                }
            ]
        },
        resolveVision: function(build) {
            if (!build) return 'repeated-rune-carve';

            var gold = build.gold[0];
            var blue = (build.blue || []).filter(Boolean);
            var has = function(key) { return blue.indexOf(key) !== -1; };

            if (gold === 'quickening-doom') {
                if ((has('apply-lethal-venom') && has('dash-and-slash')) ||
                    (has('apply-lethal-venom') && has('agony-rune')) ||
                    (has('dash-and-slash') && has('agony-rune'))) {
                    return 'lightning-ambush';
                }
            }

            if (gold === 'dagger-oath') {
                if ((has('sensory-boost') && has('fleeing-posture')) ||
                    (has('sensory-boost') && has('lightning-slash')) ||
                    (has('fleeing-posture') && has('lightning-slash'))) {
                    return 'flash-grenade';
                }
            }

            return 'repeated-rune-carve';
        }
    },
    ranger: {
        displayName: 'Ranger',
        slots: { gold: 1, blue: 3, green: 5 },
        baseUnlocked: { gold: 1, blue: 2, green: 3 },
        tiers: {
            green: [
                { key: 'focused-shots', name: '(Improved) Focused Shots', icon: '../assets/icons/cbt_sc_a_trueshotmind_g1.png', cooldown: '1s', description: 'Increases the effect of Physical by 33% 5 times for 1m. Increases accuracy, magical acc by 2600, reduces physical defence by 6%.' },
                { key: 'trap-of-slowing', name: '(Improved) Trap of Slowing', icon: '../assets/icons/live_ra_a_light_throwingtrap_g1.png', cooldown: '37s', description: 'The trap is active for 1m. Immobilises the target and reduces it\'s evasion.' },
                { key: 'seal-arrow', name: '(Improved) Seal Arrow', icon: '../assets/icons/ra_a_sealingarrow_g1.png', cooldown: '21s', description: 'Deals 906 physical damage. Increases the casting time by 100% for 6s-8s. Reduces the attack speed.' },
                { key: 'skybound-trap', name: '(Improved) Skybound Trap', icon: '../assets/icons/live_ra_a_snakebitetrap_g1.png', cooldown: '43s', castTime: '2s', description: 'The trap is active for 1m. Aether\'s Hold binds the target.' },
                { key: 'blazing-trap', name: '(Improved) Blazing Trap', icon: '../assets/icons/live_ra_a_light_blazingtrap_g1.png', cooldown: '12s', description: 'The trap is active for 1m. Deals magic damage to the target.' },
                { key: 'natures-resolve', name: '(Improved) Nature\'s Resolve', icon: '../assets/icons/cbt_ra_a_resistmind_g1.png', cooldown: '48s', description: 'Removes one altered physical state. You also resist 2 magic attacks for 12s.' },
                { key: 'bow-of-blessing', name: '(Improved) Bow of Blessing', icon: '../assets/icons/live_ra_a_enchantbow_g1.png', cooldown: '43s', description: 'Increases Physical Attack by 480s for 40s. Increases Crit Strike by 1200.' },
                { key: 'trap-of-clairvoyance', name: '(Improved) Trap of Clairvoyance', icon: '../assets/icons/cbt_ra_a_light_fairyflare_g1.png', cooldown: '25s', description: 'The trap is active for 1m. Removes the target\'s stealth mode.' },
                { key: 'arrow-deluge', name: '(Improved) Arrow Deluge', icon: '../assets/icons/cbt_ra_a_spoutarrow_g1.png', cooldown: '12s', description: 'Deals 1370 physical damage. Multicast 3 times.' }
            ],
            blue: [
                { key: 'lethal-arrow', name: '(Improved) Lethal Arrow', icon: '../assets/icons/live_ra_a_massexplosionarrow_g1.png', cooldown: '16s', description: 'Has a high chance of hitting the target and then deals 1903 physical damage.' },
                { key: 'raging-wind-arrow', name: '(Improved) Raging Wind Arrow', icon: '../assets/icons/live_ra_a_shadowarrow_g1.png', cooldown: '14s', description: 'Deals 1545 physical damage. Decreases the cooldown for Retreating Slkash by 70%.' },
                { key: 'hunters-might', name: '(Improved) Hunter\'s Might', icon: '../assets/icons/live_ra_a_huntermind_g1.png', cooldown: '37s', description: 'Physical attack skills deal crit strikes 3 times for 20s.' },
                { key: 'gale-arrow', name: '(Improved) Gale Arrow', icon: '../assets/icons/live_ra_a_movingshot_g1.png', cooldown: '7s', description: 'Deals 1229 physical damage. Multicast 2 times.' },
                { key: 'explosive-arrow', name: '(Improved) Explosive Arrow', icon: '../assets/icons/live_ra_a_explosionarrow_g1.png', cooldown: '12s', description: 'Deals 2350 physical damage.' },
                { key: 'sharpen-arrows', name: '(Improved) Sharpen Arrows', icon: '../assets/icons/live_ra_a_trackermind_g1.png', cooldown: '1s', description: 'Increases Physical Attack of Bow by 500. Increases Crit Strike by 650. Increases Add. PvE Atk. by 650. Active skill.' }
            ],
            gold: [
                { key: 'agonising-arrow', name: '(Improved) Agonising Arrow', icon: '../assets/icons/live_ra_a_painarrow_g1.png', cooldown: '16s', description: 'Deals 2004 physical damage. Reduces the target\'s healing by 50% for 6s. The effect cannot be removed' },
                { key: 'lightning-arrow', name: '(Improved) Lightning Arrow', icon: '../assets/icons/live_ra_a_lightningshot_g1.png', cooldown: '21s', description: 'Deals 1408 physical damage. Stuns the target for 1s.' }
            ],
            vision: [
                { key: 'shadowbound', name: '(Improved) Shadowbound', icon: '../assets/icons/ra_a_fasthide_g1.png', cooldown: '1m3s', description: 'Even if you\'re being attacked for 6s, your improved stealth mode will be maintained. Available during battle.' },
                { key: 'spear-of-penetration', name: '(Improved) Spear of Penetration', icon: '../assets/icons/ra_a_heavysnipe_g1.png', cooldown: '1m3s', castTime: '0.5s', description: 'Has a high chance of hitting the target and then deals 2644 physical damage. May stun the target for 3s.' },
                { key: 'collision-trap', name: '(Improved) Collision Trap', icon: '../assets/icons/ra_a_shockwavetrap_g1.png', cooldown: '48s', description: 'Sets a trap that knocks opponents back.' }
            ]
        },
        resolveVision: function(build) {
            if (!build) return 'collision-trap';

            var gold = build.gold[0];
            var blue = (build.blue || []).filter(Boolean);
            var has = function(key) { return blue.indexOf(key) !== -1; };

            if (gold === 'agonising-arrow') {
                if ((has('hunters-might') && has('sharpen-arrows')) ||
                    (has('hunters-might') && has('gale-arrow')) ||
                    (has('sharpen-arrows') && has('gale-arrow'))) {
                    return 'shadowbound';
                }
            }

            if (gold === 'lightning-arrow') {
                if ((has('raging-wind-arrow') && has('explosive-arrow')) ||
                    (has('raging-wind-arrow') && has('lethal-arrow')) ||
                    (has('explosive-arrow') && has('lethal-arrow'))) {
                    return 'spear-of-penetration';
                }
            }

            return 'collision-trap';
        }
    },
    sorcerer: {
        displayName: 'Sorcerer',
        slots: { gold: 1, blue: 3, green: 5 },
        baseUnlocked: { gold: 1, blue: 2, green: 3 },
        tiers: {
            green: [
                { key: 'arcane-thunderbolt', name: '(Improved) Arcane Thunderbolt', icon: '../assets/icons/live_wi_a_stormshock_g1.png', cooldown: '1m3s', castTime: '1s', description: 'Deals 2725 magical wind damage. Stunes the target for 3s.' },
                { key: 'absolute-zero', name: '(Improved) Absolute Zero', icon: '../assets/icons/live_wi_a_hibernation_g1.png', cooldown: '54s', description: 'You are stunned and cannot be attacked for 6s.' },
                { key: 'ice-sheet', name: '(Improved) Ice Sheet', icon: '../assets/icons/cbt_wi_a_light_frostpillar_g1.png', cooldown: '1m4s', description: 'Deals magical water damage to the target. Reduces the target\'s movement speed.' },
                { key: 'exchange-vitality', name: '(Improved) Exchange Vitality', icon: '../assets/icons/live_wi_a_hpmpexchange_g1.png', cooldown: '1m48s', description: 'Swaps around your current HP and MP.' },
                { key: 'curse-of-weakness', name: '(Improved) Curse of Weakness', icon: '../assets/icons/cbt_wi_a_countermagic_g1.png', cooldown: '1m4s', description: 'Whenever the target uses a magic attack, it sustains magic damage equal to 15% of its maximum HP for 30s. The maximum magic damage is 4000.' },
                { key: 'boon-of-quickness', name: '(Improved) Boon of Quickness', icon: '../assets/icons/cbt_wi_a_dark_icyveins_g1.png', cooldown: '1m15s', description: 'Increases the target\'s casting time for all magical skills by 50% for 15s.' },
                { key: 'ice-harpoon', name: '(Improved) Ice Harpoon', icon: '../assets/icons/live_wi_a_stigma_icelance_g1.png', cooldown: '6s', castTime: '2.5s', description: 'Deals 4419 magical water damage.' },
                { key: 'elemental-ward', name: '(Improved) Elemental Ward', icon: '../assets/icons/live_wi_a_elementalseal_g1.png', cooldown: '48s', description: 'Increases Magic Defence and Magic Resist by 1800 for 15s.' },
                { key: 'cyclone-strike', name: '(Improved) Cyclone Strike', icon: '../assets/icons/live_wi_a_cyclonestrike_g1.png', cooldown: '1m3s', castTime: '4s', description: 'Deals 8046 magical wind damage.' }
            ],
            blue: [
                { key: 'sleeping-storm', name: '(Improved) Sleeping Storm', icon: '../assets/icons/live_wi_a_sleepingstorm_g1.png', cooldown: '1m4s', castTime: '1s', description: 'Puts the target to sleep for 16s. The duration is reduced by 50% when applied to a player.' },
                { key: 'summon-stone', name: '(Improved) Summon Stone', icon: '../assets/icons/live_wi_a_rockfall_g1.png', cooldown: '12s', description: 'Deal 2092 magical earth damage.' },
                { key: 'summon-whirlwind', name: '(Improved) Summon Whirlwind', icon: '../assets/icons/live_wi_a_summontornado_g1.png', cooldown: '1m8s', description: 'Summons a whirlwind for 3s. Deals magical wind damage to the target and stuns it.' },
                { key: 'flame-spray', name: '(Improved) Flame Spray', icon: '../assets/icons/live_wi_a_flamestrike_g1.png', cooldown: '21s', castTime: '3.5s', description: 'Deals 6277 magical fire damage.' },
                { key: 'illusion-storm', name: '(Improved) Illusion Storm', icon: '../assets/icons/live_wi_a_illusionstorm_g1.png', cooldown: '1m24s', description: 'Deals 1702 magical fire damage. Stuns the target for 3s.' },
                { key: 'wind-cut-down', name: '(Improved) Wind Cut Down', icon: '../assets/icons/live_wi_a_windcutter_g1.png', cooldown: '16s', castTime: '1s', description: 'Deals 2658 magical wind damage. Reduces Magic Defence by 350 for 5s~7s.' }
            ],
            gold: [
                { key: 'winter-armour', name: '(Improved) Winter Armour', icon: '../assets/icons/live_wi_a_icyshield_g1.png', cooldown: '1m12s', description: 'Reflects 3569 damage at the enemies attacking you up to 5 away for 15s. Reduces the target\'s movement and attack speed for 2s' },
                { key: 'glacial-shard', name: '(Improved) Glacial Shard', icon: '../assets/icons/live_wi_a_zeropoint_g1.png', cooldown: '42s', castTime: '4s', description: 'Deals 8437 magical water damage.' }
            ],
            vision: [
                { key: 'wind-of-torpor', name: '(Improved) Wind of Torpor', icon: '../assets/icons/wi_a_windsleep_g1.png', cooldown: '2m', description: 'Puts the target to sleep for 16s. The next magic attack lands a crit strike. The duration is reduced by 50% when applied to a player.' },
                { key: 'boon-of-flame', name: '(Improved) Boon of Flame', icon: '../assets/icons/wi_a_fireshield_g1.png', cooldown: '1s', description: 'Increases magic dmg by 18%. Also reduces MP consumption by 50%. Increases Crit Spell by 1000.' },
                { key: 'refuge-barrier', name: '(Improved) Refuge Barrier', icon: '../assets/icons/wi_a_stonebarrier_g1.png', cooldown: '1m24s', description: 'Increases your casting time by 100% for 6s but grants you a protective shield. Grants up to 150000 protection. Enemies within 10m who attack the protective shield are petrified.' }
            ]
        },
        resolveVision: function(build) {
            if (!build) return 'refuge-barrier';

            var gold = build.gold[0];
            var blue = (build.blue || []).filter(Boolean);
            var has = function(key) { return blue.indexOf(key) !== -1; };

            if (gold === 'winter-armour') {
                if ((has('sleeping-storm') && has('wind-cut-down')) ||
                    (has('sleeping-storm') && has('illusion-storm')) ||
                    (has('wind-cut-down') && has('illusion-storm'))) {
                    return 'wind-of-torpor';
                }
            }

            if (gold === 'glacial-shard') {
                if ((has('summon-stone') && has('flame-spray')) ||
                    (has('summon-stone') && has('summon-whirlwind')) ||
                    (has('flame-spray') && has('summon-whirlwind'))) {
                    return 'boon-of-flame';
                }
            }

            return 'refuge-barrier';
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
                { key: 'magic-implosion', name: '(Improved) Magic Implosion', icon: '../assets/icons/live_el_a_manareverse_g1.png', cooldown: '21s', castTime: '0s', description: 'Removes big magic buffs and debuffs from the target and deals 1885 magic damage. Deals 1464 additional damage to the target every 3s for 30s. It can be removed with skills that dispel magical buffs or debuffs.' },
                { key: 'infernal-pain', name: '(Improved) Infernal Pain', icon: '../assets/icons/live_el_a_hellpain_g1.png', cooldown: '21s', castTime: '1.5s', description: 'DescrDeals 1357 magical earth damage. Deals 1244 additional damage every 3s for 12s. The effect cannot be removed.' },
                { key: 'command-ruinous-offensive', name: '(Improved) Command: Ruinous Offensive', icon: '../assets/icons/live_el_a_stigma_order_destructimpact_g1.png', cooldown: '18s', castTime: '0.8s', description: 'Commands the spirit to use its attack skill. Water Spirit: Magical Water Damage, reduce Magic Defence. Wind Spirit: Magical Wind Damage, reduce Magic Defence. Earth Spirit: Magical Earth Damage, reduce Physical Defence. Fire Spirit: Magical Fire Damage, reduce Physical Defence. Magma Spirit: Magical Fire Damage, Physical Defence, reduce Magic Defence. Tempest Spirit: Magical Wind Damage, Physical Defence, reduce Magic Defence.' },
                { key: 'cyclone-servant', name: '(Improved) Summon Cyclone Servant', icon: '../assets/icons/live_el_a_light_slave_stormservent_g1.png', cooldown: '21s', castTime: '0s', description: 'Deals 1210 magical wind damage every 3 seconds for 10 seconds. The effect cannot be removed.' },
                { key: 'healing-spirit', name: '(Improved) Healing Spirit', icon: '../assets/icons/live_el_a_elementalcharge_g1.png', cooldown: '32s', castTime: '0s', description: 'Restores 100% of the spirit\'s HP. Removes all magical debuffs.' },
                { key: 'shackle-of-vulnerability', name: '(Improved) Shackle of Vulnerability', icon: '../assets/icons/live_el_a_enfeeblement_g1.png', cooldown: '18s', castTime: '1s', description: 'Reduces the attack speed of the target for 20s. Increases the target\'s casting time for all magical skills. Reduces Magic Defence by 660. It can be removed with skills that dispel magical buffs or debuffs.' }
            ],
            gold: [
                { key: 'infernal-blight', name: '(Improved) Infernal Blight', icon: '../assets/icons/live_el_a_hellcurse_g1.png', cooldown: '37s', castTime: '1s', description: 'Reduces the target\'s Physical Defence by 900 for 30s. Reduces Magic Defence by 900. Reduces Magic Resist by 800.' },
                { key: 'strengthening-spirit', name: '(Improved) Strengthening Spirit: Spirit Armour', icon: '../assets/icons/live_el_a_enchantarmor_g1.png', cooldown: '37s', castTime: '1s', description: 'Increases the spirit\'s Physical Attack by 1500 for 5m. Increases Magic Attack by 1500. Increases Physical Defence by 1200. Increases Magic Defence by 1200. Increases Speed by 30%. Increases Magical Acc by 5500. Increases Accuracy by 5500.' }
            ],
            vision: [
                { key: 'spirit-bundling', name: '(Improved) Spirit Bundling', icon: '../assets/icons/el_a_soulking_g1.png', cooldown: '1m12s', description: 'Increases Magical Acc by 1,000 for 3m. Increases Magic Attack by 1,000. Increases Crit Spell by 500. Increases HP by 12,000. Increases Speed by 10%. Increases magic damage by 12%. If you summon a spirit, the skill effect disappears.' },
                { key: 'command-faithful-substitution', name: '(Improved) Command: Faithful Substitution', icon: '../assets/icons/el_a_order_sacrifice_g1.png', cooldown: '48s', description: 'Commands the spirit to protect the target. The spirit absorbs 70% of the damage instead of the caster.' },
                { key: 'large-scale-absorption', name: '(Improved) Large-Scale Absorption', icon: '../assets/icons/el_a_energysink_g1.png', cooldown: '48s', description: 'Deals 675 damage to the target every 2 for 15s. Absorbs HP from the enemy equal to the amount of damage dealt. Max. 10,000 HP Absorption.' }
            ]
        },
        resolveVision: function(build) {
            if (!build) return 'large-scale-absorption';

            var gold = build.gold[0];
            var blue = (build.blue || []).filter(Boolean);
            var has = function(key) { return blue.indexOf(key) !== -1; };

            if (gold === 'infernal-blight') {
                if ((has('infernal-pain') && has('shackle-of-vulnerability')) ||
                    (has('infernal-pain') && has('magic-implosion')) ||
                    (has('shackle-of-vulnerability') && has('magic-implosion'))) {
                    return 'spirit-bundling';
                }
            }

            if (gold === 'strengthening-spirit') {
                if ((has('healing-spirit') && has('cyclone-servant')) ||
                    (has('healing-spirit') && has('command-ruinous-offensive')) ||
                    (has('cyclone-servant') && has('command-ruinous-offensive'))) {
                    return 'command-faithful-substitution';
                }
            }

            return 'large-scale-absorption';
        }
    },
    // cleric: {
    //     displayName: 'Cleric',
    //     slots: { gold: 1, blue: 3, green: 5 },
    //     baseUnlocked: { gold: 1, blue: 2, green: 3 },
    //     tiers: {
    //         green: [
    //             { key: 'green1', name: '(Improved) green1', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green2', name: '(Improved) green2', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green3', name: '(Improved) green3', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green4', name: '(Improved) green4', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green5', name: '(Improved) green5', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green6', name: '(Improved) green6', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green7', name: '(Improved) green7', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green8', name: '(Improved) green8', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green9', name: '(Improved) green9', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' }
    //         ],
    //         blue: [
    //             { key: 'blue1', name: '(Improved) blue1', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'blue2', name: '(Improved) blue2', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'blue3', name: '(Improved) blue3', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'blue4', name: '(Improved) blue4', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'blue5', name: '(Improved) blue5', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'blue6', name: '(Improved) blue6', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' }
    //         ],
    //         gold: [
    //             { key: 'gold1', name: '(Improved) gold1', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'gold2', name: '(Improved) gold2', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' }
    //         ],
    //         vision: [
    //             { key: 'vision1', name: '(Improved) vision1', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'vision2', name: '(Improved) vision2', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'vision3', name: '(Improved) vision3', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' }
    //         ]
    //     },
    //     resolveVision: function(build) {
    //         return 'vision3';
    //     }
    // },
    // chanter: {
    //     displayName: 'Chanter',
    //     slots: { gold: 1, blue: 3, green: 5 },
    //     baseUnlocked: { gold: 1, blue: 2, green: 3 },
    //     tiers: {
    //         green: [
    //             { key: 'green1', name: '(Improved) green1', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green2', name: '(Improved) green2', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green3', name: '(Improved) green3', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green4', name: '(Improved) green4', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green5', name: '(Improved) green5', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green6', name: '(Improved) green6', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green7', name: '(Improved) green7', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green8', name: '(Improved) green8', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green9', name: '(Improved) green9', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' }
    //         ],
    //         blue: [
    //             { key: 'blue1', name: '(Improved) blue1', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'blue2', name: '(Improved) blue2', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'blue3', name: '(Improved) blue3', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'blue4', name: '(Improved) blue4', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'blue5', name: '(Improved) blue5', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'blue6', name: '(Improved) blue6', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' }
    //         ],
    //         gold: [
    //             { key: 'gold1', name: '(Improved) gold1', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'gold2', name: '(Improved) gold2', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' }
    //         ],
    //         vision: [
    //             { key: 'vision1', name: '(Improved) vision1', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'vision2', name: '(Improved) vision2', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'vision3', name: '(Improved) vision3', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' }
    //         ]
    //     },
    //     resolveVision: function(build) {
    //         return 'vision3';
    //     }
    // },
    // aethertech: {
    //     displayName: 'Aethertech',
    //     slots: { gold: 1, blue: 3, green: 5 },
    //     baseUnlocked: { gold: 1, blue: 2, green: 3 },
    //     tiers: {
    //         green: [
    //             { key: 'green1', name: '(Improved) green1', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green2', name: '(Improved) green2', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green3', name: '(Improved) green3', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green4', name: '(Improved) green4', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green5', name: '(Improved) green5', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green6', name: '(Improved) green6', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green7', name: '(Improved) green7', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green8', name: '(Improved) green8', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green9', name: '(Improved) green9', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' }
    //         ],
    //         blue: [
    //             { key: 'blue1', name: '(Improved) blue1', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'blue2', name: '(Improved) blue2', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'blue3', name: '(Improved) blue3', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'blue4', name: '(Improved) blue4', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'blue5', name: '(Improved) blue5', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'blue6', name: '(Improved) blue6', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' }
    //         ],
    //         gold: [
    //             { key: 'gold1', name: '(Improved) gold1', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'gold2', name: '(Improved) gold2', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' }
    //         ],
    //         vision: [
    //             { key: 'vision1', name: '(Improved) vision1', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'vision2', name: '(Improved) vision2', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'vision3', name: '(Improved) vision3', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' }
    //         ]
    //     },
    //     resolveVision: function(build) {
    //         return 'vision3';
    //     }
    // },
    // gunner: {
    //     displayName: 'Gunner',
    //     slots: { gold: 1, blue: 3, green: 5 },
    //     baseUnlocked: { gold: 1, blue: 2, green: 3 },
    //     tiers: {
    //         green: [
    //             { key: 'green1', name: '(Improved) green1', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green2', name: '(Improved) green2', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green3', name: '(Improved) green3', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green4', name: '(Improved) green4', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green5', name: '(Improved) green5', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green6', name: '(Improved) green6', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green7', name: '(Improved) green7', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green8', name: '(Improved) green8', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green9', name: '(Improved) green9', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' }
    //         ],
    //         blue: [
    //             { key: 'blue1', name: '(Improved) blue1', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'blue2', name: '(Improved) blue2', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'blue3', name: '(Improved) blue3', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'blue4', name: '(Improved) blue4', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'blue5', name: '(Improved) blue5', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'blue6', name: '(Improved) blue6', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' }
    //         ],
    //         gold: [
    //             { key: 'gold1', name: '(Improved) gold1', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'gold2', name: '(Improved) gold2', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' }
    //         ],
    //         vision: [
    //             { key: 'vision1', name: '(Improved) vision1', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'vision2', name: '(Improved) vision2', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'vision3', name: '(Improved) vision3', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' }
    //         ]
    //     },
    //     resolveVision: function(build) {
    //         return 'vision3';
    //     }
    // },
    // bard: {
    //     displayName: 'Bard',
    //     slots: { gold: 1, blue: 3, green: 5 },
    //     baseUnlocked: { gold: 1, blue: 2, green: 3 },
    //     tiers: {
    //         green: [
    //             { key: 'green1', name: '(Improved) green1', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green2', name: '(Improved) green2', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green3', name: '(Improved) green3', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green4', name: '(Improved) green4', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green5', name: '(Improved) green5', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green6', name: '(Improved) green6', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green7', name: '(Improved) green7', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green8', name: '(Improved) green8', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'green9', name: '(Improved) green9', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' }
    //         ],
    //         blue: [
    //             { key: 'blue1', name: '(Improved) blue1', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'blue2', name: '(Improved) blue2', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'blue3', name: '(Improved) blue3', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'blue4', name: '(Improved) blue4', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'blue5', name: '(Improved) blue5', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'blue6', name: '(Improved) blue6', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' }
    //         ],
    //         gold: [
    //             { key: 'gold1', name: '(Improved) gold1', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'gold2', name: '(Improved) gold2', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' }
    //         ],
    //         vision: [
    //             { key: 'vision1', name: '(Improved) vision1', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'vision2', name: '(Improved) vision2', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' },
    //             { key: 'vision3', name: '(Improved) vision3', icon: '../assets/icons/link', cooldown: '42s', description: 'Description.' }
    //         ]
    //     },
    //     resolveVision: function(build) {
    //         return 'vision3';
    //     }
    // },
    painter: {
        displayName: 'Painter',
        slots: { gold: 1, blue: 3, green: 5 },
        baseUnlocked: { gold: 1, blue: 2, green: 3 },
        tiers: {
            green: [
                { key: 'color-protection-shield', name: '(Improved) Colour Protection Shield', icon: '../assets/icons/pa_a_paintshield_g1.png', cooldown: '56s', description: 'Reduces your damage by 60% for 10s. Increases Binding resistance by 1000.' },
                { key: 'life-binding', name: '(Improved) Life Binding', icon: '../assets/icons/pa_a_stabstraw_g1.png', cooldown: '21s', castTime: '0.5s', description: 'For the duration of the movement, has a high probability of hitting the targe tand deals 2115 physical damage. Absorbs HP equal to 20% of the damage dealt to the opponent. Small probability of a Crit Strike.' },
                { key: 'colour-fight', name: '(Improved) Colour Fight', icon: '../assets/icons/pa_a_wildshooter_g1.png', cooldown: '16s', description: 'Deals 2444 physical damage. Multicast 4 times.' },
                { key: 'time-bomb', name: '(Improved) Time Bomb', icon: '../assets/icons/pa_a_screwpierce_g1.png', cooldown: '21s', description: 'Hits the target after 2s. Deals 11550 magic damage. Stunned for 2s.' },
                { key: 'colourful-rain', name: '(Improved) Colourful Rain', icon: '../assets/icons/pa_a_paintshower2_g1.png', cooldown: '18s', description: 'Removes one altered state from you. Increases Movememt Speed, Flight Speed by 60 for 10s. 1 magical debuff is removed from the target every 3 seconds.' },
                { key: 'colour-of-silence', name: '(Improved) Colour of Silence', icon: '../assets/icons/pa_a_ballooned_g1.png', cooldown: '21s', description: 'Deals 1309 physical damage. Silences the target for 4s.' },
                { key: 'glaze-coating', name: '(Improved) Glaze Coating', icon: '../assets/icons/pa_a_rapidhardening_g1.png', cooldown: '18s', description: 'You evade 1 physical attacks and 3 magic attacks for 3s.' },
                { key: 'healing-seal', name: '(Improved) Healing Seal', icon: '../assets/icons/pa_a_repressedcure_g1.png', cooldown: '18s', description: 'Increases the casting time for healing skills by 100% for 6s. Reduces Healing Boost by 300.' }
            ],
            blue: [
                { key: 'work-destruction', name: '(Improved) Work Destruction', icon: '../assets/icons/pa_a_paintburst_g1.png', cooldown: '42s', description: 'Deals 2011 physical damage. Deals high additional damage and knocks the target back for 4s if it is petrified. Small probability of a crit strike.' },
                { key: 'flash-portrait', name: '(Improved) Flash Portrait', icon: '../assets/icons/pa_a_drawingthunder_g1.png', cooldown: '1m3s', description: 'Deals 2200 physical damage. Deals physical damage to the target every 3 for 12s. Temporarily stuns the target.' },
                { key: 'colour-outbreak', name: '(Improved) Colour Outbreak', icon: '../assets/icons/pa_a_paintfountain_g1.png', cooldown: '48s', description: 'Deals 2682 physical damage. Aether\'s Hold binds the target.' },
                { key: 'into-the-black', name: '(Improved) Into the Black', icon: '../assets/icons/pa_a_targetselecting_g1.png', cooldown: '43s', description: 'Increases damage dealt to the target by 30% for 30 seconds.' },
                { key: 'new-work', name: '(Improved) New Work', icon: '../assets/icons/pa_a_chargingplaster_1_g1.png', cooldown: '37s', castTime: '1.1s', description: 'Petrifies the target for 2/4/7s. Increases the petrified target\'s physical and magic defence.' },
                { key: 'viscous-colour', name: '(Improved) Viscous Colour', icon: '../assets/icons/pa_a_paintpuddle_g1.png', cooldown: '24s', description: 'Deals 2416 physical damage. Reduces the target\'s Movement Speed by for 6s. Immobilises the target after 6s.' }
            ],
            gold: [
                { key: 'colour-fist', name: '(Improved) Colour Fist', icon: '../assets/icons/pa_a_hugehammer_g1.png', cooldown: '21s', description: 'Deals 7666 physical damage. Small probability of a crit strike.' },
                { key: 'imprisonment', name: '(Improved) Imprisonment', icon: '../assets/icons/pa_a_plastershooter_g1.png', cooldown: '36s', castTime: '0.5s', description: 'The target is petrified while the skill is active. Increases the petrified target\'s physical and magic defence.' }
            ],
            vision: [
                { key: 'color-monster', name: '(Improved) Color Monster', icon: '../assets/icons/pa_a_rushofslime_1_g1.png', cooldown: '42s', castTime: '1.1s', description: 'Deals 2552/5265/14918 physical damage. Small probability of a crit strike.' },
                { key: 'portrait-of-gravity', name: '(Improved) Portrait of Gravity', icon: '../assets/icons/pa_a_light_drawingblackhole_g1.png', cooldown: '1m3s', description: 'Deals 4760 physical damage. Drags the target and nearby opponents to a selected position. Reduces movement speed for 7s. Deals 4760 additional damage every second for 12s.' },
                { key: 'flash-band', name: '(Improved) Flash Band', icon: '../assets/icons/pa_a_light_electricpaint_g1.png', cooldown: '42s', castTime: '0.7s', description: 'While the skill is active, colour will be sprayed continuously. Deals 10440 damage every second for 7s. Has a chance of stunning the target temporarily' }
            ]
        },
        resolveVision: function(build) {
            if (!build) return 'flash-band';

            var gold = build.gold[0];
            var blue = (build.blue || []).filter(Boolean);
            var has = function(key) { return blue.indexOf(key) !== -1; };

            if (gold === 'colour-fist') {
                if ((has('colour-outbreak') && has('flash-portrait')) ||
                    (has('colour-outbreak') && has('work-destruction')) ||
                    (has('flash-portrait') && has('work-destruction'))) {
                    return 'color-monster';
                }
            }

            if (gold === 'imprisonment') {
                if ((has('viscous-colour') && has('new-work')) ||
                    (has('viscous-colour') && has('into-the-black')) ||
                    (has('new-work') && has('into-the-black'))) {
                    return 'portrait-of-gravity';
                }
            }

            return 'flash-band';
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