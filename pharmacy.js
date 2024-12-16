let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
let favorites = JSON.parse(localStorage.getItem('favoriteItems')) || [];

fetch('pharmacy.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('categories-container');

        // Render products
        data.categories.forEach(category => {
            const section = document.createElement('section');
            section.innerHTML = `
                <h2>${category.name}</h2>
                <div class="product-grid">
                    ${category.medicines.map(medicine => `
                        <div class="product-card">
                            <img src="${medicine.image}" alt="${medicine.name}">
                            <h3>${medicine.name}</h3>
                            <p>${medicine.description}</p>
                            <p class="price">$${medicine.price.toFixed(2)}</p>
                            <label for="quantity-${medicine.name}">Quantity:</label>
                            <input id="quantity-${medicine.name}" type="number" min="0" max="50" value="0">
                            <button class="add-to-cart" data-name="${medicine.name}" data-price="${medicine.price}">Add to Cart</button>
                            <button class="add-to-favorite" data-name="${medicine.name}" data-price="${medicine.price}">Add to Favorite</button>
                        </div>
                    `).join('')}
                </div>
            `;
            container.appendChild(section);
        });

        container.addEventListener('click', event => {
            const name = event.target.dataset.name;
            const price = parseFloat(event.target.dataset.price);

            if (event.target.classList.contains('add-to-cart')) {
                addToCart(name, price);
            } else if (event.target.classList.contains('add-to-favorite')) {
                addToFavorites(name, price);
            }
        });

        function addToCart(name, price) {
            const quantityInput = document.querySelector(`#quantity-${name}`);
            const quantity = parseInt(quantityInput.value, 10);

            if (quantity > 0) {
                const existing = cart.find(item => item.name === name);

                if (!existing) {
                    cart.push({ name, price, quantity });
                } else {
                    existing.quantity += quantity;
                }

                localStorage.setItem('cartItems', JSON.stringify(cart));
                alert(`${name} added to cart.`);
            } else {
                alert('Enter a valid quantity.');
            }
        }

        function addToFavorites(name, price) {
            if (!favorites.some(item => item.name === name)) {
                favorites.push({ name, price });
                localStorage.setItem('favoriteItems', JSON.stringify(favorites));
                renderFavorites();
                alert(`${name} added to favorites.`);
            } else {
                alert(`${name} is already in favorites.`);
            }
        }

        function renderFavorites() {
            const favoritesList = document.getElementById('favorites-list');
            favoritesList.innerHTML = favorites.map((item, index) => `
                <tr>
                    <td>${item.name}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td><button class="remove-favorite" data-index="${index}">Remove</button></td>
                </tr>
            `).join('');

            favoritesList.addEventListener('click', event => {
                if (event.target.classList.contains('remove-favorite')) {
                    const index = parseInt(event.target.dataset.index, 10);
                    favorites.splice(index, 1);
                    localStorage.setItem('favoriteItems', JSON.stringify(favorites));
                    renderFavorites();
                    alert('Item removed from favorites.');
                }
            });
        }

        renderFavorites();
    });

// Proceed to payment
document.getElementById('proceed-to-payment').addEventListener('click', () => {
    localStorage.setItem('cartItems', JSON.stringify(cart));
    localStorage.setItem('favoriteItems', JSON.stringify(favorites));
    window.location.href = 'payment.html';
});