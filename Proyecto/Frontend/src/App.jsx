import { Outlet, Link } from 'react-router-dom';
import './styles/App.css';
import Menu from './Menu';

function App() {
  return (
    <div className='main-container'>
      <Menu />
      <div className="tab-content">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
