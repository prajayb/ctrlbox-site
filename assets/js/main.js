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
