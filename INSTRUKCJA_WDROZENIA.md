
# Instrukcja wgrania sklepu na GitHub i Vercel

Aby sklep działał na telefonie jak aplikacja i wysyłał powiadomienia, musi być "w internecie" (na serwerze). Najlepsza i darmowa opcja to **Vercel**.

## Krok 1: Wgranie kodu na GitHub

Otwórz terminal i wpisz po kolei te komendy (jeśli masz zainstalowanego Gita i konto na GitHub):

1. Utwórz nowe repozytorium na stronie https://github.com/new (nazwij je np. `3dprint-shop`).
2. Nie zaznaczaj "Add README", "Add .gitignore" - ma być puste.
3. Skopiuj link do repozytorium (np. `https://github.com/TWOJ_NICK/3dprint-shop.git`).
4. Wpisz w terminalu:

```bash
git remote add origin https://github.com/TWOJ_NICK/3dprint-shop.git
git branch -M main
git push -u origin main
```
*(Podmień link na swój!)*

## Krok 2: Uruchomienie na Vercel

1. Wejdź na https://vercel.com i zaloguj się (możesz przez GitHub).
2. Kliknij "Add New..." -> "Project".
3. Wybierz `3dprint-shop` z listy (Import).
4. **Ważne - Baza Danych (Postgres):**
   - Vercel nie obsługuje plików SQLite (`dev.db`). Musisz dodać bazę.
   - Po zaimportowaniu projektu, wejdź w zakładkę **Storage**.
   - Kliknij **Create Database** -> **Postgres** -> "Create".
   - Zaakceptuj domyślne ustawienia.
   - Po utworzeniu, kliknij **.env.local** (w sekcji Quickstart bazy) -> "Copy Snippet".
   - Wejdź w **Settings** -> **Environment Variables** projektu i wklej te zmienne.

5. **Zmienne środowiskowe (Environment Variables):**
   Musisz dodać też te zmienne (skopiuj ze swojego pliku `.env`):
   - `NEXTAUTH_SECRET` (wygeneruj nowy lub wpisz cokolwiek długiego)
   - `NEXTAUTH_URL` (wpisz adres domeny, którą dostaniesz z Vercel, np. `https://3dprint-shop.vercel.app`, ale na początek możesz dać localhost, potem zmienisz).
   - `NEXT_PUBLIC_VAPID_PUBLIC_KEY` (ten co masz w .env)
   - `VAPID_PRIVATE_KEY` (ten co masz w .env)
   - `VAPID_SUBJECT`

6. **Deploy:**
   - Vercel sam zbuduje stronę. Jeśli będą błędy z bazą danych (SQLite vs Postgres), będziesz musiał zmienić w pliku `prisma/schema.prisma` słowo `sqlite` na `postgresql` i wypchnąć zmianę na GitHub.

## Krok 3: Instalacja na telefonie

1. Wejdź na adres swojej strony (np. `https://twoj-projekt.vercel.app`) na telefonie.
2. Kliknij "Udostępnij" (iOS) lub menu (Android) -> "Do ekranu głównego" (lub "Zainstaluj aplikację").
3. Otwórz aplikację z pulpitu.
4. Zaloguj się do Admina i włącz powiadomienia! 🔔
