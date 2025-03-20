const { isAdmin } = require('../../middlewares/auth');
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
participantRoutes.get("/participants",[isAdmin],  getParticipants);
participantRoutes.get("/participant/:id",[isAdmin], getParticipantById);
participantRoutes.get("/participants/event/:id",[isAdmin], getParticipantsByEvent);
// muestra los participantes por el id del evento al que están apuntados

module.exports = participantRoutes;