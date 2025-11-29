// Language Switcher and Translation System

class LanguageManager {
  constructor() {
    this.currentLanguage =
      this.getStoredLanguage() || this.detectBrowserLanguage();
    this.translations = {};
    this.init();
  }

  async init() {
    await this.loadTranslations();
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

  async loadTranslations() {
    try {
      const response = await fetch(`/languages/${this.currentLanguage}.json`);
      this.translations = await response.json();
    } catch (error) {
      console.error("Error loading translations:", error);
      // Fallback to English if loading fails
      if (this.currentLanguage !== "en") {
        this.currentLanguage = "en";
        await this.loadTranslations();
      }
    }
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

  async switchLanguage(newLang) {
    if (newLang === this.currentLanguage) return;

    this.currentLanguage = newLang;
    localStorage.setItem("preferredLanguage", newLang);

    await this.loadTranslations();
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

// Initialize language manager
const languageManager = new LanguageManager();

// Export for use in other scripts
window.languageManager = languageManager;
