document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.getElementById('cart-icon');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountBadge = document.querySelector('.cart-count');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const backToTopBtn = document.getElementById('backToTopBtn');

    let cart = [];

    // Toggle Drawer Open/Close
    const toggleCart= () => {
        if (cartDrawer && cartOverlay) {
            cartDrawer.classList.toggle('open');
            cartOverlay.classList.toggle('open');
        }
    }

    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            toggleCart();
        });
    }

    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    // Add item to cart when clicking product buttons
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const title = productCard.querySelector('.product-title').textContent;
            const priceText = productCard.querySelector('.product-price').textContent;
            const price = parseInt(priceText.replace(/[^0-9]/g, ''));

            const existingItem = cart.find(item => item.title === title);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ title, price, quantity: 1 });
            }

            updateCartUI();

            // Give visual feedback on the button
            const originalText = button.textContent;
            button.textContent = "Added! ✓";
            button.style.backgroundColor = "#78806D"; // Green accent feedback

            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = "#111625";
            }, 1000);

            // Automatically open drawer when an item is added
            if (cartDrawer && !cartDrawer.classList.contains('open')) {
                toggleCart();
            }
        });
    });

    // Update UI elements, quantities, and totals
    const updateCartUI=() => {
        if (!cartItemsContainer) return;

        cartItemsContainer.innerHTML = '';
        let totalCount = 0;
        let totalPrice = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is empty.</p>';
            if (cartCountBadge) cartCountBadge.textContent = 0;
            if (cartTotalPrice) cartTotalPrice.textContent = '0 kr';
            return;
        }

        cart.forEach((item, index) => {
            totalCount += item.quantity;
            totalPrice += item.price * item.quantity;

            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="cart-item-details">
                    <span class="cart-item-title">${item.title}</span>
                    <span class="cart-item-price">${item.price.toLocaleString()} kr x ${item.quantity}</span>
                </div>
                <div class="cart-item-actions">
                    <button class="qty-btn decrease-btn" data-index="${index}">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn increase-btn" data-index="${index}">+</button>
                    <button class="remove-item-btn" data-index="${index}">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        if (cartCountBadge) cartCountBadge.textContent = totalCount;
        if (cartTotalPrice) cartTotalPrice.textContent = totalPrice.toLocaleString() + ' kr';

        attachCartButtonListeners();
    }

    // Handle button actions inside the cart drawer (+, -, remove)
    const attachCartButtonListeners= () => {
        document.querySelectorAll('.increase-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                cart[index].quantity++;
                updateCartUI();
            });
        });

        document.querySelectorAll('.decrease-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    cart.splice(index, 1);
                }
                updateCartUI();
            });
        });

        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                cart.splice(index, 1);
                updateCartUI();
            });
        });
    }
});


// Back to Top Button 
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
