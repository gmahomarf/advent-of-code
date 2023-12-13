import { getInput } from '../../utils/index.mjs';

const input = await getInput();
const al = '_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

let sum = 0;
for (const rs of input.lines()) {
    const a = rs.slice(0, rs.length / 2);
    const b = rs.slice(rs.length / 2);

    for (const c of a) {
        if (b.indexOf(c) !== -1) {
            sum += al.indexOf(c);
            break;
        }
    }
}

console.log(sum);
