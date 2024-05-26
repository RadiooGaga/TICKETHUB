const { isUser, isAdmin } = require("../../middlewares/auth");
const { upload } = require('../../middlewares/storeAndDeleteFiles');

//CONTROLADORES DE USUARIOS
const {
  register,
  login,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById
} = require("../controllers/user");


// CONTROLADORES DE EVENTOS
const {
  getEvents,
  searchEvents,
  getEventById,
  createEvent,
  getEventsByCreator,
  getEventsByCategory,
  updateEventById,
  deleteEventByCreator,
} = require("../controllers/events");


//CONTROLADORES DE PARTICIPANTES 
const {
  participantRegister,
  getParticipants,
  getParticipantById,
  getParticipantsByEvent
} = require("../controllers/participant");

// ------------------ ACORDARSE DE ISAUTH [isAuth] para alguas funcionalidades ----------

// RUTAS
const Routes = require("express").Router();


// REGISTROS Y LOGIN
Routes.post("/auth/register", register);
Routes.post("/auth/login", login);
Routes.post("/participant/register", participantRegister);


Routes.post("/user/new-event", createEvent);
Routes.get("/user/events", getEvents);
Routes.get("/events/search/:searchTerm", searchEvents);
Routes.get("/events/:id", getEventById);
Routes.get("/event/creator/:id", getEventsByCreator); //añadir id del creador
Routes.get("/events/category/:category", getEventsByCategory);
Routes.get("/users", getUsers);
Routes.get("/user/:id", getUserById);
Routes.get("/participants", getParticipants);
Routes.get("/participant/:id", getParticipantById);
//este muestra al participante por su id
Routes.get("/participants/event/:id", getParticipantsByEvent);
//este muestra los participantes por el id del evento al que están apuntados

//ACTUALIZACIONES
Routes.put("/user/update-user/:id", updateUserById);
Routes.put("/user/update-event/:id", updateEventById);

//BORRADO DE DATOS
Routes.delete("/user/delete-user/:id", deleteUserById);
Routes.delete("/user/delete-event/:id",/*[isAdmin],*/ upload.single('img'), deleteEventByCreator); //eventoId


module.exports = Routes;
