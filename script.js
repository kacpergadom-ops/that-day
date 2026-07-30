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

    menuToggle.addEventListener('click', () => overlayMenu.classList.add('active'));
    closeMenu.addEventListener('click', () => overlayMenu.classList.remove('active'));

    // Nawigacja strzałkami na ekranie
    document.getElementById('prev-btn').addEventListener('click', showPrevPhoto);
    document.getElementById('next-btn').addEventListener('click', showNextPhoto);

    // Nawigacja klawiaturą
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') showPrevPhoto();
        if (e.key === 'ArrowRight') showNextPhoto();
        if (e.key === 'Escape') overlayMenu.classList.remove('active');
    });
});

async function fetchPhotos() {
    try {
        const response = await fetch(API_URL);
        photos = await response.json();

        if (photos.length > 0) {
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
    const photoContainer = document.getElementById('photo-container');
    const locationText = document.getElementById('location-text');
    const dateText = document.getElementById('date-text');

    // Animacja przejścia (fade)
    photoContainer.style.opacity = '0.3';

    setTimeout(() => {
        // Podmieniamy zdjęcie na plik z Twojego R2
        photoContainer.style.backgroundImage = `url('${R2_PUBLIC_URL}/${photo.filename}')`;
        
        // Formatujemy datę (wyciągamy sam dzień, miesiąc i rok bez sekund)
        const formattedDate = photo.photo_date.split(' ')[0].split('-').reverse().join('.');
        
        locationText.textContent = photo.location || 'Brak lokalizacji';
        dateText.textContent = formattedDate;

        photoContainer.style.opacity = '1';
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
