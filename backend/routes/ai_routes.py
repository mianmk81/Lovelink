from fastapi import APIRouter, HTTPException
from schemas.request_schemas import DatePlanGenerationRequest
from services.date_planner import generate_date_plan
import json

router = APIRouter()

@router.post("/generate-date")
def get_date_plan(data: DatePlanGenerationRequest):
    try:
        result = generate_date_plan(data)
        return json.loads(result)
    except Exception as e:
        print(f"[ERROR] {e}")
        raise HTTPException(status_code=500, detail=str(e))