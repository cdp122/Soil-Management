/* eslint-disable */
import "./confirmacion.css"

const Confirmacion = ({titulo, texto, isActivo, setActivo, action,}) =>{
    const ocultar = () =>{
        setActivo(false);
    }

    return (
        <div className={`confirmacion-fondo modal ${isActivo?'is-active':''}`} >
            <div className="confirmacion-contenedor">
                <div className="confirmacion-superior">
                    <div className="confirmacion-icono">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <div className="confirmacion-info">
                        <span>{titulo}</span>
                        <p>{texto}</p>
                    </div>
                </div>
                <div className="confirmacion-inferior">
                    <div className="confirmacion-botones">
                        <button onClick={ocultar}>Cancelar</button>
                        <button onClick={action}>Aceptar</button>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default Confirmacion;