import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirecciones
import './styles/Login.css';

function Login({ onSwitchToRegister }) {
    const [formData, setFormData] = useState({
        cedula: '',
        password: ''
    });

    const [token, setToken] = useState(null); // Estado para almacenar el token
    const [errorMessage, setErrorMessage] = useState(''); // Estado para almacenar el mensaje de error
    const navigate = useNavigate(); // Hook para redirección

    // Cargar token desde localStorage al iniciar el componente
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
            console.log('Token recuperado del localStorage:', savedToken);
        }
    }, []);

    const handleInputChange = async (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

        const payload = {
            cedula: formData.cedula,
            password: formData.password
        };

        console.log('Datos enviados al backend (login):', payload);

        try {
            const response = await fetch('https://soil-management-4-soft-utn.onrender.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(`${errorResult.error}`);
            }

            const result = await response.json();
            console.log('Inicio de sesión exitoso:', result);

            // Guardar el token en localStorage y en el estado
            localStorage.setItem('token', result.token);
            setToken(result.token);
            // Guardado del usuario
            localStorage.setItem("cedula", formData.cedula);
            
            navigate('/app');
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setErrorMessage(`${error.message}`); // Actualizar el mensaje de error
        }
    };

    return (
        <div className="content">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="cedula"><b>Cédula de Identidad</b></label>
                    <input
                        type="text"
                        className="username"
                        id="cedula"
                        minLength={10}
                        maxLength={10}
                        required
                        pattern='\d{10}'
                        title='Ingrese los 10 dígitos de su cédula'
                        autoFocus
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password"><b>Contraseña</b></label>
                    <input
                        type="password"
                        className="password"
                        id="password"
                        required
                        pattern=".{0,}"
                        title="Ingrese su contraseña"
                        onChange={handleInputChange}
                    />
                    <a href="">Recuperar contraseña</a>
                </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Mostrar el mensaje de error */}
                <div className="form-group">
                    <button className="btn" type="submit">Iniciar Sesión</button>
                    <button
                        type="button"
                        className="btn"
                        onClick={onSwitchToRegister} // Cambiar a la vista de registro
                    >
                        Registrarse
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Login;