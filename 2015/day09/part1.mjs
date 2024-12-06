import { permutations, getInput } from '../../utils/index';

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

let shortest = Infinity;
const routes = permutations(Object.keys(distances));

for (const route of routes) {
    let distance = 0;
    let prev;
    for (const stop of route) {
        if (prev) {
            distance += distances[prev][stop];
            if (distance >= shortest) break;
        }
        prev = stop;
    }
    shortest = Math.min(shortest, distance);
}

console.log(shortest);
