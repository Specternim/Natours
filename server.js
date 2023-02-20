const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.set('strictQuery', false);

mongoose.connect(DB, () => {
  console.log(
    `MongoDB Connect [0-disconnected, 1-connected, 2-connecting, 3-disconnecting, 4-invalid credentials]
STATUS  --> ${mongoose.connection.readyState}`
  );
});

const { PORT } = process.env;
app.listen(PORT, () => console.log(`App running at port ${PORT}`));
