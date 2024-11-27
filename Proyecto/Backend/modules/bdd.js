//#region Iniciar la BDD
const { Sequelize, DataTypes } = require('sequelize');

// Configuración de la base de datos
const sequelize = new Sequelize('BDD-Soil-Management-4-Soft', 'dev_test_bdd', 'Soil-Management-4-Soft', {
    host: 'localhost', // O la IP del servidor PostgreSQL
    dialect: 'postgres',
    logging: false, // Opcional: deshabilitar logs de SQL
});

// Probar conexión
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexión a PostgreSQL establecida exitosamente.');
    } catch (error) {
        console.error('Error conectándose a PostgreSQL:', error);
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
        console.log('>> [BDD] > Tablas sincronizadas correctamente.');
    } catch (error) {
        console.error('>> [BDD] > Error sincronizando las tablas:', error);
    }
})();
//#endregion

//#region Exportación de las BDD
module.exports = {
    Parcelas, Analisis
}