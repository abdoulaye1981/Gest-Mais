// 1) ID et URL de la feuille Google Sheets
const SHEET_ID = '1WWq1qR1PWLVQvxboJ7CUvr2MINVUUvsKqNBkEPVSfvk';
const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=Maisons&tqx=out:csv`;

// 2) Fonction principale
async function loadSheet() {
  const res  = await fetch(SHEET_URL);
  const csv  = await res.text();
  const rows = csv.split('\n').slice(1);         // retire l’en-tête
  const tbody = document.getElementById('data-body');
  tbody.innerHTML = '';

  rows.forEach(row => {
    // découpe robuste CSV
    const cols = row.match(/(".*?"|[^,]+)/g)?.map(c => c.replace(/"/g, '').trim()) || [];
    if (cols.length < 8) return;                 // on attend 8 colonnes (inclut Drive_Link)

    const [Maison, Adresse, Loyer, Locataire, Téléphone, Prochain_paiement, Notes, Documents] = cols;

    // 3) bouton Drive ou rien si vide
    const linkCell = Documents
      ? `<a href="${Documents}" target="_blank" class="button is-small is-info">📁 Voir</a>`
      : '';

    // 4) injection HTML
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${Maison}</td>
      <td>${Adresse}</td>
      <td>${Loyer}</td>
      <td>${Locataire}</td>
      <td>${Téléphone}</td>
      <td>${Prochain_paiement}</td>
      <td>${Notes}</td>
      <td>${Documents}</td>
    `;
    tbody.appendChild(tr);
  });
}

// 5) lancement
loadSheet();
