// Remplace par ton ID de feuille Google Sheets
const SHEET_ID = '1WWq1qR1PWLVQvxboJ7CUvr2MINVUUvsKqNBkEPVSfvk';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=Maisons&tqx=out:csv`;

async function loadSheet() {
  const res  = await fetch(SHEET_URL);
  const csv  = await res.text();
  // retire la ligne d’en-tête
  const rows = csv.split('\n').slice(1);
  const tbody = document.getElementById('data-body');
  tbody.innerHTML = '';

  rows.forEach(row => {
    // split en tenant compte des virgules à l’intérieur des guillemets
    const cols = row.match(/(".*?"|[^,]+)/g)?.map(c => c.replace(/"/g, '').trim()) || [];
    if (cols.length < 7) return; // ligne incomplète

// 👇 Lien Drive stylisé ou simple icône
    const linkCell = driveLink
      ? `<a href="${driveLink}" target="_blank" class="button is-small is-info">📁 Voir</a>`
      : '';
    
    const tr = document.createElement('tr');
    cols.slice(0, 7).forEach(c => {
      const td = document.createElement('td');
      td.textContent = c;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

loadSheet();
