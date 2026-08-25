/* =========================================================
   SEJAL'S BASKETBALL GAME
   COMPLETE REPLACEMENT JS

   EXISTING GAME MECHANISM PRESERVED:
   - Angry Birds style drag
   - Pull DOWN / AWAY from hoop
   - Release launches opposite direction
   - Aim trajectory
   - Hoop detection
   - Ball travels through net
   - 5 baskets in a row

   CROWD:
   - Always moving
   - Gets more excited after every basket
   - Does NOT reset after a shot
   - Does NOT overwrite crowd-member transform
   - Uses child animations so existing CSS remains intact
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       DOM
       ===================================================== */

    const game =
        document.getElementById("basketballGame");

    const court =
        document.getElementById("court");

    const player =
        document.getElementById("player");

    const basketball =
        document.getElementById("basketball");

    const shootingArm =
        document.getElementById("shootingArm");

    const rim =
        document.getElementById("hoopRim");

    const net =
        document.getElementById("hoopNet");

    const crowd =
        document.getElementById("crowd");

    const crowdBanners =
        document.getElementById("crowdBanners");

    const bunting =
        document.getElementById("bunting");

    const hoopScore =
        document.getElementById("hoopScore");

    const aimingSystem =
        document.getElementById("aimingSystem");

    const aimGuide =
        document.getElementById("aimGuide");

    const trajectory =
        document.getElementById("trajectory");

    const powerFill =
        document.getElementById("powerFill");

    const gameMessage =
        document.getElementById("gameMessage");

    const instructions =
        document.getElementById("instructions");

    const shotFeedback =
        document.getElementById("shotFeedback");

    const missMessage =
        document.getElementById("missMessage");

    const crowdReaction =
        document.getElementById("crowdReaction");

    const confetti =
        document.getElementById("confetti");

    const victoryScreen =
        document.getElementById("victoryScreen");

    const continueButton =
        document.getElementById("continueButton");


    /* =====================================================
       GAME SETTINGS
       ===================================================== */

    const TARGET_SCORE = 5;

    const BALL_GRAB_RADIUS = 85;

    const MIN_PULL = 28;

    const MAX_PULL = 270;

    const GRAVITY = 850;

    const MIN_SPEED = 600;

    const MAX_SPEED = 1040;

    const RIM_SCORE_WIDTH = 50;

    const TRAJECTORY_SPACING = 21;


    /* =====================================================
       GAME STATE
       ===================================================== */

    let score = 0;

    let aiming = false;

    let shooting = false;

    let gameWon = false;

    let pointerId = null;

    let maxPull = 270;


    /* =====================================================
       CROWD STATE
       ===================================================== */

    let crowdIntensity = 0;

    let crowdFrame = null;

    const crowdAnimationData =
        new WeakMap();


    /* =====================================================
       SLINGSHOT STATE
       ===================================================== */

    const anchor = {
        x: 0,
        y: 0
    };

    const draggedBall = {
        x: 0,
        y: 0
    };

    const pointer = {
        x: 0,
        y: 0
    };

    const pullVector = {
        x: 0,
        y: 0
    };

    const launchVector = {
        x: 0,
        y: -1
    };

    let pullDistance = 0;

    let power = 0;


    /* =====================================================
       SHOT STATE
       ===================================================== */

    const shot = {

        x: 0,

        y: 0,

        vx: 0,

        vy: 0,

        time: 0,

        rotation: 0,

        rimX: 0,

        rimY: 0,

        basketDetected: false,

        afterBasket: false

    };


    let previousBallX = 0;

    let previousBallY = 0;

    let lastFrame = 0;


    /* =====================================================
       HELPERS
       ===================================================== */

    function clamp(
        value,
        min,
        max
    ) {

        return Math.max(
            min,
            Math.min(
                max,
                value
            )
        );

    }


    function distance(
        x1,
        y1,
        x2,
        y2
    ) {

        return Math.hypot(
            x2 - x1,
            y2 - y1
        );

    }


    function normalize(
        x,
        y
    ) {

        const length =
            Math.hypot(
                x,
                y
            );

        if (
            length <
            0.0001
        ) {

            return {
                x: 0,
                y: -1
            };

        }

        return {
            x: x / length,
            y: y / length
        };

    }


    function lerp(
        a,
        b,
        amount
    ) {

        return (
            a +
            (
                b - a
            ) *
            amount
        );

    }


    function calculateMaxPull() {

        const shortSide =
            Math.min(
                window.innerWidth,
                window.innerHeight
            );

        return clamp(
            shortSide * 0.40,
            MIN_PULL,
            MAX_PULL
        );

    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    function initialize() {

        maxPull =
            calculateMaxPull();

        createCrowd();

        createBunting();

        setupBannerTiming();

        setupInput();

        setupContinueButton();

        updateScore();

        resetBall();

        startCrowdAnimation();

        showMessage(
            "Pull the basketball down to aim!"
        );

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize,
            {
                once: true
            }
        );

    } else {

        initialize();

    }


    /* =====================================================
       INPUT
       ===================================================== */

    function setupInput() {

        game.addEventListener(
            "pointerdown",
            onPointerDown,
            {
                passive: false
            }
        );

        window.addEventListener(
            "pointermove",
            onPointerMove,
            {
                passive: false
            }
        );

        window.addEventListener(
            "pointerup",
            onPointerUp,
            {
                passive: false
            }
        );

        window.addEventListener(
            "pointercancel",
            onPointerCancel,
            {
                passive: false
            }
        );

        game.addEventListener(
            "dragstart",
            function (event) {

                event.preventDefault();

            }
        );

    }


    function onPointerDown(
        event
    ) {

        if (
            aiming ||
            shooting ||
            gameWon
        ) {

            return;

        }

        if (
            !beginAim(
                event.clientX,
                event.clientY
            )
        ) {

            return;

        }

        pointerId =
            event.pointerId;

        try {

            game.setPointerCapture(
                event.pointerId
            );

        } catch (
            error
        ) {}

        event.preventDefault();

    }


    function onPointerMove(
        event
    ) {

        if (
            !aiming ||
            event.pointerId !==
            pointerId
        ) {

            return;

        }

        updateAim(
            event.clientX,
            event.clientY
        );

        event.preventDefault();

    }


    function onPointerUp(
        event
    ) {

        if (
            !aiming ||
            event.pointerId !==
            pointerId
        ) {

            return;

        }

        try {

            game.releasePointerCapture(
                event.pointerId
            );

        } catch (
            error
        ) {}

        pointerId =
            null;

        finishAim(
            event.clientX,
            event.clientY
        );

    }


    function onPointerCancel(
        event
    ) {

        if (
            event.pointerId !==
            pointerId
        ) {

            return;

        }

        pointerId =
            null;

        cancelAim();

    }


    /* =====================================================
       BEGIN AIM
       ===================================================== */

    function beginAim(
        x,
        y
    ) {

        if (
            aiming ||
            shooting ||
            gameWon
        ) {

            return false;

        }

        const ball =
            getBallCenter();

        if (
            distance(
                x,
                y,
                ball.x,
                ball.y
            ) >
            BALL_GRAB_RADIUS
        ) {

            return false;

        }

        anchor.x =
            ball.x;

        anchor.y =
            ball.y;

        draggedBall.x =
            ball.x;

        draggedBall.y =
            ball.y;

        pullDistance = 0;

        power = 0;

        aiming = true;

        basketball.classList.add(
            "aiming"
        );

        aimingSystem.classList.add(
            "active"
        );

        instructions.classList.add(
            "hidden"
        );

        if (
            gameMessage
        ) {

            gameMessage.classList.add(
                "aiming"
            );

        }

        updateAim(
            x,
            y
        );

        return true;

    }


    /* =====================================================
       UPDATE AIM
       ===================================================== */

    function updateAim(
        x,
        y
    ) {

        if (
            !aiming
        ) {

            return;

        }

        pointer.x =
            x;

        pointer.y =
            y;

        let dx =
            x -
            anchor.x;

        let dy =
            y -
            anchor.y;

        const rawDistance =
            Math.hypot(
                dx,
                dy
            );

        if (
            rawDistance >
            maxPull
        ) {

            const ratio =
                maxPull /
                rawDistance;

            dx *= ratio;

            dy *= ratio;

        }

        draggedBall.x =
            anchor.x +
            dx;

        draggedBall.y =
            anchor.y +
            dy;

        pullDistance =
            Math.hypot(
                dx,
                dy
            );

        const pull =
            normalize(
                dx,
                dy
            );

        pullVector.x =
            pull.x;

        pullVector.y =
            pull.y;

        /*
         * Angry Birds mechanism:
         *
         * Pull DOWN  -> ball goes UP
         * Pull LEFT  -> ball goes RIGHT
         * Pull RIGHT -> ball goes LEFT
         */
        launchVector.x =
            -pull.x;

        launchVector.y =
            -pull.y;

        power =
            clamp(
                pullDistance /
                maxPull,
                0,
                1
            );

        renderAim();

    }


    /* =====================================================
       RENDER AIM
       ===================================================== */

    function renderAim() {

        const courtRect =
            court.getBoundingClientRect();

        const anchorX =
            anchor.x -
            courtRect.left;

        const anchorY =
            anchor.y -
            courtRect.top;

        const draggedX =
            draggedBall.x -
            courtRect.left;

        const draggedY =
            draggedBall.y -
            courtRect.top;

        const angle =
            Math.atan2(
                draggedY -
                anchorY,
                draggedX -
                anchorX
            );

        aimGuide.style.left =
            anchorX +
            "px";

        aimGuide.style.top =
            anchorY +
            "px";

        aimGuide.style.width =
            Math.max(
                20,
                pullDistance
            ) +
            "px";

        aimGuide.style.transform =
            "rotate(" +
            angle +
            "rad)";

        powerFill.style.width =
            (
                power *
                100
            ) +
            "%";

        basketball.style.position =
            "fixed";

        basketball.style.left =
            draggedBall.x +
            "px";

        basketball.style.top =
            draggedBall.y +
            "px";

        basketball.style.transform =
            "translate(-50%, -50%)";

        drawTrajectory();

    }


    /* =====================================================
       BALL POSITION
       ===================================================== */

    function getBallCenter() {

        const rect =
            basketball.getBoundingClientRect();

        return {

            x:
                rect.left +
                rect.width /
                2,

            y:
                rect.top +
                rect.height /
                2

        };

    }


    function getRimCenter() {

        const rect =
            rim.getBoundingClientRect();

        return {

            x:
                rect.left +
                rect.width /
                2,

            y:
                rect.top +
                rect.height /
                2

        };

    }


    /* =====================================================
       SHOOTING
       ===================================================== */

    function getLaunchSpeed() {

        return lerp(
            MIN_SPEED,
            MAX_SPEED,
            power
        );

    }


    function getVelocity() {

        const speed =
            getLaunchSpeed();

        return {

            x:
                launchVector.x *
                speed,

            y:
                launchVector.y *
                speed

        };

    }


    function projectilePosition(
        t,
        velocity
    ) {

        return {

            x:
                anchor.x +
                velocity.x *
                t,

            y:
                anchor.y +
                velocity.y *
                t +
                0.5 *
                GRAVITY *
                t *
                t

        };

    }


    function findRimCrossing(
        velocity
    ) {

        const rimY =
            getRimCenter().y;

        const a =
            0.5 *
            GRAVITY;

        const b =
            velocity.y;

        const c =
            anchor.y -
            rimY;

        const discriminant =
            b * b -
            4 *
            a *
            c;

        if (
            discriminant <
            0
        ) {

            return null;

        }

        const root =
            Math.sqrt(
                discriminant
            );

        const t1 =
            (
                -b -
                root
            ) /
            (
                2 *
                a
            );

        const t2 =
            (
                -b +
                root
            ) /
            (
                2 *
                a
            );

        const candidates = [
            t1,
            t2
        ].filter(
            function (t) {

                return (
                    t > 0 &&
                    t < 4
                );

            }
        );

        if (
            !candidates.length
        ) {

            return null;

        }

        return Math.max(
            ...candidates
        );

    }


    function trajectoryCanReachHoop(
        velocity
    ) {

        const time =
            findRimCrossing(
                velocity
            );

        if (
            time ===
            null
        ) {

            return false;

        }

        const rimPosition =
            getRimCenter();

        const predicted =
            projectilePosition(
                time,
                velocity
            );

        return (
            Math.abs(
                predicted.x -
                rimPosition.x
            ) <= 70
        );

    }


    /* =====================================================
       TRAJECTORY
       ===================================================== */

    function drawTrajectory() {

        if (
            !aiming
        ) {

            return;

        }

        trajectory.innerHTML =
            "";

        const velocity =
            getVelocity();

        const rimPosition =
            getRimCenter();

        let endTime =
            findRimCrossing(
                velocity
            );

        if (
            endTime ===
            null
        ) {

            endTime =
                1.25;

        }

        endTime +=
            0.12;

        const distanceTravelled =
            Math.hypot(
                velocity.x,
                velocity.y
            ) *
            endTime;

        const dotCount =
            clamp(
                Math.ceil(
                    distanceTravelled /
                    TRAJECTORY_SPACING
                ),
                24,
                100
            );

        const courtRect =
            court.getBoundingClientRect();

        for (
            let i = 1;
            i <= dotCount;
            i++
        ) {

            const progress =
                i /
                dotCount;

            const t =
                endTime *
                progress;

            const point =
                projectilePosition(
                    t,
                    velocity
                );

            if (
                point.x <
                    courtRect.left -
                    150 ||
                point.x >
                    courtRect.right +
                    150 ||
                point.y >
                    courtRect.bottom +
                    150
            ) {

                continue;

            }

            const dot =
                document.createElement(
                    "span"
                );

            dot.className =
                "trajectory-dot";

            dot.style.left =
                (
                    point.x -
                    courtRect.left
                ) +
                "px";

            dot.style.top =
                (
                    point.y -
                    courtRect.top
                ) +
                "px";

            dot.style.opacity =
                (
                    1 -
                    progress *
                    0.35
                );

            const size =
                Math.max(
                    5,
                    7 -
                    progress *
                    2
                );

            dot.style.width =
                size +
                "px";

            dot.style.height =
                size +
                "px";

            trajectory.appendChild(
                dot
            );

        }

        const target =
            document.createElement(
                "span"
            );

        target.className =
            "trajectory-target";

        target.style.left =
            (
                rimPosition.x -
                courtRect.left
            ) +
            "px";

        target.style.top =
            (
                rimPosition.y -
                courtRect.top
            ) +
            "px";

        trajectory.appendChild(
            target
        );

    }


    /* =====================================================
       FINISH AIM
       ===================================================== */

    function finishAim(
        x,
        y
    ) {

        if (
            !aiming
        ) {

            return;

        }

        updateAim(
            x,
            y
        );

        const finalPull =
            distance(
                anchor.x,
                anchor.y,
                draggedBall.x,
                draggedBall.y
            );

        aiming = false;

        basketball.classList.remove(
            "aiming"
        );

        hideAim();

        if (
            finalPull <
            MIN_PULL
        ) {

            resetBall();

            showMessage(
                "Pull down a little more!"
            );

            return;

        }

        shoot();

    }


    function cancelAim() {

        aiming = false;

        pointerId = null;

        hideAim();

        resetBall();

    }


    function hideAim() {

        aimingSystem.classList.remove(
            "active"
        );

        trajectory.innerHTML =
            "";

        powerFill.style.width =
            "0%";

        if (
            gameMessage
        ) {

            gameMessage.classList.remove(
                "aiming"
            );

        }

        if (
            instructions
        ) {

            instructions.classList.remove(
                "hidden"
            );

        }

    }


    /* =====================================================
       SHOOT
       ===================================================== */

    function shoot() {

        if (
            shooting ||
            gameWon
        ) {

            return;

        }

        shooting = true;

        shot.basketDetected =
            false;

        shot.afterBasket =
            false;

        const rimPosition =
            getRimCenter();

        shot.rimX =
            rimPosition.x;

        shot.rimY =
            rimPosition.y;

        shot.x =
            anchor.x;

        shot.y =
            anchor.y;

        const velocity =
            getVelocity();

        shot.vx =
            velocity.x;

        shot.vy =
            velocity.y;

        shot.time = 0;

        shot.rotation = 0;

        previousBallX =
            shot.x;

        previousBallY =
            shot.y;

        /*
         * This is prediction only.
         * It never forces the basket.
         */
        trajectoryCanReachHoop(
            velocity
        );

        game.appendChild(
            basketball
        );

        basketball.style.position =
            "fixed";

        basketball.style.left =
            shot.x +
            "px";

        basketball.style.top =
            shot.y +
            "px";

        basketball.style.opacity =
            "1";

        basketball.style.transform =
            "translate(-50%, -50%)";

        basketball.classList.add(
            "shooting",
            "flying"
        );

        shootingArm.classList.add(
            "shooting"
        );

        lastFrame =
            performance.now();

        requestAnimationFrame(
            animateShot
        );

    }


    /* =====================================================
       SHOT PHYSICS
       ===================================================== */

    function animateShot(
        timestamp
    ) {

        if (
            !shooting
        ) {

            return;

        }

        const delta =
            (
                timestamp -
                lastFrame
            ) /
            1000;

        lastFrame =
            timestamp;

        shot.time +=
            Math.min(
                delta,
                0.033
            );

        const x =
            shot.x +
            shot.vx *
            shot.time;

        const y =
            shot.y +
            shot.vy *
            shot.time +
            0.5 *
            GRAVITY *
            shot.time *
            shot.time;

        shot.rotation +=
            0.22;

        basketball.style.left =
            x +
            "px";

        basketball.style.top =
            y +
            "px";

        basketball.style.transform =
            "translate(-50%, -50%) rotate(" +
            shot.rotation +
            "rad)";

        basketball.style.opacity =
            "1";


        /* =================================================
           HOOP DETECTION
           ================================================= */

        if (
            !shot.basketDetected
        ) {

            const currentVelocityY =
                shot.vy +
                GRAVITY *
                shot.time;

            const movingDown =
                currentVelocityY >
                0;

            const crossedRim =
                previousBallY <
                    shot.rimY &&
                y >=
                    shot.rimY;

            const horizontalDistance =
                Math.abs(
                    x -
                    shot.rimX
                );

            const insideRim =
                horizontalDistance <=
                RIM_SCORE_WIDTH;

            if (
                movingDown &&
                crossedRim &&
                insideRim
            ) {

                finishBasket();

            }

        }


        previousBallX =
            x;

        previousBallY =
            y;


        /* =================================================
           MISS
           ================================================= */

        if (
            !shot.basketDetected &&
            (
                shot.time > 3.2 ||
                y >
                    window.innerHeight +
                    300 ||
                x <
                    -350 ||
                x >
                    window.innerWidth +
                    350
            )
        ) {

            finishMiss();

            return;

        }


        /*
         * Keep the ball alive after scoring.
         */
        requestAnimationFrame(
            animateShot
        );

    }


    /* =====================================================
       SCORE
       ===================================================== */

    function finishBasket() {

        if (
            shot.basketDetected
        ) {

            return;

        }

        shot.basketDetected =
            true;

        score =
            Math.min(
                TARGET_SCORE,
                score + 1
            );

        updateScore();

        /*
         * THIS is the only thing that changes
         * the crowd's excitement level.
         *
         * The crowd itself is NOT recreated.
         */
        setCrowdIntensity(
            score
        );

        basketball.classList.add(
            "made-shot"
        );

        shootingArm.classList.remove(
            "shooting"
        );


        if (
            net
        ) {

            net.classList.remove(
                "swish"
            );

            void net.offsetWidth;

            net.classList.add(
                "swish"
            );

        }


        if (
            rim
        ) {

            rim.classList.remove(
                "scored"
            );

            void rim.offsetWidth;

            rim.classList.add(
                "scored"
            );

        }


        showShotFeedback();

        celebrateCrowd();

        spawnConfetti(
            18,
            false
        );


        /*
         * Let the ball continue down through
         * the hoop before resetting.
         */
        shot.afterBasket =
            true;

        shot.vx *=
            0.88;

        shot.vy =
            Math.max(
                180,
                shot.vy *
                0.12
            );


        setTimeout(
            function () {

                if (
                    score >=
                    TARGET_SCORE
                ) {

                    shooting = false;

                    resetBall();

                    showVictory();

                    return;

                }

                shooting = false;

                resetBall();

                showMessage(
                    nextMessage()
                );

            },
            750
        );

    }


    /* =====================================================
       MISS
       ===================================================== */

    function finishMiss() {

        if (
            !shooting
        ) {

            return;

        }

        shooting = false;

        score = 0;

        setCrowdIntensity(
            0
        );

        updateScore();

        showMissFeedback();

        const currentX =
            parseFloat(
                basketball.style.left
            ) ||
            shot.x;

        const currentY =
            parseFloat(
                basketball.style.top
            ) ||
            shot.y;

        const start =
            performance.now();


        function settle(
            timestamp
        ) {

            const progress =
                clamp(
                    (
                        timestamp -
                        start
                    ) /
                    250,
                    0,
                    1
                );

            basketball.style.left =
                currentX +
                "px";

            basketball.style.top =
                (
                    currentY +
                    progress *
                    70
                ) +
                "px";

            shot.rotation +=
                0.25;

            basketball.style.transform =
                "translate(-50%, -50%) rotate(" +
                shot.rotation +
                "rad)";

            if (
                progress <
                1
            ) {

                requestAnimationFrame(
                    settle
                );

                return;

            }

            setTimeout(
                function () {

                    resetBall();

                    showMessage(
                        "Almost! Pull down and try again!"
                    );

                },
                220
            );

        }


        requestAnimationFrame(
            settle
        );

    }


    /* =====================================================
       RESET BALL
       ===================================================== */

    function resetBall() {

        const character =
            player.querySelector(
                ".player-character"
            );

        if (
            character &&
            basketball.parentNode !==
            character
        ) {

            character.appendChild(
                basketball
            );

        }

        basketball.classList.remove(
            "aiming",
            "shooting",
            "flying",
            "made-shot"
        );

        basketball.style.position =
            "";

        basketball.style.left =
            "";

        basketball.style.top =
            "";

        basketball.style.width =
            "";

        basketball.style.height =
            "";

        basketball.style.transform =
            "";

        basketball.style.opacity =
            "";

        shootingArm.classList.remove(
            "shooting"
        );

        aiming = false;

        shooting = false;

        pointerId = null;

        pullDistance = 0;

        power = 0;

        previousBallX = 0;

        previousBallY = 0;

        shot.basketDetected =
            false;

        shot.afterBasket =
            false;

        hideAim();

    }


    /* =====================================================
       SCORE HUD
       ===================================================== */

    function updateScore() {

        if (
            !hoopScore
        ) {

            return;

        }

        hoopScore.textContent =
            score +
            " / " +
            TARGET_SCORE;

        hoopScore.classList.remove(
            "score-bump"
        );

        void hoopScore.offsetWidth;

        hoopScore.classList.add(
            "score-bump"
        );

    }


    /* =====================================================
       MESSAGES
       ===================================================== */

    function showMessage(
        text
    ) {

        if (
            gameMessage
        ) {

            gameMessage.textContent =
                text;

        }

    }


    function nextMessage() {

        const messages = {

            1:
                "Great start! Keep going!",

            2:
                "Two in a row! Nice!",

            3:
                "THREE! You're on fire!",

            4:
                "ONE MORE, SEJAL!"

        };

        return (
            messages[score] ||
            "Pull the basketball down!"
        );

    }


    /* =====================================================
       SHOT FEEDBACK
       ===================================================== */

    function showShotFeedback() {

        if (
            !shotFeedback
        ) {

            return;

        }

        const messages = [

            "NICE!",

            "BUCKET!",

            "YES SEJAL!",

            "AMAZING!",

            "LET'S GOOOO!"

        ];

        shotFeedback.textContent =
            messages[
                Math.min(
                    score - 1,
                    messages.length - 1
                )
            ];

        shotFeedback.classList.remove(
            "show"
        );

        void shotFeedback.offsetWidth;

        shotFeedback.classList.add(
            "show"
        );

    }


    function showMissFeedback() {

        if (
            !missMessage
        ) {

            return;

        }

        missMessage.textContent =
            "ALMOST!";

        missMessage.classList.remove(
            "show"
        );

        void missMessage.offsetWidth;

        missMessage.classList.add(
            "show"
        );

    }


    /* =====================================================
       CROWD
       ===================================================== */

    const SKIN_TONES = [

        "#d4936c",
        "#b86f4e",
        "#e1aa80",
        "#9e6047",
        "#c9825d",
        "#edb58d"

    ];


    const SHIRT_COLORS = [

        "#e2c65a",
        "#d76d5c",
        "#6e9fc2",
        "#75a875",
        "#c47c9c",
        "#d88942",
        "#8b6fd6",
        "#2fd3c0"

    ];


    function createCrowd() {

        if (
            !crowd
        ) {

            return;

        }

        crowd.innerHTML =
            "";

        const rows = 4;

        const members =
            Math.max(
                14,
                Math.ceil(
                    window.innerWidth /
                    34
                )
            );

        const fragment =
            document.createDocumentFragment();


        for (
            let row = 0;
            row < rows;
            row++
        ) {

            for (
                let i = 0;
                i < members;
                i++
            ) {

                const person =
                    document.createElement(
                        "div"
                    );

                person.className =
                    "crowd-member";

                const seed =
                    i * 7 +
                    row * 13;

                person.style.left =
                    (
                        i /
                        members
                    ) *
                    100 +
                    "%";

                person.style.bottom =
                    (
                        row * 24 +
                        3
                    ) +
                    "%";

                person.style.setProperty(
                    "--crowd-skin",
                    SKIN_TONES[
                        seed %
                        SKIN_TONES.length
                    ]
                );

                person.style.setProperty(
                    "--crowd-shirt",
                    SHIRT_COLORS[
                        (
                            seed +
                            row
                        ) %
                        SHIRT_COLORS.length
                    ]
                );

                person.style.setProperty(
                    "--crowd-scale",
                    (
                        0.82 +
                        (
                            seed %
                            10
                        ) /
                        25
                    ).toFixed(2)
                );

                person.style.setProperty(
                    "--crowd-speed",
                    (
                        1.4 +
                        (
                            seed %
                            10
                        ) /
                        10
                    ) +
                    "s"
                );

                person.style.setProperty(
                    "--crowd-delay",
                    (
                        seed %
                        20
                    ) /
                    10 +
                    "s"
                );


                if (
                    seed % 3 ===
                    0
                ) {

                    person.classList.add(
                        "crowd-wave-left"
                    );

                }


                if (
                    seed % 4 ===
                    0
                ) {

                    person.classList.add(
                        "crowd-wave-right"
                    );

                }


                if (
                    seed % 5 ===
                    0
                ) {

                    person.classList.add(
                        "crowd-cheering"
                    );

                }


                const head =
                    document.createElement(
                        "span"
                    );

                head.className =
                    "crowd-head";


                const body =
                    document.createElement(
                        "span"
                    );

                body.className =
                    "crowd-body";


                const leftArm =
                    document.createElement(
                        "span"
                    );

                leftArm.className =
                    "crowd-arm crowd-arm-left";


                const rightArm =
                    document.createElement(
                        "span"
                    );

                rightArm.className =
                    "crowd-arm crowd-arm-right";


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

                fragment.appendChild(
                    person
                );

            }

        }


        crowd.appendChild(
            fragment
        );


        /*
         * Apply the CURRENT intensity.
         *
         * We don't force it to zero here.
         */
        updateCrowdIntensity();

    }


    /* =====================================================
       CROWD INTENSITY
       ===================================================== */

    function setCrowdIntensity(
        level
    ) {

        crowdIntensity =
            clamp(
                level,
                0,
                TARGET_SCORE
            );

        updateCrowdIntensity();

    }


    function updateCrowdIntensity() {

        if (
            !crowd
        ) {

            return;

        }

        const level =
            crowdIntensity;


        /*
         * These classes can be used by the existing
         * stylesheet if already present.
         *
         * No CSS is added or modified here.
         */
        crowd.classList.remove(

            "crowd-intensity-0",
            "crowd-intensity-1",
            "crowd-intensity-2",
            "crowd-intensity-3",
            "crowd-intensity-4",
            "crowd-intensity-5",
            "final-hoop",
            "full-celebration"

        );


        crowd.classList.add(
            "crowd-intensity-" +
            level
        );


        if (
            level === 4
        ) {

            crowd.classList.add(
                "final-hoop"
            );

        }


        if (
            level >= 5
        ) {

            crowd.classList.add(
                "full-celebration"
            );

        }


        if (
            crowdBanners
        ) {

            crowdBanners.classList.remove(

                "banner-intensity-0",
                "banner-intensity-1",
                "banner-intensity-2",
                "banner-intensity-3",
                "banner-intensity-4",
                "banner-intensity-5"

            );

            crowdBanners.classList.add(
                "banner-intensity-" +
                level
            );

        }


        /*
         * Immediately change the child animation
         * intensity.
         */
        refreshCrowdAnimations();

    }


    /* =====================================================
       CROWD ANIMATION
       ===================================================== */

    function startCrowdAnimation() {

        if (
            crowdFrame
        ) {

            return;

        }


        function loop(
            timestamp
        ) {

            updateCrowdMovement(
                timestamp
            );

            crowdFrame =
                requestAnimationFrame(
                    loop
                );

        }


        crowdFrame =
            requestAnimationFrame(
                loop
            );

    }


    /*
     * This animation NEVER touches:
     *
     * person.style.transform
     *
     * That is extremely important because your
     * existing CSS owns the parent crowd movement.
     */
    function updateCrowdMovement(
        timestamp
    ) {

        if (
            !crowd
        ) {

            return;

        }


        const people =
            crowd.querySelectorAll(
                ".crowd-member"
            );


        if (
            !people.length
        ) {

            return;

        }


        const t =
            timestamp /
            1000;


        /*
         * Tiny natural variation continuously.
         */
        people.forEach(
            function (
                person,
                index
            ) {

                const state =
                    crowdAnimationData.get(
                        person
                    );

                if (
                    !state
                ) {

                    return;

                }


                const wave =
                    Math.sin(
                        t *
                        state.speed +
                        state.phase
                    );


                /*
                 * Use CSS custom properties only.
                 * We don't override transform.
                 */
                person.style.setProperty(
                    "--crowd-pulse",
                    (
                        (
                            wave +
                            1
                        ) /
                        2
                    ).toFixed(3)
                );


                /*
                 * This property can safely exist even
                 * if the current CSS doesn't use it.
                 */
                person.style.setProperty(
                    "--crowd-energy",
                    (
                        crowdIntensity /
                        TARGET_SCORE
                    ).toFixed(2)
                );

            }
        );

    }


    function refreshCrowdAnimations() {

        if (
            !crowd
        ) {

            return;

        }


        const people =
            crowd.querySelectorAll(
                ".crowd-member"
            );


        people.forEach(
            function (
                person,
                index
            ) {

                let state =
                    crowdAnimationData.get(
                        person
                    );


                if (
                    !state
                ) {

                    state = {

                        phase:
                            index *
                            0.71,

                        speed:
                            1.2 +
                            (
                                index %
                                7
                            ) *
                            0.13,

                        head: null,

                        body: null,

                        leftArm: null,

                        rightArm: null

                    };

                    crowdAnimationData.set(
                        person,
                        state
                    );

                }


                /*
                 * Cancel ONLY animations created by
                 * this function.
                 */
                [
                    "head",
                    "body",
                    "leftArm",
                    "rightArm"
                ].forEach(
                    function (
                        key
                    ) {

                        if (
                            state[key]
                        ) {

                            state[key].cancel();

                            state[key] =
                                null;

                        }

                    }
                );


                const head =
                    person.querySelector(
                        ".crowd-head"
                    );

                const body =
                    person.querySelector(
                        ".crowd-body"
                    );

                const leftArm =
                    person.querySelector(
                        ".crowd-arm-left"
                    );

                const rightArm =
                    person.querySelector(
                        ".crowd-arm-right"
                    );


                if (
                    !head ||
                    !body ||
                    !leftArm ||
                    !rightArm
                ) {

                    return;

                }


                const level =
                    crowdIntensity;


                /*
                 * Calm -> excited -> celebration.
                 */
                const speed =
                    Math.max(
                        380,
                        1450 -
                        level *
                        190
                    );


                const bob =
                    1.5 +
                    level *
                    2.3;


                const headBob =
                    0.8 +
                    level *
                    1.4;


                const armLift =
                    7 +
                    level *
                    8;


                const armSwing =
                    8 +
                    level *
                    7;


                /*
                 * BODY
                 */
                state.body =
                    body.animate(
                        [
                            {
                                transform:
                                    "translateY(0px)"
                            },
                            {
                                transform:
                                    "translateY(-" +
                                    bob +
                                    "px)"
                            },
                            {
                                transform:
                                    "translateY(0px)"
                            }
                        ],
                        {
                            duration:
                                speed,
                            delay:
                                (
                                    index %
                                    9
                                ) *
                                35,
                            iterations:
                                Infinity,
                            easing:
                                "ease-in-out"
                        }
                    );


                /*
                 * HEAD
                 */
                state.head =
                    head.animate(
                        [
                            {
                                transform:
                                    "translateY(0px)"
                            },
                            {
                                transform:
                                    "translateY(-" +
                                    headBob +
                                    "px)"
                            },
                            {
                                transform:
                                    "translateY(0px)"
                            }
                        ],
                        {
                            duration:
                                speed *
                                1.1,
                            delay:
                                (
                                    index %
                                    7
                                ) *
                                50,
                            iterations:
                                Infinity,
                            easing:
                                "ease-in-out"
                        }
                    );


                /*
                 * LEFT ARM
                 */
                state.leftArm =
                    leftArm.animate(
                        [
                            {
                                transform:
                                    "rotate(-" +
                                    armSwing +
                                    "deg)"
                            },
                            {
                                transform:
                                    "translateY(-" +
                                    armLift +
                                    "px) rotate(" +
                                    armSwing +
                                    "deg)"
                            },
                            {
                                transform:
                                    "translateY(0px) rotate(-" +
                                    armSwing +
                                    "deg)"
                            }
                        ],
                        {
                            duration:
                                speed *
                                0.92,
                            delay:
                                (
                                    index %
                                    11
                                ) *
                                42,
                            iterations:
                                Infinity,
                            easing:
                                "ease-in-out"
                        }
                    );


                /*
                 * RIGHT ARM
                 */
                state.rightArm =
                    rightArm.animate(
                        [
                            {
                                transform:
                                    "rotate(" +
                                    armSwing +
                                    "deg)"
                            },
                            {
                                transform:
                                    "translateY(-" +
                                    (
                                        armLift *
                                        1.15
                                    ) +
                                    "px) rotate(-" +
                                    armSwing +
                                    "deg)"
                            },
                            {
                                transform:
                                    "translateY(0px) rotate(" +
                                    armSwing +
                                    "deg)"
                            }
                        ],
                        {
                            duration:
                                speed *
                                0.86,
                            delay:
                                (
                                    index %
                                    13
                                ) *
                                47,
                            iterations:
                                Infinity,
                            easing:
                                "ease-in-out"
                        }
                    );


                /*
                 * 3+ baskets:
                 * some people wave much more strongly.
                 */
                if (
                    level >= 3 &&
                    index % 3 === 0
                ) {

                    state.leftArm.cancel();

                    state.rightArm.cancel();


                    state.leftArm =
                        leftArm.animate(
                            [
                                {
                                    transform:
                                        "rotate(-15deg)"
                                },
                                {
                                    transform:
                                        "translateY(-" +
                                        (
                                            armLift +
                                            14
                                        ) +
                                        "px) rotate(30deg)"
                                },
                                {
                                    transform:
                                        "translateY(-" +
                                        (
                                            armLift *
                                            0.5
                                        ) +
                                        "px) rotate(-20deg)"
                                }
                            ],
                            {
                                duration:
                                    Math.max(
                                        320,
                                        speed *
                                        0.68
                                    ),
                                iterations:
                                    Infinity,
                                easing:
                                    "ease-in-out"
                            }
                        );


                    state.rightArm =
                        rightArm.animate(
                            [
                                {
                                    transform:
                                        "rotate(15deg)"
                                },
                                {
                                    transform:
                                        "translateY(-" +
                                        (
                                            armLift +
                                            18
                                        ) +
                                        "px) rotate(-30deg)"
                                },
                                {
                                    transform:
                                        "translateY(-" +
                                        (
                                            armLift *
                                            0.5
                                        ) +
                                        "px) rotate(20deg)"
                                }
                            ],
                            {
                                duration:
                                    Math.max(
                                        300,
                                        speed *
                                        0.63
                                    ),
                                iterations:
                                    Infinity,
                                easing:
                                    "ease-in-out"
                            }
                        );

                }


                /*
                 * 4 baskets:
                 * final-shot tension.
                 */
                if (
                    level === 4 &&
                    index % 2 === 0
                ) {

                    state.leftArm.cancel();

                    state.rightArm.cancel();


                    state.leftArm =
                        leftArm.animate(
                            [
                                {
                                    transform:
                                        "rotate(-18deg)"
                                },
                                {
                                    transform:
                                        "translateY(-38px) rotate(35deg)"
                                },
                                {
                                    transform:
                                        "translateY(-15px) rotate(-25deg)"
                                }
                            ],
                            {
                                duration:
                                    470 +
                                    (
                                        index %
                                        5
                                    ) *
                                    35,
                                iterations:
                                    Infinity,
                                easing:
                                    "ease-in-out"
                            }
                        );


                    state.rightArm =
                        rightArm.animate(
                            [
                                {
                                    transform:
                                        "rotate(18deg)"
                                },
                                {
                                    transform:
                                        "translateY(-42px) rotate(-35deg)"
                                },
                                {
                                    transform:
                                        "translateY(-16px) rotate(25deg)"
                                }
                            ],
                            {
                                duration:
                                    440 +
                                    (
                                        index %
                                        4
                                    ) *
                                    30,
                                iterations:
                                    Infinity,
                                easing:
                                    "ease-in-out"
                            }
                        );

                }


                /*
                 * 5 baskets:
                 * full celebration.
                 */
                if (
                    level >= 5
                ) {

                    state.body.cancel();

                    state.leftArm.cancel();

                    state.rightArm.cancel();


                    state.body =
                        body.animate(
                            [
                                {
                                    transform:
                                        "translateY(0px) scale(1)"
                                },
                                {
                                    transform:
                                        "translateY(-10px) scale(1.04)"
                                },
                                {
                                    transform:
                                        "translateY(0px) scale(1)"
                                }
                            ],
                            {
                                duration:
                                    430 +
                                    (
                                        index %
                                        5
                                    ) *
                                    45,
                                iterations:
                                    Infinity,
                                easing:
                                    "ease-in-out"
                            }
                        );


                    state.leftArm =
                        leftArm.animate(
                            [
                                {
                                    transform:
                                        "rotate(-20deg)"
                                },
                                {
                                    transform:
                                        "translateY(-52px) rotate(42deg)"
                                },
                                {
                                    transform:
                                        "translateY(-25px) rotate(-35deg)"
                                }
                            ],
                            {
                                duration:
                                    390 +
                                    (
                                        index %
                                        4
                                    ) *
                                    40,
                                iterations:
                                    Infinity,
                                easing:
                                    "ease-in-out"
                            }
                        );


                    state.rightArm =
                        rightArm.animate(
                            [
                                {
                                    transform:
                                        "rotate(20deg)"
                                },
                                {
                                    transform:
                                        "translateY(-55px) rotate(-42deg)"
                                },
                                {
                                    transform:
                                        "translateY(-25px) rotate(35deg)"
                                }
                            ],
                            {
                                duration:
                                    360 +
                                    (
                                        index %
                                        3
                                    ) *
                                    40,
                                iterations:
                                    Infinity,
                                easing:
                                    "ease-in-out"
                            }
                        );

                }

            }
        );

    }


    /* =====================================================
       CROWD REACTION
       ===================================================== */

    function celebrateCrowd() {

        /*
         * DO NOT createCrowd() here.
         *
         * This is what prevents the crowd from
         * stopping/restarting after every shot.
         */
        setCrowdIntensity(
            score
        );

        if (
            crowdReaction
        ) {

            const messages = [

                "NICE SEJAL!",

                "GO SEJAL!",

                "YESSS!",

                "ONE MORE!",

                "SEJAL! SEJAL! SEJAL!"

            ];

            crowdReaction.textContent =
                messages[
                    Math.min(
                        score - 1,
                        messages.length - 1
                    )
                ];

            crowdReaction.classList.remove(
                "show"
            );

            void crowdReaction.offsetWidth;

            crowdReaction.classList.add(
                "show"
            );

        }

    }


    /* =====================================================
       BUNTING
       ===================================================== */

    function createBunting() {

        if (
            !bunting
        ) {

            return;

        }

        bunting.innerHTML =
            "";

        const colors = [

            "#ffc93c",
            "#ff6b57",
            "#2fd3c0",
            "#8b6fd6",
            "#fff8ec"

        ];

        const count =
            Math.max(
                14,
                Math.ceil(
                    window.innerWidth /
                    26
                )
            );

        for (
            let i = 0;
            i < count;
            i++
        ) {

            const flag =
                document.createElement(
                    "span"
                );

            flag.className =
                "bunting-flag";

            flag.style.left =
                (
                    i /
                    Math.max(
                        1,
                        count - 1
                    )
                ) *
                100 +
                "%";

            flag.style.setProperty(
                "--flag-color",
                colors[
                    i %
                    colors.length
                ]
            );

            flag.style.setProperty(
                "--flag-delay",
                (
                    i % 6
                ) *
                0.12 +
                "s"
            );

            bunting.appendChild(
                flag
            );

        }

    }


    function setupBannerTiming() {

        if (
            !crowdBanners
        ) {

            return;

        }

        const banners =
            crowdBanners.querySelectorAll(
                ".support-banner"
            );

        banners.forEach(
            function (
                banner,
                index
            ) {

                banner.style.setProperty(
                    "--banner-delay",
                    index *
                    0.4 +
                    "s"
                );

            }
        );

    }


    /* =====================================================
       CONFETTI
       ===================================================== */

    function spawnConfetti(
        count,
        big
    ) {

        if (
            !confetti
        ) {

            return;

        }

        const pieces = [];


        for (
            let i = 0;
            i < count;
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
                    20 +
                    Math.random() *
                    60
                ) +
                "%";

            piece.style.top =
                "35%";

            piece.style.setProperty(
                "--confetti-delay",
                Math.random() *
                (
                    big
                        ? 0.8
                        : 0.2
                ) +
                "s"
            );

            piece.style.setProperty(
                "--confetti-duration",
                (
                    big
                        ? 1.5 +
                          Math.random() *
                          1.5
                        : 0.8 +
                          Math.random() *
                          0.7
                ) +
                "s"
            );

            piece.style.setProperty(
                "--confetti-x",
                (
                    Math.random() *
                    240 -
                    120
                ) +
                "px"
            );

            piece.style.setProperty(
                "--confetti-y",
                (
                    100 +
                    Math.random() *
                    300
                ) +
                "px"
            );

            confetti.appendChild(
                piece
            );

            pieces.push(
                piece
            );

        }


        setTimeout(
            function () {

                pieces.forEach(
                    function (
                        piece
                    ) {

                        piece.remove();

                    }
                );

            },
            big
                ? 3500
                : 1800
        );

    }


    /* =====================================================
       VICTORY
       ===================================================== */

    function showVictory() {

        gameWon =
            true;

        shooting =
            false;

        aiming =
            false;

        setCrowdIntensity(
            TARGET_SCORE
        );

        hideAim();

        if (
            instructions
        ) {

            instructions.classList.add(
                "hidden"
            );

        }

        if (
            crowd
        ) {

            crowd.classList.add(
                "full-celebration"
            );

        }

        if (
            crowdBanners
        ) {

            crowdBanners.classList.add(
                "boost"
            );

        }

        spawnConfetti(
            70,
            true
        );

        if (
            victoryScreen
        ) {

            victoryScreen.classList.remove(
                "hidden"
            );

        }

    }


    /* =====================================================
       CONTINUE
       ===================================================== */

    function setupContinueButton() {

        if (
            !continueButton
        ) {

            return;

        }

        continueButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "cake.html";

            }
        );

    }


    /* =====================================================
       RESIZE
       ===================================================== */

    let resizeTimer =
        null;


    window.addEventListener(
        "resize",
        function () {

            maxPull =
                calculateMaxPull();

            if (
                aiming
            ) {

                cancelAim();

            }

            clearTimeout(
                resizeTimer
            );

            resizeTimer =
                setTimeout(
                    function () {

                        if (
                            !shooting &&
                            !gameWon
                        ) {

                            /*
                             * Rebuild only on actual
                             * window resize.
                             *
                             * NEVER after a basket.
                             */
                            createCrowd();

                            createBunting();

                        }

                    },
                    150
                );

        }
    );


})();