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
                    description: 'For 20s, reflects 678 damage back to an opponent within 5m that attacks you.',
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
                    description: 'Taunts an enemy to increase their enmity towards you. Increases the additional PvE def by 1500. If the target is a player, their Enmity will probably be directed at you.',
                },
                {
                    key: 'elimination-strike',
                    name: '(Improved) Elimination Strike',
                    icon: '../assets/icons/kn_a_executionalstrike_g1.png',
                    cooldown: '42s',
                    description: 'Deals 3022 physical damage.',
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
                    description: 'Deals 417 physical damage. Deals 33750 additional damage if the target is a castle gate.',
                    combat: { type: 'attack', damage: 417, cooldownSec: 8.4, executeTimeSec: 1, priority: 34 }
                }
            ],
            blue: [
                {
                    key: 'prayer-of-resilience',
                    name: '(Improved) Prayer of Resilience',
                    icon: '../assets/icons/live_kn_a_recover_g1.png',
                    cooldown: '48s',
                    description: 'Restores 8775 HP',
                },
                {
                    key: 'prayer-of-victory',
                    name: '(Improved) Prayer of Victory',
                    icon: '../assets/icons/live_kn_a_sentinel_a_g1.png',
                    cooldown: '1m12s',
                    description: 'Increases HP by 3510 for 2m. Increases add pvp def and pve def by 300.',
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
                    description: 'You block 12 times for 20s.',
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
                    description: 'Reduces your damage by 80% for 15s. Drastically reduces your movement speed. Grants up to 50000 protection.',
                    combat: { type: 'attack', damage: 2146, hits: 3, cooldownSec: 63, executeTimeSec: 1, priority: 14 }
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