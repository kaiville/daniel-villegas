/* =============================================
   utils.js — Shared utilities for all pages
   ============================================= */

// --- Toast Notifications ---
// Creates a container once and appends toast messages.
(function initToastContainer() {
  if (!document.getElementById('toast-container')) {
    const el = document.createElement('div');
    el.id = 'toast-container';
    document.body.appendChild(el);
  }
})();

/**
 * Show a toast notification.
 * @param {string} message
 * @param {'default'|'error'|'gold'} type
 */
function showToast(message, type = 'default') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast' + (type !== 'default' ? ` toast-${type}` : '');
  toast.textContent = message;
  container.appendChild(toast);

  // Auto-remove after 2.2s
  setTimeout(() => {
    toast.classList.add('hide');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, 2200);
}

// --- Cart helpers (localStorage) ---
const CART_KEY = 'bottega_cart';

/** Returns the cart array from localStorage. */
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

/** Saves the cart array to localStorage. */
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

/** Adds a product object to the cart. */
function addToCart(product) {
  const cart = getCart();
  cart.push(product);
  saveCart(cart);
  updateCartBadge();
}

/** Removes a cart item by its index. */
function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  updateCartBadge();
}

/** Empties the cart entirely. */
function clearCart() {
  saveCart([]);
  updateCartBadge();
}

/** Counts total items in the cart. */
function getCartCount() {
  return getCart().length;
}

/** Updates the cart badge in the header, if present. */
function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;
  const count = getCartCount();
  badge.textContent = count;
  badge.style.display = count > 0 ? 'inline-flex' : 'none';
}

// --- Store config (localStorage) ---
const CONFIG_KEY = 'bottega_config';

/** Returns the store config object. */
function getConfig() {
  try {
    return JSON.parse(localStorage.getItem(CONFIG_KEY)) || {};
  } catch {
    return {};
  }
}

/** Applies store name and category to header elements if they exist. */
function applyConfig() {
  const cfg = getConfig();
  const nameEl     = document.getElementById('store-name');
  const categoryEl = document.getElementById('store-category');
  if (nameEl && cfg.name)         nameEl.textContent     = cfg.name;
  if (categoryEl && cfg.category) categoryEl.textContent = cfg.category;
  if (cfg.name) document.title = cfg.name;
}

// --- CSV Parser ---
/**
 * Minimal CSV parser (handles quoted fields with commas).
 * Returns an array of objects using the first row as keys.
 * @param {string} text
 * @returns {Array<Object>}
 */
function parseCSV(text) {
  const lines = text.trim().split('\n').map(l => l.replace(/\r$/, ''));
  if (lines.length < 2) return [];

  const headers = splitCSVLine(lines[0]);
  return lines.slice(1).map(line => {
    const values = splitCSVLine(line);
    const obj = {};
    headers.forEach((h, i) => { obj[h.trim()] = (values[i] || '').trim(); });
    return obj;
  }).filter(row => row[headers[0].trim()]); // skip empty rows
}

function splitCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQuotes = !inQuotes; }
    else if (ch === ',' && !inQuotes) { result.push(current); current = ''; }
    else { current += ch; }
  }
  result.push(current);
  return result;
}

// --- URL param helper ---
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// --- Format price ---
function formatPrice(price) {
  const num = parseFloat(price);
  if (isNaN(num)) return price;
  return '€\u00A0' + num.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Run on every page load
document.addEventListener('DOMContentLoaded', () => {
  applyConfig();
  updateCartBadge();
});
