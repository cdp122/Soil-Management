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

        console.log("RUTAS >> ZONAS > Consulta de zonas realizada del usuario", req.query.userid);
        if (zonas.length > 0) res.json(zonas);
        else res.status(400).json({ error: "No se encontraron zonas para el usuario" });
    } catch (error) {
        console.error("RUTAS >> ZONAS > Error al consultar zonas:", error);
        res.status(500).json({ error: "Error al consultar zonas", detalles: error.original?.detail || error.message });
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
        res.status(500).json({ error: "Error al consultar parcelas", detalles: error.original?.detail || error.message });
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
        res.status(500).json({ error: "Error al registrar la zona", detalles: error.original?.detail || error.message });
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
        res.status(500).json({ error: "Error al consultar tipos de suelo", detalles: error.original?.detail || error.message });
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
        res.status(500).json({ error: "Error al crear una nueva parcela", detalles: error.original?.detail || error.message });
    }
});

//Para conseguir los elementos registrados en la BDD *
router.get('/elementos', validateToken, async (req, res) => {
    try {
        const elementos = await Elementos.findAll({
            attributes: [
                'elem_simbolo',
                'elem_nombre',
                'uni_simbolo'
            ]
        });
        console.log("RUTAS >> ELEMENTOS > Consulta de elementos realizada");
        if (elementos.length > 0) res.json(elementos);
        else res.status(400).json({ error: "No se encontraron elementos" });
    } catch (error) {
        console.error("RUTAS >> UNIDADES > Error al consultar elementos:", error);
        res.status(500).json({ error: "Error al consultar elementos", detalles: error.original?.detail || error.message });
    }
});

//Para registrar una nueva muestra *
router.post('/muestras', validateToken, async (req, res) => {
    if (!req.body) { res.status(400).json({ error: "No se ha proporcionado información" }); return; }
    if (!req.body.parc_id) { res.status(400).json({ error: "No se ha proporcionado el id de la parcela" }); return; }
    if (!req.body.ph) { res.status(400).json({ error: "No se ha proporcionado el coeficiente de ph" }); return; }
    if (!req.body.mat_org) { res.status(400).json({ error: "No se ha proporcionado el porcentaje de cantidad orgánica" }); return; }
    if (!req.body.fecha_registro) { res.status(400).json({ error: "No se ha proporcionado la fecha de registro" }); return; }

    console.log("RUTAS >> MUESTRAS > Registrando nueva muestra...");

    //Si hay variables secundarias debe de comprobarse de la buena estructura del json
    if (req.body.elems) {
        console.log("RUTAS >> MUESTRAS > Se identificaron elementos en el registro de muestras. Comprobando estructura de elementos...");
        var elem;
        for (var elems in req.body.elems) {
            elem = req.body.elems[elems];
            if (!elem.simb_elem) { res.status(400).json({ error: "No se ha proporcionado el símbolo del elemento en el registro " + (elems + 1) }); return; }
            if (!elem.cant_elem) { res.status(400).json({ error: "No se ha proporcionado la cantidad del elemento en el registro " + (elems + 1) }); return; }
        }
        console.log("RUTAS >> MUESTRAS > Estructura de elementos correcta. Iniciando con el registro...");
    }

    try {
        await BDD.transaction(async (t) => {
            const muestra = await Muestras.create({
                parc_id: req.body.parc_id, mue_ph: req.body.ph, mue_con_elec: req.body.con_elec, mue_porc_mat_org: req.body.mat_org,
                mue_cap_inter_cati: req.body.inter_cati, mue_salinidad: req.body.salinidad, mue_fecha_registro: req.body.fecha_registro
            }, { transaction: t });

            var elem;

            for (var elems in req.body.elems) {
                elem = req.body.elems[elems];
                await VariablesSecundarias.create({
                    mue_id: muestra.mue_id, elem_simbolo: elem.simb_elem, anpar_elem_cant: elem.cant_elem
                }, { transaction: t });
            }
        });

        console.log("RUTAS >> MUESTRAS > Muestras registradas correctamente");
        res.json({ status: "OK" });
    } catch (error) {
        console.error("RUTAS >> MUESTRAS > Error al registrar las muestras:", error);
        res.status(500).json({ error: "Error al registrar las muestras", detalles: error.original?.detail || error.message });
    }
});

//Para registrar nuevas variables secundarias *
router.post('/variables', validateToken, async (req, res) => {
    if (!req.body) { res.status(400).json({ error: "No se ha proporcionado información" }); return; } 
    if (!req.body.mue_id) { res.status(400).json({ error: "No se ha proporcionado el id de la muestra" }); return; }
    if (!req.body.elems) { res.status(400).json({ error: "No se ha proporcionado información de las nuevas variables" }); return; }

    var elem;
    for (var elems in req.body.elems) {
        elem = req.body.elems[elems];
        if (!elem.simb_elem) { res.status(400).json({ error: "No se ha proporcionado el símbolo del elemento en el registro " + (elems + 1) }); return; }
        if (!elem.cant_elem) { res.status(400).json({ error: "No se ha proporcionado la cantidad del elemento en el registro " + (elems + 1) }); return; }
    }
    console.log("RUTAS >> VARIABLES > Registro de variables secundarias a la muestra", req.body.mue_id);

    try {
        var elem;
        await BDD.transaction(async (t) => {
            for (var elems in req.body.elems) {
                elem = req.body.elems[elems];
                await VariablesSecundarias.create({
                    mue_id: req.body.mue_id, elem_simbolo: elem.simb_elem, anpar_elem_cant: elem.cant_elem
                }, { transaction: t });
            }
        });

        console.log("RUTAS >> VARIABLES > Variables registradas correctamente");
        res.json({ status: "OK" });
    } catch (error) {
        console.error("RUTAS >> VARIABLES > Error al registrar las variables:", error);
        res.status(500).json({ error: "Error al registrar las variable", detalles: error.original?.detail || error.message });
    }
});

//Consultar las muestras correspondientes a una parcela *
router.get('/muestras', validateToken, async (req, res) => {
    if (!req.query.parc_id) { res.status(400).json({ error: "No se ha proporcionado el id de la parcela" }); return; }

    try {
        const muestras = await Muestras.findAll({ where: { parc_id: req.query.parc_id } });

        console.log("RUTAS >> MUESTRAS > Consulta de muestras realizada de la parcela", req.query.parc_id);
        if (muestras.length > 0) res.json(muestras);
        else res.status(400).json({ error: "No se encontraron muestras" });
    }catch(error) {
        console.log("RUTAS >> MUESTRAS > Error al consultar las muestras:", error);
        res.status(500).json({ error: "Error al consultar las muestras", detalles: error.original?.detail || error.message });
    }
});

//Para modificar las muestras *
router.put('/muestras', validateToken, async (req, res) => {
    if (!req.body.mue_id) { res.status(400).json({ error: "No se ha proporcionado el id de la muestra" }); return; }
    //Si hay variables secundarias debe de comprobarse de la buena estructura del json
    if (req.body.elems) {
        console.log("RUTAS >> MUESTRAS > Se identificaron elementos en la actualización de muestras. Comprobando estructura de elementos...");
        var elem;
        for (var elems in req.body.elems) {
            elem = req.body.elems[elems];
            if (!elem.simb_elem) { res.status(400).json({ error: "No se ha proporcionado el símbolo del elemento en el registro " + (elems + 1) }); return; }
            if (!elem.cant_elem) { res.status(400).json({ error: "No se ha proporcionado la cantidad del elemento en el registro " + (elems + 1) }); return; }
        }
        console.log("RUTAS >> MUESTRAS > Estructura de elementos correcta. Iniciando con la actualización...");
    }

    try {
        var muestras = await Muestras.findOne({ where: { mue_id: req.body.mue_id } });
        if (!muestras) {
            res.status(404).json({ error: "Muestra no encontrada" });
            return;
        }
        if (req.body.mue_ph) muestras.mue_ph = req.body.mue_ph;
        if (req.body.mue_con_elec) muestras.mue_con_elec = req.body.mue_con_elec;
        if (req.body.mue_porc_mat_org) muestras.mue_porc_mat_org = req.body.mue_porc_mat_org;
        if (req.body.mue_cap_inter_cati) muestras.mue_cap_inter_cati = req.body.mue_cap_inter_cati;
        if (req.body.mue_salinidad) muestras.mue_salinidad = req.body.mue_salinidad;
        if (req.body.mue_fecha_registro) muestras.mue_fecha_registro = req.body.mue_fecha_registro;

        await BDD.transaction(async (t) => {
            var elem;

            for (var elems in req.body.elems) {
                elem = req.body.elems[elems];
                if (!elem.var_id) {
                    await VariablesSecundarias.create({
                        mue_id: muestras.mue_id, elem_simbolo: elem.simb_elem, anpar_elem_cant: elem.cant_elem
                    }, { transaction: t });
                }
                else {
                    var variable = await VariablesSecundarias.findOne({ where: { anpar_varsec: elem.var_id } });
                    if (variable) {
                        variable.elem_simbolo = elem.simb_elem;
                        variable.anpar_elem_cant = elem.cant_elem;
                        await variable.save({ transaction: t });
                    }
                    else { throw new Error("No se encontró la variable con id " + elem.var_id); }
                }
                await muestras.save({ transaction: t });
            }
        });
        console.log("RUTAS >> MUESTRAS > Muestra", muestras.mue_id, "editada correctamente");
        res.json({ status: "OK" });
    } catch (error) {
        console.log("RUTAS >> MUESTRAS > Error al modificar las muestras:", error);
        res.status(500).json({ error: "Error al modificar las muestras", detalles: error.original?.detail || error.message });
    }
});

//Para conseguir las variables de acuerdo a las muestras *
router.get('/variables', validateToken, async (req, res) => {
    if (!req.query.mue_id) { res.status(400).json({ error: "No se ha proporcionado el id de la muestra" }); return; }

    try {
        const variables = await VariablesSecundarias.findAll({ where: { mue_id: req.query.mue_id } });
        console.log("RUTAS >> VARIABLES > Consulta de variables realizada de la muestra", req.query.mue_id);
        if (variables.length > 0) res.json(variables);
        else res.status(400).json({ error: "No se encontraron variables" });
    } catch (error) {
        console.error("RUTAS >> VARIABLES > Error al consultar variables:", error);
        res.status(500).json({ error: "Error al consultar variables", detalles: error.original?.detail || error.message });
    }
});

//Para eliminar las muestras *
router.delete('/parcelas',validateToken, async (req, res) => {
    if (!req.body) { res.status(400).json({ error: "No se ha proporcionado información" }); return; }
    if (!req.body.parc_id && !req.body.parcelas) { res.status(400).json({ error: "No se ha proporcionado el/los id de la(s) parcela(s)" }); return; }

    try {
        if (req.body.parc_id) {
            await Parcelas.destroy({ where: { parc_id: req.body.parc_id } });
            console.log("RUTAS >> PARCELAS > Parcela eliminada correctamente");
        }
        else if (req.body.parcelas) {
            await BDD.transaction(async (t) => {
                for (const parcela of req.body.parcelas) {
                    await Parcelas.destroy({ where: { parc_id: parcela }, transaction: t });
                }
            });
            console.log("RUTAS >> PARCELAS > Parcelas eliminadas correctamente");
        }

        res.json({ status: "OK" });
    } catch (error) {
        console.error("RUTAS >> PARCELAS > Error al eliminar parcelas:", error);
        res.status(500).json({ error: "Error al eliminar parcelas", detalles: error.original?.detail || error.message });
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
        res.status(500).json({ error: "Error al consultar roles", detalles: error.original?.detail || error.message });
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
            res.status(500).json({ error: "Error al registrar el usuario", detalles: error.original?.detail || error.message });
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
            res.status(401).json({ error: "Usuario no encontrado" });
            return;
        }
        if (!usuario.user_estado) {
            console.log("RUTAS >> LOGIN > Usuario deshabilitado");
            res.status(401).json({ error: "Usuario deshabilitado, por favor comunicarse con el administrador" });
            return;
        }
        if (usuario.tipus_id != 1 && usuario.tipus_id != 2 && usuario.tipus_id != 3) {
            console.log("RUTAS >> LOGIN > Usuario de otro módulo detectado. Impidiendo inicio de sesión");
            res.status(401).json({ error: "Usuario no autorizado" });
        }

        const match = await verifyPassword(password, usuario.user_password);
        if (match) {
            console.log("RUTAS >> LOGIN > Usuario autenticado");
            res.json({ token: generateAccessToken({ username: usuario.user_cedula }) });
        } else {    
            console.log("RUTAS >> LOGIN > Contraseña incorrecta");
            res.status(401).json({ error: "Contraseña incorrecta" });
        }
    } catch (error) {
        console.error("RUTAS >> LOGIN > Error al iniciar sesión:", error);
        res.status(500).json({ error: "Error al iniciar sesión", detalles: error.original?.detail || error.message});
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
        res.status(500).json({ error: "Error al consultar el perfil", detalles: error.original?.detail || error.message });
    }
});

//Actualizar la cuenta *
router.put('/account', validateToken, async (req, res) => {
    if (!req.body) { res.status(400).json({ error: "No se ha proporcionado información" }); return; }

    try {
        let usuario = await Usuarios.findOne({ where: { user_cedula: req.body.cedula } });
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
        res.status(500).json({ error: "Error al actualizar la cuenta", detalles: error.original?.detail || error.message });
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
        res.status(500).json({ error: "Error al deshabilitar la cuenta", detalles: error.original?.detail || error.message });
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
        res.status(500).json({ error: "Error al cambiar la contraseña", detalles: error.original?.detail || error.message });
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

        console.log("RUTAS >> RECUPERAR CUENTA [1] > Cuenta para recuperación encontrada exitosamente");
        res.json({ valid: true });
    } catch (error) {
        console.error("RUTAS >> RECUPERAR CUENTA [1]> Error al recuperar la cuenta:", error);
        res.status(500).json({ error: "Error al recuperar la cuenta", detalles: error.original?.detail || error.message });  
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
        console.log("RUTAS >> RECUPERAR CUENTA [2] > Cuenta recuperada correctamente");
        res.json({ success: true });
    } catch (error) {
        console.error("RUTAS >> RECUPERAR CUENTA [2] > Error al recuperar la cuenta:", error);
        res.status(500).json({ error: "Error al recuperar la cuenta", detalles: error.original?.detail || error.message });
    }
})
//#endregion

module.exports = { router, TestBDD };
