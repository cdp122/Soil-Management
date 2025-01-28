/* eslint-disable */ // Validar despúes 
import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { useForm} from "react-hook-form";
import "./indicator.css"
import styles from "./form-muestra.module.css"
import { isFormValid } from "../utils/isFormValid";
import { elementosQuimicos, unidadesMedida } from "../utils/others";
import api from "../utils/api";

const FormMuestras = () => {

    const [currentStep, setCurrentStep] = useState(0);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({mode: "all"});
    

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const [isActive, setIsActive] = useState(false);

    const toggleModal = () => {
        setIsActive(!isActive);
        setCurrentStep(0);
        reset();
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


    const EnviarMuestra = handleSubmit((data) => {
        if(currentStep < 1){
            setCurrentStep(currentStep + 1);
            return;
        }
        
        console.log("Enviando", data);
    });
    

    return (
        <div>
            <button className="button is-primary" onClick={toggleModal}>
                Agregar muestra
            </button>

            <div className={`${styles["parcela-form"]} modal ${isActive ? "is-active" : ""}`}>
                <div className={`${styles["form-container"]}`}>
                    <form >
                        <FormHeader handleModal={toggleModal} currentStep={currentStep}/>
                        <FormBody currentStep={currentStep} register={register} errors={errors}/>
                        <FormFooter currentStep={currentStep} handleBack={handleBack} handleSubmit={EnviarMuestra} handleModal={toggleModal}/>
                    </form>
                </div>
            </div>
        </div>
    );
};

function FormHeader({handleModal, currentStep}) {
    return (
        <div className={`${styles["form-header"]}`}>
            <div>
                <span className={`subtitle is-4 is-block has-text-centered has-text-weight-semibold mb-2 mt-2 ${styles["title-header"]}`}>Agregar muestras</span>
                <button className={`${styles["btn-close"]} delete is-medium has-background-danger`} aria-label="close" onClick={handleModal}></button>
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
                <span>Parámetros generales</span>
                <span>Variables químicas</span>
            </div>
        </div>
    )
}

function FormBody({currentStep, register, errors}){
    return (
        <div className={`${styles["form-body"]}`}>
            {currentStep === 0 && <VariablesGenerales register={register} errors={errors}/>}
            {currentStep === 1 && <VariablesQuimicas/>}
        </div>
    );
}

function FormFooter({currentStep, handleBack, handleSubmit, handleModal}){
    return (
        <div className={`${styles["form-footer"]} is-fullwidth is-flex is-justify-content-end mb-2 mt-5`}>
            {currentStep > 0 ?
                <>
                    <button className={`button ${styles["btn-white"]}`} onClick={handleBack}>Atrás</button>
                    <button className="button is-link" onClick={handleSubmit}>Guardar</button>
                </>
            :
                <button className="button is-link" onClick={handleSubmit}>Siguiente</button>
            }
            <button type="button" className={`button ${styles["btn-white"]}`} onClick={handleModal}>Cancelar</button>
        </div>
    );
}

function VariablesGenerales({register, errors}) {

    return (
        <div className="fixed-grid has-2-cols">
            <div className="grid">
                <div className="cell ">
                    <label>pH</label>
                    <input type="number" className="input" 
                    {...register("mue_ph", {
                        required:{
                            value: true,
                            message: "Ingrese valor"
                        },
                        min: {
                            value: 0,
                            message: "Valor inválido"
                        },
                        max: {
                            value: 14,
                            message: "Valor inválido"
                        }
                    })}
                    />
                    {
                        errors?.mue_ph && <div className="error"><span><i className="fa-solid fa-circle-exclamation"></i> {errors?.mue_ph.message}</span></div>
                    }
                </div>
                
                <div className={`cell ${styles["label-text"]}`}>
                    <label>Conductividad eléctrica (CE)</label>
                    <div className="control">
                        <input type="number" className="input"
                        {...register("mue_con_elec", {
                            required:{
                                value: true,
                                message: "Ingrese valor"
                            }
                        })}
                        />
                    </div>
                    {
                        errors?.mue_con_elec && <div className="error"><span><i className="fa-solid fa-circle-exclamation"></i> {errors?.mue_con_elec.message}</span></div>
                    }
                </div>
                
                <div className="cell ">
                    <label>Salinidad</label>
                    <input type="number" className="input" 
                    {...register("mue_salinidad", {
                        required:{
                            value: true,
                            message: "Ingrese valor"
                        }
                    })}
                    />
                    {
                        errors?.mue_salinidad && <div className="error"><span><i className="fa-solid fa-circle-exclamation"></i> {errors?.mue_salinidad.message}</span></div>
                    }
                </div>
                
                <div className={`cell ${styles["label-text"]}`}>
                    <label>Capacidad de intercambio catiónico efectiva (CICe)</label>
                    <div className="control">
                        <input type="number" className="input"
                        {...register("mue_cap_inter_cati",{
                            required:{
                                value: true,
                                message: "Ingrese valor"
                            }
                        })}
                        />
                        {
                            errors?.mue_cap_inter_cati && <div className="error"><span><i className="fa-solid fa-circle-exclamation"></i> {errors?.mue_cap_inter_cati.message}</span></div>
                        }
                    </div>
                </div>
                
                <div className="cell ">
                    <label>Materia orgánica (MO)</label>
                    <input type="number" className="input"
                    {...register("mue_porc_mat_org", {
                        required:{
                            value: true,
                            message: "Ingrese valor"
                        }
                    })}
                    />
                    {
                        errors?.mue_porc_mat_org && <div className="error"><span><i className="fa-solid fa-circle-exclamation"></i> {errors?.mue_porc_mat_org.message}</span></div>
                    }
                </div>

                <div className="cell ">
                    <label>Fecha de registro</label>
                    <input type="date" className="input"
                    {...register("mue_fecha_registro", {
                        required:{
                            value: true,
                            message: "Escoga fecha de registro"
                        },
                        validate: (valor) => {
                            const fechaSeleccionada = new Date(valor);
                            const hoy = new Date();
                            if(fechaSeleccionada > hoy){
                                return "Escoga un fecha actual o anterior";
                            }
                            return true;
                        }
                        
                    })}
                    />
                    {
                        errors?.mue_fecha_registro && <div className="error"><span><i className="fa-solid fa-circle-exclamation"></i> {errors?.mue_fecha_registro.message}</span></div>
                    }
                </div>
                
            </div>
        </div>
    );
}


function VariablesQuimicas() {
    return (
        <div className={`${styles["container-quimico"]}`}>
            <div className="control mt-1 mb-3">
                <div className="field has-addons has-addons-right">
                    <p className="control is-expanded">
                        <span className="select is-fullwidth">
                            <select className="select-op">
                                <option hidden>Elemento quimico</option>
                                {
                                Array.from(elementosQuimicos.entries()).map(([simbolo, elemento]) =>
                                    <option key={simbolo}>{elemento}</option>
                                )
                                }
                            </select>
                        </span>
                    </p>
                    <p className="control">
                        <span className="input">
                            {/* <select>
                                <option hidden>Unidad</option>
                            {
                                unidadesMedida.map((medida, index) => <option key={index}>{medida}</option>)
                            }
                            </select> */}
                        </span>
                    </p>
                    <p className="control">
                        <input
                            className="input"
                            type="text"
                            placeholder="Ingrese el valor"
                        />
                    </p>
                    <p className="control">
                        <button className="button is-link">Agregar</button>
                    </p>
                </div>
            </div>

            <div className={`${styles["container"]}`}>
                <table className="table is-hoverable is-stripped is-fullwidth">
                    <thead className={`has-background-white ${styles["custom-thead"]}`}>
                        <tr>
                            <th>#</th>
                            <th>Símbolo</th>
                            <th>Elemento</th>
                            <th>Unidad</th>
                            <th>Valor</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <RowTable index={0} />
                        <RowTable index={1} />
                        <RowTable index={2} />
                        <RowTable index={3} />
                        <RowTable index={4} />
                        <RowTable index={5} />
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function RowTable ({index}){
    const [simbolo, nombre] = Array.from(elementosQuimicos.entries())[index];

    return (
        <tr>
            <td>1</td>
            <td>{simbolo}</td>
            <td>{nombre}</td>
            <td>mg/kg</td>
            <td>10</td>
            <td>
                <div className={`buttons ${styles["buttons-table"]}`}>
                    <button className="tag is-link">
                        <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button className="tag is-danger">
                        <i className="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default FormMuestras;
