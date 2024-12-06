import { getInput } from '../../utils/index';

const input = await getInput();

const C = {
    AIR: 0,
    ROCK: 1,
    SAND: 2,
};

async function run() {
    const cave = {};
    let bottom = 0;
    let left = Infinity;
    let right = 0;
    for (const line of input.lines()) {
        const points = line.split(' -> ');
        for (let i = 0; i < points.length - 1; i++) {
            const [x1, y1] = points[i].split(',').map(n => +n);
            const [x2, y2] = points[i + 1].split(',').map(n => +n);
            const [dx, dy] = [Math.sign(x2 - x1), Math.sign(y2 - y1)];
            for (let x = x1, y = y1; x !== x2 + dx || y !== y2 + dy; x += dx, y += dy) {
                cave[`${x},${y}`] = C.ROCK;
                bottom = y > bottom ? y : bottom;
                left = x < left ? x : left;
                right = x > right ? x : right;
            }
        }
    }
    const floor = bottom + 2;

    for (let c = 0; ; c++) {
        let s = { x: 500, y: 0 };
        while (1) {
            if (s.y + 1 === floor) {
                cave[`${s.x},${s.y}`] = C.SAND;
                break;
            }
            if (!cave[`${s.x},${s.y + 1}`]) {
                s.y++;
            } else if (!cave[`${s.x - 1},${s.y + 1}`]) {
                s.x--;
                s.y++;
            } else if (!cave[`${s.x + 1},${s.y + 1}`]) {
                s.x++;
                s.y++;
            } else if (s.x === 500 && s.y === 0) {
                console.log(c + 1);
                process.exit();
            } else {
                cave[`${s.x},${s.y}`] = C.SAND;
                break;
            }
        }
    }

}

run();
