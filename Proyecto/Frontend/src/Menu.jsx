import soilLogo from './assets/soil-management-logo.png'
import './styles/Menu.css'

function Menu({ onTabSelect }) {
    const handleMenuClick = (tab) => {
        onTabSelect(tab)
    }

    return (
        <>
            <div className='mn-container'>
                <img className='soil-logo' src={soilLogo} alt="soil" />
                <ul className='mn-options'>
                    <li onClick={() => handleMenuClick("inicio")}>
                        INICIO
                    </li>
                    <li onClick={() => handleMenuClick("contacto")}>
                        CONTACTO
                    </li>
                    <li onClick={() => handleMenuClick("suelos")}>
                        SUELOS
                    </li>
                    <li onClick={() => handleMenuClick("perfil")}>
                        PERFIL
                    </li>
                    
                </ul>
            </div>
        </>
    )
}

export default Menu