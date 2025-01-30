import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Scatter,
    Legend,
    ResponsiveContainer,
} from "recharts";

const Grafico = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="id"
                    label={{ value: "Muestras", position: "insideBottom", offset: -5 }}
                />
                <YAxis
                    domain={[0, 20]}  // Define los límites del eje Y
                    ticks={[5, 10, 15]}  // Solo muestra 5, 10 y 15
                    label={{ value: "Nivel de P", angle: -90, position: "insideLeft" }}
                />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Bajo" stroke="#ff7300" strokeWidth={2} />
                <Line type="monotone" dataKey="Medio" stroke="#2e8b57" strokeWidth={2} />
                <Line type="monotone" dataKey="Alto" stroke="#ff2c2c" strokeWidth={2} />
                <Scatter data={data} dataKey="P" fill="black" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default Grafico;
