const version = process.argv[2];
const inputs = process.argv.slice(3);

console.log(process.argv[2]);

function fuelCost(f) {
    return Math.max(((f / 3)|0) - 2, 0);
}

function rFuelCost(f) {
    let s = fuelCost(f);
    // console.log(s);
    let r = s;
    while (s > 0) {
        s = fuelCost(s)
        r += s;
    }
    return r;
}

console.log(inputs.reduce((s, x) => s + (version == "1" ? fuelCost : rFuelCost)(x), 0));