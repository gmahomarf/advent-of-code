import { getInput, getExampleInput } from "../../utils";

async function parse() {
    const input = await getInput();

    return {
        input,
    };
}

const BASE_PATTERN = [0, 1, 0, -1];

function part1(input: string) {
    const cache = new Map<string, string>();
    let res = input;
    for (let phase = 0; phase < 100; phase++) {
        if (cache.has(res)) {
            console.log('dupe:', res);
            res = cache.get(res)!;
            continue;
        }
        let nRes = '';
        for (let iter = 1; iter <= res.length; iter++) {
            let n = 0;
            for (let i = 0; i < res.length;) {
                const l = iter;
                for (let pi = 0; i < res.length; pi++) {
                    const p = BASE_PATTERN[pi & 0x3];
                    const sl = l - +!pi;
                    if (p) {
                        const s = res.slice(i, i + sl);
                        for (const c of s) {
                            n += +c * p;
                        }
                    }

                    i += sl;
                }
            }
            nRes += Math.abs(n % 10);
        }
        cache.set(res, nRes);
        res = nRes;
    }

    console.log(res.slice(0, 8));
}

function part2(input: string) {
    const off = +input.slice(0, 7);
    const rl = 10_000 * input.length - off;
    const c = (rl / input.length) | 0;
    const m = rl % input.length;

    let res = Array.prototype.slice.call(input.slice(-m) + input.repeat(c));
    for (let x = 0; x < 100; x++) {
        for (let i = res.length - 2; i >= 0; i--) {
            res[i] = (+res[i] + +res[i + 1]) % 10;
        }
    }

    console.log(res.slice(0, 8).join(''));
}

const { input } = await parse();

part1(input);
part2(input);
