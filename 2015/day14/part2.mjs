import { getExampleInput, getInput } from '../../utils/index.mjs';

async function main() {
    const input = await getInput();
    // const input = await getExampleInput();

    const RACE_TIME = 2503;
    // const RACE_TIME = 1000;

    const reindeer = {};

    for (const line of input.lines()) {
        const [who, speed, flyTime, restTime] = line.split(' ').getMany(0, 3, 6, -2);
        reindeer[who] = {
            speed: +speed,
            flyTime: +flyTime,
            restTime: +restTime,
            get lapTime() {
                return this._lt ?? (this._lt = this.flyTime + this.restTime);
            }
        };
    }

    const names = Object.keys(reindeer);
    const points = Object.fromEntries(names.map(r => [r, 0]));

    for (let time = 1; time <= RACE_TIME; time++) {
        const positions = names.map(r => ({ who: r, d: getDistance(reindeer[r], time) })).sort((a, b) => a.d - b.d);
        const lead = Math.max(...positions.map(p => p.d));
        positions.forEach(p => {
            if (p.d === lead) points[p.who]++;
        });
    }

    console.log(points);
}

function getDistance(reindeer, time) {
    const flights = Math.trunc(time / reindeer.lapTime);
    const rem = time % reindeer.lapTime;
    return (flights * reindeer.flyTime + Math.min(rem, reindeer.flyTime)) * reindeer.speed;
}

main();
