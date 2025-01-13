//#region [IMPORT]
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const saltRounds = 10;
//#endregion

//#region encriptaciones de contraseñas
/**
 * Función para encriptar la contraseña
 * @param {string} password Contraseña a encriptar
 * @returns Contraseña encriptada
 */
const encryptPassword = async (password) => {
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (error) {
        console.error('AUTH >> ENCRIPTAR > Error encriptando la password:', error);
        throw error;
    }
};

/**
 * Verifica contraseñas encriptadas
 * @param {string} password Contraseña a verificar
 * @param {string} hash Contraseña encriptada
 * @returns {boolean} true si la contraseña es correcta, false si no lo es
 */
const verifyPassword = async (password, hash) => {
    try {
        const match = await bcrypt.compare(password, hash);
        return match;
    } catch (error) {
        console.error('AUTH >> VERIFICAR CONTRASEÑA > Error verificando la password:', error);
        throw error;
    }
};
//#endregion

//#region Generación de tokens
/**
 * Genera un token de acceso con la información del usuario
 * @param {string} user información del usuario a incluir en el token
 * @returns {string} token de acceso
 */
function generateAccessToken(user) {
    if (typeof user !== 'object' || user === null) {
        throw new Error('Expected "user" to be a plain object.');
    }
    return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: "60m" });
}

/**
 * Valida el token de acceso
 * @returns {JSON} Mensaje de error o éxito
 */
function validateToken(req, res, next) {
    try {
        const token = req.headers['authorization'];
        console.log("AUTH >> VALIDAR > Sesión solicitada por", req.headers["true-client-ip"]);
        if (!token) {
            return res.status(401).json({ message: "No se proporcionó un token de autorización" });
        }

        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
            if (err) {
                console.log("AUTH >> VALIDAR > Autenticación por usuario fallida.");
                return res.status(403).json({ message: "AUTENTICACIÓN FALLIDA" });
            } else {
                console.log("AUTH >> VALIDAR > Autenticación exitosa.");
                req.user = user;
                next();
            }
        });
    } catch (error) {
        console.error('AUTH >> VALIDAR > Error validando el token:', error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}

module.exports = { encryptPassword, verifyPassword, generateAccessToken, validateToken };
