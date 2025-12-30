(function () {
    'use strict';

    const CONFIG = {
        IMAGE_COUNT: 30,
        API_URL: '/api/click',
        TURNSTILE_SITE_KEY: window.MLEM_CONFIG?.TURNSTILE_SITE_KEY || '',
        CLICK_COOLDOWN: 100,
    };

    const MLEM_EMOJIS = [
        '😺',
        '😸',
        '😻',
        '😽',
        '🐱',
        '😹',
        '😼',
        '🙀',
        '😿',
        '😾',
        '👅',
        '🐈',
        '🐈‍⬛',
    ];

    let sessionCount = 0;
    let totalCount = 0;
    let lastClickTime = 0;
    let turnstileToken = null;
    let pendingClicks = 0;
    let syncTimeout = null;
    const SYNC_DELAY = 500;

    const button = document.getElementById('mlem-button');
    const sessionCountEl = document.getElementById('session-count');
    const totalCountEl = document.getElementById('total-count');
    const mlemContainer = document.getElementById('mlem-container');
    const turnstileContainer = document.getElementById('turnstile-container');
    const themeToggle = document.getElementById('theme-toggle');

    const mlemSound = new Audio('/sound/mlem.mp3');
    mlemSound.preload = 'auto';

    function initTurnstile() {
        if (typeof turnstile === 'undefined') {
            setTimeout(initTurnstile, 100);
            return;
        }

        turnstile.render(turnstileContainer, {
            sitekey: CONFIG.TURNSTILE_SITE_KEY,
            callback: function (token) {
                turnstileToken = token;
            },
            'expired-callback': function () {
                turnstileToken = null;
                turnstile.reset();
            },
            'error-callback': function () {
                console.error('Turnstile error');
                turnstileToken = null;
            },
        });
    }

    async function fetchTotalCount() {
        try {
            const response = await fetch('/api/count');
            if (response.ok) {
                const data = await response.json();
                totalCount = data.count || 0;
                totalCountEl.textContent = formatNumber(totalCount);
            }
        } catch (error) {
            console.error('Failed to fetch total count:', error);
            totalCountEl.textContent = '?';
        }
    }

    function formatNumber(num) {
        return num.toLocaleString();
    }

    function getRandomMlem() {
        if (CONFIG.IMAGE_COUNT > 0) {
            const imageNum = Math.floor(Math.random() * CONFIG.IMAGE_COUNT) + 1;
            const paddedNum = String(imageNum).padStart(3, '0');
            const img = document.createElement('img');
            img.src = `/images/mlem-${paddedNum}.png`;
            img.alt = 'mlem';
            return img;
        } else {
            return document.createTextNode(
                MLEM_EMOJIS[Math.floor(Math.random() * MLEM_EMOJIS.length)]
            );
        }
    }

    function spawnMlem() {
        const mlem = document.createElement('div');
        mlem.className = 'mlem-float';
        mlem.appendChild(getRandomMlem());

        const padding = 50;
        const randomX = padding + Math.random() * (window.innerWidth - padding * 2);
        const randomY = window.innerHeight * 0.5 + Math.random() * (window.innerHeight * 0.4);

        mlem.style.left = `${randomX}px`;
        mlem.style.top = `${randomY}px`;
        mlem.style.animationDuration = `${2 + Math.random() * 1.5}s`;

        const rotateAngle = (Math.random() > 0.5 ? 1 : -1) * (15 + Math.random() * 20);
        mlem.style.setProperty('--rotate-end', `${rotateAngle}deg`);

        mlemContainer.appendChild(mlem);

        mlem.addEventListener('animationend', () => {
            mlem.remove();
        });
    }

    function playSound() {
        const sound = mlemSound.cloneNode();
        sound.volume = 0.5;
        sound.play().catch(() => {});
    }

    async function syncClicks() {
        if (pendingClicks === 0 || !turnstileToken) {
            return;
        }

        const clicksToSync = pendingClicks;
        pendingClicks = 0;

        try {
            const response = await fetch(CONFIG.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: turnstileToken,
                    count: clicksToSync,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                totalCount = data.count || totalCount;
                totalCountEl.textContent = formatNumber(totalCount);
            }

            if (typeof turnstile !== 'undefined') {
                turnstile.reset();
            }
        } catch (error) {
            console.error('Failed to sync clicks:', error);
            pendingClicks += clicksToSync;
        }
    }

    function scheduleSyncClicks() {
        if (syncTimeout) {
            clearTimeout(syncTimeout);
        }
        syncTimeout = setTimeout(() => {
            syncClicks();
            syncTimeout = null;
        }, SYNC_DELAY);
    }

    function handleClick() {
        const now = Date.now();

        if (now - lastClickTime < CONFIG.CLICK_COOLDOWN) {
            return;
        }
        lastClickTime = now;

        playSound();
        spawnMlem();
        sessionCount++;
        sessionCountEl.textContent = formatNumber(sessionCount);

        totalCount++;
        totalCountEl.textContent = formatNumber(totalCount);

        pendingClicks++;
        scheduleSyncClicks();
    }

    button.addEventListener('click', handleClick);

    button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
        }
    });

    function getPreferredTheme() {
        const stored = localStorage.getItem('theme');
        if (stored) {
            return stored;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    function toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        setTheme(next);
    }

    themeToggle.addEventListener('click', toggleTheme);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    setTheme(getPreferredTheme());

    document.addEventListener('DOMContentLoaded', () => {
        initTurnstile();
        fetchTotalCount();
    });

    document.addEventListener(
        'click',
        function preloadSound() {
            mlemSound.load();
            document.removeEventListener('click', preloadSound);
        },
        { once: true }
    );
})();
