// Native Audio Synth Engine
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
        chord.forEach((f, i) => setTimeout(() => this.playTone(f, 'sine', 0.6, 0.08), i * 80));
    }
};

// Global State
let isRolling = false;
let sessionLifetimeEP = 0;
let topRolls = []; 
let lastRollData = null; 

function calculateScaledEP(baseBadge) {
    let nativeBonus = (baseBadge.ep || 0) * 20; 
    if (baseBadge.tier === "Common") return Math.floor(Math.random() * 300) + 200 + nativeBonus;            
    if (baseBadge.tier === "Uncommon") return Math.floor(Math.random() * 2500) + 2500 + nativeBonus;        
    if (baseBadge.tier === "Rare") return Math.floor(Math.random() * 15000) + 15000 + nativeBonus;          
    if (baseBadge.tier === "Epic") return Math.floor(Math.random() * 50000) + 75000 + nativeBonus;          
    if (baseBadge.tier === "Anomaly") return Math.floor(Math.random() * 200000) + 300000 + (nativeBonus * 5);    
    if (baseBadge.tier === "Mythic") return Math.floor(Math.random() * 1500000) + 1500000 + (nativeBonus * 10);   
    return baseBadge.ep;
}

const tooltipModal = document.createElement('div');
tooltipModal.className = 'leaderboard-tooltip-modal flex flex-col space-y-3';
document.body.appendChild(tooltipModal);

window.addEventListener('mousemove', (e) => {
    if (tooltipModal.classList.contains('visible')) {
        let xOffset = e.clientX + 16;
        let yOffset = e.clientY + 12;
        if (xOffset + 340 > window.innerWidth) xOffset = e.clientX - 340;
        if (yOffset + 250 > window.innerHeight) yOffset = e.clientY - 250;
        tooltipModal.style.left = `${xOffset}px`;
        tooltipModal.style.top = `${yOffset}px`;
    }
});

function updateLeaderboard() {
    const container = document.getElementById('leaderboard-container');
    container.innerHTML = '';
    
    topRolls.forEach((roll, idx) => {
        let borderColor = "#374151";
        if (roll.rank === "Uncommon") borderColor = "oklch(62.7% .194 149.214)";
        if (roll.rank === "Rare") borderColor = "oklch(62.3% .214 259.815)";
        if (roll.rank === "Epic") borderColor = "oklch(55.8% .288 302.321)";
        if (roll.rank === "Anomaly") borderColor = "oklch(82.8% .189 84.429)";
        if (roll.rank === "Mythic") borderColor = "oklch(65.6% .241 354.308)";

        const div = document.createElement('div');
        div.className = "leaderboard-card p-3 rounded-lg flex justify-between items-center cursor-help relative";
        div.style.borderLeftColor = borderColor;
        div.innerHTML = `
            <div class="flex flex-col">
                <span class="font-mono font-bold text-white tracking-widest text-lg">${roll.number}</span>
                <span class="font-mono text-[9px] uppercase tracking-wider" style="color: ${borderColor}">${roll.rank}</span>
            </div>
            <div class="text-right flex flex-col">
                <span class="font-mono font-bold text-amber-400 text-xs">+${roll.ep.toLocaleString()}</span>
                <span class="font-mono text-[9px] text-gray-500">Rank #${idx + 1}</span>
            </div>
        `;

        div.addEventListener('mouseenter', () => {
            let badgeListMarkup = roll.badges.map(b => `
                <div class="flex justify-between items-center text-[11px] border-b border-white/5 pb-1 w-full">
                    <span class="text-gray-300 font-mono flex items-center gap-1.5">
                        <span class="text-sm">${b.emoji}</span> 
                        <span class="truncate max-w-[180px] font-bold text-gray-200">${b.name}</span>
                    </span>
                    <span class="font-mono text-amber-400 font-bold text-[10px] whitespace-nowrap">+${b.calculatedEP.toLocaleString()}</span>
                </div>
            `).join('');

            tooltipModal.innerHTML = `
                <div class="text-xs font-mono font-bold text-gray-400 tracking-wider border-b border-white/10 pb-1.5 flex justify-between items-center mb-2 w-full">
                    <span class="flex items-center gap-1">📊 Roll Breakdowns</span>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold text-white" style="background-color: ${borderColor}33; border: 1px solid ${borderColor}">${roll.number}</span>
                </div>
                <div class="flex flex-col space-y-2 w-full">${badgeListMarkup}</div>
            `;
            tooltipModal.classList.add('visible');
        });

        div.addEventListener('mouseleave', () => tooltipModal.classList.remove('visible'));
        container.appendChild(div);
    });
}

document.getElementById('roll-btn').addEventListener('click', () => {
    if (isRolling) return;
    isRolling = true;
    synth.init(); 

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
    document.documentElement.style.setProperty('--tier-glow', '0 0 0 transparent');

    const rolledNumber = Math.floor(Math.random() * 1000000);
    const paddedStr = rolledNumber.toString().padStart(6, '0');
    const naturalStr = rolledNumber.toString(); 
    const diff = 6 - naturalStr.length;

    const badgesEarnedRaw = evaluateRoll(naturalStr);
    const badgesEarned = badgesEarnedRaw.map(b => ({ ...b, calculatedEP: calculateScaledEP(b) }));

    const tierWeights = { "Common": 1, "Uncommon": 2, "Rare": 3, "Epic": 4, "Anomaly": 5, "Mythic": 6 };
    badgesEarned.sort((a, b) => {
        if (tierWeights[a.tier] !== tierWeights[b.tier]) return tierWeights[a.tier] - tierWeights[b.tier];
        return a.calculatedEP - b.calculatedEP;
    });

    const totalEP = badgesEarned.reduce((sum, b) => sum + b.calculatedEP, 0);
    const cardRank = calculateCardRarity(totalEP);
    
    let calcPercent = 100 - Math.floor((Math.log10(Math.max(10, totalEP)) / 6.8) * 99);
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

        document.documentElement.style.setProperty('--tier-glow', outerShadow);
        document.documentElement.style.setProperty('--tier-border', borderHex);
        
        capsuleGlow.style.background = borderHex;
        capsuleGlow.style.opacity = '0.5';

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
                localStorage.setItem('rngdle_ep', sessionLifetimeEP.toString());
                lifetimeEpCounter.innerText = `${sessionLifetimeEP.toLocaleString()} Total Lifetime EP`;
                
                nav.registerNewBadges(badgesEarned);

                topRolls.push({ number: naturalStr, rank: cardRank.name, ep: totalEP, badges: badgesEarned });
                topRolls.sort((a,b) => b.ep - a.ep);
                topRolls = topRolls.slice(0, 5); 
                localStorage.setItem('rngdle_topRolls', JSON.stringify(topRolls));
                
                updateLeaderboard();
                loadSequentialBadgeFeed();
            }
            currentEpCounter.innerText = `${countingPoints.toLocaleString()} EP`;
        }, 30);
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
                return;
            }

            const badge = badgesEarned[cardCursorIndex];
            const cardNode = document.createElement('div');
            cardNode.className = "polished-card revealing-card flex flex-col space-y-4 p-5 md:p-6 w-full text-left";

            let cardGlowStyle = "0 4px 20px rgba(0,0,0,0.3)";
            let borderVarValue = "rgba(255,255,255,0.1)";
            let bgAccentVar = "rgba(255,255,255,0.02)";
            let chipStyleClass = "border-gray-700 text-gray-400 bg-gray-800/50";
            let hasHoloOverlay = false;
            
            if (badge.tier === "Uncommon") { borderVarValue = "rgba(16, 185, 129, 0.4)"; bgAccentVar = "rgba(16, 185, 129, 0.05)"; chipStyleClass = "border-emerald-800 text-emerald-400 bg-emerald-950/40"; }
            if (badge.tier === "Rare") { borderVarValue = "rgba(59, 130, 246, 0.5)"; bgAccentVar = "rgba(59, 130, 246, 0.05)"; cardGlowStyle = "0 8px 30px rgba(59, 130, 246, 0.15)"; chipStyleClass = "border-blue-800 text-blue-400 bg-blue-950/40"; }
            if (badge.tier === "Epic") { borderVarValue = "rgba(168, 85, 247, 0.6)"; bgAccentVar = "rgba(168, 85, 247, 0.05)"; cardGlowStyle = "0 8px 30px rgba(168, 85, 247, 0.2)"; chipStyleClass = "border-purple-800 text-purple-400 bg-purple-950/40"; }
            if (badge.tier === "Anomaly") { borderVarValue = "rgba(245, 158, 11, 0.7)"; bgAccentVar = "rgba(245, 158, 11, 0.08)"; cardGlowStyle = "0 8px 30px rgba(245, 158, 11, 0.25)"; chipStyleClass = "border-amber-500/50 text-amber-400 bg-amber-950/60"; hasHoloOverlay = true; }
            if (badge.tier === "Mythic") { borderVarValue = "rgba(244, 63, 94, 0.9)"; bgAccentVar = "rgba(244, 63, 94, 0.15)"; cardGlowStyle = "0 10px 40px rgba(244, 63, 94, 0.4)"; chipStyleClass = "border-rose-500 text-rose-400 bg-rose-950/60 font-bold shadow-[0_0_10px_rgba(244,63,94,0.3)]"; hasHoloOverlay = true; }

            cardNode.style.setProperty('--tier-border', borderVarValue);
            cardNode.style.setProperty('--tier-bg-accent', bgAccentVar);
            cardNode.style.boxShadow = cardGlowStyle;

            let digitsRowMarkup = '<div class="flex items-center pt-2 z-10">';
            const splitDigits = naturalStr.split('');
            const bName = badge.name;

            splitDigits.forEach((digit, pos) => {
                let isMatchTarget = false;

                if (bName.startsWith("Exact ") || bName === "Hay" || bName === "Very Very Nice" || bName === "Hotbox" || bName === "Mayday" || bName === "Universal Answer" || bName === "Orwellian" || bName === "Brainrot" || bName === "Groundhog Day" || bName.endsWith("Power") || bName === "Pi" || bName === "Euler's Number" || bName === "Factorial" || bName === "Fibonacci Number" || bName === "Prime Number" || bName === "Pronic Number" || bName === "Strobogrammatic" || bName === "Palindrome" || bName === "Even" || bName === "Odd" || bName === "Dozen" || bName === "Eleven" || bName === "Lucky Seven (Divisible)" || bName === "Single Digit" || bName === "Two Digits" || bName === "Three Digits" || bName === "Four Digits" || bName === "Five Digits" || bName === "Six Digits" || bName === "Heterogeneous" || bName === "Perfect Square" || bName === "Perfect Cube") {
                    isMatchTarget = true;
                }
                else if (bName === "Echo") {
                    isMatchTarget = true;
                }
                else if (bName === "Bookends") {
                    if (pos < 2 || pos >= splitDigits.length - 2) isMatchTarget = true;
                }
                else if (bName === "Sandwich") {
                    if (pos > 0 && pos < splitDigits.length - 1 && splitDigits[pos-1] === splitDigits[pos+1] && splitDigits[pos-1] !== Number(digit)) isMatchTarget = true;
                    if (pos < splitDigits.length - 2 && digit === splitDigits[pos+2] && digit !== splitDigits[pos+1]) isMatchTarget = true;
                    if (pos >= 2 && digit === splitDigits[pos-2] && digit !== splitDigits[pos-1]) isMatchTarget = true;
                }
                else if (bName === "Century") {
                    if (pos >= splitDigits.length - 2) isMatchTarget = true;
                }
                else if (bName === "Millennium") {
                    if (pos >= splitDigits.length - 3) isMatchTarget = true;
                }
                else if (bName === "Divisible by Three" && Number(digit) % 3 === 0) {
                    isMatchTarget = true;
                }
                else if (bName === "Contiguous Sixes" || bName === "Contiguous Fives" || bName === "Contiguous Quads" || bName === "Contiguous Trips" || bName === "Contiguous Pair" || bName === "Two Pair" || bName === "Three Pair" || bName === "Contiguous Three Pair") {
                    if ((pos > 0 && digit === splitDigits[pos-1]) || (pos < splitDigits.length - 1 && digit === splitDigits[pos+1])) isMatchTarget = true;
                }
                else if (bName.startsWith("Deep Void") && digit === "0") {
                    isMatchTarget = true;
                }
                else if (bName === "Ghost" && digit === "0") {
                    isMatchTarget = true;
                }
                else if (bName === "Void" && digit !== "0") {
                    isMatchTarget = true;
                }
                else if (bName.startsWith("Hydrogen") && digit === "1") isMatchTarget = true;
                else if (bName.startsWith("Helium") && digit === "2") isMatchTarget = true;
                else if (bName.startsWith("Lithium") && digit === "3") isMatchTarget = true;
                else if (bName.startsWith("Beryllium") && digit === "4") isMatchTarget = true;
                else if (bName.startsWith("Boron") && digit === "5") isMatchTarget = true;
                else if (bName.startsWith("Carbon") && digit === "6") isMatchTarget = true;
                else if (bName.startsWith("Nitrogen") && digit === "7") isMatchTarget = true;
                else if (bName.startsWith("Oxygen") && digit === "8") isMatchTarget = true;
                else if (bName.startsWith("Fluorine") && digit === "9") isMatchTarget = true;
                else if (bName === "Gap One" && (pos === 0 || pos === splitDigits.length - 1)) {
                    isMatchTarget = true;
                }
                else if ((bName === "Equilibrium" || bName === "Liftoff" || bName === "Grounded") && (pos === 0 || pos === splitDigits.length - 1)) {
                    isMatchTarget = true;
                }
                else if (bName === "Neighbors") {
                    if ((pos < splitDigits.length - 1 && Math.abs(Number(digit) - Number(splitDigits[pos+1])) === 1) || 
                        (pos > 0 && Math.abs(Number(digit) - Number(splitDigits[pos-1])) === 1)) {
                        isMatchTarget = true;
                    }
                }
                else if (bName === "Damien" && naturalStr.includes("0312")) {
                    let idx = naturalStr.indexOf("0312"); if (pos >= idx && pos < idx + 4) isMatchTarget = true;
                }
                else if (bName === "Hello" && naturalStr.includes("07734")) {
                    let idx = naturalStr.indexOf("07734"); if (pos >= idx && pos < idx + 5) isMatchTarget = true;
                }
                else if (bName === "Hell" && naturalStr.includes("7734")) {
                    let idx = naturalStr.indexOf("7734"); if (pos >= idx && pos < idx + 4) isMatchTarget = true;
                }
                else if ((bName === "80085" || bName === "Exact 80085") && naturalStr.includes("80085")) {
                    let idx = naturalStr.indexOf("80085"); if (pos >= idx && pos < idx + 5) isMatchTarget = true;
                }
                else if (bName === "58008" && naturalStr.includes("58008")) {
                    let idx = naturalStr.indexOf("58008"); if (pos >= idx && pos < idx + 5) isMatchTarget = true;
                }
                else if (bName === "8008" && naturalStr.includes("8008")) {
                    let idx = naturalStr.indexOf("8008"); if (pos >= idx && pos < idx + 4) isMatchTarget = true;
                }
                else if (bName.startsWith("Jackpot") && digit === "7") {
                    isMatchTarget = true;
                }
                else if (bName === "Lucky Seven" && digit === "7") isMatchTarget = true;
                else if (bName === "Devil" && naturalStr.includes("666")) {
                    let idx = naturalStr.indexOf("666"); if (pos >= idx && pos < idx + 3) isMatchTarget = true;
                }
                else if (bName === "Very Nice" && naturalStr.includes("6969")) {
                    let idx = naturalStr.indexOf("6969"); if (pos >= idx && pos < idx + 4) isMatchTarget = true;
                }
                else if (bName === "Nice" && naturalStr.includes("69")) {
                    let idx = naturalStr.indexOf("69"); if (pos >= idx && pos < idx + 2) isMatchTarget = true;
                }
                else if (bName === "Leet" && naturalStr.includes("1337")) {
                    let idx = naturalStr.indexOf("1337"); if (pos >= idx && pos < idx + 4) isMatchTarget = true;
                }
                else if (bName === "Not Funny" && naturalStr.includes("67")) {
                    let idx = naturalStr.indexOf("67"); if (pos >= idx && pos < idx + 2) isMatchTarget = true;
                }
                else if (bName === "HTTP 404" && naturalStr.includes("404")) {
                    let idx = naturalStr.indexOf("404"); if (pos >= idx && pos < idx + 3) isMatchTarget = true;
                }
                else if (bName === "HTTP 200" && naturalStr.includes("200")) {
                    let idx = naturalStr.indexOf("200"); if (pos >= idx && pos < idx + 3) isMatchTarget = true;
                }
                else if (bName === "Area 51" && naturalStr.includes("51")) {
                    let idx = naturalStr.indexOf("51"); if (pos >= idx && pos < idx + 2) isMatchTarget = true;
                }
                else if (bName === "Binary Mirage" && ['0','1','8'].includes(digit)) {
                    isMatchTarget = true;
                }
                else if (bName === "High Five" || bName === "4 Consecutive Numbers" || bName === "3 Consecutive Numbers" || bName === "Sequence (6)" || bName === "Sequence (5)" || bName === "Straight") {
                    isMatchTarget = true; 
                }

                digitsRowMarkup += `<div class="card-digit-box ${isMatchTarget ? 'highlighted' : ''}">${digit}</div>`;
            });
            digitsRowMarkup += '</div>';

            cardNode.innerHTML = `
                ${hasHoloOverlay ? '<div class="card-holographic-overlay"></div>' : ''}
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

            stackOutput.prepend(cardNode);
            synth.pop(); 
            
            setTimeout(() => {
                cardNode.classList.add('active');
                if (hasHoloOverlay) cardNode.querySelector('.card-holographic-overlay').style.opacity = "1";
                cardCursorIndex++;
                setTimeout(printRowItem, 250);
            }, 50);
        }
        printRowItem();
    }
});

document.getElementById('share-btn').addEventListener('click', () => {
    if (!lastRollData) return;
    let colorSquare = "⬜";
    if (lastRollData.rank === "Uncommon") colorSquare = "🟩";
    if (lastRollData.rank === "Rare") colorSquare = "🟦";
    if (lastRollData.rank === "Epic") colorSquare = "🟪";
    if (lastRollData.rank === "Anomaly") colorSquare = "🟧";
    if (lastRollData.rank === "Mythic") colorSquare = "🟥";

    let shareLines = [`RNGdle 🎲 ${lastRollData.number}`, ``, `${colorSquare} ${lastRollData.rank.toUpperCase()} • ${lastRollData.percentile}`, ``];
    
    const displayBadges = [...lastRollData.badges].reverse().slice(0, 3);
    displayBadges.forEach(b => {
        let bSquare = "⬜";
        if (b.tier === "Uncommon") bSquare = "🟩";
        if (b.tier === "Rare") bSquare = "🟦";
        if (b.tier === "Epic") bSquare = "🟪";
        if (b.tier === "Anomaly") bSquare = "🟧";
        if (b.tier === "Mythic") bSquare = "🟥";
        shareLines.push(`${bSquare} ${b.emoji} ${b.name}`);
    });

    if (lastRollData.badges.length > 3) shareLines.push(`+${lastRollData.badges.length - 3} more`);
    shareLines.push(``, `${lastRollData.ep.toLocaleString()} EP`, `https://kelpie0.github.io/rngdle-infinite`);

    navigator.clipboard.writeText(shareLines.join('\n')).then(() => {
        const toast = document.getElementById('toast');
        toast.classList.remove('opacity-0', 'translate-y-10');
        setTimeout(() => toast.classList.add('opacity-0', 'translate-y-10'), 2500);
    });
});

// UI Navigation Dashboard Components
const nav = {
    discoveredBadgeIds: new Set(), 
    
    init() {
        const overlay = document.getElementById('modal-screen-blur');
        const closeBtn = document.getElementById('close-dashboard-btn');
        const badgesBtn = document.getElementById('view-all-badges-btn');
        
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

        const cardFocusOverlay = document.getElementById('card-focus-overlay');
        if(cardFocusOverlay) {
            cardFocusOverlay.addEventListener('click', () => {
                cardFocusOverlay.classList.remove('opacity-100');
                cardFocusOverlay.classList.add('opacity-0');
                setTimeout(() => cardFocusOverlay.classList.add('hidden'), 300); 
            });
        }

        const dashboardBody = document.getElementById('dashboard-modal-body');
        if(dashboardBody) {
            dashboardBody.addEventListener('click', (e) => {
                const row = e.target.closest('.modal-badge-row');
                if (row && row.dataset.badgeId && row.dataset.discovered === "true") {
                    this.open3DCard(parseInt(row.dataset.badgeId));
                }
            });
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
        body.className = "overflow-y-auto pr-2 flex flex-col space-y-2"; 

        const tierWeights = { "Common": 1, "Uncommon": 2, "Rare": 3, "Epic": 4, "Anomaly": 5, "Mythic": 6 };
        const sortedDatabase = [...BADGES_DATABASE].sort((a, b) => {
            if (tierWeights[a.tier] !== tierWeights[b.tier]) {
                return tierWeights[b.tier] - tierWeights[a.tier]; 
            }
            return a.id - b.id; 
        });
        
        let badgesHTML = sortedDatabase.map(b => {
            const hasDiscovered = this.discoveredBadgeIds.has(b.id);
            
            let colorHex = "#374151"; 
            
            if (b.tier === "Uncommon") colorHex = "oklch(62.7% .194 149.214)";
            if (b.tier === "Rare") colorHex = "oklch(62.3% .214 259.815)";
            if (b.tier === "Epic") colorHex = "oklch(55.8% .288 302.321)";
            if (b.tier === "Anomaly") colorHex = "oklch(82.8% .189 84.429)";
            if (b.tier === "Mythic") colorHex = "oklch(65.6% .241 354.308)";

            return `
                <div data-badge-id="${b.id}" data-discovered="${hasDiscovered}" class="modal-badge-row p-3 rounded-xl flex items-center justify-between transition-all duration-200 ${hasDiscovered ? 'opacity-100 cursor-pointer hover:scale-[1.01]' : 'opacity-25 select-none'}" style="border-left: 4px solid ${hasDiscovered ? colorHex : '#1f2937'}">
                    <div class="flex items-center gap-3">
                        <span class="text-xl filter ${hasDiscovered ? '' : 'blur-[3px] grayscale'}">${hasDiscovered ? b.emoji : '❓'}</span>
                        <div class="flex flex-col">
                            <span class="font-bold font-mono text-xs ${hasDiscovered ? 'text-white' : 'text-gray-600 font-normal tracking-wide'} uppercase">${hasDiscovered ? b.name : 'Hidden Secret Badge'}</span>
                            <span class="font-mono text-[10px] text-gray-500 max-w-[340px] truncate">${hasDiscovered ? b.criteria : 'Unlock this badge by rolling integers meeting its hidden rules.'}</span>
                        </div>
                    </div>
                    <span class="font-mono text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded" style="color: ${colorHex}; background-color: ${colorHex}15; border: 1px solid ${colorHex}25">${b.tier}</span>
                </div>
            `;
        }).join('');

        badgesHTML += `
            <div class="pt-6 pb-2 w-full flex justify-center mt-auto">
                <button id="factory-reset-btn" class="px-5 py-2.5 bg-rose-500/10 text-rose-500 border border-rose-500/30 rounded-xl font-mono text-xs font-bold uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all duration-200 shadow-[0_0_15px_rgba(244,63,94,0.1)] hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] cursor-pointer">
                    ⚠️ Factory Reset Progress
                </button>
            </div>
        `;
        
        body.innerHTML = badgesHTML;

        const resetBtn = document.getElementById('factory-reset-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm("WARNING: This will permanently delete all your discovered badges, lifetime EP, and leaderboard history. Are you absolutely sure?")) {
                    localStorage.removeItem('rngdle_ep');
                    localStorage.removeItem('rngdle_topRolls');
                    localStorage.removeItem('rngdle_badges');
                    window.location.reload();
                }
            });
        }
    },

    open3DCard(badgeId) {
        const b = BADGES_DATABASE.find(x => x.id === badgeId);
        if (!b) return;

        let colorHex = "#374151"; 
        if (b.tier === "Uncommon") colorHex = "oklch(62.7% .194 149.214)";
        if (b.tier === "Rare") colorHex = "oklch(62.3% .214 259.815)";
        if (b.tier === "Epic") colorHex = "oklch(55.8% .288 302.321)";
        if (b.tier === "Anomaly") colorHex = "oklch(82.8% .189 84.429)";
        if (b.tier === "Mythic") colorHex = "oklch(65.6% .241 354.308)";

        const hasHolo = (b.tier === "Anomaly" || b.tier === "Mythic");
        const container = document.getElementById('card-focus-container');

        container.innerHTML = `
            <div class="card-flip-inner shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-2xl">
                <div class="card-front flex flex-col items-center justify-center p-6 text-center border-2 overflow-hidden" style="background: linear-gradient(145deg, #15151a, #08080a); border-color: ${colorHex}; box-shadow: inset 0 0 40px ${colorHex}20;">
                    ${hasHolo ? '<div class="card-holographic-overlay opacity-100"></div>' : ''}
                    <div class="card-glare"></div>
                    <div class="text-8xl mb-8 drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">${b.emoji}</div>
                    <h2 class="font-mono font-bold text-2xl text-white tracking-widest uppercase mb-4 z-10">${b.name}</h2>
                    <span class="font-mono text-[10px] uppercase font-bold tracking-[0.3em] px-4 py-1.5 rounded-full z-10" style="color: ${colorHex}; background-color: ${colorHex}15; border: 1px solid ${colorHex}50">${b.tier} CLASSIFICATION</span>
                </div>
                <div class="card-back flex flex-col items-center justify-center p-6 text-center border-2" style="background: linear-gradient(145deg, #0f0f13, #050505); border-color: ${colorHex}80;">
                    <div class="text-4xl mb-4 opacity-30">${b.emoji}</div>
                    <h3 class="font-mono text-[10px] text-gray-500 uppercase tracking-[0.3em] border-b border-gray-800 w-full pb-3 mb-6">Database Authentication File</h3>
                    <div class="flex-1 flex items-center justify-center w-full">
                        <p class="font-mono text-gray-300 text-sm leading-loose tracking-wide">"${b.criteria}"</p>
                    </div>
                    <div class="w-full bg-black/60 rounded-xl p-4 border border-white/5 mt-auto flex flex-col items-center">
                        <span class="text-[9px] text-gray-500 font-mono uppercase tracking-[0.2em] mb-1">Base Target Extraction Value</span>
                        <span class="text-xl font-mono font-bold text-amber-400">+${b.ep.toLocaleString()} EP</span>
                    </div>
                </div>
            </div>
        `;

        const overlay = document.getElementById('card-focus-overlay');
        overlay.classList.remove('hidden');
        setTimeout(() => overlay.classList.remove('opacity-0'), 10);
        setTimeout(() => overlay.classList.add('opacity-100'), 20);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    sessionLifetimeEP = parseInt(localStorage.getItem('rngdle_ep')) || 0;
    try { topRolls = JSON.parse(localStorage.getItem('rngdle_topRolls')) || []; } catch(e) { topRolls = []; }
    let savedBadges = [];
    try { savedBadges = JSON.parse(localStorage.getItem('rngdle_badges')) || []; } catch(e) {}
    nav.discoveredBadgeIds = new Set(savedBadges);

    document.getElementById('lifetime-ep-counter').innerText = `${sessionLifetimeEP.toLocaleString()} Total Lifetime EP`;
    if (topRolls.length > 0) updateLeaderboard();

    nav.init();
});