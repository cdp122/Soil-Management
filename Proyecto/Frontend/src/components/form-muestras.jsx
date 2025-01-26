import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import styles from "./parcela.module.css";
import { useForm} from "react-hook-form";
import "./indicator.css"
import { isFormValid } from "../utils/isFormValid";


const FormMuestras = () => {

    const [currentStep, setCurrentStep] = useState(0);
    const [parcelaModel, setParcelaModel] = useState([]);
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
        setCurrentStep(0);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape" && isActive) {
                toggleModal();
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
                        <FormBody currentStep={currentStep} register={register} errors={errors}/>
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

function FormBody({currentStep, register, errors}){
    return (
        <div className={`${styles["form-body"]}`}>
            {currentStep === 0 && <VariablesGenerales/>}
            {currentStep === 1 && <VariablesQuimicas/>}
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

function VariablesGenerales() {
    return (
        <div>
            
        </div>
    );
}

function VariablesQuimicas() {
    return (
        <div>
            
        </div>
    )
}

export default FormMuestras;
