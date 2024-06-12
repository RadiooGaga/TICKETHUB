const User = require("../api/models/User");
const { verifyJwt } = require("../utils/jwt");


//sólo el administrador con el rol "admin".
const isAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(400).json("No estás autorizado")
        }

        const parsedToken = token.replace("Bearer ", "");
        const { id } = verifyJwt(parsedToken);
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json("Usuario no encontrado");
        }

        // Verificar el rol del usuario
        if (user.rol === "admin") {
            user.password = null;
            req.user = user;
            next();
        } else if (user.rol === "user") {
            user.password = null;
            req.user = user;
            next();
        } else {
            return res.status(400).json("Rol de usuario desconocido");
        }
        
    } catch (error) {
        return res.status(400).json("No estás autorizado");
    }
}

module.exports = { isAdmin }
