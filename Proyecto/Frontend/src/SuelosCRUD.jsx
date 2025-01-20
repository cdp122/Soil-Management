import React, { useState, useEffect } from "react";
import Zonas from "./Zonas";
import "./styles/SuelosCRUD.css";

function SuelosCRUD() {
    const [authorized, setAuthorized] = useState(false);
    const [userData, setUserData] = useState(null); // Información del usuario
    const token = localStorage.getItem('token'); // Recuperar token
    const cedula = localStorage.getItem('cedula'); // Recuperar cédula
    const [zonas, setZonas] = useState([]); // Lista de zonas
    const [parcelas, setParcelas] = useState([]); // Lista de parcelas
    const [zonaSeleccionada, setZonaSeleccionada] = useState(null); // Zona seleccionada
    const [loading, setLoading] = useState(false); // Estado de carga

    // Validar el token y cargar datos del usuario
    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                console.error('No hay token disponible. Redirigiendo al login.');
                setAuthorized(false);
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
                    console.log('Datos del usuario recibidos:', data); // Ver datos completos del usuario
                
                    if (Array.isArray(data) && data.length > 0) {
                        const user = data[0]; // Accede al primer elemento del array
                        setUserData(user); // Guardar el objeto del usuario en lugar del array completo
                
                        // Imprimir el user_id después de actualizar el estado
                        if (user?.user_id) {
                            console.log('user_id recibido y guardado:', user.user_id);
                        } else {
                            console.error('user_id no está presente en el usuario.');
                        }
                
                        setAuthorized(true);
                    } else {
                        console.error('Los datos del usuario no son válidos o están vacíos.');
                        setAuthorized(false);
                    }
                } else {
                    console.error('Token inválido o expirado. Redirigiendo al login.');
                    setAuthorized(false);
                    localStorage.removeItem('token'); // Limpiar token si es inválido
                }
            } catch (error) {
                console.error('Error al validar el token:', error);
                setAuthorized(false);
            }
        };

        validateToken();
    }, [token, cedula]);

    // Cargar las zonas
    useEffect(() => {
        const fetchZonas = async () => {
            if (!authorized || !userData?.user_id) return; // No cargar zonas si el usuario no está autorizado

            setLoading(true);
            try {
                const response = await fetch(
                    `https://soil-management-4-soft-utn.onrender.com/zonas?userid=${userData.user_id}`,
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': token,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Error del servidor: ${response.status}`);
                }

                const data = await response.json();
                console.log('Zonas recibidas:', data);
                setZonas(data);
            } catch (error) {
                console.error('Error al cargar las zonas:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchZonas();
    }, [authorized, token, userData]);

    // Obtener las parcelas de una zona específica
    const fetchParcelas = async (zonaId) => {
        setLoading(true);
        try {
            const response = await fetch(
                `https://soil-management-4-soft-utn.onrender.com/zonas/${zonaId}/parcelas`,
                {
                    method: 'GET',
                    headers: {
                        Authorization: token,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }

            const data = await response.json();
            setParcelas(data);
        } catch (error) {
            console.error('Error al cargar las parcelas:', error);
        } finally {
            setLoading(false);
        }
    };

    // Manejar la selección de una zona
    const handleZonaClick = (zonaId) => {
        setZonaSeleccionada(zonaId);
        if (zonaId) {
            fetchParcelas(zonaId);
        } else {
            setParcelas([]);
        }
    };

    if (!authorized) {
        return <div>No tienes acceso. Por favor, inicia sesión.</div>;
    }

    return (
        <div className="sueloscrud-container">
            <Zonas zonas={zonas} onZonaClick={handleZonaClick} />
            <div className="sueloscrud-content">
                {loading ? (
                    <div className="sueloscrud-loading">Cargando...</div>
                ) : zonaSeleccionada ? (
                    <>
                        <div className="sueloscrud-header">
                            <h2 className="sueloscrud-title">
                                {zonas.find((z) => z.id === zonaSeleccionada)?.nombre}
                            </h2>
                            <div className="sueloscrud-search">
                                <input
                                    type="text"
                                    placeholder="Búsqueda"
                                    className="sueloscrud-search-input"
                                />
                                <button className="sueloscrud-search-button">🔍</button>
                            </div>
                            <div className="sueloscrud-buttons">
                                <button className="sueloscrud-btn">Comparar Parcelas</button>
                                <button className="sueloscrud-btn">Añadir Parcela</button>
                            </div>
                        </div>
                        <div className="sueloscrud-parcels">
                            {parcelas.length > 0 ? (
                                parcelas.map((parcela) => (
                                    <div key={parcela.id} className="sueloscrud-parcel">
                                        <div className="sueloscrud-parcel-image"></div>
                                        <label className="sueloscrud-parcel-label">
                                            <input type="checkbox" /> {parcela.nombre}
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <div className="sueloscrud-placeholder">
                                    No hay parcelas disponibles en esta zona.
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="sueloscrud-placeholder">
                        <h2>Selecciona una zona para ver las parcelas</h2>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SuelosCRUD;
