import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './styles/ModalEDZona.css';

function ModalEDZona({ isOpen, onClose, zona, refreshZonas, mode }) {
    const [nombre, setNombre] = useState(zona.cons_nombre);
    const [problema, setProblema] = useState(zona.prob_detalle);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setNombre(zona.cons_nombre);
            setProblema(zona.prob_detalle);
        }
    }, [isOpen, zona]);

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`https://soil-management-4-soft-utn.onrender.com/zonas/${zona.cons_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                },
                body: JSON.stringify({ nombreConsulta: nombre, probDetalle: problema }),
            });

            if (response.ok) {
                await refreshZonas();
                onClose();
            } else {
                console.error('Error al actualizar la zona');
            }
        } catch (error) {
            console.error('Error al actualizar la zona:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://soil-management-4-soft-utn.onrender.com/zonas/${zona.cons_id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': localStorage.getItem('token'),
                },
            });

            if (response.ok) {
                await refreshZonas();
                onClose();
            } else {
                console.error('Error al eliminar la zona');
            }
        } catch (error) {
            console.error('Error al eliminar la zona:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="modal-edz-overlay">
            <div className="modal-edz-content">
                <button type="button" className="cancel-edz-btn" onClick={onClose}>×</button>
                {mode === 'edit' ? (
                    <>
                        <h2>Editar Zona</h2>
                        <form onSubmit={handleEditSubmit}>
                            <div className="form-edz-group">
                                <label htmlFor="nombreZona">Nombre de la Zona</label>
                                <input
                                    type="text"
                                    id="nombreZona"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-edz-group">
                                <label htmlFor="problema">Problema</label>
                                <textarea
                                    id="problema"
                                    value={problema}
                                    onChange={(e) => setProblema(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="modal-edz-buttons">
                                <button type="button" className="cancel-edz-btn" onClick={onClose}></button>
                                <button type="submit" className="submit-edz-btn">Aceptar</button>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <h2>Eliminar Zona</h2>
                        <p>¿Está seguro de eliminar la zona? Se eliminarán todas las parcelas dentro de la misma.</p>
                        <div className="modal-edz-buttons">
                            <button type="button" className="cancel-edz-btn" onClick={onClose}></button>
                            <button type="button" className="submit-edz-btn" onClick={handleDelete}>Aceptar</button>
                        </div>
                    </>
                )}
            </div>
        </div>,
        document.getElementById('modal-root')
    );
}

export default ModalEDZona;