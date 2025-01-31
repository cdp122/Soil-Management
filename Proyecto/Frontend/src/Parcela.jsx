import React, { useState, useEffect } from 'react';
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
import { Icons } from 'react-toastify';
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

function Parcela({ parcelID, parcelName, parcelType, isOpen }) {
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


    const [elementosIniciales, setElementosIniciales] = useState([]);
    const [elementosSeleccionados, setElementosSeleccionados] = useState([]);

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

                // Ordenar primero por fecha más reciente, luego por ID descendente
                const muestrasOrdenadas = data.sort((a, b) => {
                    const fechaA = new Date(a.mue_fecha_registro);
                    const fechaB = new Date(b.mue_fecha_registro);

                    // Comparar fechas primero
                    if (fechaB - fechaA !== 0) {
                        return fechaB - fechaA; // Más reciente primero
                    }
                    // Si las fechas son iguales, ordenar por ID de muestra (descendente)
                    return b.mue_id - a.mue_id;
                });

                // Tomar la muestra más reciente y con ID más alto
                const muestraMasReciente = muestrasOrdenadas[0];

                if (muestraMasReciente) {
                    setDatosActuales(muestraMasReciente);
                    setFechaSeleccionada(muestraMasReciente.mue_fecha_registro);

                    // Obtener variables secundarias de la muestra más reciente
                    getElementosMuestra(muestraMasReciente.mue_id);
                }
            } else {
                alert('Error al cargar los datos actuales: ' + data.message);
            }
        } catch (error) {
            console.error('Error al cargar los datos actuales:', error);
            alert('Error al conectar con la base de datos.');
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
        setIsParcelaViewOpen(false);
    };

    // Seleccionar una muestra y actualizar los datos en los inputs
    const handleSeleccionarMuestra = (muestra) => {
        setFechaSeleccionada(muestra.mue_fecha_registro);
        setDatosActuales(muestra);
        // Limpiar elementos previos antes de cargar nuevos datos
        setElementosSeleccionados([]);
        getElementosMuestra(muestra.mue_id);
    };

    /*const handleActualizarDatos = async () => {
        const fechaActual = new Date();
        const fechaFormato = `${fechaActual.getDate()}/${fechaActual.getMonth() + 1}/${fechaActual.getFullYear()} ${fechaActual.getHours()}:${fechaActual.getMinutes()}`;
        console.log(fechaFormato);
        setHistorial([...historial, { fecha: fechaFormato, ...datosActuales }]);
    };*/


    /*const handleBorrarHistorial = () => {
        localStorage.removeItem('historialParcelas');
        setHistorial([]);
        setDatosActuales({});
        setFechaSeleccionada(null);
    };*/

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
            const elementosFiltrados = data.map(({ anpar_elem_cant, elem_simbolo }) => ({
                cantidad: anpar_elem_cant,
                simbolo: elem_simbolo
            }));
            setElementosSeleccionados(elementosFiltrados);


        } catch (error) {
            console.error('Error al obtener los elementos de la muestra:', error.message);
        }
    };




    // Función para agregar dinámicamente un select y un input
    const handleAgregarCampo = () => {
        setDynamicFields([...dynamicFields, { id: Date.now(), value: '' }]);
    };

    // Función para eliminar un campo dinámico
    const handleEliminarCampo = (id) => {
        setDynamicFields(dynamicFields.filter(field => field.id !== id));
    };

    const soilImage = soilImages[parcelType] || '';

    return (
        <>
            <div className="sueloscrud-parcel">
                <div className="sueloscrud-parcel-image">
                    <img src={soilImage} alt={parcelType} onClick={handleImageClick} />
                </div>
                <label className="sueloscrud-parcel-label">
                    <input type="checkbox" /> {parcelName}
                </label>
                <button className="entrarParcela" onClick={handleEnterClick}>Entrar</button>
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
                                <label>Nivel de pH</label>
                                <input type="number" value={datosActuales.mue_ph || '0'} disabled />

                                <label>Materia Orgánica</label>
                                <input type="number" value={datosActuales.mue_porc_mat_org || '0'} disabled />
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
                                                <label  >{nombresCampos[key] || key.replace(/_/g, " ").toUpperCase()}</label>
                                                <input type="number" value={value || '0'} disabled />
                                            </div>
                                        );
                                    })
                                }
                                {/* Mostrar los elementos secundarios de la muestra dinámicamente */}
                                {elementosSeleccionados.map((elemento, index) => (
                                    <div className="grupoInput2" key={index}>
                                        <label>{elemento.simbolo}</label>
                                        <input type="number" value={elemento.cantidad || '0'} disabled />
                                    </div>
                                ))}

                                {/* Campos dinámicos debajo de los inputs */}
                                {dynamicFields.map((field) => (
                                    <div key={field.id} className="dynamic-field">
                                        <select>
                                            <option value="">Selecciona elemento</option>
                                            {elementosIniciales.map((elemento) => (
                                                <option key={elemento.elem_id} value={elemento.elem_simbolo}>
                                                    {elemento.elem_nombre} ({elemento.elem_simbolo})
                                                </option>
                                            ))}
                                        </select>

                                        <input type="text" placeholder="Ingrese valor" />
                                        <button onClick={() => handleEliminarCampo(field.id)}>
                                            <img src={deleteIcon} alt="Eliminar" style={{ width: '20px', height: '20px' }} />
                                        </button>
                                    </div>
                                ))}
                                <button className="agregar-btn" onClick={handleAgregarCampo}>+</button>

                                <button className="agregar-btn">
                                    <img src={editIcon} alt="Editar" style={{
                                        width: "20px",
                                        height: "20px",
                                        cursor: "pointer",
                                    }} />
                                </button>
                            </div>


                            <div className="historial-container">
                                <h3>Gráfico de Calidad de Suelo</h3>
                                <Grafico data={datosActuales.graficoData || []} />

                                <button className="actualizar-btn" onClick="W">Actualizar Datos</button>
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
