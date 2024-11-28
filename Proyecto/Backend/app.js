//#region Dependencias
const bodyparser = require('body-parser')
const path = require('path')
const os = require('os')
const cors = require('cors')
const bdd = require('./modules/bdd.js')
//#endregion

//#region Función para obtener la IP LAN
const getLocalIP = () => {
    const interfaces = os.networkInterfaces();
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
const express = require('express');
const app = express();
app.use(cors());

const localIP = getLocalIP();

console.log(`>>El Backend empezará a ejecutarse localmente en => http://localhost:${PORT}`)
console.log(`>>EN LAN será por el ip => http://${localIP}:${PORT}`)
app.listen(PORT, () => {
    console.log(">>Backend status = 'UP'")
})

app.get('/parcela', async (req, res) => {
    const parcela = await bdd.Parcelas.findAll();

    console.log(">>Solicitud de data:\n")
    console.log(parcela)

    res.send(parcela)
})
//#endregion