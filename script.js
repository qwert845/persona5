/* ========================================
   PERSONA 5 STYLE UI - INTERACTIONS
   ======================================== */

(function () {
    'use strict';

    // ─── DOM REFERENCES ───
    const introOverlay = document.getElementById('intro-overlay');
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menu-toggle');
    const navList = document.getElementById('nav-list');
    const navLinks = document.querySelectorAll('.header__nav-link');
    const screenWipe = document.getElementById('screen-wipe');
    const contactForm = document.getElementById('contact-form');

    // ─── STATE ───
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;
    let isWiping = false;

    // ═══════════════════════════════════════
    // INTRO SEQUENCE
    // ═══════════════════════════════════════
    function runIntro() {
        document.body.style.overflow = 'hidden';

        const lines = document.querySelectorAll('.intro-text__line');

        // Stagger text reveal
        lines.forEach((line, i) => {
            const delay = parseInt(line.dataset.delay) || i * 200;
            setTimeout(() => line.classList.add('show'), 300 + delay);
        });

        // Close intro after all text shown
        setTimeout(() => {
            introOverlay.classList.add('closing');
        }, 1800);

        setTimeout(() => {
            introOverlay.classList.add('done');
            document.body.style.overflow = '';
        }, 2800);
    }

    // ═══════════════════════════════════════
    // CUSTOM CURSOR
    // ═══════════════════════════════════════
    function initCursor() {
        if (window.matchMedia('(max-width: 768px)').matches) return;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Hover detection for interactive elements
        const hoverTargets = document.querySelectorAll('a, button, .char-card, .gallery__item, .news-card, input, textarea');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('hover');
                cursorRing.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('hover');
                cursorRing.classList.remove('hover');
            });
        });

        animateCursor();
    }

    function animateCursor() {
        // Smooth follow with lerp
        dotX += (mouseX - dotX) * 0.3;
        dotY += (mouseY - dotY) * 0.3;
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;

        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';

        requestAnimationFrame(animateCursor);
    }

    // ═══════════════════════════════════════
    // HEADER SCROLL BEHAVIOR
    // ═══════════════════════════════════════
    function initHeader() {
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY > 80) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            lastScroll = scrollY;
        });
    }

    // ═══════════════════════════════════════
    // MOBILE MENU
    // ═══════════════════════════════════════
    function initMobileMenu() {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navList.classList.toggle('open');
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navList.classList.remove('open');
            });
        });
    }

    // ═══════════════════════════════════════
    // NAVIGATION WITH WIPE TRANSITION
    // ═══════════════════════════════════════
    function initNavigation() {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');

                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Trigger wipe transition
                triggerWipe(() => {
                    const target = document.querySelector(targetId);
                    if (target) {
                        const offsetTop = target.offsetTop - 60;
                        window.scrollTo({ top: offsetTop, behavior: 'instant' });
                    }
                });
            });
        });
    }

    function triggerWipe(callback) {
        if (isWiping) return;
        isWiping = true;

        screenWipe.classList.add('active');

        // Execute callback at peak of wipe
        setTimeout(() => {
            if (callback) callback();
        }, 450);

        // Remove wipe class after full animation
        setTimeout(() => {
            screenWipe.classList.remove('active');
            // Reset panel transforms
            const panels = screenWipe.querySelectorAll('.screen-wipe__panel');
            panels.forEach(panel => {
                panel.style.transform = '';
            });
            isWiping = false;
        }, 1100);
    }

    // ═══════════════════════════════════════
    // SCROLL REVEAL (IntersectionObserver)
    // ═══════════════════════════════════════
    function initScrollReveal() {
        const revealItems = document.querySelectorAll('.reveal-item, .char-card');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger reveals
                    const el = entry.target;
                    const siblings = [...el.parentElement.children];
                    const idx = siblings.indexOf(el);
                    setTimeout(() => {
                        el.classList.add('revealed');
                    }, idx * 150);
                    observer.unobserve(el);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealItems.forEach(item => observer.observe(item));
    }

    // ═══════════════════════════════════════
    // CARD TILT EFFECT
    // ═══════════════════════════════════════
    function initCardTilt() {
        const cards = document.querySelectorAll('[data-tilt]');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
                card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                setTimeout(() => {
                    card.style.transition = '';
                }, 500);
            });

            card.addEventListener('mouseenter', () => {
                card.style.transition = 'none';
            });
        });
    }

    // ═══════════════════════════════════════
    // ACTIVE NAV ON SCROLL
    // ═══════════════════════════════════════
    function initActiveNavOnScroll() {
        const sections = document.querySelectorAll('.section');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.dataset.section === id);
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-80px 0px 0px 0px'
        });

        sections.forEach(sec => observer.observe(sec));
    }

    // ═══════════════════════════════════════
    // PARALLAX HERO SHAPES
    // ═══════════════════════════════════════
    function initParallax() {
        const shapes = document.querySelectorAll('.hero__shape');

        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;

            shapes.forEach((shape, i) => {
                const speed = (i + 1) * 15;
                shape.style.transform = shape.style.transform || '';
                const baseTransform = getComputedStyle(shape).transform;

                shape.style.translate = `${x * speed}px ${y * speed}px`;
            });
        });
    }

    // ═══════════════════════════════════════
    // CONTACT FORM
    // ═══════════════════════════════════════
    function initContactForm() {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('.btn--submit');
            const originalText = btn.querySelector('.btn__text').textContent;

            btn.querySelector('.btn__text').textContent = 'CALLING CARD SENT!';
            btn.style.background = 'var(--color-primary-dark)';

            // Trigger a small wipe effect
            triggerWipe();

            setTimeout(() => {
                btn.querySelector('.btn__text').textContent = originalText;
                btn.style.background = '';
                contactForm.reset();
            }, 2000);
        });
    }

    // ═══════════════════════════════════════
    // GLITCH TEXT EFFECT (RANDOM TRIGGER)
    // ═══════════════════════════════════════
    function initGlitchEffect() {
        const glitchEls = document.querySelectorAll('[data-glitch]');

        function triggerGlitch() {
            glitchEls.forEach(el => {
                el.style.animation = 'none';
                el.offsetHeight; // reflow
                el.style.animation = '';
            });
        }

        // Trigger glitch periodically
        setInterval(triggerGlitch, 5000);
    }

    // ═══════════════════════════════════════
    // HERO TEXT ANIMATION (STAGGERED ENTRANCE)
    // ═══════════════════════════════════════
    function initHeroAnimation() {
        const heroContent = document.querySelector('.hero__content');
        if (!heroContent) return;

        // Wait for intro to finish
        setTimeout(() => {
            heroContent.style.opacity = '1';

            const titleLines = heroContent.querySelectorAll('.hero__title-line');
            const subtitle = heroContent.querySelector('.hero__subtitle');
            const cta = heroContent.querySelector('.hero__cta');

            // Stagger entrance
            titleLines.forEach((line, i) => {
                line.style.opacity = '0';
                line.style.transform += ' translateY(40px)';
                setTimeout(() => {
                    line.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                    line.style.opacity = '1';
                    line.style.transform = line.style.transform.replace('translateY(40px)', 'translateY(0)');
                }, 200 + i * 200);
            });

            if (subtitle) {
                subtitle.style.opacity = '0';
                setTimeout(() => {
                    subtitle.style.transition = 'opacity 0.8s ease';
                    subtitle.style.opacity = '1';
                }, 800);
            }

            if (cta) {
                cta.style.opacity = '0';
                cta.style.transform += ' translateY(20px)';
                setTimeout(() => {
                    cta.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                    cta.style.opacity = '1';
                    cta.style.transform = cta.style.transform.replace('translateY(20px)', 'translateY(0)');
                }, 1000);
            }
        }, 2800);
    }

    // ═══════════════════════════════════════
    // BACKGROUND NOISE GRAIN EFFECT
    // ═══════════════════════════════════════
    function initGrainEffect() {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.04;
      mix-blend-mode: overlay;
    `;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let w, h;

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }

        function renderGrain() {
            const imageData = ctx.createImageData(w, h);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const val = Math.random() * 255;
                data[i] = val;
                data[i + 1] = val;
                data[i + 2] = val;
                data[i + 3] = 255;
            }

            ctx.putImageData(imageData, 0, 0);
            requestAnimationFrame(renderGrain);
        }

        window.addEventListener('resize', resize);
        resize();
        renderGrain();
    }

    // ═══════════════════════════════════════
    // INITIALIZE EVERYTHING
    // ═══════════════════════════════════════
    function init() {
        runIntro();
        initCursor();
        initHeader();
        initMobileMenu();
        initNavigation();
        initScrollReveal();
        initCardTilt();
        initActiveNavOnScroll();
        initParallax();
        initContactForm();
        initGlitchEffect();
        initHeroAnimation();
        initGrainEffect();
    }

    // ─── DOM READY ───
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
