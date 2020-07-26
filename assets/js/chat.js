import { getSocket } from "./socket";

const messages = document.querySelector("#messages");
const messageForm = document.querySelector("#messageForm");

const appendMessage= (text, name) => {
    const li = document.createElement("li");
    const displayedName = name ? name: "You";
    li.innerHTML = `
        <span class="author ${ displayedName != "You" ? "others": "me" }">${displayedName}</span>
        : ${text}
    `;
    messages.append(li);
}

const handleSendMessage = (event) => {
    event.preventDefault();
    const input = messageForm.querySelector("input");
    const { value } = input;
    const { events } =window;
    const socket = getSocket();
    socket.emit(events.sendMessage, {message: value});
    input.value = "";
    appendMessage(value, null);
}

export const handleNewMessage = (data) => {
    const { message, name } = data;
    appendMessage(message, name);
}

export const disableChat = () => {
    messageForm.style.display = "none";
}

export const enableChat = () => {
    messageForm.style.display = "flex";
}

if (messageForm) {
    messageForm.addEventListener("submit", handleSendMessage);
}