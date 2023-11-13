import { Line } from "react-chartjs-2";
import "chart.js/auto";

function GraficoLinhas({ chartData, Nome }) {
  if (!chartData) {
    return <p>Carregando...</p>;
  }

  // Calculate the total of the data in the chart
  const totalData = chartData.datasets.reduce(
    (total, dataset) => total + dataset.data.reduce((sum, value) => sum + value, 0),
    0
  );

  return (
    <div className="chart-container">
      <Line
        data={chartData}
        options={{
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0, // Display only integer values on the y-axis,
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: `${totalData} ${Nome}`, // Display the total after the text
              font: {
                weight: "bold",
              },
            },
          },
        }}
        className="w-100 h-100"
      />
    </div>
  );
}

export default GraficoLinhas;