document.addEventListener('DOMContentLoaded', async () => {
  const shopMain = document.querySelector('.shop-main');
  if (!shopMain) {
    console.error('shopMain element not found');
    return;
  }

  // Clear shop content before loading
  shopMain.innerHTML = '';

  try {
    // Fetch products from backend API
    const res = await fetch('../shop/get_products.php');
    const products = await res.json();

    if (!products.length) {
      // Display "Coming Soon" message centered if no products
      shopMain.innerHTML = `
        <div style="display:flex; justify-content:center; align-items:center; height: 300px; font-size: 1.8rem; color: #777;">
          Coming Soon
        </div>
      `;
      return;
    }

    // Create a new section container for product cards
    const section = document.createElement('div');
    section.classList.add('section');
    shopMain.appendChild(section);

    // Dynamically generate product cards and add to section
    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${product.image_url}" alt="Shop Image" class="get-shop" />
        <div class="card-content">
          <h3>${product.name}</h3>
          <p>${product.description} <br>Only Rs${product.price}</p>
          <button data-productid="${product.id}">Buy Now!</button>
        </div>
      `;
      section.appendChild(card);
    });

    // Attach event listeners to Buy buttons to handle purchases
    section.querySelectorAll('button[data-productid]').forEach(button => {
      button.addEventListener('click', async (e) => {
        const productId = e.target.getAttribute('data-productid');

        try {
          const buyRes = await fetch('../shop/buy_product.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_id: productId }),
          });
          const data = await buyRes.json();
          if (buyRes.ok) {
            alert(data.message);
          } else {
            alert(data.error || 'Purchase failed.');
          }
        } catch {
          alert('Network error. Please try again.');
        }
      });
    });

    // Implement search filter
    const searchInput = document.querySelector('.search input[type=search]');
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      const cards = section.querySelectorAll('.card');
      cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        card.style.display = (title.includes(query) || description.includes(query)) ? 'block' : 'none';
      });
    });

  } catch (error) {
    console.error('Failed to load products:', error);
    shopMain.innerHTML = `
      <div style="display:flex; justify-content:center; align-items:center; height: 300px; font-size: 1.8rem; color: #777;">
        Failed to load products. Please try again later.
      </div>
    `;
  }
});
