import { Point } from "./point";
import { Grid } from "./util";

type AdjacentNodeCheck<T extends string | number[]> = (nodeValue: T[number], possiblyAdjacentNodeValue: T[number]) => boolean;

type SearchOptions<T extends string | number[], All extends boolean = false> = {
    all?: All,
    includeDiagonals: boolean,
    isAdjacent?: AdjacentNodeCheck<T>;
    isGoal: (value: T[number]) => boolean
}


function getAdjacentNodes<T extends string | number[]>(grid: Grid<T>, point: Point, { includeDiagonals, isAdjacent = () => true }: { includeDiagonals: boolean, isAdjacent?: AdjacentNodeCheck<T> }): Point[] {
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
        if (grid.hasPoint(aNode) && isAdjacent(grid.getAt(point), grid.getAt(aNode))) {
            nodes.push(aNode)
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
        const p = stack.pop()!;
        if (!seen.has(p.toString())) {
            if (opts.isGoal(grid.getAt(p))) {
                if (!opts.all) {
                    return p;
                }
                goals.add(p.toString())
            }
            seen.add(p.toString());
            stack.push.apply(stack, getAdjacentNodes(grid, p, opts));
        }
    }

    return goals;
}

type PointAndPath = {
    p: Point,
    path: Point[],
}
export function getPathDFS<T extends string | number[]>(grid: Grid<T>, start: Point, opts: SearchOptions<T>): Point[];
export function getPathDFS<T extends string | number[]>(grid: Grid<T>, start: Point, opts: SearchOptions<T, true>): Point[][];
export function getPathDFS<T extends string | number[], All extends boolean>(grid: Grid<T>, start: Point, opts: SearchOptions<T, All>): Point[][] | Point[] {
    const seen = new Set<string>();
    const goals = new Set<string>();
    const stack: PointAndPath[] = [{ p: start, path: [] }];
    const paths: Point[][] = [];

    while (stack.length) {
        const curr = stack.pop()!;
        if (!seen.has(curr.p.toString() + ':' + curr.path.toString())) {
            if (opts.isGoal(grid.getAt(curr.p))) {
                if (!opts.all) {
                    return curr.path.concat(curr.p);
                }
                goals.add(curr.toString())
                paths.push(curr.path.concat(curr.p))
            }
            seen.add(curr.toString());
            stack.push.apply(stack, getAdjacentNodes(grid, curr.p, opts)
                .map(a => ({ p: a, path: curr.path.concat(curr.p) }))
            );
        }
    }

    return paths;
}

export function BFS<T extends string | number[]>(grid: Grid<T>, start: Point, opts: SearchOptions<T>): Point;
export function BFS<T extends string | number[]>(grid: Grid<T>, start: Point, opts: SearchOptions<T, true>): Set<string>;
export function BFS<T extends string | number[], All extends boolean>(grid: Grid<T>, start: Point, opts: SearchOptions<T, All>): Set<string> | Point {
    const goals = new Set<string>();
    const stack: Point[] = [start];
    const seen = new Set<string>(start.toString());

    while (stack.length) {
        const p = stack.shift()!;
        if (opts.isGoal(grid.getAt(p))) {
            if (!opts.all) {
                return p;
            }
            goals.add(p.toString());
        }

        for (const aNode of getAdjacentNodes(grid, p, opts)) {
            if (!seen.has(aNode.toString())) {
                seen.add(aNode.toString());
                stack.push(aNode);
            }
        }
    }

    return goals;
}