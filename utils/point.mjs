export class Point {
    x;
    y;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
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

    manhattanDistance(other) {
        return Math.abs(other.x - this.x) + Math.abs(other.y - this.y);
    }

    clone() {
        return new Point(this.x, this.y);
    }

    isCenter() {
        return !this.x && !this.y;
    }
}