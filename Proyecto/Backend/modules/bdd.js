//#region Iniciar la BDD
require('dotenv').config({ path: '../.env' });
const { Sequelize, DataTypes } = require('sequelize');

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

let sequelize = sequelizeRender;

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

//#region Definición de Tablas y Campos
const Parcelas = sequelize.define('Parcelas', {
    ID: {
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: 'parcelaid',
    },
    Nombre: {
        type: DataTypes.STRING(25),
        allowNull: false,
        field: 'nombreparcela',
    },
    Latitud: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'coordenadaslaparcela',
    },
    Longitud: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'coordenadasloparcela',
    },
    Tamaño: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'tamañoparcela',
    },
    Tipo: {
        type: DataTypes.STRING(25),
        allowNull: false,
        field: 'tipossuelosparcela',
    }
}, {
    tableName: 'parcelas',
    timestamps: false,
});

const Analisis = sequelize.define('Analisis', {
    ID: {
        type: DataTypes.SMALLINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        field: 'analisisid',
    },
    ParcelaID: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        field: 'parcelaid',
        references: {
            model: Parcelas,
            key: 'parcelaid',
        }
    },
    Fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'fechaanalisis',
    },
    PH: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'phanalisis',
    },
    MateriaOrganica: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'materiaorganicaanalisis',
    },
    Nitrogeno: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'nitrogenoanalisis',
    },
    Fosforo: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'fosforoanalisis',
    },
    Potasio: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'potasioanalisis',
    },
    Salinidad: {
        type: DataTypes.FLOAT,
        allowNull: false,
        field: 'salinidadanalisis',
    },
}, {
    tableName: 'analisis_suelos',
    timestamps: false,
});
//#endregion

//#region definición de relaciones
Parcelas.hasMany(Analisis, {
    foreignKey: 'parcelaid',
    sourceKey: 'ID',
});

Analisis.belongsTo(Parcelas, {
    foreignKey: 'parcelaid',
    targetKey: 'ID',
});
//#endregion

//#region Exportación de las BDD
module.exports = {
    Parcelas, Analisis
}
