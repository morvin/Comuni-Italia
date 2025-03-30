document.addEventListener("DOMContentLoaded", () => {
  const lat = 40.6824;
  const lon = 14.7681;
  const map = L.map('map').setView([lat, lon], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © OpenStreetMap contributors'
  }).addTo(map);
  L.marker([lat, lon]).addTo(map).bindPopup("Salerno").openPopup();
});
