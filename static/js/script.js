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
    x: Math.floor(mapWidth / 2),
    y: Math.floor(mapHeight / 2),
    cells: [],
    maxCells: 4,
    deltaX: 0,
    deltaY: 0
};

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

function loop() {
    context.clearRect(0, 0, canvas.width, canvas.height);

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

    context.strokeStyle = "#ffffff";
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
    loop();
});

loop();
