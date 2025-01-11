import blessed from 'blessed';

export enum TerminalBlock {
    white = '\u2591',
    black = '\u2593',
};

export function newScreen(bg: string, fg: string) {
    const screen = blessed.screen({
        fastCSR: true,
    });

    screen.key(['q', 'S-q', 'C-c'], () => {
        screen.destroy();
        process.exit();
    });

    const mainContainer = blessed.box({
        parent: screen,
        height: '100%',
        width: '100%',
        style: {
            bg,
            fg,
        },
    });

    screen.render();

    return [screen, mainContainer];
}