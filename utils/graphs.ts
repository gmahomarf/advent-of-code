import { Point } from "./point";
import { Grid } from './grid';

export type AdjacentNodeCheck<T extends string | number[]> =
    (
        nodeValue: T[number],
        possiblyAdjacentNodeValue: T[number],
        nodePoint: Point,
        possibleAdjacentNodePoint: Point,
    ) => boolean;

type SearchOptions<T extends string | number[], All extends boolean = false> = {
    all?: All,
    includeDiagonals: boolean,
    isAdjacent?: AdjacentNodeCheck<T>;
    isGoal: (value: T[number], point: Point) => boolean;
};


function getAdjacentNodes<T extends string | number[]>(grid: Grid<T>, point: Point, { includeDiagonals, isAdjacent = () => true }: { includeDiagonals: boolean, isAdjacent?: AdjacentNodeCheck<T>; }): Point[] {
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
        const aNode = point.plus(x, y);
        if (grid.hasPoint(aNode) && isAdjacent(grid.getAt(point), grid.getAt(aNode), point, aNode)) {
            nodes.push(aNode);
        }
    });

    return nodes;
}

export function DFS<T extends string | number[]>(grid: Grid<T>, start: Point, opts: SearchOptions<T>): Point;
export function DFS<T extends string | number[]>(grid: Grid<T>, start: Point, opts: SearchOptions<T, true>): Set<string>;
export function DFS<T extends string | number[], All extends boolean>(grid: Grid<T>, start: Point, opts: SearchOptions<T, All>): Set<string> | Point {
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
export function getPathDFS<T extends string | number[]>(grid: Grid<T>, start: Point, opts: SearchOptions<T>): Point[];
export function getPathDFS<T extends string | number[]>(grid: Grid<T>, start: Point, opts: SearchOptions<T, true>): Point[][];
export function getPathDFS<T extends string | number[], All extends boolean>(grid: Grid<T>, start: Point, opts: SearchOptions<T, All>): Point[][] | Point[] {
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

export function BFS<T extends string | number[]>(grid: Grid<T>, start: Point, opts: SearchOptions<T>): Point | null;
export function BFS<T extends string | number[]>(grid: Grid<T>, start: Point, opts: SearchOptions<T, true>): Set<string>;
export function BFS<T extends string | number[], All extends boolean>(grid: Grid<T>, start: Point, opts: SearchOptions<T, All>): Set<string> | Point | null {
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

export function getPathBFS<T extends string | number[]>(grid: Grid<T>, start: Point, opts: SearchOptions<T>): Point[];
export function getPathBFS<T extends string | number[]>(grid: Grid<T>, start: Point, opts: SearchOptions<T, true>): Point[][];
export function getPathBFS<T extends string | number[], All extends boolean>(grid: Grid<T>, start: Point, opts: SearchOptions<T, All>): Point[][] | Point[] {
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