import { getExampleInput, getInput } from '../../utils/index';

const analysis = {
    children: 3,
    cats: n => n > 7,
    samoyeds: 2,
    pomeranians: n => n < 3,
    akitas: 0,
    vizslas: 0,
    goldfish: n => n < 5,
    trees: n => n > 3,
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

        if (specs.some(([spec, v]) => typeof analysis[spec] === 'function' ? !analysis[spec](+v) : analysis[spec] !== +v)) {
            continue;
        }
        sues.push(sue);
    }

    console.log(sues);
}

main();
