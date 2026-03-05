const logo = document.getElementById("logo");

logo.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});


/* FILTRO CATEGORIE */

const tabButtons = document.querySelectorAll(".tab-btn");
const products = document.querySelectorAll(".product-card");

tabButtons.forEach(btn => {

  btn.addEventListener("click", () => {

    tabButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const category = btn.dataset.category;

    products.forEach(product => {

      if(category === "all" || product.dataset.category === category){
        product.style.display = "block";
      }
      else{
        product.style.display = "none";
      }

    });

  });

});


/* RICERCA PRODOTTI */

const productSearch = document.getElementById("productSearch");

productSearch.addEventListener("input", () => {

  const value = productSearch.value.toLowerCase();

  products.forEach(product => {

    const name = product.querySelector("h3").textContent.toLowerCase();

    if(name.includes(value)){
      product.style.display = "block";
    }
    else{
      product.style.display = "none";
    }

  });

});
