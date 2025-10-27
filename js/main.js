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

function showTab(tabName) {
    const landing = document.getElementById('landing');
    const mainLayout = document.getElementById('main-layout');

    if (tabName === 'home') {
        // Show landing page, hide main layout
        landing.classList.remove('hidden');
        mainLayout.classList.add('hidden');
    } else {
        // Show main layout, hide landing page
        landing.classList.add('hidden');
        mainLayout.classList.remove('hidden');

        // Show the correct tab
        for (const tab of tabs) {
            if (tab.getAttribute("tab") === tabName) {
                tab.setAttribute("active", "");
            } else {
                tab.removeAttribute("active");
            }
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
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

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
    // Desktop only: copy to clipboard for both phone links
    const copyPhoneNumber = async (event, linkElement) => {
      event.preventDefault(); // Prevent anchor navigation
      const phoneNumber = linkElement.textContent.trim();

      try {
        await navigator.clipboard.writeText(phoneNumber);

        // Show feedback (only in main layout where the feedback element exists)
        if (copyFeedback) {
          copyFeedback.classList.remove('hidden');
          copyFeedback.style.opacity = '1';

          // Fade out and hide after 2 seconds
          setTimeout(() => {
            copyFeedback.style.opacity = '0';
            // Hide completely after fade animation
            setTimeout(() => {
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

  // Set language based on saved preference, browser locale, or default to English
  switchLanguage(getInitialLanguage());

  showTab(getTabFromPath());
}

window.addEventListener("popstate", () => {
  showTab(getTabFromPath());
});

document.addEventListener("DOMContentLoaded", () => {
  initialize();
});