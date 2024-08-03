const { Server } = require('socket.io');

let io;

module.exports = {
  init: (server, options) => {
    io = new Server(server, options);
    return io;
  },
  getIO: () => {
    if (!io) throw new Error('No io initialized');
    return io;
  }
}
