import { BFS, getExampleInput, getInput, getPathBFS, Grid, Point } from '../../utils/index';

async function parse() {
    const input = await getInput();
    const N = 71;
    const grid = new Grid<string>(N).fill('.'.repeat(N));
    const nBytes = 1024;
    // const input = await getExampleInput();
    // const N = 7;
    // const grid = new Grid<string>(N).fill('.'.repeat(N));
    // const nBytes = 12;

    return {
        bytes: new Set(input.lines()),
        grid,
        nBytes,
    };
}

function part1(grid: Grid<string>, bytes: Set<string>, nBytes: number) {
    const e = grid.width - 1;
    const b = new Set(bytes.values().take(nBytes));
    const x = getPathBFS(grid, new Point(0, 0), {
        includeDiagonals: false,
        isGoal: (_, p) => p.x === e && p.y === e,
        isAdjacent: (_, _v, _p, p) => !b.has(p.toString())
    });

    console.log(x.length - 1);
}

function part2(grid: Grid<string>, bytes: Set<string>, nBytes: number) {
    const b = new Set(bytes.values().take(nBytes));
    const p = Array.from(bytes.values().drop(nBytes));

    console.log(binarySearchish(grid, b, p));

}

function binarySearchish(grid: Grid<string>, bytes: Set<string>, pendingBytes: string[]) {
    let left = 0;
    let right = pendingBytes.length - 1;
    const end = grid.width - 1;
    while (1) {
        const mid = ((left + right) / 2) | 0;
        const fallingDeath = new Set(Array.from(bytes).concat(pendingBytes.slice(0, mid)));
        const path = BFS(grid, new Point(0, 0), {
            includeDiagonals: false,
            isGoal: (_, p) => p.x === end && p.y === end,
            isAdjacent: (_, _v, _p, p) => !fallingDeath.has(p.toString())
        });

        if (left === right) {
            if (BFS(grid, new Point(0, 0), {
                includeDiagonals: false,
                isGoal: (_, p) => p.x === end && p.y === end,
                isAdjacent: (_, _v, _p, p) => !fallingDeath.has(p.toString())
            })) {
                return [mid, pendingBytes[mid]];
            }

            return [mid - 1, pendingBytes[mid - 1]];
        } else if (path)
            left = mid + 1;
        else
            right = mid - 1;
    }
    return 'WTF IS GOING ON!?!?!';
}

const { bytes, grid, nBytes } = await parse();
part1(grid, bytes, nBytes);
part2(grid, bytes, nBytes);