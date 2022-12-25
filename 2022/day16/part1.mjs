import { createReadStream } from 'node:fs';
import readline from 'node:readline';
import { inspect } from 'node:util';

// const input = readline.createInterface(createReadStream('input.txt', 'utf8'));
const input = readline.createInterface(createReadStream('input-ex.txt', 'utf8'));

const TIME = 30;
const re = /^Valve ([A-Z]{2}) has flow rate=(\d+); tunnels? leads? to valves? (.*)$/;

async function run() {
    const valves = {}
    const vlvs = [];
    const distances = {};
    let usefulValves = 0;
    for await (const line of input) {
        const [_, valve, rate, tunnels] = re.exec(line);
        vlvs.push(valves[valve] = {
            valve,
            rate: +rate,
            tunnels: tunnels.split(',').map(t => t.trim()),
        })
        if (+rate) {
            usefulValves;
        }
    }
    for (const v of vlvs) {
        distances[v.valve] = Object.fromEntries(valves[v.valve].tunnels.map((t, i) => [t, { d: /* valves[t].rate === 0 ? 20 : */ 1, p: [t] }]));
        distances[v.valve][v.valve] = { d: 0, p: [] };
    }

    vlvs.sort((a, b) => b.rate - a.rate);
    const v = Object.keys(valves);
    for (const k of v) {
        for (const i of v) {
            for (const j of v) {
                distances[i][j] ||= { d: Infinity, p: [] }
                distances[i][k] ||= { d: Infinity, p: [] }
                distances[k][j] ||= { d: Infinity, p: [] }
                if (distances[i][j].d > distances[i][k].d + distances[k][j].d) {
                    distances[i][j].d = distances[i][k].d + distances[k][j].d;
                    distances[i][j].p = distances[i][k].p.concat(distances[k][j].p)
                }
            }
        }
    }

    // console.log(inspect(distances, false, 4));
    console.log(vlvs);

    const start = {
        time: TIME,
        pos: 'AA',
        openedValves: {},
        pressure: 0,
    };
    const queue = [start];
    let best = start;
    let q;
    while (q = queue.shift()) {
        const { time, pos, openedValves, pressure } = q;
        for (const [v, { d }] of Object.entries(distances[pos])) {
            const remaining = time - d - 1;
            if (pos === v || !valves[v].rate || openedValves[v] || remaining < 0) continue;
            const newOpenedValves = {
                ...openedValves,
                [v]: 1
            };
            const newMove = {
                time: remaining,
                pos: v,
                openedValves: newOpenedValves,
                pressure: pressure + valves[v].rate * remaining
            };
            queue.push(newMove);
            if (newMove.pressure > best.pressure) {
                best = newMove;
                console.log(best);
            }
        }
    }
    console.log(best);

}

run();
