
import './styles/Login.css'

function login() {
    return (
        <div className="content">
            <div className="form-group">
                <label htmlFor="username"><b>Usuario</b></label>
                <input
                    type="text"
                    className="username"
                    id="username"
                    required
                    pattern=".{10}"
                    title="Ingrese los 10 digitos de su cédula"
                    autoFocus
                />
            </div>
            <div className="form-group">
                <label htmlFor="password"><b>Contraseña</b></label>
                <input
                    type="password"
                    className="contraseña"
                    id="password"
                    required
                    pattern=".{8,}"
                    title="Ingrese su contraseña"
                />
            </div>
            <div className="form-group">
                <button className="btn" type="submit">Iniciar Sesión</button>
                <a href="" className="btn">Registrarse</a>
                <a href="" className="btn recuperar">Recuperar Contraseña</a>
            </div>
        </div>
    )
}

export default login;