import { useState } from "react";
import { elementosQuimicos } from "../../utils/others";

function DropdownElementos(){
    const [selectedValue, setSelectedValue] = useState('Elementos químicos');
    const [active, setActive] = useState(false);


    const cambiarValor = (e) =>{
        const elemento = e.target;
        elemento.classList.add("is-active");
        setSelectedValue(elemento.textContent);
    }
    
    const toogle = () =>{
        setActive(!active)
    }

    return (
        <div className={`dropdown ${active? "is-active":""}`} onClick={toogle}>
            <div className="dropdown-trigger">
                <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                    <span>{selectedValue}</span>
                    <span className="icon is-small">
                        <i className="fas fa-angle-down" aria-hidden="true"></i>
                    </span>
                </button>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
                <div className="dropdown-content">
                    {
                        Array.from(elementosQuimicos.entries()).map(([simbolo, elemento]) => 
                            <a onClick={cambiarValor} key={simbolo} className="dropdown-item">{elemento}</a>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default DropdownElementos;