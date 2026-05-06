const crab = document.getElementById('crab');
const seaweedContainer = document.getElementById('seaweed-container');
const crabOverlay = document.getElementById('crab-overlay');
const crabOverlayImg = document.getElementById('crab-overlay-img');

// Each seaweed with its natural width as % of 1440px frame
const seaweedData = [
  { src: 'images/seeweed1.png', widthPct: 54 },
  { src: 'images/seeweed2.png', widthPct: 30 },
  { src: 'images/seeweed3.png', widthPct: 26 },
  { src: 'images/seeweed4.png', widthPct: 35 },
];

const doorLeft = 5;
const doorTop = 35;

// ---- Crab sizing ----
const crabPoints = [
  { width: 1440, imgWidth: 1800 },
  { width: 960,  imgWidth: 300 },
  { width: 550,  imgWidth: 80 }
];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function getCrabWidth() {
  const w = window.innerWidth;
  if (w >= crabPoints[0].width) return crabPoints[0].imgWidth;
  if (w < crabPoints[2].width) return crabPoints[2].imgWidth;

  let start, end;
  if (w >= crabPoints[1].width) {
    start = crabPoints[1]; end = crabPoints[0];
  } else {
    start = crabPoints[2]; end = crabPoints[1];
  }

  let t = (w - start.width) / (end.width - start.width || 1);
  t = Math.max(0, Math.min(1, t));
  return lerp(start.imgWidth, end.imgWidth, t);
}

var crabClicked = false;

function positionCrab() {
  if (crabClicked) return;
  const imgWidth = getCrabWidth();
  crab.style.width = imgWidth + 'px';

  const belowFrame = document.querySelector('.below-frame');
  if (!belowFrame) return;
  const fw = belowFrame.offsetWidth;
  const fh = belowFrame.offsetHeight;
  if (fw === 0 || fh === 0) return;

  const crabPctW = (imgWidth / fw) * 100;
  const crabHeightPx = imgWidth * (1321 / 2630);
  const crabPctH = (crabHeightPx / fh) * 100;

  crab.style.left = (12 - crabPctW / 2) + '%';
  crab.style.top = (58 - crabPctH / 2) + '%';
}

window.addEventListener('load', positionCrab);
window.addEventListener('resize', positionCrab);

// ---- Seaweed floating system ----
var flyingSeaweeds = [];
var animFrameId = null;

function spawnSeaweed() {
  if (crabClicked) return;

  var data = seaweedData[Math.floor(Math.random() * seaweedData.length)];
  var img = document.createElement('img');
  img.src = data.src;
  img.className = 'seaweed';

  // Use the seaweed's natural proportional width
  img.style.width = data.widthPct + '%';

  var startLeft = doorLeft;
  var startTop = doorTop + Math.random() * 10;
  img.style.left = startLeft + '%';
  img.style.top = startTop + '%';

  img.addEventListener('click', function () {
    startFloating(img);
  });

  seaweedContainer.appendChild(img);
}

function startFloating(el) {
  el.style.pointerEvents = 'none';
  el.style.transition = 'none';

  var vx = (Math.random() > 0.5 ? 1 : -1) * (0.03 + Math.random() * 0.03);
  var vy = (Math.random() > 0.5 ? 1 : -1) * (0.03 + Math.random() * 0.03);

  var x = parseFloat(el.style.left) || 5;
  var y = parseFloat(el.style.top) || 40;

  flyingSeaweeds.push({ el: el, x: x, y: y, vx: vx, vy: vy, rotation: 0 });

  if (!animFrameId) {
    animFrameId = requestAnimationFrame(animateSeaweeds);
  }
}

function animateSeaweeds() {
  for (var i = flyingSeaweeds.length - 1; i >= 0; i--) {
    var sw = flyingSeaweeds[i];

    if (!sw.el.parentNode) {
      flyingSeaweeds.splice(i, 1);
      continue;
    }

    sw.x += sw.vx;
    sw.y += sw.vy;
    sw.rotation += sw.vx * 0.5;

    var container = seaweedContainer;
    var swWidth = (sw.el.offsetWidth / container.offsetWidth) * 100;
    var swHeight = (sw.el.offsetHeight / container.offsetHeight) * 100;

    if (sw.x <= 0) {
      sw.x = 0;
      sw.vx = Math.abs(sw.vx);
    }
    if (sw.x + swWidth >= 100) {
      sw.x = 100 - swWidth;
      sw.vx = -Math.abs(sw.vx);
    }
    if (sw.y <= 0) {
      sw.y = 0;
      sw.vy = Math.abs(sw.vy);
    }
    if (sw.y + swHeight >= 100) {
      sw.y = 100 - swHeight;
      sw.vy = -Math.abs(sw.vy);
    }

    sw.el.style.left = sw.x + '%';
    sw.el.style.top = sw.y + '%';
    sw.el.style.transform = 'rotate(' + sw.rotation + 'deg)';
  }

  if (flyingSeaweeds.length > 0) {
    animFrameId = requestAnimationFrame(animateSeaweeds);
  } else {
    animFrameId = null;
  }
}

var spawnInterval = setInterval(spawnSeaweed, 3000);
spawnSeaweed();

const overlay = document.getElementById('overlay-img');

let overlayInterval = null;

function startOverlayFade() {
  if (overlayInterval) return;

  overlayInterval = setInterval(() => {
    if (crabClicked) {
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
startOverlayFade();
// ---- Crab click ----
crab.addEventListener('click', function () {
  if (crab.width > 100) return;
  crabClicked = true;
  clearInterval(spawnInterval);
  document.getElementById('curtain4').style.display = 'block';

  crab.style.transition = 'all 0.5s ease';
  crab.style.left = '57%';
  crab.style.top = '68%';
  crab.style.width = '10%';
  crab.style.transform = 'rotate(0deg)';
  crab.style.zIndex = '2';

  flyingSeaweeds = [];
  var seaweeds = document.querySelectorAll('.seaweed');
  seaweeds.forEach(function (sw) { sw.remove(); });

  setTimeout(function () {
    crabOverlay.style.display = 'block';
    setTimeout(function () {
      crabOverlayImg.style.opacity = 1;
    }, 100);

    setTimeout(function () {
       window.location.href = 'levelselector.html';
      
    }, 5000);
  }, 8000);
});
