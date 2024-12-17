import { getExampleInput, getInput } from '../../utils/index';

async function parse() {
    const input = await getInput();

    const [registers, program] = input.splitByEmptyLines().toArray();

    return {
        registers: registers.map(r => r.split(': ')[1]).map(BigInt),
        program: program[0].split(': ')[1].split(',').map(BigInt)
    };
}

function _combo(registers: bigint[], operand: number) {
    if (4 <= operand && operand <= 6) {
        return registers[operand - 4];
    }

    return BigInt(operand);
}

function yacomputer(registers: bigint[], program: bigint[], part2 = false) {
    const combo = _combo.bind(null, registers);
    const output: bigint[] = [];

    for (let ip = 0; ip < program.length;) {
        const opcode = program[ip];
        const operand = Number(program[ip + 1]);

        switch (opcode) {
            case 0n:
                registers[0] = registers[0] >> combo(operand);
                ip += 2;
                break;
            case 1n:
                registers[1] ^= BigInt(operand);
                ip += 2;
                break;
            case 2n:
                registers[1] = combo(operand) & 7n;
                ip += 2;
                break;
            case 3n:
                if (registers[0]) {
                    ip = operand;
                } else {
                    ip += 2;
                }
                break;
            case 4n:
                registers[1] ^= registers[2];
                ip += 2;
                break;
            case 5n:
                const o = combo(operand) & 7n;
                if (part2 && BigInt(program[output.length]) !== o) {
                    return [];
                }
                output.push(o);
                ip += 2;
                break;
            case 6n:
                registers[1] = registers[0] >> combo(operand);
                ip += 2;
                break;
            case 7n:
                registers[2] = registers[0] >> combo(operand);
                ip += 2;
                break;
        }
    }

    return output;
}

function part1(registers: bigint[], program: bigint[]) {
    console.log(yacomputer(registers, program).join(','));
}

async function part2(registers: bigint[], program: bigint[]) {
    const len = BigInt(program.length - 1);
    const base = 1n << (len * 3n);

    let width = 1n;
    let opts: bigint[] = [base];
    for (let pos = len; pos >= 0n; pos--) {
        let newopts = opts.flatMap(opt => {
            const o: bigint[] = [];
            for (let e = 0n; e < 8n ** width - 1n; e++) {
                const input = opt + e * (1n << (pos * 3n));
                const idx = Number(pos);
                const idxe = Number(pos + width);

                registers[0] = input;
                const output = yacomputer(registers.slice(), program);
                if (output.slice(idx, idxe).join(',') === program.slice(idx, idxe).join(',')) {
                    o.push(input);
                }
            }

            return o;
        });

        if (!newopts.length) {
            width++;
        } else {
            opts = newopts;
            width = 1n;
        }
    }
    opts.sortInt();
    // if (opts.length > 1) {
    //     console.log(opts.map(o => o.toString(8)));
    // }
    registers[0] = opts[0];
    console.log('0o' + opts[0].toString(8));
    console.log(program.join(','));
    console.log(yacomputer(registers.slice(), program).join(','));
    console.log(opts[0].toString());
}

const { registers, program } = await parse();
part1(registers, program);
part2(registers, program);