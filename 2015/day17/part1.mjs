import { getExampleInput, getInput, permutations } from '../../utils/index.mjs';

const LITERS = 150;
// const LITERS = 25;

async function main() {
    const input = await getInput();
    // const input = await getExampleInput();
    const containers = [...input.lines()].map(n => new Number(n));

    const possibilities = [];
    for (const pos of test(containers, 0, [])) {
        if (pos) {
            possibilities.push(pos);
        }
    }

    // console.log(possibilities);
    console.log(possibilities.length);
}

main();

function* test(containers, sum, used) {
    if (!containers.length) {
        return;
    }
    for (const [i, c] of containers.entries()) {
        const s = sum + c.valueOf();
        const u = used.concat([c]);
        if (s === LITERS) {
            yield u;
        }

        yield* test(containers.slice(i + 1), s, u);
    }
}
