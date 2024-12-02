//#region Iniciar la BDD
require('dotenv').config({ path: '../.env' });
const { Sequelize, DataTypes } = require('sequelize');

// Configuración de la base de datos RENDER
const sequelizeRender = new Sequelize(process.env.DB_NAME_RENDER, process.env.DB_USER_RENDER, process.env.DB_PASSWORD_RENDER, {
    host: process.env.DB_HOST_RENDER,
    dialect: 'postgres',
    logging: false,
});

// Configuración de la base de datos LOCAL
const sequelizeLocal = new Sequelize(process.env.DB_NAME_LOCAL, process.env.DB_USER_LOCAL, process.env.DB_PASSWORD_LOCAL, {
    host: process.env.DB_HOST_LOCAL,
    dialect: 'postgres',
    logging: false,
});

let sequelize = sequelizeLocal;

// Probar conexión RENDER
(async () => {
    try {
        await sequelizeRender.authenticate();
        console.log('BDD >> Conexión a PostgreSQL RENDER establecida exitosamente.');
        sequelize = sequelizeRender; // Usar la conexión de RENDER si es exitosa
    } catch (error) {
        console.error('BDD >> Error conectándose a PostgreSQL RENDER:', error.message);
        console.log('BDD >> Intentando conexión a base de datos LOCAL...');
        try {
            await sequelizeLocal.authenticate();
            console.log('BDD >> Conexión a PostgreSQL LOCAL establecida exitosamente.');
            sequelize = sequelizeLocal; // Usar la conexión local si RENDER falla
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

//#region Sincronización del Modelo
(async () => {
    try {
        await sequelize.sync();
        console.log('BDD > Tablas sincronizadas correctamente.');
    } catch (error) {
        console.error('BDD > Error sincronizando las tablas:', error);
    }
})();
//#endregion

//#region Exportación de las BDD
module.exports = {
    Parcelas, Analisis
}