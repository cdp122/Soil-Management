import SuelosCRUD from "./SuelosCRUD"
import Menu from "./Menu"

function Tab({ selectedTab, onTabSelect }) {
    const renderContent = () => {
        switch (selectedTab) {
            case "inicio":
                return <div>INICIO</div>
            case "suelos":
                return <SuelosCRUD />
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