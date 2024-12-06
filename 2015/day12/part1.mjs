import { getInput } from '../../utils/index';

const input = await getInput();

console.log([...input.matchAll(/-?\d+/g)].reduce((a, b) => a + +b[0], 0));
