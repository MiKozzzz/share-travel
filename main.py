import psycopg2

# Dane dostępowe – wypełnij swoimi
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
id_przejazdu = 'f059fc62-3915-4d6f-bc9f-0e59ca2744a6'
id_kierowcy = 'bfb02d4f-1724-471d-9cce-e5b216f3880c'
query = """
    SELECT id_uzytkownika
    FROM pasazerowie
    WHERE id_przejazdu = %s;
"""

# Wykonanie zapytania
cur.execute(query, (id_przejazdu,))

# Pobranie wyników
dane_kierowcy = cur.fetchall()

# Zamykamy połączenie
cur.close()
conn.close()
