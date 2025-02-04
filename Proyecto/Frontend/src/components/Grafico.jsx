import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const Grafico = ({ data }) => {
    // Datos del gráfico
    const chartData = {
        labels: data.map(muestra => `ID: ${muestra.mue_id}`),
        datasets: [
            {
                label: "Nota de la Muestra",
                data: data.map(muestra => muestra.mue_nota),
                backgroundColor: "lightgreen", // ✅ Color verde claro
                borderColor: "black",
                borderWidth: 1,
                barPercentage: 0.5, // ✅ Hace que las barras sean más delgadas
                categoryPercentage: 0.7, // ✅ Ajusta la separación entre barras
            },
        ]
    };

    // Configuración del gráfico
    const options = {
        responsive: true,
        plugins: {
            legend: { display: false }, // Ocultar leyendas
            tooltip: { enabled: true },
        },
        scales: {
            x: {
                title: { display: true, text: "Muestras" },
                barPercentage: 0.5, // ✅ Hace que las barras sean más delgadas
                categoryPercentage: 0.7, // ✅ Ajusta la separación entre barras
            },
            y: {
                title: { display: true, text: "Nota de la Muestra" },
                min: 0,
                max: 100,
                ticks: { stepSize: 10 }
            }
        }
    };

    return <Bar data={chartData} options={options} />;
};

export default Grafico;
