const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.set('strict', false); 
mongoose.set('strictQuery', false); 
mongoose.set('strictPopulate', false); 

const userSchema = new mongoose.Schema(
    {
    userName:  { type: String, trim: true, required: true, unique: true },
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String, trim: true, required: true, unique: true },
    rol: { type: String, required: true, default: "user", enum: ["admin", "user"]},
    myEvents: { type: [String], trim: true, required: true },
    createdEvents: { type: [String], trim: true, required: true }
    }, 
    {
    timestamps: true,
    collection: "users"
    });


// Contraseña encriptada antes de guardar
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

const User = mongoose.model("users", userSchema, "users");

module.exports = User;