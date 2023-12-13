import { permutations, getInput } from '../../utils/index.mjs';

const input = await getInput();

const distances = {};
const places = new Set();

for (const line of input.lines()) {
    const [points, d] = line.split(' = ');
    const [a, b] = points.split(' to ');

    places.add(a);
    places.add(b);

    distances[a] ??= {};
    distances[b] ??= {};

    distances[a][b] = +d;
    distances[b][a] = +d;
}

let longest = 0;
const routes = permutations(Object.keys(distances));

for (const route of routes) {
    let distance = 0;
    let prev;
    for (const stop of route) {
        if (prev) {
            distance += distances[prev][stop];
        }
        prev = stop;
    }
    longest = Math.max(longest, distance);
}

console.log(longest);
