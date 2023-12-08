import { getInput } from "../../utils/input.mjs";

const input = await getInput();

const len = 4;

for (const line of input.lines()) {
    const buf = [...line.slice(0, len)];
    let i = len;
    for (const c of line.slice(len)) {
        const o = Object.create(null);
        for (const l of buf) {
            o[l] = 1;
        }
        if (Object.keys(o).length === len) {
            console.log(i);
            console.log(buf.join(''));
            break;
        }
        buf.shift();
        buf.push(c);
        i++;
    }
}
