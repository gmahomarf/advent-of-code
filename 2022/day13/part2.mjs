import { getInput } from '../../utils/index.mjs';

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
            return 1;
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
    const packets = [[2], [6]];
    const dividers = [];

    for (const line of input.lines()) {
        if (line.trim().length) {
            packets.push(JSON.parse(line));
        }
    }

    packets.sort(compare);

    for (const i in packets) {
        if (compare([[2]], packets[i]) === 0 || compare([[6]], packets[i]) === 0) {
            dividers.push(+i + 1);
        }
        if (dividers.length === 2)
            break;
    }

    // console.log(dividers);
    console.log(dividers[0] * dividers[1]);
}

run();
