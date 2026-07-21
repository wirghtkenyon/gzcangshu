/* ============================================
   gzcangshu.com - Core JavaScript
   ============================================ */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        animationThreshold: 0.15,
        animationRootMargin: '0px 0px -100px 0px',
        headerScrollThreshold: 50,
        counterSpeed: 2000,
        mobileBreakpoint: 1024
    };

    // ============================================
    // UTILITIES
    // ============================================
    const $ = (selector, context = document) => context.querySelector(selector);
    const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

    const debounce = (fn, delay = 100) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    };

    const throttle = (fn, limit = 100) => {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                fn.apply(this, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    };

    // ============================================
    // HEADER SCROLL BEHAVIOR
    // ============================================
    const initHeader = () => {
        const header = $('.site-header');
        if (!header) return;

        const handleScroll = throttle(() => {
            if (window.scrollY > CONFIG.headerScrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, 50);

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    };

    // ============================================
    // MOBILE MENU
    // ============================================
    const initMobileMenu = () => {
        const toggle = $('.mobile-menu-toggle');
        const menu = $('.mobile-menu');
        const overlay = $('.mobile-menu-overlay');
        const closeBtn = $('.mobile-menu-close');

        if (!toggle || !menu) return;

        const open = () => {
            menu.classList.add('is-open');
            overlay?.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        };

        const close = () => {
            menu.classList.remove('is-open');
            overlay?.classList.remove('is-open');
            document.body.style.overflow = '';
        };

        toggle.addEventListener('click', open);
        closeBtn?.addEventListener('click', close);
        overlay?.addEventListener('click', close);

        // Close on link click
        $$('.mobile-menu a').forEach(link => {
            link.addEventListener('click', close);
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('is-open')) {
                close();
            }
        });
    };

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    const initSmoothScroll = () => {
        $$('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#' || href === '#!') return;

                const target = $(href);
                if (target) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    };

    // ============================================
    // ACTIVE NAV LINK
    // ============================================
    const initActiveNav = () => {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        $$('.nav-link').forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
                link.classList.add('active');
            }
        });
    };

    // ============================================
    // PARALLAX EFFECT
    // ============================================
    const initParallax = () => {
        if (window.innerWidth < CONFIG.mobileBreakpoint) return;

        const parallaxElements = $$('.parallax');
        if (parallaxElements.length === 0) return;

        const handleScroll = throttle(() => {
            const scrollY = window.scrollY;
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.speed) || 0.3;
                const offset = scrollY * speed;
                el.style.transform = `translate3d(0, ${offset}px, 0)`;
            });
        }, 16);

        window.addEventListener('scroll', handleScroll, { passive: true });
    };

    // ============================================
    // 3D TILT EFFECT
    // ============================================
    const initTilt = () => {
        const tiltElements = $$('.tilt-3d');
        if (tiltElements.length === 0) return;
        if (window.innerWidth < CONFIG.mobileBreakpoint) return;

        tiltElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            });
        });
    };

    // ============================================
    // RIPPLE EFFECT
    // ============================================
    const initRipple = () => {
        $$('.ripple-effect').forEach(el => {
            el.addEventListener('click', (e) => {
                const rect = el.getBoundingClientRect();
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
                ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
                el.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });
    };

    // ============================================
    // MAGNETIC EFFECT
    // ============================================
    const initMagnetic = () => {
        const magneticElements = $$('.magnetic');
        if (magneticElements.length === 0) return;
        if (window.innerWidth < CONFIG.mobileBreakpoint) return;

        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'translate(0, 0)';
            });
        });
    };

    // ============================================
    // CUSTOM CURSOR
    // ============================================
    const initCustomCursor = () => {
        if (window.innerWidth < CONFIG.mobileBreakpoint) return;
        if (window.matchMedia('(pointer: coarse)').matches) return;

        const dot = $('.cursor-dot');
        const ring = $('.cursor-ring');
        if (!dot || !ring) return;

        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = `${mouseX}px`;
            dot.style.top = `${mouseY}px`;
        });

        const animateRing = () => {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            ring.style.left = `${ringX}px`;
            ring.style.top = `${ringY}px`;
            requestAnimationFrame(animateRing);
        };
        animateRing();

        $$('a, button, .hover-target').forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('hover'));
            el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
        });
    };

    // ============================================
    // NEWSLETTER / CONTACT FORM
    // ============================================
    const initContactForm = () => {
        const form = $('.contact-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('[type="submit"]');
            const statusEl = form.querySelector('.form-status');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success
            if (statusEl) {
                statusEl.classList.add('success');
                statusEl.textContent = '✓ Message sent successfully. We will respond within 24 hours.';
            }

            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;

            setTimeout(() => {
                if (statusEl) {
                    statusEl.classList.remove('success');
                    statusEl.textContent = '';
                }
            }, 5000);
        });
    };

    // ============================================
    // NEWS FILTERS
    // ============================================
    const initNewsFilters = () => {
        const filters = $$('.news-filter');
        const cards = $$('.news-card');

        if (filters.length === 0) return;

        filters.forEach(filter => {
            filter.addEventListener('click', () => {
                const category = filter.dataset.category || 'all';

                filters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');

                cards.forEach(card => {
                    if (category === 'all' || card.dataset.category === category) {
                        card.style.display = '';
                        card.style.opacity = '0';
                        setTimeout(() => {
                            card.style.opacity = '1';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    };

    // ============================================
    // PAGE LOADER
    // ============================================
    const initPageLoader = () => {
        const loader = $('.page-loader');
        if (!loader) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('loaded');
                setTimeout(() => loader.remove(), 500);
            }, 300);
        });
    };

    // ============================================
    // YEAR UPDATE
    // ============================================
    const updateYear = () => {
        $$('[data-year]').forEach(el => {
            el.textContent = new Date().getFullYear();
        });
    };

    // ============================================
    // COPY TO CLIPBOARD
    // ============================================
    const initCopyEmail = () => {
        $$('[data-copy]').forEach(el => {
            el.addEventListener('click', async (e) => {
                e.preventDefault();
                const text = el.dataset.copy;
                try {
                    await navigator.clipboard.writeText(text);
                    const original = el.textContent;
                    el.textContent = 'Copied!';
                    setTimeout(() => {
                        el.textContent = original;
                    }, 1500);
                } catch (err) {
                    console.error('Copy failed:', err);
                }
            });
        });
    };

    // ============================================
    // RESIZE HANDLER
    // ============================================
    const handleResize = debounce(() => {
        // Reload tilt if needed
        initTilt();
    }, 200);

    // ============================================
    // INITIALIZATION
    // ============================================
    const init = () => {
        initHeader();
        initMobileMenu();
        initSmoothScroll();
        initActiveNav();
        initParallax();
        initTilt();
        initRipple();
        initMagnetic();
        initCustomCursor();
        initContactForm();
        initNewsFilters();
        initPageLoader();
        updateYear();
        initCopyEmail();

        window.addEventListener('resize', handleResize);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();