export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // --- 1. POBIERANIE ZDJĘĆ (DLA STRONY INTERNETOWEJ) ---
    if (request.method === 'GET' && url.pathname === '/photos') {
      // Pobieramy zdjęcia posortowane od najnowszego
      const { results } = await env.DB.prepare("SELECT * FROM photos ORDER BY photo_date DESC").all();
      
      return new Response(JSON.stringify(results), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' // Pozwala stronie pobrać dane
        }
      });
    }

    // --- 2. UPLOAD ZDJĘCIA (Z IPHONE'A) ---
    if (request.method === 'POST' && url.pathname === '/upload') {
      // Proste zabezpieczenie - sprawdzamy hasło w nagłówku
      const secret = request.headers.get('Authorization');
      
      // TUTAJ ZMIEŃ HASŁO NA SWOJE WŁASNE:
      if (secret !== 'Bearer MOJE_TAJNE_HASLO_THAT_DAY') {
        return new Response('Brak dostępu', { status: 401 });
      }

      try {
        // Pobieramy dane wysłane ze Skrótu z iPhone'a
        const formData = await request.formData();
        const file = formData.get('file'); // Plik zdjęcia
        const photoDate = formData.get('date'); // Data z EXIF
        const location = formData.get('location'); // Lokalizacja

        if (!file || !photoDate) {
          return new Response('Brak pliku lub daty EXIF', { status: 400 });
        }

        // Generujemy unikalną nazwę pliku
        const filename = `${Date.now()}-${file.name}`;

        // Wrzucamy zdjęcie do koszyka R2
        await env.BUCKET.put(filename, file);

        // Zapisujemy informacje w bazie D1
        await env.DB.prepare(
          "INSERT INTO photos (filename, photo_date, location) VALUES (?, ?, ?)"
        ).bind(filename, photoDate, location || '').run();

        return new Response('Zdjęcie dodane pomyślnie!', { status: 200 });
      } catch (error) {
        return new Response('Błąd serwera: ' + error.message, { status: 500 });
      }
    }

    return new Response('Not found', { status: 404 });
  }
};
