import './styles/Perfil.css'

function Perfil() {
    return (
        <main className='Main'>
            <div className="contenedorPerfil">
                <div className='ContenedorImg'>
                </div>
            </div>
            <div className='GrupoAcciones'>
                <button className='btn' type='submit'>Modificar Datos</button>
                <button className='btn' type='submit'>Suspender Cuenta</button>
                <button className='btn' type='submit'>Cerrar Sesión</button>
            </div>
        </main>



    )
}

export default Perfil;





