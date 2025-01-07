import SuelosCRUD from "./SuelosCRUD"
import Registro from "./Registro"
import Login from "./Login"
import Menu from "./Menu"
import Perfil from "./Perfil"

function Tab({ selectedTab, onTabSelect }) {
    const renderContent = () => {
        switch (selectedTab) {
            case "inicio":
                return <div>INICIO</div>
            case "suelos":
                return <SuelosCRUD />
            case "registro":
                return <Registro />
            case "Perfil":
                return <Perfil />
            case "login":
                return <Login />
            default:
                return <div>DEFAULT</div>
        }
    }

    return (
        <>
            <Menu onTabSelect={onTabSelect} />
            <div className="tab-content">
                {renderContent()}
            </div>
        </>
    )
}

export default Tab