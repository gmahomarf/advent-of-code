import { getInput } from '../../utils/index';

const input = await getInput();

const DIRECTIONS = {
    U: [0, -1],
    R: [1, 0],
    D: [0, 1],
    L: [-1, 0],
};

const grid = [];
const starts = [];
let end;
let a = 97; // 'a'.charChodeAt(0);

let y = 0;
for (const line of input.lines()) {
    grid.push(line.split('').map((c, x) => c === 'S' || c === 'a' ? (starts.push(`${x},${y}`), 0) : c === 'E' ? (end = `${x},${y}`, 25) : c.charCodeAt(0) - a));
    y++;
}

// Starting from end and finding the closest point at level 'a'
function reverse() {
    const visited = new Set([end]);
    const pending = [{ v: end, depth: 0 }];
    let currNode;
    while (currNode = pending.shift()) {
        const [x, y] = currNode.v.split(',');
        if (grid[y][x] === 0) {
            return currNode.depth;
        }

        for (const dir of Object.values(DIRECTIONS)) {
            let k2 = [+x + dir[0], +y + dir[1]];
            const n = grid[k2[1]]?.[k2[0]];
            if (n >= 0 && grid[y][x] - n < 2) {
                const step = k2.join(',');
                if (!visited.has(step)) {
                    pending.push({ v: step, depth: currNode.depth + 1 });
                    visited.add(step);
                }
            }
        }
    }
}

// Find the shortest by checking all paths
function min() {
    let steps = Infinity;
    for (const start of starts) {
        const visited = new Set([start]);
        const pending = [{ v: start, depth: 0 }];
        let currNode;
        while (currNode = pending.shift()) {
            const [x, y] = currNode.v.split(',');
            if (currNode.v === end) {
                steps = currNode.depth < steps ? currNode.depth : steps;
            }

            for (const dir of Object.values(DIRECTIONS)) {
                let k2 = [+x + dir[0], +y + dir[1]];
                const n = grid[k2[1]]?.[k2[0]];
                if (n >= 0 && n - grid[y][x] < 2) {
                    const step = k2.join(',');
                    if (!visited.has(step)) {
                        pending.push({ v: step, depth: currNode.depth + 1 });
                        visited.add(step);
                    }
                }
            }
        }
    }

    return steps;
}

console.log('reverse', reverse());
console.log('min', min());
