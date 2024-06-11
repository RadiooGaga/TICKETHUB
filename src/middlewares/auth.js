const User = require("../api/models/User");
const { verifyJwt } = require("../utils/jwt");

const isAuth = (requireAdmin = false) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization;

            if (!token) {
                return res.status(400).json("No estás autorizado");
            }

            const parsedToken = token.replace("Bearer ", "");
            const { id } = verifyJwt(parsedToken);
            const user = await User.findById(id);

            if (!user) {
                return res.status(400).json("Usuario no encontrado");
            }

            if (requireAdmin && user.rol !== "admin") {
                return res.status(400).json("No eres Administrador/a");
            }

            user.password = null;
            req.user = user;
            next();

        } catch (error) {
            return res.status(400).json("No estás autorizado");
        }
    };
};

module.exports = { isAuth };





/*
const isUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(400).json("No estás autorizado")
        }

        const parsedToken = token.replace("Bearer ", "");
        const { id } = verifyJwt(parsedToken);
        const user = await User.findById(id);

        user.password = null;
        req.user = user;
        next();

    } catch (error) {
        return res.status(400).json("No estás autorizado ");
    }
}


//sólo el administrador con el rol "admin".
const isAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(400).json("No estás autorizado, no hay token")
        }

        const parsedToken = token.replace("Bearer ", "");
        const { id } = verifyJwt(parsedToken);
        const user = await User.findById(id);

        if (user.rol === "admin") {
            user.password = null;
            req.user = user;
            next();
        } else {
            return res.status(400).json("No eres Administrador/a");
        }

    } catch (error) {
        return res.status(400).json("No estás autorizado");
    }
}


module.exports = { isUser, isAdmin } 
*/