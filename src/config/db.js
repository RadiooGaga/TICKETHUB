const mongoose = require('mongoose');

mongoose.set('strict', false); 
mongoose.set('strictQuery', false); 
mongoose.set('strictPopulate', false); 


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {});
        console.log('Conectado a la base de datos tickethub');
    } catch (err) {
        console.error('Error de conexión', err);
        process.exit(1)
    }
};

module.exports = { connectDB };