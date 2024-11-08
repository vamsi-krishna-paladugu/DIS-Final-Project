const apiUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://crashviewer.nhtsa.dot.gov/CrashAPI/crashes/GetCrashesByLocation?fromCaseYear=2021&toCaseYear=2024&state=12&county=1&format=json');
document.addEventListener("DOMContentLoaded", () => {
    const accidentsTable = document.getElementById("report").querySelector("tbody");
    const accidentForm = document.getElementById("accidentForm");
    const addBtn = document.getElementById("addBtn");
    let editMode = false;
  
    // Fetch and display accidents
    async function fetchAccidents() {
        try {
            const response = await fetch(apiUrl);
            const accidents = await response.json();
            console.log("+++", accidents.Results);
            accidentsTable.innerHTML = accidents.Results.flat().map(acc => `
                <tr data-id="${acc.ST_CASE}">
                    <td>${acc.CITY}</td>
                    <td>${acc.CITYNAME}</td>
                    <td>${acc.COUNTYNAME}</td>
                    <td>${acc.STATE}</td>
                    <td>${acc.CaseYear}</td>
                    <td>${acc.ST_CASE}</td>
                    <td>${acc.TOTALVEHICLES}</td>
                    <td>
                        <button class="btn btn-warning">Edit</button>
                        <button class="btn btn-danger">Delete</button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    }
  
    // Add accident
    accidentForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = document.getElementById("accidentId").value;
      const location = document.getElementById("location").value;
      const date = document.getElementById("date").value;
  
      if (editMode) {
        await fetch(`${apiUrl}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ location, date })
        });
      } else {
        await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ location, date })
        });
      }
  
      resetForm();
      fetchAccidents();
    });
  
    // Edit accident
    accidentsTable.addEventListener("click", (e) => {
      if (e.target.classList.contains('edit')) {
        const row = e.target.closest("tr");
        const id = row.dataset.id;
        const location = row.children[1].textContent;
        const date = row.children[2].textContent;
  
        document.getElementById("accidentId").value = id;
        document.getElementById("location").value = location;
        document.getElementById("date").value = date;
        editMode = true;
      }
    });
  
    // Delete accident
    accidentsTable.addEventListener("click", async (e) => {
      if (e.target.classList.contains('delete')) {
        const id = e.target.closest("tr").dataset.id;
        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        fetchAccidents();
      }
    });
  
    // Reset form
    function resetForm() {
      accidentForm.reset();
      editMode = false;
    }
  
    // Initialize
    fetchAccidents();
  });  