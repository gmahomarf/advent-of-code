import { getExampleInput, getInput, add, Point, Grid, DIRECTIONS, BFS } from '../../utils/index';


async function parse() {
    const input = await getInput();
    const grid = new Grid(...input.lines());
    const gardens = new Map<string, Set<string>[]>();

    for (const [p, v] of grid.gridEntries()) {
        if (!gardens.get(v)) {
            gardens.set(v, []);
        }
        const plots = gardens.get(v)!;
        if (!plots.some(g => g.has(p.toString()))) {
            const t = BFS(grid, p, {
                all: true,
                isGoal: g => g === v,
                isAdjacent: (n, a) => n === a,
                includeDiagonals: false,
            })
            plots.push(t);
        }
    }
    return {
        grid,
        gardens
    };
}

function perimeter(grid: Grid<string>, point: Point) {
    const v = grid.getAt(point);
    let p = 0;
    for (const direction of DIRECTIONS) {
        if (v !== grid.getAt(point.plus(direction))) {
            p++;
        }
    }

    return p;
}

function sides(plot: Set<string>) {
    const rows = new Map<number, Point[]>();
    const cols = new Map<number, Point[]>();

    for (const p of plot) {
        const point = Point.from(p);
        rows.set(point.y, (rows.get(point.y) ?? []).concat(point));
        cols.set(point.x, (cols.get(point.x) ?? []).concat(point));
    }

    rows.values().forEach(r => r.sort((a, b) => a.x - b.x))
    cols.values().forEach(c => c.sort((a, b) => a.y - b.y))

    let sideCount = 0;
    for (const [y, row] of rows.entries()) {
        const above = rows.get(y - 1);
        const below = rows.get(y + 1);
        const top = row.filter(p => !above?.some(a => p.x === a.x));
        const bottom = row.filter(p => !below?.some(a => p.x === a.x));
        let px = null;
        for (const pt of top) {
            if (px === null || px !== pt.x - 1) {
                sideCount++
            }
            px = pt.x;
        }

        px = null;
        for (const pb of bottom) {
            if (px === null || px !== pb.x - 1) {
                sideCount++
            }
            px = pb.x;
        }
    }

    for (const [x, col] of cols.entries()) {
        const before = cols.get(x - 1);
        const after = cols.get(x + 1);
        const left = col.filter(p => !before?.some(a => p.y === a.y));
        const right = col.filter(p => !after?.some(a => p.y === a.y));
        let py = null;
        for (const pl of left) {
            if (py === null || py !== pl.y - 1) {
                sideCount++
            }
            py = pl.y;
        }

        py = null;
        for (const pr of right) {
            if (py === null || py !== pr.y - 1) {
                sideCount++
            }
            py = pr.y;
        }
    }

    return sideCount;
}

function part1(grid: Grid<string>, gardens: Map<string, Set<string>[]>) {
    let t = 0;
    for (const plots of gardens.values()) {
        for (const plot of plots) {
            const totalPerimeter = plot.values().reduce((s, p) => s + perimeter(grid, Point.from(p)), 0);
            t += totalPerimeter * plot.size;
        }
    }

    console.log(t);
}

function part2(gardens: Map<string, Set<string>[]>) {
    let t = 0;
    for (const plots of gardens.values()) {
        for (const plot of plots) {
            const sideCount = sides(plot);
            t += sideCount * plot.size;
        }
    }

    console.log(t);
}

const { grid, gardens } = await parse();
part1(grid, gardens);
part2(gardens);
