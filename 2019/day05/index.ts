import { getExampleInput, getInput } from '../../utils/index';
import { IntcodeComputer, IntcodeProgram } from '../intcode';

async function parse() {
    const input = await getInput();

    return {
        program: input.split(',').map(Number)
    };
}

function run(program: IntcodeProgram, ...input: number[]) {
    const computer = new IntcodeComputer(program).start(...input);
    let r;
    let o;
    while ((o = computer.output()) !== null) {
        r = o;
    }

    console.log(r);
}

function part1(program: IntcodeProgram) {
    run(program, 1);
}

function part2(program: IntcodeProgram) {
    run(program, 5);
}

const { program } = await parse();

part1(program);
part2(program);