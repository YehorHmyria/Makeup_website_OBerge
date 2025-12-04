// Portfolio Carousel functionality
class PortfolioCarousel {
  constructor() {
    this.currentSlide = 0;
    this.track = document.querySelector('.carousel-track');
    this.slides = document.querySelectorAll('.carousel-slide');
    this.prevBtn = document.querySelector('.carousel-btn.prev');
    this.nextBtn = document.querySelector('.carousel-btn.next');
    this.dotsContainer = document.querySelector('.carousel-dots');
    this.autoPlayInterval = null;
    this.autoPlayDelay = 2500; // 2.5 seconds
    this.slidesPerView = 3; // Show 3 slides at a time
    
    if (!this.track || !this.slides.length) return;
    
    this.init();
  }
  
  init() {
    this.createDots();
    this.addEventListeners();
    this.startAutoPlay();
    this.handleResize();
  }
  
  getSlidesPerView() {
    const width = window.innerWidth;
    if (width < 768) return 1;
    if (width < 1024) return 2;
    return 3;
  }
  
  getMaxSlide() {
    this.slidesPerView = this.getSlidesPerView();
    return Math.max(0, this.slides.length - this.slidesPerView);
  }
  
  createDots() {
    const maxSlide = this.slides.length - (this.slidesPerView - 1);
    for (let i = 0; i < maxSlide; i++) {
      const dot = document.createElement('div');
      dot.classList.add('carousel-dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => this.goToSlide(i));
      this.dotsContainer.appendChild(dot);
    }
    this.dots = document.querySelectorAll('.carousel-dot');
  }
  
  addEventListeners() {
    this.prevBtn.addEventListener('click', () => this.prevSlide());
    this.nextBtn.addEventListener('click', () => this.nextSlide());
    
    // Pause autoplay on hover
    const carousel = document.querySelector('.portfolio-carousel');
    carousel.addEventListener('mouseenter', () => this.stopAutoPlay());
    carousel.addEventListener('mouseleave', () => this.startAutoPlay());
    
    // Handle window resize
    window.addEventListener('resize', () => this.handleResize());
  }
  
  handleResize() {
    this.updateCarousel();
  }
  
  updateCarousel() {
    const slideWidth = this.slides[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(this.track).gap) || 0;
    const offset = this.currentSlide * (slideWidth + gap);
    
    this.track.style.transform = `translateX(-${offset}px)`;
    
    // Update dots
    if (this.dots) {
      this.dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === this.currentSlide);
      });
    }
  }
  
  goToSlide(index) {
    const maxSlide = this.getMaxSlide();
    this.currentSlide = Math.min(Math.max(0, index), maxSlide);
    this.updateCarousel();
    this.resetAutoPlay();
  }
  
  nextSlide() {
    const maxSlide = this.getMaxSlide();
    if (this.currentSlide >= maxSlide) {
      this.currentSlide = 0; // Loop back to start
    } else {
      this.currentSlide++;
    }
    this.updateCarousel();
    this.resetAutoPlay();
  }
  
  prevSlide() {
    const maxSlide = this.getMaxSlide();
    if (this.currentSlide <= 0) {
      this.currentSlide = maxSlide; // Loop to end
    } else {
      this.currentSlide--;
    }
    this.updateCarousel();
    this.resetAutoPlay();
  }
  
  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayDelay);
  }
  
  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
  
  resetAutoPlay() {
    this.stopAutoPlay();
    this.startAutoPlay();
  }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PortfolioCarousel();
});
