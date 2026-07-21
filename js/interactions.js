/* ============================================
   gzcangshu.com - Interactions JavaScript
   UI helpers, forms, navigation interactions
   ============================================ */

(function() {
    'use strict';

    const $ = (selector, context = document) => context.querySelector(selector);
    const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

    // ============================================
    // THEME TOGGLE (Optional)
    // ============================================
    const initThemeToggle = () => {
        const toggle = $('.theme-toggle');
        if (!toggle) return;

        const saved = localStorage.getItem('gzcangshu-theme');
        if (saved) {
            document.documentElement.setAttribute('data-theme', saved);
        }

        toggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme') || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('gzcangshu-theme', next);
        });
    };

    // ============================================
    // COOKIE BANNER
    // ============================================
    const initCookieBanner = () => {
        const banner = $('.cookie-banner');
        if (!banner) return;

        const accepted = localStorage.getItem('gzcangshu-cookie-accepted');
        if (!accepted) {
            setTimeout(() => {
                banner.classList.add('is-visible');
            }, 2000);
        }

        const acceptBtn = banner.querySelector('.cookie-accept');
        const rejectBtn = banner.querySelector('.cookie-reject');

        acceptBtn?.addEventListener('click', () => {
            localStorage.setItem('gzcangshu-cookie-accepted', 'true');
            banner.classList.remove('is-visible');
        });

        rejectBtn?.addEventListener('click', () => {
            localStorage.setItem('gzcangshu-cookie-accepted', 'rejected');
            banner.classList.remove('is-visible');
        });
    };

    // ============================================
    // TABS
    // ============================================
    const initTabs = () => {
        const tabContainers = $$('[data-tabs]');

        tabContainers.forEach(container => {
            const triggers = $$('.tab-trigger', container);
            const panels = $$('.tab-panel', container);

            triggers.forEach((trigger, index) => {
                trigger.addEventListener('click', () => {
                    triggers.forEach(t => t.classList.remove('active'));
                    panels.forEach(p => p.classList.remove('active'));

                    trigger.classList.add('active');
                    panels[index]?.classList.add('active');
                });
            });
        });
    };

    // ============================================
    // ACCORDION
    // ============================================
    const initAccordion = () => {
        const accordions = $$('.accordion-item');

        accordions.forEach(item => {
            const header = $('.accordion-header', item);
            if (!header) return;

            header.addEventListener('click', () => {
                const isOpen = item.classList.contains('is-open');

                // Close all
                accordions.forEach(a => a.classList.remove('is-open'));

                // Open current if it wasn't open
                if (!isOpen) {
                    item.classList.add('is-open');
                }
            });
        });
    };

    // ============================================
    // FAQ SEARCH/FILTER
    // ============================================
    const initFaqSearch = () => {
        const searchInput = $('.faq-search');
        const faqItems = $$('.faq-item');

        if (!searchInput || faqItems.length === 0) return;

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();

            faqItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(query) ? '' : 'none';
            });
        });
    };

    // ============================================
    // MODAL/DIALOG
    // ============================================
    const initModals = () => {
        const triggers = $$('[data-modal-open]');
        const closers = $$('[data-modal-close]');

        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = trigger.dataset.modalOpen;
                const modal = $(`#${modalId}`);
                if (modal) {
                    modal.classList.add('is-open');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        closers.forEach(closer => {
            closer.addEventListener('click', () => {
                const modal = closer.closest('.modal');
                if (modal) {
                    modal.classList.remove('is-open');
                    document.body.style.overflow = '';
                }
            });
        });

        $$('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('is-open');
                    document.body.style.overflow = '';
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                $$('.modal.is-open').forEach(modal => {
                    modal.classList.remove('is-open');
                    document.body.style.overflow = '';
                });
            }
        });
    };

    // ============================================
    // TOOLTIPS
    // ============================================
    const initTooltips = () => {
        const tooltipElements = $$('[data-tooltip]');

        tooltipElements.forEach(el => {
            const tooltip = document.createElement('span');
            tooltip.className = 'tooltip';
            tooltip.textContent = el.dataset.tooltip;
            el.appendChild(tooltip);
            el.classList.add('has-tooltip');
        });
    };

    // ============================================
    // PROGRESS BARS (animated)
    // ============================================
    const initProgressBars = () => {
        const bars = $$('.progress-bar');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const value = bar.dataset.value || 0;
                    const fill = $('.progress-fill', bar);
                    if (fill) {
                        fill.style.width = `${value}%`;
                    }
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });

        bars.forEach(b => observer.observe(b));
    };

    // ============================================
    // LANGUAGE / REGION SWITCH (basic)
    // ============================================
    const initLangSwitch = () => {
        const switchers = $$('.lang-switch');

        switchers.forEach(sw => {
            sw.addEventListener('click', () => {
                const current = sw.querySelector('.lang-current');
                const alt = sw.dataset.alt || 'EN';
                const cur = current?.textContent;

                if (current && cur) {
                    current.textContent = alt;
                    sw.dataset.alt = cur;
                }
            });
        });
    };

    // ============================================
    // SCROLL TO TOP BUTTON
    // ============================================
    const initScrollToTop = () => {
        const button = $('.scroll-to-top');
        if (!button) return;

        const handleScroll = () => {
            if (window.scrollY > 600) {
                button.classList.add('is-visible');
            } else {
                button.classList.remove('is-visible');
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        button.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    // ============================================
    // FORM VALIDATION HELPERS
    // ============================================
    const initFormValidation = () => {
        const forms = $$('form[data-validate]');

        forms.forEach(form => {
            const inputs = $$('input, textarea, select', form);

            inputs.forEach(input => {
                input.addEventListener('blur', () => validateField(input));
                input.addEventListener('input', () => {
                    if (input.classList.contains('is-invalid')) {
                        validateField(input);
                    }
                });
            });

            form.addEventListener('submit', (e) => {
                let isValid = true;
                inputs.forEach(input => {
                    if (!validateField(input)) isValid = false;
                });
                if (!isValid) e.preventDefault();
            });
        });

        const validateField = (input) => {
            const value = input.value.trim();
            const type = input.type;
            const required = input.hasAttribute('required');
            let valid = true;
            let message = '';

            if (required && !value) {
                valid = false;
                message = 'This field is required';
            } else if (type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                valid = false;
                message = 'Please enter a valid email address';
            } else if (type === 'url' && value && !/^https?:\/\/.+/.test(value)) {
                valid = false;
                message = 'Please enter a valid URL';
            }

            const errorEl = input.parentElement.querySelector('.form-error');

            if (valid) {
                input.classList.remove('is-invalid');
                if (errorEl) errorEl.remove();
            } else {
                input.classList.add('is-invalid');
                if (!errorEl) {
                    const err = document.createElement('span');
                    err.className = 'form-error';
                    err.textContent = message;
                    input.parentElement.appendChild(err);
                } else {
                    errorEl.textContent = message;
                }
            }

            return valid;
        };
    };

    // ============================================
    // LAZY LOADING IMAGES
    // ============================================
    const initLazyLoad = () => {
        const lazyImages = $$('img[data-src]');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            }, { rootMargin: '200px' });

            lazyImages.forEach(img => observer.observe(img));
        } else {
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    };

    // ============================================
    // SHARE BUTTONS
    // ============================================
    const initShareButtons = () => {
        $$('[data-share]').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const network = btn.dataset.share;
                const url = btn.dataset.url || window.location.href;
                const title = btn.dataset.title || document.title;

                let shareUrl = '';
                switch (network) {
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                        break;
                    case 'linkedin':
                        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                        break;
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                        break;
                    case 'copy':
                        try {
                            await navigator.clipboard.writeText(url);
                            const original = btn.textContent;
                            btn.textContent = 'Copied!';
                            setTimeout(() => { btn.textContent = original; }, 1500);
                        } catch (err) {}
                        return;
                }

                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
            });
        });
    };

    // ============================================
    // NEWSLETTER (inline)
    // ============================================
    const initNewsletter = () => {
        const forms = $$('.newsletter-form');

        forms.forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = form.querySelector('input[type="email"]');
                const status = form.querySelector('.newsletter-status');

                if (!email || !email.value) return;

                // Simulate API
                await new Promise(r => setTimeout(r, 800));

                if (status) {
                    status.textContent = '✓ Subscribed successfully!';
                    status.classList.add('success');
                }
                form.reset();
                setTimeout(() => {
                    if (status) {
                        status.textContent = '';
                        status.classList.remove('success');
                    }
                }, 4000);
            });
        });
    };

    // ============================================
    // INITIALIZATION
    // ============================================
    const init = () => {
        initThemeToggle();
        initCookieBanner();
        initTabs();
        initAccordion();
        initFaqSearch();
        initModals();
        initTooltips();
        initProgressBars();
        initLangSwitch();
        initScrollToTop();
        initFormValidation();
        initLazyLoad();
        initShareButtons();
        initNewsletter();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();