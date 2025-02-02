import { useState } from "react";
import MenuInicio from "./MenuInicio";
import Login from "./Login";
import Inicio from "./Inicio";
import Contacto from "./Contacto";
import Registro from "./Registro";
import RecoverPass from "./RecoverPass";
import "./styles/Auth.css";

function Auth() {
    const [selectedTab, setSelectedTab] = useState("inicio");

    const onTabSelect = (tab) => {
        setSelectedTab(tab);
    };

    const renderContent = () => {
        switch (selectedTab) {
            case "inicio":
                return <Inicio />;
            case "contacto":
                return <Contacto />;
            case "login":
                return <Login
                    onSwitchToRegister={() => onTabSelect("registro")}
                    onSwitchToRecover={() => onTabSelect("recover")}
                />;
            case "registro":
                return <Registro onSwitchToLogin={() => onTabSelect("login")} />;
            case "recover":
                return <RecoverPass onSwitchToLogin={() => onTabSelect("login")} />;
            default:
                return <div>DEFAULT</div>;
        }
    };

    return (
        <div className="au-container">
            <MenuInicio onTabSelect={onTabSelect} />
            <div className={`au-content ${selectedTab === "inicio" ? "inicio-background" : ""}`}>
                {renderContent()}
            </div>
        </div>
    );
}

export default Auth;
