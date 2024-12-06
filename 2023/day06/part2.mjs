import { getInput } from '../../utils/index';

const input = await getInput();
const [time, distance] = [...input.lines()].map(l => +(l.replace(/ +/g, '').split(':').pop()));

let ways = 0;
for (let p = 1; p < time; p++) {
    if ((time - p) * p > distance) {
        ways = time - 2 * p + 1;
        break;
    }
}

console.log(ways);
