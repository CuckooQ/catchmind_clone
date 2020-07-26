import { 
    handleNewUserNotification,
    handleDisconnected,
    handleEndedGame,
    handleStarting
} from "./notification";
import { handleNewMessage } from "./chat";
import { 
    handleBeganPath,
    handleStrokedPath,
    handleFilled
} from "./paint";
import { 
    handleUpdatingPlayer,
    handleStartedGame,
    handleNoticingWhoIsPainter,
} from "./players";

let socket = null;

const updateSocket = (newSocket) => {
    socket = newSocket;
}

export const getSocket = () => {
    return socket;
}

export const initSocket = (newSocket) => {
    const { events } = window;
    updateSocket(newSocket);
    socket.on(events.noticeNewUser, handleNewUserNotification);
    socket.on(events.disconnected, handleDisconnected);
    socket.on(events.sendMessage, handleNewMessage);
    socket.on(events.beganPath, handleBeganPath);
    socket.on(events.strokedPath, handleStrokedPath);
    socket.on(events.filled, handleFilled);
    socket.on(events.updatePlayerList, handleUpdatingPlayer);
    socket.on(events.startedGame, handleStartedGame);
    socket.on(events.noticeWhoIsPainter, handleNoticingWhoIsPainter);
    socket.on(events.endedGame, handleEndedGame);
    socket.on(events.starting, handleStarting);
}
