import "../scss/main.scss";

console.log('Main JS loaded.');

/* Offcanvas Menu */
document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('toggle');
    const offCanvas = document.getElementById('offCanvas');
    const overlay = document.getElementById('overlay');
    const body = document.body;
    const closeButton = document.getElementById('drawerClose');

    if (closeButton) {
        closeButton.addEventListener('click', closeMenu);
    }

    if (!toggleButton || !offCanvas || !overlay) return;

    function toggleMenu(e) {
        if (e) e.preventDefault();
        const isActive = offCanvas.classList.toggle('active');
        overlay.classList.toggle('active');
        body.classList.toggle('no-scroll', isActive);
    }

    function closeMenu() {
        offCanvas.classList.remove('active');
        overlay.classList.remove('active');
        body.classList.remove('no-scroll');
    }

    toggleButton.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);

    window.addEventListener('resize', function () {
        if (window.innerWidth > 992 && offCanvas.classList.contains('active')) {
            closeMenu();
        }
    });
});

/* Intersection Observer */
document.addEventListener('DOMContentLoaded', () => {
    const textItems = document.querySelectorAll('.c-service-text-item');
    const images = document.querySelectorAll('.c-service-img');

    if (!textItems.length || !images.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -30% 0px', // Triggers when text is near center viewport
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const serviceIndex = entry.target.getAttribute('data-service');

                // Remove active class from all images
                images.forEach(img => img.classList.remove('is-active'));

                // Activate corresponding sticky image
                const activeImg = document.getElementById(`img-service-${serviceIndex}`);
                if (activeImg) {
                    activeImg.classList.add('is-active');
                }
            }
        });
    }, observerOptions);

    textItems.forEach(item => observer.observe(item));
});

// tabs.js - Universal Tab Switcher Module
export function initTabs() {
    // Find all tab containers on the page
    const tabContainers = document.querySelectorAll('[data-tabs]');

    tabContainers.forEach((container) => {
        const tabList = container.querySelector('[role="tablist"]');
        if (!tabList) return;

        const tabs = tabList.querySelectorAll('[role="tab"]');

        tabs.forEach((tab) => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();

                const targetPanelId = tab.getAttribute('aria-controls');
                if (!targetPanelId) return;

                // 1. Deactivate all tabs in this container
                tabs.forEach((t) => {
                    t.classList.remove('is-active');
                    t.setAttribute('aria-selected', 'false');
                });

                // 2. Activate clicked tab
                tab.classList.add('is-active');
                tab.setAttribute('aria-selected', 'true');

                // 3. Hide all panels inside this tab system
                const panels = container.querySelectorAll('[role="tabpanel"]');
                panels.forEach((panel) => {
                    panel.classList.remove('is-active');
                });

                // 4. Show target panel
                const targetPanel = container.querySelector(`#${targetPanelId}`);
                if (targetPanel) {
                    targetPanel.classList.add('is-active');
                }
            });
        });
    });
}

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', initTabs);

/* Project Carousel Initialization */
export function initProjectCarousel() {
    const carousels = document.querySelectorAll('.js-project-carousel');

    carousels.forEach((carousel) => {
        const heroSection = carousel.closest('.c-hero-project') || carousel.closest('.c-hero') || document;
        const track = carousel.querySelector('.js-carousel-track');
        const slides = carousel.querySelectorAll('.c-project-carousel__slide');
        const prevBtn = heroSection.querySelector('.js-carousel-prev');
        const nextBtn = heroSection.querySelector('.js-carousel-next');
        const dots = heroSection.querySelectorAll('.c-project-carousel__dot');
        const currentNum = heroSection.querySelector('.js-carousel-current');
        const totalNum = heroSection.querySelector('.js-carousel-total');

        if (!track || slides.length === 0) return;

        let currentIndex = 0;
        const totalSlides = slides.length;

        // Initialize Total Counter
        if (totalNum) {
            totalNum.textContent = String(totalSlides).padStart(2, '0');
        }

        // Main Slide Update Function
        function goToSlide(index) {
            // Handle Boundary Wraparound
            if (index < 0) {
                currentIndex = totalSlides - 1;
            } else if (index >= totalSlides) {
                currentIndex = 0;
            } else {
                currentIndex = index;
            }

            const viewportWidth = carousel.querySelector('.c-hero-project__viewport')?.offsetWidth || window.innerWidth;
            const slideWidth = slides[0].offsetWidth;

            // Calculate center alignment offset: (Viewport - Slide) / 2
            const centerOffset = (viewportWidth - slideWidth) / 2;

            // Apply exact offset shift to position active slide dead-center
            const translateX = centerOffset - (currentIndex * slideWidth);
            track.style.transform = `translateX(${translateX}px)`;

            // Update Slide Active Classes (Lightens active slide, darkens side peeks)
            slides.forEach((slide, i) => {
                const isActive = i === currentIndex;
                slide.classList.toggle('is-active', isActive);
            });

            // Update Counter
            if (currentNum) {
                currentNum.textContent = String(currentIndex + 1).padStart(2, '0');
            }

            // Update Active Dot States
            dots.forEach((dot, i) => {
                const isActive = i === currentIndex;
                dot.classList.toggle('is-active', isActive);
                dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });
        }

        // Button Event Handlers
        if (nextBtn) {
            nextBtn.onclick = (e) => {
                e.preventDefault();
                goToSlide(currentIndex + 1);
            };
        }

        if (prevBtn) {
            prevBtn.onclick = (e) => {
                e.preventDefault();
                goToSlide(currentIndex - 1);
            };
        }

        // Dot Navigation Event Handlers
        dots.forEach((dot, index) => {
            dot.onclick = (e) => {
                e.preventDefault();
                goToSlide(index);
            };
        });

        // Window Resize Handler (Recalculates center position on screen resize)
        window.addEventListener('resize', () => {
            goToSlide(currentIndex);
        });

        // Touch / Swipe Support for Mobile
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchStartX - touchEndX > swipeThreshold) {
                goToSlide(currentIndex + 1);
            } else if (touchEndX - touchStartX > swipeThreshold) {
                goToSlide(currentIndex - 1);
            }
        }

        // Set Initial Active State & Perfect Center Position
        goToSlide(0);
    });
}

// Auto-initialize on DOM Ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProjectCarousel);
} else {
    initProjectCarousel();
}