import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import styles from "./parcela.module.css";
import { useForm} from "react-hook-form";
import "./form-parcela.css";

let tiposSuelos = {};

const getTipos  = async () =>{
    const token = localStorage.getItem("token");
    const url = "https://soil-management-4-soft-utn.onrender.com/tipos";
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        tiposSuelos = await response.json();

    } catch (error) {
        console.error(error.message);
    }
} 

getTipos();

const FormParcela = ({idZona, idUser}) => {

    const { register, handleSubmit, formState: { errors }, reset} = useForm();
    const [isActive, setIsActive] = useState(false);
    
    const EnviarDatos = handleSubmit((data) => {
        const datosParcela = {...data, 'user_id': idUser, 'const_id': idZona};
        console.log(datosParcela);
        reset();
        toggleModal();
    })

    const toggleModal = () => {
        setIsActive(!isActive);
        reset();
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape" && isActive) {
                toggleModal();
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
                Agregar nueva parcela
            </button>

            <div className={`${styles['parcela-form']} modal ${isActive ? "is-active" : ""}`}>
                <div className="parcela-form-container">
                    <form onSubmit={EnviarDatos}>
                        <FormHeader handleModal={toggleModal}/>
                        <FormBody register={register} errors={errors}/>
                        <FormFooter handleSubmit={handleSubmit} handleModal={toggleModal}/>
                    </form>
                </div>
            </div>
        </div>
    );
};

function FormHeader({handleModal}) {
    return (
        <div className={`${styles['form-header']} `}>
            <div>
                <span className="subtitle is-4 is-block has-text-centered has-text-weight-semibold mb-2 mt-2">Agregar nueva parcela</span>
                <button className={`${styles['btn-close']} has-background-danger`} aria-label="close" onClick={handleModal}><i className="fa-solid fa-x"></i></button>
            </div>
           
        </div>
    );
}


function FormBody({register, errors}){
    return (
        <div className={`${styles["form-body"]} parcela-form-body`}>
            <DatosGenerales register={register} errors={errors}/>
        </div>
    );
}

function FormFooter({handleSubmit, handleModal}){
    return (
        <div className={`${styles['form-footer']} is-fullwidth is-flex is-justify-content-end mb-2 mt-5 parcela-form-footer`}>
            <button className="button is-primary" onClick={handleSubmit}>Añadir</button>
            <button className="button" onClick={handleModal}>Cancelar</button>
        </div>
    );
}

function DatosGenerales({register, errors}) {
    return (
        <div>
            <div className="fixed-grid">
                <div className="grid is-gap-3">
                    <div className="cell">
                        <div className="fixed-grid">
                            <div className="grid">
                                <div className="cell is-col-span-2">
                                    <label className="label mb-1">Nombre de parcela</label>
                                    <input type="text" className="input" placeholder="Ej. nombre" maxLength="50"
                                    {...register('parc_nombre', {
                                        required:{
                                            value: true,
                                            message: 'El nombre es requerido'
                                        }
                                    })}
                                    />
                                    {
                                        errors?.parc_nombre && <div className="error"><span><i className="fa-solid fa-circle-exclamation"></i> {errors?.parc_nombre.message}</span></div>
                                    }

                                </div>
                                <div className="cell is-col-span-2">
                                    <label className="label mb-1">Tipo de suelo</label>
                                    <div className="control has-icons-left">
                                        <div className="select">
                                            <select
                                            {...register("tipos_id", {
                                                required: {
                                                    value: true,
                                                    message: "Seleccione un tipo"
                                                }
                                            })}
                                            >
                                                <option hidden selected value="">Seleccione una opción ...  </option>
                                                {tiposSuelos.map((suelo) => (
                                                    <option key={suelo.tipos_id} value={suelo.tipos_id}>
                                                        {suelo.tipos_nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="icon is-small is-left">
                                            <i className="fa fa-leaf"></i>
                                        </div>
                                        </div>
                                        {
                                            errors?.tipos_id && <div className="error"><span><i className="fa-solid fa-circle-exclamation"></i> {errors?.tipos_id.message}</span></div>
                                        }
                                </div>
                                <div className="cell">
                                    <label className="label mb-1">Latitud</label>
                                    <input type="number" className="input" placeholder="Valor en °" step="0.00001"
                                    {...register("parc_coord_la", {
                                        required: {
                                            value: true,
                                            message: "Ingrese valor"
                                        },
                                        min: {
                                            value: -90,
                                            message: "Valor incorrecto"
                                        },
                                        max:{
                                            value: 90,
                                            message: "Valor incorrecto"
                                        }
                                    })}
                                    />
                                    {
                                        errors?.parc_coord_la && <div className="error"><span><i className="fa-solid fa-circle-exclamation"></i> {errors?.parc_coord_la.message}</span></div>
                                    }
                                </div>
                                <div className="cell">
                                    <label className="label mb-1">Longitud</label>
                                    <input type="number" className="input" placeholder="Valor en °" step="0.00001"
                                    {...register("parc_coord_lo", {
                                        required: {
                                            value: true,
                                            message: "Ingrese valor"
                                        },
                                        min: {
                                            value: -180,
                                            message: "Valor incorrecto"
                                        },
                                        max:{
                                            value: 180,
                                            message: "Valor incorrecto"
                                        }
                                    })}
                                    />
                                    {
                                        errors?.parc_coord_lo && <div className="error"><span><i className="fa-solid fa-circle-exclamation"></i> {errors?.parc_coord_lo.message}</span></div>
                                    }
                                </div>
                                <div className="cell is-col-span-2">
                                    <label className="label mb-1">Área (metros cuadrados)</label>
                                    <input className="input" type="number" min="0" placeholder="Valor en m²" step="0.001"
                                    {...register("parc_area", {
                                        required:{
                                            value: true,
                                            message: "Ingrese un valor válido"
                                        },
                                        min: {
                                            value: 0.1,
                                            message: "Ingrese un valor válido"
                                        }
                                    })}
                                    />
                                    {
                                        errors?.parc_area && <div className="error"><span><i className="fa-solid fa-circle-exclamation"></i> {errors?.parc_area.message}</span></div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="cell">
                        <div className="cell">
                            <label className="label mb-1">Descripción para la parcela</label>
                            <textarea className="textarea has-fixed-size mb-1" placeholder="..." 
                            {...register("parc_descripcion", {
                                required:{
                                    value: true,
                                    message:"Ingrese una descripcion"
                                }
                            })}
                            />
                            {
                                errors?.parc_descripcion && <div className="error"><span><i className="fa-solid fa-circle-exclamation"></i> {errors?.parc_descripcion.message}</span></div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

FormParcela.propTypes = {
    idZona: PropTypes.number,
    idUser: PropTypes.number
}

FormHeader.propTypes = {
    handleModal: PropTypes.func.isRequired
}

FormBody.propTypes = {
    register: PropTypes.func.isRequired,
    errors: PropTypes.object
}

FormFooter.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handleModal: PropTypes.func.isRequired
}

DatosGenerales.propTypes = {
    register: PropTypes.func.isRequired,
    errors: PropTypes.object
}

export default FormParcela;