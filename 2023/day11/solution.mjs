import { getExampleInput, getInput } from '../../utils/index';

export default async function solution(expansionRate) {
    const input = await getInput();
    // const input = await getExampleInput();

    const galaxies = getGalaxies(input, expansionRate - 1);

    let sum = 0;
    for (const [i, galaxy] of galaxies.entries()) {
        for (let j = i + 1, g2 = galaxies[j]; j < galaxies.length; g2 = galaxies[++j]) {
            sum += Math.abs(g2.x - galaxy.x) + Math.abs(g2.y - galaxy.y);
        }
    }

    console.log(sum);
}

/**
 *
 * @param {string} input
 * @param {number} extraSpace
 * @returns {{x: number, y:number}[]}
 */
function getGalaxies(input, extraSpace) {
    const galaxies = [];
    const re = /#/g;

    let width;
    let y = 0;
    for (const line of input.lines()) {
        const g = [...line.matchAll(re)];
        if (g.length) {
            galaxies.push(...g.map(g => ({ x: g.index, y })));
        } else {
            y += extraSpace;
        }

        y++;
        width = line.length;
    }

    for (let x = 0; x < width; x++) {
        if (!galaxies.find(g => g.x === x)) {
            galaxies.forEach(g => {
                if (g.x > x) g.x += extraSpace;
            });

            x += extraSpace;
            width += extraSpace;
        }
    }

    return galaxies;
}

