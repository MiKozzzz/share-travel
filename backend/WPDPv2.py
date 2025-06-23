from itertools import combinations, permutations
from math import dist
import sys
import openrouteservice
from openrouteservice import convert
import numpy as np
from openrouteservice.exceptions import ApiError
import itertools
from collections import defaultdict
import psycopg2
def time_to_decimal(time_str):
    """Konwertuje czas w formacie 'HH:MM' na liczbę dziesiętną."""
    hours, minutes = map(int, time_str.split(":"))
    decimal_time = hours + minutes / 60
    return round(decimal_time, 2)

def geocode_address(address):
    """Zamienia adres tekstowy na współrzędne [lon, lat]"""
    geocode = client.pelias_search(text=address)
    if geocode and geocode['features']:
        return tuple(geocode['features'][0]['geometry']['coordinates'])
    else:
        raise ValueError(f"Nie znaleziono adresu: {address}")

def is_valid_order(perm):
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


def valid_permutations(events):
    """Zwraca permutacje z poprawną kolejnością pickup -> dropoff dla każdego identyfikatora."""
    all_valid = []
    for perm in itertools.permutations(events):
        if is_valid_order(perm):
            all_valid.append(perm)
    return all_valid


def Liczenie_dlugosci_tras(trasa_slownik, pasazerowie):
    """Funkcja licząca i sortująca długość tras z kandydatami do wspólnej jazdy"""
    # Do testowania, żeby nienadłużywać openrouteservice. Sprawdza tylko jedną permutacje
    # permutacje = valid_permutations(pasazerowie)[3:4]
    permutacje = valid_permutations(pasazerowie)
    Dlugosci = []
    for perm in permutacje:
        trasa = ("D_start",) + perm + ("D_end",)
        trasa_z_wartosciami = tuple(trasa_slownik[klucz] for klucz in trasa)
        route = client.directions(
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
        Dlugosci.append((trasa, round(total_distance, 2), round(total_duration, 2), lista_odlegosci_trasy_przystankow,
                         lista_czasow_trasy_przystankow))
    posortowana = sorted(Dlugosci, key=lambda x: x[1])
    return posortowana


def Szykowanie(cur, id_przejazdu):
    """Funkcja pobierająca dane z sql do szukania kandydatów dla kierowcy do wspólnej jazdy"""
    # Wykonujemy zapytanie
    query = """
        SELECT id_kierowcy
        FROM zaplanowane_przejazdy
        WHERE id_przejazdu = %s;
    """
    # Wykonanie zapytania
    cur.execute(query, (id_przejazdu,))
    # Pobranie wyników
    id_kierowcy = cur.fetchone()
    query = """
        SELECT *
        FROM zaplanowane_podroze
        WHERE id_uzytkownika = %s AND id_przejazdu = %s;
    """
    # Wykonanie zapytania
    cur.execute(query, (id_kierowcy, id_przejazdu))
    # Pobranie wyników
    dane_kierowcy = cur.fetchone()
    trasa_slownik = {"D_start": geocode_address(dane_kierowcy[2]), "D_end": geocode_address(dane_kierowcy[5]),
                     "D_arrival": time_to_decimal(dane_kierowcy[7]), "D_departure": time_to_decimal(dane_kierowcy[3])}
    lista_pasazerow = []
    query = """
        SELECT id_uzytkownika
        FROM pasazerowie
        WHERE id_przejazdu = %s;
    """
    # Wykonanie zapytania
    cur.execute(query, (id_przejazdu,))
    # Pobranie wyników
    id_pasazerow = cur.fetchall()
    for a in id_pasazerow:
        lista_pasazerow.append(a[0])
    pasazerowie_pickdrop = ("cand_pickup", "cand_dropoff")
    for p in lista_pasazerow:
        query = """
            SELECT *
            FROM zaplanowane_podroze
            WHERE id_uzytkownika = %s AND id_przejazdu = %s;
        """
        # Wykonanie zapytania
        cur.execute(query, (p, id_przejazdu))
        # Pobranie wyników
        dane_pasazera = cur.fetchone()
        # Tu pobiera dane z tabeli pasazerowie po id_uzytkownika
        trasa_slownik[f"{p}_pickup"] = geocode_address(dane_pasazera[2])
        trasa_slownik[f"{p}_dropoff"] = geocode_address(dane_pasazera[5])
        trasa_slownik[f"{p}_arrival_time"] = time_to_decimal(dane_pasazera[7])
        pasazerowie_pickdrop = pasazerowie_pickdrop + (f"{p}_pickup", f"{p}_dropoff")
    lista_pasazerow.append("cand")
    return trasa_slownik, pasazerowie_pickdrop, lista_pasazerow


def Sprawdzanie_czasow_i_km(lista_plt, ts):
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


def Sprawdzanie_cz_kazdy_zdazyl(lp, ts, ns, time_travel):
    """Funkcja, sprawdza, czy każda z osób zdążyła"""
    czy_kazdy_zdazyl = 1
    if ts["D_departure"] + time_travel / 60 < ts["D_arrival"]:
        for pas in lp:
            if ns[f"{pas}_arrival_time"] > ts[f"{pas}_arrival_time"]:
                czy_kazdy_zdazyl = 0
    else:
        czy_kazdy_zdazyl = 0
    return czy_kazdy_zdazyl


def Szukanie_Najlepszej_trasy(id_przejazdu):
    # Dane dostępowe
    host = "aws-0-eu-central-1.pooler.supabase.com"
    port = 6543
    database = "postgres"
    user = "postgres.xnykxakrxdqotervlicf"
    password = "7%xCRQmn5h&*FPF"  # wpisz tutaj swoje hasło
    # Połączenie z bazą
    conn = psycopg2.connect(
        host=host,
        port=port,
        database=database,
        user=user,
        password=password
    )
    # Tworzymy kursor
    cur = conn.cursor()
    """Funkcja znajdywania najlepszych kandydatow do trasy dla kierowcy"""
    ts, lp, lista_pasazerow = Szykowanie(cur, id_przejazdu)
    # Lista id_uzytkownikow ktorzy nie maja jeszcze przejazdu lub szukaja (*flaga w sql)
    query = """
        SELECT *
        FROM zaplanowane_podroze
        WHERE id_przejazdu IS DISTINCT FROM %s;
    """
    cur.execute(query, (id_przejazdu,))
    kandydaci_przejazdu = cur.fetchall()
    lista_niespoznionych = []
    lista_spoznionych = []
    # Lista id pasazerow, co drugie slowo przed _ z listy lp zapisuje jako pasazera
    print(lista_pasazerow)
    for k in kandydaci_przejazdu:
        ts["cand_pickup"] = geocode_address(k[2])
        ts["cand_dropoff"] = geocode_address(k[5])
        ts["cand_arrival_time"] = time_to_decimal(k[7])
        plt = Liczenie_dlugosci_tras(ts, lp)
        # TUTAJ SPRAWDZAM TYLKO JEDNE PRZYPDAKI plt[0]
        for p in plt:
            slownik_pasazerow_km_h = Sprawdzanie_czasow_i_km(p, ts)
            czy_kazdy_zdazyl = Sprawdzanie_cz_kazdy_zdazyl(lista_pasazerow, ts, slownik_pasazerow_km_h, p[2])
            if czy_kazdy_zdazyl == 1:
                lista_niespoznionych.append((p, slownik_pasazerow_km_h))
            else:
                lista_spoznionych.append((p, slownik_pasazerow_km_h))


    # Zamknięcie połączenia
    cur.close()
    conn.close()


client = openrouteservice.Client(key='5b3ce3597851110001cf624844376cc89897404181958bd72c55e233')
id_przejazdu = 'f059fc62-3915-4d6f-bc9f-0e59ca2744a6'
Szukanie_Najlepszej_trasy(id_przejazdu)

