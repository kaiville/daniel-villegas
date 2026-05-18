/* =============================================
   cart.js — Logica carrello acquisti
   Gestisce visualizzazione, rimozione, svuotamento
   e generazione PDF ordine con jsPDF.
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  // Anno footer
  const fyEl = document.getElementById('footer-year');
  if (fyEl) fyEl.textContent = new Date().getFullYear();

  const cfg = getConfig();
  const footerName = document.getElementById('footer-name');
  if (footerName && cfg.name) footerName.textContent = cfg.name;

  renderCart();
});

// --- Calcola il totale del carrello ---
function calcTotal(cart) {
  return cart.reduce((sum, item) => sum + (parseFloat(item.prezzo) || 0), 0);
}

// --- Rende il carrello nella pagina ---
function renderCart() {
  const cart    = getCart();
  const content = document.getElementById('cart-content');
  content.innerHTML = '';

  // Carrello vuoto
  if (cart.length === 0) {
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'cart-empty';

    const icon = document.createElement('div');
    icon.className   = 'cart-empty-icon';
    icon.textContent = '🛒';

    const h3 = document.createElement('h3');
    h3.textContent = 'Il carrello è vuoto';

    const p = document.createElement('p');
    p.textContent = 'Aggiungi qualche prodotto dal catalogo.';
    p.style.marginBottom = '28px';

    const link = document.createElement('a');
    link.href = 'index.html';
    link.className = 'btn btn-primary';
    link.textContent = '← Vai al catalogo';

    emptyDiv.appendChild(icon);
    emptyDiv.appendChild(h3);
    emptyDiv.appendChild(p);
    emptyDiv.appendChild(link);
    content.appendChild(emptyDiv);
    return;
  }

  // Layout a due colonne
  const layout = document.createElement('div');
  layout.className = 'cart-layout';

  // --- Colonna sinistra: lista prodotti ---
  const leftCol = document.createElement('div');

  const headerRow = document.createElement('div');
  headerRow.className = 'cart-header-row';

  const title = document.createElement('h1');
  title.className = 'cart-title';
  title.textContent = 'Il tuo carrello';

  const btnClear = document.createElement('button');
  btnClear.className   = 'btn btn-danger btn-sm';
  btnClear.textContent = 'Svuota carrello';
  btnClear.addEventListener('click', handleClearCart);

  headerRow.appendChild(title);
  headerRow.appendChild(btnClear);

  const itemsList = document.createElement('div');
  itemsList.className = 'cart-items-list';
  itemsList.id        = 'cart-items-list';

  cart.forEach((item, index) => {
    itemsList.appendChild(createCartItem(item, index));
  });

  leftCol.appendChild(headerRow);
  leftCol.appendChild(itemsList);

  // --- Colonna destra: riepilogo ordine ---
  const rightCol   = buildOrderSummary(cart);

  layout.appendChild(leftCol);
  layout.appendChild(rightCol);
  content.appendChild(layout);
}

// --- Crea un elemento carrello ---
function createCartItem(item, index) {
  const el = document.createElement('div');
  el.className = 'cart-item';
  el.dataset.index = index;

  // Immagine
  const img = document.createElement('img');
  img.className = 'cart-item-img';
  img.src = item.immagine || 'assets/placeholder.jpg';
  img.alt = item.nome || '';
  img.onerror = () => { img.src = 'assets/placeholder.jpg'; };

  // Info
  const info = document.createElement('div');
  info.className = 'cart-item-info';

  const name = document.createElement('h3');
  name.className   = 'cart-item-name';
  name.textContent = item.nome || '(senza nome)';

  const desc = document.createElement('p');
  desc.className   = 'cart-item-desc';
  desc.textContent = item.descrizione || '';

  const price = document.createElement('p');
  price.className   = 'cart-item-price';
  price.textContent = formatPrice(item.prezzo);

  // Pulsante rimuovi
  const btnRemove = document.createElement('button');
  btnRemove.className   = 'btn btn-outline btn-sm';
  btnRemove.textContent = '✕ Rimuovi';
  btnRemove.style.marginTop = '12px';
  btnRemove.addEventListener('click', () => handleRemoveItem(index));

  info.appendChild(name);
  info.appendChild(desc);
  info.appendChild(price);
  info.appendChild(btnRemove);

  el.appendChild(img);
  el.appendChild(info);
  return el;
}

// --- Costruisce il pannello riepilogo ordine ---
function buildOrderSummary(cart) {
  const total = calcTotal(cart);

  const panel = document.createElement('aside');
  panel.className = 'order-summary';

  const title = document.createElement('h2');
  title.className   = 'summary-title';
  title.textContent = 'Riepilogo ordine';

  // Riga numero articoli
  const rowItems = document.createElement('div');
  rowItems.className = 'summary-row';
  const labelItems = document.createElement('span');
  labelItems.textContent = 'Articoli';
  const valueItems = document.createElement('span');
  valueItems.textContent = cart.length;
  rowItems.appendChild(labelItems);
  rowItems.appendChild(valueItems);

  // Riga totale
  const totalRow = document.createElement('div');
  totalRow.className = 'summary-total';
  const totalLabel = document.createElement('span');
  totalLabel.className   = 'summary-total-label';
  totalLabel.textContent = 'Totale';
  const totalAmount = document.createElement('span');
  totalAmount.className   = 'summary-total-amount';
  totalAmount.textContent = formatPrice(total);
  totalRow.appendChild(totalLabel);
  totalRow.appendChild(totalAmount);

  // Pulsanti azione
  const actions = document.createElement('div');
  actions.className = 'summary-actions';

  const btnPdf = document.createElement('button');
  btnPdf.className   = 'btn btn-gold';
  btnPdf.textContent = '📄 Scarica PDF ordine';
  btnPdf.addEventListener('click', generateOrderPDF);

  const btnContinue = document.createElement('a');
  btnContinue.href      = 'index.html';
  btnContinue.className = 'btn btn-outline';
  btnContinue.textContent = '← Continua gli acquisti';

  actions.appendChild(btnPdf);
  actions.appendChild(btnContinue);

  panel.appendChild(title);
  panel.appendChild(rowItems);
  panel.appendChild(totalRow);
  panel.appendChild(actions);
  return panel;
}

// --- Handler: rimuovi un prodotto ---
function handleRemoveItem(index) {
  removeFromCart(index);
  showToast('Prodotto rimosso dal carrello');
  renderCart();
}

// --- Handler: svuota carrello ---
function handleClearCart() {
  clearCart();
  showToast('Carrello svuotato', 'error');
  renderCart();
}

// =============================================
// GENERAZIONE PDF ORDINE con jsPDF
// =============================================
function generateOrderPDF() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('Il carrello è vuoto', 'error');
    return;
  }

  const cfg   = getConfig();
  const { jsPDF } = window.jspdf;
  const doc   = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // --- Costanti layout ---
  const pageW    = 210;
  const pageH    = 297;
  const margin   = 20;
  const contentW = pageW - margin * 2;
  let   y        = 0; // cursore verticale corrente

  // --- Funzione per aggiungere una nuova pagina ---
  function addPage() {
    doc.addPage();
    y = margin;
    drawPageFooter();
  }

  // --- Controlla se c'è spazio sufficiente ---
  function checkSpace(needed) {
    if (y + needed > pageH - 25) addPage();
  }

  // --- Footer di pagina ---
  function drawPageFooter() {
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `${cfg.name || 'Negozio'} — Documento generato il ${new Date().toLocaleDateString('it-IT')}`,
      pageW / 2,
      pageH - 10,
      { align: 'center' }
    );
    doc.setTextColor(0);
  }

  // ---- PRIMA PAGINA ----

  // Header verde
  doc.setFillColor(44, 74, 62); // --green
  doc.rect(0, 0, pageW, 48, 'F');

  // Nome negozio
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(224, 192, 122); // --gold-light
  doc.text(cfg.name || 'Bottega Verde', pageW / 2, 22, { align: 'center' });

  // Categoria
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(247, 243, 236);
  doc.text((cfg.category || 'Riepilogo ordine').toUpperCase(), pageW / 2, 34, { align: 'center' });

  // Data
  doc.setFontSize(9);
  doc.setTextColor(200, 200, 200);
  doc.text(new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' }), pageW / 2, 43, { align: 'center' });

  y = 58;

  // Titolo sezione
  doc.setTextColor(0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Riepilogo ordine', margin, y);
  y += 6;

  // Linea separatrice
  doc.setDrawColor(44, 74, 62);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // Intestazione colonne
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100);
  doc.text('PRODOTTO',        margin,             y);
  doc.text('MARCA',           margin + 80,        y);
  doc.text('PREZZO',          pageW - margin,     y, { align: 'right' });
  y += 5;

  doc.setDrawColor(200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
  y += 6;

  // --- Righe prodotti ---
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30);

  cart.forEach((item, i) => {
    checkSpace(18);

    // Sfondo zebra per righe pari
    if (i % 2 === 0) {
      doc.setFillColor(245, 242, 236);
      doc.rect(margin - 2, y - 4, contentW + 4, 14, 'F');
    }

    // Nome prodotto (con a-capo automatico se lungo)
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    const nameLine = doc.splitTextToSize(item.nome || '—', 72);
    doc.text(nameLine, margin, y);

    // Marca
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80);
    doc.text(item.marca || '—', margin + 80, y);

    // Prezzo
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 74, 62);
    doc.text(formatPrice(item.prezzo), pageW - margin, y, { align: 'right' });

    // Descrizione breve sotto
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(130);
    const descLine = doc.splitTextToSize(item.descrizione || '', 90);
    doc.text(descLine, margin, y + 4.5);

    doc.setTextColor(30);
    y += 14;
  });

  // Separatore totale
  y += 4;
  checkSpace(20);
  doc.setDrawColor(44, 74, 62);
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // Totale
  const total = calcTotal(cart);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0);
  doc.text('TOTALE ORDINE', margin, y);
  doc.setTextColor(44, 74, 62);
  doc.text(formatPrice(total), pageW - margin, y, { align: 'right' });
  y += 10;

  // Nota informativa
  checkSpace(16);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(160);
  doc.text('Documento non fiscale — generato automaticamente dal sistema.', pageW / 2, y, { align: 'center' });

  // Footer prima pagina
  drawPageFooter();

  // Scarica il PDF
  const filename = `ordine_${(cfg.name || 'negozio').replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.pdf`;
  doc.save(filename);
  showToast('PDF scaricato con successo 📄', 'gold');
}
