enum Mode {
    Position,
    Immediate,
    Relative,
}
type Tuple<T = unknown> = [T, ...T[]] | [];

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

const kIntcodeOk = Symbol.for('kIntcodeOk');
const kIntcodeError = Symbol.for('kIntcodeError');
const kIntcodeNeedsInput = Symbol.for('kIntcodeNeedsInput');

type IntcodeExitStatus = typeof kIntcodeOk | typeof kIntcodeError;
type IntcodeMessage = typeof kIntcodeNeedsInput;

export type IntcodeProgram = number[];
export class IntcodeComputer {
    #relativeBase = 0;
    #memory: number[];
    #state?: Generator<number | IntcodeMessage, IntcodeExitStatus, number>;
    #inputs: number[] = [];
    #outputs: number[] = [];
    #started: boolean = false;
    #ended: boolean = false;
    #lastMessage: number | IntcodeMessage | null = null;
    #ip: number = 0;

    constructor(program: IntcodeProgram) {
        this.#memory = program.slice();
    }

    private get ip() {
        return this.#ip;
    }

    memoryAt(n: number) {
        return this.#memory.at(n) ?? 0;
    }

    start(...inputs: number[]): this {
        if (this.#started) {
            return this;
        }

        if (inputs.length) {
            this.#inputs.push.apply(this.#inputs, inputs);
        }

        this.#state = this.#start();
        this.#started = true;

        return this.#continue();
    }

    output(): number | null {
        if (!this.#outputs.length) {
            if (this.#lastMessage === kIntcodeNeedsInput) {
                throw new Error('Input required');
            }
            this.#continue();
            const msg = this.#lastMessage;
            if (msg === null) {
                return null;
            }
        }

        return this.#outputs.shift()!;
    }

    input(...inputs: [number, ...number[]]): this {
        this.#inputs.push.apply(this.#inputs, inputs);
        return this.#continue();
    }

    #step(input?: number): this {
        if (!this.#state || this.#ended) {
            return this;
        }

        const msg = input !== undefined ? this.#state.next(input) : this.#state.next();
        if (msg.done) {
            this.#lastMessage = null;
            this.#ended = true;
            return this;
        }

        if (typeof msg.value === 'number') {
            this.#outputs.push(msg.value);
        }

        this.#lastMessage = msg.value;
        return this;
    }

    #continue(): this {
        if (!this.#started || this.#ended) {
            return this;
        }
        if (this.#lastMessage === kIntcodeNeedsInput) {
            if (!this.#inputs.length) {
                return this;
            }

            return this.#step(this.#inputs.shift()).#continue();
        }

        return this.#step().#continue();
    }

    *#start(): Generator<number | IntcodeMessage, IntcodeExitStatus, number> {
        for (this.#ip = 0; ;) {
            let i = this.memoryAt(this.#ip).toString().padStart(5, '0');
            let [pm3, pm2, pm1] = i.split('').map(Number);
            let op = +i.slice(-2);
            let p1: number, p2: number, p3: number;
            switch (op) {
                case 1:
                case 2:
                    [p1, p2, p3] = this.#getParameters([pm1, pm2], [pm3]);
                    ops[op](this.#memory, p3, p1, p2);
                    this.#ip += 4;
                    break;
                case 3:
                    [p1] = this.#getParameters([], [pm1]);
                    this.#memory[p1] = (yield kIntcodeNeedsInput);
                    this.#ip += 2;
                    break;
                case 4:
                    [p1] = this.#getParameters([pm1], []);
                    yield p1;
                    this.#ip += 2;
                    break;
                case 5:
                case 6:
                    [p1, p2] = this.#getParameters([pm1, pm2], []);
                    this.#ip = ops[op](this.#ip, p1, p2);
                    break;
                case 7:
                case 8:
                    [p1, p2, p3] = this.#getParameters([pm1, pm2], [pm3]);
                    ops[op](this.#memory, p3, p1, p2);
                    this.#ip += 4;
                    break;
                case 9:
                    [p1] = this.#getParameters([pm1], []);
                    this.#relativeBase += p1;
                    this.#ip += 2;
                    break;
                default:
                    return kIntcodeOk;
            }
        }
    }

    #getParameters<In extends Tuple<number>, Out extends Tuple<number>>(inPms: In, outPms: Out): [...In, ...Out] {
        return [...(inPms.map((pm, i) => {
            if (pm === Mode.Immediate) {
                return this.memoryAt(this.#ip + i + 1);
            }
            if (pm === Mode.Relative) {
                return this.memoryAt(this.memoryAt(this.#ip + i + 1) + this.#relativeBase);
            }
            // const pos =  + (pm === Mode.Relative ? this.#relativeBase : 0);
            return this.memoryAt(this.memoryAt(this.#ip + i + 1));
        }) as In), ...(outPms.map((pm, i) => {
            if (pm === Mode.Relative) {
                return this.memoryAt(this.#ip + inPms.length + i + 1) + this.#relativeBase;
            }
            return this.memoryAt(this.#ip + inPms.length + i + 1);
        }) as Out)];
    }
}