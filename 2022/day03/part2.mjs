import { getInput } from "../../utils/input.mjs";

const input = await getInput();
const al = '_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

let sum = 0;
const buf = [];
for (const rs of input.lines()) {
    buf.push(rs);
    if (buf.length < 3) {
        continue;
    }

    for (const c of buf[0]) {
        if (buf[1].indexOf(c) !== -1 && buf[2].indexOf(c) !== -1) {
            sum += al.indexOf(c);
            break;
        }
    }
    buf.length = 0;
}

console.log(sum)
