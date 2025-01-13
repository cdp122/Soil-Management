import { useEffect, useState } from 'react';
import './styles/Perfil.css';

function Perfil() {
    const [authorized, setAuthorized] = useState(false); // Estado para controlar el acceso
    const [userData, setUserData] = useState([]); // Cambiado a un array vacío
    const token = localStorage.getItem('token'); // Recuperar el token del localStorage
    const cedula = localStorage.getItem('cedula'); // Recuperar el token del localStorage

    useEffect(() => {
        // Verificar el token al cargar la página
        const validateToken = async () => {
            if (!token) {
                // Si no hay token, redirigir o bloquear acceso
                console.error('No hay token disponible. Redirigiendo al login.');
                setAuthorized(false);
                return;
            }

            try {
                const response = await fetch('https://soil-management-4-soft-utn.onrender.com/profile?user=' + cedula, {  //cedula del user 
                    method: 'GET',
                    headers: {
                        'Authorization': token // Enviar token en los headers
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Datos del usuario recibidos:', data); // Depuración
                    setUserData(data); // Guardar datos del usuario si el token es válido
                    //console.log('datos.' + data.user_email + data.user_apellido);
                    setAuthorized(true); // Permitir acceso a la página
                } else {
                    console.error('Token inválido o expirado. Redirigiendo al login.');
                    setAuthorized(false);
                    localStorage.removeItem('token'); // Limpiar token si no es válido
                }
            } catch (error) {
                console.error('Error al validar el token:', error);
                setAuthorized(false);
            }
        };

        validateToken();
    }, [token]);

    if (!authorized) {
        // Mostrar un mensaje o redirigir al usuario si no está autorizado
        return <div>No tienes acceso. Por favor, inicia sesión.</div>;
    }

    return (
        <main className="perfil-main">
            <div className="perfil-container">
                <div className="perfil-header">
                    <div className="perfil-img-wrapper">
                        <img
                            src="https://via.placeholder.com/150"
                            alt="Perfil"
                            className="perfil-img"
                        />
                    </div>
                    <h1 className="perfil-name">
                        {userData[0]?.user_nombre || 'Nombre del Usuario'}{' '}
                        {userData[0]?.user_apellido || ''}
                    </h1>
                    <p className="perfil-role">
                        Rol: {userData[0]?.tipus_id}  {/* Cambiar por tipus_detalles */}
                    </p>

                </div>

                <div className="perfil-info">
                    <h2>Información Personal</h2>
                    <div className="perfil-info-grid">
                        <div className="perfil-info-item">
                            <h3>Email</h3>
                            <p>{userData[0]?.user_email || 'usuario@email.com'}</p>
                        </div>
                        <div className="perfil-info-item">
                            <h3>Teléfono</h3>
                            <p>{userData[0]?.user_telefono || '+123 456 7890'}</p>
                        </div>
                        <div className="perfil-info-item">
                            <h3>Fecha de Registro</h3>
                            <p>{new Date(userData[0]?.created_at).toLocaleDateString() || '01/01/2023'}</p>
                        </div>
                    </div>
                </div>

                <div className="perfil-actions">
                    <button className="btnPerfil">Modificar Datos</button>
                    <button className="btnPerfil">Suspender Cuenta</button>
                    <button
                        className="btnDanger"
                        onClick={() => {
                            localStorage.removeItem('token'); // Eliminar el token al cerrar sesión
                            setAuthorized(false); // Bloquear acceso
                            window.location.href = '/login'; // Redirigir al login
                        }}
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </main>
    );
}

export default Perfil;
