import './style.css';
import Matter from 'matter-js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

  // Add bodies
  const shapes = [];
  const colors = ['#00A19B', '#FFFFFF', '#1A2226', '#E4DDD3']; // Mint, White, Dark, Latte
  
  for (let i = 0; i < 40; i++) {
    const radius = Math.random() * 30 + 15;
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight * -1; // Start above screen
    
    let body;
    if (Math.random() > 0.5) {
      body = Bodies.circle(x, y, radius, {
        render: { fillStyle: colors[Math.floor(Math.random() * colors.length)] },
        restitution: 0.9,
        frictionAir: 0.01,
        friction: 0.1
      });
    } else {
      body = Bodies.rectangle(x, y, radius * 1.5, radius * 1.5, {
        render: { fillStyle: colors[Math.floor(Math.random() * colors.length)] },
        chamfer: { radius: radius * 0.4 }, // rounded corners
        restitution: 0.8,
        frictionAir: 0.02,
        friction: 0.1
      });
    }
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
    { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
  );

  gsap.fromTo(".hero-title", 
    { y: 50, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.3 }
  );

  gsap.fromTo(".hero-subtitle", 
    { y: 30, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", delay: 0.6 }
  );
  // Ethos Animations
  const ethosTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".ethos-section",
      start: "top 75%",
      toggleActions: "play none none reverse"
    }
  });
  ethosTl.fromTo(".ethos-image-container", { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power3.out" })
         .fromTo(".ethos-content > *", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "-=0.5")
         .fromTo(".e-feature", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }, "-=0.2");

  // Excellence Animations
  const excTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".excellence-section",
      start: "top 75%",
      toggleActions: "play none none reverse"
    }
  });
  excTl.fromTo(".excellence-content > *", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" })
       .fromTo(".excellence-image-container", { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.6");

  // Services Animations
  gsap.fromTo(".section-title-center", 
    { y: 30, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".services-accordion-section", start: "top 80%" } }
  );
  gsap.fromTo(".accordion-item",
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: ".services-accordion-grid", start: "top 80%" } }
  );

  // Gallery Animations
  gsap.fromTo(".gallery-header > *",
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: ".gallery-section", start: "top 80%" } }
  );
  gsap.fromTo(".gal-img-wrapper",
    { y: 50, opacity: 0, scale: 0.95 },
    { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: ".gallery-grid", start: "top 75%" } }
  );

  // Booking Animations
  const bookTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".booking-section",
      start: "top 75%",
      toggleActions: "play none none reverse"
    }
  });
  bookTl.fromTo(".booking-container", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out" })
        .fromTo(".booking-info > *", { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }, "-=0.4")
        .fromTo(".booking-form > *", { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }, "-=0.4");
  // Map Animations
  gsap.fromTo(".map-header > *",
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: ".map-section", start: "top 80%" } }
  );
  gsap.fromTo(".map-container",
    { opacity: 0, scale: 0.98 },
    { opacity: 1, scale: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".map-container", start: "top 80%" } }
  );
  gsap.fromTo(".m-info",
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: ".map-info-bar", start: "top 90%" } }
  );

  // Footer Animations
  gsap.fromTo(".footer-grid > *",
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: ".site-footer", start: "top 90%" } }
  );
};

// --- Navigation Setup ---
const setupNavigation = () => {
  const navLinks = document.querySelectorAll('.nav-pill a');
  
  // Update on click for smooth feedback
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
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
