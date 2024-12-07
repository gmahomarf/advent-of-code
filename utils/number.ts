interface Number {
    times: (this: Number, iterator: (i: number) => void) => void;
}

Number.prototype.times = function (this: Number, iterator: Function) {
    let i = 0;
    while (i++ < this.valueOf()) {
        iterator(i);
    }
};

