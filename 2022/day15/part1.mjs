import process from 'node:process';
import { getInput } from "../../utils/input.mjs";

const input = await getInput();

const { abs, min, max } = Math;

const ROW = +process.argv[2];

const re = /^Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$/

function distance(x1, y1, x2, y2) {
    return abs(x1 - x2) + abs(y1 - y2);
}

async function run() {
    const sensors = [];
    let left = Infinity, right = -Infinity;
    for (const line of input.lines()) {
        const [sx, sy, bx, by] = re.exec(line).slice(1, 5).map(n => +n);
        sensors.push({ x: sx, y: sy, bx, by, d: distance(sx, sy, bx, by) });
        const maxDist = distance(sx, sy, bx, by);

        left = min(left, sx - maxDist, bx - maxDist);
        right = max(right, sx + maxDist, bx + maxDist);

    }

    let c = 0;
    for (let x = left; x <= right; x++) {
        for (const s of sensors) {
            if ((x !== s.bx || ROW !== s.by) && distance(x, ROW, s.x, s.y) <= s.d) {
                c++;
                break;
            }
        }
    }

    console.log(c);
}

run();
