(function(){
    'use strict';

    const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

    // Elyos tables
    const ELYOS_SUBS = [
        'ihkjmlonqpsrutwvyxazcbedgf',
        'dcfehgjilknmporqtsvuxwzyba',
        'edgfihkjmlonqpsrutwvyxazcb',
        '@@@@@@@@@@@@@@@@@@@@@@@@@@'
    ];
    const ELYOS_NEXT = [
        '11111111111111111121222222',
        '11111111111111111111111122',
        '11111111111111111111112122',
        '33333333333333333333333333'
    ];

    // Asmodian tables
    const ASMO_SUBS = [
        'jkhinolmrspqvwtuzgbcjafgde',
        'efcdijghmnklqropuvstyzabij',
        'fgdejkhinolmrspqvwtuzgbcja',
        'ghefklijopmnstqrwxuvghcdab'
    ];
    const ASMO_NEXT = [
        '11111111111111111322322222',
        '11111111111111111111112233',
        '11111111111111111111132232',
        '11111111111111111111332222'
    ];

    // DOM helpers
    const root = document.getElementById('translator');
    const els = {
        input: document.getElementById('input-text'),
        output: document.getElementById('output-text'),
        copyBottom: document.getElementById('copy-translation'),
        clearIn: document.getElementById('clear-input'),
        infoToggle: document.getElementById('translator-info-toggle'),
        infoPanel: document.getElementById('translator-info-panel'),
        actionBtns: Array.from(document.querySelectorAll('.action-btn')),
        factionBtns: Array.from(document.querySelectorAll('.faction-btn'))
    };

    function updateFactionClass() {
        if (!root) return;
        root.classList.toggle('elyos-mode', selectedFaction === 'elyos');
        root.classList.toggle('asmodian-mode', selectedFaction === 'asmodian');
    }

    function getSelectedAction() {
        const btn = els.actionBtns.find(b => b.classList.contains('selected'));
        return btn ? btn.dataset.action : 'understand';
    }

    let selectedFaction = 'elyos';

    // faction button handling
    els.factionBtns.forEach(btn => {
        btn.addEventListener('click', function(e){
            els.factionBtns.forEach(b=>b.classList.remove('selected'));
            this.classList.add('selected');
            selectedFaction = this.dataset.faction;
            updateFactionClass();
            doTranslate();
        });
    });

    function tablesFor(faction) {
        return faction === 'elyos' ? {subs: ELYOS_SUBS, next: ELYOS_NEXT} : {subs: ASMO_SUBS, next: ASMO_NEXT};
    }

    function encodeText(text, subs, nexts) {
        let out = '';
        let row = 0;
        for (let ch of text) {
            const isUpper = ch === ch.toUpperCase();
            const lower = ch.toLowerCase();
            const idx = ALPHABET.indexOf(lower);
            if (idx === -1) {
                out += ch;
                row = 0;
                continue;
            }
            const mapped = subs[row].charAt(idx) || lower;
            out += isUpper ? mapped.toUpperCase() : mapped;
            const nextChar = nexts[row].charAt(idx) || '1';
            row = Math.min(3, Math.max(0, parseInt(nextChar,10)));
        }
        return out;
    }

    function decodeText(text, subs, nexts) {
        let out = '';
        let row = 0;
        for (let ch of text) {
            const isUpper = ch === ch.toUpperCase();
            const lower = ch.toLowerCase();
            if (!/[a-z]/.test(lower)) {
                out += ch;
                row = 0;
                continue;
            }
            const idx = subs[row].indexOf(lower);
            if (idx === -1) {
                out += ch;
                row = 0;
                continue;
            }
            const decoded = ALPHABET.charAt(idx);
            out += isUpper ? decoded.toUpperCase() : decoded;
            const nextChar = nexts[row].charAt(idx) || '1';
            row = Math.min(3, Math.max(0, parseInt(nextChar,10)));
        }
        return out;
    }

    function translateUsing(text) {
        const action = getSelectedAction();
        // Determine which faction tables to use:
        // - 'speak': use selectedFaction tables and encode text.
        // - 'understand': use the opposite faction tables and encode text.
        // - 'decode': use selectedFaction tables and decode text.
        const tablesFaction = (action === 'speak' || action === 'decode')
            ? selectedFaction
            : (selectedFaction === 'elyos' ? 'asmodian' : 'elyos');
        const {subs, next} = tablesFor(tablesFaction);
        return (action === 'decode') ? decodeText(text, subs, next) : encodeText(text, subs, next);
    }

    function doTranslate() {
        const txt = (els.input && els.input.value) || '';
        const out = translateUsing(txt);
        if (els.output) els.output.value = out;
    }

    function copyToClipboard(text) {
        if (!navigator.clipboard) {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy'); } catch(e) {}
            document.body.removeChild(ta);
            return;
        }
        navigator.clipboard.writeText(text).catch(()=>{});
    }

    // events
    if (els.copyBottom) els.copyBottom.addEventListener('click', function(){ copyToClipboard(els.output.value || ''); if (typeof showShareToast === 'function') showShareToast('✓ Copied translation'); });
    if (els.clearIn) els.clearIn.addEventListener('click', ()=>{ if (els.input) { els.input.value=''; els.input.focus(); doTranslate(); } });
    if (els.infoToggle && els.infoPanel) {
        els.infoToggle.addEventListener('click', function() {
            const isOpen = !els.infoPanel.hasAttribute('hidden');
            if (isOpen) {
                els.infoPanel.setAttribute('hidden', '');
                this.setAttribute('aria-expanded', 'false');
            } else {
                els.infoPanel.removeAttribute('hidden');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    }
    els.actionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            els.actionBtns.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            doTranslate();
        });
    });
    if (els.input) els.input.addEventListener('input', doTranslate);

    // initial state
    updateFactionClass();
    doTranslate();

})();

const TranslationApp = {
    copyCurrentText: function() {
        const outputTextArea = document.getElementById('output-text');
        
        if (!outputTextArea || !outputTextArea.value) {
            return;
        }

        navigator.clipboard.writeText(outputTextArea.value)
            .then(() => {
                const label = document.querySelector('.copy-label');
                const originalText = label.textContent;
                
                label.textContent = "Copied! ✓";
                setTimeout(() => {
                    label.textContent = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
            });
    }
};
