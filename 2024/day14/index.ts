import { getExampleInput, getInput, Point } from '../../utils/index';

type Robot = {
    p: Point,
    v: Point,
};

async function parse() {
    const input = await getInput();
    const robots: Robot[] = input.lines().map(line => {
        const [[, p], [, v]] = line.split(' ').map(r => r.split('='));
        return {
            p: Point.from(p),
            v: Point.from(v),
        };
    }).toArray();

    return {
        robots,
        w: 101,
        h: 103,
        // w: 11,
        // h: 7,
    };
}

function teleport(r: Robot, w: number, h: number, d = 1, g?: Record<string, number>) {
    r.p.x = (r.p.x + r.v.x * d) % w;
    r.p.y = (r.p.y + r.v.y * d) % h;

    if (r.p.x < 0) {
        r.p.x = w + r.p.x;
    }
    if (r.p.y < 0) {
        r.p.y = h + r.p.y;
    }
}

function printGrid(h: number, w: number, g: Map<string, number>) {
    h.times(y => {
        let r = '';
        w.times(x => {
            r += g.get(`${x},${y}`) || '.';
        });
        console.log(r);
    });
}

function part1(robots: Robot[], w: number, h: number) {
    const g: Record<string, number> = {};
    const midX = (w - 1) >> 1;
    const midY = (h - 1) >> 1;

    robots.forEach(r => teleport(r, w, h, 100, g));

    const qr = Object.groupBy(robots, r => {
        if (r.p.x < midX) {
            if (r.p.y < midY) {
                return 1;
            }
            if (r.p.y > midY) {
                return 3;
            }
        }
        if (r.p.x > midX) {
            if (r.p.y < midY) {
                return 2;
            }
            if (r.p.y > midY) {
                return 4;
            }
        }

        return -1;
    });

    console.log(Object.entries(qr).filter(([k]) => k !== '-1').reduce((m, [_, c]) => m * c.length, 1));
    // printGrid(h, w, g);
}

function part2(robots: Robot[], w: number, h: number) {
    (10000).times(s => {
        robots.forEach(r => teleport(r, w, h, 1));
        const g = robots.countsBy(r => r.p.toString());

        // Here's hoping a x-mas tree has all robots in distinct positions.
        // I don't want to have to print all 10k grids ...
        if (Math.max(...g.values()) === 1) {
            console.log(s + 1);
            printGrid(h, w, g);
        }
    });
}

const { robots, w, h } = await parse();
const { robots: robots2 } = await parse();

part1(robots, w, h);
part2(robots2, w, h);