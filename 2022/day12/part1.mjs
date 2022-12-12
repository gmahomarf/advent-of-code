import { createReadStream } from 'node:fs';
import readline from 'node:readline';
import Graph from 'node-dijkstra';

const input = readline.createInterface(createReadStream('input.txt', 'utf8'));
// const input = readline.createInterface(createReadStream('input-ex.txt', 'utf8'));

const DIRECTIONS = {
    U: [0, -1],
    R: [1, 0],
    D: [0, 1],
    L: [-1, 0],
}

const PATH = [];
const grid = [];
let start;
let end;
let a = 97 // 'a'.charChodeAt(0);

let y = 0;
for await (const line of input) {
    grid.push(line.split('').map((c, x) => c === 'S' ? (start = `${x},${y}`, 0) : c === 'E' ? (end = `${x},${y}`, 25) : c.charCodeAt(0) - a));
    y++;
}

const graph = new Graph();
for (const y in grid) {
    for (const x in grid[y]) {
        const k = `${x},${y}`;
        const node = new Map();

        for (const dir of Object.values(DIRECTIONS)) {
            let k2 = [+x + dir[0], +y + dir[1]]
            const n = grid[k2[1]]?.[k2[0]];
            if (n >= 0 && n - grid[y][x] < 2) node.set(`${k2[0]},${k2[1]}`, 1);
        }

        graph.addNode(k, node);
    }
}

const path = graph.path(start, end);
// console.log(path);
console.log(path.length - 1);
