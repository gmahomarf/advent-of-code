import { argMax, argWrap, gcd, getExampleInput, getInput, Grid, Point } from '../../utils/index';
import blessed from 'blessed';

async function parse() {
    const input = await getInput(3);
    const asteroids = new Map<string, Set<string>>();
    let width, height;

    for (const [y, line] of input.numberedLines()) {
        height = y;
        width = line.length;
        for (const x of line.allIndicesOf('#')) {
            asteroids.set(new Point(x, y).toString(), new Set());
        }
    }

    return {
        asteroids,
        width: width!,
        height: height! + 1,
    };
}

function populateVisibleAsteroids4(asteroids: Map<string, Set<string>>) {
    for (const asteroid of asteroids.keys()) {
        a: for (const other of asteroids.keys().filter(v => v !== asteroid)) {
            if (asteroids.get(asteroid)!.has(other)) {
                continue;
            }
            const pa = Point.from(asteroid);
            const po = Point.from(other);

            const dy = po.y - pa.y;
            const dx = po.x - pa.x;
            const g = Math.abs(gcd(dx, dy));
            const sx = dx / g;
            const sy = dy / g;

            for (let x = pa.x + sx, y = pa.y + sy; ; x += sx, y += sy) {
                if (x >= width || x < 0 || y < 0 || y >= height) {
                    break;
                }
                const mid = `${x},${y}`;
                if (mid === other) {
                    break;
                }
                if (asteroids.has(mid)) {
                    continue a;
                }
            }
            asteroids.get(asteroid)!.add(other);
            asteroids.get(other)!.add(asteroid);
        }
    }
}

function getAngleDegrees(origin: Point, destination: Point) {
    return Math.atan2(destination.y - origin.y, destination.x - origin.x) * 180 / Math.PI;
}

function groupByAngle(center: string, asteroids: Map<string, Set<string>>) {
    const angleMap = new Map<number, Set<string>>();
    const c = Point.from(center);
    for (const other of asteroids.keys().filter(k => k !== center)) {
        const o = Point.from(other);
        const angle = getAngleDegrees(c, o);
        const set = angleMap.getOrDefault(angle, new Set());
        set.add(other);
    }

    return angleMap;
}

function destroyedAsteroidIterator(maxCoord: string, asteroids: Map<string, Set<string>>) {
    const grouped = groupByAngle(maxCoord, asteroids);
    const c = Point.from(maxCoord);
    const sorted = Array.from(
        grouped.entries()
            .map<[number, string[]]>(([k, v]) => [
                k,
                Array.from(v).sort((p1, p2) => c.manhattanDistance(Point.from(p1)) - c.manhattanDistance(Point.from(p2)))
            ])
    )
        // Sort from smallest to largest angle
        .sort((a, b) => a[0] - b[0]);

    /**
     * Scan starts facing up and rotating clockwise. That would usually mean
     * starting at 90, but our grid is flipped vertically. In cartesian coordinates,
     * that means -90 degrees
     */
    const start = sorted.findIndex(v => v[0] === -90);


    return (function* (): Generator<string> {
        for (let i = start, c = 1; c < asteroids.size; i = (i + 1) % sorted.length) {
            const set = sorted[i][1];
            if (set.length) {
                c++;
                yield set.shift()!;
            }
        }
    })();
}

function part1(asteroids: Map<string, Set<string>>) {
    populateVisibleAsteroids4(asteroids);

    const [max, [maxCoord]] = argMax(a => asteroids.get(a)!.size, argWrap(asteroids.keys()));
    console.log(max, maxCoord);

    return maxCoord;
}

function part2(asteroids: Map<string, Set<string>>, maxCoord: string, width: number, height: number) {
    const asteroidGen = destroyedAsteroidIterator(maxCoord, asteroids);

    console.log(asteroidGen.drop(199).next().value);
}
function part2AnimatedIsh(asteroids: Map<string, Set<string>>, maxCoord: string, width: number, height: number) {
    const asteroidGen = destroyedAsteroidIterator(maxCoord, asteroids);

    const grid = new Grid(...new Array(height).fill(1).map(_ => new Array(width).fill('.')));
    for (const a of asteroids.keys()) {
        grid.setAt(Point.from(a), a === maxCoord ? '@' : '#');
    }

    const screen = blessed.screen({
        smartCSR: true,
    });

    screen.title = 'Asteroid Belt';

    const mainContainer = blessed.box({
        scrollable: true,
        mouse: true,
        parent: screen,
        style: {
            bg: 'black',
            fg: 'white',
        },
    });
    const instructionsBox = blessed.box({
        parent: mainContainer,
        content: 'n: next\nq: quit',
        shrink: true,
        left: 3,
        top: 1,
        style: {
            bg: 'black',
            fg: 'white'
        }
    });
    const gridBox = blessed.box({
        parent: mainContainer,
        style: {
            bg: 'black',
            fg: 'white',
        },
        width,
        height,
        left: 3,
        top: 4,
        tags: true
    });
    const coordBox = blessed.text({
        parent: mainContainer,
        bg: 'red',
        fg: 'cyan',
        content: '0,0',
        top: 1,
        left: width + 5,
    });
    gridBox.setContent(grid.toString());

    const logBox = blessed.box({
        left: width + 15,
        parent: mainContainer,
        scrollable: true,
        height: '50%',
        width: 30,
        content: '',
        mouse: true,
        style: {
            fg: 'white',
            bg: 'black',
            border: {
                fg: 'white',
                bg: 'black'
            },
        },
        border: {
            type: 'line',
            bg: 0,
            fg: 0,
        },
        scrollbar: {
            style: {
                fg: 'red'
            },
            track: {
                fg: 'red',
                bg: 'lightgrey'
            }
        }
    });

    gridBox.on('mouse', (event: blessed.Widgets.Events.IMouseEventArg) => {
        coordBox.setContent(`${event.x - gridBox.left},${event.y - gridBox.top}`);
        screen.render();
    });

    screen.key(['q', 'Q'], (_, ev) => {
        screen.destroy();
    });

    let c = 0;
    screen.key('n', (_, ev) => {
        const vis = asteroidGen.next();
        if (!vis.done) {
            const destroyed = vis.value;
            logBox.pushLine(`${++c}: ${destroyed}`);
            logBox.scrollTo(c);
            grid.setAt(Point.from(destroyed), '.');
        }
        // gridBox.setContent('');
        gridBox.setContent(grid.toString());
        screen.render();
    });

    screen.render();
    return screen;

}

const { asteroids, width, height } = await parse();
const maxCoord = part1(asteroids);
part2(asteroids, maxCoord, width, height);
// part2AnimatedIsh(asteroids, maxCoord, width, height);