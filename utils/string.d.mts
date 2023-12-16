interface String {
    lines: () => Generator<string, void, void>;
    splitByEmptyLines: () => Generator<string[], void, void>;
    line(n: number): string;
    count(char: string): number;
}