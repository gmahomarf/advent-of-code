import { gcd, getExampleInput, getInput } from '../../utils/index';

type XYZ = [number, number, number];
type Moon = {
    pos: XYZ,
    vel: XYZ;
};

async function parse() {
    const input = await getInput();
    const moons: Moon[] = [];

    for (const line of input.lines()) {
        moons.push({
            pos: line.split(',').map(c => parseInt(c.split('=')[1])) as XYZ,
            vel: [0, 0, 0] as XYZ,
        });
    }

    return {
        moons,
    };
}

function gravity(m1: Moon, m2: Moon) {
    for (let i = 0; i < 3; i++) {
        if (m1.pos[i] < m2.pos[i]) {
            m1.vel[i]++;
            m2.vel[i]--;
        } else if (m1.pos[i] > m2.pos[i]) {
            m1.vel[i]--;
            m2.vel[i]++;
        }
    }
}

function velocity(moon: Moon) {
    for (let i = 0; i < 3; i++) {
        moon.pos[i] += moon.vel[i];
    }
}

function energy(xyz: XYZ) {
    return xyz.reduce((s, m) => s + Math.abs(m), 0);
}

function totalEnergy(moon: Moon) {
    return energy(moon.pos) * energy(moon.vel);
}

function part1(moons: Moon[]) {
    for (let i = 1; i <= 1000; i++) {
        for (let m = 0; m < moons.length - 1; m++) {
            for (let o = m + 1; o < moons.length; o++) {
                gravity(moons[m], moons[o]);
            }
        }
        moons.forEach(velocity);
    }

    console.log(moons.reduce((s, m) => s + totalEnergy(m), 0));
}

function cacheKey(moons: Moon[], i: number) {
    return moons.reduce((k, m) => (k.push(`${m.pos[i]}:${m.vel[i]}`), k), [] as string[]).join(':');
}

function part2(moons: Moon[]) {
    const cacheX = new Set([cacheKey(moons, 0)]);
    const cacheY = new Set([cacheKey(moons, 1)]);
    const cacheZ = new Set([cacheKey(moons, 2)]);
    let px = 0, py = 0, pz = 0;
    for (let i = 1; i <= 100_000_000_000 && (!px || !py || !pz); i++) {
        for (let m = 0; m < moons.length - 1; m++) {
            for (let o = m + 1; o < moons.length; o++) {
                gravity(moons[m], moons[o]);
            }
        }
        moons.forEach(velocity);

        if (!px && cacheX.has(cacheKey(moons, 0))) {
            px = i;
        }
        if (!py && cacheY.has(cacheKey(moons, 1))) {
            py = i;
        }
        if (!pz && cacheZ.has(cacheKey(moons, 2))) {
            pz = i;
        }
    }
    const g = gcd(px, py, pz);
    console.log(px / g * py / g * pz / g);

}

const { moons } = await parse();

part1(moons);
part2(moons);

