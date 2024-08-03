const Session = require('../models/sessionModel');
const factory = require('./handlerFactory');

exports.chatHandler = (io, socket) => {
  socket.on('create-chat-room', async (user, cb) => {
    const existedRoom = await Session.findOne({ creator: user._id });
    if (!existedRoom) {
      const newRoom = await Session.create({ creator: user._id });
      io.emit('new-chat-room', newRoom);
      cb(newRoom._id);
    } else {
      cb(existedRoom._id);
    }
    console.log(`${user.fullname} has created chat room.`);
  });

  socket.on('join-chat', (roomId) => {
    socket.join(roomId);
  });

  io.of('/').adapter.on('join-room', (room, id) => {
    console.log(`socket ${id} has joined chat room ${room}`);
  })

  socket.on('leave-chat', (roomId) => {
    socket.leave(roomId);
  });

  socket.on('user-message', async ({ user, roomId, msgContent }) => {
    console.log(user, roomId, msgContent);
    const msg = [user._id, msgContent];
    await Session.findOneAndUpdate(
      { _id: roomId },
      { $addToSet: { messages: msg } }
    );
    
    io.to(roomId).emit('message', msg);
  });

  socket.on('admin-message', async ({ user, roomId, msgContent }) => {
    const msg = [`admin-${user._id}`, msgContent];
    await Session.findOneAndUpdate(
      { _id: roomId },
      { $push: { messages: msg } }
    );
    io.to(roomId).emit('message', msg);
  });
};

exports.getAllChatSessions = factory.getAll(Session);
exports.getChatSession = factory.getOne(Session);
