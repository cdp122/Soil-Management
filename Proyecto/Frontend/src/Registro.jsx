import { useState, useEffect } from 'react';
import './styles/Registro.css';

function Registro() {
    const [roles, setRoles] = useState([]); // Estado para almacenar los roles obtenidos del backend
    const [formData, setFormData] = useState({
        cedula: '',
        email: '',
        nombre: '',
        apellido: '',
        password: '',
        telefono: '',
        role: ''
    });

    // Fetch de roles desde el backend
    useEffect(() => {
        fetch('https://soil-management-4-soft-utn.onrender.com/roles') // Cambia la URL por la de tu backend
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                var datroles = JSON.parse(data);
                for (var i = 0; i < datroles.length; i++) {
                    console.log('Rol:', datroles[i].tipus_detalles); // Depuración
                }
            })
            .catch(error => {
                console.error('Error al cargar los roles:', error);
                setRoles([]); // En caso de error, mantén el estado como un array vacío
            });
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

        const payload = {
            rol: roles.find(role => role.tipus_id.toString() === formData.role)?.tipus_detalles || '',
            cedula: formData.cedula,
            nombre: formData.nombre,
            apellido: formData.apellido,
            correo: formData.email,
            password: formData.password,
            telefono: formData.telefono
        };

        console.log('Datos enviados al backend (registro):', payload);

        fetch('https://soil-management-4-soft-utn.onrender.com/register', {
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
            .then(data => {
                console.log('Registro exitoso:', data);
                alert('Registro exitoso');
            })
            .catch(error => {
                console.error('Error al registrar:', error);
                alert('Error al registrar');
            });
    };

    return (
        <>
            <div className='rg-container'>
                <div className='rg-form'>
                    <h1 className='rg-title'>Registro</h1>
                    <hr />
                    <form className='rg-form-data' onSubmit={handleSubmit}>
                        <label>Cédula de Identidad<br /><input type="text" name="cedula" maxLength={10} required onChange={handleInputChange} /></label>
                        <label>Correo Electrónico<br /><input type="email" name="email" required onChange={handleInputChange} /></label>
                        <label>Nombre<br /><input type="text" name="nombre" maxLength={50} required onChange={handleInputChange} /></label>
                        <label>Apellido<br /><input type="text" name="apellido" maxLength={50} required onChange={handleInputChange} /></label>
                        <label>Contraseña<br /><input type="password" name="password" required onChange={handleInputChange} /></label>
                        <label>Teléfono<br /><input type="text" name="telefono" maxLength={10} required onChange={handleInputChange} /></label>

                        {/* Combo Box de Roles */}
                        <label>Rol<br />
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccione un rol</option>
                                {Array.isArray(roles) && roles.length > 0 && roles.map((role) => (
                                    <option key={role.tipus_id} value={role.tipus_id.toString()}>
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
