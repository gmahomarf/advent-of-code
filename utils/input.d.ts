interface String {
    lines: Generator<string, void>;
    line(n: number): string;
}