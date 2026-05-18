/* =============================================
   catalog.js — Logica catalogo prodotti
   Carica prodotti.csv, genera le card, gestisce
   ricerca e ordinamento.
   ============================================= */

let allProducts = []; // cache globale dei prodotti

// --- Aggiorna il titolo dell'hero con il nome negozio ---
function updateHero() {
  const cfg = getConfig();
  if (cfg.name)     document.getElementById('hero-title').textContent   = cfg.name;
  if (cfg.category) document.getElementById('hero-subtitle').textContent = cfg.category;
  const footerName = document.getElementById('footer-name');
  if (footerName && cfg.name) footerName.textContent = cfg.name;
}

// --- Carica il CSV e avvia il rendering ---
async function loadProducts() {
  try {
    const response = await fetch('prodotti.csv');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const text = await response.text();
    allProducts = parseCSV(text);
    renderProducts(allProducts);
  } catch (err) {
    console.error('Errore caricamento CSV:', err);
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    const msg = document.createElement('p');
    msg.className = 'no-results';
    msg.textContent = '⚠️  Impossibile caricare il catalogo. Assicurati che prodotti.csv sia nella stessa cartella.';
    grid.appendChild(msg);
  }
}

// --- Crea una card prodotto tramite createElement ---
function createProductCard(product, index) {
  // Wrapper card
  const card = document.createElement('article');
  card.className = 'product-card';

  // Immagine
  const imgWrap = document.createElement('div');
  imgWrap.className = 'card-img-wrap';
  const img = document.createElement('img');
  img.src   = product.immagine || 'assets/placeholder.jpg';
  img.alt   = product.nome || '';
  img.loading = 'lazy';
  img.onerror = () => { img.src = 'assets/placeholder.jpg'; };
  imgWrap.appendChild(img);

  // Body
  const body = document.createElement('div');
  body.className = 'card-body';

  const brand = document.createElement('p');
  brand.className = 'card-brand';
  brand.textContent = product.marca || '';

  const name = document.createElement('h3');
  name.className = 'card-name';
  name.textContent = product.nome || '(senza nome)';

  const desc = document.createElement('p');
  desc.className = 'card-desc';
  desc.textContent = product.descrizione_breve || product.descrizione || '';

  // Footer della card (prezzo + pulsante)
  const footer = document.createElement('div');
  footer.className = 'card-footer';

  const price = document.createElement('span');
  price.className = 'card-price';
  price.textContent = formatPrice(product.prezzo);

  const btn = document.createElement('a');
  btn.className = 'btn btn-primary btn-sm';
  btn.href = `prodotto.html?id=${index}`;
  btn.textContent = 'Dettagli';

  footer.appendChild(price);
  footer.appendChild(btn);

  body.appendChild(brand);
  body.appendChild(name);
  body.appendChild(desc);
  body.appendChild(footer);

  card.appendChild(imgWrap);
  card.appendChild(body);

  return card;
}

// --- Renderizza l'array di prodotti nella griglia ---
function renderProducts(products) {
  const grid = document.getElementById('products-grid');
  grid.innerHTML = '';

  if (products.length === 0) {
    const msg = document.createElement('p');
    msg.className = 'no-results';
    msg.textContent = 'Nessun prodotto trovato.';
    grid.appendChild(msg);
    return;
  }

  // Usa un DocumentFragment per efficienza
  const fragment = document.createDocumentFragment();
  products.forEach((p, i) => {
    // L'indice reale nel CSV serve per il link al dettaglio
    fragment.appendChild(createProductCard(p, p._originalIndex));
  });
  grid.appendChild(fragment);
}

// --- Filtra e ordina ---
function applyFilters() {
  const query = document.getElementById('search-input').value.toLowerCase().trim();
  const sort  = document.getElementById('sort-select').value;

  let filtered = allProducts.filter(p => {
    const hay = [p.nome, p.marca, p.descrizione_breve, p.descrizione].join(' ').toLowerCase();
    return hay.includes(query);
  });

  filtered.sort((a, b) => {
    switch (sort) {
      case 'price-asc':  return parseFloat(a.prezzo) - parseFloat(b.prezzo);
      case 'price-desc': return parseFloat(b.prezzo) - parseFloat(a.prezzo);
      case 'name-asc':   return (a.nome || '').localeCompare(b.nome || '', 'it');
      case 'name-desc':  return (b.nome || '').localeCompare(a.nome || '', 'it');
      default: return 0;
    }
  });

  renderProducts(filtered);
}

// --- Init ---
document.addEventListener('DOMContentLoaded', async () => {
  // Se la configurazione non è presente, manda alla pagina ini
  const cfg = getConfig();
  if (!cfg.name) {
    window.location.href = 'ini.html';
    return;
  }

  // Anno footer
  const fyEl = document.getElementById('footer-year');
  if (fyEl) fyEl.textContent = new Date().getFullYear();

  updateHero();

  // Carica prodotti e aggiungi _originalIndex per navigazione
  await loadProducts();
  allProducts = allProducts.map((p, i) => ({ ...p, _originalIndex: i }));

  // Event listeners ricerca e ordinamento
  document.getElementById('search-input').addEventListener('input', applyFilters);
  document.getElementById('sort-select').addEventListener('change', applyFilters);
});
