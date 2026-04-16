'use strict';

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
    
    // -- Class passives (permanent, always-on bonuses) --
    if (['gladiator', 'templar'].includes(selectedClass)) {
        sources.permanent.attack += 45;
        //sources.permanent.hpPercent = 5;
        sources.permanent.hp += 2311;
        sources.permanent.accuracy += 180;
        sources.permanent.parry += 80;
        sources.permanent.crit += 2;
    }
    if (selectedClass === 'gladiator') {
        sources.permanent.block += 200;
    }
    if (selectedClass === 'templar') {
        sources.permanent.magicalDef += 60;
        sources.permanent.block += 300;
    }
    if (selectedClass === 'assassin') {
        sources.permanent.crit += 50;
        sources.permanent.magicResist += 60;
        sources.permanent.accuracy += 180;
    }
    if (selectedClass === 'ranger') {
        sources.permanent.accuracy += 300;
        sources.permanent.parry += 80;
    }
    if (selectedClass === 'chanter') {
        sources.permanent.attack += 18;
        sources.permanent.magicalDef += 60;
    }
    if (selectedClass === 'sorcerer') {
        sources.permanent.attack += 543;
        sources.permanent.magicalDef += 300;
        sources.permanent.concentration += 25;
    }
    if (selectedClass === 'spiritmaster') {
        sources.permanent.attack += 555;
        sources.permanent.accuracy += 555;
        sources.permanent.magicalDef += 500;
        sources.permanent.concentration += 25;
    }
    if (selectedClass === 'bard') {
        sources.permanent.attack += 300;
        sources.permanent.magicalDef += 300;
    }
    if (selectedClass === 'painter') {
        sources.permanent.magicalDef += 300;
    }
    if (selectedClass === 'aethertech') {
        sources.permanent.evasion += 20;
    }
    
    // -- base stats --
    //TODO: check for every class, applies to AT only atm.
    sources.permanent.hp += 24266; // 25547 - 1281
    sources.permanent.accuracy += 1275;
    sources.permanent.magicResist += 1275;
    sources.permanent.evasion += 1275;
    sources.permanent.parry += 1275;
    sources.permanent.block += 1275;

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
        var armorStats = getArmorSlotStats(profile.armorType, piece.set, slot.key, piece.enchant, piece.bonuses, piece.bonusValues);
        STAT_KEYS.forEach(function(k) { sources.armor[k] += (armorStats[k] || 0); });
    });

    // -- Apsu Illusion stats (flat deltas only; bonus overrides are handled
    //    via elevated bonusValues that getArmorSlotStats already reads) --
    if (profile.apsuEnabled) {
        var apsuInfo = APSU_DATA[selectedClass];
        if (apsuInfo) {
            var apsuSlotPiece = profile.armor[apsuInfo.slot];
            // Only apply when the Apsu slot has Fighting Spirit equipped
            if (apsuSlotPiece && apsuSlotPiece.set === 'fighting-spirit') {
                for (var ak in apsuInfo.stats) {
                    if (apsuInfo.stats.hasOwnProperty(ak) && typeof sources.armor[ak] === 'number') {
                        sources.armor[ak] += apsuInfo.stats[ak];
                    }
                }
            }
        }
    }

    // -- Weapon stats (base/bonus/enchant split) --
    var mwSet = profile.mainWeapon.set;
    var mwType = weaponConfig.mainType;
    var mainParts = getWeaponParts(mwSet, mwType, profile.mainWeapon.enchant, profile.mainWeapon.bonuses, profile.mainWeapon.bonusValues);
    var ohType = getEffectiveOffHandType(profile);
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
        var sStats = getShieldStats(sh.set, sh.type, sh.bonuses, isPhysicalClass(selectedClass), sh.bonusValues);
        STAT_KEYS.forEach(function(k) { sources.weapons[k] += (sStats[k] || 0); });

    } else if (ohType === 'fuse') {
        var fuseParts = getWeaponParts(ohSet, mwType, profile.offHand.enchant, profile.offHand.bonuses, profile.offHand.bonusValues);
        STAT_KEYS.forEach(function(k) {
            sources.weapons[k] += mainParts.base[k] + mainParts.bonus[k] + mainParts.enchant[k] + fuseParts.bonus[k];
        });
        sources.weapons.attack += Math.floor(fuseParts.baseAtk / 10);

    } else if (ohType === 'weapon') {
        var ohParts = getWeaponParts(ohSet, weaponConfig.offHandWeaponType, profile.offHand.enchant, profile.offHand.bonuses, profile.offHand.bonusValues);
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
        // Skip oath if either armor piece in the pair is 'none'
        var slot1Set = profile.armor[pair[0]] ? profile.armor[pair[0]].set : 'none';
        var slot2Set = profile.armor[pair[1]] ? profile.armor[pair[1]].set : 'none';
        if (slot1Set === 'none' || slot2Set === 'none') return;
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
    var effectiveOH = getEffectiveOffHandType(profile);
    var allGearKeys = ARMOR_SLOT_KEYS.concat(['mainWeapon']).concat(ALL_ACCESSORY_KEYS);
    if (effectiveOH !== 'none') allGearKeys.splice(allGearKeys.indexOf('mainWeapon') + 1, 0, 'offHand');
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
                if (b) {
                    var bv = (acc.bonusValues && typeof acc.bonusValues[bk] === 'number') ? acc.bonusValues[bk] : b.value;
                    sources.accessories[b.stat] += bv;
                }
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
            if (b) {
                var bv = (glyph.bonusValues && typeof glyph.bonusValues[glyph.bonuses[0]] === 'number') ? glyph.bonusValues[glyph.bonuses[0]] : b.value;
                sources.glyph[b.stat] += bv;
            }
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

    // -- Transformation Collection bonuses (auto-activated from owned forms) --
    var ownedForms = profile.ownedForms || {};
    TF_COLLECTIONS.forEach(function(coll) {
        if (!isCollectionComplete(coll, ownedForms)) return;
            if (coll.stat === 'physicalAttack' && isPhys){
                sources.collections.attack += coll.value;
            } else if (coll.stat === 'magicAttack' && !isPhys) {
                sources.collections.attack += coll.value;
            } else if (coll.stat === 'physicalAccuracy' && isPhys) {
                sources.collections.accuracy += coll.value;
            } else if (coll.stat === 'magicAccuracy' && !isPhys) {
                sources.collections.accuracy += coll.value;
            } else if (sources.collections[coll.stat] !== undefined){
                sources.collections[coll.stat] += coll.value;
            }
    });

    // -- Item Collection bonuses (numeric input) --
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
        } else if (cs.key === 'physicalAccuracy' && isPhys){
            sources.collections[cs.statKey] += val;
        } else if (cs.key === 'magicAccuracy' && !isPhys){
            sources.collections[cs.statKey] += val;
        } else if (
            cs.key !== 'critStrike' && cs.key !== 'critSpell' &&
            cs.key !== 'physicalAttack' && cs.key !== 'magicAttack' &&
            cs.key !== 'physicalAccuracy' && cs.key !== 'magicAccuracy'
        ) {
            sources.collections[cs.statKey] += val;
        }
    });

    var lv = profile.collLevels || {normal:7,large:7,powerful:7};

    function sum(arr,l){
        var s=0;
        for(var i=0;i<l;i++) s+=arr[i];
        return s;
    }

    /* NORMAL (accuracy) */
    sources.collLevels.accuracy += sum([0,10,15,20,30,45,60],lv.normal);

    /* LARGE (defences) */
    var defSum = sum([0,6,10,12,14,18,22],lv.large);
    sources.collLevels.physicalDef += defSum;
    sources.collLevels.magicalDef  += defSum;

    /* POWERFUL (attack) */
    sources.collLevels.attack += sum([0,8,12,16,20,24,28],lv.powerful);

    // -- Relic stats --
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

    // -- Skill Buff stats --
    var sb = profile.skillBuffs || {};
    var sbe = profile.skillBuffEnchants || {};
    var allBuffs = getSkillBuffsForClass(selectedClass);
    var doubleMinionBuff = sb['joltingStrike'] && sb['soulWave'];
    allBuffs.forEach(function(buff) {
        if (!sb[buff.key]) return;
        if (!buff.stats) return;
        STAT_KEYS.forEach(function(k) {
            if (buff.stats[k]) sources.skillBuffs[k] += buff.stats[k];
        });
        // Apply enchant bonus on top of base stats
        if (buff.enchant) {
            var enchLevel = typeof sbe[buff.key] === 'number' ? sbe[buff.key] : buff.enchant.defaultLevel;
            var enchBonus = enchLevel * buff.enchant.perLevel;
            if (STAT_KEYS.indexOf(buff.enchant.stat) !== -1) {
                sources.skillBuffs[buff.enchant.stat] += enchBonus;
            }
        }
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

    // -- Post-processing: percentage modifiers from skill buffs --
    allBuffs.forEach(function(buff) {
        if (!sb[buff.key] || !buff.stats) return;
        if (buff.stats.physicalDefPercentRed) {
            totals.physicalDef -= Math.floor(totals.physicalDef * buff.stats.physicalDefPercentRed / 100);
        }
    });

    // -- Post-processing: HP% passive (gladiator/templar) --
    // TODO: verify in-game whether this applies to total HP or only base/gear HP
    // if (sources.permanent.hpPercent) {
    //     totals.hp += Math.floor(totals.hp * sources.permanent.hpPercent / 100);
    // }

    return { totals: totals, sources: sources };
}
