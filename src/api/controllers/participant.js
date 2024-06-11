const Participant = require('../models/Participant');
const User = require('../models/User');


//REGISTRO DEL PARTICIPANTE
const participantRegister = async (req, res, next) => {
    try {
      const participantExists = await Participant.findOne(
        { name: req.body.name, surname: req.body.surname, email: req.body.email });
  
    let participantSaved; //se va actualizando

    if (participantExists){ 

        if (participantExists.events.includes(req.body.events)) { 
            //y si está el evento al que quiere ir...
            console.log("El participante ya existe y está inscrito en el evento");
            return res.status(409).json("Ese participante ya está inscrito en el evento");

        } else {
            //si no está el evento, lo añade a su lista de eventos.
            participantExists.events.push(req.body.events)
            participantSaved = await participantExists.save();
            console.log("El participante ya existe, pero no tiene ese evento (evento añadido)");
            return res.status(200).json(participantSaved);
        }
    } else { //si no existe, se crea uno nuevo en la db
        const newParticipant = new Participant({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            events: req.body.events    
        });

          if (!newParticipant.name || !newParticipant.surname || !newParticipant.email) {
              console.log("Faltan campos por rellenar");
              return res.status(400).json("error")
          }

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
    const users = await User.find({ myEvents: id });

    if ((!participants || participants.lengh === 0) && (!users || users.lengh === 0) ) {
      return res.status(404).json({ message: 'No se encontraron asistentes para este evento' });
    }

    // Creo una lista de asistentes a los eventos genérica.
    let attendants = [];

    participants.forEach((participant) => {
      attendants.push(participant.name + " " + participant.surname + " " + "---" + " " + participant.email)
    })
    users.forEach((user) => {
      attendants.push(user.userName + " " + "---"+ " " + user.email)
    })

    console.log("lista generada", attendants);
    res.status(200).json({"Asistentes": attendants});

  } catch (err) {
      console.error("Error al obtener los participantes del evento",err);
      res.status(500).json({ message: 'Error al obtener los participantes del evento' });
  }

}



module.exports = { participantRegister, getParticipants, getParticipantById, getParticipantsByEvent };



