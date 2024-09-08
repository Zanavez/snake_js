"use strict";

const map = [];
const mapWidth = 16;
const mapHeight = 12;
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const images = {
    wall: document.getElementById("wall"),
    apple: document.getElementById("apple")
}
const snake = {
    x: 1, //Math.floor(mapWidth / 2),
    y: Math.floor(mapHeight / 2),
    cells: [],
    maxCells: 4,
    deltaX: 1,
    deltaY: 0
};
let apple = null;

// firefox image load fix
await Promise.all(
    Object.values(images).map(img => new Promise(resolve => {
        const listner = () => {
            resolve();
            img.removeEventListener("load", listner);
        };
        img.addEventListener("load", listner);
    }))
);

for (let x = 0; x < mapWidth; x++) {
    map.push([]);
    for (let y = 0; y < mapHeight; y++) {
        map[x].push((y === 0 || y === mapHeight - 1) || (x === 0 || x === mapWidth - 1));
    }
}

let gameLoopIntervalId = setInterval(loop, 500);

function loop() {
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


// отрисовка

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#8fb082";
    context.rect(0, 0, canvas.width, canvas.height);
    context.fill();

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

    context.fillStyle = "#555";
    context.strokeStyle = "#ffffff";
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

    context.fillStyle = "#000000";
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

    if (apple) {
        context.fillStyle = "#c33";
        context.beginPath();
        context.arc(
            (apple.x + 0.5) * canvas.width / mapWidth,
            (apple.y + 0.5) * canvas.height / mapHeight,
            Math.min(canvas.width / mapWidth, canvas.height / mapHeight) / 3,
            0,
            Math.PI * 2
        );
        context.stroke();
        context.fill();
    }
}

function stopGame(isWin = false) {
    alert(`Вы ${ isWin ? "выиграли" : "проиграли" }!\nСчёт: ${ snake.maxCells }`);
    clearInterval(gameLoopIntervalId);
}

addEventListener("keydown", ev => {
    if (ev.code === "KeyW" || ev.code === "ArrowUp") {
        // snake.y = snake.y - 1;
        snake.deltaX = 0;
        snake.deltaY = -1;
    }
    if (ev.code === "KeyS" || ev.code === "ArrowDown") {
        // snake.y = snake.y + 1;
        snake.deltaX = 0;
        snake.deltaY = 1;
    }
    if (ev.code === "KeyA" || ev.code === "ArrowLeft") {
        // snake.x = snake.x - 1;
        snake.deltaX = -1;
        snake.deltaY = 0;
    }
    if (ev.code === "KeyD" || ev.code === "ArrowRight") {
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

