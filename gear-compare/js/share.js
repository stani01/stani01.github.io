'use strict';


// Fixed lookup tables for encoding — order must never change (append only)
var SH_CLASSES   = ['gladiator','templar','assassin','ranger','sorcerer','spiritmaster','cleric','chanter','aethertech','gunner','bard','painter'];
var SH_WTYPES    = ['dagger','sword','mace','revolver','greatsword','polearm','bow','staff','paintRings','orb','spellbook','aetherKey','cannon','harp'];
var SH_OHTYPES   = ['none','shield','fuse','weapon'];
var SH_SHIELDS   = ['scale-phys','scale-mag'];
var SH_SHIELDSETS = ['spiked-ciclonica','fighting-spirit','salvation','spiked','ciclonica']; // 5 (append-only; 0=legacy)
var SH_SHIELDTYPES = ['battle','scale']; // 2
var SH_SHIELDVARS = ['pvp','pve']; // 2 (legacy, for v6-v8 decode)
var SH_ACCSETS    = ['aeon-guardian','burning-altar','starshine']; // 3 (append-only)
var SH_ATYPES    = ARMOR_TYPE_OPTIONS.map(function(o) { return o.key; }); // 8 entries
var SH_ASETS     = ['fighting-spirit','acrimony','presumption']; // 3
var SH_WSETS     = ['spiked-helper','salvation','fighting-spirit','jorgoth-t4-v1','jorgoth-t4-v2','jorgoth-t4-v3','jorgoth-t3-v1','jorgoth-t3-v2','jorgoth-t3-v3','acrimony','presumption','vision','spiked','ciclonica-helper']; // 14 (append-only; 0=legacy)
var SH_OATHS     = ['none','silent-skill','legendary-1','legendary-2','legendary-3','ultimate-1','ultimate-2','ultimate-3']; // 8
var SH_MANAS     = ['none','attack','crit','accuracy','hp','evasion','healBoost','pdef','mdef','magicResist','block','parry']; // 12
// Armor slot order (fixed)
var SH_ASLOTS    = ['helmet','shoulders','chest','pants','gloves','boots'];
// Gear order for manastones: 6 armor + mainWeapon + offHand = 8 × 3 = 24 chars
var SH_GEARKEYS  = SH_ASLOTS.concat(['mainWeapon','offHand']);
var SH_TRANSFORMS = TRANSFORM_KEYS; // append-only

function shEnc(arr, val) { var i = arr.indexOf(val); return (i >= 0 ? i : 0).toString(36); }
function shDec(arr, ch)  { var i = parseInt(ch, 36); return (i >= 0 && i < arr.length) ? arr[i] : arr[0]; }

function encodeShareString() {
    // Header: version(1) + class(1) + mainType(1) + ohType(1) + ohWeaponType(1) = 5
    var s = 'c'; // version
    s += shEnc(SH_CLASSES, selectedClass);
    s += shEnc(SH_WTYPES, weaponConfig.mainType);
    s += shEnc(SH_OHTYPES, weaponConfig.offHandType);
    s += shEnc(SH_WTYPES, weaponConfig.offHandWeaponType);

    // Encode each profile: armorType(1) + 6×armor(set+ench=2) + mw(2) + oh(2) + 6×oath(1) + 24×mana(1) = 47
    [1, 2].forEach(function(id) {
        var p = state[id];
        s += shEnc(SH_ATYPES, p.armorType);
        SH_ASLOTS.forEach(function(sk) {
            s += shEnc(SH_ASETS, p.armor[sk].set);
            s += (p.armor[sk].enchant - 8).toString(36); // 0-7
        });
        s += shEnc(SH_WSETS, p.mainWeapon.set);
        s += (p.mainWeapon.enchant - 8).toString(36);
        s += shEnc(SH_WSETS, p.offHand.set);
        s += (p.offHand.enchant - 8).toString(36);
        SH_ASLOTS.forEach(function(sk) {
            s += shEnc(SH_OATHS, p.oath[sk]);
        });
        SH_GEARKEYS.forEach(function(gk) {
            var ms = p.manastones[gk] || [];
            for (var i = 0; i < 3; i++) {
                s += shEnc(SH_MANAS, ms[i] || 'none');
            }
        });
        // Transform (1 char) + enchant (1 char)
        s += shEnc(SH_TRANSFORMS, p.transform || 'none');
        s += (p.transformEnchant || 0).toString(36);
        // Shield: set(1) + type(1) + bonusMask(2) = 4 chars
        var sh = p.shield;
        s += shEnc(SH_SHIELDSETS, sh.set);
        s += shEnc(SH_SHIELDTYPES, sh.type);
        var shData = SHIELD_STATS[sh.set];
        var typeKey = sh.type === 'scale' ? 'scale' : 'battle';
        var bonusList = shData ? shData.bonuses[typeKey] : [];
        var mask = 0;
        (sh.bonuses || []).forEach(function(bk) {
            var bi = bonusList.findIndex(function(b) { return b.key === bk; });
            if (bi >= 0) mask |= (1 << bi);
        });
        // Encode mask as 2 base36 chars (max 1296, need 512)
        s += Math.floor(mask / 36).toString(36);
        s += (mask % 36).toString(36);
        // Weapon bonuses: 1 char each for mainWeapon and offHand (5 bonuses → bitmask 0-31, fits in 1 base36 char)
        [p.mainWeapon, p.offHand].forEach(function(w) {
            var wFixed = WEAPON_STATS_FIXED[w.set];
            if (wFixed && wFixed.bonuses) {
                var wMask = 0;
                (w.bonuses || []).forEach(function(bk) {
                    var bi = wFixed.bonuses.findIndex(function(b) { return b.key === bk; });
                    if (bi >= 0) wMask |= (1 << bi);
                });
                s += wMask.toString(36);
            } else {
                s += '0';
            }
        });
        // Accessories: 9 slots × (set(1) + bonusMask(2)) = 27 chars
        ALL_ACCESSORY_KEYS.forEach(function(accKey) {
            var acc = p.accessories[accKey];
            s += shEnc(SH_ACCSETS, acc.set);
            var statsType = ACC_STATS_TYPE[accKey];
            var setData = ACCESSORY_STATS[acc.set];
            var slotData = setData ? setData[statsType] : null;
            var accMask = 0;
            if (slotData && slotData.bonuses && acc.bonuses) {
                acc.bonuses.forEach(function(bk) {
                    var bi = slotData.bonuses.findIndex(function(b) { return b.key === bk; });
                    if (bi >= 0) accMask |= (1 << bi);
                });
            }
            s += Math.floor(accMask / 36).toString(36);
            s += (accMask % 36).toString(36);
        });
        // Accessory manastones: 9 slots × 3 manastone slots = 27 chars
        ALL_ACCESSORY_KEYS.forEach(function(accKey) {
            var ms = p.manastones[accKey] || [];
            for (var i = 0; i < 3; i++) {
                s += shEnc(SH_MANAS, ms[i] || 'none');
            }
        });
    });
    return s;
}

function decodeShareString(s) {
    if (!s || s.length < 6) return false;
    var pos = 0;
    function next() { return s.charAt(pos++); }

    var ver = next();
    if (ver !== 'c' && ver !== 'b' && ver !== 'a' && ver !== '9' && ver !== '8' && ver !== '7' && ver !== '6' && ver !== '5' && ver !== '4' && ver !== '3' && ver !== '2') return false;

    var cls = shDec(SH_CLASSES, next());
    if (!CLASS_DATA[cls]) return false;
    selectedClass = cls;

    weaponConfig = createDefaultWeaponConfig(cls);
    var mt = shDec(SH_WTYPES, next());
    if (CLASS_DATA[cls].weapons.indexOf(mt) !== -1) weaponConfig.mainType = mt;
    var ot = shDec(SH_OHTYPES, next());
    weaponConfig.offHandType = ot;
    weaponConfig.offHandWeaponType = shDec(SH_WTYPES, next());
    // v5 and below had global shieldType in header; v6 moved to per-profile
    if (ver <= '5') { next(); /* consume legacy shieldType char */ }

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
                var m = shDec(SH_MANAS, next());
                p.manastones[gk][i] = m;
            }
        });

        // Transform (v3+)
        if (ver >= '3' && pos < s.length) {
            var tf = shDec(SH_TRANSFORMS, next());
            if (TRANSFORM_KEYS.indexOf(tf) !== -1) p.transform = tf;
        }
        // Transform enchant (v4+)
        if (ver >= '4' && pos < s.length) {
            var raw = parseInt(next(), 36);
            var te = ver === '4' ? raw + 1 : raw;
            if (te >= 0 && te <= 20) p.transformEnchant = te;
        }

        // Shield (v6+)
        if (ver >= '6' && pos < s.length) {
            var shSet = shDec(SH_SHIELDSETS, next());
            var shType = shDec(SH_SHIELDTYPES, next());
            var shVar = 'pvp';
            if (ver <= '8') {
                // v6-v8: consume legacy variant char and map old spiked-ciclonica → spiked/ciclonica
                shVar = shDec(SH_SHIELDVARS, next());
            }
            if (ver === '6') { next(); /* consume legacy enchant char */ }
            // Map legacy spiked-ciclonica to separate sets
            if (shSet === 'spiked-ciclonica') {
                shSet = shVar === 'pve' ? 'ciclonica' : 'spiked';
            }
            if (SHIELD_SET_KEYS.indexOf(shSet) !== -1) p.shield.set = shSet;
            if (shType === 'battle' || shType === 'scale') p.shield.type = shType;
            // Decode bonus bitmask (2 chars)
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

        // v8: consume legacy weapon variant chars
        if (ver === '8' && pos < s.length) {
            var mwVar = shDec(SH_SHIELDVARS, next()); // reuse same 2-entry array
            var ohVar = shDec(SH_SHIELDVARS, next());
            // Map legacy spiked-helper + variant to separate weapon sets
            if (p.mainWeapon.set === 'spiked-helper') {
                p.mainWeapon.set = mwVar === 'pve' ? 'ciclonica-helper' : 'spiked';
            }
            if (p.offHand.set === 'spiked-helper') {
                p.offHand.set = ohVar === 'pve' ? 'ciclonica-helper' : 'spiked';
            }
        }
        // v7 and below: spiked-helper maps to spiked (pvp was default)
        if (ver <= '7') {
            if (p.mainWeapon.set === 'spiked-helper') p.mainWeapon.set = 'spiked';
            if (p.offHand.set === 'spiked-helper') p.offHand.set = 'spiked';
        }

        // Weapon bonuses (v10/a+)
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

        // Accessories (v11/b+)
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
                    var maxB = slotData.maxBonuses;
                    p.accessories[accKey].bonuses = [];
                    for (var ai = 0; ai < slotData.bonuses.length && p.accessories[accKey].bonuses.length < maxB; ai++) {
                        if (accMask & (1 << ai)) p.accessories[accKey].bonuses.push(slotData.bonuses[ai].key);
                    }
                    if (p.accessories[accKey].bonuses.length === 0) {
                        p.accessories[accKey].bonuses = getDefaultAccBonuses(p.accessories[accKey].set, accKey);
                    }
                }
            });
        }

        // Accessory manastones (v12/c+)
        if (ver >= 'c' && pos < s.length) {
            ALL_ACCESSORY_KEYS.forEach(function(accKey) {
                var accSetKey = p.accessories[accKey].set;
                var slots = getManastoneSlotCount(accSetKey);
                p.manastones[accKey] = [];
                for (var mi = 0; mi < slots; mi++) {
                    p.manastones[accKey].push(shDec(SH_MANAS, next()));
                }
            });
        }

        state[id] = p;
    });
    return true;
}

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
