import './styles/Perfil.css'

function Perfil() {
    return (
        <main className="perfil-main">
            <div className="perfil-container">
                <div className="perfil-header">
                    <div className="perfil-img-wrapper">
                        <img
                            src="https://via.placeholder.com/150"
                            alt="Perfil"
                            className="perfil-img"
                        />
                    </div>
                    <h1 className="perfil-name">Nombre del Usuario</h1>
                    <p className="perfil-role">Rol: Usuario Estándar</p>
                </div>

                <div className="perfil-info">
                    <h2>Información Personal</h2>
                    <div className="perfil-info-grid">
                        <div className="perfil-info-item">
                            <h3>Email</h3>
                            <p>usuario@email.com</p>
                        </div>
                        <div className="perfil-info-item">
                            <h3>Teléfono</h3>
                            <p>+123 456 7890</p>
                        </div>
                        <div className="perfil-info-item">
                            <h3>Fecha de Registro</h3>
                            <p>01/01/2023</p>
                        </div>
                    </div>
                </div>

                <div className="perfil-actions">
                    <button className="btnPerfil">Modificar Datos</button>
                    <button className="btnPerfil">Suspender Cuenta</button>
                    <button className="btnDanger">Cerrar Sesión</button>
                </div>
            </div>
        </main>



    )
}

export default Perfil;





