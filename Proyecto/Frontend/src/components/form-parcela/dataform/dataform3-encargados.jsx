import InputSelect from "../../form/input-select";
import InputText from "../../form/input-text";
import styles from './df3.module.css';

const DataForm3Parcela = ({model, modelProperties, opcionesRol, changeHandler}) => {
  
  const containerStyle = styles['container'];
  const subcontainer1Style = styles['subcontainer1'];
  const subcontainer2Style = styles['subcontainer2'];
  const textareaStyle = styles['textarea'];

  return (
    <div className={containerStyle}>
      <div className={subcontainer1Style}>
        <InputText
          name={modelProperties[10]}
          value={model[modelProperties[10]]}
          label="Encargado:"
          placeholder="Búsqueda"
          changeHandler={changeHandler}
        />
        <textarea
          name="detallesEncargado"
          className={textareaStyle}
          placeholder="Detalles del encargado"
          onChange={changeHandler}
        />
        <InputSelect
          name="rol"
          label="Rol:"
          options={opcionesRol}
          changeHandler={changeHandler}
        />
      </div>
      <div className={subcontainer2Style}>
        <span>Detalles de la parcela:</span>
        <textarea
          name={modelProperties[11]}
          value={model[modelProperties[11]]}
          className={textareaStyle}
          placeholder="Detalles de la parcela"
          onChange={changeHandler}
        ></textarea>
      </div>
    </div>
  );
};

export default DataForm3Parcela;
