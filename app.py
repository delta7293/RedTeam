from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

class MinerInput(BaseModel):
    random_val: Optional[str] = None

class MinerOutput(BaseModel):
    detection_js: str

app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/solve", response_model=MinerOutput)
def solve(_: MinerInput):
    with open("templates/static/detection/detection.js", "r") as f:
        detection_code = f.read()
    return MinerOutput(detection_js=detection_code)
