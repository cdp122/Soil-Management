class BDD {
    //#region Verificadores
    static __VerificarDato(dato) {
        if (/['"`]/.test(dato)) throw new Error('No se admiten comillas en los datos =>', dato);
    }
    //#endregion

    //#region Inserciones
    /**
     * Inserta varios datos con varias columnas en una tabla
     * @param {string} nombreTabla Código del nombre de la tabla
     * @param {string[]} columnas Código de las columnas en un array de string
     * @param {string[]} valores Valores de los datos en un array de string
     * @returns
     */
    static __InsertarnDatos(nombreTabla, columnas, valores) {
        this.__VerificarDato(nombreTabla);
        for (var valor in valores) this.__VerificarDato(valores[valor]);
        var columnasStr = columnas.join(", ");
        this.__VerificarDato(columnasStr);
        var valoresStr = valores.join("', '");
        return `INSERT INTO ${nombreTabla} (${columnasStr}) VALUES ('${valoresStr}');`;
    }

   
    static __InsertarDatos(nombreTabla, columna, valores) {
        this.__VerificarDato(nombreTabla); this.__VerificarDato(columna);
        for (var valor in valores) { this.__VerificarDato(valores[valor]); }
        var valoresStr = valores.join("', '");
        return `INSERT INTO ${nombreTabla} n ${columna} VALUES ('${valoresStr}');`;
    }

    
    static __InsertarDato(nombreTabla, columna, valor) {
        this.__VerificarDato(nombreTabla); this.__VerificarDato(columna); this.__VerificarDato(valor);
        return `INSERT INTO ${nombreTabla} ${columna} VALUES ('${valor}');`;
    }

    static Insertar(nombreTabla, columnas, valores) {
        if (typeof nombreTabla === 'string' && typeof columnas === 'string' && typeof valores === 'string')
            return this.__InsertarDato(nombreTabla, columnas, valores);
        else if (typeof nombreTabla === 'string' && typeof columnas === 'string'
            && typeof valores === 'object' && Array.isArray(valores) && typeof valores[0] === 'string')
            return this.__InsertarDatos(nombreTabla, columnas, valores);
        else if (typeof nombreTabla === 'string'
            && typeof columnas === 'object' && Array.isArray(columnas) && typeof columnas[0] === 'string'
            && typeof valores === 'object' && Array.isArray(valores) && typeof valores[0] === 'string')
            if (columnas.length == valores.length) return this.__InsertarnDatos(nombreTabla, columnas, valores);
            else throw new Error('Las columnas y los valores no coinciden');
        else throw new Error('Los datos proporcionados no son válidos');
    }
    //#endregion

    //#region Consultas
    static __ConsultarTodoCon(nombreTabla, condicionesColumnas, condicionesValores) {
        this.__VerificarDato(nombreTabla);
        for (var columna in condicionesColumnas) this.__VerificarDato(condicionesColumnas[columna]);
        for (var valor in condicionesValores) this.__VerificarDato(condicionesValores[valor]);

        var where = 'where ';
        for (var condiciones in condicionesColumnas) {
            where += condicionesColumnas[condiciones] + " = '" + condicionesValores[condiciones] + "' AND ";
        }

        return `SELECT * FROM '${nombreTabla}' ${where.substring(0, where.length - 4)}`;

    }

    static __ConsultarTodoPor(nombreTabla, tablaCondicion, valorCondicion) {
        this.__VerificarDato(nombreTabla); this.__VerificarDato(tablaCondicion); this.__VerificarDato(valorCondicion);
        if (typeof nombreTabla !== 'string' || typeof tablaCondicion !== 'string' || typeof valorCondicion !== 'string')
            throw new Error('Los datos proporcionados no son válidos');
        return `SELECT * FROM ${nombreTabla} where ${tablaCondicion} = '${valorCondicion}';`;
    }

    static __ConsultarTodo(nombreTabla) {
        if (typeof nombreTabla !== 'string' || typeof tablaCondicion !== 'string' || typeof valorCondicion !== 'string')
            return `SELECT * FROM '${nombreTabla}';`;
    }

    static Consultar(nombreTabla, columnaCondicion, valorCondicion) {
        if (typeof nombreTabla === 'string' && !columnaCondicion && !valorCondicion)
            return this.__ConsultarTodo(nombreTabla);
        else if (typeof nombreTabla === 'string' && typeof columnaCondicion === 'string' && typeof valorCondicion === 'string')
            return this.__ConsultarTodoPor(nombreTabla, columnaCondicion, valorCondicion)
        else if (typeof nombreTabla === 'string'
            && typeof columnaCondicion === 'object' && Array.isArray(columnaCondicion) && typeof columnaCondicion[0] === 'string'
            && typeof valorCondicion === 'object' && Array.isArray(valorCondicion) && typeof valorCondicion[0] === 'string')
            if (columnaCondicion.length == valorCondicion.length) return this.__ConsultarTodoCon(nombreTabla, columnaCondicion, valorCondicion);
            else throw new Error('Las columnas y los valores no coinciden');
        else throw new Error('Los datos proporcionados no son válidos');
    }
    //#endregion
}

class Tabla {
    static __nombreTabla;
    static __columnas;

    static Crear(valor) {
        const valores = valor;

        return BDD.Insertar(this.__nombreTabla, this.__columnas, valores);
    }

    static Buscar(condicionesColumnas, condicionesValores) {
        return BDD.Consultar(this.__nombreTabla, condicionesColumnas, condicionesValores);
    }
}

class Permisos extends Tabla {
    static detalle = 'perus_detalle';
    static id = 'persu_id';

    static __nombreTabla = 'permisos_usuarios';
    static __columnas = [this.id, this.detalle];

    static Crear(permiso_detalle) {
        if (typeof permiso_detalle === 'string' && permiso_detalle.length > 50) throw new Error('El detalle del permiso no puede exceder los 50 caracteres');
        return BDD.Insertar(this.__nombreTabla, this.detalle, permiso_detalle);
    }

}

module.exports = { Permisos };