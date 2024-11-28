import React, { useState, useEffect } from 'react';
import './styles/ModalEdit.css';

function ModalEdit({ isOpen, onClose, parcelaId, parcelaData, onSave }) {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        nombre: '',
        coordenadas: '',
        tamaño: '',
        tipoSuelo: ''
    });

    useEffect(() => {
        if (parcelaData) {
            setFormData({
                nombre: parcelaData.nombre,
                coordenadas: parcelaData.coordenadas,
                tamaño: parcelaData.tamaño,
                tipoSuelo: parcelaData.tipoSuelo
            });
        }
    }, [parcelaData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = () => {
        onSave(formData, parcelaId);
        onClose();
    };

    return (
        <div className="modal-e-overlay">
            <div className="modal-e-content">
                <h2>Editar Parcela</h2>
                <div className="modal-e-data">
                    <label>
                        Nombre
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Coordenadas
                        <input
                            type="text"
                            name="coordenadas"
                            value={formData.coordenadas}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Tamaño
                        <input
                            type="text"
                            name="tamaño"
                            value={formData.tamaño}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Tipo de Suelo
                        <select
                            name="tipoSuelo"
                            value={formData.tipoSuelo}
                            onChange={handleChange}
                        >
                            <option value="Arcilloso">Arcilloso</option>
                            <option value="Arenoso">Arenoso</option>
                            <option value="Franco">Franco</option>
                        </select>
                    </label>
                </div>

                <div className="modal-e-footer">
                    <button className='modal-e-button' onClick={handleSave}>Guardar</button>
                    <button className='modal-e-button' onClick={onClose}>Cerrar</button>
                </div>
            </div>
        </div>
    );
}

export default ModalEdit;
