"""
Hiver Support Intelligence - FastAPI Backend Application
Exposes REST endpoints for the AI customer support evaluation platform.
"""

import json
import os
from typing import Optional
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.models import AnalyzeRequest, AnalyzeResponse
from backend.pipeline import AgentPipeline

app = FastAPI(
    title="Hiver Support Intelligence API",
    description="Evidence-grounded customer support automation with measurable trust.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load mock/benchmark datasets
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
with open(os.path.join(DATA_DIR, "conversations_twitter.json"), "r", encoding="utf-8") as f:
    CONVERSATIONS_DATA = json.load(f)

with open(os.path.join(DATA_DIR, "golden_eval_set.json"), "r", encoding="utf-8") as f:
    GOLDEN_EVAL_DATA = json.load(f)

# Initialize AI Pipeline
pipeline = AgentPipeline(knowledge_base=CONVERSATIONS_DATA.get("conversations", []))


@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "service": "Hiver Support Intelligence",
        "version": "1.0.0",
        "mode": "live",
        "dataset": "Golden Set v1.0",
    }


@app.get("/api/metrics")
def get_metrics():
    return GOLDEN_EVAL_DATA.get("metrics", {})


@app.get("/api/conversations")
def get_conversations(
    intent: Optional[str] = Query(None),
    decision: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=100),
):
    cases = CONVERSATIONS_DATA.get("conversations", [])

    if intent and intent != "ALL":
        cases = [c for c in cases if c.get("intent") == intent]

    if decision and decision != "ALL":
        cases = [c for c in cases if c.get("decision") == decision]

    if search:
        search_lower = search.lower()
        cases = [
            c for c in cases
            if search_lower in c.get("customer_message", "").lower()
            or search_lower in c.get("customer_handle", "").lower()
            or search_lower in c.get("tweet_id", "").lower()
        ]

    return {
        "total": len(cases),
        "brand": CONVERSATIONS_DATA.get("brand", "SpotifyCares"),
        "conversations": cases[:limit],
    }


@app.get("/api/intents")
def get_intents():
    return {
        "intents": GOLDEN_EVAL_DATA.get("intent_performance", []),
        "insight": "Most classification errors occur between Billing and Subscription issues, suggesting overlapping intent boundaries in account management.",
    }


@app.get("/api/evaluation")
def get_evaluation():
    return {
        "baseline_comparison": GOLDEN_EVAL_DATA.get("baseline_comparison", []),
        "reply_quality_radar": GOLDEN_EVAL_DATA.get("reply_quality_radar", []),
        "llm_judge_metrics": GOLDEN_EVAL_DATA.get("llm_judge_metrics", {}),
        "selective_automation_curve": GOLDEN_EVAL_DATA.get("selective_automation_curve", []),
        "retrieval_benchmarks": GOLDEN_EVAL_DATA.get("retrieval_benchmarks", {}),
    }


@app.get("/api/failures")
def get_failures():
    return {
        "failures": GOLDEN_EVAL_DATA.get("failures", []),
    }


@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze_message(request: AnalyzeRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    return pipeline.process(request.message, brand=request.brand or "SpotifyCares")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
