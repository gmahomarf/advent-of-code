import { getExampleInput, getInput } from '../../utils/index';

type WireMap = Map<string, SubCircuit>;
type Gate = 'AND' | 'OR' | 'XOR';

async function parse(n?: number) {
    const input = await getInput(n);
    const wires: WireMap = new Map();

    const [init, ops] = input.splitByEmptyLines();


    init.forEach(line => {
        const [wire, n] = line.split(': ');
        wires.set(wire, { value: +n });
    });

    return {
        wires,
        ops: new Map(ops.map(op => {
            const [w1, cmd, w2, _, dest] = op.split(' ');
            const subCircuit: SubCircuit = {
                gate: cmd as Gate,
                inputs: [w1, w2],
                output: dest,
            };
            wires.set(dest, subCircuit);
            return [`${[w1, w2].sort().join(` ${cmd} `)}`, dest];
        })),
    };
}

type SubCircuit = {
    output: string;
    gate: Gate,
    inputs: [string, string],
} | {
    value: number;
};

function value(wires: WireMap, w: string): number {
    const v = wires.get(w)!;
    if ('value' in v) {
        return v.value;
    }
    const r = OPS[v.gate](...v.inputs)(wires);
    wires.set(w, { value: r });
    return r;
}

const OPS: Record<Gate, (w1: string, w2: string) => ((wires: WireMap) => number)> = {
    AND(a, b) {
        return (wires: WireMap) => value(wires, a) & value(wires, b);
    },
    OR(a, b) {
        return (wires: WireMap) => value(wires, a) | value(wires, b);
    },
    XOR(a, b) {
        return (wires: WireMap) => value(wires, a) ^ value(wires, b);
    },
};

function run(wires: WireMap) {
    const zs: number[] = [];
    wires.keys().forEach(w => {
        if (w[0] === 'z') {
            const i = +w.slice(1);
            const wv = wires.get(w)!;
            if ('value' in wv) {
                zs[i] = wv.value;
            } else {
                let v = OPS[wv.gate](...wv.inputs)(wires);
                wires.set(w, { value: v });
                zs[i] = v;
            }
        }
    });

    return zs.reverse().join('');
}

function part1(wires: WireMap) {
    const bin = run(new Map(wires));
    console.log(parseInt(bin, 2));
}

function part2(wires: WireMap) {
    let orc = 0;
    let xorc = 0;
    let andc = 0;
    const nodesIn: Set<string> = new Set();
    const nodesMid: Set<string> = new Set();
    const nodesOut: Set<string> = new Set();
    const edgesIn: Set<string> = new Set();
    const edgesMid: Set<string> = new Set();
    const edgesOut: Set<string> = new Set();

    wires.entries().forEach(([k]) => {
        (k[0] === 'x' || k[0] === 'y' ? nodesIn : k[0] === 'z' ? nodesOut : nodesMid).add(k/*  + (k[0] === 'x' || k[0] === 'y' ? ':n' : k[0] === 'z' ? ':s' : '') */);
    });
    wires.entries().forEach(([, sc]) => {
        if ('inputs' in sc) {
            const c = sc.gate === 'AND' ? andc++ : sc.gate === 'OR' ? orc++ : xorc++;
            const gate = sc.gate + c;
            nodesMid.add(gate + '[label="' + sc.gate + '"]');
            edgesMid.add('{' + sc.inputs.join(' ') + '} -- ' + gate);
            edgesMid.add(gate + ' -- ' + sc.output);
        }
    });

    // Dump this output into graphviz and evaluate
    // https://dreampuf.github.io/GraphvizOnline/?engine=dot
    console.log(`graph C {
    subgraph inputs {
        ${Array.from(nodesIn).join(';\n        ')};
        ${Array.from(edgesIn).join(';\n        ')}
    }
    subgraph mids {
        ${Array.from(nodesMid).join(';\n        ')};
        ${Array.from(edgesMid).join(';\n        ')};
        color=black
    }
    subgraph outputs {
        ${Array.from(nodesOut).join(';\n        ')};
    }
    ${Array.from(edgesOut).join(';\n    ')}
}`);
    //     console.log(`graph C {
    //     rankdir = "TB";
    //     subgraph cluster_inputs {
    //         clusterrank=1;
    //         color=black;
    //         ${Array.from(nodesIn).join(';\n        ')};
    //     }
    //     subgraph cluster_outputs {
    //         clusterrank=3
    //         color=blue;
    //         ${Array.from(nodesOut).join(';\n        ')}
    //     }
    //     subgraph mids {
    //         clusterrank=2;
    //         color=red;
    //         ${Array.from(nodesMid).join(';\n        ')};
    //         ${Array.from(edgesMid).join(';\n        ')};
    //     }
    // }`);
}


const { wires, ops } = await parse(2);

part1(wires);
part2(wires);


