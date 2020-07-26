import { disableCanvas, hideControls, enableCanvas, showControls } from "./paint";
import { disableChat, enableChat } from "./chat";

const playerBoard = document.querySelector("#playerBoard");
const wordNotification= document.querySelector("#wordNotification");

const addPlayer = (players) => {
    playerBoard.innerHTML = "";
    players.forEach(player => {
        const playerElement = document.createElement("span");
        playerElement.innerText = `${player.name}: ${player.points}`;
        playerBoard.appendChild(playerElement);
    });
}

export const setWordNotification = (word) => {
    wordNotification.innerText = ""; 
    wordNotification.innerText = word;
}

export const handleUpdatingPlayer = (data) => {
    const { sockets } = data;
    addPlayer(sockets);
}

export const handleStartedGame = () => {
    setWordNotification("");
    disableCanvas();
    hideControls();
    enableChat();
}

export const handleNoticingWhoIsPainter = (data) => {
    const { word } = data;
    enableCanvas();
    showControls();
    disableChat();
    setWordNotification(`You are painter. Word: '${word}'.`);
}
