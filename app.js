const express = require('express');
const dotenv = require('dotenv');
const postRoute = require('./routes/postRoute');
const sequelize = require('./config/db');
const PORT = process.env.PORT || 3000;

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api/post', postRoute);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connection successful');

    await sequelize.sync({ alter: true }); // Sync tables

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error('Unable to connect to MySQL:', err);
    process.exit(1);
  }
};

startServer();
