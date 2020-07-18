'use strict'
var createGame = ({width, height, fps, offset, initialPattern}) => (function(width, height, fps, offset, initialPattern = 'random', patterns) {
    let grid = [];
    let generationsCount;
    let mirrorGrid = [];
    let fpsInterval;
    let then;
    let canvas;
    let context;
    let generationsInfo;
    let container;
    let animationRequest;
    let cellsInfo;
    let liveCount;
    let paused = false;

    // getters
    function getWidth() {
        return width;
    }
    function getHeight() {
        return height;
    }

    // setters
    function setFps(value) {
        fps = value;
        fpsInterval = 1000 / fps;
    }

    // public API
    function pause() {
        paused = true;
    }
    function play() {
        paused = false;
    }
    function init() {
        if (!canvas) {
            fpsInterval = 0;
            liveCount = 0;
            generationsCount = 0;
            container = container || document.createElement("div");
            //container.classList.add("container");
            document.body.appendChild(container);
    
            // Create grids
            grid = _createArray(width);
            mirrorGrid = _createArray(width);
    
            // Create the starting state for main grid with random cells
            setPattern(initialPattern);
            //_createGliderGun();
    
            // Set variables to control fps rendering
            fpsInterval = 1000 / fps;
            then = Date.now();
    
            // Create and set canvas variables to control painting
            canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            canvas.style = "border:1px solid #000000;";
            context = canvas.getContext("2d");
            context.fillStyle = "#FF0000";
    
            // Create info text elements
            generationsInfo = document.createElement("h3");
            container.appendChild(generationsInfo);
    
            cellsInfo = document.createElement("h4");
            container.appendChild(cellsInfo);
    
            // controls UI
            //_createControls();
    
            // Insert canvas element inside body
            container.appendChild(canvas);
    
            // Paint initial cells state and controls
            _drawGrid();
            _paintGameInfo();
        }
    };

    function destroy() {
        container.innerHTML = "";
        canvas = null;
        context = null;
        generationsInfo = null;
        cellsInfo = null;
        const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
        cancelAnimationFrame(animationRequest);
    }

    function start() {
        paused = false;
        _tick() //call main loop
    }

    function reset() {
        liveCount = 0;
        generationsCount = 0;
        _cleanGrid();
        setPattern(initialPattern);
        _drawGrid();
        _paintGameInfo();
    }

    function setPattern(pattern) {
        liveCount = 0;
        generationsCount = 0;
        switch (pattern) {
            case 'random':
                _fillRandom();
                break;
            case 'glider gun':
                _cleanGrid();
                patterns.gliderGun(grid, offset);
                break;
            case 'double barreled':
                _cleanGrid();
                patterns.doubleBarreledGun(grid, offset);
                break;
            case 'two engine ship':
                _cleanGrid();
                patterns.twoEngineShip(grid, offset);
                break;
            case 'copperhead':
                _cleanGrid();
                patterns.copperHead(grid, offset);
                break;
            case 'weekender':
                _cleanGrid();
                patterns.weekender(grid, offset);
                break;
            default:
                _fillRandom();
                break;
        }
    }

    // Private methods
    function _createControls() {
        let controlsContainer = document.createElement("div");
        controlsContainer.style = "display: block";

        // START
        let startButton = document.createElement("button");
        startButton.onclick = start;
        startButton.textContent = 'START';
        controlsContainer.appendChild(startButton);

        // RESET
        let resetButton = document.createElement("button");
        resetButton.onclick = reset;
        resetButton.textContent = 'RESET';
        controlsContainer.appendChild(resetButton);

        // PAUSE
        let pauseButton = document.createElement("button");
        pauseButton.onclick = pause;
        pauseButton.textContent = 'Pause';
        controlsContainer.appendChild(pauseButton);

        // PLAY
        let playButton = document.createElement("button");
        playButton.onclick = play;
        playButton.textContent = 'Play';
        controlsContainer.appendChild(playButton);

        container.appendChild(controlsContainer);
    }
    function _updateGrid() {//perform one iteration of grid update
        for (var j = 1; j < height - 1; j++) { //iterate through rows
            for (var k = 1; k < width - 1; k++) { //iterate through columns
                var totalCells = 0;
                //add up the total values for the surrounding cells
                totalCells += grid[j - 1][k - 1]; //top left
                totalCells += grid[j - 1][k]; //top center
                totalCells += grid[j - 1][k + 1]; //top right

                totalCells += grid[j][k - 1]; //middle left
                totalCells += grid[j][k + 1]; //middle right

                totalCells += grid[j + 1][k - 1]; //bottom left
                totalCells += grid[j + 1][k]; //bottom center
                totalCells += grid[j + 1][k + 1]; //bottom right

                //apply the rules to each cell
                switch (totalCells) {
                    case 2:
                        mirrorGrid[j][k] = grid[j][k];
                        break;
                    case 3:
                        mirrorGrid[j][k] = 1; //live
                        break;
                    default:
                        mirrorGrid[j][k] = 0; //
                }
            }
        }

        //mirror edges to create wraparound effect
        for (var l = 1; l < height - 1; l++) { //iterate through rows
            //top and bottom
            mirrorGrid[l][0] = mirrorGrid[l][height - 3];
            mirrorGrid[l][height - 2] = mirrorGrid[l][1];
            //left and right
            mirrorGrid[0][l] = mirrorGrid[height - 3][l];
            mirrorGrid[height - 2][l] = mirrorGrid[1][l];
        }


        //swap grids
        var temp = grid;
        grid = mirrorGrid;
        mirrorGrid = temp;

        generationsCount++;
    };
    function _drawGrid() { //draw the contents of the grid onto a canvas
        liveCount = 0;
        context.clearRect(0, 0, height, width); //this should clear the canvas ahead of each redraw
        for (var j = 1; j < height; j++) { //iterate through rows
            for (var k = 1; k < width; k++) { //iterate through columns
                if (grid[j][k] === 1) {
                    context.fillRect(j, k, 1, 1);
                    liveCount++;
                }
            }
        }
    };
    function _paintGameInfo() {
        const realWidth = width - (offset * 2);
        const realHeight = height - (offset * 2);
        const alivePercentage = ((liveCount/(realWidth * realHeight)) * 100).toFixed(2);
        cellsInfo.textContent = `${alivePercentage} % of cells alive | ${liveCount} alive out of ${realWidth * realHeight} total cells`;
        generationsInfo.textContent = generationsCount + 'th generation';
    };
    function _tick() { //main loop
        animationRequest = window.requestAnimationFrame(_tick);
        const now = Date.now();
        const elapsed = now - then;

        // if enough time has elapsed, draw the next frame

        if ((elapsed > fpsInterval) && !paused) {

            // Get ready for next frame by setting then=now, but also adjust for your
            // specified fpsInterval not being a multiple of RAF's interval (16.7ms)
            then = now - (elapsed % fpsInterval);

            // Draw and update the grid and info
            _drawGrid();
            _updateGrid();
            _paintGameInfo();

        }
    };
     function _createArray() { //creates a 2 dimensional array of required height
        var arr = [];
        for (var i = 0; i < width; i++) {
            arr[i] = [];
        }
        return arr;
    };
    function _fillRandom() { //fill the grid randomly
        for (var j = offset; j < height - offset; j++) { //iterate through rows
            for (var k = offset; k < width - offset; k++) { //iterate through columns
                grid[j][k] = Math.round(Math.random());
            }
        }
    }
    function _cleanGrid() { //fill the grid randomly
        for (var j = 1; j < height; j++) { //iterate through rows
            for (var k = 1; k < width; k++) { //iterate through columns
                grid[j][k] = 0;
            }
        }
    }

    return {
        getWidth,
        getHeight,
        setFps,
        pause,
        play,
        init,
        start,
        reset,
        setPattern,
        destroy
    }

})(width, height, fps, offset, initialPattern, patterns);