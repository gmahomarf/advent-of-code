import { getExampleInput, getInput } from '../../utils/index';

// const input = await getExampleInput();
const input = await getInput();

const wires = {};

function dbg(m) {
    if (process.env.DEBUG) {
        console.log(m);
    }
}

function value(n) {
    return isFinite(n) ? +n : (wires[`_${n}`] ??= wires[n]());
}

const actions = {
    SET(d, n) {
        wires[d] = () => {
            dbg(`${d} = ${n} (?)`);
            const r = value(n) & 0xFFFF;
            dbg(`${d} = ${n} (${r})`);
            return r;
        };
    },
    AND(d, a, b) {
        wires[d] = () => {
            dbg(`${d} = ${a} & ${b} (?)`);
            const r = value(a) & value(b);
            dbg(`${d} = ${a} & ${b} (${r})`);
            return r;
        };
    },
    OR(d, a, b) {
        wires[d] = () => {
            dbg(`${d} = ${a} | ${b} (?)`);
            const r = value(a) | value(b);
            dbg(`${d} = ${a} | ${b} (${r})`);
            return r;
        };
    },
    LSHIFT(d, s, n) {
        wires[d] = () => {
            dbg(`${d} = ${s} << ${n} (?)`);
            const r = (value(s) << n) & 0xFFFF;
            dbg(`${d} = ${s} << ${n} (${r})`);
            return r;
        };
    },
    RSHIFT(d, s, n) {
        wires[d] = () => {
            dbg(`${d} = ${s} >> ${n} (?)`);
            const r = (value(s) >>> n) & 0xFFFF;
            dbg(`${d} = ${s} >> ${n} (${r})`);
            return r;
        };
    },
    NOT(d, s) {
        wires[d] = () => {
            dbg(`${d} = ~${s} (?)`);
            const r = ~value(s) & 0xFFFF;
            dbg(`${d} = ~${s} (${r})`);
            return r;
        };
    },
};

for (const line of input.lines()) {
    const [left, dest] = line.split(' -> ');
    const cmd = left.split(' ');
    if (cmd.length === 1) {
        actions.SET(dest, cmd[0]);
    } else if (cmd.length === 2) {
        actions[cmd[0]](dest, cmd[1]);
    } else {
        actions[cmd[1]](dest, cmd[0], cmd[2]);
    }
}

console.log(wires.a());
