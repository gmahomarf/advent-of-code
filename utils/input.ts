import { readFile } from "fs/promises";
import './array';
import './string';

export async function getInput() {
    return _getInput('input.txt');
}

export async function getExampleInput(n = '') {
    return _getInput(`input-ex${n}.txt`);
}

async function _getInput(file: string) {
    return readFile(file, 'utf-8');
}
