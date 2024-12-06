import { getInput } from '../../utils/index';

const input = await getInput();

function compare(p1, p2) {
    if (typeof p1 === 'number') {
        if (typeof p2 === 'number') {
            return p1 - p2;
        }
        return compare([p1], p2);
    } else if (typeof p2 === 'number') {
        return compare(p1, [p2]);
    } else {
        if (p2.length < p1.length) {
            for (let i = 0; i < p2.length; i++) {
                const r = compare(p1[i], p2[i]);
                if (r) {
                    return r;
                }
            }
            return 0;
        } else {
            for (let i = 0; i < p1.length; i++) {
                const r = compare(p1[i], p2[i]);
                if (r) {
                    return r;
                }
            }
            return p1.length === p2.length ? 0 : -1;
        }
    }
}

async function run() {
    const packetPairs = [];
    let c = 0;
    for (const line of input.lines()) {
        if (line.trim().length) {
            packetPairs[c] ||= [];
            packetPairs[c].push(JSON.parse(line));
        } else {
            c++;
        }
    }

    const orderedPairs = [];
    for (const [i, [p1, p2]] of Object.entries(packetPairs)) {
        if (compare(p1, p2) < 0) {
            orderedPairs.push(+i + 1);
        }
    }

    // console.log(packetPairs)
    // console.log(orderedPairs);
    console.log(orderedPairs.reduce((a, b) => a + b));
}

run();
