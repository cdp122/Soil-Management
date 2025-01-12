import React from "react";
import "./styles/Zonas.css";

function Zonas({ zonas, onZonaClick }) {
    return (
        <aside className="zonas-sidebar">
            <div className="zonas-header">
                <h2 className="zonas-title">Zonas</h2>
                <button className="zonas-add">+</button>
            </div>
            <ul className="zonas-list">
                <li
                    className="zonas-item zonas-item-home"
                    onClick={() => onZonaClick(null)}
                >
                    <span className="zonas-home-icon">🏠</span> Inicio
                </li>
                {zonas.map((zona) => (
                    <li
                        key={zona.id}
                        className="zonas-item"
                        onClick={() => onZonaClick(zona.id)}
                    >
                        {zona.nombre}
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default Zonas;
