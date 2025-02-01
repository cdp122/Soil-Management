import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import Loading from './assets/loading.gif';
import './styles/ModalInfoP.css';
import FormMuestras from './components/form-muestras'
import { toast } from 'react-toastify';

function ModalInfoP({ isOpen, onClose, parcelID }) {
    const token = localStorage.getItem('token'); // Recuperar token
    const cedula = localStorage.getItem('cedula'); // Recuperar cédula
    const [authorized, setAuthorized] = useState(false);
    const [parcelData, setParcelData] = useState(null);
    const [userData, setUserData] = useState(null); // Estado para los datos del usuario
    const [loading, setLoading] = useState(false); // Estado de carga
    const [isEditando, setIsEditando] = useState(false);
    const [tiposSuelo, setTiposSuelo] = useState([]);
    const btnGuardar = useRef();
    useEffect(() => {
        const getTipos = async () => {
            const token = localStorage.getItem("token");
            const url = "https://soil-management-4-soft-utn.onrender.com/tipos";
            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    // throw new Error(`Response status: ${response.status}`);
                }

                const data = await response.json();
                setTiposSuelo(data);
            } catch (error) {
                console.error(
                    "Error al obtener los tipos de suelo:",
                    error.message
                );
            }
        };

        getTipos();
    }, []);

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

    const editando = () =>{
        setIsEditando(!isEditando)
    }

    const guardarCambios = (e) =>{
        e.preventDefault();
        const formData = new FormData(e.target);
        const datos = {};
        formData.forEach((value, key) => {
            datos[key] = value;
        });

        console.log(datos);
        toast.success("¡Datos de la parcela actualizado con éxito!")
        toast.error("Ocurrió un error al actualizar los datos de la parcela.")
        
    }


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
                            {
                            isEditando? <>
                            <form onSubmit={guardarCambios}>
                                <p><strong>Latitud:</strong>
                                    <input name="latitud" className="parcela-modificando-input" type="number" defaultValue={parcelData.parc_coord_la} maxLength="50" step="0.000001" min="-90" max="90"/> °
                                </p>
                                <p><strong>Longitud:</strong>
                                    <input name="longitud" className="parcela-modificando-input" type="number" defaultValue={parcelData.parc_coord_lo} step="0.000001" min="-180" max="180"/> °
                                </p>
                                <p><strong>Área:</strong><input name="area" className="parcela-modificando-input" type="number" defaultValue={parcelData.parc_area} step="0.001" min="0"/> m²</p>
                                <p><strong>Tipo de Suelo: </strong>
                                <select name="tipo" className="parcela-modificando-select" defaultValue={
                                    tiposSuelo.find(suelo => suelo.tipos_nombre === parcelData.tipos_suelo)?.tipos_id
                                }>
                                        {tiposSuelo.map((suelo) => (
                                            <option key={suelo.tipos_id} value={suelo.tipos_id}>
                                                {suelo.tipos_nombre}
                                            </option>
                                        ))}
                                    </select>
                                </p>
                                
                                <p><strong>Descripción:</strong></p>
                                <textarea name="descripcion" className="parcela-modificando-textarea" type="text" defaultValue={parcelData.parc_descripcion}/>
                                <div className='info-p-modificar-button'>
                                    <button className="info-p-btn" onClick={editando}>Cancelar</button>
                                    <button className="info-p-btn" type="submit" ref={btnGuardar}>Guardar</button>
                                </div>
                            </form>
                            </>:
                            <>
                                <p><strong>Latitud:</strong> {parcelData.parc_coord_la} °</p>
                                <p><strong>Longitud:</strong> {parcelData.parc_coord_lo} °</p>
                                <p><strong>Área:</strong> {parcelData.parc_area} m²</p>
                                <p><strong>Tipo de Suelo:</strong> {parcelData.tipos_suelo}</p>
                                <p><strong>Descripción:</strong> {parcelData.parc_descripcion}</p>
                            </>
                        
                            }
                            {
                                !isEditando && <button className="info-p-add-sample" onClick={editando}>Modificar datos</button>
                            }
                            <FormMuestras parcelaId={parcelID}/>
                        </div>
                    )
                )}
            </div>
        </div>,
        document.getElementById('modal-root')
    );
}

export default ModalInfoP;