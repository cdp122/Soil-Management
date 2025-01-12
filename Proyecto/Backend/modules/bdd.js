//#region Instanciación de la bdd
require('dotenv').config();
const { Client } = require('pg');

const bddLocal = new Client({
    host: process.env.DB_HOST_LOCAL,
    database: process.env.DB_NAME_LOCAL,
    user: process.env.DB_USER_LOCAL,
    password: process.env.DB_PASSWORD_LOCAL,
    port: process.env.DB_PORT,
});

const bddAzure = new Client({
    connectionString: process.env.DB_AZURE_URL,
});

let bdd = null;

function ConectarLocal() {
    return new Promise((resolve, reject) => {
        bddLocal.connect((error) => {
            if (error) {
                console.error("BDD >> Conexión Local error:\n", error);
                return reject(error);
            }
            resolve(bddLocal);
        });
    });
}

function ConectarAzure() {
    return new Promise((resolve, reject) => {
        bddAzure.connect((error) => {
            if (error) {
                console.error("BDD >> Conexión Azure error: ", error.routine);
                return reject(error);
            }
            resolve(bddAzure);
        });
    });
}

async function Conectar() {
    try {
        console.log("BDD >> Intentando conectar a Azure");
        await ConectarAzure();
        bdd = bddAzure;
        console.log("BDD >> Conexión a la BDD Azure exitosa");
        return bdd;
    }
    catch {
        try {
            console.log("BDD >> Intentando conectar a LOCAL",);
            await ConectarLocal();
            bdd = bddLocal;
            console.log("BDD >> Conexión a la BDD Local exitosa");
            return bdd;
        }
        catch { console.log("BDD >> No se pudo conectar a la BDD"); }
    }
}

function Consultar(bdd, query) {
    return new Promise((resolve, reject) => {
        bdd.query(query, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results.rows);
        });
    });
}
//#endregion

//#region Conseguir Registros
async function ConseguirRegistros(tabla, nombreParametro, parametroBusqueda) {
    try {
        const query = `SELECT * FROM ${tabla} WHERE ${nombreParametro} = $1`;
        const registro = await Consultar({
            text: query,
            values: [parametroBusqueda],
        });
        if (registro.length === 0) return null;
        console.log("Enviando resultado:", query);
        return registro;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function LogInClient(idCliente) {
    return await ConseguirRegistros("tb_clientes", "idCliente", idCliente);
}

async function LogInEmpleado(idEmpleado) {
    return await ConseguirRegistros("tb_empleados", "idEmpleado", idEmpleado);
}

async function RecibirDatos(idCliente) {
    return await ConseguirRegistros("tb_clientes", "idCliente", idCliente);
}

async function ConseguirNumFilas(tabla) {
    const query = `SELECT TABLE_ROWS FROM information_schema.tables WHERE TABLE_NAME = $1`;

    try {
        const registro = await Consultar({
            text: query,
            values: [tabla],
        });
        console.log("Cargando nro de Registros");
        return registro;
    } catch (error) {
        console.error(error);
        return null;
    }
}
//#endregion

async function InsertarRegistro(tabla, params, values) {
    let query = `INSERT INTO ${tabla} (`;
    if (params.length != values.length) return false;
    params.forEach(parametro => {
        query += `${parametro}, `;
    });
    query = query.slice(0, -2) + ") VALUES (";
    values.forEach((valor, index) => {
        query += `$${index + 1}, `;
    });
    query = query.slice(0, -2) + ")";
    try {
        await Consultar({
            text: query,
            values: values,
        });
        console.log("Registro ingresado:", query);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

async function ModificarRegistro(tabla, nuevoParam, actual, paramTarg, target) {
    try {
        const query = `UPDATE ${tabla} SET ${nuevoParam} = $1 WHERE ${paramTarg} = $2`;
        const registro = await Consultar({
            text: query,
            values: [actual, target],
        });
        if (registro.length === 0) return null;
        console.log("Registro Modificado:", query);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

async function ModificarRegistros(tabla, params, nuevosValores, paramTarg, target) {
    if (params.length != nuevosValores.length) return false;

    let query = `UPDATE ${tabla} SET `;
    params.forEach((param, index) => {
        query += `${param} = $${index + 1}, `;
    });
    query = query.slice(0, -2) + ` WHERE ${paramTarg} = $${params.length + 1}`;

    try {
        await Consultar({
            text: query,
            values: [...nuevosValores, target],
        });
        console.log("Registros modificados exitosamente: ", query);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

async function BorrarRegistro(tabla, parametro, valor) {
    try {
        const query = `DELETE FROM ${tabla} WHERE ${parametro} = $1`;
        await Consultar({
            text: query,
            values: [valor],
        });
        console.log("Registro Eliminado:", query);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = { bdd, Conectar, Consultar };
