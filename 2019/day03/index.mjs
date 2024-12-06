import { getExampleInput, getInput, Point, DirectionalLineSegmentVH } from '../../utils/index';

const input = await getInput();

function parseInput() {
    const getLines = input.lines();
    const wire1Lines = [];
    const start = new Point();

    const pos1 = start.clone();
    for (const move of getLines.next().value.split(',')) {
        const dir = move[0];
        const length = +move.slice(1);
        const line = new DirectionalLineSegmentVH(pos1.clone(), pos1[dir](length), dir);
        wire1Lines.push(line);
    }
    return { start, wire1Lines, wire2Input: getLines.next().value.split(',') };
}

async function part1(start, wire1Lines, wire2Input) {
    const intersections = [];

    const pos2 = start.clone();
    for (const move of wire2Input) {
        const dir = move[0];
        const length = +move.slice(1);
        const line = new DirectionalLineSegmentVH(pos2.clone(), pos2[dir](length), dir);
        wire1Lines.forEach(l1 => {
            const i = l1.intersectionWith(line);
            i && intersections.push(i.manhattanDistance(start));
        });
    }

    console.log(intersections.sortInt()[0]);
}

async function part2(start, wire1Lines, wire2Input) {
    const intersections = [];

    const pos2 = start.clone();
    let wire2Steps = 0;
    for (const move of wire2Input) {
        const dir = move[0];
        const length = +move.slice(1);
        const line = new DirectionalLineSegmentVH(pos2.clone(), pos2[dir](length), dir);
        let wire1Steps = 0;
        wire1Lines.forEach(l1 => {
            const i = l1.intersectionWith(line);
            i && intersections.push(wire1Steps + l1.start.manhattanDistance(i) + wire2Steps + line.start.manhattanDistance(i));
            wire1Steps += l1.length;
        });

        wire2Steps += length;
    }

    console.log(intersections.sortInt()[0]);
}

const { start, wire1Lines, wire2Input } = parseInput();


part1(start, wire1Lines, wire2Input);
part2(start, wire1Lines, wire2Input);