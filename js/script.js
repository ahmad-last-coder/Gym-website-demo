// Preloader
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 1000);
});

// Touch device detection
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints;

if (isTouchDevice) {
    document.body.classList.add('touch-device');
    
    // Add touch-specific event listeners
    document.querySelectorAll('.feature-card, .stat-item, .membership-card').forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touched');
        });
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touched');
            }, 200);
        });
    });
}

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', function() {
    // Prevent body scroll when menu is open
    document.body.style.overflow = this.classList.contains('active') ? '' : 'hidden';
    
    this.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Toggle between bars and times icon
    const bars = this.querySelectorAll('span');
    if (this.classList.contains('active')) {
        bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'rotate(-45deg) translate(7px, -8px)';
    } else {
        bars[0].style.transform = 'rotate(0) translate(0, 0)';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'rotate(0) translate(0, 0)';
    }
});

// Close menu when clicking outside on mobile
document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768 && navLinks.classList.contains('active')) {
        if (!e.target.closest('.navbar') && !e.target.closest('.nav-links')) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
            const bars = menuToggle.querySelectorAll('span');
            bars[0].style.transform = 'rotate(0) translate(0, 0)';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'rotate(0) translate(0, 0)';
        }
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        if (navLinks.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
            const bars = menuToggle.querySelectorAll('span');
            bars[0].style.transform = 'rotate(0) translate(0, 0)';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'rotate(0) translate(0, 0)';
        }
    });
});

// Sticky Navbar on Scroll
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Animated Counter for Stats
const counters = document.querySelectorAll('.stat-number');
const speed = 200;

function animateCounters() {
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-count');
        const count = +counter.innerText;
        const increment = target / speed;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(animateCounters, 1);
        } else {
            counter.innerText = target;
        }
    });
}

// Initialize counters when section is in view
const statsSection = document.querySelector('.stats');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

observer.observe(statsSection);

// Testimonial Slider
let currentSlide = 0;
const slides = document.querySelectorAll('.testimonial-slide');
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    currentSlide = (index + totalSlides) % totalSlides;
    slides[currentSlide].classList.add('active');
}

document.querySelector('.next').addEventListener('click', () => {
    showSlide(currentSlide + 1);
});

document.querySelector('.prev').addEventListener('click', () => {
    showSlide(currentSlide - 1);
});

// Touch-friendly testimonial slider
const testimonialSlider = document.querySelector('.testimonial-slider');
if (testimonialSlider && isTouchDevice) {
    let touchStartX = 0;
    let touchEndX = 0;
    
    testimonialSlider.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, {passive: true});
    
    testimonialSlider.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, {passive: true});
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe left - next slide
            showSlide(currentSlide + 1);
        } else if (touchEndX > touchStartX + 50) {
            // Swipe right - previous slide
            showSlide(currentSlide - 1);
        }
    }
}

// Auto-rotate testimonials
setInterval(() => {
    showSlide(currentSlide + 1);
}, 5000);

// Smooth scrolling for all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Form Validation
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic validation
        let isValid = true;
        const inputs = this.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = 'var(--secondary)';
                isValid = false;
            } else {
                input.style.borderColor = '';
            }
        });
        
        if (isValid) {
            // Form submission would go here
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        } else {
            alert('Please fill in all required fields.');
        }
    });
});

// Optimize video loading for mobile
const heroVideo = document.querySelector('.hero-video video');
if (heroVideo) {
    // Check if mobile device
    if (window.innerWidth <= 768 || window.matchMedia('(hover: none)').matches) {
        // Replace video with poster image on mobile
        const posterSrc = heroVideo.getAttribute('poster') || heroVideo.parentElement.querySelector('img').src;
        heroVideo.parentElement.innerHTML = `<div class="hero-image" style="background-image: url('${posterSrc}')"></div>`;
    } else {
        // Lazy load video for desktop
        heroVideo.setAttribute('preload', 'none');
        heroVideo.setAttribute('autoplay', '');
        heroVideo.setAttribute('muted', '');
        heroVideo.setAttribute('loop', '');
        heroVideo.setAttribute('playsinline', '');
        
        // Load video after page load
        window.addEventListener('load', function() {
            heroVideo.setAttribute('src', heroVideo.getAttribute('data-src'));
            heroVideo.load();
        });
    }
}

// Particles.js Background for Hero Section
if (document.getElementById('particles-js') && !isTouchDevice) {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#00f0ff" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: "#00f0ff", opacity: 0.3, width: 1 },
            move: { enable: true, speed: 3, direction: "none", random: true, straight: false, out_mode: "out" }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" },
                resize: true
            },
            modes: {
                repulse: { distance: 100, duration: 0.4 },
                push: { particles_nb: 4 }
            }
        },
        retina_detect: true
    });
}

// Viewport height fix for mobile browsers
function setVhUnit() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Initial set
setVhUnit();

// Update on resize or orientation change
window.addEventListener('resize', setVhUnit);
window.addEventListener('orientationchange', setVhUnit);

// Apply to hero section
const hero = document.querySelector('.hero');
if (hero) {
    hero.style.height = 'calc(var(--vh, 1vh) * 100)';
}

// Initialize ScrollReveal with reduced motion for mobile
const scrollRevealConfig = {
    delay: 200,
    distance: '20px',
    origin: 'bottom',
    easing: 'cubic-bezier(0.5, 0, 0, 1)',
    interval: 100
};

// Reduce motion for mobile or if user prefers reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || isTouchDevice) {
    scrollRevealConfig.distance = '0';
    scrollRevealConfig.interval = 0;
    document.documentElement.style.setProperty('--animation-duration', '0.2s');
}

ScrollReveal().reveal('.wow', scrollRevealConfig);

// Make sure tap targets are properly sized on mobile
if (isTouchDevice) {
    document.querySelectorAll('a, button, input, .menu-toggle').forEach(element => {
        element.style.minHeight = '44px';
        element.style.minWidth = '44px';
    });
    
    // Adjust form inputs for mobile
    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.style.fontSize = '16px'; // Prevents iOS zoom
    });
}