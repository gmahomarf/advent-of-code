import { getExampleInput, getInput, Grid, Point } from '../../utils/index';

const input = await getInput();

type Antennae = Record<string, Point[]>;
async function parse() {
    const grid = new Grid<string>();

    const antennae: Antennae = {};
    for await (const [y, line] of input.numberedLines()) {
        Array.prototype.forEach.call(line, (c, x) => {
            if (c !== '.') {
                (antennae[c] ??= []).push(new Point(x, y));
            }
        })
        grid.push(line);
    }

    return {
        grid,
        antennae,
    };
}

function findAntinodes(grid: Grid<string>, antennae: Antennae[string], includeAntennas: boolean, limit = 1) {
    const antinodes: Point[] = includeAntennas ? antennae.slice() : [];
    for (let i = 0; i < antennae.length - 1; i++) {
        const a1 = antennae[i];
        for (let j = i + 1; j < antennae.length; j++) {
            const a2 = antennae[j];
            const dx = a1.x - a2.x;
            const dy = a1.y - a2.y;
            for (let n = 0; n < (limit || Infinity); n++) {
                const cdx = dx * (n + 1);
                const cdy = dy * (n + 1);
                const an: Point[] = [a1.plus(cdx, cdy), a2.plus(-cdx, -cdy)]
                    .filter(p => grid.hasPoint(p));
                if (!an.length) {
                    break;
                }

                antinodes.push(...an);
            }
        }
    }
    return antinodes;
}

function logGridAndAntinodes(grid: Grid<string>, nodes: Point[]) {
    const g = grid.clone();
    for (const node of nodes) {
        if (grid[node.y][node.x] === '.') {
            grid.setAt(node, '#');
        }
    }

    console.log(grid.toString());
}

function part1(grid: Grid<string>, antennae: Antennae) {
    const antinodes = Object.keys(antennae).flatMap(a => antennae[a].length > 1 ? findAntinodes(grid, antennae[a], false) : []);

    console.log(new Set(antinodes.map(n => n.toString())).size);
    // logGridAndAntinodes(grid, antinodes);
}

function part2(grid: Grid<string>, antennae: Antennae) {
    const antinodes = Object.keys(antennae).flatMap(a => antennae[a].length > 1 ? findAntinodes(grid, antennae[a], true, 0) : []);

    console.log(new Set(antinodes.map(n => n.toString())).size);
    // logGridAndAntinodes(grid, antinodes);
}

const { grid, antennae } = await parse();

part1(grid, antennae);
part2(grid, antennae);
