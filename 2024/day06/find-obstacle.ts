import { parentPort } from 'node:worker_threads';
import { Grid, Point, PointLike } from '../../utils/index';

const directionOrder = ['D', 'R', 'U', 'L'] as const;

function hasLoop(grid: Grid<string>, start: Point) {
    const pos = start.clone();
    const steps = new Set();
    for (let i = 0; ; i = ++i % 4) {
        const direction = directionOrder[i];
        while (1) {
            const step = direction + pos.toString();
            if (steps.has(step)) {
                return true;
            }
            steps.add(step);
            if (grid.getAt(pos.clone()[direction]()) !== '.') {
                break;
            }
            pos[direction]();
        }

        if (pos.y === 0 || pos.y === grid.height - 1 || pos.x === 0 || pos.x === grid.width - 1) {
            break;
        }
    }

    return false;
}

function findObstacle({ grid, start, point }: { grid: string[], start: PointLike, point: PointLike }) {
    const g = Grid.from(grid) as Grid<string>;
    const p = Point.from(point);
    const s = Point.from(start);
    g.setAt(p, '#');
    if (hasLoop(g, s)) {
        return p;
    }
}

parentPort!.on('message', (task) => {
    parentPort!.postMessage(findObstacle(task));
});