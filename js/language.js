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
      "title": "OLGA BERGE",
      "subtitle": "beauty & makeup",
      "description": "professional makeup artist specializing in event makeup, evening looks, and personalized beauty consultations. let's create your perfect look together.",
      "cta": "learn more"
    },
    "services": {
      "title": "My Services",
      "description": "Professional makeup services and courses",
      "makeup": {
        "title": "Makeup Application",
        "description": "Professional makeup for any occasion",
        "cta": "booking"
      },
      "courses": {
        "title": "Courses",
        "description": "Learn from a professional makeup artist",
        "cta": "learn more"
      },
      "gift": {
        "title": "Gift Certificates",
        "description": "Give the gift of beauty and luxury",
        "cta": "learn more"
      }
    },
    "contact": {
      "pageTitle": "Contact - Olga Berge",
      "badge": "get in touch",
      "title": "contact me",
      "description": "reach out for bookings, questions, or collaborations. i'd love to hear from you.",
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
    },
    "gift": {
      "title": "Gift Certificates",
      "description": "Give the gift of beauty and confidence. Perfect for any occasion.",
      "popular": "Most Popular",
      "custom": {
        "title": "Custom Amount",
        "subtitle": "from 500 NOK",
        "description": "Choose your own amount for a personalized gift",
        "feature1": "✓ Flexible amount (minimum 500 NOK)",
        "feature2": "✓ Valid for 12 months",
        "feature3": "✓ Redeemable for any service",
        "feature4": "✓ Digital or printed certificate"
      },
      "evening": {
        "title": "Evening Makeup",
        "description": "Perfect for special events and celebrations",
        "feature1": "✓ Full evening makeup application",
        "feature2": "✓ Consultation (30 minutes)",
        "feature3": "✓ High-quality products",
        "feature4": "✓ Touch-up tips included"
      },
      "course": {
        "title": "Makeup Course",
        "description": "Learn professional makeup techniques",
        "feature1": "✓ 4-hour professional course",
        "feature2": "✓ One-on-one instruction",
        "feature3": "✓ Practice materials included",
        "feature4": "✓ Course certificate"
      },
      "form": {
        "amount": "Amount (NOK)",
        "name": "Your Name",
        "email": "Your Email",
        "recipient": "Recipient Name",
        "message": "Personal Message (optional)",
        "purchase": "Purchase Now"
      }
    },
    "portfolio": {
      "title": "My Work",
      "description": "Transforming beauty into art, one face at a time. Explore some of my recent work and the beautiful moments I've been part of.",
      "slide1": {
        "title": "Evening Makeup",
        "description": "elegant evening look for a special celebration"
      },
      "slide2": {
        "title": "Bridal Makeup",
        "description": "natural and radiant bridal beauty"
      },
      "slide3": {
        "title": "Fashion Makeup",
        "description": "bold and creative fashion editorial"
      },
      "slide4": {
        "title": "Natural Look",
        "description": "fresh and effortless everyday beauty"
      },
      "slide5": {
        "title": "Glamour Makeup",
        "description": "dramatic and sophisticated glamour"
      },
      "slide6": {
        "title": "Editorial Makeup",
        "description": "artistic and magazine-worthy looks"
      },
      "slide7": {
        "title": "Special Event",
        "description": "perfect for your memorable occasions"
      }
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
      "title": "OLGA BERGE",
      "subtitle": "beauty & makeup",
      "description": "profesjonell makeup-artist som spesialiserer seg på event-makeup, kveldsutseende og personlige skjønnhetsrådgivning. la oss skape ditt perfekte look sammen.",
      "cta": "lær mer"
    },
    "services": {
      "title": "Mine Tjenester",
      "description": "Profesjonelle makeup-tjenester og kurs",
      "makeup": {
        "title": "Makeup Påføring",
        "description": "Profesjonell makeup for enhver anledning",
        "cta": "bestilling"
      },
      "courses": {
        "title": "Kurs",
        "description": "Lær av en profesjonell makeup-artist",
        "cta": "lær mer"
      },
      "gift": {
        "title": "Gavekort",
        "description": "Gi gaven av skjønnhet og luksus",
        "cta": "lær mer"
      }
    },
    "contact": {
      "pageTitle": "Kontakt - Olga Berge",
      "badge": "ta kontakt",
      "title": "kontakt meg",
      "description": "ta kontakt for bestillinger, spørsmål eller samarbeid. jeg vil gjerne høre fra deg.",
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
      "followUs": "Følg Meg",
      "rights": "alle rettigheter reservert."
    },
    "gift": {
      "title": "Gavekort",
      "description": "Gi gaven av skjønnhet og selvtillit. Perfekt for enhver anledning.",
      "popular": "Mest Populær",
      "custom": {
        "title": "Valgfritt Beløp",
        "subtitle": "fra 500 NOK",
        "description": "Velg ditt eget beløp for en personlig gave",
        "feature1": "✓ Fleksibelt beløp (minimum 500 NOK)",
        "feature2": "✓ Gyldig i 12 måneder",
        "feature3": "✓ Kan brukes til alle tjenester",
        "feature4": "✓ Digitalt eller trykt gavekort"
      },
      "evening": {
        "title": "Kveldsmakeup",
        "description": "Perfekt for spesielle arrangementer og feiringer",
        "feature1": "✓ Full kveldsmakeup påføring",
        "feature2": "✓ Konsultasjon (30 minutter)",
        "feature3": "✓ Produkter av høy kvalitet",
        "feature4": "✓ Oppfriskningstips inkludert"
      },
      "course": {
        "title": "Makeup Kurs",
        "description": "Lær profesjonelle makeup-teknikker",
        "feature1": "✓ 4-timers profesjonelt kurs",
        "feature2": "✓ En-til-en instruksjon",
        "feature3": "✓ Øvelsesmaterialer inkludert",
        "feature4": "✓ Kursbevis"
      },
      "form": {
        "amount": "Beløp (NOK)",
        "name": "Ditt Navn",
        "email": "Din E-post",
        "recipient": "Mottakers Navn",
        "message": "Personlig Melding (valgfritt)",
        "purchase": "Kjøp Nå"
      }
    },
    "portfolio": {
      "title": "Mitt Arbeid",
      "description": "Forvandler skjønnhet til kunst, ett ansikt om gangen. Utforsk noe av mitt nylige arbeid og de vakre øyeblikkene jeg har vært en del av.",
      "slide1": {
        "title": "Kveldsmakeup",
        "description": "elegant kveldslook for en spesiell feiring"
      },
      "slide2": {
        "title": "Brudemakeup",
        "description": "naturlig og strålende brudeskjønnhet"
      },
      "slide3": {
        "title": "Motemakeup",
        "description": "modig og kreativ moteredaksjonell"
      },
      "slide4": {
        "title": "Naturlig Look",
        "description": "frisk og uanstrengt daglig skjønnhet"
      },
      "slide5": {
        "title": "Glamour Makeup",
        "description": "dramatisk og sofistikert glamour"
      },
      "slide6": {
        "title": "Redaksjonell Makeup",
        "description": "kunstneriske og magasinverdige looks"
      },
      "slide7": {
        "title": "Spesiell Begivenhet",
        "description": "perfekt for dine minneverdige anledninger"
      }
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
