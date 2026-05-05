// Sticky navbar
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

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

// Blog submission form
const submissionForm = document.getElementById('submissionForm');
const formSuccess = document.getElementById('formSuccess');

if (submissionForm) {
  submissionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submissionForm.style.display = 'none';
    formSuccess.style.display = 'block';
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
