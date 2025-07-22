# ShareTravel


Projekt realizowany w ramach kursu na Politechnice Wrocławskiej.

[Link do strony](https://share-travel-git-main-mikozzzzs-projects.vercel.app/)

## 📌 Opis

ShareTravel to aplikacja webowa umożliwiająca użytkownikom:

Rejestrację i logowanie.

Dodawanie własnych tras przejazdu (początek, koniec, kiedy).

Przeglądanie dostępnych podróży.

Wyszukiwanie najlepszego dopasowania: algorytm analizuje trasy podróżujących i dobiera tych pasażerów, których trasy najbardziej się pokrywają. Wynikiem jest lista dopasowań wraz z metrykami (dystans, czas, kolejność przystanków).

## ⚙️ Technologie

Frontend: React + TypeScript + Vite

Hosting Frontend: Vercel

Backend:

FastAPI (Python)

Supabase (baza danych PostgreSQL + realtime)

Algorytm dopasowania: Python z wykorzystaniem bibliotek:

openrouteservice (routing)

numpy (operacje numeryczne)

itertools, collections (analiza kombinacji i agregacja)

psycopg2 (połączenie z bazą PostgreSQL)

folium (wizualizacja trasy)

Middleware: CORS (fastapi.middleware.cors.CORSMiddleware)

Modele danych: pydantic

## 🚀 Uruchomienie projektu lokalnie

### 🔧 Wymagania

Node.js >= 18

Python >= 3.10

Supabase (konto i projekt)

Klient psql lub dostęp do Supabase Dashboard

### 📥 Instalacja

Sklonuj repozytorium:
<pre>
   git clone https://github.com/MiKozzzz/share-travel.git
   cd share-travel </pre>

Frontend:
<pre>
  cd frontend
  npm install
  cp .env.example .env.local    # uzupełnij zmienne
  npm run dev </pre>

Backend + Algorytm:
<pre>
  cd ../backend
  python -m venv venv
  source venv/bin/activate      # Linux/macOS
  venv\Scripts\activate     # Windows
  pip install -r requirements.txt
  cp .env.example .env          # uzupełnij zmienne Supabase i DB
  uvicorn main:app --reload --host 0.0.0.0 --port 8000 </pre>

Aplikacje:

Frontend: http://localhost:3000

Backend API: http://localhost:8000

## 🗃️ Struktura katalogów
<pre>
  ShareTravel/ 
  ├── backend/ 
  │ ├── main.py # Serwer FastAPI 
  │ └── WPDPv2.py # Algorytm dopasowania tras 
  ├── frontend/ 
  │ ├── public/ # Statyczne pliki (logo, mapa HTML) 
  │ ├── src/ 
  │ │ ├── layout/ # Layout aplikacji (Header, Footer, Main)
  │ │ ├── pages/ # Widoki aplikacji (np. Chat, Finder, Planner)
  │ │ ├── lib/ # Moduły komunikacji z API i logiki (np. auth.ts, supabase.ts)
  │ │ ├── providers/ # Provider autoryzacji
  │ │ ├── router/ # Routing aplikacji
  │ │ ├── stores/ # Store do zarządzania stanem 
  │ │ └── types/ # Typy TypeScript
  │ ├── package.json # Konfiguracja NPM
  │ └── vite.config.ts # Konfiguracja bundlera Vite
  └── README.md # ten plik</pre>

Algorytm dopasowania tras w Pythonie (openrouteservice, numpy, itertools), FastAPI

## 📄 Licencja

Projekt edukacyjny – brak licencji komercyjnej.
