'use strict';

function calculateDetailedStats(profileId) {
    var profile = state[profileId];
    var sources = {
        passive: emptyStats(),
        passiveBonus: emptyStats(),
        cubes: emptyStats(),
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
        trait: emptyStats(),
        skillBuffs: emptyStats()
    };
    var hpBuckets = {};
    Object.keys(sources).forEach(function(key) {
        hpBuckets[key] = { base: 0, bonus: 0 };
    });

    function addHpToSource(sourceKey, amount, bucketType) {
        if (!amount) return;
        sources[sourceKey].hp += amount;
        if (bucketType) hpBuckets[sourceKey][bucketType] += amount;
    }

    function addStatsToSource(sourceKey, stats, hpBucketType) {
        STAT_KEYS.forEach(function(k) { sources[sourceKey][k] += (stats[k] || 0); });
        if (hpBucketType && stats.hp) hpBuckets[sourceKey][hpBucketType] += stats.hp;
    }

    function getBuffEligibleHp() {
        return hpBuckets.passive.base
            + hpBuckets.armor.base
            + hpBuckets.accessories.base;
    }
    
    // -- Class passives (permanent, always-on bonuses) --
    if (['gladiator', 'templar'].includes(selectedClass)) {
        sources.passive.attack += 45;
        sources.passive.accuracy += 180;
        sources.passive.parry += 80;
        sources.passive.crit += 2;
    }
    if (selectedClass === 'gladiator') {
        addHpToSource('passive', 25547, 'base');
        sources.passive.block += 200;
    }
    if (selectedClass === 'templar') {
        addHpToSource('passive', 26577, 'base');
        sources.passive.magicalDef += 60;
        sources.passive.block += 300;
    }
    if (selectedClass === 'assassin') {
        addHpToSource('passive', 20800, 'base');
        sources.passive.crit += 50;
        sources.passive.magicResist += 60;
        sources.passive.accuracy += 180;
    }
    if (selectedClass === 'ranger') {
        addHpToSource('passive', 16177, 'base');
        sources.passive.accuracy += 300;
        sources.passive.parry += 80;
    }
    if (selectedClass === 'sorcerer') {
        addHpToSource('passive', 14972, 'base');
        sources.passive.attack += 543;
        sources.passive.magicalDef += 300;
        sources.passive.concentration += 25;
    }
    if (selectedClass === 'spiritmaster') {
        addHpToSource('passive', 16124, 'base');
        sources.passive.attack += 555;
        sources.passive.accuracy += 555;
        sources.passive.magicalDef += 500;
        sources.passive.concentration += 25;
    }
    if (selectedClass === 'cleric') {
        addHpToSource('passive', 18549, 'base');
    }
    if (selectedClass === 'chanter') {
        addHpToSource('passive', 24266, 'base');
        sources.passive.attack += 18;
        sources.passive.magicalDef += 60;
    }
    if (selectedClass === 'aethertech') {
        addHpToSource('passive', 24266, 'base');
        sources.passive.evasion += 20;
    }
    if (selectedClass === 'gunner') {
        addHpToSource('passive', 20834, 'base');
    }
    if (selectedClass === 'bard') {
        addHpToSource('passive', 18488, 'base');
        sources.passive.attack += 300;
        sources.passive.magicalDef += 300;
    }
    if (selectedClass === 'painter') {
        addHpToSource('passive', 19644, 'base');
        sources.passive.magicalDef += 300;
    }
    
    // -- base stats --
    sources.passive.accuracy += 1275;
    sources.passive.magicResist += 1275;
    sources.passive.evasion += 1275;
    sources.passive.parry += 1275;
    sources.passive.block += 1275;

    // -- glyph base
    sources.glyph.attack += 50;
    sources.glyph.physicalDef += 50;
    sources.glyph.magicalDef += 50;

    // -- cubes
    addHpToSource('cubes', 5500, 'bonus');
    sources.cubes.healingBoost += 133;
    sources.cubes.attack += 417;
    sources.cubes.physicalDef += 417;
    sources.cubes.magicalDef += 417;
    sources.cubes.accuracy += 606;
    sources.cubes.evasion += 1210;
    sources.cubes.parry += 1210;
    sources.cubes.block += 1210;
    sources.cubes.magicResist += 1210;

    // -- base DP
    sources.passive.dp += 4000;

    // Sum armor stats across all 6 slots
    ARMOR_SLOTS.forEach(function(slot) {
        var piece = profile.armor[slot.key];
        var armorStats = getArmorSlotStats(profile.armorType, piece.set, slot.key, piece.enchant, piece.bonuses, piece.bonusValues);
        STAT_KEYS.forEach(function(k) { sources.armor[k] += (armorStats[k] || 0); });
        hpBuckets.armor.base += armorStats.hpBase || 0;
        hpBuckets.armor.bonus += armorStats.hpBonus || 0;
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
                        if (ak === 'hp') {
                            addHpToSource('armor', apsuInfo.stats[ak], 'base');
                        } else {
                            sources.armor[ak] += apsuInfo.stats[ak];
                        }
                    }
                }
            }
        }
    }

    // -- Weapon stats (base/bonus/enchant split) --
    var weaponCfg = getProfileWeaponConfig(profile);
    var mwSet = profile.mainWeapon.set;
    var mwType = weaponCfg.mainType;
    var mainParts = getWeaponParts(mwSet, mwType, profile.mainWeapon.enchant, profile.mainWeapon.bonuses, profile.mainWeapon.bonusValues);
    var ohType = getEffectiveOffHandType(profile);
    var ohSet = profile.offHand.set;

    function addWeaponComponent(component, hpBucketType) {
        addStatsToSource('weapons', component, hpBucketType);
    }

    if (ohType === 'none') {
        addWeaponComponent(mainParts.base, 'base');
        addWeaponComponent(mainParts.bonus, 'bonus');
        addWeaponComponent(mainParts.enchant, 'bonus');

    } else if (ohType === 'shield') {
        addWeaponComponent(mainParts.base, 'base');
        addWeaponComponent(mainParts.bonus, 'bonus');
        addWeaponComponent(mainParts.enchant, 'bonus');
        var sh = profile.shield;
        var sStats = getShieldStats(sh.set, sh.type, sh.bonuses, isPhysicalClass(selectedClass), sh.bonusValues);
        STAT_KEYS.forEach(function(k) { sources.weapons[k] += (sStats[k] || 0); });
        hpBuckets.weapons.base += sStats.hpBase || 0;
        hpBuckets.weapons.bonus += sStats.hpBonus || 0;

    } else if (ohType === 'fuse') {
        var fuseParts = getWeaponParts(ohSet, mwType, profile.offHand.enchant, profile.offHand.bonuses, profile.offHand.bonusValues);
        addWeaponComponent(mainParts.base, 'base');
        addWeaponComponent(mainParts.bonus, 'bonus');
        addWeaponComponent(mainParts.enchant, 'bonus');
        addWeaponComponent(fuseParts.bonus, 'bonus');
        sources.weapons.attack += Math.floor(fuseParts.baseAtk / 10);

    } else if (ohType === 'weapon') {
        var ohParts = getWeaponParts(ohSet, weaponCfg.offHandWeaponType, profile.offHand.enchant, profile.offHand.bonuses, profile.offHand.bonusValues);
        if (selectedClass === 'gunner') {
            addWeaponComponent(mainParts.base, 'base');
        } else {
            STAT_KEYS.forEach(function(k) {
                sources.weapons[k] += Math.max(mainParts.base[k], ohParts.base[k]);
            });
        }
        addWeaponComponent(mainParts.bonus, 'bonus');
        addWeaponComponent(mainParts.enchant, 'bonus');
        addWeaponComponent(ohParts.bonus, 'bonus');
        addWeaponComponent(ohParts.enchant, 'bonus');
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
        if (slotData.base.hp) hpBuckets.accessories.base += slotData.base.hp;
        if (slotData.fixed) {
            for (var k in slotData.fixed) { sources.accessories[k] += slotData.fixed[k]; }
            if (slotData.fixed.hp) hpBuckets.accessories.bonus += slotData.fixed.hp;
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
                    if (b.stat === 'hp') hpBuckets.accessories.bonus += bv;
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
    var buffEligibleHp = getBuffEligibleHp();
    if(selectedClass === 'templar') {
        var passive25perc = Math.floor(buffEligibleHp*25/100);
        addHpToSource('passiveBonus', passive25perc, 'bonus');
    } else if (selectedClass === 'gladiator') {
        var passive15perc = Math.floor(buffEligibleHp*15/100);
        addHpToSource('passiveBonus', passive15perc, 'bonus');
    }
    allBuffs.forEach(function(buff) {
        if (!sb[buff.key]) return;
        if (!buff.stats) return;
        STAT_KEYS.forEach(function(k) {
            if (buff.stats[k]) sources.skillBuffs[k] += buff.stats[k];
        });
        // Apply enchant bonus on top of base stats
        if (buff.enchant) {
            var enchLevel = typeof sbe[buff.key] === 'number' ? sbe[buff.key] : buff.enchant.defaultLevel;
            if (buff.enchant.stats) {
                // New format: multiple stats
                for (var stat in buff.enchant.stats) {
                    if (STAT_KEYS.indexOf(stat) !== -1) {
                        var enchBonus = enchLevel * buff.enchant.stats[stat];
                        sources.skillBuffs[stat] += enchBonus;
                    }
                }
            } else if (buff.enchant.stat) {
                // Old format: single stat
                var enchBonus = enchLevel * buff.enchant.perLevel;
                if (STAT_KEYS.indexOf(buff.enchant.stat) !== -1) {
                    sources.skillBuffs[buff.enchant.stat] += enchBonus;
                }
            }
        }
        if (doubleMinionBuff) {
            sources.skillBuffs.pvpAttack -= 150;
            sources.skillBuffs.pveAttack -= 150;
        }

        if (buff.stats.hpIncreasePercent) {
            sources.skillBuffs.hp += Math.floor(buffEligibleHp * buff.stats.hpIncreasePercent / 100);
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

    return {
        totals: totals,
        sources: sources,
        hpBuckets: hpBuckets,
        hpBreakdown: {
            buffEligible: buffEligibleHp,
            bonus: totals.hp - buffEligibleHp
        }
    };
}
