// Language Switcher and Translation System with Embedded Translations

// Embedded translations to avoid CORS issues
const TRANSLATIONS = {
  en: {
    "header": {
      "title": "OLGA BERGE",
      "subtitle": "Makeup & Beauty",
      "courses": "courses",
      "booking": "booking",
      "contact": "contact"
    },
    "nav": {
      "cosmetics": "cosmetics",
      "fragrance": "fragrance",
      "skin": "skin",
      "baby": "baby",
      "discover": "discover",
      "booking": "booking",
      "courses": "courses",
      "contact": "contact"
    },
    "hero": {
      "badge": "just dropped",
      "title": "cosmic",
      "subtitle": "olga berge",
      "description": "olga's signature collection. a magnetic, beauty-inspired aesthetic that transforms your world.",
      "ctaPrimary": "shop now",
      "ctaSecondary": "view collection"
    },
    "contact": {
      "pageTitle": "Contact - Olga Berge",
      "badge": "get in touch",
      "title": "contact me",
      "description": "reach out for bookings, questions, or collaborations. we'd love to hear from you.",
      "emailLabel": "email",
      "phoneLabel": "phone",
      "locationLabel": "location",
      "address": "Trondheim, Norway",
      "nameLabel": "your name",
      "emailInputLabel": "your email",
      "phoneInputLabel": "phone (optional)",
      "subjectPlaceholder": "select subject",
      "subjectBooking": "makeup booking",
      "subjectCourse": "course inquiry",
      "subjectCollaboration": "collaboration",
      "subjectOther": "other",
      "messageLabel": "your message",
      "submitButton": "send message"
    },
    "footer": {
      "description": "Professional makeup artist & beauty expert",
      "quickLinks": "Quick Links",
      "followUs": "Follow Me",
      "rights": "all rights reserved."
    }
  },
  no: {
    "header": {
      "title": "OLGA BERGE",
      "subtitle": "Makeup & Skjønnhet",
      "courses": "kurser",
      "booking": "bestilling",
      "contact": "kontakt"
    },
    "nav": {
      "cosmetics": "kosmetikk",
      "fragrance": "parfyme",
      "skin": "hud",
      "baby": "baby",
      "discover": "oppdag",
      "booking": "bestilling",
      "courses": "kurser",
      "contact": "kontakt"
    },
    "hero": {
      "badge": "akkurat sluppet",
      "title": "cosmic",
      "subtitle": "olga berge",
      "description": "olgas signatur kolleksjon. en magnetisk, skjønnhetsinspirert estetikk som transformerer din verden.",
      "ctaPrimary": "handle nå",
      "ctaSecondary": "se kolleksjonen"
    },
    "contact": {
      "pageTitle": "Kontakt - Olga Berge",
      "badge": "ta kontakt",
      "title": "kontakt oss",
      "description": "ta kontakt for bestillinger, spørsmål eller samarbeid. vi vil gjerne høre fra deg.",
      "emailLabel": "e-post",
      "phoneLabel": "telefon",
      "locationLabel": "lokasjon",
      "address": "Trondheim, Norge",
      "nameLabel": "ditt navn",
      "emailInputLabel": "din e-post",
      "phoneInputLabel": "telefon (valgfritt)",
      "subjectPlaceholder": "velg emne",
      "subjectBooking": "makeup bestilling",
      "subjectCourse": "kursforespørsel",
      "subjectCollaboration": "samarbeid",
      "subjectOther": "annet",
      "messageLabel": "din melding",
      "submitButton": "send melding"
    },
    "footer": {
      "description": "Profesjonell makeup artist & skjønnhetsekspert",
      "quickLinks": "Hurtiglenker",
      "followUs": "Følg Oss",
      "rights": "alle rettigheter reservert."
    }
  }
};

class LanguageManager {
  constructor() {
    this.currentLanguage = this.getStoredLanguage() || this.detectBrowserLanguage();
    this.translations = TRANSLATIONS[this.currentLanguage] || TRANSLATIONS.en;
    this.init();
  }

  init() {
    this.applyTranslations();
    this.setupLanguageSwitcher();
  }

  getStoredLanguage() {
    return localStorage.getItem("preferredLanguage");
  }

  detectBrowserLanguage() {
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith("no") ||
      browserLang.startsWith("nb") ||
      browserLang.startsWith("nn")
      ? "no"
      : "en";
  }

  getNestedTranslation(path) {
    return path.split(".").reduce((obj, key) => obj?.[key], this.translations);
  }

  applyTranslations() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const translation = this.getNestedTranslation(key);

      if (translation) {
        // Check if it should update placeholder or text content
        if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
          element.placeholder = translation;
        } else {
          element.textContent = translation;
        }
      }
    });

    // Update all elements with data-i18n-html attribute (for HTML content)
    document.querySelectorAll("[data-i18n-html]").forEach((element) => {
      const key = element.getAttribute("data-i18n-html");
      const translation = this.getNestedTranslation(key);

      if (translation) {
        element.innerHTML = translation;
      }
    });

    // Update document language attribute
    document.documentElement.lang = this.currentLanguage;
  }

  setupLanguageSwitcher() {
    const languageButtons = document.querySelectorAll(".lang-btn");

    languageButtons.forEach((btn) => {
      const lang = btn.getAttribute("data-lang");

      // Set active state
      if (lang === this.currentLanguage) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }

      // Add click event
      btn.addEventListener("click", () => this.switchLanguage(lang));
    });
  }

  switchLanguage(newLang) {
    if (newLang === this.currentLanguage) return;

    this.currentLanguage = newLang;
    this.translations = TRANSLATIONS[newLang] || TRANSLATIONS.en;
    localStorage.setItem("preferredLanguage", newLang);

    this.applyTranslations();
    this.setupLanguageSwitcher();

    // Dispatch custom event for other scripts to react to language change
    window.dispatchEvent(
      new CustomEvent("languageChanged", {
        detail: { language: newLang },
      })
    );
  }

  // Helper method to get translation programmatically
  t(key) {
    return this.getNestedTranslation(key) || key;
  }
}

// Initialize language manager when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLanguageManager);
} else {
  initLanguageManager();
}

function initLanguageManager() {
  const languageManager = new LanguageManager();
  // Export for use in other scripts
  window.languageManager = languageManager;
}
