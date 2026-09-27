/**
 * Bezawada Car Rentals - Interactive Client Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initDateDefaults();
  initMobileDrawer();
  initHubsModal();
  initStatsHighlightCycle();
});

/**
 * Set default pickup (today) and drop-off dates (tomorrow)
 */
function initDateDefaults() {
  const pickupInput = document.getElementById('pickupDate');
  const dropInput = document.getElementById('dropDate');

  if (!pickupInput || !dropInput) return;

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const minDateStr = formatDate(today);
  pickupInput.min = minDateStr;
  pickupInput.value = minDateStr;

  dropInput.min = minDateStr;
  dropInput.value = formatDate(tomorrow);

  // When pickup date changes, ensure drop date is not before it
  pickupInput.addEventListener('change', () => {
    if (pickupInput.value) {
      dropInput.min = pickupInput.value;
      if (dropInput.value < pickupInput.value) {
        dropInput.value = pickupInput.value;
      }
    }
  });
}

/**
 * Mobile Drawer Menu toggle
 */
function initMobileDrawer() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const closeBtn = document.getElementById('drawerCloseBtn');

  if (!menuBtn || !drawer || !closeBtn) return;

  const openDrawer = () => drawer.classList.add('active');
  const closeDrawer = () => drawer.classList.remove('active');

  menuBtn.addEventListener('click', openDrawer);
  closeBtn.addEventListener('click', closeDrawer);

  drawer.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('active') && !drawer.contains(e.target) && !menuBtn.contains(e.target)) {
      closeDrawer();
    }
  });
}

/**
 * Hubs Modal interactions
 */
function initHubsModal() {
  const cityBtn = document.getElementById('cityDropdownBtn');
  const modal = document.getElementById('cityModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const locationSelect = document.getElementById('pickupLocation');

  if (!cityBtn || !modal || !closeBtn) return;

  const openModal = () => modal.classList.add('active');
  const closeModal = () => modal.classList.remove('active');

  cityBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Clicking any hub in modal selects it in the form
  const hubItems = modal.querySelectorAll('.hub-item');
  hubItems.forEach(item => {
    item.addEventListener('click', () => {
      const hubTitle = item.querySelector('strong')?.innerText;
      if (hubTitle && locationSelect) {
        // find matching option
        for (let i = 0; i < locationSelect.options.length; i++) {
          if (locationSelect.options[i].text.includes(hubTitle.split(' ')[0])) {
            locationSelect.selectedIndex = i;
            break;
          }
        }
      }
      closeModal();
      showToast('Pickup Location Selected', hubTitle || 'Location updated');
    });
  });
}

/**
 * Revv Synchronized Stats Carousel & Dynamic Headline Animation
 * 5 Cards & Intros: Cards slide left and disappear; intros align left slowly and smooth left go and disappear.
 */
const CARDS_DATA = [
  {
    id: 0,
    title: '60 Crore+',
    sub: 'kms driven',
    iconSVG: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/><line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/><line x1="19.07" y1="4.93" x2="17.66" y2="6.34"/></svg>`
  },
  {
    id: 1,
    title: 'New cars',
    sub: '&nbsp;',
    iconSVG: `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2l1.9 2.1 2.8-.5 1 2.6 2.7.9.1 2.9 2.1 1.9-1 2.7 1.3 2.6-2 2-.1 2.8-2.8.6-.9 2.7-2.7.2-1.9 2.1-1.9-2.1-2.7-.2-.9-2.7-2.8-.6-.1-2.8-2-2 1.3-2.6-1-2.7 2.1-1.9.1-2.9 2.7-.9 1-2.6 2.8.5L12 2zm3.3 7.3a1 1 0 0 0-1.4 0L10.5 12.7l-1.4-1.4a1 1 0 1 0-1.4 1.4l2.1 2.1a1 1 0 0 0 1.4 0l4.1-4.1a1 1 0 0 0 0-1.4z"/></svg>`
  },
  {
    id: 2,
    title: '4.6 ★',
    sub: '100k+ reviews',
    iconSVG: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
  },
  {
    id: 3,
    title: '10 lakh+',
    sub: 'Happy Revvers',
    iconSVG: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="12" r="7"/><circle cx="7" cy="10" r=".7" fill="currentColor"/><circle cx="11" cy="10" r=".7" fill="currentColor"/><path d="M7 13.8c.8.9 1.8 1.2 2 .4"/><path d="M16 11V6.5a1.2 1.2 0 0 0-1.2-1.2c-.6 0-.8.4-1.2 1.2l-.8 1.5V14h4.5a1.5 1.5 0 0 0 1.5-1.5v-1a1.2 1.2 0 0 0-.8-1.1z"/></svg>`
  },
  {
    id: 4,
    title: 'Home',
    sub: 'delivery',
    iconSVG: `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="13" height="12" rx="1"/><polygon points="14 8 18 8 21 11 21 16 14 16 14 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="17.5" cy="18.5" r="2.5"/></svg>`
  }
];

const SLIDES_DATA = {
  '0': { // 60 Crore+ kms driven
    id: 0,
    type: 'trust',
    headline: '<span class="headline-pill">60 Crore+ km</span> <span class="italic-serif">of trust</span>',
    subtitle: "That's 13,000+ Vijayawada to Hyderabad & Vizag road trips"
  },
  '1': { // New cars
    id: 1,
    type: 'fresh',
    headline: 'The <span class="headline-pill">new car</span> feeling',
    subtitle: 'Latest 2024–2026 models, kept showroom-fresh for every trip'
  },
  '2': { // 4.6 ★ 100k+ reviews
    id: 2,
    type: 'rating',
    score: '4.6',
    headline: '<span class="headline-pill">Rated</span> by <span class="highlight-cyan">100K+</span> Happy Drivers',
    subtitle: "Vijayawada's #1 trusted self-drive car rental service"
  },
  '3': { // 10 lakh+ Happy Revvers
    id: 3,
    type: 'community',
    headline: '<span class="headline-pill">10 lakh+</span> happy drivers',
    subtitle: 'and counting... your trust drives us across Vijayawada & AP'
  },
  '4': { // Home delivery
    id: 4,
    type: 'delivery',
    headline: '<span class="headline-pill">Your car</span>, at your door',
    subtitle: 'Delivered and picked up wherever you are in Vijayawada'
  }
};

function createCardElement(id, isActive = false) {
  const data = CARDS_DATA[id];
  const el = document.createElement('div');
  el.className = 'revv-stat-box' + (isActive ? ' active-teal' : '');
  el.setAttribute('data-slide', String(id));
  el.setAttribute('role', 'button');
  el.setAttribute('tabindex', '0');
  el.innerHTML = `
    <div class="stat-box-icon stat-box-icon-circle">
      ${data.iconSVG}
    </div>
    <div class="stat-box-title">${data.title}</div>
    <div class="stat-box-sub">${data.sub}</div>
  `;
  return el;
}

function getIntroHTML(data) {
  if (data.type === 'rating') {
    return `
      <div class="rating-badge-card">
        <div class="rating-score">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="#08919A" class="star-fill">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          <span>${data.score}</span>
        </div>
        <div class="rating-stars-row">
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
        </div>
      </div>
      <h2 class="rating-headline">${data.headline}</h2>
      <p class="rating-subtext">${data.subtitle}</p>
    `;
  }
  return `
    <h2 class="rating-headline">${data.headline}</h2>
    <p class="rating-subtext">${data.subtitle}</p>
  `;
}

function initStatsHighlightCycle() {
  const cardsRow = document.getElementById('statsCardsRow');
  if (!cardsRow) return;

  const capsules = cardsRow.querySelectorAll('.hero-feature-capsule');
  if (capsules.length > 0) {
    let activeIdx = 0;
    capsules[0].classList.add('active-glow');
    setInterval(() => {
      capsules[activeIdx].classList.remove('active-glow');
      activeIdx = (activeIdx + 1) % capsules.length;
      capsules[activeIdx].classList.add('active-glow');
    }, 2800);
    return;
  }

  const dynamicHeader = document.getElementById('revvDynamicHeader');
  const showcase = document.getElementById('revvShowcase');

  if (!dynamicHeader) return;

  // Ensure a 6th buffer card exists at the end of the row
  if (cardsRow.children.length === 5) {
    const bufferCard = createCardElement(0, false);
    bufferCard.setAttribute('aria-hidden', 'true');
    cardsRow.appendChild(bufferCard);
  }

  let isTransitioning = false;
  let autoTimer = null;
  let isHovered = false;

  // Calculate dynamic pixel step distance based on actual layout width
  const getStepDistance = () => {
    if (cardsRow.children.length >= 2) {
      const box1 = cardsRow.children[0];
      const box2 = cardsRow.children[1];
      const dist = box2.offsetLeft - box1.offsetLeft;
      if (dist > 0) return dist;
    }
    return 136;
  };

  // Update dynamic intro with smooth left-exit and right-enter
  const updateIntro = (slideData, direction = 'forward') => {
    const currentSlide = dynamicHeader.querySelector('.header-slide-content');
    const newSlide = document.createElement('div');
    newSlide.className = direction === 'forward' ? 'header-slide-content slide-in-right' : 'header-slide-content slide-in-left';
    newSlide.innerHTML = getIntroHTML(slideData);

    if (currentSlide) {
      currentSlide.className = direction === 'forward' ? 'header-slide-content slide-out-left' : 'header-slide-content slide-out-right';
      dynamicHeader.appendChild(newSlide);

      setTimeout(() => {
        if (currentSlide && currentSlide.parentNode === dynamicHeader) {
          currentSlide.remove();
        }
      }, 650);
    } else {
      dynamicHeader.appendChild(newSlide);
    }
  };

  // Advance carousel forward (Card moves left and disappears; intro aligns left slowly & goes left and disappears)
  const advanceStep = () => {
    if (isTransitioning) return;
    isTransitioning = true;

    const firstCard = cardsRow.children[0];
    const stepDistance = getStepDistance();

    // 1. Outgoing card smoothly glides left and disappears
    firstCard.classList.add('card-exit-left');

    // 2. Track smoothly shifts left
    cardsRow.style.transition = 'transform 0.6s cubic-bezier(0.33, 1, 0.68, 1)';
    cardsRow.style.transform = `translateX(-${stepDistance}px)`;

    // 3. Update the active card (card at index 3 moves to index 2 and activates)
    const prevActive = cardsRow.children[2];
    const newActive = cardsRow.children[3];

    if (prevActive) {
      prevActive.classList.remove('active-teal');
      prevActive.setAttribute('aria-selected', 'false');
    }

    if (newActive) {
      newActive.classList.add('active-teal');
      newActive.setAttribute('aria-selected', 'true');
      const slideId = newActive.getAttribute('data-slide') || '0';
      if (SLIDES_DATA[slideId]) {
        updateIntro(SLIDES_DATA[slideId], 'forward');
      }
    }

    // 4. Once transition completes, remove exited card, reset track, and append next cyclical buffer card
    setTimeout(() => {
      // Find ID of last card currently in track
      const lastCard = cardsRow.lastElementChild;
      const lastId = parseInt(lastCard.getAttribute('data-slide') || '0', 10);
      const nextBufferId = (lastId + 1) % 5;

      // Remove the card that exited left
      firstCard.remove();

      // Append next buffer card to maintain exact cycle
      const newBuffer = createCardElement(nextBufferId, false);
      cardsRow.appendChild(newBuffer);

      // Reset track transform instantaneously
      cardsRow.style.transition = 'none';
      cardsRow.style.transform = 'translateX(0)';

      void cardsRow.offsetHeight; // Force reflow
      isTransitioning = false;
    }, 620);
  };

  // Step backward (if user clicks previous card)
  const backwardStep = () => {
    if (isTransitioning) return;
    isTransitioning = true;

    const firstCard = cardsRow.children[0];
    const firstId = parseInt(firstCard.getAttribute('data-slide') || '0', 10);
    const prevId = (firstId - 1 + 5) % 5;
    const stepDistance = getStepDistance();

    // Remove last card
    if (cardsRow.lastElementChild) {
      cardsRow.lastElementChild.remove();
    }

    // Prepend previous card at offset
    const prevCard = createCardElement(prevId, false);
    cardsRow.insertBefore(prevCard, cardsRow.firstChild);
    cardsRow.style.transition = 'none';
    cardsRow.style.transform = `translateX(-${stepDistance}px)`;
    void cardsRow.offsetHeight;

    // Animate to 0
    cardsRow.style.transition = 'transform 0.6s cubic-bezier(0.33, 1, 0.68, 1)';
    cardsRow.style.transform = 'translateX(0)';

    // Update active
    const prevActive = cardsRow.children[3];
    const newActive = cardsRow.children[2];

    if (prevActive) {
      prevActive.classList.remove('active-teal');
      prevActive.setAttribute('aria-selected', 'false');
    }

    if (newActive) {
      newActive.classList.add('active-teal');
      newActive.setAttribute('aria-selected', 'true');
      const slideId = newActive.getAttribute('data-slide') || '0';
      if (SLIDES_DATA[slideId]) {
        updateIntro(SLIDES_DATA[slideId], 'backward');
      }
    }

    setTimeout(() => {
      isTransitioning = false;
    }, 620);
  };

  // Delegate click events on cardsRow
  cardsRow.addEventListener('click', (e) => {
    const card = e.target.closest('.revv-stat-box');
    if (!card || isTransitioning) return;

    const allCards = Array.from(cardsRow.children);
    const clickedIndex = allCards.indexOf(card);
    const activeIndex = 2; // Position 3 is the active center position

    if (clickedIndex === activeIndex) {
      resetAutoTimer();
      return;
    }

    if (clickedIndex > activeIndex) {
      advanceStep();
    } else if (clickedIndex < activeIndex) {
      backwardStep();
    }
    resetAutoTimer();
  });

  // Pause on hover
  if (showcase) {
    showcase.addEventListener('mouseenter', () => { isHovered = true; });
    showcase.addEventListener('mouseleave', () => { isHovered = false; });
  }

  // Auto rotation timer (~3.3 seconds)
  const startAutoTimer = () => {
    autoTimer = setInterval(() => {
      if (!isHovered && !isTransitioning) {
        advanceStep();
      }
    }, 3300);
  };

  const resetAutoTimer = () => {
    clearInterval(autoTimer);
    startAutoTimer();
  };

  startAutoTimer();
}

/**
 * Handle form submission
 */
function handleSearchCars() {
  const location = document.getElementById('pickupLocation')?.value;
  const pickupDate = document.getElementById('pickupDate')?.value;
  const dropDate = document.getElementById('dropDate')?.value;
  const pickupTime = document.getElementById('pickupTime')?.value;
  const dropTime = document.getElementById('dropTime')?.value;

  showToast(
    'Checking Fleet in Vijayawada...', 
    `${location} | ${pickupDate} ${pickupTime} to ${dropDate} ${dropTime}`
  );

  // Scroll smoothly to fleet section or simulate redirect
  setTimeout(() => {
    const fleetSection = document.getElementById('fleet');
    if (fleetSection) {
      fleetSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, 800);
}

/**
 * Action Toast helper
 */
let toastTimeout;
function showToast(title, message) {
  const toast = document.getElementById('actionToast');
  const toastTitle = document.getElementById('toastTitle');
  const toastMsg = document.getElementById('toastMsg');

  if (!toast || !toastTitle || !toastMsg) return;

  toastTitle.textContent = title;
  toastMsg.textContent = message;

  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
