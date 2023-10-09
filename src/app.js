const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
require('dotenv').config()
const app = express();
const PORT = 3000;

app.use(express.json());

const MONGO_DB_URI = process.env.MONGO_DB;
const URL_BASE_URI = process.env.URL_BASE;

mongoose.connect(MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(cors({
    origin: URL_BASE_URI, // Substitua pelo domínio real do seu aplicativo React Admin
    exposedHeaders: ['X-Total-Count'], // Declare o cabeçalho a ser exposto, se necessário
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }))

app.use('/api', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
