'use strict';

function calculateProfileStats(profileId) {
    var d = calculateDetailedStats(profileId);
    return d.totals;
}

function calculateDetailedStats(profileId) {
    var profile = state[profileId];
    var sources = {
        permanent: emptyStats(),
        weapons: emptyStats(),
        armor: emptyStats(),
        oaths: emptyStats(),
        manastones: emptyStats(),
        transforms: emptyStats(),
        accessories: emptyStats(),
        collections: emptyStats(),
        collLevels: emptyStats(),
        relic: emptyStats(),
        glyph: emptyStats(),
        minion: emptyStats(),
        pasive: emptyStats(),
        trait: emptyStats(),
        skillBuffs: emptyStats()
    };
    if (['gladiator', 'templar'].includes(selectedClass)) {
        sources.permanent.attack += 45;
    }
    if (selectedClass === 'chanter') {
        sources.permanent.attack += 18;
    }
    if (selectedClass === 'sorcerer') {
        sources.permanent.attack += 543;
    }
    if (selectedClass === 'bard') {
        sources.permanent.attack += 300;
    }

    // -- glyph base
    sources.glyph.attack += 50;
    sources.glyph.physicalDef += 50;
    sources.glyph.magicalDef += 50;

    // -- cubes
    sources.permanent.hp += 5500;
    sources.permanent.healingBoost += 133;
    sources.permanent.attack += 417;
    sources.permanent.physicalDef += 417;
    sources.permanent.magicalDef += 417;
    sources.permanent.accuracy += 606;
    sources.permanent.evasion += 1210;
    sources.permanent.parry += 1210;
    sources.permanent.block += 1210;
    sources.permanent.magicResist += 1210;

    // -- base DP
    sources.permanent.dp += 4000;

    // Sum armor stats across all 6 slots
    ARMOR_SLOTS.forEach(function(slot) {
        var piece = profile.armor[slot.key];
        var armorStats = getArmorSlotStats(profile.armorType, piece.set, slot.key, piece.enchant, piece.bonuses);
        STAT_KEYS.forEach(function(k) { sources.armor[k] += (armorStats[k] || 0); });
    });

    // ── Weapon stats (base/bonus/enchant split) ──
    var mwSet = profile.mainWeapon.set;
    var mwType = weaponConfig.mainType;
    var mainParts = getWeaponParts(mwSet, mwType, profile.mainWeapon.enchant, profile.mainWeapon.bonuses);
    var ohType = weaponConfig.offHandType;
    var ohSet = profile.offHand.set;

    if (ohType === 'none') {
        STAT_KEYS.forEach(function(k) {
            sources.weapons[k] += mainParts.base[k] + mainParts.bonus[k] + mainParts.enchant[k];
        });

    } else if (ohType === 'shield') {
        STAT_KEYS.forEach(function(k) {
            sources.weapons[k] += mainParts.base[k] + mainParts.bonus[k] + mainParts.enchant[k];
        });
        var sh = profile.shield;
        var sStats = getShieldStats(sh.set, sh.type, sh.bonuses, isPhysicalClass(selectedClass));
        STAT_KEYS.forEach(function(k) { sources.weapons[k] += (sStats[k] || 0); });

    } else if (ohType === 'fuse') {
        var fuseParts = getWeaponParts(ohSet, mwType, profile.offHand.enchant, profile.offHand.bonuses);
        STAT_KEYS.forEach(function(k) {
            sources.weapons[k] += mainParts.base[k] + mainParts.bonus[k] + mainParts.enchant[k] + fuseParts.bonus[k];
        });
        sources.weapons.attack += Math.floor(fuseParts.baseAtk / 10);

    } else if (ohType === 'weapon') {
        var ohParts = getWeaponParts(ohSet, weaponConfig.offHandWeaponType, profile.offHand.enchant, profile.offHand.bonuses);
        if (selectedClass === 'gunner') {
            STAT_KEYS.forEach(function(k) { sources.weapons[k] += mainParts.base[k]; });
        } else {
            STAT_KEYS.forEach(function(k) {
                sources.weapons[k] += Math.max(mainParts.base[k], ohParts.base[k]);
            });
        }
        STAT_KEYS.forEach(function(k) {
            sources.weapons[k] += mainParts.bonus[k] + mainParts.enchant[k]
                      +  ohParts.bonus[k]   + ohParts.enchant[k];
        });
    }

    // Oath pair bonuses
    OATH_PAIRS.forEach(function(pair, pairIdx) {
        var effectiveOath = getEffectiveOath(profile.oath, pair[0], pair[1]);
        var ob = OATH_BONUS[effectiveOath];
        if (ob) {
            sources.oaths.hp += ob.hp;
            if (pairIdx === 0) {
                sources.oaths.accuracy += ob.acc;
            } else if (pairIdx === 1) {
                sources.oaths.physicalDef += ob.def;
                sources.oaths.magicalDef  += ob.def;
            } else if (pairIdx === 2) {
                sources.oaths.attack += ob.attack;
            }
        }
    });

    // Manastone bonuses
    var allGearKeys = ARMOR_SLOT_KEYS.concat(['mainWeapon', 'offHand']).concat(ALL_ACCESSORY_KEYS);
    allGearKeys.forEach(function(gk) {
        var setKey;
        if (gk === 'mainWeapon') setKey = profile.mainWeapon.set;
        else if (gk === 'offHand') setKey = profile.offHand.set;
        else if (profile.armor[gk]) setKey = profile.armor[gk].set;
        else if (profile.accessories && profile.accessories[gk]) setKey = profile.accessories[gk].set;
        else setKey = 'fighting-spirit';
        var slotCount = getManastoneSlotCount(setKey);
        var ms = profile.manastones[gk] || [];
        for (var si = 0; si < slotCount; si++) {
            var mKey = ms[si];
            if (mKey && mKey !== 'none') {
                var mDef = MANASTONES.find(function(m) { return m.key === mKey; });
                if (mDef) sources.manastones[mDef.stat] += mDef.value;
            }
        }
    });

    // Transformation stats
    if (profile.transform && profile.transform !== 'none') {
        var tfStats = getTransformComparisonStats(profile.transform, selectedClass, profile.transformEnchant != null ? profile.transformEnchant : 0);
        STAT_KEYS.forEach(function(k) { sources.transforms[k] += (tfStats[k] || 0); });
    }

    // Accessories
    var isPhys = isPhysicalClass(selectedClass);
    ALL_ACCESSORY_KEYS.forEach(function(accKey) {
        var acc = profile.accessories[accKey];
        if (!acc) return;
        var statsType = ACC_STATS_TYPE[accKey];
        var setData = ACCESSORY_STATS[acc.set];
        if (!setData) return;
        var slotData = setData[statsType];
        if (!slotData) return;
        for (var k in slotData.base) { sources.accessories[k] += slotData.base[k]; }
        if (slotData.fixed) {
            for (var k in slotData.fixed) { sources.accessories[k] += slotData.fixed[k]; }
        }
        if (slotData.physDef) {
            if (isPhys) { sources.accessories.physicalDef += slotData.physDef; }
            else { sources.accessories.magicalDef += slotData.physDef; }
        }
        if (slotData.bonuses && acc.bonuses) {
            acc.bonuses.forEach(function(bk) {
                var b = slotData.bonuses.find(function(x) { return x.key === bk; });
                if (b) sources.accessories[b.stat] += b.value;
            });
        }
    });
    // Starshine set bonuses
    if (profile.accessories.feather.set === 'starshine' &&
        profile.accessories.wings.set === 'starshine' &&
        profile.accessories.bracelet.set === 'starshine') {
        sources.accessories.attack += 190;
        sources.accessories.physicalDef += isPhys ? 375 : 650;
        sources.accessories.magicalDef += isPhys ? 650 : 375;
    }
    var hasStarEarring = profile.accessories.earring1.set === 'starshine' || profile.accessories.earring2.set === 'starshine';
    var hasStarRing = profile.accessories.ring1.set === 'starshine' || profile.accessories.ring2.set === 'starshine';
    if (hasStarEarring && profile.accessories.necklace.set === 'starshine' &&
        hasStarRing && profile.accessories.belt.set === 'starshine') {
        sources.accessories.attack += 335;
    }

    // Glyph special handling
    var glyph = profile.glyph;
    if (glyph && glyph.enabled !== false) {
        // Apply selected bonus
        if (glyph.bonuses && glyph.bonuses.length) {
            var b = ACC_BONUSES_GLYPH.find(function(x) { return x.key === glyph.bonuses[0]; });
            if (b) sources.glyph[b.stat] += b.value;
        }
        // Apply extra stats
        if (glyph.extra) {
            ['attack', 'physicalDef', 'magicalDef'].forEach(function(stat) {
                sources.glyph[stat] += glyph.extra[stat] || 0;
            });
        }
    }

    var mStats = getMinionStats(profile.minions.main, profile.minions.secondary);
    STAT_KEYS.forEach(function(k) { 
        sources.minion[k] += (mStats[k] || 0); 
    });

    // ── Transformation Collection bonuses (auto-activated from owned forms) ──
    var ownedForms = profile.ownedForms || {};
    TF_COLLECTIONS.forEach(function(coll) {
        if (!isCollectionComplete(coll, ownedForms)) return;
            if (coll.stat === 'physicalAttack' && isPhys){
                sources.collections.attack += coll.value;
            } else if (coll.stat === 'magicAttack' && !isPhys) {
                sources.collections.attack += coll.value;
            } else if (sources.collections[coll.stat] !== undefined){
                sources.collections[coll.stat] += coll.value;
            }
    });

    // ── Item Collection bonuses (numeric input) ──
    var itemColl = (profile.collections && profile.collections.itemColl) ? profile.collections.itemColl : {};

    ITEM_COLL_STATS.forEach(function(cs) {
        var val = parseInt(itemColl[cs.key]) || 0;
        // Handle crit/attack/accuracy split by class type
        if (cs.key === 'critStrike' && isPhys) {
            sources.collections[cs.statKey] += val;
        } else if (cs.key === 'critSpell' && !isPhys) {
            sources.collections[cs.statKey] += val;
        } else if (cs.key === 'physicalAttack' && isPhys) {
            sources.collections[cs.statKey] += val;
        } else if (cs.key === 'magicAttack' && !isPhys) {
            sources.collections[cs.statKey] += val;
        } else if (
            cs.key !== 'critStrike' && cs.key !== 'critSpell' &&
            cs.key !== 'physicalAttack' && cs.key !== 'magicAttack'
        ) {
            sources.collections[cs.statKey] += val;
        }
    });

    var lv = profile.collLevels || {normal:6,large:6,powerful:6};

    function sum(arr,l){
        var s=0;
        for(var i=0;i<l;i++) s+=arr[i];
        return s;
    }

    /* NORMAL (accuracy) */
    sources.collLevels.accuracy += sum([0,10,15,20,30,45],lv.normal);

    /* LARGE (defences) */
    var defSum = sum([0,6,10,12,14,18],lv.large);
    sources.collLevels.physicalDef += defSum;
    sources.collLevels.magicalDef  += defSum;

    /* POWERFUL (attack) */
    sources.collLevels.attack += sum([0,8,12,16,20,24],lv.powerful);

    // ── Relic stats ──
    if (profile.relic && profile.relic.level > 0) {
        var relicStats = getRelicStats(profile.relic.level, isPhys);
        STAT_KEYS.forEach(function(k) { sources.relic[k] += (relicStats[k] || 0); });
    }

    // Daevanion trait stats: sum all selected traits for this profile
    // Defensive: ensure sources.trait is always initialized
    if (typeof sources.trait !== 'object' || sources.trait == null) {
        sources.trait = emptyStats();
    }
    if (typeof traitSelections !== 'undefined') {
        var className = selectedClass;
        var pid = profileId;
        // Defensive: check DAEVANION_SKILLS structure
        if (!DAEVANION_SKILLS || !DAEVANION_SKILLS[className] || Object.keys(DAEVANION_SKILLS[className]).length === 0) {
            console.warn('DAEVANION_SKILLS is empty or missing for class', className);
        }
        [81, 82, 83, 84, 85].forEach(function(lvl) {
            var idx = traitSelections[pid] && typeof traitSelections[pid][lvl] === 'number' ? traitSelections[pid][lvl] : 0;
            var skills = (DAEVANION_SKILLS && DAEVANION_SKILLS[className] && DAEVANION_SKILLS[className][lvl]) ? DAEVANION_SKILLS[className][lvl] : [];
            // Defensive: idx may be out of bounds if skills is empty or malformed
            if (!Array.isArray(skills) || skills.length === 0) {
                // No skills for this class/level
                return;
            }
            if (typeof idx !== 'number' || idx < 0 || idx >= skills.length) {
                // idx out of range, skip
                return;
            }
            var skill = skills[idx];
            if (skill && skill.id) {
                var stats = getDaevanionSkillStats(className, lvl, skill.id);
                if (typeof stats !== 'object' || stats == null) stats = {};
                STAT_KEYS.forEach(function(k) {
                    if (typeof sources.trait[k] !== 'number') sources.trait[k] = 0;
                    sources.trait[k] += (typeof stats[k] === 'number' ? stats[k] : 0);
                });
            }
        });
    }

    // ── Skill Buff stats ──
    var sb = profile.skillBuffs || {};
    var allBuffs = getSkillBuffsForClass(selectedClass);
    var doubleMinionBuff = sb['joltingStrike'] && sb['soulWave'];
    allBuffs.forEach(function(buff) {
        if (!sb[buff.key]) return;
        if (!buff.stats) return;
        STAT_KEYS.forEach(function(k) {
            if (buff.stats[k]) sources.skillBuffs[k] += buff.stats[k];
        });
        if (doubleMinionBuff) {
            sources.skillBuffs.pvpAttack -= 150;
            sources.skillBuffs.pveAttack -= 150;
        }
    });

    // Compute totals from sources
    var totals = emptyStats();
    var srcKeys = Object.keys(sources);
    STAT_KEYS.forEach(function(k) {
        srcKeys.forEach(function(sk) { totals[k] += sources[sk][k]; });
    });

    return { totals: totals, sources: sources };
}
