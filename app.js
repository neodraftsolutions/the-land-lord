/* =============================================
   THE LAND LORD – APP.JS
   Premium Real Estate | Hubballi
   ============================================= */

'use strict';

// =============================================
// CONFIGURATION
// =============================================
const CONFIG = {
  phone: '918792154088',
};

// =============================================
// DOM READY
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  initSplash();
  initCursor();
  initWebGLBackground();
  initHeader();
  initNavigation();
  initReveal();
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
  if (window.matchMedia('(pointer: coarse)').matches) return;

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

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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

  const geos = [
    new THREE.OctahedronGeometry(1.6, 0),
    new THREE.TorusGeometry(1.3, 0.06, 20, 100),
    new THREE.DodecahedronGeometry(1.2, 0),
    new THREE.IcosahedronGeometry(1.1, 0),
    new THREE.TorusKnotGeometry(0.7, 0.2, 100, 16),
    new THREE.SphereGeometry(0.9, 8, 8),
  ];
  const mats = [matSolid, matWire, matGem];

  const objects = [];
  for (let i = 0; i < 38; i++) {
    const mesh = new THREE.Mesh(
      geos[Math.floor(Math.random() * geos.length)],
      mats[Math.floor(Math.random() * mats.length)]
    );
    const r = 18 + Math.random() * 10;
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.random() * Math.PI;
    mesh.position.set(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta) * 0.6,
      r * Math.cos(phi) - 5
    );
    mesh.rotation.set(Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2);
    const s = 0.4 + Math.random() * 1.4;
    mesh.scale.setScalar(s);
    mesh.userData = {
      rx: (Math.random() - 0.5) * 0.006,
      ry: (Math.random() - 0.5) * 0.007,
      rz: (Math.random() - 0.5) * 0.004,
      floatSpeed: 0.008 + Math.random() * 0.012,
      floatOffset: Math.random() * Math.PI * 2,
      baseY: mesh.position.y,
    };
    scene.add(mesh);
    objects.push(mesh);
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

  // Desktop mouse parallax
  document.addEventListener('mousemove', (e) => {
    CAM.targetX = (e.clientX / window.innerWidth - 0.5) * 5;
    CAM.targetY = -(e.clientY / window.innerHeight - 0.5) * 4;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

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
  animate();
}

// =============================================
// GYROSCOPE / DEVICE ORIENTATION (mobile tilt)
// =============================================
function initGyroscope() {
  // Only run on touch devices
  if (!window.matchMedia('(pointer: coarse)').matches) return;

  const MAX = 6; // max camera shift in units

  function handleOrientation(e) {
    // beta  = front-back tilt (-180 to 180), gamma = left-right tilt (-90 to 90)
    const beta  = Math.min(Math.max(e.beta,  -45), 45);  // clamp
    const gamma = Math.min(Math.max(e.gamma, -45), 45);  // clamp

    // Map tilt to camera target (smooth via CAM lerp in animate loop)
    CAM.targetX = (gamma / 45) * MAX;
    CAM.targetY = -(beta  / 45) * MAX * 0.6;
  }

  // iOS 13+ requires permission
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    // Show a button to request permission on first tap
    const permBtn = document.createElement('button');
    permBtn.textContent = 'Enable Motion';
    permBtn.style.cssText = `
      position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%);
      z-index: 1000; background: rgba(197,160,89,0.9); color: #000; border: none;
      font-family: Inter, sans-serif; font-size: 0.75rem; font-weight: 600;
      letter-spacing: 0.1em; text-transform: uppercase; padding: 10px 22px;
      border-radius: 100px; cursor: pointer; box-shadow: 0 4px 20px rgba(0,0,0,0.4);
    `;
    document.body.appendChild(permBtn);
    permBtn.addEventListener('click', () => {
      DeviceOrientationEvent.requestPermission().then(state => {
        if (state === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
        }
        permBtn.remove();
      }).catch(() => permBtn.remove());
    });
  } else if (window.DeviceOrientationEvent) {
    // Android and older iOS — no permission needed
    window.addEventListener('deviceorientation', handleOrientation);
  }

  // Also listen to device motion for card tilt on mobile
  initMobileCardTilt();
}

// =============================================
// MOBILE CARD TILT (on device motion)
// =============================================
function initMobileCardTilt() {
  const wrapper = document.getElementById('card-3d');
  if (!wrapper) return;

  window.addEventListener('deviceorientation', (e) => {
    const gamma = Math.min(Math.max(e.gamma, -30), 30);
    const beta  = Math.min(Math.max(e.beta - 45, -30), 30);
    const ry = (gamma / 30) * 15;
    const rx = -(beta  / 30) * 10;
    wrapper.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
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
    document.body.style.overflow = open ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(link.dataset.tab);
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// =============================================
// NAVIGATION / PAGE SWITCHING
// =============================================
function navigate(tab) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + tab);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.tab === tab));
  document.querySelectorAll('.mobile-link').forEach(l => l.classList.toggle('active', l.dataset.tab === tab));

  window.scrollTo({ top: 0, behavior: 'smooth' });

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
// HERO 3D CARD – Desktop mouse tilt
// =============================================
function initHeroCard3D() {
  const wrapper   = document.getElementById('card-3d');
  const container = document.querySelector('.hero-3d-card');
  if (!wrapper || !container) return;

  // Desktop only – mobile uses gyroscope
  if (window.matchMedia('(pointer: coarse)').matches) return;

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
  if (!container) return;

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

  const COUNT = 55;
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
        if (dist < 90) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(197,160,89,${(1 - dist / 90) * 0.07})`;
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
// CONTACT FORM — builds professional WhatsApp msg
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

    // Professional WhatsApp message
    let msg = `Hello Samarth,\n\nI am writing to enquire about your property services. Below are my details:\n\nName: ${name}\nPhone: ${phone}`;
    if (email)    msg += `\nEmail: ${email}`;
    msg += `\nService Required: ${interest}`;
    if (location) msg += `\nPreferred Location: ${location}`;
    if (message)  msg += `\n\nAdditional Details:\n${message}`;
    msg += `\n\nI would appreciate if you could get back to me at your earliest convenience.\n\nThank you.`;

    const waUrl = `https://wa.me/${CONFIG.phone}?text=${encodeURIComponent(msg)}`;

    form.classList.add('hidden');
    success.classList.remove('hidden');

    setTimeout(() => window.open(waUrl, '_blank'), 1200);

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
