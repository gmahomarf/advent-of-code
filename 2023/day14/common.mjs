import '../../utils/string.mjs';

export function tilt(grid, direction) {
    switch (direction) {
        case 'N':
        case 'S':
            return tiltV(grid, direction);
        case 'E':
        case 'W':
            return tiltH(grid, direction);
    }
}

export function getLoad(grid) {
    let load = 0;
    for (let y = 0; y < grid.length; y++) {
        load += grid[y].count('O') * (grid.length - y);
    }

    return load;
}

function tiltH(grid, direction) {
    const _grid = grid.slice();
    for (let y = 0; y < _grid.length; y++) {
        _grid[y] = _grid[y].replace(/\.*O[.O]*/g, g => {
            const o = g.count('O');
            return direction === 'W' ? 'O'.repeat(o) + '.'.repeat(g.length - o) : '.'.repeat(g.length - o) + 'O'.repeat(o);
        });
    }

    return _grid;
}

function tiltV(grid, direction) {
    const _grid = grid.slice();
    for (let x = 0; x < _grid[0].length; x++) {
        setCol(_grid, x, getCol(_grid, x)
            .replace(/\.*O[.O]*/g, g => {
                const o = g.count('O');
                return direction === 'N' ? 'O'.repeat(o) + '.'.repeat(g.length - o) : '.'.repeat(g.length - o) + 'O'.repeat(o);
            }));
    }

    return _grid;
}

function getCol(grid, x) {
    let c = '';
    for (const line of grid) {
        c += line[x];
    }

    return c;
}

function setCol(grid, x, col) {
    for (let y = 0; y < grid.length; y++) {
        grid[y] = grid[y].slice(0, x) + col[y] + grid[y].slice(x + 1);
    }
}
