import React from "react";
import "./styles/Inicio.css";

function Inicio() {
    return (
        <div>
            {/* Sección principal con imagen de fondo */}
            <section className="full">
                <div className="full-inner">
                    <div className="content">
                        <h1>Suelos</h1>
                        <a href="#miTexto">Más información</a>
                    </div>
                </div>
            </section>

            {/* Sección de texto */}
            <div className="texto">
                <section className="seccion">
                    <p id="miTexto">
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
                        <ul><h2>Funcionalidades Destacadas</h2>

                            <li><b>Gestión de Parcelas y Zonas</b></li>
                            Permite registrar y visualizar parcelas, organizarlas en zonas específicas y gestionar información clave de cada área.
                            La división en zonas facilita la planificación y el análisis, ofreciendo una visión estructurada del terreno.
                            <li><b>Análisis Químico del Suelo</b></li>
                            Integra herramientas para registrar variables químicas como pH, niveles de nutrientes, salinidad, materia orgánica, entre otros.
                            Los datos recopilados se presentan en reportes visuales y comparativos, permitiendo identificar las fortalezas y debilidades de cada parcela.
                            <li><b>Comparación entre Parcelas</b></li>
                            Funcionalidad avanzada para comparar parcelas en función de sus variables químicas y datos de rendimiento.
                            Ideal para identificar áreas de mejora y tomar decisiones personalizadas sobre fertilización, riego u otras prácticas agrícolas.
                            <li><b>Interfaz Intuitiva y de Fácil Uso</b></li>
                            Diseñado con una interfaz amigable, accesible para usuarios con distintos niveles de experiencia tecnológica.
                            Todo el sistema es altamente visual, facilitando el acceso a la información relevante y la ejecución de tareas.
                        </ul>
                    </p>
                </section>
            </div>
            <div className="texto">
                <footer>
                    <p>Todos los derechos Reservados para Soil Management | Ibarra - Ecuador 2025 </p>
                </footer>

            </div>

        </div>

    );
}

export default Inicio;
