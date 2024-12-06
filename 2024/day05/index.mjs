import { getExampleInput, getInput, sum } from '../../utils/index';

const input = await getInput();

function arePagesInOrder(before, page, rules) {
    return before.every(b => !rules[page]?.[b]);
}

async function parse() {
    const sections = input.splitByEmptyLines();
    const rules = sections.next().value.reduce((acc, rule) => {
        const [p1, p2] = rule.split('|');

        (acc[p1] ||= {})[p2] = true;

        return acc;
    }, {});

    const pageLists = sections.next().value.map(pl => pl.split(','));

    return {
        rules,
        pageLists,
    };
}

function part1(rules, pageLists) {
    const inOrder = [];
    for (const pages of pageLists) {
        let flag = true;
        for (let i = 1; i < pages.length; i++) {
            if (!arePagesInOrder(pages.slice(0, i), pages[i], rules)) {
                flag = false;
                break;
            }
        }
        flag && inOrder.push(pages);
    }

    console.log(inOrder.map(p => +p[(p.length / 2) | 0]).reduce(sum));
}

async function part2(rules, pageLists) {
    const notInOrder = [];

    for (const pages of pageLists) {
        let flag = true;
        for (let i = 1; i < pages.length; i++) {
            if (!arePagesInOrder(pages.slice(0, i), pages[i], rules)) {
                flag = false;
                break;
            }
        }
        !flag && notInOrder.push(pages);
    }

    notInOrder.map(p => p.sort((a, b) => {
        return rules[a]?.[b] ? -1 : rules[b]?.[a] ? 1 : 0;
    }));

    console.log(notInOrder.map(p => +p[(p.length / 2) | 0]).reduce(sum));
}

const { pageLists, rules } = await parse();

part1(rules, pageLists);
part2(rules, pageLists);