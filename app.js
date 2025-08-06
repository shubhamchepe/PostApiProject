const express = require('express');
const dotenv = require('dotenv');
dotenv.config(); 

const postRoute = require('./routes/postRoute');
const sequelize = require('./config/db');
const whatsappRoutes = require('./routes/whatsapp');
const Message = require('./models/Message');


const PORT = process.env.PORT || 3000;

const app = express();


app.use(express.json());


app.get('/', (req, res) => {
  res.send('Secure API is running.');
});


app.use('/api/post', postRoute);

app.use('/api/whatsapp', whatsappRoutes);

// Webhook to receive user replies from Twilio
app.post('/webhook', async (req, res) => {
  console.log('Webhook hit');
  console.log('Incoming Body:', req.body);

  const from = req.body.From?.replace('whatsapp:', '');
  const body = req.body.Body;

  if (!from || !body) {
    console.log('Missing data');
    return res.sendStatus(400);
  }

  try {
    await Message.create({
      phone_number: from,
      direction: 'received',
      message: body,
    });

    console.log('Message saved');
    res.sendStatus(200);
  } catch (err) {
    console.error('DB error:', err);
    res.sendStatus(500);
  }
});



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
