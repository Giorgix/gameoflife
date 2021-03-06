
const patterns = (function () {
    function _parsePattern(patternString) {
        return function(grid, offset) {
            const lines = patternString.split('\n');
            lines.forEach((line, lineIndex) => {
                for (let index = 0; index < line.trim().length; index++) {
                    const element = line.trim()[index];
                    if (element === 'O') {
                        grid[offset + index][offset + lineIndex] = 1;
                    }
                }
            })
        }
    };
    return {
        /*
        * !Name: Gosper glider gun
        * !Author: Bill Gosper
        * !The first known gun and the first known finite pattern with unbounded growth.
        * !www.conwaylife.com/wiki/index.php?title=Gosper_glider_gun
        */
        gliderGun: _parsePattern(`
        ........................O
        ......................O.O
        ............OO......OO............OO
        ...........O...O....OO............OO
        OO........O.....O...OO
        OO........O...O.OO....O.O
        ..........O.....O.......O
        ...........O...O
        ............OO
        `),
        /**
         * !Name: Bi-gun
         * !Author: Bill Gosper
         * !A true period 46 double-barreled glider gun.
         * !www.conwaylife.com/wiki/index.php?title=Bi-gun
         */
        doubleBarreledGun: _parsePattern(`
        ...........O
        ..........OO
        .........OO
        ..........OO..OO
        ......................................O
        ......................................OO........OO
        .......................................OO.......OO
        ..........OO..OO..................OO..OO
        OO.......OO
        OO........OO
        ...........O
        ..................................OO..OO
        .......................................OO
        ......................................OO
        ......................................O
        `) ,
        /*
        * 2-engine Cordership
        * ! 2-engine Cordership
        * ! Aidan F. Pierce
        * ! The smallest known Cordership.
        * ! http://conwaylife.com/wiki/2-engine_Cordership
        */
        twoEngineShip: _parsePattern(`
        ...................OO....................
        ...................OOOO..................
        ...................O.OO..................
        .........................................
        ....................O....................
        ...................OO....................
        ...................OOO...................
        .....................O...................
        .................................OO......
        .................................OO......
        .........................................
        .........................................
        .........................................
        .........................................
        .........................................
        .........................................
        ....................................O....
        ...................................OO....
        ..................................O...O..
        ...................................OO..O.
        ........................................O
        .....................................O.O.
        ......................................O..
        ......................................O..
        ......................................OO.
        ......................................OO.
        .........................................
        .........................................
        .............O..........O................
        ............OOOOO.....O.OO...........O...
        ...........O..........O...O.........O....
        ............OO........OOO.O.........OO...
        .............OO.........OO............O..
        OO.............O.....................OOO.
        OO...................................OOO.
        .........................................
        .........................................
        .........................................
        .........................................
        .........................................
        .........................................
        ........OO...............................
        ........OO...........OO..................
        ...................OO..O.................
        ........................O...O............
        ..................O.....O...O............
        ...................O..OO...O.O...........
        ....................OOO.....O............
        ............................O............
        `),
        /**
         * ! Copperhead
         * ! 'zdr'
         * ! An c/10 orthogonal spaceship found on March 5, 2016.
         * ! http://www.conwaylife.com/wiki/Copperhead
         */
        copperHead: _parsePattern(`
        .OO..OO.
        ...OO...
        ...OO...
        O.O..O.O
        O......O
        ........
        O......O
        .OO..OO.
        ..OOOO..
        ........
        ...OO...
        ...OO...
        `),
        /**
         * !Name: Weekender
         * !Author: David Eppstein
         * !A period 7 spaceship with speed 2c/7.
         * !www.conwaylife.com/wiki/index.php?title=Weekender
         */
        weekender: _parsePattern(`
        .O............O
        .O............O
        O.O..........O.O
        .O............O
        .O............O
        ..O...OOOO...O
        ......OOOO
        ..OOOO....OOOO
        ................
        ....O......O
        .....OO..OO
        `)
    }
})();