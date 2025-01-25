import PropTypes from 'prop-types';
import { useState, useEffect } from "react";
import { useForm} from "react-hook-form";
import styles from "./parcela.module.css";
import "./form-parcela.css";
import Notification from "./notification/notification";
import api from "../utils/api";

const FormParcela = ({idZona, idUser}) => {
    const [tiposSuelo, setTiposSuelo] = useState([]);

    useEffect(() => {
        const getTipos = async () => {
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

                const data = await response.json();
                setTiposSuelo(data);
            } catch (error) {
                console.error(
                    "Error al obtener los tipos de suelo:",
                    error.message
                );
            }
        };

        getTipos();
    }, []);

    const { register, handleSubmit, formState: { errors }, reset} = useForm();
    const [isActive, setIsActive] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    const toggleModal = () => {
        setIsActive(!isActive);
        reset();
        setIsSuccess(false);
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

    const EnviarDatos = handleSubmit((data, e) => {
        const datosParcela = {...data, 'user_id': idUser, 'cons_id': idZona};
        const btnAdd = e.target.querySelector('.btn-add-parcela');
        btnAdd.classList.add('is-loading');

        console.log(localStorage.getItem('token'));
        api.nuevaParcela(datosParcela).then((response) => {
            if (response.error) {
                alert("Error al registrar la parcela:", response.message);
                btnAdd.classList.remove('is-loading');
            } else {
                setIsSuccess(true);
                btnAdd.classList.remove('is-loading');
            }
        });

        // setTimeout(() => {
        //     setIsSuccess(true);
        //     btnAdd.classList.remove('is-loading');
        // }, 2000);
    })

    return (
        <div>
            <button className="button is-primary" onClick={toggleModal}>
                Agregar nueva parcela
            </button>

            <div className={`${styles['parcela-form']} modal ${isActive ? "is-active" : ""}`}>
                <div className="parcela-form-container">
                    <form onSubmit={EnviarDatos}>
                        <FormHeader handleModal={toggleModal}/>
                        {!isSuccess ? (
                            <>
                                <FormBody register={register} errors={errors} tiposSuelo={tiposSuelo}/>
                                <FormFooter handleSubmit={handleSubmit} handleModal={toggleModal}/>
                            </>
                        ) : (
                            // ******** Falta estilos *****
                            <div className="success-message"> 
                                <Notification/>
                                <button className="button is-primary" onClick={toggleModal}>Cerrar</button>
                            </div>
                        )}
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


function FormBody({register, errors, tiposSuelo}){
    return (
        <div className={`${styles["form-body"]} parcela-form-body`}>
            <DatosGenerales register={register} errors={errors} tiposSuelo={tiposSuelo}/>
        </div>
    );
}

function FormFooter({handleSubmit, handleModal}){
    return (
        <div className={`${styles['form-footer']} is-fullwidth is-flex is-justify-content-end mb-2 mt-5 parcela-form-footer`}>
            <button className="button is-primary btn-add-parcela" onClick={handleSubmit}>Añadir</button>
            <button className="button" onClick={handleModal}>Cancelar</button>
        </div>
    );
}

function DatosGenerales({register, errors,  tiposSuelo}) {
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
                                                {tiposSuelo.map((suelo) => (
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
    errors: PropTypes.object,
    tiposSuelo: PropTypes.array
}

FormFooter.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handleModal: PropTypes.func.isRequired
}

DatosGenerales.propTypes = {
    register: PropTypes.func.isRequired,
    errors: PropTypes.object,
    tiposSuelo: PropTypes.array
    
}

export default FormParcela;