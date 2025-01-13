//#region [IMPORT]
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
    return jwt.sign(user, "telepass", { expiresIn: "60m" });
}

function validateToken(req, res, next) {
    try {
        const token = req.headers['authorization'];
        if (!token) res.redirect('error/404');

        jwt.verify(token, "telepass", (err, user) => {
            if (err) {
                console.log("Autenticación por usuario fallida.");
                res.json({ message: "AUTENTICACIÓN FALLIDA" });
            } else {
                console.log("Autenticación exitosa.");
                req.user = user;
                next();
            }
        })
    }
    catch { res.redirect('error/404'); }
}

module.exports = { encryptPassword, verifyPassword, generateAccessToken, validateToken };
