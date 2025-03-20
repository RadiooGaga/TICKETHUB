
const { isAuth, isAdmin } = require('../../middlewares/auth');
//const { isAuth } = require("../../middlewares/auth");
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
eventRoutes.post("/new-event", [isAuth],createEvent);
eventRoutes.get("/events", getEvents);
eventRoutes.get("/events/search/:searchTerm", searchEvents);
eventRoutes.get("/events/:id", getEventById);
eventRoutes.get("/event/creator/:id", getEventsByCreator); //id del creador
eventRoutes.get("/events/category/:category", getEventsByCategory);
eventRoutes.put("/update-event/:id",[isAuth], updateEventById);
eventRoutes.delete("/delete-event/:id", [isAdmin], upload.single('img'), deleteEventByCreator); //eventoId


module.exports = eventRoutes;






