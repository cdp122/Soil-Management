import React, { useState } from "react";
import "./styles/RecoverPass.css";

function RecoverPass({ onSwitchToLogin }) {
    const [cedula, setEmail] = useState("");

    const handleInputChange = (e) => {
        setEmail(e.target.value);
    };

    const handleCancel = () => {
        onSwitchToLogin(); // Regresar al login al cancelar
    };

    const handleAccept = () => {
        console.log("Email enviado para recuperar contraseña:", cedula);
        // Aquí puedes agregar lógica para enviar el correo al backend.
        onSwitchToLogin(); // Regresar al login después de aceptar
    };

    return (
        <div className="container">
            <div className="carta">
                <div className="header">
                    <div className="title">
                        <span className="icon">ℹ️</span>
                        <h2>Recuperación de Contraseña</h2>
                    </div>
                    <button className="close-btn" onClick={handleCancel}>&times;</button>
                </div>
                <p className="subtitulo">Coloque su cedula para recuperar cuenta</p>
                <div className="input-container">
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Ingrese su cedula"
                        value={cedula}
                        onChange={handleInputChange}
                    />
                    <button className="check-btn" onClick={handleAccept}>✔️</button>
                </div>
                <div className="actions">
                    <button className="cancel-btn" onClick={handleCancel}>Cancelar</button>
                    <button className="accept-btn" onClick={handleAccept}>Aceptar</button>
                </div>
            </div>
        </div>
    );
}

export default RecoverPass;
