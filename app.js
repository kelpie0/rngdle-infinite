let isRolling = false;

document.getElementById('roll-btn').addEventListener('click', () => {
    if (isRolling) return; // Prevent spamming during the suspense reveal
    isRolling = true;

    const rollBtn = document.getElementById('roll-btn');
    const targetDisplay = document.getElementById('rolled-display');
    const rankBadge = document.getElementById('card-rank-badge');
    const epDisplay = document.getElementById('total-ep-display');
    const container = document.getElementById('badges-container');
    const displayCard = document.getElementById('display-card');
    const badgeCountEl = document.getElementById('badge-count');

    rollBtn.disabled = true;
    rollBtn.innerText = "⚡ Analyzing Entropy...";
    targetDisplay.classList.add('shuffling');

    // Suspense Shuffling Animation (Changes the text numbers randomly like a slot machine)
    let shuffleTicks = 0;
    const shuffleInterval = setInterval(() => {
        const fakeNum = Math.floor(Math.random() * 1000001);
        targetDisplay.innerText = fakeNum.toLocaleString();
        shuffleTicks++;

        if (shuffleTicks >= 12) { // 12 ticks * 70ms = ~840ms of roll suspense animation
            clearInterval(shuffleInterval);
            
            // Execute actual server-less random calculation
            const rolledNumber = Math.floor(Math.random() * 1000001);
            const badgesEarned = evaluateRoll(rolledNumber);
            const totalEP = badgesEarned.reduce((sum, b) => sum + b.ep, 0);
            const cardRank = calculateCardRarity(totalEP);

            // Turn off blurring
            targetDisplay.classList.remove('shuffling');
            targetDisplay.innerText = rolledNumber.toLocaleString();

            // Setup Neon Color Shadows based on Rarity Profile
            let colorHex = "rgba(168, 85, 247, 0.4)"; // Purple default
            let borderClass = "border-purple-500/20";
            
            if (cardRank.name === "Uncommon") { colorHex = "rgba(74, 222, 128, 0.4)"; borderClass = "border-green-500/20"; }
            if (cardRank.name === "Rare") { colorHex = "rgba(96, 165, 250, 0.4)"; borderClass = "border-blue-500/20"; }
            if (cardRank.name === "Epic") { colorHex = "rgba(192, 132, 252, 0.4)"; borderClass = "border-purple-400/30"; }
            if (cardRank.name === "Anomaly") { colorHex = "rgba(251, 191, 36, 0.5)"; borderClass = "border-amber-400/40"; }
            if (cardRank.name === "Mythic") { colorHex = "rgba(244, 63, 94, 0.7)"; borderClass = "border-pink-500/50"; }
            
            document.documentElement.style.setProperty('--tier-glow', colorHex);
            displayCard.className = `w-full glass-panel glow-card rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 ${borderClass}`;

            // Update Text Nodes
            rankBadge.innerText = `${cardRank.name} Roll`;
            rankBadge.className = `px-4 py-1 rounded-full text-[10px] font-mono tracking-[0.2em] font-bold border ${cardRank.color} ${cardRank.bg}`;
            epDisplay.innerText = `${totalEP.toLocaleString()} EP`;
            badgeCountEl.innerText = `${badgesEarned.length} Hit`;

            // Flush out container and paint new entries with animated delays
            container.innerHTML = '';
            badgesEarned.forEach((badge, idx) => {
                const row = document.createElement('div');
                row.className = "flex items-center justify-between p-3 bg-[#161922]/80 border border-white/5 rounded-xl animate-pop opacity-0";
                row.style.animationDelay = `${idx * 40}ms`; // Cascading pop-in list trigger
                
                let tierColor = "text-gray-400";
                if (badge.tier === "Uncommon") tierColor = "text-green-400";
                if (badge.tier === "Rare") tierColor = "text-blue-400";
                if (badge.tier === "Epic") tierColor = "text-purple-400";
                if (badge.tier === "Anomaly") tierColor = "text-amber-400";
                if (badge.tier === "Mythic") tierColor = "text-pink-500 font-bold drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]";

                row.innerHTML = `
                    <div class="flex items-center gap-3 min-w-0">
                        <span class="text-xl flex-shrink-0">${badge.emoji}</span>
                        <div class="min-w-0">
                            <h4 class="font-bold font-mono text-xs text-white truncate">${badge.name}</h4>
                            <p class="text-[10px] text-gray-400 font-sans mt-0.5 truncate max-w-[240px] md:max-w-xs">${badge.criteria}</p>
                        </div>
                    </div>
                    <div class="text-right flex-shrink-0 ml-2">
                        <span class="text-[9px] uppercase font-mono block tracking-wider ${tierColor}">${badge.tier}</span>
                        <span class="text-[10px] font-mono text-gray-500">+${badge.ep.toLocaleString()} EP</span>
                    </div>
                `;
                container.appendChild(row);
            });

            // Re-enable interactive trigger
            rollBtn.disabled = false;
            rollBtn.innerText = "🎰 Generate Roll";
            isRolling = false;
        }
    }, 70);
});