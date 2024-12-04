import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Importamos PropTypes
import './styles/ModalEdit.css';

function ModalEdit({ isOpen, onClose, parcelaId, parcelaData, onSave }) {
    // Hook useState siempre debe ir antes de cualquier condicional
    const [formData, setFormData] = useState({
        nombre: '',
        coordenadas: '',
        tamaño: '',
        tipoSuelo: ''
    });

    // useEffect siempre debe ir antes de cualquier condicional
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

    // Aquí va la condición para no renderizar el modal si isOpen es false
    if (!isOpen) return null;

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

// Agregar PropTypes para validación
ModalEdit.propTypes = {
    isOpen: PropTypes.bool.isRequired,                // isOpen debe ser un booleano y es obligatorio
    onClose: PropTypes.func.isRequired,               // onClose debe ser una función y es obligatorio
    parcelaId: PropTypes.string.isRequired,           // parcelaId debe ser una cadena de texto y es obligatorio
    parcelaData: PropTypes.shape({                    // parcelaData debe ser un objeto con las siguientes propiedades
        nombre: PropTypes.string.isRequired,          // nombre debe ser una cadena de texto
        coordenadas: PropTypes.string.isRequired,     // coordenadas debe ser una cadena de texto
        tamaño: PropTypes.string.isRequired,          // tamaño debe ser una cadena de texto
        tipoSuelo: PropTypes.string.isRequired         // tipoSuelo debe ser una cadena de texto
    }).isRequired,
    onSave: PropTypes.func.isRequired                 // onSave debe ser una función y es obligatorio
};

export default ModalEdit;
