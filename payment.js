const paymentMethod = document.getElementById('payment-method');
    const cardPaymentDetails = document.getElementById('card-payment-details');

    paymentMethod.addEventListener('change', function () {
        cardPaymentDetails.style.display = this.value === 'card' ? 'block' : 'none';
    });

    function updateOrderSummary() {
        const cartData = JSON.parse(localStorage.getItem('cartItems')) || [];
        const favoritesData = JSON.parse(localStorage.getItem('favoriteItems')) || [];
        const orderSummaryList = document.querySelector(".order-summary ul");
        const totalAmountElement = document.getElementById("total-price");

        const unifiedItems = [...cartData];

        favoritesData.forEach(favorite => {
            if (!unifiedItems.some(item => item.name === favorite.name)) {
                unifiedItems.push({ ...favorite, quantity: 1 });
            }
        });

        let totalAmount = 0;

        orderSummaryList.innerHTML = ''; 

        if (unifiedItems.length === 0) {
            orderSummaryList.innerHTML = '<li>No items in your order summary</li>';
            totalAmountElement.textContent = '0.00';
            return;
        }

        unifiedItems.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${item.name} x ${item.quantity}</span>
                <span>$${(item.quantity * item.price).toFixed(2)}</span>
            `;
            orderSummaryList.appendChild(listItem);

            totalAmount += item.quantity * item.price;
        });

        totalAmountElement.textContent = totalAmount.toFixed(2);
    }

    window.addEventListener('storage', updateOrderSummary);

    document.addEventListener('DOMContentLoaded', updateOrderSummary);

    document.querySelector('.payment-button').addEventListener('click', () => {
        const patientName = document.getElementById('patient-name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const paymentMethod = document.getElementById('payment-method').value;
        const billingAddress = document.getElementById('billing-address').value;

        if (patientName && email && phone && paymentMethod && billingAddress) {
            const successMessage = document.getElementById('payment-success-message');
            successMessage.style.display = 'block';
            successMessage.innerHTML = `
                <h3>Payment Successful!</h3>
                <p>Your order will reach you today evening or tomorrow morning.</p>
            `;

            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 3000);

            localStorage.removeItem('cartItems');
            localStorage.removeItem('favoriteItems');

            setTimeout(() => {
                window.location.href = 'Index.html';
            }, 3000);
        } else {
            alert('Please fill in all required fields.');
        }
    });