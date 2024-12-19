import { getExampleInput, getInput } from '../../utils/index';
import memoize from 'memoize';

async function parse() {
    const input = await getInput();

    const [[patterns], wanted] = input.splitByEmptyLines();

    return {
        patterns: new Set(patterns.split(', ')),
        wanted
    };
}
const { patterns, wanted } = await parse();

const countArrangements = memoize((w: string): number => {
    let count = 0;
    if (!w.length) {
        return 0;
    }
    if (w.length === 1) {
        return patterns.has(w) ? 1 : 0;
    }

    for (let i = 1; i <= w.length; i++) {
        const s = w.slice(0, i);
        if (patterns.has(s)) {
            if (i < w.length) {
                count += countArrangements(w.slice(i));
            } else {
                count++;
            }
        }
    }

    return count;
});

function part1(wanted: string[]) {
    console.log(wanted.count(w => !!countArrangements(w)));
}

function part2(wanted: string[]) {
    let s = 0;
    for (const w of wanted) {
        s += countArrangements(w);
    }

    console.log(s);
}

part1(wanted);
part2(wanted);