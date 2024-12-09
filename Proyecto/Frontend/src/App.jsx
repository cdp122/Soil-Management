import { useState } from "react"
import Registro from "./Registro"
import Tab from "./Tab"
import './styles/App.css'

function App() {
  const [selectedTab, setSelectedTab] = useState("inicio")

  const handleTabSelection = (tab) => {
    setSelectedTab(tab)
  }

  return (
    <>
      <div className='main-container'>
      <Registro />
        {/* <Tab selectedTab={selectedTab} onTabSelect={handleTabSelection} /> */}
      </div>
    </>
  )
}

export default App
