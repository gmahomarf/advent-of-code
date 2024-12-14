import { getExampleInput, getInput } from '../../utils/index';
import { intcode, IntcodeProgram } from '../intcode';

async function parse() {
    const input = await getInput();

    return {
        program: input.split(',').map(Number)
    };
}

function part1(program: IntcodeProgram) {
    program[1] = 12;
    program[2] = 2;
    intcode(program).next();

    console.log(program[0]);
}

function part2(base: IntcodeProgram) {
    for (let n = 0; n < 100; n++) {
        for (let v = 0; v < 100; v++) {
            let program = base.slice(0);
            program[1] = n;
            program[2] = v;
            intcode(program).next();
            if (program[0] == 19690720) {
                console.log(n * 100 + v);
                process.exit(0);
            }
        }
    }
}

const { program } = await parse();
part1(program.slice());
part2(program.slice());