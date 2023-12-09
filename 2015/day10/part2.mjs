import { getInput } from '../../utils/input.mjs';

const input = await getInput();
const re = /1+|2+|3+|4+|5+|6+|7+|8+|9+/g;

let r = input.line(0);
for (let i = 0; i < 50; i++) {
    r = r.replace(re, (s) => `${s.length}${s[0]}`);
}

console.log(r.length);
