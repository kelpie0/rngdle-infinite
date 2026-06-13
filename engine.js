function evaluateRoll(num) {
    const str = num.toString();
    const len = str.length;
    const digits = str.split('').map(Number);
    const earned = [];

    function add(id) {
        const badge = BADGES_DATABASE.find(b => b.id === id);
        if (badge) earned.push(badge);
    }

    // Helper functions for math properties
    function isPrime(n) {
        if (n < 2) return false;
        for (let i = 2; i <= Math.sqrt(n); i++) if (n % i === 0) return false;
        return true;
    }
    function isPerfectPower(val, exp) {
        const root = Math.round(Math.pow(val, 1 / exp));
        return Math.pow(root, exp) === val;
    }
    function isPowerOf(val, base) {
        if (val < 1) return false;
        while (val % base === 0) val /= base;
        return val === 1;
    }

    // Direct Exact matches (Badges 1 - 33)
    if (num === 69) add(1);
    if (num === 777) add(2);
    if (str.includes("777777")) add(3);
    if (num === 420) add(4);
    if (num === 666) add(5);
    if (num === 1337) add(6);
    if (num === 7734) add(7);
    if (num === 80085) add(8);
    if (num === 42) add(9);
    if (num === 911) add(10);
    if (num === 696969) add(11);
    if (num === 420420) add(12);
    if (num === 911911) add(13);
    if (num === 424242) add(14);
    if (num === 1984) add(15);
    if (num === 0) add(16);
    if (num === 1) add(17);
    if (num === 2) add(18);
    if (num === 3) add(19);
    if (num === 4) add(20);
    if (num === 5) add(21);
    if (num === 6) add(22);
    if (num === 7) add(23);
    if (num === 8) add(24);
    if (num === 9) add(25);
    if (num === 350) add(26);
    if (num === 67) add(27);
    if (num === 86) add(28);
    if (num === 101) add(29);
    if (num === 365) add(30);
    if (num === 676767) add(31);
    if (num === 365365) add(32);
    if (num === 8008 || num === 58008) add(33);

    // Math powers & sequences
    if (isPerfectPower(num, 13)) add(34);
    if (isPerfectPower(num, 17)) add(35);
    if (isPerfectPower(num, 19)) add(36);
    if (isPerfectPower(num, 10)) add(37);
    if (isPerfectPower(num, 11)) add(38);
    if ([314, 3141, 31415, 314159].includes(num)) add(39);
    if ([271, 2718, 27182, 271828].includes(num)) add(40);

    // Split check for 4 consecutive numbers (41)
    if (len === 4) {
        if (digits[1] === digits[0]+1 && digits[2] === digits[1]+1 && digits[3] === digits[2]+1) add(41);
    }

    if (isPerfectPower(num, 9)) add(42);
    if (isPerfectPower(num, 8)) add(43);
    if (isPerfectPower(num, 7)) add(44);
    
    // Factorial values under 1M
    if ([1, 2, 6, 24, 120, 720, 5040, 40320, 362880].includes(num)) add(45);
    if (str.includes("07734")) add(46);

    // Sequential runs
    let maxSeq = 1, currentSeq = 1;
    for (let i = 1; i < len; i++) {
        if (digits[i] === digits[i-1] + 1 || digits[i] === digits[i-1] - 1) {
            currentSeq++;
            maxSeq = Math.max(maxSeq, currentSeq);
        } else {
            currentSeq = 1;
        }
    }
    if (maxSeq >= 6) add(47);

    // Repeating blocks
    if (/(.)\1{5}/.test(str)) add(48);
    if (str.includes("00000")) add(49);
    if (len === 1) add(50);
    if (str.endsWith("99999")) add(51);
    if (isPerfectPower(num, 6)) add(52);
    if (isPowerOf(num, 3)) add(53);
    if (isPerfectPower(num, 5)) add(54);
    if (str.includes("77777")) add(55);
    if (isPowerOf(num, 2)) add(56);
    if (str.includes("56789")) add(57);
    if (str.includes("58008")) add(58);
    if (str.includes("80085")) add(59);
    if (str.includes("31415")) add(60);
    if (str.includes("27182")) add(61);

    // Ascending/Descending steps
    let ascCount = 0, descCount = 0;
    for (let i = 1; i < len; i++) {
        if (digits[i] === digits[i-1] + 1) ascCount++;
        if (digits[i] === digits[i-1] - 1) descCount++;
    }
    if (ascCount === len - 1 && len > 1) add(62);
    if ([1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711, 28657, 46368, 75025, 121393, 196418, 317811, 514229, 832040].includes(num)) add(63);
    if (isPerfectPower(num, 4)) add(64);
    if (descCount === len - 1 && len > 1) add(65);
    if (/(0123|1234|2345|3456|4567|5678|6789)/.test(str)) add(66);

    // Scrambled quad block check
    if (len === 4) {
        const sortedD = [...digits].sort((a,b)=>a-b);
        if (sortedD[1] === sortedD[0]+1 && sortedD[2] === sortedD[1]+1 && sortedD[3] === sortedD[2]+1) {
            if (!(digits[1] === digits[0]+1 && digits[2] === digits[1]+1)) add(67);
        }
    }

    if (new Set(digits).size === 1 && len > 1) add(68);
    if (/^[01]+$/.test(str)) add(69);

    // Straight Flush
    if (str.includes("02468") || str.includes("86420") || str.includes("13579") || str.includes("97531")) add(70);
    if (len === 2) add(71);

    // Spy evaluation
    const dSum = digits.reduce((a,b)=>a+b, 0);
    const dProd = digits.reduce((a,b)=>a*b, 1);
    if (dSum === dProd && len > 1) add(72);
    if (str.endsWith("9999")) add(73);
    if (str.endsWith("5000")) add(74);
    if (isPerfectPower(num, 3)) add(75);

    // Line check spacing
    let isEvenSpacing = len > 2;
    if (isEvenSpacing) {
        let diff = digits[1] - digits[0];
        for(let i=1; i<len-1; i++) {
            if (digits[i+1] - digits[i] !== diff) isEvenSpacing = false;
        }
    }
    if (isEvenSpacing) add(76);

    // Splitting consecutive ranges
    if (len === 6) {
        let p1 = parseInt(str.slice(0,2)), p2 = parseInt(str.slice(2,4)), p3 = parseInt(str.slice(4,6));
        if (p2 === p1+1 && p3 === p2+1) add(77);
    }
    if (/(.)\1{4}/.test(str)) add(78);
    if (str.includes("0000")) add(79);

    // Strobogrammatic rotation checks
    const stroboMap = {'0':'0', '1':'1', '6':'9', '8':'8', '9':'6'};
    let isStrobo = true;
    for (let i = 0; i < len; i++) {
        let c = str[i];
        if (!stroboMap[c] || str[len - 1 - i] !== stroboMap[c]) isStrobo = false;
    }
    if (isStrobo) add(80);

    if (maxSeq >= 5) add(81);
    if (str.includes("7777")) add(82);
    if (str.includes("6969")) add(83);
    if (str.includes("4242")) add(84);
    if (str.includes("6767")) add(85);
    if (str.includes("1337")) add(86);
    if (str.includes("7734")) add(87);
    if (str.includes("8008")) add(88);
    if (str.includes("1984")) add(89);
    if (str.includes("3141")) add(90);
    if (str.includes("2718")) add(91);

    // Zipper
    if (len >= 4) {
        let alt = true;
        for (let i = 2; i < len; i++) if (digits[i] !== digits[i-2]) alt = false;
        if (alt && digits[0] !== digits[1]) add(93);
    }

    // Strict steps
    let strictAsc = true, strictDesc = true;
    for(let i=1; i<len; i++) {
        if (digits[i] <= digits[i-1]) strictAsc = false;
        if (digits[i] >= digits[i-1]) strictDesc = false;
    }
    if (strictAsc && len > 1) add(94);
    if (maxSeq >= 3) add(95);

    if (strictDesc && len > 1) add(99);
    if (len === 3) add(100);

    // Half mirror echo
    if (len % 2 === 0 && len > 1) {
        if (str.slice(0, len/2) === str.slice(len/2)) add(101);
    }
    if (str.endsWith("000")) add(102);
    
    // Pronic values
    for (let i=0; i<1000; i++) { if (i*(i+1) === num) add(103); }

    if (str.endsWith("999")) add(104);
    if (str.endsWith("500")) add(105);
    if (num > 999000) add(106);
    if (isPerfectPower(num, 2)) add(107);
    if (str.endsWith("00")) add(138);
    if (str.endsWith("99")) add(139);
    if (str.endsWith("50")) add(140);

    // Standard string checks for low tier badges
    if (/(.)\1{3}/.test(str)) add(112);
    if (str.includes("000")) add(113);
    if (str.includes("007")) add(115);
    if (dSum > 45) add(116);
    if (str.includes("777")) add(118);
    if (str.includes("666")) add(119);
    if (maxSeq >= 4) add(120);
    if (str.includes("404")) add(121);
    if (str.includes("101")) add(122);
    if (str.includes("420")) add(123);
    if (str.includes("911")) add(124);
    if (str.includes("314")) add(125);
    if (str.includes("271")) add(126);
    if (str.includes("350")) add(127);
    if (str.includes("365")) add(128);

    // Digit divisible profiles
    if (digits.every(d => d % 3 === 0)) add(129);
    if (new Set(digits).size === 2 && len > 1) add(131);
    if (len === 4) add(134);
    if (str.slice(0,2) === str.slice(-2) && len >= 4) add(136);

    // Counts maps
    const counts = {};
    digits.forEach(d => counts[d] = (counts[d] || 0) + 1);
    const maxFreq = Math.max(...Object.values(counts));

    if (maxFreq >= 4) add(141);
    if (digits.every(d => d <= 4)) add(142);
    if (digits.every(d => d >= 5)) add(143);
    if (maxFreq >= 3) add(151);
    if (str.includes("00")) add(152);
    if (dSum < 15) add(153);
    if (dSum === 21) add(154);
    if (str.includes("69")) add(157);
    if (str.includes("42")) add(158);
    if (str.includes("67")) add(159);
    if (str.includes("86")) add(160);
    if (maxSeq >= 3) add(163);
    if (isPrime(num)) add(166);
    if (new Set(digits).size === 3) add(167);
    if (num % 12 === 0) add(168);
    if (len === 5) add(169);
    if (num % 11 === 0) add(170);
    if (num % dSum === 0) add(171);
    if (str.endsWith("0")) add(172);
    if (str.endsWith("5")) add(173);
    if (str[0] === str[len-1]) add(174);
    if (maxFreq >= 3) add(177);
    if (num % 7 === 0) add(178);
    if (new Set(digits).size === len) add(179);
    if (Math.abs(digits[0] - digits[len-1]) === 1) add(180);
    
    // Ghost checking
    if (digits.filter(d=>d===0).length === 1) add(183);
    if (new Set(digits).size === 4) add(184);

    // Atom tracking elements
    if (digits.filter(d=>d===1).length === 1) add(185);
    if (digits.filter(d=>d===2).length === 1) add(186);
    if (digits.filter(d=>d===6).length === 1) add(187);
    if (digits.filter(d=>d===8).length === 1) add(188);
    if (digits.filter(d=>d===3).length === 1) add(189);
    if (digits.filter(d=>d===4).length === 1) add(190);
    if (digits.filter(d=>d===5).length === 1) add(191);
    if (digits.filter(d=>d===7).length === 1) add(192);
    if (digits.filter(d=>d===9).length === 1) add(193);

    if (digits[0] < digits[len-1]) add(194);
    if (/(.)\1/.test(str)) add(195);
    if (str.includes("7")) add(196);
    if (num % 2 === 0) add(197);
    if (num % 2 !== 0) add(198);
    if (digits[0] > digits[len-1]) add(199);
    if (!str.includes("0")) add(200);
    if (/(.)\1/.test(str)) add(202);
    if (len === 6) add(203);

    // Fallback safe evaluation if no interesting tags hit
    if (earned.length === 0) {
         earned.push({ name: "Void", emoji: "🕳️", criteria: "Contains no zeros", tier: "Common", ep: 1 });
    }

    return earned;
}

function calculateCardRarity(totalEP) {
    if (totalEP === 0) return { name: "Trash", color: "text-gray-500", bg: "bg-gray-900/20" };
    if (totalEP < 5) return { name: "Common", color: "text-gray-300", bg: "bg-gray-800/40" };
    if (totalEP < 25) return { name: "Uncommon", color: "text-green-400", bg: "bg-green-900/20" };
    if (totalEP < 150) return { name: "Rare", color: "text-blue-400", bg: "bg-blue-900/20" };
    if (totalEP < 1000) return { name: "Epic", color: "text-purple-400", bg: "bg-purple-900/20" };
    if (totalEP < 10000) return { name: "Anomaly", color: "text-amber-400", bg: "bg-amber-900/20" };
    return { name: "Mythic", color: "text-pink-500 font-extrabold animate-pulse", bg: "bg-gradient-to-r from-purple-900/40 to-pink-900/40" };
}