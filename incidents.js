const SHEET_ID = '1WWq1qR1PWLVQvxboJ7CUvr2MINVUUvsKqNBkEPVSfvk';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=Incidents&tqx=out:csv`;

let allRows = [];

async function loadSheet() {
  const res = await fetch(SHEET_URL);
  const csvText = await res.text();
  allRows = csvText.split('\n').slice(1).map(row => {
    const cols = row.split(',').map(c => c.replace(/"/g, ''));
    return {
      maison: cols[0],
      date: cols[1],
      type: cols[2],
      description: cols[3],
      statut: cols[4]
    };
  });
  populateTable(allRows);
  populateFilter(allRows);
}

function populateTable(rows) {
  const tbody = document.getElementById('data-body');
  tbody.innerHTML = '';
  rows.forEach(r => {
    const tr = document.createElement('tr');
    ['maison', 'date', 'type', 'description', 'statut'].forEach(k => {
      const td = document.createElement('td');
      if (k === 'statut') {
        const badge = document.createElement('span');
        badge.className = `tag ${r.statut === 'Résolu' ? 'is-success' : 'is-warning'}`;
        badge.textContent = r.statut;
        td.appendChild(badge);
      } else {
        td.textContent = r[k];
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

function populateFilter(rows) {
  const maisons = [...new Set(rows.map(r => r.maison))];
  const select = document.getElementById('filter-maison');
  select.innerHTML = '<option value="">Toutes</option>';
  maisons.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    select.appendChild(opt);
  });
  select.addEventListener('change', e => {
    const val = e.target.value;
    const filtered = val ? allRows.filter(r => r.maison === val) : allRows;
    populateTable(filtered);
  });
}

function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text('Rapport Incidents', 14, 16);
  const body = allRows.map(r => [r.maison, r.date, r.type, r.description, r.statut]);
  doc.autoTable({
    head: [['Maison', 'Date', 'Type', 'Description', 'Statut']],
    body,
    startY: 22
  });
  doc.save('incidents.pdf');
}

loadSheet();
