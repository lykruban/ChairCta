// Three.js background scene
const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
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
    color: 0xf5f5f5,
    metalness: 0.9,
    roughness: 0.35,
    transparent: true,
    opacity: 0.4
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
    opacity: 0.22 + Math.random() * 0.2,
    roughness: 0.05,
    transmission: 0.9,
    thickness: 0.8,
    clearcoat: 0.9
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

for (let i = 0; i < 18; i++) {
  gearGroup.add(createGear());
}

for (let i = 0; i < 28; i++) {
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
    bubble.position.y += 0.03 + Math.sin(frame + idx) * 0.012;
    bubble.position.x += Math.sin(frame * 0.4 + idx) * 0.01;
    if (bubble.position.y > 50) {
      bubble.position.y = -50;
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
  const openBookingButtons = document.querySelectorAll('[data-booking-open]');
  const openChatButtons = document.querySelectorAll('[data-chat-open]');
  const closeButtons = document.querySelectorAll('[data-close]');

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

  setTimeout(() => {
    if (!chatbot.classList.contains('active')) {
      chatbot.classList.add('active');
      const log = chatbot.querySelector('.chat-log');
      const message = document.createElement('div');
      message.className = 'chat-message';
      message.innerHTML =
        "Hey there! I'm Byron, your AI concierge. Want me to orchestrate a discovery call or walk you through our capabilities?";
      log.appendChild(message);
      log.scrollTop = log.scrollHeight;
    }
  }, 5000);

  const chatForm = chatbot.querySelector('form');
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const textarea = chatForm.querySelector('textarea');
    const value = textarea.value.trim();
    if (!value) return;

    const log = chatbot.querySelector('.chat-log');
    const userMessage = document.createElement('div');
    userMessage.className = 'chat-message';
    userMessage.textContent = value;
    log.appendChild(userMessage);
    textarea.value = '';
    log.scrollTop = log.scrollHeight;

    setTimeout(() => {
      const reply = document.createElement('div');
      reply.className = 'chat-message';
      reply.innerHTML =
        "Thanks! I've locked that in. Expect an invite shortly — or I can loop in our automation strategist if you'd like a deeper dive.";
      log.appendChild(reply);
      log.scrollTop = log.scrollHeight;
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
});
