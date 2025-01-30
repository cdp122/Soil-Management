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
    // Cargar historial desde localStorage al iniciar

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
            const response = await fetch("https://soil-management-4-soft-utn.onrender.com/muestras?parc_id=" + parcelID, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                }
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data);
                setDatosActuales(data);
                setHistorial(data);
            } else {
                alert('Error al cargar los datos actuales: 1 ' + data.message);
            }
        } catch (error) {
            console.error('Error al cargar los datos actuales: 2', error);
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
        // Recuperar datos actuales de la base de datos

        fetchDatosActuales();
    };

    const handleCloseView = () => {
        setIsParcelaViewOpen(false);
    };

    // Seleccionar una muestra y actualizar los datos en los inputs
    const handleSeleccionarMuestra = (muestra) => {
        setFechaSeleccionada(muestra.mue_fecha_registro);
        setDatosActuales(muestra);
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

    const handleSeleccionarHistorial = (datos) => {
        setFechaSeleccionada(datos.fecha);
        setDatosActuales(datos);
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

                                <label>Conductividad Eléctrica</label>
                                <input type="number" value={datosActuales.mue_con_elec || '0'} disabled />

                                <label>Materia Orgánica</label>
                                <input type="number" value={datosActuales.mue_porc_mat_org || '0'} disabled />

                                <label>Intercambio Catiónico</label>
                                <input type="number" value={datosActuales.mue_cap_inter_cati || '0'} disabled />

                                <label>Salinidad</label>
                                <input type="number" value={datosActuales.mue_salinidad || '0'} disabled />

                                <button className="agregar-btn">+</button>
                                <button className="agregar-btn">editar</button>
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
