import { getExampleInput, getInput } from '../../utils/index.mjs';

const input = await getInput();

function isSafe(l, r, inc) {
    return inc ? r - l > 0 && r - l < 4 : l - r > 0 && l - r < 4;
}

function isReportSafe(report) {
    const inc = report[0] < report.at(-1);
    return report.slice(1).every((r, i) => isSafe(report[i], r, inc));
}

async function part1() {
    let safe = 0;
    for await (const line of input.lines()) {
        const reports = line.split(' ').map(Number);
        if (isReportSafe(reports)) {
            safe++;
        }
    }

    console.log(safe);
}

async function part2() {
    let safe = 0;
    for await (const line of input.lines()) {
        const report = line.split(' ').map(Number);
        if (report.some((l, i, r) => isReportSafe(r.slice(0, i).concat(r.slice(i + 1))))) {
            safe++;
        }
    }

    console.log(safe);
}

part1();
part2();