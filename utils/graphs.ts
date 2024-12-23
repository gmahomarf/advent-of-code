import { Point } from "./point";
import { Grid } from './grid';

export type AdjacentNodeCheck<T extends string | number[], Current extends Point | { p: Point; }> =
    (
        nodeValue: T[number],
        possiblyAdjacentNodeValue: T[number],
        nodePoint: Point,
        possibleAdjacentNodePoint: Point,
        current: Current
    ) => boolean;

export type GraphSearchOptions<T extends string | number[], All extends boolean = false, Current extends Point | { p: Point; } = Point> = {
    all?: All,
    includeDiagonals: boolean,
    isAdjacent?: AdjacentNodeCheck<T, Current>;
    isGoal: (value: T[number], point: Point) => boolean;
    getDistance?: (p1: Point, p2: Point) => number;
};


export function getAdjacentNodes<T extends string | number[], Current extends Point | { p: Point; }>(grid: Grid<T>, current: Current, { includeDiagonals, isAdjacent = () => true }: { includeDiagonals: boolean, isAdjacent?: AdjacentNodeCheck<T, Current>; }): Point[] {
    const nodes: Point[] = [];

    (includeDiagonals ? [
        [-1, -1], [0, -1], [1, -1],
        [-1, 0], /* 0,0 */[1, 0],
        [-1, 1], [0, 1], [1, 1]

    ] : [
        /* -1, -1 */[0, -1], /* 1, -1 */
        [-1, 0],  /* 0,0 */[1, 0],
        /* -1, 1 */[0, 1], /* 1, 1 */
    ]).forEach(([x, y]) => {
        const point = current instanceof Point ? current : current.p;
        const aNode = point.plus(x, y);
        if (grid.hasPoint(aNode) && isAdjacent(grid.getAt(point), grid.getAt(aNode), point, aNode, current)) {
            nodes.push(aNode);
        }
    });

    return nodes;
}

export function DFS<T extends string | number[]>(grid: Grid<T>, start: Point, opts: GraphSearchOptions<T>): Point;
export function DFS<T extends string | number[]>(grid: Grid<T>, start: Point, opts: GraphSearchOptions<T, true>): Set<string>;
export function DFS<T extends string | number[], All extends boolean>(grid: Grid<T>, start: Point, opts: GraphSearchOptions<T, All>): Set<string> | Point {
    const seen = new Set<string>();
    const goals = new Set<string>();
    const stack: Point[] = [start];

    while (stack.length) {
        const curr = stack.pop()!;
        if (!seen.has(curr.toString())) {
            if (opts.isGoal(grid.getAt(curr), curr)) {
                if (!opts.all) {
                    return curr;
                }
                goals.add(curr.toString());
            }
            seen.add(curr.toString());
            stack.push.apply(stack, getAdjacentNodes(grid, curr, opts));
        }
    }

    return goals;
}

type PointAndPath = {
    p: Point,
    path: Point[],
};
export function getPathDFS<T extends string | number[]>(grid: Grid<T>, start: Point, opts: GraphSearchOptions<T>): Point[];
export function getPathDFS<T extends string | number[]>(grid: Grid<T>, start: Point, opts: GraphSearchOptions<T, true>): Point[][];
export function getPathDFS<T extends string | number[], All extends boolean>(grid: Grid<T>, start: Point, opts: GraphSearchOptions<T, All>): Point[][] | Point[] {
    const seen = new Set<string>();
    const goals = new Set<string>();
    const stack: PointAndPath[] = [{ p: start, path: [] }];
    const paths: Point[][] = [];

    let curr: PointAndPath | undefined;
    while ((curr = stack.pop())) {
        if (!seen.has(curr.p.toString() + ':' + curr.path.toString())) {
            if (opts.isGoal(grid.getAt(curr.p), curr.p)) {
                if (!opts.all) {
                    return curr.path.concat(curr.p);
                }
                goals.add(curr.toString());
                paths.push(curr.path.concat(curr.p));
            }
            seen.add(curr.toString());
            stack.push.apply(stack, getAdjacentNodes(grid, curr.p, opts)
                .map(a => ({ p: a, path: curr!.path.concat(curr!.p) }))
            );
        }
    }

    return paths;
}

export function BFS<T extends string | number[]>(grid: Grid<T>, start: Point, opts: GraphSearchOptions<T>): Point | null;
export function BFS<T extends string | number[]>(grid: Grid<T>, start: Point, opts: GraphSearchOptions<T, true>): Set<string>;
export function BFS<T extends string | number[], All extends boolean>(grid: Grid<T>, start: Point, opts: GraphSearchOptions<T, All>): Set<string> | Point | null {
    const goals = new Set<string>();
    const queue: Point[] = [start];
    const seen = new Set<string>([start.toString()]);

    let curr: Point | undefined;
    while ((curr = queue.shift())) {
        if (opts.isGoal(grid.getAt(curr), curr)) {
            if (!opts.all) {
                return curr;
            }
            goals.add(curr.toString());
        }

        for (const aNode of getAdjacentNodes(grid, curr, opts)) {
            if (!seen.has(aNode.toString())) {
                seen.add(aNode.toString());
                queue.push(aNode);
            }
        }
    }

    return opts.all ? goals : null;
}

export type PointAndDistance = {
    p: Point,
    d: number,
};
export function bfsDistance<T extends string | number[]>(grid: Grid<T>, start: Point, opts: GraphSearchOptions<T>): PointAndDistance | null {
    const queue: PointAndDistance[] = [{ p: start, d: 0 }];
    const seen = new Set<string>([start.toString()]);

    let curr: PointAndDistance | undefined;
    while ((curr = queue.shift())) {
        if (opts.isGoal(grid.getAt(curr.p), curr.p)) {
            return curr;
        }

        for (const aNode of getAdjacentNodes(grid, curr.p, opts)) {
            if (!seen.has(aNode.toString())) {
                seen.add(aNode.toString());
                queue.push({ p: aNode, d: curr.d + (opts.getDistance?.(curr.p, aNode) ?? 1) });
            }
        }
    }

    return null;
}

type PointAndPath2 = {
    p: Point,
    path: Set<string>,
};
export function bfsPath<T extends string | number[], All extends boolean>(grid: Grid<T>, start: Point, opts: GraphSearchOptions<T, All>): Set<string> {
    const queue: PointAndPath2[] = [{ p: start, path: new Set([start.toString()]) }];

    let curr: PointAndPath2 | undefined;
    while ((curr = queue.shift())) {
        if (opts.isGoal(grid.getAt(curr.p), curr.p)) {
            return curr.path.add(curr.p.toString());
        }

        for (const aNode of getAdjacentNodes(grid, curr.p, opts)) {
            if (!curr.path.has(aNode.toString())) {
                curr.path.add(aNode.toString());
                queue.push.apply(queue, getAdjacentNodes(grid, curr.p, opts)
                    .map(a => ({ p: a, path: new Set(curr!.path).add(curr!.p.toString()) }))
                );
            }
        }
    }

    return new Set();
}

export function getPathBFS<T extends string | number[]>(grid: Grid<T>, start: Point, opts: GraphSearchOptions<T>): Point[];
export function getPathBFS<T extends string | number[]>(grid: Grid<T>, start: Point, opts: GraphSearchOptions<T, true>): Point[][];
export function getPathBFS<T extends string | number[], All extends boolean>(grid: Grid<T>, start: Point, opts: GraphSearchOptions<T, All>): Point[][] | Point[] {
    const seen = new Set<string>();
    const goals = new Set<string>();
    const queue: PointAndPath[] = [{ p: start, path: [] }];
    const paths: Point[][] = [];

    let curr: PointAndPath | undefined;
    while ((curr = queue.shift())) {
        if (!seen.has(curr.p.toString() + ':' + curr.path.toString())) {
            if (opts.isGoal(grid.getAt(curr.p), curr.p)) {
                if (!opts.all) {
                    return curr.path.concat(curr.p);
                }
                goals.add(curr.toString());
                paths.push(curr.path.concat(curr.p));
            }

            for (const aNode of getAdjacentNodes(grid, curr.p, opts)) {
                if (!seen.has(aNode.toString())) {
                    seen.add(aNode.toString());
                    queue.push.apply(queue, getAdjacentNodes(grid, curr.p, opts)
                        .map(a => ({ p: a, path: curr!.path.concat(curr!.p) }))
                    );
                }
            }
        }
    }

    return opts.all ? paths : [];
}