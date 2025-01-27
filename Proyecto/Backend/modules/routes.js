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
//Solicitud de todas las zonas de un usuario *
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

//Solictud de todas las parcelas de una zona *
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
                attributes: ['parc_id', 'user_id', 'cons_id', 'parc_nombre', 'parc_area', 'parc_coord_lo', 'parc_coord_la', 'parc_descripcion'],
                include: [{
                    model: TiposSuelos,
                    attributes: ['tipos_nombre']
                }],
                where: { parc_id: req.query.idparcela }
            });
            console.log(parcelas);
            parcelas = {
                "parc_id": parcelas.parc_id,
                "tipos_suelo": parcelas.TiposSuelo.tipos_nombre,
                "user_id": parcelas.user_id,
                "cons_id": parcelas.cons_id,
                "parc_nombre": parcelas.parc_nombre,
                "parc_area": parcelas.parc_area,
                "parc_coord_lo": parcelas.parc_coord_lo,
                "parc_coord_la": parcelas.parc_coord_la,
                "parc_descripcion": parcelas.parc_descripcion
            }
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

//Registrar zonas o consultas *
router.post('/registrarzona', validateToken, async (req, res) => {
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

//Solicitud de todos los tipos de suelo que puede tener una parcela *
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

//Para crear una parcela *
router.post('/nuevaparcela', validateToken, async (req, res) => {
    if (!req.body) { res.status(400).json({ error: "No se ha proporcionado información" }); return; }
    if (!req.body["tipos_id"]) { res.status(400).json({ error: "No se ha proporcionado el id del tipo de suelo" }); return; }
    if (!req.body["user_id"]) { res.status(400).json({ error: "No se ha proporcionado el id del usuario" }); return; }
    if (!req.body["cons_id"]) { res.status(400).json({ error: "No se ha proporcionado el id de la Zona" }); return; }
    if (!req.body["parc_nombre"]) { res.status(400).json({ error: "No se ha proporcionado el nombre de la Parcela" }); return; }
    if (!req.body["parc_area"]) { res.status(400).json({ error: "No se ha proporcionado el area de la parcela" }); return; }
    if (!req.body["parc_coord_la"] && req.body["parc_coord_la"] == null) { res.status(400).json({ error: "No se ha proporcionado la coordenada de latitud de la parcela" }); return; }
    if (!req.body["parc_coord_lo"] && req.body["parc_coord_la"] == null) { res.status(400).json({ error: "No se ha proporcionado la coordenada de longitud de la parcela" }); return; }
    if (!req.body["parc_descripcion"]) { res.status(400).json({ error: "No se ha proporcionado la descripcion de la parcela" }); return; }

    console.log("RUTAS >> NUEVA PARCELA > Registrando nueva parcela...");
    const parcela = req.body;

    try {
        await Parcelas.create({
            tipos_id: parcela.tipos_id, user_id: parcela.user_id, cons_id: parcela.cons_id, parc_nombre: parcela.parc_nombre,
            parc_area: parcela.parc_area, parc_coord_la: parcela.parc_coord_la, parc_coord_lo: parcela.parc_coord_lo,
            parc_descripcion: parcela.parc_descripcion
        });

        console.log("RUTAS >> NUEVA PARCELA > Parcela registrada correctamente");
        res.json({ status: "OK" });
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
    if (!req.body["rol"] && typeof req.body["rol"] !== string) { res.status(400).json({ error: "No se ha proporcionado el rol o rol inválido" }); return; }
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
            res.status(500).json({ error: "Error al registrar el usuario", errorDetalles : error.message });
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
        if (!usuario.user_estado) {
            console.log("RUTAS >> LOGIN > Usuario deshabilitado");
            res.status(400).json({ error: "Usuario deshabilitado, por favor comunicarse con el administrador" });
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
        res.status(500).json({ error: "Error al iniciar sesión", errorDetalles : error.message});
    }
});

//Perfil de usuario *
router.get('/profile', validateToken, async (req, res) => {
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

//Actualizar la cuenta *
router.put('/account', validateToken, async (req, res) => {
    if (!req.body) { res.status(400).json({ error: "No se ha proporcionado información" }); return; }

    try {
        let usuario = await Usuarios.findOne({ where: { user_id: req.body.id } });
        let tipo_id = await TiposUsuarios.findOne({ where: { tipus_detalles: req.body.tipo } });
        usuario.tipus_id = tipo_id.tipus_id;
        usuario.user_cedula = req.body.cedula;
        usuario.user_nombre = req.body.nombre;
        usuario.user_apellido = req.body.apellido;
        usuario.user_email = req.body.correo.toLowerCase();
        usuario.user_telefono = req.body.telefono;
        usuario.updated_at = new Date();
        await usuario.save();

        console.log("RUTAS >> ACTUALIZAR CUENTA > Cuenta actualizada correctamente");
        res.json({ status: "OK" });
    } catch (error) {
        console.error("RUTAS >> ACTUALIZAR CUENTA > Error al actualizar la cuenta:", error);
        res.status(500).json({ error: "Error al actualizar la cuenta", detallesError: error.message });
    }

});

//Deshabilitar la cuenta *
router.delete('/account', validateToken, async (req, res) => {
    if (!req.query.cedula) {
        res.status(400).json({ error: "No se proporcionó el id de la cuenta" });
        return;
    }

    try {
        const usuario = await Usuarios.findOne({ where: { user_cedula: req.query.cedula } });
        if (!usuario) {
            res.status(404).json({ error: "Usuario no encontrado" });
            return;
        }

        usuario.user_estado = false;
        await usuario.save();

        console.log("RUTAS >> DESHABILITAR CUENTA > Cuenta deshabilitada correctamente");
        res.json({ status: "OK" });
    } catch (error) {
        console.error("RUTAS >> DESHABILITAR CUENTA > Error al deshabilitar la cuenta:", error);
        res.status(500).json({ error: "Error al deshabilitar la cuenta", detallesError: error.message });
    }
});

//Cambiar Contraseña *
router.put('/password', validateToken, async (req, res) => {
    if (!req.body) { res.status(400).json({ error: "No se ha proporcionado información" }); return; }
    if (!req.body.cedula) { res.status(400).json({ error: "No se ha proporcionado la cédula" }); return; }
    if (!req.body.password) { res.status(400).json({ error: "No se ha proporcionado la nueva contraseña" }); return; }

    try {
        let usuario = await Usuarios.findOne({ where: { user_cedula: req.body.cedula } });
        usuario.user_password = await encryptPassword(req.body.password);
        usuario.updated_at = new Date();
        await usuario.save();

        console.log("RUTAS >> CAMBIAR CONTRASEÑA > Contraseña cambiada correctamente");
    } catch (error) {
        console.error("RUTAS >> CAMBIAR CONTRASEÑA > Error al cambiar la contraseña:", error);
        res.status(500).json({ error: "Error al cambiar la contraseña", detallesError: error.message });
    }
});

//Recuperar la cuenta, primer paso. Encontrar la cuenta
router.get('/recover', async (req, res) => {
    if (!req.query.cedula) { res.status(400).json({ error: "No se ha proporcionado la cédula" }); return; }
    if (!req.query.email) { res.status(400).json({ error: "No se ha proporcionado el correo" }); return; }
    if (!req.query.telefono) { res.status(400).json({ error: "No se ha proporcionado el número de teléfono" }); return; }

    try {
        let usuario = await Usuarios.findOne({ where: { user_cedula: req.query.cedula, user_email: req.query.email, user_telefono: req.query.telefono } });
        if (!usuario) {
            res.status(404).json({ error: "Error: Datos incorrectos o inválidos" });
            return;
        }

        console.log("RUTAS >> RECUPERAR CUENTA > Cuenta para recuperación encontrada exitosamente");
        res.json({ valid: true });
    } catch (error) {
        console.error("RUTAS >> RECUPERAR CUENTA > Error al recuperar la cuenta:", error);
        res.status(500).json({ error: "Error al recuperar la cuenta", detallesError: error.message });  
    }
});

//Recuperar la cuenta, segundo paso. Cambiar la contraseña
router.put('/recover', async (req, res) => {
    if (!req.body) { res.status(400).json({ error: "No se ha proporcionado información" }); return; }
    if (!req.body.cedula) { res.status(400).json({ error: "No se ha proporcionado la cédula" }); return; }
    if (!req.body.password) { res.status(400).json({ error: "No se ha proporcionado la nueva contraseña" }); return; }

    try {
        let usuario = await Usuarios.findOne({ where: { user_cedula: req.body.cedula } });
        usuario.user_password = await encryptPassword(req.body.password);
        usuario.updated_at = new Date();
        await usuario.save();
        console.log("RUTAS >> RECUPERAR CUENTA > Cuenta recuperada correctamente");
        res.json({ status: "OK" });
    } catch (error) {
        console.error("RUTAS >> RECUPERAR CUENTA > Error al recuperar la cuenta:", error);
        res.status(500).json({ error: "Error al recuperar la cuenta", detallesError: error.message });
    }
})
//#endregion

module.exports = { router, TestBDD };
