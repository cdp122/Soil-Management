import PropTypes from 'prop-types'; // Importa PropTypes
import SuelosCRUD from "./SuelosCRUD";
import Menu from "./Menu";
import Login from "./Login";

function Tab({ selectedTab, onTabSelect }) {
    const renderContent = () => {
        switch (selectedTab) {
            case "inicio":
                return <div>INICIO</div>;
            case "suelos":
                return <SuelosCRUD />;
            case "login":
                return <Login />;
            default:
                return <div>DEFAULT</div>;
        }
    };

    return (
        <>
            <Menu onTabSelect={onTabSelect} />
            <div className="tab-content">
                {renderContent()}
            </div>
        </>
    );
}

// Agregar PropTypes para validar las propiedades
Tab.propTypes = {
    selectedTab: PropTypes.string.isRequired,  // selectedTab debe ser una cadena de texto y es obligatorio
    onTabSelect: PropTypes.func.isRequired     // onTabSelect debe ser una función y es obligatorio
};

export default Tab;
