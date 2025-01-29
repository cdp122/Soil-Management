import { useEffect, useState } from "react";
import Loading from "./assets/loading.gif";
import "./styles/Perfil.css";
import Icon from "./assets/user.svg";

function Perfil() {
    const [authorized, setAuthorized] = useState(false);
    const [userData, setUserData] = useState({});
    const [isEditing, setIsEditing] = useState(false); // Controla si el formulario de edición está visible
    const [isChangingPassword, setIsChangingPassword] = useState(false); // Controla si el formulario de contraseña está visible
    const [formData, setFormData] = useState({});
    const [passwordData, setPasswordData] = useState({ newPassword: "", confirmPassword: "" });
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
                            Authorization: token
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
        setPasswordData({ ...passwordData, [name]: value });
    };

    // Maneja la acción de suspender la cuenta
    const handleSuspendAccount = async () => {
        if (!cedula || !token) {
            alert("No se puede suspender la cuenta. Faltan datos necesarios.");
            return;
        }

        const confirmDelete = window.confirm(
            "¿Estás seguro de que deseas suspender tu cuenta? Esta acción no se puede deshacer."
        );
        if (!confirmDelete) return;

        try {
            const response = await fetch(
                `https://soil-management-4-soft-utn.onrender.com/account?cedula=${cedula}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                }
            );

            if (response.ok) {
                alert("La cuenta ha sido suspendida con éxito.");
                localStorage.removeItem("token");
                setAuthorized(false);
                window.location.href = "/";
            } else {
                alert("Error al suspender la cuenta. Inténtalo de nuevo.");
            }
        } catch (error) {
            console.error("Error al suspender la cuenta:", error);
            alert("Hubo un error al procesar tu solicitud.");
        }
    };

    // Maneja la acción de guardar los datos modificados
    const handleSaveChanges = async () => {
        try {
            const { password, ...updatedFormData } = formData;
            console.log(updatedFormData);
            const response = await fetch(
                `https://soil-management-4-soft-utn.onrender.com/account`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                    body: JSON.stringify(updatedFormData),
                }
            );

            if (response.ok) {
                const updatedData = await response.json();
                setUserData(updatedData);
                setIsEditing(false);
                alert("Datos actualizados con éxito.");
            } else {
                alert("Error al actualizar los datos. Inténtelo nuevamente.");
            }
        } catch (error) {
            console.error("Error al guardar los cambios:", error);
            alert("Ocurrió un error al guardar los cambios.");
        }
    };

    // Maneja la acción de cambiar la contraseña
    const handleModifyPassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("Las contraseñas no coinciden.");
            console.log("Las contraseñas no coinciden");
            return;
        }

        try {
            console.log("Entra al try");
            const response = await fetch(
                `https://soil-management-4-soft-utn.onrender.com/password`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                    body: JSON.stringify({ cedula: cedula, password: passwordData.newPassword })
                }
            );

            if (response.ok) {
                alert("Contraseña cambiada con éxito.");
                console.log("Contraseña cambiada con éxito");
                setIsChangingPassword(false);
                setPasswordData({ newPassword: "", confirmPassword: "" });
            } else {
                alert("Error al cambiar la contraseña. Inténtalo nuevamente.");
                console.log("Error al cambiar la contraseña. Inténtalo nuevamente.");
            }
        } catch (error) {
            console.error("Error al cambiar la contraseña:", error);
            alert("Ocurrió un error al cambiar la contraseña.");
        }
    };

    if (!authorized) {
        return <img src={Loading} alt="Cargando..." className="sueloscrud-loading" />;
    }

    return (
        <main className="perfil-main">
            <div className="perfil-container">
                {!isEditing && !isChangingPassword ? (
                    <>
                        {/* Vista de perfil */}
                        <div className="perfil-header">
                            <div className="perfil-img-wrapper">
                                <img src={Icon} alt="Perfil" className="perfil-img" />
                            </div>
                            <h1 className="perfil-name">
                                {userData?.nombre || "Nombre del Usuario"} {userData?.apellido || ""}
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
                            <button className="btnPerfil" onClick={() => setIsEditing(true)}>
                                Modificar Datos
                            </button>
                            <button
                                className="btnPerfil"
                                onClick={() => setIsChangingPassword(true)}
                            >
                                Modificar Contraseña
                            </button>
                            <button className="btnPerfil" onClick={handleSuspendAccount}>
                                Suspender Cuenta
                            </button>
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
                ) : isChangingPassword ? (
                    <>
                        {/* Formulario de cambio de contraseña */}
                        <h2 id="H2FormEdi">Cambiar Contraseña</h2>
                        <div className="perfil-info-grid">
                            <div className="perfil-info-item">
                                <label>Nueva Contraseña</label>
                                <input className="NuevaPass"
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="perfil-info-item">
                                <label>Confirmar Contraseña</label>
                                <input className="NuevaPass"
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="perfil-actions">
                            <button
                                className="btnPerfil"
                                onClick={() => setIsChangingPassword(false)}
                            >
                                Cancelar
                            </button>
                            <button className="btnPerfil" onClick={handleModifyPassword}>
                                Guardar Contraseña
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Formulario de edición */}
                        <h2 id="H2FormEdi">Editar Información Personal</h2>
                        <div className="perfil-info-grid">
                            <div className="perfil-info-item">
                                <label>Cédula</label>
                                <input className="Cedula"
                                    type="text"
                                    name="cedula"
                                    value={formData.cedula || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, [e.target.name]: e.target.value })
                                    }
                                />
                            </div>
                            <div className="perfil-info-item">
                                <label>Nombre</label>
                                <input className="Nombre"
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, [e.target.name]: e.target.value })
                                    }
                                />
                            </div>
                            <div className="perfil-info-item">
                                <label>Apellido</label>
                                <input className="Apellido"
                                    type="text"
                                    name="apellido"
                                    value={formData.apellido || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, [e.target.name]: e.target.value })
                                    }
                                />
                            </div>
                            <div className="perfil-info-item">
                                <label>Email</label>
                                <input className="Email"
                                    type="email"
                                    name="correo"
                                    value={formData.correo || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, [e.target.name]: e.target.value })
                                    }
                                />
                            </div>
                            <div className="perfil-info-item">
                                <label>Teléfono</label>
                                <input className="Telefono"
                                    type="text"
                                    name="telefono"
                                    value={formData.telefono || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, [e.target.name]: e.target.value })
                                    }
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