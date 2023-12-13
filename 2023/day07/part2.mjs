import { getInput } from '../../utils/index.mjs';

const input = await getInput();
const cardRanks = {
    A: 13,
    K: 12,
    Q: 11,
    T: 9,
    9: 8,
    8: 7,
    7: 6,
    6: 5,
    5: 4,
    4: 3,
    3: 2,
    2: 1,
    J: 0,
};

const handStrengths = {
    X5: 7,
    X4: 6,
    FH: 5,
    X3: 4,
    P2: 3,
    P1: 2,
    HC: 1,
};

const hands = [...input.lines()].map(line => { const [hand, bid] = line.split(' '); return { hand, bid: +bid, strength: getStrength(hand) }; });

hands.sort((a, b) => a.strength === b.strength ? sortEqual(a.hand, b.hand) : a.strength - b.strength);

console.error(hands.reduce((s, h, i) => s + h.bid * (i + 1), 0));

function sortEqual(h1, h2) {
    for (const [i, card] of Array.prototype.entries.call(h1)) {
        if (card === h2[i]) continue;
        return cardRanks[card] - cardRanks[h2[i]];
    }
}

function getStrength(hand) {
    const countMap = Array.prototype.reduce.call(hand, (acc, card) => ((!acc[card] ? acc[card] = 1 : acc[card]++), acc), {});
    let counts;
    if (countMap.J) {
        const jokers = countMap.J;
        delete countMap.J;
        counts = Object.values(countMap).sort((a, b) => b - a);
        counts[0] = (counts[0] ?? 0) + jokers;
    } else {
        counts = Object.values(countMap);
    }

    switch (counts.length) {
        case 5:
            return handStrengths.HC;
        case 4:
            return handStrengths.P1;
        case 3:
            const firstTwo = counts[0] + counts[1];
            if (firstTwo === 2) {
                return handStrengths.X3;
            }
            if (firstTwo === 3) {
                return handStrengths.P2;
            }
            if (firstTwo === 4) {
                if (counts[0] === 2) {
                    return handStrengths.P2;
                }
                return handStrengths.X3;
            }
        case 2:
            const first = counts[0];
            if (first === 1 || first === 4) {
                return handStrengths.X4;
            }
            return handStrengths.FH;
        case 1:
            return handStrengths.X5;
    }
}
