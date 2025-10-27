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
    for (const tab of tabs) {
        if (tab.getAttribute("tab") === tabName) {
            tab.setAttribute("active", "");
        } else {
            tab.removeAttribute("active");
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

function initialize() {
  const linkGroups = document.querySelectorAll('.link-group');

  // load email and phone number dynamically to
  // prevent scrapers from selling them to spammers
  for (const id in fuckYouScrapers) {
    const element = document.getElementById(id);
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
      element[key] = decodedValue;
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

  for (const link of document.querySelectorAll('a[route]')) {
    link.addEventListener('click', onTabClick);
  }

  // Language switcher
  const langEnButton = document.getElementById('lang-en');
  const langSvButton = document.getElementById('lang-sv');

  if (langEnButton) {
    langEnButton.addEventListener('click', () => switchLanguage('en'));
  }

  if (langSvButton) {
    langSvButton.addEventListener('click', () => switchLanguage('sv'));
  }

  // Phone number click handler - copy on desktop, call on mobile
  const phoneLink = document.getElementById('hehe_1');
  const copyFeedback = document.getElementById('copy-feedback');

  if (phoneLink && copyFeedback) {
    phoneLink.addEventListener('click', async (event) => {
      // Detect if mobile device
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (!isMobile) {
        // Desktop: copy to clipboard
        event.preventDefault();
        const phoneNumber = phoneLink.textContent.trim();

        try {
          await navigator.clipboard.writeText(phoneNumber);

          // Show feedback
          copyFeedback.textContent = 'Copied to clipboard!';
          copyFeedback.style.opacity = '1';

          // Fade out after 2 seconds
          setTimeout(() => {
            copyFeedback.style.opacity = '0';
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      }
      // Mobile: let the tel: link work normally (don't prevent default)
    });
  }

  // Set default language based on user's browser locale
  const userLang = navigator.language || navigator.userLanguage;
  const defaultLang = userLang.startsWith('sv') ? 'sv' : 'en';

  switchLanguage(defaultLang);

  showTab(getTabFromPath());
}

window.addEventListener("popstate", () => {
  showTab(getTabFromPath());
});

document.addEventListener("DOMContentLoaded", () => {
  initialize();
});