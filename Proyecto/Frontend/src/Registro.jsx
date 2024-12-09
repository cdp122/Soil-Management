import './styles/Registro.css'

function Registro() {
    return (
        <>
            <div className='rg-container'>
                <div className='rg-form'>
                    <h1 className='rg-title'>Registro</h1>
                    <hr />
                    <div className='rg-form-data'>
                        <label>Cédula de Identidad<br /><input type="text" name="rg-cedula" maxLength={10} required/></label>
                        <label>Correo Electrónico<br /><input type="email" name="rg-email" required /></label>
                        <label>Nombre<br /><input type="text" name="rg-nombre" maxLength={50} required /></label>
                        <label>Apellido<br /><input type="text" name="rg-apellido" maxLength={50} required /></label>
                        <label>Contraseña<br /><input type="password" name="rg-pass" required /></label>
                        <label>Teléfono<br /><input type="text" name="rg-telf" maxLength={10} required /></label>
                        <label>Fecha de Nacimiento<br /><input type="date" name="rg-fechanac" required /></label>
                        <button type="submit" className='rg-btn'>Registrarse</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Registro