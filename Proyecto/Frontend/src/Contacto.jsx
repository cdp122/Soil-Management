import React from "react";
import "./styles/Contacto.css";

function Contacto() {
    return (
        <div className="contacto-container">
            <main className="contacto-main">
                <div className="contacto-content">
                    <h2>Contacto</h2>
                    <p>
                        Si tienes alguna pregunta o necesitas más información sobre nuestros servicios,
                        no dudes en ponerte en contacto con nosotros. Estamos aquí para ayudarte.
                    </p>
                    <p>
                        Puedes comunicarte con nosotros a través de los siguientes medios:
                    </p>
                    <ul className="contacto-info">
                        <li><strong>Celular:</strong> +593 99 123 4567</li>
                        <li><strong>Teléfono:</strong> +593 2 123 4567</li>
                        <li><strong>Dirección:</strong> Av. Siempre Viva 123, Ibarra, Ecuador</li>
                        <li><strong>Soporte:</strong> soporte@soilmanagement.com</li>
                        <li><strong>Email:</strong> info@soilmanagement.com</li>
                    </ul>
                </div>
                <div className="contacto-image">
                    <div className="contacto-img" />
                </div>
            </main>
        </div>
    );
}

export default Contacto;
