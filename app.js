let isRolling = false;

document.getElementById('roll-btn').addEventListener('click', () => {
    if (isRolling) return;
    isRolling = true;

    // Element Target Anchors
    const rollBtn = document.getElementById('roll-btn');
    const display = document.getElementById('rolled-display');
    const numberFrame = document.getElementById('number-frame');
    const metaRow = document.getElementById('meta-row');
    const epBlock = document.getElementById('ep-block');
    const rankBadge = document.getElementById('card-rank-badge');
    const percentileDisplay = document.getElementById('percentile-display');
    const epDisplay = document.getElementById('total-ep-display');
    const adjectivePhrase = document.getElementById('adjective-phrase');
    const breakdownHeader = document.getElementById('breakdown-header');
    const badgeCountEl = document.getElementById('badge-count');
    const container = document.getElementById('badges-container');

    // UI Reset to default state
    rollBtn.disabled = true;
    rollBtn.innerText = "⏳ Rolling...";
    metaRow.classList.add('opacity-0');
    epBlock.classList.add('opacity-0');
    breakdownHeader.classList.add('opacity-0');
    adjectivePhrase.innerText = "";
    container.innerHTML = '';
    numberFrame.style.setProperty('--tier-glow', 'none');

    // Generate Final Unrestricted Targets
    const rolledNumber = Math.floor(Math.random() * 1000001);
    const rolledStr = rolledNumber.toString().padStart(6, '0');
    const badgesEarned = evaluateRoll(rolledNumber);
    const totalEP = badgesEarned.reduce((sum, b) => sum + b.ep, 0);
    const cardRank = calculateCardRarity(totalEP);

    // 1. Cinematic Roll Loop Sequence spanning ~3-4 seconds
    let frameCount = 0;
    const totalRevealFrames = 45; 
    let currentLockedDigits = 0;

    const rollInterval = setInterval(() => {
        let displayStr = "";
        
        // Calculate how many digits should lock into position over time
        currentLockedDigits = Math.floor((frameCount / totalRevealFrames) * 6);

        for (let i = 0; i < 6; i++) {
            if (i < currentLockedDigits) {
                displayStr += rolledStr[i]; // Show real number position
            } else {
                displayStr += Math.floor(Math.random() * 10).toString(); // Shuffle remaining slots
            }
        }

        display.innerText = displayStr;
        frameCount++;

        if (frameCount >= totalRevealFrames) {
            clearInterval(rollInterval);
            finalizeReveal();
        }
    }, 70);

    // 2. Lock-in Final Results and Step-Reveal Badges Sequentially
    function finalizeReveal() {
        display.innerText = rolledStr;

        // Apply Rarity Border Neon Glow Enhancements
        let colorGlow = "0 0 20px rgba(255, 255, 255, 0.05)";
        let textRankColor = "text-gray-400";
        if (cardRank.name === "Uncommon") { colorGlow = "0 0 25px rgba(74, 222, 128, 0.3)"; textRankColor = "text-green-400"; }
        if (cardRank.name === "Rare") { colorGlow = "0 0 25px rgba(96, 165, 250, 0.3)"; textRankColor = "text-blue-400"; }
        if (cardRank.name === "Epic") { colorGlow = "0 0 30px rgba(192, 132, 252, 0.4)"; textRankColor = "text-purple-400"; }
        if (cardRank.name === "Anomaly") { colorGlow = "0 0 35px rgba(251, 191, 36, 0.4)"; textRankColor = "text-amber-400"; }
        if (cardRank.name === "Mythic") { colorGlow = "0 0 45px rgba(244, 63, 94, 0.6)"; textRankColor = "text-pink-500 font-bold"; }

        numberFrame.style.setProperty('--tier-glow', colorGlow);

        // Update Text Nodes
        rankBadge.innerText = cardRank.name;
        rankBadge.className = `font-bold tracking-widest uppercase ${textRankColor}`;
        
        // Calculate dynamic mock percentile ranking values
        const mockPercent = Math.max(1, Math.floor(100 - (totalEP / 500)));
        percentileDisplay.innerText = mockPercent > 50 ? `BOTTOM ${100 - mockPercent}%` : `TOP ${mockPercent}%`;

        // Reveal Metadata Layer Blocks
        metaRow.classList.remove('opacity-0');
        
        // Generate continuous random adjective line sentence structures
        const phrases = ["phantom are curious", "unseen configurations align", "chaos finds temporary geometry", "entropy reports stable balance"];
        adjectivePhrase.innerText = phrases[Math.floor(Math.random() * phrases.length)];

        // Increment total EP over 1 second to build score presentation weight
        epBlock.classList.remove('opacity-0');
        let currentEPScore = 0;
        const epStep = Math.ceil(totalEP / 20);
        const epInterval = setInterval(() => {
            currentEPScore += epStep;
            if (currentEPScore >= totalEP) {
                currentEPScore = totalEP;
                clearInterval(epInterval);
                revealCardsSequentially(); // Trigger card sequence once point totals finish tallying
            }
            epDisplay.innerText = `${currentEPScore.toLocaleString()} EP`;
        }, 40);
    }

    // 3. Sequential Card Renderer revealing exactly one card at a time
    function revealCardsSequentially() {
        badgeCountEl.innerText = `${badgesEarned.length} Badges Earned`;
        breakdownHeader.classList.remove('opacity-0');

        let cardIndex = 0;

        function injectNextCard() {
            if (cardIndex >= badgesEarned.length) {
                // Sequence Finish Operations
                rollBtn.disabled = false;
                rollBtn.innerText = "🎰 Generate Roll";
                isRolling = false;
                return;
            }

            const badge = badgesEarned[cardIndex];
            const cardElement = document.createElement('div');
            cardElement.className = "badge-card w-full p-4 flex flex-col space-y-3";

            // Establish tier colors matching spreadsheet schema rules
            let tierChipColor = "border-gray-700 text-gray-400";
            if (badge.tier === "Uncommon") tierChipColor = "border-green-800 text-green-400 bg-green-950/20";
            if (badge.tier === "Rare") tierChipColor = "border-blue-800 text-blue-400 bg-blue-950/20";
            if (badge.tier === "Epic") tierChipColor = "border-purple-800 text-purple-400 bg-purple-950/20";
            if (badge.tier === "Anomaly") tierChipColor = "border-amber-800 text-amber-400 bg-amber-950/20";
            if (badge.tier === "Mythic") tierChipColor = "border-pink-800 text-pink-500 bg-pink-950/20 font-bold";

            // Generate Digit Highlighting Boxes Row Output Markup
            let digitsMarkup = '<div class="flex mt-1">';
            const digitsArray = rolledStr.split('');
            
            digitsArray.forEach((digit, pos) => {
                let highlightClass = "";
                
                // Match tracking patterns to evaluate specific highlights
                if (badge.name.includes("Hydrogen") && digit === "1") highlightClass = "highlighted";
                else if (badge.name.includes("Carbon") && digit === "6") highlightClass = "highlighted";
                else if (badge.name.includes("Oxygen") && digit === "8") highlightClass = "highlighted";
                else if (badge.name.includes("Ghost") && digit === "0") highlightClass = "highlighted";
                else if (badge.name.includes("Contiguous Pair") && (pos > 0 && digit === digitsArray[pos-1] || pos < 5 && digit === digitsArray[pos+1])) highlightClass = "highlighted";
                else if (badge.name.includes("2 Consecutive Numbers") || badge.name.includes("Neighbors") || badge.name.includes("Odd") || badge.name.includes("Even") || badge.name.includes("Void")) {
                    highlightClass = "highlighted"; // Highlight everything for universal profile attributes
                }

                digitsMarkup += `<div class="digit-box ${highlightClass}">${digit}</div>`;
            });
            digitsMarkup += '</div>';

            // Construct layout structure matching Screenshot 2026-06-13 at 7.57.05 pm.png layout
            cardElement.innerHTML = `
                <div class="flex justify-between items-start w-full">
                    <div class="flex items-center space-x-2">
                        <span class="text-base">${badge.emoji}</span>
                        <h4 class="font-extrabold font-mono text-xs uppercase tracking-wide text-white">${badge.name}</h4>
                        <span class="text-[9px] px-2 py-0.5 border rounded font-mono ${tierChipColor}">${badge.tier}</span>
                        <span class="text-[9px] px-1.5 py-0.5 bg-amber-500 text-black font-bold font-mono rounded">NEW</span>
                    </div>
                    <span class="text-xs font-mono text-amber-500 font-bold bg-amber-950/30 px-2 py-0.5 border border-amber-900/40 rounded">
                        +${badge.ep.toLocaleString()} EP
                    </span>
                </div>
                <p class="text-[10px] font-mono text-gray-400 uppercase tracking-wide leading-relaxed">${badge.criteria}.</p>
                ${digitsMarkup}
            `;

            container.appendChild(cardElement);

            // Force browser flow render layout layout sync delay
            setTimeout(() => {
                cardElement.classList.add('revealed');
                cardIndex++;
                // Schedule the next card reveal transition gap
                setTimeout(injectNextCard, 250);
            }, 50);
        }

        injectNextCard();
    }
});