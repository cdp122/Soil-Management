import { useState } from 'react';
import './styles/ModalAdd.css';

function ModalAdd({ isOpen, onClose, onSave }) {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        Nombre: '',
        Latitud: '',
        Longitud: '',
        Tamaño: '',
        Tipo: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSave = () => {
        fetch('https://soil-management-4-soft-utn.onrender.com/parcela', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al guardar los datos');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos guardados exitosamente:', data);
            onSave(formData);
            onClose();
        })
        .catch(error => {
            console.error('Error al guardar los datos:', error);
        });
    };

    return (
        <>
            <div className='modal-overlay'>
                <div className='modal-content'>
                    <h2>Datos</h2>
                    <div className='modal-data'>
                        <label>
                            Nombre  
                            <input 
                                type="text" 
                                name="Nombre" 
                                value={formData.Nombre} 
                                onChange={handleChange} 
                            />
                        </label>
                        <label>
                            Latitud  
                            <input 
                                type="number" 
                                name="Latitud" 
                                value={formData.Latitud} 
                                onChange={handleChange} 
                            />
                        </label>
                        <label>
                            Longitud  
                            <input 
                                type="number" 
                                name="Longitud" 
                                value={formData.Longitud} 
                                onChange={handleChange} 
                            />
                        </label>
                        <label>
                            Tamaño  
                            <input 
                                type="number" 
                                name="Tamaño" 
                                value={formData.Tamaño} 
                                onChange={handleChange} 
                            />
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
    );
}

export default ModalAdd;
