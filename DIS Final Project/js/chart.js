const apiUrl = 'https://cors-anywhere.herokuapp.com/https://crashviewer.nhtsa.dot.gov/CrashAPI/crashes/GetCrashesByLocation?fromCaseYear=2021&toCaseYear=2024&state=12&county=1&format=json';

document.addEventListener("DOMContentLoaded", () => {
    let accidentsData = [];

    // Fetch and display accidents
    async function fetchAccidents() {
        try {
            // Check if accidents data is saved in localStorage
            const storedAccidents = localStorage.getItem("accidentsData");
            if (storedAccidents) {
                // If found in localStorage, use the stored data
                accidentsData = JSON.parse(storedAccidents);
                generateVisuals(); 
            } else {
                // Otherwise, fetch data from API
                const response = await fetch(apiUrl);
                const accidents = await response.json();
                accidentsData = accidents.Results.flat();
                generateVisuals(); 
            }
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    }

    function generateVisuals() {
      // 1. Bar Chart: Total accidents by city
      const cityData = accidentsData.reduce((acc, curr) => {
          acc[curr.CITY] = acc[curr.CITY] ? acc[curr.CITY] + 1 : 1;
          return acc;
      }, {});
      const cityLabels = Object.keys(cityData);
      const cityAccidents = Object.values(cityData);

      const cityBarChart = new Chart(document.getElementById('cityBarChart'), {
          type: 'bar',
          data: {
              labels: cityLabels,
              datasets: [{
                  label: 'Total Accidents by City',
                  data: cityAccidents,
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1
              }]
          },
          options: {
              scales: {
                  y: {
                      beginAtZero: true
                  }
              }
          }
      });

      // 2. Pie Chart: Distribution of accidents by state
      const stateData = accidentsData.reduce((acc, curr) => {
          acc[curr.STATE] = acc[curr.STATE] ? acc[curr.STATE] + 1 : 1;
          return acc;
      }, {});
      const stateLabels = Object.keys(stateData);
      const stateAccidents = Object.values(stateData);

      const statePieChart = new Chart(document.getElementById('statePieChart'), {
          type: 'pie',
          data: {
              labels: stateLabels,
              datasets: [{
                  data: stateAccidents,
                  backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FF8C33'],
                  hoverOffset: 4
              }]
          },
          options: {
              responsive: true
          }
      });

      // 3. Line Chart: Trend of accidents over the years
      const yearData = accidentsData.reduce((acc, curr) => {
          acc[curr.CaseYear] = acc[curr.CaseYear] ? acc[curr.CaseYear] + 1 : 1;
          return acc;
      }, {});
      const yearLabels = Object.keys(yearData);
      const yearAccidents = Object.values(yearData);

      const yearLineChart = new Chart(document.getElementById('yearLineChart'), {
          type: 'line',
          data: {
              labels: yearLabels,
              datasets: [{
                  label: 'Accidents Over the Years',
                  data: yearAccidents,
                  fill: false,
                  borderColor: '#FF5733',
                  tension: 0.1
              }]
          },
          options: {
              responsive: true,
              scales: {
                  y: {
                      beginAtZero: true
                  }
              }
          }
      });
    }

    // Initialize
    fetchAccidents();
});
