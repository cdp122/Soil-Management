import PropTypes from 'prop-types'; // Importa PropTypes
import soilLogo from './assets/soil-logo.svg';
import './styles/Menu.css';

function Menu({ onTabSelect }) {
    const handleMenuClick = (tab) => {
        onTabSelect(tab);
    };

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
                    <li onClick={() => handleMenuClick("login")}>
                        Login
                    </li>
                </ul>
            </div>
        </>
    );
}

// Agrega PropTypes para la validación de la propiedad
Menu.propTypes = {
    onTabSelect: PropTypes.func.isRequired,  // La propiedad onTabSelect debe ser una función y es obligatoria
};

export default Menu;
