/* =============================================
   THE LAND LORD | APP.JS
   Premium Real Estate | Hubballi
   ============================================= */

'use strict';

// =============================================
// CONFIGURATION
// =============================================
const CONFIG = {
  phone: '918792154088',
};

// Touch / small-screen detection used across the file
const IS_TOUCH  = window.matchMedia('(pointer: coarse)').matches;
const IS_MOBILE = IS_TOUCH || window.innerWidth < 900;
const REDUCED   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// =============================================
// WHATSAPP MESSAGE TEMPLATES
// Kept in one place so every button opens a
// properly worded enquiry instead of a blank chat.
// =============================================
const WA_MESSAGES = {
  general:
`Hello Samarth,

I came across The Land Lord Real Estate Group and would like to speak with you about a property requirement in Hubballi.

Name:
Requirement:
Preferred location:

Could you please let me know a convenient time to connect?

Thank you.`,

  services:
`Hello Samarth,

I would like to enquire about the services offered by The Land Lord Real Estate Group.

Name:
Service required:
Property location:

Please share the details along with the documents needed and your charges for this service.

Thank you.`,

  documents:
`Hello Samarth,

I would like to book a consultation regarding property documentation.

Name:
Document required:
Property location:

Please let me know which records I need to arrange and a suitable time to discuss this.

Thank you.`,

  ec:
`Hello Samarth,

I need assistance with an Encumbrance Certificate for a property.

Name:
Survey number or property address:
Period required:

Please advise on the documents needed, the expected timeline and your charges for this service.

Thank you.`,

  rtc:
`Hello Samarth,

I need assistance with RTC records, also known as Record of Rights, Tenancy and Crops, for a piece of land.

Name:
Survey number:
Village and hobli:

Please let me know what details you need from me and how we should proceed.

Thank you.`,

  saledeed:
`Hello Samarth,

I am looking for assistance with Sale Deed documentation for a property transaction.

Name:
Property location:
Stage of the transaction:

Please guide me on the process, the documents required and the registration formalities.

Thank you.`,
};

function waLink(key) {
  const msg = WA_MESSAGES[key] || WA_MESSAGES.general;
  return `https://wa.me/${CONFIG.phone}?text=${encodeURIComponent(msg)}`;
}

// Attach the right prewritten message to every WhatsApp button.
// The plain wa.me href stays in the HTML as a fallback.
function initWhatsAppLinks() {
  document.querySelectorAll('a[data-wa]').forEach(el => {
    el.href = waLink(el.dataset.wa);
  });
}

// =============================================
// DOM READY
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  initSplash();
  initCursor();
  initWebGLBackground();
  initHeader();
  initNavigation();
  initHistory();
  initWhatsAppLinks();
  initReveal();
  initScrollEffects();
  initStatCounters();
  initHeroCard3D();
  initContactForm();
  initFooterYear();
  initParticles();
  initGyroscope(); // Mobile tilt support
});

// =============================================
// SPLASH SCREEN
// =============================================
function initSplash() {
  const splash = document.getElementById('splash');
  const logo = splash.querySelector('.splash-logo');
  const line = splash.querySelector('.splash-line');

  setTimeout(() => logo.classList.add('show'), 200);
  setTimeout(() => line.classList.add('show'), 900);

  setTimeout(() => {
    splash.classList.add('fade-out');
    setTimeout(() => { splash.style.display = 'none'; }, 800);
  }, 2400);
}

// =============================================
// CUSTOM CURSOR (desktop only)
// =============================================
function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  // Skip on touch devices
  if (IS_TOUCH) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  const lerp = (a, b, t) => a + (b - a) * t;

  function animateRing() {
    ringX = lerp(ringX, mouseX, 0.12);
    ringY = lerp(ringY, mouseY, 0.12);
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, [data-tab], .service-card, .why-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
}

// =============================================
// WEBGL 3D BACKGROUND
// =============================================
function initWebGLBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  script.onload = () => buildScene(canvas);
  document.head.appendChild(script);
}

// Shared camera parallax target (used by both mouse and gyroscope)
const CAM = { targetX: 0, targetY: 0, currentX: 0, currentY: 0 };

function buildScene(canvas) {
  const THREE = window.THREE;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !IS_MOBILE, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, IS_MOBILE ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, 18);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const dir = new THREE.DirectionalLight(0xE8D091, 2.5);
  dir.position.set(8, 12, 8);
  scene.add(dir);
  const pt1 = new THREE.PointLight(0xC5A059, 2, 50);
  pt1.position.set(-10, 5, 5);
  scene.add(pt1);
  const pt2 = new THREE.PointLight(0x8C6A2E, 1.5, 40);
  pt2.position.set(10, -5, -5);
  scene.add(pt2);

  // Materials
  const matSolid = new THREE.MeshStandardMaterial({ color: 0xC5A059, metalness: 0.85, roughness: 0.15, transparent: true, opacity: 0.18, side: THREE.DoubleSide });
  const matWire  = new THREE.MeshBasicMaterial({ color: 0xE8D091, wireframe: true, transparent: true, opacity: 0.12 });
  const matGem   = new THREE.MeshStandardMaterial({ color: 0xC5A059, metalness: 0.9, roughness: 0.05, transparent: true, opacity: 0.22, side: THREE.DoubleSide });

  const objects = [];
  const OBJECT_COUNT = IS_MOBILE ? 10 : 22;
  for (let i = 0; i < OBJECT_COUNT; i++) {
    const building = new THREE.Group();
    const width = 0.8 + Math.random() * 1.2;
    const height = 0.9 + Math.random() * 2.2;
    const depth = 0.7 + Math.random() * 0.8;
    const body = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), matSolid);
    body.position.y = height / 2;
    building.add(body);

    const roof = new THREE.Mesh(
      new THREE.ConeGeometry(width * 0.78, width * 0.7, 4),
      Math.random() > 0.35 ? matGem : matWire
    );
    roof.position.y = height + width * 0.35;
    roof.rotation.y = Math.PI / 4;
    building.add(roof);

    if (Math.random() > 0.3) {
      const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.7, 6), matWire);
      antenna.position.y = height + width * 0.85;
      building.add(antenna);
    }

    const r = 18 + Math.random() * 10;
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.random() * Math.PI;
    building.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta) * 0.6,
      r * Math.cos(phi) - 5
    );
    building.rotation.y = Math.random() * Math.PI * 2;
    const s = 0.4 + Math.random() * 1.4;
    building.scale.setScalar(s);
    building.userData = {
      rx: (Math.random() - 0.5) * 0.006,
      ry: (Math.random() - 0.5) * 0.007,
      rz: (Math.random() - 0.5) * 0.004,
      floatSpeed: 0.008 + Math.random() * 0.012,
      floatOffset: Math.random() * Math.PI * 2,
      baseY: building.position.y,
    };
    scene.add(building);
    objects.push(building);
  }

  // Central decorative rings
  const ringMat  = new THREE.MeshBasicMaterial({ color: 0xC5A059, transparent: true, opacity: 0.06 });
  const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xE8D091, transparent: true, opacity: 0.04 });
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(7, 0.04, 16, 200), ringMat);
  ring1.rotation.x = Math.PI / 2;
  scene.add(ring1);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(11, 0.025, 16, 200), ringMat2);
  ring2.rotation.x = Math.PI / 3;
  ring2.rotation.z = Math.PI / 5;
  scene.add(ring2);

  // Desktop mouse parallax (touch devices use the gyroscope instead)
  if (!IS_TOUCH) {
    document.addEventListener('mousemove', (e) => {
      CAM.targetX = (e.clientX / window.innerWidth - 0.5) * 5;
      CAM.targetY = -(e.clientY / window.innerHeight - 0.5) * 4;
    });
  }

  // On mobile the browser fires resize every time the address bar hides,
  // so only rebuild the viewport when the width actually changes.
  let lastW = window.innerWidth;
  let lastH = window.innerHeight;
  function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (IS_TOUCH && w === lastW && Math.abs(h - lastH) < 120) return;
    lastW = w; lastH = h;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('orientationchange', () => setTimeout(onResize, 250));

  // Stop drawing while the tab is in the background to save battery
  let paused = document.hidden;
  let rafId  = null;
  document.addEventListener('visibilitychange', () => {
    paused = document.hidden;
    if (paused) {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
    } else if (rafId === null) {
      rafId = requestAnimationFrame(animate);
    }
  });

  const clock = new THREE.Clock();
  let t = 0;
  function animate() {
    if (paused) { rafId = null; return; }
    rafId = requestAnimationFrame(animate);
    // Clamp the step so returning from a background tab does not jump the scene
    t += Math.min(clock.getDelta(), 0.05);

    // Smooth camera parallax (fed by mouse or gyroscope via CAM object)
    CAM.currentX += (CAM.targetX - CAM.currentX) * 0.04;
    CAM.currentY += (CAM.targetY - CAM.currentY) * 0.04;
    camera.position.x = CAM.currentX;
    camera.position.y = CAM.currentY;
    camera.lookAt(scene.position);

    ring1.rotation.z = t * 0.04;
    ring2.rotation.z = -t * 0.025;

    objects.forEach(obj => {
      obj.rotation.x += obj.userData.rx;
      obj.rotation.y += obj.userData.ry;
      obj.rotation.z += obj.userData.rz;
      obj.position.y = obj.userData.baseY + Math.sin(t * obj.userData.floatSpeed + obj.userData.floatOffset) * 1.5;
    });

    renderer.render(scene, camera);
  }
  rafId = requestAnimationFrame(animate);
}

// =============================================
// GYROSCOPE / DEVICE ORIENTATION (mobile tilt)
// =============================================
function initGyroscope() {
  // Only run on touch devices; desktop keeps the cursor parallax
  if (!IS_TOUCH || REDUCED) return;

  const MAX   = 6;  // max camera shift, in scene units
  const RANGE = 28; // degrees of tilt that map to the full shift
  const card  = document.getElementById('card-3d');

  // The phone is never held perfectly flat, so the first reading becomes
  // the neutral position and everything is measured relative to it.
  let baseBeta = null, baseGamma = null;
  let gotReading = false;

  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

  function handleOrientation(e) {
    if (e.beta === null || e.gamma === null) return;

    if (baseBeta === null) {
      baseBeta  = e.beta;
      baseGamma = e.gamma;
    }

    let dBeta  = e.beta  - baseBeta;   // front to back tilt
    let dGamma = e.gamma - baseGamma;  // left to right tilt

    // In landscape the axes swap round, so follow the screen instead of the device
    const angle = (screen.orientation && screen.orientation.angle) || window.orientation || 0;
    if (angle === 90)  { const t = dBeta; dBeta = -dGamma; dGamma = t; }
    if (angle === -90 || angle === 270) { const t = dBeta; dBeta = dGamma; dGamma = -t; }

    const nx = clamp(dGamma, -RANGE, RANGE) / RANGE;
    const ny = clamp(dBeta,  -RANGE, RANGE) / RANGE;

    // Feeds the same CAM object the mouse uses, so the background
    // parallax is smoothed by the render loop either way.
    CAM.targetX = nx * MAX;
    CAM.targetY = -ny * MAX * 0.6;

    // Tilt the hero card with the phone, mirroring the desktop hover tilt
    if (card) {
      card.style.transform =
        `perspective(1200px) rotateX(${(-ny * 10).toFixed(2)}deg) rotateY(${(nx * 14).toFixed(2)}deg)`;
    }

    if (!gotReading && (Math.abs(dBeta) > 4 || Math.abs(dGamma) > 4)) {
      gotReading = true;
    }
  }

  function listen() {
    window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    window.addEventListener('deviceorientationabsolute', handleOrientation, { passive: true });
    // Re-centre the neutral position after a rotation
    window.addEventListener('orientationchange', () => {
      baseBeta = null; baseGamma = null;
      CAM.targetX = 0;
      CAM.targetY = 0;
    });
  }

  const needsPermission =
    typeof DeviceOrientationEvent !== 'undefined' &&
    typeof DeviceOrientationEvent.requestPermission === 'function';

  if (needsPermission) {
    // iOS 13 and later only grant motion access from a user gesture
    const permBtn = document.createElement('button');
    permBtn.className = 'motion-btn';
    permBtn.type = 'button';
    permBtn.innerHTML = '<span class="motion-dot"></span> Enable Motion';
    document.body.appendChild(permBtn);

    permBtn.addEventListener('click', () => {
      DeviceOrientationEvent.requestPermission().then(state => {
        if (state === 'granted') listen();
        else sessionStorage.setItem('tll-motion', 'denied');
        permBtn.remove();
      }).catch(() => {
        sessionStorage.setItem('tll-motion', 'denied');
        permBtn.remove();
      });
    });
  } else if ('DeviceOrientationEvent' in window) {
    listen();
  }
}

// =============================================
// HEADER SCROLL + HAMBURGER
// =============================================
function initHeader() {
  const header   = document.getElementById('main-header');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(link.dataset.tab);
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      hamburger.click();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      hamburger.click();
    }
  });
}

// =============================================
// NAVIGATION / PAGE SWITCHING
// =============================================
const VALID_TABS = new Set(['home', 'services', 'docs', 'contact']);

function navigate(tab, options = {}) {
  if (!VALID_TABS.has(tab)) return;

  const { addHistory = true, instant = false } = options;

  if (addHistory && (!history.state || history.state.tab !== tab)) {
    history.pushState(
      { app: 'the-land-lord', tab },
      '',
      window.location.href
    );
  }

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + tab);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.tab === tab));
  document.querySelectorAll('.mobile-link').forEach(l => l.classList.toggle('active', l.dataset.tab === tab));

  window.scrollTo({ top: 0, behavior: instant ? 'auto' : 'smooth' });

  setTimeout(() => {
    triggerReveal();
    initStatCounters();
  }, 80);
}

function initNavigation() {
  document.querySelectorAll('.nav-link').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      if (el.dataset.tab) navigate(el.dataset.tab);
    });
  });
}

// Each in-app section gets its own browser history entry. This makes the
// Android/iOS back gesture return to the previous section instead of exiting.
function initHistory() {
  const currentTab = history.state &&
    history.state.app === 'the-land-lord' &&
    VALID_TABS.has(history.state.tab)
    ? history.state.tab
    : 'home';

  history.replaceState(
    { app: 'the-land-lord', tab: currentTab },
    '',
    window.location.href
  );

  if (currentTab !== 'home') {
    navigate(currentTab, { addHistory: false, instant: true });
  }

  window.addEventListener('popstate', (event) => {
    const tab = event.state &&
      event.state.app === 'the-land-lord' &&
      VALID_TABS.has(event.state.tab)
      ? event.state.tab
      : 'home';
    navigate(tab, { addHistory: false, instant: true });
  });
}

window.navigate = navigate;

// =============================================
// SCROLL REVEAL
// =============================================
function triggerReveal() {
  const reveals = document.querySelectorAll('.page.active .reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay) || 0;
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => {
    el.classList.remove('visible');
    observer.observe(el);
  });
}

function initReveal() {
  triggerReveal();
}

// Scroll-linked motion stays on the compositor and is disabled for reduced motion.
function initScrollEffects() {
  if (REDUCED) return;

  const progress = document.getElementById('scroll-progress');
  const parallaxItems = document.querySelectorAll('[data-parallax]');
  let ticking = false;

  function update() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    if (progress) progress.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;

    parallaxItems.forEach(el => {
      const amount = Number(el.dataset.parallax) || 0;
      const rect = el.getBoundingClientRect();
      const offset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * amount;
      el.style.setProperty('--scroll-offset', `${offset.toFixed(1)}px`);
    });
    ticking = false;
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  requestUpdate();
}

// =============================================
// STAT COUNTERS
// =============================================
function initStatCounters() {
  const counters = document.querySelectorAll('.page.active [data-count]');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.count);
    let started = false;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started) {
        started = true;
        const startTime = performance.now();
        const duration = 1600;
        function update(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(update);
          else counter.textContent = target;
        }
        requestAnimationFrame(update);
        observer.unobserve(counter);
      }
    }, { threshold: 0.5 });

    observer.observe(counter);
  });
}

// =============================================
// HERO 3D CARD | Desktop mouse tilt
// =============================================
function initHeroCard3D() {
  const wrapper   = document.getElementById('card-3d');
  const container = document.querySelector('.hero-3d-card');
  if (!wrapper || !container) return;

  // Desktop only, mobile uses the gyroscope
  if (IS_TOUCH || REDUCED) return;

  let targetRx = 0, targetRy = 0;
  let currentRx = 0, currentRy = 0;
  const MAX_TILT = 18;
  let isHovering = false;
  let idleT = 0;

  container.addEventListener('mousemove', (e) => {
    isHovering = true;
    const rect = container.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    targetRy =  ((e.clientX - cx) / (rect.width  / 2)) * MAX_TILT;
    targetRx = -((e.clientY - cy) / (rect.height / 2)) * MAX_TILT;
  });

  container.addEventListener('mouseleave', () => {
    isHovering = false;
    targetRx = 0;
    targetRy = 0;
  });

  function tick() {
    if (!isHovering) {
      idleT += 0.008;
      targetRx = Math.sin(idleT * 0.7) * 4;
      targetRy = Math.cos(idleT) * 6;
    }
    currentRx += (targetRx - currentRx) * 0.1;
    currentRy += (targetRy - currentRy) * 0.1;
    wrapper.style.transform = `perspective(1200px) rotateX(${currentRx}deg) rotateY(${currentRy}deg)`;
    requestAnimationFrame(tick);
  }
  tick();
}

// =============================================
// HERO PARTICLES (2D canvas)
// =============================================
function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container || REDUCED) return;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  container.appendChild(canvas);

  let W, H;
  function resize() {
    W = canvas.width  = container.offsetWidth;
    H = canvas.height = container.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // The link lines are the expensive part, so mobile gets fewer points
  const COUNT     = IS_MOBILE ? 26 : 55;
  const LINK_DIST = IS_MOBILE ? 70 : 90;
  const particles = Array.from({ length: COUNT }, () => ({
    x: Math.random() * (W || 800),
    y: Math.random() * (H || 600),
    r: 0.5 + Math.random() * 1.8,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
    alpha: 0.1 + Math.random() * 0.35,
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(197,160,89,${p.alpha})`;
      ctx.fill();
    });
    // Connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(197,160,89,${(1 - dist / LINK_DIST) * 0.07})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// =============================================
// CONTACT FORM, builds the WhatsApp enquiry message
// =============================================
function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name     = form.querySelector('#f-name').value.trim();
    const phone    = form.querySelector('#f-phone').value.trim();
    const email    = form.querySelector('#f-email').value.trim();
    const interest = form.querySelector('#f-interest').value;
    const location = form.querySelector('#f-location').value.trim();
    const message  = form.querySelector('#f-message').value.trim();

    if (!name) { highlightError('#f-name'); return; }
    if (!phone) { highlightError('#f-phone'); return; }

    let msg = `Hello Samarth,\n\nI would like to enquire about your property services. My details are below.\n\nName: ${name}\nPhone: ${phone}`;
    if (email)    msg += `\nEmail: ${email}`;
    msg += `\nService required: ${interest}`;
    if (location) msg += `\nPreferred location: ${location}`;
    if (message)  msg += `\n\nAdditional details:\n${message}`;
    msg += `\n\nPlease let me know the next steps and a convenient time to discuss this.\n\nThank you.`;

    const waUrl = `https://wa.me/${CONFIG.phone}?text=${encodeURIComponent(msg)}`;

    form.classList.add('hidden');
    success.classList.remove('hidden');

    // Mobile browsers block window.open outside a gesture, so navigate instead
    setTimeout(() => {
      if (IS_TOUCH) window.location.href = waUrl;
      else window.open(waUrl, '_blank', 'noopener');
    }, 1200);

    setTimeout(() => {
      form.reset();
      form.classList.remove('hidden');
      success.classList.add('hidden');
    }, 6000);
  });
}

function highlightError(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.style.borderColor = '#e74c3c';
  el.style.boxShadow = '0 0 0 3px rgba(231,76,60,0.15)';
  el.focus();
  setTimeout(() => { el.style.borderColor = ''; el.style.boxShadow = ''; }, 2500);
}

// =============================================
// FOOTER YEAR
// =============================================
function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

// =============================================
// GLOBAL DATA-TAB DELEGATION (footer links etc.)
// =============================================
document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-tab]');
  if (!target) return;
  if (target.classList.contains('nav-link') || target.classList.contains('mobile-link')) return;
  e.preventDefault();
  const tab = target.dataset.tab;
  if (tab) navigate(tab);
});
