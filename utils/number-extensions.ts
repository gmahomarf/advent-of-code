interface Number {
    /**
     * @param iterator Function to be called `this` times. `i` starts at 0
     */
    times: (iterator: (i: number) => void) => void;
}

Object.defineProperties(Number.prototype, {
    times: {
        value: function (this: Number, iterator: (i: number) => void) {
            const v = this.valueOf();
            let i = 0;
            while (i < v) {
                iterator(i++);
            }
        }
    }
});
