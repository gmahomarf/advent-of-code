import { readFile } from "fs/promises";
import './array.mjs';
import './string.mjs';

export async function getInput() {
    return _getInput('input.txt');
}

export async function getExampleInput(n = '') {
    return _getInput(`input-ex${n}.txt`);
}

async function _getInput(file) {
    return readFile(file, 'utf-8');
}
