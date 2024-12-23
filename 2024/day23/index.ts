import { getExampleInput, getInput, combinations, TupleSet } from '../../utils/index';

async function parse() {
    const input = await getInput();
    const computers = new Map<string, Set<string>>();

    for (const line of input.lines()) {
        const [c1, c2] = [line.slice(0, 2), line.slice(-2)];
        if (!computers.get(c1)) {
            computers.set(c1, new Set());
        }
        if (!computers.get(c2)) {
            computers.set(c2, new Set());
        }

        computers.get(c1)?.add(c2);
        computers.get(c2)?.add(c1);
    }

    return {
        computers,
    };
}

function part1(computers: Map<string, Set<string>>) {
    const p = new TupleSet();
    computers.entries()
        .filter(([c1]) => c1.startsWith('t'))
        .forEach(([c1, cset]) => {
            combinations(cset, 2)
                .filter(([c1, c2]) =>
                    computers.get(c1)?.has(c2)
                )
                .map(c => c.concat(c1))
                .forEach(cs => p.add(cs.sort()));
        });

    console.log(p.size);
}

function part2(computers: Map<string, Set<string>>) {
    const p = new TupleSet();
    computers.entries()
        .filter(([c1]) => c1.startsWith('t'))
        .forEach(([c1, cset]) => {
            for (let i = 2; i <= cset.size; i++) {
                combinations(cset, i)
                    .filter(csset =>
                        csset.every(c1 =>
                            csset.values()
                                .filter(v => v !== c1)
                                .every(c2 => computers.get(c2)?.has(c1))
                        )
                    )
                    .map(c => c.concat(c1))
                    .forEach(cs => p.add(cs.sort()));
            }
        });

    console.log(Array.from(p.values()).sort((a, b) => b.length - a.length)[0].join(','));
}

const { computers } = await parse();

part1(computers);
part2(computers)

