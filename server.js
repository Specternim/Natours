const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.set('strictQuery', false);
// ⤴️ if set true, will check for queries provided in the schema and ignore everything else.

mongoose.connect(DB, () => {
  console.log(`Connected to Database!`);
});

const { PORT } = process.env;
const server = app.listen(PORT, () =>
  console.log(`App running at port ${PORT}`)
);

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log(`UNHANDLED REJECTION! Shutting down...`);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log(`UNCAUGHT EXCEPTION! Shutting down...`);
  server.close(() => {
    process.exit(1);
  });
});

/*
MongoDB Connect [0-disconnected, 1-connected, 2-connecting, 3-disconnecting, 4-invalid credentials]
STATUS  --> ${mongoose.connection.readyState}
*/
