//#region Iniciar la BDD
require('dotenv').config({ path: '../.env' });
const { Sequelize, DataTypes } = require('sequelize');

console.log("BDD >> Comprobando Variables", process.env.DB_RENDER_URL)

// Configuración de la base de datos RENDER
const sequelizeRender = new Sequelize(process.env.DB_RENDER_URL, {
    dialect: 'postgres',
    logging: console.log,
    ssl: {
        require: true,
        rejectUnauthorized: false, // Esto permite aceptar certificados no verificados si el certificado de Render no es reconocido.
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,  // 30 segundos de espera para adquirir la conexión
        idle: 10000,
    },
    retry: {
        max: 3,
        match: [/ECONNRESET/, /ETIMEDOUT/], // Errores a los que responder
        backoffBase: 1000, // Tiempo en ms antes de reintentar
        backoffExponent: 1.5 // Escala del tiempo de espera
    },
});

// Configuración de la base de datos LOCAL
const sequelizeLocal = new Sequelize(process.env.DB_NAME_LOCAL, process.env.DB_USER_LOCAL, process.env.DB_PASSWORD_LOCAL, {
    host: process.env.DB_HOST_LOCAL,
    dialect: 'postgres',
    logging: console.log,
    ssl: {
        require: true,
        rejectUnauthorized: false, // Esto permite aceptar certificados no verificados si el certificado de Render no es reconocido.
    },
    retry: {
        max: 3,
        match: [/ECONNRESET/, /ETIMEDOUT/], // Errores a los que responder
        backoffBase: 1000, // Tiempo en ms antes de reintentar
        backoffExponent: 1.5 // Escala del tiempo de espera
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,  // 30 segundos de espera para adquirir la conexión
        idle: 10000,
    }
});

let sequelize = null;

// Probar conexión RENDER
(async () => {
    try {
        await sequelizeRender.authenticate();
        console.log('BDD >> Conexión a PostgreSQL RENDER establecida exitosamente.');
        sequelize = sequelizeRender; // Usar la conexión de RENDER si es exitosa

        // Sincronizar tablas en RENDER
        try {
            await sequelize.sync();
            console.log('BDD >> Tablas sincronizadas correctamente.');
        } catch (syncError) {
            console.error('BDD >> Error sincronizando las tablas en RENDER:', syncError.message);
        }

    } catch (error) {
        console.error('BDD >> Error conectándose a PostgreSQL RENDER:', error);
        console.log('BDD >> Detalles:', error.stack); // Registra más detalles
        try {
            await sequelizeLocal.authenticate();
            console.log('BDD >> Conexión a PostgreSQL LOCAL establecida exitosamente.');
            sequelize = sequelizeLocal; // Usar la conexión local si RENDER falla

            // Sincronizar tablas en LOCAL
            try {
                await sequelize.sync();
                console.log('BDD >> Tablas sincronizadas correctamente.');
            } catch (syncError) {
                console.error('BDD >> Error sincronizando las tablas en LOCAL:', syncError.message);
            }

        } catch (localError) {
            console.error('BDD >> Error conectándose a PostgreSQL LOCAL:', localError.message);
        }
    }
})();
//#endregion
