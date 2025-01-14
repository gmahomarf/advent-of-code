import { DirectionArrow, getInput, Point, POINT_TO_ARROW_MAP } from "../../utils";
import { IntcodeComputer } from "../intcode";

async function parse() {
    const input = await getInput();

    return {
        program: input.split(',').map(Number)
    };
}

function part1(program: number[]) {
    const cameras = new IntcodeComputer(program).start();
    let o;
    let s = '';
    while (o = cameras.output()) {
        s += String.fromCharCode(o);
    }

    const l = s.indexOf('\n');

    const wr = '[#\\^>v<]';
    const re = new RegExp(`${wr}[\\w\\W]{${l - 1}}${wr}${wr}${wr}[\\w\\W]{${l - 1}}${wr}`, 'g');

    let e;
    let sum = 0;
    let ri = Array.prototype.findIndex.call(s, v => ['<', 'v', '>', '^'].includes(v));
    const robot = new Point(ri % (l + 1), (ri / (l + 1)) | 0);
    const grid = s.split('\n').map(r => r.split(''));
    while (e = re.exec(s)) {
        re.lastIndex = e.index + 1;
        const p = e.index + l + 1;
        const x = p % (l + 1),
            y = (p / (l + 1)) | 0;
        grid[y][x];
        sum += x * y;
    }

    console.log(sum);

    return {
        robot,
        grid,
    };
}

const ARROW_ROTATION_MAP: Record<string, Record<string, string>> = {
    '<': {
        '^': 'R',
        'v': 'L',
    },
    '>': {
        'v': 'R',
        '^': 'L',
    },
    'v': {
        '<': 'R',
        '>': 'L',
    },
    '^': {
        '>': 'R',
        '<': 'L',
    }
};

function part2(program: number[], grid: string[][], robot: Point) {
    const computer = new IntcodeComputer([2].concat(program.slice(1))).start();
    const p = robot.clone();
    let currentDir = grid[robot.y][robot.x] as DirectionArrow;
    const [next] = p.getAdjacent().filter(a => grid[a.y][a.x] === '#');

    let dp = next.minus(p);
    let dir = POINT_TO_ARROW_MAP[dp.toString()];

    const path: string[] = [];

    if (dir !== currentDir) {
        path.push(ARROW_ROTATION_MAP[currentDir][dir] ?? 'R,R');
    }

    currentDir = dir;

    while (1) {
        let c = 0;
        for (c = 1; ; c++) {
            p[dir]();
            const n = p.plus(dp);
            if (grid[n.y]?.[n.x] !== '#') {
                break;
            }
        }
        path.push(c.toString());
        const [next] = p.getAdjacent().filter(a => (dp.x && a.x === p.x || dp.y && a.y === p.y) && grid[a.y]?.[a.x] === '#');
        if (!next) {
            break;
        }
        dp = next.minus(p);
        dir = POINT_TO_ARROW_MAP[dp.toString()];
        const r = ARROW_ROTATION_MAP[currentDir][dir];
        if (!r) {
            throw new Error('WTF?'); // Should not happen
        }

        path.push(r);
        currentDir = dir;

    }

    let A, B, C;
    const main = path.join(',').replace(/^((?:[LR]|[0-9]*)(?:,(?:[LR]|[0-9]*)){0,9})(?:,\1)*?,((?:[LR]|[0-9]*)(?:,(?:[LR]|[0-9]*)){0,9})(?:,(?:\1|\2))*?,((?:[LR]|[0-9]*)(?:,(?:[LR]|[0-9]*)){0,9})(?:,(?:\1|\2|\3))*$/, (s, a, b, c) => {
        A = a;
        B = b;
        C = c;

        return s
            .replaceAll(A, 'A')
            .replaceAll(B, 'B')
            .replaceAll(C, 'C');
    });

    computer.input(
        // @ts-expect-error
        ...toAsciiArray(main + '\n'),
        ...toAsciiArray(A + '\n'),
        ...toAsciiArray(B + '\n'),
        ...toAsciiArray(C + '\n'),
        ...toAsciiArray('n\n')
    );

    let o, r;
    while (o = computer.output()) {
        r = o;
    }
    console.log(r);
}

function toAsciiArray(s: string): number[] {
    return Iterator.from(s).map(c => c.charCodeAt(0)).toArray();
}

const { program } = await parse();

const { grid, robot } = part1(program);
part2(program, grid, robot);

