import { useState, useEffect } from 'react';
import './styles/Login.css';

function Login() {
    const [formData, setFormData] = useState({
        cedula: '',
        password: ''
    });

    const [token, setToken] = useState(null); // Estado para almacenar el token

    // Cargar token desde localStorage al iniciar el componente
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
            console.log('Token recuperado del localStorage:', savedToken);
        }
    }, []);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

        const payload = {
            cedula: formData.cedula,
            password: formData.password
        };

        console.log('Datos enviados al backend (login):', payload);

        // Enviar los datos al backend
        fetch('https://5108-186-71-12-133.ngrok-free.app/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(result => {
                console.log('Inicio de sesión exitoso:', result);

                // Guardar el token en localStorage y en el estado
                localStorage.setItem('token', result.token);
                setToken(result.token);

                alert('Inicio de sesión exitoso');
            })
            .catch(error => {
                console.error('Error al iniciar sesión:', error);
                alert('Error al iniciar sesión');
            });
    };

    return (
        <div className="content">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="cedula"><b>Usuario</b></label>
                    <input
                        type="text"
                        className="username"
                        id="cedula"
                        required
                        pattern=".{10}"
                        title="Ingrese los 10 dígitos de su cédula"
                        autoFocus
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password"><b>Contraseña</b></label>
                    <input
                        type="password"
                        className="contraseña"
                        id="password"
                        required
                        pattern=".{0,}"
                        title="Ingrese su contraseña"
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <button className="btn" type="submit">Iniciar Sesión</button>
                    <a href="" className="btn">Registrarse</a>
                    <a href="" className="btn recuperar">Recuperar Contraseña</a>
                </div>
            </form>
        </div>
    );
}

export default Login;
