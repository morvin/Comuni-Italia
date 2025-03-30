// Dati di esempio, da sostituire con fetch da CSV/JSON
const comuni = [
  "Salerno", "Napoli", "Avellino", "Caserta", "Benevento",
  "Roma", "Milano", "Torino", "Firenze", "Palermo"
];

const searchInput = document.getElementById("search");
const comuniList = document.getElementById("comuni-list");

function updateList(query) {
  comuniList.innerHTML = "";
  comuni
    .filter(comune => comune.toLowerCase().includes(query.toLowerCase()))
    .forEach(comune => {
      const li = document.createElement("li");
      li.textContent = comune;
      li.className = "bg-white p-3 rounded shadow";
      comuniList.appendChild(li);
    });
}

searchInput.addEventListener("input", (e) => updateList(e.target.value));
updateList("");
