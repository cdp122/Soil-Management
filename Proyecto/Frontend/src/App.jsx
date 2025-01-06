import { useState } from "react"
import Tab from "./Tab"
import './styles/App.css'
import SuelosCRUD from "./SuelosCRUD"

function App() {
  const [selectedTab, setSelectedTab] = useState("inicio")

  const handleTabSelection = (tab) => {
    setSelectedTab(tab)
  }

  return (
    <>
      <div className='main-container'>
      <Tab selectedTab={selectedTab} onTabSelect={handleTabSelection} />
      </div>
    </>
  )
}

export default App
