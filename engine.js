// Constants
const FACTORIALS = [1, 2, 6, 24, 120, 720, 5040, 40320, 362880];
const FIBONACCI = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711, 28657, 46368, 75025, 121393, 196418, 317811, 514229, 832040];

// The Master Database
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
    { id: 40, name: "Euler's Number", emoji: "📈", criteria: "The number e (271, 2718, 27182, or 271828)", tier: "Mythic", ep: 40000 },
    { id: 41, name: "4 Consecutive Numbers", emoji: "⛓️", criteria: "Contains four adjacent consecutive integers in order", tier: "Anomaly", ep: 6500 },
    { id: 42, name: "9th Power", emoji: "☁️", criteria: "A perfect 9th power (n⁹)", tier: "Mythic", ep: 35000 },
    { id: 43, name: "8th Power", emoji: "🎱", criteria: "A perfect 8th power (n⁸)", tier: "Mythic", ep: 30000 },
    { id: 44, name: "7th Power", emoji: "🌈", criteria: "A perfect 7th power (n⁷)", tier: "Mythic", ep: 25000 },
    { id: 45, name: "Factorial", emoji: "❗", criteria: "A factorial number (n!)", tier: "Mythic", ep: 25000 },
    { id: 46, name: "Hello", emoji: "👋", criteria: "Contains 07734 (spells HELLO upside-down)", tier: "Mythic", ep: 20000 },
    { id: 47, name: "Sequence (6)", emoji: "🔢", criteria: "Contains a sequence of 6 consecutive digits", tier: "Mythic", ep: 25000 },
    { id: 48, name: "Contiguous Sixes", emoji: "➖➖➖➖", criteria: "Six identical consecutive digits", tier: "Mythic", ep: 20000 },
    { id: 49, name: "Deep Void (5)", emoji: "⚫", criteria: "Contains 00000", tier: "Mythic", ep: 20000 },
    { id: 50, name: "Single Digit", emoji: "☝️", criteria: "Has exactly one digit", tier: "Mythic", ep: 35000 },
    { id: 51, name: "Quint Nine", emoji: "🥳", criteria: "Ends in 99999", tier: "Mythic", ep: 20000 },
    { id: 52, name: "6th Power", emoji: "🎲", criteria: "A perfect 6th power (n⁶)", tier: "Anomaly", ep: 12000 },
    { id: 53, name: "Power of Three", emoji: "🔺", criteria: "A power of 3 (3ⁿ)", tier: "Anomaly", ep: 10000 },
    { id: 54, name: "5th Power", emoji: "🖐️", criteria: "A perfect 5th power (n⁵)", tier: "Anomaly", ep: 11000 },
    { id: 55, name: "Jackpot Five", emoji: "💰💰💰", criteria: "Contains five 7s in a row", tier: "Anomaly", ep: 9500 },
    { id: 56, name: "Power of Two", emoji: "💾", criteria: "A power of 2 (2ⁿ)", tier: "Anomaly", ep: 8000 },
    { id: 57, name: "Royal Flush", emoji: "👑", criteria: "Contains 56789 — the highest possible straight", tier: "Anomaly", ep: 8500 },
    { id: 58, name: "58008", emoji: "🔠", criteria: "Contains 58008 (spells BOOBS upside-down)", tier: "Anomaly", ep: 7500 },
    { id: 59, name: "80085", emoji: "🅱️", criteria: "Contains 80085 (spells BOOBS)", tier: "Anomaly", ep: 7500 },
    { id: 60, name: "Pi Slice (5)", emoji: "🥧", criteria: "Contains 31415", tier: "Anomaly", ep: 8000 },
    { id: 61, name: "E Slice (5)", emoji: "📈", criteria: "Contains 27182", tier: "Anomaly", ep: 8000 },
    { id: 62, name: "Cascade", emoji: "🌊", criteria: "Every digit increases by exactly 1 from the previous", tier: "Anomaly", ep: 7000 },
    { id: 63, name: "Fibonacci Number", emoji: "🐚", criteria: "Part of the golden ratio sequence found in nature", tier: "Anomaly", ep: 6500 },
    { id: 64, name: "4th Power", emoji: "📦", criteria: "A perfect fourth power (n⁴)", tier: "Anomaly", ep: 6000 },
    { id: 65, name: "Waterfall", emoji: "🚿", criteria: "Every digit decreases by exactly 1 from the previous", tier: "Anomaly", ep: 7000 },
    { id: 66, name: "4 Consecutive Numbers (Scrambled)", emoji: "🔀", criteria: "The entire number splits into four consecutive integers, but not in order", tier: "Anomaly", ep: 5500 },
    { id: 68, name: "Homogeneous", emoji: "🥛", criteria: "All digits are the same", tier: "Anomaly", ep: 9000 },
    { id: 69, name: "Binary Soul", emoji: "🤖", criteria: "Only 0s and 1s", tier: "Anomaly", ep: 5000 },
    { id: 70, name: "Straight Flush", emoji: "🃏", criteria: "Contains 5 consecutive same-parity digits", tier: "Anomaly", ep: 4500 },
    { id: 71, name: "Two Digits", emoji: "✌️", criteria: "Has exactly two digits", tier: "Anomaly", ep: 8500 },
    { id: 72, name: "Spy Number", emoji: "🕵️", criteria: "The sum of its digits equals the product of its digits", tier: "Anomaly", ep: 4000 },
    { id: 73, name: "Quad Nine", emoji: "🎊", criteria: "Ends in 9999", tier: "Anomaly", ep: 4500 },
    { id: 74, name: "Semi-Epoch", emoji: "🗿", criteria: "Ends in 5000", tier: "Anomaly", ep: 4500 },
    { id: 75, name: "3rd Power", emoji: "🧊", criteria: "A perfect cube (n³)", tier: "Anomaly", ep: 4000 },
    { id: 76, name: "Even Spacing", emoji: "📏", criteria: "All digits are evenly spaced in an arithmetic sequence", tier: "Anomaly", ep: 3500 },
    { id: 215, name: "Perfect Cube", emoji: "🧊", criteria: "The entire number evaluates to a perfect cube root.", tier: "Anomaly", ep: 4200 },
    { id: 208, name: "Binary Mirage", emoji: "🔮", criteria: "Contains only 0s, 1s, or 8s", tier: "Anomaly", ep: 5000 },
    { id: 77, name: "3 Consecutive Numbers", emoji: "⛓️", criteria: "Contains three adjacent consecutive integers", tier: "Epic", ep: 1800 },
    { id: 78, name: "Contiguous Fives", emoji: "➖➖🏼", criteria: "Five identical consecutive digits", tier: "Epic", ep: 1750 },
    { id: 79, name: "Deep Void (4)", emoji: "🌌", criteria: "Contains 0000", tier: "Epic", ep: 1750 },
    { id: 80, name: "Strobogrammatic", emoji: "🙃", criteria: "Looks the same when rotated 180 degrees", tier: "Epic", ep: 1600 },
    { id: 81, name: "Straight", emoji: "📏", criteria: "Contains a sequence of 5 consecutive digits", tier: "Epic", ep: 1500 },
    { id: 82, name: "Jackpot Four", emoji: "💰💰", criteria: "Contains four 7s in a row", tier: "Epic", ep: 1400 },
    { id: 83, name: "Very Nice", emoji: "🥵", criteria: "Contains 6969", tier: "Epic", ep: 1300 },
    { id: 84, name: "Deeper Meaning", emoji: "🌌", criteria: "Contains 4242", tier: "Epic", ep: 1300 },
    { id: 85, name: "6767", emoji: "🫠", criteria: "Contains 6767", tier: "Epic", ep: 1100 },
    { id: 86, name: "Leet", emoji: "💻", criteria: "Contains 1337", tier: "Epic", ep: 1250 },
    { id: 87, name: "Hell", emoji: "🔥", criteria: "Contains 7734 (spells HELL upside-down)", tier: "Epic", ep: 1250 },
    { id: 88, name: "8008", emoji: "🔢", criteria: "Contains 8008 (spells BOOB upside-down)", tier: "Epic", ep: 1200 },
    { id: 89, name: "Big Brother", emoji: "👁️", criteria: "Contains 1984", tier: "Epic", ep: 1200 },
    { id: 90, name: "Pi Slice (4)", emoji: "🥧", criteria: "Contains 3141", tier: "Epic", ep: 1200 },
    { id: 91, name: "E Slice (4)", emoji: "📈", criteria: "Contains 2718", tier: "Epic", ep: 1200 },
    { id: 92, name: "3 Consecutive Numbers (Scrambled)", emoji: "🔀", criteria: "The entire number splits into three consecutive integers, but not in order", tier: "Epic", ep: 1400 },
    { id: 93, name: "Zipper", emoji: "🤐", criteria: "Two digits alternating perfectly", tier: "Epic", ep: 1350 },
    { id: 94, name: "Ascension", emoji: "📈", criteria: "Every digit is strictly larger than the previous", tier: "Epic", ep: 1500 },
    { id: 96, name: "Contiguous Three Pair", emoji: "👨‍👩‍👧‍👦", criteria: "Contains three adjacent contiguous pairs", tier: "Epic", ep: 1300 },
    { id: 97, name: "Framed Pair", emoji: "🖼️", criteria: "Middle two digits match but differ from both end digits", tier: "Epic", ep: 1000 },
    { id: 98, name: "Framed Triple", emoji: "🖼️", criteria: "A triple in the middle, bookended by different digits", tier: "Epic", ep: 1200 },
    { id: 99, name: "Decay", emoji: "📉", criteria: "Every digit is strictly smaller than the previous", tier: "Epic", ep: 1500 },
    { id: 100, name: "Three Digits", emoji: "🤟", criteria: "Has exactly three digits", tier: "Epic", ep: 2000 },
    { id: 101, name: "Echo", emoji: "📣", criteria: "The first half repeats as the second half", tier: "Epic", ep: 1600 },
    { id: 102, name: "Millennium", emoji: "🗓️", criteria: "Ends in triple zeros", tier: "Epic", ep: 1500 },
    { id: 103, name: "Pronic Number", emoji: "🧮", criteria: "The product of two consecutive integers", tier: "Epic", ep: 1100 },
    { id: 104, name: "Triple Nine", emoji: "🎉", criteria: "Ends in 999", tier: "Epic", ep: 1200 },
    { id: 105, name: "Semi-Millennium", emoji: "📜", criteria: "Ends in 500", tier: "Epic", ep: 1100 },
    { id: 106, name: "Colossal", emoji: "🪨", criteria: "A number greater than 999,000", tier: "Epic", ep: 1400 },
    { id: 107, name: "2nd Power", emoji: "🟦", criteria: "A perfect square (n²)", tier: "Epic", ep: 1000 },
    { id: 108, name: "Even Spacing (Absolute)", emoji: "📐", criteria: "All digits have the same absolute spacing", tier: "Epic", ep: 1250 },
    { id: 109, name: "Firefly", emoji: "🪲", criteria: "One unique digit among identical others", tier: "Epic", ep: 1300 },
    { id: 110, name: "2 Consecutive Numbers", emoji: "🔗", criteria: "The entire number splits into two consecutive integers", tier: "Epic", ep: 1000 },
    { id: 111, name: "Palindrome", emoji: "🪞", criteria: "Reads the same forwards and backwards", tier: "Epic", ep: 1100 },
    { id: 204, name: "Leet", emoji: "💻", criteria: "Contains the elite signature 1337", tier: "Epic", ep: 1250 },
    { id: 207, name: "High Five", emoji: "✋", criteria: "Contains five identical numbers split or contiguous", tier: "Epic", ep: 1750 },
    { id: 214, name: "Perfect Square", emoji: "📐", criteria: "The entire number evaluates to a perfect square root.", tier: "Epic", ep: 1200 },
    { id: 112, name: "Contiguous Quads", emoji: "➖➖", criteria: "Four identical consecutive digits", tier: "Rare", ep: 450 },
    { id: 113, name: "Deep Void (3)", emoji: "🌑", criteria: "Contains 000", tier: "Rare", ep: 450 },
    { id: 114, name: "Turtle", emoji: "🐢", criteria: "All consecutive digits differ by at most 1", tier: "Rare", ep: 400 },
    { id: 115, name: "Secret Agent", emoji: "🕶️", criteria: "Contains 007", tier: "Rare", ep: 350 },
    { id: 116, name: "Heavy", emoji: "🧱", criteria: "The sum of its digits exceeds 45", tier: "Rare", ep: 300 },
    { id: 117, name: "Contiguous Full House", emoji: "🏰", criteria: "Contains a contiguous set of three adjacent to a contiguous set of two", tier: "Rare", ep: 380 },
    { id: 118, name: "Jackpot", emoji: "💰", criteria: "Contains 777", tier: "Rare", ep: 400 },
    { id: 119, name: "Devil", emoji: "😈", criteria: "Contains 666", tier: "Rare", ep: 400 },
    { id: 120, name: "Sequence (4)", emoji: "🔢", criteria: "Contains a sequence of 4 consecutive digits", tier: "Rare", ep: 350 },
    { id: 121, name: "Error 404", emoji: "🚫", criteria: "Contains 404", tier: "Rare", ep: 300 },
    { id: 122, name: "Orientation", emoji: "🧭", criteria: "Contains 101", tier: "Rare", ep: 300 },
    { id: 123, name: "Botanist", emoji: "🌿", criteria: "Contains 420", tier: "Rare", ep: 300 },
    { id: 124, name: "Emergency", emoji: "🚑", criteria: "Contains 911", tier: "Rare", ep: 300 },
    { id: 125, name: "Pi Slice (3)", emoji: "🥧", criteria: "Contains 314", tier: "Rare", ep: 300 },
    { id: 126, name: "E Slice (3)", emoji: "📈", criteria: "Contains 271", tier: "Rare", ep: 300 },
    { id: 127, name: "Tree Fiddy", emoji: "🦕", criteria: "Contains 350", tier: "Rare", ep: 300 },
    { id: 128, name: "Calendar", emoji: "📅", criteria: "Contains 365", tier: "Rare", ep: 300 },
    { id: 129, name: "Divisible by Three", emoji: "🔺", criteria: "Every digit is divisible by 3", tier: "Rare", ep: 250 },
    { id: 130, name: "Scramble", emoji: "🔀", criteria: "All digits form a consecutive sequence when sorted", tier: "Rare", ep: 320 },
    { id: 131, name: "Duality", emoji: "☯️", criteria: "Uses exactly two different digits", tier: "Rare", ep: 300 },
    { id: 132, name: "Framed Double", emoji: "🖼️", criteria: "Two pairs in the middle, bookended by different digits", tier: "Rare", ep: 280 },
    { id: 133, name: "Paired Bookends", emoji: "👐", criteria: "Starts with a pair and ends with a different pair", tier: "Rare", ep: 260 },
    { id: 134, name: "Four Digits", emoji: "🍀", criteria: "Has exactly four digits", tier: "Rare", ep: 500 },
    { id: 135, name: "Three Pair", emoji: "👥", criteria: "Contains three distinct pairs of matching digits", tier: "Rare", ep: 350 },
    { id: 136, name: "Bookends", emoji: "📚", criteria: "The first two digits match the last two", tier: "Rare", ep: 380 },
    { id: 137, name: "Mirror Bookends", emoji: "📖", criteria: "First two digits are reversed as the last two", tier: "Rare", ep: 380 },
    { id: 138, name: "Century", emoji: "💯", criteria: "Ends in double zeros", tier: "Rare", ep: 300 },
    { id: 139, name: "Double Nine", emoji: "🎈", criteria: "Ends in 99", tier: "Rare", ep: 250 },
    { id: 140, name: "Semi-Century", emoji: "🗓️", criteria: "Ends in 50", tier: "Rare", ep: 250 },
    { id: 206, name: "The Devil's Area Code", emoji: "🔥", criteria: "Contains 666 anywhere inside it", tier: "Rare", ep: 400 },
    { id: 209, name: "Echo", emoji: "🗣️", criteria: "The first half of the number perfectly matches the second half", tier: "Rare", ep: 450 },
    { id: 210, name: "Bookends", emoji: "📚", criteria: "The first two digits exactly match the last two digits.", tier: "Rare", ep: 380 },
    { id: 141, name: "Four of a Kind", emoji: "🍀", criteria: "Contains four identical digits", tier: "Uncommon", ep: 95 },
    { id: 142, name: "Low Ball", emoji: "📉", criteria: "Contains only digits from 0 to 4", tier: "Uncommon", ep: 80 },
    { id: 143, name: "Contiguous Two Pair", emoji: "👨‍👩‍👧‍👦", criteria: "Contains two adjacent contiguous pairs", tier: "Uncommon", ep: 90 },
    { id: 144, name: "Mountain", emoji: "🏔️", criteria: "Digits ascend to a peak and then descend", tier: "Uncommon", ep: 85 },
    { id: 145, name: "Double Hop", emoji: "🦘", criteria: "A digit appears at every other position (3 times)", tier: "Uncommon", ep: 85 },
    { id: 146, name: "High Roller", emoji: "🤑", criteria: "Contains only digits from 5 to 9", tier: "Uncommon", ep: 80 },
    { id: 147, name: "Valley", emoji: "🏜️", criteria: "Digits descend to a trough and then ascend", tier: "Uncommon", ep: 85 },
    { id: 148, name: "Mini Echo", emoji: "🔂", criteria: "Contains an adjacent 2-digit repeat", tier: "Uncommon", ep: 70 },
    { id: 149, name: "Alternator", emoji: "⚡", criteria: "Digits strictly alternate between even and odd", tier: "Uncommon", ep: 75 },
    { id: 150, name: "Flush", emoji: "🎨", criteria: "All digits are either all even or all odd", tier: "Uncommon", ep: 75 },
    { id: 151, name: "Contiguous Trips", emoji: "➖", criteria: "Three identical consecutive digits", tier: "Uncommon", ep: 80 },
    { id: 152, name: "Deep Void", emoji: "🕳️", criteria: "Contains 00", tier: "Uncommon", ep: 70 },
    { id: 153, name: "Feather", emoji: "🪶", criteria: "The sum of its digits is less than 15", tier: "Uncommon", ep: 65 },
    { id: 154, name: "Blackjack", emoji: "♠️", criteria: "Digits sum exactly to 21", tier: "Uncommon", ep: 75 },
    { id: 155, name: "Full House", emoji: "🏠", criteria: "Contains a set of three and a set of two", tier: "Uncommon", ep: 80 },
    { id: 156, name: "Snake Eyes", emoji: "🎲", criteria: "Contains a single pair of ones and no other pairs", tier: "Uncommon", ep: 65 },
    { id: 157, name: "Nice", emoji: "😏", criteria: "Contains the number 69", tier: "Uncommon", ep: 75 },
    { id: 158, name: "Meaning of Life", emoji: "🌌", criteria: "Contains 42", tier: "Uncommon", ep: 75 },
    { id: 159, name: "Six-Seven", emoji: "🫠", criteria: "Contains 67", tier: "Uncommon", ep: 70 },
    { id: 160, name: "Eighty-Six", emoji: "🍽️", criteria: "Contains 86", tier: "Uncommon", ep: 70 },
    { id: 161, name: "Balanced", emoji: "⚖️", criteria: "Sum of first half of digits equals sum of second half", tier: "Uncommon", ep: 75 },
    { id: 162, name: "Rhyme", emoji: "🎶", criteria: "Contains the same 2+ digit substring twice", tier: "Uncommon", ep: 80 },
    { id: 164, name: "2 Consecutive Numbers (Contains)", emoji: "🔗", criteria: "Contains adjacent substrings that are consecutive integers", tier: "Uncommon", ep: 75 },
    { id: 165, name: "2 Consecutive Numbers (Nearby)", emoji: "🔗", criteria: "Contains non-adjacent substrings that are consecutive integers", tier: "Uncommon", ep: 70 },
    { id: 166, name: "Prime Number", emoji: "💎", criteria: "Divisible only by 1 and itself", tier: "Uncommon", ep: 85 },
    { id: 167, name: "Trinity", emoji: "⚜️", criteria: "Uses exactly three different digits", tier: "Uncommon", ep: 70 },
    { id: 168, name: "Dozen", emoji: "🍩", criteria: "Divisible by 12", tier: "Uncommon", ep: 65 },
    { id: 169, name: "Five Digits", emoji: "🖐️", criteria: "Has exactly five digits", tier: "Uncommon", ep: 100 },
    { id: 170, name: "Eleven", emoji: "🕚", criteria: "Divisible by 11", tier: "Uncommon", ep: 65 },
    { id: 171, name: "Harshad Number", emoji: "🤝", criteria: "Divisible by the sum of its own digits", tier: "Uncommon", ep: 70 },
    { id: 172, name: "Clean", emoji: "🧼", criteria: "Ends in a zero", tier: "Uncommon", ep: 60 },
    { id: 173, name: "Semi-Clean", emoji: "🧹", criteria: "Ends in a 5", tier: "Uncommon", ep: 60 },
    { id: 174, name: "Equilibrium", emoji: "🧘", criteria: "The first and last digits are identical", tier: "Uncommon", ep: 80 },
    { id: 175, name: "Sandwich", emoji: "🥪", criteria: "A different number between two identical numbers.", tier: "Uncommon", ep: 75 },
    { id: 205, name: "Not Funny", emoji: "😑", criteria: "Contains the awkward number 67", tier: "Uncommon", ep: 70 },
    { id: 211, name: "Sandwich", emoji: "🥪", criteria: "A digit is perfectly squeezed between two identical digits", tier: "Uncommon", ep: 75 },
    { id: 213, name: "Millennium", emoji: "🎆", criteria: "The roll ends in a clean triple zero.", tier: "Uncommon", ep: 90 },
    { id: 216, name: "HTTP 404", emoji: "🚫", criteria: "Contains the classic 404 Not Found error code.", tier: "Uncommon", ep: 75 },
    { id: 217, name: "HTTP 200", emoji: "✅", criteria: "Contains the HTTP OK 200 status code.", tier: "Uncommon", ep: 75 },
    { id: 176, name: "Hills", emoji: "🏞️", criteria: "Digits strictly alternate between rising and falling", tier: "Common", ep: 10 },
    { id: 177, name: "Three of a Kind", emoji: "🎰", criteria: "Contains three identical digits", tier: "Common", ep: 15 },
    { id: 178, name: "Lucky Seven (Divisible)", emoji: "🎰", criteria: "Divisible by 7", tier: "Common", ep: 10 },
    { id: 179, name: "Heterogeneous", emoji: "🥗", criteria: "No repeated digits", tier: "Common", ep: 20 },
    { id: 180, name: "Gap One", emoji: "↕️", criteria: "The first and last digits differ by exactly 1", tier: "Common", ep: 10 },
    { id: 181, name: "Two Pair", emoji: "2️⃣", criteria: "Contains two distinct pairs of matching digits", tier: "Common", ep: 12 },
    { id: 182, name: "Hopscotch", emoji: "🦘", criteria: "A digit appears at every other position (2 times)", tier: "Common", ep: 10 },
    { id: 183, name: "Ghost", emoji: "👻", criteria: "Contains exactly one 0", tier: "Common", ep: 8 },
    { id: 184, name: "Quartet", emoji: "🎻", criteria: "Uses exactly four different digits", tier: "Common", ep: 12 },
    { id: 185, name: "Hydrogen (1)", emoji: "💧", criteria: "Contains exactly one 1", tier: "Common", ep: 5 },
    { id: 186, name: "Helium (2)", emoji: "🎈", criteria: "Contains exactly one 2", tier: "Common", ep: 5 },
    { id: 187, name: "Carbon (6)", emoji: "✏️", criteria: "Contains exactly one 6", tier: "Common", ep: 5 },
    { id: 188, name: "Oxygen (8)", emoji: "💨", criteria: "Contains exactly one 8", tier: "Common", ep: 5 },
    { id: 189, name: "Lithium (3)", emoji: "🔋", criteria: "Contains exactly one 3", tier: "Common", ep: 5 },
    { id: 190, name: "Beryllium (4)", emoji: "💎", criteria: "Contains exactly one 4", tier: "Common", ep: 5 },
    { id: 191, name: "Boron (5)", emoji: "🧼", criteria: "Contains exactly one 5", tier: "Common", ep: 5 },
    { id: 192, name: "Nitrogen (7)", emoji: "❄️", criteria: "Contains exactly one 7", tier: "Common", ep: 5 },
    { id: 193, name: "Fluorine (9)", emoji: "🦷", criteria: "Contains exactly one 9", tier: "Common", ep: 5 },
    { id: 194, name: "Grounded", emoji: "⚓", criteria: "The first digit is smaller than the last", tier: "Common", ep: 8 },
    { id: 195, name: "Contiguous Pair", emoji: "🫂", criteria: "Contains a contiguous pair of matching digits", tier: "Common", ep: 10 },
    { id: 196, name: "Lucky Seven", emoji: "7️⃣", criteria: "Contains the number 7", tier: "Common", ep: 6 },
    { id: 197, name: "Even", emoji: "⚖️", criteria: "Divisible by 2", tier: "Common", ep: 5 },
    { id: 198, name: "Odd", emoji: "🦄", criteria: "Not divisible by 2", tier: "Common", ep: 5 },
    { id: 199, name: "Liftoff", emoji: "🚀", criteria: "The first digit is larger than the last", tier: "Common", ep: 8 },
    { id: 200, name: "Void", emoji: "🕳️", criteria: "Contains no zeros", tier: "Common", ep: 8 },
    { id: 201, name: "Neighbors", emoji: "🏘️", criteria: "Contains two digits that are adjacent in value", tier: "Common", ep: 10 },
    { id: 202, name: "Pair", emoji: "👯", criteria: "Contains a pair of matching digits", tier: "Common", ep: 5 },
    { id: 203, name: "Six Digits", emoji: "🐝", criteria: "Has exactly six digits", tier: "Common", ep: 15 },
    { id: 212, name: "Century", emoji: "💯", criteria: "The roll ends in a clean double zero.", tier: "Common", ep: 15 },
    { id: 218, name: "Area 51", emoji: "👽", criteria: "Contains the classified number 51.", tier: "Common", ep: 12 }
];

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

// Generate raw number
function generateRollString() {
    let rolledNumber = Math.floor(Math.random() * 1000000);
    return rolledNumber.toString();
}

// Main Evaluator Engine
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
        else if (name === "Millennium" && s.endsWith("000") && n !== 0) match = true;
        else if (name === "Perfect Square" && n > 1 && Math.sqrt(n) % 1 === 0) match = true;
        else if (name === "Perfect Cube" && n > 1 && Math.cbrt(n) % 1 === 0) match = true;
        else if (name === "HTTP 404" && s.includes("404") && n !== 404) match = true;
        else if (name === "HTTP 200" && s.includes("200") && n !== 200) match = true;
        else if (name === "Area 51" && s.includes("51") && n !== 51) match = true;
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
        else if (name === "Hello" && s.includes("07734")) match = true;
        else if (name === "Hell" && s.includes("7734") && n !== 7734) match = true;
        else if (name === "58008" && s.includes("58008") && n !== 58008) match = true;
        else if (name === "80085" && s.includes("80085") && n !== 80085) match = true;
        else if (name === "8008" && s.includes("8008") && n !== 8008) match = true;
        else if (name === "Jackpot Six" && s.includes("777777") && n !== 777777) match = true;
        else if (name === "Jackpot Five" && s.includes("77777") && n !== 77777) match = true;
        else if (name === "Jackpot Four" && s.includes("7777") && n !== 7777) match = true;
        else if (name === "Jackpot" && s.includes("777") && n !== 777) match = true;
        else if (name === "Lucky Seven" && s.includes("7") && n !== 7) match = true;
        else if (name === "Devil" && s.includes("666") && n !== 666) match = true;
        else if (name === "Very Nice" && s.includes("6969") && n !== 6969) match = true;
        else if (name === "Nice" && s.includes("69") && n !== 69) match = true;
        else if (name === "Leet" && s.includes("1337") && n !== 1337) match = true;
        else if (name === "Not Funny" && s.includes("67") && n !== 67) match = true;
        else if (name === "HTTP 404" && s.includes("404") && n !== 404) match = true;
        else if (name === "HTTP 200" && s.includes("200") && n !== 200) match = true;
        else if (name === "Area 51" && s.includes("51") && n !== 51) match = true;
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
        // PROPERLY CHAINED SEQUENCE LOGIC (De-cluttered and Ascending/Descending safe)
        else if (name === "4 Consecutive Numbers") {
            for(let i=0; i<=s.length-4; i++) {
                let sub = digits.slice(i, i+4);
                if ((sub[1] === sub[0]+1 && sub[2] === sub[1]+1 && sub[3] === sub[2]+1) || 
                    (sub[1] === sub[0]-1 && sub[2] === sub[1]-1 && sub[3] === sub[2]-1)) {
                    match = true;
                }
            }
        }
        else if (name === "3 Consecutive Numbers") {
            for(let i=0; i<=s.length-3; i++) {
                let sub = digits.slice(i, i+3);
                if ((sub[1] === sub[0]+1 && sub[2] === sub[1]+1) || 
                    (sub[1] === sub[0]-1 && sub[2] === sub[1]-1)) {
                    match = true;
                }
            }
        }
        else if (name === "Sequence (6)") {
            let asc = digits.every((d, i) => i === 0 || d === digits[i-1] + 1);
            let dsc = digits.every((d, i) => i === 0 || d === digits[i-1] - 1);
            if((asc || dsc) && digits.length === 6) match = true;
        }

        if (match) earned.push(badge);
    });

    const uniqueEarned = [];
    const seenNames = new Set();
    earned.forEach(b => {
        if (b.name === "The Devil's Area Code") return; 
        if (!seenNames.has(b.name)) {
            seenNames.add(b.name);
            uniqueEarned.push(b);
        }
    });

    if (uniqueEarned.length === 0) {
        uniqueEarned.push(BADGES_DATABASE.find(b => b.name === (n % 2 === 0 ? "Even" : "Odd")));
    }

    return uniqueEarned;
}

function calculateCardRarity(totalEP) {
    if (totalEP >= 1500000) return { name: "Mythic" };
    if (totalEP >= 300000) return { name: "Anomaly" };
    if (totalEP >= 75000) return { name: "Epic" };
    if (totalEP >= 15000)  return { name: "Rare" };
    if (totalEP >= 2500)  return { name: "Uncommon" };
    return { name: "Common" };
}