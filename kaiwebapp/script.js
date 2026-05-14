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
     HAMBURGER MENU
  =========================== */
  const hamburger = document.getElementById("hamburger");
  const navLinks  = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("open");
      navLinks.classList.toggle("open");
    });

    /* Chiude il menu quando si clicca un link */
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("open");
        navLinks.classList.remove("open");
      });
    });
  }

  /* ===========================
     CARRELLO (localStorage)
  =========================== */
  function getCart() {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  }

  function saveCart(list) {
    localStorage.setItem("cart", JSON.stringify(list));
  }

  function addToCart(product, taglia) {
    let cart = getCart();
    const existing = cart.find(i => i.name === product.name && i.taglia === taglia);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, taglia, qty: 1 });
    }
    saveCart(cart);
    updateCartCount();
  }

  function updateCartCount() {
    const count = getCart().reduce((sum, i) => sum + i.qty, 0);
    document.querySelectorAll(".cart-count").forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? "flex" : "none";
    });
  }


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
     PRODOTTI FISSI
  =========================== */
  const products = [

    /* ---- MAGLIETTE ---- */
    { name: "Nike Essential Tee",            brand: "Nike",            price: "€45",  category: "magliette", img: "immagini/nike-essential-tee.jpg" },
    { name: "Nike Logo Tee",                 brand: "Nike",            price: "€50",  category: "magliette", img: "immagini/nike-logo-tee.jpg" },
    { name: "Adidas Trefoil Tee",            brand: "Adidas",          price: "€40",  category: "magliette", img: "immagini/adidas-trefoil-tee.jpg" },
    { name: "Adidas Originals Tee",          brand: "Adidas",          price: "€45",  category: "magliette", img: "immagini/adidas-originals-tee.jpg" },
    { name: "Supreme Box Logo Tee",          brand: "Supreme",         price: "€160", category: "magliette", img: "immagini/supreme-box-logo-tee.jpg" },
    { name: "Off-White Arrow Tee",           brand: "Off-White",       price: "€280", category: "magliette", img: "immagini/offwhite-arrow-tee.jpg" },
    { name: "Gucci Logo Tee",                brand: "Gucci",           price: "€420", category: "magliette", img: "immagini/gucci-logo-tee.jpg" },
    { name: "Palm Angels Burning Tee",       brand: "Palm Angels",     price: "€310", category: "magliette", img: "immagini/palmangels-burning-tee.jpg" },
    { name: "Stone Island Patch Tee",        brand: "Stone Island",    price: "€120", category: "magliette", img: "immagini/stoneisland-patch-tee.jpg" },
    { name: "Balenciaga Oversized Tee",      brand: "Balenciaga",      price: "€490", category: "magliette", img: "immagini/balenciaga-oversized-tee.jpg" },
    { name: "Fear of God Essential Tee",     brand: "Fear of God",     price: "€95",  category: "magliette", img: "immagini/fog-essential-tee.jpg" },
    { name: "Gallery Dept Paint Tee",        brand: "Gallery Dept",    price: "€220", category: "magliette", img: "immagini/gallerydept-paint-tee.jpg" },
    { name: "Ralph Lauren Classic Tee",      brand: "Ralph Lauren",    price: "€75",  category: "magliette", img: "immagini/ralphlauren-classic-tee.jpg" },
    { name: "Tommy Hilfiger Flag Tee",       brand: "Tommy Hilfiger",  price: "€55",  category: "magliette", img: "immagini/tommy-flag-tee.jpg" },
    { name: "Calvin Klein CK Tee",           brand: "Calvin Klein",    price: "€60",  category: "magliette", img: "immagini/ck-tee.jpg" },

    /* ---- FELPE ---- */
    { name: "Nike Tech Fleece Hoodie",       brand: "Nike",            price: "€130", category: "felpe", img: "immagini/nike-tech-hoodie.jpg" },
    { name: "Nike Club Crewneck",            brand: "Nike",            price: "€80",  category: "felpe", img: "immagini/nike-club-crew.jpg" },
    { name: "Adidas Hoodie 3-Stripes",       brand: "Adidas",          price: "€85",  category: "felpe", img: "immagini/adidas-hoodie-3stripes.jpg" },
    { name: "Supreme Box Logo Hoodie",       brand: "Supreme",         price: "€380", category: "felpe", img: "immagini/supreme-box-hoodie.jpg" },
    { name: "Off-White Diag Hoodie",         brand: "Off-White",       price: "€520", category: "felpe", img: "immagini/offwhite-diag-hoodie.jpg" },
    { name: "Stone Island Zip Hoodie",       brand: "Stone Island",    price: "€290", category: "felpe", img: "immagini/stoneisland-zip-hoodie.jpg" },
    { name: "Fear of God Essentials Hoodie", brand: "Fear of God",     price: "€150", category: "felpe", img: "immagini/fog-essentials-hoodie.jpg" },
    { name: "Balenciaga Logo Hoodie",        brand: "Balenciaga",      price: "€650", category: "felpe", img: "immagini/balenciaga-logo-hoodie.jpg" },
    { name: "Palm Angels Classic Hoodie",    brand: "Palm Angels",     price: "€390", category: "felpe", img: "immagini/palmangels-classic-hoodie.jpg" },
    { name: "Moncler Logo Crewneck",         brand: "Moncler",         price: "€420", category: "felpe", img: "immagini/moncler-logo-crew.jpg" },
    { name: "Ralph Lauren Fleece Hoodie",    brand: "Ralph Lauren",    price: "€120", category: "felpe", img: "immagini/ralphlauren-fleece-hoodie.jpg" },
    { name: "Tommy Hilfiger Zip Hoodie",     brand: "Tommy Hilfiger",  price: "€110", category: "felpe", img: "immagini/tommy-zip-hoodie.jpg" },

    /* ---- JEANS ---- */
    { name: "Levi's 501 Original",           brand: "Levi's",          price: "€110", category: "jeans", img: "immagini/levis-501.jpg" },
    { name: "Levi's 514 Straight",           brand: "Levi's",          price: "€100", category: "jeans", img: "immagini/levis-514.jpg" },
    { name: "Diesel D-Macs Jeans",           brand: "Diesel",          price: "€180", category: "jeans", img: "immagini/diesel-dmacs.jpg" },
    { name: "Diesel D-Strukt Slim",          brand: "Diesel",          price: "€160", category: "jeans", img: "immagini/diesel-dstrukt.jpg" },
    { name: "Dsquared2 Cool Guy Jeans",      brand: "Dsquared2",       price: "€380", category: "jeans", img: "immagini/dsquared-coolguy.jpg" },
    { name: "Dsquared2 Skater Jeans",        brand: "Dsquared2",       price: "€350", category: "jeans", img: "immagini/dsquared-skater.jpg" },
    { name: "Armani Exchange Slim Jeans",    brand: "Armani",          price: "€140", category: "jeans", img: "immagini/armani-slim-jeans.jpg" },
    { name: "Calvin Klein Straight Jeans",   brand: "Calvin Klein",    price: "€120", category: "jeans", img: "immagini/ck-straight-jeans.jpg" },
    { name: "Givenchy Destroyed Jeans",      brand: "Givenchy",        price: "€490", category: "jeans", img: "immagini/givenchy-destroyed-jeans.jpg" },
    { name: "Bape Shark Denim",              brand: "Bape",            price: "€320", category: "jeans", img: "immagini/bape-shark-denim.jpg" },

    /* ---- PANTALONI ---- */
    { name: "Nike Jogger Tech Fleece",       brand: "Nike",            price: "€120", category: "pantaloni", img: "immagini/nike-jogger-tech.jpg" },
    { name: "Nike Woven Pants",              brand: "Nike",            price: "€90",  category: "pantaloni", img: "immagini/nike-woven-pants.jpg" },
    { name: "Adidas Track Pants",            brand: "Adidas",          price: "€80",  category: "pantaloni", img: "immagini/adidas-track-pants.jpg" },
    { name: "Adidas SST Pants",              brand: "Adidas",          price: "€85",  category: "pantaloni", img: "immagini/adidas-sst-pants.jpg" },
    { name: "Fear of God Sweatpants",        brand: "Fear of God",     price: "€180", category: "pantaloni", img: "immagini/fog-sweatpants.jpg" },
    { name: "Palm Angels Track Pants",       brand: "Palm Angels",     price: "€340", category: "pantaloni", img: "immagini/palmangels-track-pants.jpg" },
    { name: "Stone Island Cargo Pants",      brand: "Stone Island",    price: "€310", category: "pantaloni", img: "immagini/stoneisland-cargo.jpg" },
    { name: "Hugo Boss Chino",               brand: "Hugo Boss",       price: "€130", category: "pantaloni", img: "immagini/hugoboss-chino.jpg" },
    { name: "Balenciaga Track Pants",        brand: "Balenciaga",      price: "€580", category: "pantaloni", img: "immagini/balenciaga-track-pants.jpg" },
    { name: "Rick Owens Drawstring Pants",   brand: "Rick Owens",      price: "€620", category: "pantaloni", img: "immagini/rickowens-drawstring.jpg" },

    /* ---- ALTRI ---- */
    { name: "Nike Air Cap",                  brand: "Nike",            price: "€35",  category: "altri", img: "immagini/nike-air-cap.jpg" },
    { name: "Adidas Beanie",                 brand: "Adidas",          price: "€30",  category: "altri", img: "immagini/adidas-beanie.jpg" },
    { name: "Supreme 6-Panel Cap",           brand: "Supreme",         price: "€120", category: "altri", img: "immagini/supreme-6panel.jpg" },
    { name: "Gucci GG Belt",                 brand: "Gucci",           price: "€380", category: "altri", img: "immagini/gucci-gg-belt.jpg" },
    { name: "Louis Vuitton Belt",            brand: "Louis Vuitton",   price: "€420", category: "altri", img: "immagini/lv-belt.jpg" },
    { name: "Off-White Industrial Belt",     brand: "Off-White",       price: "€260", category: "altri", img: "immagini/offwhite-belt.jpg" },
    { name: "Rimowa Classic Cabin",          brand: "Rimowa",          price: "€750", category: "altri", img: "immagini/rimowa-cabin.jpg" },
    { name: "Stone Island Beanie",           brand: "Stone Island",    price: "€80",  category: "altri", img: "immagini/stoneisland-beanie.jpg" },
    { name: "Canada Goose Beanie",           brand: "Canada Goose",    price: "€95",  category: "altri", img: "immagini/canadagoose-beanie.jpg" },
    { name: "New Balance 574 Cap",           brand: "New Balance",     price: "€40",  category: "altri", img: "immagini/nb-574-cap.jpg" },

  ];

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
      card.style.animationDelay = Math.min(index * 40, 500) + "ms";

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

      /* Click card → drawer */
      card.addEventListener("click", () => {
        openDrawer(product);
      });

      productsContainer.appendChild(card);
    });

    updateWishCount();
  }

  renderProducts(products);

  /* ===========================
     FILTRO DA URL (?brand=Nike)
  =========================== */
  const urlParams  = new URLSearchParams(window.location.search);
  const brandParam = urlParams.get("brand");

  if (brandParam) {
    const filtered = products.filter(p => p.brand === brandParam);
    renderProducts(filtered);

    /* Mostra banner con nome brand e bottone reset */
    const catalogo = document.getElementById("catalogo");
    const banner = document.createElement("div");
    banner.classList.add("brand-filter-banner");
    banner.innerHTML = `
      <span>Stai vedendo: <strong>${brandParam}</strong></span>
      <button id="resetBrandFilter">✕ Mostra tutti</button>
    `;
    catalogo.insertBefore(banner, catalogo.querySelector(".product-search"));

    document.getElementById("resetBrandFilter").addEventListener("click", () => {
      banner.remove();
      renderProducts(products);
      window.history.replaceState({}, "", "index.html");
    });

    /* Scrolla al catalogo */
    setTimeout(() => {
      document.getElementById("catalogo").scrollIntoView({ behavior: "smooth" });
    }, 300);
  }

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
     DRAWER LATERALE
  =========================== */
  const drawer        = document.getElementById("drawer");
  const drawerOverlay = document.getElementById("drawerOverlay");
  const drawerClose   = document.getElementById("drawerClose");
  const drawerImg     = document.getElementById("drawerImg");
  const drawerBrand   = document.getElementById("drawerBrand");
  const drawerTitle   = document.getElementById("drawerTitle");
  const drawerPrice   = document.getElementById("drawerPrice");
  const drawerExtra   = document.getElementById("drawerExtra");
  const drawerWish    = document.getElementById("drawerWish");
  const drawerBuy     = document.getElementById("drawerBuy");

  const categoryDetails = {
    magliette: { taglie: ["S","M","L","XL","2XL"], materiale: "100% Cotone", extra: null },
    felpe:     { taglie: ["S","M","L","XL","2XL"], materiale: "80% Cotone, 20% Poliestere", extra: null },
    jeans:     { taglie: ["28","30","32","34","36"], materiale: "98% Denim, 2% Elastan", extra: "Fit: Regular" },
    pantaloni: { taglie: ["S","M","L","XL"], materiale: "Misto Cotone", extra: "Fit: Relaxed" },
    altri:     { taglie: ["Taglia unica"], materiale: "Materiale misto", extra: null }
  };

  function openDrawer(product) {
    const details = categoryDetails[product.category] || categoryDetails.altri;

    drawerImg.src          = product.img;
    drawerBrand.textContent = product.brand;
    drawerTitle.textContent = product.name;
    drawerPrice.textContent = product.price;

    drawerExtra.innerHTML = `
      <div>
        <span class="drawer-label">Taglia</span>
        <div class="drawer-taglie">
          ${details.taglie.map(t => `<button class="drawer-taglia-btn">${t}</button>`).join("")}
        </div>
      </div>
      <div>
        <span class="drawer-label">Materiale</span>
        <span class="drawer-value">${details.materiale}</span>
      </div>
      ${details.extra ? `<div><span class="drawer-label">Fit</span><span class="drawer-value">${details.extra}</span></div>` : ""}
    `;

    /* Selezione taglia */
    let tagliaSelezionata = null;
    drawerExtra.querySelectorAll(".drawer-taglia-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        drawerExtra.querySelectorAll(".drawer-taglia-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        tagliaSelezionata = btn.textContent;
      });
    });

    /* Wishlist */
    const wished = isWished(product.name);
    drawerWish.classList.toggle("active", wished);
    drawerWish.querySelector("svg").setAttribute("fill", wished ? "currentColor" : "none");

    drawerWish.onclick = () => {
      toggleWish(product);
      const active = isWished(product.name);
      drawerWish.classList.toggle("active", active);
      drawerWish.querySelector("svg").setAttribute("fill", active ? "currentColor" : "none");
      drawerWish.classList.add("pop");
      setTimeout(() => drawerWish.classList.remove("pop"), 300);
      document.querySelectorAll(`.wish-btn[data-name="${product.name}"]`).forEach(btn => {
        btn.classList.toggle("active", active);
        btn.querySelector("svg").setAttribute("fill", active ? "currentColor" : "none");
      });
    };

    /* Carrello */
    drawerBuy.textContent = "Aggiungi al carrello";
    drawerBuy.className = "drawer-buy-btn";
    drawerBuy.onclick = () => {
      if (!tagliaSelezionata) {
        drawerBuy.textContent = "Seleziona una taglia!";
        drawerBuy.classList.add("buy-error");
        setTimeout(() => {
          drawerBuy.textContent = "Aggiungi al carrello";
          drawerBuy.classList.remove("buy-error");
        }, 1500);
        return;
      }
      addToCart(product, tagliaSelezionata);
      drawerBuy.textContent = "✓ Aggiunto!";
      drawerBuy.classList.add("buy-success");
      setTimeout(() => {
        drawerBuy.textContent = "Aggiungi al carrello";
        drawerBuy.classList.remove("buy-success");
      }, 1500);
    };

    drawer.classList.add("open");
    drawerOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
  }

  function closeDrawer() {
    drawer.classList.remove("open");
    drawerOverlay.classList.remove("open");
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
  }

  if (drawerClose)   drawerClose.addEventListener("click", closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });

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

  /* Aggiorna contatori all'avvio */
  updateWishCount();
  updateCartCount();

});
