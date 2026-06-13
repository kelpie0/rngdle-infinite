let isRolling = false;
let sessionLifetimeEP = 0; // Cumulative tracking simulator across turns

document.getElementById('roll-btn').addEventListener('click', () => {
    if (isRolling) return;
    isRolling = true;

    // Element Target Anchors
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

    // UI Configuration Cleanup
    rollBtn.disabled = true;
    rollBtn.innerText = "⚙️ Analyzing Entropy...";
    metaRow.classList.add('opacity-0');
    scoreWrapper.classList.add('opacity-0');
    feedWrapper.classList.add('opacity-0');
    adjectivePhraseRow.innerText = "";
    stackOutput.innerHTML = '';
    numberFrame.style.setProperty('--tier-glow-shadow', 'none');

    // Generate Final Unrestricted Targets
    const rolledNumber = Math.floor(Math.random() * 1000001);
    const rolledStr = rolledNumber.toString().padStart(6, '0');
    const badgesEarned = evaluateRoll(rolledNumber);
    const totalEP = badgesEarned.reduce((sum, b) => sum + b.ep, 0);
    const cardRank = calculateCardRarity(totalEP);

    // 1. Digit Shuffling Sequence (Exactly 4.5 seconds)
    let frameTicks = 0;
    const maxFrames = 60; // 60 iterations * 75ms = 4.5s overall turn delay

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
    }, 75);

    // 2. Map color border values and load incrementing score sequences
    function processSystemReveal() {
        display.innerText = rolledStr;

        // Apply authentic card/capsule neon tier glow structures from the screenshot reference
        let tagColorClass = "text-gray-400";
        let layoutGlowFilter = "0 0 16px rgba(255, 255, 255, 0.04)";
        
        if (cardRank.name === "Uncommon") { tagColorClass = "text-green-400"; layoutGlowFilter = "0 0 20px rgba(74, 222, 128, 0.2)"; }
        if (cardRank.name === "Rare") { tagColorClass = "text-blue-400"; layoutGlowFilter = "0 0 20px rgba(96, 165, 250, 0.2)"; }
        if (cardRank.name === "Epic") { tagColorClass = "text-purple-400"; layoutGlowFilter = "0 0 25px rgba(192, 132, 252, 0.3)"; }
        if (cardRank.name === "Anomaly") { tagColorClass = "text-amber-400"; layoutGlowFilter = "0 0 25px rgba(251, 191, 36, 0.3)"; }
        if (cardRank.name === "Mythic") { tagColorClass = "text-pink-500 font-bold"; layoutGlowFilter = "0 0 35px rgba(244, 63, 94, 0.5)"; }

        numberFrame.style.setProperty('--tier-glow-shadow', layoutGlowFilter);
        rankTag.innerText = cardRank.name;
        rankTag.className = tagColorClass;

        // Dynamic context details calculation rules
        const percentileMockValue = Math.max(1, Math.floor(100 - (totalEP / 490)));
        percentTag.innerText = percentileMockValue > 50 ? `BOTTOM ${100 - percentileMockValue}%` : `TOP ${percentileMockValue}%`;

        // Load phrase lines
        const sentences = ["phantom are curious", "unseen digital arrangements align", "entropy values balanced", "temporary mathematical order verified"];
        adjectivePhraseRow.innerText = sentences[Math.floor(Math.random() * sentences.length)];

        // Unveil layout blocks
        metaRow.classList.remove('opacity-0');
        scoreWrapper.classList.remove('opacity-0');

        // Points increment engine over 1 second 
        let countingPoints = 0;
        const incrementalStep = Math.ceil(totalEP / 25);
        const countingTimer = setInterval(() => {
            countingPoints += incrementalStep;
            if (countingPoints >= totalEP) {
                countingPoints = totalEP;
                clearInterval(countingTimer);
                
                // Track accumulative lifetime metrics pool
                sessionLifetimeEP += totalEP;
                lifetimeEpCounter.innerText = `${sessionLifetimeEP.toLocaleString()} EP Your Lifetime EP`;
                
                // Fire sequential presentation feed cascade
                loadSequentialBadgeFeed();
            }
            currentEpCounter.innerText = `${countingPoints.toLocaleString()} EP`;
        }, 35);
    }

    // 3. Spool card items out with explicit layout delays sequentially
    function loadSequentialBadgeFeed() {
        earnedCounterLabel.innerText = `${badgesEarned.length} Badges Earned`;
        feedWrapper.classList.remove('opacity-0');

        let cardCursorIndex = 0;

        function printRowItem() {
            if (cardCursorIndex >= badgesEarned.length) {
                // Unlock game loop state control elements
                rollBtn.disabled = false;
                rollBtn.innerText = "⚙️ Generate Roll";
                isRolling = false;
                return;
            }

            const badge = badgesEarned[cardCursorIndex];
            const cardNode = document.createElement('div');
            cardNode.className = "canonical-card flex flex-col space-y-3";

            // Define specific borders and background glows per your image layout rule requirements
            let cardGlowStyle = "none";
            let borderVarValue = "#2b2c30";
            let chipStyleClass = "border-gray-800 text-gray-400";
            
            if (badge.tier === "Uncommon") { borderVarValue = "#15803d"; cardGlowStyle = "0 0 10px rgba(21, 128, 61, 0.15)"; chipStyleClass = "border-green-800 text-green-400 bg-green-950/20"; }
            if (badge.tier === "Rare") { borderVarValue = "#1d4ed8"; cardGlowStyle = "0 0 10px rgba(29, 78, 216, 0.15)"; chipStyleClass = "border-blue-800 text-blue-400 bg-blue-950/20"; }
            if (badge.tier === "Epic") { borderVarValue = "#6b21a8"; cardGlowStyle = "0 0 12px rgba(107, 33, 168, 0.15)"; chipStyleClass = "border-purple-800 text-purple-400 bg-purple-950/20"; }
            if (badge.tier === "Anomaly") { borderVarValue = "#b45309"; cardGlowStyle = "0 0 12px rgba(180, 83, 9, 0.2)"; chipStyleClass = "border-amber-800 text-amber-400 bg-amber-950/20"; }
            if (badge.tier === "Mythic") { borderVarValue = "#be123c"; cardGlowStyle = "0 0 16px rgba(190, 18, 60, 0.35)"; chipStyleClass = "border-pink-800 text-pink-500 bg-pink-950/20 font-bold"; }

            cardNode.style.setProperty('--tier-border-color', borderVarValue);
            cardNode.style.setProperty('--tier-glow-shadow', cardGlowStyle);

            // Dynamically flag matching square boxes 
            let digitsRowMarkup = '<div class="flex items-center pt-1">';
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
                    isMatchTarget = true; // Highlighting logic defaults to on for catch-all traits
                }

                digitsRowMarkup += `<div class="card-digit-box ${isMatchTarget ? 'highlighted' : ''}">${digit}</div>`;
            });
            digitsRowMarkup += '</div>';

            // Print item layouts following screenshot patterns exactly
            cardNode.innerHTML = `
                <div class="flex justify-between items-center w-full">
                    <div class="flex items-center space-x-2.5">
                        <span class="text-sm">${badge.emoji}</span>
                        <span class="font-bold font-mono text-xs tracking-wide text-white uppercase">${badge.name}</span>
                        <span class="text-[9px] px-1.5 py-0.5 border rounded font-mono uppercase ${chipStyleClass}">${badge.tier}</span>
                        <span class="text-[9px] px-1.5 py-0.5 bg-amber-500 text-black font-bold font-mono rounded">NEW</span>
                    </div>
                    <span class="text-xs font-mono text-amber-400 font-bold bg-[#1e1912] px-2 py-0.5 border border-amber-900/30 rounded">
                        +${badge.ep.toLocaleString()} EP
                    </span>
                </div>
                <div class="text-[10px] font-mono text-gray-400 uppercase tracking-wide leading-normal">${badge.criteria}.</div>
                ${digitsRowMarkup}
            `;

            // Append child breakdown elements natively if it fits parameters
            if (badge.name.includes("Contiguous Pair")) {
                const embeddedRow = document.createElement('div');
                embeddedRow.className = "nested-child-row flex justify-between items-center text-[10px] font-mono text-gray-500 mt-2";
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
            
            // Trigger animation fade rules
            setTimeout(() => {
                cardNode.classList.add('revealed');
                cardCursorIndex++;
                // Schedule next delayed card reveal row trigger sequence
                setTimeout(printRowItem, 350);
            }, 50);
        }

        printRowItem();
    }
});