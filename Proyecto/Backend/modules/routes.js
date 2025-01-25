//#region [IMPORT]
const express = require('express');
const conexion = require('./bdd.js');
const bodyParser = require('body-parser');
const router = express.Router();
router.use(bodyParser.json());
router.use(express.json());
var BDD, PermisosUsuarios, TiposSuelos, Problemas, Consultas, Unidades, Elementos, Usuarios, Parcelas, Muestras, VariablesSecundarias;
const { encryptPassword, verifyPassword, generateAccessToken, validateToken } = require('./auth.js'); 
const Clases = require('./clases.js');
//#endregion

async function TestBDD() {
    if (!BDD || !conexion.sequelize) {
        BDD = await conexion.Conectar();
        PermisosUsuarios = await conexion.DefinirPermisos();
        TiposUsuarios = await conexion.DefinirTiposUsuarios();
        TiposSuelos = await conexion.DefinirTiposSuelos();
        Problemas = await conexion.DefinirProblemas();
        Consultas = await conexion.DefinirConsultas();
        Unidades = await conexion.DefinirUnidades();
        Elementos = await conexion.DefinirElementos();
        Usuarios = await conexion.DefinirUsuarios();
        Parcelas = await conexion.DefinirParcelas();
        Muestras = await conexion.DefinirMuestras();
        VariablesSecundarias = await conexion.DefinirVariables();
        console.log("RUTAS >> TESTBDD > BDD Conectada y Sincronizada!");
    }
    return;
}

//#region Rutas relativas a parcelas
//Solicitud de todas las zonas de un usuario
router.get('/zonas', validateToken, async (req, res) => {
    if (!req.query.userid || req.query.userid == null) { res.status(400).json({ error: "No se ha proporcionado un ID de usuario" }); return; }

    try {
        const zonas = await Consultas.findAll({
            include: [{
                model: Parcelas,
                where: { user_id: req.query.userid },
                attributes: []
            }],
            attributes: ['cons_id', 'cons_nombre']
        });

        console.log(zonas);

        console.log("RUTAS >> ZONAS > Consulta de zonas realizada del usuario", req.query.userid);
        if (zonas.length > 0) res.json(zonas);
        else res.status(400).json({ error: "No se encontraron zonas para el usuario" });
    } catch (error) {
        console.error("RUTAS >> ZONAS > Error al consultar zonas:", error);
        res.status(500).json({ error: "Error al consultar zonas" });
    }
});

//Solictud de todas las parcelas de una zona
router.get('/parcelas', validateToken, async (req, res) => {
    try {
        let parcelas;
        if (req.query.zonaid) {
            parcelas = await Parcelas.findAll({
                where: { cons_id: req.query.zonaid }
            });
            console.log("RUTAS >> ZONAS > Consulta de parcelas realizada de la zona", req.query.zonaid);
        } else if (req.query.idparcela) {
            parcelas = await Parcelas.findOne({
                where: { parc_id: req.query.idparcela }
            });
            console.log("RUTAS >> ZONAS > Consulta de la parcela de id", req.query.idparcela);
        } else {
            res.status(400).json({ error: "No se ha proporcionado un ID de zona o de parcela" });
            return;
        }

        if (parcelas) res.json(parcelas);
        else res.status(400).json({ error: "No se encontraron parcelas" });
    } catch (error) {
        console.error("RUTAS >> PARCELAS > Error al consultar parcelas:", error);
        res.status(500).json({ error: "Error al consultar parcelas" });
    }
});

//Registrar zonas o consultas
router.post('/registrarzona', async (req, res) => {
    console.log(req.body);

    if (!req.body) { res.status(400).json({ error: "No se ha proporcionado información" }); return; }
    if (!req.body["nombreConsulta"]) { res.status(400).json({ error: "No se ha proporcionado el nombre de la consulta" }); return; }
    if (!req.body["probDetalle"]) { res.status(400).json({ error: "No se ha proporcionado el detalle del problema" }); return; }

    console.log("RUTAS >> ZONAS > Registrando nueva zona...");

    const nuevaZona = req.body;
    const Consulta = nuevaZona["nombreConsulta"];
    const Problema = nuevaZona["probDetalle"];

    try {
        var nuevaConsulta = null;
        await BDD.transaction(async (t) => {
            const problema = await Problemas.create({ prob_detalle: Problema }, { transaction: t });
            nuevaConsulta = await Consultas.create({ cons_nombre: Consulta, prob_id: problema.prob_id }, { transaction: t });
        });
        console.log("RUTAS >> ZONAS > Zona registrada correctamente");
        res.json({ nuevaZona : nuevaConsulta.cons_id });
    } catch (error) {
        console.error("RUTAS >> REGISTRAR ZONA > Error al registrar la zona:", error);
        res.status(500).json({ error: "Error al registrar la zona" });
    }
});

//Solicitud de todos los tipos de suelo que puede tener una parcela
router.get('/tipos', validateToken, async(req, res) => {
    try {
        const tipos = await TiposSuelos.findAll();
        console.log("RUTAS >> TIPOS > Consulta de tipos de suelo realizada");
        if (tipos.length > 0) res.json(tipos);
        else res.status(400).json({ error: "No se encontraron tipos de suelo" });
    } catch (error) {
        console.error("RUTAS >> TIPOS > Error al consultar tipos de suelo:", error);
        res.status(500).json({ error: "Error al consultar tipos de suelo" });
    }
});

//Para crear una parcela. Todavía en desarrollo. 
router.post('/newparcel', async (req, res) => {
    try {
        //Todavía en desarrollo.
    } catch (error) {
        console.error("RUTAS >> NUEVA PARCELA > Error al crear una nueva parcela:", error);
        res.status(500).json({ error: "Error al crear una nueva parcela" });
    }
});
//#endregion

//#region Rutas relativas a usuarios
//Solicitud de roles
router.get('/roles', async (req, res) => {
    //await TestBDD();
    try {
        const roles = await TiposUsuarios.findAll({
                where: { perus_id: 1 }, 
            attributes: ['tipus_detalles']
        });
        console.log("RUTAS >> ROLES > Consulta de roles realizada");

        res.setHeader('Content-Type', 'application/json');
        if (roles.length > 0) res.json(roles);
        else res.status(400).json({ error: "No hay roles registrados en la BDD" });
    } catch (error) {
        console.error("RUTAS >> ROLES > Error al consultar roles:", error);
        res.status(500).json({ error: "Error al consultar roles" });
    }
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
    const Rol = usuario["rol"].toUpperCase();
    const indexRol = await TiposUsuarios.findOne({ where: { tipus_detalles: Rol } });
    if (!indexRol) { res.status(400).json({ error: "Rol no encontrado" }); return; }

    const Cedula = usuario["cedula"];
    const Nombre = usuario["nombre"];
    const Apellido = usuario["apellido"];
    const Correo = usuario["correo"];
    const Password = await encryptPassword(usuario["password"]);
    const Telefono = usuario["telefono"];

    try {
        await Usuarios.create({
            tipus_id: indexRol.tipus_id,
            user_cedula: Cedula,
            user_nombre: Nombre,
            user_apellido: Apellido,
            user_email: Correo,
            user_password: Password,
            user_telefono: Telefono,
            user_estado: true,
            created_at: new Date(),
            updated_at: new Date()
        });

        console.log("RUTAS >> USUARIOS > Usuario registrado correctamente");
        res.json({ status: "OK" });
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            console.log("RUTAS >> REGISTRAR USUARIO > Se intentó registrar un usuario con un correo existente, abortando registro.");
            res.status(400).json({ error: "Ya existe un usuario con ese correo" });
        } else {
            console.error("RUTAS >> REGISTRAR USUARIO > Error al registrar el usuario:", error);
            res.status(500).json({ error: "Error al registrar el usuario" });
        }
    }
});

//Iniciar Sesión
router.post('/login', async (req, res) => {
    if (!req.body) { res.status(400).json({ error: "No se ha proporcionado información" }); return; }
    if (!req.body["cedula"]) { res.status(400).json({ error: "No se ha proporcionado la cédula" }); return; }
    if (!req.body["password"]) { res.status(400).json({ error: "No se ha proporcionado la contraseña" }); return; }
    console.log("RUTAS >> LOGIN > Iniciando sesión...");

    const cedula = req.body["cedula"];
    const password = req.body["password"];

    try {
        const usuario = await Usuarios.findOne({ where: { user_cedula: cedula } });
        res.setHeader('charset', 'utf-8');
        if (!usuario) {
            console.log("RUTAS >> LOGIN > No se encontró el usuario");
            res.status(400).json({ error: "Usuario no encontrado" });
            return;
        }

        const match = await verifyPassword(password, usuario.user_password);
        if (match) {
            console.log("RUTAS >> LOGIN > Usuario autenticado");
            res.json({ token: generateAccessToken({ username: usuario.user_cedula }) });
        } else {    
            console.log("RUTAS >> LOGIN > Contraseña incorrecta");
            res.status(400).json({ error: "Contraseña incorrecta" });
        }
    } catch (error) {
        console.error("RUTAS >> LOGIN > Error al iniciar sesión:", error);
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
});

//Perfil de usuario
router.get('/profile'/*, validateToken*/, async (req, res) => {
    if (!req.query.user) { res.status(400).json({ error: "No se ha proporcionado un usuario" }); return; }

    try {
        const usuario = await Usuarios.findOne({
            attributes: [
                'user_id',
                'user_cedula',
                'user_nombre',
                'user_apellido',
                'user_email',
                'user_password',
                'user_telefono',
                'user_estado',
                'created_at'
            ],
            include: [{
                model: TiposUsuarios,
                attributes: ['tipus_detalles']
            }],
            where: { user_cedula: req.query.user }
        });
        console.log("RUTAS >> PERFIL > Consulta del perfil", req.query.user, "realizada");
        res.json({
            "id": usuario.user_id,  
            "tipo" : usuario.TiposUsuario.tipus_detalles,
            "cedula": usuario.user_cedula,
            "nombre": usuario.user_nombre,
            "apellido": usuario.user_apellido,
            "correo": usuario.user_email,
            "password": usuario.user_password,
            "telefono": usuario.user_telefono,
            "estado": usuario.user_estado,
            "created_at": usuario.created_at,
        });
    } catch (error) {
        console.error("RUTAS >> PERFIL > Error al consultar el perfil:", error);
        res.status(500).json({ error: "Error al consultar el perfil" });
    }
});
//#endregion

module.exports = { router, TestBDD };
