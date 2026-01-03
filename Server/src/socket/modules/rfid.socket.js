// socket/rfid.socket.js
export default function rfidSocket(io, socket) {
  socket.on("rfid:tap", (room) => {
    socket.join(room);
  });
}
