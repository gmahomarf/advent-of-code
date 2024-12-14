export type IntcodeProgram = number[];
export function* intcode(program: number[]/* , ...inputs: number[] */): Generator<number, null, number> {
    // const output: number[] = [];
    for (let ip = 0; ;) {
        let i = program[ip].toString().padStart(5, '0');
        let [pm3, pm2, pm1, _, op] = i.split('').map(Number);
        // let op = +i.slice(-2);
        // const params = getParameters(program, ip, pms);
        let p1, p2;
        switch (op) {
            case 1:
            case 2:
                [p1, p2] = getParameters(program, ip, [pm1, pm2]);
                ops[op](program, program[ip + 3], p1, p2);
                ip += 4;
                break;
            case 3:
                program[program[ip + 1]] = yield NaN;
                ip += 2;
                break;
            case 4:
                // output.push(program[program[ip + 1]]);
                yield program[program[ip + 1]];
                ip += 2;
                break;
            case 5:
            case 6:
                [p1, p2] = getParameters(program, ip, [pm1, pm2]);
                ip = ops[op](ip, p1, p2);
                break;
            case 7:
            case 8:
                [p1, p2] = getParameters(program, ip, [pm1, pm2]);
                ops[op](program, program[ip + 3], p1, p2);
                ip += 4;
                break;
            default:
                return null;
        }
    }
}

enum Mode {
    Position,
    Immediate,
}

type NonEmptyTuple<T = unknown> = [T, ...T[]];
function getParameters<T extends NonEmptyTuple<number>>(program: number[], ip: number, pms: T): T {
    return pms.map((pm, i) => pm == Mode.Immediate ? program[ip + i + 1] : program[program[ip + i + 1]]) as T;
}

const ops = {
    [1](program: number[], output: number, p1: number, p2: number) {
        program[output] = p1 + p2;
    },
    [2](program: number[], output: number, p1: number, p2: number) {
        program[output] = p1 * p2;
    },
    [5](ip: number, p1: number, p2: number) {
        return p1 ? p2 : (ip + 3);
    },
    [6](ip: number, p1: number, p2: number) {
        return p1 ? (ip + 3) : p2;
    },
    [7](program: number[], output: number, p1: number, p2: number) {
        program[output] = p1 < p2 ? 1 : 0;
    },
    [8](program: number[], output: number, p1: number, p2: number) {
        program[output] = p1 === p2 ? 1 : 0;
    },
};