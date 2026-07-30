document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const closeMenu = document.getElementById('close-menu');
    const overlayMenu = document.getElementById('overlay-menu');

    // Obsługa otwierania i zamykania menu
    menuToggle.addEventListener('click', () => {
        overlayMenu.classList.add('active');
    });

    closeMenu.addEventListener('click', () => {
        overlayMenu.classList.remove('active');
    });

    // Prowizoryczna obsługa nawigacji (będziemy tu podmieniać zdjęcia z R2/JSON)
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    prevBtn.addEventListener('click', () => {
        console.log('Poprzednie zdjęcie');
        // Tutaj dodamy logikę ładowania poprzedniego zdjęcia
    });

    nextBtn.addEventListener('click', () => {
        console.log('Następne zdjęcie');
        // Tutaj dodamy logikę ładowania następnego zdjęcia
    });

    // Obsługa klawiatury dla wygody przeglądania
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        } else if (e.key === 'Escape') {
            overlayMenu.classList.remove('active');
        }
    });
});
