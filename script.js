// 1) ID et URL
const SHEET_ID = '1WWq1qR1PWLVQvxboJ7CUvr2MINVUUvsKqNBkEPVSfvk';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=Maisons&tqx=out:csv`;

// 2) Fonction principale
async function loadSheet() {
  const res  = await fetch(SHEET_URL);
  const csv  = await res.text();
  const rows = csv.split('\n').slice(1);
  const tbody = document.getElementById('data-body');
  tbody.innerHTML = '';

  rows.forEach(row => {
    const cols = row.match(/(".*?"|[^,]+)/g)?.map(c => c.replace(/"/g, '').trim()) || [];
    if (cols.length < 8) return; // ignore lignes incomplètes

    const [Maison, Adresse, Loyer, Locataire, Téléphone, Prochain_paiement, Notes, Documents] = cols;

    const linkCell = Documents
      ? `<a href="${Documents}" target="_blank" class="button is-small is-info">📁 Voir</a>`
      : '';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${Maison}</td>
      <td>${Adresse}</td>
      <td>${Loyer}</td>
      <td>${Locataire}</td>
      <td>${Téléphone}</td>
      <td>${Prochain_paiement}</td>
      <td>${Notes}</td>
      <td>${linkCell}</td>
    `;
    tbody.appendChild(tr);
  });
}

loadSheet();
