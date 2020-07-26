import express from "express";
import morgan from "morgan";
import socketIO from "socket.io";
import { join } from "path";

import events from "./events";
import { handleSocket } from "./socketController";


const app = express();

// View settings
app.set("view engine", "pug");
app.set("views", join(__dirname, "views"));

// Static settings
app.use(express.static(join(__dirname, "static")));

// <iddleware settings
app.use(morgan("dev"));

// Router settings
app.get("/", (req, res) => {res.render("home", { events: JSON.stringify(events) })});

// Server
const handleListening = () => {
    console.log("Server Started");
}

const server = app.listen(4000, handleListening);

// Socket
const io = socketIO(server);
io.on("connection", (socket) => handleSocket(socket, io));
