from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from WPDPv2 import *

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PodrozInput(BaseModel):
    id_podrozy: str

@app.post("/wybierz-podroz")
async def wybierz_podroz(data: PodrozInput):
    print(f"Wybrano podróż: {data.id_podrozy}")
    Szukanie_Najlepszej_trasy()
    return {"status": "ok"}

