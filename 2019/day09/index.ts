import { getExampleInput, getInput, range } from '../../utils/index';
import { IntcodeComputer, IntcodeProgram } from '../intcode';

async function parse() {
    const input = await getInput();

    return {
        program: input.split(',').map(Number)
    };
}

function boost(program: IntcodeProgram, ...input: number[]) {
    const computer = new IntcodeComputer(program).start(...input);
    let o = [];
    while (1) {
        const out = computer.output();
        if (out === null) {
            break;
        }
        o.push(out);
    }

    // console.log(program.join(','));
    console.log(o.join(','));
}

const { program } = await parse();

boost(program, 1);
boost(program, 2);
