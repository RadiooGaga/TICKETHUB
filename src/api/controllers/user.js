const { generateToken } = require("../../utils/jwt");
const User = require("../models/User");
const bcrypt = require("bcrypt");


// REGISTRO DE USUARIO
const register = async (req, res, next) => {
  try {
    const newUser = new User({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        rol: req.body.rol,
        myEvents: req.body.myEvents,
        createdEvents: req.body.createdEvents
    });

    const userExists = await User.findOne({ userName: req.body.userName, email: req.body.email});
    if (userExists) {
      console.log("el nombre e email de usuario ya existe");
      return res.status(401).json("nombre e email de usuario ya existen");
    }

    const user = await newUser.save(); //guardamos nuevo user en db
    const token = generateToken(user._id);
    console.log("Usuario registrado con éxito!", user);
    return res.status(200).json({ token, user });
   

  } catch (error) {
    console.log("error al hacer el registro", error);
    return res.status(400).json("error");
  }
};


// LOGIN DE USUARIO
const login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });

    if (!user) {
      console.log("Usuario no encontrado");
      return res.status(400).json({ error: "Usuario no encontrado" });
    } 

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log("Usuario o contraseña incorrectos");
      return res.status(400).json({ error: "Usuario o contraseña incorrectos"});
    }

    const token = generateToken(user._id);
    console.log("Login exitoso!");
    return res.status(200).json({ token, user });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

 
// TRAER USUARIOS
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json(error);
  }
};


// TRAER USUARIO POR ID
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id)
    .populate('myEvents')
    .populate('createdEvents') ;
    console.log(user)
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json(error);
  }
};


// ACTUALIZAR USUARIO
const updateUserById = async (req, res, next) => {
  try {
      const { id } = req.params;
      /*
      if (req.user._id.toString() !== id) {
        return res.status(400).json("No puedes modificar a alguien que no seas tu mismo")
      }*/
      const oldUser = await User.findById(id) //buscar el user
      const newUser = new User(req.body); // almacenar como newUser
      //crear nuevo id del usuario nuevo, que es el mismo pero para el nuevo user.
      newUser._id = id; 
      
      //buscar si había eventos en el oldUser
      const myEventsIndex = oldUser.myEvents.indexOf(newUser.myEvents[0]);
      console.log('eventos del old user', myEventsIndex);
      
      //para mis eventos
      if (myEventsIndex === -1) { // si el evento no está en mis eventos
        newUser.myEvents = [...oldUser.myEvents, ...newUser.myEvents];
        console.log('evento no encontrado, añadiendo\n', newUser)
      } else {
        oldUser.myEvents.splice(myEventsIndex, 1);//si está el mismo, se quita.
        newUser.myEvents = oldUser.myEvents;
        console.log('evento no encontrado, borrando\n', newUser)
      }

      const userUpdated = await User.findByIdAndUpdate(id, newUser, {
        new: true,
      });

      console.log("usuario actualizado");
      return res.status(200).json(userUpdated);
  
    } catch (error) {
      console.log("no ha podido actualizarse el usuario");
      return res.status(400).json("error");
    }
}



//BORRAR USUARIO (ADMIN)
const deleteUserById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userToDelete = await User.findByIdAndDelete(id);

      if (!userToDelete) {
        console.log("usuario no encontrado");
        return next("usuario no encontrado");
      }
  
      return res.status(200).json({
        message: "¡usuario borrado!",
        userToDelete,
      });
      
    } catch (error) {
      return res.status(400).json("Error al eliminar el usuario", error);
    }
};


module.exports = {
    register,
    login,
    getUsers,
    getUserById,
    updateUserById,
    deleteUserById
  };


