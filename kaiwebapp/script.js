/* LOGO TORNA IN ALTO */

const logo = document.getElementById("logo");

if(logo){
logo.addEventListener("click", () => {
window.scrollTo({
top:0,
behavior:"smooth"
});
});
}



/* GENERAZIONE PRODOTTI */

const productsContainer = document.getElementById("productsContainer");

const brands = [
"Nike","Adidas","Supreme","Stussy","Off White",
"Palm Angels","Carhartt","Stone Island","Bape","Fear of God"
];

const types = [
"Tee","Hoodie","Street Tee","Urban Hoodie",
"Classic Tee","Logo Hoodie","Oversize Tee","Street Hoodie"
];

const images = [
"img/maglia1.jpg",
"img/maglia2.jpg",
"img/felpa1.jpg",
"img/felpa2.jpg",
"img/berretto1.jpg"
];

const categories = [
"magliette",
"felpe",
"altri"
];

const products = [];

if(productsContainer){

for(let i = 0; i < 80; i++){

const brand = brands[Math.floor(Math.random()*brands.length)];
const type = types[Math.floor(Math.random()*types.length)];
const price = Math.floor(Math.random()*120) + 30;
const category = categories[Math.floor(Math.random()*categories.length)];
const img = images[Math.floor(Math.random()*images.length)];

products.push({
name: brand + " " + type,
price: "€" + price,
category: category,
img: img
});

}

}



/* RENDER PRODOTTI */

function renderProducts(){

if(!productsContainer) return;

productsContainer.innerHTML = "";

products.forEach(product => {

const card = document.createElement("div");

card.classList.add("product-card");
card.dataset.category = product.category;

card.innerHTML = `
<img src="${product.img}" alt="${product.name}">
<h3>${product.name}</h3>
<p>${product.price}</p>
`;

productsContainer.appendChild(card);

});

}

renderProducts();



/* FILTRO CATEGORIE */

const tabButtons = document.querySelectorAll(".tab-btn");

tabButtons.forEach(btn => {

btn.addEventListener("click", () => {

tabButtons.forEach(b => b.classList.remove("active"));

btn.classList.add("active");

const category = btn.dataset.category;

const cards = document.querySelectorAll(".product-card");

cards.forEach(card => {

if(category === "all" || card.dataset.category === category){
card.style.display = "block";
}
else{
card.style.display = "none";
}

});

});

});



/* RICERCA PRODOTTI */

const productSearch = document.getElementById("productSearch");

if(productSearch){

productSearch.addEventListener("input", () => {

const value = productSearch.value.toLowerCase();

const cards = document.querySelectorAll(".product-card");

cards.forEach(card => {

const name = card.querySelector("h3").textContent.toLowerCase();

if(name.includes(value)){
card.style.display = "block";
}
else{
card.style.display = "none";
}

});

});

}



/* MODALE PRODOTTO */

const modal = document.getElementById("productModal");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const closeModal = document.getElementById("closeModal");

function attachProductEvents(){

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

}

attachProductEvents();



if(closeModal){

closeModal.addEventListener("click", () => {
modal.style.display = "none";
});

}



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



/* FRECCIA TORNA SU */

const backToTop = document.getElementById("backToTop");

if(backToTop){

window.addEventListener("scroll", () => {

if(window.scrollY > 300){
backToTop.classList.add("show");
}
else{
backToTop.classList.remove("show");
}

});

backToTop.addEventListener("click", () => {

window.scrollTo({
top:0,
behavior:"smooth"
});

});

}



/* TRANSIZIONE PAGINA */

const links = document.querySelectorAll('a[href]');

links.forEach(link => {

link.addEventListener("click", function(e){

const url = this.getAttribute("href");

if(url && url.includes(".html")){

e.preventDefault();

document.body.classList.add("fade-out");

setTimeout(() => {

window.location.href = url;

}, 400);

}

});

});
