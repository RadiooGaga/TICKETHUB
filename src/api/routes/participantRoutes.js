//const { isUser, isAdmin } = require('../../middlewares/auth');
const { isAuth } = require('../../middlewares/auth')
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
participantRoutes.get("/participants", [isAuth()], getParticipants);
participantRoutes.get("/participant/:id",[isAuth()], getParticipantById);
//este muestra al participante por su id
participantRoutes.get("/participants/event/:id",[isAuth()], getParticipantsByEvent);
//este muestra los participantes por el id del evento al que están apuntados

module.exports = participantRoutes;