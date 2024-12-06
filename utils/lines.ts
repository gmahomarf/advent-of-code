import { Point } from './point';

const Directions = {
    L: '<',
    R: '>',
    U: '^',
    D: 'v',
};

export class DirectionalLineSegmentVH {
    start: Point;
    end: Point;
    #length: number = 0;
    direction: keyof typeof Directions;
    type: 'V' | 'H';

    constructor(start: Point, end: Point, direction: keyof typeof Directions) {
        this.start = start.clone();
        this.end = end.clone();
        this.type = start.x === end.x ? 'V' : start.y === end.y ? 'H' : function () { throw new Error('Not a vertical or horizontal line'); }();
        this.direction = direction ??
            this.type === 'V'
            ? start.y < end.y
                ? 'U' : 'D'
            : start.x < end.x
                ? 'R' : 'L';
    }

    get length() {
        if (!this.#length) {
            this.#length = Math.abs(this.type === 'V' ? this.start.y - this.end.y : this.start.x - this.end.x);
        }

        return this.#length;
    }

    toString() {
        return `${this.direction}: (${this.start}) - (${this.end})`;
    }

    hasPoint(point: Point) {
        if (this.type === 'V') {
            return point.x === this.start.x && (point.y >= this.start.y && point.y <= this.end.y || point.y >= this.end.y && point.y <= this.start.y);
        }

        return point.y === this.start.y && (point.x >= this.start.x && point.x <= this.end.x || point.x >= this.end.x && point.x <= this.start.x);
    }

    intersectionWith(segment: DirectionalLineSegmentVH) {
        if (this.type === segment.type) {
            return null;
        }

        const [v, h] = this.type === 'V' ? [this, segment] : [segment, this];
        const iPoint = new Point(v.start.x, h.start.y);
        if (iPoint.isCenter()) {
            return null;
        }

        if (v.hasPoint(iPoint) && h.hasPoint(iPoint)) {
            return iPoint;
        }

        return null;
    }
}