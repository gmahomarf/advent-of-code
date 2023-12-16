import { getExampleInput, getInput } from '../../utils/index.mjs';
import memoize from 'memoize';

main();

const PROPERTIES = [
    'capacity',
    'durability',
    'flavor',
    'texture',
];

async function main() {
    const input = await getInput();
    // const input = await getExampleInput();

    const ingredients = parseIngredients(input);

    const iScore = memoize(ingredientScore.bind(ingredientScore, ingredients), {
        cacheKey: ([name, tsps]) => `${name},${tsps}`
    });

    let score = 0;

    for (const s of rec(ingredients, Object.keys(ingredients), [], 100, iScore)) {
        score = Math.max(score, s);
    }

    console.log(score);
}


function parseIngredients(input) {
    const ingredients = {};

    for (const line of input.lines()) {
        const [ingredient, _specs] = line.split(': ');
        const specs = _specs.split(', ');
        ingredients[ingredient] = {};

        for (const spec of specs) {
            const [name, value] = spec.split(' ');
            ingredients[ingredient][name] = +value;
        }
    }

    return ingredients;
}

function ingredientScore(ingredients, ingredient, tsps) {
    return Object.fromEntries(
        Object.entries(ingredients[ingredient])
            .map(([i, v]) => [i, v * tsps])
    );
}

function cookieScore(...ingredientScores) {
    let score = 1;
    const calories = ingredientScores.reduce((sum, is) => sum + is.calories, 0);
    if (calories !== 500) { return 0; }
    for (const prop of PROPERTIES) {
        const propScore = ingredientScores.reduce((sum, is) => sum + is[prop], 0);
        if (propScore <= 0) {
            return 0;
        }

        score *= propScore;
    }

    return score;
}

function* rec(ingredients, ingredList, ingredientCounts, availableTsps, scorer) {
    const ingredient = ingredList[0];

    if (ingredList.length === 1) {
        return cookieScore(...ingredientCounts.map(([i, c]) => scorer(i, c)), scorer(ingredient, availableTsps));
    }

    let myTsps = availableTsps;
    while (myTsps > 0) {
        const score = yield* rec(ingredients, ingredList.slice(1), ingredientCounts.concat([[ingredient, myTsps]]), availableTsps - myTsps, scorer);
        if (score) yield score;
        myTsps--;
    }

    return yield* rec(ingredients, ingredList.slice(1), ingredientCounts.concat([[ingredient, 0]]), availableTsps, scorer);
}
