/* =========================================================
   SEJAL'S BIRTHDAY — CLASSROOM CAKE EXPERIENCE
   COMPLETE CAKE.JS REPLACEMENT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const page =
        document.getElementById("cakePage");

    const classroom =
        document.getElementById("classroom");

    const cake =
        document.getElementById("cake");

    const sejal =
        document.getElementById("sejalCharacter");

    const audience =
        document.getElementById("featuredStudents");

    const featuredStudents =
        Array.from(
            document.querySelectorAll(
                ".featured-student"
            )
        );

    const backgroundStudents =
        Array.from(
            document.querySelectorAll(
                ".background-student"
            )
        );

    const candles =
        Array.from(
            document.querySelectorAll(
                ".candle"
            )
        );

    const candleMessage =
        document.getElementById(
            "candleMessage"
        );

    const candleMessageSmall =
        document.getElementById(
            "candleMessageSmall"
        );

    const candleMessageText =
        document.getElementById(
            "candleMessageText"
        );

    const crowdMessage =
        document.getElementById(
            "crowdMessage"
        );

    const progressDots =
        Array.from(
            document.querySelectorAll(
                ".progress-dot"
            )
        );

    const candleProgress =
        document.getElementById(
            "candleProgress"
        );

    const wishPrompt =
        document.getElementById(
            "wishPrompt"
        );

    const wishComplete =
        document.getElementById(
            "wishComplete"
        );

    const continueToStore =
        document.getElementById(
            "continueToStore"
        );

    const confettiLayer =
        document.getElementById(
            "confettiLayer"
        );

    const introOverlay =
        document.getElementById(
            "introOverlay"
        );

    const beginCelebration =
        document.getElementById(
            "beginCelebration"
        );


    /* =====================================================
       STATE
       ===================================================== */

    let started = false;

    let processingCandle = false;

    let candlesCompleted = 0;

    let finalCelebration = false;

    const totalCandles =
        candles.length;


    /* =====================================================
       CLASSMATE CONFIGURATION
       ===================================================== */

    const featuredConfig = {

        bhoomika: {
            skin: "#d69a73",
            hair: "#292125",
            shirt: "#6874c8",
            speed: "3.2s",
            delay: "-0.4s"
        },

        raesaah: {
            skin: "#c98766",
            hair: "#211c20",
            shirt: "#e47768",
            speed: "3.7s",
            delay: "-1.1s"
        },

        aamna: {
            skin: "#e1aa80",
            hair: "#382829",
            shirt: "#55bdb3",
            speed: "3.4s",
            delay: "-1.8s"
        },

        jayashri: {
            skin: "#bc7b61",
            hair: "#17151a",
            shirt: "#8772c9",
            speed: "3.8s",
            delay: "-0.8s"
        },

        hamsa: {
            skin: "#d99a72",
            hair: "#332427",
            shirt: "#dfb84d",
            speed: "3.5s",
            delay: "-2.1s"
        }

    };


    /* =====================================================
       BACKGROUND STUDENT APPEARANCE
       ===================================================== */

    const backgroundSkins = [
        "#d59a73",
        "#c98867",
        "#e0aa7f",
        "#b9785d",
        "#d99a72",
        "#efb589",
        "#c88465",
        "#dba27c"
    ];

    const backgroundShirts = [
        "#6874c8",
        "#e97868",
        "#55bdb3",
        "#8872c9",
        "#e0b94b",
        "#d46d91",
        "#6588bb",
        "#b36f8d"
    ];

    const backgroundHair = [
        "#2b2025",
        "#382a29",
        "#17151b",
        "#4b3028",
        "#241d24",
        "#33262b"
    ];


    /* =====================================================
       SET UP FEATURED CLASSMATES
       ===================================================== */

    featuredStudents.forEach(
        (student, index) => {

            const name =
                student.dataset.name;

            const config =
                featuredConfig[name];

            if (config) {

                student.style.setProperty(
                    "--featured-skin",
                    config.skin
                );

                student.style.setProperty(
                    "--featured-hair",
                    config.hair
                );

                student.style.setProperty(
                    "--featured-shirt",
                    config.shirt
                );

                student.style.setProperty(
                    "--featured-speed",
                    config.speed
                );

                student.style.setProperty(
                    "--featured-delay",
                    config.delay
                );

            }

            student.dataset.originalIndex =
                index;

        }
    );


    /* =====================================================
       SET UP BACKGROUND CLASSMATES
       ===================================================== */

    backgroundStudents.forEach(
        (student, index) => {

            student.style.setProperty(
                "--student-skin",
                backgroundSkins[
                    index %
                    backgroundSkins.length
                ]
            );

            student.style.setProperty(
                "--student-shirt",
                backgroundShirts[
                    index %
                    backgroundShirts.length
                ]
            );

            student.style.setProperty(
                "--student-hair",
                backgroundHair[
                    index %
                    backgroundHair.length
                ]
            );


            const speed =
                3 +
                Math.random() * 2.5;

            const delay =
                -(Math.random() * 4);

            student.style.setProperty(
                "--student-speed",
                `${speed}s`
            );

            student.style.setProperty(
                "--student-delay",
                `${delay}s`
            );

        }
    );


    /* =====================================================
       CANDLE INITIALIZATION
       ===================================================== */

    candles.forEach(
        (candle, index) => {

            const number =
                Number(
                    candle.dataset.candle
                ) ||
                index + 1;

            candle.dataset.state =
                "waiting";

            candle.setAttribute(
                "aria-label",
                `Light candle ${number}`
            );

        }
    );


    /* =====================================================
       INTRO
       ===================================================== */

    function startExperience() {

        if (started) {
            return;
        }

        started = true;

        if (introOverlay) {

            introOverlay.classList.remove(
                "active"
            );

            setTimeout(() => {

                introOverlay.style.display =
                    "none";

            }, 550);

        }

        showMessage(
            0
        );

        updateProgress();

        startBackgroundIdle();

    }


    if (beginCelebration) {

        beginCelebration.addEventListener(
            "click",
            startExperience
        );

    }


    /* =====================================================
       INITIAL PROGRESS
       ===================================================== */

    function updateProgress() {

        progressDots.forEach(
            (dot, index) => {

                const number =
                    index + 1;

                dot.classList.toggle(
                    "active",
                    number ===
                    candlesCompleted + 1
                );

                dot.classList.toggle(
                    "completed",
                    number <=
                    candlesCompleted
                );

            }
        );

    }


    /* =====================================================
       CANDLE CLICK
       ===================================================== */

    candles.forEach(
        candle => {

            candle.addEventListener(
                "click",
                () => {

                    handleCandleClick(
                        candle
                    );

                }
            );

        }
    );


    function handleCandleClick(
        candle
    ) {

        if (!started) {
            return;
        }

        if (processingCandle) {
            return;
        }

        if (finalCelebration) {
            return;
        }

        const number =
            Number(
                candle.dataset.candle
            );

        const expected =
            candlesCompleted + 1;


        /*
         * Only the next candle
         * can be lit.
         */

        if (
            number !== expected
        ) {

            wrongCandleFeedback(
                candle
            );

            return;

        }


        processingCandle = true;

        lightOutCandle(
            candle,
            number
        );

    }


    /* =====================================================
       CANDLE ACTION
       ===================================================== */

    function lightOutCandle(
        candle,
        number
    ) {

        candle.classList.add(
            "blown"
        );

        candle.dataset.state =
            "completed";

        candle.setAttribute(
            "aria-label",
            `Candle ${number} completed`
        );

        candlesCompleted =
            number;

        updateProgress();

        updateFeaturedReactions(
            number
        );

        updateBackgroundReactions(
            number
        );

        showMessage(
            number
        );

        createCandleSparkles(
            candle
        );


        /*
         * Slight pause after each candle
         * before the next one can be selected.
         */

        setTimeout(
            () => {

                processingCandle =
                    false;

                if (
                    candlesCompleted >=
                    totalCandles
                ) {

                    finishBirthday();

                }

            },
            650
        );

    }


    /* =====================================================
       CANDLE MESSAGES
       ===================================================== */

    const messages = {

        0: {
            small: "A LITTLE BIRTHDAY SURPRISE",
            text: "Your classmates have something for you.",
            crowd: "READY, SEJAL?"
        },

        1: {
            small: "FIRST CANDLE",
            text: "Make a little wish.",
            crowd: "COME ON, SEJAL!"
        },

        2: {
            small: "SECOND CANDLE",
            text: "Two down. Keep going.",
            crowd: "YOU'VE GOT THIS!"
        },

        3: {
            small: "THIRD CANDLE",
            text: "Halfway there...",
            crowd: "LET'S GO, SEJAL!"
        },

        4: {
            small: "FOURTH CANDLE",
            text: "Almost there. Save the best wish.",
            crowd: "ONE MORE!"
        },

        5: {
            small: "FINAL CANDLE",
            text: "Close your eyes and make it special.",
            crowd: "HAPPY BIRTHDAY, SEJAL!"
        }

    };


    function showMessage(
        number
    ) {

        const data =
            messages[number];

        if (!data) {
            return;
        }


        if (candleMessageSmall) {

            candleMessageSmall.textContent =
                data.small;

        }


        if (candleMessageText) {

            candleMessageText.textContent =
                data.text;

        }


        if (crowdMessage) {

            crowdMessage.textContent =
                data.crowd;

            crowdMessage.classList.remove(
                "message-pop"
            );

            void crowdMessage.offsetWidth;

            crowdMessage.classList.add(
                "message-pop"
            );

        }


        if (candleMessage) {

            candleMessage.classList.remove(
                "visible"
            );

            void candleMessage.offsetWidth;

            candleMessage.classList.add(
                "visible"
            );

        }

    }


    /* =====================================================
       FEATURED CLASSMATE REACTIONS
       ===================================================== */

    function updateFeaturedReactions(
        candleNumber
    ) {

        featuredStudents.forEach(
            student => {

                student.classList.remove(
                    "clapping",
                    "cheering",
                    "excited"
                );

            }
        );


        /*
         * Candle 1
         *
         * Bhoomika reacts.
         */

        if (
            candleNumber === 1
        ) {

            activateStudent(
                "bhoomika",
                "clapping"
            );

            return;

        }


        /*
         * Candle 2
         *
         * Bhoomika + Raesaah.
         */

        if (
            candleNumber === 2
        ) {

            activateStudent(
                "bhoomika",
                "clapping"
            );

            activateStudent(
                "raesaah",
                "clapping"
            );

            return;

        }


        /*
         * Candle 3
         *
         * Aamna joins.
         */

        if (
            candleNumber === 3
        ) {

            activateStudent(
                "bhoomika",
                "clapping"
            );

            activateStudent(
                "raesaah",
                "clapping"
            );

            activateStudent(
                "aamna",
                "cheering"
            );

            return;

        }


        /*
         * Candle 4
         *
         * Jayashri joins.
         */

        if (
            candleNumber === 4
        ) {

            activateStudent(
                "bhoomika",
                "cheering"
            );

            activateStudent(
                "raesaah",
                "clapping"
            );

            activateStudent(
                "aamna",
                "cheering"
            );

            activateStudent(
                "jayashri",
                "cheering"
            );

            return;

        }


        /*
         * Candle 5
         *
         * Everyone.
         */

        if (
            candleNumber >= 5
        ) {

            featuredStudents.forEach(
                (student, index) => {

                    student.classList.add(
                        index % 2 === 0
                            ? "cheering"
                            : "clapping"
                    );

                    student.classList.add(
                        "excited"
                    );

                }
            );

        }

    }


    function activateStudent(
        name,
        reaction
    ) {

        const student =
            featuredStudents.find(
                item =>
                    item.dataset.name ===
                    name
            );

        if (!student) {
            return;
        }

        student.classList.add(
            reaction
        );

        student.classList.add(
            "excited"
        );

    }


    /* =====================================================
       BACKGROUND CLASSMATE REACTIONS
       ===================================================== */

    function updateBackgroundReactions(
        candleNumber
    ) {

        backgroundStudents.forEach(
            student => {

                student.classList.remove(
                    "clapping",
                    "cheering"
                );

            }
        );


        let percentage = 0;


        if (
            candleNumber === 1
        ) {
            percentage = 0.18;
        }

        else if (
            candleNumber === 2
        ) {
            percentage = 0.35;
        }

        else if (
            candleNumber === 3
        ) {
            percentage = 0.55;
        }

        else if (
            candleNumber === 4
        ) {
            percentage = 0.78;
        }

        else if (
            candleNumber >= 5
        ) {
            percentage = 1;
        }


        const selected =
            shuffle(
                backgroundStudents
            ).slice(
                0,
                Math.max(
                    1,
                    Math.ceil(
                        backgroundStudents.length *
                        percentage
                    )
                )
            );


        selected.forEach(
            (student, index) => {

                if (
                    candleNumber >= 4
                ) {

                    student.classList.add(
                        index % 3 === 0
                            ? "cheering"
                            : "clapping"
                    );

                }

                else {

                    student.classList.add(
                        "clapping"
                    );

                }

            }
        );

    }


    /* =====================================================
       BACKGROUND IDLE
       ===================================================== */

    function startBackgroundIdle() {

        backgroundStudents.forEach(
            student => {

                student.classList.remove(
                    "clapping",
                    "cheering"
                );

            }
        );

    }


    /* =====================================================
       SHUFFLE
       ===================================================== */

    function shuffle(
        array
    ) {

        return [...array].sort(
            () =>
                Math.random() - 0.5
        );

    }


    /* =====================================================
       WRONG CANDLE
       ===================================================== */

    function wrongCandleFeedback(
        candle
    ) {

        candle.animate(
            [
                {
                    transform:
                        "translateX(0)"
                },

                {
                    transform:
                        "translateX(-5px)"
                },

                {
                    transform:
                        "translateX(5px)"
                },

                {
                    transform:
                        "translateX(-3px)"
                },

                {
                    transform:
                        "translateX(0)"
                }
            ],
            {
                duration: 280,
                easing: "ease-out"
            }
        );

    }


    /* =====================================================
       CANDLE SPARKLES
       ===================================================== */

    function createCandleSparkles(
        candle
    ) {

        const scene =
            document.querySelector(
                ".classroom"
            );

        if (!scene) {
            return;
        }


        const candleRect =
            candle.getBoundingClientRect();

        const sceneRect =
            scene.getBoundingClientRect();


        const centerX =
            candleRect.left +
            candleRect.width / 2 -
            sceneRect.left;

        const centerY =
            candleRect.top +
            candleRect.height / 2 -
            sceneRect.top;


        for (
            let i = 0;
            i < 8;
            i++
        ) {

            const sparkle =
                document.createElement(
                    "span"
                );

            sparkle.style.position =
                "absolute";

            sparkle.style.left =
                `${centerX}px`;

            sparkle.style.top =
                `${centerY}px`;

            sparkle.style.width =
                "5px";

            sparkle.style.height =
                "5px";

            sparkle.style.borderRadius =
                "50%";

            sparkle.style.background =
                "#ffd75b";

            sparkle.style.boxShadow =
                "0 0 9px #ffd75b";

            sparkle.style.pointerEvents =
                "none";

            sparkle.style.zIndex =
                "250";


            scene.appendChild(
                sparkle
            );


            const angle =
                Math.random() *
                Math.PI *
                2;

            const distance =
                25 +
                Math.random() * 38;

            const x =
                Math.cos(angle) *
                distance;

            const y =
                Math.sin(angle) *
                distance;

            const duration =
                450 +
                Math.random() * 350;


            sparkle.animate(
                [
                    {
                        transform:
                            "translate(-50%, -50%) scale(0.4)",
                        opacity: 1
                    },

                    {
                        transform:
                            `translate(
                                calc(-50% + ${x}px),
                                calc(-50% + ${y}px)
                            )
                            scale(1.2)`,
                        opacity: 0
                    }
                ],
                {
                    duration,
                    easing:
                        "cubic-bezier(.2,.8,.3,1)"
                }
            );


            setTimeout(
                () => sparkle.remove(),
                duration
            );

        }

    }


    /* =====================================================
       FINAL CELEBRATION
       ===================================================== */

    function finishBirthday() {

        if (finalCelebration) {
            return;
        }

        finalCelebration = true;


        /*
         * Final message.
         */

        if (candleMessageSmall) {

            candleMessageSmall.textContent =
                "MAKE YOUR WISH";

        }

        if (candleMessageText) {

            candleMessageText.textContent =
                "Close your eyes. This one is yours.";

        }

        if (crowdMessage) {

            crowdMessage.textContent =
                "HAPPY BIRTHDAY, SEJAL!";

            crowdMessage.classList.remove(
                "message-pop"
            );

            void crowdMessage.offsetWidth;

            crowdMessage.classList.add(
                "message-pop"
            );

        }


        /*
         * Hide interaction UI.
         */

        if (wishPrompt) {

            wishPrompt.classList.add(
                "hidden"
            );

        }

        if (candleProgress) {

            candleProgress.style.opacity =
                "0";

        }


        /*
         * Make classroom celebrate.
         */

        page.classList.add(
            "celebrating"
        );


        classroom.classList.add(
            "final-celebration"
        );


        finalClassmateCelebration();


        /*
         * Sejal reacts.
         */

        if (sejal) {

            sejal.classList.add(
                "birthday-happy"
            );

        }


        /*
         * Confetti arrives slightly
         * after the crowd reacts.
         */

        setTimeout(
            launchConfetti,
            450
        );


        /*
         * Final wish card.
         */

        setTimeout(
            showWishComplete,
            1500
        );

    }


    /* =====================================================
       FINAL CLASSMATE CELEBRATION
       ===================================================== */

    function finalClassmateCelebration() {

        featuredStudents.forEach(
            (student, index) => {

                student.classList.remove(
                    "clapping",
                    "cheering",
                    "excited"
                );


                setTimeout(
                    () => {

                        student.classList.add(
                            "excited"
                        );

                        student.classList.add(
                            index % 2 === 0
                                ? "cheering"
                                : "clapping"
                        );

                    },
                    index * 120
                );

            }
        );


        backgroundStudents.forEach(
            (student, index) => {

                student.classList.remove(
                    "clapping",
                    "cheering"
                );


                setTimeout(
                    () => {

                        student.classList.add(
                            index % 3 === 0
                                ? "cheering"
                                : "clapping"
                        );

                    },
                    200 +
                    Math.random() * 700
                );

            }
        );

    }


    /* =====================================================
       CONFETTI
       ===================================================== */

    function launchConfetti() {

        if (!confettiLayer) {
            return;
        }


        const colors = [
            "#f6ca4c",
            "#55c7ba",
            "#e97868",
            "#8573ce",
            "#f4e4da",
            "#d9789d"
        ];


        const amount =
            window.innerWidth < 500
                ? 85
                : 140;


        for (
            let i = 0;
            i < amount;
            i++
        ) {

            const piece =
                document.createElement(
                    "span"
                );

            piece.className =
                "confetti-piece";


            const width =
                4 +
                Math.random() * 6;

            const height =
                6 +
                Math.random() * 10;


            piece.style.width =
                `${width}px`;

            piece.style.height =
                `${height}px`;

            piece.style.background =
                colors[
                    Math.floor(
                        Math.random() *
                        colors.length
                    )
                ];

            piece.style.left =
                `${Math.random() * 100}%`;

            piece.style.top =
                `${-20 - Math.random() * 50}px`;


            confettiLayer.appendChild(
                piece
            );


            const rotation =
                Math.random() *
                360;

            const drift =
                -120 +
                Math.random() * 240;

            const fall =
                window.innerHeight *
                (
                    0.75 +
                    Math.random() * 0.45
                );

            const duration =
                1800 +
                Math.random() * 1700;


            piece.animate(
                [
                    {
                        transform:
                            `translate3d(
                                0,
                                0,
                                0
                            )
                            rotate(
                                ${rotation}deg
                            )`,

                        opacity: 1
                    },

                    {
                        transform:
                            `translate3d(
                                ${drift}px,
                                ${fall}px,
                                0
                            )
                            rotate(
                                ${rotation + 540}deg
                            )`,

                        opacity: 0.95
                    }
                ],
                {
                    duration,

                    delay:
                        Math.random() * 550,

                    easing:
                        "cubic-bezier(.15,.75,.35,1)",

                    fill: "forwards"
                }
            );


            setTimeout(
                () => piece.remove(),
                duration + 700
            );

        }

    }


    /* =====================================================
       WISH COMPLETE
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
       CONTINUE
       ===================================================== */

    if (continueToStore) {

        continueToStore.addEventListener(
            "click",
            () => {

                window.location.href =
                    "store.html";

            }
        );

    }


    /* =====================================================
       MESSAGE ANIMATION
       ===================================================== */

    const messageStyle =
        document.createElement(
            "style"
        );

    messageStyle.textContent = `

        .crowd-message.message-pop {

            animation:
                classroomMessagePop
                0.45s
                cubic-bezier(.2,.9,.25,1);

        }


        @keyframes classroomMessagePop {

            0% {

                opacity: 0;

                transform:
                    translate(
                        -50%,
                        -50%
                    )
                    scale(0.78);

            }


            60% {

                opacity: 1;

                transform:
                    translate(
                        -50%,
                        -50%
                    )
                    scale(1.08);

            }


            100% {

                opacity: 1;

                transform:
                    translate(
                        -50%,
                        -50%
                    )
                    scale(1);

            }

        }


        .student.clapping
        .arm-left {

            animation:
                backgroundClapLeft
                0.7s
                ease-in-out
                infinite;

        }


        .student.clapping
        .arm-right {

            animation:
                backgroundClapRight
                0.7s
                ease-in-out
                infinite;

        }


        @keyframes backgroundClapLeft {

            0%,
            100% {
                transform:
                    rotate(20deg);
            }

            50% {
                transform:
                    rotate(-35deg);
            }

        }


        @keyframes backgroundClapRight {

            0%,
            100% {
                transform:
                    rotate(-20deg);
            }

            50% {
                transform:
                    rotate(35deg);
            }

        }


        .student.cheering
        .arm-left {

            animation:
                backgroundCheerLeft
                0.8s
                ease-in-out
                infinite;

        }


        .student.cheering
        .arm-right {

            animation:
                backgroundCheerRight
                0.8s
                ease-in-out
                infinite;

        }


        @keyframes backgroundCheerLeft {

            0%,
            100% {
                transform:
                    rotate(20deg);
            }

            50% {
                transform:
                    rotate(-70deg);
            }

        }


        @keyframes backgroundCheerRight {

            0%,
            100% {
                transform:
                    rotate(-20deg);
            }

            50% {
                transform:
                    rotate(70deg);
            }

        }


        .birthday-happy {

            animation:
                sejalBirthdayHappy
                0.75s
                ease-in-out
                infinite;

        }


        @keyframes sejalBirthdayHappy {

            0%,
            100% {
                transform:
                    translateY(0)
                    rotate(0deg);
            }

            50% {
                transform:
                    translateY(-8px)
                    rotate(1deg);
            }

        }


        .final-celebration
        .featured-student {

            filter:
                brightness(1.06);

        }

    `;

    document.head.appendChild(
        messageStyle
    );


    /* =====================================================
       RESIZE
       ===================================================== */

    let resizeTimer;

    window.addEventListener(
        "resize",
        () => {

            clearTimeout(
                resizeTimer
            );

            resizeTimer =
                setTimeout(
                    () => {

                        /*
                         * Layout is handled by CSS.
                         * Nothing needs manual
                         * recalculation here.
                         */

                    },
                    120
                );

        }
    );


    /* =====================================================
       STARTING STATE
       ===================================================== */

    updateProgress();

});