import { useState } from "react";
import MenuInicio from "./MenuInicio";
import Login from "./Login";
import Inicio from "./Inicio";
import Contacto from "./Contacto";
import Registro from "./Registro";
import "./styles/Auth.css";

function Auth() {
    const [selectedTab, setSelectedTab] = useState("inicio"); // Estado para la pestaña seleccionada

    // Función para manejar la selección de pestañas
    const onTabSelect = (tab) => {
        setSelectedTab(tab); // Cambiar la pestaña seleccionada
    };

    // Renderizar el contenido según la pestaña seleccionada
    const renderContent = () => {
        switch (selectedTab) {
            case "inicio":
                return <Inicio />; // Mostrar el componente Inicio
            case "contacto":
                return <Contacto />;
            case "login":
                return <Login onSwitchToRegister={() => onTabSelect("registro")} />;
            case "registro":
                return <Registro />;
            default:
                return <div>DEFAULT</div>;
        }
    };

    return (
        <div className="au-container">
            <MenuInicio onTabSelect={onTabSelect} /> {/* Pasar la función como prop */}
            <div className="au-content">{renderContent()}</div>
        </div>
    );
}

export default Auth;
