'use strict';

// ═══════════════════════════════════════════════════════════════════════════════
// SHARE v2  —  JSON-based share encoding (replaces legacy positional encoding)
//
// Format:  #s=2.<base64-encoded-JSON>
//
// The JSON payload holds every piece of state that affects calculations.
// Benefits:
//   - No positional alignment — fields are keyed, not offset-dependent
//   - Self-describing — new fields are simply added to the object
//   - Easy to debug — decode the base64 to inspect the shared state
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Lookup tables (append-only – order must NEVER change) ─────────────────
var SH_CLASSES     = ['gladiator','templar','assassin','ranger','sorcerer','spiritmaster','cleric','chanter','aethertech','gunner','bard','painter'];
var SH_WTYPES      = ['dagger','sword','mace','revolver','greatsword','polearm','bow','staff','paintRings','orb','spellbook','aetherKey','cannon','harp'];
var SH_OHTYPES     = ['none','shield','fuse','weapon'];
var SH_SHIELDSETS  = ['spiked-ciclonica','fighting-spirit','salvation','spiked','ciclonica'];
var SH_SHIELDTYPES = ['battle','scale'];
var SH_SHIELDVARS  = ['pvp','pve'];
var SH_ACCSETS     = ['aeon-guardian','burning-altar','starshine'];
var SH_ATYPES      = ARMOR_TYPE_OPTIONS.map(function(o) { return o.key; });
var SH_ASETS       = ['fighting-spirit','acrimony','presumption'];
var SH_WSETS       = ['spiked-helper','salvation','fighting-spirit','jorgoth-t4-v1','jorgoth-t4-v2','jorgoth-t4-v3','jorgoth-t3-v1','jorgoth-t3-v2','jorgoth-t3-v3','acrimony','presumption','vision','spiked','ciclonica-helper'];
var SH_OATHS       = ['none','silent-skill','legendary-1','legendary-2','legendary-3','ultimate-1','ultimate-2','ultimate-3'];
var SH_MANAS       = ['none','attack','crit','accuracy','hp','evasion','healBoost','pdef','mdef','magicResist','block','parry'];
var SH_ASLOTS      = ['helmet','shoulders','chest','pants','gloves','boots'];
var SH_GEARKEYS    = SH_ASLOTS.concat(['mainWeapon','offHand']);
var SH_TRANSFORMS  = TRANSFORM_KEYS;
var SH_MINIONS     = MINIONS.map(function(m) { return m.key; });
var SH_GLYPH_BONUSES = ACC_BONUSES_GLYPH.map(function(b) { return b.key; });

// ─── Helpers ───────────────────────────────────────────────────────────────
function idx(arr, v)    { var i = arr.indexOf(v); return i >= 0 ? i : 0; }
function val(arr, i)    { return (i >= 0 && i < arr.length) ? arr[i] : arr[0]; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

function toBitmask(selected, refList) {
    var mask = 0;
    if (!selected) return mask;
    selected.forEach(function(k) {
        var i = refList.findIndex(function(r) { return (typeof r === 'string' ? r : r.key) === k; });
        if (i >= 0) mask |= (1 << i);
    });
    return mask;
}

function fromBitmask(mask, refList, maxPicks) {
    var out = [];
    for (var i = 0; i < refList.length && out.length < maxPicks; i++) {
        if (mask & (1 << i)) {
            var entry = refList[i];
            out.push(typeof entry === 'string' ? entry : entry.key);
        }
    }
    return out;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENCODE  — produces  "2.<base64>"
// ═══════════════════════════════════════════════════════════════════════════════
function encodeShareString() {
    var obj = {
        v: 2,
        cl: idx(SH_CLASSES, selectedClass),
        mt: idx(SH_WTYPES, weaponConfig.mainType),
        ot: idx(SH_OHTYPES, weaponConfig.offHandType),
        ow: idx(SH_WTYPES, weaponConfig.offHandWeaponType),
        p: {}
    };

    [1, 2].forEach(function(id) {
        var p = state[id];
        var pr = {};

        // ── Armor ──────────────────────────────────────────────────────────
        pr.at = idx(SH_ATYPES, p.armorType);
        pr.ar = [];
        SH_ASLOTS.forEach(function(sk) {
            var a = p.armor[sk];
            var isHigh = (sk === 'helmet' || sk === 'chest' || sk === 'pants');
            var bonusList = isHigh ? FS_BONUSES_HIGH : FS_BONUSES_LOW;
            pr.ar.push([
                idx(SH_ASETS, a.set),
                typeof a.enchant === 'number' ? a.enchant : 0,
                toBitmask(a.bonuses, bonusList)
            ]);
        });

        // ── Main weapon ────────────────────────────────────────────────────
        pr.mw = [
            idx(SH_WSETS, p.mainWeapon.set),
            p.mainWeapon.enchant || 9,
            toBitmask(p.mainWeapon.bonuses, (WEAPON_STATS_FIXED[p.mainWeapon.set] || {}).bonuses || [])
        ];

        // ── Off-hand ───────────────────────────────────────────────────────
        pr.oh = [
            idx(SH_WSETS, p.offHand.set),
            p.offHand.enchant || 9,
            toBitmask(p.offHand.bonuses, (WEAPON_STATS_FIXED[p.offHand.set] || {}).bonuses || [])
        ];

        // ── Shield ─────────────────────────────────────────────────────────
        var sh = p.shield;
        var shData = SHIELD_STATS[sh.set];
        var shTypeKey = sh.type === 'scale' ? 'scale' : 'battle';
        var shBonusList = shData ? shData.bonuses[shTypeKey] : [];
        pr.sh = [
            idx(SH_SHIELDSETS, sh.set),
            idx(SH_SHIELDTYPES, sh.type),
            toBitmask(sh.bonuses, shBonusList)
        ];

        // ── Oaths (6 slots) ───────────────────────────────────────────────
        pr.oa = [];
        SH_ASLOTS.forEach(function(sk) {
            pr.oa.push(idx(SH_OATHS, p.oath[sk]));
        });

        // ── Manastones (all gear + accessories = 17 slots) ────────────────
        pr.ms = {};
        var allManaKeys = SH_GEARKEYS.concat(ALL_ACCESSORY_KEYS);
        allManaKeys.forEach(function(gk) {
            var arr = p.manastones[gk] || [];
            var encoded = [];
            for (var i = 0; i < 3; i++) {
                encoded.push(idx(SH_MANAS, arr[i] || 'none'));
            }
            pr.ms[gk] = encoded;
        });

        // ── Transform ──────────────────────────────────────────────────────
        pr.tf = idx(SH_TRANSFORMS, p.transform || 'none');
        pr.te = typeof p.transformEnchant === 'number' ? p.transformEnchant : 0;

        // ── Accessories (9 slots) ──────────────────────────────────────────
        pr.ac = {};
        ALL_ACCESSORY_KEYS.forEach(function(accKey) {
            var acc = p.accessories[accKey];
            var statsType = ACC_STATS_TYPE[accKey];
            var setData = ACCESSORY_STATS[acc.set];
            var slotData = setData ? setData[statsType] : null;
            var bonusList = (slotData && slotData.bonuses) ? slotData.bonuses : [];
            pr.ac[accKey] = [
                idx(SH_ACCSETS, acc.set),
                toBitmask(acc.bonuses, bonusList)
            ];
        });

        // ── Minions ────────────────────────────────────────────────────────
        pr.mi = [
            idx(SH_MINIONS, (p.minions && p.minions.main) || 'crit-sita'),
            idx(SH_MINIONS, (p.minions && p.minions.secondary) || 'crit-sita')
        ];

        // ── Glyph ──────────────────────────────────────────────────────────
        var glyph = p.glyph || {};
        var gExtra = glyph.extra || { attack: 0, physicalDef: 0, magicalDef: 0 };
        pr.gl = [
            idx(SH_GLYPH_BONUSES, (glyph.bonuses && glyph.bonuses[0]) || 'attack'),
            clamp(gExtra.attack || 0, 0, 250),
            clamp(gExtra.physicalDef || 0, 0, 250),
            clamp(gExtra.magicalDef || 0, 0, 250)
        ];

        // ── TF Collections (boolean array) ─────────────────────────────────
        var tfToggled = (p.collections && p.collections.tfToggled) || {};
        pr.tc = [];
        for (var i = 0; i < TF_COLLECTIONS.length; i++) {
            pr.tc.push(tfToggled[TF_COLLECTIONS[i].key] ? 1 : 0);
        }

        // ── Item Collections ───────────────────────────────────────────────
        var itemColl = (p.collections && p.collections.itemColl) || {};
        pr.ic = {};
        ITEM_COLL_STATS.forEach(function(cs) {
            pr.ic[cs.key] = clamp(parseInt(itemColl[cs.key]) || 0, 0, cs.max);
        });

        // ── Collection Levels ──────────────────────────────────────────────
        var cl = p.collLevels || { normal: 6, large: 6, powerful: 6 };
        pr.lv = [
            clamp(cl.normal   || 0, 0, 10),
            clamp(cl.large    || 0, 0, 10),
            clamp(cl.powerful || 0, 0, 10)
        ];

        // ── Relic ──────────────────────────────────────────────────────────
        pr.rl = (p.relic && p.relic.level) ? clamp(p.relic.level, 1, 300) : 300;

        // ── Trait selections ───────────────────────────────────────────────
        var ts = (typeof traitSelections !== 'undefined' && traitSelections[id]) || {};
        pr.tr = [
            clamp(ts[81] || 0, 0, 2),
            clamp(ts[82] || 0, 0, 2),
            clamp(ts[83] || 0, 0, 2),
            clamp(ts[84] || 0, 0, 2),
            clamp(ts[85] || 0, 0, 2)
        ];

        obj.p[id] = pr;
    });

    var json = JSON.stringify(obj);
    return '2.' + btoa(unescape(encodeURIComponent(json)));
}

// ═══════════════════════════════════════════════════════════════════════════════
// DECODE  — dispatches to v2 JSON or legacy positional
// ═══════════════════════════════════════════════════════════════════════════════
function decodeShareString(s) {
    if (!s || s.length < 3) return false;

    // New JSON format: "2.<base64>"
    if (s.charAt(0) === '2' && s.charAt(1) === '.') {
        return decodeShareV2(s.substring(2));
    }

    // Legacy positional format (version chars '2'..'d')
    return decodeShareLegacy(s);
}

// ─── V2 JSON decode ────────────────────────────────────────────────────────
function decodeShareV2(b64) {
    try {
        var json = decodeURIComponent(escape(atob(b64)));
        var obj = JSON.parse(json);
    } catch (e) { return false; }

    if (!obj || obj.v !== 2) return false;

    var cls = val(SH_CLASSES, obj.cl);
    if (!CLASS_DATA[cls]) return false;
    selectedClass = cls;

    // Weapon config
    weaponConfig = createDefaultWeaponConfig(cls);
    var mt = val(SH_WTYPES, obj.mt);
    if (CLASS_DATA[cls].weapons.indexOf(mt) !== -1) weaponConfig.mainType = mt;
    weaponConfig.offHandType = val(SH_OHTYPES, obj.ot);
    weaponConfig.offHandWeaponType = val(SH_WTYPES, obj.ow);

    var allowed = getAllowedOffHand(weaponConfig.mainType, cls);
    if (allowed.indexOf(weaponConfig.offHandType) === -1) {
        weaponConfig.offHandType = getDefaultOffHand(weaponConfig.mainType, cls);
    }

    [1, 2].forEach(function(id) {
        var pr = obj.p && obj.p[id];
        var p = createDefaultProfile(cls);

        if (!pr) { state[id] = p; return; }

        // ── Armor ──
        var at = val(SH_ATYPES, pr.at);
        if (CLASS_DATA[cls].armorTypes.indexOf(at) !== -1) p.armorType = at;

        if (pr.ar && pr.ar.length === 6) {
            SH_ASLOTS.forEach(function(sk, i) {
                var d = pr.ar[i];
                if (!d) return;
                var aset = val(SH_ASETS, d[0]);
                if (ARMOR_SET_KEYS.indexOf(aset) !== -1) p.armor[sk].set = aset;
                if (typeof d[1] === 'number' && d[1] >= 8 && d[1] <= 15) p.armor[sk].enchant = d[1];
                var isHigh = (sk === 'helmet' || sk === 'chest' || sk === 'pants');
                var bonusList = isHigh ? FS_BONUSES_HIGH : FS_BONUSES_LOW;
                if (typeof d[2] === 'number' && d[2] > 0) {
                    p.armor[sk].bonuses = fromBitmask(d[2], bonusList, 4);
                }
            });
        }

        // ── Main weapon ──
        if (pr.mw) {
            var mwSet = val(SH_WSETS, pr.mw[0]);
            if (WEAPON_SET_KEYS.indexOf(mwSet) !== -1 && MAINHAND_EXCLUDED_SETS.indexOf(mwSet) === -1) p.mainWeapon.set = mwSet;
            if (typeof pr.mw[1] === 'number' && pr.mw[1] >= 8 && pr.mw[1] <= 15) p.mainWeapon.enchant = pr.mw[1];
            var mwFixed = WEAPON_STATS_FIXED[p.mainWeapon.set];
            if (mwFixed && mwFixed.bonuses && typeof pr.mw[2] === 'number') {
                p.mainWeapon.bonuses = fromBitmask(pr.mw[2], mwFixed.bonuses, mwFixed.maxBonuses);
            }
        }

        // ── Off-hand ──
        if (pr.oh) {
            var ohSet = val(SH_WSETS, pr.oh[0]);
            if (WEAPON_SET_KEYS.indexOf(ohSet) !== -1 && OFFHAND_EXCLUDED_SETS.indexOf(ohSet) === -1) p.offHand.set = ohSet;
            if (typeof pr.oh[1] === 'number' && pr.oh[1] >= 8 && pr.oh[1] <= 15) p.offHand.enchant = pr.oh[1];
            var ohFixed = WEAPON_STATS_FIXED[p.offHand.set];
            if (ohFixed && ohFixed.bonuses && typeof pr.oh[2] === 'number') {
                p.offHand.bonuses = fromBitmask(pr.oh[2], ohFixed.bonuses, ohFixed.maxBonuses);
            }
        }

        // ── Shield ──
        if (pr.sh) {
            var shSet = val(SH_SHIELDSETS, pr.sh[0]);
            var shType = val(SH_SHIELDTYPES, pr.sh[1]);
            if (shSet === 'spiked-ciclonica') shSet = 'spiked';
            if (SHIELD_SET_KEYS.indexOf(shSet) !== -1) p.shield.set = shSet;
            if (shType === 'battle' || shType === 'scale') p.shield.type = shType;
            var shData = SHIELD_STATS[p.shield.set];
            var typeKey = p.shield.type === 'scale' ? 'scale' : 'battle';
            var shBonusList = shData ? shData.bonuses[typeKey] : [];
            var maxB = shData ? shData.maxBonuses : 0;
            if (typeof pr.sh[2] === 'number') {
                p.shield.bonuses = fromBitmask(pr.sh[2], shBonusList, maxB);
            }
        }

        // ── Oaths ──
        if (pr.oa && pr.oa.length === 6) {
            SH_ASLOTS.forEach(function(sk, i) {
                var o = val(SH_OATHS, pr.oa[i]);
                if (SH_OATHS.indexOf(o) !== -1) p.oath[sk] = o;
            });
        }

        // ── Manastones ──
        if (pr.ms) {
            var allManaKeys = SH_GEARKEYS.concat(ALL_ACCESSORY_KEYS);
            allManaKeys.forEach(function(gk) {
                var arr = pr.ms[gk];
                if (!arr) return;
                if (!p.manastones[gk]) p.manastones[gk] = ['none','none','none'];
                for (var i = 0; i < 3; i++) {
                    p.manastones[gk][i] = val(SH_MANAS, arr[i]);
                }
            });
        }

        // ── Transform ──
        var tf = val(SH_TRANSFORMS, pr.tf);
        if (TRANSFORM_KEYS.indexOf(tf) !== -1) p.transform = tf;
        if (typeof pr.te === 'number') p.transformEnchant = clamp(pr.te, 0, 20);

        // ── Accessories ──
        if (pr.ac) {
            ALL_ACCESSORY_KEYS.forEach(function(accKey) {
                var d = pr.ac[accKey];
                if (!d) return;
                var accSet = val(SH_ACCSETS, d[0]);
                if (ACCESSORY_SET_KEYS.indexOf(accSet) !== -1) p.accessories[accKey].set = accSet;
                var statsType = ACC_STATS_TYPE[accKey];
                var setData = ACCESSORY_STATS[p.accessories[accKey].set];
                var slotData = setData ? setData[statsType] : null;
                if (slotData && slotData.bonuses && typeof d[1] === 'number') {
                    var maxB = slotData.maxBonuses || 4;
                    p.accessories[accKey].bonuses = fromBitmask(d[1], slotData.bonuses, maxB);
                    if (p.accessories[accKey].bonuses.length === 0) {
                        p.accessories[accKey].bonuses = getDefaultAccBonuses(p.accessories[accKey].set, accKey);
                    }
                }
            });
        }

        // ── Minions ──
        if (pr.mi) {
            p.minions = {
                main:      val(SH_MINIONS, pr.mi[0]),
                secondary: val(SH_MINIONS, pr.mi[1])
            };
        }

        // ── Glyph ──
        if (pr.gl) {
            p.glyph = {
                bonuses: [val(SH_GLYPH_BONUSES, pr.gl[0])],
                extra: {
                    attack:      clamp(pr.gl[1] || 0, 0, 250),
                    physicalDef: clamp(pr.gl[2] || 0, 0, 250),
                    magicalDef:  clamp(pr.gl[3] || 0, 0, 250)
                }
            };
        }

        // ── TF Collections ──
        if (pr.tc && pr.tc.length >= TF_COLLECTIONS.length) {
            p.collections = p.collections || { tfToggled: {}, itemColl: {} };
            for (var ci = 0; ci < TF_COLLECTIONS.length; ci++) {
                p.collections.tfToggled[TF_COLLECTIONS[ci].key] = !!pr.tc[ci];
            }
        }

        // ── Item Collections ──
        if (pr.ic) {
            p.collections = p.collections || { tfToggled: {}, itemColl: {} };
            ITEM_COLL_STATS.forEach(function(cs) {
                if (typeof pr.ic[cs.key] === 'number') {
                    p.collections.itemColl[cs.key] = clamp(pr.ic[cs.key], 0, cs.max);
                }
            });
        }

        // ── Collection Levels ──
        if (pr.lv && pr.lv.length === 3) {
            p.collLevels = {
                normal:   clamp(pr.lv[0], 0, 10),
                large:    clamp(pr.lv[1], 0, 10),
                powerful: clamp(pr.lv[2], 0, 10)
            };
        }

        // ── Relic ──
        if (typeof pr.rl === 'number') {
            p.relic = { level: clamp(pr.rl, 1, 300) };
        }

        // ── Trait selections ──
        if (pr.tr && pr.tr.length === 5) {
            if (typeof traitSelections === 'undefined') traitSelections = {};
            traitSelections[id] = {};
            [81, 82, 83, 84, 85].forEach(function(lvl, i) {
                traitSelections[id][lvl] = clamp(pr.tr[i] || 0, 0, 2);
            });
        }

        state[id] = p;
    });

    return true;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LEGACY DECODE  (positional versions '2'..'d' — read-only backward compat)
// ═══════════════════════════════════════════════════════════════════════════════
function shDec(arr, ch) { var i = parseInt(ch, 36); return (i >= 0 && i < arr.length) ? arr[i] : arr[0]; }

function decodeShareLegacy(s) {
    if (!s || s.length < 6) return false;
    var pos = 0;
    function next() { return s.charAt(pos++); }

    var ver = next();
    if ('23456789abcd'.indexOf(ver) === -1) return false;

    var cls = shDec(SH_CLASSES, next());
    if (!CLASS_DATA[cls]) return false;
    selectedClass = cls;

    weaponConfig = createDefaultWeaponConfig(cls);
    var mt = shDec(SH_WTYPES, next());
    if (CLASS_DATA[cls].weapons.indexOf(mt) !== -1) weaponConfig.mainType = mt;
    weaponConfig.offHandType = shDec(SH_OHTYPES, next());
    weaponConfig.offHandWeaponType = shDec(SH_WTYPES, next());
    if (ver <= '5') { next(); }

    var allowed = getAllowedOffHand(weaponConfig.mainType, cls);
    if (allowed.indexOf(weaponConfig.offHandType) === -1) {
        weaponConfig.offHandType = getDefaultOffHand(weaponConfig.mainType, cls);
    }

    [1, 2].forEach(function(id) {
        var p = createDefaultProfile(cls);
        if (pos >= s.length) { state[id] = p; return; }

        var at = shDec(SH_ATYPES, next());
        if (CLASS_DATA[cls].armorTypes.indexOf(at) !== -1) p.armorType = at;

        SH_ASLOTS.forEach(function(sk) {
            var aset = shDec(SH_ASETS, next());
            var aench = parseInt(next(), 36) + 8;
            if (ARMOR_SET_KEYS.indexOf(aset) !== -1) p.armor[sk].set = aset;
            if (aench >= 8 && aench <= 15) p.armor[sk].enchant = aench;
        });

        var mwSet = shDec(SH_WSETS, next());
        var mwEnch = parseInt(next(), 36) + 8;
        if (WEAPON_SET_KEYS.indexOf(mwSet) !== -1 && MAINHAND_EXCLUDED_SETS.indexOf(mwSet) === -1) p.mainWeapon.set = mwSet;
        if (mwEnch >= 8 && mwEnch <= 15) p.mainWeapon.enchant = mwEnch;

        var ohSet = shDec(SH_WSETS, next());
        var ohEnch = parseInt(next(), 36) + 8;
        if (WEAPON_SET_KEYS.indexOf(ohSet) !== -1 && OFFHAND_EXCLUDED_SETS.indexOf(ohSet) === -1) p.offHand.set = ohSet;
        if (ohEnch >= 8 && ohEnch <= 15) p.offHand.enchant = ohEnch;

        SH_ASLOTS.forEach(function(sk) {
            var o = shDec(SH_OATHS, next());
            if (SH_OATHS.indexOf(o) !== -1) p.oath[sk] = o;
        });

        SH_GEARKEYS.forEach(function(gk) {
            if (!p.manastones[gk]) p.manastones[gk] = ['none','none','none'];
            for (var i = 0; i < 3; i++) {
                p.manastones[gk][i] = shDec(SH_MANAS, next());
            }
        });

        if (ver >= '3' && pos < s.length) {
            var tf = shDec(SH_TRANSFORMS, next());
            if (TRANSFORM_KEYS.indexOf(tf) !== -1) p.transform = tf;
        }
        if (ver >= '4' && pos < s.length) {
            var raw = parseInt(next(), 36);
            var te = ver === '4' ? raw + 1 : raw;
            if (te >= 0 && te <= 20) p.transformEnchant = te;
        }

        if (ver >= '6' && pos < s.length) {
            var shSet = shDec(SH_SHIELDSETS, next());
            var shType = shDec(SH_SHIELDTYPES, next());
            var shVar = 'pvp';
            if (ver <= '8') { shVar = shDec(SH_SHIELDVARS, next()); }
            if (ver === '6') { next(); }
            if (shSet === 'spiked-ciclonica') {
                shSet = shVar === 'pve' ? 'ciclonica' : 'spiked';
            }
            if (SHIELD_SET_KEYS.indexOf(shSet) !== -1) p.shield.set = shSet;
            if (shType === 'battle' || shType === 'scale') p.shield.type = shType;
            var maskHi = parseInt(next(), 36);
            var maskLo = parseInt(next(), 36);
            var bonusMask = maskHi * 36 + maskLo;
            var shData = SHIELD_STATS[p.shield.set];
            var typeKey = p.shield.type === 'scale' ? 'scale' : 'battle';
            var bonusList = shData ? shData.bonuses[typeKey] : [];
            var maxB = shData ? shData.maxBonuses : 0;
            p.shield.bonuses = [];
            for (var bi = 0; bi < bonusList.length && p.shield.bonuses.length < maxB; bi++) {
                if (bonusMask & (1 << bi)) p.shield.bonuses.push(bonusList[bi].key);
            }
        }

        if (ver === '8' && pos < s.length) {
            var mwVar = shDec(SH_SHIELDVARS, next());
            var ohVar = shDec(SH_SHIELDVARS, next());
            if (p.mainWeapon.set === 'spiked-helper') p.mainWeapon.set = mwVar === 'pve' ? 'ciclonica-helper' : 'spiked';
            if (p.offHand.set === 'spiked-helper') p.offHand.set = ohVar === 'pve' ? 'ciclonica-helper' : 'spiked';
        }
        if (ver <= '7') {
            if (p.mainWeapon.set === 'spiked-helper') p.mainWeapon.set = 'spiked';
            if (p.offHand.set === 'spiked-helper') p.offHand.set = 'spiked';
        }

        if (ver >= 'a' && pos < s.length) {
            [p.mainWeapon, p.offHand].forEach(function(w) {
                var wMask = parseInt(next(), 36);
                var wFixed = WEAPON_STATS_FIXED[w.set];
                if (wFixed && wFixed.bonuses) {
                    w.bonuses = [];
                    for (var wi = 0; wi < wFixed.bonuses.length && w.bonuses.length < wFixed.maxBonuses; wi++) {
                        if (wMask & (1 << wi)) w.bonuses.push(wFixed.bonuses[wi].key);
                    }
                }
            });
        }

        if (ver >= 'b' && pos < s.length) {
            ALL_ACCESSORY_KEYS.forEach(function(accKey) {
                var accSet = shDec(SH_ACCSETS, next());
                var accMaskHi = parseInt(next(), 36);
                var accMaskLo = parseInt(next(), 36);
                var accMask = accMaskHi * 36 + accMaskLo;
                if (ACCESSORY_SET_KEYS.indexOf(accSet) !== -1) p.accessories[accKey].set = accSet;
                var statsType = ACC_STATS_TYPE[accKey];
                var setData = ACCESSORY_STATS[p.accessories[accKey].set];
                var slotData = setData ? setData[statsType] : null;
                if (slotData && slotData.bonuses) {
                    var lb = slotData.maxBonuses;
                    p.accessories[accKey].bonuses = [];
                    for (var ai = 0; ai < slotData.bonuses.length && p.accessories[accKey].bonuses.length < lb; ai++) {
                        if (accMask & (1 << ai)) p.accessories[accKey].bonuses.push(slotData.bonuses[ai].key);
                    }
                    if (p.accessories[accKey].bonuses.length === 0) {
                        p.accessories[accKey].bonuses = getDefaultAccBonuses(p.accessories[accKey].set, accKey);
                    }
                }
            });
        }

        if (ver >= 'c' && pos < s.length) {
            ALL_ACCESSORY_KEYS.forEach(function(accKey) {
                var accSetKey = p.accessories[accKey].set;
                var slots = getManastoneSlotCount(accSetKey);
                var readCount = (ver >= 'd') ? 3 : slots;
                p.manastones[accKey] = [];
                for (var mi = 0; mi < readCount; mi++) {
                    var m = shDec(SH_MANAS, next());
                    if (mi < slots) p.manastones[accKey].push(m);
                }
            });
        }

        // ver 'd' additions
        if (ver >= 'd' && pos < s.length) {
            SH_ASLOTS.forEach(function(sk) {
                var isHigh = (sk === 'helmet' || sk === 'chest' || sk === 'pants');
                var bList = isHigh ? FS_BONUSES_HIGH : FS_BONUSES_LOW;
                var hi = parseInt(next(), 36);
                var lo = parseInt(next(), 36);
                var mask = hi * 36 + lo;
                p.armor[sk].bonuses = [];
                for (var bi = 0; bi < bList.length && p.armor[sk].bonuses.length < 4; bi++) {
                    if (mask & (1 << bi)) p.armor[sk].bonuses.push(bList[bi].key);
                }
            });
            p.minions = { main: shDec(SH_MINIONS, next()), secondary: shDec(SH_MINIONS, next()) };
            var gBonusKey = shDec(SH_GLYPH_BONUSES, next());
            p.glyph = { bonuses: [gBonusKey], extra: {} };
            ['attack', 'physicalDef', 'magicalDef'].forEach(function(stat) {
                var hi = parseInt(next(), 36);
                var lo = parseInt(next(), 36);
                p.glyph.extra[stat] = Math.min(250, hi * 36 + lo);
            });
            p.collections = { tfToggled: {}, itemColl: {} };
            for (var ci = 0; ci < TF_COLLECTIONS.length; ci += 5) {
                var chunk = parseInt(next(), 36);
                for (var bi = 0; bi < 5 && (ci + bi) < TF_COLLECTIONS.length; bi++) {
                    p.collections.tfToggled[TF_COLLECTIONS[ci + bi].key] = !!(chunk & (1 << bi));
                }
            }
            ITEM_COLL_STATS.forEach(function(cs) {
                var hi = parseInt(next(), 36);
                var lo = parseInt(next(), 36);
                p.collections.itemColl[cs.key] = Math.min(cs.max, hi * 36 + lo);
            });
            p.collLevels = {
                normal:   Math.min(10, parseInt(next(), 36) || 0),
                large:    Math.min(10, parseInt(next(), 36) || 0),
                powerful: Math.min(10, parseInt(next(), 36) || 0)
            };
            var relicHi = parseInt(next(), 36);
            var relicLo = parseInt(next(), 36);
            p.relic = { level: Math.min(300, Math.max(1, relicHi * 36 + relicLo + 1)) };
            if (typeof traitSelections === 'undefined') traitSelections = {};
            traitSelections[id] = {};
            [81, 82, 83, 84, 85].forEach(function(lvl) {
                var tidx = parseInt(next(), 36);
                traitSelections[id][lvl] = (tidx >= 0 && tidx <= 2) ? tidx : 0;
            });
        }

        state[id] = p;
    });
    return true;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════════════════
function generateShareLink() {
    return window.location.origin + window.location.pathname + '#s=' + encodeShareString();
}

function loadShareFromURL() {
    var hash = window.location.hash;
    if (hash.indexOf('#s=') !== 0) return false;
    try {
        var code = hash.substring(3);
        var ok = decodeShareString(code);
        if (ok && history.replaceState) {
            history.replaceState(null, '', window.location.pathname);
        }
        return ok;
    } catch (e) { return false; }
}

function showShareToast(message, isError) {
    var toast = document.getElementById('gc-share-toast');
    toast.textContent = message;
    toast.className = 'gc-share-toast' + (isError ? ' gc-share-toast-error' : '') + ' gc-share-toast-show';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(function() {
        toast.className = 'gc-share-toast';
    }, 2500);
}

document.getElementById('gc-share-btn').addEventListener('click', function() {
    var link = generateShareLink();
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(link).then(function() {
            showShareToast('✓ Link copied to clipboard!');
        }, function() {
            prompt('Copy this share link:', link);
        });
    } else {
        prompt('Copy this share link:', link);
    }
});
