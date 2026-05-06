// Sticky navbar
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

const overlay = document.createElement('div');
overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:1000;opacity:0;pointer-events:none;transition:opacity .35s ease;';
document.body.appendChild(overlay);

function openNav() {
  navLinks.classList.add('open');
  overlay.style.opacity = '1';
  overlay.style.pointerEvents = 'auto';
  document.body.style.overflow = 'hidden';
}
function closeNav() {
  navLinks.classList.remove('open');
  overlay.style.opacity = '0';
  overlay.style.pointerEvents = 'none';
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => navLinks.classList.contains('open') ? closeNav() : openNav());
overlay.addEventListener('click', closeNav);
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNav));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

// Counter animation
const counters = document.querySelectorAll('.counter');

const animateCounter = (el) => {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const update = () => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current).toLocaleString();
    if (current < target) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counters.forEach(c => observer.observe(c));

// YouTube video modal
const ytModal      = document.getElementById('ytModal');
const ytIframe     = document.getElementById('ytIframe');
const ytModalClose = document.getElementById('ytModalClose');

document.querySelectorAll('.yt-card').forEach(card => {
  card.addEventListener('click', () => {
    const id = card.dataset.videoid;
    if (!id || id.startsWith('VIDEO_ID')) {
      window.open('https://www.youtube.com/@Orthochronicles/videos', '_blank');
      return;
    }
    ytIframe.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    ytModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

if (ytModalClose) {
  ytModalClose.addEventListener('click', closeYtModal);
}
if (ytModal) {
  ytModal.addEventListener('click', (e) => { if (e.target === ytModal) closeYtModal(); });
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeYtModal(); });

function closeYtModal() {
  ytModal.classList.remove('open');
  ytIframe.src = '';
  document.body.style.overflow = '';
}

// Blog submission form — sends to Web3Forms, email stored server-side only
const submissionForm = document.getElementById('submissionForm');
const formSuccess  = document.getElementById('formSuccess');
const submitBtn    = document.getElementById('submitBtn');

if (submissionForm) {
  submissionForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(submissionForm)
      });

      const data = await res.json();

      if (data.success) {
        submissionForm.style.display = 'none';
        formSuccess.style.display = 'block';
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit for Review';
        alert('Something went wrong. Please try again or contact us directly.');
      }
    } catch {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit for Review';
      alert('Network error. Please check your connection and try again.');
    }
  });
}

// Scroll reveal
const revealEls = document.querySelectorAll(
  '.service-card, .highlight, .exp-item, .blog-card, .contact-card'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  revealObserver.observe(el);
});
