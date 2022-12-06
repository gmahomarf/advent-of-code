const program = process.argv[2].split(',').map(n => parseInt(n,10));

console.log(JSON.stringify(program));

program[1] = 12;
program[2] = 2;
for(let p = 0; ;p += 4) {
    let op = program[p];
    if (op == 1) {
        program[program[p+3]] = program[program[p+1]] + program[program[p+2]];
    } else if (op == 2) {
        program[program[p+3]] = program[program[p+1]] * program[program[p+2]];
    } else /*if (op == 99)*/ {
        break;
    }
    console.log(JSON.stringify(program));
}

console.log(program[0]);