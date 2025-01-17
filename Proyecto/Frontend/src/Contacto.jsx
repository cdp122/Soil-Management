
import "./styles/Contacto.css";

function Contacto() {
    return (
        <div className="contacto-container">
            {/* Contenido principal */}
            <main className="contacto-main">
                <div className="contacto-content">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor a
                        lorem eget pharetra. Donec sollicitudin magna nec libero fermentum
                        vehicula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
                        posuere cubilia curae; Donec nec maximus diam. Etiam sed turpis quam. Nulla
                        convallis, ex at pellentesque maximus, lacus enim imperdiet dolor, non
                        pharetra sem ligula quis elit. Fusce sit amet tempus turpis, et feugiat
                        metus. Pellentesque suscipit venenatis metus, vel sodales ipsum fringilla
                        et. Nulla auctor vehicula cursus.
                    </p>
                    <p>
                        Praesent scelerisque nisi ut eros luctus vestibulum. Donec elementum turpis
                        mauris, ut ullamcorper mauris convallis ac. Pellentesque eget vulputate
                        ante, quis tincidunt quam. Nam nec ultrices justo. Morbi tincidunt mi odio,
                        eget volutpat ante euismod sed. Proin tristique sed mi sollicitudin
                        malesuada.
                    </p>
                    <p>
                        Praesent scelerisque nisi ut eros luctus vestibulum. Donec elementum turpis
                        mauris, ut ullamcorper mauris convallis ac. Pellentesque eget vulputate
                        ante, quis tincidunt quam. Nam nec ultrices justo. Morbi tincidunt mi odio,
                        eget volutpat ante euismod sed. Proin tristique sed mi sollicitudin
                        malesuada.
                    </p>
                    <p>
                        Praesent scelerisque nisi ut eros luctus vestibulum. Donec elementum turpis
                        mauris, ut ullamcorper mauris convallis ac. Pellentesque eget vulputate
                        ante, quis tincidunt quam. Nam nec ultrices justo. Morbi tincidunt mi odio,
                        eget volutpat ante euismod sed. Proin tristique sed mi sollicitudin
                        malesuada.
                    </p>

                </div>
                <div className="contacto-image">
                    <div
                        className="contacto-img"
                    />
                </div>
            </main>
            <div className="texto">
                {/* Información de contacto */}
                <footer className="contacto-footer">
                    <ul>
                        <li>Celular</li>
                        <li>Teléfono</li>
                        <li>Dirección</li>
                        <li>Soporte</li>
                        <li>Email</li>
                    </ul>
                </footer>
            </div>
        </div>
    );
}

export default Contacto;
