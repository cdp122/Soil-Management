import React, { useEffect, useRef, useState } from 'react';
import Loading from './assets/loading.gif';
import FormParcela from './components/form-parcela-nuevo';
import Parcela from './Parcela';
import Zonas from './Zonas';
import './styles/SuelosCRUD.css';
import FormMuestras from "./components/form-muestras";
import Confirmacion from './components/notification/confirmacion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Para redirecciones
import api from './utils/api';
import ModalComparacion from './ModalComparacion';

function SuelosCRUD() {
    const [authorized, setAuthorized] = useState(false);
    const [userData, setUserData] = useState([]); // Información del usuario
    const token = localStorage.getItem('token'); // Recuperar token
    const cedula = localStorage.getItem('cedula'); // Recuperar cédula
    const [zonas, setZonas] = useState([]); // Lista de zonas
    const [parcelas, setParcelas] = useState([]); // Lista de parcelas
    const [zonaSeleccionada, setZonaSeleccionada] = useState(null); // Zona seleccionada
    const [loading, setLoading] = useState(false); // Estado de carga
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda
    const [error, setError] = useState(''); // Estado para el mensaje de error
    const parcelasSeleccionadas = useRef(new Set());
    const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
    const [mostrarComparacion, setMostrarComparacion] = useState(false);
    const [parcelasComparacion, setParcelasComparacion] = useState([]);
    const [nombresParcelasSeleccionadas, setNombresParcelasSeleccionadas] = useState([]);

    var [elements, setElements] = useState([]);
    var [muestras, setMuestras] = useState([]);




    // Validar el token y cargar datos del usuario
    useEffect(() => {
        const validateToken = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://soil-management-4-soft-utn.onrender.com/profile?user=${cedula}`, {
                    method: 'GET',
                    headers: {
                        Authorization: token,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                    setAuthorized(true);
                } else {
                    setAuthorized(false);
                    localStorage.removeItem('token');
                    navigate('/');
                }
            } catch (error) {
                console.error('Error al validar el token:', error);

                setAuthorized(false);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        if (token && cedula) {
            validateToken();
        }
    }, [token, cedula]);

    // Cargar las zonas
    useEffect(() => {
        const fetchZonas = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://soil-management-4-soft-utn.onrender.com/zonas?userid=${userData.id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: token,
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setZonas(data.zonas);
                    setError('');
                } else if (data.error === "No se encontraron zonas para el usuario") {
                    setError("No tienes ninguna zona. Crea una nueva.");
                    setZonas([]);
                } else {
                    console.error('Error al cargar las zonas');
                }
            } catch (error) {
                console.error('Error al cargar las zonas:', error);
            } finally {
                setLoading(false);
            }
        };

        if (authorized) {
            fetchZonas();

        }
    }, [authorized, token, userData.id]);

    // Obtener las parcelas de una zona específica
    const fetchParcelas = async (zonaId) => {
        setLoading(true);
        try {
            const response = await fetch(`https://soil-management-4-soft-utn.onrender.com/parcelas?zonaid=${zonaId}`, {
                method: 'GET',
                headers: {
                    Authorization: token,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setParcelas(data);
            } else {
                console.error('Error al cargar las parcelas');
            }
        } catch (error) {
            console.error('Error al cargar las parcelas:', error);
        } finally {
            setLoading(false);
        }
    };

    // Manejar la selección de una zona
    const handleZonaClick = (zonaId) => {
        setZonaSeleccionada(zonaId);
        if (zonaId) {
            fetchParcelas(zonaId);
        } else {
            setParcelas([]);
        }
    };

    // Manejar el cambio en el campo de búsqueda
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Filtrar las parcelas en función del término de búsqueda
    const filteredParcelas = parcelas.filter((parcela) =>
        parcela.parc_nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!authorized) {
        return <img src={Loading} alt="Cargando..." className="sueloscrud-loading" />;
    }

    const zonaSeleccionadaNombre = zonas.find((z) => z.cons_id === zonaSeleccionada)?.cons_nombre;

    const parcelasSeleccionadasHandler = (idParcela, isChecked) => {
        if (isChecked) {
            parcelasSeleccionadas.current.add(idParcela);
        } else {
            parcelasSeleccionadas.current.delete(idParcela);
        }
    };


    const validarSeleccionParcelas = async () => {
        const parcelasSeleccionadasArray = Array.from(parcelasSeleccionadas.current);

        if (parcelasSeleccionadasArray.length !== 2) {
            toast.warning("Debe seleccionar exactamente 2 parcelas para comparar.");
            return;
        }

        // Obtener muestras más recientes y elementos secundarios
        const muestrasParcelas = await obtenerMuestrasParcelas(parcelasSeleccionadasArray);

        if (muestrasParcelas.length < 2) {
            toast.warning("No se pueden comparar parcelas sin muestras.");
            return;
        }

        const nombresParcelas = parcelas
            .filter(parcela => parcelasSeleccionadasArray.includes(parcela.parc_id))
            .map(parcela => parcela.parc_nombre);

        setNombresParcelasSeleccionadas(nombresParcelas);
        setParcelasComparacion(muestrasParcelas);
        setMostrarComparacion(true);
    };

    const eliminarParcelas = () => {
        api.eliminarParcelas(Array.from(parcelasSeleccionadas.current)).then((response) => {
            if (response.error) {
                toast.error("Ocurrió un error al eliminar las parcelas, inténtelo mas tarde.")
            } else {
                toast.success("¡Parcelas eliminadas exitósamente!", { autoClose: 1800 });
                setMostrarConfirmacion(false);
                parcelasSeleccionadas.current = new Set();
                setTimeout(() => handleZonaClick(zonaSeleccionada), 2500);

            }
        }
        )

    }

    const mostrarConfirmacionClick = () => {
        if (parcelasSeleccionadas.current.size < 1) {
            toast.warning("Para eliminar seleccione al menos una parcela");
            return;
        }
        setMostrarConfirmacion(true);
    }


    const obtenerMuestrasParcelas = async (parcelasSeleccionadasArray) => {
        try {
            const muestrasParcelas = await Promise.all(parcelasSeleccionadasArray.map(async (parc_id) => {
                const response = await fetch(`https://soil-management-4-soft-utn.onrender.com/muestras?parc_id=${parc_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token,
                    },
                });

                if (!response.ok) {
                    toast.error(`Error al obtener muestras de la parcela ${parc_id}`);
                    return null;
                }

                const data = await response.json();
                if (!data || data.length === 0) {
                    toast.warn(`No hay muestras registradas en la parcela ${parc_id}`);
                    return null;
                }

                // Ordenar por fecha más reciente y obtener la última muestra
                const muestraReciente = data.sort((a, b) => new Date(b.mue_fecha_registro) - new Date(a.mue_fecha_registro))[0];
                console.log(muestraReciente);
                setMuestras(muestraReciente);
                // Obtener los elementos de la muestra
                const elementosResponse = await fetch(`https://soil-management-4-soft-utn.onrender.com/variables?mue_id=${muestraReciente.mue_id}`, {
                    method: 'GET',
                    headers: { Authorization: token },
                });

                elements = elementosResponse.ok ? await elementosResponse.json() : [];
                setElements(elements);
                console.log(elements);
                return { ...muestraReciente, elements };
            }));

            return muestrasParcelas.filter(muestra => muestra !== null);
        } catch (error) {
            console.error("Error al obtener muestras:", error);
            toast.error("Error al obtener las muestras para la comparación.");
            return [];
        }
    };

    return (
        <div className="sueloscrud-container">
            <Confirmacion titulo="Eliminando parcelas" texto="¿Está seguro de eliminar la parcela/s?. Recuerde que si no quedan parcelas, la zona también se eliminará. Confirme la acción." isActivo={mostrarConfirmacion} setActivo={setMostrarConfirmacion} action={eliminarParcelas} />
            <Zonas zonas={zonas} onZonaClick={handleZonaClick} userId={userData.id} setZonas={setZonas} />
            <div className="sueloscrud-content">
                {loading ? (
                    <div className="sueloscrud-loading"><img src={Loading} alt="Cargando..." className="sueloscrud-loading" /></div>
                ) : zonaSeleccionada ? (
                    <>
                        <div className="sueloscrud-header">
                            <div>
                                <h2 className="sueloscrud-title">
                                    Parcelas - {zonaSeleccionadaNombre}
                                </h2>
                            </div>

                            <div className='sueloscrud-header-controls'>
                                <div className="sueloscrud-search">
                                    <input
                                        type="text"
                                        placeholder="Búsqueda"
                                        className="sueloscrud-search-input"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                </div>
                                <div className="sueloscrud-buttons">
                                    <button className='sueloscrud-btn btn-eliminar-parcela' onClick={mostrarConfirmacionClick}><span>Eliminar parcela/s</span><i className="fa-solid fa-trash"></i></button>
                                    <button className="sueloscrud-btn" onClick={validarSeleccionParcelas}>
                                        <span>Comparar Parcelas</span><i className="fa-solid fa-code-compare"></i>
                                    </button>
                                    <ModalComparacion
                                        isOpen={mostrarComparacion}
                                        onClose={() => setMostrarComparacion(false)}
                                        parcelas={parcelasComparacion}
                                        muestras={muestras}
                                        elements={elements}
                                        nombresParcelas={nombresParcelasSeleccionadas}

                                    />
                                    <FormParcela idZona={zonaSeleccionada} idUser={userData.id} actualizarZonas={handleZonaClick} />
                                </div>
                            </div>
                        </div>
                        <div className="sueloscrud-parcels">
                            {filteredParcelas.length > 0 ? (
                                filteredParcelas.map((parcela) => (
                                    <Parcela key={parcela.parc_id} parcelID={parcela.parc_id} parcelName={parcela.parc_nombre} parcelType={parcela.tipos_id} isParcelaSeleccionada={parcelasSeleccionadas.current.has(parcela.parc_id)} parcelasSeleccionadasHandler={parcelasSeleccionadasHandler} />
                                ))
                            ) : (
                                <div className="sueloscrud-placeholder2">
                                    No hay parcelas disponibles en esta zona.
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="sueloscrud-placeholder">
                        {error || "Selecciona una zona para ver las parcelas."}
                    </div>
                )}
            </div>

        </div>
    );
}

export default SuelosCRUD;
