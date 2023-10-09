const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
require('dotenv').config()
const app = express();
const PORT = 3000;

app.use(express.json());

const MONGO_DB_URI = process.env.MONGO_DB;
mongoose.connect(MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }))

app.use('/api', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
