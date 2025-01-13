//#region [IMPORT]
const express = require('express');
const conexion = require('./bdd.js'); // Asegúrate de que la ruta sea correcta
const bodyParser = require('body-parser');
const router = express.Router();
router.use(bodyParser.json());
var BDD;
const { encryptPassword, verifyPassword } = require('./auth.js'); 
//#endregion

async function TestBDD() {
    if (!BDD && !conexion.bdd) {
        BDD = await conexion.Conectar();
        console.log("RUTAS >> TESTBDD > ¡Conexión Conseguida!");
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

    //    res.json(unidades)
    //} catch (error) {
    //    console.error("Error al crear la unidad:", error);
    //    res.status(500).json("Error al crear la unidad");
    //}
//});
//#endregion

//#region Rutas relativas a parcelas
//Solicitud de todas las zonas de un usuario
router.get('/zonas', async (req, res) => {
    if (!req.query.userid) { res.status(400).json({ error: "No se ha proporcionado un ID de usuario" }); return; }

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
    if (consulta.length > 0) res.json(consulta);
    else res.status(400).json({ error: "No se encontraron zonas para el usuario" });
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
        if (consulta.length > 0) res.json(consulta);
        else res.status(400).json({ error: "No se encontraron parcelas en la zona mencionada" });
    }
    else if (req.query.idparcela) {
        //await TestBDD();
        var query = `select * from sm_parcelas where parc_id = {{ID}};`

        query = query.replace("{{ID}}", req.query.idparcela);

        const consulta = await conexion.Consultar(BDD, query);
        console.log("RUTAS >> ZONAS > Consulta de la parcela de id", req.query.idparcela);
        console.log(consulta);
        if (consulta.length > 0) res.json(consulta);
        else res.status(400).json({ error: "No se encontró la parcela" });
    }
    else res.status(400).json({ error: "No se ha proporcionado un ID de zona o de parcela" });
});

//Solicitd de toda una parcela
router.post('/registrarzona', async (req, res) => {
    if (!req.body) { req.status(400).json({ error: "No se ha proporcionado información" }); return; }
    if (!req.body["nombreConsulta"]) { res.status(400).json({ error: "No se ha proporcionado el nombre de la consulta" }); return; }
    if (!req.body["probDetalle"]) { res.status(400).json({ error: "No se ha proporcionado el detalle del problema" }); return; }

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
        res.json({ status: "OK" });
    }
    catch (error) {
        console.error("Error al registrar la zona:", error);
        res.status(500).json({ error: "Error al registrar la zona" });
    }
});

//Solicitud de roles
router.get('/roles', async (req, res) => {
    //await TestBDD();
    var query = `select * from tipos_usuarios;`

    const consulta = await conexion.Consultar(BDD, query);
    console.log("RUTAS >> ROLES > Consulta de roles realizada");
    console.log(consulta);

    res.setHeader('Content-Type', 'application/json');
    if (consulta.length > 0) res.json(JSON.stringify(consulta));
    else res.status(400).json({error: "No hay roles registrados en la BDD"});
});

//Registro de Usuario
router.post('/register', async (req, res) => {
    if (!req.body) { res.status(400).json({ error: "No se ha proporcionado información" }); return; }
    if (!req.body["rol"]) { res.status(400).json({ error: "No se ha proporcionado el rol" }); return; }
    if (!req.body["cedula"]) { res.status(400).json({ error: "No se ha proporcionado la cédula" }); return; }
    if (!req.body["nombre"]) { res.status(400).json({ error: "No se ha proporcionado el nombre" }); return; }
    if (!req.body["apellido"]) { res.status(400).json({ error: "No se ha proporcionado el apellido" }); return; }
    if (!req.body["correo"]) { res.status(400).json({ error: "No se ha proporcionado el correo" }); return; }
    if (!req.body["password"]) { res.status(400).json({ error: "No se ha proporcionado la contraseña" }); return; }
    if (!req.body["telefono"]) { res.status(400).json({ error: "No se ha proporcionado el número de teléfono" }); return; }
    console.log("RUTAS >> USUARIOS > Registrando nuevo usuario...");
    const usuario = req.body;
    console.log(usuario);
    const Rol = usuario["rol"].toUpperCase();
    const indexRol = await conexion.Consultar(BDD, `select * from tipos_usuarios where tipus_detalles = '${Rol}'`);

    const Cedula = usuario["cedula"];
    const Nombre = usuario["nombre"];
    const Apellido = usuario["apellido"];
    const Correo = usuario["correo"];
    const Password = await encryptPassword(usuario["password"]);
    const Telefono = usuario["telefono"];

    var query = `insert into usuarios 
(tipus_id, user_cedula, user_nombre, user_apellido, user_email, user_password, user_telefono, user_estado, created_at, updated_at) values 
({{INDEX_ROL}}, '{{CEDULA}}', '{{NOMBRE}}', '{{APELLIDO}}', '{{CORREO}}', '{{CONTRASEÑA}}', '{{TELEFONO}}', true, now(), now());`;
    query = query.replace("{{INDEX_ROL}}", indexRol[0].tipus_id);
    query = query.replace("{{CEDULA}}", Cedula);
    query = query.replace("{{NOMBRE}}", Nombre);
    query = query.replace("{{APELLIDO}}", Apellido);
    query = query.replace("{{CORREO}}", Correo);
    query = query.replace("{{CONTRASEÑA}}", Password);
    query = query.replace("{{TELEFONO}}", Telefono);
    console.log(query);
    try {
        await conexion.Consultar(BDD, query);
        res.json({ status: "OK" });
    }
    catch (error) {
        if (error.code === "23505") {
            console.log("Se intentó registrar un usuario con un correo existente, abortando registro.");
            res.status(400).json({ error: "Ya existe un usuario con ese correo" });
        }
        else {
            console.error("Error al registrar el usuario:", error);
            res.status(500).json({ error: "Error al registrar el usuario" });
        }
    }
});
//#endregion


module.exports = { router, TestBDD };
