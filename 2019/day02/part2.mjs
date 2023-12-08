import { getInput } from "../../utils/input.mjs";

const input = await getInput();
const base = input.split(',').map(n => parseInt(n, 10));

for (let n = 0; n < 100; n++) {
    for (let v = 0; v < 100; v++) {
        let program = base.slice(0);
        program[1] = n;
        program[2] = v;
        for (let p = 0; ; p += 4) {
            let op = program[p];
            if (op == 1) {
                program[program[p + 3]] = program[program[p + 1]] + program[program[p + 2]];
            } else if (op == 2) {
                program[program[p + 3]] = program[program[p + 1]] * program[program[p + 2]];
            } else /*if (op == 99)*/ {
                break;
            }

        }
        if (program[0] == 19690720) {
            console.log(n * 100 + v);
            process.exit(0);
        }
    }
}
