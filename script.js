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

    const [maison, adresse, loyer, locataire, tel, date, notes, driveLink] = cols;

    // 3) bouton Drive ou rien si vide
    const linkCell = driveLink
      ? `<a href="${driveLink}" target="_blank" class="button is-small is-info">📁 Voir</a>`
      : '';

    // 4) injection HTML
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${maison}</td>
      <td>${adresse}</td>
      <td>${loyer}</td>
      <td>${locataire}</td>
      <td>${tel}</td>
      <td>${date}</td>
      <td>${notes}</td>
      <td>${linkCell}</td>
    `;
    tbody.appendChild(tr);
  });
}

// 5) lancement
loadSheet();
