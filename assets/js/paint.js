import { getSocket } from "./socket";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("color");
const mode = document.getElementById("mode");
const controls = document.getElementById("controls");

const INITIAL_COLOR = "#2c2c2c";
const CANVAS_SIZE = 700;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5;

let painting = false;
let filling = false;

const stopPainting = () => {
    painting = false;
}

const startPainting = () => {
    painting = true;
}

const beginPath = (x, y, color = null) => {
    if (color) {
        ctx.strokeStyle = color;
    }
    ctx.beginPath();
    ctx.moveTo(x, y);
};

const strokePath = (x, y, color = null) => {
    if (color) {
        ctx.strokeStyle = color;
    }
    ctx.lineTo(x, y);
    ctx.stroke();
};

const fill = (color = null) => {
  if (color) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  }
}

const onMouseMove = (event) => {
    const x = event.offsetX;
    const y = event.offsetY;
    const socket = getSocket();

    if (!painting) {
        beginPath(x, y);
        socket.emit(window.events.beginPath, { 
            x, 
            y, 
            color: ctx.strokeStyle 
        });
    } else {
        strokePath(x, y);
        socket.emit(window.events.strokePath, { 
            x, 
            y, 
            color: ctx.strokeStyle 
        });
    }
}

const handleColorClick = (event) => {
    const color = event.target.style.backgroundColor;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
}

const handleModeClick = () => {
    if (filling === true) {
        filling = false;
        mode.innerText = "Fill";
    } else {
        filling = true;
        mode.innerText = "Paint";
    }
} 

const handleCanvasClick = () => {
    if (filling) {
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        const socket = getSocket();
        socket.emit(window.events.fill, {color: ctx.fillStyle })
    }
}

const handleCM = (event) =>{
    event.preventDefault();
}

export const handleBeganPath = (data) => {
    const { x, y, color } = data;
    beginPath(x, y, color);
}
export const handleStrokedPath = (data) => {
    const { x, y, color } = data;
    strokePath(x, y, color);
}

export const handleFilled = (data) => {
    const { color } = data;
    fill(color);
}

export const enableCanvas = () => {
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);
    canvas.addEventListener("click", handleCanvasClick);
    canvas.addEventListener("contextmenu", handleCM);
}

export const disableCanvas = () => {
    canvas.removeEventListener("mousemove", onMouseMove);
    canvas.removeEventListener("mousedown", startPainting);
    canvas.removeEventListener("mouseup", stopPainting);
    canvas.removeEventListener("mouseleave", stopPainting);
    canvas.removeEventListener("click", handleCanvasClick);
}

export const showControls = () => {
    controls.style.opacity = 1;
}

export const hideControls = () => {
    controls.style.opacity = 0;
}

export const resetCanvas = () => {
    fill("#fff");
}

if (canvas) {
    disableCanvas();
}

Array.from(colors).forEach(color =>
    color.addEventListener("click", handleColorClick)
);

if (mode) {
    mode.addEventListener("click", handleModeClick);
}
