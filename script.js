/* ============================================================
   LexPrep – script.js
   Sidebar navigation, tab switching, copy-to-clipboard
   ============================================================ */

/* ===== SIDEBAR & HAMBURGER ===== */
const sidebar   = document.getElementById('sidebar');
const hamburger = document.getElementById('hamburger');

hamburger.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 768) {
    if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  }
});

/* ===== ACTIVE NAV ITEM (scroll-based) ===== */
const sections  = document.querySelectorAll('.content-section, .hero');
const navItems  = document.querySelectorAll('.nav-item');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === id) {
          item.classList.add('active');
        }
      });
    }
  });
}, { rootMargin: '-30% 0px -60% 0px' });

sections.forEach(sec => observer.observe(sec));

/* ===== SMOOTH SCROLL FOR NAV LINKS ===== */
navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = item.getAttribute('data-section');
    const target   = document.getElementById(targetId);
    if (target) {
      const offset = 20;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    if (window.innerWidth <= 768) {
      sidebar.classList.remove('open');
    }
  });
});

/* ===== CODE TABS (Q2 Full / Shortcut) ===== */
const tabBtns    = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    const target = document.getElementById(btn.dataset.tab);
    if (target) target.classList.add('active');
  });
});

/* ===== COPY TO CLIPBOARD ===== */
const toast = document.getElementById('toast');

function showToast() {
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    const block    = document.getElementById(targetId);
    if (!block) return;

    // Get plain text (strip HTML tags)
    const text = block.innerText || block.textContent;
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = '✓ Copied';
      setTimeout(() => (btn.textContent = 'Copy'), 2000);
      showToast();
    }).catch(() => {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity  = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      btn.textContent = '✓ Copied';
      setTimeout(() => (btn.textContent = 'Copy'), 2000);
      showToast();
    });
  });
});

/* ===== HERO INTRO ANIMATION ===== */
const hero = document.querySelector('.hero-content');
if (hero) {
  hero.style.opacity = '0';
  hero.style.transform = 'translateY(20px)';
  hero.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
  requestAnimationFrame(() => {
    setTimeout(() => {
      hero.style.opacity = '1';
      hero.style.transform = 'translateY(0)';
    }, 100);
  });
}

/* ===== CARD ENTRANCE ANIMATIONS ===== */
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.animationDelay = `${i * 0.05}s`;
      entry.target.classList.add('animate-in');
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.info-card, .step-card, .token-card, .exp-card, .fc-step, .fa-item'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  cardObserver.observe(el);
});

// Inject animate-in styles dynamically
const styleEl = document.createElement('style');
styleEl.textContent = `
  .animate-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(styleEl);

/* ===== ACTIVE SECTION HIGHLIGHT ON HERO TERMINAL ===== */
// Auto-type animation already in CSS, this just ensures the terminal
// is always visible with proper overflow handling
const heroTerm = document.querySelector('.hero-terminal');
if (heroTerm) {
  heroTerm.addEventListener('mouseenter', () => {
    heroTerm.style.boxShadow =
      '0 8px 48px rgba(0,0,0,0.6), 0 0 60px rgba(56,189,248,0.15)';
  });
  heroTerm.addEventListener('mouseleave', () => {
    heroTerm.style.boxShadow =
      '0 8px 48px rgba(0,0,0,0.6), 0 0 40px rgba(56,189,248,0.08)';
  });
}
