import memoize from 'memoize';
import { getExampleInput, getInput, add } from '../../utils/index';


async function parse() {
    const input = await getInput();

    const stones = input.split(' ').map(Number);
    return {
        stones
    };
}

function blink(stone: number): number[] {
    if (!stone) {
        return [1];
    }

    let ss = stone.toString();
    if (ss.length % 2) {
        return [stone * 2024];
    } else {
        return [Number(ss.slice(0, ss.length / 2)), Number(ss.slice(ss.length / 2))];
    }
};

function blink25(stone: number) {
    let s = [stone];
    (25).times(() => {
        s = s.flatMap(blink);
    });

    return s;
}

function part1(stones: number[]) {
    let s = stones;
    (25).times(() => {
        s = s.flatMap(blink);
    });

    console.log(s.length);
}

/**
 * Leaving this for posterity's sake. This ended up running for anywhere between 1:35 and 2:00 minutes,
 * but it worked...
 */
function part2_lame(stones: number[]) {
    const b = memoize(blink25)

    console.log(stones.map(s =>
        b(s).map(s2 => b(s2).map(s3 => b(s3).length).reduce(add)).reduce(add)
    ).reduce(add))
}

function part2_smart(stones: number[]) {
    let counts = stones.counts();

    (75).times(() => {
        const newCounts: typeof counts = new Map();
        for (const [stone, oldCount] of counts) {
            for (const newStone of blink(stone)) {
                newCounts.set(newStone, (newCounts.get(newStone) ?? 0) + oldCount);
            }
        }
        counts = newCounts;
    })

    console.log(counts.values().toArray().reduce(add))
}

const { stones } = await parse();
part1(stones);
// part2_lame(stones);
part2_smart(stones);
