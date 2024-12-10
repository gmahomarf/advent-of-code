import { getExampleInput, getInput, Grid, Point, DFS, getPathDFS } from '../../utils/index';


async function parse() {
    const input = await getInput();
    const grid = new Grid<string>();
    const starts: Point[] = [];
    for await (const [y, line] of input.numberedLines()) {
        grid.push(line);
        line.allIndicesOf('0').forEach((x) => starts.push(new Point(x, y)));
    }

    return {
        grid,
        starts,
    };
}

function part1(grid: Grid<string>, starts: Point[]) {
    const res = starts.reduce((r, start) => r + DFS(grid, start, {
        all: true,
        includeDiagonals: false,
        isGoal: (v) => v === '9',
        isAdjacent: (n, s) => +s - +n === 1
    }).size, 0)

    console.log(res);
}

function part2(grid: Grid<string>, starts: Point[]) {
    const res = starts.reduce((r, start) => r + getPathDFS(grid, start, {
        all: true,
        includeDiagonals: false,
        isGoal: (v) => v === '9',
        isAdjacent: (v, pav) => +pav - +v === 1
    }).length, 0)

    console.log(res);
}

const { grid, starts } = await parse();
part1(grid, starts);
part2(grid, starts);
