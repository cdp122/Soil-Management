import { Outlet, Link } from 'react-router-dom';
import './styles/App.css';
import Menu from './Menu';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div className='main-container'>
      <ToastContainer/>
      <Menu />
      <div className="tab-content">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
