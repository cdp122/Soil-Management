const bcrypt = require('bcryptjs');
const saltRounds = 10;

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

module.exports = { encryptPassword, verifyPassword };
