import { getExampleInput, getInput } from '../../utils/index.mjs';

const analysis = {
    children: 3,
    cats: 7,
    samoyeds: 2,
    pomeranians: 3,
    akitas: 0,
    vizslas: 0,
    goldfish: 5,
    trees: 3,
    cars: 2,
    perfumes: 1,
};

async function main() {
    const input = await getInput();

    const sues = [];
    for (const line of input.lines()) {
        const split = line.indexOf(':');
        const sue = line.slice(0, split).slice(4);
        const specs = line.slice(split + 2).split(', ').map(p => p.split(': '));

        if (specs.some(([spec, v]) => analysis[spec] !== +v)) {
            continue;
        }
        sues.push(sue);
    }

    console.log(sues);
}

main();
