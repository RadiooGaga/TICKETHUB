const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema(
    {
    name:  { type: String, trim: true, required: true, unique: true },
    surname:  { type: String, trim: true, required: true, unique: true },
    email: { type: String, trim: true, required: true, unique: true },
    events: { type: [String], trim: true, required: true }
    }, 
    {
    timestamps: true,
    collection: "participants"
    });

const Participant = mongoose.model("participants", participantSchema, "participants");

module.exports = Participant;