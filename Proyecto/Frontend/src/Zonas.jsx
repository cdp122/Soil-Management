import React, { useState } from "react";
import Modal from "./Modal";
import ModalEDZona from "./ModalEDZona";
import "./styles/Zonas.css";
import editIcon from './assets/edit.svg';
import deleteIcon from './assets/delete.svg';

function Zonas({ zonas, onZonaClick, userId, setZonas }) {
    const [showModal, setShowModal] = useState(false);
    const [showEDModal, setShowEDModal] = useState(false);
    const [selectedZona, setSelectedZona] = useState(null);
    const [modalMode, setModalMode] = useState('edit');
    const [activeZona, setActiveZona] = useState(null); // Estado para la zona activa

    const handleAddZonaClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleEditZonaClick = (zona) => {
        setSelectedZona(zona);
        setModalMode('edit');
        setShowEDModal(true);
    };

    const handleDeleteZonaClick = (zona) => {
        setSelectedZona(zona);
        setModalMode('delete');
        setShowEDModal(true);
    };

    const handleZonaClick = (zonaId) => {
        if (activeZona === zonaId) {
            return; // No hacer nada si la zona ya está activa
        }
        setActiveZona(zonaId);
        onZonaClick(zonaId);
    };

    const handleCloseEDModal = () => {
        setShowEDModal(false);
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
                setZonas(data.zonas);
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
            <hr></hr>
            <ul className="zonas-list">
                {zonas.map((zona) => (
                    <li key={zona.cons_id} className="zonas-item" onClick={() => handleZonaClick(zona.cons_id)}>
                        {zona.cons_nombre}
                        <div className="zonas-item-buttons">
                            <button className="zonas-edit" onClick={(e) => { e.stopPropagation(); handleEditZonaClick(zona); }}>
                                <img src={editIcon} alt="Editar" className="edit-icon" />
                            </button>
                            <button className="zonas-delete" onClick={(e) => { e.stopPropagation(); handleDeleteZonaClick(zona); }}>
                                <img src={deleteIcon} alt="Eliminar" className="delete-icon" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {showModal && (
                <Modal onClose={handleCloseModal} refreshZonas={refreshZonas} userId={userId} />
            )}
            {showEDModal && selectedZona && (
                <ModalEDZona
                    isOpen={showEDModal}
                    onClose={handleCloseEDModal}
                    zona={selectedZona}
                    refreshZonas={refreshZonas}
                    mode={modalMode}
                />
            )}
        </div>
    );
}

export default Zonas;
