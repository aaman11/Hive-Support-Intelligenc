export type IntentLabel =
  | 'payment_transaction'
  | 'account_access'
  | 'technical_issue'
  | 'subscription'
  | 'billing_charge'
  | 'account_security'
  | 'streaming_playback'
  | 'device_pairing'
  | 'cancellation_refund'
  | 'general_support';

export type DecisionAction = 'AUTO_HANDLE' | 'ESCALATE';

export interface AlternativeIntent {
  label: IntentLabel | string;
  name: string;
  confidence: number;
}

export interface IntentPrediction {
  label: IntentLabel;
  name: string;
  confidence: number;
  alternatives: AlternativeIntent[];
  reasoning?: string;
}

export interface HistoricalEvidence {
  id: string;
  tweet_id?: string;
  customer_message: string;
  brand_reply: string;
  similarity: number;
  intent: IntentLabel | string;
  brand?: string;
  dense_score?: number;
  bm25_score?: number;
  policy_verified?: boolean;
}

export interface DecisionFactor {
  id: string;
  name: string;
  passed: boolean;
  description: string;
}

export interface AutomationDecision {
  action: DecisionAction;
  confidence: number;
  reason: string;
  factors: DecisionFactor[];
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  requires_human_verification?: boolean;
}

export interface AnalysisResponse {
  message: string;
  brand: string;
  intent: IntentPrediction;
  retrieval: HistoricalEvidence[];
  generated_reply: string;
  grounded_in_count: number;
  decision: AutomationDecision;
  processing_time_ms: number;
  pipeline_stage?: string;
  execution_mode?: string;
}

export interface ConversationCase {
  id: string;
  tweet_id: string;
  customer_handle: string;
  customer_message: string;
  brand: string;
  intent: IntentLabel;
  decision: DecisionAction;
  confidence: number;
  reply_quality: number;
  generated_reply: string;
  historical_brand_reply: string;
  evidence_count: number;
  date: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  status?: 'resolved' | 'escalated_to_tier_2' | 'awaiting_customer';
}

export interface SystemMetrics {
  intent_macro_f1: number;
  intent_categories_count: number;
  reply_quality_score: number;
  reply_quality_max: number;
  auto_handle_coverage: number;
  unsafe_auto_handle_rate: number;
  total_evaluated_cases: number;
  f1_trend_delta: string;
  reply_quality_delta: string;
  coverage_benchmark: string;
  unsafe_rate_benchmark: string;
}

export interface IntentMetricRow {
  label: IntentLabel;
  name: string;
  percentage: number;
  precision: number;
  recall: number;
  f1: number;
  support: number;
  is_best?: boolean;
  is_worst?: boolean;
}

export interface ConfusionMatrixCell {
  actual: IntentLabel;
  predicted: IntentLabel;
  count: number;
  percentage: number;
}

export interface BaselineComparisonRow {
  system: string;
  intent_macro_f1: number;
  reply_quality: number;
  auto_coverage: number;
  unsafe_rate: number;
  is_current?: boolean;
}

export interface QualityDimension {
  dimension: string;
  simple_retrieval: number;
  main_system: number;
  max_score: number;
}

export interface JudgeMetrics {
  spearman_correlation: number;
  cohens_kappa: number;
  exact_agreement_pct: number;
  within_one_agreement_pct: number;
  sample_size: number;
  description: string;
}

export interface AutomationCurvePoint {
  coverage: number;
  error_rate: number;
  is_operating_point?: boolean;
}

export interface FailureCase {
  id: string;
  category: string;
  title?: string;
  customer_message: string;
  example_input?: string;
  predicted_intent: string;
  actual_label?: string;
  predicted_label?: string;
  retrieved_evidence: string;
  retrieved_resolution?: string;
  system_reply: string;
  generated_reply?: string;
  hypothesis: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  mitigation: string;
  occurrence_rate?: string;
}

export interface DecisionLogItem {
  id: number;
  tag: string;
  title: string;
  context: string;
  decision: string;
  why: string;
  tradeoff: string;
}

export type DecisionLogEntry = DecisionLogItem;
