import { getInput } from '../../utils/index';

const input = await getInput();

function count(data) {
    let c = 0;
    for (const o of data) {
        if (Array.isArray(o)) {
            c += count(o);
        } else if (typeof o === 'number') {
            c += o;
        } else if (typeof o === 'object') {
            const v = Object.values(o);
            if (!v.includes('red')) {
                c += count(v);
            }
        }
    }

    return c;
}

console.log(count(JSON.parse(input)));
