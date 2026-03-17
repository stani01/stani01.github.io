'use strict';


// DAEVANION_SKILLS: Each skill has id, stats, and icon
const DAEVANION_SKILLS = {
    "gladiator": {
        81: [
            { id: "Increased parry", stats: {parry: 2300}, icon: "../assets/icons/p_statparry_g1.png" },
            { id: "Increased physical defence", stats: {physicalDef: 230}, icon: "../assets/icons/p_statphydef_g1.png" },
            { id: "Max. HP Boost I", stats: {hp: 3000}, icon: "../assets/icons/p_statmaxhp1_g1.png" }
        ],
        82: [
            { id: "Increased accuracy", stats: {accuracy:1200}, icon: "../assets/icons/p_statacc_g1.png" },
            { id: "Increased physical crit hit", stats: {crit: 1000}, icon: "../assets/icons/p_statcrit_g1.png" },
            { id: "Increased physical attack", stats: {attack: 220}, icon: "../assets/icons/p_statphyatk_g1.png" }
        ],
        83: [
            { id: "Increased magical defence", stats: {magicalDef: 230}, icon: "../assets/icons/p_statmagdef_g1.png" },
            { id: "Max. HP Boost II", stats: {hp: 3000 }, icon: "../assets/icons/p_statmaxhp1_g1.png" },
            { id: "Increased weapon attack", stats: {weaponAttack: 1200 }, icon: "../assets/icons/cbt_fi_seraphicpower_g1.png" }
        ],
        84: [
            { id: "Enhanced Fury Absorption", stats: {}, icon: "../assets/icons/live_fi_seismicdrain_g1.png" },
            { id: "Enhanced Unwavering Devotion", stats: {}, icon: "../assets/icons/cbt_wa_steadiness_g1.png" },
            { id: "Enhanced Second Wind", stats: {}, icon: "../assets/icons/live_fi_survivorstance_g1.png" }
        ],
        85: [
            { id: "Increased max. DP", stats: {dp: 2000}, icon: "../assets/icons/p_statmaxdp_g1.png" },
            { id: "DP recovery: parry", stats: {}, icon: "../assets/icons/p_successparry_g1.png" },
            { id: "DP recovery: crit hit", stats: {}, icon: "../assets/icons/ap_proc_criticalbuff_phy_g1.png" }
        ]
    },
    "templar": {
        81: [
            { id: "Increased block", stats: {block: 2300}, icon: "../assets/icons/p_statblock_g1.png" },
            { id: "Increased resist magic", stats: {magicResist: 800}, icon: "../assets/icons/p_statresist_g1.png" },
            { id: "Max. HP Boost I", stats: {hp: 3000}, icon: "../assets/icons/p_statmaxhp1_g1.png" }
        ],
        82: [
            { id: "Increased accuracy", stats: {accuracy: 1200}, icon: "../assets/icons/p_statacc_g1.png" },
            { id: "Increased physical crit hit", stats: {crit: 1000}, icon: "../assets/icons/p_statcrit_g1.png" },
            { id: "Increased physical attack", stats: {attack: 220}, icon: "../assets/icons/p_statphyatk_g1.png" }
        ],
        83: [
            { id: "Increased physical defence", stats: {physicalDef: 230}, icon: "../assets/icons/p_statphydef_g1.png" },
            { id: "Increased magical defence", stats: {magicalDef: 230}, icon: "../assets/icons/p_statmagdef_g1.png" },
            { id: "Increased weapon attack", stats: {weaponAttack: 1200 }, icon: "../assets/icons/cbt_fi_seraphicpower_g1.png" }
        ],
        84: [
            { id: "Enhanced Swift Divine Grasp", stats: {}, icon: "../assets/icons/live_kn_triplesnacher_g1.png" },
            { id: "Enhanced Unwavering Devotion", stats: {}, icon: "../assets/icons/cbt_wa_steadiness_g1.png" },
            { id: "Enhanced Bloodthirster Strike", stats: {}, icon: "../assets/icons/cbt_kn_avengingblade_g1.png" }
        ],
        85: [
            { id: "Increased max. DP", stats: {dp: 2000}, icon: "../assets/icons/p_statmaxdp_g1.png" },
            { id: "DP recovery: block", stats: {}, icon: "../assets/icons/p_successblock_g1.png" },
            { id: "DP recovery: resist", stats: {}, icon: "../assets/icons/p_successresist_g1.png" }
        ]
    },
    "assassin": {
        81: [
            { id: "Increased evasion", stats: {evasion: 800}, icon: "../assets/icons/p_statdodge_g1.png" },
            { id: "Increased physical defence", stats: {physicalDef: 230}, icon: "../assets/icons/p_statphydef_g1.png" },
            { id: "Increased magical defence", stats: {magicalDef: 230}, icon: "../assets/icons/p_statmagdef_g1.png" }
        ],
        82: [
            { id: "Increased accuracy", stats: {accuracy: 1200}, icon: "../assets/icons/p_statacc_g1.png" },
            { id: "Increased physical crit hit", stats: {crit: 1000}, icon: "../assets/icons/p_statcrit_g1.png" },
            { id: "Increased physical attack", stats: {attack: 220}, icon: "../assets/icons/p_statphyatk_g1.png" }
        ],
        83: [
            { id: "Increased weapon attack", stats: {weaponAttack: 1200 }, icon: "../assets/icons/cbt_fi_seraphicpower_g1.png" },
            { id: "Max. HP Boost I", stats: {hp: 3000}, icon: "../assets/icons/p_statmaxhp1_g1.png" },
            { id: "Increased resist magic", stats: {magicResist: 800}, icon: "../assets/icons/p_statresist_g1.png" }
        ],
        84: [
            { id: "Enhanced Stealth Mode II", stats: {}, icon: "../assets/icons/cbt_sc_hide_g1.png" },
            { id: "Enhanced Blinding Burst", stats: {}, icon: "../assets/icons/cbt_as_blindingburst_g1.png" },
            { id: "Enhanced Dash Attack", stats: {}, icon: "../assets/icons/cbt_as_dashattack_g1.png" }
        ],
        85: [
            { id: "Increased max. DP", stats: {dp: 2000}, icon: "../assets/icons/p_statmaxdp_g1.png" },
            { id: "DP recovery: standard attack", stats: {}, icon: "../assets/icons/cbt_p_statboostphysicaloffense_g1.png" },
            { id: "DP recovery: crit hit", stats: {}, icon: "../assets/icons/ap_proc_criticalbuff_phy_g1.png" }
        ]
    },
    "ranger": {
        81: [
            { id: "Increased evasion", stats: {evasion: 800}, icon: "../assets/icons/p_statdodge_g1.png" },
            { id: "Increased physical defence", stats: {physicalDef: 230}, icon: "../assets/icons/p_statphydef_g1.png" },
            { id: "Increased magical defence", stats: {magicalDef: 230}, icon: "../assets/icons/p_statmagdef_g1.png" }
        ],
        82: [
            { id: "Increased accuracy", stats: {accuracy: 1200}, icon: "../assets/icons/p_statacc_g1.png" },
            { id: "Increased physical crit hit", stats: {crit: 1000}, icon: "../assets/icons/p_statcrit_g1.png" },
            { id: "Increased physical attack", stats: {attack: 220}, icon: "../assets/icons/p_statphyatk_g1.png" }
        ],
        83: [
            { id: "Increased weapon attack", stats: {weaponAttack: 1200 }, icon: "../assets/icons/cbt_fi_seraphicpower_g1.png" },
            { id: "Max. HP Boost I", stats: {hp: 3000}, icon: "../assets/icons/p_statmaxhp1_g1.png" },
            { id: "Increased resist magic", stats: {magicResist: 800}, icon: "../assets/icons/p_statresist_g1.png" }
        ],
        84: [
            { id: "Enhanced Stealth Mode I", stats: {}, icon: "../assets/icons/cbt_sc_hide_g1.png" },
            { id: "Enhanced Spiral Arrow", stats: {}, icon: "../assets/icons/cbt_ra_spiralarrow_g1.png" },
            { id: "Enhanced Nature's Blessing", stats: {}, icon: "../assets/icons/cbt_ra_breathofnature_g1.png" }
        ],
        85: [
            { id: "Increased max. DP", stats: {dp: 2000}, icon: "../assets/icons/p_statmaxdp_g1.png" },
            { id: "DP recovery: evasion", stats: {}, icon: "../assets/icons/p_successdodge_g1.png" },
            { id: "DP recovery: crit hit", stats: {}, icon: "../assets/icons/ap_proc_criticalbuff_phy_g1.png" }
        ]
    },
    "sorcerer": {
        81: [
            { id: "Increased resist magic", stats: {magicResist: 800}, icon: "../assets/icons/p_statresist_g1.png" },
            { id: "Increased physical defence", stats: {physicalDef: 230}, icon: "../assets/icons/p_statphydef_g1.png" },
            { id: "Increased magical defence", stats: {magicalDef: 230}, icon: "../assets/icons/p_statmagdef_g1.png" }
        ],
        82: [
            { id: "Increased magical accuracy", stats: {accuracy: 1200}, icon: "../assets/icons/p_statmagacc_g1.png" },
            { id: "Increased magical crit hit", stats: {crit: 1000}, icon: "../assets/icons/p_statcrit_g1.png" },
            { id: "Increased magic attack", stats: {attack: 220}, icon: "../assets/icons/p_statmagatk_g1.png" }
        ],
        83: [
            { id: "Increased concentration", stats: {concentration: 300}, icon: "../assets/icons/p_statconcentrate_g1.png" },
            { id: "Max. HP Boost I", stats: {hp: 3000}, icon: "../assets/icons/p_statmaxhp1_g1.png" },
            { id: "Increased evasion", stats: {evasion: 800}, icon: "../assets/icons/p_statdodge_g1.png" }
        ],
        84: [
            { id: "Enhanced Stone Skin", stats: {}, icon: "../assets/icons/cbt_ma_stoneskin_g1.png" },
            { id: "Enhanced Hell Flame of Wrath", stats: {}, icon: "../assets/icons/wi_magicalflame_g1.png" },
            { id: "Enhanced Graspbreaker", stats: {}, icon: "../assets/icons/live_wi_crystalmirror_g1.png" }
        ],
        85: [
            { id: "Increased max. DP", stats: {dp: 2000}, icon: "../assets/icons/p_statmaxdp_g1.png" },
            { id: "DP recovery: resist magic", stats: {}, icon: "../assets/icons/p_successresist_g1.png" },
            { id: "DP recovery: crit hit", stats: {}, icon: "../assets/icons/ap_proc_criticalbuff_phy_g1.png" }
        ]
    },
    "spiritmaster": {
        81: [
            { id: "Increased resist magic", stats: {magicResist: 800}, icon: "../assets/icons/p_statresist_g1.png" },
            { id: "Increased physical defence", stats: {physicalDef: 230}, icon: "../assets/icons/p_statphydef_g1.png" },
            { id: "Increased magical defence", stats: {magicalDef: 230}, icon: "../assets/icons/p_statmagdef_g1.png" }
        ],
        82: [
            { id: "Increased magical accuracy", stats: {accuracy: 1200}, icon: "../assets/icons/p_statmagacc_g1.png" },
            { id: "Increased magical crit hit", stats: {crit: 1000}, icon: "../assets/icons/p_statcrit_g1.png" },
            { id: "Increased magic attack", stats: {attack: 220}, icon: "../assets/icons/p_statmagatk_g1.png" }
        ],
        83: [
            { id: "Increased concentration", stats: {concentration: 300}, icon: "../assets/icons/p_statconcentrate_g1.png" },
            { id: "Max. HP Boost I", stats: {hp: 3000}, icon: "../assets/icons/p_statmaxhp1_g1.png" },
            { id: "Increased evasion", stats: {evasion: 800}, icon: "../assets/icons/p_statdodge_g1.png" }
        ],
        84: [
            { id: "Enhanced Stone Skin", stats: {}, icon: "../assets/icons/cbt_ma_stoneskin_g1.png" },
            { id: "Enhanced Ignite Aether", stats: {}, icon: "../assets/icons/cbt_el_enchantmentburst_g1.png" },
            { id: "Enhanced Major Erosion", stats: {}, icon: "../assets/icons/cbt_el_areacage_g1.png" }
        ],
        85: [
            { id: "Increased max. DP", stats: {dp: 2000}, icon: "../assets/icons/p_statmaxdp_g1.png" },
            { id: "DP recovery: resist magic", stats: {}, icon: "../assets/icons/p_successresist_g1.png" },
            { id: "DP recovery: crit hit", stats: {}, icon: "../assets/icons/ap_proc_criticalbuff_phy_g1.png" }
        ]
    },
    "cleric": {
        81: [
            { id: "Increased block", stats: {block: 2300}, icon: "../assets/icons/p_statblock_g1.png" },
            { id: "Increased resist magic", stats: {magicResist: 800}, icon: "../assets/icons/p_statresist_g1.png" },
            { id: "Increased magical accuracy", stats: {accuracy: 1200}, icon: "../assets/icons/p_statmagacc_g1.png" }
        ],
        82: [
            { id: "Increased physical defence", stats: {physicalDef: 230}, icon: "../assets/icons/p_statphydef_g1.png" },
            { id: "Increased magical defence", stats: {magicalDef: 230}, icon: "../assets/icons/p_statmagdef_g1.png" },
            { id: "Healing Boost", stats: {healingBoost: 120}, icon: "../assets/icons/p_statheal_g1.png" }
        ],
        83: [
            { id: "Increased concentration", stats: {concentration: 300}, icon: "../assets/icons/p_statconcentrate_g1.png" },
            { id: "Max. HP Boost I", stats: {hp: 3000}, icon: "../assets/icons/p_statmaxhp1_g1.png" },
            { id: "Increased magic attack", stats: {attackL: 220}, icon: "../assets/icons/p_statmagatk_g1.png" }
        ],
        84: [
            { id: "Enhanced Healing Grace", stats: {}, icon: "../assets/icons/cbt_pr_greatheal_g1.png" },
            { id: "Enhanced Power Smash Strike", stats: {}, icon: "../assets/icons/pr_holyexplosion_g1.png" },
            { id: "Enhanced Amplification", stats: {}, icon: "../assets/icons/live_pr_prepareholywar_g1.png" }
        ],
        85: [
            { id: "Increased max. DP", stats: {dp: 2000}, icon: "../assets/icons/p_statmaxdp_g1.png" },
            { id: "DP recovery: block", stats: {}, icon: "../assets/icons/p_successblock_g1.png" },
            { id: "DP recovery: resist", stats: {}, icon: "../assets/icons/p_successresist_g1.png" }
        ]
    },
    "chanter": {
        81: [
            { id: "Increased parry", stats: {parry: 2300}, icon: "../assets/icons/p_statparry_g1.png" },
            { id: "Increased resist magic", stats: {magicResist: 800}, icon: "../assets/icons/p_statresist_g1.png" },
            { id: "Increased physical crit hit", stats: {crit: 1000}, icon: "../assets/icons/p_statcrit_g1.png" }
        ],
        82: [
            { id: "Increased physical defence", stats: {physicalDef: 230}, icon: "../assets/icons/p_statphydef_g1.png" },
            { id: "Increased magical defence", stats: {magicalDef: 230}, icon: "../assets/icons/p_statmagdef_g1.png" },
            { id: "Increased physical attack", stats: {attack: 220}, icon: "../assets/icons/p_statphyatk_g1.png" }
        ],
        83: [
            { id: "Healing Boost", stats: {healingBoost: 120}, icon: "../assets/icons/p_statheal_g1.png" },
            { id: "Max. HP Boost I", stats: {hp: 3000}, icon: "../assets/icons/cbt_p_statboostmaxhp_g1.png" },
            { id: "Increased weapon attack", stats: {weaponAttack: 1200 }, icon: "../assets/icons/cbt_fi_seraphicpower_g1.png" }
        ],
        84: [
            { id: "Enhanced Vehemence Strike", stats: {}, icon: "../assets/icons/ch_tearingcrash_g1.png" },
            { id: "Enhanced Stamina Restoration", stats: {}, icon: "../assets/icons/live_ch_chakra_g1.png" },
            { id: "Enhanced Divine Curtain", stats: {}, icon: "../assets/icons/live_ch_stigma_angelicwall_g1.png" }
        ],
        85: [
            { id: "Increased max. DP", stats: {dp: 2000}, icon: "../assets/icons/p_statmaxdp_g1.png" },
            { id: "DP recovery: parry", stats: {}, icon: "../assets/icons/p_successparry_g1.png" },
            { id: "DP recovery: resist magic", stats: {}, icon: "../assets/icons/p_successresist_g1.png" }
        ]
    },
    "aethertech": {
        81: [
            { id: "Increased parry", stats: {parry: 2300}, icon: "../assets/icons/p_statparry_g1.png" },
            { id: "Increased resist magic", stats: {magicResist: 800}, icon: "../assets/icons/p_statresist_g1.png" },
            { id: "Max. HP Boost I", stats: {hp: 3000}, icon: "../assets/icons/cbt_p_statboostmaxhp_g1.png" }
        ],
        82: [
            { id: "Increased magical accuracy", stats: {accuracy: 1200}, icon: "../assets/icons/p_statmagacc_g1.png" },
            { id: "Increased magical crit hit", stats: {crit: 1000}, icon: "../assets/icons/p_statcrit_g1.png" },
            { id: "Increased magic attack", stats: {attack: 220}, icon: "../assets/icons/p_statmagatk_g1.png" }
        ],
        83: [
            { id: "Increased physical defence", stats: {physicalDef: 230}, icon: "../assets/icons/p_statphydef_g1.png" },
            { id: "Increased magical defence", stats: {magicalDef: 230}, icon: "../assets/icons/p_statmagdef_g1.png" },
            { id: "Increased concentration", stats: {concentration: 300}, icon: "../assets/icons/p_statconcentrate_g1.png" }
        ],
        84: [
            { id: "Enhanced Light Attack", stats: {}, icon: "../assets/icons/ri_leftjab_g1.png" },
            { id: "Enhanced Sprint Strike", stats: {}, icon: "../assets/icons/ri_chargeattack_g1.png" },
            { id: "Enhanced Cooling Wave", stats: {}, icon: "../assets/icons/ri_forwardattack_g1.png" }
        ],
        85: [
            { id: "Increased max. DP", stats: {dp: 2000}, icon: "../assets/icons/p_statmaxdp_g1.png" },
            { id: "DP recovery: parry", stats: {}, icon: "../assets/icons/p_successparry_g1.png" },
            { id: "DP recovery: resist magic", stats: {}, icon: "../assets/icons/p_successresist_g1.png" }
        ]
    },
    "gunner": {
        81: [
            { id: "Increased evasion", stats: {evasion: 800}, icon: "../assets/icons/p_statdodge_g1.png" },
            { id: "Increased physical defence", stats: {physicalDef: 230}, icon: "../assets/icons/p_statphydef_g1.png" },
            { id: "Increased magical defence", stats: {magicalDef: 230}, icon: "../assets/icons/p_statmagdef_g1.png" }
        ],
        82: [
            { id: "Increased magical accuracy", stats: {accuracy: 1200}, icon: "../assets/icons/p_statmagacc_g1.png" },
            { id: "Increased magical crit hit", stats: {crit: 1000}, icon: "../assets/icons/p_statcrit_g1.png" },
            { id: "Increased magic attack", stats: {attack: 220}, icon: "../assets/icons/p_statmagatk_g1.png" }
        ],
        83: [
            { id: "Increased attack and movement speeds", stats: {attackSpeed: 9, speed: 9}, icon: "../assets/icons/p_statspeed_g1.png" },
            { id: "Max. HP Boost I", stats: {hp: 3000}, icon: "../assets/icons/cbt_p_statboostmaxhp_g1.png" },
            { id: "Increased resist magic", stats: {magicResist: 800}, icon: "../assets/icons/p_statresist_g1.png" }
        ],
        84: [
            { id: "Enhanced Heavy Projectile", stats: {}, icon: "../assets/icons/live_gu_heavyfirechain_g1.png" },
            { id: "Enhanced Aimed Weakpoint Shot", stats: {}, icon: "../assets/icons/live_gu_aimingstrike_g1.png" },
            { id: "Enhanced Retreat Shot", stats: {}, icon: "../assets/icons/live_gu_backsteppingsnipe_g1.png" }
        ],
        85: [
            { id: "Increased max. DP", stats: {dp: 2000}, icon: "../assets/icons/p_statmaxdp_g1.png" },
            { id: "DP recovery: evasion", stats: {}, icon: "../assets/icons/p_successdodge_g1.png" },
            { id: "DP recovery: crit hit", stats: {}, icon: "../assets/icons/ap_proc_criticalbuff_phy_g1.png" }
        ]
    },
    "bard": {
        81: [
            { id: "Increased resist magic", stats: {magicResist: 800}, icon: "../assets/icons/p_statresist_g1.png" },
            { id: "Increased physical defence", stats: {physicalDef: 230}, icon: "../assets/icons/p_statphydef_g1.png" },
            { id: "Increased magical defence", stats: {magicalDef: 230}, icon: "../assets/icons/p_statmagdef_g1.png" }
        ],
        82: [
            { id: "Increased magical accuracy", stats: {accuracy: 1200}, icon: "../assets/icons/p_statmagacc_g1.png" },
            { id: "Increased magical crit hit", stats: {crit: 1000}, icon: "../assets/icons/p_statcrit_g1.png" },
            { id: "Increased magic attack", stats: {attack: 220}, icon: "../assets/icons/p_statmagatk_g1.png" }
        ],
        83: [
            { id: "Healing Boost", stats: {healingBoost: 120}, icon: "../assets/icons/p_statheal_g1.png" },
            { id: "Max. HP Boost I", stats: {hp: 3000}, icon: "../assets/icons/cbt_p_statboostmaxhp_g1.png" },
            { id: "Increased evasion", stats: {evasion: 800}, icon: "../assets/icons/p_statdodge_g1.png" },
        ],
        84: [
            { id: "Enhanced Tsunami Requiem", stats: {}, icon: "../assets/icons/live_ba_songoftidalwave_g1.png" },
            { id: "Enhanced Shield Melody", stats: {}, icon: "../assets/icons/live_ar_songofshield_g1.png" },
            { id: "Enhanced Melody of Purification", stats: {}, icon: "../assets/icons/live_ba_songofpurify_g1.png" }
        ],
        85: [
            { id: "Increased max. DP", stats: {dp: 2000}, icon: "../assets/icons/p_statmaxdp_g1.png" },
            { id: "DP recovery: resist magic", stats: {}, icon: "../assets/icons/p_successresist_g1.png" },
            { id: "DP recovery: crit hit", stats: {}, icon: "../assets/icons/ap_proc_criticalbuff_phy_g1.png" }
        ]
    },
    "painter": {
        81: [
            { id: "Increased evasion", stats: {evasion: 800}, icon: "../assets/icons/p_statdodge_g1.png" },
            { id: "Increased physical defence", stats: {physicalDef: 230}, icon: "../assets/icons/p_statphydef_g1.png" },
            { id: "Increased magical defence", stats: {magicalDef: 230}, icon: "../assets/icons/p_statmagdef_g1.png" }
        ],
        82: [
            { id: "Increased accuracy", stats: {accuracy:1200}, icon: "../assets/icons/p_statacc_g1.png" },
            { id: "Increased physical crit hit", stats: {crit: 1000}, icon: "../assets/icons/p_statcrit_g1.png" },
            { id: "Increased physical attack", stats: {attack: 220}, icon: "../assets/icons/p_statphyatk_g1.png" }
        ],
        83: [
            { id: "Increased attack and movement speeds", stats: {attackSpeed: 9, speed: 9}, icon: "../assets/icons/p_statspeed_g1.png" },
            { id: "Max. HP Boost I", stats: {hp: 3000}, icon: "../assets/icons/cbt_p_statboostmaxhp_g1.png" },
            { id: "Increased resist magic", stats: {magicResist: 800}, icon: "../assets/icons/p_statresist_g1.png" }
        ],
        84: [
            { id: "Durable Powerful Shot", stats: {}, icon: "../assets/icons/pa_drainexplosionpaint_g1.png" },
            { id: "Enhanced Slash", stats: {}, icon: "../assets/icons/pa_paintbeating_g1.png" },
            { id: "Enhanced Retreat", stats: {}, icon: "../assets/icons/pa_dodgeatk_g1.png" }
        ],
        85: [
            { id: "Increased max. DP", stats: {dp: 2000}, icon: "../assets/icons/p_statmaxdp_g1.png" },
            { id: "DP recovery: evasion", stats: {}, icon: "../assets/icons/p_successdodge_g1.png" },
            { id: "DP recovery: crit hit", stats: {}, icon: "../assets/icons/ap_proc_criticalbuff_phy_g1.png" }
        ]
    },
};

// Helper: Find skill object by id for a given class and level
function getDaevanionSkillObj(className, level, skillId) {
    const arr = DAEVANION_SKILLS[className]?.[level] || [];
    return arr.find(skill => skill.id === skillId) || null;
}

// Example trait function: get stats for a selected skill
function getDaevanionSkillStats(className, level, skillId) {
    const skill = getDaevanionSkillObj(className, level, skillId);
    return skill ? skill.stats : {};
}

// State to track selections: traits[setId][level] = index(0-2)
var TRAIT_SELECTIONS_KEY = 'gc-trait-selections-v1';
var traitSelections = loadTraitSelections();

function loadTraitSelections() {
    try {
        var raw = localStorage.getItem(TRAIT_SELECTIONS_KEY);
        if (raw) {
            var parsed = JSON.parse(raw);
            // Ensure all sets in setOrder have trait data
            var ids = (typeof setOrder !== 'undefined') ? setOrder : [1, 2];
            ids.forEach(function(pid) {
                if (!parsed[pid]) parsed[pid] = {};
                [81,82,83,84,85].forEach(function(lvl) {
                    if (typeof parsed[pid][lvl] !== 'number') parsed[pid][lvl] = 0;
                });
            });
            return parsed;
        }
    } catch(e) {}
    // Default: all first column
    var def = {};
    var ids = (typeof setOrder !== 'undefined') ? setOrder : [1, 2];
    ids.forEach(function(pid) {
        def[pid] = {};
        [81,82,83,84,85].forEach(function(lvl) { def[pid][lvl] = 0; });
    });
    return def;
}

function saveTraitSelections() {
    try {
        localStorage.setItem(TRAIT_SELECTIONS_KEY, JSON.stringify(traitSelections));
    } catch(e) {}
}
// Calculate weapon stats for any set + weapon type + enchant level
function getWeaponStats(setKey, weaponType, enchantLevel) {
    var p = getWeaponParts(setKey, weaponType, enchantLevel);
    var s = emptyStats();
    STAT_KEYS.forEach(function(k) { s[k] = p.base[k] + p.bonus[k] + p.enchant[k]; });
    return s;
}

// Split weapon stats into base / bonus / enchant components
// Returns: { baseAtk: number, base: stats, bonus: stats, enchant: stats }
//   base    = stats that count once (highest-base-wins for dual wield)
//   bonus   = inherent weapon bonuses (always transfer, including from fuse)
//   enchant = enchant-level or enchant-like bonuses (transfer for dual wield, NOT for fuse)
//   baseAtk = raw base attack value (used for fuse 10% calculation)
function getWeaponParts(setKey, weaponType, enchantLevel, selectedBonuses, bonusValues) {
    var base = emptyStats(), bonus = emptyStats(), enchant = emptyStats();
    if (setKey === 'none') return { baseAtk: 0, base: base, bonus: bonus, enchant: enchant };
    var is2H = WEAPON_TYPES[weaponType].twoHanded;

    // Fixed-stat sets (spiked, ciclonica-helper, fighting-spirit, vision, salvation)
    var fixed = WEAPON_STATS_FIXED[setKey];
    if (fixed) {
        base.attack      = fixed.baseAtk;
        base.physicalDef = fixed.baseDef;
        base.magicalDef  = fixed.baseDef;
        base.accuracy    = fixed.baseAcc;
        base.parry       = fixed.baseAcc;

        bonus.attack     = fixed.bonusAtk || 0;
        bonus.accuracy   = fixed.bonusAcc || 0;
        bonus.hp         = fixed.enchHp || 0;
        bonus.crit       = fixed.enchCrit || 0;

        // Selectable bonuses (fighting-spirit, salvation)
        if (fixed.bonuses && selectedBonuses) {
            selectedBonuses.forEach(function(bKey) {
                var b = fixed.bonuses.find(function(x) { return x.key === bKey; });
                if (b) {
                    var bv = (bonusValues && typeof bonusValues[bKey] === 'number') ? bonusValues[bKey] : b.value;
                    bonus[b.stat] += bv;
                }
            });
        }

        if (fixed.pvpStat || fixed.pveStat) {
            // Spiked (PvP), Ciclonica/Helper (PvE), Vision (PvE)
            var atkKey = fixed.pvpStat ? 'pvpAttack' : 'pveAttack';
            var defKey = fixed.pvpStat ? 'pvpDefence' : 'pveDefence';
            bonus[atkKey]   = is2H ? fixed.pvpPveAtk2h : fixed.pvpPveAtk1h;
            bonus[defKey]   = is2H ? fixed.pvpPveDef2h : fixed.pvpPveDef1h;
            enchant[atkKey] = is2H ? fixed.enchPvpPveAtk2h : fixed.enchPvpPveAtk1h;
            enchant[defKey] = is2H ? fixed.enchPvpPveDef2h : fixed.enchPvpPveDef1h;
        } else {
            // Fighting Spirit, Salvation: regular attack/def enchant
            enchant.attack      = is2H ? fixed.enchAtk2h : fixed.enchAtk1h;
            enchant.physicalDef = is2H ? fixed.enchDef2h : fixed.enchDef1h;
            enchant.magicalDef  = enchant.physicalDef;
        }

        return { baseAtk: fixed.baseAtk, base: base, bonus: bonus, enchant: enchant };
    }

    // Jorgoth variants (T4 and T3)
    var isT3 = setKey.indexOf('jorgoth-t3-') === 0;
    var vKey = null;
    if (setKey === 'jorgoth-t4-v1' || setKey === 'jorgoth-t3-v1') vKey = 'v1';
    else if (setKey === 'jorgoth-t4-v2' || setKey === 'jorgoth-t3-v2') vKey = 'v2';
    else if (setKey === 'jorgoth-t4-v3' || setKey === 'jorgoth-t3-v3') vKey = 'v3';
    if (vKey && JORGOTH_WEAPONS[weaponType]) {
        var w = JORGOTH_WEAPONS[weaponType][vKey];
        if (w) {
            var je = JORGOTH_ENCHANT;
            // T3: override baseAtk (5200->4700, 2250->2000)
            var effectiveBaseAtk = isT3 ? (w.baseAtk === 2250 ? 2000 : 4700) : w.baseAtk;
            base.attack      = effectiveBaseAtk;
            base.physicalDef = 170;
            base.magicalDef  = 170;
            base.accuracy    = 2568;
            base.parry       = 2568;

            bonus.attack      = w.bonusAtk;
            bonus.physicalDef = w.bonusDef;
            bonus.magicalDef  = w.bonusDef;
            bonus.accuracy    = w.acc;
            bonus.hp          = w.hp;
            bonus.crit        = w.crit;
            bonus.healingBoost = w.healingBoost || 0;

            enchant.attack      = is2H ? je.enchAtk2h : je.enchAtk1h;
            enchant.physicalDef = is2H ? je.enchDef2h : je.enchDef1h;
            enchant.magicalDef  = enchant.physicalDef;
        }
        var retBaseAtk = w ? (isT3 ? (w.baseAtk === 2250 ? 2000 : 4700) : w.baseAtk) : 0;
        return { baseAtk: retBaseAtk, base: base, bonus: bonus, enchant: enchant };
    }

    // Acrimony / Presumption (enchant-level scaling)
    var enchTable = (setKey === 'acrimony') ? ACRI_WEAPON_ENCHANT : (setKey === 'presumption') ? PRES_WEAPON_ENCHANT : null;
    if (enchTable) {
        var ench = enchTable[enchantLevel] || enchTable[8];
        base.attack      = EXTREME_WEAPON_BASE.baseAtk;
        base.physicalDef = EXTREME_WEAPON_BASE.baseDef;
        base.magicalDef  = EXTREME_WEAPON_BASE.baseDef;
        base.accuracy    = EXTREME_WEAPON_BASE.baseAcc;
        base.parry       = EXTREME_WEAPON_BASE.baseAcc;

        bonus.attack     = EXTREME_WEAPON_BASE.bonusAtk;
        // Base bonus defence (same pattern as armor: acrimony +10, presumption +20)
        if (setKey === 'acrimony') {
            bonus.physicalDef = 10;
            bonus.magicalDef  = 10;
            bonus.hp = 20;
            bonus.crit = 20;
        } else {
            bonus.physicalDef = 20;
            bonus.magicalDef  = 20;
            bonus.hp = 20;
        }

        enchant.attack      = ench.attack;
        enchant.physicalDef = ench.def;
        enchant.magicalDef  = ench.def;
        enchant.hp          = ench.hp;
        enchant.crit        = ench.crit;

        return { baseAtk: EXTREME_WEAPON_BASE.baseAtk, base: base, bonus: bonus, enchant: enchant };
    }

    return { baseAtk: 0, base: base, bonus: bonus, enchant: enchant };
}
