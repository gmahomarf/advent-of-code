interface Number {
    times: (this: Number, iterator: (i: number) => void) => void;
}

Number.prototype.times = function (iterator) {
    const v = this.valueOf();
    let i = 0;
    while (i < v) {
        iterator(i++);
    }
};
