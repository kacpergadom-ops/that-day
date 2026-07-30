// Konfiguracja Twojego R2 i API
const R2_PUBLIC_URL = 'https://pub-a81a5897ebfe4ef1bbfaf94d1f0b0826.r2.dev';
const API_URL = 'https://that-day-api.kacper-gadom.workers.dev/photos';

let photos = [];
let currentIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    // Pobieramy zdjęcia z naszej bazy danych D1 przez Worker API
    fetchPhotos();

    // Obsługa interfejsu (Menu)
    const menuToggle = document.getElementById('menu-toggle');
    const closeMenu = document.getElementById('close-menu');
    const overlayMenu = document.getElementById('overlay-menu');

    if (menuToggle && overlayMenu) {
        menuToggle.addEventListener('click', () => overlayMenu.classList.add('active'));
    }
    
    if (closeMenu && overlayMenu) {
        closeMenu.addEventListener('click', () => overlayMenu.classList.remove('active'));
    }

    // Nawigacja strzałkami na ekranie
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (prevBtn) prevBtn.addEventListener('click', showPrevPhoto);
    if (nextBtn) nextBtn.addEventListener('click', showNextPhoto);

    // Nawigacja klawiaturą
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
            currentIndex = 0; // Zaczynamy od najnowszego zdjęcia
            renderPhoto(currentIndex);
        } else {
            console.log('Brak zdjęć w bazie.');
        }
    } catch (error) {
        console.error('Błąd pobierania zdjęć:', error);
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

    // Efekt przejścia (fade out dla zdjęcia i tła)
    if (photoMain) photoMain.style.opacity = '0.2';
    if (photoBlurBg) photoBlurBg.style.opacity = '0.3';

    setTimeout(() => {
        // Ustawiamy to samo zdjęcie w tle (rozmyte) oraz z przodu (całe)
        if (photoBlurBg) photoBlurBg.style.backgroundImage = `url('${photoUrl}')`;
        if (photoMain) photoMain.src = photoUrl;
        
        // Formatowanie daty (z opcją zapasową w razie braku spacji/myślników)
        let formattedDate = photo.photo_date;
        if (photo.photo_date && photo.photo_date.includes('-')) {
            formattedDate = photo.photo_date.split(' ')[0].split('-').reverse().join('.');
        }
        
        if (locationText) locationText.textContent = photo.location || 'Brak lokalizacji';
        if (dateText) dateText.textContent = formattedDate;

        // Powrót do pełnej widoczności (fade in)
        if (photoMain) photoMain.style.opacity = '1';
        if (photoBlurBg) photoBlurBg.style.opacity = '1';
    }, 200);
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
