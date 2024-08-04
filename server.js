const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const { init } = require('./socket.js');
const { chatHandler } = require('./controllers/chatController');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log('DB connection successful'));

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log('App running on port ' + port);
});

const io = init(server, {
  cors: {
    origin:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : process.env.CORS_ORIGIN,
    credentials: true,
  },
});

io.on('connection', (socket) => {
  chatHandler(io, socket);
});
