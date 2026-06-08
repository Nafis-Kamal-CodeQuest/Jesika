/* ================================================================
   SCRIPT.JS — A Universe Built From Love
   Handles all animations, interactivity, and custom data
================================================================ */

/* ---------------------------------------------------------------
   ✏️ CUSTOMIZATION: CONSTELLATION REASONS
   Add or change the reasons you love her here.
   The script will randomly map them to stars in Chapter Three.
--------------------------------------------------------------- */
const CONSTELLATION_REASONS = [
  "কারন তোমার হাসির শব্দ কাচের চুড়ির রিনঝিনের মতো.",
  "For the way you look at me when you think I'm not paying attention.",
  "I would rather share one lifetime with you than face all the ages of this world alone.",
  "For your kindness, even when the world doesn't deserve it.",
  "Because holding your hand feels like coming home.",
  "কারন তোমার সাথে আমি গরুর খামার করবো.",
  "তুমি দেখতে একটা পরী বাচ্চার মতো",
  "তুমি মাঝে মাঝে লাফিয়ে লাফিয়ে হাটো তাই.",
  "আমার সব অন্যায় মেনে নিয়েও তুমি আমাকে ভালোবেসেছো তাই.",
  "For everything you are, and everything you don't yet know you are."
];

/* ---------------------------------------------------------------
   ✏️ CUSTOMIZATION: GALLERY DATA
   These match the 6 placeholders in Chapter Four.
   When you add real images, update these paths, titles, and dates.
--------------------------------------------------------------- */
const GALLERY_DATA = [
  { src: "images/1.jpg", title: "YOU", date: "April 15, 2025", desc: "How the hell do you look this beautiful omggg bouu." },
  { src: "images/2.jpg", title: "Quiet Moments", date: "January 20, 2026", desc: "Just us, when the rest of the world faded away." },
  { src: "images/3.jpg", title: "আমাদের বৈশাখ", date: "April 14, 2026", desc: "The day we got lost and didn't mind at all." },
  { src: "images/4.jpg", title: "My Birthdayyyyy", date: "February 3, 2025", desc: "Look at my collar." },
  { src: "images/5.jpg", title: "Hold My hand", date: "February 3, 2025", desc: "For I cant help, Falling in love with you." },
];

/* ---------------------------------------------------------------
   ✏️ CUSTOMIZATION: THE FINAL LETTER
   This is the cinematic ending in the final section.
   Each object is one line. Set highlight: true to make it gold.
--------------------------------------------------------------- */
const FINAL_LETTER_LINES = [
  { text: "There are a million ways this story could have gone.", highlight: false },
  { text: "A million different timelines where we never crossed paths.", highlight: false },
  { text: "But somehow, in this universe, in this exact lifetime...", highlight: false },
  { text: "I found you.", highlight: true },
  { text: "And I will spend every day making sure you know...", highlight: false },
  { text: "That choosing you was the easiest thing I ever did.", highlight: true }
];

/* ================================================================
   1. CORE INITIALIZATION
================================================================ */
document.addEventListener("DOMContentLoaded", () => {
  // Setup the canvas stars
  initStars('starCanvas', 150);
  initStars('finalStars', 100);

  // Setup constellations
  renderConstellations();

  // Create transition overlay div dynamically
  const overlay = document.createElement('div');
  overlay.className = 'transition-overlay';
  overlay.id = 'transitionOverlay';
  document.body.appendChild(overlay);

  // Setup scroll reveals
  initScrollReveals();
});

/* ================================================================
   2. THE GATE TRANSITION
================================================================ */
function enterStory() {
  const overlay = document.getElementById('transitionOverlay');
  const gate = document.getElementById('gate');
  const mainContent = document.getElementById('mainContent');

  // Fade to black/midnight
  overlay.classList.add('active');

  setTimeout(() => {
    // Hide gate, show main content, scroll to top
    gate.style.display = 'none';
    mainContent.classList.remove('hidden');
    window.scrollTo(0, 0);

    // Fade back in
    setTimeout(() => {
      overlay.classList.remove('active');
      // Re-trigger scroll reveals for elements now visible
      initScrollReveals();
    }, 100);

  }, 1000); // Matches the 1s CSS transition of the overlay
}

/* ================================================================
   3. PROGRESS BAR & SCROLL OBSERVERS
================================================================ */
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    progressBar.style.width = scrolled + '%';
  }
});

function initScrollReveals() {
  const revealElements = document.querySelectorAll('.chapter-inner');
  
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target); // Only reveal once
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

  revealElements.forEach(el => observer.observe(el));

  // Special observer for the Final Letter
  const finalSection = document.getElementById('final');
  if (finalSection) {
    const finalObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          triggerFinalLetter();
        }
      });
    }, { threshold: 0.5 });
    finalObserver.observe(finalSection);
  }
}

/* ================================================================
   4. TIMELINE & LETTERS ACCORDIONS
================================================================ */
function toggleTimeline(element) {
  // Optional: Close other timeline items for a clean accordion effect
  const allItems = document.querySelectorAll('.timeline-item');
  allItems.forEach(item => {
    if (item !== element) item.classList.remove('open');
  });

  element.classList.toggle('open');
}

function toggleLetter(element) {
  const fullText = element.querySelector('.letter-full');
  
  if (element.classList.contains('open')) {
    element.classList.remove('open');
    if (fullText) fullText.classList.add('hidden');
  } else {
    // Close others
    document.querySelectorAll('.letter').forEach(l => {
      l.classList.remove('open');
      const ft = l.querySelector('.letter-full');
      if (ft) ft.classList.add('hidden');
    });

    element.classList.add('open');
    if (fullText) fullText.classList.remove('hidden');
  }
}

/* ================================================================
   5. CONSTELLATIONS
================================================================ */
function renderConstellations() {
  const field = document.getElementById('constellationField');
  if (!field) return;

  CONSTELLATION_REASONS.forEach((reason) => {
    const star = document.createElement('div');
    
    // Randomize size class
    const rand = Math.random();
    let sizeClass = 'small';
    if (rand > 0.8) sizeClass = 'large';
    else if (rand < 0.4) sizeClass = 'tiny';

    star.className = `star-dot ${sizeClass}`;
    
    // Distribute randomly across the 100x100 grid (with padding)
    star.style.left = (10 + Math.random() * 80) + '%';
    star.style.top = (10 + Math.random() * 80) + '%';
    
    // Add varying animation delay for a twinkling effect
    star.style.animation = `twinkle ${2 + Math.random() * 3}s infinite alternate`;
    star.style.animationDelay = `${Math.random() * 2}s`;

    star.onclick = () => openConstellation(reason);
    field.appendChild(star);
  });
}

function openConstellation(text) {
  document.getElementById('popupText').innerText = text;
  document.getElementById('constellationPopup').classList.remove('hidden');
}

function closeConstellation() {
  document.getElementById('constellationPopup').classList.add('hidden');
}

/* ================================================================
   6. GALLERY LIGHTBOX
================================================================ */
let currentPhotoIndex = 0;

function openLightbox(index) {
  currentPhotoIndex = index;
  updateLightboxContent();
  document.getElementById('lightbox').classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeLightbox(event) {
  // If event is provided, only close if clicking the background or the close button
  if (event && event.target !== event.currentTarget && !event.target.classList.contains('lb-close')) {
    return;
  }
  document.getElementById('lightbox').classList.add('hidden');
  document.body.style.overflow = '';
}

function prevPhoto(event) {
  if (event) event.stopPropagation();
  currentPhotoIndex = (currentPhotoIndex - 1 + GALLERY_DATA.length) % GALLERY_DATA.length;
  updateLightboxContent();
}

function nextPhoto(event) {
  if (event) event.stopPropagation();
  currentPhotoIndex = (currentPhotoIndex + 1) % GALLERY_DATA.length;
  updateLightboxContent();
}

function updateLightboxContent() {
  const data = GALLERY_DATA[currentPhotoIndex];
  const imgWrap = document.getElementById('lbImgWrap');
  
  // Render image if it's not the default placeholder path
  if (data.src && !data.src.includes('gallery-')) {
    imgWrap.innerHTML = `<img src="${data.src}" alt="${data.title}" />`;
  } else {
    // Render placeholder inside lightbox if images aren't added yet
    imgWrap.innerHTML = `
      <div class="img-placeholder" style="border: 1px dashed rgba(201, 168, 76, 0.5);">
        <span>📸 ${data.title}</span>
        <small>Replace in GALLERY_DATA</small>
      </div>`;
  }

  document.getElementById('lbTitle').innerText = data.title;
  document.getElementById('lbDesc').innerText = data.desc;
  document.getElementById('lbDate').innerText = data.date;
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox.classList.contains('hidden')) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevPhoto();
    if (e.key === 'ArrowRight') nextPhoto();
  }
});

/* ================================================================
   7. FINAL LETTER SEQUENCER
================================================================ */
let finalTriggered = false;

function triggerFinalLetter() {
  if (finalTriggered) return;
  finalTriggered = true;

  const container = document.getElementById('finalLetter');
  const signature = document.getElementById('finalSignature');
  const finalStars = document.getElementById('finalStars');

  if (finalStars) finalStars.classList.add('visible');

  // Generate and animate lines sequentially
  FINAL_LETTER_LINES.forEach((lineData, index) => {
    const lineDiv = document.createElement('div');
    lineDiv.className = 'final-line' + (lineData.highlight ? ' gold' : '');
    lineDiv.innerText = lineData.text;
    container.appendChild(lineDiv);

    // Stagger the fade-ins (2.5 seconds per line)
    setTimeout(() => {
      lineDiv.classList.add('visible');
    }, index * 2500 + 1000); 
  });

  // Fade in signature after all lines are done
  setTimeout(() => {
    signature.classList.remove('hidden');
    // small delay to allow display:block to apply before opacity transition
    setTimeout(() => signature.classList.add('visible'), 50);
  }, FINAL_LETTER_LINES.length * 2500 + 1500);
}

/* ================================================================
   8. CANVAS STARFIELD GENERATOR
================================================================ */
function initStars(canvasId, particleCount) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  let particles = [];

  // Handle Resize
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createParticles();
  });

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5,
        opacity: Math.random(),
        speedX: (Math.random() - 0.5) * 0.2, // Drifting speed X
        speedY: (Math.random() - 0.5) * 0.2  // Drifting speed Y
      });
    }
  }

  function animateStars() {
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(p => {
      // Update position
      p.x += p.speedX;
      p.y += p.speedY;

      // Wrap around edges
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Draw star
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232, 201, 123, ${p.opacity})`; // Gold-ish white
      ctx.fill();
    });

    requestAnimationFrame(animateStars);
  }

  createParticles();
  animateStars();
}

/* ================================================================
   9. OPTIONAL AUDIO CONTROLS
================================================================ */
function toggleAudio() {
  const audio = document.getElementById('bgAudio');
  const btn = document.getElementById('audioBtn');
  
  if (!audio) return;

  if (audio.paused) {
    audio.play();
    btn.innerText = "♪ Pause Music";
  } else {
    audio.pause();
    btn.innerText = "♪ Play Music";
  }
}