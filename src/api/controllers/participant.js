const Participant = require('../models/Participant');
const Event = require('../models/Event');


//REGISTRO DEL PARTICIPANTE
const participantRegister = async (req, res, next) => {
    try {
      const participantExists = await Participant.findOne(
        { name: req.body.name, surname: req.body.surname, email: req.body.email });
  
    let participantSaved; //se va actualizando

    if (participantExists){ //si el participante existe... 

        if (participantExists.events.includes(req.body.events)) { 
            //y está el evento al que quiere ir...
            console.log("El participante ya existe y está inscrito en el evento");
            return res.status(400).json("Ese participante ya está inscrito en el evento");

        } else {
            //si no está el evento, lo añade a su lista de eventos.
            participantExists.events.push(req.body.events)
            participantSaved = await participantExists.save();
            console.log("El participante ya existe, pero no tiene ese evento (evento añadido)");
            return res.status(200).json(participantSaved);
        }
    } else { //si no existe el participante, se crea uno nuevo en la db
        const newParticipant = new Participant({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            events: req.body.events    
        });
        participantSaved = await newParticipant.save(); //guardamos nuevo participante en db
        console.log("Participante registrado con éxito!", newParticipant);
        return res.status(200).json(participantSaved);
    }
        
    } catch (error) {
      console.log("error al hacer el registro del participante", error);
      return res.status(400).json("error");
    }
};



// TRAER A LOS PARTICIPANTES
const getParticipants = async (req, res, next) => {
    try {
      const participants = await Participant.find();
      return res.status(200).json(participants);
    } catch (error) {
      return res.status(400).json(error);
    }
};
  

// TRAERSE UN PARTICIPANTE POR ID
const getParticipantById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const participant = await Participant.findById(id)
      .populate('events');
      console.log(participantRegister)
      return res.status(200).json(participant);
    } catch (error) {
      return res.status(400).json(error);
    }
};




const getParticipantsByEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const participants = await Participant.find({ events: id });

    console.log("esta es la lista de los participantes", participants);
    res.status(200).json(participants);

  } catch (err) {
      console.error("Error al obtener los participantes del evento",err);
      res.status(500).json({ message: 'Error al obtener los participantes del evento' });
  }

}

module.exports = { participantRegister, getParticipants, getParticipantById, getParticipantsByEvent };



