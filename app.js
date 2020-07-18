(function() {
    let game;
    function selectPattern(selectedObject) {
        game.changePattern(selectedObject.value);
    };
    
    document.querySelector('#initForm').addEventListener('submit', event => {
        event.preventDefault();
        const width = Number(event.target.elements.namedItem("size").value) || document.querySelector('.container').offsetWidth - 32;
        if (game) {
            game.destroy();
            game = null;
        }
        game = createGame({
            width: width,
            height: width,
            fps: Number(event.target.elements.namedItem("fps").value) || 30,
            offset: Number(event.target.elements.namedItem("offset").value) || Math.round(width / 10),
            initialPattern: event.target.elements.namedItem("pattern").value
        });
        game.init();
        document.querySelector('#controls').style.display = "block";
    });

    document.querySelector('#startBtn').addEventListener('click', event => {
        game.start();
    });
    document.querySelector('#resetBtn').addEventListener('click', event => {
        game.reset();
    });
    document.querySelector('#playBtn').addEventListener('click', event => {
        game.play();
    });
    document.querySelector('#pauseBtn').addEventListener('click', event => {
        game.pause();
    });
})()
