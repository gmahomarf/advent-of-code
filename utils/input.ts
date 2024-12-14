import './array-extensions';
import './string-extensions';

import { readFile } from "fs/promises";

export async function getInput() {
    return _getInput('input.txt');
}

interface ToString {
    toString(): string;
}

export async function getExampleInput<T extends ToString>(n?: T) {
    const s = n ?? '';
    return _getInput(`input-ex${s}.txt`);
}

async function _getInput(file: string) {
    return (await readFile(file, 'utf-8')).trimEnd();
}
