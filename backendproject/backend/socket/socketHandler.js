let io;

module.exports = {
  init: (httpServer) => {
    const { Server } = require('socket.io');
    io = new Server(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST']
      }
    });

    io.on('connection', (socket) => {
      console.log(`User connected via socket: ${socket.id}`);

      socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room.`);

      });

      socket.on('sendMessage', (data) => {

        console.log('Message received on socket:', data);

        io.to(data.receiverId).emit('receiveMessage', data);
      });

      socket.on('newPost', (post) => {

        socket.broadcast.emit('postUpdate', post);
      });

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);

      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};
