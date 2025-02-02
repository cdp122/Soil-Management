import SuelosCRUD from "./SuelosCRUD";
import Inicio from "./Inicio";
import Contacto from "./Contacto";
import Perfil from "./Perfil";
import Menu from "./Menu";

function Tab({ selectedTab, onTabSelect }) {
    const renderContent = () => {
        switch (selectedTab) {
            case "inicio":
                return <Inicio />;
            case "contacto":
                return <Contacto />;
            case "suelos":
                return <SuelosCRUD />;
            case "perfil":
                return <Perfil />;
            default:
                return <div>DEFAULT</div>;
        }
    };

    return (
        <div className="tab-container">
            <Menu onTabSelect={onTabSelect} />
            <div className="tab-content">
                {renderContent()}
            </div>
        </div>
    );
}

export default Tab;