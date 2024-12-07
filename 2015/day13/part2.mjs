import { getExampleInput, getInput, combinations } from '../../utils/index';

async function main() {
    const input = await getInput();
    // const input = await getExampleInput();

    const happiness = {};

    for (const line of input.lines()) {
        const [who, _, delta, value, ...rest] = line.split(' ');
        const neighbor = rest.pop().slice(0, -1);

        (happiness[who] ??= {})[neighbor] = delta === 'gain' ? +value : -value;
    }

    let max = -Infinity;
    const people = Object.keys(happiness);
    happiness.me = {};
    for (const person of people) {
        happiness[person].me = 0;
        happiness.me[person] = 0;
    }
    people.push('me');
    for (const option of combinations(people)) {
        let total = 0;
        for (const [i, person] of option.entries()) {
            const neighbor = option[(i + 1) % people.length];
            total += happiness[person][neighbor] + happiness[neighbor][person];
        }
        max = Math.max(max, total);
    }

    // < 631
    console.log(max);
}

main();
