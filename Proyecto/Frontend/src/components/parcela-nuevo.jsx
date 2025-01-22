import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import styles from "./parcela.module.css";


const VariablesQuimicasModel = {
    carbono: '',
    nitrogeno: '',
    cn: '',
    fosforo: '',
    potasio: '',
    calcio: '',
    magnesio: '',
    sodio: '',
    azufre: '',
    hierro: '',
    boro: '',
    zinc: '',
    cobalto: '',
    niquel: '',
    manganeso: '',
    cobre: '',
    molibdeno: '',
    aluminio: '',
    cadmio: ''
};

const ParcelaModel = {
    nombre: '', //0
    tipoSueloID: '', //1 
    latitud: '', //2
    longitud: '', //3
    area: '', //4
    nivelpH: '', //5
    conductividadElectrica: '', //6
    salinidad: '', //7
    intercambioCationico: '', //8
    materiaOrganica: '', //9
    userID: '', //10
    userRolID: '', //11
    descripcion: '', //12
    variablesQuimicas: VariablesQuimicasModel //13
};


const parcelaNames = Object.keys(ParcelaModel);
const variableNames = Object.keys(VariablesQuimicasModel);

const FormParcela = () => {

    const [currentStep, setCurrentStep] = useState(0);
    const [parcelaModel, setParcelaModel] = useState(ParcelaModel);

    const handleChangeParcela = (e) => {
        const { name, value } = e.target;
        let valorNuevo = value === "" ? "" : isNaN(value) ? value : parseFloat(value);

        setParcelaModel((prevState) => ({
            ...prevState,
            [name]: valorNuevo
        }));
    };

      const handleChangeVariablesQuimicas = (e) =>{
        const {name , value}  = e.target;
        let valorNuevo = value === "" ? "" : isNaN(value) ? value : parseFloat(value);

        setParcelaModel((prevState) => ({
            ...prevState,
            variablesQuimicas: {
                ...prevState.variablesQuimicas,
                [name]: valorNuevo
            }
        }));
      };
      
    
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
    


    const [isActive, setIsActive] = useState(false);

    const toggleModal = () => {
        setIsActive(!isActive);
        setParcelaModel(ParcelaModel);
        setCurrentStep(0);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape" && isActive) {
                toggleModal();
                setParcelaModel(ParcelaModel);
                setCurrentStep(0);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }),[isActive];

    return (
        <div>
            <button className="button is-primary" onClick={toggleModal}>
                Abrir Modal
            </button>

            <div className={`${styles['parcela-form']} modal ${isActive ? "is-active" : ""}`}>
                <div className={styles['form-container']}>
                   <FormHeader handleModal={toggleModal}/>
                   <FormBody currentStep={currentStep} model={parcelaModel} namesVariables={variableNames} handleModelParcela={handleChangeParcela} handleVariablesQ={handleChangeVariablesQuimicas}/>
                   <FormFooter currentStep={currentStep} handleBack={handleBack} handleNext={handleNext} handleSubmit={handleSubmit} handleModal={toggleModal}/>
                </div>
            </div>
        </div>
    );
};

function FormHeader({handleModal}) {
    return (
        <div className={`${styles['form-header']} `}>
            <div>
                <span className="subtitle is-4 is-block has-text-centered">Agregar nueva parcela</span>
                <button className={`${styles['btn-close']} has-background-danger`} aria-label="close" onClick={handleModal}></button>
            </div>
            <div>
                Indicador
            </div>
        </div>
    );
}

function FormBody({model, currentStep, namesVariables, handleModelParcela, handleVariablesQ}){
    return (
        <div className={`${styles["form-body"]}`}>
            {currentStep === 0 && <DatosGenerales parcelaNames={parcelaNames} model={model} handlerChangeParcela={handleModelParcela}/>}
            {currentStep === 1 && <VariablesQuimicas model={model} names={namesVariables} handleVariablesQ={handleVariablesQ} />}
            {currentStep === 2 && <DatosFinales model={model} parcelaNames={parcelaNames} handlerChangeParcela={handleModelParcela} />}
        </div>
    );
}

function FormFooter({currentStep, handleBack, handleNext, handleSubmit, handleModal}){
    return (
        <div className={`${styles['form-footer']} is-fullwidth is-flex is-justify-content-end mb-2 mt-5`}>
            {currentStep > 0 && <button className="button" onClick={handleBack}>Atrás</button>}
          {currentStep < 2 ? (
            <button className="button is-link" onClick={handleNext}>Siguiente</button>
          ) : (
            <button className="button is-primary" onClick={handleSubmit}>Guardar</button>
          )}
          <button className="button" onClick={handleModal}>Cancelar</button>
        </div>
    );
}

function DatosGenerales({model, parcelaNames, handlerChangeParcela}) {
    const stylesInput = "input";
    console.log(model);

    return (
        <div>
            <div className="fixed-grid">
                <div className="grid">
                    <div className="cell">
                        <div className="field">
                            <label className="label mb-1">Nombre</label>
                            <div className="control">
                                <input
                                    value={model[parcelaNames[0]]}
                                    onChange={handlerChangeParcela}
                                    name={parcelaNames[0]}
                                    className={stylesInput}
                                    type="text"
                                    placeholder="Nombre de parcela"
                                ></input>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label mb-1">Tipo de suelo</label>
                            <div className="control">
                                <div className="select">
                                    <select
                                        name={parcelaNames[1]} onChange={handlerChangeParcela}
                                        value={model[parcelaNames[1]]}
                                    >   <option value="" hidden>Seleccione tipo de suelo</option>
                                        <option value="1">Arcilloso ...</option>
                                        <option value="2">Arenoso ...</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label mb-1">Latitud</label>
                            <div className="control">
                                <input
                                    value={model[parcelaNames[2]]}
                                    onChange={handlerChangeParcela}
                                    name={parcelaNames[2]}
                                    className={stylesInput}
                                    type="number"
                                    step="1"
                                    min="-90"
                                    max="90"
                                    placeholder="Ingrese el valor"
                                ></input>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label mb-1">Longitud</label>
                            <div className="control">
                                <input
                                    value={model[parcelaNames[3]]}
                                    onChange={handlerChangeParcela}
                                    name={parcelaNames[3]}
                                    className={stylesInput}
                                    type="number"
                                    step="1"
                                    min="-180"
                                    max="180"
                                    placeholder="Ingrese el valor"
                                ></input>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label mb-0">
                                Área (m<sup>2</sup>)
                            </label>
                            <div className="control">
                                <input
                                    value={model[parcelaNames[4]]}
                                    onChange={handlerChangeParcela}
                                    name={parcelaNames[4]}
                                    className={stylesInput}
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    placeholder="Ingrese el valor"
                                ></input>
                            </div>
                        </div>
                    </div>
                    <div className="cell">
                        <div className="field">
                            <label className="label mb-1">pH</label>
                            <div className="control">
                                <input
                                    value={model[parcelaNames[5]]}
                                    onChange={handlerChangeParcela}
                                    name={parcelaNames[5]}
                                    className={stylesInput}
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    placeholder="Ingrese el valor"
                                ></input>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label mb-1">
                                Conductividad eléctrica (CE)
                            </label>
                            <div className="control">
                                <input
                                    value={model[parcelaNames[6]]}
                                    onChange={handlerChangeParcela}
                                    name={parcelaNames[6]}
                                    className={stylesInput}
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    placeholder="Ingrese el valor"
                                ></input>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label mb-1">Salinidad</label>
                            <div className="control">
                                <input
                                    value={model[parcelaNames[7]]}
                                    onChange={handlerChangeParcela}
                                    name={parcelaNames[7]}
                                    className={stylesInput}
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    placeholder="Ingrese el valor"
                                ></input>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label mb-1">
                                Intercambio catiónico (CICe)
                            </label>
                            <div className="control">
                                <input
                                    value={model[parcelaNames[8]]}
                                    onChange={handlerChangeParcela}
                                    name={parcelaNames[8]}
                                    className={stylesInput}
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    placeholder="Ingrese el valor"
                                ></input>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label mb-1">
                                Materia orgánica (MO)
                            </label>
                            <div className="control">
                                <input
                                    value={model[parcelaNames[9]]}
                                    onChange={handlerChangeParcela}
                                    name={parcelaNames[9]}
                                    className={stylesInput}
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    placeholder="Ingrese el valor"
                                ></input>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function VariablesQuimicas({names, model, handleVariablesQ}){
    const inputcell = styles['input-variable'];
    const classInput = "label is-normal";
    console.log(model)

    return (
        <div className="grid is-col-min-10">
            <div className={`${inputcell} cell`}>
                <label className={classInput}>Carbono (C)</label>
                <input
                    onChange={handleVariablesQ}
                    className="input"
                    placeholder="valor"
                    type="number"
                    step="0.1"
                    min="0"
                    name={names[0]}
                    value={model.variablesQuimicas[names[0]]}
                ></input>
            </div>
            <div className={`${inputcell} cell`}>
                <label className={classInput}>Nitrógeno (N)</label>
                <input
                    placeholder="valor"
                    type="number"
                    step="0.1"
                    min="0"
                    onChange={handleVariablesQ}
                    className="input"
                    name={names[1]}
                    value={model.variablesQuimicas[names[1]]}
                ></input>
            </div>
            <div className={`${inputcell} cell`}>
                <label className={classInput}>C:N</label>
                <input
                    placeholder="valor"
                    type="number"
                    step="0.1"
                    min="0"
                    onChange={handleVariablesQ}
                    className="input"
                    name={names[2]}
                    value={model.variablesQuimicas[names[2]]}
                ></input>
            </div>
            <div className={`${inputcell} cell`}>
                <label className={classInput}>Fósforo (P)</label>
                <input
                    placeholder="valor"
                    type="number"
                    step="0.1"
                    min="0"
                    onChange={handleVariablesQ}
                    className="input"
                    name={names[3]}
                    value={model.variablesQuimicas[names[3]]}
                ></input>
            </div>
            <div className={`${inputcell} cell`}>
                <label className={classInput}>Potasio (K)</label>
                <input
                    placeholder="valor"
                    type="number"
                    step="0.1"
                    min="0"
                    onChange={handleVariablesQ}
                    className="input"
                    name={names[4]}
                    value={model.variablesQuimicas[names[4]]}
                ></input>
            </div>
            <div className={`${inputcell} cell`}>
                <label className={classInput}>Calcio (Ca)</label>
                <input
                    placeholder="valor"
                    type="number"
                    step="0.1"
                    min="0"
                    onChange={handleVariablesQ}
                    className="input"
                    name={names[5]}
                    value={model.variablesQuimicas[names[5]]}
                ></input>
            </div>
            <div className={`${inputcell} cell`}>
                <label className={classInput}>Magnesio (Mg)</label>
                <input
                    placeholder="valor"
                    type="number"
                    step="0.1"
                    min="0"
                    onChange={handleVariablesQ}
                    className="input"
                    name={names[6]}
                    value={model.variablesQuimicas[names[6]]}
                ></input>
            </div>
            <div className={`${inputcell} cell`}>
                <label className={classInput}>Sodio (Na)</label>
                <input
                    placeholder="valor"
                    type="number"
                    step="0.1"
                    min="0"
                    onChange={handleVariablesQ}
                    className="input"
                    name={names[7]}
                    value={model.variablesQuimicas[names[7]]}
                ></input>
            </div>
            <div className={`${inputcell} cell`}>
                <label className={classInput}>Azufre (S)</label>
                <input
                    placeholder="valor"
                    type="number"
                    step="0.1"
                    min="0"
                    onChange={handleVariablesQ}
                    className="input"
                    name={names[8]}
                    value={model.variablesQuimicas[names[8]]}
                ></input>
            </div>
            <div className={`${inputcell} cell`}>
                <label className={classInput}>Hierro (Fe)</label>
                <input
                    placeholder="valor"
                    type="number"
                    step="0.1"
                    min="0"
                    onChange={handleVariablesQ}
                    className="input"
                    name={names[9]}
                    value={model.variablesQuimicas[names[9]]}
                ></input>
            </div>
            <div className={`${inputcell} cell`}>
                <label className={classInput}>Boro (B)</label>
                <input
                    placeholder="valor"
                    type="number"
                    step="0.1"
                    min="0"
                    onChange={handleVariablesQ}
                    className="input"
                    name={names[10]}
                    value={model.variablesQuimicas[names[10]]}
                ></input>
            </div>
            <div className={`${inputcell} cell`}>
                <label className={classInput}>Zinc (Zn)</label>
                <input
                    placeholder="valor"
                    type="number"
                    step="0.1"
                    min="0"
                    onChange={handleVariablesQ}
                    className="input"
                    name={names[11]}
                    value={model.variablesQuimicas[names[11]]}
                ></input>
            </div>
            <div className={`${inputcell} cell`}>
                <label className={classInput}>Cobalto (Co)</label>
                <input
                    placeholder="valor"
                    type="number"
                    step="0.1"
                    min="0"
                    onChange={handleVariablesQ}
                    className="input"
                    name={names[12]}
                    value={model.variablesQuimicas[names[12]]}
                ></input>
            </div>
            <div className={`${inputcell} cell`}>
                <label className={classInput}>Niquel (Ni)</label>
                <input
                    placeholder="valor"
                    type="number"
                    step="0.1"
                    min="0"
                    onChange={handleVariablesQ}
                    className="input"
                    name={names[13]}
                    value={model.variablesQuimicas[names[13]]}
                ></input>
            </div>
            <div className={`${inputcell} cell`}>
                <label className={classInput}>Manganeso (Mn)</label>
                <input
                    placeholder="valor"
                    type="number"
                    step="0.1"
                    min="0"
                    onChange={handleVariablesQ}
                    className="input"
                    name={names[14]}
                    value={model.variablesQuimicas[names[14]]}
                ></input>
            </div>
            <div className={`${inputcell} cell`}>
                <label className={classInput}>Cobre (Cu)</label>
                <input
                    placeholder="valor"
                    type="number"
                    step="0.1"
                    min="0"
                    onChange={handleVariablesQ}
                    className="input"
                    name={names[15]}
                    value={model.variablesQuimicas[names[15]]}
                ></input>
            </div>
            <div className={`${inputcell} cell`}>
                <label className={classInput}>Molibdeno (Mo)</label>
                <input
                    placeholder="valor"
                    type="number"
                    step="0.1"
                    min="0"
                    onChange={handleVariablesQ}
                    className="input"
                    name={names[16]}
                    value={model.variablesQuimicas[names[16]]}
                ></input>
            </div>
            <div className={`${inputcell} cell`}>
                <label className={classInput}>Aluminio (Al)</label>
                <input
                    placeholder="valor"
                    type="number"
                    step="0.1"
                    min="0"
                    onChange={handleVariablesQ}
                    className="input"
                    name={names[17]}
                    value={model.variablesQuimicas[names[17]]}
                ></input>
            </div>
            <div className={`${inputcell} cell`}>
                <label className={classInput}>Cadmio (Cd)</label>
                <input
                    placeholder="valor"
                    type="number"
                    step="0.1"
                    min="0"
                    onChange={handleVariablesQ}
                    className="input"
                    name={names[18]}
                    value={model.variablesQuimicas[names[18]]}
                ></input>
            </div>
        </div>
    )
}

function DatosFinales({model, parcelaNames, handlerChangeParcela}) {
    const encargados = new Map([
        ['id1', 'Alexander'],
        ['id3','Paul'],
        ['id4','Stiven'],
        ['id5','Mario'],
        ['id6','Carlos']
    ]);
    
    const [encargadosFiltrado, setEncargadosFiltrado] = useState(Array.from(encargados.entries()));

    const filtroEncargados = (e) => {
        const { value } = e.target;
        if (value === "" || !isNaN(value)) {
            setEncargadosFiltrado(Array.from(encargados.entries()));
            return;
        }

        const filtrados = Array.from(encargados.entries()).filter(([id, nombre]) =>
            nombre.toLowerCase().includes(value.toLowerCase())
        );

        setEncargadosFiltrado(filtrados);
    };

    const handlerEncargado = (e) =>{
        const listaItems = document.querySelectorAll('li');
        const id = e.target.getAttribute('data-id');
        const name = parcelaNames[10];
        
        listaItems.forEach((item) => {
            item.classList.remove('has-background-primary');
        })

        const event = {
            target:{
                name: name,
                value: id
            }
        }
        e.target.classList.add('has-background-primary');

        handlerChangeParcela(event);
    };

    console.log(model);

    return (
        <div className={`${styles["datos-finales"]}`}>
            <div className={`${styles['datos']}`}>
                <div className="field has-addons">
                    <div className="is-flex is-align-items-center pr-3">
                        <label className="label">Encargado</label>
                    </div>
                    <div className="control">
                        <input
                            className="input"
                            type="text"
                            placeholder="Nombre"
                            onChange={filtroEncargados}
                        ></input>
                    </div>
                    <div className="control">
                        <button className="button is-info">Buscar</button>
                    </div>
                </div>
                <div className={`${styles['encargados-container']}`}>
                    <ul>
                        {encargadosFiltrado.map(([id, nombre]) => (
                            <li
                                key={id}
                                data-id={id}
                                className={`${styles['encargados-li']} has-text-weight-medium ${model[parcelaNames[10]] == id?'has-background-primary':''}`}
                                onClick={handlerEncargado}
                            >
                                {nombre}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="field has-addons mt-3">
                    <div className="is-flex is-align-items-center pr-3">
                        <label className="label">Rol</label>
                    </div>
                    <div className="select">
                        <select name={parcelaNames[11]} value={model[parcelaNames[11]]} onChange={handlerChangeParcela}>
                            <option value="" hidden>Seleccione el rol</option>
                            <option value="rol1">Rol 1</option>
                            <option value="rol2">Rol 2</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className={`${styles["detalles"]}`}>
                <div>
                    <label className="label pt-2">Descripción / Detalles adicionales</label>
                    <div className="control">
                        <textarea
                            name={parcelaNames[12]}
                            value={model[parcelaNames[12]]}
                            className="textarea"
                            placeholder="Detalles"
                            onChange={handlerChangeParcela}
                        ></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
}


FormHeader.propTypes = {
    handleModal: PropTypes.func.isRequired
}
FormBody.propTypes = {
    model: PropTypes.object,
    currentStep: PropTypes.number,
    namesVariables: PropTypes.array,
    handleModelParcela: PropTypes.func.isRequired,
    handleVariablesQ: PropTypes.func.isRequired
}
FormFooter.propTypes = {
    currentStep: PropTypes.number,
    handleBack: PropTypes.func.isRequired,
    handleNext: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleModal: PropTypes.func.isRequired
}

DatosGenerales.propTypes = {
    model: PropTypes.object,
    parcelaNames: PropTypes.array,
    handlerChangeParcela: PropTypes.func.isRequired
}
VariablesQuimicas.propTypes = {
    names: PropTypes.array,
    model: PropTypes.object,
    handleVariablesQ: PropTypes.func.isRequired
}
DatosFinales.propTypes = {
    model: PropTypes.object,
    parcelaNames: PropTypes.array,
    handlerChangeParcela: PropTypes.func.isRequired
}

export default FormParcela;
