// Constants
const FACTORIALS = [1, 2, 6, 24, 120, 720, 5040, 40320, 362880];
const FIBONACCI = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711, 28657, 46368, 75025, 121393, 196418, 317811, 514229, 832040];

// Utilities
function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}
function isPronic(num) {
    let r = Math.floor(Math.sqrt(num));
    return r * (r + 1) === num;
}
function isStrobogrammatic(s) {
    const map = {'0':'0', '1':'1', '6':'9', '8':'8', '9':'6'};
    let left = 0, right = s.length - 1;
    while (left <= right) {
        if (!map[s[left]] || map[s[left]] !== s[right]) return false;
        left++; right--;
    }
    return true;
}

// 5% Chance for Short/Truncated Outputs
function generateRollString() {
    let rolledNumber = Math.floor(Math.random() * 1000000);
    if (Math.random() < 0.05) return rolledNumber.toString();
    return rolledNumber.toString().padStart(6, '0');
}

// Main Evaluator
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

        // Exact Matches
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
            else if (name === "Exact Tree Fiddy" && n === 350) match = true;
            else if (name === "Exact Six-Seven" && n === 67) match = true;
            else if (name === "Exact Eighty-Six" && n === 86) match = true;
            else if (name === "Exact Orientation" && n === 101) match = true;
            else if (name === "Exact Calendar" && n === 365) match = true;
            else if (name === "Brainrot" && n === 676767) match = true;
            else if (name === "Groundhog Day" && n === 365365) match = true;
            else if (name === "Exact Boob" && (n === 8008 || n === 58008)) match = true;
        }
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

        else if (name === "Hello" && s.includes("07734")) match = true;
        else if (name === "Hell" && s.includes("7734")) match = true;
        else if (name === "58008" && s.includes("58008")) match = true;
        else if (name === "80085" && s.includes("80085")) match = true;
        else if (name === "8008" && s.includes("8008")) match = true;
        else if (name === "Jackpot Six" && s.includes("777777")) match = true;
        else if (name === "Jackpot Five" && s.includes("77777")) match = true;
        else if (name === "Jackpot Four" && s.includes("7777")) match = true;
        else if (name === "Jackpot" && s.includes("777")) match = true;
        else if (name === "Lucky Seven" && s.includes("7")) match = true;
        else if (name === "Devil" && s.includes("666")) match = true;
        else if (name === "Very Nice" && s.includes("6969")) match = true;
        else if (name === "Nice" && s.includes("69")) match = true;
        else if (name === "Leet" && s.includes("1337")) match = true;
        else if (name === "Not Funny" && s.includes("67")) match = true;
        else if (name === "The Devil's Area Code" && s.includes("666")) match = true;
        else if (name === "Binary Mirage" && [...s].every(c => ['0','1','8'].includes(c))) match = true;
        else if (name === "High Five" && new Set(digits).size <= 2 && digits.filter(v => v===digits[0]).length === 5) match = true; 

        else if (name === "Even" && n % 2 === 0) match = true;
        else if (name === "Odd" && n % 2 !== 0) match = true;
        else if (name === "Dozen" && n % 12 === 0) match = true;
        else if (name === "Eleven" && n % 11 === 0) match = true;
        else if (name === "Divisible by Three" && digits.every(d => d % 3 === 0)) match = true;
        else if (name === "Lucky Seven (Divisible)" && n % 7 === 0) match = true;
        else if (name === "Prime Number" && isPrime(n)) match = true;
        else if (name === "Pronic Number" && isPronic(n)) match = true;
        else if (name === "Strobogrammatic" && isStrobogrammatic(s)) match = true;
        else if (name === "Palindrome" && s === s.split('').reverse().join('')) match = true;

        else if (name === "4 Consecutive Numbers" && s.length >= 6) {
            const p1 = parseInt(s.substring(0,2)), p2 = parseInt(s.substring(2,4)), p3 = parseInt(s.substring(4,6));
            if (p2 === p1 + 1 && p3 === p2 + 1) match = true;
        }
        else if (name === "3 Consecutive Numbers" && s.length >= 6) {
            const p1 = parseInt(s.substring(0,2)), p2 = parseInt(s.substring(2,4)), p3 = parseInt(s.substring(4,6));
            if (p2 === p1 + 1 && p3 === p2 + 1) match = true;
        }
        else if (name === "3 Consecutive Numbers (Contains)") {
            for(let i=0; i<s.length-2; i++){
                const a=parseInt(s[i]), b=parseInt(s[i+1]), c=parseInt(s[i+2]);
                if((b===a+1 && c===b+1) || (b===a-1 && c===b-1)) match = true;
            }
        }
        else if (name === "Sequence (6)" && s.length >= 6) {
            let asc = true, dsc = true;
            for(let i=1; i<6; i++) {
                if(digits[i] !== digits[i-1]+1) asc = false;
                if(digits[i] !== digits[i-1]-1) dsc = false;
            }
            if(asc || dsc) match = true;
        }
        else if (name === "Sequence (5)" || name === "Straight") {
            for(let i=0; i<=s.length-5; i++) {
                let sub = digits.slice(i, i+5);
                let asc = sub.every((d, idx) => idx === 0 || d === sub[idx-1] + 1);
                let dsc = sub.every((d, idx) => idx === 0 || d === sub[idx-1] - 1);
                if(asc || dsc) match = true;
            }
        }
        else if (name === "Sequence (4)") {
            for(let i=0; i<=s.length-4; i++) {
                let sub = digits.slice(i, i+4);
                let asc = sub.every((d, idx) => idx === 0 || d === sub[idx-1] + 1);
                let dsc = sub.every((d, idx) => idx === 0 || d === sub[idx-1] - 1);
                if(asc || dsc) match = true;
            }
        }
        else if (name === "Sequence (3)") {
            for(let i=0; i<=s.length-3; i++) {
                let sub = digits.slice(i, i+3);
                let asc = sub.every((d, idx) => idx === 0 || d === sub[idx-1] + 1);
                let dsc = sub.every((d, idx) => idx === 0 || d === sub[idx-1] - 1);
                if(asc || dsc) match = true;
            }
        }
        
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

        if (match) earned.push(badge);
    });

    if (earned.length === 0) {
        earned.push(BADGES_DATABASE.find(b => b.name === (n % 2 === 0 ? "Even" : "Odd")));
    }

    return earned;
}

function calculateCardRarity(totalEP) {
    if (totalEP >= 80000) return { name: "Mythic" };
    if (totalEP >= 35000) return { name: "Anomaly" };
    if (totalEP >= 15000) return { name: "Epic" };
    if (totalEP >= 5000)  return { name: "Rare" };
    if (totalEP >= 1000)  return { name: "Uncommon" };
    return { name: "Common" };
}