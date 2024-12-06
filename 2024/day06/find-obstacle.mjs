import { parentPort } from 'node:worker_threads';
import { Grid, Point } from '../../utils/index.mjs';

const directionOrder = ['D', 'R', 'U', 'L'];

function hasLoop(grid, start) {
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

function findObstacle({ grid, start, point }) {
    const g = Grid.from(grid);
    const p = new Point(point.x, point.y);
    const s = new Point(start.x, start.y);
    g.setAt(p, '#');
    if (hasLoop(g, s)) {
        return p;
    }
}

parentPort.on('message', (task) => {
    parentPort.postMessage(findObstacle(task));
});