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
 
  const brandList    = document.getElementById("brandList");
  const brandSearch  = document.getElementById("brandSearch");
  const alphabetDiv  = document.getElementById("alphabet");
 
  /* Logo → torna alla home */
  const logo = document.getElementById("logo");
  if (logo) {
    logo.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
 
  /* ===========================
     RENDER BRAND
  =========================== */
  function renderBrandList(list) {
    brandList.innerHTML = "";
 
    if (list.length === 0) {
      brandList.innerHTML = "<p style='color:var(--secondary)'>Nessun brand trovato</p>";
      return;
    }
 
    list.forEach((b, i) => {
      const div = document.createElement("div");
      div.classList.add("brand-item");
      div.textContent = b;
      div.style.animationDelay = (i * 25) + "ms";
      brandList.appendChild(div);
    });
  }
 
  /* ===========================
     ALFABETO A-Z
  =========================== */
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach((letter, i) => {
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.style.animationDelay = (i * 30) + "ms";
 
    btn.addEventListener("click", () => {
      document.querySelectorAll(".alphabet button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      brandSearch.value = "";
      renderBrandList(brands.filter(b => b.toUpperCase().startsWith(letter)));
    });
 
    alphabetDiv.appendChild(btn);
  });
 
  /* ===========================
     RICERCA LIVE
  =========================== */
  brandSearch.addEventListener("input", () => {
    const val = brandSearch.value.toLowerCase();
    document.querySelectorAll(".alphabet button").forEach(b => b.classList.remove("active"));
    renderBrandList(brands.filter(b => b.toLowerCase().includes(val)));
  });
 
  /* Mostra tutti i brand all'avvio */
  renderBrandList(brands);
 
});
 
