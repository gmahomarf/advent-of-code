import { getExampleInput, getInput } from '../../utils/index';

// const input = await getExampleInput();
const input = await getInput();

let on = 0;

const actions = {
    toggle(x, y) {
        const light = `${x},${y}`;
        if (lights[light]) {
            this['turn off'](x, y);
        } else {
            this['turn on'](x, y);
        }
    },
    'turn on'(x, y) {
        const light = `${x},${y}`;
        if (!lights[light]) {
            on++;
        }
        lights[light] = 1;
    },
    'turn off'(x, y) {
        const light = `${x},${y}`;
        if (lights[light]) {
            on--;
        }
        delete lights[light];
    },
};
const lights = {};

for (const line of input.lines()) {
    const data = line.split(' ');
    const action = data.slice(0, -3).join(' '),
        [s, , e] = data.slice(-3),
        [sx, sy] = s.split(',').map(Number),
        [ex, ey] = e.split(',').map(Number);

    for (let x = sx; x <= ex; x++) {
        for (let y = sy; y <= ey; y++) {
            actions[action](x, y);
        }
    }
}

console.log(on);
