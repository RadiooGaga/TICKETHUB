
const { isUser, isAdmin } = require('../../middlewares/auth');
const { upload } = require('../../middlewares/storeAndDeleteFiles');
const eventRoutes = require("express").Router();

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


// RUTAS
eventRoutes.post("/user/new-event", [isUser], createEvent);
eventRoutes.get("/events", getEvents);
eventRoutes.get("/events/search/:searchTerm", searchEvents);
eventRoutes.get("/events/:id", getEventById);
eventRoutes.get("/event/creator/:id", getEventsByCreator); //añadir id del creador
eventRoutes.get("/events/category/:category", getEventsByCategory);
eventRoutes.put("/user/update-event/:id", [isUser], updateEventById);
eventRoutes.delete("/user/delete-event/:id",[isUser], /*[isAdmin],*/ upload.single('img'), deleteEventByCreator); //eventoId


module.exports = eventRoutes;






