let isRolling = false;
let sessionLifetimeEP = 0;

document.getElementById('roll-btn').addEventListener('click', () => {
    if (isRolling) return;
    isRolling = true;

    const rollBtn = document.getElementById('roll-btn');
    const display = document.getElementById('number-display');
    const metaRow = document.getElementById('meta-row');
    const scoreWrapper = document.getElementById('score-wrapper');
    const rankTag = document.getElementById('rank-tag');
    const percentTag = document.getElementById('percent-tag');
    const currentEpCounter = document.getElementById('current-ep-counter');
    const lifetimeEpCounter = document.getElementById('lifetime-ep-counter');
    const feedWrapper = document.getElementById('feed-wrapper');
    const earnedCounterLabel = document.getElementById('earned-counter-label');
    const stackOutput = document.getElementById('badges-output-stack');
    const capsuleGlow = document.getElementById('capsule-glow');

    // UI Configuration Cleanup
    rollBtn.disabled = true;
    rollBtn.innerHTML = '<span class="text-xl animate-spin inline-block">⚡</span> ANALYZING ENTROPY...';
    
    [metaRow, scoreWrapper, feedWrapper].forEach(el => {
        el.classList.remove('opacity-100', 'translate-y-0');
        el.classList.add('opacity-0', 'translate-y-2');
    });
    
    stackOutput.innerHTML = '';
    capsuleGlow.style.opacity = '0';
    
    document.documentElement.style.setProperty('--tier-glow', '0 0 0 transparent');
    document.documentElement.style.setProperty('--tier-border', 'rgba(255,255,255,0.1)');

    const rolledNumber = Math.floor(Math.random() * 1000001);
    const rolledStr = rolledNumber.toString().padStart(6, '0');
    const badgesEarned = evaluateRoll(rolledNumber);
    const totalEP = badgesEarned.reduce((sum, b) => sum + b.ep, 0);
    const cardRank = calculateCardRarity(totalEP);

    // 1. Digit Flicking Reveal Animation
    let frameTicks = 0;
    const maxFrames = 66; 

    const cinematicInterval = setInterval(() => {
        let lockBoundary = Math.floor((frameTicks / maxFrames) * 6);
        let temporaryFrameStr = "";

        for (let i = 0; i < 6; i++) {
            if (i < lockBoundary) {
                temporaryFrameStr += rolledStr[i]; 
            } else {
                temporaryFrameStr += Math.floor(Math.random() * 10).toString(); 
            }
        }

        display.innerText = temporaryFrameStr;
        frameTicks++;

        if (frameTicks >= maxFrames) {
            clearInterval(cinematicInterval);
            processSystemReveal();
        }
    }, 60); // Sped up slightly for better feel

    // 2. Parse card styles 
    function processSystemReveal() {
        display.innerText = rolledStr;

        let tagColorClass = "text-gray-400 border-gray-600 bg-gray-800";
        let outerShadow = "0 0 40px rgba(255,255,255,0.05)";
        let borderHex = "rgba(255,255,255,0.2)";
        let bgAccent = "rgba(255,255,255,0.02)";
        
        if (cardRank.name === "Uncommon") { tagColorClass = "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"; borderHex = "rgba(16, 185, 129, 0.4)"; outerShadow = "0 0 40px rgba(16, 185, 129, 0.2)"; bgAccent = "rgba(16, 185, 129, 0.05)";}
        if (cardRank.name === "Rare") { tagColorClass = "text-blue-400 border-blue-500/30 bg-blue-500/10"; borderHex = "rgba(59, 130, 246, 0.5)"; outerShadow = "0 0 50px rgba(59, 130, 246, 0.25)"; bgAccent = "rgba(59, 130, 246, 0.05)";}
        if (cardRank.name === "Epic") { tagColorClass = "text-purple-400 border-purple-500/30 bg-purple-500/10"; borderHex = "rgba(168, 85, 247, 0.6)"; outerShadow = "0 0 60px rgba(168, 85, 247, 0.3)"; bgAccent = "rgba(168, 85, 247, 0.05)";}
        if (cardRank.name === "Anomaly") { tagColorClass = "text-amber-400 border-amber-500/30 bg-amber-500/10"; borderHex = "rgba(245, 158, 11, 0.7)"; outerShadow = "0 0 70px rgba(245, 158, 11, 0.35)"; bgAccent = "rgba(245, 158, 11, 0.05)";}
        if (cardRank.name === "Mythic") { tagColorClass = "text-rose-500 border-rose-500/50 bg-rose-500/20 font-bold shadow-[0_0_15px_rgba(244,63,94,0.5)]"; borderHex = "rgba(244, 63, 94, 0.8)"; outerShadow = "0 0 100px rgba(244, 63, 94, 0.4)"; bgAccent = "rgba(244, 63, 94, 0.1)";}

        document.documentElement.style.setProperty('--tier-glow', outerShadow);
        document.documentElement.style.setProperty('--tier-border', borderHex);
        
        capsuleGlow.style.background = borderHex;
        capsuleGlow.style.opacity = '0.5';

        rankTag.innerText = cardRank.name;
        rankTag.className = `px-3 py-1 rounded-full border backdrop-blur-sm ${tagColorClass}`;

        const percentileMockValue = Math.max(1, Math.floor(100 - (totalEP / 495)));
        percentTag.innerText = percentileMockValue > 50 ? `BOTTOM ${100 - percentileMockValue}%` : `TOP ${percentileMockValue}%`;

        [metaRow, scoreWrapper].forEach(el => {
            el.classList.remove('opacity-0', 'translate-y-2');
            el.classList.add('opacity-100', 'translate-y-0');
        });

        // Dynamic points calculation increment counter
        let countingPoints = 0;
        const incrementalStep = Math.max(1, Math.ceil(totalEP / 20));
        const countingTimer = setInterval(() => {
            countingPoints += incrementalStep;
            if (countingPoints >= totalEP) {
                countingPoints = totalEP;
                clearInterval(countingTimer);
                
                sessionLifetimeEP += totalEP;
                lifetimeEpCounter.innerText = `${sessionLifetimeEP.toLocaleString()} Total Lifetime EP`;
                
                loadSequentialBadgeFeed();
            }
            currentEpCounter.innerText = `${countingPoints.toLocaleString()} EP`;
        }, 30);
    }

    // 3. Spool card nodes out sequentially
    function loadSequentialBadgeFeed() {
        earnedCounterLabel.innerText = `${badgesEarned.length} Badges Earned`;
        feedWrapper.classList.remove('opacity-0');

        let cardCursorIndex = 0;

        function printRowItem() {
            if (cardCursorIndex >= badgesEarned.length) {
                rollBtn.disabled = false;
                rollBtn.innerHTML = '<span class="text-xl">🎰</span> Generate Roll';
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
                else if (badge.name.includes("2 Consecutive Numbers") || badge.name.includes("Neighbors") || badge.name.includes("Odd") || badge.name.includes("Even") || badge.name.includes("Void")) {
                    isMatchTarget = true; 
                }

                digitsRowMarkup += `<div class="card-digit-box ${isMatchTarget ? 'highlighted' : ''}">${digit}</div>`;
            });
            digitsRowMarkup += '</div>';

            cardNode.innerHTML = `
                <div class="card-holographic-overlay"></div>
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
                            +${badge.ep.toLocaleString()} EP
                        </span>
                    </div>
                </div>
                <div class="text-xs font-mono text-gray-400 uppercase tracking-widest z-10 pl-1 border-l-2 border-gray-700">${badge.criteria}.</div>
                ${digitsRowMarkup}
            `;

            if (badge.name.includes("Contiguous Pair")) {
                const embeddedRow = document.createElement('div');
                embeddedRow.className = "nested-child-row flex justify-between items-center text-[10px] font-mono text-gray-400 mt-2 z-10";
                embeddedRow.innerHTML = `
                    <div class="flex items-center space-x-2">
                        <span class="text-gray-600">└</span>
                        <span class="text-sm">🧑‍🤝‍🧑</span>
                        <span class="uppercase font-bold text-gray-300 tracking-wider">Pair</span>
                    </div>
                    <span class="text-emerald-500 border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 rounded">(EARNED)</span>
                `;
                cardNode.appendChild(embeddedRow);
            }

            stackOutput.appendChild(cardNode);
            
            setTimeout(() => {
                cardNode.classList.add('active');
                if (hasHoloOverlay) {
                    const overlay = cardNode.querySelector('.card-holographic-overlay');
                    if (overlay) overlay.style.opacity = "1";
                }
                cardCursorIndex++;
                setTimeout(printRowItem, 250); // Slightly faster cascade
            }, 50);
        }

        printRowItem();
    }
});