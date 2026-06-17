function evaluateRoll(s) {
    const n = parseInt(s, 10);
    const digits = s.split('').map(Number);
    let earned = [];

    const countOccurrences = (char) => (s.match(new RegExp(char, 'g')) || []).length;
    
    let maxContig = 1, currentContig = 1;
    let contigBlocks = [];
    for (let i = 1; i < s.length; i++) {
        if (s[i] === s[i-1]) {
            currentContig++;
        } else {
            if (currentContig > 1) contigBlocks.push({char: s[i-1], len: currentContig});
            maxContig = Math.max(maxContig, currentContig);
            currentContig = 1;
        }
    }
    if (currentContig > 1) contigBlocks.push({char: s[s.length-1], len: currentContig});
    maxContig = Math.max(maxContig, currentContig);

    BADGES_DATABASE.forEach(badge => {
        let match = false;
        const name = badge.name;

        if (name.startsWith("Exact ")) {
            if (name === "Exact Nice" && n === 69) match = true;
            else if (name === "Exact Jackpot" && n === 777) match = true;
            else if (name === "Exact Botanist" && n === 420) match = true;
            else if (name === "Exact Devil" && n === 666) match = true;
            else if (name === "Exact Leet" && n === 1337) match = true;
            else if (name === "Exact Hell" && n === 7734) match = true;
            else if (name === "Exact 80085" && n === 80085) match = true;
            else if (name === "Exact Meaning" && n === 42) match = true;
            else if (name === "Exact Emergency" && n === 911) match = true;
            else if (name === "Exact Tree Fiddy" && n === 350) match = true;
            else if (name === "Exact Six-Seven" && n === 67) match = true;
            else if (name === "Exact Eighty-Six" && n === 86) match = true;
            else if (name === "Exact Orientation" && n === 101) match = true;
            else if (name === "Exact Calendar" && n === 365) match = true;
            else if (name === "Exact Boob" && (n === 8008 || n === 58008)) match = true;
        }
        else if (name === "Echo" && s.length % 2 === 0 && s.length >= 4) {
            const half = s.length / 2;
            if (s.substring(0, half) === s.substring(half)) match = true;
        }
        else if (name === "Bookends" && s.length >= 4) {
            if (s.substring(0, 2) === s.substring(s.length - 2)) match = true;
        }
        else if (name === "Sandwich" && s.length >= 3) {
            for(let i = 0; i <= s.length - 3; i++) {
                if (s[i] === s[i+2] && s[i] !== s[i+1]) match = true;
            }
        }
        else if (name === "Century" && s.endsWith("00") && n !== 0) match = true;
        else if (name === "Century End" && s.endsWith("00") && n !== 0) match = true;
        else if (name === "Millennium" && s.endsWith("000") && n !== 0) match = true;
        else if (name === "Perfect Square" && n > 1 && Math.sqrt(n) % 1 === 0) match = true;
        else if (name === "Perfect Cube" && n > 1 && Math.cbrt(n) % 1 === 0) match = true;
        else if (name === "HTTP 404 Error" && s.includes("404") && n !== 404) match = true;
        else if (name === "HTTP 200 OK" && s.includes("200") && n !== 200) match = true;
        else if (name === "Area 51 Base" && s.includes("51") && n !== 51) match = true;
        else if (name === "Very Very Nice" && n === 696969) match = true;
        else if (name === "Hotbox" && n === 420420) match = true;
        else if (name === "Mayday" && n === 911911) match = true;
        else if (name === "Universal Answer" && n === 424242) match = true;
        else if (name === "Orwellian" && n === 1984) match = true;
        else if (name === "Zero" && n === 0) match = true;
        else if (name === "One" && n === 1) match = true;
        else if (name === "Two" && n === 2) match = true;
        else if (name === "Three" && n === 3) match = true;
        else if (name === "Four" && n === 4) match = true;
        else if (name === "Five" && n === 5) match = true;
        else if (name === "Six" && n === 6) match = true;
        else if (name === "Seven" && n === 7) match = true;
        else if (name === "Eight" && n === 8) match = true;
        else if (name === "Nine" && n === 9) match = true;
        else if (name === "Brainrot" && n === 676767) match = true;
        else if (name === "Groundhog Day" && n === 365365) match = true;
        else if (name.endsWith("Power")) {
            const pow = parseInt(name);
            const root = Math.round(Math.pow(n, 1/pow));
            if (Math.round(Math.pow(root, pow)) === n) match = true;
        }
        else if (name === "Pi" && [314, 3141, 31415, 314159].includes(n)) match = true;
        else if (name === "Euler's Number" && [271, 2718, 27182, 271828].includes(n)) match = true;
        else if (name === "Factorial" && FACTORIALS.includes(n)) match = true;
        else if (name === "Fibonacci Number" && FIBONACCI.includes(n)) match = true;
        else if (name === "Contiguous Sixes" && maxContig === 6) match = true;
        else if (name === "Contiguous Fives" && maxContig === 5) match = true;
        else if (name === "Contiguous Quads" && maxContig === 4) match = true;
        else if (name === "Contiguous Trips" && maxContig === 3) match = true;
        else if (name === "Contiguous Pair" && maxContig === 2) match = true;
        else if (name === "Deep Void (5)" && s.includes("00000")) match = true;
        else if (name === "Deep Void (4)" && s.includes("0000")) match = true;
        else if (name === "Deep Void (3)" && s.includes("000")) match = true;
        else if (name === "Deep Void" && s.includes("00")) match = true;
        else if (name === "Void" && !s.includes("0")) match = true;
        else if (name === "Ghost" && countOccurrences("0") === 1) match = true;
        else if (name === "Single Digit" && s.length === 1) match = true;
        else if (name === "Two Digits" && s.length === 2) match = true;
        else if (name === "Three Digits" && s.length === 3) match = true;
        else if (name === "Four Digits" && s.length === 4) match = true;
        else if (name === "Five Digits" && s.length === 5) match = true;
        else if (name === "Six Digits" && s.length === 6) match = true;
        else if (name === "Heterogeneous" && new Set(digits).size === s.length) match = true;
        else if (name.startsWith("Hydrogen") && countOccurrences("1") === 1) match = true;
        else if (name.startsWith("Helium") && countOccurrences("2") === 1) match = true;
        else if (name.startsWith("Lithium") && countOccurrences("3") === 1) match = true;
        else if (name.startsWith("Beryllium") && countOccurrences("4") === 1) match = true;
        else if (name.startsWith("Boron") && countOccurrences("5") === 1) match = true;
        else if (name.startsWith("Carbon") && countOccurrences("6") === 1) match = true;
        else if (name.startsWith("Nitrogen") && countOccurrences("7") === 1) match = true;
        else if (name.startsWith("Oxygen") && countOccurrences("8") === 1) match = true;
        else if (name.startsWith("Fluorine") && countOccurrences("9") === 1) match = true;
        else if (name === "Gap One" && s.length >= 2 && Math.abs(digits[0] - digits[digits.length-1]) === 1) match = true;
        else if (name === "Equilibrium" && s.length >= 2 && digits[0] === digits[digits.length-1]) match = true;
        else if (name === "Liftoff" && s.length >= 2 && digits[0] > digits[digits.length-1]) match = true;
        else if (name === "Grounded" && s.length >= 2 && digits[0] < digits[digits.length-1]) match = true;
        else if (name === "Neighbors") {
            for(let i=0; i<digits.length-1; i++) {
                if(Math.abs(digits[i] - digits[i+1]) === 1) match = true;
            }
        }
        else if (name === "Two Pair") {
            let pairs = contigBlocks.filter(b => b.len >= 2);
            if(pairs.length >= 2) match = true;
        }
        else if (name === "Three Pair" || name === "Contiguous Three Pair") {
            let pairs = contigBlocks.filter(b => b.len >= 2);
            if(pairs.length >= 3) match = true;
        }
        else if (name === "4 Consecutive Numbers") {
            for(let i=0; i<=s.length-4; i++) {
                let sub = digits.slice(i, i+4);
                if (sub[1] === sub[0]+1 && sub[2] === sub[1]+1 && sub[3] === sub[2]+1) match = true;
            }
        }
        else if (name === "3 Consecutive Numbers") {
            for(let i=0; i<=s.length-3; i++) {
                let sub = digits.slice(i, i+3);
                if (sub[1] === sub[0]+1 && sub[2] === sub[1]+1) { match = true; break; }
            }
        }

        if (match) earned.push(badge);
    });

    const uniqueEarned = [];
    const seenNames = new Set();
    
    earned.forEach(b => {
        const normalized = b.name.trim();
        if (!seenNames.has(normalized)) {
            seenNames.add(normalized);
            uniqueEarned.push(b);
        }
    });

    if (uniqueEarned.length === 0) {
        uniqueEarned.push(BADGES_DATABASE.find(b => b.name === (n % 2 === 0 ? "Even" : "Odd")));
    }

    return uniqueEarned;
}

// Uses the correct minimum EP amount to determine Secret tier
function calculateCardRarity(totalEP) {
    if (totalEP >= 20000000) return { name: "Secret" }; 
    if (totalEP >= 1500000) return { name: "Mythic" };
    if (totalEP >= 300000) return { name: "Anomaly" };
    if (totalEP >= 75000) return { name: "Epic" };
    if (totalEP >= 15000)  return { name: "Rare" };
    if (totalEP >= 2500)  return { name: "Uncommon" };
    return { name: "Common" };
}