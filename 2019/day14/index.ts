import { getExampleInput, getInput, } from '../../utils/index';

const ORE = 'ORE' as const;
const FUEL = 'FUEL' as const;
type ChemicalAndQuantity = {
    [chem: string]: number;
};

type ChemicalMap = {
    [chem: string]: {
        qt: number,
        ingredients: ChemicalAndQuantity;
    };
};
async function parse() {
    const input = await getInput();
    const chemicalMap: ChemicalMap = {};

    for (const line of input.lines()) {
        const [ingredients, chemAndQt] = line.split(' => ');
        const [qt, chem] = chemAndQt.split(' ');
        chemicalMap[chem] = {
            qt: +qt,
            ingredients: ingredients.split(', ').reduce((acc, i) => {
                const [qt, iChem] = i.split(' ');
                acc[iChem] = +qt;
                return acc;
            }, {} as ChemicalAndQuantity)
        };
    }

    return {
        chemicalMap,
    };
}

function getMinOre(chemicalMap: ChemicalMap, mul = 1) {
    const rem: ChemicalAndQuantity = {};
    const all: ChemicalAndQuantity = Object.fromEntries(Object.entries(chemicalMap[FUEL].ingredients).map(([k, v]) => [k, v * mul]));

    while (Object.keys(all).length > 1) {
        for (const chem in all) {
            let wqt = all[chem];
            if (rem[chem]) {
                if (rem[chem] <= wqt) {
                    wqt -= rem[chem];
                    delete rem[chem];
                } else {
                    rem[chem] -= wqt;
                    wqt = 0;
                }
            }
            if (!wqt) {
                delete all[chem];
                continue;
            }
            if (chem === ORE) {
                continue;
            }
            const { qt, ingredients } = chemicalMap[chem];
            const w = Math.ceil(wqt / qt);
            const wr = w * qt - wqt;
            if (wr) {
                rem[chem] = wr;
            }
            for (const i in ingredients) {
                const iqt = ingredients[i];
                all[i] ??= 0;
                all[i] += w * iqt;
                delete all[chem];
            }
        }
    }

    return all[ORE];
}

function part1(chemicalMap: ChemicalMap) {
    console.log(getMinOre(chemicalMap));
}

function part2(chemicalMap: ChemicalMap) {
    const MAX_ORE = 1e12;
    let min = 1;
    let max = 0;
    for (let i = min; i < Infinity; i <<= 1) {
        const ore = getMinOre(chemicalMap, i);
        if (ore > MAX_ORE) {
            max = i;
            min = i >>> 1;
            break;
        }
    }

    while (1) {
        const m = (min + max) >>> 1;
        const ore = getMinOre(chemicalMap, m);
        if (ore <= MAX_ORE) {
            min = m;
        } else {
            max = m;
        }
        if (max - min <= 1) {
            console.log(min);
            return;
        }
    }

}

const { chemicalMap: cm } = await parse();

part1(cm);
part2(cm);
