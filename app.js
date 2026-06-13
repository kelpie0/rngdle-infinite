document.getElementById('roll-btn').addEventListener('click', () => {
    // Generate unrestricted infinite random roll between 0 and 1,000,000
    const rolledNumber = Math.floor(Math.random() * 1000001);
    
    // Process matching properties
    const badgesEarned = evaluateRoll(rolledNumber);
    
    // Sum points
    const totalEP = badgesEarned.reduce((sum, b) => sum + b.ep, 0);
    const cardRank = calculateCardRarity(totalEP);

    // Update Display elements
    const targetDisplay = document.getElementById('rolled-display');
    targetDisplay.innerText = rolledNumber.toLocaleString();
    targetDisplay.classList.remove('scale-95');
    targetDisplay.classList.add('scale-105');
    setTimeout(() => targetDisplay.classList.remove('scale-105'), 150);

    // Set Card Rank Tags
    const rankBadge = document.getElementById('card-rank-badge');
    rankBadge.innerText = `${cardRank.name.toUpperCase()} ROLL`;
    rankBadge.className = `px-3 py-1 rounded-full text-xs font-mono tracking-widest border border-gray-800 ${cardRank.color} ${cardRank.bg}`;

    document.getElementById('total-ep-display').innerText = `${totalEP.toLocaleString()} EP`;

    // Render Badges Table List
    const container = document.getElementById('badges-container');
    container.innerHTML = '';

    badgesEarned.forEach(badge => {
        const row = document.createElement('div');
        row.className = "flex items-center justify-between p-3 bg-[#1a1d24] border border-gray-800 rounded-xl transform transition-all hover:translate-x-1";
        
        let tierColor = "text-gray-400";
        if (badge.tier === "Uncommon") tierColor = "text-green-400";
        if (badge.tier === "Rare") tierColor = "text-blue-400";
        if (badge.tier === "Epic") tierColor = "text-purple-400";
        if (badge.tier === "Anomaly") tierColor = "text-amber-400";
        if (badge.tier === "Mythic") tierColor = "text-pink-500";

        row.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="text-2xl">${badge.emoji}</span>
                <div>
                    <h4 class="font-bold font-mono text-sm text-white">${badge.name}</h4>
                    <p class="text-xs text-gray-400 font-sans mt-0.5">${badge.criteria}</p>
                </div>
            </div>
            <div class="text-right">
                <span class="text-xs uppercase font-mono block ${tierColor}">${badge.tier}</span>
                <span class="text-xs font-mono text-gray-500">+${badge.ep.toLocaleString()} EP</span>
            </div>
        `;
        container.appendChild(row);
    });
});