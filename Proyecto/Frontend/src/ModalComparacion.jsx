import React from "react";
import "./styles/ModalComparacion.css";
import Grafico from "./components/Grafico"; // Importamos el gráfico



const ModalComparacion = ({ isOpen, onClose, parcelas, elements, muestras }) => {
    if (!isOpen || parcelas.length !== 2) return null;

    //deputacion de muestras

    console.log("MUESTRAS");
    console.table(muestras);
    console.log("PARCELAS");
    console.table(parcelas);
    console.log("ELEMENTS");
    console.table(elements);

    return (
        <div className="modalOverlay">
            <div className="modalcontent">
                {/* Botón de cierre en la parte superior derecha */}
                <button onClick={onClose} className="modalclose">✖</button>
                <h2 id="titulo">Comparación de Parcelas</h2>

                {/* Contenedor principal con estructura en columnas */}
                <div className="containerComp">
                    {/* Primera parcela */}
                    <div className="parcelacomp">
                        <div className="nombrePar">
                            <h3>{parcelas[0].parc_nombre}Parcela 1</h3>
                        </div>
                        <h3>Nivel pH: {parcelas[0].mue_ph}</h3>
                        <h3>Calidad Suelo: {parcelas[0].mue_nota}</h3>
                        <h3>Conductividad Eléctrica: {parcelas[0].mue_con_elec}</h3>
                        <h3>Materia Orgánica: {parcelas[0].mue_porc_mat_org}</h3>
                        <h3>Intercambio Catiónico: {parcelas[0].mue_cap_inter_cati}</h3>
                        <h3>Salinidad: {parcelas[0].mue_salinidad}</h3>


                    </div>

                    {/* Segunda parcela */}
                    <div className="parcelacomp">
                        <div className="nombrePar">
                            <h3>{parcelas[1].parc_nombre}Parcela 2</h3>
                        </div>
                        <h3>Nivel pH: {parcelas[1].mue_ph}</h3>
                        <h3>Calidad Suelo: {parcelas[1].mue_nota}</h3>
                        <h3>Conductividad Eléctrica: {parcelas[1].mue_con_elec}</h3>
                        <h3>Materia Orgánica: {parcelas[1].mue_porc_mat_org}</h3>
                        <h3>Intercambio Catiónico: {parcelas[1].mue_cap_inter_cati}</h3>
                        <h3>Salinidad: {parcelas[1].mue_salinidad}</h3>
                    </div>

                    {/* Comparación */}
                    <div className="comparacion">
                        <h3>Comparativa Fertilidad</h3>
                        {/* Aquí se colocarán los gráficos comparativos */}
                        <Grafico data={[{ mue_nota: parcelas[0].mue_nota, mue_id: parcelas[0].mue_id }, { mue_nota: parcelas[1].mue_nota, mue_id: parcelas[1].mue_id }]} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalComparacion;
