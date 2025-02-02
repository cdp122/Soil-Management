import React, { useState, useEffect, useRef } from 'react';
import ModalInfoP from './ModalInfoP';
import aluvial from './assets/tipos_suelos/aluvial.jpeg';
import arcilloso from './assets/tipos_suelos/arcilloso.jpg';
import arenoso from './assets/tipos_suelos/arenoso.jpg';
import calcareo from './assets/tipos_suelos/calcareo.jpeg';
import franco from './assets/tipos_suelos/franco.jpeg';
import limoso from './assets/tipos_suelos/limoso.jpeg';
import organico from './assets/tipos_suelos/organico.jpeg';
import pedregoso from './assets/tipos_suelos/pedregoso.jpg';
import salino from './assets/tipos_suelos/salino.jpeg';
import volcanico from './assets/tipos_suelos/volcanico.jpeg';
import Grafico from './components/Grafico';  // Importamos el gráfico
import editIcon from './assets/edit.svg'; // Importamos el ícono de lápiz
import { Icons, toast } from 'react-toastify';
import deleteIcon from './assets/delete.svg'; // Ícono de papelera en SVG

const soilImages = {
    T001: arenoso,
    T002: arcilloso,
    T003: limoso,
    T004: franco,
    T005: calcareo,
    T006: salino,
    T007: organico,
    T008: pedregoso,
    T009: volcanico,
    T010: aluvial,
};

function Parcela({ parcelID, parcelName, parcelType, isOpen, isParcelaSeleccionada, parcelasSeleccionadasHandler }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isParcelaViewOpen, setIsParcelaViewOpen] = useState(false);
    const [calidadSuelo, setCalidadSuelo] = useState(25);
    const [historial, setHistorial] = useState([]); // Historial con las muestras de la parcela
    const [datosActuales, setDatosActuales] = useState({});
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
    const token = localStorage.getItem('token'); // Recuperar token
    const cedula = localStorage.getItem('cedula'); // Recuperar cédula
    const [authorized, setAuthorized] = useState(false);
    const [dynamicFields, setDynamicFields] = useState([]); // Campos dinámicos
    const [isEditing, setIsEditing] = useState(false);
    const [elementosOriginales, setElementosOriginales] = useState([]);
    const [datosOriginales, setDatosOriginales] = useState({});
    const [elementosIniciales, setElementosIniciales] = useState([]);
    const [elementosSeleccionados, setElementosSeleccionados] = useState([]);
    const [checbox, setCheckbox] = useState(isParcelaSeleccionada);

    useEffect(() => {
        if (!isOpen) return;
        const validateToken = async () => {
            if (!token) {
                console.error('No hay token disponible.');
                return;
            }
            try {
                const response = await fetch(
                    `https://soil-management-4-soft-utn.onrender.com/profile?user=${cedula}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: token,
                        },
                    }
                );
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data); // Guardar datos del usuario
                    setAuthorized(true);
                } else {
                    console.error('Token inválido o expirado.');
                    setAuthorized(false);
                    localStorage.removeItem('token'); // Limpiar token si es inválido
                }
            } catch (error) {
                console.error('Error al validar el token:', error);
                setAuthorized(false);
            }
        };
        validateToken();
        const historialGuardado = JSON.parse(localStorage.getItem('historialParcelas')) || [];
        setHistorial(historialGuardado);
    }, []);
    const fetchDatosActuales = async () => {
        try {
            const response = await fetch(
                `https://soil-management-4-soft-utn.onrender.com/muestras?parc_id=${parcelID}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token,
                    },
                }
            );
            const data = await response.json();
            if (response.ok) {
                console.log("Muestras obtenidas:", data);
                setHistorial(data);
                const muestrasOrdenadas = data.sort((a, b) => {// Ordenar primero por fecha más reciente, luego por ID descendente
                    const fechaA = new Date(a.mue_fecha_registro);
                    const fechaB = new Date(b.mue_fecha_registro);
                    if (fechaB - fechaA !== 0) { // Comparar fechas primero
                        return fechaB - fechaA; // Más reciente primero
                    }
                    return b.mue_id - a.mue_id; // Si las fechas son iguales, ordenar por ID de muestra (descendente)
                });
                const muestraMasReciente = muestrasOrdenadas[0];                // Tomar la muestra más reciente y con ID más alto
                if (muestraMasReciente) {
                    setDatosActuales(muestraMasReciente);
                    setFechaSeleccionada(muestraMasReciente.mue_fecha_registro);
                    getElementosMuestra(muestraMasReciente.mue_id); // Obtener variables secundarias de la muestra más reciente
                }
            } else {
                alert('Error al cargar los datos actuales: ' + data.message);
                // toast.info('No hay muestras registradas en la parcela, registre una'); Se vuelve a renderizar
            }
        } catch (error) {
            console.error('Error al cargar los datos actuales:', error);
            toast.error('Error al conectar con la base de datos.');
        }
    };
    const handleImageClick = () => {
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const handleEnterClick = () => {
        setIsParcelaViewOpen(true);
        getElementosQuimicos();
        fetchDatosActuales(); // Cargar muestra más reciente al abrir la parcela        
    };
    const handleCloseView = () => {
        setIsParcelaViewOpen(false);  // Cierra la vista
        setIsEditing(false);          // Desactiva el modo edición
        fetchDatosActuales();         // Recarga los datos desde la base de datos
    };
    const handleEdit = () => {
        setIsEditing(true);
    };
    const handleChange = (event, field) => {
        setDatosActuales((prevState) => ({
            ...prevState,
            [field]: event.target.value,
        }));
    };
    const handleElementChange = (index, field, value) => {
        const updatedElements = [...elementosSeleccionados];

        if (field === "simbolo") {
            // Buscar el elem_simbolo en la lista de elementos iniciales
            const elementoEncontrado = elementosIniciales.find(e => e.elem_nombre === value);

            updatedElements[index] = {
                ...updatedElements[index],
                simbolo: elementoEncontrado ? elementoEncontrado.elem_simbolo : "", // Guardamos el `elem_simbolo`
            };
        } else {
            updatedElements[index] = {
                ...updatedElements[index],
                [field]: value, // Guardamos la cantidad
            };
        }

        setElementosSeleccionados(updatedElements);
    };
    const handleSeleccionarMuestra = (muestra) => {
        setFechaSeleccionada(muestra.mue_fecha_registro);
        setDatosActuales(muestra);
        setDatosOriginales(muestra); // Guardar datos originales
        setElementosSeleccionados([]); // Limpiar elementos previos antes de cargar nuevos datos
        getElementosMuestra(muestra.mue_id);
    };
    const handleDynamicFieldChange = (index, field, value) => {
        const updatedFields = [...dynamicFields];
        updatedFields[index] = {
            ...updatedFields[index],
            [field]: value,
        };
        setDynamicFields(updatedFields);
    };

    // Función para agregar dinámicamente un select y un input
    const handleAgregarCampo = () => {
        setDynamicFields([
            ...dynamicFields,
            { id: Date.now(), simbolo: "", cantidad: "" } // Asegurar que los nuevos campos tengan valores adecuados
        ]);
    };
    const obtenerElementosDisponibles = () => {
        return elementosIniciales.filter(
            (elem) => !elementosSeleccionados.some((e) => e.simbolo === elem.elem_simbolo)
        );
    };


    // Función para eliminar un campo dinámico
    const handleEliminarCampo = (id) => {
        setDynamicFields(dynamicFields.filter(field => field.id !== id));
    };
    const handleActualizarDatos = async () => {
        const datosModificados = {
            mue_id: datosActuales.mue_id,
        };
        console.log("Datos actuales:", datosActuales);
        console.log("Datos originales:", datosOriginales);

        // Comparar y agregar solo los campos modificados
        if (datosActuales.mue_ph !== datosOriginales.mue_ph) {
            datosModificados.mue_ph = parseFloat(datosActuales.mue_ph);
        }
        if (datosActuales.mue_con_elec !== datosOriginales.mue_con_elec) {
            datosModificados.mue_con_elec = parseFloat(datosActuales.mue_con_elec);
        }
        if (datosActuales.mue_porc_mat_org !== datosOriginales.mue_porc_mat_org) {
            datosModificados.mue_porc_mat_org = parseFloat(datosActuales.mue_porc_mat_org);
        }
        if (datosActuales.mue_cap_inter_cati !== datosOriginales.mue_cap_inter_cati) {
            datosModificados.mue_cap_inter_cati = parseFloat(datosActuales.mue_cap_inter_cati);
        }
        if (datosActuales.mue_salinidad !== datosOriginales.mue_salinidad) {
            datosModificados.mue_salinidad = parseFloat(datosActuales.mue_salinidad);
        }
        if (datosActuales.mue_fecha_registro !== datosOriginales.mue_fecha_registro) {
            datosModificados.mue_fecha_registro = datosActuales.mue_fecha_registro;
        }

        // Comparar y agregar solo los elementos modificados, asegurando que `simb_elem` siempre esté presente
        datosModificados.elems = elementosSeleccionados.map((elem, index) => {
            const originalElem = elementosOriginales[index] || {};
            const elemModificado = {
                var_id: elem.var_id, // Se debe incluir siempre el var_id
                simb_elem: elem.simbolo, // Asegurar que siempre se incluya
                cant_elem: parseFloat(elem.cantidad) // Asegurar que siempre se incluya
            };

            return elemModificado;
        });

        const jsonBody = JSON.stringify(datosModificados, null, 2); // Verificar estructura del JSON a enviar
        console.log("Datos modificados a enviar:", jsonBody);
        try {
            const response = await fetch("https://soil-management-4-soft-utn.onrender.com/muestras", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: jsonBody,
            });

            const result = await response.json();
            console.log("Respuesta del servidor:", result); // Imprimir respuesta del backend

            if (response.ok) {
                toast.success("Datos actualizados correctamente.");
                setIsEditing(false); // Deshabilitar edición después de actualizar
            } else {
                alert("Error al actualizar los datos: " + (result.error || "Error desconocido en el servidor."));
            }
        } catch (error) {
            console.error("Error al actualizar los datos:", error);
            toast.error("Error en la conexión con el servidor.");
        }
    };

    //Fetch para eliminar variables secundarias de mi muestra
    const handleEliminarElemento = async (var_id) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este elemento?")) return;

        try {
            const response = await fetch(`https://soil-management-4-soft-utn.onrender.com/variables/${var_id}`, {
                method: "DELETE",
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json"
                },
            });

            if (response.ok) {
                toast.success("Elemento eliminado correctamente.");
                setElementosSeleccionados(prev => prev.filter(elemento => elemento.var_id !== var_id));
            } else {
                const result = await response.json();
                alert("Error al eliminar el elemento: " + (result.error || "Error desconocido en el servidor."));
                toast.error("Error al eliminar el elemento, inténtelo más tarde");
            }
        } catch (error) {
            console.error("Error al eliminar el elemento:", error);
            alert("Error en la conexión con el servidor.");
            toast.error("Error en la conexión con el servidor.");
        }
    };


    const handleAgregarNuevosElementos = async () => {
        const nuevosElementos = dynamicFields
            .filter(field => field.simbolo && field.cantidad) // Filtrar solo los completos
            .map(field => ({
                simb_elem: field.simbolo,
                cant_elem: parseFloat(field.cantidad)
            }));

        if (nuevosElementos.length === 0) {
            toast.warning("No hay nuevos elementos para añadir.");
            return;
        }

        const datosEnviar = {
            mue_id: datosActuales.mue_id,
            elems: nuevosElementos
        };

        console.log("Nuevos elementos a enviar:", JSON.stringify(datosEnviar, null, 2));

        try {
            const response = await fetch("https://soil-management-4-soft-utn.onrender.com/muestras", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(datosEnviar),
            });

            const result = await response.json();
            console.log("Respuesta del servidor:", result);

            if (response.ok) {
                toast.success("Nuevos elementos añadidos correctamente.");
                setDynamicFields([]); // Limpiar los campos dinámicos después de enviar
                fetchDatosActuales(); // Refrescar datos después de añadir nuevos elementos
            } else {
                alert("Error al añadir elementos: " + (result.error || "Error desconocido en el servidor."));
                toast.error("Error al añadir elemento, ", result.error || "Inténtelo más tarde");
            }
        } catch (error) {
            console.error("Error al añadir los elementos:", error);
            alert("Error en la conexión con el servidor.");
            toast.error("Error en la conexión con el servidor");
        }
    };

    const getElementosQuimicos = async () => {
        const token = localStorage.getItem("token");
        const url = "https://soil-management-4-soft-utn.onrender.com/elementos";
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                // throw new Error(`Response status: ${response.status}`);
            }
            const data = await response.json();
            data.sort((a, b) => a.elem_nombre.localeCompare(b.elem_nombre));
            setElementosIniciales(data);
            console.log(data);
        } catch (error) {
            console.error(
                "Error al obtener los elementos quimicos:",
                error.message
            );
            toast.error("Error al obtener los elementos quimicos: ", error.message);
        }
    };
    //Fetch para recibir los elementos que tiene una muestra mediante el id
    const getElementosMuestra = async (mue_id) => {
        try {
            const response = await fetch(`https://soil-management-4-soft-utn.onrender.com/variables?mue_id=${mue_id}`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: token,
                    },
                });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const data = await response.json();
            console.log("Elementos de la muestra:", data);
            // Si la muestra no tiene elementos, limpiar la lista
            if (!data || data.length === 0) {
                setElementosSeleccionados([]);
                return;
            }
            // Filtrar y ordenar los elementos según el tipo de muestra
            const elementosFiltrados = data.map(({ anpar_varsec, mue_id, elem_simbolo, anpar_elem_cant }) => ({
                var_id: anpar_varsec,
                mue_id: mue_id,
                simbolo: elem_simbolo,
                cantidad: anpar_elem_cant
            }));
            setElementosSeleccionados(elementosFiltrados);
            setElementosOriginales(elementosFiltrados);
        } catch (error) {
            console.error('Error al obtener los elementos de la muestra:', error.message);
            toast.error('Error al obtener los elementos de la muestra:', error.message);
        }
    };
    const soilImage = soilImages[parcelType] || '';

    const parcelaCheckHandler = (e) => {
        const seleccionado = e.target.checked;
        setCheckbox(seleccionado);
        parcelasSeleccionadasHandler(parcelID, seleccionado);
    };

    return (
        <>
            <div className="sueloscrud-parcel">
                <div className="sueloscrud-parcel-image">
                    <img src={soilImage} alt={parcelType} onClick={handleImageClick} />
                </div>
                <label className="containerButton">
                    <input type="checkbox" checked={checbox} onChange={parcelaCheckHandler} />
                    <div className="checkmark"></div>
                    <span>{parcelName}</span>
                </label>
                <button className="entrarParcela" onClick={handleEnterClick}>
                    <p>Entrar</p>
                </button>
                {isModalOpen && (
                    <ModalInfoP isOpen={isModalOpen} onClose={handleCloseModal} parcelID={parcelID} />
                )}
            </div>

            {isParcelaViewOpen && (
                <div className="parcela-overlay">
                    <div className="parcela-container">
                        <button className="parcela-close-btn" onClick={handleCloseView}>✖</button>
                        <h2>Parcela {parcelName}</h2>
                        <p>Porcentaje de Fertilidad</p>
                        <div className="progress-container">
                            <progress className="progress-bar" value={calidadSuelo} max="100"></progress>
                            <span>{calidadSuelo}% Calidad de Suelo</span>
                        </div>
                        <div className="parcela-content">
                            <div className="grupoInput">
                                {/* Inputs estáticos */}
                                <label>Nivel de pH</label>
                                <input
                                    type="number"
                                    value={datosActuales.mue_ph || ''}
                                    onChange={(e) => handleChange(e, "mue_ph")}
                                    disabled={!isEditing}
                                />
                                <label>Materia Orgánica</label>
                                <input
                                    type="number"
                                    value={datosActuales.mue_porc_mat_org || ''}
                                    onChange={(e) => handleChange(e, "mue_porc_mat_org")}
                                    disabled={!isEditing}
                                />

                                {/* Diccionario para renombrar claves */}
                                {Object.entries(datosActuales)
                                    .filter(([key]) =>
                                        key !== "mue_fecha_registro" &&
                                        key !== "mue_id" &&
                                        key !== "parc_id" &&
                                        key !== "mue_ph" &&
                                        key !== "mue_porc_mat_org"
                                    )
                                    .map(([key, value]) => {
                                        const nombresCampos = {
                                            mue_con_elec: "Conductividad Eléctrica",
                                            mue_cap_inter_cati: "Intercambio Catiónico",
                                            mue_salinidad: "Salinidad"
                                        };

                                        return (
                                            <div className="grupoInput2" key={key}>
                                                <label>{nombresCampos[key] || key.replace(/_/g, " ").toUpperCase()}</label>
                                                <input
                                                    type="number"
                                                    value={value || ''}
                                                    onChange={(e) => handleChange(e, key)}
                                                    disabled={!isEditing}
                                                />
                                            </div>
                                        );
                                    })
                                }

                                {/* Mostrar los elementos secundarios de la muestra dinámicamente */}
                                {elementosSeleccionados.map((elemento, index) => (
                                    <div className="grupoInput2" key={index}>
                                        <label>{elemento.simbolo}</label>
                                        <input
                                            type="number"
                                            value={elemento.cantidad || ''}
                                            onChange={(e) => handleElementChange(index, "cantidad", e.target.value)}
                                            disabled={!isEditing}
                                        />
                                        <button onClick={() => handleEliminarElemento(elemento.var_id)}>
                                            <img src={deleteIcon} alt="Eliminar" style={{ width: '20px', height: '20px' }} />
                                        </button>
                                    </div>
                                ))}
                                {/* Campos dinámicos debajo de los inputs */}
                                {dynamicFields.map((field, index) => (
                                    <div key={field.id} className="dynamic-field">
                                        <select
                                            value={field.simbolo}
                                            onChange={(e) => handleDynamicFieldChange(index, "simbolo", e.target.value)}
                                        >
                                            <option value="">Selecciona elemento</option>
                                            {obtenerElementosDisponibles().map((elemento) => (
                                                <option key={elemento.elem_simbolo} value={elemento.elem_simbolo}>
                                                    {elemento.elem_nombre} ({elemento.elem_simbolo})
                                                </option>
                                            ))}
                                        </select>

                                        <input
                                            type="text"
                                            placeholder="Ingrese valor"
                                            value={field.cantidad}
                                            onChange={(e) => handleDynamicFieldChange(index, "cantidad", e.target.value)}
                                        />

                                        <button onClick={() => handleEliminarCampo(field.id)}>
                                            <img src={deleteIcon} alt="Eliminar" style={{ width: '20px', height: '20px' }} />
                                        </button>
                                    </div>
                                ))}


                                <button className="agregar-btn" onClick={handleAgregarCampo}>+</button>

                                <button className="agregar-btn" onClick={handleEdit}>
                                    <img src={editIcon} alt="Editar" style={{ width: "20px", height: "20px", cursor: "pointer" }} />
                                </button>
                            </div>


                            <div className="historial-container">
                                <h3>Gráfico de Calidad de Suelo</h3>
                                <Grafico data={datosActuales.graficoData || []} />

                                <button className="actualizar-btn" onClick={handleActualizarDatos} disabled={!isEditing}>
                                    Actualizar Datos
                                </button>
                                <button className="actualizar-btn" onClick={handleAgregarNuevosElementos}>
                                    Añadir Nuevos Elementos
                                </button>

                                {/*<button className="borrar-btn" onClick={handleBorrarHistorial}>Borrar Historial</button>*/}

                                <h3>Historial De Muestras</h3>
                                <div className="historial-buttons">
                                    {historial.map((muestra, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSeleccionarMuestra(muestra)}
                                            className="historial-btn"
                                            style={{
                                                backgroundColor: fechaSeleccionada === muestra.mue_fecha_registro ? "#007bff" : "#f1f1f1",
                                                color: fechaSeleccionada === muestra.mue_fecha_registro ? "white" : "black",
                                                margin: "5px",
                                                padding: "10px",
                                                border: "1px solid #ccc",
                                                cursor: "pointer",
                                                borderRadius: "5px",
                                            }}
                                        >
                                            {`ID: ${muestra.mue_id} - Fecha: ${muestra.mue_fecha_registro}`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
export default Parcela;
