// Constants
const FACTORIALS = [1, 2, 6, 24, 120, 720, 5040, 40320, 362880];
const FIBONACCI = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711, 28657, 46368, 75025, 121393, 196418, 317811, 514229, 832040];

// The Master Database (Cleaned up duplicates and injected custom requests)
const BADGES_DATABASE = [
    { id: 1, name: "Exact Nice", emoji: "😏", criteria: "Exactly 69", tier: "Mythic", ep: 75000 },
    { id: 2, name: "Exact Jackpot", emoji: "💰", criteria: "Exactly 777", tier: "Mythic", ep: 75000 },
    { id: 3, name: "Jackpot Six", emoji: "🏦", criteria: "Contains six 7s in a row", tier: "Mythic", ep: 75000 },
    { id: 4, name: "Exact Botanist", emoji: "🌿", criteria: "Exactly 420", tier: "Mythic", ep: 75000 },
    { id: 5, name: "Exact Devil", emoji: "😈", criteria: "Exactly 666", tier: "Mythic", ep: 75000 },
    { id: 6, name: "Exact Leet", emoji: "💻", criteria: "Exactly 1337", tier: "Mythic", ep: 75000 },
    { id: 7, name: "Exact Hell", emoji: "👹", criteria: "Exactly 7734", tier: "Mythic", ep: 75000 },
    { id: 8, name: "Exact 80085", emoji: "💎", criteria: "Exactly 80085", tier: "Mythic", ep: 75000 },
    { id: 9, name: "Exact Meaning", emoji: "🌌", criteria: "Exactly 42", tier: "Mythic", ep: 75000 },
    { id: 10, name: "Exact Emergency", emoji: "🚑", criteria: "Exactly 911", tier: "Mythic", ep: 75000 },
    { id: 11, name: "Very Very Nice", emoji: "😏", criteria: "Exactly 696969", tier: "Mythic", ep: 80000 },
    { id: 12, name: "Hotbox", emoji: "🌿", criteria: "Exactly 420420", tier: "Mythic", ep: 80000 },
    { id: 13, name: "Mayday", emoji: "🚑", criteria: "Exactly 911911", tier: "Mythic", ep: 80000 },
    { id: 14, name: "Universal Answer", emoji: "🌌", criteria: "Exactly 424242", tier: "Mythic", ep: 80000 },
    { id: 15, name: "Orwellian", emoji: "👁️", criteria: "Exactly 1984", tier: "Mythic", ep: 65000 },
    { id: 16, name: "Zero", emoji: "0️⃣", criteria: "The number zero", tier: "Mythic", ep: 85000 },
    { id: 17, name: "One", emoji: "1️⃣", criteria: "The number one", tier: "Mythic", ep: 60000 },
    { id: 18, name: "Two", emoji: "2️⃣", criteria: "The number two", tier: "Mythic", ep: 60000 },
    { id: 19, name: "Three", emoji: "3️⃣", criteria: "The number three", tier: "Mythic", ep: 60000 },
    { id: 20, name: "Four", emoji: "4️⃣", criteria: "The number four", tier: "Mythic", ep: 60000 },
    { id: 21, name: "Five", emoji: "5️⃣", criteria: "The number five", tier: "Mythic", ep: 60000 },
    { id: 22, name: "Six", emoji: "6️⃣", criteria: "The number six", tier: "Mythic", ep: 60000 },
    { id: 23, name: "Seven", emoji: "7️⃣", criteria: "The number seven", tier: "Mythic", ep: 60000 },
    { id: 24, name: "Eight", emoji: "8️⃣", criteria: "The number eight", tier: "Mythic", ep: 60000 },
    { id: 25, name: "Nine", emoji: "9️⃣", criteria: "The number nine", tier: "Mythic", ep: 60000 },
    { id: 26, name: "Exact Tree Fiddy", emoji: "🦕", criteria: "Exactly 350", tier: "Mythic", ep: 65000 },
    { id: 27, name: "Exact Six-Seven", emoji: "🫠", criteria: "Exactly 67", tier: "Mythic", ep: 65000 },
    { id: 28, name: "Exact Eighty-Six", emoji: "🍽️", criteria: "Exactly 86", tier: "Mythic", ep: 65000 },
    { id: 29, name: "Exact Orientation", emoji: "🧭", criteria: "Exactly 101", tier: "Mythic", ep: 65000 },
    { id: 30, name: "Exact Calendar", emoji: "📅", criteria: "Exactly 365", tier: "Mythic", ep: 65000 },
    { id: 31, name: "Brainrot", emoji: "🫠", criteria: "Exactly 676767", tier: "Mythic", ep: 70000 },
    { id: 32, name: "Groundhog Day", emoji: "📅", criteria: "Exactly 365365", tier: "Mythic", ep: 70000 },
    { id: 33, name: "Exact Boob", emoji: "🍈", criteria: "Exactly 8008 or 58008", tier: "Mythic", ep: 50000 },
    { id: 34, name: "13th Power", emoji: "💀", criteria: "A perfect 13th power (n¹³)", tier: "Mythic", ep: 55000 },
    { id: 35, name: "17th Power", emoji: "🧙", criteria: "A perfect 17th power (n¹⁷)", tier: "Mythic", ep: 55000 },
    { id: 36, name: "19th Power", emoji: "🌑", criteria: "A perfect 19th power (n¹⁹)", tier: "Mythic", ep: 55000 },
    { id: 37, name: "10th Power", emoji: "🔟", criteria: "A perfect 10th power (n¹⁰)", tier: "Mythic", ep: 45000 },
    { id: 38, name: "11th Power", emoji: "🕚", criteria: "A perfect 11th power (n¹¹)", tier: "Mythic", ep: 45000 },
    { id: 39, name: "Pi", emoji: "🥧", criteria: "Exactly π (314, 3141, 31415, or 314159)", tier: "Mythic", ep: 40000 },
    { id: 40, name: "Euler's Number", emoji: "📈", criteria: "Exactly e (271, 2718, 27182, or 271828)", tier: "Mythic", ep: 40000 },
    { id: 41, name: "4 Consecutive Numbers", emoji: "⛓️", criteria: "Contains four adjacent consecutive integers in order", tier: "Anomaly", ep: 6500 },
    { id: 42, name: "9th Power", emoji: "☁️", criteria: "A perfect 9th power (n⁹)", tier: "Mythic", ep: 35000 },
    { id: 43, name: "8th Power", emoji: "🎱", criteria: "A perfect 8th power (n⁸)", tier: "Mythic", ep: 35000 },
    { id: 44, name: "7th Power", emoji: "🌟", criteria: "A perfect 7th power (n⁷)", tier: "Mythic", ep: 30000 },
    { id: 45, name: "6th Power", emoji: "🎲", criteria: "A perfect 6th power (n⁶)", tier: "Mythic", ep: 30000 },
    { id: 46, name: "Perfect Fifth", emoji: "🎵", criteria: "A perfect 5th power (n⁵)", tier: "Mythic", ep: 25000 },
    { id: 47, name: "Perfect Fourth", emoji: "📐", criteria: "A perfect 4th power (n⁴)", tier: "Mythic", ep: 20000 },
    { id: 48, name: "Perfect Cube", emoji: "📦", criteria: "The entire number evaluates to a perfect cube root", tier: "Mythic", ep: 15000 },
    { id: 49, name: "Factorial", emoji: "❗", criteria: "The entire number is equal to a perfect factorial value", tier: "Mythic", ep: 15000 },
    { id: 50, name: "Fibonacci Number", emoji: "🌀", criteria: "The entire number evaluates to a perfect Fibonacci value", tier: "Mythic", ep: 15000 },
    { id: 51, name: "The Beast", emoji: "👹", criteria: "Contains 6666", tier: "Anomaly", ep: 8500 },
    { id: 52, name: "Jackpot Four", emoji: "🎰", criteria: "Contains four 7s in a row", tier: "Anomaly", ep: 7777 },
    { id: 53, name: "Jackpot Five", emoji: "🏦", criteria: "Contains five 7s in a row", tier: "Anomaly", ep: 25000 },
    { id: 54, name: "Binary Overlord", emoji: "🦾", criteria: "Only 0s and 1s and length >= 5", tier: "Anomaly", ep: 9000 },
    { id: 55, name: "Solid Gold", emoji: "👑", criteria: "All digits are identical and length >= 4", tier: "Anomaly", ep: 10000 },
    { id: 56, name: "Contiguous Sixes", emoji: "😈", criteria: "Six identical consecutive digits", tier: "Anomaly", ep: 20000 },
    { id: 57, name: "Contiguous Fives", emoji: "✋", criteria: "Five identical consecutive digits", tier: "Anomaly", ep: 12000 },
    { id: 58, name: "Palindromic Sovereign", emoji: "👑", criteria: "Full number is a palindrome and length >= 5", tier: "Anomaly", ep: 11000 },
    { id: 59, name: "Pi Slice (6)", emoji: "🥧", criteria: "Contains 314159", tier: "Anomaly", ep: 15000 },
    { id: 60, name: "Pi Slice (5)", emoji: "🥧", criteria: "Contains 31415", tier: "Anomaly", ep: 8000 },
    { id: 61, name: "E Slice (5)", emoji: "📈", criteria: "Contains 27182", tier: "Anomaly", ep: 8000 },
    { id: 62, name: "Cascade", emoji: "🌊", criteria: "Every digit increases by exactly one from left to right", tier: "Anomaly", ep: 9000 },
    { id: 63, name: "Avalanche", emoji: "❄️", criteria: "Every digit decreases by exactly one from left to right", tier: "Anomaly", ep: 9000 },
    { id: 64, name: "Star Trails", emoji: "✨", criteria: "Alternating digits perfectly match across the complete string", tier: "Anomaly", ep: 9500 },
    { id: 65, name: "Pronic Sovereign", emoji: "🌊", criteria: "The complete value is a product of two sequential integers", tier: "Anomaly", ep: 7500 },
    { id: 66, name: "Strobogrammatic Master", emoji: "🪞", criteria: "Looks the exact same flipped upside down", tier: "Anomaly", ep: 9000 },
    { id: 69, name: "Binary Soul", emoji: "🤖", criteria: "Only 0s and 1s", tier: "Anomaly", ep: 5000 },
    { id: 70, name: "Straight Flush", emoji: "🃏", criteria: "Contains 5 consecutive same-parity digits", tier: "Anomaly", ep: 4500 },
    { id: 71, name: "Two Pairs Contiguous", emoji: "👥", criteria: "Contains two matching pairs glued together side by side", tier: "Anomaly", ep: 4200 },
    { id: 208, name: "Binary Mirage", emoji: "🔮", criteria: "Contains only 0s, 1s, or 8s", tier: "Anomaly", ep: 5000 },
    { id: 77, name: "3 Consecutive Numbers", emoji: "⛓️", criteria: "Contains three adjacent consecutive integers in order", tier: "Epic", ep: 1800 },
    { id: 78, name: "Jackpot Three", emoji: "💎", criteria: "Contains 777 anywhere inside it", tier: "Epic", ep: 1777 },
    { id: 79, name: "The Devil's Core", emoji: "🔥", criteria: "Contains 666 glued to the exact middle", tier: "Epic", ep: 1666 },
    { id: 80, name: "Pronic Core", emoji: "📐", criteria: "The absolute mathematical middle is a pronic number", tier: "Epic", ep: 1400 },
    { id: 81, name: "Prime Core", emoji: "🧠", criteria: "The absolute structural center digits form a multi-digit prime", tier: "Epic", ep: 1500 },
    { id: 82, name: "Strobogrammatic Core", emoji: "🪞", criteria: "The interior substring is perfectly strobogrammatic", tier: "Epic", ep: 1450 },
    { id: 83, name: "Radar Slice", emoji: "📡", criteria: "Contains an inner palindrome of length 4", tier: "Epic", ep: 1350 },
    { id: 84, name: "Triple Double", emoji: "🎲", criteria: "Contains three distinct unique pairs scattered anywhere", tier: "Epic", ep: 1300 },
    { id: 85, name: "6767", emoji: "🫠", criteria: "Contains 6767", tier: "Epic", ep: 1100 },
    { id: 86, name: "Leet", emoji: "💻", criteria: "Contains 1337", tier: "Epic", ep: 1250 },
    { id: 87, name: "Hell", emoji: "🔥", criteria: "Contains 7734", tier: "Epic", ep: 1100 },
    { id: 88, name: "58008", emoji: "🍈", criteria: "Contains 58008", tier: "Epic", ep: 1200 },
    { id: 89, name: "80085", emoji: "💎", criteria: "Contains 80085", tier: "Epic", ep: 1200 },
    { id: 90, name: "Four of a Kind", emoji: "🎰", criteria: "Contains four identical digits anywhere inside", tier: "Epic", ep: 1400 },
    { id: 91, name: "Full House", emoji: "🏠", criteria: "Contains three of a kind and a pair anywhere inside", tier: "Epic", ep: 1500 },
    { id: 92, name: "Square Core", emoji: "🔳", criteria: "The central digits form a perfect square value", tier: "Epic", ep: 1250 },
    { id: 93, name: "Pi Slice (4)", emoji: "🥧", criteria: "Contains 3141", tier: "Epic", ep: 1300 },
    { id: 94, name: "E Slice (4)", emoji: "📈", criteria: "Contains 2718", tier: "Epic", ep: 1300 },
    { id: 96, name: "Contiguous Three Pair", emoji: "👨‍👩‍👧‍👦", criteria: "Contains three adjacent contiguous pairs", tier: "Epic", ep: 1300 },
    { id: 97, name: "Framed Pair", emoji: "🖼️", criteria: "Middle two digits match but differ from both end matching frames", tier: "Epic", ep: 1150 },
    { id: 98, name: "Alternator (4)", emoji: "⏳", criteria: "Contains 4 strictly alternating alternating items", tier: "Epic", ep: 1200 },
    { id: 99, name: "Prime Number", emoji: "🧿", criteria: "The entire rolling output is an indivisible prime number", tier: "Epic", ep: 1600 },
    { id: 100, name: "Millennium", emoji: "🎉", criteria: "Ends in 000", tier: "Epic", ep: 1500 },
    { id: 213, name: "Splits", emoji: "🎳", criteria: "Two sets of identical numbers split or contiguous", tier: "Epic", ep: 1750 },
    { id: 214, name: "Perfect Square", emoji: "📐", criteria: "The entire number evaluates to a perfect square root.", tier: "Epic", ep: 1200 },
    { id: 112, name: "Contiguous Quads", emoji: "➖➖", criteria: "Four identical consecutive digits", tier: "Rare", ep: 450 },
    { id: 113, name: "Radar Substring", emoji: "📟", criteria: "Contains a palindrome substring of length 3", tier: "Rare", ep: 350 },
    { id: 114, name: "Jackpot Two", emoji: "🪙", criteria: "Contains 77", tier: "Rare", ep: 300 },
    { id: 115, name: "The Devil's Twin", emoji: "🔥", criteria: "Contains 66", tier: "Rare", ep: 250 },
    { id: 116, name: "Pronic Fragment", emoji: "📊", criteria: "Contains a 2-digit or greater pronic number", tier: "Rare", ep: 300 },
    { id: 117, name: "Prime Fragment", emoji: "💠", criteria: "Contains a 3-digit prime number block", tier: "Rare", ep: 350 },
    { id: 118, name: "Strobogrammatic Fragment", emoji: "🪞", criteria: "Contains a 3-digit strobogrammatic block", tier: "Rare", ep: 300 },
    { id: 119, name: "Nice Nice", emoji: "😏", criteria: "Contains 6969", tier: "Rare", ep: 500 },
    { id: 120, name: "Boob", emoji: "🍈", criteria: "Contains 8008", tier: "Rare", ep: 400 },
    { id: 121, name: "404", emoji: "🚫", criteria: "Contains 404", tier: "Rare", ep: 300 },
    { id: 122, name: "Orientation", emoji: "🧭", criteria: "Contains 101", tier: "Rare", ep: 300 },
    { id: 123, name: "Botanist", emoji: "🌿", criteria: "Contains 420", tier: "Rare", ep: 300 },
    { id: 124, name: "Devil", emoji: "😈", criteria: "Contains 666", tier: "Rare", ep: 300 },
    { id: 125, name: "Meaning", emoji: "🌌", criteria: "Contains 42", tier: "Rare", ep: 200 },
    { id: 126, name: "Emergency", emoji: "🚑", criteria: "Contains 911", tier: "Rare", ep: 350 },
    { id: 127, name: "Calendar", emoji: "📅", criteria: "Contains 365", tier: "Rare", ep: 300 },
    { id: 128, name: "Tree Fiddy", emoji: "🦕", criteria: "Contains 350", tier: "Rare", ep: 300 },
    { id: 129, name: "Two Pair scattered", emoji: "👥", criteria: "Two pairs located anywhere", tier: "Rare", ep: 320 },
    { id: 130, name: "Consecutive Sort", emoji: "📊", criteria: "All digits form a consecutive sequence when sorted", tier: "Rare", ep: 320 },
    { id: 131, name: "Duality", emoji: "☯️", criteria: "Uses exactly two different digits", tier: "Rare", ep: 300 },
    { id: 132, name: "Framed Double", emoji: "🖼️", criteria: "Two pairs in the middle, bookended by different digits", tier: "Rare", ep: 280 },
    { id: 133, name: "Alternator (3)", emoji: "⏳", criteria: "Contains 3 strictly alternating sequential elements", tier: "Rare", ep: 250 },
    { id: 134, name: "Century", emoji: "💯", criteria: "Ends in 00", tier: "Rare", ep: 350 },
    { id: 135, name: "Perfect Palindrome", emoji: "🪞", criteria: "The entire rolling sequence reads exactly identical backwards", tier: "Rare", ep: 500 },
    { id: 136, name: "High Five", emoji: "🖐️", criteria: "Contains 5 digits above or equal to five", tier: "Rare", ep: 300 },
    { id: 137, name: "Low Five", emoji: "👇", criteria: "Contains 5 digits below five", tier: "Rare", ep: 300 },
    { id: 138, name: "Pi Slice (3)", emoji: "🥧", criteria: "Contains 314", tier: "Rare", ep: 300 },
    { id: 139, name: "E Slice (3)", emoji: "📈", criteria: "Contains 271", tier: "Rare", ep: 300 },
    { id: 206, name: "The Devil's Area Code", emoji: "🔥", criteria: "Contains 666 anywhere inside it", tier: "Rare", ep: 400 },
    { id: 209, name: "Echo", emoji: "🗣️", criteria: "The first half of the number perfectly matches the second half", tier: "Rare", ep: 450 },
    { id: 210, name: "Bookends", emoji: "📚", criteria: "Starts and ends with the exact same 2-digit combination", tier: "Rare", ep: 400 },
    { id: 141, name: "Sandwich", emoji: "🥪", criteria: "A single digit is perfectly squeezed between two matching digits", tier: "Uncommon", ep: 75 },
    { id: 142, name: "Contiguous Triple", emoji: "🎰", criteria: "Three identical consecutive digits", tier: "Uncommon", ep: 90 },
    { id: 143, name: "Two Consecutive Numbers", emoji: "🔗", criteria: "Contains two adjacent consecutive digits in sequential order", tier: "Uncommon", ep: 80 },
    { id: 145, name: "Double Hop", emoji: "🦘", criteria: "A digit appears at every other position (3 times)", tier: "Uncommon", ep: 85 },
    { id: 146, name: "High Roller", emoji: "🤑", criteria: "Contains only digits from 5 to 9", tier: "Uncommon", ep: 80 },
    { id: 147, name: "Valley", emoji: "🏜️", criteria: "Digits drop then rise perfectly", tier: "Uncommon", ep: 90 },
    { id: 148, name: "Peak", emoji: "🏔️", criteria: "Digits rise then drop perfectly", tier: "Uncommon", ep: 90 },
    { id: 149, name: "Step", emoji: "🪜", criteria: "First half matching and second half matching but separated", tier: "Uncommon", ep: 75 },
    { id: 150, name: "Scattered Triple", emoji: "🎲", criteria: "Three identical digits placed anywhere", tier: "Uncommon", ep: 80 },
    { id: 151, name: "Lucky Pair", emoji: "🎰", criteria: "Contains exactly 77", tier: "Uncommon", ep: 70 },
    { id: 152, name: "Devil's Pair", emoji: "😈", criteria: "Contains exactly 66", tier: "Uncommon", ep: 65 },
    { id: 153, name: "Nice Double", emoji: "😏", criteria: "Contains exactly 69", tier: "Uncommon", ep: 85 },
    { id: 154, name: "Triplets Scattered", emoji: "🧬", criteria: "Three unique digits repeated exactly twice", tier: "Uncommon", ep: 95 },
    { id: 155, name: "House Fragment", emoji: "🏚️", criteria: "Contains a set of three and a set of two", tier: "Uncommon", ep: 80 },
    { id: 156, name: "Snake Eyes", emoji: "🎲", criteria: "Contains a single pair of ones and no other pairs", tier: "Uncommon", ep: 65 },
    { id: 157, name: "Nice", emoji: "😏", criteria: "Contains the number 69", tier: "Uncommon", ep: 75 },
    { id: 158, name: "Jackpot One", emoji: "🪙", criteria: "Contains a single 7", tier: "Uncommon", ep: 50 },
    { id: 159, name: "Devil One", emoji: "👹", criteria: "Contains a single 6", tier: "Uncommon", ep: 45 },
    { id: 160, name: "Trinity", emoji: "🔱", criteria: "Uses exactly three different digits", tier: "Uncommon", ep: 70 },
    { id: 161, name: "Square Root", emoji: "📐", criteria: "Contains a perfect square sequence", tier: "Uncommon", ep: 75 },
    { id: 162, name: "Sequence (4)", emoji: "🔢", criteria: "Contains a sequence of 4 consecutive digits", tier: "Uncommon", ep: 95 },
    { id: 163, name: "Sequence (3)", emoji: "🔢", criteria: "Contains a sequence of 3 consecutive digits", tier: "Uncommon", ep: 80 },
    { id: 205, name: "Not Funny", emoji: "😑", criteria: "Contains the awkward number 67", tier: "Uncommon", ep: 70 },
    { id: 171, name: "Contiguous Pair", emoji: "♊", criteria: "Two identical consecutive digits", tier: "Common", ep: 10 },
    { id: 172, name: "Lone Pair", emoji: "💎", criteria: "Contains exactly one matching pair scattered", tier: "Common", ep: 12 },
    { id: 173, name: "Oddity", emoji: "🌀", criteria: "All digits inside are completely odd", tier: "Common", ep: 15 },
    { id: 174, name: "Evenness", emoji: "⚖️", criteria: "All digits inside are completely even", tier: "Common", ep: 15 },
    { id: 175, name: "Alternator (2)", emoji: "⏳", criteria: "Two matching sequential alternating structures", tier: "Common", ep: 10 },
    { id: 176, name: "Wave", emoji: "🌊", criteria: "Digits strictly alternate between rising and falling", tier: "Common", ep: 10 },
    { id: 177, name: "Three of a Kind", emoji: "🎰", criteria: "Contains three identical digits", tier: "Common", ep: 15 },
    { id: 178, name: "Lucky Seven (Divisible)", emoji: "🎰", criteria: "Divisible by 7", tier: "Common", ep: 10 },
    { id: 179, name: "Rounder", emoji: "🔵", criteria: "Contains digits with loops only (0, 6, 8, 9)", tier: "Common", ep: 12 },
    { id: 180, name: "Sharp", emoji: "🔺", criteria: "Contains sharp digits only (1, 4, 7)", tier: "Common", ep: 12 },
    { id: 181, name: "Ascent", emoji: "📈", criteria: "At least 3 sequential numbers increase", tier: "Common", ep: 10 },
    { id: 182, name: "Descent", emoji: "📉", criteria: "At least 3 sequential numbers decrease", tier: "Common", ep: 10 },
    { id: 183, name: "Two Digits", emoji: "🧮", criteria: "Length is exactly 2", tier: "Common", ep: 5 },
    { id: 184, name: "Three Digits", emoji: "🧮", criteria: "Length is exactly 3", tier: "Common", ep: 5 },
    { id: 185, name: "Four Digits", emoji: "🧮", criteria: "Length is exactly 4", tier: "Common", ep: 5 },
    { id: 186, name: "Five Digits", emoji: "🧮", criteria: "Length is exactly 5", tier: "Common", ep: 5 },
    { id: 187, name: "Six Digits", emoji: "🧮", criteria: "Length is exactly 6", tier: "Common", ep: 5 },
    { id: 188, name: "Hydrogen (1)", emoji: "🔋", criteria: "Contains exactly one 1", tier: "Common", ep: 5 },
    { id: 191, name: "Boron (5)", emoji: "💎", criteria: "Contains exactly one 5", tier: "Common", ep: 5 },
    { id: 192, name: "Carbon (6)", emoji: "💎", criteria: "Contains exactly one 6", tier: "Common", ep: 5 },
    { id: 193, name: "Nitrogen (7)", emoji: "💎", criteria: "Contains exactly one 7", tier: "Common", ep: 5 },
    { id: 194, name: "Oxygen (8)", emoji: "💎", criteria: "Contains exactly one 8", tier: "Common", ep: 5 },
    { id: 195, name: "Fluorine (9)", emoji: "💎", criteria: "Contains exactly one 9", tier: "Common", ep: 5 },
    { id: 196, name: "Lucky Seven", emoji: "7️⃣", criteria: "Contains the number 7", tier: "Common", ep: 6 },
    { id: 197, name: "Even", emoji: "⚖️", criteria: "Divisible by 2", tier: "Common", ep: 5 },
    { id: 198, name: "Odd", emoji: "⚖️", criteria: "Not divisible by 2", tier: "Common", ep: 5 },
    { id: 199, name: "Heterogeneous", emoji: "🌈", criteria: "All digits are completely unique from each other", tier: "Common", ep: 10 }
];

function evaluateBadges(n) {
    const s = n.toString();
    const digits = s.split('').map(Number);
    const earned = [];

    function countOccurrences(char) {
        return (s.match(new RegExp(char, 'g')) || []).length;
    }

    let maxContig = 1, currentContig = 1;
    let contigBlocks = [];
    for (let i = 1; i < s.length; i++) {
        if (s[i] === s[i-1]) {
            currentContig++;
        } else {
            if (currentContig > 1) contigBlocks.push({char: s[i-1], count: currentContig});
            currentContig = 1;
        }
    }
    if (currentContig > 1) contigBlocks.push({char: s[s.length-1], count: currentContig});
    maxContig = contigBlocks.reduce((max, b) => Math.max(max, b.count), 1);

    BADGES_DATABASE.forEach(badge => {
        let match = false;
        const name = badge.name;

        if (badge.criteria.startsWith("Exactly ")) {
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
            else if (name === "Exact Tree Fiddy" && n === 350) match = true;
            else if (name === "Exact Six-Seven" && n === 67) match = true;
            else if (name === "Exact Eighty-Six" && n === 86) match = true;
            else if (name === "Exact Orientation" && n === 101) match = true;
            else if (name === "Exact Calendar" && n === 365) match = true;
            else if (name === "Exact Boob" && (n === 8008 || n === 58008)) match = true;
            else if (name === "Brainrot" && n === 676767) match = true;
            else if (name === "Groundhog Day" && n === 365365) match = true;
        }
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
        else if (name === "Jackpot Six" && s.includes("777777")) match = true;
        else if (name === "Jackpot Five" && s.includes("77777")) match = true;
        else if (name === "Jackpot Four" && s.includes("7777")) match = true;
        else if (name === "Jackpot Three" && s.includes("777")) match = true;
        else if (name === "Jackpot Two" && s.includes("77")) match = true;
        else if (name === "Jackpot One" && s.includes("7")) match = true;
        else if (name === "The Beast" && s.includes("6666")) match = true;
        else if (name === "The Devil's Core" && s.length >= 3 && s.substring(Math.floor(s.length/2)-1, Math.ceil(s.length/2)+1).includes("666")) match = true;
        else if (name === "The Devil's Area Code" && s.includes("666")) match = true;
        else if (name === "Devil" && s.includes("666")) match = true;
        else if (name === "The Devil's Twin" && s.includes("66")) match = true;
        else if (name === "Devil's Pair" && s.includes("66")) match = true;
        else if (name === "Devil One" && s.includes("6")) match = true;
        else if (name === "13th Power" && n > 1 && Math.pow(Math.round(Math.pow(n, 1/13)), 13) === n) match = true;
        else if (name === "17th Power" && n > 1 && Math.pow(Math.round(Math.pow(n, 1/17)), 17) === n) match = true;
        else if (name === "19th Power" && n > 1 && Math.pow(Math.round(Math.pow(n, 1/19)), 19) === n) match = true;
        else if (name === "10th Power" && n > 1 && Math.pow(Math.round(Math.pow(n, 1/10)), 10) === n) match = true;
        else if (name === "11th Power" && n > 1 && Math.pow(Math.round(Math.pow(n, 1/11)), 11) === n) match = true;
        else if (name === "9th Power" && n > 1 && Math.pow(Math.round(Math.pow(n, 1/9)), 9) === n) match = true;
        else if (name === "8th Power" && n > 1 && Math.pow(Math.round(Math.pow(n, 1/8)), 8) === n) match = true;
        else if (name === "7th Power" && n > 1 && Math.pow(Math.round(Math.pow(n, 1/7)), 7) === n) match = true;
        else if (name === "6th Power" && n > 1 && Math.pow(Math.round(Math.pow(n, 1/6)), 6) === n) match = true;
        else if (name === "Perfect Fifth" && n > 1 && Math.pow(Math.round(Math.pow(n, 1/5)), 5) === n) match = true;
        else if (name === "Perfect Fourth" && n > 1 && Math.pow(Math.round(Math.pow(n, 1/4)), 4) === n) match = true;
        else if (name === "Perfect Cube" && n > 1 && Math.pow(Math.round(Math.pow(n, 1/3)), 3) === n) match = true;
        else if (name === "Pi" && [314, 3141, 31415, 314159].includes(n)) match = true;
        else if (name === "Euler's Number" && [271, 2718, 27182, 271828].includes(n)) match = true;
        else if (name === "Factorial" && FACTORIALS.includes(n)) match = true;
        else if (name === "Fibonacci Number" && FIBONACCI.includes(n)) match = true;
        else if (name === "Contiguous Sixes" && maxContig >= 6) match = true;
        else if (name === "Contiguous Fives" && maxContig >= 5) match = true;
        else if (name === "Contiguous Quads" && maxContig >= 4) match = true;
        else if (name === "Contiguous Triple" && maxContig >= 3) match = true;
        else if (name === "Contiguous Pair" && maxContig >= 2) match = true;
        else if (name === "Binary Overlord" && s.length >= 5 && digits.every(d => d === 0 || d === 1)) match = true;
        else if (name === "Binary Soul" && digits.every(d => d === 0 || d === 1)) match = true;
        else if (name === "Binary Mirage" && digits.every(d => d === 0 || d === 1 || d === 8)) match = true;
        else if (name === "Solid Gold" && s.length >= 4 && new Set(digits).size === 1) match = true;
        else if (name === "Palindromic Sovereign" && s.length >= 5 && s === s.split('').reverse().join('')) match = true;
        else if (name === "Perfect Palindrome" && s === s.split('').reverse().join('')) match = true;
        else if (name === "Pi Slice (6)" && s.includes("314159")) match = true;
        else if (name === "Pi Slice (5)" && s.includes("31415")) match = true;
        else if (name === "Pi Slice (4)" && s.includes("3141")) match = true;
        else if (name === "Pi Slice (3)" && s.includes("314")) match = true;
        else if (name === "E Slice (5)" && s.includes("27182")) match = true;
        else if (name === "E Slice (4)" && s.includes("2718")) match = true;
        else if (name === "E Slice (3)" && s.includes("271")) match = true;
        else if (name === "Cascade" && digits.every((d, i) => i === 0 || d === digits[i-1] + 1)) match = true;
        else if (name === "Avalanche" && digits.every((d, i) => i === 0 || d === digits[i-1] - 1)) match = true;
        else if (name === "Star Trails" && digits.every((d, i) => d === digits[i % 2])) match = true;
        else if (name === "Pronic Sovereign" && (Math.floor(Math.sqrt(n)) * (Math.floor(Math.sqrt(n)) + 1) === n)) match = true;
        else if (name === "Strobogrammatic Master" && digits.every(d => [0,1,6,8,9].includes(d)) && s === s.split('').reverse().map(d => d==='6'?'9':d==='9'?'6':d).join('')) match = true;
        else if (name === "Straight Flush") {
            for (let i = 0; i <= digits.length - 5; i++) {
                let chunk = digits.slice(i, i + 5);
                if (chunk.every(d => d % 2 === chunk[0] % 2)) match = true;
            }
        }
        else if (name === "Two Pairs Contiguous") {
            if (contigBlocks.filter(b => b.count >= 2).length >= 2) match = true;
        }
        else if (name === "Hell" && s.includes("7734") && n !== 7734) match = true;
        else if (name === "58008" && s.includes("58008") && n !== 58008) match = true;
        else if (name === "80085" && s.includes("80085") && n !== 80085) match = true;
        else if (name === "Nice Nice" && s.includes("6969")) match = true;
        else if (name === "Nice Double" && s.includes("69")) match = true;
        else if (name === "Nice" && s.includes("69")) match = true;
        else if (name === "Boob" && s.includes("8008")) match = true;
        else if (name === "404" && s.includes("404")) match = true;
        else if (name === "Orientation" && s.includes("101")) match = true;
        else if (name === "Botanist" && s.includes("420")) match = true;
        else if (name === "Meaning" && s.includes("42")) match = true;
        else if (name === "Emergency" && s.includes("911")) match = true;
        else if (name === "Calendar" && s.includes("365")) match = true;
        else if (name === "Tree Fiddy" && s.includes("350")) match = true;
        else if (name === "Not Funny" && s.includes("67")) match = true;
        else if (name === "6767" && s.includes("6767")) match = true;
        else if (name === "Leet" && s.includes("1337")) match = true;
        else if (name === "Four of a Kind" && new Set(digits).size <= s.length - 3) match = true;
        else if (name === "Three of a Kind" && new Set(digits).size <= s.length - 2) match = true;
        else if (name === "Full House") {
            let counts = {}; digits.forEach(d => counts[d] = (counts[d] || 0) + 1);
            let vals = Object.values(counts);
            if (vals.includes(3) && vals.includes(2)) match = true;
        }
        else if (name === "Two Pair scattered") {
            let counts = {}; digits.forEach(d => counts[d] = (counts[d] || 0) + 1);
            if (Object.values(counts).filter(c => c >= 2).length >= 2) match = true;
        }
        else if (name === "Consecutive Sort" && [...digits].sort((a,b)=>a-b).every((d,i,arr) => i===0 || d === arr[i-1]+1)) match = true;
        else if (name === "Duality" && new Set(digits).size === 2) match = true;
        else if (name === "Trinity" && new Set(digits).size === 3) match = true;
        else if (name === "Alternator (4)") {
            for (let i = 0; i <= digits.length - 4; i++) {
                if (digits[i] === digits[i+2] && digits[i+1] === digits[i+3]) match = true;
            }
        }
        else if (name === "Alternator (3)") {
            for (let i = 0; i <= digits.length - 3; i++) {
                if (digits[i] === digits[i+2]) match = true;
            }
        }
        else if (name === "Alternator (2)") {
            for (let i = 0; i <= digits.length - 2; i++) {
                if (digits[i] === digits[i+1]) match = true;
            }
        }
        else if (name === "Wave") {
            let rising = digits[1] > digits[0];
            let isWave = true;
            for (let i = 1; i < digits.length; i++) {
                if (rising && digits[i] <= digits[i-1]) isWave = false;
                if (!rising && digits[i] >= digits[i-1]) isWave = false;
                rising = !rising;
            }
            if (isWave && digits.length >= 3) match = true;
        }
        else if (name === "4 Consecutive Numbers" || name === "Sequence (4)") {
            for (let i = 0; i <= s.length - 4; i++) {
                let sub = digits.slice(i, i + 4);
                if (sub.every((d, idx) => idx === 0 || d === sub[idx-1] + 1) || sub.every((d, idx) => idx === 0 || d === sub[idx-1] - 1)) match = true;
            }
        }
        else if (name === "3 Consecutive Numbers" || name === "Sequence (3)") {
            for (let i = 0; i <= s.length - 3; i++) {
                let sub = digits.slice(i, i + 3);
                if (sub.every((d, idx) => idx === 0 || d === sub[idx-1] + 1) || sub.every((d, idx) => idx === 0 || d === sub[idx-1] - 1)) match = true;
            }
        }
        else if (name === "Two Consecutive Numbers" || name === "2 Consecutive Numbers (Contains)") {
            for (let i = 0; i <= s.length - 2; i++) {
                let sub = digits.slice(i, i + 2);
                if (sub[1] === sub[0] + 1 || sub[1] === sub[0] - 1) match = true;
            }
        }
        else if (name === "Sandwich") {
            for (let i = 1; i < digits.length - 1; i++) {
                if (digits[i-1] === digits[i+1] && digits[i] !== digits[i-1]) match = true;
            }
        }
        else if (name === "Oddity" && digits.every(d => d % 2 !== 0)) match = true;
        else if (name === "Evenness" && digits.every(d => d % 2 === 0)) match = true;
        else if (name === "Even" && n % 2 === 0) match = true;
        else if (name === "Odd" && n % 2 !== 0) match = true;
        else if (name === "Heterogeneous" && new Set(digits).size === s.length) match = true;

        if (match) earned.push(badge);
    });

    const uniqueEarned = [];
    const seenNames = new Set();
    earned.forEach(b => {
        let baseName = b.name.replace(/\s*\(Contains\)|\s*\(Nearby\)|\s*Slice\s*\(\d+\)/gi, "").trim();
        if (baseName.includes("Consecutive Numbers") || baseName.includes("Sequence")) {
            baseName = "Consecutive_Sequence_Group";
        }
        if (!seenNames.has(baseName) && !seenNames.has(b.name)) {
            seenNames.add(baseName);
            seenNames.add(b.name);
            uniqueEarned.push(b);
        }
    });

    if (uniqueEarned.length === 0) {
        uniqueEarned.push(BADGES_DATABASE.find(b => b.name === (n % 2 === 0 ? "Even" : "Odd")));
    }
    return uniqueEarned;
}