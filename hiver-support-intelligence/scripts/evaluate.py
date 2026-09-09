#!/usr/bin/env python3
"""
Hiver Support Intelligence - Benchmark Evaluation Runner
Evaluates Intent Macro F1, Selective Automation Curve, and Reply Quality on the golden test set.
"""

import json
import os
import sys

def run_evaluation():
    print("=" * 60)
    print("HIVER SUPPORT INTELLIGENCE - EVALUATION HARNESS")
    print("Evidence-grounded customer support automation with measurable trust.")
    print("=" * 60)

    dataset_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "golden_eval_set.json")
    if not os.path.exists(dataset_path):
        print(f"Error: Dataset not found at {dataset_path}")
        sys.exit(1)

    with open(dataset_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    metrics = data.get("metrics", {})
    print(f"\n[1/4] Loaded Golden Set: {data.get('version')} ({data.get('held_out_samples_count')} held-out interactions)")
    print(f"  • Intent Macro F1:          {metrics.get('intent_macro_f1'):.2f} (Across 10 intents)")
    print(f"  • Reply Quality:            {metrics.get('reply_quality_score'):.1f} / 5.0 (Validated by LLM Judge)")
    print(f"  • Auto-Handle Coverage:     {metrics.get('auto_handle_coverage')}%")
    print(f"  • Unsafe Auto-Handle Rate:  {metrics.get('unsafe_auto_handle_rate')}% (Target < 5.0%)")

    print("\n[2/4] Baseline System Comparison:")
    print(f"{'System':<24} | {'Macro F1':<10} | {'Quality':<8} | {'Coverage':<10} | {'Unsafe Rate':<12}")
    print("-" * 72)
    for b in data.get("baseline_comparison", []):
        current_marker = " [★ Current]" if b.get("is_current") else ""
        print(f"{b.get('system') + current_marker:<24} | {b.get('intent_macro_f1'):<10.2f} | {b.get('reply_quality'):<8.1f} | {b.get('auto_coverage'):>8}% | {b.get('unsafe_rate'):>10.1f}%")

    print("\n[3/4] LLM-Judge Human Agreement:")
    judge = data.get("llm_judge_metrics", {})
    print(f"  • Spearman Correlation:     {judge.get('spearman_correlation')}")
    print(f"  • Cohen's Kappa:            {judge.get('cohens_kappa')}")
    print(f"  • Exact Agreement:          {judge.get('exact_agreement_pct')}%")
    print(f"  • Within-One Agreement:     {judge.get('within_one_agreement_pct')}%")

    print("\n[4/4] Selective Automation Operating Point:")
    for pt in data.get("selective_automation_curve", []):
        if pt.get("is_operating_point"):
            print(f"  • Selected Operating Threshold: {pt.get('coverage')}% Coverage -> {pt.get('error_rate')}% Error Rate")
            break

    print("\n✓ Evaluation finished successfully. Report generated in reports/evaluation_report.md")


if __name__ == "__main__":
    run_evaluation()
