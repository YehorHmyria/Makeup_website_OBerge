// Main JavaScript - General Utilities and Interactions

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSmoothScroll();
  initScrollAnimations();
  initSearchFunctionality();
});

// Mobile Menu Toggle
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav');
  const overlay = document.querySelector('.overlay');
  
  if (!menuBtn || !nav) return;
  
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    nav.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
  });
  
  // Close menu when clicking overlay
  if (overlay) {
    overlay.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      nav.classList.remove('active');
      overlay.classList.remove('active');
    });
  }
  
  // Close menu when clicking a link
  const navLinks = nav.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('active');
      nav.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
    });
  });
}

// Smooth Scrolling
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Scroll Animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe elements with animation classes
  document.querySelectorAll('.product-card, .course-card, .service-option').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// Search Functionality
function initSearchFunctionality() {
  const searchBtn = document.querySelector('.search-btn');
  const searchOverlay = createSearchOverlay();
  
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      document.body.appendChild(searchOverlay);
      setTimeout(() => {
        searchOverlay.classList.add('active');
        searchOverlay.querySelector('input')?.focus();
      }, 10);
    });
  }
}

function createSearchOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'search-overlay';
  overlay.innerHTML = `
    <div class="search-container">
      <input type="text" class="search-input" placeholder="${window.languageManager?.t('common.search') || 'Search'}" />
      <button class="search-close-btn">&times;</button>
      <div class="search-results"></div>
    </div>
  `;
  
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  `;
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.classList.contains('search-close-btn')) {
      overlay.classList.remove('active');
      setTimeout(() => overlay.remove(), 300);
    }
  });
  
  // Add active state styling
  const style = document.createElement('style');
  style.textContent = `
    .search-overlay.active {
      opacity: 1 !important;
      visibility: visible !important;
    }
    .search-container {
      max-width: 600px;
      width: 90%;
      padding: 2rem;
      background: white;
      border-radius: 16px;
      position: relative;
    }
    .search-input {
      width: 100%;
      padding: 1rem;
      font-size: 1.125rem;
      border: 2px solid var(--color-border);
      border-radius: 8px;
      transition: border-color 0.3s ease;
    }
    .search-input:focus {
      border-color: var(--color-accent);
      outline: none;
    }
    .search-close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 40px;
      height: 40px;
      border: none;
      background: none;
      font-size: 2rem;
      cursor: pointer;
      color: var(--color-text-muted);
      transition: color 0.3s ease;
    }
    .search-close-btn:hover {
      color: var(--color-primary);
    }
  `;
  document.head.appendChild(style);
  
  return overlay;
}

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    header?.classList.add('scrolled');
  } else {
    header?.classList.remove('scrolled');
  }
  
  lastScroll = currentScroll;
});

// Active navigation highlighting
function highlightActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

highlightActiveNav();

// Utility: Format currency
function formatCurrency(amount, currency = 'NOK') {
  return new Intl.NumberFormat('no-NO', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

// Utility: Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Export utilities
window.utils = {
  formatCurrency,
  debounce
};
