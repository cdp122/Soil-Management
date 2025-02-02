import React from "react";
import "./styles/Inicio.css";

function Inicio() {
    return (
        <div>
            {/* Sección principal con imagen de fondo */}
            <section className="full">
                <div className="full-inner">
                    <div className="ini-content">
                        <h1>Gestión Química de Suelos</h1>
                        <a href="#informacion">Más información</a>
                    </div>
                </div>
            </section>

            {/* Sección de texto */}
            <div className="texto">
                <section className="seccion">
                    <p id="informacion">
                        <h2>Soil Management</h2>
                        Es un software innovador diseñado para la gestión eficiente de suelos agrícolas,
                        enfocado en el análisis de variables químicas y la administración inteligente de parcelas y zonas.
                        Este sistema ofrece una solución integral que combina tecnología avanzada con facilidad de uso,
                        convirtiéndose en una herramienta clave para agricultores, ingenieros agrónomos y gestores de tierras.
                        <h2>Propuesta de Valor</h2>
                        La propuesta central de Soil Management radica en ofrecer un servicio completo para la gestión de parcelas
                        agrícolas, con funcionalidades que permiten dividir y organizar terrenos en zonas específicas, realizar
                        análisis químicos detallados y comparar los resultados entre parcelas de forma sencilla e intuitiva.
                        Nuestro objetivo es ayudar a los usuarios a tomar decisiones informadas que optimicen el rendimiento
                        de los cultivos y promuevan una gestión sostenible de los recursos del suelo.
                    </p>
                </section>
            </div>

            {/* Sección de videos */}
            <div className="videos-section">
                <h2>Videos Informativos</h2>
                <div className="video-container">
                    <div className="video-frame">
                        <iframe
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/zMBZb9kmiMM?si=IBVXBxDRUNNZ6K0Q"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                        <div className="video-details">
                            <p className="video-description">Un video que expone todas las propiedades químicas que tienen los suelos. Es fundamental conocerlas para crear muestras en la aplicación.</p>
                            <p className="video-citation">Autor: SENA - 13 de Junio de 2020</p>
                        </div>
                    </div>
                    <div className="video-frame">
                        <iframe
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/ie9vwS4mDGQ?si=KcbeBxCLZOat_yyx"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                        <div className="video-details">
                            <p className="video-description">Este video muestra algunos tipos de suelos fundamentales que aparecen en la aplicación, debes conocerlos al momento de crear una nueva parcela.</p>
                            <p className="video-citation">Autor: Conocimiento - 25 de Noviembre de 2024</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="footer">
                <p>© 2025 Soil Management. Todos los derechos reservados.</p><br></br><p>Ibarra - Ecuador</p>
            </footer>
        </div>
    );
}

export default Inicio;
