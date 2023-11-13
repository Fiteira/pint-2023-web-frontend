import React from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

function GraficoPizza({ chartData, Nome }) {
  return (
    <div className="chart-container">
      {chartData ? (
        <Pie
          data={chartData}
          options={{
            plugins: {
              title: {
                display: true,
                text: Nome,
                font: {
                  weight: "bold",
                },
              },
            },
          }}
        />
      ) : (
        <p>Carregando..</p>
      )}
    </div>
  );
}

export default GraficoPizza;