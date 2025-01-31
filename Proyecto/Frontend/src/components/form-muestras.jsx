/* eslint-disable */ // Validar despúes 
import React, { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import { useForm } from "react-hook-form";
import styles from "./form-muestra.module.css"
import { isFormValid } from "../utils/isFormValid";
import api from "../utils/api";
import { ToastContainer, toast } from "react-toastify";
import Notification from "./notification/notification";
import "./indicator.css"
import { isNumber } from "chart.js/helpers";

const FormMuestras = ({ parcelaId }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const { register, handleSubmit, formState: { errors }, reset } = useForm({ mode: "all" });
    const [elementosIniciales, setElementosIniciales] = useState([]);
    const [elementosSeleccionados, setElementosSeleccionados] = useState([]);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (isActive) {
            const getElementosQuimicos = async () => {
                const token = localStorage.getItem("token");
                const url = "https://soil-management-4-soft-utn.onrender.com/elementos";
                try {
                    const response = await fetch(url, {
                        method: "GET",
                        headers: {
                            Authorization: token,
                            "Content-Type": "application/json",
                        },
                    });

                    if (!response.ok) {
                        // throw new Error(`Response status: ${response.status}`);
                    }
                    const data = await response.json();
                    data.sort((a, b) => a.elem_nombre.localeCompare(b.elem_nombre));
                    setElementosIniciales(data);
                } catch (error) {
                    console.error(
                        "Error al obtener los elementos quimicos:",
                        error.message
                    );
                }
            };
            getElementosQuimicos();
        }

    }, [isActive])

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };


    const toggleModal = () => {
        setIsActive(!isActive);
        setCurrentStep(0);
        setElementosSeleccionados([]);
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
    }), [isActive];

    const EnviarMuestra = handleSubmit((data, e) => {
        if (currentStep < 1 && isFormValid(errors)) {
            setCurrentStep(currentStep + 1);
            return;
        }

        if(elementosSeleccionados.length > 0){
            let elems = elementosSeleccionados?.map(item => ({
                simb_elem: item.elem_simbolo,
                cant_elem: parseFloat(item.valor)
            }));
            data["elems"] = elems;
        }

        data["parc_id"] = parcelaId;
        data.con_elec = parseFloat(data.con_elec);
        data.inter_cati = parseFloat(data.inter_cati);
        data.mat_org = parseFloat(data.mat_org);
        data.ph = parseFloat(data.ph);
        data.salinidad = parseFloat(data.salinidad);

        const btnAdd = e.target;
        btnAdd.classList.add('is-loading');

        api.nuevaMuestra(data).then((response) => {
            if (response.error) {
                toast.error('Ocurrió un error al registrar la muestra.')
            } else {
                toast.success('¡Muestra registrada exitósamente!')
                toggleModal();
            }
            btnAdd.classList.remove('is-loading');
        });

    })

    return (
        <div>
            <ToastContainer />
            <button className="button is-primary" onClick={toggleModal}>
                Agregar muestra
            </button>

            <div className={`${styles["parcela-form"]} modal ${isActive ? "is-active" : ""}`}>
                <div className={`${styles["form-container"]}`}>
                    <form onSubmit={EnviarMuestra} onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()} >
                        <FormHeader handleModal={toggleModal} currentStep={currentStep} />
                        <FormBody currentStep={currentStep} register={register} errors={errors} elementosIniciales={elementosIniciales} elementosSeleccionados={elementosSeleccionados} setElementosIniciales={setElementosIniciales} setElementosSeleccionados={setElementosSeleccionados} />
                        <FormFooter currentStep={currentStep} handleBack={handleBack} handleSubmit={EnviarMuestra} handleModal={toggleModal} />
                    </form>
                </div>
            </div>
        </div>
    );
};

function FormHeader({ handleModal, currentStep }) {
    return (
        <div className={`${styles["form-header"]}`}>
            <div>
                <span className={`subtitle is-4 is-block has-text-centered has-text-weight-semibold mb-2 mt-2 ${styles["title-header"]}`}>Agregar muestras</span>
                <button className={`${styles["btn-close"]} delete is-medium has-background-danger`} aria-label="close" onClick={handleModal}></button>
            </div>
            <div>
                <StepIndicator currentStep={currentStep} />
            </div>
        </div>
    );
}

function StepIndicator({ currentStep }) {
    return (
        <div className="indicator">
            <div className="indicator-points">
                <div className={`bar ${currentStep > 0 ? 'current-step-bar' : ''}`}></div>
                <div className={`step1 ${currentStep == 0 ? 'current-step' : 'step-complete'}`}><span>1</span></div>
                <div className={`step2 ${currentStep > 0 ? 'current-step' : ''}`}><span>2</span></div>
            </div>
            <div className="indicator-titles">
                <span>Parámetros generales</span>
                <span>Variables químicas</span>
            </div>
        </div>
    )
}

function FormBody({ currentStep, register, errors, elementosIniciales, elementosSeleccionados, setElementosIniciales, setElementosSeleccionados }) {
    return (
        <div className={`${styles["form-body"]}`}>
            {currentStep === 0 && <VariablesGenerales register={register} errors={errors} />}
            {currentStep === 1 && <VariablesQuimicas register={register} errors={errors} elementosIniciales={elementosIniciales} elementosSeleccionados={elementosSeleccionados} setElementosIniciales={setElementosIniciales} setElementosSeleccionados={setElementosSeleccionados} />}
        </div>
    );
}

function FormFooter({ currentStep, handleBack, handleSubmit, handleModal }) {
    return (
        <div className={`${styles["form-footer"]} is-fullwidth is-flex is-justify-content-end mb-2 mt-5`}>
            {currentStep > 0 ?
                <>
                    <button className={`button ${styles["btn-white"]}`} onClick={handleBack}>Atrás</button>
                    <button className="button is-link btn-add-muestra" onClick={handleSubmit}>Guardar</button>
                </>
                :
                <button className="button is-link" onClick={handleSubmit}>Siguiente</button>
            }
            <button type="button" className={`button ${styles["btn-white"]}`} onClick={handleModal}>Cancelar</button>
        </div>
    );
}

function VariablesGenerales({ register, errors }) {
    return (
        <div className="fixed-grid has-2-cols">
            <div className="grid">
                <div className="cell ">
                    <label>pH</label>
                    <input type="number" className="input"
                        {...register("ph", {
                            required: {
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
                        errors?.ph && <div className="error"><span><i className="fa-solid fa-circle-exclamation"></i> {errors?.ph.message}</span></div>
                    }
                </div>

                <div className={`cell ${styles["label-text"]}`}>
                    <label>Conductividad eléctrica (CE)</label>
                    <div className="control">
                        <input type="number" className="input"
                            {...register("con_elec", {
                                required: {
                                    value: true,
                                    message: "Ingrese valor"
                                }
                            })}
                        />
                    </div>
                    {
                        errors?.con_elec && <div className="error"><span><i className="fa-solid fa-circle-exclamation"></i> {errors?.con_elec.message}</span></div>
                    }
                </div>

                <div className="cell ">
                    <label>Salinidad</label>
                    <input type="number" className="input"
                        {...register("salinidad", {
                            required: false,
                        })}
                    />
                    {
                        errors?.salinidad && <div className="error"><span><i className="fa-solid fa-circle-exclamation"></i> {errors?.salinidad.message}</span></div>
                    }
                </div>

                <div className={`cell ${styles["label-text"]}`}>
                    <label>Capacidad de intercambio catiónico efectiva (CICe)</label>
                    <div className="control">
                        <input type="number" className="input"
                            {...register("inter_cati", {
                                required: false,
                                min: {
                                    value: 0,
                                    message: "Ingrese valor válido"
                                }
                            })}
                        />
                        {
                            errors?.inter_cati && <div className="error"><span><i className="fa-solid fa-circle-exclamation"></i> {errors?.inter_cati.message}</span></div>
                        }
                    </div>
                </div>

                <div className="cell ">
                    <label>Materia orgánica (MO)</label>
                    <input type="number" className="input"
                        {...register("mat_org", {
                            required: {
                                value: true,
                                message: "Ingrese valor"
                            }
                        })}
                    />
                    {
                        errors?.mat_org && <div className="error"><span><i className="fa-solid fa-circle-exclamation"></i> {errors?.mat_org.message}</span></div>
                    }
                </div>

                <div className="cell ">
                    <label>Fecha de registro</label>
                    <input type="date" className="input"
                        {...register("fecha_registro", {
                            required: {
                                value: true,
                                message: "Escoga fecha de registro"
                            },
                            validate: (valor) => {
                                const partes = valor.split("-");
                                const fechaSeleccionada = new Date(partes[0], partes[1] - 1, partes[2]);
                                const hoy = new Date();
                                hoy.setHours(0, 0, 0, 0);

                                if (fechaSeleccionada > hoy) {
                                    return "Escoga un fecha actual o anterior";
                                }
                                return true;
                            }
                        })}
                    />
                    {
                        errors?.fecha_registro && <div className="error"><span><i className="fa-solid fa-circle-exclamation"></i> {errors?.fecha_registro.message}</span></div>
                    }
                </div>

            </div>
        </div>
    );
}

function VariablesQuimicas({ elementosIniciales, elementosSeleccionados, setElementosIniciales, setElementosSeleccionados }) {
    const elementoSimboloRef = useRef("");
    const elementoValorRef = useRef("");
    const [valorValido, setValorValido] = useState(true);

    const moverASeleccionados = () => {
        const elementoSeleccionado = elementoSimboloRef.current.value;
        const elementoValor = elementoValorRef.current.value;
        if (elementoSeleccionado.trim().length == 0) return;

        const selectedItem = elementosIniciales.find(
            (item) => item.elem_simbolo === elementoSeleccionado
        );

        if (selectedItem) {

            selectedItem["valor"] = elementoValor;
            setElementosIniciales((prev) => prev.filter((item) => item !== selectedItem));
            setElementosSeleccionados((prev) => [...prev, selectedItem]);
            elementoValorRef.current.value = "";
        }
    };

    const moverAIniciales = (elem_simbolo) => {

        if (elem_simbolo.trim().length == 0) return;

        const selectedItem = elementosSeleccionados.find(
            (item) => item.elem_simbolo === elem_simbolo
        );

        if (selectedItem) {

            setElementosSeleccionados((prev) => prev.filter((item) => item !== selectedItem));
            setElementosIniciales((prev) => {
                const updatedItems = [...prev, selectedItem];
                updatedItems.sort((a, b) => a.elem_nombre.localeCompare(b.elem_nombre)); // Ordenar alfabéticamente por elem_nombre
                return updatedItems;
            });
        }

    };

    const agregarElemento = () => {
        if (elementoSimboloRef.current.value.length == 0) return;

        if (!isNumber(elementoValorRef.current.value)) {
            setValorValido(false);
            return;
        }
        moverASeleccionados();
        setValorValido(true);
    }

    const removerElemento = (simb_elem) => {
        moverAIniciales(simb_elem);
    }

    const changeValor = () => {
        if (!valorValido & isNumber(elementoValorRef.current.value)) {
            setValorValido(true);
        }
    }

    return (
        <div className={`${styles["container-quimico"]}`}>
            <div className="control mt-1 mb-3">
                <div className="field has-addons has-addons-right mb-0">
                    <p className="control is-expanded">
                        <span className="select control is-fullwidth">
                            <select className="select-op" ref={elementoSimboloRef}>
                                <option hidden value="">Seleccione un elemento</option>
                                {
                                    elementosIniciales.map(elemento => <option key={elemento.elem_simbolo} value={elemento.elem_simbolo}>{elemento.elem_nombre} ({elemento.uni_simbolo})</option>)
                                }
                            </select>
                        </span>
                    </p>
                    <p className="control">
                        <input
                            className="input"
                            type="number"
                            placeholder="Ingrese el valor"
                            ref={elementoValorRef}
                            onChange={changeValor}
                        />
                    </p>
                    <p className="control">
                        <button type="button" className="button is-link" onClick={agregarElemento}>Agregar</button>
                    </p>
                </div>
                {
                    !valorValido && <div className="error mt-0"><span><i className="fa-solid fa-circle-exclamation"></i> Ingrese un valor para el elemento</span></div>
                }
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
                        {
                            elementosSeleccionados?.map((elemento, index) =>
                                <RowTable key={index} index={index + 1} elemento={elemento} removerElemento={removerElemento} />
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function RowTable({ index, elemento, removerElemento }) {
    const { elem_simbolo, elem_nombre, uni_simbolo, valor } = elemento;
    const inputRef = useRef();
    const [editando, setEditando] = useState(false);

    const editarValor = () => {
        setEditando(true);
    }

    useEffect(() => {
        if (editando) {
            inputRef.current.focus();
        }
    }, [editando]);

    const handleOnBlur = () => {
        const nuevoValor = inputRef.current.value;
        if (nuevoValor != 0) {
            elemento.valor = nuevoValor;
        }
        setEditando(false);
    }

    const eliminarElemento = () => {
        removerElemento(elem_simbolo);
    }

    return (
        <tr>
            <td>{index}</td>
            <td>{elem_simbolo}</td>
            <td>{elem_nombre}</td>
            <td>{uni_simbolo}</td>
            <td>
                {
                    editando ? <input ref={inputRef} type="number" className={`${styles["input-valor-elemento"]}`} onBlur={handleOnBlur} />
                        :
                        valor
                }
            </td>
            <td>
                <div className={`buttons ${styles["buttons-table"]}`}>
                    <button type="button" className="tag is-link" onClick={editarValor}>
                        <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button type="button" className="tag is-danger" onClick={eliminarElemento}>
                        <i className="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default FormMuestras;
