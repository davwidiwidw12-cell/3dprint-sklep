# Plan Rozbudowy Platformy 3dprint do Pełnego E-commerce

Celem jest przekształcenie obecnego sklepu opartego na zapytaniach (MVP) w pełnoprawną platformę e-commerce z kontami użytkowników, historią zamówień, płatnościami (PayPal + BLIK ręczny) oraz obsługą wysyłek (Paczkomaty/Kurier).

## 1. Aktualizacja Architektury Bazy Danych (Prisma Schema)
Rozbudowa modelu danych, aby obsłużyć nowe wymagania:
*   **User:** Rozszerzenie o pola adresu, telefonu, rolę (ADMIN/USER).
*   **Order:** Nowy model przechowujący zamówienia (relacja z User, status płatności, status wysyłki, numer śledzenia, metoda płatności, adres dostawy).
*   **OrderItem:** Pozycje w zamówieniu (snapshot ceny i ilości).
*   **ShippingAddress:** Osobny model lub pola w User/Order dla adresu wysyłki.
*   **Settings:** Tabela konfiguracyjna (koszt dostawy, próg darmowej dostawy).

## 2. System Kont Użytkowników i Autentykacja
*   **NextAuth.js:**
    *   Dodanie **Google Provider** (OAuth).
    *   Rejestracja/Logowanie email + hasło (już częściowo jest, trzeba dostosować dla klientów).
*   **Panel Klienta (`/profile`):**
    *   Edycja danych osobowych i adresu.
    *   Historia zamówień ze statusami i trackingiem.

## 3. Koszyk i Proces Checkout (Nowa Logika)
*   **Koszyk:** Aktualizacja store (Zustand) o logikę darmowej dostawy (próg 200 zł).
*   **Checkout Flow:**
    1.  **Dane:** Adres (Kurier) lub Paczkomat (integracja z mapą/listą lub proste pole tekstowe na start).
    2.  **Dostawa:** Wybór metody (Kurier/Paczkomat) - koszt 10.99 zł (0 zł > 200 zł).
    3.  **Płatność:**
        *   **PayPal:** Integracja SDK/API PayPala (płatność natychmiastowa).
        *   **BLIK (Ręczny):** Wyświetlenie instrukcji i numeru telefonu. Status "Oczekuje na płatność".
    4.  **Podsumowanie:** E-mail potwierdzający do klienta i admina.

## 4. Panel Admina - Rozbudowa
*   **Zamówienia (`/admin/orders`):**
    *   Lista wszystkich zamówień z filtrowaniem (status, płatność).
    *   Szczegóły zamówienia: edycja statusu (Nowe -> Opłacone -> Wysłane), dodawanie numeru śledzenia.
    *   Zatwierdzanie płatności BLIK.
*   **Produkty:**
    *   Automatyczna kategoryzacja (ulepszenie istniejącej logiki).
*   **Ustawienia (`/admin/settings`):**
    *   Edycja kosztów dostawy i progu darmowej wysyłki.

## 5. Backend i Logika Biznesowa
*   **Server Actions:** Obsługa składania zamówień, aktualizacji statusów.
*   **E-maile:** (Opcjonalnie w tym kroku lub symulacja) Powiadomienia o zmianie statusu.
*   **Bezpieczeństwo:** Walidacja Zod, zabezpieczenie tras admina, haszowanie haseł.

## Harmonogram Wdrożenia
1.  **Schema Update:** Migracja bazy danych (User, Order, Settings).
2.  **Auth Update:** Konfiguracja Google OAuth i rejestracji klientów.
3.  **Checkout & Orders:** Implementacja procesu składania zamówienia i zapisu do bazy.
4.  **Płatności:** Integracja PayPal i widok BLIK.
5.  **Panel Klienta:** Widok historii zamówień.
6.  **Panel Admina (Zamówienia):** Zarządzanie procesem realizacji.
7.  **Finalizacja:** Testy, UI polish, weryfikacja bezpieczeństwa.

Czy akceptujesz ten plan rozbudowy sklepu?