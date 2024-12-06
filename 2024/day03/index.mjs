import { getExampleInput, getInput } from '../../utils/index';

const input = await getInput(2);


async function part1() {
    let sum = 0;
    const mulRe = /mul\((?<l>\d+),(?<r>\d+)\)/g;

    let mul;
    while (mul = mulRe.exec(input)) {
        sum += mul.groups.l * mul.groups.r;
    }

    console.log(sum);
}

async function part2() {
    let sum = 0;
    const mulRe = /mul\((?<l>\d+),(?<r>\d+)\)/g;
    const cleanRe = /don't\(\)[\w\W]+?(?:do\(\)|$)/g;
    const clean = input.replace(cleanRe, '');
    let mul;
    while (mul = mulRe.exec(clean)) {
        sum += mul.groups.l * mul.groups.r;
    }

    console.log(sum);
}

part1();
part2();