export type PointLike = Pick<Point, 'x' | 'y'>

export class Point {
    constructor(public x = 0, public y = 0) {
    }

    static from(s: string): Point;
    static from(o: PointLike): Point;
    static from(s: string | PointLike) {
        if (typeof s === 'string') {
            const [x, y] = s.split(',');
            return new Point(+x, +y);
        }

        return new Point(s.x, s.y)
    }

    toString() {
        return `${this.x},${this.y}`;
    }

    R(n = 1) {
        this.x += n;
        return this;
    }

    L(n = 1) {
        this.x -= n;
        return this;
    }

    U(n = 1) {
        this.y += n;
        return this;
    }

    D(n = 1) {
        this.y -= n;
        return this;
    }

    manhattanDistance(other: Point) {
        return Math.abs(other.x - this.x) + Math.abs(other.y - this.y);
    }

    clone() {
        return new Point(this.x, this.y);
    }

    isCenter() {
        return !this.x && !this.y;
    }

    equals(p: Point) {
        return this.x === p.x && this.y === p.y;
    }

    plus(p: Point): Point;
    plus(x: number, y: number): Point;
    plus(pointOrX: Point | number, y?: number) {
        if (typeof pointOrX === 'number') {
            return new Point(this.x + pointOrX, this.y + y!);
        }
        return new Point(this.x + pointOrX.x, this.y + pointOrX.y)
    }
}