import { useState } from 'react';
import './styles/ModalAdd.css'

function ModalAdd({ isOpen, onClose, onSave }) {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        nombre: '',
        coordenadas: '',
        tamaño: '',
        tipoSuelo: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    return(
        <>
            <div className='modal-overlay'>
                <div className='modal-content'>
                    <h2>Datos</h2>
                    <div className='modal-data'>
                        <label>
                            Nombre  <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
                        </label>
                        <label>
                            Coordenadas  <input type="text" name="coordenadas" value={formData.coordenadas} onChange={handleChange} />
                        </label>
                        <label>
                            Tamaño  <input type="text" name="tamaño" value={formData.tamaño} onChange={handleChange} />
                        </label>
                        <label>
                            Tipo de Suelo
                            <select name="tipoSuelo" value={formData.tipoSuelo} onChange={handleChange}>
                                <option value="">Test</option>
                            </select>
                        </label>
                        <button className='modal-add' onClick={handleSave}>
                            Guardar
                        </button>
                        <button className='modal-add' onClick={onClose}>
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModalAdd