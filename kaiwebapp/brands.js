// Lista brand
const brands = [
  "Adidas","Armani","Balenciaga","Bape","Burberry",
  "Calvin Klein","Champion","Converse","Dsquared2",
  "Gucci","Hugo Boss","Levi's","Moncler","Moschino",
  "New Balance","Nike","Off-White","Palm Angels","Prada",
  "Ralph Lauren","Rick Owens","Stone Island",
  "Supreme","Tommy Hilfiger","Versace","Yeezy"
];

// Elementi
const brandList = document.getElementById("brandList");
const brandSearch = document.getElementById("brandSearch");
const alphabetDiv = document.getElementById("alphabet");
const logo = document.getElementById("logo");

// Click logo torna alla home
logo.addEventListener("click", () => {
  window.location.href = "index.html";
});

// Genera lettere A-Z
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
alphabet.forEach(letter => {
  const btn = document.createElement("button");
  btn.textContent = letter;
  btn.addEventListener("click", () => {
    document.querySelectorAll(".alphabet button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    brandSearch.value = "";
    filterBrands(letter);
  });
  alphabetDiv.appendChild(btn);
});

// Render brand
function renderBrandList(list){
  brandList.innerHTML = "";
  if(list.length === 0){
    brandList.innerHTML = "<p>Nessun brand trovato</p>";
    return;
  }
  list.forEach(b => {
    const div = document.createElement("div");
    div.classList.add("brand-item");
    div.textContent = b;
    brandList.appendChild(div);
  });
}

// Filtra per lettera
function filterBrands(letter){
  const filtered = brands.filter(b => b.toUpperCase().startsWith(letter.toUpperCase()));
  renderBrandList(filtered);
}

// Ricerca live
brandSearch.addEventListener("input", () => {
  const value = brandSearch.value.toLowerCase();
  document.querySelectorAll(".alphabet button").forEach(b => b.classList.remove("active"));
  const filtered = brands.filter(b => b.toLowerCase().includes(value));
  renderBrandList(filtered);
});

// Mostra tutti i brand inizialmente
renderBrandList(brands);
