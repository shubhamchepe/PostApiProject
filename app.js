const express = require('express');
const dotenv = require('dotenv');
dotenv.config(); 

const postRoute = require('./routes/postRoute');
const sequelize = require('./config/db');


const PORT = process.env.PORT || 3000;

const app = express();


app.use(express.json());


app.get('/', (req, res) => {
  res.send('Secure API is running.');
});


app.use('/api/post', postRoute);


const startServer = async () => {
  try {
   
    await sequelize.authenticate();
    console.log('MySQL connection successful');

    
    await sequelize.sync({ alter: true });

   
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('Unable to connect to MySQL:', err);
    process.exit(1);
  }
};

startServer();
