import { readFile } from "node:fs/promises";

const input = await readFile("input.txt", "utf-8");

let sum = 0;

for (const line of input.split("\n")) {
    const numbers = line.split("").map(Number).filter(Number.isFinite);
    const f = numbers.shift();
    const l = numbers.pop() ?? f;
    sum += 10 * f + l;
}

console.log(sum);
