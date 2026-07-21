/* ============================================
   gzcangshu.com - Animations JavaScript
   Scroll reveals, counters, and visual effects
   ============================================ */

(function() {
    'use strict';

    const $ = (selector, context = document) => context.querySelector(selector);
    const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ============================================
    // SCROLL REVEAL OBSERVER
    // ============================================
    const initScrollReveal = () => {
        if (prefersReducedMotion) {
            $$('.reveal, .reveal-fade, .reveal-scale, .reveal-left, .reveal-right').forEach(el => {
                el.classList.add('is-visible');
            });
            return;
        }

        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -80px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        $$('.reveal, .reveal-fade, .reveal-scale, .reveal-left, .reveal-right').forEach(el => {
            observer.observe(el);
        });
    };

    // ============================================
    // ANIMATED COUNTERS
    // ============================================
    const animateValue = (element, start, end, duration) => {
        const startTime = performance.now();
        const suffix = element.dataset.suffix || '';
        const prefix = element.dataset.prefix || '';

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (end - start) * eased);
            element.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    };

    const initCounters = () => {
        const counters = $$('[data-counter]');
        if (counters.length === 0) return;

        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const end = parseInt(el.dataset.counter, 10);
                    const duration = parseInt(el.dataset.duration, 10) || 2000;

                    if (!isNaN(end)) {
                        animateValue(el, 0, end, duration);
                    }

                    observer.unobserve(el);
                }
            });
        }, observerOptions);

        counters.forEach(counter => observer.observe(counter));
    };

    // ============================================
    // SCROLL PROGRESS BAR
    // ============================================
    const initScrollProgress = () => {
        const progressBar = $('.scroll-progress');
        if (!progressBar) return;

        const update = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = `${scrollPercent}%`;
        };

        window.addEventListener('scroll', update, { passive: true });
        update();
    };

    // ============================================
    // STAGGER ANIMATIONS
    // ============================================
    const initStaggerAnimations = () => {
        if (prefersReducedMotion) return;

        const staggerGroups = $$('[data-stagger]');

        const observerOptions = {
            threshold: 0.2
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, i) => {
                        child.style.animationDelay = `${i * 100}ms`;
                        child.classList.add('is-visible');
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        staggerGroups.forEach(group => observer.observe(group));
    };

    // ============================================
    // TEXT SCRAMBLE EFFECT
    // ============================================
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }

        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];

            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }

            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }

        update() {
            let output = '';
            let complete = 0;

            for (let i = 0, n = this.queue.length; i < n; i++) {
                const { from, to, start, end } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!this.queue[i].char || Math.random() < 0.28) {
                        this.queue[i].char = this.randomChar();
                    }
                    output += `<span style="color: #e82127;">${this.queue[i].char}</span>`;
                } else {
                    output += from;
                }
            }

            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }

        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    const initTextScramble = () => {
        $$('[data-scramble]').forEach(el => {
            const phrases = el.dataset.scramble.split('|');
            const fx = new TextScramble(el);
            let counter = 0;
            const next = () => {
                fx.setText(phrases[counter]).then(() => {
                    setTimeout(next, 2000);
                });
                counter = (counter + 1) % phrases.length;
            };
            next();
        });
    };

    // ============================================
    // PARTICLE EFFECT (Lightweight)
    // ============================================
    const initParticles = () => {
        const canvas = $('#hero-particles-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        const particleCount = 60;
        const connectionDistance = 120;

        const resize = () => {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
        };

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 1.5 + 0.5;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(232, 33, 39, 0.6)';
                ctx.fill();
            }
        }

        const init_particles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const drawConnections = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        const opacity = 1 - (distance / connectionDistance);
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(232, 33, 39, ${opacity * 0.2})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            drawConnections();
            requestAnimationFrame(animate);
        };

        window.addEventListener('resize', () => {
            resize();
            init_particles();
        });

        resize();
        init_particles();
        animate();
    };

    // ============================================
    // MOUSE MOVE PARALLAX
    // ============================================
    const initMouseParallax = () => {
        if (window.innerWidth < 1024) return;
        if (prefersReducedMotion) return;

        const elements = $$('[data-mouse-parallax]');
        if (elements.length === 0) return;

        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX - window.innerWidth / 2) / 50;
            const y = (e.clientY - window.innerHeight / 2) / 50;

            elements.forEach(el => {
                const speed = parseFloat(el.dataset.mouseParallax) || 1;
                el.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
            });
        });
    };

    // ============================================
    // NUMBER TICKER ANIMATION
    // ============================================
    const initNumberTicker = () => {
        const tickers = $$('.number-ticker');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.classList.add('is-visible');
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        tickers.forEach(t => observer.observe(t));
    };

    // ============================================
    // SECTION VISIBILITY ANIMATIONS
    // ============================================
    const initSectionAnimations = () => {
        if (prefersReducedMotion) return;

        const sections = $$('[data-animate-section]');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-visible');
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(s => observer.observe(s));
    };

    // ============================================
    // INITIALIZATION
    // ============================================
    const init = () => {
        initScrollReveal();
        initCounters();
        initScrollProgress();
        initStaggerAnimations();
        initTextScramble();
        initParticles();
        initMouseParallax();
        initNumberTicker();
        initSectionAnimations();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();