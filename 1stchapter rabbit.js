const below = document.getElementById('below');
const curtain3 = document.getElementById("curtain3");

// 5 hole positions as % of the frame (top-left corner of rabbit)
// At large sizes the rabbit covers everything, at small sizes it sits in the hole
const holePositions = [
  { left: -55, top: -115 },   // top-left oval (center 9.2%, 15%)
  { left: -10, top: -115 },   // top-right oval (center 75.5%, 16%)
  { left: -5,  top: -55 },    // far-right oval (center 90.1%, 50.9%)
  { left: -45, top: -55 },    // mid-left oval (center 25.7%, 54.4%)
  { left: -30, top: -40 },    // bottom-center oval (center 41.6%, 89.2%)
];

// Small-size positions — when rabbit is tiny, center it on the hole
const holePositionsSmall = [
  { left: 7,   top: 12 },     // top-left oval
  { left: 73,  top: 13 },     // top-right oval
  { left: 88,  top: 48 },     // far-right oval
  { left: 23,  top: 51 },     // mid-left oval
  { left: 40,  top: 87 },     // bottom-center oval
];

const points = [
  { width: 1440, imgWidth: 1920 },
  { width: 960,  imgWidth: 400 },
  { width: 550,  imgWidth: 30 }
];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function getScaledWidth() {
  const w = window.innerWidth;
  if (w >= points[0].width) return points[0].imgWidth;
  if (w < points[2].width) return points[2].imgWidth;

  let start, end;
  if (w >= points[1].width) {
    start = points[1]; end = points[0];
  } else {
    start = points[2]; end = points[1];
  }

  let t = (w - start.width) / (end.width - start.width || 1);
  t = Math.max(0, Math.min(1, t));
  return lerp(start.imgWidth, end.imgWidth, t);
}

// Blend between large and small positions based on current size
function getBlendedPosition(index) {
  const imgWidth = getScaledWidth();
  // 0 = fully large (1920), 1 = fully small (30)
  let t = (1920 - imgWidth) / (1920 - 30);
  t = Math.max(0, Math.min(1, t));

  const big = holePositions[index];
  const small = holePositionsSmall[index];

  return {
    left: lerp(big.left, small.left, t),
    top: lerp(big.top, small.top, t)
  };
}

let lastIndex = -1;

function jumpToRandomHole() {
  if (below.classList.contains('active')) return;

  let index;
  do {
    index = Math.floor(Math.random() * holePositions.length);
  } while (index === lastIndex);
  lastIndex = index;

  const imgWidth = getScaledWidth();
  const pos = getBlendedPosition(index);

  below.style.display = 'block';
  below.style.width = imgWidth + 'px';
  below.style.left = pos.left + '%';
  below.style.top = pos.top + '%';
}

let jumpInterval = setInterval(jumpToRandomHole, 800);
jumpToRandomHole();

window.addEventListener('resize', () => {
  if (!below.classList.contains('active') && lastIndex >= 0) {
    const imgWidth = getScaledWidth();
    const pos = getBlendedPosition(lastIndex);
    below.style.width = imgWidth + 'px';
    below.style.left = pos.left + '%';
    below.style.top = pos.top + '%';
  }
});

below.addEventListener('click', () => {
  if (below.width < 60) {
    below.classList.add('active');
    clearInterval(jumpInterval);
    below.style.left = '46%';
    below.style.top = '65%';
    below.style.width = '8%';
    below.style.zIndex = 2;
    curtain3.style.display = 'block';
  }
});

//book open
const mainImg = document.getElementById('main-img');
const popupImg = document.getElementById('popup-img');

mainImg.addEventListener('click', () => {
  popupImg.style.display = 'block';
});

popupImg.addEventListener('click', (e) => {
  const rect = popupImg.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  const isLowerRight =
    clickX > rect.width * 0.7 &&
    clickY > rect.height * 0.7;

  if (isLowerRight) {
    popupImg.style.display = 'none';
  }
});

///add overlay
const overlay = document.getElementById('overlay-img');

let overlayInterval = null;

function startOverlayFade() {
  if (overlayInterval) return;

  overlayInterval = setInterval(() => {
    if (below.classList.contains('active')) {
      overlay.style.opacity = 0;
      clearInterval(overlayInterval);
      overlayInterval = null;
      return;
    }

    let current = parseFloat(overlay.style.opacity) || 0;
    current += 0.01;
    overlay.style.opacity = current;

    if (current >= 1) {
      clearInterval(overlayInterval);
      overlayInterval = null;
      location.reload();
    }
  }, 200);
}

const observer = new MutationObserver(() => {
  if (below.style.display === 'block') {
    startOverlayFade();
  }
});

observer.observe(below, { attributes: true, attributeFilter: ['style'] });

//final overlay image
const delayedOverlay = document.getElementById('delayed-overlay');
const overlay3 = document.getElementById('overlay3');

let overlayTimeout2 = null;

const observer2 = new MutationObserver(() => {
  if (below.classList.contains('active') && !overlayTimeout2) {
    overlayTimeout2 = setTimeout(() => {
      delayedOverlay.style.display = 'block';
      overlay3.style.opacity = 1;
      setTimeout(() => {
        window.location.href = '1stchapter-crab.html';
      }, 8000);
    }, 8000);
  }
});

observer2.observe(below, { attributes: true, attributeFilter: ['class'] });