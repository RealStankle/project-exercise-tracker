const app = require('./app');
const mongoose = require('mongoose');

require('dotenv').config();

const PORT = process.env.PORT || 3000;

mongoose
  .set('strictQuery', true)
  .connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME })
  .then(() => {
    app.listen(PORT, console.log(`Server started on port ${PORT}`));
  })
  .catch((err) => console.error(err));
