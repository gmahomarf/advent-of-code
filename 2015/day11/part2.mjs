import { getExampleInput, getInput } from '../../utils/index';

// const input = await getExampleInput();
const input = await getInput();
let password = input.line(0);

const gen = passwordIterator(password);

let newP;
while (
    /[iol]/.test(newP = gen.next().value)
    || !/([a-z])\1.*([a-z])\2/.test(newP)
    || !hasIncreasingStraight(newP)) { }
while (
    /[iol]/.test(newP = gen.next().value)
    || !/([a-z])\1.*([a-z])\2/.test(newP)
    || !hasIncreasingStraight(newP)) { }

console.log(newP);

function hasIncreasingStraight(s) {
    for (let i = 0; i < s.length - 2; i++) {
        let c = s.charCodeAt(i);
        if (s.charCodeAt(i + 1) === ++c && s.charCodeAt(i + 2) === ++c) {
            return true;
        }
    }
    return false;
}

function* passwordIterator(base) {
    let curr = base;
    while (true) {
        let n = curr;
        for (let i = base.length - 1; i >= 0; i--) {
            const next = nextChar(curr[i]);
            n = n.slice(0, i) + next + n.slice(i + 1);
            if (next !== 'a') break;
        }
        curr = n;

        yield curr;
    }
}

function nextChar(c) {
    if (c === 'z') {
        return 'a';
    }
    return String.fromCharCode(c.charCodeAt(0) + 1);
}
