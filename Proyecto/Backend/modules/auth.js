//#region [IMPORT]
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const saltRounds = 10;
//#endregion

//#region encriptaciones de contraseñas
const encryptPassword = async (password) => {
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (error) {
        console.error('Error encriptando la password:', error);
        throw error;
    }
};

const verifyPassword = async (password, hash) => {
    try {
        const match = await bcrypt.compare(password, hash);
        return match;
    } catch (error) {
        console.error('Error verificando la password:', error);
        throw error;
    }
};
//#endregion

//#region Generación de tokens
function generateAccessToken(user) {
    if (typeof user !== 'object' || user === null) {
        throw new Error('Expected "user" to be a plain object.');
    }
    return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: "60m" });
}

function validateToken(req, res, next) {
    try {
        const token = req.headers['authorization'];
        console.log(req.headers);
        if (!token) {
            return res.status(401).json({ message: "No se proporcionó un token de autorización" });
        }

        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                console.log("Autenticación por usuario fallida.");
                return res.status(403).json({ message: "AUTENTICACIÓN FALLIDA" });
            } else {
                console.log("Autenticación exitosa.");
                req.user = user;
                next();
            }
        });
    } catch (error) {
        console.error('Error validando el token:', error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}

module.exports = { encryptPassword, verifyPassword, generateAccessToken, validateToken };
