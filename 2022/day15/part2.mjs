import process from 'node:process';
import { getInput } from '../../utils/index';

const input = await getInput();

const { abs } = Math;

const MIN = +process.argv[2];
const MAX = +process.argv[3];

const re = /^Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$/;

function distance(x1, y1, x2, y2) {
    return abs(x1 - x2) + abs(y1 - y2);
}

async function run() {
    const sensors = [];
    for (const line of input.lines()) {
        const [sx, sy, bx, by] = re.exec(line).slice(1, 5).map(n => +n);
        sensors.push({ x: sx, y: sy, d: distance(sx, sy, bx, by) });
    }

    for (const sensor of sensors) {
        for (let x = sensor.x, y = sensor.y - sensor.d - 1; y < sensor.y; x++, y++) {
            if (x >= MIN && y >= MIN && x <= MAX && y <= MAX) {
                const collision = sensors.find(s => s != sensor && s.d >= distance(s.x, s.y, x, y));
                if (!collision) {
                    console.log(`${x},${y}`);
                    console.log(x * 4000000 + y);
                    process.exit();
                }
            }
        }
        for (let x = sensor.x + sensor.d + 1, y = sensor.y; x > sensor.x; x--, y++) {
            if (x >= MIN && y >= MIN && x <= MAX && y <= MAX) {
                const collision = sensors.find(s => s != sensor && s.d >= distance(s.x, s.y, x, y));
                if (!collision) {
                    console.log(`${x},${y}`);
                    console.log(x * 4000000 + y);
                    process.exit();
                }
            }
        }
        for (let x = sensor.x, y = sensor.y + sensor.d + 1; y > sensor.y; x--, y--) {
            if (x >= MIN && y >= MIN && x <= MAX && y <= MAX) {
                const collision = sensors.find(s => s != sensor && s.d >= distance(s.x, s.y, x, y));
                if (!collision) {
                    console.log(`${x},${y}`);
                    console.log(x * 4000000 + y);
                    process.exit();
                }
            }
        }
        for (let x = sensor.x - sensor.d - 1, y = sensor.y; x < sensor.x; x++, y--) {
            if (x >= MIN && y >= MIN && x <= MAX && y <= MAX) {
                const collision = sensors.find(s => s != sensor && s.d >= distance(s.x, s.y, x, y));
                if (!collision) {
                    console.log(`${x},${y}`);
                    console.log(x * 4000000 + y);
                    process.exit();
                }
            }
        }
    }
}

run();
