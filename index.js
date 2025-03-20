require("dotenv").config();
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const { connectDB } = require('./src/config/db');
const userRoutes = require("./src/api/routes/userRoutes");
const eventRoutes = require("./src/api/routes/eventRoutes");
const participantRoutes = require("./src/api/routes/participantRoutes");


const app = express();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));


cloudinary.config = {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.API_KEY,
    CLOUDINARY_API_SECRET: process.env.API_SECRET,
    CLOUDINARY_URL:process.env.CLOUDINARY_URL
  };


connectDB();

app.use(express.json());
app.use(cors());


app.use('/api', userRoutes);
app.use('/api', participantRoutes);
app.use('/api', eventRoutes);


app.use('*', (req, res, next) => {
    return res.status(404).json('Ruta no encontrada');
})

const PORT = 3004;
app.listen(3004,() => {
    console.log(`El servidor está funcionando en http://localhost:${PORT}`);
})