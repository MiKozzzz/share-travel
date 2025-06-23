import openrouteservice
import numpy as np
import itertools
from collections import defaultdict
import psycopg2
import folium
class TripPlanner:
    def __init__(self, client_openrouteservice='5b3ce3597851110001cf624844376cc89897404181958bd72c55e233',
                 host="aws-0-eu-central-1.pooler.supabase.com", port=6543, database="postgres",
                 user="postgres.kxlsznvtipfyhhnilxuj", password="hY2bEwbOwqDgNHFM"):
        # Dane do openrouteservice
        self.client = openrouteservice.Client(client_openrouteservice)
        # Połączenie z bazą
        self.conn = psycopg2.connect(
            host=host,
            port=port,
            database=database,
            user=user,
            password=password
        )
        # Tworzymy kursor
        self.cur = self.conn.cursor()

    def time_to_decimal(self, time_str):
        """Konwertuje czas w formacie 'HH:MM' na liczbę dziesiętną."""
        hours, minutes = map(int, time_str.split(":"))
        decimal_time = hours + minutes / 60
        return round(decimal_time, 2)

    def geocode_address(self, address):
        """Zamienia adres tekstowy na współrzędne [lon, lat]"""
        geocode = self.client.pelias_search(text=address)
        if geocode and geocode['features']:
            return tuple(geocode['features'][0]['geometry']['coordinates'])
        else:
            raise ValueError(f"Nie znaleziono adresu: {address}")

    def is_valid_order(self, perm):
        """Sprawdza, czy w permutacji każdy pickup jest przed swoim dropoff."""
        positions = defaultdict(dict)
        # Tworzenie słowników z kolejnością pickup i dropoff dla każdego pasażera
        for i, event in enumerate(perm):
            identifier, action = event.split('_', 1)
            positions[identifier][action] = i
        # Sprawdzanie czy pickup jest przed dropoff dla każdego pasażera
        for actions in positions.values():
            if 'pickup' in actions and 'dropoff' in actions:
                if actions['pickup'] > actions['dropoff']:
                    return False
        return True


    def valid_permutations(self, events):
        """Zwraca permutacje z poprawną kolejnością pickup -> dropoff dla każdego identyfikatora."""
        all_valid = []
        for perm in itertools.permutations(events):
            if self.is_valid_order(perm):
                all_valid.append(perm)
        return all_valid


    def Liczenie_dlugosci_tras(self, trasa_slownik, pasazerowie):
        """Funkcja licząca i sortująca długość tras z kandydatami do wspólnej jazdy"""
        # Do testowania, żeby nienadłużywać openrouteservice. Sprawdza tylko jedną permutacje
        permutacje = self.valid_permutations(pasazerowie)[3:4]
        # permutacje = valid_permutations(pasazerowie)
        Dlugosci = []
        for perm in permutacje:
            trasa = ("D_start",) + perm + ("D_end",)
            trasa_z_wartosciami = tuple(trasa_slownik[klucz] for klucz in trasa)
            route = self.client.directions(
                coordinates=trasa_z_wartosciami,
                profile='driving-car',
                format='geojson'
            )
            total_distance = 0
            total_duration = 0
            lista_czasow_trasy_przystankow = [0]
            lista_odlegosci_trasy_przystankow = [0]
            for segment in route['features'][0]['properties']['segments']:
                total_distance += segment['distance'] / 1000
                total_duration += segment['duration'] / 60
                lista_czasow_trasy_przystankow.append(round(total_duration, 2))
                lista_odlegosci_trasy_przystankow.append(round(total_distance, 2))
            Dlugosci.append((trasa, round(total_distance, 2), round(total_duration), lista_odlegosci_trasy_przystankow,
                             lista_czasow_trasy_przystankow))
        return Dlugosci


    def Rysowanie_mapy(self, trasa, trasa_slownik):
        """Funkcja rysująca mapę"""
        trasa_z_wartosciami = tuple(trasa_slownik[klucz] for klucz in trasa)
        route = self.client.directions(
            coordinates=trasa_z_wartosciami,
            profile='driving-car',
            format='geojson'
        )
        start_coords = trasa_z_wartosciami[0][::-1]  # [lat, lon]
        m = folium.Map(location=start_coords, zoom_start=13)
        # Dodaj trasę jako GeoJson
        folium.GeoJson(route).add_to(m)
        # Dodaj markery (opcjonalnie)
        tekst_markera = f'Poczatek'
        folium.Marker(location=trasa_z_wartosciami[0][::-1], tooltip=tekst_markera).add_to(m)
        poprzednia = trasa_z_wartosciami[0][::-1]
        for i in range(len(trasa_z_wartosciami) - 2):
            tekst = trasa[i+1]
            id, typ = tekst.split("_")
            query = """
                SELECT full_name
                FROM konto_szczegoly
                WHERE id_uzytkownika = %s;
            """
            # Wykonanie zapytania
            self.cur.execute(query, (id,))
            imie_pasazera = self.cur.fetchone()[0]
            if poprzednia == trasa_z_wartosciami[i + 1][::-1]:
                if typ == "pickup":
                    tekst_markera = tekst_markera + f', {imie_pasazera} wsiada'
                    folium.Marker(location=trasa_z_wartosciami[i + 1][::-1],
                                  tooltip=tekst_markera).add_to(m)
                if typ == "dropoff":
                    tekst_markera = tekst_markera + f', {imie_pasazera} wysiada'
                    folium.Marker(location=trasa_z_wartosciami[i + 1][::-1],
                                  tooltip=tekst_markera).add_to(m)
            else:
                if typ == "pickup":
                    tekst_markera = f'Przystanek: {imie_pasazera} wsiada'
                    folium.Marker(location=trasa_z_wartosciami[i + 1][::-1],
                                  tooltip=tekst_markera).add_to(m)
                if typ == "dropoff":
                    tekst_markera = f'Przystanek: {imie_pasazera} wysiada'
                    folium.Marker(location=trasa_z_wartosciami[i + 1][::-1],
                                  tooltip=tekst_markera).add_to(m)
            poprzednia = trasa_z_wartosciami[i+1][::-1]

        if poprzednia == trasa_z_wartosciami[-1][::-1]:
            tekst_markera = tekst_markera + f', Koniec'
            folium.Marker(location=trasa_z_wartosciami[-1][::-1], tooltip=tekst_markera).add_to(m)
        else:
            folium.Marker(location=trasa_z_wartosciami[-1][::-1], tooltip='Koniec').add_to(m)
        # Zapisz do pliku HTML
        print(m)
        m.save("trasa.html")

    def Szykowanie(self, id_przejazdu):
        """Funkcja pobierająca dane z sql do szukania kandydatów dla kierowcy do wspólnej jazdy"""
        # Wykonujemy zapytanie
        query = """
            SELECT id_kierowcy
            FROM zaplanowane_przejazdy
            WHERE id_przejazdu = %s;
        """
        # Wykonanie zapytania
        self.cur.execute(query, (id_przejazdu,))
        # Pobranie wyników
        id_kierowcy = self.cur.fetchone()
        query = """
            SELECT *
            FROM zaplanowane_podroze
            WHERE id_uzytkownika = %s AND id_przejazdu = %s;
        """
        # Wykonanie zapytania
        self.cur.execute(query, (id_kierowcy, id_przejazdu))
        # Pobranie wyników
        dane_kierowcy = self.cur.fetchone()
        trasa_slownik = {"D_start": self.geocode_address(dane_kierowcy[2]), "D_end": self.geocode_address(dane_kierowcy[5]),
                         "D_arrival": self.time_to_decimal(dane_kierowcy[7]), "D_departure": self.time_to_decimal(dane_kierowcy[3])}
        lista_pasazerow = []
        query = """
            SELECT id_uzytkownika
            FROM pasazerowie
            WHERE id_przejazdu = %s;
        """
        # Wykonanie zapytania
        self.cur.execute(query, (id_przejazdu,))
        # Pobranie wyników
        id_pasazerow = self.cur.fetchall()
        for a in id_pasazerow:
            lista_pasazerow.append(a[0])
        pasazerowie_pickdrop = ()
        for p in lista_pasazerow:
            query = """
                SELECT *
                FROM zaplanowane_podroze
                WHERE id_uzytkownika = %s AND id_przejazdu = %s;
            """
            # Wykonanie zapytania
            self.cur.execute(query, (p, id_przejazdu))
            # Pobranie wyników
            dane_pasazera = self.cur.fetchone()
            # Tu pobiera dane z tabeli pasazerowie po id_uzytkownika
            trasa_slownik[f"{p}_pickup"] = self.geocode_address(dane_pasazera[2])
            trasa_slownik[f"{p}_dropoff"] = self.geocode_address(dane_pasazera[5])
            trasa_slownik[f"{p}_arrival_time"] = self.time_to_decimal(dane_pasazera[7])
            pasazerowie_pickdrop = pasazerowie_pickdrop + (f"{p}_pickup", f"{p}_dropoff")
        return trasa_slownik, pasazerowie_pickdrop, lista_pasazerow


    def Sprawdzanie_czasow_i_km(self, lista_plt, ts):
        """Funkcja sprawdza ile każdy pasażer przejechał czasu i kilometrów"""
        # Sprawdzanie kierowcy
        ns = {}
        lista_km = lista_plt[3]
        lista_czasow = lista_plt[4]
        lista_kolejnosci = lista_plt[0]
        lista_obecnych_osob_w_aucie = []
        for i in range(len(lista_czasow)):
            punkt = lista_kolejnosci[i]
            if punkt.endswith('_pickup'):
                ident = punkt.replace('_pickup', '')
                lista_obecnych_osob_w_aucie.append(ident)
                ns[f"{ident}_travel_distance"] = lista_km[i]
                ns[f"{ident}_travel_time"] = lista_czasow[i]
                ns[f"{ident}_arrival_time"] = 0
            elif punkt.endswith('_dropoff'):
                ident = punkt.replace('_dropoff', '')
                lista_obecnych_osob_w_aucie.remove(ident)
                ns[f"{ident}_travel_time"] = round(abs(ns[f"{ident}_travel_time"] - lista_czasow[i]), 2)
                ns[f"{ident}_travel_distance"] = round(abs(ns[f"{ident}_travel_distance"] - lista_km[i]), 2)
                # Godzina o której będzie pasażer, jeśli kierowca wyruszy o swojej min godzinie start
                ns[f"{ident}_arrival_time"] = round(lista_czasow[i] / 60 + ts["D_departure"], 2)
        return ns


    def Sprawdzanie_cz_kazdy_zdazyl(self, lp, ts, ns, time_travel):
        """Funkcja, sprawdza, czy każda z osób zdążyła"""
        czy_kazdy_zdazyl = 1
        if ts["D_departure"] + time_travel / 60 < ts["D_arrival"]:
            for pas in lp:
                if ns[f"{pas}_arrival_time"] > ts[f"{pas}_arrival_time"]:
                    czy_kazdy_zdazyl = 0
        else:
            czy_kazdy_zdazyl = 0
        return czy_kazdy_zdazyl


    def Szukanie_Najlepszej_trasy(self, id_podroz):
        """Funkcja znajdywania najlepszych kandydatow do trasy dla kierowcy"""
        query = """
                    SELECT id_przejazdu
                    FROM zaplanowane_podroze
                    WHERE id_podrozy = %s;
                """
        self.cur.execute(query, (id_podroz,))
        id_przejazdu = self.cur.fetchone()[0]
        ts, lp, lista_pasazerow = self.Szykowanie(id_przejazdu)
        # Lista id_uzytkownikow ktorzy nie maja jeszcze przejazdu lub szukaja (*flaga w sql)
        query = """
            SELECT *
            FROM zaplanowane_podroze
            WHERE id_przejazdu IS DISTINCT FROM %s;
        """
        self.cur.execute(query, (id_przejazdu,))
        kandydaci_przejazdu = self.cur.fetchall()
        lista_niespoznionych = []
        lista_spoznionych = []
        # Lista id pasazerow, co drugie slowo przed _ z listy lp zapisuje jako pasazera
        for k in kandydaci_przejazdu:
            lista_pazazerow_z_kandydatem = lista_pasazerow.copy()
            lista_pazazerow_z_kandydatem.append(k[1])
            ts[f"{k[1]}_pickup"] = self.geocode_address(k[2])
            ts[f"{k[1]}_dropoff"] = self.geocode_address(k[5])
            ts[f"{k[1]}_arrival_time"] = self.time_to_decimal(k[7])
            nowe_lp = lp + (f"{k[1]}_pickup", f"{k[1]}_dropoff")
            plt = self.Liczenie_dlugosci_tras(ts, nowe_lp)
            for p in plt:
                slownik_pasazerow_km_h = self.Sprawdzanie_czasow_i_km(p, ts)
                czy_kazdy_zdazyl = self.Sprawdzanie_cz_kazdy_zdazyl(lista_pasazerow, ts, slownik_pasazerow_km_h, p[2])
                if czy_kazdy_zdazyl == 1:
                    lista_niespoznionych.append([k[1], p, slownik_pasazerow_km_h])
                else:
                    lista_spoznionych.append([k[1], p, slownik_pasazerow_km_h])

        posortowana_spoznionych = sorted(lista_spoznionych, key=lambda x: x[1][1])
        posortowana_niespoznionych = sorted(lista_niespoznionych, key=lambda x: x[1][1])
        if posortowana_niespoznionych:
            print("Niespoznione:")
            # print(posortowana_niespoznionych[0])
            # print(posortowana_niespoznionych[1])
            # print(posortowana_niespoznionych[2])
        if posortowana_spoznionych:
            print("Spoznione:")
            # print(posortowana_spoznionych[0])

        for i in posortowana_niespoznionych[0:3]:
            # Zamknięcie połączenia
            query = """
                    SELECT full_name
                    FROM konto_szczegoly
                    WHERE id_uzytkownika = %s;
                """
            # Wykonanie zapytania
            self.cur.execute(query, (i[0],))
            # Pobranie wyników
            osoba = self.cur.fetchone()[0]
            i[0] = osoba

        self.Rysowanie_mapy(posortowana_niespoznionych[0][1][0], ts)
        self.cur.close()
        self.conn.close()
        return posortowana_niespoznionych[0:3]


if __name__ == "__main__":
    id_podrozy = '51e4b875-f90c-4633-a578-5a521b9ec125'
    TripPlanner().Szukanie_Najlepszej_trasy(id_podrozy)

