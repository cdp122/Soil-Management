import soilLogo from './assets/soil-management-logo.png';
import './styles/Menu.css';
import { Link } from 'react-router-dom';
import FormMuestras from './components/form-muestras'

function Menu() {
  return (
    <div className='mn-container'>
      <img className='soil-logo' src={soilLogo} alt="soil" />
      <ul className='mn-options'>
        <li>
          <Link to="/app/inicio">INICIO</Link>
        </li>
        <li>
          <Link to="/app/contacto">CONTACTO</Link>
        </li>
        <li>
          <Link to="/app/suelos">SUELOS</Link>
        </li>
        <li>
          <Link to="/app/perfil">PERFIL</Link>
        </li>
      </ul>
    </div>
  );
}

export default Menu;