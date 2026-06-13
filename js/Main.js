document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loaderScreen');
  if (loader) {
    if (sessionStorage.getItem('solovivo-loaded')) {
      loader.style.display = 'none';
    } else {
      setTimeout(() => {
        loader.classList.add('hidden');
        sessionStorage.setItem('solovivo-loaded', 'true');
      }, 1500);
    }
  }
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('ecofarm-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  if (themeToggle) updateThemeIcon(savedTheme);
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('ecofarm-theme', next);
      updateThemeIcon(next);
    });
  }
  function updateThemeIcon(theme) {
    if (themeToggle) themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
  const navbar = document.getElementById('mainNavbar');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (navbar) {
      if (current > 80) {
        navbar.style.padding = '0 2rem';
        navbar.style.height = '60px';
      } else {
        navbar.style.height = '70px';
      }
    }
    lastScroll = current;
  });
  window.toggleMenu = function() {
    const menu = document.getElementById('navMenu');
    const ham  = document.getElementById('hamburger');
    if (menu) {
      menu.classList.toggle('open');
      if (ham) ham.classList.toggle('active');
    }
  };
  document.querySelectorAll('.navbar-menu a').forEach(link => {
    link.addEventListener('click', () => {
      const menu = document.getElementById('navMenu');
      if (menu) menu.classList.remove('open');
    });
  });
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter').forEach(el => {
    counterObserver.observe(el);
  });
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current).toLocaleString('pt-BR');
    }, 16);
  }
  const particlesContainer = document.getElementById('heroParticles');
  if (particlesContainer) createParticles(particlesContainer);
  function createParticles(container) {
    const emojis = ['🌱','🍃','🌿','🌾','💧','☀️','🦋','🐝'];
    const colors = ['rgba(34,197,94,0.3)','rgba(56,189,248,0.25)','rgba(250,204,21,0.2)'];
    for (let i = 0; i < 18; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const isEmoji = Math.random() > 0.5;
      if (isEmoji) {
        particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        particle.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
        particle.style.background = 'transparent';
      } else {
        const size = 4 + Math.random() * 8;
        particle.style.width  = size + 'px';
        particle.style.height = size + 'px';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      }
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (8 + Math.random() * 15) + 's';
      particle.style.animationDelay    = (Math.random() * 10) + 's';
      container.appendChild(particle);
    }
  }
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  const heroEl = document.querySelector('.hero, .hero-video-section');
  if (heroEl) {
    const heroLeft  = heroEl.querySelector('.hero-left');
    const heroRight = heroEl.querySelector('.hero-right');
    if (heroLeft && heroRight) {
      const revObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            heroLeft.classList.add('visible');
            heroRight.classList.add('visible');
          }
        });
      }, { threshold: 0.1 });
      revObs.observe(heroLeft);
    }
  }
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-menu a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  initA11y();
  function initA11y() {
    const a11yBar    = document.getElementById('a11yBar');
    const a11yToggle = document.getElementById('a11yToggle');
    if (!a11yBar || !a11yToggle) return;

    const savedFontSize = parseInt(localStorage.getItem('a11y-fontsize') || '0');
    const savedContrast = localStorage.getItem('a11y-contrast') || '';
    const savedReading  = localStorage.getItem('a11y-reading')  || '';
    applyFontSize(savedFontSize);
    if (savedContrast) html.setAttribute('data-a11y', savedContrast);
    if (savedReading) html.setAttribute('data-reading', savedReading);
    syncA11yButtons(savedFontSize, savedContrast, savedReading);

    a11yToggle.addEventListener('click', () => {
      const isOpen = a11yBar.classList.toggle('open');
      a11yToggle.classList.toggle('active', isOpen);
      a11yToggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!a11yBar.contains(e.target) && !a11yToggle.contains(e.target)) {
        a11yBar.classList.remove('open');
        a11yToggle.classList.remove('active');
        a11yToggle.setAttribute('aria-expanded', 'false');
      }
    });

    const btnFontUp   = document.getElementById('a11yFontUp');
    const btnFontDown = document.getElementById('a11yFontDown');
    const btnFontRst  = document.getElementById('a11yFontRst');
    let fontSize = savedFontSize;

    if (btnFontUp) btnFontUp.addEventListener('click', () => {
      if (fontSize < 2) { fontSize++; applyFontSize(fontSize); localStorage.setItem('a11y-fontsize', fontSize); syncA11yButtons(fontSize, null, null); }
    });
    if (btnFontDown) btnFontDown.addEventListener('click', () => {
      if (fontSize > -1) { fontSize--; applyFontSize(fontSize); localStorage.setItem('a11y-fontsize', fontSize); syncA11yButtons(fontSize, null, null); }
    });
    if (btnFontRst) btnFontRst.addEventListener('click', () => {
      fontSize = 0; applyFontSize(0); localStorage.setItem('a11y-fontsize', '0'); syncA11yButtons(0, null, null);
    });

    const btnHighContrast   = document.getElementById('a11yHighContrast');
    const btnNormalContrast = document.getElementById('a11yNormalContrast');
    if (btnHighContrast) btnHighContrast.addEventListener('click', () => {
      html.setAttribute('data-a11y', 'high-contrast');
      localStorage.setItem('a11y-contrast', 'high-contrast');
      syncA11yButtons(null, 'high-contrast', null);
    });
    if (btnNormalContrast) btnNormalContrast.addEventListener('click', () => {
      html.removeAttribute('data-a11y');
      localStorage.setItem('a11y-contrast', '');
      syncA11yButtons(null, '', null);
    });

    const btnReading    = document.getElementById('a11yReading');
    const btnReadingOff = document.getElementById('a11yReadingOff');
    if (btnReading) btnReading.addEventListener('click', () => {
      html.setAttribute('data-reading', 'sepia');
      localStorage.setItem('a11y-reading', 'sepia');
      syncA11yButtons(null, null, 'sepia');
    });
    if (btnReadingOff) btnReadingOff.addEventListener('click', () => {
      html.removeAttribute('data-reading');
      localStorage.setItem('a11y-reading', '');
      syncA11yButtons(null, null, '');
    });

  }

  function applyFontSize(level) {
    const sizes = { '-1': '15px', '0': '17px', '1': '19px', '2': '21px' };
    document.documentElement.style.fontSize = sizes[String(level)] || '17px';
  }

  function syncA11yButtons(fontLevel, contrast, reading) {
    if (fontLevel !== null) {
      const up = document.getElementById('a11yFontUp');
      const dn = document.getElementById('a11yFontDown');
      if (up) up.classList.toggle('active', fontLevel >= 2);
      if (dn) dn.classList.toggle('active', fontLevel <= -1);
    }
    if (contrast !== null) {
      const hc = document.getElementById('a11yHighContrast');
      const nc = document.getElementById('a11yNormalContrast');
      if (hc) hc.classList.toggle('active', contrast === 'high-contrast');
      if (nc) nc.classList.toggle('active', contrast === '');
    }
    if (reading !== null) {
      const rd  = document.getElementById('a11yReading');
      const rdo = document.getElementById('a11yReadingOff');
      if (rd)  rd.classList.toggle('active', reading === 'sepia');
      if (rdo) rdo.classList.toggle('active', reading === '');
    }
  }
});
