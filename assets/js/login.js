import { initSocket } from "./socket";

const LOGIN = "login";
const LOGOUT = "logout";
const LOCAL_STORAGE_NAME_KEY = "catchMindClone-name";

const body = document.querySelector("body");
const loginForm = document.querySelector("#loginBox");
const name = localStorage.getItem(LOCAL_STORAGE_NAME_KEY);

const login = (name) => {
    const socket = io("/");
    socket.emit(window.events.setName, { name });
    initSocket(socket);
}

const setLogin = () => {
    body.className = LOGIN;
    login(name);
}

const setLogout = () => {
    body.className = LOGOUT;
}

const handleLoginFormSubmit = (event) => {
    event.preventDefault();
    const input = loginForm.querySelector("input");
    const { value } = input;
    localStorage.setItem(LOCAL_STORAGE_NAME_KEY, value);
    input.value = "";
    setLogin();
}

if (name == null) {
    setLogout();
} else {
    setLogin();
}

if (loginForm) {
    loginForm.addEventListener("submit", handleLoginFormSubmit)
}

