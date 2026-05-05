document.addEventListener("DOMContentLoaded", function () {
 
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
 
  const brandList   = document.getElementById("brandList");
  const brandSearch = document.getElementById("brandSearch");
  const alphabetDiv = document.getElementById("alphabet");
  const brandCount  = document.getElementById("brandCount");
  const allBtn      = document.querySelector(".alpha-btn[data-letter='all']");
 
  let activeLetter = "all";
 
  /* ===========================
     RENDER
  =========================== */
  function renderBrandList(list) {
    brandList.innerHTML = "";
    brandCount.textContent = list.length + " brand";
 
    if (list.length === 0) {
      brandList.innerHTML = "<p class='no-results'>Nessun brand trovato</p>";
      return;
    }
 
    list.forEach((b, i) => {
      const div = document.createElement("div");
      div.classList.add("brand-item");
      div.textContent = b;
      div.style.animationDelay = (i * 20) + "ms";
      brandList.appendChild(div);
    });
  }
 
  /* ===========================
     FILTRO
  =========================== */
  function applyFilter() {
    const search = brandSearch.value.toLowerCase().trim();
    let filtered = brands;
 
    if (activeLetter !== "all") {
      filtered = filtered.filter(b => b.toUpperCase().startsWith(activeLetter));
    }
    if (search) {
      filtered = filtered.filter(b => b.toLowerCase().includes(search));
    }
 
    renderBrandList(filtered);
  }
 
  /* ===========================
     BOTTONE "TUTTI"
  =========================== */
  allBtn.addEventListener("click", () => {
    setActive(allBtn, "all");
  });
 
  /* ===========================
     GENERA A-Z
  =========================== */
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((letter, i) => {
    const btn = document.createElement("button");
    btn.classList.add("alpha-btn");
    btn.dataset.letter = letter;
    btn.textContent = letter;
    btn.style.animationDelay = (i * 25) + "ms";
 
    // Grigi le lettere senza brand
    const hasBrands = brands.some(b => b.toUpperCase().startsWith(letter));
    if (!hasBrands) btn.classList.add("disabled");
 
    btn.addEventListener("click", () => {
      if (!hasBrands) return;
      setActive(btn, letter);
    });
 
    alphabetDiv.appendChild(btn);
  });
 
  function setActive(btn, letter) {
    document.querySelectorAll(".alpha-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeLetter = letter;
    brandSearch.value = "";
    applyFilter();
  }
 
  /* ===========================
     RICERCA LIVE
  =========================== */
  brandSearch.addEventListener("input", () => {
    // Deseleziona lettera se l'utente scrive
    document.querySelectorAll(".alpha-btn").forEach(b => b.classList.remove("active"));
    allBtn.classList.add("active");
    activeLetter = "all";
    applyFilter();
  });
 
  /* Logo → home */
  const logo = document.getElementById("logo");
  if (logo) logo.addEventListener("click", () => window.location.href = "index.html");
 
  /* Avvio */
  renderBrandList(brands);
 
});
