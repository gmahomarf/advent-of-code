import { argMax, argWrap, getExampleInput, getInput, TupleSet } from '../../utils/index';


async function parse() {
    const input = await getInput();

    return {
        secrets: input.split('\n').map(Number),
    };
}

function doit(secret: number) {
    secret = (secret ^ (secret << 6)) & 0xFFFFFF; // 16_777_216 - 1
    secret = (secret ^ (secret >> 5)) & 0xFFFFFF;
    return (secret ^ (secret << 11)) & 0xFFFFFF;
}
function getSequences(sss: [number, number][][]) {
    const sequences = new TupleSet<number[]>();
    for (const secret of sss) {
        let seq = secret.slice(1, 5).map((v) => v[1]);
        sequences.add(seq);
        let last = secret[4];
        for (const s of Iterator.from(secret).drop(5)) {
            seq.shift();
            seq.push(s[1]);
            sequences.add(seq);
        }
    }
    return sequences;
}

function part1(secrets: number[]) {
    let s = 0;
    for (const secret of secrets) {
        let sec = secret;
        (2000).times(() => {
            sec = doit(sec);
        });
        s += sec;
    }

    console.log(s);
}
function part2(secrets: number[]) {
    const sss = secrets.map(s => Array.from(getSecrets(s)));
    const opts = getSequences(sss);
    const [maxV, [seq]] = argMax(countBananas.bind(null, sss), argWrap(opts));
    console.log(maxV, seq);
}

function* getSecrets(secret: number): Generator<[number, number], void, void> {
    let sec = secret;
    yield [sec, 0];
    for (let i = 0; i < 2000; i++) {
        const nsec = doit(sec);
        yield [nsec, (nsec % 10) - (sec % 10)];
        sec = nsec;
    }
}

function countBananas(secrets: [number, number][][], seq: number[]) {
    let s = 0;
    for (const secret of secrets) {
        let i = 1;
        while ((i = secret.findIndexFrom(i, (v, idx) => idx < secret.length - 3 && v[1] === seq[0])) !== -1) {
            if (
                secret[i + 1][1] === seq[1] &&
                secret[i + 2][1] === seq[2] &&
                secret[i + 3][1] === seq[3]
            ) {
                s += secret[i + 3][0] % 10;
                break;
            }
            i++;
        }
    }

    return s;
}

const { secrets } = await parse();

part1(secrets);
part2(secrets);
