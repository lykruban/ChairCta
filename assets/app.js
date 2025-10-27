// Three.js background scene
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xf7f7f7, 1);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0xf7f7f7, 0.018);
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 48;

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

const directional = new THREE.DirectionalLight(0xffffff, 0.6);
directional.position.set(20, 30, 10);
scene.add(directional);

const createGear = () => {
  const teeth = 24;
  const innerRadius = 1.2 + Math.random() * 0.6;
  const outerRadius = innerRadius + 0.6;
  const shape = new THREE.Shape();
  const segments = teeth * 2;
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }
  shape.closePath();

  const extrude = new THREE.ExtrudeGeometry(shape, {
    steps: 2,
    depth: 0.8 + Math.random() * 0.4,
    bevelEnabled: true,
    bevelThickness: 0.2,
    bevelSize: 0.05,
    bevelSegments: 2
  });

  const material = new THREE.MeshStandardMaterial({
    color: 0xdedede,
    metalness: 0.85,
    roughness: 0.28,
    emissive: 0x0,
    transparent: true,
    opacity: 0.55
  });

  const gear = new THREE.Mesh(extrude, material);
  gear.position.set(
    (Math.random() - 0.5) * 90,
    (Math.random() - 0.5) * 60,
    (Math.random() - 0.5) * 50
  );
  gear.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  const scale = 2 + Math.random() * 6;
  gear.scale.set(scale, scale, scale);
  return gear;
};

const createBubble = () => {
  const geometry = new THREE.SphereGeometry(1.2 + Math.random() * 1.6, 32, 32);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.3 + Math.random() * 0.25,
    roughness: 0.08,
    transmission: 0.94,
    thickness: 1.6,
    clearcoat: 0.9,
    reflectivity: 0.9
  });
  const bubble = new THREE.Mesh(geometry, material);
  bubble.position.set(
    (Math.random() - 0.5) * 120,
    (Math.random() - 0.5) * 80,
    (Math.random() - 0.5) * 60
  );
  const s = 1 + Math.random() * 4;
  bubble.scale.set(s, s, s);
  return bubble;
};

const gearGroup = new THREE.Group();
const bubbleGroup = new THREE.Group();
scene.add(gearGroup);
scene.add(bubbleGroup);

for (let i = 0; i < 24; i++) {
  gearGroup.add(createGear());
}

for (let i = 0; i < 40; i++) {
  bubbleGroup.add(createBubble());
}

const noise = (x) => {
  return Math.sin(x * 0.3) * 0.5 + Math.sin(x * 0.7) * 0.3;
};

let frame = 0;
const animate = () => {
  requestAnimationFrame(animate);
  frame += 0.01;

  gearGroup.children.forEach((gear, idx) => {
    gear.rotation.x += 0.001 + idx * 0.0002;
    gear.rotation.y += 0.0015 + idx * 0.0002;
    gear.position.y += Math.sin(frame + idx) * 0.005;
  });

  bubbleGroup.children.forEach((bubble, idx) => {
    bubble.position.y += 0.045 + Math.sin(frame + idx) * 0.014;
    bubble.position.x += Math.sin(frame * 0.45 + idx) * 0.012;
    if (bubble.position.y > 65) {
      bubble.position.y = -65;
    }
  });

  camera.position.x = noise(frame) * 8;
  camera.position.y = noise(frame + 2) * 6;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
};

animate();

const onResize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

window.addEventListener('resize', onResize);

// DOM interactions
document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded');

  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  reveals.forEach((el) => observer.observe(el));

  const bookingModal = document.querySelector('.modal');
  const chatbot = document.querySelector('.chatbot');
  const chatbotLog = chatbot.querySelector('.chat-log');
  const openBookingButtons = document.querySelectorAll('[data-booking-open]');
  const openChatButtons = document.querySelectorAll('[data-chat-open]');
  const closeButtons = document.querySelectorAll('[data-close]');
  const siteNav = document.querySelector('nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelectorAll('.nav-links a');

  const openModal = (modal) => {
    modal.classList.add('active');
  };

  const closeModal = (modal) => {
    modal.classList.remove('active');
  };

  openBookingButtons.forEach((btn) =>
    btn.addEventListener('click', () => openModal(bookingModal))
  );

  openChatButtons.forEach((btn) =>
    btn.addEventListener('click', () => openModal(chatbot))
  );

  closeButtons.forEach((btn) =>
    btn.addEventListener('click', () => {
      const target = btn.closest('.modal, .chatbot');
      closeModal(target);
    })
  );

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    navLinks.forEach((link) =>
      link.addEventListener('click', () => {
        if (siteNav.classList.contains('open')) {
          siteNav.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      })
    );

    window.addEventListener('resize', () => {
      if (window.innerWidth > 780 && siteNav.classList.contains('open')) {
        siteNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const appendMessage = (content, sender = 'bot') => {
    const wrapper = document.createElement('div');
    wrapper.className = `chat-message ${sender}`;
    wrapper.innerHTML = `<span>${content}</span>`;
    chatbotLog.appendChild(wrapper);
    chatbotLog.scrollTop = chatbotLog.scrollHeight;
  };

  const showTyping = () => {
    const typing = document.createElement('div');
    typing.className = 'chat-message bot typing';
    typing.innerHTML = '<span><i></i><i></i><i></i></span>';
    chatbotLog.appendChild(typing);
    chatbotLog.scrollTop = chatbotLog.scrollHeight;
    return typing;
  };

  const removeTyping = (node) => {
    if (node && node.parentNode) {
      node.parentNode.removeChild(node);
    }
  };

  appendMessage('Hi, I’m Byron. I can introduce our automations, prepare a call, or just nerd out on AI strategy.', 'bot');
  appendMessage('Need to see how the voice concierge works or want to jump straight to a discovery call?', 'bot');

  setTimeout(() => {
    if (!chatbot.classList.contains('active')) {
      chatbot.classList.add('active');
    }
  }, 5000);

  const chatForm = chatbot.querySelector('form');
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const textarea = chatForm.querySelector('textarea');
    const value = textarea.value.trim();
    if (!value) return;

    appendMessage(value, 'user');
    textarea.value = '';

    const typing = showTyping();

    setTimeout(() => {
      removeTyping(typing);
      appendMessage(
        "Appreciate that! I’ll earmark a strategist and follow up with a calendar invite. Want a quick overview of our launch sprints while you wait?",
        'bot'
      );
    }, 1200);
  });

  const bookingForm = bookingModal.querySelector('form');
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(bookingForm);
    const name = formData.get('name');
    const company = formData.get('company');
    const success = bookingModal.querySelector('.modal-success');
    success.textContent = `Thanks ${name || 'there'}! Our team will call ${company ? company + ' ' : ''}within minutes to align on the perfect slot.`;
    success.classList.add('visible');
    bookingForm.reset();
  });

  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const toggle = item.querySelector('.faq-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      const isOpen = item.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
  });

  const cursor = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;

  const renderCursor = () => {
    cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
    ring.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
  };

  document.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    renderCursor();
  });

  document.addEventListener('pointerdown', () => {
    cursor.classList.add('active');
    ring.classList.add('active');
  });

  document.addEventListener('pointerup', () => {
    cursor.classList.remove('active');
    ring.classList.remove('active');
  });

  const interactiveElements = document.querySelectorAll(
    'a, button, input, textarea, .service-card, .glass-panel, .showcase-card, .insight-card, .timeline-body, .faq-item'
  );
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      ring.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      ring.classList.remove('hover');
    });
  });

  renderCursor();
});
