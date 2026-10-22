import './style.css';
import Matter from 'matter-js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import pngImageUrl from './png_image.png';

gsap.registerPlugin(ScrollTrigger);

// --- Matter.js Setup ---
const setupMatter = () => {
  const canvas = document.getElementById('matter-canvas');
  if (!canvas) return;

  const Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Composite = Matter.Composite,
    Bodies = Matter.Bodies;

  const engine = Engine.create();
  const world = engine.world;

  // Set gravity
  engine.gravity.y = 0.5;

  // Create renderer
  const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
      width: window.innerWidth,
      height: window.innerHeight,
      background: 'transparent',
      wireframes: false,
      pixelRatio: window.devicePixelRatio || 1
    }
  });

  Render.run(render);

  const runner = Runner.create();
  Runner.run(runner, engine);

  // --- Optimization: Pause physics when off-screen ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runner.enabled = true;
      } else {
        runner.enabled = false;
      }
    });
  }, { threshold: 0.1 });
  observer.observe(canvas);

  // Add bodies
  const shapes = [];
  const colors = ['#00A19B', '#FFFFFF', '#1A2226', '#E4DDD3']; // Mint, White, Dark, Latte

  for (let i = 0; i < 25; i++) {
    const radius = Math.random() * 20 + 10; // Increased size to be bigger
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight * -1; // Start above screen

    // Use the png_image.png for all falling objects
    // Adjusting scale to make the image appropriately big
    const baseImageSize = 800; // Smaller divisor means a larger image scale
    const scale = (radius * 2.5) / baseImageSize;

    const body = Bodies.circle(x, y, radius, {
      render: {
        sprite: {
          texture: pngImageUrl,
          xScale: scale,
          yScale: scale
        }
      },
      restitution: 0.8,
      frictionAir: 0.01,
      friction: 0.1
    });

    shapes.push(body);
  }

  // Floor and walls
  const wallOptions = { isStatic: true, render: { visible: false } };
  const ground = Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 50, window.innerWidth * 2, 100, wallOptions);
  const leftWall = Bodies.rectangle(-50, window.innerHeight / 2, 100, window.innerHeight * 2, wallOptions);
  const rightWall = Bodies.rectangle(window.innerWidth + 50, window.innerHeight / 2, 100, window.innerHeight * 2, wallOptions);

  Composite.add(world, [...shapes, ground, leftWall, rightWall]);



  // Handle Resize
  window.addEventListener('resize', () => {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;
    render.options.width = window.innerWidth;
    render.options.height = window.innerHeight;
    Matter.Body.setPosition(ground, { x: window.innerWidth / 2, y: window.innerHeight + 50 });
    Matter.Body.setPosition(rightWall, { x: window.innerWidth + 50, y: window.innerHeight / 2 });
  });
};

// --- GSAP Setup ---
const setupGSAP = () => {
  // Initial Hero Animations
  gsap.fromTo(".navbar",
    { y: -100, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: "power3.out", force3D: true }
  );

  gsap.fromTo(".hero-title",
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.3, force3D: true }
  );

  gsap.fromTo(".hero-subtitle",
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.6, force3D: true }
  );
  // Ethos Animations
  const ethosTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".ethos-section",
      start: "top 75%",
      toggleActions: "play none none reverse"
    }
  });
  ethosTl.fromTo(".ethos-image-container", { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power3.out", force3D: true })
    .fromTo(".ethos-content > *", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", force3D: true }, "-=0.5")
    .fromTo(".e-feature", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out", force3D: true }, "-=0.2");

  // Excellence Animations
  const excTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".excellence-section",
      start: "top 75%",
      toggleActions: "play none none reverse"
    }
  });
  excTl.fromTo(".excellence-content > *", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", force3D: true })
    .fromTo(".excellence-image-container", { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power3.out", force3D: true }, "-=0.6");

  // Services Animations
  gsap.fromTo(".section-title-center",
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".services-accordion-section", start: "top 80%" }, force3D: true }
  );
  gsap.fromTo(".accordion-item",
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: ".services-accordion-grid", start: "top 80%" }, force3D: true }
  );

  // Gallery Animations
  gsap.fromTo(".gallery-header > *",
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: ".gallery-section", start: "top 80%" }, force3D: true }
  );
  gsap.fromTo(".gal-img-wrapper",
    { y: 50, opacity: 0, scale: 0.95 },
    { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: ".gallery-grid", start: "top 75%" }, force3D: true }
  );

  // Booking Animations
  const bookTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".booking-section",
      start: "top 75%",
      toggleActions: "play none none reverse"
    }
  });
  bookTl.fromTo(".booking-container", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", force3D: true })
    .fromTo(".booking-info > *", { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out", force3D: true }, "-=0.4")
    .fromTo(".booking-form > *", { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out", force3D: true }, "-=0.4");
  // Map Animations
  gsap.fromTo(".map-header > *",
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: ".map-section", start: "top 80%" }, force3D: true }
  );
  gsap.fromTo(".map-container",
    { opacity: 0, scale: 0.98 },
    { opacity: 1, scale: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".map-container", start: "top 80%" }, force3D: true }
  );
  gsap.fromTo(".m-info",
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: ".map-info-bar", start: "top 90%" }, force3D: true }
  );

  // Footer Animations
  gsap.fromTo(".footer-grid > *",
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: ".site-footer", start: "top 90%" }, force3D: true }
  );
};

// --- Navigation Setup ---
const setupNavigation = () => {
  const navLinks = document.querySelectorAll('.nav-pill a');

  // Update on click for smooth feedback
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      navLinks.forEach(n => n.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Automatically update on scroll using ScrollTrigger
  const sections = document.querySelectorAll('section, header, footer');
  sections.forEach(section => {
    const id = section.getAttribute('id');
    if (!id) return;

    ScrollTrigger.create({
      trigger: section,
      start: "top center",
      end: "bottom center",
      onToggle: self => {
        if (self.isActive) {
          navLinks.forEach(n => n.classList.remove('active'));
          const activeLink = document.querySelector(`.nav-pill a[href="#${id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      }
    });
  });
};

// --- Accordion Setup ---
const setupAccordion = () => {
  const headers = document.querySelectorAll('.accordion-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const parent = header.parentElement;
      // Close all other accordions (optional, but requested for clean look)
      document.querySelectorAll('.accordion-item').forEach(item => {
        if (item !== parent) item.classList.remove('open');
      });
      // Toggle the clicked one
      parent.classList.toggle('open');
    });
  });
};

window.addEventListener('load', () => {
  setupMatter();
  setupGSAP();
  setupNavigation();
  setupAccordion();
});
