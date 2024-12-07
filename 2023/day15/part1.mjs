import { getExampleInput, getInput, add } from '../../utils/index';

main();

async function main() {
    const input = await getInput();
    // const input = await getExampleInput();

    console.log(input.split(',').map(hash).reduce(add));
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