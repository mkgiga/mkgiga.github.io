/**
 * Creates an animated spinner using Canvas with rotating dots and fading afterimage trails
 * @param {HTMLElement} container - The element to render the spinner in
 * @param {Object} options - Optional configuration
 * @param {string} options.size - Size of spinner ('sm', 'md', 'lg') - default 'md'
 * @param {string} options.color - Color of spinner - default uses CSS --primary variable
 * @returns {Object} Object with canvas element and destroy method
 */
function createSpinner(container, options = {}) {
  const { size = 'md', color } = options;
  const primaryColor = color || getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();

  const sizeMap = {
    sm: 24,
    md: 40,
    lg: 60
  };

  const spinnerSize = sizeMap[size] || sizeMap.md;
  const dotSize = Math.floor(spinnerSize / 8); // Smaller dots (was /6)
  const radius = spinnerSize / 2;

  // Add padding so dots don't get cut off at edges
  const padding = dotSize;
  const canvasSize = spinnerSize + padding * 2;

  // Create canvas with device pixel ratio for crisp rendering
  const canvas = document.createElement('canvas');
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvasSize * dpr;
  canvas.height = canvasSize * dpr;
  canvas.style.width = `${canvasSize}px`;
  canvas.style.height = `${canvasSize}px`;
  canvas.style.display = 'block';
  canvas.style.margin = 'auto';
  canvas.style.backgroundColor = 'transparent';

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.translate(padding, padding);

  const wrapper = document.createElement('div');
  wrapper.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    min-height: 200px;
  `;
  wrapper.appendChild(canvas);
  container.appendChild(wrapper);

  const afterimages = [];
  const dotAngles = [0, 90, 180, 270];

  // Animation state
  let rotation = 0;
  const rotationSpeed = 360 / 1600; // 360 degrees in 1600ms (slower)
  let enlargementRotation = 0;
  const enlargementSpeed = -360 / 3600; // Enlargement rotates slower in opposite direction
  let lastTime = performance.now();
  let timeSinceLastAfterimage = 0;
  const afterimageInterval = 8; // Spawn afterimage every 8ms
  const fadeDuration = 300; // How long afterimages take to fade out

  function drawDot(angle, opacity, enlargementAngles) {
    const angleRad = (angle * Math.PI) / 180;
    const x = radius + Math.sin(angleRad) * radius;
    const y = radius - Math.cos(angleRad) * radius;

    ctx.globalAlpha = opacity;
    ctx.fillStyle = primaryColor;
    ctx.beginPath();

    // Calculate proximity to any of the 4 enlargement zones
    let maxProximity = 0;
    for (const enlargementAngle of enlargementAngles) {
      const angleDiff = Math.abs((angle - enlargementAngle + 360) % 360);
      const normalizedDiff = Math.min(angleDiff, 360 - angleDiff); // Handle wrap-around
      const proximity = Math.max(0, 1 - (normalizedDiff / 35)); // 35 degree falloff (bigger zones)
      maxProximity = Math.max(maxProximity, proximity);
    }

    // Enlarge dots near any enlargement angle by up to 50%
    const sizeMultiplier = 1 + (maxProximity * 0.5);
    const size = (dotSize / 2) * sizeMultiplier;

    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  function animate(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    rotation += rotationSpeed * deltaTime;
    if (rotation >= 360) rotation -= 360;

    enlargementRotation += enlargementSpeed * deltaTime;
    if (enlargementRotation >= 360) enlargementRotation -= 360;
    if (enlargementRotation < 0) enlargementRotation += 360;

    timeSinceLastAfterimage += deltaTime;

    // Clear canvas (including padding area)
    ctx.clearRect(-padding, -padding, canvasSize, canvasSize);

    // Spawn afterimages
    if (timeSinceLastAfterimage >= afterimageInterval) {
      for (const dotAngle of dotAngles) {
        const angle = (dotAngle + rotation) % 360;
        afterimages.push({ angle, createdAt: currentTime });
      }
      timeSinceLastAfterimage = 0;
    }

    // Create 4 enlargement zones at 90-degree offsets
    const baseEnlargementAngle = enlargementRotation % 360;
    const enlargementAngles = [
      baseEnlargementAngle,
      (baseEnlargementAngle + 90) % 360,
      (baseEnlargementAngle + 180) % 360,
      (baseEnlargementAngle + 270) % 360
    ];

    // Draw and update afterimages
    for (let i = afterimages.length - 1; i >= 0; i--) {
      const afterimage = afterimages[i];
      const age = currentTime - afterimage.createdAt;

      if (age > fadeDuration) {
        afterimages.splice(i, 1);
      } else {
        // Start at 0.7 opacity and fade to 0
        const fadeProgress = age / fadeDuration;
        const opacity = 0.7 * (1 - fadeProgress);
        drawDot(afterimage.angle, opacity, enlargementAngles);
      }
    }

    // Draw main dots (always full opacity)
    for (const dotAngle of dotAngles) {
      const angle = (dotAngle + rotation) % 360;
      drawDot(angle, 1, enlargementAngles);
    }

    animationId = requestAnimationFrame(animate);
  }

  let animationId = requestAnimationFrame(animate);

  return {
    element: wrapper,
    destroy: () => {
      cancelAnimationFrame(animationId);
      wrapper.remove();
    }
  };
}

const tabContainer = document.getElementById("tab-container");
const tabs = tabContainer.querySelectorAll("div[tab]");

const fuckYouScrapers = {
  'hehe_1': {
    // lol
    href: 'tel:+!4££$6¥€][{[]7£$0€$4¤2¡¡1$9[[2£¡6!¤¤5',
    textContent: '+¡¡¡¡4¥€¥{€6£$$£$ £$7£$¡#£0 4$€$£¤¤€¤2##1 9€$£2¡$£{} £]$][6€€5',

  },
  'hehe_2': {
    href: 'm£!$a!/&i¤)(#l()t#o¤}¤:¤s$¤o$u€€r{{c€€e¥m¡i££le@}}g$€ma€$$$€i}l.$c££}o€€m¥¥',
  },
};

/**
 *
 * @param {MouseEvent} event
 * @returns
 */
function onTabClick(event) {
  event.preventDefault();
  const target = event.currentTarget;

  const tabName = target.getAttribute("route");
  if (!tabName) return;

  history.pushState({}, "", target.href);
  showTab(tabName);
};

function showTab(tabName, skipAnimation = false) {
  const landing = document.getElementById('landing');
  const mainLayout = document.getElementById('main-layout');

  if (tabName === 'home') {
    if (skipAnimation) {
      // Immediate switch for initial load
      mainLayout.classList.add('hidden');
      landing.classList.remove('hidden');
      landing.style.opacity = '1';
      mainLayout.style.opacity = '1';
    } else {
      // Animated transition
      mainLayout.style.opacity = '0';
      setTimeout(() => {
        mainLayout.classList.add('hidden');
        landing.classList.remove('hidden');
        landing.offsetHeight;
        landing.style.opacity = '1';
      }, 300);
    }
  } else {
    // Show the correct tab
    for (const tab of tabs) {
      if (tab.getAttribute("tab") === tabName) {
        tab.setAttribute("active", "");
      } else {
        tab.removeAttribute("active");
      }
    }

    if (skipAnimation) {
      // Immediate switch for initial load
      landing.classList.add('hidden');
      mainLayout.classList.remove('hidden');
      landing.style.opacity = '1';
      mainLayout.style.opacity = '1';
    } else {
      // Animated transition
      landing.style.opacity = '0';
      setTimeout(() => {
        landing.classList.add('hidden');
        mainLayout.classList.remove('hidden');
        mainLayout.offsetHeight;
        mainLayout.style.opacity = '1';
      }, 300);
    }
  }
}

function getTabFromPath() {
  const path = window.location.pathname;
  if (path === "/" || path === "") return "home";
  return path.substring(1);
}

/**
 * Switch language and update flag selection
 * @param {string} langCode - Language code ("en" or "sv")
 */
function switchLanguage(langCode) {
  // Set language on body element
  document.body.setAttribute('lang', langCode);

  // Remove selected attribute from all flag images
  const allFlags = document.querySelectorAll('#languages img');
  for (const flag of allFlags) {
    flag.removeAttribute('selected');
  }

  // Add selected attribute to the clicked language's flag
  const targetButton = document.getElementById(`lang-${langCode}`);
  if (targetButton) {
    const targetFlag = targetButton.querySelector('img');
    if (targetFlag) {
      targetFlag.setAttribute('selected', '');
    }
  }
}

/**
 * Handle language click - save preference and switch language
 * @param {string} langCode - Language code ("en" or "sv")
 */
function onLanguageClick(langCode) {
  localStorage.setItem('preferredLanguage', langCode);
  switchLanguage(langCode);
}

/**
 * Get initial language based on saved preference, browser locale, or default to English
 * @returns {string} Language code ("en" or "sv")
 */
function getInitialLanguage() {
  // Check localStorage first
  const savedLang = localStorage.getItem('preferredLanguage');
  if (savedLang === 'en' || savedLang === 'sv') {
    return savedLang;
  }

  // Check browser language
  const userLang = navigator.language || navigator.userLanguage;
  if (userLang && userLang.startsWith('sv')) {
    return 'sv';
  }

  // Fall back to English
  return 'en';
}

function initialize() {
  const linkGroups = document.querySelectorAll('.link-group');

  // Robust mobile detection using multiple signals
  function isMobileDevice(debug) {
    // Debug mode: pass true to force mobile, false to force desktop, undefined for normal detection
    if (typeof debug === 'boolean') {
      return debug;
    }

    // Check for touch capability
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Check for coarse pointer (indicates touch/stylus)
    const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

    // Check screen width (fallback for older devices)
    const isSmallScreen = window.innerWidth <= 768;

    // User agent check as final fallback
    const mobileUA = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Device is mobile if it has touch AND (coarse pointer OR small screen OR mobile UA)
    return hasTouch && (hasCoarsePointer || isSmallScreen || mobileUA);
  }

  const isMobile = isMobileDevice();

  // load email and phone number dynamically to
  // prevent scrapers from selling them to spammers
  for (const id in fuckYouScrapers) {
    const element = document.getElementById(id);
    // Also try landing page versions
    const landingElement = document.getElementById(id + '_landing');
    const keys = Object.keys(fuckYouScrapers[id]);

    function decodeString(str) {
      const exemptChars = '+-@.: ';
      let decoded = '';
      // remove all non-alphanumeric characters except exemptChars
      for (const char of str) {
        if (exemptChars.includes(char) || /[a-zA-Z0-9]/.test(char)) {
          decoded += char;
        }
      }
      return decoded;
    }

    for (const key of keys) {
      const value = fuckYouScrapers[id][key];
      const decodedValue = decodeString(value);

      // For phone links (hehe_1), only set href on mobile devices
      if (key === 'href' && id === 'hehe_1') {
        if (isMobile) {
          if (element) element[key] = decodedValue;
          if (landingElement) landingElement[key] = decodedValue;
        }
        // Always set textContent regardless of device
        if (keys.includes('textContent')) {
          const textValue = fuckYouScrapers[id]['textContent'];
          const decodedText = decodeString(textValue);
          if (element) element.textContent = decodedText;
          if (landingElement) landingElement.textContent = decodedText;
        }
      } else {
        if (element) element[key] = decodedValue;
        if (landingElement) landingElement[key] = decodedValue;
      }
    }
  }

  for (const group of linkGroups) {
    const link = group.querySelector('a');
    if (link) {
      group.onclick = (event) => {
        // navigate to the link's href
        window.open(link.href, '_blank');
      };
    }
  }

  // Add event listeners to all route links (nav + landing CTAs)
  for (const link of document.querySelectorAll('a[route]')) {
    link.addEventListener('click', onTabClick);
  }

  // Language switcher
  const langEnButton = document.getElementById('lang-en');
  const langSvButton = document.getElementById('lang-sv');

  if (langEnButton) {
    langEnButton.addEventListener('click', () => onLanguageClick('en'));
  }

  if (langSvButton) {
    langSvButton.addEventListener('click', () => onLanguageClick('sv'));
  }

  // Phone number click handler - copy on desktop, call on mobile
  const phoneContainer = document.getElementById('phone-container');
  const phoneLink = document.getElementById('hehe_1');
  const phoneLinkLanding = document.getElementById('hehe_1_landing');
  const copyFeedback = document.getElementById('copy-feedback');

  if (!isMobile) {
    let feedbackTimeout1 = null;
    let feedbackTimeout2 = null;

    // Desktop only: copy to clipboard for both phone links
    const copyPhoneNumber = async (event, linkElement) => {
      event.preventDefault(); // Prevent anchor navigation
      const phoneNumber = linkElement.textContent.trim();

      try {
        await navigator.clipboard.writeText(phoneNumber);

        // Show feedback (only in main layout where the feedback element exists)
        if (copyFeedback) {
          // Clear any existing timeouts
          if (feedbackTimeout1) clearTimeout(feedbackTimeout1);
          if (feedbackTimeout2) clearTimeout(feedbackTimeout2);

          // Reset and show
          copyFeedback.classList.remove('hidden');
          copyFeedback.style.opacity = '1';

          // Fade out and hide after 2 seconds
          feedbackTimeout1 = setTimeout(() => {
            copyFeedback.style.opacity = '0';
            // Hide completely after fade animation
            feedbackTimeout2 = setTimeout(() => {
              copyFeedback.classList.add('hidden');
            }, 300); // Match transition duration
          }, 2000);
        }
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    };

    // Main layout: attach to container so icon click also works
    if (phoneContainer && phoneLink) {
      phoneContainer.addEventListener('click', (event) => copyPhoneNumber(event, phoneLink));
    }
    // Landing page: attach to link element
    if (phoneLinkLanding) {
      phoneLinkLanding.addEventListener('click', (event) => copyPhoneNumber(event, phoneLinkLanding));
    }
  }
  // Mobile: tel: link works automatically (no handler needed)

  // Burger menu functionality
  const burgerBtn = document.getElementById('burger-btn');
  const burgerMenu = document.getElementById('burger-menu');
  const menuOverlay = document.getElementById('menu-overlay');
  const burgerMenuItems = document.querySelectorAll('.burger-menu-item');
  const burgerLangEn = document.getElementById('burger-lang-en');
  const burgerLangSv = document.getElementById('burger-lang-sv');

  function openBurgerMenu() {
    burgerMenu.classList.add('active');
    menuOverlay.classList.add('active');
    menuOverlay.classList.remove('hidden');
    burgerBtn.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent body scroll
  }

  function closeBurgerMenu() {
    burgerMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
    burgerBtn.classList.remove('active');
    document.body.style.overflow = ''; // Restore body scroll
    // Hide overlay after animation
    setTimeout(() => {
      if (!menuOverlay.classList.contains('active')) {
        menuOverlay.classList.add('hidden');
      }
    }, 300);
  }

  if (burgerBtn) {
    burgerBtn.addEventListener('click', () => {
      if (burgerMenu.classList.contains('active')) {
        closeBurgerMenu();
      } else {
        openBurgerMenu();
      }
    });
  }

  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeBurgerMenu);
  }

  // Close menu when clicking on navigation items
  burgerMenuItems.forEach(item => {
    item.addEventListener('click', () => {
      closeBurgerMenu();
    });
  });

  // Language switching from burger menu
  if (burgerLangEn) {
    burgerLangEn.addEventListener('click', () => {
      onLanguageClick('en');
      closeBurgerMenu();
    });
  }

  if (burgerLangSv) {
    burgerLangSv.addEventListener('click', () => {
      onLanguageClick('sv');
      closeBurgerMenu();
    });
  }

  // Service contact buttons - pre-fill form with selected service
  const serviceContactButtons = document.querySelectorAll('.service-contact-btn');
  for (const button of serviceContactButtons) {
    button.addEventListener('click', () => {
      const service = button.getAttribute('data-service');
      // Re-render form with pre-selected service after navigation
      setTimeout(() => {
        renderContactForm({ service });
      }, 10);
    });
  }

  // Set language based on saved preference, browser locale, or default to English
  switchLanguage(getInitialLanguage());

  // Rotating text animation
  const rotatingWordContainer = document.getElementById('rotating-word');
  if (rotatingWordContainer) {
    const words = [
      { en: 'Web development', sv: 'Webbutveckling' },
      { en: 'System development', sv: 'Systemutveckling' },
      { en: 'Frontend development', sv: 'Frontendutveckling' },
      { en: 'Backend development', sv: 'Backendutveckling' }
    ];

    // Calculate the width needed for the longest word
    function calculateMaxWidth() {
      const tempSpan = document.createElement('span');
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.position = 'absolute';
      tempSpan.style.whiteSpace = 'nowrap';
      tempSpan.className = 'text-2xl font-light'; // Match parent styling
      document.body.appendChild(tempSpan);

      let maxWidth = 0;
      words.forEach(word => {
        // Check both languages
        tempSpan.textContent = word.en;
        maxWidth = Math.max(maxWidth, tempSpan.offsetWidth);
        tempSpan.textContent = word.sv;
        maxWidth = Math.max(maxWidth, tempSpan.offsetWidth);
      });

      document.body.removeChild(tempSpan);
      return maxWidth;
    }

    // Set the container width to fit the longest word
    const maxWidth = calculateMaxWidth();
    rotatingWordContainer.style.width = `${maxWidth}px`;

    let currentIndex = 0;

    function createWordElement(word) {
      const wordItem = document.createElement('span');
      wordItem.className = 'word-item';

      const enSpan = document.createElement('span');
      enSpan.setAttribute('lang', 'en');
      enSpan.textContent = word.en;

      const svSpan = document.createElement('span');
      svSpan.setAttribute('lang', 'sv');
      svSpan.textContent = word.sv;

      wordItem.appendChild(enSpan);
      wordItem.appendChild(svSpan);

      return wordItem;
    }

    function animateWord() {
      const word = words[currentIndex];
      const wordElement = createWordElement(word);

      // Set initial state (below, invisible)
      wordElement.style.opacity = '0';
      rotatingWordContainer.appendChild(wordElement);

      // Check if mobile for animation direction
      const isMobile = window.innerWidth <= 768;
      const animateIn = isMobile
        ? [{ transform: 'translateX(-32px)', opacity: 0 }, { transform: 'translateX(0)', opacity: 1 }]
        : [{ transform: 'translateY(25%)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }];
      const animateOut = isMobile
        ? [{ transform: 'translateX(0)', opacity: 1 }, { transform: 'translateX(32px)', opacity: 0 }]
        : [{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-25%)', opacity: 0 }];

      wordElement.animate(animateIn, {
        duration: 800,
        fill: 'forwards',
        easing: 'ease-in-out'
      }).onfinish = () => {
        setTimeout(() => {
          wordElement.animate(animateOut, {
            duration: 800,
            fill: 'forwards',
            easing: 'ease-in-out'
          }).onfinish = () => {
            // Remove the word element after animation
            rotatingWordContainer.removeChild(wordElement);
            // Move to next word
            currentIndex = (currentIndex + 1) % words.length;

            // Repeat animation
            setTimeout(animateWord, 100);
          };
        }, 2000); // Display duration

      };
    }

    // Start animation
    animateWord();
  }

  showTab(getTabFromPath(), true); // Skip animation on initial load
}

/**
 * Render contact form with optional pre-filled data
 * @param {Object} options - Form configuration options
 * @param {string} options.service - Pre-selected service type
 * @param {string} options.containerId - Container element ID
 */
function renderContactForm(options = {}) {
  const { service = '', containerId = 'contact-form-container' } = options;
  const container = document.getElementById(containerId);

  if (!container) return;

  const currentLang = document.body.getAttribute('lang') || 'en';

  const labels = {
    name: { en: 'Name', sv: 'Namn' },
    email: { en: 'Email', sv: 'E-post' },
    service: { en: 'Service', sv: 'Tjänst' },
    message: { en: 'Message', sv: 'Meddelande' },
    send: { en: 'Send Message', sv: 'Skicka meddelande' },
    serviceOptions: {
      consultation: { en: 'Consultation Meeting', sv: 'Planeringsmöte' },
      development: { en: 'Development & Implementation', sv: 'Utveckling & Implementering' },
      other: { en: 'Other', sv: 'Annat' }
    }
  };

  // Check if form already exists
  const existingForm = container.querySelector('#contact-form');
  if (existingForm) {
    existingForm.remove();
  }

  const formHTML = `
    <form id="contact-form" class="space-y-4 block w-full">
      <div class="w-full">
        <label class="block text-sm font-medium mb-1">
          <span lang="en">${labels.name.en}</span>
          <span lang="sv">${labels.name.sv}</span>
        </label>
        <input type="text" name="name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--primary)] transition-colors">
      </div>

      <div class="w-full">
        <label class="block text-sm font-medium mb-1">
          <span lang="en">${labels.email.en}</span>
          <span lang="sv">${labels.email.sv}</span>
        </label>
        <input type="email" name="email" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--primary)] transition-colors">
      </div>

      <div class="w-full">
        <label class="block text-sm font-medium mb-1">
          <span lang="en">${labels.service.en}</span>
          <span lang="sv">${labels.service.sv}</span>
        </label>
        <select name="service" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--primary)] transition-colors">
          <option value="consultation" ${service === 'consultation' ? 'selected' : ''}>
            ${labels.serviceOptions.consultation[currentLang]}
          </option>
          <option value="development" ${service === 'development' ? 'selected' : ''}>
            ${labels.serviceOptions.development[currentLang]}
          </option>
          <option value="other" ${service === 'other' ? 'selected' : ''}>
            ${labels.serviceOptions.other[currentLang]}
          </option>
        </select>
      </div>

      <div class="w-full">
        <label class="block text-sm font-medium mb-1">
          <span lang="en">${labels.message.en}</span>
          <span lang="sv">${labels.message.sv}</span>
        </label>
        <textarea name="message" rows="5" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[var(--primary)] transition-colors resize-vertical"></textarea>
      </div>

      <button type="submit" class="bg-[var(--primary)] text-white px-6 py-2 rounded-lg hover:bg-[var(--primary-hover)] transition-colors font-medium">
        <span lang="en">${labels.send.en}</span>
        <span lang="sv">${labels.send.sv}</span>
      </button>
    </form>
  `;

  container.insertAdjacentHTML('beforeend', formHTML);

  // Handle form submission
  const form = container.querySelector('#contact-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;

    // Disable button and show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = currentLang === 'en' ? 'Sending...' : 'Skickar...';

    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);

      // Determine API URL based on environment
      const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3009/api/contact'
        : 'https://api.emileriksson.com/api/contact';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        alert(currentLang === 'en'
          ? 'Thank you! Your message has been sent.'
          : 'Tack! Ditt meddelande har skickats.');
        form.reset();
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert(currentLang === 'en'
        ? 'Sorry, there was an error sending your message. Please try again.'
        : 'Tyvärr uppstod ett fel. Vänligen försök igen.');
    } finally {
      // Re-enable button and restore original text
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  });
}

window.addEventListener("popstate", () => {
  showTab(getTabFromPath());
});

// Scrolling source code background
async function initCodeScroll() {
  try {
    const response = await fetch('/js/main.js');
    const sourceCode = await response.text();

    const codeContent = document.getElementById('code-content');
    if (!codeContent) return;
    const preElement = codeContent.parentElement;

    // Repeat the source code multiple times to fill the screen
    const repeated = (sourceCode + '\n\n').repeat(10);

    // Apply syntax highlighting with Prism
    codeContent.textContent = repeated;
    Prism.highlightElement(codeContent);

    // Animate scrolling
    let scrollPosition = 0;
    const scrollSpeed = 6; // pixels per second
    let lastTimestamp = null;

    function animate(timestamp) {
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }

      // Calculate delta time for smoother animation
      const deltaTime = (timestamp - lastTimestamp) / 1000; // convert to seconds
      lastTimestamp = timestamp;

      scrollPosition += scrollSpeed * deltaTime;

      // Reset when scrolled past one repetition
      const singleRepeatHeight = preElement.scrollHeight / 10;
      if (scrollPosition >= singleRepeatHeight) {
        scrollPosition = 0;
      }

      // Use translate3d for GPU acceleration
      preElement.style.transform = `translate3d(0, -${scrollPosition}px, 0)`;
      requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  } catch (error) {
    console.error('Failed to load source code:', error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById('page-loader');

  initialize();
  renderContactForm();
  initCodeScroll();

  // Remove loader immediately - content is already visible
  if (loader) {
    loader.remove();
  }
});