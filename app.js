// ==========================================
// GAME STATE & AUDIO ENGINE
// ==========================================
let isRolling = false;
let isAutoRolling = false; 
let autoRollTimeout = null;
let sessionLifetimeEP = 0;
let totalRollCount = 0; 
let topRolls = []; 
let lastRollData = null; 
let autoSkipToggles = { "Common": false, "Uncommon": false, "Rare": false, "Epic": false, "Anomaly": false, "Mythic": false, "Secret": false };

const synth = {
    ctx: null,
    init() { 
        if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); 
    },
    playTone(freq, type, duration, vol=0.1) {
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type; 
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain); 
        gain.connect(this.ctx.destination);
        osc.start(); 
        osc.stop(this.ctx.currentTime + duration);
    },
    tick() { this.playTone(800, 'sine', 0.05, 0.02); },
    pop() { 
        this.playTone(300, 'square', 0.08, 0.03); 
        setTimeout(() => this.playTone(600, 'sine', 0.1, 0.03), 20); 
    },
    vaporise() {
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
        osc.connect(gain); 
        gain.connect(this.ctx.destination);
        osc.start(); 
        osc.stop(this.ctx.currentTime + 0.15);
    },
    chime(tier) {
        let chord = [261.63, 329.63, 392.00]; 
        if (tier === "Uncommon") chord = [293.66, 369.99, 440.00]; 
        if (tier === "Rare") chord = [329.63, 415.30, 493.88]; 
        if (tier === "Epic") chord = [349.23, 440.00, 523.25, 698.46]; 
        if (tier === "Anomaly") chord = [392.00, 493.88, 587.33, 783.99]; 
        if (tier === "Mythic") chord = [440.00, 554.37, 659.25, 880.00, 1108.73]; 
        if (tier === "Secret") chord = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00]; 
        chord.forEach((f, i) => setTimeout(() => this.playTone(f, 'sine', 0.8, 0.08), i * 60));
    }
};

function toggleAutoRoll() {
    const dice = document.getElementById('auto-roll-dice');
    isAutoRolling = !isAutoRolling;
    synth.init();
    synth.tick();

    if (isAutoRolling) {
        dice.classList.add('secret-roll-glow');
        if (!isRolling) {
            triggerRoll();
        }
    } else {
        dice.classList.remove('secret-roll-glow');
        if (autoRollTimeout) clearTimeout(autoRollTimeout);
    }
}

function calculateScaledEP(baseBadge) {
    let nativeBonus = (baseBadge.ep || 0) * 20; 
    if (baseBadge.tier === "Common") return Math.floor(Math.random() * 300) + 200 + nativeBonus;            
    if (baseBadge.tier === "Uncommon") return Math.floor(Math.random() * 2500) + 2500 + nativeBonus;        
    if (baseBadge.tier === "Rare") return Math.floor(Math.random() * 15000) + 15000 + nativeBonus;          
    if (baseBadge.tier === "Epic") return Math.floor(Math.random() * 50000) + 75000 + nativeBonus;          
    if (baseBadge.tier === "Anomaly") return Math.floor(Math.random() * 200000) + 300000 + (nativeBonus * 5);    
    if (baseBadge.tier === "Mythic") return Math.floor(Math.random() * 1500000) + 1500000 + (nativeBonus * 10);   
    if (baseBadge.tier === "Secret") return Math.floor(Math.random() * 5000000) + 5000000 + (nativeBonus * 20);   
    return baseBadge.ep;
}

function calculateAndRenderLevel() {
    let rolls = totalRollCount;
    let lvl = 1;
    let req = 50;
    
    while (rolls >= req) {
        rolls -= req;
        lvl++;
        req += 50;
    }
    
    const expBar = document.getElementById('exp-bar-fill');
    const lvlText = document.getElementById('level-display');
    const expText = document.getElementById('exp-display');
    const totalRollsText = document.getElementById('total-rolls-display');
    
    if (totalRollsText) {
        totalRollsText.innerText = `${totalRollCount.toLocaleString()} TOTAL ROLLS`;
    }
    
    if (lvlText.innerText !== `LVL ${lvl}` && totalRollCount > 0) {
        lvlText.classList.remove('animate-pulse');
        void lvlText.offsetWidth; 
        lvlText.classList.add('animate-pulse');
        setTimeout(() => lvlText.classList.remove('animate-pulse'), 1000);
    }
    
    lvlText.innerText = `LVL ${lvl}`;
    expText.innerText = `${rolls} / ${req}`;
    
    let fillPercentage = (rolls / req) * 100;
    if (rolls === 0 && lvl > 1) {
        expBar.style.transition = 'none'; 
        expBar.style.width = '0%';
        setTimeout(() => expBar.style.transition = 'all 0.5s ease-out', 50);
    } else {
        expBar.style.width = `${fillPercentage}%`;
    }
}

function renderPremiumSkipToggles() {
    const box = document.getElementById('autoskip-container');
    if (!box) return;
    box.innerHTML = '';
    
    const tiers = ["Common", "Uncommon", "Rare", "Epic", "Anomaly", "Mythic", "Secret"];
    const glowColors = {
        "Common": "rgba(255,255,255,0.4)",
        "Uncommon": "oklch(62.7% .194 149.214)",
        "Rare": "oklch(62.3% .214 259.815)",
        "Epic": "oklch(55.8% .288 302.321)",
        "Anomaly": "oklch(82.8% .189 84.429)",
        "Mythic": "oklch(65.6% .241 354.308)"
    };

    tiers.forEach(t => {
        const item = document.createElement('div');
        item.className = "flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5";
        
        let dotHtml = '';
        if (t === "Secret") {
            dotHtml = `<div class="w-2.5 h-2.5 rounded-full rainbow-bg rainbow-shadow"></div>`;
        } else {
            dotHtml = `<div class="w-2.5 h-2.5 rounded-full" style="background-color: ${glowColors[t]}; box-shadow: 0 0 10px ${glowColors[t]}"></div>`;
        }

        item.innerHTML = `
            <div class="flex items-center gap-2">
                ${dotHtml}
            </div>
            <label class="relative inline-flex items-center cursor-pointer select-none">
                <input type="checkbox" class="sr-only peer" data-skip-tier="${t}" ${autoSkipToggles[t] ? 'checked' : ''}>
                <div class="w-9 h-5 bg-zinc-800 rounded-full peer peer-focus:ring-0 dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-zinc-400 peer-checked:after:bg-amber-400 after:border-zinc-600 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500/10 border border-zinc-700/50"></div>
            </label>
        `;

        item.querySelector('input').addEventListener('change', (e) => {
            autoSkipToggles[t] = e.target.checked;
            localStorage.setItem('rngdle_skip_toggles', JSON.stringify(autoSkipToggles));
            synth.tick();
        });
        box.appendChild(item);
    });
}

function updateLeaderboard() {
    const container = document.getElementById('leaderboard-container');
    container.innerHTML = '';
    
    topRolls.slice(0, 5).forEach((roll, idx) => {
        let borderColor = "#374151";
        if (roll.rank === "Uncommon") borderColor = "oklch(62.7% .194 149.214)";
        if (roll.rank === "Rare") borderColor = "oklch(62.3% .214 259.815)";
        if (roll.rank === "Epic") borderColor = "oklch(55.8% .288 302.321)";
        if (roll.rank === "Anomaly") borderColor = "oklch(82.8% .189 84.429)";
        if (roll.rank === "Mythic") borderColor = "oklch(65.6% .241 354.308)";

        const div = document.createElement('div');
        if (roll.rank === "Secret") {
            div.className = "leaderboard-card p-3 rounded-lg flex justify-between items-center cursor-pointer relative transition-transform hover:scale-[1.02] rainbow-border rainbow-bg-subtle";
            div.style.borderLeftColor = "transparent";
        } else {
            div.className = "leaderboard-card p-3 rounded-lg flex justify-between items-center cursor-pointer relative transition-transform hover:scale-[1.02]";
            div.style.borderLeftColor = borderColor;
        }

        div.innerHTML = `
            <div class="flex flex-col">
                <span class="font-mono font-bold text-white tracking-widest text-lg">${roll.number}</span>
                <span class="font-mono text-[9px] uppercase tracking-wider ${roll.rank === 'Secret' ? 'rainbow-text' : ''}" style="${roll.rank !== 'Secret' ? `color: ${borderColor}` : ''}">${roll.rank}</span>
            </div>
            <div class="text-right flex flex-col">
                <span class="font-mono font-bold text-amber-400 text-xs">+${roll.ep.toLocaleString()}</span>
                <span class="font-mono text-[9px] text-gray-500">Rank #${idx + 1}</span>
            </div>
        `;

        div.addEventListener('click', () => {
            nav.openModal(`Roll History #${idx + 1} Breakdown`);
            const modalBody = document.getElementById('dashboard-modal-body');
            modalBody.className = "overflow-y-auto pr-2 flex flex-col space-y-3 max-h-[60vh] scrollbar-thin";
            
            let badgeListMarkup = roll.badges.map(b => `
                <div class="flex flex-col space-y-2 p-4 bg-white/[0.02] border border-white/5 rounded-xl text-left">
                    <div class="flex justify-between items-center w-full">
                        <span class="text-gray-200 font-mono flex items-center gap-2 font-bold text-sm">
                            <span>${b.emoji}</span> 
                            <span>${b.name}</span>
                        </span>
                        <span class="font-mono text-amber-400 font-bold text-xs bg-amber-500/10 px-2 py-0.5 border border-amber-500/20 rounded">+${b.calculatedEP.toLocaleString()} EP</span>
                    </div>
                    <div class="text-[11px] font-mono text-gray-400 uppercase tracking-wider">${b.criteria}</div>
                </div>
            `).join('');

            modalBody.innerHTML = `
                <div class="bg-black/40 rounded-xl p-3 border border-white/5 flex justify-between items-center mb-2">
                    <div class="font-mono text-xs text-gray-400 uppercase">Seed Integer</div>
                    <div class="font-mono font-bold text-lg text-white tracking-widest px-3 py-0.5 rounded ${roll.rank === 'Secret' ? 'rainbow-border' : ''}" style="${roll.rank !== 'Secret' ? `background-color: ${borderColor}20; border: 1px solid ${borderColor}40` : ''}">${roll.number}</div>
                </div>
                <div class="flex flex-col space-y-2">${badgeListMarkup}</div>
            `;
        });

        container.appendChild(div);
    });

    const top10Btn = document.getElementById('show-top-10-btn');
    if (top10Btn) {
        if (topRolls.length > 5) {
            top10Btn.classList.remove('hidden');
        } else {
            top10Btn.classList.add('hidden');
        }
    }
}

function triggerRoll() {
    if (isRolling) return;
    isRolling = true;
    synth.init(); 

    totalRollCount++;
    localStorage.setItem('rngdle_totalRolls', totalRollCount);
    calculateAndRenderLevel();

    const rollBtn = document.getElementById('roll-btn');
    const shareBtn = document.getElementById('share-btn');
    const display = document.getElementById('number-display');
    const metaRow = document.getElementById('meta-row');
    const scoreWrapper = document.getElementById('score-wrapper');
    const rankTag = document.getElementById('rank-tag');
    const percentTag = document.getElementById('percent-tag');
    const currentEpCounter = document.getElementById('current-ep-counter');
    const lifetimeEpCounter = document.getElementById('lifetime-ep-counter');
    const feedWrapper = document.getElementById('feed-wrapper');
    const stackOutput = document.getElementById('badges-output-stack');
    const capsuleGlow = document.getElementById('capsule-glow');

    rollBtn.disabled = true;
    rollBtn.innerHTML = '<span class="text-xl animate-spin inline-block">⚡</span> ANALYSING...';
    shareBtn.classList.add('hidden');
    
    [metaRow, scoreWrapper, feedWrapper].forEach(el => {
        el.classList.remove('opacity-100', 'translate-y-0');
        el.classList.add('opacity-0', 'translate-y-2');
    });
    
    stackOutput.innerHTML = '';
    capsuleGlow.style.opacity = '0';
    capsuleGlow.style.background = ''; 
    capsuleGlow.classList.remove('rainbow-bg');
    document.documentElement.style.setProperty('--tier-glow', '0 0 0 transparent');

    const rolledNumber = Math.floor(Math.random() * 1000000);
    const paddedStr = rolledNumber.toString().padStart(6, '0');
    const naturalStr = rolledNumber.toString(); 
    const diff = 6 - naturalStr.length;

    const badgesEarnedRaw = evaluateRoll(naturalStr);
    const badgesEarned = badgesEarnedRaw.map(b => ({ ...b, calculatedEP: calculateScaledEP(b) }));

    const tierWeights = { "Common": 1, "Uncommon": 2, "Rare": 3, "Epic": 4, "Anomaly": 5, "Mythic": 6, "Secret": 7 };
    badgesEarned.sort((a, b) => {
        if (tierWeights[a.tier] !== tierWeights[b.tier]) return tierWeights[a.tier] - tierWeights[b.tier];
        return a.calculatedEP - b.calculatedEP;
    });

    const totalEP = badgesEarned.reduce((sum, b) => sum + b.calculatedEP, 0);
    const cardRank = calculateCardRarity(totalEP);
    
    let calcPercent = 100 - Math.floor((Math.log10(Math.max(10, totalEP)) / 7.2) * 99);
    calcPercent = Math.max(1, Math.min(99, calcPercent)); 
    const percentString = calcPercent > 50 ? `BOTTOM ${calcPercent}%` : `TOP ${calcPercent}%`;

    lastRollData = { number: naturalStr, rank: cardRank.name, percentile: percentString, badges: badgesEarned, ep: totalEP };

    let frameTicks = 0;
    const maxFrames = 66; 

    display.innerHTML = '';
    const spans = [];
    for (let i = 0; i < 6; i++) {
        const span = document.createElement('span');
        span.className = 'spinning-digit-dimmed inline-block';
        display.appendChild(span);
        spans.push(span);
    }

    const cinematicInterval = setInterval(() => {
        let lockBoundary = Math.floor((frameTicks / maxFrames) * 6);
        if (frameTicks >= maxFrames - 1) lockBoundary = 6; 
        
        for (let i = 0; i < 6; i++) {
            if (i < lockBoundary) {
                if (spans[i].dataset.locked !== "true") {
                    spans[i].dataset.locked = "true";
                    spans[i].innerText = paddedStr[i];
                    
                    if (i < diff) {
                        spans[i].className = 'inline-block digit-vaporize';
                        synth.vaporise();
                    } else {
                        spans[i].className = 'inline-block digit-lock-bounce';
                    }
                }
            } else {
                spans[i].innerText = Math.floor(Math.random() * 10).toString();
            }
        }

        synth.tick(); 
        frameTicks++;

        if (frameTicks >= maxFrames) {
            clearInterval(cinematicInterval);
            setTimeout(processSystemReveal, 250); 
        }
    }, 60);

    function processSystemReveal() {
        display.innerHTML = ''; 
        for (let i = 0; i < naturalStr.length; i++) {
            const span = document.createElement('span');
            span.className = 'inline-block';
            span.innerText = naturalStr[i];
            display.appendChild(span);
        }

        synth.chime(cardRank.name); 

        let tagColorClass = "text-gray-400 border-gray-600 bg-gray-800";
        let outerShadow = "0 0 40px rgba(255,255,255,0.05)";
        let borderHex = "rgba(255,255,255,0.2)";
        
        if (cardRank.name === "Uncommon") { tagColorClass = "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"; borderHex = "rgba(16, 185, 129, 0.4)"; outerShadow = "0 0 40px rgba(16, 185, 129, 0.2)"; }
        if (cardRank.name === "Rare") { tagColorClass = "text-blue-400 border-blue-500/30 bg-blue-500/10"; borderHex = "rgba(59, 130, 246, 0.5)"; outerShadow = "0 0 50px rgba(59, 130, 246, 0.25)"; }
        if (cardRank.name === "Epic") { tagColorClass = "text-purple-400 border-purple-500/30 bg-purple-500/10"; borderHex = "rgba(168, 85, 247, 0.6)"; outerShadow = "0 0 60px rgba(168, 85, 247, 0.3)"; }
        if (cardRank.name === "Anomaly") { tagColorClass = "text-amber-400 border-amber-500/30 bg-amber-500/10"; borderHex = "rgba(245, 158, 11, 0.7)"; outerShadow = "0 0 70px rgba(245, 158, 11, 0.35)"; }
        if (cardRank.name === "Mythic") { tagColorClass = "text-rose-500 border-rose-500/50 bg-rose-500/20 font-bold shadow-[0_0_15px_rgba(244,63,94,0.5)]"; borderHex = "rgba(244, 63, 94, 0.8)"; outerShadow = "0 0 100px rgba(244, 63, 94, 0.4)"; }
        if (cardRank.name === "Secret") { 
            tagColorClass = "rainbow-text font-bold bg-black/80 rainbow-border tracking-[0.25em] animate-pulse"; 
            borderHex = "rgba(255, 255, 255, 0.9)"; 
            outerShadow = "0 0 120px rgba(255,255,255,0.6)"; 
            capsuleGlow.classList.add('rainbow-bg');
        }

        document.documentElement.style.setProperty('--tier-glow', outerShadow);
        document.documentElement.style.setProperty('--tier-border', borderHex);
        
        if (cardRank.name !== "Secret") {
            capsuleGlow.style.background = borderHex;
            capsuleGlow.style.opacity = '0.5';
        } else {
            capsuleGlow.style.opacity = '0.75';
        }

        rankTag.innerText = cardRank.name;
        rankTag.className = `px-3 py-1 rounded-full border backdrop-blur-sm ${tagColorClass}`;
        percentTag.innerText = percentString;

        [metaRow, scoreWrapper].forEach(el => {
            el.classList.remove('opacity-0', 'translate-y-2');
            el.classList.add('opacity-100', 'translate-y-0');
        });

        let countingPoints = 0;
        const incrementalStep = Math.max(1, Math.ceil(totalEP / 30)); 
        const countingTimer = setInterval(() => {
            countingPoints += incrementalStep;
            if (countingPoints >= totalEP) {
                countingPoints = totalEP;
                clearInterval(countingTimer);
                
                sessionLifetimeEP += totalEP;
                localStorage.setItem('rngdle_ep', sessionLifetimeEP);
                lifetimeEpCounter.innerText = `${sessionLifetimeEP.toLocaleString()} Total Lifetime EP`;
                
                nav.registerNewBadges(badgesEarned);

                topRolls.push({ number: naturalStr, rank: cardRank.name, ep: totalEP, badges: badgesEarned });
                topRolls.sort((a,b) => b.ep - a.ep);
                topRolls = topRolls.slice(0, 10); 
                localStorage.setItem('rngdle_topRolls', JSON.stringify(topRolls));
                
                updateLeaderboard();

                if (autoSkipToggles[cardRank.name] === true) {
                    executeInstantBypass();
                } else {
                    loadSequentialBadgeFeed();
                }
            }
            currentEpCounter.innerText = `${countingPoints.toLocaleString()} EP`;
        }, 30);
    }

    function createBadgeNodeHTML(badge) {
        let cardGlowStyle = "0 4px 20px rgba(0,0,0,0.3)";
        let borderVarValue = "rgba(255,255,255,0.1)";
        let bgAccentVar = "rgba(255,255,255,0.02)";
        let chipStyleClass = "border-gray-700 text-gray-400 bg-gray-800/50";
        let hasHoloOverlay = false;
        let holoClass = "card-holographic-overlay";
        
        if (badge.tier === "Uncommon") { borderVarValue = "rgba(16, 185, 129, 0.4)"; bgAccentVar = "rgba(16, 185, 129, 0.05)"; chipStyleClass = "border-emerald-800 text-emerald-400 bg-emerald-950/40"; }
        if (badge.tier === "Rare") { borderVarValue = "rgba(59, 130, 246, 0.5)"; bgAccentVar = "rgba(59, 130, 246, 0.05)"; cardGlowStyle = "0 8px 30px rgba(59, 130, 246, 0.15)"; chipStyleClass = "border-blue-800 text-blue-400 bg-blue-950/40"; }
        if (badge.tier === "Epic") { borderVarValue = "rgba(168, 85, 247, 0.6)"; bgAccentVar = "rgba(168, 85, 247, 0.05)"; cardGlowStyle = "0 8px 30px rgba(168, 85, 247, 0.2)"; chipStyleClass = "border-purple-800 text-purple-400 bg-purple-950/40"; }
        if (badge.tier === "Anomaly") { borderVarValue = "rgba(245, 158, 11, 0.7)"; bgAccentVar = "rgba(245, 158, 11, 0.08)"; cardGlowStyle = "0 8px 30px rgba(245, 158, 11, 0.25)"; chipStyleClass = "border-amber-500/50 text-amber-400 bg-amber-950/60"; hasHoloOverlay = true; }
        if (badge.tier === "Mythic") { borderVarValue = "rgba(244, 63, 94, 0.9)"; bgAccentVar = "rgba(244, 63, 94, 0.15)"; cardGlowStyle = "0 10px 40px rgba(244, 63, 94, 0.4)"; chipStyleClass = "border-rose-500 text-rose-400 bg-rose-950/60 font-bold shadow-[0_0_10px_rgba(244,63,94,0.3)]"; hasHoloOverlay = true; }
        if (badge.tier === "Secret") { borderVarValue = "transparent"; bgAccentVar = "rgba(255, 255, 255, 0.05)"; cardGlowStyle = "0 12px 50px rgba(255,255,255,0.3)"; chipStyleClass = "rainbow-text rainbow-border bg-black/60 font-bold tracking-widest"; hasHoloOverlay = true; holoClass = "rainbow-holo-shift"; }

        let digitsRowMarkup = '<div class="flex items-center pt-2 z-10">';
        const splitDigits = naturalStr.split('');
        const bName = badge.name;

        splitDigits.forEach((digit, pos) => {
            let isMatchTarget = false;
            if (bName.startsWith("Exact ") || bName === "Hay" || bName === "Very Very Nice" || bName === "Hotbox" || bName === "Mayday" || bName === "Universal Answer" || bName === "Orwellian" || bName === "Brainrot" || bName === "Groundhog Day" || bName.endsWith("Power") || bName === "Pi" || bName === "Euler's Number" || bName === "Factorial" || bName === "Fibonacci Number" || bName === "Prime Number" || bName === "Pronic Number" || bName === "Strobogrammatic" || bName === "Palindrome" || bName === "Even" || bName === "Odd" || bName === "Dozen" || bName === "Eleven" || bName === "Lucky Seven (Divisible)" || bName === "Single Digit" || bName === "Two Digits" || bName === "Three Digits" || bName === "Four Digits" || bName === "Five Digits" || bName === "Six Digits" || bName === "Heterogeneous" || bName === "Perfect Square" || bName === "Perfect Cube") isMatchTarget = true;
            else if (bName === "Echo") isMatchTarget = true;
            else if (bName === "Bookends") { if (pos < 2 || pos >= splitDigits.length - 2) isMatchTarget = true; }
            else if (bName === "Sandwich") {
                if (pos > 0 && pos < splitDigits.length - 1 && splitDigits[pos-1] === splitDigits[pos+1] && splitDigits[pos-1] !== Number(digit)) isMatchTarget = true;
                if (pos < splitDigits.length - 2 && digit === splitDigits[pos+2] && digit !== splitDigits[pos+1]) isMatchTarget = true;
                if (pos >= 2 && digit === splitDigits[pos-2] && digit !== splitDigits[pos-1]) isMatchTarget = true;
            }
            else if (bName === "Century") { if (pos >= splitDigits.length - 2) isMatchTarget = true; }
            else if (bName === "Millennium") { if (pos >= splitDigits.length - 3) isMatchTarget = true; }
            else if (bName === "Divisible by Three" && Number(digit) % 3 === 0) isMatchTarget = true;
            else if (bName === "Contiguous Sixes" || bName === "Contiguous Fives" || bName === "Contiguous Quads" || bName === "Contiguous Trips" || bName === "Contiguous Pair" || bName === "Two Pair" || bName === "Three Pair" || bName === "Contiguous Three Pair") {
                if ((pos > 0 && digit === splitDigits[pos-1]) || (pos < splitDigits.length - 1 && digit === splitDigits[pos+1])) isMatchTarget = true;
            }
            else if (bName.startsWith("Deep Void") && digit === "0") isMatchTarget = true;
            else if (bName === "Ghost" && digit === "0") isMatchTarget = true;
            else if (bName === "Void" && digit !== "0") isMatchTarget = true;
            else if (bName.startsWith("Hydrogen") && digit === "1") isMatchTarget = true;
            else if (bName.startsWith("Helium") && digit === "2") isMatchTarget = true;
            else if (bName.startsWith("Lithium") && digit === "3") isMatchTarget = true;
            else if (bName.startsWith("Beryllium") && digit === "4") isMatchTarget = true;
            else if (bName.startsWith("Boron") && digit === "5") isMatchTarget = true;
            else if (bName.startsWith("Carbon") && digit === "6") isMatchTarget = true;
            else if (bName.startsWith("Nitrogen") && digit === "7") isMatchTarget = true;
            else if (bName.startsWith("Oxygen") && digit === "8") isMatchTarget = true;
            else if (bName.startsWith("Fluorine") && digit === "9") isMatchTarget = true;
            else if (bName === "Gap One" && (pos === 0 || pos === splitDigits.length - 1)) isMatchTarget = true;
            else if ((bName === "Equilibrium" || bName === "Liftoff" || bName === "Grounded") && (pos === 0 || pos === splitDigits.length - 1)) isMatchTarget = true;
            else if (bName === "Neighbors") {
                if ((pos < splitDigits.length - 1 && Math.abs(Number(digit) - Number(splitDigits[pos+1])) === 1) || (pos > 0 && Math.abs(Number(digit) - Number(splitDigits[pos-1])) === 1)) isMatchTarget = true;
            }
            digitsRowMarkup += `<div class="card-digit-box ${isMatchTarget ? 'highlighted' : ''}">${digit}</div>`;
        });
        digitsRowMarkup += '</div>';

        return `
            ${hasHoloOverlay ? `<div class="${holoClass}" style="opacity:1"></div>` : ''}
            <div class="flex justify-between items-center w-full z-10">
                <div class="flex flex-wrap items-center gap-3">
                    <div class="bg-gray-800/50 rounded-lg p-2 border border-gray-700/50 shadow-inner">
                        <span class="text-xl leading-none">${badge.emoji}</span>
                    </div>
                    <div class="flex flex-col">
                        <div class="flex items-center gap-2">
                            <span class="font-bold font-mono text-sm tracking-wide text-white">${badge.name}</span>
                            <span class="text-[9px] px-2 py-0.5 border rounded-sm font-mono uppercase tracking-wider ${chipStyleClass}">${badge.tier}</span>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col items-end gap-1">
                    <span class="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold font-mono rounded">NEW</span>
                    <span class="text-sm font-mono text-white font-bold bg-white/5 px-3 py-1 border border-white/10 rounded-lg shadow-inner">
                        +${badge.calculatedEP.toLocaleString()} EP
                    </span>
                </div>
            </div>
            <div class="text-xs font-mono text-gray-400 uppercase tracking-widest z-10 pl-1 border-l-2 border-gray-700">${badge.criteria}.</div>
            ${digitsRowMarkup}
        `;
    }

    function executeInstantBypass() {
        document.getElementById('earned-counter-label').innerText = `${badgesEarned.length} Badges Earned`;
        feedWrapper.classList.remove('opacity-0');

        badgesEarned.forEach(badge => {
            const cardNode = document.createElement('div');
            if (badge.tier === "Secret") {
                cardNode.className = "polished-card flex flex-col space-y-4 p-5 md:p-6 w-full text-left active opacity-100 transform-none rainbow-border";
            } else {
                cardNode.className = "polished-card flex flex-col space-y-4 p-5 md:p-6 w-full text-left active opacity-100 transform-none";
            }
            
            let borderVarValue = "rgba(255,255,255,0.1)";
            let bgAccentVar = "rgba(255,255,255,0.02)";
            if (badge.tier === "Uncommon") { borderVarValue = "rgba(16, 185, 129, 0.4)"; bgAccentVar = "rgba(16, 185, 129, 0.05)"; }
            if (badge.tier === "Rare") { borderVarValue = "rgba(59, 130, 246, 0.5)"; bgAccentVar = "rgba(59, 130, 246, 0.05)"; }
            if (badge.tier === "Epic") { borderVarValue = "rgba(168, 85, 247, 0.6)"; bgAccentVar = "rgba(168, 85, 247, 0.05)"; }
            if (badge.tier === "Anomaly") { borderVarValue = "rgba(245, 158, 11, 0.7)"; bgAccentVar = "rgba(245, 158, 11, 0.08)"; }
            if (badge.tier === "Mythic") { borderVarValue = "rgba(244, 63, 94, 0.9)"; bgAccentVar = "rgba(244, 63, 94, 0.15)"; }
            if (badge.tier === "Secret") { borderVarValue = "transparent"; bgAccentVar = "rgba(255, 255, 255, 0.05)"; }

            cardNode.style.setProperty('--tier-border', borderVarValue);
            cardNode.style.setProperty('--tier-bg-accent', bgAccentVar);
            cardNode.innerHTML = createBadgeNodeHTML(badge);
            stackOutput.prepend(cardNode);
        });

        rollBtn.disabled = false;
        rollBtn.innerHTML = '<span class="text-xl">🎰</span> Generate Roll';
        shareBtn.classList.remove('hidden'); 
        isRolling = false;

        if (isAutoRolling) {
            autoRollTimeout = setTimeout(triggerRoll, 800);
        }
    }

    function loadSequentialBadgeFeed() {
        document.getElementById('earned-counter-label').innerText = `${badgesEarned.length} Badges Earned`;
        feedWrapper.classList.remove('opacity-0');

        let cardCursorIndex = 0;

        function printRowItem() {
            if (cardCursorIndex >= badgesEarned.length) {
                rollBtn.disabled = false;
                rollBtn.innerHTML = '<span class="text-xl">🎰</span> Generate Roll';
                shareBtn.classList.remove('hidden'); 
                isRolling = false;

                if (isAutoRolling) {
                    autoRollTimeout = setTimeout(triggerRoll, 1200);
                }
                return;
            }

            const badge = badgesEarned[cardCursorIndex];
            const cardNode = document.createElement('div');
            if (badge.tier === "Secret") {
                cardNode.className = "polished-card revealing-card flex flex-col space-y-4 p-5 md:p-6 w-full text-left rainbow-border";
            } else {
                cardNode.className = "polished-card revealing-card flex flex-col space-y-4 p-5 md:p-6 w-full text-left";
            }

            let borderVarValue = "rgba(255,255,255,0.1)";
            let bgAccentVar = "rgba(255,255,255,0.02)";
            if (badge.tier === "Uncommon") { borderVarValue = "rgba(16, 185, 129, 0.4)"; bgAccentVar = "rgba(16, 185, 129, 0.05)"; }
            if (badge.tier === "Rare") { borderVarValue = "rgba(59, 130, 246, 0.5)"; bgAccentVar = "rgba(59, 130, 246, 0.05)"; }
            if (badge.tier === "Epic") { borderVarValue = "rgba(168, 85, 247, 0.6)"; bgAccentVar = "rgba(168, 85, 247, 0.05)"; }
            if (badge.tier === "Anomaly") { borderVarValue = "rgba(245, 158, 11, 0.7)"; bgAccentVar = "rgba(245, 158, 11, 0.08)"; }
            if (badge.tier === "Mythic") { borderVarValue = "rgba(244, 63, 94, 0.9)"; bgAccentVar = "rgba(244, 63, 94, 0.15)"; }
            if (badge.tier === "Secret") { borderVarValue = "transparent"; bgAccentVar = "rgba(255, 255, 255, 0.05)"; }

            cardNode.style.setProperty('--tier-border', borderVarValue);
            cardNode.style.setProperty('--tier-bg-accent', bgAccentVar);
            cardNode.innerHTML = createBadgeNodeHTML(badge);

            stackOutput.prepend(cardNode);
            synth.pop(); 
            
            setTimeout(() => {
                cardNode.classList.add('active');
                cardCursorIndex++;
                setTimeout(printRowItem, 250);
            }, 50);
        }
        printRowItem();
    }
}

document.getElementById('roll-btn').addEventListener('click', triggerRoll);

const nav = {
    discoveredBadgeIds: new Set(), 
    init() {
        const overlay = document.getElementById('modal-screen-blur');
        const closeBtn = document.getElementById('close-dashboard-btn');
        const badgesBtn = document.getElementById('view-all-badges-btn');
        const autoRollBtn = document.getElementById('auto-roll-toggle');
        
        const top10Btn = document.getElementById('show-top-10-btn');
        if (top10Btn) {
            top10Btn.addEventListener('click', () => {
                this.openModal("Top 10 Historical Rolls");
                const modalBody = document.getElementById('dashboard-modal-body');
                modalBody.className = "overflow-y-auto pr-2 flex flex-col space-y-4 max-h-[60vh] scrollbar-thin";
                
                let html = topRolls.map((roll, idx) => {
                    let borderColor = "#374151";
                    if (roll.rank === "Uncommon") borderColor = "oklch(62.7% .194 149.214)";
                    if (roll.rank === "Rare") borderColor = "oklch(62.3% .214 259.815)";
                    if (roll.rank === "Epic") borderColor = "oklch(55.8% .288 302.321)";
                    if (roll.rank === "Anomaly") borderColor = "oklch(82.8% .189 84.429)";
                    if (roll.rank === "Mythic") borderColor = "oklch(65.6% .241 354.308)";

                    let isSecret = roll.rank === "Secret";
                    let secretCardClass = isSecret ? "rainbow-border rainbow-bg-subtle" : "";
                    let inlineStyle = !isSecret ? `border-left-color: ${borderColor}` : "border-left-color: transparent";

                    let badgeListMarkup = roll.badges.map(b => `
                        <div class="flex justify-between items-center text-[10px] sm:text-xs w-full py-1.5 border-b border-white/5 last:border-0">
                            <span class="text-gray-400 font-mono flex items-center gap-2">
                                <span>${b.emoji}</span> <span class="truncate max-w-[160px] sm:max-w-[280px]">${b.name}</span>
                            </span>
                            <span class="font-mono text-gray-500">+${b.calculatedEP.toLocaleString()}</span>
                        </div>
                    `).join('');

                    return `
                        <div class="leaderboard-card p-4 rounded-xl flex flex-col space-y-3 relative ${secretCardClass}" style="${inlineStyle}">
                            <div class="flex justify-between items-center border-b border-white/10 pb-3">
                                <div class="flex items-center gap-3">
                                    <span class="font-mono text-gray-500 font-bold text-sm bg-black/40 px-2 py-0.5 rounded border border-white/5">#${idx + 1}</span>
                                    <span class="font-mono font-bold text-white tracking-widest text-xl ${isSecret ? 'rainbow-text' : ''}">${roll.number}</span>
                                </div>
                                <div class="text-right flex flex-col items-end">
                                    <span class="font-mono font-bold text-amber-400 text-sm bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">+${roll.ep.toLocaleString()} EP</span>
                                    <span class="font-mono text-[9px] uppercase tracking-wider mt-1 ${isSecret ? 'rainbow-text' : ''}" style="${!isSecret ? `color: ${borderColor}` : ''}">${roll.rank}</span>
                                </div>
                            </div>
                            <div class="flex flex-col">
                                ${badgeListMarkup}
                            </div>
                        </div>
                    `;
                }).join('');

                modalBody.innerHTML = html;
            });
        }

        if (autoRollBtn) {
            autoRollBtn.addEventListener('click', () => toggleAutoRoll());
        }
        if (badgesBtn) {
            badgesBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openAllBadges();
            });
        }
        if(closeBtn && overlay) {
            closeBtn.addEventListener('click', () => this.closeModal());
            overlay.addEventListener('click', () => this.closeModal());
        }
    },
    registerNewBadges(badges) {
        badges.forEach(b => { if (b.id) this.discoveredBadgeIds.add(b.id); });
        localStorage.setItem('rngdle_badges', JSON.stringify(Array.from(this.discoveredBadgeIds)));
    },
    openModal(title) {
        document.getElementById('dashboard-modal-title').innerText = title;
        document.getElementById('modal-screen-blur').classList.remove('hidden');
        document.getElementById('center-dashboard-modal').classList.remove('hidden');
        document.body.classList.add('body-scroll-lock');
    },
    closeModal() {
        document.getElementById('modal-screen-blur').classList.add('hidden');
        document.getElementById('center-dashboard-modal').classList.add('hidden');
        document.body.classList.remove('body-scroll-lock');
    },
    openAllBadges() {
        this.openModal("All Badges Database");
        const body = document.getElementById('dashboard-modal-body');
        body.className = "overflow-y-auto pr-2 flex flex-col space-y-2 scrollbar-thin scrollbar-thumb-gray-800"; 

        const tierWeights = { "Common": 1, "Uncommon": 2, "Rare": 3, "Epic": 4, "Anomaly": 5, "Mythic": 6, "Secret": 7 };
        const sortedDatabase = [...BADGES_DATABASE].sort((a, b) => {
            if (tierWeights[a.tier] !== tierWeights[b.tier]) return tierWeights[b.tier] - tierWeights[a.tier]; 
            return a.id - b.id; 
        });
        
        let badgesHTML = sortedDatabase.map(b => {
            const hasDiscovered = this.discoveredBadgeIds.has(b.id);
            let isSecret = b.tier === "Secret";
            let colorHex = "#374151"; 
            if (b.tier === "Uncommon") colorHex = "oklch(62.7% .194 149.214)";
            if (b.tier === "Rare") colorHex = "oklch(62.3% .214 259.815)";
            if (b.tier === "Epic") colorHex = "oklch(55.8% .288 302.321)";
            if (b.tier === "Anomaly") colorHex = "oklch(82.8% .189 84.429)";
            if (b.tier === "Mythic") colorHex = "oklch(65.6% .241 354.308)";
            if (isSecret) colorHex = "transparent";

            return `
                <div class="modal-badge-row p-3 rounded-xl flex items-center justify-between ${hasDiscovered ? 'opacity-100' : 'opacity-25 select-none'} ${isSecret && hasDiscovered ? 'rainbow-border rainbow-bg-subtle' : ''}" style="border-left: 4px solid ${hasDiscovered ? colorHex : '#1f2937'}">
                    <div class="flex items-center gap-3">
                        <span class="text-xl filter ${hasDiscovered ? '' : 'blur-[3px] grayscale'}">${hasDiscovered ? b.emoji : '❓'}</span>
                        <div class="flex flex-col z-10">
                            <span class="font-bold font-mono text-xs text-white uppercase">${hasDiscovered ? b.name : 'Hidden Secret Badge'}</span>
                            <span class="font-mono text-[10px] text-gray-500 max-w-[340px] truncate">${hasDiscovered ? b.criteria : 'Unlock this badge meeting its rules.'}</span>
                        </div>
                    </div>
                    <span class="font-mono text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${isSecret && hasDiscovered ? 'rainbow-text rainbow-border bg-black/50 z-10' : ''}" style="${!isSecret ? `color: ${colorHex}; background-color: ${colorHex}15; border: 1px solid ${colorHex}25` : ''}">${b.tier}</span>
                </div>
            `;
        }).join('');

        badgesHTML += `
            <div class="pt-6 pb-2 w-full flex justify-center mt-auto">
                <button id="factory-reset-btn" class="px-5 py-2.5 bg-rose-500/10 text-rose-500 border border-rose-500/30 rounded-xl font-mono text-xs font-bold uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all duration-200">
                    ⚠️ Factory Reset Progress
                </button>
            </div>
        `;
        
        body.innerHTML = badgesHTML;

        document.getElementById('factory-reset-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm("WARNING: Clear historical analytics permanently?")) {
                localStorage.clear();
                window.location.reload();
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    sessionLifetimeEP = parseInt(localStorage.getItem('rngdle_ep')) || 0;
    totalRollCount = parseInt(localStorage.getItem('rngdle_totalRolls')) || 0;

    // --- LEGACY ROLL CALCULATOR ---
    // In case a player lost their total rolls but still has legacy Level/EXP data
    if (totalRollCount === 0) {
        let oldLevel = parseInt(localStorage.getItem('rngdle_level')) || parseInt(localStorage.getItem('level')) || 0;
        let oldExp = parseInt(localStorage.getItem('rngdle_exp')) || parseInt(localStorage.getItem('exp')) || 0;
        if (oldLevel > 1 || oldExp > 0) {
            totalRollCount = (25 * (oldLevel - 1) * oldLevel) + oldExp;
            localStorage.setItem('rngdle_totalRolls', totalRollCount);
        }
    }
    
    try {
        topRolls = JSON.parse(localStorage.getItem('rngdle_topRolls')) || [];
    } catch(e) { topRolls = []; }
    
    try {
        autoSkipToggles = JSON.parse(localStorage.getItem('rngdle_skip_toggles')) || autoSkipToggles;
    } catch(e) {}

    let savedBadges = [];
    try {
        savedBadges = JSON.parse(localStorage.getItem('rngdle_badges')) || [];
    } catch(e) {}
    
    nav.discoveredBadgeIds = new Set(savedBadges);

    document.getElementById('lifetime-ep-counter').innerText = `${sessionLifetimeEP.toLocaleString()} Total Lifetime EP`;
    if (topRolls.length > 0) updateLeaderboard();

    calculateAndRenderLevel();
    nav.init();
    renderPremiumSkipToggles();
});