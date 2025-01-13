import InputNumber from "../../form/input-number";
import styles from './df2.module.css';

const DataForm2Parcela = ({model, modelProperties, changeHandler}) => {
  console.log(model)
  
  const containerStyle = styles['container'];
  const subcontainer1Style = styles['subcontainer1'];
  const subcontainer2Style = styles['subcontainer2'];

  return (
    <div className={containerStyle}>
      <div className={subcontainer1Style}>
        <div>
          <InputNumber
            name={modelProperties[5]}
            value={model[modelProperties[5]]}
            label="Nivel de pH*:"
            placeholder="Ingrese el valor"
            changeHandler={changeHandler}
          />
          <InputNumber
            name={modelProperties[6]}
            value={model[modelProperties[6]]}
            label="Conductividad eléctrica:"
            placeholder="Ingrese el valor"
            changeHandler={changeHandler}
          />
          <InputNumber
            name={modelProperties[7]}
            value={model[modelProperties[7]]}
            label="Salinidad"
            changeHandler={changeHandler}
          />
        </div>
        <div>
          <InputNumber
            name={modelProperties[8]}
            value={model[modelProperties[8]]}
            label="Materia orgánica:"
            placeholder="Ingrese el valor"
            changeHandler={changeHandler}
          />
          <InputNumber
            name={modelProperties[9]}
            value={model[modelProperties[9]]}
            label="Intercambio catiónico:"
            placeholder="Ingrese el valor"
            changeHandler={changeHandler}
          />
        </div>
      </div>
      <div className={subcontainer2Style}>
        {/* Aquí puedes agregar más campos si es necesario */}
      </div>
    </div>
  );
};

export default DataForm2Parcela;
