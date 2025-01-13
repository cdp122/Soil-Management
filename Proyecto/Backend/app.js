//#region Dependencias
require('dotenv').config({ path: './.env' });
const bodyparser = require('body-parser');
const cors = require('cors');
const express = require('express');
const routes = require('./modules/routes'); 
routes.TestBDD();
//#endregion

//#region Función para obtener la IP LAN
const getLocalIP = () => {
    const interfaces = require('os').networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address; // Retornamos la dirección IPv4 de la LAN
            }
        }
    }
    return 'IP no encontrada'; // Si no se encuentra ninguna IP
};
//#endregion

//#region Start Up del Server
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(bodyparser.json()); // Asegúrate de que el bodyparser esté configurado

const localIP = getLocalIP();

console.log(`MAIN >> El Backend empezará a ejecutarse localmente en => http://localhost:${PORT}`)
console.log(`MAIN >> EN LAN será por el ip => http://${localIP}:${PORT}`)

app.listen(PORT, () => {
    console.log("MAIN >> Backend status = 'UP");
});
// Usa las rutas definidas en el archivo de rutas
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('MAIN >> ERROR DE JSON > Bad JSON');
        return res.status(400).send({ error: 'Bad JSON' });
    }
    next();
});
app.use('/', routes.router);
//#endregion
