// socket/index.js
import { socketAuthenticate } from "../middleware/socketMiddleware.js";
import rfidSocket from "./modules/rfid.socket.js";

export default function initSocket(io) {

  // MIDDLEWARE
  io.use(socketAuthenticate);

  io.on("connection", (socket) => {

    rfidSocket(io, socket);

    socket.on("disconnect", () => {
    });
  });
}
