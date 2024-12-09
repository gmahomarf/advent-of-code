import { getExampleInput, getInput, Grid, Point } from '../../utils/index';

const input = await getInput();

type FS = (string | number)[];
type Empty = [pos: number, length: number];

async function parse() {
    const empties: Empty[] = [];
    let e = 0;
    const fs: FS = input.entries().flatMap(([i, char]) => {
        const len = +char;
        if (i & 1) {
            len && empties.push([e, len]);
            e += len;
            return len ? new Array(len).fill('.') : [];
        } else {
            e += len;
            return new Array(+char).fill(i / 2);
        }
    }).toArray();

    return {
        fs,
        empties,
    };
}

function part1(fs: FS) {
    let l = fs.indexOf('.'), r = fs.length - 1;
    while (1) {
        fs[l] = fs[r];
        fs[r] = '.';

        l = fs.indexOf('.', l);
        r = fs.findLastIndex(v => v !== '.');

        if (r <= l) {
            break;
        }
    }
    let s = 0;
    for (let i = 0; i < fs.length && fs[i] !== '.'; i++) {
        s += i * +fs[i];
    }
    // console.log(FS.join(''));
    console.log(s);
}

function part2(fs: FS, empties: Empty[]) {
    let r = fs.findLastIndex((v, i, a) => a[i - 1] !== v);
    let re = fs.length;

    while (1) {
        const f = fs.slice(r, re);
        for (let i = 0; i < empties.length; i++) {
            const empty = empties[i];
            if (empty[0] > r) {
                break;
            }
            if (empty[1] >= f.length) {
                fs.splice(empty[0], f.length, ...f);
                fs.splice(r, f.length, ...new Array(f.length).fill('.'))
                if (empty[1] === f.length) {
                    empties.splice(i, 1);
                } else {
                    empty[1] -= f.length;
                    empty[0] += f.length;
                }
                break;
            }
        }

        re = fs.findLastIndexFrom(r - 1, (v) => v !== '.') + 1;
        r = fs.findLastIndexFrom(re - 1, (v, i, a) => a[i - 1] !== v);

        if (!empties.length || r <= empties[0][0]) {
            break;
        }
    }

    let s = 0;
    for (let i = 0; i < fs.length; i++) {
        if (fs[i] === '.') continue
        s += i * +fs[i];
    }
    // console.log(fs.join(''));
    console.log(s);

}

const { fs, empties } = await parse();
part1(fs.slice());
part2(fs, empties);
