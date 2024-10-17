const apiKey = "cur_live_VlJoIA9xJZ1muQEvH22dGplYR4pZLroR0GA6Om3x"; // API key
const url = `https://cors-anywhere.herokuapp.com/https://freecurrencyapi.net/api/v2/latest?apikey=${apiKey}&base_currency=USD`;

let currencyChart;

function fetchDataAndUpdateChart() {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      const usdToPkrRate = data.data.PKR;
      const currentTime = new Date().toLocaleTimeString();
      currencyChart.data.labels.push(currentTime);
      currencyChart.data.datasets[0].data.push(usdToPkrRate);

      if (currencyChart.data.labels.length > 10) {
        currencyChart.data.labels.shift();
        currencyChart.data.datasets[0].data.shift();
      }

      currencyChart.update();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Initialize the chart
function initChart() {
  const chartData = {
    labels: [],
    datasets: [
      {
        label: "USD to PKR Exchange Rate",
        data: [],
        borderColor: "rgba(227, 11, 92, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        pointStyle: "circle",
        pointRadius: 5,
        pointHoverRadius: 10,
        tension: 0.4,
      },
    ],
  };

  const config = {
    type: "line",
    data: chartData,
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Real-Time USD to PKR Exchange Rate",
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: "Exchange Rate",
          },
        },
        x: {
          title: {
            display: true,
            text: "Time",
          },
        },
      },
    },
  };

  const ctx = document.getElementById("currencyChart").getContext("2d");
  currencyChart = new Chart(ctx, config);
}

initChart();
fetchDataAndUpdateChart();
setInterval(fetchDataAndUpdateChart, 35000);
