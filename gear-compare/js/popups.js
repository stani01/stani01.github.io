'use strict';

// Calculate crit percentage from crit stat (Formula: ROUNDDOWN((X*170)/(24000+X)))
function calculateCritPercentage(critStat) {
    if (critStat <= 0) return 0;
    var percentage = Math.floor((critStat * 170) / (24000 + critStat));
    return Math.min(percentage, 100);
}

var SOURCE_LABELS = [
      { key: 'passive',     icon: '../assets/icons/icon_ui_equipment.png', name: 'Passive' },
      { key: 'passiveBonus',icon: '../assets/icons/icon_ui_equipment.png', name: 'Passive Bonus' },
      { key: 'weapons',     icon: '../assets/icons/icon_ui_equipment.png', name: 'Weapons' },
      { key: 'armor',       icon: '../assets/icons/icon_ui_equipment.png', name: 'Armor' },
      { key: 'accessories', icon: '../assets/icons/icon_ui_equipment.png', name: 'Accessories' },
      { key: 'glyph',       icon: '../assets/icons/icon_item_equip_badge_a01.png', name: 'Glyph' },
      { key: 'oaths',       icon: '../assets/icons/icon_item_equipment_skill_stone.png', name: 'Oaths' },
      { key: 'manastones',  icon: '../assets/icons/icon_item_matter_option_f01.png', name: 'Manastones' },
      { key: 'transforms',  icon: '../assets/icons/icon_ui_transforms.png', name: 'Transforms' },
      { key: 'collections', icon: '../assets/icons/icon_ui_collections.png', name: 'Collections' },
      { key: 'collLevels',  icon: '../assets/icons/icon_ui_collections.png', name: 'Item Col Levels' },
      { key: 'relic',       icon: '../assets/icons/icon_item_sacredstone_levelup.png', name: 'Relic' },
      { key: 'minion',      icon: '../assets/icons/icon_ui_minion.png', name: 'Minion' },
      { key: 'cubes',       icon: '../assets/icons/icon_ui_cube.png', name: 'Cube' },
      { key: 'trait',       icon: '../assets/icons/icon_ui_trait.png', name: 'Trait' },
      { key: 'skillBuffs', icon: '../assets/icons/icon_ui_skills.png', name: 'Skill Buffs' },
];

function getHpTooltipText(breakdown) {
    if (!breakdown) return '';
    return 'White/Base HP: ' + formatNum(breakdown.base || 0) + '\nGreen/Bonus HP: ' + formatNum(breakdown.bonus || 0);
}

function getHpCellBreakdown(details) {
    if (!details || !details.hpBreakdown) return null;
    return {
        base: details.hpBreakdown.buffEligible || 0,
        bonus: details.hpBreakdown.bonus || 0
    };
}

function getHpSourceBreakdown(details, sourceKey) {
    if (!details || !details.hpBuckets || !details.hpBuckets[sourceKey]) return null;
    var buckets = details.hpBuckets[sourceKey];
    return {
        base: buckets.base || 0,
        bonus: buckets.bonus || 0
    };
}

function updateComparison() {
    var idA = comparisonPair.a;
    var idB = comparisonPair.b;
    if (!state[idA] || !state[idB]) return;
    var d1 = calculateDetailedStats(idA);
    var d2 = calculateDetailedStats(idB);
    var stats1 = d1.totals, stats2 = d2.totals;
    var src1 = d1.sources, src2 = d2.sources;
    var hpTotal1 = getHpCellBreakdown(d1);
    var hpTotal2 = getHpCellBreakdown(d2);
    var panel = document.getElementById('comparison-panel');
    var nameA = getSetName(idA);
    var nameB = getSetName(idB);

    var wins1 = 0, wins2 = 0, ties = 0;
    COMPARISON_STATS.forEach(function(stat) {
        var v1 = stats1[stat.key], v2 = stats2[stat.key];
        if (v1 > v2) wins1++;
        else if (v2 > v1) wins2++;
        else ties++;
    });

    var html = '<div class="gc-comparison-header">';
    html += '<h2>📈 Stat Comparison</h2>';
    // Pairwise selector
    html += '<div class="gc-comp-pair-selector">';
    html += '<select class="gc-comp-pair-select" id="gc-comp-pair-a" onchange="GC.setComparisonPair(\'a\',parseInt(this.value))">';
    setOrder.forEach(function(id) {
        html += '<option value="' + id + '"' + (id === idA ? ' selected' : '') + '>' + getSetName(id) + '</option>';
    });
    html += '</select>';
    html += '<span class="gc-comp-pair-vs">vs</span>';
    html += '<select class="gc-comp-pair-select" id="gc-comp-pair-b" onchange="GC.setComparisonPair(\'b\',parseInt(this.value))">';
    setOrder.forEach(function(id) {
        html += '<option value="' + id + '"' + (id === idB ? ' selected' : '') + '>' + getSetName(id) + '</option>';
    });
    html += '</select>';
    html += '</div>';
    html += '</div>';

    // Scrollable area wrapping the table
    html += '<div class="gc-comparison-scroll">';
    html += '<table class="gc-comp-table">';
    html += '<thead>';

    // 1. New Row for Summary Badges (Aligned to columns)
    html += '<tr class="gc-comp-summary-row">';
    html += '<th></th>'; // Empty cell over the 'Stat' column to shift everything right
    html += '<th class="gc-comp-summary-cell" style="text-align: center; padding-bottom: 15px;"><span class="gc-comp-badge gc-comp-badge-1">' + wins1 + ' ' + nameA + '</span></th>';

    html += '<th class="gc-comp-summary-cell" style="text-align: center; padding-bottom: 15px;">';
    if (ties > 0) html += '<span class="gc-comp-badge gc-comp-badge-tie">' + ties + ' Tied</span>';
    html += '</th>';

    html += '<th class="gc-comp-summary-cell" style="text-align: center; padding-bottom: 15px;"><span class="gc-comp-badge gc-comp-badge-2">' + wins2 + ' ' + nameB + '</span></th>';
    html += '</tr>';

    // 2. Standard Column Headers
    html += '<tr>';
    html += '<th class="gc-comp-th-stat">Stat</th>';
    html += '<th class="gc-comp-th-val">' + nameA + '</th>';
    html += '<th class="gc-comp-th-diff">DIFF</th>';
    html += '<th class="gc-comp-th-val">' + nameB + '</th>';
    html += '<th class="gc-comp-ghost"></th>';
    html += '</tr>';
    html += '</thead>';
    html += '<tbody>';

    STAT_GROUPS.forEach(function(group) {
        html += '<tr class="gc-comp-group-row">';
        html += '<td></td>'; 
        html += '<td class="gc-comp-group-label" colspan="3">' + group.label + '</td>'; 
        html += '</tr>';
        group.keys.forEach(function(statKey) {
            var stat = COMPARISON_STATS.find(function(s) { return s.key === statKey; });
            if (!stat) return;
            var v1 = stats1[stat.key];
            var v2 = stats2[stat.key];
            var diff = v1 - v2;
            var maxVal = Math.max(v1, v2, 1);
            var pct1 = Math.round((v1 / maxVal) * 100);
            var pct2 = Math.round((v2 / maxVal) * 100);
    
            var diffClass = 'gc-diff-zero';
            var diffText = '0';
            if (diff > 0) {
                diffClass = 'gc-diff-positive';
                diffText = '+' + formatNum(diff);
            } else if (diff < 0) {
                diffClass = 'gc-diff-negative';
                diffText = formatNum(diff);
            }
    
            var winCls1 = v1 > v2 ? ' gc-comp-val-win' : '';
            var winCls2 = v2 > v1 ? ' gc-comp-val-win' : '';
    
            // Check if any source has nonzero diff for this stat
            var hasBreakdown = false;
            SOURCE_LABELS.forEach(function(sl) {
                if (src1[sl.key][stat.key] !== 0 || src2[sl.key][stat.key] !== 0) hasBreakdown = true;
            });
    
            html += '<tr class="gc-comp-row' + (hasBreakdown ? ' gc-comp-expandable' : '') + '" data-stat="' + stat.key + '">';
            html += '<td class="gc-comp-stat">' + stat.name + (hasBreakdown ? ' <span class="gc-comp-chevron">▸</span>' : '') + '</td>';
            var displayVal1 = formatNum(v1);
            var displayVal2 = formatNum(v2);
            var tooltipVal1 = v1;
            var tooltipVal2 = v2;
            if (stat.key === 'crit') {
                displayVal1 = formatNum(v1) + ' (' + calculateCritPercentage(v1) + '%)';
                displayVal2 = formatNum(v2) + ' (' + calculateCritPercentage(v2) + '%)';
                tooltipVal1 = 'Crit: ' + v1 + ' (' + calculateCritPercentage(v1) + '%)';
                tooltipVal2 = 'Crit: ' + v2 + ' (' + calculateCritPercentage(v2) + '%)';
            } else if (stat.key === 'hp') {
                tooltipVal1 = getHpTooltipText(hpTotal1);
                tooltipVal2 = getHpTooltipText(hpTotal2);
            }
            html += '<td class="gc-comp-val' + winCls1 + '"><div class="gc-comp-bar-wrap"><div class="gc-comp-bar gc-comp-bar-1" style="width:' + pct1 + '%"></div><span class="gc-comp-val-text" title="' + tooltipVal1 + '">' + displayVal1 + '</span></div></td>';
            html += '<td class="gc-comp-diff ' + diffClass + '">' + diffText + '</td>';
            html += '<td class="gc-comp-val' + winCls2 + '"><div class="gc-comp-bar-wrap"><div class="gc-comp-bar gc-comp-bar-2" style="width:' + pct2 + '%"></div><span class="gc-comp-val-text" title="' + tooltipVal2 + '">' + displayVal2 + '</span></div></td>';
            html += '</tr>';
    
            // Source breakdown rows (hidden by default)
            if (hasBreakdown) {
                SOURCE_LABELS.forEach(function(sl) {
                    var sv1 = src1[sl.key][stat.key];
                    var sv2 = src2[sl.key][stat.key];
                    if (sv1 === 0 && sv2 === 0) return;
                    var sd = sv1 - sv2;
                    var sdClass = sd > 0 ? 'gc-diff-positive' : sd < 0 ? 'gc-diff-negative' : 'gc-diff-zero';
                    var sdText = sd > 0 ? '+' + formatNum(sd) : sd < 0 ? formatNum(sd) : '-';
                    var sourceTooltip1 = formatNum(sv1);
                    var sourceTooltip2 = formatNum(sv2);
                    if (stat.key === 'hp') {
                        var hpSource1 = getHpSourceBreakdown(d1, sl.key);
                        var hpSource2 = getHpSourceBreakdown(d2, sl.key);
                        if (hpSource1) sourceTooltip1 = getHpTooltipText(hpSource1);
                        if (hpSource2) sourceTooltip2 = getHpTooltipText(hpSource2);
                    }
                    html += '<tr class="gc-comp-source-row" data-parent="' + stat.key + '">';
                    html += '<td class="gc-comp-source-label">';
                    if (typeof sl.icon === 'string' && (sl.icon.endsWith('.png') || sl.icon.endsWith('.jpg') || sl.icon.endsWith('.jpeg') || sl.icon.endsWith('.svg'))) {
                        html += '<img src="' + sl.icon + '" class="gc-source-icon" alt="' + sl.name + '" style="width:18px;height:18px;vertical-align:middle;margin-right:4px;">';
                    } else {
                        html += sl.icon + ' ';
                    }
                    html += sl.name + '</td>';
                    html += '<td class="gc-comp-source-val" title="' + sourceTooltip1 + '">' + formatNum(sv1) + '</td>';
                    html += '<td class="gc-comp-source-diff ' + sdClass + '">' + sdText + '</td>';
                    html += '<td class="gc-comp-source-val" title="' + sourceTooltip2 + '">' + formatNum(sv2) + '</td>';
                    html += '</tr>';
                });
            }
        });
    });

    html += '</tbody></table>';
    html += '</div>'; // close gc-comparison-scroll
    panel.innerHTML = html;
}

function formatNum(n) {
    if (n === 0) return '0';
    if (n % 1 !== 0) return n.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    return n.toLocaleString();
}
