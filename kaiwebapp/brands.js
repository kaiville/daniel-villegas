document.addEventListener("DOMContentLoaded", () => {

  const brands = [
    "Adidas","Armani","Balenciaga","Bape","Burberry",
    "Calvin Klein","Champion","Converse","Dsquared2",
    "Gucci","Hugo Boss","Levi's","Nike","Off-White",
    "Prada","Supreme","Tommy Hilfiger","Versace","Yeezy"
  ];

  const brandList = document.getElementById("brandList");
  const brandSearch = document.getElementById("brandSearch");
  const alphabetDiv = document.getElementById("alphabet");

  // Genera le lettere A-Z
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  alphabet.forEach(letter => {
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.addEventListener("click", () => {
      // Rimuovi active da tutte le lettere
      document.querySelectorAll(".alphabet button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Pulisci ricerca
      brandSearch.value = "";
      filterBrands(letter);
    });
    alphabetDiv.appendChild(btn);
  });

  // Funzione per mostrare i brand
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

    // Se input vuoto, mostra tutti e rimuovi active da lettere
    if(value === ""){
      document.querySelectorAll(".alphabet button").forEach(b => b.classList.remove("active"));
      renderBrandList(brands);
      return;
    }

    // Altrimenti filtra per testo
    const filtered = brands.filter(b => b.toLowerCase().includes(value));
    renderBrandList(filtered);
  });

  // Mostra inizialmente tutti i brand
  renderBrandList(brands);

});
