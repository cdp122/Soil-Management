import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import styles from "./parcela.module.css";
import { useForm} from "react-hook-form";
import "./indicator.css"
import { isFormValid } from "../utils/isFormValid";

const tiposSuelo = new Map([
    ['id1', 'Suelo 1'],
    ['id2', 'Suelo 2'],
    ['id3', 'Suelo 3']
]);


const MuestraParcela = {
    ph: '',
    conductividadElectrica: '',
    salinidad: '',
    intercambioCationico: '',
    materiaOrganica: '',
    fecha_registro:''
}

const ParcelaModel = {
    nombre: '', //0
    tipoId: '', //1
    coordenadaLatitud:'', //2
    coordenadaLongitud: '', //3
    area: '', //4
    descripcion: '', //5
    muestraParcela: MuestraParcela, //6
    userId: '',
    consId: '', 
};

const parcelaNames = Object.keys(ParcelaModel);
const muestraNames  = Object.keys(MuestraParcela)

const FormMuestras = ({idZona, idUser}) => {
    ParcelaModel.userId = idUser;
    ParcelaModel.consId = idZona;

    const [currentStep, setCurrentStep] = useState(0);
    const [parcelaModel, setParcelaModel] = useState(ParcelaModel);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const handleChangeParcela = (e) => {
        const { name, value } = e.target;
        let valorNuevo = value === "" ? "" : isNaN(value) ? value : parseFloat(value);

        setParcelaModel((prevState) => ({
            ...prevState,
            [name]: valorNuevo
        }));
    };

    const handleMuestra = (e) =>{
        const {name , value}  = e.target;
        let valorNuevo = value === "" ? "" : isNaN(value) ? value : parseFloat(value);

        setParcelaModel((prevState) => ({
            ...prevState,
            muestraParcela: {
                ...prevState.muestraParcela,
                [name]: valorNuevo
            }
        }));
    };
    

    const handleNext = () => {
        if (currentStep < 1 && isFormValid(errors)) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
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
                Agregar muestra
            </button>

            <div className={`${styles['parcela-form']} modal ${isActive ? "is-active" : ""}`}>
                <div className={styles['form-container']}>
                    <form onSubmit={handleSubmit((data) => console.log(data))}>
                        <FormHeader handleModal={toggleModal} currentStep={currentStep}/>
                        <FormBody currentStep={currentStep} model={parcelaModel} handleParcela={handleChangeParcela} handleMuestra={handleMuestra} register={register} errors={errors}/>
                        <FormFooter currentStep={currentStep} handleBack={handleBack} handleNext={handleNext} handleSubmit={handleSubmit} handleModal={toggleModal}/>
                    </form>
                </div>
            </div>
        </div>
    );
};

function FormHeader({handleModal, currentStep}) {
    return (
        <div className={`${styles['form-header']} `}>
            <div>
                <span className="subtitle is-4 is-block has-text-centered has-text-weight-semibold mb-2 mt-2">Agregar muestras</span>
                <button className={`${styles['btn-close']} has-background-danger`} aria-label="close" onClick={handleModal}><i className="fa-solid fa-x"></i></button>
            </div>
            <div>
                <StepIndicator currentStep={currentStep}/>
            </div>
        </div>
    );
}

function StepIndicator({currentStep}){
    return (
        <div className="indicator">
            <div className="indicator-points">
                <div className={`bar ${currentStep > 0? 'current-step-bar':''}`}></div>
                <div className={`step1 ${currentStep == 0?'current-step':'step-complete'}`}><span>1</span></div>
                <div className={`step2 ${currentStep > 0?'current-step':''}`}><span>2</span></div>
            </div>
            <div className="indicator-titles">
                <span>Datos generales</span>
                <span>Muestras</span>
            </div>
        </div>
    )
}

function FormBody({model, currentStep, handleParcela, handleMuestra, register, errors}){
    return (
        <div className={`${styles["form-body"]}`}>
            {currentStep === 0 && <DatosGenerales model={model} handleParcela={handleParcela} register={register} errors={errors}/>}
            {currentStep === 1 && <DatosFinales model={model} handleMuestra={handleMuestra}/>}
        </div>
    );
}

function FormFooter({currentStep, handleBack, handleNext, handleSubmit, handleModal}){
    return (
        <div className={`${styles['form-footer']} is-fullwidth is-flex is-justify-content-end mb-2 mt-5`}>
            {currentStep > 0 ?
                <>
                    <button className="button" onClick={handleBack}>Atrás</button>
                    <button className="button is-primary" onClick={handleSubmit}>Guardar</button>
                </>
            :
                <button className="button is-link" onClick={handleNext}>Siguiente</button>
            }
            <button className="button" onClick={handleModal}>Cancelar</button>
        </div>
    );
}

function DatosGenerales({model, register, errors}) {
    return (
        <div>
            <div className="fixed-grid">
                <div className="grid is-gap-3">
                    <div className="cell">
                        <div className="fixed-grid">
                            <div className="grid">
                                <div className="cell is-col-span-2">
                                    <label className="label mb-1">Nombre de parcela</label>
                                    <input type="text" className="input" placeholder="Ej. nombre" maxLength="50" name={parcelaNames[0]}
                                    {...register(parcelaNames[0], {
                                        required:{
                                            value: true,
                                            message: 'El nombre de parcela es requerido'
                                        }
                                    })}
                                    />
                                    {
                                        // errors.nombre? <span>{errors.nombre.message}</span>
                                    }
                                </div>
                                <div className="cell is-col-span-2">
                                    <label className="label mb-1">Tipo de suelo</label>
                                    <div className="control has-icons-left">
                                        <div className="select">
                                            <select name={parcelaNames[1]}
                                            {...register("tipoSuelo")}
                                            >
                                                <option selected hidden>Seleccione una opción...</option>
                                            {[...tiposSuelo].map(([idSuelo, nombreSuelo]) => (
                                                <option key={idSuelo} value={idSuelo}>{nombreSuelo}</option>
                                            ))}
                                            </select>
                                        </div>
                                        <div className="icon is-small is-left">
                                            <i className="fa fa-leaf"></i>
                                        </div>
                                        </div>
                                </div>
                                <div className="cell">
                                    <label className="label mb-1">Latitud</label>
                                    <input type="number" className="input" min="-90"max="90" placeholder="Valor en °" name={parcelaNames[2]} value={model[parcelaNames[2]]}
                                        //{...register("latitud")}
                                    />
                                </div>
                                <div className="cell">
                                    <label className="label mb-1">Longitud</label>
                                    <input type="number" className="input" min="-180" max="180" placeholder="Valor en °" name={parcelaNames[3]} value={model[parcelaNames[3]]}/>
                                </div>
                                <div className="cell is-col-span-2">
                                    <label className="label mb-1">Área (metros cuadrados)</label>
                                    <input className="input" type="number" min="0" placeholder="Valor en m²" name={parcelaNames[4]} value={model[parcelaNames[4]]}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="cell">
                        <div className="cell">
                            <label className="label mb-1">Descripción / Detalles para la parcela</label>
                            <textarea className="textarea has-fixed-size mb-1" placeholder="..." name={parcelaNames[5]} value={model[parcelaNames[5]]}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DatosFinales({model, handleMuestra}) {
    return (
        <div>
            <div className="grid is-gap-3">
                <div className="cell">
                    <div className="cell mb-3 mb-3">
                        <label className="label mb-1">pH</label>
                        <input className="input" type="number" placeholder="Valor" name={muestraNames[0]} value={model.muestraParcela[muestraNames[0]]} onChange={handleMuestra}/>
                    </div>
                    <div className="cell mb-3">
                        <label className="label mb-1">Salinidad</label>
                        <input className="input" type="number" placeholder="Valor en psu" name={muestraNames[2]} value={model.muestraParcela[muestraNames[2]]} onChange={handleMuestra}/>
                    </div>
                    <div className="cell mb-3">
                        <label className="label mb-1">Materia orgánica (MO)</label>
                        <input className="input" type="number" placeholder="Valor en %"name={muestraNames[4]} value={model.muestraParcela[muestraNames[4]]} onChange={handleMuestra}/>
                    </div>
                </div>
                <div className="cell">
                    <div className="cell mb-3">
                        <label className="label mb-1">Conducitividad eléctrica (CE)</label>
                        <input className="input" type="number" placeholder="Valor en µS/cm" name={muestraNames[1]} value={model.muestraParcela[muestraNames[1]]} onChange={handleMuestra}/>
                    </div>
                    <div className="cell mb-3">
                        <label className="label mb-1">Intercambio catiónico(CICe)</label>
                        <input className="input" type="number" placeholder="Valor en cmol/kg" name={muestraNames[3]} value={model.muestraParcela[muestraNames[3]]} onChange={handleMuestra}/>
                    </div>
                    <div className="cell mb-3">
                        <label className="label mb-1">Fecha de registro</label>
                        <input className="input" type="date" name={muestraNames[5]} value={model.muestraParcela[muestraNames[5]]} onChange={handleMuestra}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

FormMuestras.propTypes = {
    idUser: PropTypes.number,
    idZona: PropTypes.number
}
FormHeader.propTypes = {
    handleModal: PropTypes.func.isRequired,
    currentStep: PropTypes.number
}
StepIndicator.propTypes = {
    currentStep: PropTypes.number
}
FormBody.propTypes = {
    model: PropTypes.object,
    currentStep: PropTypes.number,
    namesVariables: PropTypes.array,
    handleParcela: PropTypes.func.isRequired,
    handleMuestra: PropTypes.func.isRequired
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
    handleParcela: PropTypes.func.isRequired
}
DatosFinales.propTypes = {
    model: PropTypes.object,
    handleMuestra: PropTypes.func.isRequired
}

export default FormMuestras;
