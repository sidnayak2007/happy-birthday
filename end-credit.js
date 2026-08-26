/* =========================================================
   SEJAL'S BIRTHDAY
   END CREDITS
   30 SECOND VERSION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* =================================================
           ELEMENTS
        ================================================= */

        const stars =
            document.getElementById(
                "stars"
            );


        const replayOverlay =
            document.getElementById(
                "replayOverlay"
            );


        const replayButton =
            document.getElementById(
                "replayButton"
            );


        const stayButton =
            document.getElementById(
                "stayButton"
            );


        /* =================================================
           SETTINGS
        ================================================= */

        const CREDIT_DURATION =
            30000;


        const POPUP_DELAY =
            500;


        /* =================================================
           CREATE STARS
        ================================================= */

        function createStars() {

            if (!stars) {
                return;
            }


            const amount =
                window.innerWidth < 600
                    ? 40
                    : 75;


            for (
                let i = 0;
                i < amount;
                i++
            ) {

                const star =
                    document.createElement(
                        "span"
                    );


                star.className =
                    "star-dot";


                const size =
                    1 +
                    Math.random() * 2.5;


                star.style.width =
                    `${size}px`;


                star.style.height =
                    `${size}px`;


                star.style.left =
                    `${Math.random() * 100}%`;


                star.style.top =
                    `${Math.random() * 100}%`;


                star.style.setProperty(
                    "--speed",
                    `${2 + Math.random() * 4}s`
                );


                star.style.setProperty(
                    "--delay",
                    `${-Math.random() * 5}s`
                );


                stars.appendChild(
                    star
                );

            }

        }


        /* =================================================
           SHOW POPUP
        ================================================= */

        function showReplayPopup() {

            if (!replayOverlay) {
                return;
            }


            replayOverlay.classList.add(
                "show"
            );


            document.body.style.overflow =
                "hidden";


            /*
             * Put keyboard focus on the main
             * action when the popup appears.
             */

            if (replayButton) {

                setTimeout(
                    () => {

                        replayButton.focus();

                    },
                    750
                );

            }

        }


        /* =================================================
           HIDE POPUP
        ================================================= */

        function hideReplayPopup() {

            if (!replayOverlay) {
                return;
            }


            replayOverlay.classList.remove(
                "show"
            );

        }


        /* =================================================
           PLAY AGAIN
        ================================================= */

        function playAgain() {

            window.location.href =
                "index.html";

        }


        /* =================================================
           STAY HERE
        ================================================= */

        function stayHere() {

            hideReplayPopup();

        }


        /* =================================================
           BUTTON EVENTS
        ================================================= */

        if (replayButton) {

            replayButton.addEventListener(
                "click",
                playAgain
            );

        }


        if (stayButton) {

            stayButton.addEventListener(
                "click",
                stayHere
            );

        }


        /* =================================================
           ESC KEY
        ================================================= */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape" &&
                    replayOverlay &&
                    replayOverlay.classList.contains(
                        "show"
                    )
                ) {

                    hideReplayPopup();

                }

            }
        );


        /* =================================================
           CLICK OUTSIDE CARD
        ================================================= */

        if (replayOverlay) {

            replayOverlay.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        replayOverlay
                    ) {

                        hideReplayPopup();

                    }

                }
            );

        }


        /* =================================================
           INITIAL STATE
        ================================================= */

        if (replayOverlay) {

            replayOverlay.classList.remove(
                "show"
            );

        }


        /* =================================================
           GUARANTEED 30 SECOND TIMER
        ================================================= */

        /*
         * We intentionally do NOT depend on
         * animationend.
         *
         * The popup is controlled by JavaScript
         * after exactly 30 seconds.
         */

        window.setTimeout(
            () => {

                window.setTimeout(
                    () => {

                        showReplayPopup();

                    },
                    POPUP_DELAY
                );

            },
            CREDIT_DURATION
        );


        /* =================================================
           CREATE STARS
        ================================================= */

        createStars();

    }
);