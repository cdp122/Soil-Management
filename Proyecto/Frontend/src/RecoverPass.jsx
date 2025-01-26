import React, { useState } from "react";
import "./styles/RecoverPass.css";

function RecoverPass({ onSwitchToLogin }) {
    const [formData, setFormData] = useState({
        cedula: "",
        email: "",
        telefono: ""
    });
    const [newPassword, setNewPassword] = useState(""); // Nueva contraseña
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

    // Simula la validación de datos
    const handleValidateData = async () => {
        const { cedula, email, telefono } = formData;

        // Validaciones básicas
        if (!cedula.trim() || !email.trim() || !telefono.trim()) {
            setErrorMessage("Todos los campos son obligatorios.");
            return;
        }

        // Simulación de comprobación
        console.log("Validando datos...");
        if (cedula === "1234567890" && email === "test@example.com" && telefono === "0987654321") {
            setStep(2); // Pasar al formulario de nueva contraseña
            setErrorMessage("");
        } else {
            setErrorMessage("Los datos no coinciden. Verifique e intente nuevamente.");
        }
    };

    // Simula el guardado de la nueva contraseña
    const handleSaveNewPassword = async () => {
        if (!newPassword.trim()) {
            setErrorMessage("La nueva contraseña no puede estar vacía.");
            return;
        }

        // Simulación de guardado
        console.log("Nueva contraseña guardada:", newPassword);
        setSuccessMessage("Contraseña actualizada con éxito.");
        setErrorMessage("");

        // Redirigir al login después de un pequeño retraso
        setTimeout(() => {
            onSwitchToLogin();
        }, 2000);
    };

    return (
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
    );
}

export default RecoverPass;
