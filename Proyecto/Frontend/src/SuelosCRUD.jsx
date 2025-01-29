import React, { useEffect, useState } from 'react';
import Loading from './assets/loading.gif';
import FormParcela from './components/form-parcela-nuevo';
import Parcela from './Parcela';
import Zonas from './Zonas';
import './styles/SuelosCRUD.css';
import FormMuestras from "./components/form-muestras";

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
                }
            } catch (error) {
                console.error('Error al validar el token:', error);
                setAuthorized(false);
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
                    setZonas(data);
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

    return (
        <div className="sueloscrud-container">
            <Zonas zonas={zonas} onZonaClick={handleZonaClick} userId={userData.id} setZonas={setZonas} />
            <div className="sueloscrud-content">
                {loading ? (
                    <div className="sueloscrud-loading"><img src={Loading} alt="Cargando..." className="sueloscrud-loading" /></div>
                ) : zonaSeleccionada ? (
                    <>
                        <div className="sueloscrud-header">
                            <h2 className="sueloscrud-title">
                                {zonaSeleccionadaNombre}
                            </h2>
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
                                <button className="sueloscrud-btn">Comparar Parcelas</button>
                                <FormParcela idZona={zonaSeleccionada} idUser={userData.id}/>
                            </div>
                        </div>
                        <div className="sueloscrud-parcels">
                            {filteredParcelas.length > 0 ? (
                                filteredParcelas.map((parcela) => (
                                    <Parcela key={parcela.parc_id} parcelID={parcela.parc_id} parcelName={parcela.parc_nombre} parcelType={parcela.tipos_id}/>
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
