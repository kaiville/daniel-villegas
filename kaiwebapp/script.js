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
const modal = document.getElementById("productModal");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const closeModal = document.getElementById("closeModal");

const productCards = document.querySelectorAll(".product-card");

productCards.forEach(card => {

  card.addEventListener("click", () => {

    const img = card.querySelector("img").src;
    const title = card.querySelector("h3").textContent;
    const price = card.querySelector("p").textContent;

    modalImg.src = img;
    modalTitle.textContent = title;
    modalPrice.textContent = price;

    modal.style.display = "flex";

  });

});


closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});


window.addEventListener("click", (e) => {

  if(e.target === modal){
    modal.style.display = "none";
  }

});


document.addEventListener("keydown", (e) => {

  if(e.key === "Escape"){
    modal.style.display = "none";
  }

});
