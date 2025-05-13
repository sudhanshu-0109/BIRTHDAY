document.addEventListener('DOMContentLoaded', function() {
  // Configuration
  const config = {
    images: [
      'images/PHOTO1.jpg',
      // 'images/photo2.jpg',
      // 'images/photo3.jpg',
      // 'images/photo4.jpg',
      // 'images/photo5.jpg',
      // 'images/photo6.jpg',
      // 'images/photo7.jpg',
      // 'images/photo8.jpg',
      // 'images/photo9.jpg',
      // 'images/photo10.jpg',
      // 'images/photo11.jpg',
      // 'images/photo12.jpg'
    ],
    autoPlay: true,
    autoPlayInterval: 5000,
    enableParticles: true,
    enableConfetti: true
  };

  // DOM Elements
  const elements = {
    slideshowImage: document.getElementById('slideshow-image'),
    prevButton: document.getElementById('prev'),
    nextButton: document.getElementById('next'),
    photoCounter: document.querySelector('.photo-counter'),
    progressBar: document.querySelector('.progress-bar'),
    thumbnailsContainer: document.querySelector('.thumbnails'),
    themeToggle: document.getElementById('theme-toggle'),
    musicToggle: document.getElementById('music-toggle'),
    backgroundMusic: document.getElementById('background-music'),
    nameElement: document.querySelector('.name-highlight'),
    confettiContainer: document.querySelector('.confetti-container')
  };

  // State
  let state = {
    currentIndex: 0,
    intervalId: null,
    isAutoPlaying: config.autoPlay,
    isDarkMode: false,
    isMusicPlaying: false
  };

  // Initialize
  function init() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Initialize particles if enabled
    if (config.enableParticles) {
      initParticles();
    }
    
    // Initialize slideshow
    initSlideshow();
    
    // Initialize event listeners
    initEventListeners();
    
    // Start autoplay if enabled
    if (state.isAutoPlaying) {
      startAutoPlay();
    }
    
    // Set initial theme
    checkThemePreference();
    
    // Initialize thumbnails
    createThumbnails();
    
    // Show first image
    showImage(state.currentIndex);
  }

  // Initialize particles.js
  function initParticles() {
    particlesJS('particles-js', {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#6a11cb" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: "#6a11cb", opacity: 0.4, width: 1 },
        move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true, mode: "push" }
        }
      }
    });
  }

  // Initialize slideshow
  function initSlideshow() {
    // Preload images for better performance
    config.images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }

  // Create thumbnail navigation
  function createThumbnails() {
    elements.thumbnailsContainer.innerHTML = '';
    
    config.images.forEach((src, index) => {
      const thumbnail = document.createElement('div');
      thumbnail.className = 'thumbnail';
      if (index === state.currentIndex) thumbnail.classList.add('active');
      
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Thumbnail ${index + 1}`;
      img.loading = 'lazy';
      
      thumbnail.appendChild(img);
      thumbnail.addEventListener('click', () => showImage(index));
      
      elements.thumbnailsContainer.appendChild(thumbnail);
    });
  }

  // Show image at specific index
  function showImage(index) {
    // Validate index
    if (index < 0) index = config.images.length - 1;
    if (index >= config.images.length) index = 0;
    
    // Update current index
    state.currentIndex = index;
    
    // Update main image
    const currentActive = document.querySelector('.slideshow img.active');
    if (currentActive) currentActive.classList.remove('active');
    
    elements.slideshowImage.src = config.images[index];
    elements.slideshowImage.alt = `Memory ${index + 1}`;
    elements.slideshowImage.classList.add('active');
    
    // Update photo counter
    elements.photoCounter.textContent = `${index + 1}/${config.images.length}`;
    
    // Update progress bar
    updateProgressBar();
    
    // Update active thumbnail
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });
    
    // Reset autoplay
    if (state.isAutoPlaying) {
      resetAutoPlay();
    }
    
    // Trigger confetti if enabled and it's the last image
    if (config.enableConfetti && index === config.images.length - 1) {
      createConfetti();
    }
  }

  // Update progress bar
  function updateProgressBar() {
    if (!state.isAutoPlaying) {
      elements.progressBar.style.width = '0%';
      return;
    }
    
    elements.progressBar.style.width = '0%';
    setTimeout(() => {
      elements.progressBar.style.width = '100%';
    }, 10);
    
    const duration = config.autoPlayInterval / 1000;
    elements.progressBar.style.transition = `width ${duration}s linear`;
  }

  // Start autoplay
  function startAutoPlay() {
    if (state.intervalId) clearInterval(state.intervalId);
    
    state.intervalId = setInterval(() => {
      showImage(state.currentIndex + 1);
    }, config.autoPlayInterval);
    
    updateProgressBar();
    state.isAutoPlaying = true;
  }

  // Stop autoplay
  function stopAutoPlay() {
    if (state.intervalId) clearInterval(state.intervalId);
    elements.progressBar.style.width = '0%';
    state.isAutoPlaying = false;
  }

  // Reset autoplay
  function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  // Create confetti effect
  function createConfetti() {
    if (!config.enableConfetti) return;
    
    elements.confettiContainer.innerHTML = '';
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      
      // Random properties
      const size = Math.random() * 10 + 5;
      const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
      const left = Math.random() * 100;
      const animationDuration = Math.random() * 3 + 2;
      
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      confetti.style.backgroundColor = color;
      confetti.style.left = `${left}%`;
      confetti.style.animationDuration = `${animationDuration}s`;
      confetti.style.animationDelay = `${Math.random() * 2}s`;
      
      elements.confettiContainer.appendChild(confetti);
    }
  }

  // Check user's theme preference
  function checkThemePreference() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    state.isDarkMode = prefersDark;
    updateTheme();
  }

  // Toggle theme
  function toggleTheme() {
    state.isDarkMode = !state.isDarkMode;
    updateTheme();
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', state.isDarkMode);
  }

  // Update theme
  function updateTheme() {
    document.documentElement.setAttribute('data-theme', state.isDarkMode ? 'dark' : 'light');
    
    // Update toggle button icon
    const icon = elements.themeToggle.querySelector('i');
    icon.className = state.isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
  }

  // Toggle music
  function toggleMusic() {
    state.isMusicPlaying = !state.isMusicPlaying;
    
    if (state.isMusicPlaying) {
      elements.backgroundMusic.play().catch(e => console.log('Autoplay prevented:', e));
      elements.musicToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
      elements.backgroundMusic.pause();
      elements.musicToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
  }

  // Share functionality
  function sharePage() {
    if (navigator.share) {
      navigator.share({
        title: 'Birthday Celebration',
        text: 'Check out this beautiful birthday celebration page!',
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareUrl = window.location.href;
      alert(`Share this link: ${shareUrl}`);
    }
  }

  // Initialize event listeners
  function initEventListeners() {
    // Navigation buttons
    elements.prevButton.addEventListener('click', () => {
      showImage(state.currentIndex - 1);
    });
    
    elements.nextButton.addEventListener('click', () => {
      showImage(state.currentIndex + 1);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') showImage(state.currentIndex - 1);
      if (e.key === 'ArrowRight') showImage(state.currentIndex + 1);
    });
    
    // Touch events for mobile swipe
    let touchStartX = 0;
    let touchEndX = 0;
    
    elements.slideshowImage.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    elements.slideshowImage.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
      const threshold = 50;
      if (touchStartX - touchEndX > threshold) {
        // Swipe left - next image
        showImage(state.currentIndex + 1);
      } else if (touchEndX - touchStartX > threshold) {
        // Swipe right - previous image
        showImage(state.currentIndex - 1);
      }
    }
    
    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // Music toggle
    elements.musicToggle.addEventListener('click', toggleMusic);
    
    // Share button
    const shareButton = document.querySelector('.share-button');
    if (shareButton) {
      shareButton.addEventListener('click', sharePage);
    }
    
    // Pause autoplay on hover
    elements.slideshowImage.addEventListener('mouseenter', stopAutoPlay);
    elements.slideshowImage.addEventListener('mouseleave', () => {
      if (config.autoPlay) startAutoPlay();
    });
    
    // Name hover effect
    elements.nameElement.addEventListener('mouseenter', () => {
      elements.nameElement.style.transform = 'scale(1.05)';
    });
    
    elements.nameElement.addEventListener('mouseleave', () => {
      elements.nameElement.style.transform = 'scale(1)';
    });
  }

  // Start the application
  init();
});
