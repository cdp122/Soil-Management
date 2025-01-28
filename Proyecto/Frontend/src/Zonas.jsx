import React, { useState } from "react";
import Modal from "./Modal"; // Importamos el Modal
import "./styles/Zonas.css";

function Zonas({ zonas, onZonaClick, userId, setZonas }) {
    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal

    const handleAddZonaClick = () => {
        setShowModal(true); // Mostrar el modal cuando se hace clic en "Añadir Zona"
    };

    const handleCloseModal = () => {
        setShowModal(false); // Cerrar el modal
    };

    const refreshZonas = async () => {
        try {
            const response = await fetch(`https://soil-management-4-soft-utn.onrender.com/zonas?userid=${userId}`, {
                method: 'GET',
                headers: {
                    Authorization: localStorage.getItem('token'),
                },
            });

            if (response.ok) {
                const data = await response.json();
                setZonas(data);
            } else {
                console.error('Error al cargar las zonas');
            }
        } catch (error) {
            console.error('Error al cargar las zonas:', error);
        }
    };

    return (
        <div className="zonas-sidebar">
            <div className="zonas-header">
                <h2 className="zonas-title">Zonas</h2>
                <button className="zonas-add" onClick={handleAddZonaClick}>+</button>
            </div>
            <ul className="zonas-list">
                {zonas.map((zona) => (
                    <li
                        key={zona.cons_id}
                        className="zonas-item"
                        onClick={() => onZonaClick(zona.cons_id)}
                    >
                        {zona.cons_nombre}
                    </li>
                ))}
            </ul>

            {/* Mostrar el Modal si el estado showModal es verdadero */}
            {showModal && (
                <Modal onClose={handleCloseModal} refreshZonas={refreshZonas} userId={userId} />
            )}
        </div>
    );
}

export default Zonas;
