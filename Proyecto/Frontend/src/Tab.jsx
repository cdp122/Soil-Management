import SuelosCRUD from "./SuelosCRUD"
import Registro from "./Registro"
import Login from "./Login"
import Menu from "./Menu"

function Tab({ selectedTab, onTabSelect }) {
    const renderContent = () => {
        switch (selectedTab) {
            case "inicio":
                return <div>INICIO</div>
            case "suelos":
                return <SuelosCRUD />
            case "registro":
                return <Registro />
            case "login":
                return <Login />
            default:
                return <div>DEFAULT</div>
        }
    }

    return (
        <div className="tab-container">
            <Menu onTabSelect={onTabSelect} />
            <div className="tab-content">
                {renderContent()}
            </div>
        </div> 
    )
}

export default Tab