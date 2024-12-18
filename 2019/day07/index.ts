import { getExampleInput, getInput, range, argMax, argWrap } from '../../utils/index';
import { intcode, IntcodeProgram } from '../intcode';

async function parse() {
    const input = await getInput();

    return {
        program: input.split(',').map(Number)
    };
}

type Amplifier = ReturnType<typeof intcode>;

function run(program: IntcodeProgram, init: number, phases: number[]) {
    const amplifiers: Amplifier[] = [
        intcode(program.slice()),
        intcode(program.slice()),
        intcode(program.slice()),
        intcode(program.slice()),
        intcode(program.slice()),
    ];

    amplifiers.forEach((a, i) => {
        a.next();
        a.next(phases[i]);
    });

    return phases.reduce((inp, _p, i) => amplifiers[i].next(inp).value!, init);
}

function run2(program: IntcodeProgram, init: number, phases: number[]) {
    const amplifiers: Amplifier[] = [
        intcode(program.slice()),
        intcode(program.slice()),
        intcode(program.slice()),
        intcode(program.slice()),
        intcode(program.slice()),
    ];

    amplifiers.forEach((a, i) => {
        a.next();
        a.next(phases[i]);
    });

    let input = init;
    for (let i = 0; ; i = (i + 1) % 5) {
        let o = amplifiers[i].next(input);

        if (Number.isNaN(o.value)) {
            o = amplifiers[i].next(input);
        }

        if (o.done) {
            break;
        }

        input = o.value;
    }

    return input;
}

function part1(program: IntcodeProgram) {
    const perms = range(0, 4).permutations();
    const [max, maxArg] = argMax((phases: number[]) => run(program, 0, phases), argWrap(perms));
    console.log(max, maxArg);
}

function part2(program: IntcodeProgram) {
    const perms = range(5, 9).permutations();
    const [max, maxArg] = argMax((phases: number[]) => run2(program, 0, phases), argWrap(perms));
    console.log(max, maxArg);
}

const { program } = await parse();

part1(program);
part2(program);