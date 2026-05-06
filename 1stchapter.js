const curtain = document.getElementById('curtain');

const below = document.getElementById('below');
const cloud = document.getElementById('cloud');
const curtain2=document.getElementById("curtain2")



///play the audio
const audio = document.getElementById("audio1");
    

    function updateAudio() {
        if (below.classList.contains('active')) {
            audio.playbackRate =0;
            audio.volume =0;
        }
        else{
      const minWidth = 300;   // smallest window
      const maxWidth = 1440;  // largest window
      const minRate = 0.5;    // slowest
      const maxRate = 8.0;    // fastest
      const minVolume = 0.1;  // quietest
      const maxVolume = 1;  // loudest
      
      let w = window.innerWidth;
      w = Math.max(minWidth, Math.min(maxWidth, w)); // clamp

      // Map width → playbackRate (slower when smaller)
      audio.playbackRate = minRate + ((w - minWidth) / (maxWidth - minWidth)) * (maxRate - minRate);

      // Map width → volume (quieter when smaller)
      audio.volume = minVolume + ((w - minWidth) / (maxWidth - minWidth)) * (maxVolume - minVolume);
        }
    }

    // Update speed & volume when window resizes
    window.addEventListener("resize", updateAudio);

///add random text
function randomChar() {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
      return chars.charAt(Math.floor(Math.random() * chars.length));
    }

    function randomString(length) {
      let str = "";
      for (let i = 0; i < length; i++) {
        str += randomChar();
      }
      return str;
    }

    function spawnString() {
        if (below.classList.contains("active")) {
    return; // exit the function, no new text
  }
  const frame = document.querySelector(".frame"); // get the div
  const rect = frame.getBoundingClientRect();     // get position & size

  const span = document.createElement("span");
  span.className = "char";

  // random string length between 3 and 10
  span.textContent = randomString(Math.floor(Math.random() * 8) + 3);

  // random position inside the frame
  const x = Math.random() * rect.width;
  const y = Math.random() * rect.height;
  span.style.position = "absolute"; // make it relative to frame
  span.style.left = x + "px";
  span.style.top = y + "px";

  frame.appendChild(span); // append to the frame, not body

  // fade out + remove
  setTimeout(() => {
    span.style.opacity = 0;
    setTimeout(() => span.remove(), 1000);
  }, 2000);

  // schedule next spawn
  scheduleNextSpawn();
}


    function getSpawnInterval() {
      const minInterval = 25;    // fastest
      const maxInterval = 1500;  // slowest
      const minWidth = 300;      // very small window
      const maxWidth = 1440;     // large screen

      let w = window.innerWidth;
      console.log("w="+w)
      w = Math.max(minWidth, Math.min(maxWidth, w)); // clamp within range
      
      // map width → interval (inverse: bigger width = faster spawn)
      return maxInterval - ((w - minWidth) / (maxWidth - minWidth)) * (maxInterval - minInterval);
      
    }

    function scheduleNextSpawn() {
        
      const interval = getSpawnInterval();
      console.log("interval="+ interval)
      setTimeout(spawnString, interval);
    }

 //play the alert
 const chirps = ["chirp!", "tweet!", "pip!", "twee!", "chrrr!", "peep!"];
function getRandomChirp() {
    return chirps[Math.floor(Math.random() * chirps.length)];
  }

   function customAlert(message, onClose) {
    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "alert-overlay";

    // Create alert box
    const box = document.createElement("div");
    box.className = "custom-alert";

    // Message
    const msg = document.createElement("p");
    msg.textContent = message;

    // OK button
    const okBtn = document.createElement("button");
    okBtn.textContent = "Stay out of my mind";
    okBtn.onclick = () => {
      overlay.remove();
      if (onClose) onClose(); // optional callback
    };

    box.appendChild(msg);
    box.appendChild(okBtn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
  }

  function scheduleChirpAlert() {
    // Stop if below has class 'active'
    if (below && below.classList.contains("active")) return;

    customAlert(getRandomChirp(), () => {
      // Schedule next alert only after user clicks OK
      setTimeout(scheduleChirpAlert, 2000);
    });
  }

  



///click to start game


// start alternating
curtain.addEventListener('click', () => {
    console.log("yes")
  curtain.style.display = 'none';  // hide curtain
  below.style.display = 'block'; 
  cloud.style.display="block" ; // show below image
  console.log("cloud")
  // startspawnteext
    scheduleNextSpawn();
    audio.play();
      updateAudio(); // set speed initially
      console.log("audio plays")
      scheduleChirpAlert();
      console.log("alert created")
});
//

//resize the bird
// Reference points for browser widths
const points = [
  { width: 1440, left: 100, top: -350, imgWidth: 1920 },  // full size
  { width: 960,  left: 300, top: 180, imgWidth: 400 },  // half size
  { width: 550,  left: 200,  top: 115, imgWidth: 30 }    // min size
];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function resizeBelow() {
    if (!below.classList.contains('active')) {
  
  const w = window.innerWidth;

  let start, end;

  if (w >= points[0].width) {        // above max
    start = end = points[0];
  } else if (w >= points[1].width) { // between half and max
    start = points[1];
    end = points[0];
  } else if (w >= points[2].width) { // between min and half
    start = points[2];
    end = points[1];
  } else {                           // below min
    start = end = points[2];
  }

  let t = (w - start.width) / (end.width - start.width || 1);
  t = Math.max(0, Math.min(1, t));

  below.style.width = lerp(start.imgWidth, end.imgWidth, t) + 'px';
  below.style.left  = lerp(start.left, end.left, t) + 'px';
  below.style.top   = lerp(start.top, end.top, t) + 'px';
}
}


window.addEventListener('resize', resizeBelow);
resizeBelow(); // initial call

below.addEventListener('click', () => {
    if (below.width < 40) {                // only allow click if width < 40
    below.classList.add('active');
  below.style.left = '34%';
  below.style.top = '65%';
  below.style.width = '8%';
  below.style.zIndex = 2;
curtain2.style.display="block";
    }
});

//book open
const mainImg = document.getElementById('main-img');
const popupImg = document.getElementById('popup-img');

mainImg.addEventListener('click', () => {
  popupImg.style.display = 'block'; // show popup
});

// hide popup when clicking lower-right corner
popupImg.addEventListener('click', (e) => {
  const rect = popupImg.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  const isLowerRight =
    clickX > rect.width * 0.7 &&  // right 30%
    clickY > rect.height * 0.7;   // bottom 30%

  if (isLowerRight) {
    popupImg.style.display = 'none'; // hide popup
  }
});

///add overlay
const overlay = document.getElementById('overlay-img');

let overlayInterval = null;

// function to start increasing opacity
function startOverlayFade() {
  if (overlayInterval) return; // prevent multiple intervals

  overlayInterval = setInterval(() => {
    // if below becomes active, reset opacity
    if (below.classList.contains('active')) {
      overlay.style.opacity = 0;
      clearInterval(overlayInterval);
      overlayInterval = null;
      return;
    }

    // gradually increase opacity
    let current = parseFloat(overlay.style.opacity) || 0;
    current += 0.01;
    overlay.style.opacity = current;

    // reload if fully opaque
    if (current >= 1) {
      clearInterval(overlayInterval);
      overlayInterval = null;
      location.reload();
    }
  }, 200);
}

// watch for #below to become visible
const observer = new MutationObserver(() => {
  if (below.style.display === 'block') {
    startOverlayFade();
  }
});

// observe style changes
observer.observe(below, { attributes: true, attributeFilter: ['style'] });



//final overlay image
const delayedOverlay = document.getElementById('delayed-overlay');
const overlay2 = document.getElementById('overlay2');

let overlayTimeout2 = null;

const observer2 = new MutationObserver(() => {
  if (below.classList.contains('active') && !overlayTimeout2) {
    // start 10-second timer
    overlayTimeout2 = setTimeout(() => {
      delayedOverlay.style.display = 'block';
      overlay2.style.opacity = 1;
      setTimeout(() => {
        window.location.href = '1stchapter-rabbit.html';
      }, 8000);
    }, 8000); // 10 seconds
  }
});

observer2.observe(below, { attributes: true, attributeFilter: ['class'] });
    