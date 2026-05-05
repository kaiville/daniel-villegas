document.addEventListener("DOMContentLoaded", function () {

  /* ===========================
     DARK MODE
  =========================== */
  const toggleBtn = document.getElementById("darkToggle");
  if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
    });
  }

  /* ===========================
     LOGO TORNA SU
  =========================== */
  const logo = document.getElementById("logo");
  if (logo) logo.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ===========================
     WISHLIST (localStorage)
  =========================== */
  function getWishlist() {
    return JSON.parse(localStorage.getItem("wishlist") || "[]");
  }

  function saveWishlist(list) {
    localStorage.setItem("wishlist", JSON.stringify(list));
  }

  function isWished(name) {
    return getWishlist().some(p => p.name === name);
  }

  function toggleWish(product) {
    let list = getWishlist();
    if (list.some(p => p.name === product.name)) {
      list = list.filter(p => p.name !== product.name);
    } else {
      list.push(product);
    }
    saveWishlist(list);
    updateWishCount();
  }

  function updateWishCount() {
    const count = getWishlist().length;
    document.querySelectorAll(".wish-count").forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? "flex" : "none";
    });
  }

  /* ===========================
     DATI PRODOTTI
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

  const categories = ["magliette","felpe","jeans","pantaloni","altri"];

  const productsContainer = document.getElementById("productsContainer");
  const products = [];

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
      const wished = isWished(product.name);
      const card = document.createElement("div");
      card.classList.add("product-card");
      card.dataset.category = product.category;
      card.dataset.brand    = product.brand;
      card.style.animationDelay = (index * 40) + "ms";

      card.innerHTML = `
        <div class="card-img-wrap">
          <img src="${product.img}" alt="${product.name}" onerror="this.style.display='none'">
          <button class="wish-btn ${wished ? "active" : ""}" data-name="${product.name}" title="Aggiungi ai preferiti">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="${wished ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
        <div class="card-info">
          <span class="card-category">${product.category}</span>
          <h3>${product.name}</h3>
          <p>${product.price}</p>
        </div>
      `;

      /* Click cuore — non apre modale */
      card.querySelector(".wish-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        toggleWish(product);
        const btn = e.currentTarget;
        const svg = btn.querySelector("svg");
        const active = btn.classList.toggle("active");
        svg.setAttribute("fill", active ? "currentColor" : "none");

        /* Micro animazione */
        btn.classList.add("pop");
        setTimeout(() => btn.classList.remove("pop"), 300);
      });

      /* Click card → modale */
      card.addEventListener("click", () => {
        openModal(product);
      });

      productsContainer.appendChild(card);
    });

    updateWishCount();
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
      renderProducts(category === "all" ? products : products.filter(p => p.category === category));
    });
  });

  /* ===========================
     RICERCA PRODOTTI
  =========================== */
  const productSearch = document.getElementById("productSearch");
  if (productSearch) {
    productSearch.addEventListener("input", () => {
      const value = productSearch.value.toLowerCase();
      renderProducts(products.filter(p => p.name.toLowerCase().includes(value)));
    });
  }

  /* ===========================
     MODALE PRODOTTO
  =========================== */
  const modal      = document.getElementById("productModal");
  const modalImg   = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const modalPrice = document.getElementById("modalPrice");
  const modalWish  = document.getElementById("modalWish");
  const closeModal = document.getElementById("closeModal");

  function openModal(product) {
    if (!modal) return;
    modalImg.src            = product.img;
    modalTitle.textContent  = product.name;
    modalPrice.textContent  = product.price;

    if (modalWish) {
      const wished = isWished(product.name);
      modalWish.classList.toggle("active", wished);
      modalWish.querySelector("svg").setAttribute("fill", wished ? "currentColor" : "none");

      modalWish.onclick = () => {
        toggleWish(product);
        const active = !isWished(product.name) ? false : true;
        modalWish.classList.toggle("active", active);
        modalWish.querySelector("svg").setAttribute("fill", active ? "currentColor" : "none");
        modalWish.classList.add("pop");
        setTimeout(() => modalWish.classList.remove("pop"), 300);
        /* Aggiorna anche il cuore nella card */
        document.querySelectorAll(`.wish-btn[data-name="${product.name}"]`).forEach(btn => {
          btn.classList.toggle("active", active);
          btn.querySelector("svg").setAttribute("fill", active ? "currentColor" : "none");
        });
      };
    }

    modal.style.display = "flex";
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add("open")));
  }

  function closeModalFn() {
    if (!modal) return;
    modal.classList.remove("open");
    setTimeout(() => { modal.style.display = "none"; }, 350);
  }

  if (closeModal) closeModal.addEventListener("click", closeModalFn);
  window.addEventListener("click", e => { if (e.target === modal) closeModalFn(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModalFn(); });

  /* ===========================
     FRECCIA TORNA SU
  =========================== */
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", () => backToTop.classList.toggle("show", window.scrollY > 300));
    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ===========================
     SCROLL REVEAL
  =========================== */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(".catalogo h2, .brands-section h1, footer, .reveal")
    .forEach(el => observer.observe(el));

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

  /* Aggiorna contatore wishlist all'avvio */
  updateWishCount();

});
