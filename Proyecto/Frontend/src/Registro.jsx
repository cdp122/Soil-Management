import { useState, useEffect } from 'react';
import './styles/Registro.css';
import { toast, ToastContainer } from 'react-toastify';

function Registro({ onSwitchToLogin }) {
    const [roles, setRoles] = useState([]); // Estado para almacenar los roles obtenidos del backend
    const [formData, setFormData] = useState({
        cedula: '',
        email: '',
        nombre: '',
        apellido: '',
        password: '',
        telefono: '',
        role: '' // Este campo capturará el valor del select
    });

    // Fetch de roles desde el backend (este bloque se conserva por si en el futuro se usara)
    useEffect(() => {
        // Función para cargar los roles desde el backend
        const fetchRoles = async () => {
            try {
                const response = await fetch('https://soil-management-4-soft-utn.onrender.com/roles');
                if (!response.ok) {
                    throw new Error('Error al cargar los roles');
                }
                const data = await response.json();
                setRoles(data);
            } catch (error) {
                console.error('Error al cargar los roles:', error);
                toast.error('Error al cargar los roles');
            }
        };

        fetchRoles();
    }, []);

    // Manejar cambios en los inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Enviar datos al backend
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

        // Crear el objeto que se enviará
        const payload = {
            cedula: formData.cedula,
            nombre: formData.nombre,
            apellido: formData.apellido,
            correo: formData.email,
            password: formData.password,
            telefono: formData.telefono,
            rol: formData.role // Captura el valor del select
        };

        console.log('Datos enviados al backend (registro):', payload);

        try {
            const response = await fetch('https://soil-management-4-soft-utn.onrender.com/register', {
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
            console.log('Registro exitoso:', result);
            toast.success('Registro exitoso');
            alert('Registro exitoso');
            onSwitchToLogin(); // Cambiar a la pestaña de inicio de sesión
        } catch (error) {
            console.error('Error al registrar:', error);
            toast.error(`Error al registrar: ${error.message}`);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className='rg-container'>
                <div className='rg-form'>
                    <h1 className='rg-title'>Registro</h1>
                    <hr />
                    <form className='rg-form-data' onSubmit={handleSubmit}>
                        <label>Cédula de Identidad<br />
                            <input
                                type="text"
                                name="cedula"
                                minLength={10}
                                maxLength={10}
                                pattern='\d{10}'
                                title='Ingrese los 10 dígitos de su cédula'
                                required
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>Correo Electrónico<br />
                            <input
                                type="email"
                                name="email"
                                required
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>Nombre<br />
                            <input
                                type="text"
                                name="nombre"
                                maxLength={50}
                                pattern='[A-Za-zÁÉÍÓÚáéíóúÑñ]+' // Solo letras
                                title='Solo se permiten letras'
                                required
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>Apellido<br />
                            <input
                                type="text"
                                name="apellido"
                                maxLength={50}
                                pattern='[A-Za-zÁÉÍÓÚáéíóúÑñ]+' // Solo letras
                                title='Solo se permiten letras'
                                required
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>Contraseña<br />
                            <input
                                type="password"
                                name="password"
                                required
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>Teléfono<br />
                            <input
                                type="text"
                                name="telefono"
                                minLength={10}
                                maxLength={10}
                                required
                                onChange={handleInputChange}
                            />
                        </label>

                        {/* Combo Box de Roles */}
                        <label>Rol<br />
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccione un rol</option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.tipus_detalles}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <button type="submit" className='rg-btn'>Registrarse</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Registro;
