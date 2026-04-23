/* =============================================
   script.js – Wedding Invitation Interactions
   ============================================= */

/* ---- PETALS ---- */
(function createPetals() {
  const container = document.getElementById('petals');
  const colors = ['#f2c4ce', '#f9dde5', '#fce8dc', '#f7e3f0', '#e8d5f0', '#d5e8f0'];
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    const size = Math.random() * 10 + 6;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 12 + 10}s;
      animation-delay: ${Math.random() * -20}s;
    `;
    container.appendChild(p);
  }
})();

/* ---- ENVELOPE LOGIC ---- */
const envelopeOverlay = document.getElementById('envelopeOverlay');
const openEnvelopeBtn = document.getElementById('openEnvelopeBtn');

if (envelopeOverlay && openEnvelopeBtn) {
  // Prevent scrolling while envelope is active
  document.body.style.overflow = 'hidden';

  openEnvelopeBtn.addEventListener('click', () => {
    envelopeOverlay.classList.add('opened');
    setTimeout(() => {
      envelopeOverlay.style.display = 'none';
      document.body.style.overflow = '';
      
      // Trigger music play here if not already playing
      if (typeof bgMusic !== 'undefined' && bgMusic.paused) {
        bgMusic.play().then(() => {
          if (typeof isPlaying !== 'undefined') isPlaying = true;
          const toggle = document.getElementById('musicToggle');
          if (toggle) {
            toggle.classList.add('playing');
            toggle.title = 'Tắt nhạc nền';
            const mOn = toggle.querySelector('.music-on');
            const mOff = toggle.querySelector('.music-off');
            if (mOn) mOn.style.display = 'block';
            if (mOff) mOff.style.display = 'none';
          }
        }).catch(err => console.log(err));
      }

      // Auto-scroll functionality
      setTimeout(() => {
        let isAutoScrolling = true;

        const stopAutoScroll = () => { isAutoScrolling = false; };
        // Stop scrolling when user interacts
        window.addEventListener('wheel', stopAutoScroll, { passive: true });
        window.addEventListener('touchmove', stopAutoScroll, { passive: true });
        window.addEventListener('mousedown', stopAutoScroll, { passive: true });
        window.addEventListener('keydown', stopAutoScroll, { passive: true });

        const step = () => {
          if (!isAutoScrolling) return;
          // Stop if reached the bottom
          if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) {
            isAutoScrolling = false;
            return;
          }
          window.scrollBy(0, 3); // Tốc độ chạy tự động (tăng lên 3 để nhanh hơn)
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }, 1000); // Delay 1s after envelope fades to start scrolling

    }, 2500); // match new CSS 3D envelope animation duration
  });
}

/* ---- COUNTDOWN ---- */
const weddingDate = new Date('2026-05-02T18:00:00+07:00');

function updateCountdown() {
  const now = new Date();
  let diff = weddingDate - now;
  if (diff <= 0) {
    document.getElementById('cDays').textContent = '00';
    document.getElementById('cHours').textContent = '00';
    document.getElementById('cMins').textContent = '00';
    document.getElementById('cSecs').textContent = '00';
    return;
  }
  const days = Math.floor(diff / 86400000);
  diff %= 86400000;
  const hours = Math.floor(diff / 3600000);
  diff %= 3600000;
  const mins = Math.floor(diff / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  document.getElementById('cDays').textContent = String(days).padStart(2, '0');
  document.getElementById('cHours').textContent = String(hours).padStart(2, '0');
  document.getElementById('cMins').textContent = String(mins).padStart(2, '0');
  document.getElementById('cSecs').textContent = String(secs).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ---- SCROLL REVEAL ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('revealed');
      }, idx * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---- PARALLAX HERO ---- */
const heroBg = document.getElementById('heroBg');
const quoteBg = document.getElementById('quoteBg');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (heroBg) heroBg.style.transform = `translateY(${y * 0.3}px)`;
}, { passive: true });

/* ---- GALLERY LIGHTBOX ---- */
const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxCounter = document.getElementById('lightboxCounter');

let currentLightboxIdx = 0;

const images = galleryItems.map(item => ({
  src: item.querySelector('img').src,
  alt: item.querySelector('img').alt
}));

function openLightbox(idx) {
  currentLightboxIdx = idx;
  showLightboxImage();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function showLightboxImage() {
  const img = images[currentLightboxIdx];
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCounter.textContent = `${currentLightboxIdx + 1} / ${images.length}`;
}

function prevImage() {
  currentLightboxIdx = (currentLightboxIdx - 1 + images.length) % images.length;
  showLightboxImage();
}

function nextImage() {
  currentLightboxIdx = (currentLightboxIdx + 1) % images.length;
  showLightboxImage();
}

galleryItems.forEach((item, idx) => {
  item.addEventListener('click', () => openLightbox(idx));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', prevImage);
lightboxNext.addEventListener('click', nextImage);

// Close on backdrop click
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') prevImage();
  if (e.key === 'ArrowRight') nextImage();
});

// Touch swipe for lightbox
let touchStartX = 0;
lightbox.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });
lightbox.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 40) { diff > 0 ? nextImage() : prevImage(); }
}, { passive: true });

/* ---- RSVP FORM ---- */
const rsvpForm = document.getElementById('rsvpForm');
const rsvpSuccess = document.getElementById('rsvpSuccess');
const rsvpSubmit = document.getElementById('rsvpSubmit');
const guestCount = document.getElementById('guestCount');
const guestCountGroup = document.getElementById('guestCountGroup');
const attendYes = document.getElementById('attendYes');
const attendNo = document.getElementById('attendNo');

// Show/hide guest count based on attending
function updateGuestCountVisibility() {
  if (attendNo.checked) {
    guestCountGroup.style.opacity = '0.4';
    guestCountGroup.style.pointerEvents = 'none';
  } else {
    guestCountGroup.style.opacity = '1';
    guestCountGroup.style.pointerEvents = 'auto';
  }
}
attendYes.addEventListener('change', updateGuestCountVisibility);
attendNo.addEventListener('change', updateGuestCountVisibility);

// Number buttons
document.getElementById('increaseCount').addEventListener('click', () => {
  const v = parseInt(guestCount.value);
  if (v < 10) guestCount.value = v + 1;
});
document.getElementById('decreaseCount').addEventListener('click', () => {
  const v = parseInt(guestCount.value);
  if (v > 1) guestCount.value = v - 1;
});

// Form submission
rsvpForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  let valid = true;

  const nameInput = document.getElementById('guestName');
  const errName = document.getElementById('errName');
  const errAttend = document.getElementById('errAttend');
  const attending = document.querySelector('input[name="attending"]:checked');

  errName.textContent = '';
  errAttend.textContent = '';
  nameInput.classList.remove('error');

  if (!nameInput.value.trim()) {
    errName.textContent = 'Vui lòng nhập họ và tên.';
    nameInput.classList.add('error');
    valid = false;
  }

  if (!attending) {
    errAttend.textContent = 'Vui lòng chọn một lựa chọn.';
    valid = false;
  }

  if (!valid) return;

  // Build wish data
  const wishData = {
    name: nameInput.value.trim(),
    phone: document.getElementById('guestPhone').value.trim(),
    attending: attending.value,
    guestCount: parseInt(guestCount.value) || 1,
    message: document.getElementById('message').value.trim()
  };

  // Submit to server
  rsvpSubmit.disabled = true;
  rsvpSubmit.textContent = 'Đang xử lý…';

  try {
    const res = await fetch('/api/wishes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wishData)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Gửi lời chúc thất bại.');
    }

    rsvpForm.style.display = 'none';
    rsvpSuccess.classList.add('active');

    // Re-render wishes from server
    await renderWishes();

    // Scroll to success message, then after a pause, scroll to wishes
    rsvpSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      const wishesSection = document.getElementById('wishesSection');
      if (wishesSection) {
        wishesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 1500);
  } catch (error) {
    console.error('Lỗi gửi lời chúc:', error);
    alert('Có lỗi xảy ra, vui lòng thử lại!');
    rsvpSubmit.disabled = false;
    rsvpSubmit.textContent = 'Gửi Lời Chúc';
  }
});

/* ---- WISHES WALL ---- */
const AVATAR_COLORS = [
  'linear-gradient(135deg, #d4a0a0 0%, #c48b8b 100%)',
  'linear-gradient(135deg, #c9a96e 0%, #d4b896 100%)',
  'linear-gradient(135deg, #a8b8a0 0%, #849c78 100%)',
  'linear-gradient(135deg, #6b8fa8 0%, #bcd4e6 100%)',
  'linear-gradient(135deg, #b08dab 0%, #d4b8d0 100%)',
  'linear-gradient(135deg, #d4b896 0%, #e8c8a0 100%)',
  'linear-gradient(135deg, #8fa8c4 0%, #a8c0d8 100%)',
  'linear-gradient(135deg, #c4a08f 0%, #d8b8a8 100%)',
];

async function getWishes() {
  try {
    const res = await fetch('/api/wishes');
    if (!res.ok) throw new Error('Failed to fetch wishes');
    return await res.json();
  } catch (error) {
    console.error('Lỗi tải lời chúc:', error);
    return [];
  }
}

function getInitials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function formatTime(isoStr) {
  const d = new Date(isoStr);
  const now = new Date();
  const diff = now - d;

  if (diff < 60000) return 'Vừa xong';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} ngày trước`;

  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function createWishCard(wish, index) {
  const colorIdx = wish.id ? (wish.id % AVATAR_COLORS.length) : (index % AVATAR_COLORS.length);
  const initials = getInitials(wish.name);
  const isAttending = wish.attending === 'yes';

  const card = document.createElement('div');
  card.className = 'wish-card';
  card.style.animationDelay = `${index * 80}ms`;

  let html = `
    <div class="wish-header">
      <div class="wish-avatar" style="background: ${AVATAR_COLORS[colorIdx]}">
        ${escapeHTML(initials)}
      </div>
      <div class="wish-meta">
        <span class="wish-name">${escapeHTML(wish.name)}</span>
        <span class="wish-time">${formatTime(wish.timestamp)}</span>
      </div>
      <span class="wish-badge ${isAttending ? 'wish-badge-yes' : 'wish-badge-no'}">
        ${isAttending
      ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> Tham dự'
      : '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Vắng mặt'
    }
      </span>
    </div>
  `;

  if (wish.message) {
    html += `<p class="wish-message">"${escapeHTML(wish.message)}"</p>`;
  }

  if (isAttending && wish.guestCount > 0) {
    html += `
      <div class="wish-guests">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        ${wish.guestCount} ${wish.guestCount === 1 ? 'người' : 'người'} tham dự
      </div>
    `;
  }

  card.innerHTML = html;
  return card;
}

async function renderWishes() {
  const wishes = await getWishes();
  const grid = document.getElementById('wishesGrid');
  const empty = document.getElementById('wishesEmpty');
  const countEl = document.getElementById('wishesCount');
  const section = document.getElementById('wishesSection');

  if (!grid || !section) return;

  grid.innerHTML = '';

  if (wishes.length === 0) {
    empty.style.display = 'flex';
    grid.style.display = 'none';
    countEl.textContent = '';
    return;
  }

  empty.style.display = 'none';
  grid.style.display = 'grid';

  const attendingCount = wishes.filter(w => w.attending === 'yes').length;
  const totalGuests = wishes.filter(w => w.attending === 'yes').reduce((s, w) => s + (w.guestCount || 1), 0);

  countEl.innerHTML = `
    <strong>${wishes.length}</strong> lời chúc · 
    <strong>${attendingCount}</strong> xác nhận tham dự · 
    <strong>${totalGuests}</strong> khách
  `;

  wishes.forEach((wish, i) => {
    grid.appendChild(createWishCard(wish, i));
  });

  // Re-observe reveal for the section header
  const header = section.querySelector('.section-header');
  if (header && !header.classList.contains('revealed')) {
    revealObserver.observe(header);
  }
}

// Render wishes on page load
renderWishes();

/* ---- MUSIC TOGGLE ---- */
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
const musicOnIcon = musicToggle.querySelector('.music-on');
const musicOffIcon = musicToggle.querySelector('.music-off');
let isPlaying = false;

// Set comfortable background volume
bgMusic.volume = 0.4;

musicToggle.addEventListener('click', () => {
  if (isPlaying) {
    bgMusic.pause();
    isPlaying = false;
    musicToggle.classList.remove('playing');
    musicToggle.title = 'Bật nhạc nền';
    musicOnIcon.style.display = 'none';
    musicOffIcon.style.display = 'block';
  } else {
    bgMusic.play().then(() => {
      isPlaying = true;
      musicToggle.classList.add('playing');
      musicToggle.title = 'Tắt nhạc nền';
      musicOnIcon.style.display = 'block';
      musicOffIcon.style.display = 'none';
    }).catch(err => {
      console.log('Trình duyệt chặn autoplay, cần tương tác trước:', err);
    });
  }
});

// Tự động phát nhạc khi có tương tác đầu tiên
function initAutoPlay() {
  const tryPlayMusic = () => {
    if (!isPlaying) {
      bgMusic.play().then(() => {
        isPlaying = true;
        musicToggle.classList.add('playing');
        musicToggle.title = 'Tắt nhạc nền';
        musicOnIcon.style.display = 'block';
        musicOffIcon.style.display = 'none';
        
        document.removeEventListener('click', tryPlayMusic);
        document.removeEventListener('scroll', tryPlayMusic);
        document.removeEventListener('touchstart', tryPlayMusic);
      }).catch(err => {
        // Trình duyệt chặn, đợi event
      });
    }
  };

  tryPlayMusic();

  document.addEventListener('click', tryPlayMusic, { once: true });
  document.addEventListener('scroll', tryPlayMusic, { once: true, passive: true });
  document.addEventListener('touchstart', tryPlayMusic, { once: true, passive: true });
}

window.addEventListener('DOMContentLoaded', initAutoPlay);

/* ---- SMOOTH SCROLL FOR NAV LINKS ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  });
});

/* ---- STAGGER REVEAL FOR GALLERY ---- */
document.querySelectorAll('.gallery-item').forEach((el, i) => {
  el.style.transitionDelay = `${i * 60}ms`;
});

/* ---- DECORATIVE PARALLAX FOR QUOTE ---- */
if (quoteBg) {
  const quoteSection = document.getElementById('quote');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        window.addEventListener('scroll', paralaxQuote, { passive: true });
      } else {
        window.removeEventListener('scroll', paralaxQuote);
      }
    });
  }, { threshold: 0 });

  function paralaxQuote() {
    const rect = quoteSection.getBoundingClientRect();
    const progress = -rect.top / (window.innerHeight + rect.height);
    quoteBg.style.transform = `translateY(${progress * 60}px)`;
  }

  if (quoteSection) observer.observe(quoteSection);
}

/* ---- TIMELINE REVEAL WITH DIRECTION ---- */
document.querySelectorAll('.timeline-item').forEach((item, i) => {
  const isLeft = item.classList.contains('left');
  item.querySelector('.timeline-content').style.setProperty('--init-x', isLeft ? '40px' : '-40px');
});

/* ---- INIT ---- */
console.log('Wedding Template — Ready');

