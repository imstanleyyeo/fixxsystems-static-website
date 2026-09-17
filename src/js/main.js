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