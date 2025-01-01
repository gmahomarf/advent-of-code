
import { getExampleInput, getInput, range, argWrap, permutations, argMax } from '../../utils/index';
import { IntcodeComputer, IntcodeProgram } from '../intcode';

async function parse() {
    const input = await getInput();

    return {
        program: input.split(',').map(Number)
    };
}

type Amplifier = IntcodeComputer;

function run(program: IntcodeProgram, init: number, phases: number[]) {
    const amplifiers: Amplifier[] = [
        new IntcodeComputer(program),
        new IntcodeComputer(program),
        new IntcodeComputer(program),
        new IntcodeComputer(program),
        new IntcodeComputer(program),
    ];

    amplifiers.forEach((a, i) => {
        a.start(phases[i]);
    });

    let v: number = init;

    for (const i in phases) {
        v = amplifiers[i].input(v).output()!;
    }

    return v;
}

function run2(program: IntcodeProgram, init: number, phases: number[]) {
    const amplifiers: Amplifier[] = [
        new IntcodeComputer(program),
        new IntcodeComputer(program),
        new IntcodeComputer(program),
        new IntcodeComputer(program),
        new IntcodeComputer(program),
    ];

    amplifiers.forEach((a, i) => {
        a.start(phases[i]);
    });

    let input = init;
    for (let i = 0; ; i = (i + 1) % 5) {
        let o = amplifiers[i].input(input).output();

        if (o === null) {
            break;
        }

        input = o;
    }

    return input;
}

function part1(program: IntcodeProgram) {
    const perms = permutations(range(0, 4));
    const [max] = argMax((phases: number[]) => run(program, 0, phases), argWrap(perms));
    console.log(max);
}

function part2(program: IntcodeProgram) {
    const perms = permutations(range(5, 9));
    const [max] = argMax((phases: number[]) => run2(program, 0, phases), argWrap(perms));
    console.log(max);
}

const { program } = await parse();

part1(program);
part2(program);