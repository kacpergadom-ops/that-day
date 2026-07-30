const R2_PUBLIC_URL = 'https://pub-a81a5897ebfe4ef1bbfaf94d1f0b0826.r2.dev';
const API_URL = 'https://that-day-api.kacper-gadom.workers.dev/photos';

let photos = [];
let currentIndex = 0;
let calendarCurrentDate = new Date(); 

const LOGO_VARIANTS = [
    'THAT DAY', 'that day', 'That Day', 'thatday', 
    'THATDAY', 'TH47 D4Y', 'th47 d4y', '7h47d4y', 
    '7HA7D4Y', 'Th4t D4y', 'THAT dAy'
];

const MONTH_NAMES = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

document.addEventListener('DOMContentLoaded', () => {
    fetchPhotos();

    const menuToggle = document.getElementById('menu-toggle');
    const closeMenu = document.getElementById('close-menu');
    const overlayMenu = document.getElementById('overlay-menu');
    const menuContent = document.getElementById('menu-content');
    
    // Zmienne sekcji
    const calendarContent = document.getElementById('calendar-content');
    const aboutContent = document.getElementById('about-content');
    const instagramContent = document.getElementById('instagram-content');
    
    // Linki w menu
    const linkPhotos = document.getElementById('link-photos');
    const linkCalendar = document.getElementById('link-calendar');
    const linkAbout = document.getElementById('link-about');
    const linkInstagram = document.getElementById('link-instagram');
    
    // Przyciski powrotu
    const backToMenuCal = document.getElementById('back-to-menu-cal');
    const backToMenuAbout = document.getElementById('back-to-menu-about');
    const backToMenuIg = document.getElementById('back-to-menu-ig');

    const calPrevBtn = document.getElementById('cal-prev-month');
    const calNextBtn = document.getElementById('cal-next-month');

    if (menuToggle && overlayMenu) {
        menuToggle.addEventListener('click', () => {
            overlayMenu.classList.add('active');
            showMenuMain();
        });
    }
    
    if (closeMenu && overlayMenu) {
        closeMenu.addEventListener('click', () => overlayMenu.classList.remove('active'));
    }

    if (linkPhotos) {
        linkPhotos.addEventListener('click', (e) => {
            e.preventDefault();
            overlayMenu.classList.remove('active');
        });
    }

    if (linkCalendar) {
        linkCalendar.addEventListener('click', (e) => {
            e.preventDefault();
            showCalendarView();
        });
    }

    if (linkAbout) {
        linkAbout.addEventListener('click', (e) => {
            e.preventDefault();
            showAboutView();
        });
    }

    if (linkInstagram) {
        linkInstagram.addEventListener('click', (e) => {
            e.preventDefault();
            showInstagramView();
        });
    }

    if (backToMenuCal) backToMenuCal.addEventListener('click', () => showMenuMain());
    if (backToMenuAbout) backToMenuAbout.addEventListener('click', () => showMenuMain());
    if (backToMenuIg) backToMenuIg.addEventListener('click', () => showMenuMain());

    if (calPrevBtn) {
        calPrevBtn.addEventListener('click', () => {
            calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() - 1);
            renderCalendar();
        });
    }

    if (calNextBtn) {
        calNextBtn.addEventListener('click', () => {
            calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() + 1);
            renderCalendar();
        });
    }

    function showMenuMain() {
        if (menuContent) menuContent.classList.remove('hidden');
        if (calendarContent) calendarContent.classList.add('hidden');
        if (aboutContent) aboutContent.classList.add('hidden');
        if (instagramContent) instagramContent.classList.add('hidden');
    }

    function showCalendarView() {
        if (menuContent) menuContent.classList.add('hidden');
        if (aboutContent) aboutContent.classList.add('hidden');
        if (instagramContent) instagramContent.classList.add('hidden');
        if (calendarContent) calendarContent.classList.remove('hidden');
        renderCalendar();
    }

    function showAboutView() {
        if (menuContent) menuContent.classList.add('hidden');
        if (calendarContent) calendarContent.classList.add('hidden');
        if (instagramContent) instagramContent.classList.add('hidden');
        if (aboutContent) aboutContent.classList.remove('hidden');
    }

    function showInstagramView() {
        if (menuContent) menuContent.classList.add('hidden');
        if (calendarContent) calendarContent.classList.add('hidden');
        if (aboutContent) aboutContent.classList.add('hidden');
        if (instagramContent) instagramContent.classList.remove('hidden');
    }

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
            currentIndex = Math.floor(Math.random() * photos.length);
            renderPhoto(currentIndex);
        }
    } catch (error) {
        console.error('Error fetching photos:', error);
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

    randomizeLogo();

    if (photoMain) photoMain.classList.remove('loaded');
    if (photoBlurBg) photoBlurBg.classList.remove('loaded');

    const imgLoader = new Image();
    imgLoader.src = photoUrl;
    imgLoader.onload = () => {
        if (photoBlurBg) photoBlurBg.style.backgroundImage = `url('${photoUrl}')`;
        if (photoMain) photoMain.src = photoUrl;

        let formattedDate = photo.photo_date;
        if (photo.photo_date && photo.photo_date.includes('-')) {
            formattedDate = photo.photo_date.split(' ')[0].split('-').reverse().join('.');
        }
        
        if (locationText) locationText.textContent = photo.location || 'No location';
        if (dateText) dateText.textContent = formattedDate;

        if (photoMain) photoMain.classList.add('loaded');
        if (photoBlurBg) photoBlurBg.classList.add('loaded');
    };
}

function renderCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const monthTitle = document.getElementById('calendar-month-title');
    const overlayMenu = document.getElementById('overlay-menu');
    if (!calendarGrid || !monthTitle) return;

    calendarGrid.innerHTML = '';

    const year = calendarCurrentDate.getFullYear();
    const month = calendarCurrentDate.getMonth();

    monthTitle.textContent = `${MONTH_NAMES[month]} ${year}`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    let startingDay = firstDay.getDay() - 1;
    if (startingDay === -1) startingDay = 6;

    let cellCount = 0;

    for (let i = 0; i < startingDay; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDiv);
        cellCount++;
    }

    const photoMap = {};
    photos.forEach((photo, idx) => {
        if (photo.photo_date) {
            const dateOnly = photo.photo_date.split(' ')[0]; 
            if (!photoMap[dateOnly]) photoMap[dateOnly] = [];
            photoMap[dateOnly].push({ photo, idx });
        }
    });

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';

        const dayNumSpan = document.createElement('span');
        dayNumSpan.className = 'calendar-day-num';
        dayNumSpan.textContent = day;
        dayDiv.appendChild(dayNumSpan);

        const formattedMonth = String(month + 1).padStart(2, '0');
        const formattedDay = String(day).padStart(2, '0');
        const dateKey = `${year}-${formattedMonth}-${formattedDay}`;

        if (photoMap[dateKey] && photoMap[dateKey].length > 0) {
            const dayPhotos = photoMap[dateKey];
            const firstPhotoObj = dayPhotos[0];
            const photoUrl = `${R2_PUBLIC_URL}/${firstPhotoObj.photo.filename}`;

            dayDiv.classList.add('has-photo');
            dayDiv.style.backgroundImage = `url('${photoUrl}')`;

            if (dayPhotos.length > 1) {
                const countBadge = document.createElement('span');
                countBadge.className = 'calendar-photo-count';
                countBadge.textContent = `+${dayPhotos.length - 1}`;
                dayDiv.appendChild(countBadge);
            }

            dayDiv.addEventListener('click', () => {
                currentIndex = firstPhotoObj.idx;
                renderPhoto(currentIndex);
                overlayMenu.classList.remove('active');
            });
        }

        calendarGrid.appendChild(dayDiv);
        cellCount++;
    }

    const remainingCells = 42 - cellCount;
    for (let i = 0; i < remainingCells; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDiv);
    }
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
