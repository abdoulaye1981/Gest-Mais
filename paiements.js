const SHEET_ID = 'COLLE_TON_ID_ICI';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=Paiements&tqx=out:csv`;

let allRows = [];

function parseDate(str) {
  const [d, m, y] = str.split('/');
  return new Date(`${y}-${m}-${d}`);
}

function daysLeft(due) {
  const diff = (due - new Date()) / (1000 * 60 * 60 * 24);
  return Math.floor(diff);
}

async function loadSheet() {
  const res = await fetch(SHEET_URL);
  const csvText = await res.text();
  allRows = csvText.split('\n').slice(1).map(row => {
    const cols = row.split(',').map(c => c.replace(/"/g, ''));
    const due = parseDate(cols[3]);
    const statut = cols[4] || (daysLeft(due) < 0 ? 'En retard' : 'À venir');
    return {
      maison: cols[0],
      locataire: cols[1],
      montant: cols[2],
      echeance: cols[3],
      statut,
      jours: daysLeft(due)
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
    ['maison', 'locataire', 'montant', 'echeance', 'statut', 'jours'].forEach(k => {
      const td = document.createElement('td');
      if (k === 'jours') {
        const badge = document.createElement('span');
        badge.className = `tag ${r.jours < 0 ? 'is-danger' : r.jours <= 3 ? 'is-warning' : 'is-success'}`;
        badge.textContent = r.jours < 0 ? `${Math.abs(r.jours)} j. retard` : `${r.jours} j. restants`;
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
  doc.text('Rapport Paiements', 14, 16);
  const body = allRows.map(r => [r.maison, r.locataire, r.montant, r.echeance, r.statut, r.jours]);
  doc.autoTable({
    head: [['Maison', 'Locataire', 'Montant', 'Échéance', 'Statut', 'Jours']],
    body,
    startY: 22
  });
  doc.save('paiements.pdf');
}

loadSheet();
