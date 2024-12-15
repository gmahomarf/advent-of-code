import { DirectionArrow, getExampleInput, getInput, Grid, Point } from '../../utils/index';

const BOX = 'O';
const ROBOT = '@';
const BOX1 = '[';
const BOX2 = ']';
const WALL = '#';
const EMPTY = '.';

async function parse() {
    const input = await getInput();
    const [wh, moves] = input.splitByEmptyLines();

    let start: Point;
    for (const [y, line] of wh.entries()) {
        let x = line.indexOf(ROBOT);
        if (x !== -1) {
            start = new Point(x, y);
            break;
        }
    }

    return {
        grid: new Grid(...wh.map(w => w.split(''))),
        moves: moves.join(''),
        start: start!,
    };
}

function moveH(grid: Grid<string[]>, dir: DirectionArrow, p: Point, np: Point) {
    const row = grid.rows[p.y];
    const toMove: Point[] = [np.clone()];

    const [step, limit] = dir === DirectionArrow.Right ? [1, grid.width] : [-1, -1];
    for (let x = np.x + step; x !== limit; x += step) {
        const v = row[x];
        if (v === WALL) {
            break;
        }
        if (v === EMPTY) {
            toMove.forEach(tm => {
                grid.setAt(tm.plus(step, 0), grid.getAt(tm));
                grid.setAt(tm, EMPTY);
            });
            grid.setAt(np, ROBOT);
            grid.setAt(p, EMPTY);
            return np;
        }

        toMove.unshift(new Point(x, np.y));
    }
    return p;
}

function tryMove(grid: Grid<string[]>, p: Point, dir: DirectionArrow): Point {
    const np = p.clone()[dir]();
    const n = grid.getAt(np);
    if (n === WALL) {
        return p;
    }
    if (n === EMPTY) {
        grid.setAt(np, ROBOT);
        grid.setAt(p, EMPTY);
        return np;
    }

    if (dir === DirectionArrow.Right || dir === DirectionArrow.Left) {
        return moveH(grid, dir, p, np);
    } else {
        const toMove: Point[] = [np.clone()];

        const [step, limit] = dir === DirectionArrow.Down ? [1, grid.height] : [-1, -1];
        for (let y = np.y + step; y !== limit; y += step) {
            const v = grid[y][np.x];
            if (v === WALL) {
                break;
            }
            if (v === EMPTY) {
                toMove.forEach(tm => {
                    grid.setAt(tm[dir](), BOX);
                });
                grid.setAt(np, ROBOT);
                grid.setAt(p, EMPTY);
                return np;
            }

            toMove.unshift(new Point(np.x, y));
        }
    }

    return p;
}

type Box = [Point, Point];
function tryMove2(grid: Grid<string[]>, p: Point, dir: DirectionArrow): Point {
    const np = p.clone()[dir]();
    const n = grid.getAt(np);
    if (n === WALL) {
        return p;
    }
    if (n === EMPTY) {
        grid.setAt(np, ROBOT);
        grid.setAt(p, EMPTY);
        return np;
    }

    if (dir === DirectionArrow.Right || dir === DirectionArrow.Left) {
        return moveH(grid, dir, p, np);
    } else {
        const toMove: Box[][] = [
            [n === BOX1 ? [np.clone(), np.plus(1, 0)] : [np.plus(-1, 0), np.clone()]]
        ];

        const [step, limit] = dir === DirectionArrow.Down ? [1, grid.height] : [-1, -1];
        for (let y = np.y + step; y !== limit; y += step) {
            const prevBoxes = toMove[0];
            const toCheck = prevBoxes.flatMap<Point>(box => [
                box[0].plus(0, step),
                box[1].plus(0, step),
            ]);
            if (toCheck.some(p => grid.getAt(p) === WALL)) {
                break;
            }
            if (toCheck.every(p => grid.getAt(p) === EMPTY)) {
                toMove.forEach(tm => {
                    tm.forEach(b => {
                        grid.setAt(b[0].plus(0, step), grid.getAt(b[0]));
                        grid.setAt(b[1].plus(0, step), grid.getAt(b[1]));

                        grid.setAt(b[0], EMPTY);
                        grid.setAt(b[1], EMPTY);
                    });
                });
                grid.setAt(np, ROBOT);
                grid.setAt(p, EMPTY);
                return np;
            }

            const newBoxes: Box[] = [];
            toCheck.forEach((p, i) => {
                const v = grid.getAt(p);
                if (v === EMPTY) {
                    return;
                }
                if (i % 2) {
                    if (v === BOX1) {
                        newBoxes.push([p, p.plus(1, 0)]);
                    }

                } else {
                    if (v === BOX2) {
                        if (!newBoxes.at(-1)?.[1].equals(p)) {
                            newBoxes.push([p.plus(-1, 0), p]);
                        }
                    } else {
                        newBoxes.push([p, p.plus(1, 0)]);
                    }
                }
            });

            toMove.unshift(newBoxes);
        }
    }

    return p;
}

function part1(grid: Grid<string[]>, start: Point, moves: string) {
    let p = start.clone();
    for (const m of moves) {
        p = tryMove(grid, p, m as DirectionArrow);
    }

    console.log(grid.map<[number, number[]]>((row, y) => [y, row.allIndicesOf(BOX).toArray()]).reduce((s, row) => {
        let [y, boxes] = row;

        return s + boxes.reduce((t, r) => t + 100 * y + r, 0);
    }, 0));
}

async function part2(grid: Grid<string[]>, start: Point, moves: string) {
    const g = new Grid(...grid.map(row =>
        row.flatMap(p => p === ROBOT || p === EMPTY ? [p, EMPTY] : p === BOX ? [BOX1, BOX2] : [WALL, WALL])
    ));

    // let boxes = g.reduce((s, r) => s + r.count(v => v === BOX1), 0);
    // let c = 0;
    let p = new Point(start.x * 2, start.y);
    for (const m of moves) {
        p = tryMove2(g, p, m as DirectionArrow);
        // let nboxes = g.reduce((s, r) => s + r.count(v => v === BOX1), 0);
        // if (boxes !== nboxes) {
        //     console.log('BOX DIFF! %s => %s, iteration %s', boxes, nboxes, c);
        // }
        // boxes = nboxes;
        // c++;
    }

    const answer = g.map<[number, number[]]>((row, y) => [y, row.allIndicesOf(BOX1).toArray()]).reduce((s, row) => {
        let [y, boxes] = row;

        return s + boxes.reduce((t, r) => t + 100 * y + r, 0);
    }, 0);

    console.log(answer);
}

const { grid, moves, start } = await parse();

part1(grid.clone(), start, moves);
part2(grid, start, moves);