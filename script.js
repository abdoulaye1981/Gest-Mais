// Remplace par ton ID de feuille Google Sheets
const SHEET_ID = '1WWq1qR1PWLVQvxboJ7CUvr2MINVUUvsKqNBkEPVSfvk';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=Maison&tqx=out:csv`;

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
