from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from WPDPv2 import *
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse


"""
uvicorn main:app --reload
"""
app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PodrozInput(BaseModel):
    id_podrozy: str

@app.get("/mapa-trasy", response_class=HTMLResponse)
def get_mapa_trasy():
    with open("static/mapa_trasy.html ", "r", encoding="utf-8") as f:
        html = f.read()
    return HTMLResponse(content=html)

@app.post("/wybierz-podroz")
async def wybierz_podroz(data: PodrozInput):
    print(f"Wybrano podróż: {data.id_podrozy}")
    osoba = TripPlanner().Szukanie_Najlepszej_trasy(data.id_podrozy)
    return osoba

