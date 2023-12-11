export function getInput(): Promise<string>;
export function getExampleInput(n: string | number = ''): Promise<string>;

declare global {
    interface String {
        lines: Generator<string, void>;
        line(n: number): string;
    }
}
