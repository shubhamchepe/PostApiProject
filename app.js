const express = require('express');
const dotenv = require('dotenv');
dotenv.config(); // 🔁 Load .env at the top

const postRoute = require('./routes/postRoute');
const sequelize = require('./config/db');

// ✅ Use PORT variable properly
const PORT = process.env.PORT || 3000;

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Optional: Root health check route
app.get('/', (req, res) => {
  res.send('✅ Secure API is running.');
});

// API route
app.use('/api/post', postRoute);

// Start the server
const startServer = async () => {
  try {
    // Test DB connection
    await sequelize.authenticate();
    console.log('MySQL connection successful');

    // Sync Sequelize models
    await sequelize.sync({ alter: true });

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('Unable to connect to MySQL:', err);
    process.exit(1);
  }
};

startServer();
