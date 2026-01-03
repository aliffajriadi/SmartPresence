import cookie from "cookie";
import * as jwt from "../utils/helper/jwt.js";

export const socketAuthenticate = (socket, next) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) {
      return next(new Error("No cookie"));
    }

    const cookies = cookie.parse(cookieHeader);
    const token = cookies.token;

    if (!token) {
      return next(new Error("No token"));
    }

    const user = jwt.verifyToken(token);

    // simpan user ke socket
    socket.user = user;

    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
};
