import { createReadStream } from 'node:fs';
import readline from 'node:readline';
import { setTimeout } from 'node:timers';

// const input = readline.createInterface(createReadStream('input.txt', 'utf8'));
const input = readline.createInterface(createReadStream('input-ex.txt', 'utf8'));

const TIME = 26;
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
        time: TIME + 1,
        posE: 'AA',
        posM: 'AA',
        e: 1,
        m: 1,
        openedValves: {},
        pressureM: 0,
        pressureE: 0,
    };
    const queue = [start];
    let best = start;
    let q;
    // while (q = queue.shift()) {
    const step = function () {
        this.time--;
        this.e--;
        this.m--;
        // this.pressure += Object.keys(this.openedValves).reduce((a, b) => a + valves[b].rate, 0);

        if (this.time <= 0) {
            return;
        }
        if (this.m && this.e) {
            setTimeout(this.fn.bind(this));
        } else if (!this.m && !this.e) {
            if (this.pressureE + this.pressureM > best.pressureE + best.pressureM) {
                best = this;
                console.log(best);
            }
            const fltM = Object.entries(distances[this.posM]).filter(
                ([v, { d }]) => this.posM !== v && valves[v].rate && !this.openedValves[v] && (this.time - d - 1) >= 0
            );
            const fltE = Object.entries(distances[this.posE]).filter(
                ([v, { d }]) => this.posE !== v && valves[v].rate && !this.openedValves[v] && (this.time - d - 1) >= 0
            );
            if (fltM.length && fltE.length) {
                for (const [vm, { d: dm }] of fltM) {
                    for (const [ve, { d: de }] of fltE) {
                        // if (this.posM === this.posE && ve === vm) continue;
                        if (ve === vm) {
                            // if (this.posM === this.posE) continue;
                            if (fltE.length > 1 && fltM.length > 1) {
                                // if (dm < de) continue;
                                // else break;
                                continue;
                            }
                            if (fltE.length > 1) continue;
                            if (fltM.length > 1) break;
                        }
                        const remainingM = this.time - dm - 1;
                        const remainingE = this.time - de - 1;
                        const newOpenedValves = {
                            ...this.openedValves,
                            [vm]: 1,
                            [ve]: 1
                        };
                        const newMove = {
                            ...this,
                            posM: vm,
                            posE: ve,
                            e: de,
                            m: dm,
                            openedValves: newOpenedValves,
                            pressureM: this.pressureM + valves[vm].rate * remainingM,
                            pressureE: this.pressureE + valves[ve].rate * remainingE,
                        };
                        // if (newMove.pressureM + newMove.pressureE > best.pressureM + best.pressureE) {
                        //     best = newMove
                        //     console.log(best);
                        //     if (best.pressureE + best.pressureM === 1707) console.log('######THIS######')
                        // }
                        const fn = step.bind(newMove);
                        if (vm === ve) {
                            if (dm < de){
                                newMove.posE = this.posE;
                                newMove.e = 0;
                                newMove.pressureE -= valves[ve].rate * remainingE;
                            } else {
                                newMove.posM = this.posM;
                                newMove.m = 0;
                                newMove.pressureM -= valves[vm].rate * remainingM;
                            }
                        }
                        newMove.fn = fn;
                        setTimeout(fn)
                    }
                }
            } else if (fltM.length) {
                for (const [v, { d }] of fltM) {
                    const remaining = this.time - d - 1;
                    const newOpenedValves = {
                        ...this.openedValves,
                        [v]: 1
                    };
                    const newMove = {
                        ...this,
                        // time: remaining,
                        posM: v,
                        m: d,
                        openedValves: newOpenedValves,
                        pressureM: this.pressureM + valves[v].rate * remaining
                    };
                    // if (newMove.pressureM + newMove.pressureE > best.pressureM + best.pressureE) {
                    //     best = newMove
                    //     console.log(best);
                    //     if (best.pressureE + best.pressureM === 1707) console.log('######THIS######')
                    // }
                    const fn = step.bind(newMove);
                    newMove.fn = fn;
                    setTimeout(fn)
                }
            } else if (fltE.length) {
                for (const [v, { d }] of fltM) {
                    const remaining = this.time - d - 1;
                    const newOpenedValves = {
                        ...this.openedValves,
                        [v]: 1
                    };
                    const newMove = {
                        ...this,
                        // time: remaining,
                        posE: v,
                        e: d,
                        openedValves: newOpenedValves,
                        pressureE: this.pressureE + valves[v].rate * remaining
                    };
                    // if (newMove.pressureM + newMove.pressureE > best.pressureM + best.pressureE) {
                    //     best = newMove
                    //     console.log(best);
                    //     if (best.pressureE + best.pressureM === 1707) console.log('######THIS######')
                    // }
                    const fn = step.bind(newMove);
                    newMove.fn = fn;
                    setTimeout(fn)
                }
            }
        } else if (this.m === 0) {
            if (this.pressureE + this.pressureM > best.pressureE + best.pressureM) {
                best = this;
                console.log(best);
            }
            const flt = Object.entries(distances[this.posM]).filter(
                ([v, { d }]) => this.posM !== v && valves[v].rate && !this.openedValves[v] && (this.time - d - 1) >= 0
            );
            for (const [v, { d }] of flt) {
                const remaining = this.time - d - 1;
                const newOpenedValves = {
                    ...this.openedValves,
                    [v]: 1
                };
                const newMove = {
                    ...this,
                    // time: remaining,
                    posM: v,
                    m: d,
                    openedValves: newOpenedValves,
                    pressureM: this.pressureM + valves[v].rate * remaining
                };
                // if (newMove.pressureM + newMove.pressureE > best.pressureM + best.pressureE) {
                //     best = newMove
                //     console.log(best);
                //     if (best.pressureE + best.pressureM === 1707) console.log('######THIS######')
                // }
                const fn = step.bind(newMove);
                newMove.fn = fn;
                setTimeout(fn)
            }
        } else if (this.e === 0) {
            if (this.pressureE + this.pressureM > best.pressureE + best.pressureM) {
                best = this;
                console.log(best);
            }
            const flt = Object.entries(distances[this.posE]).filter(
                ([v, { d }]) => this.posE !== v && valves[v].rate && !this.openedValves[v] && (this.time - d - 1) >= 0
            );
            for (const [v, { d }] of flt) {
                const remaining = this.time - d - 1;
                const newOpenedValves = {
                    ...this.openedValves,
                    [v]: 1
                };
                const newMove = {
                    ...this,
                    // time: remaining,
                    posE: v,
                    e: d,
                    openedValves: newOpenedValves,
                    pressureE: this.pressureE + valves[v].rate * remaining
                };
                // if (newMove.pressureM + newMove.pressureE > best.pressureM + best.pressureE) {
                //     best = newMove
                //     console.log(best);
                //     if (best.pressureE + best.pressureM === 1707) console.log('######THIS######')
                // }
                const fn = step.bind(newMove);
                newMove.fn = fn;
                setTimeout(fn)
            }
        }
        // setTimeout(this.fn);
    }
    const fn = step.bind(start);
    start.fn = fn;
    setTimeout(fn);
    // }
    // const { time, pos, openedValves, pressure } = q;

    // for (const [v, { d }] of Object.entries(distances[pos])) {
    //     const remaining = time - d - 1;
    //     if (pos === v || !valves[v].rate || openedValves[v] || remaining < 0) continue;
    //     const newOpenedValves = {
    //         ...openedValves,
    //         [v]: 1
    //     };
    //     const newMove = {
    //         time: remaining,
    //         pos: v,
    //         openedValves: newOpenedValves,
    //         pressure: pressure + valves[v].rate * remaining
    //     };
    //     queue.push(newMove);
    //     if (newMove.pressureM + newMove.pressureE > best.pressureM + best.pressureE) {
    //         best = newMove;
    //         console.log(best);
    //     }
    // }
    // }
    console.log(best);

}

run();
