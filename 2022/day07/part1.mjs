import { getInput } from '../../utils/index';

const input = await getInput();

const disk = { '/': { size: 0, c: {} } };
let currentDir = null;
let dirStack = [];
let lsMode = false;

for (const line of input.lines()) {
    if (line[0] === '$') {
        lsMode = false;
        const [cmd, ...args] = line.slice(2).split(' ');
        switch (cmd) {
            case 'cd':
                if (args[0] === '/') {
                    dirStack = [];
                    currentDir = disk['/'];
                } else if (args[0] === '..') {
                    if (currentDir !== disk['/']) {
                        currentDir = dirStack.pop();
                    }
                } else {
                    dirStack.push(currentDir);
                    currentDir = currentDir.c[args[0]];
                }
                break;
            case 'ls':
                lsMode = true;
                break;
        }
    } else if (lsMode) {
        const [st, name] = line.split(' ');
        if (st === 'dir') {
            currentDir.c[name] = currentDir[name] || { size: 0, c: {} };
        } else {
            currentDir.c[name] = parseInt(st, 10);
        }
    }
}

let sum = 0;
const limit = 100000;
function calculateSize(dir) {
    let size = 0;
    for (const c of Object.values(dir.c)) {
        if (Object.prototype.toString.call(c) === '[object Object]') {
            size += calculateSize(c);
        } else {
            size += c;
        }
    }

    if (size <= limit) {
        sum += size;
    }
    return dir.size = size;
}

calculateSize(disk['/']);

console.log(sum);
