"use strict";

const map = [];
const mapWidth = 26;
const mapHeight = 20;
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const images = {
    wall: document.getElementById("wall"),
    apple: document.getElementById("apple")
}
const snake = {
    x: Math.floor(mapWidth / 2),
    y: Math.floor(mapHeight / 2),
    cells: [],
    maxCells: 4,
    deltaX: 0,
    deltaY: 0
};



let apple = null;

// firefox image load fix
// await Promise.all(
//     Object.values(images).map(img => new Promise(resolve => {
//         const listner = () => {
//             resolve();
//             img.removeEventListener("load", listner);
//         };
//         img.addEventListener("load", listner);
//     }))
// );

function startGame() {
    const hardcoreMode = confirm("Хотите усложнить игру?");
    generateMap(hardcoreMode);
}

startGame();

function generateMap(hardcoreMode) {
    for (let x = 0; x < mapWidth; x++) {
        map.push([]);
        for (let y = 0; y < mapHeight; y++) {
            if (hardcoreMode) {
                map[x].push((y === 0 || y === mapHeight - 1) || (x === 0 || x === mapWidth - 1) || (Math.random() < 0.2));
            }
            else {
                map[x].push((y === 0 || y === mapHeight - 1) || (x === 0 || x === mapWidth - 1));
            }

        }
    }
}

// let gameLoopIntervalId = setInterval(loop, 200);
let gameLoopIntervalId = setInterval(loop, 500);

function loop() {
    update();
    draw();
    // gameLoopIntervalId = setTimeout(loop, 500);
}

function update() {
    if (snake.deltaX === 0 && snake.deltaY === 0) {
        return;
    }
    if (snake.maxCells > snake.cells.length) {
        snake.cells.unshift({
            x: snake.x,
            y: snake.y,
        });
    } else {
        for (let i = snake.cells.length - 1; i > 0; i--) {
            snake.cells[i].x = snake.cells[i - 1].x;
            snake.cells[i].y = snake.cells[i - 1].y;
        }
        snake.cells[0].x = snake.x;
        snake.cells[0].y = snake.y;
    }

    snake.x += snake.deltaX;
    snake.y += snake.deltaY;

    if (apple) {
        if (snake.x === apple.x && snake.y === apple.y) {
            apple = null;
            snake.maxCells++;
        }
    }

    if (apple === null) {
        const freeCells = [];
        for (let x = 1; x < mapWidth - 1; x++) {
            for (let y = 1; y < mapHeight - 1; y++) {
                if (
                    !map[x][y] &&
                    snake.x !== x && snake.y !== y &&
                    !snake.cells.some(c => c.x === x && c.y === y)
                ) {
                    freeCells.push({ x, y });
                }
            }
        }

        if (freeCells.length > 0) {
            apple = freeCells[Math.floor(Math.random() * freeCells.length)];
        } else {
            stopGame(true);
            return;
        }
    }

    if (snake.cells.some(c => c.x === snake.x && c.y === snake.y)) {
        stopGame(false);
    }

    if (snake.x <= 0) {
        snake.x = mapWidth - 2;
    }

    if (snake.x >= mapWidth - 1) {
        snake.x = 1;
    }

    if (snake.y <= 0) {
        snake.y = mapHeight - 2;
    }

    if (snake.y >= mapHeight - 1) {
        snake.y = 1;
    }

    if (map[snake.x][snake.y]) {
        stopGame(false);
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#accea2"; // заливка фона
    context.rect(0, 0, canvas.width, canvas.height);
    context.fill();

    // отрисовка стен
    for (let x = 0; x < mapWidth; x++) {
        for (let y = 0; y < mapHeight; y++) {
            if (map[x][y]) {
                context.drawImage(
                    images.wall,
                    x * canvas.width / mapWidth,
                    y * canvas.height / mapHeight,
                    canvas.width / mapWidth,
                    canvas.height / mapHeight
                );
            }
        }
    }

    // отрисовка сегментов змеи
    context.strokeStyle = "#00b702";
    context.lineWidth = Math.min(canvas.width / mapWidth, canvas.height / mapHeight) / 2;
    context.beginPath();
    context.moveTo(
        (snake.x + 0.5) * canvas.width / mapWidth,
        (snake.y + 0.5) * canvas.height / mapHeight,
    );
    for (let i = 0; i < snake.cells.length; i++) {
        context.lineTo(
            (snake.cells[i].x + 0.5) * canvas.width / mapWidth,
            (snake.cells[i].y + 0.5) * canvas.height / mapHeight
        );
    }
    context.stroke();

    context.lineWidth = 1;
    // отрисовка сегментов змеи
    context.fillStyle = "#05d908";
    context.strokeStyle = "rgba(0,0,0,0)";
    for (const sc of snake.cells) {
        context.beginPath();
        context.arc(
            (sc.x + 0.5) * canvas.width / mapWidth,
            (sc.y + 0.5) * canvas.height / mapHeight,
            Math.min(canvas.width / mapWidth, canvas.height / mapHeight) / 3,
            0,
            Math.PI * 2
        );
        context.stroke();
        context.fill();
    }

    // отрисовка головы
    context.fillStyle = "#ff0000";
    context.strokeStyle = "#000000"
    context.beginPath();
    context.arc(
        (snake.x + 0.5) * canvas.width / mapWidth,
        (snake.y + 0.5) * canvas.height / mapHeight,
        Math.min(canvas.width / mapWidth, canvas.height / mapHeight) / 3,
        0,
        Math.PI * 2
    );
    context.stroke();
    context.fill();

    // отрисовка яблока
    if (apple) {
        context.fillStyle = "#c33";
        context.beginPath();

        context.drawImage(
            images.apple,
            (apple.x) * canvas.width / mapWidth,
            (apple.y) * canvas.height / mapHeight,
            canvas.width / mapWidth,
            canvas.height / mapHeight
        )

        context.stroke();
        context.fill();
    }
}

function stopGame(isWin = false) {
    alert(`Вы ${ isWin ? "выиграли" : "проиграли" }!\nСчёт: ${ snake.maxCells }`);
    clearInterval(gameLoopIntervalId);
}

addEventListener("keydown", ev => {
    if ((ev.code === "KeyW" || ev.code === "ArrowUp") && (snake.deltaY === 0)) {
        // snake.y = snake.y - 1;
        snake.deltaX = 0;
        snake.deltaY = -1;
    }
    if ((ev.code === "KeyS" || ev.code === "ArrowDown") && (snake.deltaY === 0)) {
        // snake.y = snake.y + 1;
        snake.deltaX = 0;
        snake.deltaY = 1;
    }
    if ((ev.code === "KeyA" || ev.code === "ArrowLeft") && (snake.deltaX === 0)) {
        // snake.x = snake.x - 1;
        snake.deltaX = -1;
        snake.deltaY = 0;
    }
    if ((ev.code === "KeyD" || ev.code === "ArrowRight") && (snake.deltaX === 0)) {
        // snake.x = snake.x + 1;
        snake.deltaX = 1;
        snake.deltaY = 0;
    }
    if (ev.code === "KeyQ") {
        // snake.x = snake.x + 1;
        snake.maxCells += 1;
    }
});

loop();
