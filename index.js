const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const {authenticate} = require("./middleware");
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/course');
const studentRoutes = require('./routes/student');

dotenv.config();

const app = express();

app.use(express.json()); 
app.use(cors());
app.use(authRoutes);
app.use( courseRoutes);
app.use( studentRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

connectDB();
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
