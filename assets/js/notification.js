import { resetCanvas } from "./paint";
import { setWordNotification } from "./players";

const BLUE = "rgb(0, 122, 255)";
const ORANGE = "rgb(255, 149, 0)";
const RED = "rgb(255, 59, 48)";
const GREEN = "rgb(76, 217, 100)";

const notifications = document.querySelector("#notifications");

export const popUpNotificaion = (text, color) => {
    const notification= document.createElement("div");
    notification.innerText = text;
    notification.style.backgroundColor = color;
    notification.className = "notification";
    notifications.append(notification);
}

export const handleNewUserNotification = (data) => {
    const { name } = data;
    popUpNotificaion(`${name} Joined!`, BLUE);
}

export const handleDisconnected = (data) => {
    const { name } = data;
    popUpNotificaion(`${name} Disconnected!`, ORANGE);
}

export const handleEndedGame = () => {
    popUpNotificaion("GAME ENDED.", RED);
    setWordNotification("");
    resetCanvas();
}

export const handleStarting = () => {
    popUpNotificaion("GAME WILL START SOON.", GREEN);
}
