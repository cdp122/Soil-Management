import { useEffect, useState } from "react";
import Loading from "./assets/loading.gif";
import "./styles/Perfil.css";
import Icon from "./assets/user.svg";

function Perfil() {
    const [authorized, setAuthorized] = useState(false);
    const [userData, setUserData] = useState({});
    const [isEditing, setIsEditing] = useState(false); // Controla si el formulario de edición está visible
    const [formData, setFormData] = useState({});
    const token = localStorage.getItem("token");
    const cedula = localStorage.getItem("cedula");

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setAuthorized(false);
                return;
            }

            try {
                const response = await fetch(
                    `https://soil-management-4-soft-utn.onrender.com/profile?user=${cedula}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: token,
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                    setAuthorized(true);
                } else {
                    setAuthorized(false);
                    localStorage.removeItem("token");
                }
            } catch (error) {
                console.error("Error al validar el token:", error);
                setAuthorized(false);
            }
        };

        validateToken();
    }, [token, cedula]);

    // Maneja los cambios en los campos del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Maneja la acción de guardar los datos modificados
    const handleSaveChanges = async () => {
        try {
            const response = await fetch(
                `https://soil-management-4-soft-utn.onrender.com/`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (response.ok) {
                const updatedData = await response.json();
                setUserData(updatedData);
                setIsEditing(false); // Cerrar el formulario
                alert("Datos actualizados con éxito.");
            } else {
                alert("Error al actualizar los datos. Inténtelo nuevamente.");
            }
        } catch (error) {
            console.error("Error al guardar los cambios:", error);
            alert("Ocurrió un error al guardar los cambios.");
        }
    };

    if (!authorized) {
        return <img src={Loading} alt="Cargando..." className="sueloscrud-loading" />;
    }

    return (
        <main className="perfil-main">
            <div className="perfil-container">
                {!isEditing ? (
                    <>
                        {/* Vista de perfil */}
                        <div className="perfil-header">
                            <div className="perfil-img-wrapper">
                                <img src={Icon} alt="Perfil" className="perfil-img" />
                            </div>
                            <h1 className="perfil-name">
                                {userData?.nombre || "Nombre del Usuario"}{" "}
                                {userData?.apellido || ""}
                            </h1>
                            <p className="perfil-role">Rol: {userData?.tipo}</p>
                        </div>

                        <div className="perfil-info">
                            <h2>Información Personal</h2>
                            <div className="perfil-info-grid">
                                <div className="perfil-info-item">
                                    <h3>Cédula</h3>
                                    <p>{userData?.cedula || "No especificado"}</p>
                                </div>
                                <div className="perfil-info-item">
                                    <h3>Email</h3>
                                    <p>{userData?.correo || "usuario@email.com"}</p>
                                </div>
                                <div className="perfil-info-item">
                                    <h3>Teléfono</h3>
                                    <p>{userData?.telefono || "+123 456 7890"}</p>
                                </div>
                            </div>
                        </div>

                        <div className="perfil-actions">
                            <button
                                className="btnPerfil"
                                onClick={() => {
                                    setIsEditing(true);
                                    setFormData(userData); // Prellenar el formulario con los datos actuales
                                }}
                            >
                                Modificar Datos
                            </button>
                            <button className="btnPerfil">Suspender Cuenta</button>
                            <button
                                className="btnDanger"
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    setAuthorized(false);
                                    window.location.href = "/";
                                }}
                            >
                                Cerrar Sesión
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Formulario de edición */}
                        <h2>Editar Información Personal</h2>
                        <div className="perfil-info-grid">
                            <div className="perfil-info-item">
                                <label>Cédula</label>
                                <input
                                    type="text"
                                    name="cedula"
                                    value={formData.cedula || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="perfil-info-item">
                                <label>Nombre</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="perfil-info-item">
                                <label>Apellido</label>
                                <input
                                    type="text"
                                    name="apellido"
                                    value={formData.apellido || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="perfil-info-item">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="correo"
                                    value={formData.correo || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="perfil-info-item">
                                <label>Teléfono</label>
                                <input
                                    type="text"
                                    name="telefono"
                                    value={formData.telefono || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="perfil-info-item">
                                <label>Contraseña</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={""}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="perfil-actions">
                            <button className="btnPerfil" onClick={() => setIsEditing(false)}>
                                Cancelar
                            </button>
                            <button className="btnPerfil" onClick={handleSaveChanges}>
                                Guardar Cambios
                            </button>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}

export default Perfil;
