import { getExampleInput, getInput, Point, TerminalBlock } from '../../utils/index';
import { IntcodeComputer, IntcodeProgram } from '../intcode';

async function parse() {
    const input = await getInput();

    return {
        program: input.split(',').map(Number)
    };
}

const dirs = ['^', '>', 'v', '<'] as const;

enum Color {
    black,
    white
}

function part1(program: IntcodeProgram) {
    const grid = new Map<string, number>();
    const robot = new IntcodeComputer(program);
    const pos = new Point();

    let d = 0;

    robot.start(Color.black);
    while (1) {
        const color = robot.output();
        if (color == null) {
            break;
        }
        const rot = robot.output();

        d = (d + (rot ? 1 : -1)) % 4;
        grid.set(pos.toString(), color!);

        pos[dirs.at(d)!]();
        robot.input(grid.get(pos.toString()) || Color.black);
    }

    console.log(grid.size);
}
function part2(program: IntcodeProgram) {
    const pointMap = new Map<string, number>();
    const robot = new IntcodeComputer(program);
    const pos = new Point();

    let d = 0;

    robot.start(Color.white);
    let minX = 0,
        minY = 0,
        maxX = 0,
        maxY = 0;
    while (1) {
        const color = robot.output();
        if (color == null) {
            break;
        }
        const rot = robot.output();

        d = (d + (rot ? 1 : -1)) % 4;
        pointMap.set(pos.toString(), color!);

        pos[dirs.at(d)!]();
        robot.input(pointMap.get(pos.toString()) || Color.black);
        maxX = Math.max(pos.x, maxX);
        maxY = Math.max(pos.y, maxY);
        minX = Math.min(pos.x, minX);
        minY = Math.min(pos.y, minY);
    }

    let s = '';
    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            s += pointMap.get(`${x},${y}`) ? TerminalBlock.black : TerminalBlock.white;
        }
        s += '\n';
    }

    console.log(s);
}

const { program } = await parse();

part1(program);
part2(program);
