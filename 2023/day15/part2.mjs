import { getExampleInput, getInput, add } from '../../utils/index';

main();

async function main() {
    const input = await getInput();
    // const input = await getExampleInput();

    const boxes = {};
    const re = /^(\w+)([-=])(\d+)?$/;

    for (const step of input.split(',')) {
        const [, label, op, focalLength] = step.match(re);
        const boxNo = hash(label);
        const box = (boxes[boxNo] ??= []);
        if (op === '=') {
            box.upsert([label, +focalLength], (a, b) => a[0] === b[0]);
        } else {
            box.removeBy(lens => lens[0] === label);
        }
    }

    let total = 0;
    for (const [box, lenses] of Object.entries(boxes)) {
        total += lenses.reduce((sum, lens, i) => sum + (+box + 1) * (i + 1) * lens[1], 0);
    }

    console.log('Total:', total);
}

/**
 *
 * @param {string} s
 * @returns {number}
 */
function hash(s) {
    let h = 0;

    for (const char of s) {
        h += char.charCodeAt(0);
        h *= 17;
        h %= 256;
    }

    return h;
}