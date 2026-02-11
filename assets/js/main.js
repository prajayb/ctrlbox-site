// Mobile nav toggle (v4)
const toggle = document.querySelector(".nav__toggle");
const menu = document.querySelector("#navMenu");
const scrim = document.querySelector("#navScrim");

function openNav(){
  if (!menu || !toggle) return;
  menu.classList.add("is-open");
  if (scrim) scrim.classList.add("is-open");
  toggle.setAttribute("aria-expanded", "true");
  document.body.classList.add("nav-open");
}

function closeNav(){
  if (!menu || !toggle) return;
  menu.classList.remove("is-open");
  if (scrim) scrim.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("nav-open");
}

function toggleNav(){
  const isOpen = menu?.classList.contains("is-open");
  if (isOpen) closeNav(); else openNav();
}

if (toggle && menu) {
  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleNav();
  });

  if (scrim) scrim.addEventListener("click", closeNav);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", closeNav));
}


function closeNav(){
  if (!menu || !toggle) return;
  menu.classList.remove("is-open");
  if (scrim) scrim.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("nav-open");
}

function toggleNav(){
  const isOpen = menu?.classList.contains("is-open");
  if (isOpen) closeNav(); else openNav();
}

if (toggle && menu) {
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleNav();
  });

  // Close when clicking scrim
  if (scrim) scrim.addEventListener("click", closeNav);

  // Close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });

  // Close when clicking any nav link
  menu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => closeNav());
  });

  // Close when tapping outside menu (extra safety)
  document.addEventListener("click", (e) => {
    const target = e.target;
    const clickedInside = menu.contains(target) || toggle.contains(target);
    if (!clickedInside) closeNav();
  }, { passive: true });
}


if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close menu when clicking a link (mobile)
  menu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Scroll progress bar
const progress = document.querySelector(".scroll-progress");
const onScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (progress) progress.style.width = pct + "%";
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Footer year
const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

// Video controls
const video = document.querySelector("#introVideo");
const btnPlay = document.querySelector("#togglePlay");
const btnMute = document.querySelector("#toggleMute");
const btnReel = document.querySelector("#openReel");

if (video && btnPlay) {
  btnPlay.addEventListener("click", async () => {
    if (video.paused) {
      await video.play();
      btnPlay.textContent = "⏸";
      btnPlay.setAttribute("aria-label", "Pause video");
    } else {
      video.pause();
      btnPlay.textContent = "▶";
      btnPlay.setAttribute("aria-label", "Play video");
    }
  });
}

if (video && btnMute) {
  btnMute.addEventListener("click", () => {
    video.muted = !video.muted;
    btnMute.textContent = video.muted ? "🔇" : "🔊";
    btnMute.setAttribute("aria-label", video.muted ? "Unmute video" : "Mute video");
  });
}

if (video && btnReel) {
  btnReel.addEventListener("click", () => {
    const src = video.querySelector("source")?.getAttribute("src");
    if (src) window.open(src, "_blank", "noopener,noreferrer");
  });
}

// Static form behavior (front-end validation only)
const form = document.querySelector("#leadForm");
const msg = document.querySelector("#formMsg");

if (form && msg) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const required = ["name", "email", "link", "goal"];
    const missing = required.filter(k => !String(data.get(k) || "").trim());

    if (missing.length) {
      msg.textContent = "Please fill all required fields.";
      return;
    }

    msg.textContent = "✅ Received! (Static demo) Connect this form to Formspree/Netlify when ready.";
    form.reset();
  });
}


(function scrollCubeEffect(){
  const root = document.documentElement;
  const hero = document.querySelector('.hero');
  const cube = document.querySelector('.scroll-cube');
  if(!hero || !cube) return;

  let ticking = false;
  let heroHeight = 1;

  function measure(){
    heroHeight = Math.max(hero.offsetHeight, 1);
  }

  function clamp(v, min, max){ return Math.min(max, Math.max(min, v)); }

  function update(){
    const y = window.scrollY || window.pageYOffset || 0;
    const p = clamp(y / (heroHeight * 0.9), 0, 1); // 0→1 in hero area
    root.style.setProperty('--heroScroll', p.toFixed(4));

    // fade out completely after hero ends
    if (p >= 0.98) cube.classList.add('cube--hide');
    else cube.classList.remove('cube--hide');

    ticking = false;
  }

  function onScroll(){
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  measure();
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { measure(); update(); }, { passive: true });
})();



(function heroCubeToNavbar(){
  const hero = document.querySelector('.hero');
  const overlayImg = document.getElementById('scrollCubeImg');
  const navTarget = document.getElementById('navCubeTarget');

  if(!hero || !overlayImg || !navTarget) return;

  const root = document.documentElement;

  // helpers
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeInOut = (t) => t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2)/2;

  let heroHeight = 1;
  let ticking = false;

  // "start" cube position (center of screen, big)
  function getStart(){
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      size: Math.min(520, window.innerWidth * 0.74)
    };
  }

  // "end" cube position (center of navbar logo)
  function getEnd(){
    const r = navTarget.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    return { x: cx, y: cy, size: Math.max(r.width, 1) };
  }

  function measure(){
    heroHeight = Math.max(hero.offsetHeight, 1);
  }

  function update(){
    const y = window.scrollY || 0;

    // progress from 0→1 while scrolling through most of hero
    const raw = clamp(y / (heroHeight * 0.85), 0, 1);

    // smooth it
    const t = easeInOut(raw);

    const start = getStart();
    const end = getEnd();

    // interpolate center position
    const x = lerp(start.x, end.x, t);
    const yy = lerp(start.y, end.y, t);

    // interpolate size
    const w = lerp(start.size, end.size, t);

    // rotations for that premium "snap"
    const rotZ = lerp(0, 360, t);
    const rotX = lerp(0, 18, t);

    // opacity: stay visible, then fade out near the end so nav logo feels real
    const opacity = raw < 0.92 ? 1 : lerp(1, 0, (raw - 0.92) / 0.08);

    // Apply: position img by moving it to x/y and scaling
    // We keep base width via style width and use translate for centering
    overlayImg.style.width = w + "px";
    overlayImg.style.transform =
      `translate(-50%, -50%) translate(${x - window.innerWidth/2}px, ${yy - window.innerHeight/2}px)
       rotateZ(${rotZ}deg) rotateX(${rotX}deg)`;

    root.style.setProperty('--cubeOpacity', opacity.toFixed(3));

    // Show the real nav logo at the end, hide overlay
    if (raw >= 0.98){
      navTarget.classList.add('cube-ready');
      overlayImg.style.opacity = "0";
    } else {
      navTarget.classList.remove('cube-ready');
      overlayImg.style.opacity = ""; // back to css variable
    }

    ticking = false;
  }

  function onScroll(){
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  measure();
  update();

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => { measure(); update(); }, { passive: true });
})();


(function introCubeToNavbar(){
  const intro = document.querySelector('.intro');
  const overlayImg = document.getElementById('scrollCubeImg');
  const navTarget = document.getElementById('navCubeTarget');
  if(!intro || !overlayImg || !navTarget) return;

  const root = document.documentElement;
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeInOut = (t) => t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2)/2;

  let ticking = false;

  function getStart(){
    // center of viewport
    return {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      size: Math.min(520, window.innerWidth * 0.74)
    };
  }

  function getEnd(){
    const r = navTarget.getBoundingClientRect();
    return {
      x: r.left + r.width / 2,
      y: r.top + r.height / 2,
      size: Math.max(r.width, 1)
    };
  }

  function update(){
    const introRect = intro.getBoundingClientRect();
    const introTop = introRect.top;              // 0 at top of viewport
    const introHeight = Math.max(introRect.height, 1);

    // progress: 0 when intro top is at 0; 1 when intro top has moved up by 1 viewport
    // (so animation completes by the time user scrolls past intro)
    const raw = clamp((-introTop) / (Math.min(introHeight, window.innerHeight)), 0, 1);
    const t = easeInOut(raw);

    const start = getStart();
    const end = getEnd();

    const x = lerp(start.x, end.x, t);
    const y = lerp(start.y, end.y, t);
    const w = lerp(start.size, end.size, t);

    const rotZ = lerp(0, 360, t);
    const rotX = lerp(0, 18, t);

    const opacity = raw < 0.92 ? 1 : lerp(1, 0, (raw - 0.92) / 0.08);

    overlayImg.style.width = w + "px";
    overlayImg.style.transform =
      `translate(-50%, -50%) translate(${x - window.innerWidth/2}px, ${y - window.innerHeight/2}px)
       rotateZ(${rotZ}deg) rotateX(${rotX}deg)`;

    root.style.setProperty('--cubeOpacity', opacity.toFixed(3));

    if (raw >= 0.98){
      navTarget.classList.add('cube-ready');
    } else {
      navTarget.classList.remove('cube-ready');
    }

    ticking = false;
  }

  function onScroll(){
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => update(), { passive: true });
})();


(function introCubeLoadAndMerge(){
  const intro = document.querySelector('.intro');
  const stage = document.querySelector('.intro__stage');
  const cube = document.getElementById('scrollCubeImg');
  const navTarget = document.getElementById('navCubeTarget');
  if(!intro || !stage || !cube || !navTarget) return;

  const root = document.documentElement;
  const clamp = (v,min,max)=>Math.min(max,Math.max(min,v));
  const lerp = (a,b,t)=>a+(b-a)*t;
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
  const easeInOut = t => t < .5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2;

  let introOffsetTop = 0;
  let vh = window.innerHeight;
  let loadedToCenterDone = false;
  let ticking = false;

  function measure(){
    introOffsetTop = intro.offsetTop || 0;
    vh = window.innerHeight || 1;
  }

  function getLogo(){
    const r = navTarget.getBoundingClientRect();
    return { x: r.left + r.width/2, y: r.top + r.height/2, size: Math.max(r.width, 1) };
  }

  function getCenter(){
    const isMobile = window.innerWidth <= 768;
  
    // push center slightly down on mobile so it feels centered under header
    const y = isMobile ? (window.innerHeight * 0.56) : (window.innerHeight * 0.50);
  
    return {
      x: window.innerWidth / 2,
      y: y,
      size: Math.min(520, window.innerWidth * (isMobile ? 0.62 : 0.74))
    };
  }

  function applyTransform(x,y,size,rotZ,rotX){
    cube.style.width = size + "px";
    cube.style.transform =
      `translate(-50%, -50%) translate(${x - window.innerWidth/2}px, ${y - window.innerHeight/2}px)
       rotateZ(${rotZ}deg) rotateX(${rotX}deg)`;
  }

  // Phase 1: On load -> logo to center
  function animateLoadToCenter(){
    const start = getLogo();
    const end = getCenter();
  
    const duration = 1400; // ⬅ slower & premium
    const delay = 180;     // ⬅ small dramatic pause
  
    const t0 = performance.now() + delay;
  
    navTarget.classList.remove('cube-ready');
    stage.classList.remove('stage-hide');
    cube.classList.add('is-breathing');
    root.style.setProperty('--cubeOpacity', '0');
  
    function easeOutBack(t){
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }
  
    function frame(now){
      if(now < t0){
        requestAnimationFrame(frame);
        return;
      }
  
      const p = clamp((now - t0) / duration, 0, 1);
  
      // mix smooth + overshoot
      const t = easeOutBack(p * 0.85);
  
      const x = lerp(start.x, end.x, t);
      const y = lerp(start.y, end.y, t);
  
      // scale overshoot then settle
      const s = lerp(start.size * 0.85, end.size * 1.04, t);
  
      // cinematic rotation
      const rotZ = lerp(-120, 0, t);
      const rotX = lerp(26, 0, t);
  
      // fade in smoothly
      const opacity = clamp(p * 1.25, 0, 1);
      root.style.setProperty('--cubeOpacity', opacity.toFixed(3));
  
      applyTransform(x, y, s, rotZ, rotX);
  
      if(p < 1){
        requestAnimationFrame(frame);
      } else {
        loadedToCenterDone = true;
        update(); // sync with scroll immediately
      }
    }
  
    requestAnimationFrame(frame);
  }

  // Phase 2: Scroll -> center to logo (merge earlier, no delay)
  function update(){
    if(!loadedToCenterDone){ ticking = false; return; }

    const y = window.scrollY || 0;
    const scrollIntoIntro = y - introOffsetTop;

    // progress across 1 viewport of scrolling
    const raw = clamp(scrollIntoIntro / vh, 0, 1);
    const t = easeInOut(raw);

    const start = getCenter();
    const end = getLogo();

    const x = lerp(start.x, end.x, t);
    const yy = lerp(start.y, end.y, t);
    const s = lerp(start.size, end.size, t);

    // Premium rotation back into logo
    const rotZ = lerp(0, 360, t);
    const rotX = lerp(0, 18, t);

    // Merge earlier (FIX for "delay")
    // show navbar cube at 85% and fade overlay quickly
    const showAt = 0.85;
    const hideAt = 0.92;

    let opacity = 1;
    if(raw >= showAt){
      navTarget.classList.add('cube-ready');
      const fadeT = clamp((raw - showAt) / (hideAt - showAt), 0, 1);
      opacity = 1 - fadeT;
    } else {
      navTarget.classList.remove('cube-ready');
    }

    root.style.setProperty('--cubeOpacity', opacity.toFixed(3));
    applyTransform(x,yy,s,rotZ,rotX);

    // When intro is done, kill the fixed stage so hero never overlaps
    if(raw >= 0.98){
      stage.classList.add('stage-hide');
    } else {
      stage.classList.remove('stage-hide');
    }

    ticking = false;
  }

  function onScroll(){
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  measure();
  window.addEventListener('resize', () => { measure(); update(); }, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });

  // start animation on load
  animateLoadToCenter();
})();


document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("leadForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const phone = form.querySelector('[name="phone"]').value.trim();
    const link = form.querySelector('[name="link"]').value.trim();
    const goal = form.querySelector('[name="goal"]').value.trim();

    if (!name || !email || !link || !goal) {
      alert("Please fill all required fields.");
      return;
    }

    const message = 
`🚀 *New Growth Audit Request — CtrlBox*

👤 Name: ${name}
📧 Email: ${email}
📱 Phone: ${phone}
🌐 Instagram/Website: ${link}

🎯 Goal:
${goal}

Sent from CtrlBox Website`;

    const encodedMessage = encodeURIComponent(message);

    const whatsappNumber = "919148391386"; // Without + sign
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");

    form.reset();
  });
});
