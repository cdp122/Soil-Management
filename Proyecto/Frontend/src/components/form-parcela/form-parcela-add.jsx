import { useState } from "react";
import FormParcelaHeader from "./header/form-parcela-header";
import styles from './form-parcela-add.module.css';
import DataForm1Parcela from "./dataform/dataform1-datos-generales";
import DataForm2Parcela from "./dataform/dataform2-variables";
import DataForm3Parcela from "./dataform/dataform3-encargados";

const opcionesSelect = ['Tipo1', 'Tipo2', 'Tipo3'];
const opcionesRol = ['Ro1', 'Rol2']


const ParcelaModel = {
  nombre: '',
  tipoSueloID: 0,
  latitud: 0,
  longitud: 0,
  area: 0,
  nivelpH: 0,
  conductividadElectrica: 0,
  salinidad: 0,
  materiaOrganica: 0,
  intercambioCationico: 0,
  userID: 0,
  descripcion: '',
};

const modelProperties = Object.keys(ParcelaModel);

const FormParcela = () => {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParcelaModel((prevModel) => ({
      ...prevModel,
      [name]: value === '' ? '' : isNaN(value) ? value : parseFloat(value),
    }));
  };
  
  const [currentStep, setCurrentStep] = useState(0);
  const [parcelaModel, setParcelaModel] = useState(ParcelaModel);

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Aqui se envia los datos...");
  };

  const parcelaContainerStyle = styles['parcela-container'];
  const formBodyStyle = styles['form-body'];
  const formFooterStyle = styles['form-footer'];
  const buttonContainerStyle = styles['button-container'];

  return (
    <div className={parcelaContainerStyle}>
      <FormParcelaHeader />
      <div className={formBodyStyle}>
        {currentStep === 0 && (
          <DataForm1Parcela
              model={parcelaModel}
              modelProperties={modelProperties}
              opcionesSelect={opcionesSelect}
              changeHandler={handleChange}
          />
        )}
        {currentStep === 1 && (
            <DataForm2Parcela
              model={parcelaModel}
              modelProperties={modelProperties}
              changeHandler={handleChange}
            />
        )}
        {currentStep === 2 && (
            <DataForm3Parcela
              model={parcelaModel}
              modelProperties={modelProperties}
              opcionesRol={opcionesRol}
              changeHandler={handleChange}
            />
        )}
    
      </div>
      <div className={formFooterStyle}>
        <div className={buttonContainerStyle}>
          {currentStep > 0 && <button onClick={handleBack}>Atrás</button>}
          {currentStep < 2 ? (
            <button onClick={handleNext}>Siguiente</button>
          ) : (
            <button onClick={handleSubmit}>Registrar</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormParcela;
