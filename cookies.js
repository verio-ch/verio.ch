document.addEventListener('DOMContentLoaded', () => {
    const COOKIE_NAME = 'verio_consent';

    // DOM Elements
    const banner = document.getElementById('cookie-consent-banner');
    const modalOverlay = document.getElementById('cookie-settings-modal');
    const acceptAllBtn = document.getElementById('accept-all-cookies');
    const declineBtn = document.getElementById('decline-cookies');
    const customizeBtn = document.getElementById('customize-cookies');
    const savePrefsBtn = document.getElementById('save-cookie-prefs');
    const analyticsToggle = document.getElementById('analytics-toggle');
    const manageLink = document.getElementById('manage-cookies-link');

    // --- Helper Functions ---
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    const setCookie = (name, value, days) => {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = `; expires=${date.toUTCString()}`;
        }
        document.cookie = `${name}=${value || ''}${expires}; path=/; SameSite=Lax`;
    };

    // --- Analytics Placeholder ---
    const initializeAnalytics = () => {
        console.log('Analytics consent given. Initializing scripts...');
        // Google tag (gtag.js)
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-MP5MVXZ6C2';
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-MP5MVXZ6C2');
        `;
        document.head.appendChild(script2);
    };

    // --- Core Logic ---
    const checkConsent = () => {
        const consentCookie = getCookie(COOKIE_NAME);

        if (!consentCookie) {
            banner.style.display = 'flex';
            return;
        }

        try {
            const consent = JSON.parse(consentCookie);
            if (consent.analytics) {
                initializeAnalytics();
            }
        } catch (e) {
            console.error('Could not parse cookie consent:', e);
            banner.style.display = 'flex';
        }
    };

    const hideBanner = () => {
        if (banner) banner.style.display = 'none';
    };

    const hideModal = () => {
        if (modalOverlay) modalOverlay.style.display = 'none';
    };

    const openCookieSettings = () => {
        hideBanner();
        const consentCookie = getCookie(COOKIE_NAME);
        let currentConsent = { analytics: true }; // Default to checked if no cookie
        if (consentCookie) {
            try {
                currentConsent = JSON.parse(consentCookie);
            } catch (e) {
                console.error('Could not parse cookie for settings:', e);
            }
        }
        if (analyticsToggle) {
            analyticsToggle.checked = currentConsent.analytics;
        }
        if (modalOverlay) modalOverlay.style.display = 'flex';
    };

    // --- Event Listeners ---
    if (acceptAllBtn) {
        acceptAllBtn.addEventListener('click', () => {
            const consent = { necessary: true, analytics: true };
            setCookie(COOKIE_NAME, JSON.stringify(consent), 365);
            hideBanner();
            initializeAnalytics();
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            const consent = { necessary: true, analytics: false };
            setCookie(COOKIE_NAME, JSON.stringify(consent), 365);
            hideBanner();
        });
    }

    if (customizeBtn) {
        customizeBtn.addEventListener('click', openCookieSettings);
    }

    if (manageLink) {
        manageLink.addEventListener('click', (e) => {
            e.preventDefault();
            openCookieSettings();
        });
    }

    if (savePrefsBtn) {
        savePrefsBtn.addEventListener('click', () => {
            const hasAnalyticsConsent = analyticsToggle ? analyticsToggle.checked : false;
            const consent = { necessary: true, analytics: hasAnalyticsConsent };
            setCookie(COOKIE_NAME, JSON.stringify(consent), 365);
            // Reload the page to apply changes cleanly
            location.reload();
        });
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) {
                hideModal();
            }
        });
    }

    // --- Initialisation ---
    checkConsent();
});