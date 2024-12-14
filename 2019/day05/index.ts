import { getExampleInput, getInput } from '../../utils/index';
import { intcode, IntcodeProgram } from '../intcode';

async function parse() {
    const input = await getInput();

    return {
        program: input.split(',').map(Number)
    };
}

function run(program: IntcodeProgram, ...input: number[]) {
    const a = intcode(program);
    let g = a.next();
    let o;
    while (1) {
        let i = input.shift();
        g = i ? a.next(i) : a.next();
        if (g.done) { break; }
        o = g.value;
    }

    console.log(o);
}

function part1(program: IntcodeProgram) {
    run(program, 1);
}

function part2(program: IntcodeProgram) {
    run(program, 5);
}

const { program } = await parse();

part1(program.slice());
part2(program.slice());