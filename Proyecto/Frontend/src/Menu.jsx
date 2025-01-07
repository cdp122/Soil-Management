import soilLogo from './assets/soil-logo.svg'
import './styles/Menu.css'

function Menu({ onTabSelect }) {
    const handleMenuClick = (tab) => {
        onTabSelect(tab)
    }

    return (
        <>
            <div className='mn-container'>
                <img className='soil-logo' src={soilLogo} alt="soil" />
                <h1>Soil Management</h1>
                <ul className='mn-options'>
                    <li onClick={() => handleMenuClick("inicio")}>
                        INICIO
                    </li>
                    <li onClick={() => handleMenuClick("suelos")}>
                        SUELOS
                    </li>
                    <li onClick={() => handleMenuClick("registro")}>
                        REGISTRO
                    </li>
                    <li onClick={() => handleMenuClick("login")}>
                        LOGIN
                    </li>
                    <li onClick={() => handleMenuClick("Perfil")}>
                        PERFIL
                    </li>
                </ul>
            </div>
        </>
    )
}

export default Menu