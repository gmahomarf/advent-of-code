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

        console.log(who, '=', getDistance(reindeer[who], RACE_TIME));
    }
}

function getDistance(reindeer, time) {
    const flights = Math.trunc(time / reindeer.lapTime);
    const rem = time % reindeer.lapTime;
    return (flights * reindeer.flyTime + Math.min(rem, reindeer.flyTime)) * reindeer.speed;
}

main();
