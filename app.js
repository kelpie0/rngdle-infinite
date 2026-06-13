let isRolling = false;
let sessionLifetimeEP = 0;

document.getElementById('roll-btn').addEventListener('click', () => {
    if (isRolling) return;
    isRolling = true;

    const rollBtn = document.getElementById('roll-btn');
    const display = document.getElementById('number-display');
    const numberFrame = document.getElementById('number-frame');
    const metaRow = document.getElementById('meta-row');
    const scoreWrapper = document.getElementById('score-wrapper');
    const rankTag = document.getElementById('rank-tag');
    const percentTag = document.getElementById('percent-tag');
    const currentEpCounter = document.getElementById('current-ep-counter');
    const lifetimeEpCounter = document.getElementById('lifetime-ep-counter');
    const adjectivePhraseRow = document.getElementById('adjective-phrase-row');
    const feedWrapper = document.getElementById('feed-wrapper');
    const earnedCounterLabel = document.getElementById('earned-counter-label');
    const stackOutput = document.getElementById('badges-output-stack');

    rollBtn.disabled = true;
    rollBtn.innerText = "⚡ Analyzing Entropy...";
    metaRow.classList.add('opacity-0');
    scoreWrapper.classList.add('opacity-0');
    feedWrapper.classList.add('opacity-0');
    adjectivePhraseRow.innerText = "";
    stackOutput.innerHTML = '';
    
    // Set default capsule style
    document.documentElement.style.setProperty('--dynamic-card-glow', 'none');
    document.documentElement.style.setProperty('--dynamic-card-border', '#3a3d44');

    const rolledNumber = Math.floor(Math.random() * 1000001);
    const rolledStr = rolledNumber.toString().padStart(6, '0');
    const badgesEarned = evaluateRoll(rolledNumber);
    const totalEP = badgesEarned.reduce((sum, b) => sum + b.ep, 0);
    const cardRank = calculateCardRarity(totalEP);

    // 1. Precise 5-Second Digit Locked Reveal Sequence
    let frameTicks = 0;
    const maxFrames = 66; // 66 ticks * 75ms = ~5.0s loop suspense layout footprint
    display.classList.add('shuffling-text');

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
            display.classList.remove('shuffling-text');
            processSystemReveal();
        }
    }, 75);

    // 2. Parse card metrics using exact matching OKLCH color configurations
    function processSystemReveal() {
        display.innerText = rolledStr;

        let tagColorClass = "text-[#9ca3af]";
        let outerShadow = "0 4px 12px rgba(0,0,0,0.5)";
        let borderHex = "#3a3d44";
        
        // Map exact aesthetic values based on target card rarity profiles
        if (cardRank.name === "Uncommon") { tagColorClass = "text-green-400"; borderHex = "oklch(62.7% .194 149.214)"; outerShadow = "0 0 14px oklch(62.7% .194 149.214 / 0.25)"; }
        if (cardRank.name === "Rare") { tagColorClass = "text-blue-400"; borderHex = "oklch(62.3% .214 259.815)"; outerShadow = "0 0 14px oklch(62.3% .214 259.815 / 0.25)"; }
        if (cardRank.name === "Epic") { tagColorClass = "text-purple-400"; borderHex = "oklch(55.8% .288 302.321)"; outerShadow = "0 0 16px oklch(55.8% .288 302.321 / 0.3)"; }
        if (cardRank.name === "Anomaly") { tagColorClass = "text-amber-400"; borderHex = "oklch(82.8% .189 84.429)"; outerShadow = "0 0 20px oklch(82.8% .189 84.429 / 0.35)"; }
        if (cardRank.name === "Mythic") { tagColorClass = "text-pink-500 font-bold"; borderHex = "oklch(65.6% .241 354.308)"; outerShadow = "0 0 25px oklch(65.6% .241 354.308 / 0.55)"; }

        document.documentElement.style.setProperty('--dynamic-card-glow', outerShadow);
        document.documentElement.style.setProperty('--dynamic-card-border', borderHex);

        rankTag.innerText = cardRank.name;
        rankTag.className = tagColorClass;

        const percentileMockValue = Math.max(1, Math.floor(100 - (totalEP / 495)));
        percentTag.innerText = percentileMockValue > 50 ? `BOTTOM ${100 - percentileMockValue}%` : `TOP ${percentileMockValue}%`;

        const sentences = ["phantom are curious", "unseen configurations coordinate", "entropy indexes stable", "temporary math structures lock"];
        adjectivePhraseRow.innerText = sentences[Math.floor(Math.random() * sentences.length)];

        metaRow.classList.remove('opacity-0');
        scoreWrapper.classList.remove('opacity-0');

        // Dynamic points calculation counter increment
        let countingPoints = 0;
        const incrementalStep = Math.ceil(totalEP / 25);
        const countingTimer = setInterval(() => {
            countingPoints += incrementalStep;
            if (countingPoints >= totalEP) {
                countingPoints = totalEP;
                clearInterval(countingTimer);
                
                sessionLifetimeEP += totalEP;
                lifetimeEpCounter.innerText = `${sessionLifetimeEP.toLocaleString()} EP Your Lifetime EP`;
                
                loadSequentialBadgeFeed();
            }
            currentEpCounter.innerText = `${countingPoints.toLocaleString()} EP`;
        }, 35);
    }

    // 3. Spool card nodes out with custom inline styles sequentially 
    function loadSequentialBadgeFeed() {
        earnedCounterLabel.innerText = `${badgesEarned.length} Badges Earned`;
        feedWrapper.classList.remove('opacity-0');

        let cardCursorIndex = 0;

        function printRowItem() {
            if (cardCursorIndex >= badgesEarned.length) {
                rollBtn.disabled = false;
                rollBtn.innerText = "🎰 Generate Roll";
                isRolling = false;
                return;
            }

            const badge = badgesEarned[cardCursorIndex];
            const cardNode = document.createElement('div');
            cardNode.className = "polished-card revealing-card flex flex-col space-y-3.5 p-5 relative overflow-hidden";

            let cardGlowStyle = "0 1px 3px rgba(0,0,0,0.3)";
            let borderVarValue = "#424242";
            let chipStyleClass = "border-[#424242] text-[#9ca3af]";
            let hasHoloOverlay = false;
            
            // Map card borders to match custom Tailwind OKLCH config boundaries
            if (badge.tier === "Uncommon") { borderVarValue = "oklch(62.7% .194 149.214 / 0.4)"; chipStyleClass = "border-green-800 text-green-400 bg-green-950/20"; }
            if (badge.tier === "Rare") { borderVarValue = "oklch(62.3% .214 259.815 / 0.5)"; cardGlowStyle = "0 0 8px oklch(62.3% .214 259.815 / 0.15)"; chipStyleClass = "border-blue-800 text-blue-400 bg-blue-950/20"; }
            if (badge.tier === "Epic") { borderVarValue = "oklch(55.8% .288 302.321 / 0.6)"; cardGlowStyle = "0 0 12px oklch(55.8% .288 302.321 / 0.15)"; chipStyleClass = "border-purple-800 text-purple-400 bg-purple-950/20"; }
            if (badge.tier === "Anomaly") { borderVarValue = "oklch(82.8% .189 84.429 / 0.7)"; cardGlowStyle = "0 0 12px oklch(82.8% .189 84.429 / 0.2)"; chipStyleClass = "border-amber-400 text-amber-400 bg-amber-950/20"; hasHoloOverlay = true; }
            if (badge.tier === "Mythic") { borderVarValue = "oklch(65.6% .241 354.308)"; cardGlowStyle = "0 0 16px oklch(65.6% .241 354.308 / 0.35)"; chipStyleClass = "border-pink-500 text-pink-400 bg-pink-950/20 font-bold"; hasHoloOverlay = true; }

            cardNode.style.borderColor = borderVarValue;
            cardNode.style.boxShadow = cardGlowStyle;

            // Generate Digit row highlights matching patterns explicitly
            let digitsRowMarkup = '<div class="flex items-center pt-1 z-10">';
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

            // Construct layout nodes 
            cardNode.innerHTML = `
                <div class="card-holographic-overlay"></div>
                <div class="flex justify-between items-center w-full z-10">
                    <div class="flex items-center space-x-2.5">
                        <span class="text-sm">${badge.emoji}</span>
                        <span class="font-bold font-mono text-xs tracking-wide text-white uppercase">${badge.name}</span>
                        <span class="text-[9px] px-1.5 py-0.5 border rounded font-mono uppercase ${chipStyleClass}">${badge.tier}</span>
                        <span class="text-[9px] px-1.5 py-0.5 bg-amber-500 text-black font-bold font-mono rounded">NEW</span>
                    </div>
                    <span class="text-xs font-mono text-amber-400 font-bold bg-[#1d1710] px-2.5 py-0.5 border border-amber-900/30 rounded-md">
                        +${badge.ep.toLocaleString()} EP
                    </span>
                </div>
                <div class="text-[10px] font-mono text-[#c4c4c4] uppercase tracking-wide leading-normal z-10">${badge.criteria}.</div>
                ${digitsRowMarkup}
            `;

            if (badge.name.includes("Contiguous Pair")) {
                const embeddedRow = document.createElement('div');
                embeddedRow.className = "nested-child-row flex justify-between items-center text-[10px] font-mono text-gray-500 mt-1 z-10";
                embeddedRow.innerHTML = `
                    <div class="flex items-center space-x-1.5">
                        <span>└ 🧑‍🤝‍🧑</span>
                        <span class="uppercase font-bold text-gray-400">Pair</span>
                    </div>
                    <span>(EARNED)</span>
                `;
                cardNode.appendChild(embeddedRow);
            }

            stackOutput.appendChild(cardNode);
            
            // Set dynamic delay reveal frame loops
            setTimeout(() => {
                cardNode.classList.add('active');
                if (hasHoloOverlay) {
                    const overlay = cardNode.querySelector('.card-holographic-overlay');
                    if (overlay) overlay.style.opacity = "1";
                }
                cardCursorIndex++;
                setTimeout(printRowItem, 350); // One card reveal sequence step gap
            }, 50);
        }

        printRowItem();
    }
});