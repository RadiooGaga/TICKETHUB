require("dotenv").config();
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const cloudinary = require('cloudinary').v2;
const { connectDB } = require('./src/config/db');
const Routes = require("./src/api/routes/routes");


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


app.use('/api', Routes);


app.use('*', (req, res, next) => {
    return res.status(404).json('Ruta no encontrada');
})

app.listen(3004,() => {
    console.log("El servidor está funcionando en http://localhost:3004");
})