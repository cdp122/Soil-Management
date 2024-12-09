import { useState } from 'react';
import './styles/ModalAnalysis.css'

function ModalAnalysis({ isOpen, onClose, parcelaId, onSave, previousAnalyses }) {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        ph: '',
        materiaOrganica: '',
        nitrogeno: '',
        fosforo: '',
        potasio: '',
        salinidad: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const currentDate = new Date().toLocaleDateString();

    const handleSave = () => {
        onSave(formData, parcelaId);
        onClose();
    };

    return (
        <div className="modal-a-overlay">
            <div className="modal-a-content">
                <div className="modal-a-header">
                    <h2>Detalles del Análisis</h2>
                    <p className="modal-a-date">{currentDate}</p>
                </div>

                <div className="modal-a-body">
                    <div className="modal-a-form">
                        <div className="modal-a-data">
                            <label>
                                Nivel de pH
                                <input
                                    type="text"
                                    name="ph"
                                    value={formData.ph}
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                Porcentaje de Materia Orgánica
                                <input
                                    type="text"
                                    name="materiaOrganica"
                                    value={formData.materiaOrganica}
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                Nitrógeno
                                <input
                                    type="text"
                                    name="nitrogeno"
                                    value={formData.nitrogeno}
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                Fósforo en ppm
                                <input
                                    type="text"
                                    name="fosforo"
                                    value={formData.fosforo}
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                Potasio en ppm
                                <input
                                    type="text"
                                    name="potasio"
                                    value={formData.potasio}
                                    onChange={handleChange}
                                />
                            </label>
                            <label>
                                Salinidad en dS/m
                                <input
                                    type="text"
                                    name="salinidad"
                                    value={formData.salinidad}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>
                        <button className='model-a-button' onClick={handleSave}>Guardar</button>
                    </div>

                    <div className="modal-a-previous">
                        <h3>Análisis Anteriores</h3>
                        <ul className="modal-a-analyses">
                            {previousAnalyses.map((analysis, index) => (
                                <li key={index} className="modal-a-analysis">
                                    <p><strong>pH:</strong> {analysis.ph}</p>
                                    <p><strong>Materia Orgánica:</strong> {analysis.materiaOrganica}</p>
                                    <button className='model-a-button' onClick={() => alert('Suelo Neutro, poca materia orgánica, requiere fertilización.')}>Ver detalles</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="modal-a-footer">
                    <button className='model-a-button   ' onClick={onClose}>Cerrar</button>
                </div>
            </div>
        </div>
    );
}

export default ModalAnalysis;
