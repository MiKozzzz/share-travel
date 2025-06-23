from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# CORS - jeśli frontend działa np. na localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PodrozInput(BaseModel):
    id_podrozy: str

@app.post("/wybierz-podroz")
async def wybierz_podroz(data: PodrozInput):
    print(f"Wybrano podróż: {data.id_podrozy}")
    return {"status": "ok"}
