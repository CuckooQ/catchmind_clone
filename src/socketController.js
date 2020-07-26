import events from "./events";
import { chooseWord } from "./words";

let sockets = [];
let isInProgress = false;
let selectedWord = "";
let painter = null;
let timeout = null;

const choosePainter = () => {
    const selectedIndex = Math.floor(Math.random() * sockets.length);
    const selectedPainter = sockets[selectedIndex];
    return selectedPainter;
}

const startGame = (io) => {
    if (!isInProgress) {
        isInProgress = true;
        painter = choosePainter();
        selectedWord = chooseWord();
        io.emit(events.starting, {});
        setTimeout(()=> {
            io.emit(events.startedGame, {});
            io.to(painter.id).emit(events.noticeWhoIsPainter, { word: selectedWord });
        }, 5 * 1000);
        timeout = setTimeout(() => {
            endGame(io);
        }, 60 * 1000);
    }
}

const endGame = (io) => {
    painter = null;
    isInProgress = false;
    io.emit(events.endedGame, {}); 
    clearTimeout(timeout);
    if (sockets.length >= 2) {
        setTimeout(() => {
            startGame(io);
        }, 5 * 1000);
    }
}

const updatePlayerList = (io) => {
    io.emit(events.updatePlayerList, { sockets });
}

const addSocket = (socket, name, io) => {
    sockets.push({id: socket.id, points: 0, name});
    updatePlayerList(io);
}

const removeSocket = (name, io) => {
    sockets = sockets.filter(socket => socket.name !== name);
    updatePlayerList(io);
}

const addPoints = (name, io) => {
    sockets.map(socket => {
        if(socket.name === name) {
            socket.points += 10;
        } 
    })
    updatePlayerList(io);
}

const handleSetName = (socket, data, io) => {
    const { name } = data;
    socket.name = name;
    addSocket(socket, name, io);
    socket.broadcast.emit(events.noticeNewUser, { name });

    if (sockets.length === 2) {
        startGame(io);
    }
}

const handleDisconnect = (socket, io) => {
    const { name } = socket;
    removeSocket(name, io);
    socket.broadcast.emit(events.disconnected, { name });

    if (sockets.length < 2 || painter.name === name) {
        endGame(io);
    }
}

const handleNewMessage = (socket, data, io) => {
    const { name } = socket;
    const { message } = data;
    socket.broadcast.emit(events.sendMessage, { name, message });
    if (message === selectedWord) {
        io.emit(events.sendMessage, { 
            name: "Bot", 
            message: `Winner is '${name}'. Word was '${selectedWord}'.` 
        });
        addPoints(name, io);
        selectedWord = "";
        endGame(io);
    }
}

const handleBeginingPath = (socket, data) => {
    const { x, y, color } = data;
    socket.broadcast.emit(events.beganPath, {x, y, color});
}

const handlestrokingPath = (socket, data) => {
    const { x, y, color } = data;
    socket.broadcast.emit(events.strokedPath, {x, y, color});
}

const handleFill = (socket, data) => {
    const { color } = data;
    socket.broadcast.emit(events.filled, { color });
}

export const handleSocket = (socket, io) => {
    socket.on(events.disconnect, () => handleDisconnect(socket, io));
    socket.on(events.setName, (data) => handleSetName(socket, data, io));
    socket.on(events.sendMessage, (data)=> handleNewMessage(socket, data, io));
    socket.on(events.beginPath, (data) => handleBeginingPath(socket, data));
    socket.on(events.strokePath, (data) => handlestrokingPath(socket, data));
    socket.on(events.fill, (data) => handleFill(socket, data));
}
