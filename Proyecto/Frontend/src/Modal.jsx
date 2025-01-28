import React, { useState, useEffect } from 'react';
import './styles/Modal.css';

function Modal({ onClose, refreshZonas, userId }) {
    const [nombreZona, setNombreZona] = useState('');
    const [problema, setProblema] = useState('');
    const [parcela, setParcela] = useState({
        nombre: '',
        area: '',
        coordLa: '',
        coordLo: '',
        tipo: '',
        descripcion: ''
    });
    const [tipos, setTipos] = useState([]);
    const [step, setStep] = useState(1);

    useEffect(() => {
        const fetchTipos = async () => {
            try {
                const response = await fetch('https://soil-management-4-soft-utn.onrender.com/tipos', {
                    method: 'GET',
                    headers: {
                        Authorization: localStorage.getItem('token'),
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setTipos(data);
                } else {
                    console.error('Error al cargar los tipos de suelos');
                }
            } catch (error) {
                console.error('Error al cargar los tipos de suelos:', error);
            }
        };

        fetchTipos();
    }, []);

    const handleNext = (e) => {
        e.preventDefault();
        setStep(2);
    };

    const handleBack = (e) => {
        e.preventDefault();
        setStep(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const zonaResponse = await fetch('https://soil-management-4-soft-utn.onrender.com/registrarzona', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                },
                body: JSON.stringify({
                    nombreConsulta: nombreZona,
                    probDetalle: problema,
                }),
            });

            if (zonaResponse.ok) {
                const zonaData = await zonaResponse.json();
                const zonaId = zonaData.nuevaZona;

                const parcelaResponse = await fetch('https://soil-management-4-soft-utn.onrender.com/nuevaparcela', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token'),
                    },
                    body: JSON.stringify({
                        parc_nombre: parcela.nombre,
                        parc_area: parcela.area,
                        parc_coord_la: parcela.coordLa,
                        parc_coord_lo: parcela.coordLo,
                        tipos_id: parcela.tipo,
                        parc_descripcion: parcela.descripcion,
                        cons_id: zonaId,
                        user_id: userId,
                    }),
                });

                if (parcelaResponse.ok) {
                    await refreshZonas(); // Refrescar la lista de zonas
                    onClose();
                } else {
                    console.error('Error al crear la parcela', parcelaResponse.statusText);
                }
            } else {
                console.error('Error al crear la zona');
            }
        } catch (error) {
            console.error('Error al crear la zona y la parcela:', error);
        }
    };

    return (
        <div className="modal-addz-overlay">
            <div className="modal-addz-content">
                <button type="button" className="cancel-addz-btn" onClick={onClose}>×</button>
                {step === 1 ? (
                    <>
                        <h2>Crear Nueva Zona</h2>
                        <form onSubmit={handleNext}>
                            <div className="form-addz-group">
                                <label htmlFor="nombreZona">Nombre de la Zona</label>
                                <input
                                    type="text"
                                    id="nombreZona"
                                    min={1}
                                    max={50}
                                    pattern="[a-zA-Z0-9,. ]*"
                                    title='Ingrese solo letras, números, comas y puntos.'
                                    value={nombreZona}
                                    onChange={(e) => setNombreZona(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-addz-group">
                                <label htmlFor="problema">Problema</label>
                                <input
                                    type="text"
                                    id="problema"
                                    min={1}
                                    max={15}
                                    pattern="[a-zA-Z0-9,. ]*"
                                    title='Ingrese solo letras, números, comas y puntos.'
                                    value={problema}
                                    onChange={(e) => setProblema(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="modal-addz-buttons">
                                <button type="submit" className="submit-addz-btn">Siguiente</button>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <h2>Crear Nueva Parcela</h2>
                        <p className='addz-p'>Para crear tu zona, primero añade su primera parcela.</p>
                        <form onSubmit={handleSubmit}>
                            <div className="form-addz-grid">
                                <div className="form-addz-group">
                                    <label htmlFor="nombreParcela">Nombre de la Parcela</label>
                                    <input
                                        type="text"
                                        id="nombreParcela"
                                        min={1}
                                        max={50}
                                        pattern="[a-zA-Z0-9,. ]*"
                                        title='Ingrese solo letras, números, comas y puntos.'
                                        value={parcela.nombre}
                                        onChange={(e) => setParcela({ ...parcela, nombre: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-addz-group">
                                    <label htmlFor="area">Área</label>
                                    <input
                                        type="number"
                                        placeholder='Valor en m²'    
                                        id="area"
                                        value={parcela.area}
                                        onChange={(e) => setParcela({ ...parcela, area: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-addz-group">
                                    <label htmlFor="coordLa">Coordenada Latitud</label>
                                    <input
                                        type="number"
                                        placeholder='Valor en grados °'
                                        value={parcela.coordLa}
                                        onChange={(e) => setParcela({ ...parcela, coordLa: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-addz-group">
                                    <label htmlFor="coordLo">Coordenada Longitud</label>
                                    <input
                                        type="number"
                                        placeholder='Valor en grados °'
                                        id="coordLo"
                                        value={parcela.coordLo}
                                        onChange={(e) => setParcela({ ...parcela, coordLo: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-addz-group">
                                    <label htmlFor="tipo">Tipo de Suelo</label>
                                    <select
                                        id="tipo"
                                        value={parcela.tipo}
                                        onChange={(e) => setParcela({ ...parcela, tipo: e.target.value })}
                                        required
                                    >
                                        <option value="">Seleccione un tipo</option>
                                        {tipos.map((tipo) => (
                                            <option key={tipo.tipos_id} value={tipo.tipos_id}>{tipo.tipos_nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-addz-group">
                                    <label htmlFor="descripcion">Descripción</label>
                                    <textarea
                                        id="descripcion"
                                        value={parcela.descripcion}
                                        onChange={(e) => setParcela({ ...parcela, descripcion: e.target.value })}
                                        placeholder="Ingrese una descripción"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-addz-buttons">
                                <button type="button" className="submit-addz-btn" onClick={handleBack}>Regresar</button>
                                <button type="submit" className="submit-addz-btn">Crear</button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default Modal;
