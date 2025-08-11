<nav class="tabs">
  <ul>
  <li><a href="maintenance.html">Maintenance</a></li>
    <li class="is-active"><a href="index.html">Maisons</a></li>
  </ul>
</nav>
// Remplace par ton ID de feuille Google Sheets
const SHEET_ID = 'TON_ID_ICI';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=Maintenance&tqx=out:csv`;
async function loadSheet() {
  try {
    const res = await fetch(SHEET_URL);
    if (!res.ok) {
      throw new Error(`Erreur HTTP : ${res.status}`);
    }

    const csvText = await res.text();
    const rows = csvText.split('\n').slice(1); // on ignore l'en-tête
    const tbody = document.getElementById('data-body');
    tbody.innerHTML = '';

    rows.forEach(row => {
      if (row.trim() !== '') { // éviter les lignes vides
        const cols = row.split(',');
        const tr = document.createElement('tr');
        cols.forEach(col => {
          const td = document.createElement('td');
          td.textContent = col.replace(/"/g, '');
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      }
    });
  } catch (error) {
    console.error('Erreur lors du chargement des données :', error);
  }
}

loadSheet();
