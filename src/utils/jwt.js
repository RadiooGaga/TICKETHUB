const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_JWTOKEN, {expiresIn: "50w"});
    
}

const verifyJwt = (token) => {
    return jwt.verify(token, process.env.SECRET_JWTOKEN);
}

module.exports = { generateToken, verifyJwt };