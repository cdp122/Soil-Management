import InputNumber from "../../form/input-number";
import InputSelect from "../../form/input-select";
import InputText from "../../form/input-text";
import styles from './df1.module.css'

const DataForm1Parcela = ({model, modelProperties, opcionesSelect, changeHandler}) =>{

    const containerStyle = styles['container'];
    return (
        <div className={containerStyle}>
            <div>
                <InputText name={modelProperties[0]} value={model[modelProperties[0]]} label="Nombre:" placeholder="Ingrese el nombre"  changeHandler={changeHandler}/>
                <InputSelect name={modelProperties[1]} value={model[modelProperties[1]]} label="Tipo de suelo:" options={opcionesSelect} changeHandler={changeHandler}/>
                <InputNumber name={modelProperties[2]} value={model[modelProperties[2]]} label="Latidud:" placeholder="Ingrese el valor"  changeHandler={changeHandler}/>
                <InputNumber name={modelProperties[3]} value={model[modelProperties[3]]} label="Longitud:" placeholder="Ingrese el valor"  changeHandler={changeHandler}/>
                <InputNumber name={modelProperties[4]} value={model[modelProperties[4]]} label="Área en metros:" placeholder="Ingrese el valor" changeHandler={changeHandler}/>
            </div>
        </div>
    );
}

export default DataForm1Parcela;