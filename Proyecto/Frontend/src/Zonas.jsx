import React, { useState } from "react";
import Modal from "./Modal"; // Importamos el Modal
import "./styles/Zonas.css";

function Zonas({ zonas, onZonaClick }) {
    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal

    const handleAddZonaClick = () => {
        setShowModal(true); // Mostrar el modal cuando se hace clic en "Añadir Zona"
    };

    const handleCloseModal = () => {
        setShowModal(false); // Cerrar el modal
    };

    const handleCreateZona = async (newZona) => {
        console.log("Nueva zona creada:", newZona);

        try {
            const response = await fetch('https://soil-management-4-soft-utn.onrender.com/registrarzona', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                },
                body: JSON.stringify({
                    nombreConsulta: newZona.nombreZona,
                    probDetalle: newZona.problema,
                }),
            });

            if (response.ok) {
                // Lógica para manejar la creación exitosa de una nueva zona
                setShowModal(false);
            } else {
                console.error('Error al crear la zona');
            }
        } catch (error) {
            console.error('Error al crear la zona:', error);
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
                        key={zona.id}
                        className="zonas-item"
                        onClick={() => onZonaClick(zona.cons_id)}
                    >
                        {zona.cons_nombre}
                    </li>
                ))}
            </ul>

            {/* Mostrar el Modal si el estado showModal es verdadero */}
            {showModal && (
                <Modal onClose={handleCloseModal} onCreateZona={handleCreateZona} />
            )}
        </div>
    );
}

export default Zonas;
