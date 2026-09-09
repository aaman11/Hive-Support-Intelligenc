"""
Unit tests for the Hiver Support Intelligence AI Pipeline.
Verifies intent classification, hybrid retrieval, escalation rules, and safety abstention.
Compatible with both unittest and pytest runners.
"""

import unittest
from backend.pipeline import AgentPipeline, IntentClassifier, EscalationEngine


class TestPipeline(unittest.TestCase):
    def setUp(self):
        self.pipeline = AgentPipeline()

    def test_intent_classification(self):
        result = self.pipeline.classifier.predict("I was charged twice for my subscription this month")
        self.assertIn(result.label, ["payment_transaction", "billing_charge", "subscription"])
        self.assertGreaterEqual(result.confidence, 0.70)
        self.assertGreater(len(result.alternatives), 0)

    def test_security_escalation_rule(self):
        result = self.pipeline.process("Someone hacked into my account and changed the email to a Russian domain!")
        self.assertEqual(result.decision.action, "ESCALATE")
        self.assertEqual(result.decision.risk_level, "HIGH")
        self.assertTrue(any("Security" in factor.name and not factor.passed for factor in result.decision.factors))

    def test_legal_threat_escalation(self):
        result = self.pipeline.process("I will have my lawyer sue your company for unauthorized billing fraud")
        self.assertEqual(result.decision.action, "ESCALATE")
        self.assertEqual(result.decision.risk_level, "HIGH")

    def test_safe_auto_handle(self):
        result = self.pipeline.process("How do I clear the cache on my mobile app to fix offline songs?")
        self.assertEqual(result.decision.action, "AUTO_HANDLE")
        self.assertEqual(result.decision.risk_level, "LOW")
        self.assertGreater(len(result.retrieval), 0)
        self.assertTrue("cache" in result.generated_reply.lower() or "app" in result.generated_reply.lower())

    def test_confidence_abstention(self):
        # Highly ambiguous message
        result = self.pipeline.process("Wait what about that yesterday thing")
        self.assertEqual(result.decision.action, "ESCALATE")
        self.assertTrue(result.decision.confidence < 0.85 or result.intent.confidence < 0.85)


if __name__ == "__main__":
    unittest.main()
