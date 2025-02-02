import React, { useState } from "react";
import "./styles/RecoverPass.css";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
function RecoverPass({ onSwitchToLogin }) {
    const [formData, setFormData] = useState({
        cedula: "",
        email: "",
        telefono: ""
    });
    const [newPassword, setNewPassword] = useState(""); // Nueva contraseña
    const [confirmPassword, setConfirmPassword] = useState(""); // Confirmar contraseña
    const [step, setStep] = useState(1); // Controla los pasos del formulario
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Actualiza los valores de los campos del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Maneja el cambio de la nueva contraseña
    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    // Maneja el cambio de la confirmación de la contraseña
    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    // Simula la validación de datos
    const handleValidateData = async () => {
        const { cedula, email, telefono } = formData;

        // Validaciones básicas
        if (!cedula.trim() || !email.trim() || !telefono.trim()) {
            setErrorMessage("Todos los campos son obligatorios.");
            return;
        }

        try {
            // Agregar los datos como parámetros de consulta
            const url = `https://soil-management-4-soft-utn.onrender.com/recover?cedula=${encodeURIComponent(
                cedula
            )}&email=${encodeURIComponent(email)}&telefono=${encodeURIComponent(telefono)}`;

            console.log("URL de validación:", url);

            const response = await fetch(url, {
                method: "GET",

            });

            const data = await response.json();

            console.log("Respuesta de validación:", data);

            if (data.valid) {
                toast
                setStep(2); // Pasar al formulario de nueva contraseña
                setErrorMessage("");
            } else {
                setErrorMessage("Los datos no coinciden. Verifique e intente nuevamente.");
            }
        } catch (error) {
            setErrorMessage("Error al validar los datos. Intente nuevamente.");
            console.error("Error en la solicitud de validación:", error);
        }
    };

    // Simula el guardado de la nueva contraseña
    const handleSaveNewPassword = async () => {
        const { cedula } = formData;

        if (!newPassword.trim() || !confirmPassword.trim()) {
            toast.info('La nueva contraseña y la confirmación no pueden estar vacías.');

            return;
        }

        if (newPassword !== confirmPassword) {
            toast.info('Las contraseñas no coinciden.');
            return;
        }

        console.log("Nueva contraseña:", newPassword);

        try {
            const response = await fetch("https://soil-management-4-soft-utn.onrender.com/recover", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ cedula, password: newPassword })
            });

            const data = await response.json();

            console.log("Respuesta de cambio de contraseña:", data);

            if (data.success) {
                toast.success('Contraseña actualizada con éxito.');

                // Redirigir al login después de un pequeño retraso
                setTimeout(() => {
                    onSwitchToLogin();
                }, 2000);
            } else {
                setErrorMessage("Error al actualizar la contraseña. Intente nuevamente 1 .");
            }
        } catch (error) {
            setErrorMessage("Error al actualizar la contraseña. Intente nuevamente 2 .");
            console.error("Error en la solicitud de cambio de contraseña:", error);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="container">
                <div className="carta">
                    <div className="header">
                        <div className="title">
                            <span className="icon">ℹ️</span>
                            <h2 className="h2Recover">
                                {step === 1 ? "Recuperación de Contraseña" : "Nueva Contraseña"}
                            </h2>
                        </div>
                        <button className="close-btn" onClick={onSwitchToLogin}>
                            &times;
                        </button>
                    </div>
                    {step === 1 && (
                        <>
                            <p className="subtitulo">
                                Ingrese los siguientes datos para verificar su identidad
                            </p>
                            <div className="input-container">
                                <input
                                    type="text"
                                    name="cedula"
                                    className="input-field"
                                    placeholder="Ingrese su cédula"
                                    value={formData.cedula}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="email"
                                    name="email"
                                    className="input-field"
                                    placeholder="Ingrese su correo"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                                <input
                                    type="text"
                                    name="telefono"
                                    className="input-field"
                                    placeholder="Ingrese su teléfono"
                                    value={formData.telefono}
                                    onChange={handleInputChange}
                                />
                            </div>
                            {errorMessage && <div className="error-message">{errorMessage}</div>}
                            <div className="actions">
                                <button className="cancel-btn" onClick={onSwitchToLogin}>
                                    Cancelar
                                </button>
                                <button className="accept-btn" onClick={handleValidateData}>
                                    Verificar
                                </button>
                            </div>
                        </>
                    )}
                    {step === 2 && (
                        <>
                            <p className="subtitulo">Ingrese su nueva contraseña</p>
                            <div className="input-container">
                                <input
                                    type="password"
                                    className="input-field"
                                    placeholder="Nueva contraseña"
                                    value={newPassword}
                                    onChange={handleNewPasswordChange}
                                />
                                <input
                                    type="password"
                                    className="input-field"
                                    placeholder="Confirmar nueva contraseña"
                                    value={confirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                />
                            </div>
                            {errorMessage && <div className="error-message">{errorMessage}</div>}
                            {successMessage && <div className="success-message">{successMessage}</div>}
                            <div className="actions">
                                <button className="cancel-btn" onClick={onSwitchToLogin}>
                                    Cancelar
                                </button>
                                <button className="accept-btn" onClick={handleSaveNewPassword}>
                                    Guardar
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

export default RecoverPass;