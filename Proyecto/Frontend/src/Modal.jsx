import React, { useState } from 'react';
import './styles/Modal.css'; // Puedes agregar tus estilos aquí

function Modal({ onClose, onSubmit }) {
    const [nombreZona, setNombreZona] = useState('');
    const [problema, setProblema] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Enviar los datos del formulario al componente principal
        onSubmit({ nombreZona, problema });
        // Limpiar los campos después de enviar
        setNombreZona('');
        setProblema('');
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Crear Nueva Zona</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nombreZona">Nombre de la Zona</label>
                        <input
                            type="text"
                            id="nombreZona"
                            value={nombreZona}
                            onChange={(e) => setNombreZona(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="problema">Problema</label>
                        <textarea
                            id="problema"
                            value={problema}
                            onChange={(e) => setProblema(e.target.value)}
                            required
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="submit-btn">
                            Crear Zona
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Modal;
