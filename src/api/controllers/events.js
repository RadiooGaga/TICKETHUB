const { deleteImgCloudinary } = require('../../middlewares/storeAndDeleteFiles');
const cloudinary = require('cloudinary').v2
const Event = require("../models/Event");
const User = require("../models/User");



// TRAER LOS EVENTOS
const getEvents = async (req, res, next) => {
    try {
      const events = await Event.find();
      console.log("todos los eventos");
      return res.status(200).json(events);
    } catch (error) {
      console.log("no se han encontrado eventos");
      return res.status(400).json(error);
    }
};



// TRAER EVENTO POR SU CREADOR
const getEventsByCreator = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.find({ creator: id });
    console.log("eventos creados por el creador", event);
    return res.status(200).json(event);
  } catch (error) {
    console.log("no se han encontrado eventos");
    return res.status(400).json(error);
  }
};



// BUSCAR LOS EVENTOS EN EL BUSCADOR
const searchEvents = async (req, res, next) => {
  try {
     // Buscar eventos que contengan el término de búsqueda utilizando una expresión regular
    console.log(req.params.searchTerm)
    const events = await Event.find({ eventName: { $regex: req.params.searchTerm, $options: "i" } });
   
    console.log(events, "eventos encontrados");
    return res.status(200).json(events);
  } catch (error) {
    console.log("no se han encontrado eventos");
    return res.status(400).json(error);
  }
};
  

  
// TRAER EVENTO POR ID
const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).populate('creator');
    console.log("id del evento", event);
    return res.status(200).json(event);
  } catch (error) {
    console.log(error, "no hemos encontrado el evento");
    return res.status(400).json(error);
  }
};
  
  
// TRAERSE EVENTOS POR CATEGORÍA
const getEventsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const events = await Event.find({ category: category });
    console.log("tus eventos por categoría", events);
    return res.status(200).json(events);

  } catch (error) {
    console.error("Error al obtener eventos por categoría:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
  
  
//CREAR EVENTO
const createEvent = async (req, res, next) => {
  try {
    const imgUrl = req.body.img;
    const result = await cloudinary.uploader.upload(imgUrl, {
          folder: 'tickethubPictures',
          allowedFormats: ['jpg', 'png', 'jpeg', 'gif'],
          overwrite: true,
          invalidate: true  
    });

    const newEvent = new Event({
      eventName: req.body.eventName,
      date: req.body.date,
      location: req.body.location,
      img: result.url,
      description: req.body.description,
      category: req.body.category,
      participants: req.body.participants,
      creator: req.body.creator
      
    });
    
    const eventDB = await newEvent.save();
    const eventId = eventDB._id;

    // Actualizar el usuario asociado con el evento
    const user = await User.findById(req.body.creator);
    user.createdEvents.push(eventId);
    await user.save();
    
    console.log('Evento creado con éxito!')
    return res.status(201).json({ event: eventDB, message: "evento creado y guardado en la DB!" });
  } catch (error) {
    console.log("error al crear el evento");
    return res.status(400).json(error);
  }
};
  


// ACTUALIZAR EL EVENTO 
const updateEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = req.body;

    // Busco si hay evento
    const oldEvent = await Event.findById(id);
    if (!oldEvent) {
        return res.status(404).json({ message: "Evento no encontrado" });
    }

    // Y si se ha subido una nueva imagen
    if (req.body.img) {
      const imgUrl = req.body.img;

        // Si hay una imagen vieja, se elimina.
        if (oldEvent.img) {
            deleteImgCloudinary(oldEvent.img);
        }
            // Se sube la nueva imagen a Cloudinary
            const result = await cloudinary.uploader.upload(imgUrl, {
              folder: 'tickethubPictures',
              allowedFormats: ['jpg', 'png', 'jpeg', 'gif'],
              overwrite: true,
              invalidate: true  
          });
          event.img = result.url;
      }
      
    // Actualizamos el evento con la nueva información e imagen
    const updatedEvent = await Event.findByIdAndUpdate(id, event, { new: true }).lean();
    if (!updatedEvent) {
        return res.status(404).json({ message: "Evento no encontrado" });
    }
    console.log('El eVENTO se ha actualizado', updatedEvent);
    return res.status(200).json(updatedEvent); 
        
    } catch (error){
        //return res.status(400).json('Error al actualizar el evento', error) 
        res.status(500).json({ error: 'Error al actualizar el evento' });
    }
};





// BORRAR EL EVENTO
const deleteEventByCreator = async (req, res, next) => {
  try {

      const { id } = req.params;
      const event = await Event.findByIdAndDelete(id);
      const user = await User.findById(event.creator);

      if (!event) {
          return res.status(404).json({ message: "Evento no encontrado" });
      }
      if (event && event.img) {
        deleteImgCloudinary(event.img);
        console.log("Foto eliminada de Cloudinary", event.img)
      } 
      if (user) {
        user.createdEvents = user.createdEvents.filter(
            userCreatedEvent => userCreatedEvent.toString() !== event._id.toString()
        );
        await user.save();
      }

      return res.status(200).json({ 
          message: '¡Evento borrado! Foto eliminada  de Cloudinary',
          deletedEvent: event
      });
  } catch (error) {

      return res.status(400).json({ message: 'Error al eliminar el evento', error: error.message });
  }
};

  
module.exports = {
  getEvents,
  searchEvents,
  getEventById,
  getEventsByCreator,
  getEventsByCategory,
  createEvent,
  updateEventById,
  deleteEventByCreator
}