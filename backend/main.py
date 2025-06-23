from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Tutaj konfigurujesz CORS:
origins = [
    "http://localhost:3000",  # adres Twojego frontendowego serwera React
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # dozwolone adresy frontendów
    allow_credentials=True,
    allow_methods=["*"],        # zezwól na wszystkie metody (GET, POST itd.)
    allow_headers=["*"],        # zezwól na wszystkie nagłówki
)

# Model wejściowy
class PodrozInput(BaseModel):
    id_podrozy: str

# Endpoint
@app.post("/wybierz-podroz")
async def wybierz_podroz(data: PodrozInput):
    print(f"Wybrano podróż: {data.id_podrozy}")
    return {"status": "ok"}
