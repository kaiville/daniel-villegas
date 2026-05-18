/* =============================================
   product.js — Logica pagina dettaglio prodotto
   Legge ?id= dall'URL, carica prodotti.csv,
   mostra il prodotto e gestisce "Aggiungi al carrello".
   ============================================= */

document.addEventListener('DOMContentLoaded', async () => {
  const productId = parseInt(getParam('id'), 10);
  const wrapper   = document.getElementById('product-detail-wrapper');

  // Anno footer
  const fyEl = document.getElementById('footer-year');
  if (fyEl) fyEl.textContent = new Date().getFullYear();

  // Aggiorna footer con nome negozio
  const cfg = getConfig();
  const footerName = document.getElementById('footer-name');
  if (footerName && cfg.name) footerName.textContent = cfg.name;

  // Validazione ID
  if (isNaN(productId)) {
    showError(wrapper, 'Prodotto non trovato. ID non valido.');
    return;
  }

  // Carica il CSV
  let products;
  try {
    const res = await fetch('prodotti.csv');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    products = parseCSV(await res.text());
  } catch (err) {
    showError(wrapper, '⚠️  Impossibile caricare il catalogo prodotti.');
    return;
  }

  const product = products[productId];
  if (!product) {
    showError(wrapper, 'Prodotto non trovato nel catalogo.');
    return;
  }

  // Aggiorna breadcrumb e titolo
  document.getElementById('breadcrumb-name').textContent = product.nome || 'Prodotto';
  document.title = (product.nome || 'Prodotto') + ' — ' + (cfg.name || 'Negozio');

  // Costruisce il layout dettaglio con createElement
  wrapper.innerHTML = '';
  const section = document.createElement('section');
  section.className = 'product-detail';

  // --- Colonna immagine ---
  const imgWrap = document.createElement('div');
  imgWrap.className = 'detail-img-wrap';
  const img = document.createElement('img');
  img.src   = product.immagine || 'assets/placeholder.jpg';
  img.alt   = product.nome || '';
  img.onerror = () => { img.src = 'assets/placeholder.jpg'; };
  imgWrap.appendChild(img);

  // --- Colonna info ---
  const info = document.createElement('div');
  info.className = 'detail-info';

  const brand = document.createElement('p');
  brand.className = 'detail-brand';
  brand.textContent = product.marca || '';

  const name = document.createElement('h1');
  name.className = 'detail-name';
  name.textContent = product.nome || '(senza nome)';

  const price = document.createElement('p');
  price.className = 'detail-price';
  price.textContent = formatPrice(product.prezzo);

  const desc = document.createElement('p');
  desc.className = 'detail-desc';
  desc.textContent = product.descrizione || product.descrizione_breve || '';

  // Pulsanti azione
  const actions = document.createElement('div');
  actions.className = 'detail-actions';

  const btnCart = document.createElement('button');
  btnCart.className = 'btn btn-gold';
  btnCart.textContent = 'Aggiungi al carrello';
  btnCart.addEventListener('click', () => {
    addToCart({
      id:          productId,
      nome:        product.nome,
      marca:       product.marca,
      descrizione: product.descrizione_breve || product.descrizione,
      prezzo:      product.prezzo,
      immagine:    product.immagine
    });
    showToast('Prodotto aggiunto al carrello 🛒', 'gold');
  });

  const btnBack = document.createElement('a');
  btnBack.className = 'btn btn-outline';
  btnBack.href      = 'index.html';
  btnBack.textContent = '← Torna al catalogo';

  actions.appendChild(btnCart);
  actions.appendChild(btnBack);

  info.appendChild(brand);
  info.appendChild(name);
  info.appendChild(price);
  info.appendChild(desc);
  info.appendChild(actions);

  section.appendChild(imgWrap);
  section.appendChild(info);
  wrapper.appendChild(section);
});

// Mostra un messaggio di errore
function showError(container, message) {
  container.innerHTML = '';
  const p = document.createElement('p');
  p.className = 'no-results';
  p.textContent = message;
  container.appendChild(p);
}
