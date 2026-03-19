document.addEventListener("DOMContentLoaded", function () {
 
  /* ===========================
     DARK MODE
  =========================== */
  const toggleBtn = document.getElementById("darkToggle");
 
  // Applica tema salvato subito
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
 
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const isDark = document.body.classList.contains("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }
 
  /* ===========================
     LOGO TORNA SU
  =========================== */
  const logo = document.getElementById("logo");
  if (logo) {
    logo.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
 
 
  /* ===========================
     BRANDS & TIPI PRODOTTI
  =========================== */
  const brands = [
    "Adidas","Armani","Balenciaga","Bape","Bottega Veneta","Burberry",
    "Calvin Klein","Canada Goose","Chrome Hearts","Converse","Dsquared2","Denim Tears",
    "Diesel","Dior","Fear of God","Ferragamo","Gallery Dept","Givenchy",
    "Gucci","Hermes","Hugo Boss","Jordan","Lanvin","Louis Vuitton","Levi's",
    "Maison Margiela","McQ Alexander McQueen","Moncler","Moschino",
    "New Balance","Nike","Off-White","Palm Angels","Prada",
    "Ralph Lauren","Rick Owens","Rimowa","Stone Island",
    "Supreme","Tommy Hilfiger","Versace","Yeezy"
  ];
 
  const productTypes = [
    "Tee","Oversized Tee","Street Hoodie","Classic Hoodie",
    "Logo Tee","Zip Hoodie","Street Jacket","Crewneck","Beanie","Cap"
  ];
 
  /* CATEGORIE — ora in minuscolo per matchare i data-category dei tab */
  const categories = ["magliette","felpe","jeans","pantaloni","altri"];
 
  const productsContainer = document.getElementById("productsContainer");
  const products = [];
 
  /* Genera 80 prodotti */
  for (let i = 0; i < 80; i++) {
    const brand    = brands[Math.floor(Math.random() * brands.length)];
    const type     = productTypes[Math.floor(Math.random() * productTypes.length)];
    const price    = Math.floor(Math.random() * 250) + 40;
    const category = categories[Math.floor(Math.random() * categories.length)];
    const imgIndex = Math.floor(Math.random() * 5) + 1;
 
    products.push({
      name:     brand + " " + type,
      brand:    brand,
      price:    "€" + price,
      category: category,
      img:      "img/products/product" + imgIndex + ".jpg"
    });
  }
 
 
  /* ===========================
     RENDER PRODOTTI
  =========================== */
  function renderProducts(list) {
    if (!productsContainer) return;
    productsContainer.innerHTML = "";
 
    list.forEach((product, index) => {
      const card = document.createElement("div");
      card.classList.add("product-card");
      card.dataset.category = product.category;
      card.dataset.brand    = product.brand;
 
      /* Stagger: ogni card parte un po' dopo */
      card.style.animationDelay = (index * 40) + "ms";
 
      card.innerHTML = `
        <img src="${product.img}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${product.price}</p>
      `;
 
      productsContainer.appendChild(card);
    });
 
    attachProductEvents();
  }
 
  renderProducts(products);
 
 
  /* ===========================
     FILTRO CATEGORIE
  =========================== */
  const tabButtons = document.querySelectorAll(".tab-btn");
 
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
 
      const category = btn.dataset.category;
      const filtered = category === "all"
        ? products
        : products.filter(p => p.category === category);
 
      renderProducts(filtered);
    });
  });
 
 
  /* ===========================
     RICERCA PRODOTTI
  =========================== */
  const productSearch = document.getElementById("productSearch");
 
  if (productSearch) {
    productSearch.addEventListener("input", () => {
      const value = productSearch.value.toLowerCase();
      const filtered = products.filter(p => p.name.toLowerCase().includes(value));
      renderProducts(filtered);
    });
  }
 
 
  /* ===========================
     MODALE PRODOTTO
     Usa classe .open per animazione CSS
  =========================== */
  const modal      = document.getElementById("productModal");
  const modalImg   = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const modalPrice = document.getElementById("modalPrice");
  const closeModal = document.getElementById("closeModal");
 
  function openModal(img, title, price) {
    modalImg.src          = img;
    modalTitle.textContent = title;
    modalPrice.textContent = price;
 
    modal.style.display = "flex";
    /* Piccolo delay per far partire la transizione CSS */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => modal.classList.add("open"));
    });
  }
 
  function closeModalFn() {
    modal.classList.remove("open");
    setTimeout(() => { modal.style.display = "none"; }, 350);
  }
 
  function attachProductEvents() {
    document.querySelectorAll(".product-card").forEach(card => {
      card.addEventListener("click", () => {
        openModal(
          card.querySelector("img").src,
          card.querySelector("h3").textContent,
          card.querySelector("p").textContent
        );
      });
    });
  }
 
  if (closeModal) closeModal.addEventListener("click", closeModalFn);
 
  window.addEventListener("click", e => {
    if (e.target === modal) closeModalFn();
  });
 
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModalFn();
  });
 
 
  /* ===========================
     FRECCIA TORNA SU
  =========================== */
  const backToTop = document.getElementById("backToTop");
 
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("show", window.scrollY > 300);
    });
 
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
 
 
  /* ===========================
     SCROLL REVEAL
     Aggiunge .visible quando l'elemento entra in vista
  =========================== */
  const revealEls = document.querySelectorAll(
    ".catalogo h2, .brands-section h1, footer, .reveal"
  );
 
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
 
  revealEls.forEach(el => observer.observe(el));
 
 
  /* ===========================
     STAGGER LETTERE ALFABETO (brands.html)
  =========================== */
  document.querySelectorAll(".alphabet button").forEach((btn, i) => {
    btn.style.animationDelay = (i * 30) + "ms";
  });
 
 
  /* ===========================
     TRANSIZIONE PAGINA
  =========================== */
  document.querySelectorAll("a[href]").forEach(link => {
    link.addEventListener("click", function (e) {
      const url = this.getAttribute("href");
      if (url && url.includes(".html")) {
        e.preventDefault();
        document.body.classList.add("fade-out");
        setTimeout(() => { window.location.href = url; }, 400);
      }
    });
  });
 
});
 
