import React, { useState, useEffect } from "react";
import Zonas from "./Zonas";
import "./styles/SuelosCRUD.css";

function SuelosCRUD() {
    const [zonas, setZonas] = useState([]); // Lista de zonas
    const [parcelas, setParcelas] = useState([]); // Lista de parcelas de la zona seleccionada
    const [zonaSeleccionada, setZonaSeleccionada] = useState(null); // Zona seleccionada
    const [loading, setLoading] = useState(false); // Estado de carga

    useEffect(() => {
        const fetchZonas = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://soil-management-4-soft-utn.onrender.com/zonas?userid=1", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
    
                // Validar si la respuesta es exitosa
                if (!response.ok) {
                    throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
                }
    
                // Validar que la respuesta sea JSON
                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("La respuesta no es JSON.");
                }
    
                const data = await response.json();
                console.log("Zonas recibidas:", data); // Depuración
                setZonas(data);
            } catch (error) {
                console.error("Error al cargar las zonas:", error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchZonas();
    }, []);
    

    // Obtener las parcelas de una zona específica
    const fetchParcelas = async (zonaId) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/zonas/${zonaId}/parcelas`); // Endpoint de parcelas
            const data = await response.json();
            setParcelas(data);
        } catch (error) {
            console.error("Error al cargar las parcelas:", error);
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
