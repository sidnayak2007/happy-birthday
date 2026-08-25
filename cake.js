/* =========================================================
   SEJAL'S BIRTHDAY CAKE
   CAKE.JS — COMPLETE REPLACEMENT
   ========================================================= */

(() => {
    "use strict";

    /* =====================================================
       DOM REFERENCES
       ===================================================== */

    const introOverlay =
        document.getElementById("introOverlay");

    const beginCelebration =
        document.getElementById("beginCelebration");

    const cake =
        document.getElementById("cake");

    const celebrationMessage =
        document.getElementById("celebrationMessage");

    const birthdayAudience =
        document.getElementById("birthdayAudience");

    const audienceBack =
        document.getElementById("audienceBack");

    const audienceFront =
        document.getElementById("audienceFront");

    const birthdayBanners =
        document.getElementById("birthdayBanners");

    const crowdMessage =
        document.getElementById("crowdMessage");

    const candlesContainer =
        document.getElementById("candles");

    const candles =
        document.querySelectorAll(".candle");

    const candleMessage =
        document.getElementById("candleMessage");

    const candleMessageSmall =
        candleMessage
            ? candleMessage.querySelector(
                ".candle-message-small"
            )
            : null;

    const candleMessageText =
        candleMessage
            ? candleMessage.querySelector(
                "strong"
            )
            : null;

    const candleProgress =
        document.getElementById("candleProgress");

    const progressDots =
        document.querySelectorAll(
            ".progress-dot"
        );

    const wishPrompt =
        document.getElementById("wishPrompt");

    const wishComplete =
        document.getElementById("wishComplete");

    const continueToStore =
        document.getElementById("continueToStore");

    const coinCount =
        document.getElementById("coinCount");

    const confettiLayer =
        document.getElementById("confettiLayer");


    /* =====================================================
       GAME STATE
       ===================================================== */

    const TOTAL_CANDLES = 5;

    let candlesBlown = 0;

    let gameStarted = false;

    let gameComplete = false;

    let coins = 0;


    /* =====================================================
       CANDLE MESSAGES
       ===================================================== */

    const candleMessages = {

        0: {
            small: "MAKE A WISH",
            text:
                "Your birthday moment starts here."
        },

        1: {
            small: "ONE CANDLE",
            text:
                "A year full of beautiful moments begins."
        },

        2: {
            small: "TWO CANDLES",
            text:
                "Keep shining, Sejal."
        },

        3: {
            small: "THREE CANDLES",
            text:
                "Here's to everything you've accomplished."
        },

        4: {
            small: "ONE MORE",
            text:
                "One more candle... one more wish."
        },

        5: {
            small: "YOUR BIRTHDAY",
            text:
                "HAPPY BIRTHDAY, SEJAL!"
        }

    };


    /* =====================================================
       CROWD MESSAGES
       ===================================================== */

    const crowdMessages = {

        0:
            "HAPPY BIRTHDAY, SEJAL!",

        1:
            "YEAHHH! KEEP GOING!",

        2:
            "LET'S GO SEJAL!",

        3:
            "YOU'RE ALMOST THERE!",

        4:
            "ONE MORE CANDLE!",

        5:
            "HAPPY BIRTHDAY, SEJAL!"

    };


    /* =====================================================
       AUDIENCE COLORS
       ===================================================== */

    const skinColors = [
        "#d79a73",
        "#b97858",
        "#e3ae82",
        "#c88863",
        "#9e624b",
        "#edbd91",
        "#c47d5e"
    ];

    const hairColors = [
        "#241a20",
        "#3b2928",
        "#171419",
        "#50352c",
        "#30242a",
        "#5a392f"
    ];

    const shirtColors = [
        "#6673c9",
        "#d96b63",
        "#55aaa4",
        "#e3a84f",
        "#8a70b7",
        "#d8789a",
        "#628eaf",
        "#d47755"
    ];

    const pantsColors = [
        "#292634",
        "#34313d",
        "#22242d",
        "#403441"
    ];


    /* =====================================================
       INITIALIZATION
       ===================================================== */

    function init() {

        createAudience();

        setupIntro();

        setupCandles();

        setupContinueButton();

        updateProgress();

        updateCoins();

        updateCandleMessage(0);

        updateCrowdMessage(0);

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            init,
            {
                once: true
            }
        );

    } else {

        init();

    }


    /* =====================================================
       INTRO
       ===================================================== */

    function setupIntro() {

        if (!beginCelebration) {
            return;
        }

        beginCelebration.addEventListener(
            "click",
            startCelebration
        );

    }


    function startCelebration() {

        if (gameStarted) {
            return;
        }

        gameStarted = true;

        if (introOverlay) {

            introOverlay.classList.remove(
                "active"
            );

        }

        if (cake) {

            cake.classList.add(
                "cake-reveal"
            );

        }

        if (celebrationMessage) {

            celebrationMessage.classList.add(
                "visible"
            );

        }

        if (wishPrompt) {

            wishPrompt.classList.add(
                "visible"
            );

        }

        if (candleMessage) {

            candleMessage.classList.add(
                "visible"
            );

        }

        /*
         * Calm starting crowd.
         */
        setCrowdLevel(0);

    }


    /* =====================================================
       CREATE AUDIENCE
       ===================================================== */

    function createAudience() {

        if (
            !audienceBack ||
            !audienceFront
        ) {
            return;
        }

        audienceBack.innerHTML = "";

        audienceFront.innerHTML = "";


        /*
         * BACK ROW
         */
        for (
            let i = 0;
            i < 10;
            i++
        ) {

            const person =
                createPerson(
                    i,
                    true
                );

            audienceBack.appendChild(
                person
            );

        }


        /*
         * FRONT ROW
         */
        for (
            let i = 0;
            i < 9;
            i++
        ) {

            const person =
                createPerson(
                    i + 10,
                    false
                );

            audienceFront.appendChild(
                person
            );

        }

    }


    /* =====================================================
       CREATE PERSON
       ===================================================== */

    function createPerson(
        index,
        backRow
    ) {

        const person =
            document.createElement(
                "div"
            );

        person.className =
            "audience-person";


        /*
         * Appearance
         */
        person.style.setProperty(
            "--skin",
            skinColors[
                index %
                skinColors.length
            ]
        );

        person.style.setProperty(
            "--hair",
            hairColors[
                index %
                hairColors.length
            ]
        );

        person.style.setProperty(
            "--shirt",
            shirtColors[
                index %
                shirtColors.length
            ]
        );

        person.style.setProperty(
            "--pants",
            pantsColors[
                index %
                pantsColors.length
            ]
        );


        /*
         * Animation variation.
         */
        const speed =
            backRow
                ? 3.0 +
                    Math.random() * 1.4
                : 2.4 +
                    Math.random() * 1.3;

        const delay =
            -(Math.random() * 3);

        const angle =
            1 +
            Math.random() * 2;

        const bounce =
            -(
                2 +
                Math.random() * 3
            );


        person.style.setProperty(
            "--crowd-speed",
            `${speed}s`
        );

        person.style.setProperty(
            "--crowd-delay",
            `${delay}s`
        );

        person.style.setProperty(
            "--crowd-angle",
            `${angle}deg`
        );

        person.style.setProperty(
            "--crowd-bounce",
            `${bounce}px`
        );


        /*
         * Head.
         */
        const head =
            document.createElement(
                "div"
            );

        head.className =
            "audience-head";


        /*
         * Face.
         */
        const face =
            document.createElement(
                "div"
            );

        face.className =
            "audience-face";


        const smile =
            document.createElement(
                "div"
            );

        smile.className =
            "audience-smile";


        head.appendChild(
            face
        );

        head.appendChild(
            smile
        );


        /*
         * Body.
         */
        const body =
            document.createElement(
                "div"
            );

        body.className =
            "audience-body";


        /*
         * Arms.
         */
        const leftArm =
            document.createElement(
                "div"
            );

        leftArm.className =
            "audience-arm audience-arm-left";


        const rightArm =
            document.createElement(
                "div"
            );

        rightArm.className =
            "audience-arm audience-arm-right";


        /*
         * Hands.
         */
        const leftHand =
            document.createElement(
                "div"
            );

        leftHand.className =
            "audience-hand";


        const rightHand =
            document.createElement(
                "div"
            );

        rightHand.className =
            "audience-hand";


        leftArm.appendChild(
            leftHand
        );

        rightArm.appendChild(
            rightHand
        );


        /*
         * Legs.
         */
        const leftLeg =
            document.createElement(
                "div"
            );

        leftLeg.className =
            "audience-leg audience-leg-left";


        const rightLeg =
            document.createElement(
                "div"
            );

        rightLeg.className =
            "audience-leg audience-leg-right";


        /*
         * Build.
         */
        person.appendChild(
            head
        );

        person.appendChild(
            body
        );

        person.appendChild(
            leftArm
        );

        person.appendChild(
            rightArm
        );

        person.appendChild(
            leftLeg
        );

        person.appendChild(
            rightLeg
        );


        /*
         * Random initial behavior.
         */
        if (
            index % 5 === 0
        ) {

            person.classList.add(
                "clapping"
            );

        }


        if (
            index % 8 === 0
        ) {

            person.classList.add(
                "cheering"
            );

        }


        /*
         * Back row slightly smaller.
         */
        if (backRow) {

            person.style.transform =
                "scale(0.88)";

        }


        return person;

    }


    /* =====================================================
       CANDLE SETUP
       ===================================================== */

    function setupCandles() {

        candles.forEach(
            function (candle) {

                candle.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        handleCandle(
                            candle
                        );

                    }
                );


                /*
                 * Touch devices.
                 */
                candle.addEventListener(
                    "pointerdown",
                    function (event) {

                        event.preventDefault();

                    }
                );

            }
        );


        if (candlesContainer) {

            candlesContainer.addEventListener(
                "dragstart",
                function (event) {

                    event.preventDefault();

                }
            );

        }

    }


    /* =====================================================
       HANDLE CANDLE
       ===================================================== */

    function handleCandle(
        candle
    ) {

        if (
            !gameStarted ||
            gameComplete
        ) {
            return;
        }


        if (
            candle.classList.contains(
                "blown"
            )
        ) {
            return;
        }


        const number =
            Number(
                candle.dataset.candle
            );


        /*
         * Only the next candle works.
         */
        if (
            number !==
            candlesBlown + 1
        ) {

            wrongCandleFeedback();

            return;

        }


        /*
         * Blow out candle.
         */
        candle.classList.add(
            "blown"
        );


        candlesBlown++;


        /*
         * Reward.
         */
        coins++;

        updateCoins();


        /*
         * Progress.
         */
        updateProgress();


        /*
         * Message.
         */
        updateCandleMessage(
            candlesBlown
        );


        /*
         * Crowd.
         */
        updateCrowdMessage(
            candlesBlown
        );

        setCrowdLevel(
            candlesBlown
        );


        /*
         * Candle particles.
         */
        createCandleSparkles(
            candle
        );


        /*
         * Cake bounce.
         */
        cakeReaction();


        /*
         * Final candle.
         */
        if (
            candlesBlown >=
            TOTAL_CANDLES
        ) {

            completeBirthday();

        }

    }


    /* =====================================================
       CANDLE MESSAGE
       ===================================================== */

    function updateCandleMessage(
        count
    ) {

        if (
            !candleMessage ||
            !candleMessageText
        ) {
            return;
        }


        const message =
            candleMessages[count];


        if (!message) {
            return;
        }


        /*
         * Fade out.
         */
        candleMessage.classList.remove(
            "visible"
        );


        setTimeout(
            function () {

                if (
                    candleMessageSmall
                ) {

                    candleMessageSmall.textContent =
                        message.small;

                }


                candleMessageText.textContent =
                    message.text;


                candleMessage.classList.add(
                    "visible"
                );

            },
            180
        );

    }


    /* =====================================================
       CROWD MESSAGE
       ===================================================== */

    function updateCrowdMessage(
        level
    ) {

        if (!crowdMessage) {
            return;
        }


        crowdMessage.textContent =
            crowdMessages[level];


        crowdMessage.animate(
            [
                {
                    opacity: 0.5,

                    transform:
                        "translate(-50%, -50%) scale(.94)"
                },

                {
                    opacity: 1,

                    transform:
                        "translate(-50%, -50%) scale(1.05)"
                },

                {
                    opacity: 1,

                    transform:
                        "translate(-50%, -50%) scale(1)"
                }
            ],
            {
                duration: 380,
                easing: "ease-out"
            }
        );

    }


    /* =====================================================
       CROWD LEVEL
       ===================================================== */

    function setCrowdLevel(
        level
    ) {

        if (!birthdayAudience) {
            return;
        }


        birthdayAudience.classList.remove(
            "excited",
            "very-excited"
        );


        const people =
            birthdayAudience.querySelectorAll(
                ".audience-person"
            );


        people.forEach(
            function (person, index) {

                person.classList.remove(
                    "clapping",
                    "cheering"
                );


                /*
                 * LEVEL 0
                 * Calm birthday atmosphere.
                 */
                if (
                    level === 0
                ) {

                    if (
                        index % 4 === 0
                    ) {

                        person.classList.add(
                            "clapping"
                        );

                    }

                }


                /*
                 * LEVEL 1
                 * Gentle applause.
                 */
                else if (
                    level === 1
                ) {

                    if (
                        index % 2 === 0
                    ) {

                        person.classList.add(
                            "clapping"
                        );

                    }

                }


                /*
                 * LEVEL 2
                 * More cheering.
                 */
                else if (
                    level === 2
                ) {

                    if (
                        index % 3 === 0
                    ) {

                        person.classList.add(
                            "clapping"
                        );

                    } else {

                        person.classList.add(
                            "cheering"
                        );

                    }

                }


                /*
                 * LEVEL 3
                 * Excited crowd.
                 */
                else if (
                    level === 3
                ) {

                    birthdayAudience.classList.add(
                        "excited"
                    );


                    if (
                        index % 4 === 0
                    ) {

                        person.classList.add(
                            "clapping"
                        );

                    } else {

                        person.classList.add(
                            "cheering"
                        );

                    }

                }


                /*
                 * LEVEL 4
                 * Almost everyone cheering.
                 */
                else if (
                    level === 4
                ) {

                    birthdayAudience.classList.add(
                        "very-excited"
                    );


                    person.classList.add(
                        "cheering"
                    );

                }


                /*
                 * LEVEL 5
                 * Full birthday celebration.
                 */
                else if (
                    level === 5
                ) {

                    birthdayAudience.classList.add(
                        "very-excited"
                    );


                    person.classList.add(
                        "cheering"
                    );


                    /*
                     * Every person gets a
                     * different jump delay.
                     */
                    person.style.setProperty(
                        "--crowd-delay",
                        `${-Math.random()}s`
                    );

                }

            }
        );

    }


    /* =====================================================
       PROGRESS
       ===================================================== */

    function updateProgress() {

        progressDots.forEach(
            function (dot, index) {

                const number =
                    index + 1;


                dot.classList.remove(
                    "active",
                    "completed"
                );


                if (
                    number <=
                    candlesBlown
                ) {

                    dot.classList.add(
                        "completed"
                    );

                } else {

                    dot.classList.add(
                        "active"
                    );

                }

            }
        );

    }


    /* =====================================================
       COINS
       ===================================================== */

    function updateCoins() {

        if (!coinCount) {
            return;
        }


        coinCount.textContent =
            coins;


        coinCount.animate(
            [
                {
                    transform:
                        "scale(1)"
                },

                {
                    transform:
                        "scale(1.3)"
                },

                {
                    transform:
                        "scale(1)"
                }
            ],
            {
                duration: 280,
                easing: "ease-out"
            }
        );

    }


    /* =====================================================
       CAKE REACTION
       ===================================================== */

    function cakeReaction() {

        if (!cake) {
            return;
        }


        cake.animate(
            [
                {
                    transform:
                        "translateX(-50%) translateY(0)"
                },

                {
                    transform:
                        "translateX(-50%) translateY(-7px)"
                },

                {
                    transform:
                        "translateX(-50%) translateY(0)"
                }
            ],
            {
                duration: 320,
                easing: "ease-out"
            }
        );

    }


    /* =====================================================
       WRONG CANDLE
       ===================================================== */

    function wrongCandleFeedback() {

        if (!wishPrompt) {
            return;
        }


        wishPrompt.animate(
            [
                {
                    transform:
                        "translateX(-50%)"
                },

                {
                    transform:
                        "translateX(calc(-50% - 5px))"
                },

                {
                    transform:
                        "translateX(calc(-50% + 5px))"
                },

                {
                    transform:
                        "translateX(calc(-50% - 3px))"
                },

                {
                    transform:
                        "translateX(-50%)"
                }
            ],
            {
                duration: 320,
                easing: "ease-in-out"
            }
        );

    }


    /* =====================================================
       CANDLE SPARKLES
       ===================================================== */

    function createCandleSparkles(
        candle
    ) {

        if (
            !confettiLayer ||
            !candle
        ) {
            return;
        }


        const rect =
            candle.getBoundingClientRect();


        const symbols = [
            "✦",
            "✧",
            "•",
            "✦"
        ];


        const colors = [
            "#ffc94d",
            "#fff0cf",
            "#63c8bd",
            "#ff8b79"
        ];


        for (
            let i = 0;
            i < 10;
            i++
        ) {

            const sparkle =
                document.createElement(
                    "span"
                );


            sparkle.className =
                "cake-sparkle";


            sparkle.textContent =
                symbols[
                    i % symbols.length
                ];


            sparkle.style.left =
                (
                    rect.left +
                    rect.width / 2
                ) + "px";


            sparkle.style.top =
                (
                    rect.top +
                    rect.height / 3
                ) + "px";


            sparkle.style.color =
                colors[
                    i % colors.length
                ];


            sparkle.style.fontSize =
                (
                    8 +
                    Math.random() * 8
                ) + "px";


            const x =
                Math.random() * 70 -
                35;

            const y =
                -(
                    20 +
                    Math.random() * 50
                );


            confettiLayer.appendChild(
                sparkle
            );


            const animation =
                sparkle.animate(
                    [
                        {
                            opacity: 0,

                            transform:
                                "translate(-50%, -50%) scale(.2)"
                        },

                        {
                            opacity: 1,

                            transform:
                                "translate(-50%, -50%) scale(1)"
                        },

                        {
                            opacity: 0,

                            transform:
                                `translate(
                                    calc(-50% + ${x}px),
                                    calc(-50% + ${y}px)
                                )
                                scale(.35)`
                        }
                    ],
                    {
                        duration:
                            600 +
                            Math.random() * 350,

                        easing:
                            "ease-out"
                    }
                );


            animation.finished
                .then(
                    function () {

                        sparkle.remove();

                    }
                )
                .catch(
                    function () {

                        sparkle.remove();

                    }
                );

        }

    }


    /* =====================================================
       FINAL BIRTHDAY
       ===================================================== */

    function completeBirthday() {

        if (gameComplete) {
            return;
        }


        gameComplete = true;


        /*
         * Maximum crowd excitement.
         */
        setCrowdLevel(5);


        /*
         * Final message.
         */
        updateCandleMessage(5);

        updateCrowdMessage(5);


        /*
         * Strong cake reaction.
         */
        if (cake) {

            cake.classList.add(
                "wish-complete"
            );

        }


        /*
         * Hide normal instruction.
         */
        if (wishPrompt) {

            wishPrompt.classList.add(
                "hidden"
            );

        }


        if (candleProgress) {

            candleProgress.classList.add(
                "hidden"
            );

        }


        /*
         * Hide the basketball completion
         * message.
         */
        if (celebrationMessage) {

            celebrationMessage.classList.add(
                "completed"
            );

        }


        /*
         * Make final candle sparkle.
         */
        const lastCandle =
            document.querySelector(
                '.candle[data-candle="5"]'
            );


        if (lastCandle) {

            createCandleSparkles(
                lastCandle
            );

        }


        /*
         * Big final celebration after
         * a short pause.
         */
        setTimeout(
            function () {

                createFinalConfetti();

                createFinalSparkles();

                showWishComplete();

            },
            900
        );

    }


    /* =====================================================
       FINAL WISH CARD
       ===================================================== */

    function showWishComplete() {

        if (!wishComplete) {
            return;
        }


        wishComplete.classList.add(
            "show"
        );

    }


    /* =====================================================
       FINAL CONFETTI
       ===================================================== */

    function createFinalConfetti() {

        if (!confettiLayer) {
            return;
        }


        const colors = [
            "#ffc94d",
            "#ff806e",
            "#63c8bd",
            "#8b82d9",
            "#fff0cf",
            "#f49ac2"
        ];


        for (
            let i = 0;
            i < 100;
            i++
        ) {

            const piece =
                document.createElement(
                    "span"
                );


            piece.className =
                "confetti-piece";


            piece.style.left =
                (
                    Math.random() * 100
                ) + "%";


            piece.style.top =
                "-20px";


            piece.style.width =
                (
                    5 +
                    Math.random() * 7
                ) + "px";


            piece.style.height =
                (
                    8 +
                    Math.random() * 9
                ) + "px";


            piece.style.background =
                colors[
                    i % colors.length
                ];


            const drift =
                Math.random() *
                360 -
                180;


            const fall =
                500 +
                Math.random() *
                450;


            const rotation =
                Math.random() *
                1000 -
                500;


            const animation =
                piece.animate(
                    [
                        {
                            opacity: 0,

                            transform:
                                "translate3d(0,0,0) rotate(0deg)"
                        },

                        {
                            opacity: 1
                        },

                        {
                            opacity: 1,

                            transform:
                                `translate3d(
                                    ${drift}px,
                                    ${fall}px,
                                    0
                                )
                                rotate(${rotation}deg)`
                        },

                        {
                            opacity: 0
                        }
                    ],
                    {
                        duration:
                            2200 +
                            Math.random() * 1400,

                        delay:
                            Math.random() * 400,

                        easing:
                            "cubic-bezier(.15,.7,.25,1)",

                        fill:
                            "forwards"
                    }
                );


            animation.finished
                .then(
                    function () {

                        piece.remove();

                    }
                )
                .catch(
                    function () {

                        piece.remove();

                    }
                );


            confettiLayer.appendChild(
                piece
            );

        }

    }


    /* =====================================================
       FINAL SPARKLE BURST
       ===================================================== */

    function createFinalSparkles() {

        if (!confettiLayer) {
            return;
        }


        const symbols = [
            "✦",
            "✧",
            "★",
            "✨"
        ];


        const colors = [
            "#ffc94d",
            "#fff0cf",
            "#63c8bd",
            "#ff806e",
            "#d99bdc"
        ];


        for (
            let i = 0;
            i < 35;
            i++
        ) {

            const sparkle =
                document.createElement(
                    "span"
                );


            sparkle.className =
                "cake-sparkle";


            sparkle.textContent =
                symbols[
                    i % symbols.length
                ];


            sparkle.style.left =
                (
                    20 +
                    Math.random() * 60
                ) + "%";


            sparkle.style.top =
                (
                    20 +
                    Math.random() * 45
                ) + "%";


            sparkle.style.color =
                colors[
                    i % colors.length
                ];


            sparkle.style.fontSize =
                (
                    10 +
                    Math.random() * 14
                ) + "px";


            confettiLayer.appendChild(
                sparkle
            );


            const x =
                Math.random() *
                180 -
                90;


            const y =
                Math.random() *
                160 -
                80;


            const animation =
                sparkle.animate(
                    [
                        {
                            opacity: 0,

                            transform:
                                "translate(-50%, -50%) scale(.2)"
                        },

                        {
                            opacity: 1,

                            transform:
                                "translate(-50%, -50%) scale(1.2)"
                        },

                        {
                            opacity: 0,

                            transform:
                                `translate(
                                    calc(-50% + ${x}px),
                                    calc(-50% + ${y}px)
                                )
                                scale(.2)`
                        }
                    ],
                    {
                        duration:
                            1000 +
                            Math.random() * 1000,

                        delay:
                            Math.random() * 500,

                        easing:
                            "ease-out"
                    }
                );


            animation.finished
                .then(
                    function () {

                        sparkle.remove();

                    }
                )
                .catch(
                    function () {

                        sparkle.remove();

                    }
                );

        }

    }


    /* =====================================================
       CONTINUE BUTTON
       ===================================================== */

    function setupContinueButton() {

        if (!continueToStore) {
            return;
        }


        continueToStore.addEventListener(
            "click",
            function () {

                window.location.href =
                    "store.html";

            }
        );

    }


    /* =====================================================
       KEYBOARD SUPPORT
       ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                !gameStarted ||
                gameComplete
            ) {
                return;
            }


            const number =
                Number(event.key);


            if (
                number >= 1 &&
                number <= 5
            ) {

                const candle =
                    document.querySelector(
                        `.candle[data-candle="${number}"]`
                    );


                if (candle) {

                    handleCandle(
                        candle
                    );

                }

            }

        }
    );


    /* =====================================================
       PREVENT IMAGE / BUTTON DRAGGING
       ===================================================== */

    document.addEventListener(
        "dragstart",
        function (event) {

            if (
                event.target.closest(
                    ".candle"
                )
            ) {

                event.preventDefault();

            }

        }
    );


    /* =====================================================
       INITIAL UI STATE
       ===================================================== */

    if (wishComplete) {

        wishComplete.classList.remove(
            "show"
        );

    }


    if (candleMessage) {

        candleMessage.classList.add(
            "visible"
        );

    }


    updateProgress();

    updateCoins();

})();