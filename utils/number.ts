declare global {
    interface Number {
        times: (this: Number, iterator: (i: number) => void) => void;
    }
}

export namespace NumberUtils {
    Number.prototype.times = function (this: Number, iterator: Function) {
        let i = 0;
        while (i++ < this.valueOf()) {
            iterator(i);
        }
    };

}
