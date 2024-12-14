import { getExampleInput, getInput, range } from '../../utils/index';

async function parse() {
    const input = await getInput();

    return {
        image: input,
    };
}


function part1(image: string, w: number, h: number) {
    const layers = image.batch(w * h).toArray();
    const [li, counts] = layers.map<[number, Map<string, number>]>((l, i) => [i, l.counts()]).sort((a, b) => a[1].getOrDefault('0', 0) - b[1].getOrDefault('0', 0))[0];
    const l = layers[li];
    console.log(counts.getOrDefault('1', 0) * counts.getOrDefault('2', 0));
}

function part2(image: string, w: number, h: number) {
    const ll = w * h;
    // renderLayers(image, w, h);
    const lc = image.length / ll;
    let f = '';
    ll.times(i => {
        for (let ln = 0; ln < lc; ln++) {
            const px = image[ln * ll + i];
            if (px !== '2') {
                f += px;
                break;
            }
        }
    });

    renderImage(f, w);
}

const { image } = await parse();

// part1(image, 2, 3);
part1(image, 25, 6);
// part2(image, 2, 2);
part2(image, 25, 6);

function renderLayers(image: string, w: number, h: number) {
    const layers = image.batch(w * h).toArray();
    layers.forEach((l, i) => {
        console.log('Layer %s:', i);
        console.log(l.batch(w).toArray().join('\n'));
    });
}
function renderImage(image: string, w: number) {
    console.log(image.batch(w).toArray().join('\n').replaceAll('0', '\u2593').replaceAll('1', '\u2591'));
}
// part2(program);