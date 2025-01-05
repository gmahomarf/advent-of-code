import { getInput, Grid, Point, TerminalBlock } from '../../utils/index';
import { IntcodeComputer } from '../intcode';
import blessed from 'blessed';

const EMPTY = 0;
const WALL = 1;
const BLOCK = 2;
const PADDLE = 3;
const BALL = 4;

type JoystickPosition = -1 | 0 | 1;

const TILE_MAP: Record<number, string> = {
    [EMPTY]: ' ',
    [WALL]: '#',
    [BLOCK]: TerminalBlock.white,
    [PADDLE]: '-',
    [BALL]: 'o',
};

async function parse() {
    const input = await getInput();

    return {
        program: input.split(',').map(Number),
    };
}

function getArcade(program: number[]) {
    let minX = 0,
        maxX = 0,
        minY = 0,
        maxY = 0;

    const arcade = new IntcodeComputer(program).start();
    const board = new Map<string, string>();
    while (1) {
        const x = arcade.output();
        if (x === null) {
            break;
        }
        const y = arcade.output()!;

        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);

        const tile = arcade.output()!;
        if (x === -1 && y === 0) {
            break;
        } else {
            board.set(`${x},${y}`, TILE_MAP[tile]);
        }
    }
    return {
        step: function* () {
            while (1) {
                let x;
                try {
                    x = arcade.output();
                } catch {
                    const input = yield;
                    if (input === undefined) {
                        continue;
                    }
                    arcade.input(input);
                    x = arcade.output();
                }
                if (x === null) {
                    return;
                }
                const y = arcade.output()!;
                const tile = arcade.output()!;

                yield [x, y, tile] as [number, number, number];
            }
        }() as Generator<[number, number, number] | undefined, void, JoystickPosition>,
        height: maxY - minY + 1,
        width: maxX - minX + 1,
        board,
    };
}

function playAnimated(board: Map<string, string>, width: number, height: number, step: Generator<[number, number, number] | undefined, void, JoystickPosition>) {
    let score = 0;
    const grid = new Grid(...new Array(height).fill(1).map(_ => new Array(width).fill(' ')));
    const screen = blessed.screen({
        smartCSR: true,
    });

    screen.title = 'Arcade';

    const mainContainer = blessed.box({
        scrollable: true,
        mouse: true,
        parent: screen,
        style: {
            bg: 'black',
            fg: 'white',
        },
    });

    // Instructions box
    blessed.box({
        parent: mainContainer,
        content: 'q: quit\ns: start',
        shrink: true,
        left: width + 3,
        top: 1,
        style: {
            bg: 'black',
            fg: 'white'
        }
    });

    const boardBox = blessed.box({
        parent: mainContainer,
        style: {
            bg: 'black',
            fg: 'white',
        },
        width,
        height,
        left: 1,
        top: 1,
        tags: true
    });

    let ball: Point | null = null;
    let paddle: Point | null = null;
    board.forEach((v, k) => {
        const p = Point.from(k);
        if (v === TILE_MAP[BALL]) {
            ball = p;
        } else if (v === TILE_MAP[PADDLE]) {
            paddle = p;
        }
        grid.setAt(p, v === TILE_MAP[BLOCK] ? `{${['red', 'blue', 'green', '#FFCC00'][(Math.random() * 4) | 0]}-fg}${v}{/}` : v);
    });

    const scoreBox = blessed.box({
        left: width + 3,
        top: 3,
        parent: mainContainer,
        scrollable: true,
        valign: 'middle',
        height: 5,
        width: 10,
        content: 'Score:\n0',
        mouse: true,
        style: {
            fg: 'white',
            bg: 'black',
            border: {
                fg: 'white',
                bg: 'black'
            },
        },
        border: {
            type: 'line',
            bg: 0,
            fg: 0,
        },
        scrollbar: {
            style: {
                fg: 'red'
            },
            track: {
                fg: 'red',
                bg: 'lightgrey'
            }
        }
    });

    screen.key(['q', 'S-q'], (_, ev) => {
        screen.destroy();
        clearTimeout(to);
        to.unref();
    });

    const TIMEOUT = 5;

    screen.onceKey('s', (_, ev) => {
        to = setTimeout(stepOnce, TIMEOUT);
    });

    boardBox.setContent(grid.toString());
    screen.render();
    let to: NodeJS.Timeout;

    const stepOnce = () => {
        let x, y, tile;
        let res;
        do {
            res = step.next();
            if (res.done) {
                return;
            }
            if (!res.value) {
                const mv = Math.sign(ball!.minus(paddle!).x) as JoystickPosition;
                res = step.next(mv);
            }

            [x, y, tile] = res.value!;
            if (x === -1 && y === 0) {
                score = tile;
                scoreBox.setLine(1, score.toString());
            } else {
                if (tile === BALL) {
                    ball = new Point(x, y);
                } else if (tile === PADDLE) {
                    paddle = new Point(x, y);
                }
                grid[y][x] = TILE_MAP[tile];
                boardBox.setContent(grid.toString());
            }
            screen.render();
        } while (tile !== BALL);
        to = setTimeout(stepOnce, TIMEOUT);
    };
}

function play(board: Map<string, string>, width: number, height: number, step: Generator<[number, number, number] | undefined, void, JoystickPosition>) {
    let score = 0;
    let ball: Point;
    let paddle: Point;
    board.forEach((v, k) => {
        const p = Point.from(k);
        if (v === TILE_MAP[BALL]) {
            ball = p;
        } else if (v === TILE_MAP[PADDLE]) {
            paddle = p;
        }
    });

    while (1) {
        let x, y, tile;
        let res;
        do {
            res = step.next();
            if (res.done) {
                console.log(score);
                return;
            }
            if (!res.value) {
                const mv = Math.sign(ball!.minus(paddle!).x) as JoystickPosition;
                res = step.next(mv);
            }
            [x, y, tile] = res.value!;
            if (x === -1 && y === 0) {
                score = tile;
            } else {
                if (tile === BALL) {
                    ball = new Point(x, y);
                } else if (tile === PADDLE) {
                    paddle = new Point(x, y);
                }
            }
        } while (tile !== BALL);
    }
}

function part1(program: number[]) {
    const { board } = getArcade(program);

    console.log(board.values().reduce((s, t) => s + +(t === TILE_MAP[BLOCK]), 0));
}

function part2(program: number[]) {
    program[0] = 2;
    const { board, height, step, width } = getArcade(program);
    playAnimated(board, width, height, step);
}
const { program } = await parse();

part1(program);
part2(program);

