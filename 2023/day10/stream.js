import { createReadStream } from 'node:fs';

const rs = createReadStream('input.txt', {
    encoding: 'utf-8',
    highWaterMark: 1000000
});

let c = 0;

rs.on('data', (chunk) => {
    console.log(chunk);
    c++;
});
rs.on('end', () => {
    console.log(c);
});