// ../js/shop.js

const API = {
  list: "../shop/get_products.php"
};

const state = { products: [], filtered: [] };

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(n) || 0);
}

function cardHTML(p) {
  return `
    <div class="product-card">
      <div class="product-image-wrap">
        <img src="${p.image_url}" alt="${p.name}" loading="lazy" />
      </div>
      <div class="product-info">
        <h3 class="product-title">${p.name}</h3>
        <p class="product-desc">${p.description || ""}</p>
        <div class="price-row">
          <span class="price">${formatINR(p.price)}</span>
          <button class="btn primary buy-btn" data-id="${p.id}">Buy Now</button>
        </div>
      </div>
    </div>
  `;
}

function renderProducts(list) {
  const root = document.getElementById("shop-main");
  if (!root) return;
  if (!list || list.length === 0) {
    root.innerHTML = `<p>No products found.</p>`;
    return;
  }
  root.innerHTML = list.map(cardHTML).join("");
}

async function loadProducts() {
  try {
    const res = await fetch(API.list, { credentials: "include" });
    if (!res.ok) throw new Error(`Failed to load products (${res.status})`);
    const data = await res.json();
    state.products = Array.isArray(data) ? data : [];
    state.filtered = state.products.slice();
    renderProducts(state.filtered);
  } catch (err) {
    console.error(err);
    const root = document.getElementById("shop-main");
    if (root) root.innerHTML = `<p>Failed to load products. Please try again later.</p>`;
  }
}

function setupSearch() {
  const input = document.getElementById("search-input");
  if (!input) return;
  input.addEventListener("input", () => {
    const q = input.value.toLowerCase().trim();
    state.filtered = state.products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q)
    );
    renderProducts(state.filtered);
  });
}

function wireBuyNow() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".buy-btn");
    if (!btn) return;
    const id = btn.dataset.id;
    if (!id) return;

    const product = state.products.find(p => String(p.id) === String(id));
    if (product) {
      try { sessionStorage.setItem("checkoutProduct", JSON.stringify(product)); }
      catch (e) { console.warn("sessionStorage not available", e); }
    }
    window.location.href = `../shop/purchase.html?id=${encodeURIComponent(id)}`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupSearch();
  wireBuyNow();
  loadProducts();
});
