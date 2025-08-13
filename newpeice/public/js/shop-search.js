// JavaScript for search bar filter in shop.html

// Select the search input box inside the .search container
const searchInput = document.querySelector('.search input[type=search]');

// Select all product cards inside .shop-main > .section containers (excludes .breaker)
const cards = document.querySelectorAll('.shop-main .section .card');

// Listen for input events on the search box
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase(); // Convert query to lowercase for case insensitive matching

  // Iterate over all product cards
  cards.forEach(card => {
    // Get the product title and description text, converted to lowercase
    const title = card.querySelector('h3').textContent.toLowerCase();
    const description = card.querySelector('p').textContent.toLowerCase();

    // Show the card if the query matches either title or description; otherwise hide it
    if (title.includes(query) || description.includes(query)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
});
