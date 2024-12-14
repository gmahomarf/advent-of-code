import { add, getExampleInput, getInput } from '../../utils/index';

type Orbits = Record<string, { satellites: string[], center?: string }>;
async function parse() {
    const input = await getInput()

    const orbits: Orbits = {};

    for (const line of input.lines()) {
        const [k, v] = line.split(')');
        orbits[k] ||= { satellites: [] };
        orbits[k].satellites.push(v);
        (orbits[v] ||= { satellites: [] }).center = k;
    }

    return {
        orbits,
    }
}

function bfsish(orbits: Orbits, start: string) {
    const stack: string[] = orbits[start].satellites.slice();
    const seen = new Set<string>([start]);
    let c = stack.length;

    let p: string | undefined;
    while ((p = stack.shift())) {
        for (const o of orbits[p].satellites) {
            if (!seen.has(o)) {
                c++;
                seen.add(o);
                stack.push(o);
            }
        }
    }

    return c;
}

function bfs(orbits: Orbits, start: string, goal: string) {
    const stack: [string, string[]][] = [[start, []]];
    const seen = new Set<string>([start]);

    let e;
    while ((e = stack.shift())) {
        const [p, path] = e;
        if (p === goal) {
            return path.length - 1;
        }

        for (const sat of orbits[p].satellites) {
            if (!seen.has(sat)) {
                seen.add(sat);
                stack.push([sat, path.concat([p])]);
            }
        }

        if (orbits[p].center && !seen.has(orbits[p].center)) {
            seen.add(orbits[p].center);
            stack.push([orbits[p].center, path.concat(p)]);

        }
    }
}

function part1(orbits: Orbits) {
    console.log(Object.keys(orbits).map(o => bfsish(orbits, o)).reduce(add));
}
function part2(orbits: Orbits) {
    console.log(bfs(orbits, orbits['YOU'].center!, 'SAN'));
}

const { orbits } = await parse();

part1(orbits);
part2(orbits);