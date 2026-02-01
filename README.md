# 3dprint - Platforma E-commerce Premium

Projekt sklepu internetowego z produktami drukowanymi w 3D (Wizytówki NFC, Breloki, Serca 3D).

## Stack Technologiczny
- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS v4, Framer Motion.
- **Backend**: Next.js Server Actions, Prisma ORM.
- **Baza Danych**: SQLite (deweloperska), łatwa migracja do PostgreSQL.
- **Auth**: NextAuth.js (dla panelu administratora).

## Uruchomienie

1.  **Instalacja zależności**:
    ```bash
    npm install
    ```

2.  **Baza Danych**:
    Projekt zawiera już skonfigurowaną i zseedowaną bazę `dev.db`.
    Jeśli chcesz zresetować bazę:
    ```bash
    npx prisma migrate reset
    npx tsx prisma/seed.ts
    ```

3.  **Uruchomienie serwera**:
    ```bash
    npm run dev
    ```
    Sklep dostępny pod: `http://localhost:3000`
    Panel Admina: `http://localhost:3000/admin`

## Dane logowania (Admin)
- **Login**: `admin`
- **Hasło**: `admin123`

## Funkcjonalności
- **Kategoryzacja**: Automatyczne przypisywanie kategorii (Breloki mają mocowanie, Duże serca są prezentami).
- **Rabaty Ilościowe**: Dynamiczne przeliczanie cen w zależności od ilości.
- **Koszyk**: Tryb zapytania ofertowego (bez płatności online).
- **Panel Admina**: Zarządzanie produktami, podgląd statystyk.
