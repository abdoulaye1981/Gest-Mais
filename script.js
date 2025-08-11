// Remplace par ton ID de feuille Google Sheets
const SHEET_ID = '1WWq1qR1PWLVQvxboJ7CUvr2MINVUUvsKqNBkEPVSfvk';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=Maisons&tqx=out:csv`;

async function loadSheet() {
  const res  = await fetch(SHEET_URL);
  const csv  = await res.text();
  const rows = csv.split('\n').slice(1); // skip header
  const tbody = document.getElementById('data-body');
  tbody.innerHTML = '';
  rows.forEach(row => {
    const cols = row.split(',').map(c => c.replace(/"/g, ''));
    const tr   = document.createElement('tr');
    cols.forEach(c => {
      const td = document.createElement('td');
      td.textContent = c;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

loadSheet();
