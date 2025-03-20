const mongoose = require('mongoose');

mongoose.set('strict', false); 
mongoose.set('strictQuery', false); 
mongoose.set('strictPopulate', false); 

const eventSchema = new mongoose.Schema(
  {
    eventName: { type: String,trim: true, required: true },
    date: { type: String, trim: true, required: true },
    location: { type: String,trim: true, required: true },
    img: { type: String, trim: true, required: true },
    description: { type: String, trim: true, required: true },
    category: { type: [String], required: true, enum: ['conciertos', 'teatro', 'exposiciones', 'ferias', 'talleres'] },
    participants: { type: [String], trim: true, required: true },
    creator:{ type: String, trim: true, required: true }
  },
  {
    timestamps: true,
    collection: "events"
  }
);

// Creamos y exportamos el modelo Evento.
const Event = mongoose.model("events", eventSchema, "events");
module.exports =  Event;