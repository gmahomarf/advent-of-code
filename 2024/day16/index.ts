import { getExampleInput, getInput, Grid, Point, argMin, AdjacentNodeCheck, argWrap } from '../../utils/index';

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
        let [_, [u]] = argMin((k: string) => dist.get(k)!, argWrap(queue));
        queue.delete(u);

        const [du] = u;
        for (const [v, score] of getAdjacentNodesWithScore(grid, Point.from(u.slice(1)), du, {
            includeDiagonals: false,
            isAdjacent: (_, n) => n !== WALL
        })) {
            if (queue.has(v)) {
                const alt = dist.get(u)! + score;
                if (alt < dist.get(v)!) {
                    dist.set(v, alt);
                }
            }
        }
    }

    return dist;
}

function getAdjacentNodesWithScore<T extends string>(grid: Grid<T>, point: Point, dir: string, { isAdjacent = () => true }: { includeDiagonals: boolean, isAdjacent?: AdjacentNodeCheck<T>; }): [string, number][] {
    const nodes: [string, number][] = [];

    (dir === 'V' ?
        [[0, -1], [0, 1]] :
        [[-1, 0], [1, 0]]
    ).forEach(([x, y]) => {
        const aNode = point.plus(x, y);
        if (grid.hasPoint(aNode) && isAdjacent(grid.getAt(point), grid.getAt(aNode), point, aNode)) {
            nodes.push([dir + aNode, 1]);
        }
    });

    let d = dir === 'V' ? 'H' : 'V';
    nodes.push([d + point, 1000]);

    return nodes;
}


function part1(maze: Grid<string>, start: Point, end: Point) {
    const distances = Dijkstra(maze, start, end);

    console.log(distances.get('V' + end), distances.get('H' + end));

    return distances;
}

function part2(maze: Grid<string>, start: Point, end: Point, distances: Map<string, number>) {
    const seats = new Set<string>();
    let stack: [string, number][] = [['V' + end, 0]];
    while (stack.length) {
        const [curr, score] = stack.shift()!;
        const currD = distances.getOrDefault(curr, Infinity);
        let d = curr[0];
        let t = Point.from(curr.slice(1));
        const adjNodes = getAdjacentNodesWithScore(maze, t, d, {
            includeDiagonals: false,
            isAdjacent: (_, v, _p, p) => v !== WALL
        });

        adjNodes.filter(an => distances.getOrDefault(an[0], Infinity) === currD - an[1]).forEach(nn => {
            stack.push([nn[0], nn[1] + score]);
            seats.add(nn[0].slice(1));
        });
    }

    console.log(seats.size + 1);
}

const { maze, start, end } = await parse();

const distances = part1(maze, start, end);
part2(maze, start, end, distances);