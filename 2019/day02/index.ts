import { getExampleInput, getInput } from '../../utils/index';
import { IntcodeComputer, IntcodeProgram } from '../intcode';

async function parse() {
    const input = await getInput();

    return {
        program: input.split(',').map(Number)
    };
}

function part1(program: IntcodeProgram) {
    program[1] = 12;
    program[2] = 2;
    const comp = new IntcodeComputer(program).start();

    console.log(comp.memoryAt(0));
}

function part2(program: IntcodeProgram) {
    for (let n = 0; n < 100; n++) {
        for (let v = 0; v < 100; v++) {
            ;
            program[1] = n;
            program[2] = v;
            const comp = new IntcodeComputer(program).start();
            if (comp.memoryAt(0) == 19690720) {
                console.log(n * 100 + v);
                process.exit(0);
            }
        }
    }
}

const { program } = await parse();
part1(program);
part2(program);