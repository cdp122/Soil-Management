//#region [IMPORT]
const express = require('express');
const conexion = require('./bdd.js'); // Asegúrate de que la ruta sea correcta
const bodyParser = require('body-parser');
const router = express.Router();
router.use(bodyParser.json());
var BDD;
//#endregion

async function TestBDD() {
    if (!BDD && !conexion.bdd) {
        BDD = await conexion.Conectar();
        console.log("RUTAS >> TESTBDD > Consiguiendo conexión...");
    }
    return;
}

//#region Ejemplo:
//app.get('/parcela', async (req, res) => {
    //Prueba unicamente para ver si se puede hacer una consulta a la base de datos

    //try {
    //    await bdd.Unidades.create({
    //        uni_id: 1,
    //        uni_simbolo: '%',
    //        uni_nombre: 'Porcentaje'
    //    });
    //    const unidades = await bdd.Unidades.findAll();
    //    console.log("MAIN >> Solicitud de data:\n")
    //    console.log(unidades)

    //    res.send(unidades)
    //} catch (error) {
    //    console.error("Error al crear la unidad:", error);
    //    res.status(500).send("Error al crear la unidad");
    //}
//});
//#endregion

//#region Rutas relativas a parcelas
//Solicitud de todas las zonas de un usuario
router.get('/zonas', async (req, res) => {
    if (!req.query.userid) { res.status(400).send({ error: "No se ha proporcionado un ID de usuario" }); return; }

    //await TestBDD();
    var query = `SELECT
            c.cons_id AS ID,
            c.cons_nombre AS Nombre
        FROM sm_parcelas p
        INNER JOIN sm_q_consultas c ON c.cons_id = p.cons_id
        WHERE p.user_id = {{ID}}`

    query = query.replace("{{ID}}", req.query.userid);

    const consulta = await conexion.Consultar(BDD, query);
    console.log("RUTAS >> ZONAS > Consulta de zonas realizada del usuario", req.query.userid);
    console.log(consulta);
    if (consulta.length > 0) res.send(consulta);
    else res.status(400).send({ error: "No se encontraron zonas para el usuario" });
});

//Solictud de todas las parcelas de una zona
router.get('/parcelas', async (req, res) => {
    if (req.query.zonaid){
        //await TestBDD();
        var query = `select * from sm_parcelas where cons_id = {{ID}};`

        query = query.replace("{{ID}}", req.query.zonaid);

        const consulta = await conexion.Consultar(BDD, query);
        console.log("RUTAS >> ZONAS > Consulta de parcelas realizada de la zona", req.query.zonaid);
        console.log(consulta);
        if (consulta.length > 0) res.send(consulta);
        else res.status(400).send({ error: "No se encontraron parcelas en la zona mencionada" });
    }
    else if (req.query.idparcela) {
        //await TestBDD();
        var query = `select * from sm_parcelas where parc_id = {{ID}};`

        query = query.replace("{{ID}}", req.query.idparcela);

        const consulta = await conexion.Consultar(BDD, query);
        console.log("RUTAS >> ZONAS > Consulta de la parcela de id", req.query.idparcela);
        console.log(consulta);
        if (consulta.length > 0) res.send(consulta);
        else res.status(400).send({ error: "No se encontró la parcela" });
    }
    else res.status(400).send({ error: "No se ha proporcionado un ID de zona o de parcela" });
});

//Solicitd de toda una parcela
router.post('/registrarzona', async (req, res) => {
    if (!req.body) { req.status(400).send({ error: "No se ha proporcionado información" }); return; }
    if (!req.body["nombreConsulta"]) { res.status(400).send({ error: "No se ha proporcionado el nombre de la consulta" }); return; }
    if (!req.body["probDetalle"]) { res.status(400).send({ error: "No se ha proporcionado el detalle del problema" }); return; }

    console.log("RUTAS >> ZONAS > Registrando nueva zona...");

    const nuevaZona = req.body;
    console.log(nuevaZona);
    const Consulta = nuevaZona["nombreConsulta"];
    const Problema = nuevaZona["probDetalle"];

    query = `BEGIN;
            DO $$
            DECLARE
                new_prob_id INTEGER;
            BEGIN
                -- Inserta un nuevo problema y recupera su ID
                INSERT INTO sm_q_problema (prob_detalle)
                VALUES ('{{Problema}}')
                RETURNING prob_id INTO new_prob_id;

                -- Usa el ID recuperado para insertar en sm_q_consultas
                INSERT INTO sm_q_consultas (cons_nombre, prob_id)
                VALUES ('{{CONSULTA}}', new_prob_id);
            END $$;
            -- Si todo se ejecuta correctamente, confirma la transacción
            COMMIT;`

    query = query.replace("{{Problema}}", Problema);
    query = query.replace("{{CONSULTA}}", Consulta);
    console.log(query);
    try {
        await conexion.Consultar(BDD, query);
        res.send({ status: "OK" });
    }
    catch (error) {
        console.error("Error al registrar la zona:", error);
        res.status(500).send({ error: "Error al registrar la zona" });
    }
});
//#endregion


module.exports = { router, TestBDD };
