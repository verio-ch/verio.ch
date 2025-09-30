document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // 1. THEME TOGGLE (DARK/LIGHT MODE)
    // ============================================
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const lightIcon = 'light_mode';
    const darkIcon = 'dark_mode';

    // Function to set theme and save preference
    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (themeToggle) {
            const icon = themeToggle.querySelector('.material-symbols-outlined');
            if(icon) icon.textContent = theme === 'dark' ? darkIcon : lightIcon;
        }
    }

    // Check for saved theme in localStorage, or use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme(prefersDark ? 'dark' : 'light');
    }

    // Event listener for the toggle button
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });
    }

    // ============================================
    // 2. STAGGERED SCROLL ANIMATIONS
    // ============================================
    const handleScrollAnimation = () => {
        // Select all elements that are not yet visible
        const elementsToReveal = document.querySelectorAll('.reveal-on-scroll:not(.is-visible)');
        let delay = 0;

        elementsToReveal.forEach(el => {
            const rect = el.getBoundingClientRect();
            // If the element is in the viewport, apply the animation with a delay
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                setTimeout(() => {
                    el.classList.add('is-visible');
                }, delay);
                delay += 100; // Stagger by 100ms for the next visible element
            }
        });
    };
    
    // Throttling scroll event for performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        // Reset the animation handler in a timeout to run after the scroll event
        scrollTimeout = setTimeout(handleScrollAnimation, 20);
    });

    // Initial check on page load after a brief moment
    setTimeout(handleScrollAnimation, 100);

});