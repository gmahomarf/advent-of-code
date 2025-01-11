import blessed from "blessed";
import { Direction, getInput, Grid, newScreen, Point } from "../../utils";
import { IntcodeComputer } from "../intcode";
import { setTimeout } from "timers/promises";

async function parse() {
    const input = await getInput();

    return {
        program: input.split(',').map(Number)
    };
}

function draw(grid: OtherGrid, timeout: number) {
    const offX = 1;
    const offY = 1;
    const bg = 'white';
    const fg = 'black';
    const [screen, mainContainer] = newScreen(bg, fg);

    blessed.text({
        parent: mainContainer,
        style: {
            bg,
            fg,
        },
        content: 'Distance:',
        left: offX,
        top: offY,
    });
    const distanceBox = blessed.box({
        parent: mainContainer,
        style: {
            bg,
            fg,
            border: {
                bg,
                fg,
            }
        },
        border: "line",
        left: offX,
        top: 1 + offY,
        height: 3,
        width: 10,
        content: '0'
    });

    blessed.text({
        parent: mainContainer,
        style: {
            bg,
            fg,
        },
        left: +distanceBox.width + 3 + offX,
        top: offY,
        content: 'Time:',
    });
    const timeBox = blessed.box({
        parent: mainContainer,
        style: {
            bg,
            fg,
            border: {
                bg,
                fg,
            }
        },
        border: "line",
        height: 3,
        width: 7,
        left: +distanceBox.width + 3 + offX,
        top: 1 + offY,
        content: '0'
    });

    const statusBox = blessed.box({
        parent: mainContainer,
        style: {
            bg,
            fg,
            border: {
                bg,
                fg,
            }
        },
        border: "line",
        left: offX,
        top: +distanceBox.top + +distanceBox.height + 1,
        height: 3,
        width: 45,
        content: ''
    });

    const gridBox = blessed.box({
        parent: mainContainer,
        style: {
            bg,
            fg,
            bold: true,
        },
        shrink: true,
        top: +statusBox.top + +statusBox.height + 1,
        left: offX,
        scrollable: true,
        mouse: true,
        tags: true,
    });

    gridBox.setContent(Grid.prototype.toString.call(grid));
    screen.render();

    let TO = timeout;

    async function redraw() {
        gridBox.setContent(Grid.prototype.toString.call(grid));
        screen.render();
        await setTimeout(TO);
    }

    redraw.distance = async (distance: number) => {
        distanceBox.setContent(distance.toString());
        screen.render();
        await setTimeout();
    };
    redraw.time = async (time: number) => {
        timeBox.setContent(time.toString());
        screen.render();
        await setTimeout();
    };
    redraw.status = async (status: string) => {
        statusBox.setContent(status);
        screen.render();
        await setTimeout();
    };
    redraw.timeout = (tout: number) => {
        TO = tout;
    };

    return redraw;
}

type OtherGrid = string[][] & {
    offX: number,
    offY: number,
    width: number,
    height: number,
};

function updateGrid(grid: OtherGrid, from: Point | null, to: Point, c: string) {
    let toX = to.x + grid.offX;
    if (toX < 0) {
        grid.width++;
        grid.forEach(r => r.unshift(' '));
        grid.offX++;
        toX++;
    } else if (toX >= grid.width) {
        grid.width++;
        grid.forEach(r => r.push(' '));
    }
    let toY = to.y + grid.offY;
    if (toY < 0) {
        grid.height++;
        grid.unshift(new Array(grid.width).fill(' '));
        grid.offY++;
        toY++;
    } else if (toY >= grid.height) {
        grid.height++;
        grid.push(new Array(grid.width).fill(' '));
    }
    const curr = grid[toY][toX];
    if (from) {
        let fromX = from.x + grid.offX;
        let fromY = from.y + grid.offY;
        const fCurr = grid[fromY][fromX];
        fCurr !== END && fCurr !== START && (grid[fromY][fromX] = '.');
    }

    curr !== END && curr !== START && (grid[toY][toX] = c);
}

const MOVES = [1, 4, 2, 3] as const;
const MOVES_INV = ['', 0, 2, 3, 1] as const;
const ONE_EIGHTY = ['', 2, 1, 4, 3] as const;
const MOVES_TO_POINT_MOVEMENT: Record<typeof MOVES[number], Lowercase<Direction>> = {
    1: 'up',
    4: 'right',
    2: 'down',
    3: 'left',
};

const ROBOT = '{red-fg}D{/}';
const WALL = '#';
const START = '{cyan-fg}S{/}';
const END = '{green-bg}{white-fg}E{/}';

function* start(robot: IntcodeComputer): Generator<[Point, string, number], void, void> {
    const stack: { move: typeof MOVES[number], heading: typeof MOVES[number]; }[] = [];
    const pos = new Point();
    const seen = new Set<string>([pos.toString()]);
    let i = 0;
    while (1) {
        const move = MOVES.at(i)!;
        let res;
        while (res = robot.input(move).output()) {
            switch (res) {
                case 1: // MOVED
                    pos[MOVES_TO_POINT_MOVEMENT[move]]();
                    seen.add(pos.toString());
                    stack.push({ move, heading: move });
                    yield [pos.clone(), ROBOT, stack.length];
                    break;
                case 2: // Oxygen
                    pos[MOVES_TO_POINT_MOVEMENT[move]]();
                    seen.add(pos.toString());
                    stack.push({ move, heading: move });
                    yield [pos.clone(), END, stack.length];
            }
        }

        // Wall, rotate or backtrack
        yield [pos.clone()[MOVES_TO_POINT_MOVEMENT[move]](), WALL, stack.length];
        while (1) {
            const last = stack.pop();
            if (!last) {
                return;
            }
            if (last.move === last.heading) { // TURN RIGHT
                i = (MOVES_INV[last.heading] + 1) % 4;
                const newMove = MOVES.at(i)!;
                if (!seen.has(pos.clone()[MOVES_TO_POINT_MOVEMENT[newMove]]().toString())) {
                    stack.push({ ...last, heading: newMove });
                    break;
                }
            }

            const im = MOVES_INV[last.move];
            const ih = MOVES_INV[last.heading];
            if (im === ih - 1 || im === ih + 3) { // TURN AROUND (RIGHT x 2)
                i = MOVES_INV[ONE_EIGHTY[last.heading]];
                const newMove = MOVES.at(i)!;
                if (!seen.has(pos.clone()[MOVES_TO_POINT_MOVEMENT[newMove]]().toString())) {
                    stack.push({ ...last, heading: MOVES.at(i)! });
                    break;
                }
            }

            // Backtrack
            const newMove = ONE_EIGHTY[last.move];
            robot.input(newMove).output(); // Output is irrelevant

            yield [pos[MOVES_TO_POINT_MOVEMENT[newMove]]().clone(), ROBOT, stack.length];
        }
    }
}

function* oxygenate(grid: OtherGrid, oxygenator: Point): Generator<Point[], void, void> {
    const seen = new Set<string>([oxygenator.toString()]);
    let oxygenated: Point[] = [oxygenator];

    while (oxygenated.length) {
        yield oxygenated;
        oxygenated = oxygenated.flatMap(o =>
            [
            /* -1, -1 */[0, -1], /* 1, -1 */
                [-1, 0],  /* 0,0 */[1, 0],
            /* -1, 1 */[0, 1], /* 1, 1 */
            ].map(off => o.plus(off[0], off[1])).filter(adj => grid[adj.y][adj.x] && grid[adj.y][adj.x] !== WALL && !seen.has(adj.toString()))
        );

        oxygenated.forEach(p => seen.add(p.toString()));
    }
}

async function part1(program: number[], animated = false): Promise<[OtherGrid, Point, ReturnType<typeof draw> | undefined]> {
    const robot = new IntcodeComputer(program).start();
    const grid: OtherGrid = new Array(11).fill(1).map(_ => new Array(11).fill(' ')) as OtherGrid;
    grid.offX = 5;
    grid.offY = 5;
    grid.height = grid.width = 11;
    grid[5][5] = START;

    const redraw = animated ? draw(grid, 10) : undefined;
    let pos = new Point();
    let E: Point = pos.clone();
    await redraw?.status('Finding oxygen system...');
    for (const d of start(robot)) {
        if (d[1] === WALL) {
            updateGrid(grid, null, d[0], d[1]);
            await redraw?.();
        } else {
            updateGrid(grid, pos, d[0], d[1]);
            await redraw?.();
            pos = d[0];
            if (d[1] === END) {
                E = d[0];
                await redraw?.distance(d[2]);
                await redraw?.status('Found it! Mapping the rest of the space...');
                if (!animated) {
                    console.log(d[2]);
                }
            }
        }
    }

    return [grid, E.plus(grid.offX, grid.offY), redraw];
}

async function part2(grid: OtherGrid, end: Point, redraw?: ReturnType<typeof draw>) {
    let i = -1;
    redraw?.timeout(25);
    await redraw?.status('Oxygenating the space...');
    for (const oxy of oxygenate(grid, end)) {
        oxy.forEach(o => grid[o.y][o.x] = '{blue-fg}O{/}');
        await redraw?.();
        i++;
    }
    redraw ? redraw.time(i) : console.log(i);
    await redraw?.status('Done!');
}

async function solve(program: number[], animated: boolean) {
    const [grid, E, redraw] = await part1(program, animated);
    await part2(grid, E, redraw);
}

const { program } = await parse();

solve(program, true);