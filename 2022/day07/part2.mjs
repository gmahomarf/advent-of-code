import { getInput } from '../../utils/index.mjs';

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

const dirs = [];
function calculateSize(location, name) {
    let size = 0;
    const dir = location[name];
    for (const [name, c] of Object.entries(dir.c)) {
        if (Object.prototype.toString.call(c) === '[object Object]') {
            size += calculateSize(dir.c, name);
        } else {
            size += c;
        }
    }

    dirs.push({ name, size });
    return dir.size = size;
}

calculateSize(disk, '/');
const totalSpace = 70000000;
const spaceNeeded = 30000000;
const spaceRemaining = totalSpace - disk['/'].size;
const toDel = dirs.sort((a, b) => a.size - b.size).find(d => d.size + spaceRemaining >= spaceNeeded);
console.log(toDel);
