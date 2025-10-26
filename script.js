const navMenuButton = document.querySelector('.nav__menu');
const navLinks = document.querySelector('.nav__links');
const yearEl = document.getElementById('year');
const scrollIndicator = document.querySelector('.scroll-indicator');
const tiltElements = Array.from(document.querySelectorAll('[data-tilt]'));
const canvas = document.getElementById('particleCanvas');
const bookTriggers = document.querySelectorAll('.book-trigger');
const bookModal = document.querySelector('.book-modal');
const bookModalClose = document.querySelectorAll('[data-modal-close]');
const chat = document.querySelector('[data-chat]');
const chatLaunchers = document.querySelectorAll('[data-chat-open]');
const chatCloser = document.querySelector('[data-chat-close]');
const chatForm = document.querySelector('[data-chat-form]');
const chatLog = document.querySelector('[data-chat-log]');
const counters = document.querySelectorAll('[data-count]');
const bookingForm = document.querySelector('.book-modal__form');

const setChatExpanded = (open) => {
  chatLaunchers.forEach((launcher) => launcher.setAttribute('aria-expanded', open ? 'true' : 'false'));
};

setChatExpanded(false);

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (navMenuButton && navLinks) {
  navMenuButton.addEventListener('click', () => {
    const expanded = navLinks.classList.toggle('nav__links--open');
    navMenuButton.setAttribute('aria-expanded', expanded);
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('nav__links--open');
      navMenuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 120;
  const depth = 160;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  class Particle {
    constructor() {
      this.reset();
      this.z = Math.random() * depth;
    }
    reset() {
      this.x = (Math.random() - 0.5) * canvas.width * 1.6;
      this.y = (Math.random() - 0.5) * canvas.height * 1.6;
      this.z = Math.random() * depth;
      this.size = Math.random() * 2.5 + 0.2;
    }
    update(mouse) {
      this.z -= 0.6;
      if (this.z <= 0) {
        this.reset();
        this.z = depth;
      }

      const perspective = depth / this.z;
      const x = canvas.width / 2 + this.x * perspective;
      const y = canvas.height / 2 + this.y * perspective;

      const dx = mouse.x - x;
      const dy = mouse.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;
      const repelForce = Math.min(60 / distance, 1.8);

      return { x, y, radius: this.size * perspective + repelForce };
    }
  }

  const initParticles = () => {
    particles = new Array(particleCount).fill(null).map(() => new Particle());
  };

  let mouse = { x: canvas.width / 2, y: canvas.height / 2 };

  window.addEventListener('mousemove', (event) => {
    mouse = { x: event.clientX, y: event.clientY };
  });

  window.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];
    mouse = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });

  const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';

    particles.forEach((particle) => {
      const { x, y, radius } = particle.update(mouse);
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(render);
  };

  resize();
  initParticles();
  render();

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });
}

const handleTilt = (event) => {
  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const rotateX = ((y - centerY) / centerY) * -6;
  const rotateY = ((x - centerX) / centerX) * 6;

  element.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px)`;
};

const resetTilt = (event) => {
  event.currentTarget.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)';
};

tiltElements.forEach((element) => {
  element.addEventListener('mousemove', handleTilt);
  element.addEventListener('mouseleave', resetTilt);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.vision__card, .service, .timeline__item, .contact__card, .metrics__card, .story__card').forEach((element) => {
  element.classList.add('pre-animate');
  observer.observe(element);
});

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10);
    const duration = 1600;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * target);
      el.textContent = value.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    };

    requestAnimationFrame(step);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

counters.forEach((counter) => counterObserver.observe(counter));

window.addEventListener('scroll', () => {
  if (!scrollIndicator) return;
  const hide = window.scrollY > window.innerHeight * 0.6;
  scrollIndicator.style.opacity = hide ? '0' : '0.75';
  scrollIndicator.style.pointerEvents = hide ? 'none' : 'auto';
});

let lastKnownScroll = 0;
let ticking = false;
const parallaxElements = document.querySelectorAll('.bg-layer');

const parallax = (scrollPos) => {
  parallaxElements.forEach((layer, index) => {
    const depth = (index + 1) * 18;
    layer.style.setProperty('--scroll-y', `${scrollPos / depth}px`);
  });
};

window.addEventListener('scroll', () => {
  lastKnownScroll = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(() => {
      parallax(lastKnownScroll);
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

const toggleBookModal = (show) => {
  if (!bookModal) return;
  bookModal.setAttribute('aria-hidden', show ? 'false' : 'true');
  bookModal.classList.toggle('book-modal--open', show);
  document.body.classList.toggle('no-scroll', show);
  if (show) {
    bookingForm?.reset();
    const existingConfirmation = bookModal.querySelector('.book-modal__confirmation');
    existingConfirmation?.remove();
    const submitButton = bookingForm?.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Have Byron Call Me';
    }
    const focusable = bookModal.querySelector('input, textarea');
    focusable?.focus({ preventScroll: true });
  }
};

bookTriggers.forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    toggleBookModal(true);
  });
});

bookModalClose.forEach((close) => {
  close.addEventListener('click', () => toggleBookModal(false));
});

bookModal?.addEventListener('click', (event) => {
  if (event.target === bookModal) {
    toggleBookModal(false);
  }
});

bookingForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const button = bookingForm.querySelector('button[type="submit"]');
  if (button) {
    button.textContent = 'Byron will call shortly';
    button.disabled = true;
  }
  const confirmation = document.createElement('p');
  confirmation.className = 'book-modal__confirmation';
  confirmation.textContent = 'Thanks! Byron is preparing a call with your team.';
  bookingForm.appendChild(confirmation);
  setTimeout(() => toggleBookModal(false), 1200);
});

chatLaunchers.forEach((launcher) => {
  launcher.addEventListener('click', () => {
    if (!chat) return;
    chat.setAttribute('aria-hidden', 'false');
    chat.classList.add('chat--open');
    document.body.classList.add('no-scroll-chat');
    chat.querySelector('input')?.focus({ preventScroll: true });
    setChatExpanded(true);
  });
});

chatCloser?.addEventListener('click', () => {
  if (!chat) return;
  chat.setAttribute('aria-hidden', 'true');
  chat.classList.remove('chat--open');
  document.body.classList.remove('no-scroll-chat');
  setChatExpanded(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  toggleBookModal(false);
  if (chat?.classList.contains('chat--open')) {
    chat.setAttribute('aria-hidden', 'true');
    chat.classList.remove('chat--open');
    document.body.classList.remove('no-scroll-chat');
    setChatExpanded(false);
  }
});

const byronReplies = [
  'I can queue a voice agent prototype for you. Would you like to hear a sample call script?',
  'Need help syncing your CRM and calendar? I can dispatch a workflow map in minutes.',
  'Curious about our RAG guardrails? I can highlight compliance-ready patterns and citations.',
  'Ready to book time? Drop your preferred window and I’ll have our AI call you back instantly.'
];

const sendMessage = (content, type = 'visitor') => {
  if (!chatLog) return;
  const message = document.createElement('div');
  message.className = `chat__message chat__message--${type}`;
  message.innerHTML = `<p>${content}</p>`;
  chatLog.appendChild(message);
  chatLog.scrollTop = chatLog.scrollHeight;
};

chatForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = chatForm.querySelector('input');
  if (!input || !input.value.trim()) return;
  const userMessage = input.value.trim();
  sendMessage(userMessage, 'visitor');
  input.value = '';

  setTimeout(() => {
    const reply = byronReplies[Math.floor(Math.random() * byronReplies.length)];
    sendMessage(reply, 'byron');
  }, 500 + Math.random() * 700);
});
