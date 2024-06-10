const { isUser, isAdmin } = require('../../middlewares/auth');
const participantRoutes = require("express").Router();

//CONTROLADORES DE PARTICIPANTES 
const {
    participantRegister,
    getParticipants,
    getParticipantById,
    getParticipantsByEvent
  } = require("../controllers/participant");


  //RUTAS
participantRoutes.post("/participant/register", participantRegister);
participantRoutes.get("/participants", [isAdmin], getParticipants);
participantRoutes.get("/participant/:id",[isAdmin], getParticipantById);
//este muestra al participante por su id
participantRoutes.get("/participants/event/:id",[isAdmin], getParticipantsByEvent);
//este muestra los participantes por el id del evento al que están apuntados

module.exports = participantRoutes;