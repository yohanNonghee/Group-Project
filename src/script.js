document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       1. DOM ELEMENTS & STATE
       ========================================================================== */
    // Shopping Cart UI
    const cartIcon = document.getElementById('cart-icon');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountBadge = document.querySelector('.cart-count');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    // Editorial Slider
    const slides = document.querySelectorAll('.slider-container .slide');
    const nextBtn = document.getElementById('nextSlideBtn');

    // Horizontal Scroll Controls
    const categoryGrid = document.getElementById('categoryGrid');
    const categoryPrevBtn = document.getElementById('categoryPrevBtn');
    const categoryNextBtn = document.getElementById('categoryNextBtn');
    const productGrid = document.getElementById('productGrid');
    const productPrevBtn = document.getElementById('productPrevBtn');
    const productNextBtn = document.getElementById('productNextBtn');

    // Utility Controls
    const backToTopBtn = document.getElementById('backToTopBtn');

    // Application State
    let cart = [];
    let currentSlideIndex = 0;

    /* ==========================================================================
       2. SHOPPING CART FUNCTIONALITY
       ========================================================================== */
    const toggleCart = () => {
        if (cartDrawer && cartOverlay) {
            cartDrawer.classList.toggle('open');
            cartOverlay.classList.toggle('open');
        }
    };

    // Toggle Listeners
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            toggleCart();
        });
    }
    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    // Add to Cart Handlers
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            if (!productCard) return;

            const title = productCard.querySelector('.product-title').textContent;
            const priceText = productCard.querySelector('.product-price').textContent;
            const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10);

            const existingItem = cart.find(item => item.title === title);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ title, price, quantity: 1 });
            }

            updateCartUI();

            // Button Feedback
            const originalText = button.textContent;
            button.textContent = "Added! ✓";
            button.style.backgroundColor = "#78806D";

            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = "#111625";
            }, 1000);

            // Open Drawer automatically on add
            if (cartDrawer && !cartDrawer.classList.contains('open')) {
                toggleCart();
            }
        });
    });

    // Render Cart & Update Totals
    const updateCartUI = () => {
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
        if (cartTotalPrice) cartTotalPrice.textContent = `${totalPrice.toLocaleString()} kr`;
    };

    // Delegation pattern for items inside cart drawer
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            if (index === null) return;

            const targetIndex = parseInt(index, 10);

            if (e.target.classList.contains('increase-btn')) {
                cart[targetIndex].quantity++;
            } else if (e.target.classList.contains('decrease-btn')) {
                if (cart[targetIndex].quantity > 1) {
                    cart[targetIndex].quantity--;
                } else {
                    cart.splice(targetIndex, 1);
                }
            } else if (e.target.classList.contains('remove-item-btn')) {
                cart.splice(targetIndex, 1);
            }

            updateCartUI();
        });
    }

    /* ==========================================================================
       3. EDITORIAL SLIDER
       ========================================================================== */
    if (nextBtn && slides.length > 0) {
        nextBtn.addEventListener('click', () => {
            slides[currentSlideIndex].classList.remove('active');
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            slides[currentSlideIndex].classList.add('active');
        });
    }

    /* ==========================================================================
       4. HORIZONTAL CAROUSELS (CATEGORIES & POPULAR PRODUCTS)
       ========================================================================== */
    // Category Navigation
    if (categoryGrid && categoryPrevBtn && categoryNextBtn) {
        categoryPrevBtn.addEventListener('click', () => {
            categoryGrid.scrollBy({ left: -260, behavior: 'smooth' });
        });

        categoryNextBtn.addEventListener('click', () => {
            categoryGrid.scrollBy({ left: 260, behavior: 'smooth' });
        });
    }

    // Popular Products Navigation
    if (productGrid && productPrevBtn && productNextBtn) {
        productPrevBtn.addEventListener('click', () => {
            const scrollAmount = productGrid.clientWidth * 0.8;
            productGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        productNextBtn.addEventListener('click', () => {
            const scrollAmount = productGrid.clientWidth * 0.8;
            productGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    /* ==========================================================================
       5. UTILITY CONTROLS (BACK TO TOP)
       ========================================================================== */
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
});