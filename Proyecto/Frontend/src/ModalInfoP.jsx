import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Loading from './assets/loading.gif';
import './styles/ModalInfoP.css';
import FormMuestras from './components/form-muestras'

function ModalInfoP({ isOpen, onClose, parcelID }) {
    const token = localStorage.getItem('token'); // Recuperar token
    const cedula = localStorage.getItem('cedula'); // Recuperar cédula
    const [authorized, setAuthorized] = useState(false);
    const [parcelData, setParcelData] = useState(null);
    const [userData, setUserData] = useState(null); // Estado para los datos del usuario
    const [loading, setLoading] = useState(false); // Estado de carga

    useEffect(() => {
        if (!isOpen) return;

        const validateToken = async () => {
            setLoading(true);
            if (!token) {
                console.error('No hay token disponible.');
                setAuthorized(false);
                return;
            }

            try {
                const response = await fetch(
                    `https://soil-management-4-soft-utn.onrender.com/profile?user=${cedula}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: token,
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data); // Guardar datos del usuario
                    setAuthorized(true);
                } else {
                    console.error('Token inválido o expirado.');
                    setAuthorized(false);
                    localStorage.removeItem('token'); // Limpiar token si es inválido
                }
            } catch (error) {
                console.error('Error al validar el token:', error);
                setAuthorized(false);
            }
        };

        const fetchParcela = async () => {
            try {
                const response = await fetch(
                    `https://soil-management-4-soft-utn.onrender.com/parcelas?idparcela=${parcelID}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: token,
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setParcelData(data);
                    console.log('Datos de la parcela recibidos:', data);
                } else {
                    console.error('No se pudo obtener la información de la parcela.');
                }
            } catch (error) {
                console.error('Error al obtener la información de la parcela:', error);
            } finally {
                setLoading(false);
            }
        };

        validateToken().then(() => {
            if (authorized) {
                fetchParcela();
            }
        });
    }, [isOpen, token, parcelID, cedula, authorized]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="info-p-modal">
            <div className="info-p-modal-content">
                <span className="info-p-close" onClick={onClose}>&times;</span>
                {loading ? (
                    <img src={Loading} alt="Cargando..." className='sueloscrud-loading' />
                ) : (
                    parcelData && userData && (
                        <div className="info-p-details">
                            <h2 className="info-p-title">{parcelData.parc_nombre}</h2>
                            <p><strong>Encargado:</strong> {userData.nombre} {userData.apellido} </p>
                            <p><strong>Latitud:</strong> {parcelData.parc_coord_la}</p>
                            <p><strong>Longitud:</strong> {parcelData.parc_coord_lo}</p>
                            <p><strong>Área:</strong> {parcelData.parc_area}</p>
                            <p><strong>Tipo de Suelo:</strong> {parcelData.tipos_suelo}</p>
                            <p><strong>Descripción:</strong> {parcelData.parc_descripcion}</p>
                            {/* <button className="info-p-add-sample">Añadir Muestra</button> */}
                            <FormMuestras/>
                        </div>
                    )
                )}
            </div>
        </div>,
        document.getElementById('modal-root')
    );
}

export default ModalInfoP;