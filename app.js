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

// Global State Variables
let isRolling = false;
let sessionLifetimeEP = 0;
let topRolls = []; 
let lastRollData = null; 
let autoSkipSettings = { "Common": false, "Uncommon": false, "Rare": false, "Epic": false, "Anomaly": false, "Mythic": false };

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
                <span class="text-[9px] text-gray-500 font-mono tracking-tighter">Roll #${roll.index || idx + 1}</span>
            </div>
        `;

        div.addEventListener('mouseenter', () => {
            tooltipModal.innerHTML = `
                <div class="text-xs font-mono text-gray-400 uppercase tracking-widest mb-1 border-b border-white/5 pb-1">Badges Extracted</div>
                <div class="flex flex-col space-y-1">
                    ${roll.badges.map(b => `
                        <div class="flex items-center justify-between text-xs font-mono">
                            <span class="text-white">${b.emoji} ${b.name}</span>
                            <span class="text-gray-500 text-[10px] uppercase ml-4">${b.tier}</span>
                        </div>
                    `).join('')}
                </div>
            `;
            tooltipModal.classList.add('visible');
        });

        div.addEventListener('mouseleave', () => {
            tooltipModal.classList.remove('visible');
        });

        container.appendChild(div);
    });
}

function initializeAutoSkipPanel() {
    const skipListContainer = document.getElementById('autoskip-toggle-list');
    if (!skipListContainer) return;
    skipListContainer.innerHTML = '';

    const tiers = ["Common", "Uncommon", "Rare", "Epic", "Anomaly", "Mythic"];
    const colors = {
        "Common": "text-gray-400 border-gray-800",
        "Uncommon": "text-[oklch(62.7%_.194_149.214)] border-green-900/40",
        "Rare": "text-[oklch(62.3%_.214_259.815)] border-blue-900/40",
        "Epic": "text-[oklch(55.8%_.288_302.321)] border-purple-900/40",
        "Anomaly": "text-[oklch(82.8%_.189_84.429)] border-yellow-800/40",
        "Mythic": "text-[oklch(65.6%_.241_354.308)] border-rose-900/40"
    };

    const savedSettings = localStorage.getItem('rngdle_autoskip');
    if (savedSettings) {
        try { autoSkipSettings = JSON.parse(savedSettings); } catch(e) {}
    }

    tiers.forEach(tier => {
        const row = document.createElement('label');
        row.className = `flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.04] transition-all select-none`;
        row.innerHTML = `
            <span class="font-mono text-xs font-bold tracking-wider ${colors[tier]}">${tier} Tiers</span>
            <input type="checkbox" data-tier="${tier}" ${autoSkipSettings[tier] ? 'checked' : ''} class="w-4 h-4 rounded border-gray-800 text-amber-500 focus:ring-0 bg-black/40 cursor-pointer">
        `;

        row.querySelector('input').addEventListener('change', (e) => {
            const t = e.target.getAttribute('data-tier');
            autoSkipSettings[t] = e.target.checked;
            localStorage.setItem('rngdle_autoskip', JSON.stringify(autoSkipSettings));
            synth.tick();
        });

        skipListContainer.appendChild(row);
    });
}

function getHighestTier(badgesList) {
    const tierWeights = { "Common": 1, "Uncommon": 2, "Rare": 3, "Epic": 4, "Anomaly": 5, "Mythic": 6 };
    let highestWeight = 0;
    let highestTier = "Common";
    badgesList.forEach(b => {
        let weight = tierWeights[b.tier] || 1;
        if (weight > highestWeight) {
            highestWeight = weight;
            highestTier = b.tier;
        }
    });
    return highestTier;
}

const nav = {
    discoveredBadgeIds: new Set(),
    showToast(message) {
        const toast = document.getElementById('toast');
        toast.innerText = message;
        toast.classList.remove('opacity-0', 'translate-y-2', 'pointer-events-none');
        toast.classList.add('opacity-100', 'translate-y-0');
        setTimeout(() => {
            toast.classList.remove('opacity-100', 'translate-y-0');
            toast.classList.add('opacity-0', 'translate-y-2', 'pointer-events-none');
        }, 3000);
    },
    renderBadgeCard(b) {
        let glow = "rgba(255,255,255,0.05)";
        let border = "border-white/10";
        let textGlow = "";
        
        if (b.tier === "Uncommon") { glow = "rgba(34,197,94,0.1)"; border = "border-green-500/30"; }
        if (b.tier === "Rare") { glow = "rgba(59,130,246,0.1)"; border = "border-blue-500/30"; }
        if (b.tier === "Epic") { glow = "rgba(168,85,247,0.1)"; border = "border-purple-500/30"; }
        if (b.tier === "Anomaly") { glow = "rgba(234,179,8,0.1)"; border = "border-yellow-500/30"; textGlow = "text-shadow: 0 0 10px rgba(234,179,8,0.4)"; }
        if (b.tier === "Mythic") { glow = "rgba(239,68,68,0.1)"; border = "border-red-500/40"; textGlow = "text-shadow: 0 0 15px rgba(239,68,68,0.6)"; }

        const hasDiscovered = this.discoveredBadgeIds.has(b.id);

        return `
            <div onclick="nav.focusCard(${b.id})" class="group relative w-full h-44 bg-black/40 rounded-2xl border ${border} p-4 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:bg-black/60 cursor-pointer" style="box-shadow: inset 0 0 20px ${glow}">
                <div class="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none"></div>
                <div class="flex justify-between items-start z-10">
                    <span class="font-mono text-[9px] tracking-widest text-gray-500 uppercase">${b.tier}</span>
                    <span class="font-mono text-[10px] text-gray-600 font-bold">#${b.id.toString().padStart(3, '0')}</span>
                </div>
                <div class="flex flex-col items-center my-auto z-10 ${hasDiscovered ? '' : 'blur-md opacity-20 transition-all group-hover:blur-sm'}">
                    <span class="text-3xl mb-1 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">${b.emoji}</span>
                    <span class="font-mono font-bold text-xs text-center text-white tracking-wide truncate max-w-full px-1" style="${textGlow}">${b.name}</span>
                </div>
                <div class="w-full flex justify-between items-center pt-2 border-t border-white/5 z-10 text-[9px] font-mono text-gray-500">
                    <span>Extraction Base</span>
                    <span class="text-amber-400 font-bold">+${b.ep.toLocaleString()}</span>
                </div>
                ${!hasDiscovered ? `<div class="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] font-mono text-[10px] uppercase tracking-[0.2em] text-gray-600 font-bold">Locked</div>` : ''}
            </div>
        `;
    },
    focusCard(id) {
        if (!this.discoveredBadgeIds.has(id)) return;
        const b = BADGES_DATABASE.find(item => item.id === id);
        if (!b) return;

        let tierColor = "text-gray-400";
        let tierBg = "from-zinc-900 to-black";
        let glowColor = "rgba(255,255,255,0.1)";
        if (b.tier === "Uncommon") { tierColor = "text-green-400"; tierBg = "from-emerald-950/40 to-black"; glowColor = "rgba(34,197,94,0.2)"; }
        if (b.tier === "Rare") { tierColor = "text-blue-400"; tierBg = "from-blue-950/40 to-black"; glowColor = "rgba(59,130,246,0.2)"; }
        if (b.tier === "Epic") { tierColor = "text-purple-400"; tierBg = "from-purple-950/40 to-black"; glowColor = "rgba(168,85,247,0.2)"; }
        if (b.tier === "Anomaly") { tierColor = "text-yellow-400 animate-pulse"; tierBg = "from-yellow-950/40 to-black"; glowColor = "rgba(234,179,8,0.3)"; }
        if (b.tier === "Mythic") { tierColor = "text-red-400 font-extrabold"; tierBg = "from-red-950/40 to-black"; glowColor = "rgba(239,68,68,0.4)"; }

        const container = document.getElementById('card-focus-container');
        container.innerHTML = `
            <div class="card-inner absolute inset-0 transform-style-3d w-full h-full">
                <div class="card-front absolute inset-0 bg-gradient-to-b ${tierBg} border border-white/10 p-6 flex flex-col items-center shadow-2xl" style="box-shadow: 0 0 40px ${glowColor}, inset 0 0 30px ${glowColor}">
                    <div class="card-glare"></div>
                    <div class="w-full flex justify-between items-center mb-6">
                        <span class="font-mono text-xs font-bold tracking-[0.2em] ${tierColor} uppercase">${b.tier} Protocol</span>
                        <span class="font-mono text-xs text-gray-600 font-bold">INDEX // ${b.id.toString().padStart(3, '0')}</span>
                    </div>
                    <div class="my-auto flex flex-col items-center">
                        <span class="text-7xl mb-4 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.7)] animate-bounce">${b.emoji}</span>
                        <h2 class="font-mono font-bold text-xl text-center text-white tracking-widest uppercase px-2 mb-2">${b.name}</h2>
                    </div>
                    <div class="bg-white/[0.02] border border-white/5 rounded-xl p-3 w-full text-center mb-6 min-h-[60px] flex items-center justify-center w-full">
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
    updateLeaderboard();
    initializeAutoSkipPanel();

    document.getElementById('view-all-badges-btn').addEventListener('click', () => {
        const modal = document.getElementById('all-badges-modal');
        const body = document.getElementById('dashboard-modal-body');
        
        let sortedDB = [...BADGES_DATABASE].sort((a,b) => a.id - a.id);
        body.innerHTML = `
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pb-12">
                ${sortedDB.map(badge => nav.renderBadgeCard(badge)).join('')}
            </div>
        `;

        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.remove('opacity-0'), 10);
        setTimeout(() => modal.classList.add('opacity-100'), 20);
        synth.pop();
    });

    document.getElementById('close-dashboard-btn').addEventListener('click', () => {
        const modal = document.getElementById('all-badges-modal');
        modal.classList.add('opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 200);
    });

    document.getElementById('card-focus-overlay').addEventListener('click', () => {
        const overlay = document.getElementById('card-focus-overlay');
        overlay.classList.add('opacity-0');
        setTimeout(() => overlay.classList.add('hidden'), 300);
    });

    document.getElementById('clear-history-btn').addEventListener('click', () => {
        if (confirm("Wipe all highscores and unlock records permanently?")) {
            localStorage.clear();
            topRolls = [];
            sessionLifetimeEP = 0;
            nav.discoveredBadgeIds.clear();
            document.getElementById('lifetime-ep-counter').innerText = `0 Total Lifetime EP`;
            updateLeaderboard();
            initializeAutoSkipPanel();
            synth.vaporise();
            nav.showToast("DATA TRACK Wiped Clean.");
        }
    });

    document.getElementById('roll-btn').addEventListener('click', executeRollCycle);
});

function executeRollCycle() {
    if (isRolling) return;
    synth.init();

    const display = document.getElementById('number-display');
    const track = document.getElementById('earned-badges-track');
    const rollBtn = document.getElementById('roll-btn');

    isRolling = true;
    rollBtn.disabled = true;
    rollBtn.classList.add('opacity-50', 'cursor-not-allowed');
    track.innerHTML = '';

    let rollLen = Math.floor(Math.random() * 5) + 2; 
    if (Math.random() < 0.05) rollLen = 1; 
    let generatedNumStr = '';

    display.innerHTML = '';
    for (let i = 0; i < rollLen; i++) {
        const span = document.createElement('span');
        span.className = 'spinning-digit-dimmed';
        span.innerText = '0';
        display.appendChild(span);
    }

    let currentDigitIndex = 0;
    let ticksInCurrentDigit = 0;
    const maxTicksPerDigit = 6;

    let loopInterval = setInterval(() => {
        const spans = display.getElementsByTagName('span');
        
        for (let i = currentDigitIndex; i < rollLen; i++) {
            if (spans[i]) {
                spans[i].innerText = Math.floor(Math.random() * 10).toString();
                spans[i].className = 'spinning-digit-dimmed';
            }
        }

        synth.tick();
        ticksInCurrentDigit++;

        if (ticksInCurrentDigit >= maxTicksPerDigit) {
            let finalDigit = Math.floor(Math.random() * 10);
            if (currentDigitIndex === 0 && rollLen > 1 && finalDigit === 0) {
                finalDigit = Math.floor(Math.random() * 9) + 1;
            }
            generatedNumStr += finalDigit.toString();

            if (spans[currentDigitIndex]) {
                spans[currentDigitIndex].innerText = finalDigit.toString();
                spans[currentDigitIndex].className = 'text-white digit-lock-bounce';
            }

            currentDigitIndex++;
            ticksInCurrentDigit = 0;

            if (currentDigitIndex >= rollLen) {
                clearInterval(loopInterval);
                concludeRoll(parseInt(generatedNumStr));
            }
        }
    }, 45);
}

function concludeRoll(finalNumber) {
    const track = document.getElementById('earned-badges-track');
    const rollBtn = document.getElementById('roll-btn');
    
    let activeBadges = evaluateBadges(finalNumber);
    let highestTierMatched = getHighestTier(activeBadges);

    let isAutoSkipActive = autoSkipSettings[highestTierMatched] === true;

    let roundEarnedEP = 0;
    let newlyDiscoveredCount = 0;

    activeBadges.forEach(badge => {
        let actualEP = calculateScaledEP(badge);
        roundEarnedEP += actualEP;

        if (!nav.discoveredBadgeIds.has(badge.id)) {
            nav.discoveredBadgeIds.add(badge.id);
            newlyDiscoveredCount++;
        }
    });

    sessionLifetimeEP += roundEarnedEP;
    localStorage.setItem('rngdle_ep', sessionLifetimeEP.toString());
    localStorage.setItem('rngdle_badges', JSON.stringify([...nav.discoveredBadgeIds]));

    const currentRollRecord = {
        number: finalNumber,
        rank: highestTierMatched,
        ep: roundEarnedEP,
        badges: activeBadges,
        index: topRolls.length + 1
    };

    topRolls.push(currentRollRecord);
    topRolls.sort((a, b) => b.ep - a.ep);
    if (topRolls.length > 50) topRolls.pop();
    localStorage.setItem('rngdle_topRolls', JSON.stringify(topRolls));

    document.getElementById('lifetime-ep-counter').innerText = `${sessionLifetimeEP.toLocaleString()} Total Lifetime EP`;
    
    let sessionCountElement = document.getElementById('session-count');
    if (sessionCountElement) {
        sessionCountElement.innerText = `Roll #${topRolls.length}`;
    }

    updateLeaderboard();

    if (isAutoSkipActive) {
        // Instant presentation bypass step
        activeBadges.forEach(b => {
            const el = document.createElement('div');
            el.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 font-mono text-xs text-white opacity-100 transition-all";
            el.innerHTML = `<span>${b.emoji}</span> <span class="font-bold">${b.name}</span>`;
            track.appendChild(el);
        });

        synth.chime(highestTierMatched);
        if (newlyDiscoveredCount > 0) {
            nav.showToast(`Extracted +${newlyDiscoveredCount} New Data Badges!`);
        }

        isRolling = false;
        rollBtn.disabled = false;
        rollBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        // Fall back to elegant step reveals
        let revealIndex = 0;
        function revealNextBadge() {
            if (revealIndex >= activeBadges.length) {
                synth.chime(highestTierMatched);
                if (newlyDiscoveredCount > 0) {
                    nav.showToast(`Extracted +${newlyDiscoveredCount} New Data Badges!`);
                }
                isRolling = false;
                rollBtn.disabled = false;
                rollBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                return;
            }

            let b = activeBadges[revealIndex];
            const el = document.createElement('div');
            el.className = "flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 font-mono text-xs text-white opacity-0 translate-y-1 transition-all duration-300";
            el.innerHTML = `<span>${b.emoji}</span> <span class="font-bold">${b.name}</span>`;
            track.appendChild(el);

            setTimeout(() => {
                el.classList.remove('opacity-0', 'translate-y-1');
                el.classList.add('opacity-100', 'translate-y-0');
                synth.pop();
                revealIndex++;
                setTimeout(revealNextBadge, 350);
            }, 50);
        }

        revealNextBadge();
    }
}