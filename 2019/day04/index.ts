import { getInput } from "../../utils/index";


async function parse() {
    const input = await getInput();
    const range = input.split('-').map(Number);
    return [getMin(range[0]), range[1]];
}

function getMin(start: number) {
    let s = start.toString()
    let m = s[0];
    let p = m;
    for (let c = 1; c < s.length; c++) {
        if (s[c] < p) {
            return +(m + p.repeat(s.length - c))
        }
        p = s[c];
        m += p;
    }

    return start;
}

function matches(n: number, max2 = false) {
    let s = n.toString().split('')
    let m = s[0];
    let p = m;
    const counts = s.counts();
    for (let c = 1; c < s.length; c++) {
        if (s[c] < p) {
            return false;
        }
        p = s[c];
    }

    return !!counts.values().find(x => max2 ? x === 2 : x >= 2);
}

function part1([start, end]: number[]) {
    let c = 0;
    for (let i = start; i < end;) {
        if (matches(i)) {
            c++;
            i++;
        } else {
            i = getMin(i + 1);
        }
    }

    console.log(c)
}

function part2([start, end]: number[]) {
    let c = 0;
    for (let i = start; i < end;) {
        if (matches(i, true)) {
            c++;
            i++;
        } else {
            i = getMin(i + 1);
        }
    }

    console.log(c)
}

const input = await parse();

part1(input);
part2(input);