// Native Web Audio Synthesizer
const synth = {
    ctx: null,
    init() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); },
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
    pop() { this.playTone(300, 'square', 0.08, 0.03); setTimeout(() => this.playTone(600, 'sine', 0.1, 0.03), 20); },
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

let isRolling = false;
let sessionLifetimeEP = 0;
let topRolls = []; 
let lastRollData = null; 

// Dynamic Multipliers tailored to matching the target game balance sheets
function calculateScaledEP(baseBadge) {
    if (baseBadge.tier === "Common") return Math.floor(Math.random() * 250) + 150;        // 150 - 400 EP
    if (baseBadge.tier === "Uncommon") return Math.floor(Math.random() * 1200) + 1200;    // 1,200 - 2,400 EP
    if (baseBadge.tier === "Rare") return Math.floor(Math.random() * 4000) + 5500;        // 5,500 - 9,500 EP
    if (baseBadge.tier === "Epic") return Math.floor(Math.random() * 8000) + 16000;       // 16,000 - 24,000 EP
    if (baseBadge.tier === "Anomaly") return Math.floor(Math.random() * 25000) + 45000;    // 45,000 - 70,000 EP
    if (baseBadge.tier === "Mythic") return Math.floor(Math.random() * 150000) + 120000;   // 120,000 - 270,000 EP
    return baseBadge.ep;
}

// Global Cursor-Tracking Floating Window Frame Initialization
const tooltipModal = document.createElement('div');
tooltipModal.className = 'leaderboard-tooltip-modal p-4 flex flex-col space-y-3';
document.body.appendChild(tooltipModal);

window.addEventListener('mousemove', (e) => {
    if (tooltipModal.classList.contains('visible')) {
        tooltipModal.style.left = `${e.clientX + 20}px`;
        tooltipModal.style.top = `${e.clientY + 10}px`;
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

            // Clean, infinite vertical expansion block
            tooltipModal.innerHTML = `
                <div class="text-xs font-mono font-bold text-gray-400 tracking-wider border-b border-white/10 pb-1.5 flex justify-between items-center mb-2 w-full">
                    <span class="flex items-center gap-1">📊 Roll Breakdowns</span>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold text-white" style="background-color: ${borderColor}33; border: 1px solid ${borderColor}">${roll.number}</span>
                </div>
                <div class="flex flex-col space-y-2 w-full">${badgeListMarkup}</div>
            `;
            tooltipModal.classList.add('visible');
        });

        div.addEventListener('mouseleave', () => {
            tooltipModal.classList.remove('visible');
        });

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
    rollBtn.innerHTML = '<span class="text-xl animate-spin inline-block">⚡</span> ANALYZING...';
    shareBtn.classList.add('hidden');
    
    [metaRow, scoreWrapper, feedWrapper].forEach(el => {
        el.classList.remove('opacity-100', 'translate-y-0');
        el.classList.add('opacity-0', 'translate-y-2');
    });
    
    stackOutput.innerHTML = '';
    capsuleGlow.style.opacity = '0';
    document.documentElement.style.setProperty('--tier-glow', '0 0 0 transparent');
    document.documentElement.style.setProperty('--tier-border', 'rgba(255,255,255,0.1)');

    const rolledStr = generateRollString();
    const badgesEarnedRaw = evaluateRoll(rolledStr);
    const badgesEarned = badgesEarnedRaw.map(b => ({ ...b, calculatedEP: calculateScaledEP(b) }));

    const tierWeights = { "Common": 1, "Uncommon": 2, "Rare": 3, "Epic": 4, "Anomaly": 5, "Mythic": 6 };
    badgesEarned.sort((a, b) => {
        if (tierWeights[a.tier] !== tierWeights[b.tier]) {
            return tierWeights[a.tier] - tierWeights[b.tier];
        }
        return a.calculatedEP - b.calculatedEP;
    });

    const totalEP = badgesEarned.reduce((sum, b) => sum + b.calculatedEP, 0);
    const cardRank = calculateCardRarity(totalEP);
    
    let calcPercent = 100 - Math.floor((totalEP / 85000) * 99);
    calcPercent = Math.max(1, Math.min(99, calcPercent)); 
    const percentString = calcPercent > 50 ? `BOTTOM ${calcPercent}%` : `TOP ${calcPercent}%`;

    lastRollData = { number: rolledStr, rank: cardRank.name, percentile: percentString, badges: badgesEarned, ep: totalEP };

    let frameTicks = 0;
    const maxFrames = 66; 

    // Dynamic Cinematic Single-Digit Dimming Sequencer Loop
    const cinematicInterval = setInterval(() => {
        let lockBoundary = Math.floor((frameTicks / maxFrames) * rolledStr.length);
        display.innerHTML = '';
        
        for (let i = 0; i < rolledStr.length; i++) {
            const digitSpan = document.createElement('span');
            if (i < lockBoundary) {
                // FIXED: Already locked numbers display standard bright text
                digitSpan.innerText = rolledStr[i];
            } else {
                // FIXED: Active rolling single digits get the dimmed gray class selectively applied
                digitSpan.innerText = Math.floor(Math.random() * 10).toString();
                digitSpan.className = 'spinning-digit-dimmed';
            }
            display.appendChild(digitSpan);
        }

        synth.tick(); 
        frameTicks++;

        if (frameTicks >= maxFrames) {
            clearInterval(cinematicInterval);
            processSystemReveal();
        }
    }, 60);

    function processSystemReveal() {
        display.innerHTML = rolledStr; 
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
        const incrementalStep = Math.max(1, Math.ceil(totalEP / 20));
        const countingTimer = setInterval(() => {
            countingPoints += incrementalStep;
            if (countingPoints >= totalEP) {
                countingPoints = totalEP;
                clearInterval(countingTimer);
                
                sessionLifetimeEP += totalEP;
                lifetimeEpCounter.innerText = `${sessionLifetimeEP.toLocaleString()} Total Lifetime EP`;
                
                topRolls.push({ number: rolledStr, rank: cardRank.name, ep: totalEP, badges: badgesEarned });
                topRolls.sort((a,b) => b.ep - a.ep);
                topRolls = topRolls.slice(0, 5); 
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
            const splitDigits = rolledStr.split('');
            splitDigits.forEach((digit, pos) => {
                let isMatchTarget = false;
                if (badge.name.includes("Hydrogen") && digit === "1") isMatchTarget = true;
                else if (badge.name.includes("Carbon") && digit === "6") isMatchTarget = true;
                else if (badge.name.includes("Oxygen") && digit === "8") isMatchTarget = true;
                else if (badge.name.includes("Fluorine") && digit === "9") isMatchTarget = true;
                else if (badge.name.includes("Ghost") && digit === "0") isMatchTarget = true;
                else if (badge.name.includes("Contiguous Pair") && (pos > 0 && digit === splitDigits[pos-1] || pos < 5 && digit === splitDigits[pos+1])) isMatchTarget = true;
                else if (badge.name.includes("Consecutive") || badge.name.includes("Neighbors") || badge.name.includes("Sequence") || badge.name.includes("Odd") || badge.name.includes("Even") || badge.name.includes("Void")) {
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

// Clipboard Share Configuration
document.getElementById('share-btn').addEventListener('click', () => {
    if (!lastRollData) return;
    
    let colorSquare = "⬜";
    if (lastRollData.rank === "Uncommon") colorSquare = "🟩";
    if (lastRollData.rank === "Rare") colorSquare = "🟦";
    if (lastRollData.rank === "Epic") colorSquare = "🟪";
    if (lastRollData.rank === "Anomaly") colorSquare = "🟧";
    if (lastRollData.rank === "Mythic") colorSquare = "🟥";

    let shareLines = [
        `RNGdle 🎲 ${lastRollData.number}`,
        ``,
        `${colorSquare} ${lastRollData.rank.toUpperCase()} • ${lastRollData.percentile}`,
        ``
    ];

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

    if (lastRollData.badges.length > 3) {
        shareLines.push(`+${lastRollData.badges.length - 3} more`);
    }

    shareLines.push(``);
    shareLines.push(`${lastRollData.ep.toLocaleString()} EP`);
    shareLines.push(`https://kelpie0.github.io/rngdle-infinite`);

    navigator.clipboard.writeText(shareLines.join('\n')).then(() => {
        const toast = document.getElementById('toast');
        toast.classList.remove('opacity-0', 'translate-y-10');
        setTimeout(() => toast.classList.add('opacity-0', 'translate-y-10'), 2500);
    });
});