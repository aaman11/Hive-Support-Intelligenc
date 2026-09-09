"""
Hiver Support Intelligence - Data Models
Pydantic schemas for the AI pipeline, API requests, and evaluation records.
"""

from typing import List, Optional, Literal
from pydantic import BaseModel, Field

IntentLabel = Literal[
    "payment_transaction",
    "account_access",
    "technical_issue",
    "subscription",
    "billing_charge",
    "account_security",
    "streaming_playback",
    "device_pairing",
    "cancellation_refund",
    "general_support",
]

DecisionAction = Literal["AUTO_HANDLE", "ESCALATE"]
RiskLevel = Literal["LOW", "MEDIUM", "HIGH"]


class AlternativeIntent(BaseModel):
    label: IntentLabel
    name: str
    confidence: float


class IntentPrediction(BaseModel):
    label: IntentLabel
    name: str
    confidence: float
    alternatives: List[AlternativeIntent] = Field(default_factory=list)
    reasoning: Optional[str] = None


class HistoricalEvidence(BaseModel):
    id: str
    tweet_id: str
    customer_message: str
    brand_reply: str
    similarity: float
    intent: IntentLabel
    brand: str
    dense_score: Optional[float] = None
    bm25_score: Optional[float] = None
    policy_verified: bool = True


class DecisionFactor(BaseModel):
    id: str
    name: str
    passed: bool
    description: str


class AutomationDecision(BaseModel):
    action: DecisionAction
    confidence: float
    reason: str
    factors: List[DecisionFactor] = Field(default_factory=list)
    risk_level: RiskLevel
    requires_human_verification: bool = False


class AnalyzeRequest(BaseModel):
    message: str = Field(..., min_length=2, max_length=1000)
    brand: Optional[str] = "SpotifyCares"


class AnalyzeResponse(BaseModel):
    message: str
    brand: str
    intent: IntentPrediction
    retrieval: List[HistoricalEvidence]
    generated_reply: str
    grounded_in_count: int
    decision: AutomationDecision
    processing_time_ms: float
    pipeline_stage: str = "completed"
    execution_mode: str = "heuristic_engine"


class ConversationCase(BaseModel):
    id: str
    tweet_id: str
    customer_handle: str
    customer_message: str
    brand: str
    intent: IntentLabel
    decision: DecisionAction
    confidence: float
    reply_quality: float
    generated_reply: str
    historical_brand_reply: str
    evidence_count: int
    date: str
    risk_level: RiskLevel
    status: str
