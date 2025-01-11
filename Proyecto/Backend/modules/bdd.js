//#region Iniciar la BDD
require('dotenv').config({ path: '../.env' });
const { Sequelize, DataTypes } = require('sequelize');

// Configuración de la base de datos AZURE
const sequelizeRender = new Sequelize(process.env.DB_AZURE_URL, {
    dialect: 'postgres',
    logging: false, //si se requiere un loggin solo se pone console.log sin "()"
    ssl: {
        require: true,
        rejectUnauthorized: false, // Esto permite aceptar certificados no verificados si el certificado de Render no es reconocido.
    }, debug: true,
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
    logging: false, //si se requiere un loggin solo se pone console.log sin "()"
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    }, debug: true,
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

// Probar conexión AZURE
(async () => {
    try {
        await sequelizeRender.authenticate();
        console.log('BDD >> Conexión a PostgreSQL AZURE establecida exitosamente.');
        sequelize = sequelizeRender; // Usar la conexión de AZURE si es exitosa

        // Sincronizar tablas en AZURE
        try {
            await sequelize.sync();
            console.log('BDD >> Tablas sincronizadas correctamente.');
        } catch (syncError) {
            console.error('BDD >> Error sincronizando las tablas en AZURE:', syncError.message);
        }

    } catch (error) {
        console.error('BDD >> Error conectándose a PostgreSQL AZURE:', error);
        console.log('BDD >> Detalles:', error.stack); // Registra más detalles
        try {
            await sequelizeLocal.authenticate();
            console.log('BDD >> Conexión a PostgreSQL LOCAL establecida exitosamente.');
            sequelize = sequelizeLocal; // Usar la conexión local si AZURE falla

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
const PermisosUsuarios = sequelize.define('PermisosUsuarios', {
    perus_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    perus_detalle: {
        type: DataTypes.STRING(50),
        allowNull: false,
    }
}, {
    tableName: 'permisos_usuarios',
    timestamps: false,
});

const TiposSuelos = sequelize.define('TiposSuelos', {
    tipos_id: {
        type: DataTypes.STRING(5),
        primaryKey: true,
        allowNull: false,
    },
    tipos_nombre: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    tipos_descripcion: {
        type: DataTypes.STRING(100),
        allowNull: false,
    }
}, {
    tableName: 'sm_f_tipossuelos',
    timestamps: false,
});

const Parcelas = sequelize.define('Parcelas', {
    parc_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    tipos_id: {
        type: DataTypes.STRING(5),
        allowNull: false,
        references: {
            model: TiposSuelos,
            key: 'tipos_id',
        }
    },
    user_id: {
        type: DataTypes.STRING(11),
        allowNull: true,
        references: {
            model: 'usuarios',
            key: 'user_id',
        }
    },
    parc_nombre: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    parc_area: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    parc_coord_la: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    parc_coord_lo: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    parc_descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    }
}, {
    tableName: 'sm_parcelas',
    timestamps: false,
});

const Consultas = sequelize.define('Consultas', {
    cons_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    parc_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: Parcelas,
            key: 'parc_id',
        }
    },
    cons_nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    prob_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'sm_q_problema',
            key: 'prob_id',
        }
    }
}, {
    tableName: 'sm_q_consultas',
    timestamps: false,
});

const Elementos = sequelize.define('Elementos', {
    elem_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    elem_nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    elem_unidad_medida: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'sm_q_unidades',
            key: 'uni_id',
        }
    },
    elem_simbolo: {
        type: DataTypes.STRING(3),
        allowNull: false,
    },
    elem_valor_min_rec: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    elem_valor_max_rec: {
        type: DataTypes.FLOAT,
        allowNull: true,
    }
}, {
    tableName: 'sm_q_elementos',
    timestamps: false,
});

const Muestras = sequelize.define('Muestras', {
    mue_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    parc_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Parcelas,
            key: 'parc_id',
        }
    },
    mue_ph: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    mue_con_elec: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    mue_porc_mat_org: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    mue_cap_inter_cati: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    mue_salinidad: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    mue_fecha_registro: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    tableName: 'sm_q_muestras',
    timestamps: false,
});

const Problemas = sequelize.define('Problemas', {
    prob_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    prob_detalle: {
        type: DataTypes.STRING(15),
        allowNull: false,
    }
}, {
    tableName: 'sm_q_problema',
    timestamps: false,
});

const Unidades = sequelize.define('Unidades', {
    uni_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    uni_simbolo: {
        type: DataTypes.STRING(5),
        allowNull: false,
    },
    uni_nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
    }
}, {
    tableName: 'sm_q_unidades',
    timestamps: false,
});

const VariablesSecundarias = sequelize.define('VariablesSecundarias', {
    anpar_varsec: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    mue_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Muestras,
            key: 'mue_id',
        }
    },
    anpar_elem_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Elementos,
            key: 'elem_id',
        }
    },
    anpar_elem_cant: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }
}, {
    tableName: 'sm_q_variables_secundarias',
    timestamps: false,
});

const TiposUsuarios = sequelize.define('TiposUsuarios', {
    tipus_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    perus_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: PermisosUsuarios,
            key: 'perus_id',
        }
    },
    tipus_detalles: {
        type: DataTypes.STRING(50),
        allowNull: false,
    }
}, {
    tableName: 'tipos_usuarios',
    timestamps: false,
});

const Usuarios = sequelize.define('Usuarios', {
    user_id: {
        type: DataTypes.STRING(11),
        primaryKey: true,
        allowNull: false,
    },
    tipus_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: TiposUsuarios,
            key: 'tipus_id',
        }
    },
    user_nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    user_apellido: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    user_email: {
        type: DataTypes.STRING(35),
        allowNull: false,
        unique: true,
    },
    user_password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    user_telefono: {
        type: DataTypes.STRING(10),
        allowNull: false,
    },
    user_estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
    }
}, {
    tableName: 'usuarios',
    timestamps: false,
});
//#endregion

//#region definición de relaciones
Parcelas.belongsTo(TiposSuelos, {
    foreignKey: 'tipos_id',
    targetKey: 'tipos_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

Parcelas.belongsTo(Usuarios, {
    foreignKey: 'user_id',
    targetKey: 'user_id',
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
});

Consultas.belongsTo(Problemas, {
    foreignKey: 'prob_id',
    targetKey: 'prob_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

Consultas.belongsTo(Parcelas, {
    foreignKey: 'parc_id',
    targetKey: 'parc_id',
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
});

Elementos.belongsTo(Unidades, {
    foreignKey: 'elem_unidad_medida',
    targetKey: 'uni_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

Muestras.belongsTo(Parcelas, {
    foreignKey: 'parc_id',
    targetKey: 'parc_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

VariablesSecundarias.belongsTo(Muestras, {
    foreignKey: 'mue_id',
    targetKey: 'mue_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

VariablesSecundarias.belongsTo(Elementos, {
    foreignKey: 'anpar_elem_id',
    targetKey: 'elem_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});

TiposUsuarios.belongsTo(PermisosUsuarios, {
    foreignKey: 'perus_id',
    targetKey: 'perus_id',
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
});

Usuarios.belongsTo(TiposUsuarios, {
    foreignKey: 'tipus_id',
    targetKey: 'tipus_id',
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
});
//#endregion

//#region Exportación de las BDD
module.exports = {
    PermisosUsuarios, TiposSuelos, Parcelas, Consultas, Elementos, Muestras, Problemas, Unidades, VariablesSecundarias, TiposUsuarios, Usuarios
}
//#endregion
