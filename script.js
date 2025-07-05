document.addEventListener('DOMContentLoaded', function() {
  // Configuration
  const config = {
    media: [
      // Photos
      { type: 'image', src: 'images/photo1.jpg' },
      { type: 'image', src: 'images/photo2.jpg' },
      { type: 'image', src: 'images/photo3.jpg' },
      { type: 'image', src: 'images/photo4.jpg' },
      { type: 'image', src: 'images/photo5.jpg' },
      
      // Videos
      { type: 'video', src: 'videos/video1.mp4'},
      { type: 'video', src: 'videos/video2.mp4'},
      { type: 'video', src: 'videos/video3.mp4'}
    ],
    autoPlay: true,
    autoPlayInterval: 3000,
    enableParticles: true,
    enableConfetti: true,
    videoAutoPlay: true,
    videoLoop: true,
    videoMuted: true
  };

  // DOM Elements
  const elements = {
    slideshowContainer: document.querySelector('.slideshow'),
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
    isMusicPlaying: false,
    currentVideo: null
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
    
    // Show first media item
    showMedia(state.currentIndex);
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
    // Preload media for better performance
    config.media.forEach(item => {
      if (item.type === 'image') {
        const img = new Image();
        img.src = item.src;
      }
    });
  }

  // Show media at specific index
  function showMedia(index) {
    // Validate index
    if (index < 0) index = config.media.length - 1;
    if (index >= config.media.length) index = 0;
    
    // Update current index
    state.currentIndex = index;
    
    // Clear previous media
    elements.slideshowContainer.innerHTML = '';
    
    const mediaItem = config.media[index];
    let mediaElement;
    
    if (mediaItem.type === 'image') {
      mediaElement = document.createElement('img');
      mediaElement.src = mediaItem.src;
      mediaElement.alt = `Memory ${index + 1}`;
      mediaElement.loading = 'lazy';
      mediaElement.classList.add('active');
    } else if (mediaItem.type === 'video') {
      mediaElement = document.createElement('video');
      mediaElement.src = mediaItem.src;
      if (mediaItem.poster) mediaElement.poster = mediaItem.poster;
      mediaElement.controls = true;
      mediaElement.classList.add('active');
      
      // Video settings
      mediaElement.autoplay = config.videoAutoPlay;
      mediaElement.loop = config.videoLoop;
      mediaElement.muted = config.videoMuted;
      
      // Store current video reference
      state.currentVideo = mediaElement;
      
      // Pause autoplay when video is playing
      mediaElement.addEventListener('play', () => {
        stopAutoPlay();
      });
      
      mediaElement.addEventListener('ended', () => {
        if (config.autoPlay) {
          startAutoPlay();
        }
      });
    }
    
    // Add navigation buttons
    const navButtons = `
      <div class="slideshow-nav">
        <button id="prev" class="nav-button" aria-label="Previous photo">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button id="next" class="nav-button" aria-label="Next photo">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
      <div class="slideshow-progress">
        <div class="progress-bar"></div>
      </div>
    `;
    
    elements.slideshowContainer.appendChild(mediaElement);
    elements.slideshowContainer.insertAdjacentHTML('beforeend', navButtons);
    
    // Update photo counter
    elements.photoCounter.textContent = `${index + 1}/${config.media.length}`;
    
    // Update progress bar
    updateProgressBar();
    
    // Update active thumbnail
    updateActiveThumbnail();
    
    // Reset autoplay
    if (state.isAutoPlaying && mediaItem.type !== 'video') {
      resetAutoPlay();
    }
    
    // Trigger confetti if enabled and it's the last media item
    if (config.enableConfetti && index === config.media.length - 1) {
      createConfetti();
    }
  }

  // Create thumbnail navigation
  function createThumbnails() {
    elements.thumbnailsContainer.innerHTML = '';
    
    config.media.forEach((item, index) => {
      const thumbnail = document.createElement('div');
      thumbnail.className = 'thumbnail';
      if (index === state.currentIndex) thumbnail.classList.add('active');
      
      const mediaElement = item.type === 'image' 
        ? document.createElement('img')
        : document.createElement('video');
      
      mediaElement.src = item.type === 'image' ? item.src : (item.poster || item.src);
      mediaElement.alt = `Thumbnail ${index + 1}`;
      mediaElement.loading = 'lazy';
      
      if (item.type === 'video') {
        mediaElement.classList.add('video-thumbnail');
      }
      
      thumbnail.appendChild(mediaElement);
      thumbnail.addEventListener('click', () => showMedia(index));
      
      elements.thumbnailsContainer.appendChild(thumbnail);
    });
  }

  // Update active thumbnail
  function updateActiveThumbnail() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === state.currentIndex);
    });
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
      showMedia(state.currentIndex + 1);
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
    const savedPreference = localStorage.getItem('darkMode');
    
    if (savedPreference !== null) {
      state.isDarkMode = savedPreference === 'true';
    } else {
      state.isDarkMode = prefersDark;
    }
    
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
    // Navigation buttons - use event delegation since we recreate them
    document.addEventListener('click', (e) => {
      if (e.target.closest('#prev')) {
        showMedia(state.currentIndex - 1);
      } else if (e.target.closest('#next')) {
        showMedia(state.currentIndex + 1);
      }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') showMedia(state.currentIndex - 1);
      if (e.key === 'ArrowRight') showMedia(state.currentIndex + 1);
    });
    
    // Touch events for mobile swipe
    let touchStartX = 0;
    let touchEndX = 0;
    
    elements.slideshowContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    elements.slideshowContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
      const threshold = 50;
      if (touchStartX - touchEndX > threshold) {
        // Swipe left - next media
        showMedia(state.currentIndex + 1);
      } else if (touchEndX - touchStartX > threshold) {
        // Swipe right - previous media
        showMedia(state.currentIndex - 1);
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
    elements.slideshowContainer.addEventListener('mouseenter', stopAutoPlay);
    elements.slideshowContainer.addEventListener('mouseleave', () => {
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
