interface Number {
    times: (this: Number, iterator: (i: number) => void) => void;
}