import { DirectionArrow, getExampleInput, getInput, Grid, Point, argMin, AdjacentNodeCheck } from '../../utils/index';

const WALL = '#';

async function parse() {
    const input = await getInput();

    const maze = new Grid<string>();
    let start: Point | null = null;
    let end: Point | null = null;
    for (const [y, line] of input.numberedLines()) {
        if (!start) {
            let s = line.indexOf('S');
            if (s !== -1) {
                start = new Point(s, y);
            }
        }
        if (!end) {
            let e = line.indexOf('E');
            if (e !== -1) {
                end = new Point(e, y);
            }
        }
        maze.push(line);
    }

    return {
        maze,
        start: start!,
        end: end!,
    };
}

export function Dijkstra<T extends string>(grid: Grid<T>, start: Point, end: Point): Map<string, number> {
    const dist = new Map<string, number>();
    const queue = new Set<string>();

    grid.forEach((row, y) => {
        row.allIndicesOf('.').forEach(x => {
            const p = new Point(x, y).toString();
            const v = 'V' + p;
            const h = 'H' + p;
            dist.set(v, Infinity);
            dist.set(h, Infinity);
            queue.add(h).add(v);
        });
    });

    dist.set('H' + start.toString(), 0);
    dist.set('V' + start.toString(), 1000);
    dist.set('H' + end.toString(), Infinity);
    dist.set('V' + end.toString(), Infinity);

    queue.add('H' + start.toString()).add('V' + start.toString());
    queue.add('H' + end.toString()).add('V' + end.toString());

    while (queue.size) {
        let [_, [u]] = argMin(k => dist.get(k)!, queue.values().map<[string]>(q => [q]));
        queue.delete(u);

        const [du, ...psu] = u;
        for (const v of getAdjacentNodesWithDir(grid, Point.from(u.slice(1)), du, {
            includeDiagonals: false,
            isAdjacent: (_, n) => n !== WALL
        })) {
            if (queue.has(v)) {
                const [dv, ...psv] = u;
                const alt = dist.get(u)! + (u[0] === v[0] ? 1 : 1001);
                if (alt < dist.get(v)!) {
                    dist.set(v, alt);
                }
            }
        }
    }

    return dist;
}

function getAdjacentNodesWithDir<T extends string>(grid: Grid<T>, point: Point, dir: string, { includeDiagonals, isAdjacent = () => true }: { includeDiagonals: boolean, isAdjacent?: AdjacentNodeCheck<T>; }): string[] {
    const nodes: string[] = [];

    (includeDiagonals ? [
        [-1, -1], [0, -1], [1, -1],
        [-1, 0], /* 0,0 */[1, 0],
        [-1, 1], [0, 1], [1, 1]

    ] : [
        /* -1, -1 */[0, -1], /* 1, -1 */
        [-1, 0],  /* 0,0 */[1, 0],
        /* -1, 1 */[0, 1], /* 1, 1 */
    ]).forEach(([x, y]) => {
        const aNode = point.plus(x, y);
        if (grid.hasPoint(aNode) && isAdjacent(grid.getAt(point), grid.getAt(aNode))) {
            if (dir === 'H') {
                if (point.y === aNode.y) {
                    nodes.push(dir + aNode);
                } else {
                    nodes.push('V' + aNode);
                }
            } else {
                if (point.x === aNode.x) {
                    nodes.push(dir + aNode);
                } else {
                    nodes.push('H' + aNode);
                }

            }
        }
    });

    return nodes;
}


function part1(maze: Grid<string>, start: Point, end: Point) {
    const distances = Dijkstra(maze, start, end);

    console.log(distances.get('V' + end), distances.get('H' + end));
}

const { maze, start, end } = await parse();
part1(maze, start, end);
// part2(maze, start, end);