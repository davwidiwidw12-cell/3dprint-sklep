# Plan Wdrożenia Platformy E-commerce Premium "3dprint"

Jako zespół senior developerów, przygotowaliśmy kompleksowy plan realizacji sklepu internetowego opartego na nowoczesnym stacku technologicznym, zapewniającym elegancję, szybkość i skalowalność.

## 1. Stack Technologiczny (Architecture & Tech Stack)
Wybraliśmy technologie gwarantujące wydajność, SEO i łatwość dalszego rozwoju (np. dodanie płatności w przyszłości).

*   **Framework:** **Next.js 14+ (App Router)** – React framework, standard branżowy dla e-commerce.
*   **Język:** **TypeScript** – dla bezpieczeństwa typów i skalowalności kodu.
*   **Stylizacja:** **Tailwind CSS** – dla stworzenia unikalnego, minimalistycznego designu "pixel-perfect".
*   **Baza Danych:** **SQLite** (lokalnie dla szybkiego startu) z **Prisma ORM**. Łatwa migracja do PostgreSQL w przyszłości.
*   **UI/UX:** **Framer Motion** (subtelne animacje), **Lucide React** (nowoczesne ikony).
*   **Formularze:** **React Hook Form** + **Zod** (walidacja).
*   **Auth:** **NextAuth.js** (zabezpieczenie panelu admina).

## 2. Architektura Bazy Danych (Schema)
Zaprojektujemy schemat uwzględniający specyficzną logikę produktów:
*   **Product:** Nazwa, opis, slug, cena bazowa, typ (Brelok/Serce/Inne), status (aktywny/ukryty).
*   **Category:** Relacja z produktami (Wizytówki, Breloki, Serca 3D, Inne).
*   **PricingTier:** Tabela dla progów rabatowych (min_qty, price_per_unit) połączona z produktem.
*   **ProductImage:** Obsługa galerii zdjęć.

## 3. Implementacja Frontend (Sklep)
Skupienie na "Premium Feel" i konwersji bez płatności online.
*   **Global Layout:** Minimalistyczny Navbar, Footer z danymi kontaktowymi (Michał Kaleta).
*   **Strona Główna:** Hero section z elegancką typografią, wyróżnione kategorie.
*   **Katalog Produktów:** Filtrowanie, kafelki z "czystą prezentacją" (symulacja usunięcia tła stylem CSS/blend mode).
*   **Karta Produktu:** Wybór wariantów, tabela rabatów ilościowych, galeria.
*   **Koszyk (Inquiry Mode):**
    *   Brak bramki płatności.
    *   Podsumowanie zamówienia.
    *   Formularz kontaktowy zamiast checkoutu.
    *   Wysyłka zamówienia na e-mail (symulacja/logika backendowa).

## 4. Implementacja Backend & Admin Panel
Dostępny pod dedykowaną ścieżką `/admin`.
*   **Dashboard:** Szybki podgląd statystyk (liczba produktów, zapytań).
*   **Zarządzanie Produktami:**
    *   CRUD (Dodaj/Edytuj/Usuń).
    *   **Logika "Guardians":** Walidacja, aby duże serca nigdy nie trafiły do breloków (zgodnie z instrukcją).
    *   Edycja progów cenowych (Rabatów).
*   **Upload Zdjęć:** Mechanizm przesyłania plików (lokalny upload dla MVP).

## 5. Branding i Design
*   **Logo:** Stworzenie komponentu SVG z minimalistycznym sygnetem 3D.
*   **Kolorystyka:** Monochrome (Biel/Czerń/Szarość) + Złoty akcent.
*   **UX:** Micro-interactions (hover effects), płynne przejścia między stronami.

## Harmonogram Wdrożenia (Kroki Realizacji)
1.  **Inicjalizacja:** Konfiguracja projektu, instalacja zależności, setup bazy danych.
2.  **Core Components:** Budowa UI Kit (przyciski, inputy, typografia).
3.  **Backend Logic:** API do produktów i kategorii, seeding bazy danych.
4.  **Admin Panel:** Budowa panelu zarządzania (priorytet, aby móc dodawać treści).
5.  **Frontend Store:** Budowa widoków sklepowych.
6.  **Koszyk i Kontakt:** Implementacja logiki zamówień telefonicznych/mailowych.
7.  **Final Polish:** Animacje, responsywność, logo.

Czy akceptujesz ten plan działania? Po zatwierdzeniu przystąpimy do kodowania.