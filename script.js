const R2_PUBLIC_URL = 'https://pub-a81a5897ebfe4ef1bbfaf94d1f0b0826.r2.dev';
const API_URL = 'https://that-day-api.kacper-gadom.workers.dev/photos';

let photos = [];
let currentIndex = 0;

// Lista wariantów dla napisu logo
const LOGO_VARIANTS = [
    'THAT DAY', 'that day', 'That Day', 'thatday', 
    'THATDAY', 'TH47 D4Y', 'th47 d4y', '7h47d4y', 
    '7HA7D4Y', 'Th4t D4y', 'THAT dAy'
];

document.addEventListener('DOMContentLoaded', () => {
    fetchPhotos();

    // Obsługa menu
    const menuToggle = document.getElementById('menu-toggle');
    const closeMenu = document.getElementById('close-menu');
    const overlayMenu = document.getElementById('overlay-menu');
    const menuContent = document.getElementById('menu-content');
    const calendarContent = document.getElementById('calendar-content');
    const linkCalendar = document.getElementById('link-calendar');
    const linkPhotos = document.getElementById('link-photos');
    const backToMenu = document.getElementById('back-to-menu');

    if (menuToggle && overlayMenu) {
        menuToggle.addEventListener('click', () => {
            overlayMenu.classList.add('active');
            showMenuMain();
        });
    }
    
    if (closeMenu && overlayMenu) {
        closeMenu.addEventListener('click', () => overlayMenu.classList.remove('active'));
    }

    if (linkCalendar) {
        linkCalendar.addEventListener('click', (e) => {
            e.preventDefault();
            showCalendarView();
        });
    }

    if (linkPhotos) {
        linkPhotos.addEventListener('click', (e) => {
            e.preventDefault();
            overlayMenu.classList.remove('active');
        });
    }

    if (backToMenu) {
        backToMenu.addEventListener('click', () => showMenuMain());
    }

    function showMenuMain() {
        menuContent.classList.remove('hidden');
        calendarContent.classList.add('hidden');
    }

    function showCalendarView() {
        menuContent.classList.add('hidden');
        calendarContent.classList.remove('hidden');
        renderCalendar();
    }

    // Nawigacja
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (prevBtn) prevBtn.addEventListener('click', showPrevPhoto);
    if (nextBtn) nextBtn.addEventListener('click', showNextPhoto);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') showPrevPhoto();
        if (e.key === 'ArrowRight') showNextPhoto();
        if (e.key === 'Escape' && overlayMenu) overlayMenu.classList.remove('active');
    });
});

async function fetchPhotos() {
    try {
        const response = await fetch(API_URL);
        photos = await response.json();

        if (photos && photos.length > 0) {
            currentIndex = 0;
            renderPhoto(currentIndex);
        } else {
            console.log('Brak zdjęć w bazie.');
        }
    } catch (error) {
        console.error('Błąd pobierania zdjęć:', error);
    }
}

function randomizeLogo() {
    const logoEl = document.getElementById('logo');
    if (logoEl) {
        const randomIndex = Math.floor(Math.random() * LOGO_VARIANTS.length);
        logoEl.textContent = LOGO_VARIANTS[randomIndex];
    }
}

function renderPhoto(index) {
    if (!photos[index]) return;

    const photo = photos[index];
    const photoMain = document.getElementById('photo-main');
    const photoBlurBg = document.getElementById('photo-blur-bg');
    const locationText = document.getElementById('location-text');
    const dateText = document.getElementById('date-text');

    const photoUrl = `${R2_PUBLIC_URL}/${photo.filename}`;

    // Zmieniamy styl logo przy każdym renderowaniu zdjęcia
    randomizeLogo();

    if (photoMain) photoMain.style.opacity = '0.2';
    if (photoBlurBg) photoBlurBg.style.opacity = '0.3';

    setTimeout(() => {
        if (photoBlurBg) photoBlurBg.style.backgroundImage = `url('${photoUrl}')`;
        if (photoMain) photoMain.src = photoUrl;
        
        let formattedDate = photo.photo_date;
        if (photo.photo_date && photo.photo_date.includes('-')) {
            formattedDate = photo.photo_date.split(' ')[0].split('-').reverse().join('.');
        }
        
        if (locationText) locationText.textContent = photo.location || 'Brak lokalizacji';
        if (dateText) dateText.textContent = formattedDate;

        if (photoMain) photoMain.style.opacity = '1';
        if (photoBlurBg) photoBlurBg.style.opacity = '1';
    }, 200);
}

function renderCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const overlayMenu = document.getElementById('overlay-menu');
    if (!calendarGrid) return;

    calendarGrid.innerHTML = '';

    photos.forEach((photo, idx) => {
        const photoUrl = `${R2_PUBLIC_URL}/${photo.filename}`;
        const formattedDate = photo.photo_date ? photo.photo_date.split(' ')[0].split('-').reverse().join('.') : '';

        const item = document.createElement('div');
        item.className = 'calendar-item';
        item.style.backgroundImage = `url('${photoUrl}')`;

        const badge = document.createElement('div');
        badge.className = 'calendar-date-badge';
        badge.textContent = formattedDate;

        item.appendChild(badge);

        item.addEventListener('click', () => {
            currentIndex = idx;
            renderPhoto(currentIndex);
            overlayMenu.classList.remove('active');
        });

        calendarGrid.appendChild(item);
    });
}

function showNextPhoto() {
    if (currentIndex < photos.length - 1) {
        currentIndex++;
        renderPhoto(currentIndex);
    }
}

function showPrevPhoto() {
    if (currentIndex > 0) {
        currentIndex--;
        renderPhoto(currentIndex);
    }
}
