import { createReadStream } from 'node:fs';
import readline from 'node:readline';

// const input = readline.createInterface(createReadStream('input.txt', 'utf8'));
const input = readline.createInterface(createReadStream('input-ex.txt', 'utf8'));

class LoopedArray extends Array {
    _left(v, n) {
        let c = n % this.length;
        let i = this.indexOf(v);
        while (c--) {
            if (i === 0) {
                this.splice(-1, 0, this.shift())
                i = this.length - 2
            } else if (i === 1) {
                this.push(v);
                this.splice(1, 1);
                i = this.length - 1
            } else {
                this[i] = this[i - 1];
                this[i - 1] = v;
                i--;
            }
        }
    }

    left(v, n) {
        let i = this.indexOf(v);
        while (n--) {
            if (i === 0) {
                this.splice(-1, 0, this.shift())
                i = this.length - 2
            } else if (i === 1) {
                this.push(v);
                this.splice(1, 1);
                i = this.length - 1
            } else {
                this[i] = this[i - 1];
                this[i - 1] = v;
                i--;
            }
        }
    }

    __left(v, n) {
        let c = n % this.length;
        let i = this.indexOf(v);
        if (i === 0) {
            this.splice(-n, 0, ...this.splice(i, 1));
        } else if (1 < i - c) {
            const newLocal = this.length - i + c - 1;
            this.splice(newLocal, 0, ...this.splice(i, 1));
        } else {
            this.splice(i - c, 0, ...this.splice(i, 1))
        }
    }

    _right(v, n) {
        let c = n % this.length;
        let i = this.indexOf(v);
        while (c--) {
            if (i === this.length - 1) {
                this.splice(1, 0, this.pop())
                i = 1;
            } else {
                this[i] = this[i + 1];
                this[i + 1] = v;
                i++;
            }
        }
    }

    right(v, n) {
        let c = n % this.length;
        let i = this.indexOf(v);
        if (this.length > i + c) {
            const newLocal_1 = i + c - this.length;
            this.splice(newLocal_1, 0, ...this.splice(i, 1));
        } else {
            this.splice(i + c, 0, ...this.splice(i, 1));
        }
    }
}

async function run() {
    const numbers = new LoopedArray();
    const order = [];
    let zero;
    for await (const line of input) {
        const number = Object(+line);
        if (number.valueOf() === 0) {
            zero = number;
        }
        numbers.push(number);
        order.push(number);
    }

    for (const number of order) {
        const value = number.valueOf();
        if (value) {
            if (value < 0) {
                numbers.left(number, -value);
            } else {
                numbers.right(number, value);
            }
        }
    }

    console.log(numbers);
    const iz = numbers.indexOf(zero);
    const oth = numbers[(iz + 1000) % numbers.length].valueOf();
    const tth = numbers[(iz + 2000) % numbers.length].valueOf();
    const thth = numbers[(iz + 3000) % numbers.length].valueOf();
    console.log('1000:', oth)
    console.log('2000:', tth)
    console.log('3000:', thth)
    console.log(oth + tth + thth)
}

await run();
