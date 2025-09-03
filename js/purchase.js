// ../js/purchase.js

const API = {
  list: "../shop/get_products.php",
  buy: "../shop/buy_product.php"
};

function formatINR(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(n) || 0);
}

function getQueryParam(name) {
  const p = new URLSearchParams(window.location.search);
  return p.get(name);
}

function getProductFromSession() {
  try {
    const raw = sessionStorage.getItem("checkoutProduct");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function fetchProducts() {
  const res = await fetch(API.list, { credentials: "include" });
  if (!res.ok) throw new Error(`Failed to load products (${res.status})`);
  return res.json();
}

async function resolveProduct() {
  const fromSession = getProductFromSession();
  if (fromSession?.id) return fromSession;

  const id = getQueryParam("id");
  if (!id) return null;
  const list = await fetchProducts();
  return (list || []).find(p => String(p.id) === String(id)) || null;
}

function calcTotals(price, qty) {
  const subtotal = Number(price) * qty;
  const shipping = subtotal >= 999 ? 0 : 49;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function renderProduct(product) {
  const img = document.getElementById("prod-img");
  if (img) { img.src = product.image_url; img.alt = product.name; }
  const name = document.getElementById("prod-name");
  if (name) name.textContent = product.name;
  const desc = document.getElementById("prod-desc");
  if (desc) desc.textContent = product.description || "";
  const priceEl = document.getElementById("prod-price");
  if (priceEl) priceEl.textContent = formatINR(product.price);
}

function showNotFound() {
  const root = document.getElementById("purchase-root");
  if (!root) return;
  root.classList.add("single-col");
  root.innerHTML = `
    <section class="card">
      <h2>Product not found</h2>
      <p>Sorry, the requested product could not be loaded. Please return to the Shop and try again.</p>
      <a class="btn secondary" href="../shop/shop.html">Back to Shop</a>
    </section>
  `;
}

function validateForm() {
  const ids = ["name","email","phone","address","city","state","zip"];
  let ok = true;
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;
    const v = (el.value || "").trim();
    if (!v) { el.style.borderColor = "#e3350d"; ok = false; }
    else { el.style.borderColor = "#ccc"; }
  }
  return ok;
}

function collectForm() {
  return {
    name: document.getElementById("name")?.value.trim(),
    email: document.getElementById("email")?.value.trim(),
    phone: document.getElementById("phone")?.value.trim(),
    address: document.getElementById("address")?.value.trim(),
    city: document.getElementById("city")?.value.trim(),
    state: document.getElementById("state")?.value.trim(),
    zip: document.getElementById("zip")?.value.trim(),
    note: document.getElementById("note")?.value.trim() || ""
  };
}

async function placeOrder(productId) {
  const res = await fetch(API.buy, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ product_id: Number(productId) })
  });

  if (res.status === 401) {
    alert("Please log in to place an order.");
    return { ok: false, msg: "Not authenticated" };
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data?.error || `Order failed (${res.status})`;
    alert(msg);
    return { ok: false, msg };
  }
  return { ok: true, data };
}

document.addEventListener("DOMContentLoaded", async () => {
  const product = await resolveProduct();
  if (!product) { showNotFound(); return; }

  renderProduct(product);

  const qtyInput = document.getElementById("qty");
  function renderTotals() {
    const qty = Math.max(1, parseInt(qtyInput?.value || "1", 10));
    const { subtotal, shipping, tax, total } = calcTotals(product.price, qty);
    setText("subtotal", formatINR(subtotal));
    setText("shipping", formatINR(shipping));
    setText("tax", formatINR(tax));
    setText("total", formatINR(total));
    return { qty, subtotal, shipping, tax, total };
  }
  qtyInput?.addEventListener("input", renderTotals);
  renderTotals();

  document.getElementById("order-btn")?.addEventListener("click", async () => {
    if (!validateForm()) { alert("Please fill all required fields."); return; }
    const result = await placeOrder(product.id);
    if (result.ok) {
      try {
        const totals = renderTotals();
        const order = {
          product: { id: product.id, name: product.name, price: product.price, image_url: product.image_url },
          totals, customer: collectForm(), createdAt: new Date().toISOString()
        };
        localStorage.setItem("lastOrder", JSON.stringify(order));
      } catch {}
      alert("Purchase successful!");
      window.location.replace("../shop/shop.html");
    }
  });
});
