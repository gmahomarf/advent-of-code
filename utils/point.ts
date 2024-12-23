export type PointLike = Pick<Point, 'x' | 'y'>;

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

        return new Point(s.x, s.y);
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
        this.y -= n;
        return this;
    }

    D(n = 1) {
        this.y += n;
        return this;
    }

    up(n = 1) {
        return this.U(n);
    }

    right(n = 1) {
        return this.R(n);
    }

    down(n = 1) {
        return this.D(n);
    }

    left(n = 1) {
        return this.L(n);
    }

    [DirectionArrow.Up](n = 1) {
        return this.U(n);
    }

    [DirectionArrow.Right](n = 1) {
        return this.R(n);
    }

    [DirectionArrow.Down](n = 1) {
        return this.D(n);
    }

    [DirectionArrow.Left](n = 1) {
        return this.L(n);
    }

    [Direction.Up](n = 1) {
        return this.U(n);
    }

    [Direction.Right](n = 1) {
        return this.R(n);
    }

    [Direction.Down](n = 1) {
        return this.D(n);
    }

    [Direction.Left](n = 1) {
        return this.L(n);
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
        return new Point(this.x + pointOrX.x, this.y + pointOrX.y);
    }

    minus(p: Point): Point;
    minus(x: number, y: number): Point;
    minus(pointOrX: Point | number, y?: number) {
        if (typeof pointOrX === 'number') {
            return new Point(this.x - pointOrX, this.y - y!);
        }
        return new Point(this.x - pointOrX.x, this.y - pointOrX.y);
    }
}

export enum Direction {
    Up = 'Up',
    Right = 'Right',
    Down = 'Down',
    Left = 'Left',
}

export enum DirectionArrow {
    Up = '^',
    Right = '>',
    Down = 'v',
    Left = '<',
}

export const DIRECTIONS_LIST: Readonly<Point[]> = [
    new Point(0, -1),
    new Point(0, 1),
    new Point(1, 0),
    new Point(-1, 0),
];

export const DIRECTIONS_MAP: Record<Direction | DirectionArrow, Point> = {
    [Direction.Up]: new Point(0, -1),
    [Direction.Right]: new Point(1, 0),
    [Direction.Down]: new Point(0, 1),
    [Direction.Left]: new Point(-1, 0),
    [DirectionArrow.Up]: new Point(0, -1),
    [DirectionArrow.Right]: new Point(1, 0),
    [DirectionArrow.Down]: new Point(0, 1),
    [DirectionArrow.Left]: new Point(-1, 0),
};