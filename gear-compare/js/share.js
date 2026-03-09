'use strict';

// ═══════════════════════════════════════════════════════════════════════════════
// SHARE v3  —  Binary-packed share encoding
//
// Format:  #s=3.<base64-encoded-binary>
//
// All state is packed into a compact byte array, then base64-encoded.
// ~350 chars total URL vs ~1000+ for JSON-based v2.
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Lookup tables (append-only – order must NEVER change) ─────────────────
var SH_CLASSES       = ['gladiator','templar','assassin','ranger','sorcerer','spiritmaster','cleric','chanter','aethertech','gunner','bard','painter'];
var SH_WTYPES        = ['dagger','sword','mace','revolver','greatsword','polearm','bow','staff','paintRings','orb','spellbook','aetherKey','cannon','harp'];
var SH_OHTYPES       = ['none','shield','fuse','weapon'];
var SH_SHIELDSETS    = ['spiked-ciclonica','fighting-spirit','salvation','spiked','ciclonica'];
var SH_SHIELDTYPES   = ['battle','scale'];
var SH_ACCSETS       = ['aeon-guardian','burning-altar','starshine'];
var SH_ATYPES        = ARMOR_TYPE_OPTIONS.map(function(o) { return o.key; });
var SH_ASETS         = ['fighting-spirit','acrimony','presumption'];
var SH_WSETS         = ['spiked-helper','salvation','fighting-spirit','jorgoth-t4-v1','jorgoth-t4-v2','jorgoth-t4-v3','jorgoth-t3-v1','jorgoth-t3-v2','jorgoth-t3-v3','acrimony','presumption','vision','spiked','ciclonica-helper'];
var SH_OATHS         = ['none','silent-skill','legendary-1','legendary-2','legendary-3','ultimate-1','ultimate-2','ultimate-3'];
var SH_MANAS         = ['none','attack','crit','accuracy','hp','evasion','healBoost','pdef','mdef','magicResist','block','parry'];
var SH_ASLOTS        = ['helmet','shoulders','chest','pants','gloves','boots'];
var SH_GEARKEYS      = SH_ASLOTS.concat(['mainWeapon','offHand']);
var SH_TRANSFORMS    = TRANSFORM_KEYS;
var SH_MINIONS       = MINIONS.map(function(m) { return m.key; });
var SH_GLYPH_BONUSES = ACC_BONUSES_GLYPH.map(function(b) { return b.key; });
var SH_ALL_MANA_KEYS = SH_GEARKEYS.concat(ALL_ACCESSORY_KEYS); // 17 slots

// ─── Helpers ───────────────────────────────────────────────────────────────
function idx(arr, v)       { var i = arr.indexOf(v); return i >= 0 ? i : 0; }
function val(arr, i)       { return (i >= 0 && i < arr.length) ? arr[i] : arr[0]; }
function clamp(v, lo, hi)  { return Math.max(lo, Math.min(hi, v)); }

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

// ─── Binary stream helpers ─────────────────────────────────────────────────
function ByteWriter() { this.buf = []; }
ByteWriter.prototype.u8 = function(v) { this.buf.push(v & 0xFF); };
ByteWriter.prototype.u16 = function(v) { this.buf.push((v >> 8) & 0xFF, v & 0xFF); };
ByteWriter.prototype.nibbles = function(arr) {
    for (var i = 0; i < arr.length; i += 2) {
        var hi = arr[i] || 0;
        var lo = (i + 1 < arr.length) ? (arr[i + 1] || 0) : 0;
        this.u8((hi << 4) | (lo & 0xF));
    }
};
ByteWriter.prototype.bools = function(arr, count) {
    for (var i = 0; i < count; i += 8) {
        var b = 0;
        for (var j = 0; j < 8 && (i + j) < count; j++) {
            if (arr[i + j]) b |= (1 << j);
        }
        this.u8(b);
    }
};
ByteWriter.prototype.toBase64 = function() {
    return btoa(String.fromCharCode.apply(null, this.buf));
};

function ByteReader(b64) {
    var bin = atob(b64);
    this.buf = new Array(bin.length);
    for (var i = 0; i < bin.length; i++) this.buf[i] = bin.charCodeAt(i);
    this.pos = 0;
}
ByteReader.prototype.u8 = function() { return this.buf[this.pos++] || 0; };
ByteReader.prototype.u16 = function() { return (this.u8() << 8) | this.u8(); };
ByteReader.prototype.nibbles = function(count) {
    var out = [];
    for (var i = 0; i < count; i += 2) {
        var b = this.u8();
        out.push((b >> 4) & 0xF);
        if (i + 1 < count) out.push(b & 0xF);
    }
    return out;
};
ByteReader.prototype.bools = function(count) {
    var out = [];
    for (var i = 0; i < count; i += 8) {
        var b = this.u8();
        for (var j = 0; j < 8 && (i + j) < count; j++) {
            out.push(!!(b & (1 << j)));
        }
    }
    return out;
};

// ═══════════════════════════════════════════════════════════════════════════════
// ENCODE  — produces "3.<base64>"
// ═══════════════════════════════════════════════════════════════════════════════
function encodeShareString() {
    var w = new ByteWriter();

    // ── Global header (4 bytes) ──
    w.u8(idx(SH_CLASSES, selectedClass));
    w.u8(idx(SH_WTYPES, weaponConfig.mainType));
    w.u8(idx(SH_OHTYPES, weaponConfig.offHandType));
    w.u8(idx(SH_WTYPES, weaponConfig.offHandWeaponType));

    [1, 2].forEach(function(id) {
        var p = state[id];

        // ── Armor type ──
        w.u8(idx(SH_ATYPES, p.armorType));

        // ── Armor slots × 6  (set, enchant, bonuses) ──
        SH_ASLOTS.forEach(function(sk) {
            var a = p.armor[sk];
            var isHigh = (sk === 'helmet' || sk === 'chest' || sk === 'pants');
            var bonusList = isHigh ? FS_BONUSES_HIGH : FS_BONUSES_LOW;
            w.u8(idx(SH_ASETS, a.set));
            w.u8(typeof a.enchant === 'number' ? a.enchant : 0);
            w.u8(toBitmask(a.bonuses, bonusList));
        });

        // ── Main weapon  (set, enchant, bonuses) ──
        w.u8(idx(SH_WSETS, p.mainWeapon.set));
        w.u8(p.mainWeapon.enchant || 9);
        w.u8(toBitmask(p.mainWeapon.bonuses, (WEAPON_STATS_FIXED[p.mainWeapon.set] || {}).bonuses || []));

        // ── Off-hand  (set, enchant, bonuses) ──
        w.u8(idx(SH_WSETS, p.offHand.set));
        w.u8(p.offHand.enchant || 9);
        w.u8(toBitmask(p.offHand.bonuses, (WEAPON_STATS_FIXED[p.offHand.set] || {}).bonuses || []));

        // ── Shield  (set, type, bonuses u16) ──
        var sh = p.shield;
        var shData = SHIELD_STATS[sh.set];
        var shTypeKey = sh.type === 'scale' ? 'scale' : 'battle';
        var shBonusList = shData ? shData.bonuses[shTypeKey] : [];
        w.u8(idx(SH_SHIELDSETS, sh.set));
        w.u8(idx(SH_SHIELDTYPES, sh.type));
        w.u16(toBitmask(sh.bonuses, shBonusList));

        // ── Oaths × 6 ──
        SH_ASLOTS.forEach(function(sk) {
            w.u8(idx(SH_OATHS, p.oath[sk]));
        });

        // ── Manastones  (17 slots × 3 = 51 values, nibble-packed → 26 bytes) ──
        var manaFlat = [];
        SH_ALL_MANA_KEYS.forEach(function(gk) {
            var arr = p.manastones[gk] || [];
            for (var i = 0; i < 3; i++) {
                manaFlat.push(idx(SH_MANAS, arr[i] || 'none'));
            }
        });
        w.nibbles(manaFlat);

        // ── Transform ──
        w.u8(idx(SH_TRANSFORMS, p.transform || 'none'));
        w.u8(typeof p.transformEnchant === 'number' ? p.transformEnchant : 0);

        // ── Accessories × 9  (set, bonuses u16) ──
        ALL_ACCESSORY_KEYS.forEach(function(accKey) {
            var acc = p.accessories[accKey];
            var statsType = ACC_STATS_TYPE[accKey];
            var setData = ACCESSORY_STATS[acc.set];
            var slotData = setData ? setData[statsType] : null;
            var bonusList = (slotData && slotData.bonuses) ? slotData.bonuses : [];
            w.u8(idx(SH_ACCSETS, acc.set));
            w.u16(toBitmask(acc.bonuses, bonusList));
        });

        // ── Minions ──
        w.u8(idx(SH_MINIONS, (p.minions && p.minions.main) || 'crit-sita'));
        w.u8(idx(SH_MINIONS, (p.minions && p.minions.secondary) || 'crit-sita'));

        // ── Glyph  (bonus, attack, pDef, mDef) ──
        var glyph = p.glyph || {};
        var gExtra = glyph.extra || {};
        w.u8(idx(SH_GLYPH_BONUSES, (glyph.bonuses && glyph.bonuses[0]) || 'attack'));
        w.u8(clamp(gExtra.attack || 0, 0, 250));
        w.u8(clamp(gExtra.physicalDef || 0, 0, 250));
        w.u8(clamp(gExtra.magicalDef || 0, 0, 250));

        // ── TF Collections  (57 bools, bit-packed → 8 bytes) ──
        var tfArr = [];
        var tfToggled = (p.collections && p.collections.tfToggled) || {};
        for (var i = 0; i < TF_COLLECTIONS.length; i++) {
            tfArr.push(!!tfToggled[TF_COLLECTIONS[i].key]);
        }
        w.bools(tfArr, TF_COLLECTIONS.length);

        // ── Item Collections  (6 × u16) ──
        var itemColl = (p.collections && p.collections.itemColl) || {};
        ITEM_COLL_STATS.forEach(function(cs) {
            w.u16(clamp(parseInt(itemColl[cs.key]) || 0, 0, cs.max));
        });

        // ── Collection Levels ──
        var cl = p.collLevels || { normal: 6, large: 6, powerful: 6 };
        w.u8(clamp(cl.normal   || 0, 0, 10));
        w.u8(clamp(cl.large    || 0, 0, 10));
        w.u8(clamp(cl.powerful || 0, 0, 10));

        // ── Relic  (u16) ──
        w.u16((p.relic && p.relic.level) ? clamp(p.relic.level, 1, 300) : 300);

        // ── Traits × 5 ──
        var ts = (typeof traitSelections !== 'undefined' && traitSelections[id]) || {};
        w.u8(clamp(ts[81] || 0, 0, 2));
        w.u8(clamp(ts[82] || 0, 0, 2));
        w.u8(clamp(ts[83] || 0, 0, 2));
        w.u8(clamp(ts[84] || 0, 0, 2));
        w.u8(clamp(ts[85] || 0, 0, 2));
    });

    return '3.' + w.toBase64();
}

// ═══════════════════════════════════════════════════════════════════════════════
// DECODE
// ═══════════════════════════════════════════════════════════════════════════════
function decodeShareString(s) {
    if (!s || s.length < 4) return false;
    if (s.charAt(0) !== '3' || s.charAt(1) !== '.') return false;
    try { return decodeShareV3(s.substring(2)); }
    catch (e) { return false; }
}

function decodeShareV3(b64) {
    var r = new ByteReader(b64);

    // ── Global header ──
    var cls = val(SH_CLASSES, r.u8());
    if (!CLASS_DATA[cls]) return false;
    selectedClass = cls;

    weaponConfig = createDefaultWeaponConfig(cls);
    var mt = val(SH_WTYPES, r.u8());
    if (CLASS_DATA[cls].weapons.indexOf(mt) !== -1) weaponConfig.mainType = mt;
    weaponConfig.offHandType = val(SH_OHTYPES, r.u8());
    weaponConfig.offHandWeaponType = val(SH_WTYPES, r.u8());

    var allowed = getAllowedOffHand(weaponConfig.mainType, cls);
    if (allowed.indexOf(weaponConfig.offHandType) === -1) {
        weaponConfig.offHandType = getDefaultOffHand(weaponConfig.mainType, cls);
    }

    [1, 2].forEach(function(id) {
        var p = createDefaultProfile(cls);

        // ── Armor type ──
        var at = val(SH_ATYPES, r.u8());
        if (CLASS_DATA[cls].armorTypes.indexOf(at) !== -1) p.armorType = at;

        // ── Armor slots × 6 ──
        SH_ASLOTS.forEach(function(sk) {
            var aset = val(SH_ASETS, r.u8());
            var aench = r.u8();
            var abmask = r.u8();
            if (ARMOR_SET_KEYS.indexOf(aset) !== -1) p.armor[sk].set = aset;
            if (aench >= 8 && aench <= 15) p.armor[sk].enchant = aench;
            var isHigh = (sk === 'helmet' || sk === 'chest' || sk === 'pants');
            var bonusList = isHigh ? FS_BONUSES_HIGH : FS_BONUSES_LOW;
            if (abmask > 0) p.armor[sk].bonuses = fromBitmask(abmask, bonusList, 4);
        });

        // ── Main weapon ──
        var mwSet = val(SH_WSETS, r.u8());
        var mwEnch = r.u8();
        var mwBmask = r.u8();
        if (WEAPON_SET_KEYS.indexOf(mwSet) !== -1 && MAINHAND_EXCLUDED_SETS.indexOf(mwSet) === -1) p.mainWeapon.set = mwSet;
        if (mwEnch >= 8 && mwEnch <= 15) p.mainWeapon.enchant = mwEnch;
        var mwFixed = WEAPON_STATS_FIXED[p.mainWeapon.set];
        if (mwFixed && mwFixed.bonuses && mwBmask) {
            p.mainWeapon.bonuses = fromBitmask(mwBmask, mwFixed.bonuses, mwFixed.maxBonuses);
        }

        // ── Off-hand ──
        var ohSet = val(SH_WSETS, r.u8());
        var ohEnch = r.u8();
        var ohBmask = r.u8();
        if (WEAPON_SET_KEYS.indexOf(ohSet) !== -1 && OFFHAND_EXCLUDED_SETS.indexOf(ohSet) === -1) p.offHand.set = ohSet;
        if (ohEnch >= 8 && ohEnch <= 15) p.offHand.enchant = ohEnch;
        var ohFixed = WEAPON_STATS_FIXED[p.offHand.set];
        if (ohFixed && ohFixed.bonuses && ohBmask) {
            p.offHand.bonuses = fromBitmask(ohBmask, ohFixed.bonuses, ohFixed.maxBonuses);
        }

        // ── Shield ──
        var shSet = val(SH_SHIELDSETS, r.u8());
        var shType = val(SH_SHIELDTYPES, r.u8());
        var shBmask = r.u16();
        if (shSet === 'spiked-ciclonica') shSet = 'spiked';
        if (SHIELD_SET_KEYS.indexOf(shSet) !== -1) p.shield.set = shSet;
        if (shType === 'battle' || shType === 'scale') p.shield.type = shType;
        var shData = SHIELD_STATS[p.shield.set];
        var typeKey = p.shield.type === 'scale' ? 'scale' : 'battle';
        var shBonusList = shData ? shData.bonuses[typeKey] : [];
        var shMaxB = shData ? shData.maxBonuses : 0;
        if (shBmask) p.shield.bonuses = fromBitmask(shBmask, shBonusList, shMaxB);

        // ── Oaths × 6 ──
        SH_ASLOTS.forEach(function(sk) {
            var o = val(SH_OATHS, r.u8());
            if (SH_OATHS.indexOf(o) !== -1) p.oath[sk] = o;
        });

        // ── Manastones (nibble-packed) ──
        var manaFlat = r.nibbles(SH_ALL_MANA_KEYS.length * 3);
        var mi = 0;
        SH_ALL_MANA_KEYS.forEach(function(gk) {
            if (!p.manastones[gk]) p.manastones[gk] = ['none','none','none'];
            for (var i = 0; i < 3; i++) {
                p.manastones[gk][i] = val(SH_MANAS, manaFlat[mi++]);
            }
        });

        // ── Transform ──
        var tf = val(SH_TRANSFORMS, r.u8());
        if (TRANSFORM_KEYS.indexOf(tf) !== -1) p.transform = tf;
        p.transformEnchant = clamp(r.u8(), 0, 20);

        // ── Accessories × 9 ──
        ALL_ACCESSORY_KEYS.forEach(function(accKey) {
            var accSet = val(SH_ACCSETS, r.u8());
            var accBmask = r.u16();
            if (ACCESSORY_SET_KEYS.indexOf(accSet) !== -1) p.accessories[accKey].set = accSet;
            var statsType = ACC_STATS_TYPE[accKey];
            var setData = ACCESSORY_STATS[p.accessories[accKey].set];
            var slotData = setData ? setData[statsType] : null;
            if (slotData && slotData.bonuses) {
                var maxB = slotData.maxBonuses || 4;
                p.accessories[accKey].bonuses = fromBitmask(accBmask, slotData.bonuses, maxB);
                if (p.accessories[accKey].bonuses.length === 0) {
                    p.accessories[accKey].bonuses = getDefaultAccBonuses(p.accessories[accKey].set, accKey);
                }
            }
        });

        // ── Minions ──
        p.minions = {
            main:      val(SH_MINIONS, r.u8()),
            secondary: val(SH_MINIONS, r.u8())
        };

        // ── Glyph ──
        p.glyph = {
            bonuses: [val(SH_GLYPH_BONUSES, r.u8())],
            extra: {
                attack:      clamp(r.u8(), 0, 250),
                physicalDef: clamp(r.u8(), 0, 250),
                magicalDef:  clamp(r.u8(), 0, 250)
            }
        };

        // ── TF Collections ──
        var tfBools = r.bools(TF_COLLECTIONS.length);
        p.collections = p.collections || { tfToggled: {}, itemColl: {} };
        for (var ci = 0; ci < TF_COLLECTIONS.length; ci++) {
            p.collections.tfToggled[TF_COLLECTIONS[ci].key] = tfBools[ci];
        }

        // ── Item Collections ──
        ITEM_COLL_STATS.forEach(function(cs) {
            p.collections.itemColl[cs.key] = clamp(r.u16(), 0, cs.max);
        });

        // ── Collection Levels ──
        p.collLevels = {
            normal:   clamp(r.u8(), 0, 10),
            large:    clamp(r.u8(), 0, 10),
            powerful: clamp(r.u8(), 0, 10)
        };

        // ── Relic ──
        p.relic = { level: clamp(r.u16(), 1, 300) };

        // ── Traits ──
        if (typeof traitSelections === 'undefined') traitSelections = {};
        traitSelections[id] = {};
        [81, 82, 83, 84, 85].forEach(function(lvl) {
            traitSelections[id][lvl] = clamp(r.u8(), 0, 2);
        });

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
