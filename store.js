/* =========================================================
   SEJAL'S BIRTHDAY STORE
   ========================================================= */


/* =========================================================
   STORAGE KEYS
========================================================= */

const COIN_KEY =
    "sejalBirthdayCoins";

const OWNED_KEY =
    "sejalBirthdayOwned";

const CART_KEY =
    "sejalBirthdayCart";


/* =========================================================
   PRODUCT CATALOGUE
========================================================= */

const products = [

    /* =====================================================
       CAFÉ
       Vegetarian only
    ====================================================== */

    {
        id: "cafe-latte",
        category: "cafe",
        brand: "Birthday Café",
        name: "Vanilla Latte",
        price: 8,
        icon: "☕"
    },

    {
        id: "cafe-coldbrew",
        category: "cafe",
        brand: "Birthday Café",
        name: "Cold Brew",
        price: 7,
        icon: "🧋"
    },

    {
        id: "cafe-cappuccino",
        category: "cafe",
        brand: "Birthday Café",
        name: "Cappuccino",
        price: 7,
        icon: "☕"
    },

    {
        id: "cafe-matcha",
        category: "cafe",
        brand: "Birthday Café",
        name: "Iced Matcha",
        price: 8,
        icon: "🍵"
    },

    {
        id: "cafe-croissant",
        category: "cafe",
        brand: "Birthday Café",
        name: "Butter Croissant",
        price: 6,
        icon: "🥐"
    },

    {
        id: "cafe-brownie",
        category: "cafe",
        brand: "Birthday Café",
        name: "Chocolate Brownie",
        price: 7,
        icon: "🍫"
    },

    {
        id: "cafe-cheesecake",
        category: "cafe",
        brand: "Birthday Café",
        name: "Cheesecake",
        price: 9,
        icon: "🍰"
    },

    {
        id: "cafe-sandwich",
        category: "cafe",
        brand: "Birthday Café",
        name: "Veggie Sandwich",
        price: 8,
        icon: "🥪"
    },

    {
        id: "cafe-fries",
        category: "cafe",
        brand: "Birthday Café",
        name: "French Fries",
        price: 6,
        icon: "🍟"
    },


    /* =====================================================
       FASHION
    ====================================================== */

    {
        id: "fashion-zara-dress",
        category: "fashion",
        brand: "ZARA",
        name: "Flowy Midi Dress",
        price: 42,
        icon: "👗"
    },

    {
        id: "fashion-hm-top",
        category: "fashion",
        brand: "H&M",
        name: "Ribbed Top",
        price: 25,
        icon: "👚"
    },

    {
        id: "fashion-levis-jeans",
        category: "fashion",
        brand: "LEVI'S",
        name: "Classic Straight Jeans",
        price: 38,
        icon: "👖"
    },

    {
        id: "fashion-uniqlo-cardigan",
        category: "fashion",
        brand: "UNIQLO",
        name: "Soft Knit Cardigan",
        price: 35,
        icon: "🧥"
    },

    {
        id: "fashion-mango-dress",
        category: "fashion",
        brand: "MANGO",
        name: "Satin Dress",
        price: 45,
        icon: "👗"
    },

    {
        id: "fashion-nike-shoes",
        category: "fashion",
        brand: "NIKE",
        name: "Everyday Sneakers",
        price: 50,
        icon: "👟"
    },

    {
        id: "fashion-adidas-shoes",
        category: "fashion",
        brand: "ADIDAS",
        name: "Lifestyle Sneakers",
        price: 48,
        icon: "👟"
    },

    {
        id: "fashion-coach-bag",
        category: "fashion",
        brand: "COACH",
        name: "Mini Shoulder Bag",
        price: 65,
        icon: "👜"
    },

    {
        id: "fashion-mk-bag",
        category: "fashion",
        brand: "MICHAEL KORS",
        name: "Small Crossbody Bag",
        price: 70,
        icon: "👜"
    },

    {
        id: "fashion-puma-hoodie",
        category: "fashion",
        brand: "PUMA",
        name: "Classic Hoodie",
        price: 40,
        icon: "🧥"
    },


    /* =====================================================
       BEAUTY
    ====================================================== */

    {
        id: "beauty-mac-lipstick",
        category: "beauty",
        brand: "MAC",
        name: "Matte Lipstick",
        price: 30,
        icon: "💄"
    },

    {
        id: "beauty-maybelline-mascara",
        category: "beauty",
        brand: "MAYBELLINE",
        name: "Lash Sensational Mascara",
        price: 18,
        icon: "🖤"
    },

    {
        id: "beauty-loreal-foundation",
        category: "beauty",
        brand: "L'ORÉAL PARIS",
        name: "True Match Foundation",
        price: 27,
        icon: "✨"
    },

    {
        id: "beauty-estee-serum",
        category: "beauty",
        brand: "ESTÉE LAUDER",
        name: "Advanced Night Serum",
        price: 65,
        icon: "🧴"
    },

    {
        id: "beauty-clinique-moisturizer",
        category: "beauty",
        brand: "CLINIQUE",
        name: "Moisture Surge",
        price: 40,
        icon: "🧴"
    },

    {
        id: "beauty-fenty-gloss",
        category: "beauty",
        brand: "FENTY BEAUTY",
        name: "Gloss Bomb",
        price: 25,
        icon: "💋"
    },

    {
        id: "beauty-nars-blush",
        category: "beauty",
        brand: "NARS",
        name: "Powder Blush",
        price: 34,
        icon: "🌸"
    },

    {
        id: "beauty-rare-blush",
        category: "beauty",
        brand: "RARE BEAUTY",
        name: "Soft Pinch Blush",
        price: 29,
        icon: "🌷"
    },

    {
        id: "beauty-bodyshop-bodybutter",
        category: "beauty",
        brand: "THE BODY SHOP",
        name: "Body Butter",
        price: 22,
        icon: "🧴"
    },

    {
        id: "beauty-sephora-palette",
        category: "beauty",
        brand: "SEPHORA",
        name: "Everyday Eyeshadow Palette",
        price: 32,
        icon: "🎨"
    }

];


/* =========================================================
   CATEGORY INFORMATION
========================================================= */

const categories = {

    cafe: {
        eyebrow: "CAFÉ",
        title: "Grab something nice",
        description:
            "Vegetarian treats and drinks for the journey."
    },

    fashion: {
        eyebrow: "DRESS SHOP",
        title: "Find something you love",
        description:
            "Fashion, shoes and accessories from familiar brands."
    },

    beauty: {
        eyebrow: "MAKEUP SHOP",
        title: "A little glow-up",
        description:
            "Beauty and makeup picks from international brands."
    }

};


/* =========================================================
   STATE
========================================================= */

let currentCategory =
    "cafe";

let cart =
    loadCart();


/* =========================================================
   DOM
========================================================= */

const coinBalance =
    document.getElementById(
        "coinBalance"
    );

const shopView =
    document.getElementById(
        "shopView"
    );

const ownedView =
    document.getElementById(
        "ownedView"
    );

const productsGrid =
    document.getElementById(
        "productsGrid"
    );

const categoryEyebrow =
    document.getElementById(
        "categoryEyebrow"
    );

const categoryTitle =
    document.getElementById(
        "categoryTitle"
    );

const categoryDescription =
    document.getElementById(
        "categoryDescription"
    );

const cartCount =
    document.getElementById(
        "cartCount"
    );

const floatingCart =
    document.getElementById(
        "floatingCart"
    );

const cartModal =
    document.getElementById(
        "cartModal"
    );

const closeCart =
    document.getElementById(
        "closeCart"
    );

const cartItems =
    document.getElementById(
        "cartItems"
    );

const cartTotal =
    document.getElementById(
        "cartTotal"
    );

const cartCoinBalance =
    document.getElementById(
        "cartCoinBalance"
    );

const cartError =
    document.getElementById(
        "cartError"
    );

const purchaseButton =
    document.getElementById(
        "purchaseButton"
    );

const ownedGrid =
    document.getElementById(
        "ownedGrid"
    );

const continueShopping =
    document.getElementById(
        "continueShopping"
    );

const continueCredits =
    document.getElementById(
        "continueCredits"
    );

const toast =
    document.getElementById(
        "toast"
    );


/* =========================================================
   COINS
========================================================= */

function getCoins() {

    const raw =
        localStorage.getItem(
            COIN_KEY
        );


    const value =
        parseInt(
            raw,
            10
        );


    if (
        Number.isFinite(value) &&
        value >= 0
    ) {

        return value;

    }


    return 0;

}


function setCoins(value) {

    const safeValue =
        Math.max(
            0,
            Math.floor(
                Number(value) || 0
            )
        );


    localStorage.setItem(
        COIN_KEY,
        String(safeValue)
    );


    updateCoinDisplay();

}


function updateCoinDisplay() {

    const coins =
        getCoins();


    coinBalance.textContent =
        coins;


    cartCoinBalance.textContent =
        coins;

}


/* =========================================================
   CART STORAGE
========================================================= */

function loadCart() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    CART_KEY
                )
            );


        if (
            Array.isArray(saved)
        ) {

            return saved;

        }

    } catch (error) {

        console.warn(
            "Could not load cart.",
            error
        );

    }


    return [];

}


function saveCart() {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

}


/* =========================================================
   OWNED STORAGE
========================================================= */

function loadOwned() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    OWNED_KEY
                )
            );


        if (
            Array.isArray(saved)
        ) {

            return saved;

        }

    } catch (error) {

        console.warn(
            "Could not load owned items.",
            error
        );

    }


    return [];

}


function saveOwned(items) {

    localStorage.setItem(
        OWNED_KEY,
        JSON.stringify(items)
    );

}


/* =========================================================
   PRODUCT LOOKUP
========================================================= */

function getProduct(id) {

    return products.find(
        product =>
            product.id === id
    );

}


/* =========================================================
   CART TOTAL
========================================================= */

function getCartTotal() {

    return cart.reduce(
        (
            total,
            cartItem
        ) => {

            const product =
                getProduct(
                    cartItem.id
                );


            if (!product) {
                return total;
            }


            return total +
                (
                    product.price *
                    cartItem.quantity
                );

        },
        0
    );

}


/* =========================================================
   CART ITEM COUNT
========================================================= */

function getCartItemCount() {

    return cart.reduce(
        (
            total,
            item
        ) => {

            return total +
                item.quantity;

        },
        0
    );

}


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderProducts() {

    const info =
        categories[
            currentCategory
        ];


    categoryEyebrow.textContent =
        info.eyebrow;


    categoryTitle.textContent =
        info.title;


    categoryDescription.textContent =
        info.description;


    const categoryProducts =
        products.filter(
            product =>
                product.category ===
                currentCategory
        );


    productsGrid.innerHTML =
        "";


    categoryProducts.forEach(
        product => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "product-card";


            card.dataset.category =
                product.category;


            card.innerHTML = `

                <div class="product-visual">
                    ${product.icon}
                </div>

                <div class="product-info">

                    <div class="product-brand">
                        ${product.brand}
                    </div>

                    <div class="product-name">
                        ${product.name}
                    </div>

                    <div class="product-bottom">

                        <div class="product-price">
                            ${product.price} coins
                        </div>

                        <button
                            class="add-button"
                            type="button"
                            data-product-id="${product.id}"
                        >
                            ADD
                        </button>

                    </div>

                </div>

            `;


            productsGrid.appendChild(
                card
            );

        }
    );


    document
        .querySelectorAll(
            ".add-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        addToCart(
                            button.dataset.productId
                        );

                    }
                );

            }
        );

}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(id) {

    const product =
        getProduct(id);


    if (!product) {
        return;
    }


    const existing =
        cart.find(
            item =>
                item.id === id
        );


    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({
            id: id,
            quantity: 1
        });

    }


    saveCart();

    updateCartDisplay();

    showToast(
        `${product.name} added to cart`
    );

}


/* =========================================================
   UPDATE CART DISPLAY
========================================================= */

function updateCartDisplay() {

    cartCount.textContent =
        getCartItemCount();

}


/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

    cartItems.innerHTML =
        "";


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div
                style="
                    text-align:center;
                    padding:30px 10px;
                    color:#91848a;
                    font-size:10px;
                "
            >
                Your cart is empty.
            </div>

        `;


        cartTotal.textContent =
            "0";


        purchaseButton.disabled =
            true;


        return;

    }


    cart.forEach(
        item => {

            const product =
                getProduct(
                    item.id
                );


            if (!product) {
                return;
            }


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "cart-item";


            row.innerHTML = `

                <div class="cart-item-icon">
                    ${product.icon}
                </div>

                <div class="cart-item-info">

                    <div class="cart-item-brand">
                        ${product.brand}
                    </div>

                    <div class="cart-item-name">
                        ${product.name}
                    </div>

                    <div class="cart-item-price">
                        ${product.price} coins each
                    </div>

                </div>

                <div class="quantity-controls">

                    <button
                        class="quantity-button"
                        data-action="minus"
                        data-id="${product.id}"
                        type="button"
                    >
                        −
                    </button>

                    <span class="quantity-number">
                        ${item.quantity}
                    </span>

                    <button
                        class="quantity-button"
                        data-action="plus"
                        data-id="${product.id}"
                        type="button"
                    >
                        +
                    </button>

                </div>

            `;


            cartItems.appendChild(
                row
            );

        }
    );


    cartTotal.textContent =
        getCartTotal();


    cartCoinBalance.textContent =
        getCoins();


    purchaseButton.disabled =
        false;


    cartItems
        .querySelectorAll(
            ".quantity-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        changeQuantity(
                            button.dataset.id,
                            button.dataset.action
                        );

                    }
                );

            }
        );

}


/* =========================================================
   CHANGE QUANTITY
========================================================= */

function changeQuantity(
    id,
    action
) {

    const item =
        cart.find(
            cartItem =>
                cartItem.id === id
        );


    if (!item) {
        return;
    }


    if (action === "plus") {

        item.quantity += 1;

    }


    if (action === "minus") {

        item.quantity -= 1;

    }


    if (item.quantity <= 0) {

        cart =
            cart.filter(
                cartItem =>
                    cartItem.id !== id
            );

    }


    saveCart();

    updateCartDisplay();

    renderCart();

}


/* =========================================================
   OPEN CART
========================================================= */

function openCart() {

    renderCart();

    cartModal.hidden =
        false;

    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE CART
========================================================= */

function closeCartModal() {

    cartModal.hidden =
        true;

    document.body.style.overflow =
        "";

}


/* =========================================================
   PURCHASE
========================================================= */

function purchaseCart() {

    const total =
        getCartTotal();


    if (cart.length === 0) {

        showCartError(
            "Your cart is empty."
        );

        return;

    }


    const coins =
        getCoins();


    if (total > coins) {

        showCartError(
            `You need ${total - coins} more coins.`
        );

        return;

    }


    /*
     * Deduct coins.
     */

    setCoins(
        coins - total
    );


    /*
     * Load existing owned items.
     */

    const owned =
        loadOwned();


    /*
     * Convert cart items into
     * owned items.
     */

    cart.forEach(
        cartItem => {

            const existing =
                owned.find(
                    item =>
                        item.id ===
                        cartItem.id
                );


            if (existing) {

                existing.quantity +=
                    cartItem.quantity;

            } else {

                owned.push({
                    id:
                        cartItem.id,

                    quantity:
                        cartItem.quantity
                });

            }

        }
    );


    saveOwned(
        owned
    );


    /*
     * Empty cart after successful
     * purchase.
     */

    cart = [];

    saveCart();

    updateCartDisplay();


    /*
     * CLOSE CART
     */

    closeCartModal();


    /*
     * DIRECTLY SHOW OWNED PAGE.
     */

    setTimeout(
        () => {

            showOwnedPage();

        },
        250
    );

}


/* =========================================================
   SHOW CART ERROR
========================================================= */

function showCartError(
    message
) {

    cartError.textContent =
        message;


    setTimeout(
        () => {

            cartError.textContent =
                "";

        },
        3000
    );

}


/* =========================================================
   SHOW OWNED PAGE
========================================================= */

function showOwnedPage() {

    shopView.hidden =
        true;


    ownedView.hidden =
        false;


    window.scrollTo(
        0,
        0
    );


    renderOwned();

}


/* =========================================================
   RENDER OWNED
========================================================= */

function renderOwned() {

    const owned =
        loadOwned();


    ownedGrid.innerHTML =
        "";


    if (owned.length === 0) {

        ownedGrid.innerHTML = `

            <div
                style="
                    grid-column:1/-1;
                    color:#aaa;
                    padding:30px;
                "
            >
                Nothing owned yet.
            </div>

        `;

        return;

    }


    owned.forEach(
        item => {

            const product =
                getProduct(
                    item.id
                );


            if (!product) {
                return;
            }


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "owned-card";


            card.innerHTML = `

                <div class="owned-card-icon">
                    ${product.icon}
                </div>

                <div class="owned-card-brand">
                    ${product.brand}
                </div>

                <div class="owned-card-name">
                    ${product.name}
                </div>

                <div class="owned-card-price">
                    ${product.price} coins
                    ${item.quantity > 1
                        ? ` × ${item.quantity}`
                        : ""
                    }
                </div>

            `;


            ownedGrid.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   CONTINUE SHOPPING
========================================================= */

continueShopping.addEventListener(
    "click",
    () => {

        ownedView.hidden =
            true;


        shopView.hidden =
            false;


        window.scrollTo(
            0,
            0
        );

    }
);


/* =========================================================
   CONTINUE TO END CREDITS
========================================================= */

continueCredits.addEventListener(
    "click",
    () => {

        window.location.href =
            "end-credit.html";

    }
);


/* =========================================================
   CATEGORY SWITCHING
========================================================= */

document
    .querySelectorAll(
        ".category-tab"
    )
    .forEach(
        tab => {

            tab.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".category-tab"
                        )
                        .forEach(
                            otherTab => {

                                otherTab.classList.remove(
                                    "active"
                                );

                            }
                        );


                    tab.classList.add(
                        "active"
                    );


                    currentCategory =
                        tab.dataset.category;


                    renderProducts();

                    window.scrollTo(
                        0,
                        0
                    );

                }
            );

        }
    );


/* =========================================================
   CART EVENTS
========================================================= */

floatingCart.addEventListener(
    "click",
    openCart
);


closeCart.addEventListener(
    "click",
    closeCartModal
);


purchaseButton.addEventListener(
    "click",
    purchaseCart
);


/* Click outside modal */

cartModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            cartModal
        ) {

            closeCartModal();

        }

    }
);


/* =========================================================
   TOAST
========================================================= */

let toastTimer;


function showToast(
    message
) {

    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            1800
        );

}


/* =========================================================
   HANDLE BACK / REFRESH
========================================================= */

function initialisePage() {

    /*
     * Always start on the shopping page.
     *
     * The owned page is shown immediately
     * after a successful purchase.
     */

    shopView.hidden =
        false;


    ownedView.hidden =
        true;


    updateCoinDisplay();

    updateCartDisplay();

    renderProducts();

}


/* =========================================================
   LISTEN FOR COIN CHANGES
========================================================= */

window.addEventListener(
    "storage",
    event => {

        if (
            event.key ===
            COIN_KEY
        ) {

            updateCoinDisplay();

        }

    }
);


/* =========================================================
   START
========================================================= */

initialisePage();