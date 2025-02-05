// modules/bdd.js
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

//Configuración de la bdd de Azure
const sequelizeAzure = new Sequelize(process.env.DB_AZURE_URL, {
    dialect: 'postgres',
    logging: false,
    ssl: {
        require: false,
        rejectUnauthorized: false,
    },
    debug: true,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
    retry: {
        max: 3,
        match: [/ECONNRESET/, /ETIMEDOUT/],
        backoffBase: 1000,
        backoffExponent: 1.5
    },
});

// Configuración de la base de datos LOCAL
const sequelizeLocal = new Sequelize(process.env.DB_NAME_LOCAL, process.env.DB_USER_LOCAL, process.env.DB_PASSWORD_LOCAL, {
    host: process.env.DB_HOST_LOCAL,
    dialect: 'postgres',
    logging: false,
    debug: true,
    retry: {
        max: 3,
        match: [/ECONNRESET/, /ETIMEDOUT/],
        backoffBase: 1000,
        backoffExponent: 1.5
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    }
});

let sequelize = null

var PermisosUsuarios, TiposSuelos, Parcelas, Consultas, Elementos, Muestras, Problemas, Unidades, VariablesSecundarias, TiposUsuarios, Usuarios, Rangos;
async function Conectar() {
    try {
        console.log("BDD >> Intentando conectar a Azure");
        await sequelizeAzure.authenticate();
        sequelize = sequelizeAzure;
        console.log("BDD >> Conexión a la BDD Azure exitosa");
        return sequelize;
    } catch (error) {
        console.error("BDD >> Conexión Azure error:", error.original?.routine || error.message);
        try {
            console.log("BDD >> Intentando conectar a LOCAL");
            await sequelizeLocal.authenticate();
            sequelize = sequelizeLocal;
            console.log("BDD >> Conexión a la BDD Local exitosa");
            return sequelize;
        } catch (error) {
            console.error("BDD >> Conexión Local error:", error.original.routine);
            console.log("BDD >> No se pudo conectar a la BDD");
        }
    }
}

async function DefinirPermisos() {
    PermisosUsuarios = sequelize.define('PermisosUsuarios', {
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
    return PermisosUsuarios;
}

async function DefinirTiposUsuarios() {
    TiposUsuarios = sequelize.define('TiposUsuarios', {
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

    TiposUsuarios.belongsTo(PermisosUsuarios, {
        foreignKey: 'perus_id',
        targetKey: 'perus_id',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    });

    PermisosUsuarios.hasMany(TiposUsuarios, {
        foreignKey: 'perus_id',
        sourceKey: 'perus_id',
        onDelete: 'RESTRICT',
        onUpdate: 'RESTRICT',
    });

    return TiposUsuarios;
}

async function DefinirProblemas() {
    Problemas = sequelize.define('Problemas', {
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

    return Problemas;
}

async function DefinirConsultas() {
    Consultas = sequelize.define('Consultas', {
        cons_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
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

    Consultas.belongsTo(Problemas, {
        foreignKey: 'prob_id',
        targetKey: 'prob_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    });

    Problemas.hasMany(Consultas, {
        foreignKey: 'prob_id',
        sourceKey: 'prob_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    });

    return Consultas;
}

async function DefinirUnidades() {
    Unidades = sequelize.define('Unidades', {
        uni_simbolo: {
            type: DataTypes.STRING(7),
            primaryKey: true,
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
    return Unidades;
}

async function DefinirElementos() {
    Elementos = sequelize.define('Elementos', {
        elem_simbolo: {
            type: DataTypes.STRING(5),
            primaryKey: true,
            allowNull: false,
        },
        elem_nombre: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        uni_simbolo: {
            type: DataTypes.STRING(7),
            allowNull: false,
            references: {
                model: Unidades,
                key: 'uni_simbolo',
            }
        },
        elem_peso: {
            type: DataTypes.FLOAT,
            allowNull: true,
        }
    }, {
        tableName: 'sm_q_elementos',
        timestamps: false,
    });

    Elementos.belongsTo(Unidades, {
        foreignKey: 'elem_simbolo',
        targetKey: 'uni_simbolo',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    });

    Unidades.hasMany(Elementos, {
        foreignKey: 'uni_simbolo',
        sourceKey: 'uni_simbolo',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    });

    return Elementos;
}

async function DefinirUsuarios() {
    Usuarios = sequelize.define('Usuarios', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
        user_cedula: {
            type: DataTypes.STRING(10),
            allowNull: false,
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

    Usuarios.belongsTo(TiposUsuarios, {
        foreignKey: 'tipus_id',
        targetKey: 'tipus_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    });

    TiposUsuarios.hasMany(Usuarios, {
        foreignKey: 'tipus_id',
        sourceKey: 'tipus_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    });

    return Usuarios;
}

async function DefinirParcelas() {
    Parcelas = sequelize.define('Parcelas', {
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
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Usuarios,
                key: 'user_id',
            }
        },
        cons_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Consultas,
                key: 'cons_id',
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

    Parcelas.belongsTo(Usuarios, {
        foreignKey: 'user_id',
        targetKey: 'user_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    });
    Usuarios.hasMany(Parcelas, {
        foreignKey: 'user_id',
        sourceKey: 'user_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    });
    Parcelas.belongsTo(Consultas, {
        foreignKey: 'cons_id',
        targetKey: 'cons_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    });

    Consultas.hasMany(Parcelas, {
        foreignKey: 'cons_id',
        sourceKey: 'cons_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    });
    Parcelas.belongsTo(TiposSuelos, {
        foreignKey: 'tipos_id',
        targetKey: 'tipos_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    });

    TiposSuelos.hasMany(Parcelas, {
        foreignKey: 'tipos_id',
        sourceKey: 'tipos_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    });
    return Parcelas;
}

async function DefinirTiposSuelos() {
    TiposSuelos = sequelize.define('TiposSuelos', {
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

    

    return TiposSuelos;
}

async function DefinirMuestras() {
    Muestras = sequelize.define('Muestras', {
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
        },
        mue_nota: {
            type: DataTypes.FLOAT,
            allowNull: true,
        }
    }, {
        tableName: 'sm_q_muestras',
        timestamps: false,
    });

    Muestras.belongsTo(Parcelas, {
        foreignKey: 'parc_id',
        targetKey: 'parc_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    });

    Parcelas.hasMany(Muestras, {
        foreignKey: 'parc_id',
        sourceKey: 'parc_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    });

    return Muestras;
}

async function DefinirVariables() {
    VariablesSecundarias = sequelize.define('VariablesSecundarias', {
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
        elem_simbolo: {
            type: DataTypes.STRING(5),
            allowNull: false,
            references: {
                model: Elementos,
                key: 'elem_simbolo',
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

    VariablesSecundarias.belongsTo(Muestras, {
        foreignKey: 'mue_id',
        targetKey: 'mue_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    });

    Muestras.hasMany(VariablesSecundarias, {
        foreignKey: 'mue_id',
        sourceKey: 'mue_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    });

    VariablesSecundarias.belongsTo(Elementos, {
        foreignKey: 'elem_simbolo',
        targetKey: 'elem_simbolo',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    });

    Elementos.hasMany(VariablesSecundarias, {
        foreignKey: 'elem_simbolo',
        sourceKey: 'elem_simbolo',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    });

    return VariablesSecundarias;
}

async function DefinirRangos() {
    Rangos = sequelize.define('Rangos', {
        rang_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        elem_simbolo: {
            type: DataTypes.STRING(5),
            allowNull: false,
            references: {
                model: Elementos,
                key: 'elem_simbolo',
            }
        },
        rang_mod_min: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        rang_opt_min: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        rang_opt_max: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        rang_mod_max: {
            type: DataTypes.FLOAT,
            allowNull: false,
        }
    }, {
        tableName: 'sm_q_rangos',
        timestamps: false,
    });

    Elementos.hasMany(Rangos, {
        foreignKey: 'elem_simbolo',
        sourceKey: 'elem_simbolo',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    });

    Rangos.belongsTo(Elementos, {
        foreignKey: 'elem_simbolo',
        targetKey: 'elem_simbolo',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
    });

    return Rangos;
}

module.exports = {
    sequelize, Conectar, DefinirPermisos, DefinirTiposUsuarios, DefinirTiposSuelos,
    DefinirProblemas, DefinirConsultas, DefinirUnidades, DefinirElementos, DefinirUsuarios,
    DefinirParcelas, DefinirMuestras, DefinirVariables, DefinirRangos
};
