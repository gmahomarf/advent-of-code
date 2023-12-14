declare global {
    interface String {
        lines: () => Generator<string, void>;
        splitByEmptyLines: () => Generator<string[], void>;
        line(n: number): string;
        count(char: string): number;
    }
}
