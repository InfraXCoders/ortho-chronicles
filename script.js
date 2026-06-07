// Sticky navbar
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

function openNav() {
  navLinks.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeNav() {
  navLinks.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => navLinks.classList.contains('open') ? closeNav() : openNav());
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

/* ============================================================
   MEDIA UPLOAD — Photos & Videos
   ============================================================ */
(function () {
  /* ── helpers ── */
  function fmtSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  /* ────────────────────────────────────────────
     PHOTO DROP ZONE
  ──────────────────────────────────────────── */
  const photoDropZone   = document.getElementById('photoDropZone');
  const photoInput      = document.getElementById('photoInput');
  const previewGrid     = document.getElementById('photoPreviewGrid');
  const dropZoneInner   = document.getElementById('dropZoneInner');

  if (!photoDropZone) return;

  let photoFiles = [];   // track selected photos

  function addPhotos(files) {
    const allowed = ['image/jpeg','image/png','image/gif','image/webp','image/bmp',
                     'image/tiff','image/svg+xml','image/heic','image/heif'];
    Array.from(files).forEach(file => {
      if (photoFiles.length >= 10) { alert('Maximum 10 photos allowed.'); return; }
      if (file.size > 5 * 1024 * 1024) {
        alert(file.name + ' is larger than 5 MB. Please compress or use the cloud link below.');
        return;
      }
      if (!allowed.includes(file.type) && !file.name.match(/\.(jpe?g|png|gif|webp|bmp|tiff?|svg|heic|heif)$/i)) {
        alert(file.name + ' is not a supported image format.'); return;
      }
      photoFiles.push(file);
      renderPhotoThumb(file, photoFiles.length - 1);
    });
    syncPhotoInput();
    if (photoFiles.length > 0) dropZoneInner.style.display = 'none';
  }

  function renderPhotoThumb(file, idx) {
    const wrap = document.createElement('div');
    wrap.className = 'preview-thumb';
    wrap.dataset.idx = idx;

    const isImg = file.type.startsWith('image/') && !file.type.includes('svg');
    if (isImg) {
      const reader = new FileReader();
      reader.onload = e => {
        const img = document.createElement('img');
        img.src = e.target.result;
        wrap.prepend(img);
      };
      reader.readAsDataURL(file);
    } else {
      const ic = document.createElement('div');
      ic.style.cssText = 'display:flex;align-items:center;justify-content:center;height:100%;font-size:1.8rem;color:var(--orange)';
      ic.innerHTML = '<i class="fas fa-image"></i>';
      wrap.appendChild(ic);
    }

    const name = document.createElement('div');
    name.className = 'thumb-name';
    name.textContent = file.name;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'thumb-remove';
    btn.innerHTML = '<i class="fas fa-times"></i>';
    btn.title = 'Remove';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      removePhoto(parseInt(wrap.dataset.idx));
    });

    wrap.appendChild(name);
    wrap.appendChild(btn);
    previewGrid.appendChild(wrap);
  }

  function removePhoto(idx) {
    photoFiles.splice(idx, 1);
    previewGrid.innerHTML = '';
    photoFiles.forEach((f, i) => renderPhotoThumb(f, i));
    syncPhotoInput();
    if (photoFiles.length === 0) dropZoneInner.style.display = 'flex';
  }

  function syncPhotoInput() {
    const dt = new DataTransfer();
    photoFiles.forEach(f => dt.items.add(f));
    photoInput.files = dt.files;
  }

  // Click to browse
  photoDropZone.addEventListener('click', (e) => {
    if (e.target.closest('.thumb-remove') || e.target.closest('.drop-browse')) return;
    if (photoFiles.length < 10) photoInput.click();
  });
  document.querySelector('label[for="photoInput"]').addEventListener('click', (e) => {
    e.stopPropagation(); photoInput.click();
  });
  photoInput.addEventListener('change', () => addPhotos(photoInput.files));

  // Drag & drop
  photoDropZone.addEventListener('dragover',  (e) => { e.preventDefault(); photoDropZone.classList.add('drag-over'); });
  photoDropZone.addEventListener('dragleave', ()  => photoDropZone.classList.remove('drag-over'));
  photoDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    photoDropZone.classList.remove('drag-over');
    addPhotos(e.dataTransfer.files);
  });

  /* ────────────────────────────────────────────
     VIDEO TAB TOGGLE
  ──────────────────────────────────────────── */
  const vtabBtns = document.querySelectorAll('.vtab');
  const panelUpload = document.getElementById('videoPanelUpload');
  const panelLink   = document.getElementById('videoPanelLink');

  vtabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      vtabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (btn.dataset.vtab === 'upload') {
        panelUpload.style.display = 'block';
        panelLink.style.display   = 'none';
      } else {
        panelUpload.style.display = 'none';
        panelLink.style.display   = 'block';
      }
    });
  });

  /* ────────────────────────────────────────────
     VIDEO DROP ZONE
  ──────────────────────────────────────────── */
  const videoDropZone  = document.getElementById('videoDropZone');
  const videoInput     = document.getElementById('videoInput');
  const videoFileList  = document.getElementById('videoFileList');
  const videoDropInner = document.getElementById('videoDropZoneInner');

  let videoFiles = [];

  function addVideos(files) {
    const MAX_SIZE = 100 * 1024 * 1024; // 100 MB
    Array.from(files).forEach(file => {
      if (videoFiles.length >= 3) { alert('Maximum 3 videos allowed.'); return; }
      if (file.size > MAX_SIZE) {
        alert(file.name + ' exceeds 100 MB. Please use the "Share a Link" tab for large videos.');
        return;
      }
      if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|mov|avi|mkv|webm|wmv|flv|3gp|m4v|ts)$/i)) {
        alert(file.name + ' is not a supported video format.'); return;
      }
      videoFiles.push(file);
      renderVideoChip(file, videoFiles.length - 1);
    });
    syncVideoInput();
    if (videoFiles.length > 0) videoDropInner.style.display = 'none';
  }

  function renderVideoChip(file, idx) {
    const chip = document.createElement('div');
    chip.className = 'video-file-chip';
    chip.dataset.idx = idx;

    chip.innerHTML =
      '<div class="vfc-icon"><i class="fas fa-film"></i></div>' +
      '<div class="vfc-info">' +
        '<div class="vfc-name">' + file.name + '</div>' +
        '<div class="vfc-size">' + fmtSize(file.size) + '</div>' +
        '<div class="vfc-bar-wrap"><div class="vfc-bar" style="width:100%"></div></div>' +
      '</div>' +
      '<button type="button" class="vfc-remove" title="Remove"><i class="fas fa-times"></i></button>';

    chip.querySelector('.vfc-remove').addEventListener('click', () => {
      videoFiles.splice(idx, 1);
      videoFileList.innerHTML = '';
      videoFiles.forEach((f, i) => renderVideoChip(f, i));
      syncVideoInput();
      if (videoFiles.length === 0) videoDropInner.style.display = 'flex';
    });

    videoFileList.appendChild(chip);
  }

  function syncVideoInput() {
    const dt = new DataTransfer();
    videoFiles.forEach(f => dt.items.add(f));
    videoInput.files = dt.files;
  }

  videoDropZone.addEventListener('click', (e) => {
    if (e.target.closest('.vfc-remove') || e.target.closest('label')) return;
    if (videoFiles.length < 3) videoInput.click();
  });
  document.querySelector('label[for="videoInput"]').addEventListener('click', (e) => {
    e.stopPropagation(); videoInput.click();
  });
  videoInput.addEventListener('change', () => addVideos(videoInput.files));

  videoDropZone.addEventListener('dragover',  (e) => { e.preventDefault(); videoDropZone.classList.add('drag-over'); });
  videoDropZone.addEventListener('dragleave', ()  => videoDropZone.classList.remove('drag-over'));
  videoDropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    videoDropZone.classList.remove('drag-over');
    addVideos(e.dataTransfer.files);
  });

})();

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
