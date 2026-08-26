/* =========================================================
   SEJAL'S BIRTHDAY — STORE.JS
   COMPLETE REPLACEMENT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       STORAGE KEYS
       ===================================================== */

    const COIN_KEY = "sejalBirthdayCoins";
    const CART_KEY = "birthdayStoreCart";
    const PURCHASE_KEY = "birthdayPurchases";


    /* =====================================================
       COIN SYSTEM
       IMPORTANT:
       This is the EXACT key used by bus.js.
       NEVER initialize this to 0 automatically.
       ===================================================== */

    function getCoins() {

        const saved =
            localStorage.getItem(COIN_KEY);

        console.log(
            "[STORE] sejalBirthdayCoins =",
            saved
        );

        if (
            saved === null ||
            saved === ""
        ) {
            return 0;
        }

        const value =
            Number(saved);

        if (!Number.isFinite(value)) {
            return 0;
        }

        return Math.max(
            0,
            Math.floor(value)
        );

    }


    function saveCoins(amount) {

        const value =
            Math.max(
                0,
                Math.floor(
                    Number(amount) || 0
                )
            );

        localStorage.setItem(
            COIN_KEY,
            String(value)
        );

        coins = value;

        updateCoinDisplay();

    }


    let coins =
        getCoins();


    /* =====================================================
       CART STORAGE
       ===================================================== */

    function loadCart() {

        try {

            const saved =
                localStorage.getItem(
                    CART_KEY
                );

            if (!saved) {
                return [];
            }

            const parsed =
                JSON.parse(saved);

            if (
                !Array.isArray(parsed)
            ) {
                return [];
            }

            return parsed;

        } catch (error) {

            console.warn(
                "[STORE] Cart could not be loaded:",
                error
            );

            return [];

        }

    }


    let cart =
        loadCart();


    function saveCart() {

        localStorage.setItem(
            CART_KEY,
            JSON.stringify(cart)
        );

    }


    /* =====================================================
       PRODUCTS
       ===================================================== */

    const products = {

        cafe: [

            {
                id: "cafe-coffee",
                name: "Iced Coffee",
                description:
                    "A chilled café favourite for a little energy boost.",
                price: 25,
                icon: "☕"
            },

            {
                id: "cafe-boba",
                name: "Boba Tea",
                description:
                    "Sweet, cold and absolutely worth the coins.",
                price: 40,
                icon: "🧋"
            },

            {
                id: "cafe-cake",
                name: "Cake Slice",
                description:
                    "Because one birthday cake is never enough.",
                price: 35,
                icon: "🍰"
            },

            {
                id: "cafe-fries",
                name: "Cheesy Fries",
                description:
                    "Crispy fries with a ridiculous amount of cheese.",
                price: 45,
                icon: "🍟"
            },

            {
                id: "cafe-pizza",
                name: "Pizza Slice",
                description:
                    "A warm cheesy slice for the birthday girl.",
                price: 50,
                icon: "🍕"
            },

            {
                id: "cafe-donut",
                name: "Birthday Donut",
                description:
                    "A tiny sweet treat covered in sprinkles.",
                price: 30,
                icon: "🍩"
            }

        ],


        dress: [

            {
                id: "dress-pink",
                name: "Pink Birthday Dress",
                description:
                    "A cute pink outfit made for the birthday celebration.",
                price: 120,
                icon: "👗"
            },

            {
                id: "dress-blue",
                name: "Blue Party Dress",
                description:
                    "A soft blue party look for a special evening.",
                price: 140,
                icon: "👗"
            },

            {
                id: "dress-floral",
                name: "Floral Dress",
                description:
                    "A bright floral look for a sunny birthday day.",
                price: 110,
                icon: "🌸"
            },

            {
                id: "dress-hoodie",
                name: "Cute Hoodie",
                description:
                    "Comfy enough for college and cute enough for photos.",
                price: 90,
                icon: "🧥"
            },

            {
                id: "dress-sneakers",
                name: "Birthday Sneakers",
                description:
                    "A fresh pair to complete the outfit.",
                price: 80,
                icon: "👟"
            },

            {
                id: "dress-bag",
                name: "Mini Handbag",
                description:
                    "A tiny bag for the birthday essentials.",
                price: 100,
                icon: "👜"
            }

        ],


        makeup: [

            {
                id: "makeup-lipstick",
                name: "Pink Lipstick",
                description:
                    "A soft pink shade for the birthday look.",
                price: 60,
                icon: "💄"
            },

            {
                id: "makeup-blush",
                name: "Peach Blush",
                description:
                    "A warm peach blush for a fresh look.",
                price: 50,
                icon: "🌸"
            },

            {
                id: "makeup-perfume",
                name: "Birthday Perfume",
                description:
                    "A sweet little fragrance for the celebration.",
                price: 75,
                icon: "🧴"
            },

            {
                id: "makeup-nails",
                name: "Nail Polish",
                description:
                    "A glossy colour for the birthday nails.",
                price: 40,
                icon: "💅"
            },

            {
                id: "makeup-mirror",
                name: "Pocket Mirror",
                description:
                    "For checking that birthday look anywhere.",
                price: 35,
                icon: "🪞"
            },

            {
                id: "makeup-eyeshadow",
                name: "Mini Eyeshadow",
                description:
                    "A tiny palette with party shades.",
                price: 70,
                icon: "🎨"
            }

        ]

    };


    /* =====================================================
       SHOP INFORMATION
       ===================================================== */

    const shopInfo = {

        cafe: {
            title: "CAFÉ",
            kicker: "GRAB A BITE"
        },

        dress: {
            title: "DRESS SHOP",
            kicker: "FIND A LOOK"
        },

        makeup: {
            title: "MAKEUP SHOP",
            kicker: "GET READY"
        }

    };


    let currentShop = null;
    let selectedProduct = null;


    /* =====================================================
       DOM ELEMENTS
       ===================================================== */

    const coinCount =
        document.getElementById(
            "coinCount"
        );

    const panelCoinCount =
        document.getElementById(
            "panelCoinCount"
        );

    const cartCount =
        document.getElementById(
            "cartCount"
        );

    const directoryCartCount =
        document.getElementById(
            "directoryCartCount"
        );

    const cartHeaderTotal =
        document.getElementById(
            "cartHeaderTotal"
        );

    const cartTotal =
        document.getElementById(
            "cartTotal"
        );

    const coinsRemaining =
        document.getElementById(
            "coinsRemaining"
        );

    const summaryItems =
        document.getElementById(
            "summaryItems"
        );

    const shopDirectory =
        document.getElementById(
            "shopDirectory"
        );

    const shopPanel =
        document.getElementById(
            "shopPanel"
        );

    const cartPanel =
        document.getElementById(
            "cartPanel"
        );

    const productGrid =
        document.getElementById(
            "productGrid"
        );

    const cartItems =
        document.getElementById(
            "cartItems"
        );

    const emptyCart =
        document.getElementById(
            "emptyCart"
        );

    const cartFooter =
        document.getElementById(
            "cartFooter"
        );

    const panelTitle =
        document.getElementById(
            "panelTitle"
        );

    const panelKicker =
        document.getElementById(
            "panelKicker"
        );

    const backButton =
        document.getElementById(
            "backButton"
        );

    const cartButton =
        document.getElementById(
            "cartButton"
        );

    const closeShopButton =
        document.getElementById(
            "closeShopButton"
        );

    const closeCartButton =
        document.getElementById(
            "closeCartButton"
        );

    const checkoutButton =
        document.getElementById(
            "checkoutButton"
        );

    const emptyCartShopButton =
        document.getElementById(
            "emptyCartShopButton"
        );

    const productModal =
        document.getElementById(
            "productModal"
        );

    const closeProductModal =
        document.getElementById(
            "closeProductModal"
        );

    const modalProductImage =
        document.getElementById(
            "modalProductImage"
        );

    const modalProductCategory =
        document.getElementById(
            "modalProductCategory"
        );

    const modalProductName =
        document.getElementById(
            "modalProductName"
        );

    const modalProductDescription =
        document.getElementById(
            "modalProductDescription"
        );

    const modalProductPrice =
        document.getElementById(
            "modalProductPrice"
        );

    const modalAddButton =
        document.getElementById(
            "modalAddButton"
        );

    const checkoutModal =
        document.getElementById(
            "checkoutModal"
        );

    const checkoutTotal =
        document.getElementById(
            "checkoutTotal"
        );

    const cancelCheckout =
        document.getElementById(
            "cancelCheckout"
        );

    const confirmCheckout =
        document.getElementById(
            "confirmCheckout"
        );

    const purchaseSuccess =
        document.getElementById(
            "purchaseSuccess"
        );

    const successCoinCount =
        document.getElementById(
            "successCoinCount"
        );

    const continueShoppingButton =
        document.getElementById(
            "continueShoppingButton"
        );

    const insufficientCoins =
        document.getElementById(
            "insufficientCoins"
        );

    const addedToast =
        document.getElementById(
            "addedToast"
        );

    const addedToastText =
        document.getElementById(
            "addedToastText"
        );


    /* =====================================================
       OWNED STUFF ELEMENTS
       ===================================================== */

    const ownedPanel =
        document.getElementById(
            "ownedPanel"
        );

    const ownedItems =
        document.getElementById(
            "ownedItems"
        );

    const emptyOwned =
        document.getElementById(
            "emptyOwned"
        );

    const ownedActions =
        document.getElementById(
            "ownedActions"
        );

    const ownedCount =
        document.getElementById(
            "ownedCount"
        );

    const closeOwnedButton =
        document.getElementById(
            "closeOwnedButton"
        );

    const ownedShopButton =
        document.getElementById(
            "ownedShopButton"
        );

    const ownedContinueShopping =
        document.getElementById(
            "ownedContinueShopping"
        );

    const continueToEnd =
        document.getElementById(
            "continueToEnd"
        );


    /* =====================================================
       COIN DISPLAY
       ===================================================== */

    function updateCoinDisplay() {

        coins =
            getCoins();


        if (coinCount) {

            coinCount.textContent =
                coins;

        }


        if (panelCoinCount) {

            panelCoinCount.textContent =
                coins;

        }


        updateCartSummary();

    }


    function animateCoinDisplay() {

        const display =
            document.querySelector(
                ".coin-display"
            );

        if (!display) {
            return;
        }


        display.classList.remove(
            "coin-pop"
        );

        void display.offsetWidth;

        display.classList.add(
            "coin-pop"
        );

    }


    /* =====================================================
       CART CALCULATIONS
       ===================================================== */

    function getCartItemCount() {

        return cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );

    }


    function getCartTotal() {

        return cart.reduce(
            (total, item) =>
                total +
                (
                    item.price *
                    item.quantity
                ),
            0
        );

    }


    function updateCartSummary() {

        const count =
            getCartItemCount();

        const total =
            getCartTotal();


        if (cartCount) {

            cartCount.textContent =
                count;

        }


        if (directoryCartCount) {

            directoryCartCount.textContent =
                count;

        }


        if (cartHeaderTotal) {

            cartHeaderTotal.textContent =
                total;

        }


        if (cartTotal) {

            cartTotal.textContent =
                total;

        }


        if (summaryItems) {

            summaryItems.textContent =
                count;

        }


        if (coinsRemaining) {

            coinsRemaining.textContent =
                Math.max(
                    0,
                    coins - total
                );

        }


        if (checkoutButton) {

            checkoutButton.disabled =
                cart.length === 0 ||
                total > coins;

        }

    }


    /* =====================================================
       FIND PRODUCT
       ===================================================== */

    function findProduct(
        productId
    ) {

        for (
            const category
            of Object.keys(products)
        ) {

            const product =
                products[category].find(
                    item =>
                        item.id ===
                        productId
                );


            if (product) {

                return {
                    ...product,
                    category
                };

            }

        }


        return null;

    }


    /* =====================================================
       OPEN SHOP
       ===================================================== */

    function openShop(
        shop
    ) {

        if (
            !products[shop]
        ) {
            return;
        }


        currentShop =
            shop;


        const info =
            shopInfo[shop];


        if (panelTitle) {

            panelTitle.textContent =
                info.title;

        }


        if (panelKicker) {

            panelKicker.textContent =
                info.kicker;

        }


        updateCoinDisplay();

        renderProducts(
            shop
        );


        shopDirectory?.classList.add(
            "hidden"
        );

        cartPanel?.classList.add(
            "hidden"
        );

        ownedPanel?.classList.add(
            "hidden"
        );

        shopPanel?.classList.remove(
            "hidden"
        );


        setActiveNavigation(
            shop
        );


        window.scrollTo(
            0,
            0
        );

    }


    /* =====================================================
       CLOSE SHOP
       ===================================================== */

    function closeShop() {

        currentShop =
            null;


        shopPanel?.classList.add(
            "hidden"
        );

        shopDirectory?.classList.remove(
            "hidden"
        );


        setActiveNavigation(
            "shops"
        );

    }


    /* =====================================================
       RENDER PRODUCTS
       ===================================================== */

    function renderProducts(
        shop
    ) {

        if (
            !productGrid ||
            !products[shop]
        ) {
            return;
        }


        updateCoinDisplay();


        productGrid.innerHTML =
            "";


        products[shop].forEach(
            product => {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "product-card";


                const canAfford =
                    coins >=
                    product.price;


                card.innerHTML = `

                    <div class="product-image">

                        <span
                            class="product-category"
                        >
                            ${shop.toUpperCase()}
                        </span>

                        <span
                            class="product-emoji"
                        >
                            ${product.icon}
                        </span>

                        <button
                            class="product-view"
                            type="button"
                            aria-label="View ${product.name}"
                        >
                            ⓘ
                        </button>

                    </div>


                    <div class="product-info">

                        <h3>
                            ${product.name}
                        </h3>

                        <p class="product-description">
                            ${product.description}
                        </p>


                        <div class="product-bottom">

                            <strong
                                class="product-price"
                            >
                                🪙 ${product.price}
                            </strong>

                            <button
                                class="product-add"
                                type="button"
                                ${
                                    canAfford
                                        ? ""
                                        : "disabled"
                                }
                            >
                                ${
                                    canAfford
                                        ? "ADD"
                                        : "NEED COINS"
                                }
                            </button>

                        </div>

                    </div>

                `;


                const addButton =
                    card.querySelector(
                        ".product-add"
                    );


                const viewButton =
                    card.querySelector(
                        ".product-view"
                    );


                addButton?.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        addToCart(
                            product.id
                        );

                    }
                );


                viewButton?.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        openProductModal(
                            product,
                            shop
                        );

                    }
                );


                card.addEventListener(
                    "click",
                    event => {

                        if (
                            event.target.closest(
                                "button"
                            )
                        ) {
                            return;
                        }


                        openProductModal(
                            product,
                            shop
                        );

                    }
                );


                productGrid.appendChild(
                    card
                );

            }
        );

    }


    /* =====================================================
       ADD TO CART
       ===================================================== */

    function addToCart(
        productId
    ) {

        updateCoinDisplay();


        const product =
            findProduct(
                productId
            );


        if (!product) {
            return;
        }


        const newTotal =
            getCartTotal() +
            product.price;


        if (
            newTotal >
            coins
        ) {

            showInsufficientCoins();

            return;

        }


        const existing =
            cart.find(
                item =>
                    item.id ===
                    productId
            );


        if (existing) {

            existing.quantity += 1;

        } else {

            cart.push({

                id:
                    product.id,

                name:
                    product.name,

                description:
                    product.description,

                price:
                    product.price,

                icon:
                    product.icon,

                category:
                    product.category,

                quantity:
                    1

            });

        }


        saveCart();

        updateCartSummary();

        showAddedToast(
            product.name
        );

    }


    /* =====================================================
       CHANGE QUANTITY
       ===================================================== */

    function changeQuantity(
        productId,
        amount
    ) {

        updateCoinDisplay();


        const item =
            cart.find(
                entry =>
                    entry.id ===
                    productId
            );


        if (!item) {
            return;
        }


        if (
            amount > 0
        ) {

            if (
                getCartTotal() +
                item.price >
                coins
            ) {

                showInsufficientCoins();

                return;

            }

        }


        item.quantity +=
            amount;


        if (
            item.quantity <=
            0
        ) {

            cart =
                cart.filter(
                    entry =>
                        entry.id !==
                        productId
                );

        }


        saveCart();

        renderCart();

        updateCartSummary();

    }


    /* =====================================================
       REMOVE FROM CART
       ===================================================== */

    function removeFromCart(
        productId
    ) {

        cart =
            cart.filter(
                item =>
                    item.id !==
                    productId
            );


        saveCart();

        renderCart();

        updateCartSummary();

    }


    /* =====================================================
       OPEN CART
       ===================================================== */

    function openCart() {

        updateCoinDisplay();

        renderCart();


        currentShop =
            null;


        shopDirectory?.classList.add(
            "hidden"
        );

        shopPanel?.classList.add(
            "hidden"
        );

        ownedPanel?.classList.add(
            "hidden"
        );

        cartPanel?.classList.remove(
            "hidden"
        );


        setActiveNavigation(
            "cart"
        );


        window.scrollTo(
            0,
            0
        );

    }


    /* =====================================================
       CLOSE CART
       ===================================================== */

    function closeCart() {

        cartPanel?.classList.add(
            "hidden"
        );

        shopDirectory?.classList.remove(
            "hidden"
        );


        setActiveNavigation(
            "shops"
        );

    }


    /* =====================================================
       RENDER CART
       ===================================================== */

    function renderCart() {

        if (!cartItems) {
            return;
        }


        cartItems.innerHTML =
            "";


        if (
            cart.length ===
            0
        ) {

            emptyCart?.classList.remove(
                "hidden"
            );

            cartFooter?.classList.add(
                "hidden"
            );

            updateCartSummary();

            return;

        }


        emptyCart?.classList.add(
            "hidden"
        );

        cartFooter?.classList.remove(
            "hidden"
        );


        cart.forEach(
            item => {

                const row =
                    document.createElement(
                        "article"
                    );


                row.className =
                    "cart-item";


                row.innerHTML = `

                    <div
                        class="cart-item-image"
                    >
                        ${item.icon}
                    </div>


                    <div>

                        <div
                            class="cart-item-name"
                        >
                            ${item.name}
                        </div>

                        <div
                            class="cart-item-category"
                        >
                            ${String(
                                item.category
                            ).toUpperCase()}
                        </div>

                    </div>


                    <div
                        class="quantity-control"
                    >

                        <button
                            class="quantity-button"
                            type="button"
                            data-action="minus"
                        >
                            −
                        </button>

                        <span
                            class="quantity-value"
                        >
                            ${item.quantity}
                        </span>

                        <button
                            class="quantity-button"
                            type="button"
                            data-action="plus"
                        >
                            +
                        </button>

                    </div>


                    <strong
                        class="cart-item-price"
                    >
                        🪙 ${
                            item.price *
                            item.quantity
                        }
                    </strong>


                    <button
                        class="remove-cart-item"
                        type="button"
                        aria-label="Remove ${item.name}"
                    >
                        ×
                    </button>

                `;


                row.querySelector(
                    '[data-action="minus"]'
                )?.addEventListener(
                    "click",
                    () => {

                        changeQuantity(
                            item.id,
                            -1
                        );

                    }
                );


                row.querySelector(
                    '[data-action="plus"]'
                )?.addEventListener(
                    "click",
                    () => {

                        changeQuantity(
                            item.id,
                            1
                        );

                    }
                );


                row.querySelector(
                    ".remove-cart-item"
                )?.addEventListener(
                    "click",
                    () => {

                        removeFromCart(
                            item.id
                        );

                    }
                );


                cartItems.appendChild(
                    row
                );

            }
        );


        updateCartSummary();

    }


    /* =====================================================
       PRODUCT MODAL
       ===================================================== */

    function openProductModal(
        product,
        category
    ) {

        selectedProduct = {

            ...product,

            category

        };


        if (
            modalProductImage
        ) {

            modalProductImage.textContent =
                product.icon;

        }


        if (
            modalProductCategory
        ) {

            modalProductCategory.textContent =
                category.toUpperCase();

        }


        if (
            modalProductName
        ) {

            modalProductName.textContent =
                product.name;

        }


        if (
            modalProductDescription
        ) {

            modalProductDescription.textContent =
                product.description;

        }


        if (
            modalProductPrice
        ) {

            modalProductPrice.textContent =
                `🪙 ${product.price}`;

        }


        if (
            modalAddButton
        ) {

            modalAddButton.disabled =
                product.price >
                coins;


            modalAddButton.textContent =
                product.price <=
                coins
                    ? "ADD TO CART"
                    : "NOT ENOUGH COINS";

        }


        productModal?.classList.remove(
            "hidden"
        );

    }


    function closeProductModalWindow() {

        selectedProduct =
            null;


        productModal?.classList.add(
            "hidden"
        );

    }


    /* =====================================================
       CHECKOUT
       ===================================================== */

    function openCheckout() {

        updateCoinDisplay();


        const total =
            getCartTotal();


        if (
            cart.length ===
            0
        ) {
            return;
        }


        if (
            total >
            coins
        ) {

            showInsufficientCoins();

            return;

        }


        if (
            checkoutTotal
        ) {

            checkoutTotal.textContent =
                total;

        }


        checkoutModal?.classList.remove(
            "hidden"
        );

    }


    function closeCheckout() {

        checkoutModal?.classList.add(
            "hidden"
        );

    }


    /* =====================================================
       COMPLETE PURCHASE
       ===================================================== */

    function completePurchase() {

        updateCoinDisplay();


        const total =
            getCartTotal();


        if (
            cart.length ===
            0
        ) {

            closeCheckout();

            return;

        }


        if (
            total >
            coins
        ) {

            closeCheckout();

            showInsufficientCoins();

            return;

        }


        /*
         * Deduct ONLY when checkout
         * is confirmed.
         */

        const newBalance =
            coins -
            total;


        saveCoins(
            newBalance
        );


        savePurchases(
            cart
        );


        cart = [];


        saveCart();


        closeCheckout();


        updateCoinDisplay();

        renderCart();


        if (
            currentShop
        ) {

            renderProducts(
                currentShop
            );

        }


        animateCoinDisplay();


        showPurchaseSuccess();

    }


    /* =====================================================
       PURCHASE STORAGE
       ===================================================== */

    function loadPurchases() {

        try {

            const saved =
                localStorage.getItem(
                    PURCHASE_KEY
                );


            if (!saved) {
                return [];
            }


            const parsed =
                JSON.parse(
                    saved
                );


            if (
                !Array.isArray(parsed)
            ) {
                return [];
            }


            return parsed;

        } catch {

            return [];

        }

    }


    function savePurchases(
        items
    ) {

        const purchases =
            loadPurchases();


        items.forEach(
            item => {

                const existing =
                    purchases.find(
                        purchase =>
                            purchase.id ===
                            item.id
                    );


                if (
                    existing
                ) {

                    existing.quantity +=
                        item.quantity;

                } else {

                    purchases.push({

                        id:
                            item.id,

                        name:
                            item.name,

                        description:
                            item.description,

                        price:
                            item.price,

                        icon:
                            item.icon,

                        category:
                            item.category,

                        quantity:
                            item.quantity

                    });

                }

            }
        );


        localStorage.setItem(
            PURCHASE_KEY,
            JSON.stringify(
                purchases
            )
        );

    }


    /* =====================================================
       PURCHASE SUCCESS
       ===================================================== */

    function showPurchaseSuccess() {

        updateCoinDisplay();


        if (
            successCoinCount
        ) {

            successCoinCount.textContent =
                coins;

        }


        purchaseSuccess?.classList.remove(
            "hidden"
        );

    }


    function closePurchaseSuccess() {

        purchaseSuccess?.classList.add(
            "hidden"
        );

    }


    /* =====================================================
       INSUFFICIENT COINS
       ===================================================== */

    let insufficientTimer;


    function showInsufficientCoins() {

        if (
            !insufficientCoins
        ) {
            return;
        }


        insufficientCoins.classList.remove(
            "hidden"
        );


        clearTimeout(
            insufficientTimer
        );


        insufficientTimer =
            setTimeout(
                () => {

                    insufficientCoins.classList.add(
                        "hidden"
                    );

                },
                2300
            );

    }


    /* =====================================================
       ADDED TO CART
       ===================================================== */

    let addedTimer;


    function showAddedToast(
        productName
    ) {

        if (
            !addedToast
        ) {
            return;
        }


        if (
            addedToastText
        ) {

            addedToastText.textContent =
                `${productName} added to your cart.`;

        }


        addedToast.classList.remove(
            "hidden"
        );


        clearTimeout(
            addedTimer
        );


        addedTimer =
            setTimeout(
                () => {

                    addedToast.classList.add(
                        "hidden"
                    );

                },
                1800
            );

    }


    /* =====================================================
       OWNED STUFF
       ===================================================== */

    function openOwned() {

        currentShop =
            null;


        shopDirectory?.classList.add(
            "hidden"
        );

        shopPanel?.classList.add(
            "hidden"
        );

        cartPanel?.classList.add(
            "hidden"
        );

        ownedPanel?.classList.remove(
            "hidden"
        );


        renderOwned();


        setActiveNavigation(
            "owned"
        );


        window.scrollTo(
            0,
            0
        );

    }


    function closeOwned() {

        ownedPanel?.classList.add(
            "hidden"
        );

        shopDirectory?.classList.remove(
            "hidden"
        );


        setActiveNavigation(
            "shops"
        );

    }


    function renderOwned() {

        if (
            !ownedItems
        ) {
            return;
        }


        const purchases =
            loadPurchases();


        ownedItems.innerHTML =
            "";


        const totalOwned =
            purchases.reduce(
                (total, item) =>
                    total +
                    item.quantity,
                0
            );


        if (
            ownedCount
        ) {

            ownedCount.textContent =
                totalOwned;

        }


        if (
            purchases.length ===
            0
        ) {

            emptyOwned?.classList.remove(
                "hidden"
            );

            ownedItems.classList.add(
                "hidden"
            );

            ownedActions?.classList.add(
                "hidden"
            );

            return;

        }


        emptyOwned?.classList.add(
            "hidden"
        );

        ownedItems.classList.remove(
            "hidden"
        );

        ownedActions?.classList.remove(
            "hidden"
        );


        purchases.forEach(
            item => {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "owned-item";


                card.innerHTML = `

                    <div
                        class="owned-item-image"
                    >
                        ${item.icon}
                    </div>

                    <span
                        class="owned-item-category"
                    >
                        ${String(
                            item.category
                        ).toUpperCase()}
                    </span>

                    <h3>
                        ${item.name}
                    </h3>

                    <p
                        class="owned-item-description"
                    >
                        ${item.description}
                    </p>

                    <span
                        class="owned-quantity"
                    >
                        OWNED × ${item.quantity}
                    </span>

                `;


                ownedItems.appendChild(
                    card
                );

            }
        );

    }


    /* =====================================================
       ACTIVE NAVIGATION
       ===================================================== */

    function setActiveNavigation(
        destination
    ) {

        document
            .querySelectorAll(
                ".bottom-nav-button"
            )
            .forEach(
                button => {

                    button.classList.toggle(
                        "active",
                        button.dataset.nav ===
                        destination
                    );

                }
            );

    }


    /* =====================================================
       NAVIGATION
       ===================================================== */

    function navigate(
        destination
    ) {

        if (
            destination ===
            "shops"
        ) {

            closeShop();
            closeCart();
            closeOwned();

            return;

        }


        if (
            destination ===
            "cart"
        ) {

            openCart();

            return;

        }


        if (
            destination ===
            "owned"
        ) {

            openOwned();

            return;

        }


        if (
            products[destination]
        ) {

            openShop(
                destination
            );

        }

    }


    /* =====================================================
       SHOP DIRECTORY
       ===================================================== */

    document
        .querySelectorAll(
            ".shop-card"
        )
        .forEach(
            card => {

                card.addEventListener(
                    "click",
                    () => {

                        const shop =
                            card.dataset.shop;


                        if (
                            shop ===
                            "cart"
                        ) {

                            openCart();

                        } else {

                            openShop(
                                shop
                            );

                        }

                    }
                );

            }
        );


    /* =====================================================
       BOTTOM NAVIGATION
       ===================================================== */

    document
        .querySelectorAll(
            ".bottom-nav-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        navigate(
                            button.dataset.nav
                        );

                    }
                );

            }
        );


    /* =====================================================
       TOP CART
       ===================================================== */

    cartButton?.addEventListener(
        "click",
        openCart
    );


    /* =====================================================
       BACK BUTTON
       ===================================================== */

    backButton?.addEventListener(
        "click",
        () => {

            if (
                window.history.length >
                1
            ) {

                window.history.back();

            } else {

                window.location.href =
                    "index.html";

            }

        }
    );


    /* =====================================================
       SHOP PANEL BACK
       ===================================================== */

    closeShopButton?.addEventListener(
        "click",
        closeShop
    );


    /* =====================================================
       CART PANEL BACK
       ===================================================== */

    closeCartButton?.addEventListener(
        "click",
        closeCart
    );


    /* =====================================================
       EMPTY CART
       ===================================================== */

    emptyCartShopButton?.addEventListener(
        "click",
        () => {

            closeCart();

        }
    );


    /* =====================================================
       OWNED BUTTONS
       ===================================================== */

    closeOwnedButton?.addEventListener(
        "click",
        closeOwned
    );


    ownedShopButton?.addEventListener(
        "click",
        () => {

            closeOwned();

        }
    );


    ownedContinueShopping?.addEventListener(
        "click",
        () => {

            closeOwned();

        }
    );


    /* =====================================================
       CONTINUE TO END CREDITS
       ===================================================== */

    continueToEnd?.addEventListener(
        "click",
        () => {

            window.location.href =
                "end-credit.html";

        }
    );


    /* =====================================================
       PRODUCT MODAL
       ===================================================== */

    closeProductModal?.addEventListener(
        "click",
        closeProductModalWindow
    );


    document
        .querySelector(
            ".product-modal-backdrop"
        )
        ?.addEventListener(
            "click",
            closeProductModalWindow
        );


    modalAddButton?.addEventListener(
        "click",
        () => {

            if (
                !selectedProduct
            ) {
                return;
            }


            addToCart(
                selectedProduct.id
            );


            closeProductModalWindow();

        }
    );


    /* =====================================================
       CHECKOUT MODAL
       ===================================================== */

    checkoutButton?.addEventListener(
        "click",
        openCheckout
    );


    cancelCheckout?.addEventListener(
        "click",
        closeCheckout
    );


    document
        .querySelector(
            ".checkout-modal-backdrop"
        )
        ?.addEventListener(
            "click",
            closeCheckout
        );


    confirmCheckout?.addEventListener(
        "click",
        completePurchase
    );


    /* =====================================================
       PURCHASE SUCCESS
       ===================================================== */

    continueShoppingButton?.addEventListener(
        "click",
        closePurchaseSuccess
    );


    /* =====================================================
       ESCAPE KEY
       ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !==
                "Escape"
            ) {
                return;
            }


            if (
                !productModal?.classList.contains(
                    "hidden"
                )
            ) {

                closeProductModalWindow();

                return;

            }


            if (
                !checkoutModal?.classList.contains(
                    "hidden"
                )
            ) {

                closeCheckout();

                return;

            }


            if (
                !purchaseSuccess?.classList.contains(
                    "hidden"
                )
            ) {

                closePurchaseSuccess();

                return;

            }


            if (
                !cartPanel?.classList.contains(
                    "hidden"
                )
            ) {

                closeCart();

                return;

            }


            if (
                !ownedPanel?.classList.contains(
                    "hidden"
                )
            ) {

                closeOwned();

                return;

            }


            if (
                !shopPanel?.classList.contains(
                    "hidden"
                )
            ) {

                closeShop();

            }

        }
    );


    /* =====================================================
       STORAGE CHANGES
       ===================================================== */

    window.addEventListener(
        "storage",
        event => {

            if (
                event.key ===
                COIN_KEY
            ) {

                updateCoinDisplay();

                if (
                    currentShop
                ) {

                    renderProducts(
                        currentShop
                    );

                }

            }


            if (
                event.key ===
                CART_KEY
            ) {

                cart =
                    loadCart();

                renderCart();

                updateCartSummary();

            }


            if (
                event.key ===
                PURCHASE_KEY
            ) {

                if (
                    !ownedPanel?.classList.contains(
                        "hidden"
                    )
                ) {

                    renderOwned();

                }

            }

        }
    );


    /* =====================================================
       PAGE VISIBILITY
       ===================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                !document.hidden
            ) {

                /*
                 * Re-read the actual bus balance
                 * whenever the store becomes visible.
                 */

                coins =
                    getCoins();

                updateCoinDisplay();


                if (
                    currentShop
                ) {

                    renderProducts(
                        currentShop
                    );

                }


                if (
                    !ownedPanel?.classList.contains(
                        "hidden"
                    )
                ) {

                    renderOwned();

                }

            }

        }
    );


    /* =====================================================
       INITIALIZATION
       ===================================================== */

    /*
     * IMPORTANT:
     *
     * We DO NOT do:
     *
     * localStorage.setItem(
     *     COIN_KEY,
     *     "0"
     * );
     *
     * because the bus has already stored
     * the real birthday coin balance.
     */


    coins =
        getCoins();


    console.log(
        "[STORE] Initial coin balance:",
        coins
    );


    updateCoinDisplay();

    updateCartSummary();

    renderCart();

    setActiveNavigation(
        "shops"
    );

});