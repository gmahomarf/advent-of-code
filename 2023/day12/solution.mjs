import memoizee from 'memoizee';

export const possibilitiesMemoized = memoizee(
    /**
     *
     * @param {string[]} springs
     * @param {number[]} groups
     * @returns
     */
    function (springs, groups) {
        if (springs[0] === '.') {
            return possibilitiesMemoized(springs.slice(1), groups);
        }

        if (!groups.length) {
            if (!springs.length || !springs.includes('#')) {
                return 1;
            }

            return 0;
        }

        if (!springs.length) {
            return 0;
        }

        if (springs[0] === '?') {
            return possibilitiesMemoized(['#'].concat(springs.slice(1)), groups)
                + possibilitiesMemoized(springs.slice(1), groups);
        }

        if (fits(springs, groups[0])) {
            return possibilitiesMemoized(springs.slice(groups[0] + 1), groups.slice(1));
        }

        return 0;
    }, {
    primitive: true,
    length: 2
});

/**
 *
 * @param {string[]} springs
 * @param {number} groupLength
 * @returns {string[]}
 */
function fits(springs, groupLength) {
    if (groupLength > springs.length) {
        return false;
    }

    return !springs.slice(0, groupLength).includes('.')
        && (
            groupLength === springs.length
            || springs[groupLength] !== '#'
        );
}


/**
     *
     * @param {string[]} springs
     * @param {number[]} groups
     * @param {string} history
     * @returns
     */
export function possibilitiesDebug(springs, groups, history) {
    if (springs[0] === '.') {
        return possibilitiesDebug(springs.slice(1), groups, history + springs[0]);
    }

    if (!groups.length) {
        if (!springs.length || !springs.includes('#')) {
            console.log(history + '.'.repeat(springs.length));
            return 1;
        }

        return 0;
    }

    if (!springs.length) {
        return 0;
    }

    if (springs[0] === '?') {
        return possibilitiesDebug(['#'].concat(springs.slice(1)), groups, history)
            + possibilitiesDebug(springs.slice(1), groups, history + '.');
    }

    if (fits(springs, groups[0])) {
        return possibilitiesDebug(
            springs.slice(groups[0] + 1),
            groups.slice(1),
            history + '#'.repeat(groups[0]) + (springs.length > groups[0] ? '.' : ''));
    }

    return 0;
}
