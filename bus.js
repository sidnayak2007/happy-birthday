/* =====================================================
   THE ROAD TO MANIPAL — bus.js
   Casa Grande -> Manipal, 3-lane birthday runner
===================================================== */

/* =====================================
   DOM REFERENCES
===================================== */

const canvas = document.getElementById("busCanvas");
const ctx = canvas.getContext("2d");

const coinCountElement = document.getElementById("coinCount");
const timeLeftElement = document.getElementById("timeLeft");
const progressFill = document.getElementById("progressFill");
const coinsBoxElement = document.getElementById("coinsBox");

const startScreen = document.getElementById("startScreen");
const finishScreen = document.getElementById("finishScreen");
const startButton = document.getElementById("startButton");
const continueButton = document.getElementById("continueButton");
const finalCoins = document.getElementById("finalCoins");

const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");


/* =====================================
   CANVAS SIZING
===================================== */

let width = 0;
let height = 0;

function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


/* =====================================
   SMALL HELPERS
===================================== */

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function randRange(min, max) {
    return min + Math.random() * (max - min);
}

/*
 * Safe rounded-rect path builder.
 * Avoids relying on CanvasRenderingContext2D.roundRect(),
 * which is not consistently available/behaved everywhere.
 */
function roundedRectPath(x, y, w, h, radius) {
    const r = Math.min(radius, Math.abs(w) / 2, Math.abs(h) / 2);

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
}


/* =====================================
   GAME CONSTANTS & STATE
===================================== */

const TOTAL_TIME = 70;
const STORAGE_KEY = "sejalBirthdayCoins";
const roadSpeed = 330;

let running = false;
let elapsed = 0;
let coinsThisRun = 0;

let idleTime = 0;
let lastFrameTime = 0;
let roadDistance = 0;
let currentMovement = 0;

let waveTimer = 1.3;
let obstacleTimer = 8;

const coinObjects = [];
const obstacles = [];
const roadsideObjects = [];
const floatingTexts = [];


/* =====================================
   ROAD / LAYOUT
===================================== */

function getRoadWidth() {
    return Math.min(width * 0.62, 620);
}

function getRoadLeft() {
    return (width - getRoadWidth()) / 2;
}

function getLaneWidth() {
    return getRoadWidth() / 3;
}

function getHorizonY() {
    return Math.max(110, height * 0.30);
}

function getLaneCenterX(lane) {
    return getRoadLeft() + getLaneWidth() * (lane + 0.5);
}

function getBusBaseY() {
    return height - Math.min(190, height * 0.26) - 12;
}

function getSpeedMultiplier() {
    const progress = Math.min(elapsed / TOTAL_TIME, 1);
    return 0.85 + progress * 0.55;
}


/* =====================================
   BUS
===================================== */

const bus = {
    lane: 1,
    targetLane: 1,
    x: 0,
    y: 0,
    baseWidth: 74,
    baseHeight: 128,
    width: 74,
    height: 128,
    tilt: 0,
    shakeTime: 0
};

function updateBus(delta) {
    const scale = clamp(width / 420, 0.78, 1.08);

    bus.width = bus.baseWidth * scale;
    bus.height = bus.baseHeight * scale;

    const targetX = getLaneCenterX(bus.targetLane);
    const dx = targetX - bus.x;

    bus.x += dx * Math.min(1, delta * 9);
    bus.tilt = clamp(dx / 260, -0.14, 0.14);

    bus.y = getBusBaseY() + Math.sin(idleTime * 2.6) * 3;

    if (bus.shakeTime > 0) {
        bus.shakeTime = Math.max(0, bus.shakeTime - delta);
    }
}

function drawBus() {
    const w = bus.width;
    const h = bus.height;

    const jitter =
        bus.shakeTime > 0
            ? (Math.random() - 0.5) * 8 * (bus.shakeTime / 0.28)
            : 0;

    ctx.save();
    ctx.translate(bus.x + jitter, bus.y);

    /* Shadow (drawn before rotation so it stays flat) */
    ctx.fillStyle = "rgba(15,40,20,0.28)";
    ctx.beginPath();
    ctx.ellipse(0, h * 0.48, w * 0.58, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.rotate(bus.tilt);

    /* Body */
    const bodyGrad = ctx.createLinearGradient(0, -h / 2, 0, h / 2);
    bodyGrad.addColorStop(0, "#ffd166");
    bodyGrad.addColorStop(1, "#f5a623");
    ctx.fillStyle = bodyGrad;
    roundedRectPath(-w / 2, -h / 2, w, h, 16);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#7a4a12";
    ctx.stroke();

    /* Roof highlight */
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    roundedRectPath(-w / 2 + 6, -h / 2 + 5, w - 12, 14, 8);
    ctx.fill();

    /* Back window */
    const winGrad = ctx.createLinearGradient(0, -h / 2 + 26, 0, -h / 2 + 70);
    winGrad.addColorStop(0, "#c9edf7");
    winGrad.addColorStop(1, "#6fb9d6");
    ctx.fillStyle = winGrad;
    roundedRectPath(-w / 2 + 10, -h / 2 + 26, w - 20, 44, 8);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#3f7a91";
    ctx.stroke();

    /* Window shine */
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.beginPath();
    ctx.moveTo(-w / 2 + 16, -h / 2 + 64);
    ctx.lineTo(-w / 2 + 30, -h / 2 + 28);
    ctx.lineTo(-w / 2 + 40, -h / 2 + 28);
    ctx.lineTo(-w / 2 + 26, -h / 2 + 64);
    ctx.closePath();
    ctx.fill();

    /* Name plate */
    ctx.fillStyle = "#fff8ea";
    roundedRectPath(-w * 0.34, h * 0.03, w * 0.68, 20, 8);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#e08c1c";
    ctx.stroke();

    ctx.fillStyle = "#c0651a";
    ctx.font = 'bold 12px "Baloo 2", Arial';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SEJAL", 0, h * 0.03 + 11);

    /* Tail lights */
    ctx.fillStyle = "#ff5a4d";
    roundedRectPath(-w / 2 + 6, h / 2 - 16, 9, 11, 3);
    ctx.fill();
    roundedRectPath(w / 2 - 15, h / 2 - 16, 9, 11, 3);
    ctx.fill();

    /* Bumper */
    ctx.fillStyle = "#6b5844";
    roundedRectPath(-w / 2 + 7, h / 2 - 4, w - 14, 5, 3);
    ctx.fill();

    /* Wheels */
    ctx.fillStyle = "#232323";
    roundedRectPath(-w / 2 - 5, -h / 2 + 38, 8, 30, 4);
    ctx.fill();
    roundedRectPath(w / 2 - 3, -h / 2 + 38, 8, 30, 4);
    ctx.fill();

    ctx.fillStyle = "#8a8a8a";
    ctx.beginPath();
    ctx.arc(-w / 2 - 1, -h / 2 + 53, 2.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w / 2 + 1, -h / 2 + 53, 2.6, 0, Math.PI * 2);
    ctx.fill();

    /* Mirrors */
    ctx.fillStyle = "#3a2e20";
    roundedRectPath(-w / 2 - 9, -h / 2 + 46, 7, 15, 3);
    ctx.fill();
    roundedRectPath(w / 2 + 2, -h / 2 + 46, 7, 15, 3);
    ctx.fill();

    ctx.restore();
}


/* =====================================
   SKY / SUN / CLOUDS
===================================== */

function drawSky() {
    const horizonY = getHorizonY();

    const sky = ctx.createLinearGradient(0, 0, 0, horizonY);
    sky.addColorStop(0, "#7ec9ea");
    sky.addColorStop(1, "#bfe6ef");

    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, horizonY + 2);
}

function drawSun() {
    const sunX = width * 0.82;
    const sunY = height * 0.13;
    const r = Math.min(width, height) * 0.065;

    const glow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, r * 2.4);
    glow.addColorStop(0, "rgba(255,232,150,0.85)");
    glow.addColorStop(1, "rgba(255,232,150,0)");

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, r * 2.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffe08a";
    ctx.beginPath();
    ctx.arc(sunX, sunY, r, 0, Math.PI * 2);
    ctx.fill();
}

function drawCloud(x, y, scale) {
    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = "#ffffff";

    ctx.beginPath();
    ctx.arc(x, y, 16 * scale, 0, Math.PI * 2);
    ctx.arc(x + 20 * scale, y - 6 * scale, 22 * scale, 0, Math.PI * 2);
    ctx.arc(x + 45 * scale, y, 17 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

const CLOUD_DEFS = [
    { baseX: 0.12, y: 0.09, scale: 0.85, speed: 5 },
    { baseX: 0.5, y: 0.15, scale: 0.6, speed: 3.2 },
    { baseX: 0.82, y: 0.07, scale: 0.72, speed: 4.1 }
];

function drawClouds() {
    for (const c of CLOUD_DEFS) {
        const x = ((c.baseX * width + idleTime * c.speed) % (width + 200)) - 100;
        drawCloud(x, height * c.y, c.scale);
    }
}


/* =====================================
   MOUNTAINS (static layered backdrop)
===================================== */

function drawMountainLayer(baseY, amplitude, segments, color, seed) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, baseY);

    const step = width / segments;

    for (let i = 0; i <= segments; i++) {
        const x = i * step;
        const wobble =
            Math.sin(i * 1.7 + seed) * 0.6 + Math.sin(i * 0.5 + seed * 1.3) * 0.4;
        const y = baseY - amplitude * (0.35 + 0.65 * Math.abs(wobble));

        ctx.lineTo(x, y);
    }

    ctx.lineTo(width, baseY);
    ctx.closePath();
    ctx.fill();
}

function drawMountains() {
    const horizonY = getHorizonY();

    drawMountainLayer(horizonY, horizonY * 0.5, 8, "#aac4e2", 1.3);
    drawMountainLayer(horizonY, horizonY * 0.32, 10, "#82b26c", 3.1);
    drawMountainLayer(horizonY, horizonY * 0.16, 12, "#5f9a52", 5.7);
}


/* =====================================
   GROUND & ROAD
===================================== */

function drawGroundAndRoad() {
    const horizonY = getHorizonY();
    const roadWidth = getRoadWidth();
    const left = getRoadLeft();

    /* Grass */
    const grassGrad = ctx.createLinearGradient(0, horizonY, 0, height);
    grassGrad.addColorStop(0, "#8dc26f");
    grassGrad.addColorStop(1, "#699e50");

    ctx.fillStyle = grassGrad;
    ctx.fillRect(0, horizonY, width, height - horizonY);

    /* Road */
    const roadGrad = ctx.createLinearGradient(0, horizonY, 0, height);
    roadGrad.addColorStop(0, "#4c545c");
    roadGrad.addColorStop(1, "#363c42");

    ctx.fillStyle = roadGrad;
    ctx.fillRect(left, horizonY, roadWidth, height - horizonY);

    /* Road edges */
    ctx.fillStyle = "#f4efd6";
    ctx.fillRect(left, horizonY, 5, height - horizonY);
    ctx.fillRect(left + roadWidth - 5, horizonY, 5, height - horizonY);

    /* Lane dashes */
    const laneWidth = roadWidth / 3;
    const dashHeight = 40;
    const gap = 46;
    const offset = roadDistance % (dashHeight + gap);

    ctx.fillStyle = "#f0f0f0";

    for (let lane = 1; lane < 3; lane++) {
        const x = left + laneWidth * lane;

        for (let y = -dashHeight + offset; y < height; y += dashHeight + gap) {
            if (y + dashHeight < horizonY) {
                continue;
            }
            ctx.fillRect(x - 2, Math.max(y, horizonY), 4, dashHeight);
        }
    }

    /* Soft seam where road meets the backdrop */
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(0, horizonY, width, 3);
}


/* =====================================
   ROADSIDE DECORATION
===================================== */

function createRoadsideObject(side, y) {
    return {
        side,
        y,
        type: Math.random() < 0.72 ? "tree" : "sign",
        size: 0.7 + Math.random() * 0.35,
        offset: 15 + Math.random() * 75
    };
}

function resetRoadsideObjects() {
    roadsideObjects.length = 0;

    const horizonY = getHorizonY();
    const spacing = 120;

    for (let y = horizonY; y < height + 200; y += spacing) {
        roadsideObjects.push(createRoadsideObject(-1, y + Math.random() * 50));
        roadsideObjects.push(createRoadsideObject(1, y + Math.random() * 50));
    }
}

function drawTree(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.fillStyle = "rgba(30,70,30,0.16)";
    ctx.beginPath();
    ctx.ellipse(0, 18, 26, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#7a5638";
    ctx.fillRect(-4, -4, 8, 28);

    ctx.fillStyle = "#4e8f4b";
    ctx.beginPath();
    ctx.arc(0, -18, 22, 0, Math.PI * 2);
    ctx.arc(-15, -8, 16, 0, Math.PI * 2);
    ctx.arc(16, -8, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#67ac5b";
    ctx.beginPath();
    ctx.arc(-6, -22, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function drawSign(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(-4, -25, 8, 27);

    ctx.fillStyle = "#e0574b";
    ctx.fillRect(-4, -21, 8, 7);

    ctx.fillStyle = "#333333";
    ctx.fillRect(-5, 1, 10, 4);

    ctx.restore();
}

function updateAndDrawRoadside(delta) {
    const horizonY = getHorizonY();
    const roadLeft = getRoadLeft();
    const roadRight = roadLeft + getRoadWidth();

    for (const obj of roadsideObjects) {
        obj.y += currentMovement * delta * 0.85;

        if (obj.y > height + 100) {
            obj.y = horizonY - Math.random() * 70;
            obj.type = Math.random() < 0.72 ? "tree" : "sign";
            obj.size = 0.7 + Math.random() * 0.35;
        }

        if (obj.y < horizonY - 30) {
            continue;
        }

        const sway = Math.sin(idleTime * 1.6 + obj.y) * 1.4;
        const x =
            (obj.side < 0 ? roadLeft - obj.offset : roadRight + obj.offset) + sway;

        if (obj.type === "tree") {
            drawTree(x, obj.y, obj.size);
        } else {
            drawSign(x, obj.y, obj.size);
        }
    }
}


/* =====================================
   COIN PATTERNS
===================================== */

const PHASES = [
    { start: 0, end: 10, patterns: ["center"], waveGap: [4.4, 5.4], coinsPerTrail: [3, 4], bonusChance: 0.08, obstacles: false },
    { start: 10, end: 20, patterns: ["left", "right"], waveGap: [3.8, 4.6], coinsPerTrail: [3, 4], bonusChance: 0.12, obstacles: true },
    { start: 20, end: 35, patterns: ["center", "left", "right", "choice"], waveGap: [3.2, 4.2], coinsPerTrail: [3, 5], bonusChance: 0.15, obstacles: true },
    { start: 35, end: 50, patterns: ["zigzag", "left", "right", "center"], waveGap: [3.2, 4.0], coinsPerTrail: [3, 5], bonusChance: 0.18, obstacles: true },
    { start: 50, end: 60, patterns: ["choice", "zigzag", "center"], waveGap: [2.6, 3.4], coinsPerTrail: [4, 6], bonusChance: 0.25, obstacles: true },
    { start: 60, end: 67, patterns: ["celebration"], waveGap: [1.8, 2.4], coinsPerTrail: [4, 6], bonusChance: 0.4, obstacles: false },
    { start: 67, end: 999, patterns: [], waveGap: [999, 999], coinsPerTrail: [0, 0], bonusChance: 0, obstacles: false }
];

function getPhase(t) {
    for (const phase of PHASES) {
        if (t >= phase.start && t < phase.end) {
            return phase;
        }
    }
    return PHASES[PHASES.length - 1];
}

const SPACING_BY_TYPE = {
    center: 100,
    left: 100,
    right: 100,
    zigzag: 210,
    choice: 135,
    celebration: 150
};

function spawnPattern(phase) {
    const type = phase.patterns[Math.floor(Math.random() * phase.patterns.length)];
    const count = Math.round(randRange(phase.coinsPerTrail[0], phase.coinsPerTrail[1]));
    const startY = getHorizonY() - 40;
    const spacing = SPACING_BY_TYPE[type] || 110;

    function addCoin(lane, index, forcedBonus) {
        const bonus =
            forcedBonus !== undefined ? forcedBonus : Math.random() < phase.bonusChance;

        coinObjects.push({
            lane,
            y: startY - index * spacing,
            radius: bonus ? 16 : 13,
            rotation: Math.random() * Math.PI * 2,
            bob: Math.random() * Math.PI * 2,
            bonus
        });
    }

    if (type === "center") {
        for (let i = 0; i < count; i++) addCoin(1, i);
    } else if (type === "left") {
        for (let i = 0; i < count; i++) addCoin(0, i);
    } else if (type === "right") {
        for (let i = 0; i < count; i++) addCoin(2, i);
    } else if (type === "zigzag") {
        const pair = Math.random() < 0.5 ? [0, 1] : [1, 2];
        for (let i = 0; i < count; i++) addCoin(pair[i % 2], i);
    } else if (type === "choice") {
        const pair = Math.random() < 0.5 ? [0, 2] : [0, 1];
        const half = Math.max(2, Math.round(count / 2));
        for (let i = 0; i < half; i++) {
            addCoin(pair[0], i);
            addCoin(pair[1], i);
        }
    } else if (type === "celebration") {
        for (let i = 0; i < count; i++) {
            addCoin(0, i, i % 3 === 0);
            addCoin(1, i, i % 3 === 1);
            addCoin(2, i, i % 3 === 2);
        }
    }
}

function drawCoin(coin) {
    const x = getLaneCenterX(coin.lane);
    const bobY = Math.sin(idleTime * 4 + coin.bob) * 3;
    const y = coin.y + bobY;
    const squash = Math.max(0.25, Math.abs(Math.cos(coin.rotation)));

    ctx.save();
    ctx.translate(x, y);

    /* Shadow */
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.beginPath();
    ctx.ellipse(0, coin.radius * 0.9, coin.radius * 0.8 * squash, coin.radius * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.scale(squash, 1);

    ctx.shadowColor = coin.bonus ? "rgba(220,110,240,0.85)" : "rgba(255,196,64,0.7)";
    ctx.shadowBlur = coin.bonus ? 16 : 10;

    const grad = ctx.createRadialGradient(
        -coin.radius * 0.3,
        -coin.radius * 0.3,
        coin.radius * 0.2,
        0,
        0,
        coin.radius
    );

    if (coin.bonus) {
        grad.addColorStop(0, "#fff0c2");
        grad.addColorStop(0.5, "#efa0e0");
        grad.addColorStop(1, "#c85fc0");
    } else {
        grad.addColorStop(0, "#fff3c4");
        grad.addColorStop(0.55, "#ffcb3d");
        grad.addColorStop(1, "#e8951b");
    }

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, coin.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = coin.bonus ? "#ffffff" : "#fff6d9";
    ctx.stroke();

    ctx.fillStyle = coin.bonus ? "#ffffff" : "#fff6d9";
    ctx.font = 'bold ' + Math.round(coin.radius * 1.1) + 'px "Baloo 2", Arial';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("\u2726", 0, 1);

    ctx.restore();
}

function updateAndDrawCoins(delta) {
    for (let i = coinObjects.length - 1; i >= 0; i--) {
        const coin = coinObjects[i];

        coin.y += currentMovement * delta;
        coin.rotation += delta * 3.4;

        const busTop = bus.y - bus.height * 0.42;
        const busBottom = bus.y + bus.height * 0.4;
        const laneMatch = coin.lane === bus.targetLane;

        if (laneMatch && coin.y > busTop && coin.y < busBottom) {
            const amount = coin.bonus ? 10 : 5;

            coinsThisRun += amount;
            coinCountElement.textContent = coinsThisRun;
            pulseCoinsBox();

            spawnFloatingText(
                "+" + amount,
                getLaneCenterX(coin.lane),
                coin.y,
                coin.bonus ? "#c94fc4" : "#ee9b16"
            );

            coinObjects.splice(i, 1);
            continue;
        }

        if (coin.y > height + 80) {
            coinObjects.splice(i, 1);
            continue;
        }

        drawCoin(coin);
    }
}


/* =====================================
   OBSTACLES
===================================== */

const OBSTACLE_COLORS = ["#4d96ff", "#ef476f", "#5ec1a4", "#a06cd5"];

function spawnObstacle() {
    obstacles.push({
        lane: Math.floor(Math.random() * 3),
        y: getHorizonY() - 60,
        width: 46,
        height: 78,
        color: OBSTACLE_COLORS[Math.floor(Math.random() * OBSTACLE_COLORS.length)]
    });
}

function drawObstacle(obs) {
    const w = obs.width;
    const h = obs.height;

    ctx.save();
    ctx.translate(getLaneCenterX(obs.lane), obs.y);

    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.beginPath();
    ctx.ellipse(0, h * 0.46, w * 0.55, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = obs.color;
    roundedRectPath(-w / 2, -h / 2, w, h, 12);
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.78)";
    roundedRectPath(-w / 2 + 7, -h / 2 + 10, w - 14, h * 0.3, 6);
    ctx.fill();

    ctx.fillStyle = "#242424";
    roundedRectPath(-w / 2 - 3, -h / 2 + 14, 6, 20, 3);
    ctx.fill();
    roundedRectPath(w / 2 - 3, -h / 2 + 14, 6, 20, 3);
    ctx.fill();
    roundedRectPath(-w / 2 - 3, h / 2 - 34, 6, 20, 3);
    ctx.fill();
    roundedRectPath(w / 2 - 3, h / 2 - 34, 6, 20, 3);
    ctx.fill();

    ctx.restore();
}

function updateAndDrawObstacles(delta) {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];

        obs.y += currentMovement * delta;

        const busTop = bus.y - bus.height * 0.42;
        const busBottom = bus.y + bus.height * 0.42;
        const laneMatch = obs.lane === bus.targetLane;

        if (
            laneMatch &&
            obs.y + obs.height / 2 > busTop &&
            obs.y - obs.height / 2 < busBottom
        ) {
            coinsThisRun = Math.max(0, coinsThisRun - 1);
            coinCountElement.textContent = coinsThisRun;

            spawnFloatingText("\u22121", bus.x, bus.y - bus.height * 0.5, "#e63946");
            bus.shakeTime = 0.28;

            obstacles.splice(i, 1);
            continue;
        }

        if (obs.y > height + 100) {
            obstacles.splice(i, 1);
            continue;
        }

        drawObstacle(obs);
    }
}


/* =====================================
   FLOATING FEEDBACK TEXT
===================================== */

function spawnFloatingText(text, x, y, color) {
    floatingTexts.push({ text, x, y, life: 0, maxLife: 0.8, color });
}

function updateAndDrawFloatingTexts(delta) {
    for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const f = floatingTexts[i];

        f.life += delta;

        if (f.life >= f.maxLife) {
            floatingTexts.splice(i, 1);
            continue;
        }

        const progress = f.life / f.maxLife;
        const alpha = 1 - progress;
        const yOff = -progress * 46;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = 'bold 20px "Baloo 2", Arial';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(255,255,255,0.85)";
        ctx.strokeText(f.text, f.x, f.y + yOff);
        ctx.fillStyle = f.color;
        ctx.fillText(f.text, f.x, f.y + yOff);
        ctx.restore();
    }
}


/* =====================================
   HUD FEEDBACK
===================================== */

function pulseCoinsBox() {
    if (!coinsBoxElement) {
        return;
    }
    coinsBoxElement.classList.remove("pulse");
    void coinsBoxElement.offsetWidth;
    coinsBoxElement.classList.add("pulse");
}


/* =====================================
   LANE CHANGE / INPUT
===================================== */

function changeLane(direction) {
    if (!running) {
        return;
    }

    const newLane = bus.targetLane + direction;

    if (newLane < 0 || newLane > 2) {
        return;
    }

    bus.targetLane = newLane;
}

leftButton.addEventListener("pointerdown", () => changeLane(-1));
rightButton.addEventListener("pointerdown", () => changeLane(1));

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        event.preventDefault();
        changeLane(-1);
    }

    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        event.preventDefault();
        changeLane(1);
    }
});

let touchStartX = 0;
let touchStartY = 0;
let touchActive = false;

canvas.addEventListener(
    "touchstart",
    (event) => {
        if (!event.touches || !event.touches.length) {
            return;
        }
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
        touchActive = true;
    },
    { passive: true }
);

canvas.addEventListener(
    "touchend",
    (event) => {
        if (!touchActive) {
            return;
        }
        touchActive = false;

        const touch = event.changedTouches && event.changedTouches[0];
        if (!touch) {
            return;
        }

        const dx = touch.clientX - touchStartX;
        const dy = touch.clientY - touchStartY;

        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
            changeLane(dx > 0 ? 1 : -1);
        }
    },
    { passive: true }
);


/* =====================================
   COIN PERSISTENCE
===================================== */

function persistCoins() {
    let previous = 0;

    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        previous = raw ? parseInt(raw, 10) || 0 : 0;
    } catch (e) {
        previous = 0;
    }

    try {
        localStorage.setItem(STORAGE_KEY, String(previous + coinsThisRun));
    } catch (e) {
        /* localStorage unavailable — continue without persisting */
    }
}


/* =====================================
   START / FINISH
===================================== */

function startGame() {
    running = true;
    elapsed = 0;
    coinsThisRun = 0;
    roadDistance = 0;

    waveTimer = 1.3;
    obstacleTimer = 8;

    coinObjects.length = 0;
    obstacles.length = 0;
    floatingTexts.length = 0;

    coinCountElement.textContent = "0";
    timeLeftElement.textContent = TOTAL_TIME + "s";
    progressFill.style.width = "0%";

    bus.targetLane = 1;
    bus.lane = 1;
    bus.x = getLaneCenterX(1);

    resetRoadsideObjects();

    startScreen.classList.add("hidden");
    finishScreen.classList.add("hidden");
}

function finishGame() {
    running = false;

    finalCoins.textContent = coinsThisRun;
    persistCoins();

    finishScreen.classList.remove("hidden");
}


/* =====================================
   MAIN LOOP
===================================== */

function frameLoop(timestamp) {
    if (!lastFrameTime) {
        lastFrameTime = timestamp;
    }

    const delta = Math.min((timestamp - lastFrameTime) / 1000, 0.04);
    lastFrameTime = timestamp;

    idleTime += delta;
    currentMovement = running ? roadSpeed * getSpeedMultiplier() : 0;

    const phase = getPhase(elapsed);

    if (running) {
        elapsed += delta;
        roadDistance += currentMovement * delta;

        const remaining = Math.max(0, Math.ceil(TOTAL_TIME - elapsed));
        timeLeftElement.textContent = remaining + "s";

        const progress = Math.min(elapsed / TOTAL_TIME, 1);
        progressFill.style.width = progress * 100 + "%";

        waveTimer -= delta;
        if (waveTimer <= 0) {
            if (phase.patterns.length) {
                spawnPattern(phase);
            }
            waveTimer = randRange(phase.waveGap[0], phase.waveGap[1]);
        }

        if (phase.obstacles && obstacles.length < 1) {
            obstacleTimer -= delta;
            if (obstacleTimer <= 0) {
                spawnObstacle();
                obstacleTimer = randRange(7, 11);
            }
        }
    }

    updateBus(delta);

    drawSky();
    drawSun();
    drawClouds();
    drawMountains();
    drawGroundAndRoad();
    updateAndDrawRoadside(delta);

    if (running) {
        updateAndDrawCoins(delta);
        updateAndDrawObstacles(delta);
    }

    drawBus();
    updateAndDrawFloatingTexts(delta);

    if (running && elapsed >= TOTAL_TIME) {
        finishGame();
    }

    requestAnimationFrame(frameLoop);
}


/* =====================================
   BUTTON WIRING
===================================== */

startButton.addEventListener("click", startGame);

continueButton.addEventListener("click", () => {
    window.location.href = "basketball.html";
});


/* =====================================
   INITIAL STATE & KICKOFF
===================================== */

bus.x = getLaneCenterX(1);
bus.y = getBusBaseY();

resetRoadsideObjects();

requestAnimationFrame(frameLoop);