const { isUser, isAdmin } = require("../../middlewares/auth");
const userRoutes = require("express").Router();

// ------------------ ACORDARSE DE ISAUTH [isAuth] para alguas funcionalidades ----------

//CONTROLADORES DE USUARIOS
const {
    register,
    login,
    getUsers,
    getUserById,
    updateUserById,
    deleteUserById
} = require("../controllers/user");



userRoutes.post("/auth/register", register);
userRoutes.post("/auth/login", login);
userRoutes.get("/users", getUsers);
userRoutes.get("/user/:id", getUserById);
userRoutes.put("/user/update-user/:id", [isUser], updateUserById);
userRoutes.delete("/user/delete-user/:id",[isUser], deleteUserById);

module.exports = userRoutes;