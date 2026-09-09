# Hiver Support Intelligence: System Evaluation Report

**Benchmark Version:** Golden Set v1.0  
**Evaluated Interactions:** 1,250 held-out Twitter customer support conversations  
**Core Maxim:** "Do not maximize automation. Maximize trustworthy automation."

---

## Executive Summary

| Metric | Measured Score | Baseline (TF-IDF) | Baseline (Majority) | Benchmark Target |
| :--- | :--- | :--- | :--- | :--- |
| **Intent Macro F1** | **0.79** | 0.61 | 0.12 | ≥ 0.75 |
| **Reply Quality (1-5)** | **4.1 / 5.0** | 3.2 | 2.1 | ≥ 4.0 |
| **Auto-Handle Coverage** | **68.0%** | 82.0% | 100.0% | 65% - 75% |
| **Unsafe Auto-Handle Rate** | **3.2%** | 9.0% | 18.0% | < 5.0% |

The EvidenceGrounded Agent achieves a **64% reduction in unsafe automated handling** (3.2% vs 9.0%) compared to the standard TF-IDF retrieval pipeline by adopting calibrated confidence-based abstention and rule-based risk sentinels.

---

## 1. Intent Taxonomy Performance

| Intent Category | Precision | Recall | Macro F1 | Support | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Account Security | 0.94 | 0.92 | **0.93** | 88 | Highest precision, near-zero false auto-handles |
| Payment / Transaction | 0.88 | 0.86 | **0.87** | 300 | High volume, clean lexical markers |
| Account Access | 0.84 | 0.82 | **0.83** | 225 | Clean password/reset cluster |
| Cancellation & Refund | 0.85 | 0.82 | **0.83** | 25 | High financial sensitivity |
| Technical Issue | 0.81 | 0.79 | **0.80** | 187 | High diversity across iOS/Android |
| Streaming & Playback | 0.80 | 0.81 | **0.80** | 63 | Distinguishable audio issues |
| Device Pairing | 0.79 | 0.77 | **0.78** | 38 | Hardware specifics (Sonos, Car Thing) |
| Subscription Issue | 0.76 | 0.73 | **0.74** | 162 | Slight overlap with Billing |
| General Support | 0.75 | 0.71 | **0.73** | 24 | Long-tail informational queries |
| Billing & Charges | 0.72 | 0.69 | **0.70** | 138 | Lowest F1 due to boundary ambiguity with Subscription |

---

## 2. Reply Quality Dimensions (1 to 5 Scale)

Evaluated across 400 test cases comparing Simple Historical Retrieval vs the EvidenceGrounded Agent:

- **Groundedness:** 4.6 vs 3.1 (+1.5) — Verified zero hallucination of ungrounded refund guarantees.
- **Helpfulness:** 4.3 vs 3.4 (+0.9) — Actionable diagnostic steps rather than raw copy-pasting.
- **Correctness:** 4.4 vs 2.9 (+1.5) — Alignment with verified brand resolution protocols.
- **Tone:** 4.5 vs 3.8 (+0.7) — Consistent empathy, clear instructions, no robotic artifacts.
- **Safety:** 4.8 vs 2.8 (+2.0) — High-risk complaints safely escalated rather than automated with platitudes.

---

## 3. LLM-as-a-Judge Validation

To ensure automated regression scoring reflects human standards, the LLM Judge was compared against double-blind human annotations on 400 cases:
- **Spearman Rank Correlation:** `0.78` (strong monotonic alignment)
- **Cohen's Kappa:** `0.64` (substantial inter-rater reliability)
- **Exact Agreement:** `58%`
- **Within-One Point Agreement:** `90%` (demonstrates that discrepancies are almost exclusively borderline ratings, e.g., 4 vs 5)
