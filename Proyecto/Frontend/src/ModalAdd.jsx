import { useState } from 'react';
import './styles/ModalAdd.css'

function ModalAdd({ isOpen, onClose, onSave }) {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        ID: '',
        Nombre: '',
        Latitud: '',
        Longitud: '',
        Tamaño: '',
        Tipo: ''
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
                            ID  <input type="text" name="ID" value={formData.ID} onChange={handleChange} />
                        </label>
                        <label>
                            Nombre  <input type="text" name="Nombre" value={formData.Nombre} onChange={handleChange} />
                        </label>
                        <label>
                            Latitud  <input type="number" name="Latitud" value={formData.Latitud} onChange={handleChange} />
                        </label>
                        <label>
                            Longitud  <input type="number" name="Longitud" value={formData.Longitud} onChange={handleChange} />
                        </label>
                        <label>
                            Tamaño  <input type="number" name="Tamaño" value={formData.Tamaño} onChange={handleChange} />
                        </label>
                        <label>
                            Tipo de Suelo
                            <select 
                                name="Tipo" 
                                value={formData.Tipo} 
                                onChange={handleChange}
                            >
                                <option value="">Seleccionar</option>
                                <option value="Arcilloso">Arcilloso</option>
                                <option value="Arenoso">Arenoso</option>
                                <option value="Franco">Franco</option>
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