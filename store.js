/* =========================================================
   SEJAL BIRTHDAY WEBSITE
   BIRTHDAY STORE
   ========================================================= */


/* =========================================================
   ELEMENTS
   ========================================================= */

const coinCount =
    document.getElementById("coinCount");

const giftGrid =
    document.getElementById("giftGrid");

const collection =
    document.getElementById("collection");

const collectionItems =
    document.getElementById("collectionItems");

const giftCount =
    document.getElementById("giftCount");

const finishButton =
    document.getElementById("finishButton");


/* PURCHASE POPUP */

const purchaseOverlay =
    document.getElementById("purchaseOverlay");

const purchaseIcon =
    document.getElementById("purchaseIcon");

const purchaseTitle =
    document.getElementById("purchaseTitle");

const purchaseMessage =
    document.getElementById("purchaseMessage");

const closePurchase =
    document.getElementById("closePurchase");


/* NOT ENOUGH COINS POPUP */

const insufficientOverlay =
    document.getElementById(
        "insufficientOverlay"
    );

const insufficientMessage =
    document.getElementById(
        "insufficientMessage"
    );

const closeInsufficient =
    document.getElementById(
        "closeInsufficient"
    );


/* =========================================================
   GIFT DATA
   ========================================================= */

const gifts = {

    chocolate: {
        name: "Chocolate",
        icon: "🍫",
        price: 10
    },

    flowers: {
        name: "Flowers",
        icon: "🌷",
        price: 20
    },

    teddy: {
        name: "Teddy Bear",
        icon: "🧸",
        price: 35
    },

    mystery: {
        name: "Mystery Gift",
        icon: "🎁",
        price: 50
    },

    special: {
        name: "Special Gift",
        icon: "💎",
        price: 75
    },

    ultimate: {
        name: "Ultimate Gift",
        icon: "👑",
        price: 100
    }

};


/* =========================================================
   LOAD COINS
   ========================================================= */

let coins = parseInt(
    localStorage.getItem(
        "sejalBirthdayCoins"
    ),
    10
);

if (!Number.isFinite(coins)) {
    coins = 0;
}


/* =========================================================
   LOAD PURCHASED GIFTS
   ========================================================= */

let purchasedGifts = [];

try {

    const savedGifts =
        JSON.parse(
            localStorage.getItem(
                "sejalBirthdayGifts"
            )
        );

    if (Array.isArray(savedGifts)) {

        purchasedGifts =
            savedGifts;

    }

} catch (error) {

    purchasedGifts = [];

}


/* =========================================================
   VERIFY CAKE COMPLETION
   ========================================================= */

const cakeComplete =
    localStorage.getItem(
        "cakeWishComplete"
    );

if (cakeComplete !== "true") {

    window.location.replace(
        "index.html"
    );

}


/* =========================================================
   INITIALIZE STORE
   ========================================================= */

updateCoinDisplay();

updateGiftButtons();

renderCollection();


/* =========================================================
   UPDATE COIN DISPLAY
   ========================================================= */

function updateCoinDisplay() {

    if (!coinCount) {
        return;
    }

    coinCount.textContent =
        coins;

}


/* =========================================================
   BUY BUTTONS
   ========================================================= */

const buyButtons =
    document.querySelectorAll(
        "[data-buy]"
    );


buyButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                const giftId =
                    button.dataset.buy;

                buyGift(giftId);

            }
        );

    }
);


/* =========================================================
   BUY GIFT
   ========================================================= */

function buyGift(giftId) {

    const gift =
        gifts[giftId];


    if (!gift) {
        return;
    }


    /* Already purchased */

    if (
        purchasedGifts.includes(
            giftId
        )
    ) {

        return;

    }


    /* Not enough coins */

    if (coins < gift.price) {

        const missing =
            gift.price - coins;


        if (insufficientMessage) {

            insufficientMessage.textContent =
                `You need ${missing} more Birthday Coin${missing === 1 ? "" : "s"} for the ${gift.name}.`;

        }


        if (insufficientOverlay) {

            insufficientOverlay.classList.add(
                "active"
            );

        }

        return;

    }


    /* =====================================================
       REMOVE COINS
       ===================================================== */

    coins -= gift.price;


    /* =====================================================
       ADD GIFT TO COLLECTION
       ===================================================== */

    purchasedGifts.push(
        giftId
    );


    /* =====================================================
       SAVE DATA
       ===================================================== */

    localStorage.setItem(
        "sejalBirthdayCoins",
        String(coins)
    );

    localStorage.setItem(
        "sejalBirthdayGifts",
        JSON.stringify(
            purchasedGifts
        )
    );


    /* =====================================================
       UPDATE STORE
       ===================================================== */

    updateCoinDisplay();

    updateGiftButtons();

    renderCollection();


    /* =====================================================
       SHOW PURCHASE POPUP
       ===================================================== */

    if (purchaseIcon) {

        purchaseIcon.textContent =
            gift.icon;

    }


    if (purchaseTitle) {

        purchaseTitle.textContent =
            `${gift.name} purchased!`;

    }


    if (purchaseMessage) {

        purchaseMessage.textContent =
            `Your ${gift.name} has been added to your birthday collection.`;

    }


    if (purchaseOverlay) {

        purchaseOverlay.classList.add(
            "active"
        );

    }

}


/* =========================================================
   UPDATE BUY BUTTONS
   ========================================================= */

function updateGiftButtons() {

    buyButtons.forEach(
        (button) => {

            const giftId =
                button.dataset.buy;

            const gift =
                gifts[giftId];


            if (!gift) {
                return;
            }


            const card =
                button.closest(
                    ".gift-card"
                );


            /* =================================================
               ALREADY PURCHASED
               ================================================= */

            if (
                purchasedGifts.includes(
                    giftId
                )
            ) {

                button.textContent =
                    "Purchased";

                button.classList.add(
                    "purchased"
                );

                button.disabled = true;


                if (card) {

                    card.classList.add(
                        "owned"
                    );

                }

                return;

            }


            /* =================================================
               AVAILABLE
               ================================================= */

            button.disabled = false;

            button.classList.remove(
                "purchased"
            );


            if (card) {

                card.classList.remove(
                    "owned"
                );

            }


            /* =================================================
               ENOUGH COINS
               ================================================= */

            if (coins >= gift.price) {

                button.textContent =
                    "Buy";

                button.classList.remove(
                    "locked"
                );

            }


            /* =================================================
               NOT ENOUGH COINS
               ================================================= */

            else {

                button.textContent =
                    "Locked";

                button.classList.add(
                    "locked"
                );

            }

        }
    );

}


/* =========================================================
   RENDER COLLECTION
   ========================================================= */

function renderCollection() {

    if (!collectionItems) {
        return;
    }


    collectionItems.innerHTML =
        "";


    if (giftCount) {

        giftCount.textContent =
            purchasedGifts.length;

    }


    /* =====================================================
       EMPTY COLLECTION
       ===================================================== */

    if (
        purchasedGifts.length === 0
    ) {

        if (collection) {

            collection.classList.remove(
                "has-items"
            );

        }


        collectionItems.innerHTML = `
            <div class="empty-collection">
                <span>🎁</span>

                <p>
                    Nothing here yet.<br>
                    Pick something you like!
                </p>
            </div>
        `;

        return;

    }


    if (collection) {

        collection.classList.add(
            "has-items"
        );

    }


    /* =====================================================
       DISPLAY PURCHASED GIFTS
       ===================================================== */

    purchasedGifts.forEach(
        (giftId) => {

            const gift =
                gifts[giftId];


            if (!gift) {
                return;
            }


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "collection-item";


            item.innerHTML = `
                <div class="collection-icon">
                    ${gift.icon}
                </div>

                <div class="collection-info">

                    <strong>
                        ${gift.name}
                    </strong>

                    <span>
                        Purchased
                    </span>

                </div>

                <div class="collection-check">
                    ✓
                </div>
            `;


            collectionItems.appendChild(
                item
            );

        }
    );

}


/* =========================================================
   CLOSE PURCHASE POPUP
   ========================================================= */

if (closePurchase) {

    closePurchase.addEventListener(
        "click",
        () => {

            purchaseOverlay.classList.remove(
                "active"
            );

        }
    );

}


/* =========================================================
   CLOSE INSUFFICIENT COINS POPUP
   ========================================================= */

if (closeInsufficient) {

    closeInsufficient.addEventListener(
        "click",
        () => {

            insufficientOverlay.classList.remove(
                "active"
            );

        }
    );

}


/* =========================================================
   CLICK OUTSIDE PURCHASE POPUP
   ========================================================= */

if (purchaseOverlay) {

    purchaseOverlay.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                purchaseOverlay
            ) {

                purchaseOverlay.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   CLICK OUTSIDE INSUFFICIENT POPUP
   ========================================================= */

if (insufficientOverlay) {

    insufficientOverlay.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                insufficientOverlay
            ) {

                insufficientOverlay.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* =========================================================
   FINISH SHOPPING
   ========================================================= */

if (finishButton) {

    finishButton.addEventListener(
        "click",
        () => {

            localStorage.setItem(
                "storeComplete",
                "true"
            );


            window.location.href =
                "credit.html";

        }
    );

}