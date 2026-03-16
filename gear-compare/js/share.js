'use strict';

// ===============================================================================
// SHARE v6  -  Binary-packed share encoding (multi-set)
//
// Format:  #s=6.<base64-encoded-binary>
//
// Layout:
//   [Global Header]  - class, weapon config         (4 bytes)
//   [Multi-set Header] - count, comp pair, names     (variable)
//   [Profile 1..N]   - full per-profile data         (variable each)
//
// No backward compatibility - old v4/v5 links are not supported.
// ===============================================================================

// --- Lookup tables (order is the encoding key - append only) ---------------
var SH_CLASSES       = ['gladiator','templar','assassin','ranger','sorcerer','spiritmaster','cleric','chanter','aethertech','gunner','bard','painter'];
var SH_WTYPES        = ['dagger','sword','mace','revolver','greatsword','polearm','bow','staff','paintRings','orb','spellbook','aetherKey','cannon','harp'];
var SH_OHTYPES       = ['none','shield','fuse','weapon'];
var SH_ATYPES        = ARMOR_TYPE_OPTIONS.map(function(o) { return o.key; });
var SH_ASETS         = ['fighting-spirit','acrimony','presumption','none','obstinacy'];
var SH_WSETS         = ['fighting-spirit','salvation','spiked','ciclonica-helper','acrimony','presumption','vision','jorgoth-t4-v1','jorgoth-t4-v2','jorgoth-t4-v3','jorgoth-t3-v1','jorgoth-t3-v2','jorgoth-t3-v3','none'];
var SH_SHIELDSETS    = ['fighting-spirit','salvation','spiked','ciclonica','none'];
var SH_SHIELDTYPES   = ['battle','scale'];
var SH_ACCSETS       = ['aeon-guardian','burning-altar','starshine','none'];
var SH_OATHS         = ['none','silent-skill','legendary-1','legendary-2','legendary-3','ultimate-1','ultimate-2','ultimate-3'];
var SH_MANAS         = ['none','attack','crit','accuracy','hp','evasion','healBoost','pdef','mdef','magicResist','block','parry'];
var SH_TRANSFORMS    = TRANSFORM_KEYS;
var SH_MINIONS       = MINIONS.map(function(m) { return m.key; });
var SH_GLYPH_BONUSES = ACC_BONUSES_GLYPH.map(function(b) { return b.key; });
var SH_ASLOTS        = ['helmet','shoulders','chest','pants','gloves','boots'];
var SH_GEARKEYS      = SH_ASLOTS.concat(['mainWeapon','offHand']);
var SH_ALL_MANA_KEYS = SH_GEARKEYS.concat(ALL_ACCESSORY_KEYS); // 17 slots total

// --- Helpers ---------------------------------------------------------------
function idx(arr, v) {
    var i = arr.indexOf(v);
    return i >= 0 ? i : 0;
}
function val(arr, i) {
    return (i >= 0 && i < arr.length) ? arr[i] : arr[0];
}
function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
}

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

// --- Binary stream helpers -------------------------------------------------
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
ByteReader.prototype.remaining = function() { return this.buf.length - this.pos; };
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


// ===============================================================================
// ENCODE
// ===============================================================================

function encodeProfile(w, id) {
    var p = state[id];

    // -- Armor type (1 byte) + Apsu flag (bit 3) --
    w.u8(idx(SH_ATYPES, p.armorType) | (p.apsuEnabled ? 8 : 0));

    // -- Armor * 6 slots: set(1) + enchant(1) + bonusMask(1) --
    SH_ASLOTS.forEach(function(sk) {
        var a = p.armor[sk];
        var isHigh = (sk === 'helmet' || sk === 'chest' || sk === 'pants');
        var bonusList = isHigh ? FS_BONUSES_HIGH : FS_BONUSES_LOW;
        w.u8(idx(SH_ASETS, a.set));
        w.u8(typeof a.enchant === 'number' ? a.enchant : 0);
        w.u8(toBitmask(a.bonuses, bonusList));
    });

    // -- Main weapon: set(1) + enchant(1) + bonusMask(1) --
    w.u8(idx(SH_WSETS, p.mainWeapon.set));
    w.u8(p.mainWeapon.enchant || 9);
    w.u8(toBitmask(p.mainWeapon.bonuses, (WEAPON_STATS_FIXED[p.mainWeapon.set] || {}).bonuses || []));

    // -- Off-hand: set(1) + enchant(1) + bonusMask(1) --
    w.u8(idx(SH_WSETS, p.offHand.set));
    w.u8(p.offHand.enchant || 9);
    w.u8(toBitmask(p.offHand.bonuses, (WEAPON_STATS_FIXED[p.offHand.set] || {}).bonuses || []));

    // -- Shield: set(1) + type(1) + bonusMask(2) --
    var sh = p.shield;
    var shData = SHIELD_STATS[sh.set];
    var shTypeKey = sh.type === 'scale' ? 'scale' : 'battle';
    var shBonusList = shData ? shData.bonuses[shTypeKey] : [];
    w.u8(idx(SH_SHIELDSETS, sh.set));
    w.u8(idx(SH_SHIELDTYPES, sh.type));
    w.u16(toBitmask(sh.bonuses, shBonusList));

    // -- Oaths * 6 (1 byte each) --
    SH_ASLOTS.forEach(function(sk) {
        w.u8(idx(SH_OATHS, p.oath[sk]));
    });

    // -- Manastones: 17 slots * 3 = 51 nibbles -> 26 bytes --
    var manaFlat = [];
    SH_ALL_MANA_KEYS.forEach(function(gk) {
        var arr = p.manastones[gk] || [];
        for (var i = 0; i < 3; i++) {
            manaFlat.push(idx(SH_MANAS, arr[i] || 'none'));
        }
    });
    w.nibbles(manaFlat);

    // -- Transform: key(1) + enchant(1) --
    w.u8(idx(SH_TRANSFORMS, p.transform || 'none'));
    w.u8(typeof p.transformEnchant === 'number' ? p.transformEnchant : 0);

    // -- Accessories * 9: set(1) + bonusMask(2) --
    ALL_ACCESSORY_KEYS.forEach(function(accKey) {
        var acc = p.accessories[accKey];
        var statsType = ACC_STATS_TYPE[accKey];
        var setData = ACCESSORY_STATS[acc.set];
        var slotData = setData ? setData[statsType] : null;
        var bonusList = (slotData && slotData.bonuses) ? slotData.bonuses : [];
        w.u8(idx(SH_ACCSETS, acc.set));
        w.u16(toBitmask(acc.bonuses, bonusList));
    });

    // -- Minions: main(1) + secondary(1) --
    w.u8(idx(SH_MINIONS, (p.minions && p.minions.main) || 'crit-sita'));
    w.u8(idx(SH_MINIONS, (p.minions && p.minions.secondary) || 'crit-sita'));

    // -- Glyph: enabled(1) + bonus(1) + attack(1) + pDef(1) + mDef(1) --
    var glyph = p.glyph || {};
    var gExtra = glyph.extra || {};
    w.u8(glyph.enabled === false ? 0 : 1);
    w.u8(idx(SH_GLYPH_BONUSES, (glyph.bonuses && glyph.bonuses[0]) || 'attack'));
    w.u8(clamp(gExtra.attack || 0, 0, 250));
    w.u8(clamp(gExtra.physicalDef || 0, 0, 250));
    w.u8(clamp(gExtra.magicalDef || 0, 0, 250));

    // -- Owned Forms: bit-packed (ALL_FORM_IDS.length bits) --
    var formArr = [];
    var ownedForms = p.ownedForms || {};
    for (var fi = 0; fi < ALL_FORM_IDS.length; fi++) {
        formArr.push(!!ownedForms[ALL_FORM_IDS[fi]]);
    }
    w.bools(formArr, ALL_FORM_IDS.length);

    // -- Item Collections: 6 * u16 --
    var itemColl = (p.collections && p.collections.itemColl) || {};
    ITEM_COLL_STATS.forEach(function(cs) {
        w.u16(clamp(parseInt(itemColl[cs.key]) || 0, 0, cs.max));
    });

    // -- Collection Levels: 3 * u8 --
    var cl = p.collLevels || { normal: 6, large: 6, powerful: 6 };
    w.u8(clamp(cl.normal || 0, 0, 10));
    w.u8(clamp(cl.large || 0, 0, 10));
    w.u8(clamp(cl.powerful || 0, 0, 10));

    // -- Relic: u16 --
    w.u16((p.relic && p.relic.level) ? clamp(p.relic.level, 1, 300) : 300);

    // -- Traits * 5: u8 each --
    var ts = (typeof traitSelections !== 'undefined' && traitSelections[id]) || {};
    [81, 82, 83, 84, 85].forEach(function(lvl) {
        w.u8(clamp(ts[lvl] || 0, 0, 2));
    });

    // -- Skill Buffs: bit-packed (GC_SKILL_KEYS.length bits) --
    var sbArr = [];
    var sbState = p.skillBuffs || {};
    GC_SKILL_KEYS.forEach(function(k) {
        sbArr.push(!!sbState[k]);
    });
    w.bools(sbArr, GC_SKILL_KEYS.length);

    // -- Skill Enchant Levels: count(1) + level(1) each --
    var sbe = p.skillBuffEnchants || {};
    w.u8(GC_ENCHANTABLE_KEYS.length);
    GC_ENCHANTABLE_KEYS.forEach(function(k) {
        w.u8(sbe[k] || 0);
    });

    // -- Bonus Values: u16 per selected bonus, in definition order --
    // Armor * 6
    var apsuInfoEnc = p.apsuEnabled ? APSU_DATA[selectedClass] : null;
    SH_ASLOTS.forEach(function(sk) {
        var a = p.armor[sk];
        var isHighBV = (sk === 'helmet' || sk === 'chest' || sk === 'pants');
        var bvList = isHighBV ? FS_BONUSES_HIGH : FS_BONUSES_LOW;
        var apsuOvrEnc = (apsuInfoEnc && apsuInfoEnc.slot === sk && apsuInfoEnc.bonusOverride) ? apsuInfoEnc.bonusOverride : null;
        bvList.forEach(function(b) {
            if (a.bonuses && a.bonuses.indexOf(b.key) !== -1) {
                var maxBV = (apsuOvrEnc && apsuOvrEnc[b.key]) ? apsuOvrEnc[b.key] : b.value;
                var bv = (a.bonusValues && typeof a.bonusValues[b.key] === 'number') ? a.bonusValues[b.key] : maxBV;
                w.u16(clamp(bv, 0, maxBV));
            }
        });
    });
    // Main weapon
    var mwBDefs = (WEAPON_STATS_FIXED[p.mainWeapon.set] || {}).bonuses || [];
    mwBDefs.forEach(function(b) {
        if (p.mainWeapon.bonuses && p.mainWeapon.bonuses.indexOf(b.key) !== -1) {
            var bv = (p.mainWeapon.bonusValues && typeof p.mainWeapon.bonusValues[b.key] === 'number') ? p.mainWeapon.bonusValues[b.key] : b.value;
            w.u16(clamp(bv, 0, b.value));
        }
    });
    // Off-hand
    var ohBDefs = (WEAPON_STATS_FIXED[p.offHand.set] || {}).bonuses || [];
    ohBDefs.forEach(function(b) {
        if (p.offHand.bonuses && p.offHand.bonuses.indexOf(b.key) !== -1) {
            var bv = (p.offHand.bonusValues && typeof p.offHand.bonusValues[b.key] === 'number') ? p.offHand.bonusValues[b.key] : b.value;
            w.u16(clamp(bv, 0, b.value));
        }
    });
    // Shield
    var shBDefsEnc = shData ? shData.bonuses[shTypeKey] : [];
    shBDefsEnc.forEach(function(b) {
        if (sh.bonuses && sh.bonuses.indexOf(b.key) !== -1) {
            var bv = (sh.bonusValues && typeof sh.bonusValues[b.key] === 'number') ? sh.bonusValues[b.key] : b.value;
            w.u16(clamp(bv, 0, b.value));
        }
    });
    // Accessories * 9
    ALL_ACCESSORY_KEYS.forEach(function(accKey) {
        var accBV = p.accessories[accKey];
        var stBV = ACC_STATS_TYPE[accKey];
        var sdBV = ACCESSORY_STATS[accBV.set];
        var slBV = sdBV ? sdBV[stBV] : null;
        var blBV = (slBV && slBV.bonuses) ? slBV.bonuses : [];
        blBV.forEach(function(b) {
            if (accBV.bonuses && accBV.bonuses.indexOf(b.key) !== -1) {
                var bv = (accBV.bonusValues && typeof accBV.bonusValues[b.key] === 'number') ? accBV.bonusValues[b.key] : b.value;
                w.u16(clamp(bv, 0, b.value));
            }
        });
    });
    // Glyph bonus value
    var glyphBK = (glyph.bonuses && glyph.bonuses[0]) || 'attack';
    var glyphBDef = ACC_BONUSES_GLYPH.find(function(b) { return b.key === glyphBK; });
    if (glyphBDef) {
        var gbv = (glyph.bonusValues && typeof glyph.bonusValues[glyphBK] === 'number') ? glyph.bonusValues[glyphBK] : glyphBDef.value;
        w.u16(clamp(gbv, 0, glyphBDef.value));
    }
}

// --- Main encode function --------------------------------------------------
function encodeShareString() {
    var w = new ByteWriter();

    // -- Global header (4 bytes) --
    w.u8(idx(SH_CLASSES, selectedClass));
    w.u8(idx(SH_WTYPES, weaponConfig.mainType));
    w.u8(idx(SH_OHTYPES, weaponConfig.offHandType));
    w.u8(idx(SH_WTYPES, weaponConfig.offHandWeaponType));

    // -- Multi-set header --
    w.u8(setOrder.length);                                          // set count (2-5)
    w.u8(Math.max(0, setOrder.indexOf(comparisonPair.a)));          // comp pair A index
    w.u8(Math.max(0, setOrder.indexOf(comparisonPair.b)));          // comp pair B index

    // Set names: length-prefixed ASCII
    setOrder.forEach(function(id) {
        var name = getSetName(id);
        var bytes = [];
        for (var i = 0; i < name.length && bytes.length < 32; i++) {
            var c = name.charCodeAt(i);
            bytes.push(c < 128 ? c : 63);  // '?' for non-ASCII
        }
        w.u8(bytes.length);
        bytes.forEach(function(b) { w.u8(b); });
    });

    // -- Per-profile data --
    setOrder.forEach(function(id) {
        encodeProfile(w, id);
    });

    return '6.' + w.toBase64();
}


// ===============================================================================
// DECODE
// ===============================================================================

function decodeProfileFromReader(r, cls, id) {
    var p = createDefaultProfile(cls);

    // -- Armor type + Apsu flag --
    var armorRaw = r.u8();
    var at = val(SH_ATYPES, armorRaw & 0x07);
    p.apsuEnabled = !!(armorRaw & 0x08);
    if (CLASS_DATA[cls].armorTypes.indexOf(at) !== -1) p.armorType = at;

    // -- Armor * 6 --
    SH_ASLOTS.forEach(function(sk) {
        var aset = val(SH_ASETS, r.u8());
        var aench = r.u8();
        var abmask = r.u8();
        // Validate set is known and allowed for this slot
        var asetDef = ARMOR_SETS.find(function(s) { return s.key === aset; });
        if (asetDef && (!asetDef.slots || asetDef.slots.indexOf(sk) !== -1)) p.armor[sk].set = aset;
        if (aench >= 8 && aench <= 15) p.armor[sk].enchant = aench;
        var isHigh = (sk === 'helmet' || sk === 'chest' || sk === 'pants');
        var bonusList = isHigh ? FS_BONUSES_HIGH : FS_BONUSES_LOW;
        if (abmask > 0) p.armor[sk].bonuses = fromBitmask(abmask, bonusList, 4);
    });

    // -- Main weapon --
    var mwSet = val(SH_WSETS, r.u8());
    var mwEnch = r.u8();
    var mwBmask = r.u8();
    if (WEAPON_SET_KEYS.indexOf(mwSet) !== -1 && MAINHAND_EXCLUDED_SETS.indexOf(mwSet) === -1) p.mainWeapon.set = mwSet;
    if (mwEnch >= 1 && mwEnch <= 15) p.mainWeapon.enchant = mwEnch;
    var mwFixed = WEAPON_STATS_FIXED[p.mainWeapon.set];
    if (mwFixed && mwFixed.bonuses && mwBmask) {
        p.mainWeapon.bonuses = fromBitmask(mwBmask, mwFixed.bonuses, mwFixed.maxBonuses);
    }

    // -- Off-hand --
    var ohSet = val(SH_WSETS, r.u8());
    var ohEnch = r.u8();
    var ohBmask = r.u8();
    if (WEAPON_SET_KEYS.indexOf(ohSet) !== -1 && OFFHAND_EXCLUDED_SETS.indexOf(ohSet) === -1) p.offHand.set = ohSet;
    if (ohEnch >= 1 && ohEnch <= 15) p.offHand.enchant = ohEnch;
    var ohFixed = WEAPON_STATS_FIXED[p.offHand.set];
    if (ohFixed && ohFixed.bonuses && ohBmask) {
        p.offHand.bonuses = fromBitmask(ohBmask, ohFixed.bonuses, ohFixed.maxBonuses);
    }

    // -- Shield --
    var shSet = val(SH_SHIELDSETS, r.u8());
    var shType = val(SH_SHIELDTYPES, r.u8());
    var shBmask = r.u16();
    if (SHIELD_SET_KEYS.indexOf(shSet) !== -1) p.shield.set = shSet;
    if (shType === 'battle' || shType === 'scale') p.shield.type = shType;
    var shData = SHIELD_STATS[p.shield.set];
    var typeKey = p.shield.type === 'scale' ? 'scale' : 'battle';
    var shBonusList = shData ? shData.bonuses[typeKey] : [];
    var shMaxB = shData ? shData.maxBonuses : 0;
    if (shBmask) p.shield.bonuses = fromBitmask(shBmask, shBonusList, shMaxB);

    // -- Oaths * 6 --
    SH_ASLOTS.forEach(function(sk) {
        var o = val(SH_OATHS, r.u8());
        if (SH_OATHS.indexOf(o) !== -1) p.oath[sk] = o;
    });

    // -- Manastones (nibble-packed) --
    var manaFlat = r.nibbles(SH_ALL_MANA_KEYS.length * 3);
    var mi = 0;
    SH_ALL_MANA_KEYS.forEach(function(gk) {
        if (!p.manastones[gk]) p.manastones[gk] = ['none', 'none', 'none'];
        for (var i = 0; i < 3; i++) {
            p.manastones[gk][i] = val(SH_MANAS, manaFlat[mi++]);
        }
    });

    // -- Transform --
    var tf = val(SH_TRANSFORMS, r.u8());
    if (TRANSFORM_KEYS.indexOf(tf) !== -1) p.transform = tf;
    p.transformEnchant = clamp(r.u8(), 0, 20);

    // -- Accessories * 9 --
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

    // -- Minions --
    p.minions = {
        main:      val(SH_MINIONS, r.u8()),
        secondary: val(SH_MINIONS, r.u8())
    };

    // -- Glyph --
    var glyphEnabled = r.u8();
    p.glyph = {
        enabled:    glyphEnabled !== 0,
        bonuses:    [val(SH_GLYPH_BONUSES, r.u8())],
        bonusValues: {},
        extra: {
            attack:      clamp(r.u8(), 0, 250),
            physicalDef: clamp(r.u8(), 0, 250),
            magicalDef:  clamp(r.u8(), 0, 250)
        }
    };

    // -- Owned Forms --
    var formBools = r.bools(ALL_FORM_IDS.length);
    p.ownedForms = {};
    for (var fi = 0; fi < ALL_FORM_IDS.length; fi++) {
        if (formBools[fi]) p.ownedForms[ALL_FORM_IDS[fi]] = true;
    }

    // -- Item Collections (6 * u16) --
    p.collections = p.collections || { itemColl: {} };
    ITEM_COLL_STATS.forEach(function(cs) {
        p.collections.itemColl[cs.key] = clamp(r.u16(), 0, cs.max);
    });

    // -- Collection Levels --
    p.collLevels = {
        normal:   clamp(r.u8(), 0, 10),
        large:    clamp(r.u8(), 0, 10),
        powerful: clamp(r.u8(), 0, 10)
    };

    // -- Relic --
    p.relic = { level: clamp(r.u16(), 1, 300) };

    // -- Traits --
    if (typeof traitSelections === 'undefined') traitSelections = {};
    traitSelections[id] = {};
    [81, 82, 83, 84, 85].forEach(function(lvl) {
        traitSelections[id][lvl] = clamp(r.u8(), 0, 2);
    });

    // -- Skill Buffs (bit-packed) --
    p.skillBuffs = {};
    var allBuffs = getSkillBuffsForClass(cls);
    allBuffs.forEach(function(buff) { p.skillBuffs[buff.key] = !!buff.defaultActive; });
    if (r.remaining() > 0) {
        var sbBools = r.bools(GC_SKILL_KEYS.length);
        for (var si = 0; si < GC_SKILL_KEYS.length; si++) {
            p.skillBuffs[GC_SKILL_KEYS[si]] = sbBools[si];
        }
    }

    // -- Skill Enchant Levels --
    p.skillBuffEnchants = {};
    allBuffs.forEach(function(buff) {
        if (buff.enchant) {
            p.skillBuffEnchants[buff.key] = buff.enchant.defaultLevel;
        }
    });
    if (r.remaining() > 0) {
        var enchCount = r.u8();
        for (var ei = 0; ei < enchCount; ei++) {
            var enchLvl = r.u8();
            if (ei < GC_ENCHANTABLE_KEYS.length) {
                p.skillBuffEnchants[GC_ENCHANTABLE_KEYS[ei]] = enchLvl;
            }
        }
    }

    // -- Bonus Values (u16 per selected bonus, definition order) --
    if (r.remaining() > 0) {
        // Armor * 6
        var apsuInfoD = p.apsuEnabled ? APSU_DATA[cls] : null;
        SH_ASLOTS.forEach(function(sk) {
            var isHighD = (sk === 'helmet' || sk === 'chest' || sk === 'pants');
            var bvListD = isHighD ? FS_BONUSES_HIGH : FS_BONUSES_LOW;
            var apsuOvr = (apsuInfoD && apsuInfoD.slot === sk && apsuInfoD.bonusOverride) ? apsuInfoD.bonusOverride : null;
            p.armor[sk].bonusValues = {};
            bvListD.forEach(function(b) {
                if (p.armor[sk].bonuses && p.armor[sk].bonuses.indexOf(b.key) !== -1) {
                    var maxBV = (apsuOvr && apsuOvr[b.key]) ? apsuOvr[b.key] : b.value;
                    p.armor[sk].bonusValues[b.key] = clamp(r.u16(), 0, maxBV);
                }
            });
        });
        // Main weapon
        var mwBDefsD = (WEAPON_STATS_FIXED[p.mainWeapon.set] || {}).bonuses || [];
        p.mainWeapon.bonusValues = {};
        mwBDefsD.forEach(function(b) {
            if (p.mainWeapon.bonuses && p.mainWeapon.bonuses.indexOf(b.key) !== -1) {
                p.mainWeapon.bonusValues[b.key] = clamp(r.u16(), 0, b.value);
            }
        });
        // Off-hand
        var ohBDefsD = (WEAPON_STATS_FIXED[p.offHand.set] || {}).bonuses || [];
        p.offHand.bonusValues = {};
        ohBDefsD.forEach(function(b) {
            if (p.offHand.bonuses && p.offHand.bonuses.indexOf(b.key) !== -1) {
                p.offHand.bonusValues[b.key] = clamp(r.u16(), 0, b.value);
            }
        });
        // Shield
        var shBDefsD = shData ? shData.bonuses[typeKey] : [];
        p.shield.bonusValues = {};
        shBDefsD.forEach(function(b) {
            if (p.shield.bonuses && p.shield.bonuses.indexOf(b.key) !== -1) {
                p.shield.bonusValues[b.key] = clamp(r.u16(), 0, b.value);
            }
        });
        // Accessories * 9
        ALL_ACCESSORY_KEYS.forEach(function(accKey) {
            var stD = ACC_STATS_TYPE[accKey];
            var sdD = ACCESSORY_STATS[p.accessories[accKey].set];
            var slD = sdD ? sdD[stD] : null;
            var blD = (slD && slD.bonuses) ? slD.bonuses : [];
            p.accessories[accKey].bonusValues = {};
            blD.forEach(function(b) {
                if (p.accessories[accKey].bonuses && p.accessories[accKey].bonuses.indexOf(b.key) !== -1) {
                    p.accessories[accKey].bonusValues[b.key] = clamp(r.u16(), 0, b.value);
                }
            });
        });
        // Glyph
        var glyphBKD = p.glyph.bonuses[0];
        var glyphBDefD = ACC_BONUSES_GLYPH.find(function(b) { return b.key === glyphBKD; });
        if (glyphBDefD) {
            p.glyph.bonusValues[glyphBKD] = clamp(r.u16(), 0, glyphBDefD.value);
        }
    }

    return p;
}

// --- Main decode function --------------------------------------------------
function decodeShareString(s) {
    if (!s || s.length < 4) return false;
    var ver = s.charAt(0);
    if (s.charAt(1) !== '.') return false;
    if (ver !== '6') return false;
    try {
        return decodeShareV6(s.substring(2));
    } catch (e) {
        return false;
    }
}

function decodeShareV6(b64) {
    var r = new ByteReader(b64);

    // -- Global header (4 bytes) --
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

    // -- Multi-set header --
    var numSets = clamp(r.u8(), 2, MAX_SETS);
    var compIdxA = r.u8();
    var compIdxB = r.u8();

    // Read set names
    var names = [];
    for (var ni = 0; ni < numSets; ni++) {
        var nameLen = r.u8();
        var chars = [];
        for (var ci = 0; ci < nameLen; ci++) chars.push(String.fromCharCode(r.u8()));
        names.push(chars.join('') || ('Set ' + (ni + 1)));
    }

    // Build setOrder and setNames
    setOrder = [];
    setNames = {};
    state = {};
    for (var si = 0; si < numSets; si++) {
        var setId = si + 1;
        setOrder.push(setId);
        setNames[setId] = names[si];
    }
    nextSetId = numSets + 1;
    activeSetId = setOrder[0];

    // Comparison pair
    comparisonPair = {
        a: setOrder[clamp(compIdxA, 0, numSets - 1)],
        b: setOrder[clamp(compIdxB, 0, numSets - 1)]
    };

    // -- Decode each profile --
    setOrder.forEach(function(id) {
        state[id] = decodeProfileFromReader(r, cls, id);
    });

    return true;
}


// ===============================================================================
// PUBLIC API
// ===============================================================================

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
