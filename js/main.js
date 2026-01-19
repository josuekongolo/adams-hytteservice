/**
 * Adam's Hus&Hytteservice - Main JavaScript
 * Handles navigation, form submission, and UI interactions
 */

(function() {
    'use strict';

    // =========================================
    // DOM Elements
    // =========================================
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    const navOverlay = document.querySelector('.nav-overlay');
    const navLinks = document.querySelectorAll('.nav__link');
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    // =========================================
    // Mobile Navigation
    // =========================================
    function toggleNav() {
        const isOpen = nav.classList.contains('active');

        nav.classList.toggle('active');
        navOverlay.classList.toggle('active');
        navToggle.classList.toggle('active');

        // Update ARIA attributes
        navToggle.setAttribute('aria-expanded', !isOpen);

        // Prevent body scroll when menu is open
        document.body.style.overflow = isOpen ? '' : 'hidden';
    }

    function closeNav() {
        nav.classList.remove('active');
        navOverlay.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    // Event listeners for navigation
    if (navToggle) {
        navToggle.addEventListener('click', toggleNav);
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', closeNav);
    }

    // Close nav when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', closeNav);
    });

    // Close nav on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            closeNav();
        }
    });

    // Close nav on window resize if open
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && nav.classList.contains('active')) {
            closeNav();
        }
    });

    // =========================================
    // Contact Form Handling
    // =========================================
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                address: document.getElementById('address').value,
                serviceType: document.getElementById('serviceType').value,
                description: document.getElementById('description').value,
                wantCall: document.getElementById('wantCall').checked,
                timestamp: new Date().toISOString()
            };

            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<span>Sender...</span>';

            try {
                // In production, this would send to your API/Resend endpoint
                // For now, we'll simulate a successful submission
                await simulateFormSubmission(formData);

                // Show success message
                contactForm.style.display = 'none';
                formSuccess.classList.add('show');

                // Scroll to success message
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

                // Log form data (for development)
                console.log('Form submitted:', formData);

            } catch (error) {
                console.error('Form submission error:', error);
                alert('Beklager, noe gikk galt. Vennligst prøv igjen eller ring oss direkte på 900 12 345.');

                // Reset button
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            }
        });
    }

    // Simulate form submission (replace with actual API call)
    function simulateFormSubmission(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 95% success rate
                if (Math.random() > 0.05) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Simulated error'));
                }
            }, 1500);
        });
    }

    // =========================================
    // Smooth Scrolling for Anchor Links
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#"
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();

                // Get header height for offset
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;

                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =========================================
    // Header Scroll Behavior
    // =========================================
    let lastScrollY = window.scrollY;
    const header = document.querySelector('.header');

    if (header) {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            // Add shadow on scroll
            if (currentScrollY > 10) {
                header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.07)';
            } else {
                header.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
            }

            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    // =========================================
    // Form Validation Enhancement
    // =========================================
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');

    formInputs.forEach(input => {
        // Add validation feedback on blur
        input.addEventListener('blur', function() {
            if (this.required && !this.value.trim()) {
                this.style.borderColor = 'var(--color-error)';
            } else if (this.type === 'email' && this.value && !isValidEmail(this.value)) {
                this.style.borderColor = 'var(--color-error)';
            } else {
                this.style.borderColor = '';
            }
        });

        // Clear error state on focus
        input.addEventListener('focus', function() {
            this.style.borderColor = 'var(--color-primary)';
        });

        // Clear error state on input
        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = '';
            }
        });
    });

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // =========================================
    // Phone Number Formatting
    // =========================================
    const phoneInput = document.getElementById('phone');

    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            // Remove non-digit characters except +
            let value = this.value.replace(/[^\d+]/g, '');

            // Format Norwegian phone numbers
            if (value.startsWith('+47')) {
                value = value.substring(0, 11); // +47 XXX XX XXX
            } else if (value.startsWith('47') && value.length > 2) {
                value = '+' + value.substring(0, 10);
            } else if (!value.startsWith('+')) {
                value = value.substring(0, 8); // Norwegian numbers without country code
            }

            this.value = value;
        });
    }

    // =========================================
    // Lazy Loading for Images (if needed)
    // =========================================
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px'
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }

    // =========================================
    // Scroll-based Animations
    // =========================================
    if ('IntersectionObserver' in window) {
        const animatedElements = document.querySelectorAll('.service-card, .package-card, .feature, .pain-points__item');

        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            animationObserver.observe(el);
        });
    }

    // =========================================
    // Service Worker Registration (for PWA)
    // =========================================
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registered:', registration.scope);
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed:', error);
                });
        });
    }

    // =========================================
    // Click-to-call tracking (Analytics)
    // =========================================
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function() {
            // Track phone clicks for analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'Contact',
                    'event_label': 'Phone Click',
                    'value': 1
                });
            }
            console.log('Phone click tracked');
        });
    });

    // =========================================
    // Email link tracking (Analytics)
    // =========================================
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', function() {
            // Track email clicks for analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                    'event_category': 'Contact',
                    'event_label': 'Email Click',
                    'value': 1
                });
            }
            console.log('Email click tracked');
        });
    });

    // =========================================
    // Print functionality
    // =========================================
    window.printPage = function() {
        window.print();
    };

    // =========================================
    // Utility: Debounce function
    // =========================================
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

    // =========================================
    // Console welcome message
    // =========================================
    console.log('%cAdam\'s Hus&Hytteservice', 'color: #2D5A3D; font-size: 20px; font-weight: bold;');
    console.log('%cGrunnarbeid & Hytteservice i Oppdal', 'color: #5C6B73; font-size: 14px;');
    console.log('%cKontakt: 900 12 345', 'color: #D4A84B; font-size: 12px;');

})();
