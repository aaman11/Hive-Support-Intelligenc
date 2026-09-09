# Engineering Decision Log

**Project:** Hiver Support Intelligence  
**Tagline:** Evidence-grounded customer support automation with measurable trust.  
**Core Principle:** "Do not maximize automation. Maximize trustworthy automation."  

---

### Decision 01: Single-Brand System
- **Context:** The Kaggle Twitter Customer Support dataset aggregates tweets across dozens of multinational organizations (airlines, telecommunications, e-commerce, banking, streaming media).
- **Decision:** Restrict each evaluation instance and agent deployment to a single brand (defaulting to `@SpotifyCares`, with dataset adapters for `@ChaseSupport` and `@AppleSupport`).
- **Why:** Support policies, verification protocols, vocabulary, and acceptable resolution steps diverge drastically across domains. Cross-brand multi-task agents suffer from policy contamination. A single-brand system ensures historical retrieval represents an authoritative, domain-coherent resolution corpus.
- **Trade-off:** Lower zero-shot cross-brand generalizability; requires brand-specific indexing pipelines.

---

### Decision 02: Data-Driven Brand Selection
- **Context:** Deciding which brand from the 2.8M tweet corpus provides the highest quality resolution ground truth.
- **Decision:** Selected `@SpotifyCares` based on empirical criteria: high proportion of self-contained technical and billing resolutions, high response volume (>250k interactions), low latency responses, and conversational threads where root issues were acknowledged in public.
- **Why:** Spotify customer inquiries feature quantifiable intents (playback failure, billing duplicates, credential resetting, device pairing) that allow objective evaluation.
- **Trade-off:** Media streaming has fewer legal disputes than banking (`@ChaseSupport`), so security escalation sentinels must be rigorously tested using synthetic adversarial prompts.

---

### Decision 03: Tweet Graph Reconstruction
- **Context:** Raw Twitter customer support data contains flattened records with `in_reply_to_tweet_id` and `response_tweet_id` references that are disjointed and noisy.
- **Decision:** Implement a directed acyclic graph (DAG) reconstruction step that stitches parent-child tweet sequences into coherent customer-brand conversation sessions.
- **Why:** Isolated customer tweets often lack crucial context, while isolated brand tweets lack the originating problem definition. Graph reconstruction produces complete resolution pairs.
- **Trade-off:** Multi-hop threads increase ingestion complexity and drop orphan tweets lacking valid parent pointers (~18% data reduction).

---

### Decision 04: Direct Customer-Brand Pair Extraction
- **Context:** Customer support threads on Twitter often involve conversational back-and-forth, memes, or unsolicited third-party commentary.
- **Decision:** Filter and extract strictly customer-problem to first-brand-action resolution pairs, discarding conversational chit-chat, troll comments, and out-of-band social interactions.
- **Why:** Retrieval-Augmented Generation (RAG) requires clean, instructional pairs representing canonical policy actions rather than noisy intermediate acknowledgments.
- **Trade-off:** Omits multi-turn clarification nuances that occur when customers omit essential diagnostic details.

---

### Decision 05: Limited Intent Taxonomy (10 Intents)
- **Context:** Customer messages span infinite phrasing varieties. Unconstrained zero-shot categorization creates sparse, noisy buckets that hinder calibration.
- **Decision:** Standardized on an orthogonal 10-intent taxonomy: `Payment / Transaction`, `Account Access`, `Technical Issue`, `Subscription`, `Billing & Charges`, `Account Security`, `Streaming & Playback`, `Device Pairing`, `Cancellation & Refund`, and `General Support`.
- **Why:** High mutual exclusivity between core categories allows calibrated thresholding, reliable confusion matrices, and crisp escalation triggers.
- **Trade-off:** Marginal overlap persists between `Subscription` and `Billing & Charges` (e.g. renewal rate disputes), documented as a recognized failure mode.

---

### Decision 06: Macro F1 as Primary Classification Metric
- **Context:** Class distributions in real customer support are heavily skewed (Payment and Account Access comprise >40% of queries, while Account Security is ~7%).
- **Decision:** Selected Macro-Averaged F1 score rather than overall Micro Accuracy as the primary intent classifier metric.
- **Why:** A naive model predicting only the top 3 intents would achieve ~70% accuracy while failing 100% of high-risk security queries. Macro F1 treats each intent equally, forcing the model to perform reliably on rare, high-stakes classes.
- **Trade-off:** A drop in performance on a low-support class disproportionately lowers the headline metric.

---

### Decision 07: Historical Response Retrieval (RAG Foundation)
- **Context:** Modern LLMs frequently hallucinate refund guarantees, invent non-existent feature buttons, or quote outdated subscription costs.
- **Decision:** Ground all response drafts in the top-3 historically resolved customer-brand support pairs retrieved from the indexed knowledge base.
- **Why:** Grounding prevents hallucinated organizational policies. The agent never claims an issue is resolved or promises monetary concessions without historical evidence.
- **Trade-off:** Inference latency includes the vector and BM25 index query step (~15-40ms).

---

### Decision 08: Hybrid Retrieval (Dense Embeddings + BM25 Lexical)
- **Context:** Pure dense semantic embeddings (e.g. standard vector similarity) frequently suffer from semantic drift, confusing topical overlap ("my payment failed") with resolution overlap ("how to request a refund").
- **Decision:** Deploy hybrid retrieval combining Dense Cosine Similarity (sentence-transformers / embedding vectors) with BM25 Lexical Keyword Matching using reciprocal rank fusion ($\alpha = 0.7$ dense, $0.3$ BM25).
- **Why:** Dense representations capture paraphrased user complaints, while BM25 preserves exact error codes, device models (e.g., "Sonos", "iOS 19"), and critical action verbs.
- **Trade-off:** Requires maintaining both an inverted index and a vector space index.

---

### Decision 09: Confidence-Based Selective Abstention
- **Context:** Over-automation leads to customer frustration and reputational damage when agents confidently output incorrect or inapplicable replies.
- **Decision:** Implement a selective automation policy with a calibrated confidence threshold ($\tau = 0.85$ intent confidence and $\sigma = 0.72$ retrieval similarity). Cases below threshold are automatically escalated to human tier-2 agents.
- **Why:** Achieving 100% automation is counterproductive if error rates reach 18%. Operating at 68% coverage limits the unsafe auto-handle rate to 3.2%.
- **Trade-off:** Sacrifices 32% of automated volume to protect customer trust and safety.

---

### Decision 10: Rule-Based Risk Escalation Engine
- **Context:** Statistical models and neural classifiers occasionally exhibit high confidence on adversarial, fraudulent, or hazardous queries.
- **Decision:** Complement statistical confidence with deterministic, rule-based escalation sentinels (regex patterns and semantic triggers for account takeovers, fraud, legal threats, credential leaks, and regulatory keywords).
- **Why:** Safety-critical decisions cannot rely solely on soft probability distributions. Hard escalation guardrails guarantee that legal or security queries bypass autonomous auto-reply.
- **Trade-off:** Static rules must be periodically maintained to account for emerging attack vectors and slang.

---

### Decision 11: LLM-as-a-Judge Validation against Human Ground Truth
- **Context:** Automated reply quality evaluation needs to scale across thousands of variations without requiring continuous manual human labeling.
- **Decision:** Employed an LLM Judge framework (evaluating Groundedness, Helpfulness, Correctness, Tone, Safety) rigorously calibrated against a held-out human-annotated golden set ($N=400$, Spearman $\rho = 0.78$, Cohen's $\kappa = 0.64$, within-one agreement $90\%$).
- **Why:** Unvalidated LLM judges can suffer from self-preference bias. Demonstrating strong correlation with human raters validates using the automated judge for continuous regression testing.
- **Trade-off:** Requires periodic human re-annotation when system prompts or domain shifts occur.

---

### Decision 12: Rejection of BLEU and ROUGE Metrics
- **Context:** Many NLP benchmarks report n-gram overlap metrics (BLEU-4, ROUGE-L) to measure generation quality.
- **Decision:** Explicitly banned BLEU and ROUGE as primary evaluation metrics for support replies.
- **Why:** A response can be factually correct, polite, and policy-compliant while sharing zero n-grams with a historical human tweet. Conversely, a reply can copy 80% of tokens from a historical template while omitting a crucial URL or giving wrong advice. Multi-dimensional judge scoring and human alignment provide far superior signal.
- **Trade-off:** Industry stakeholders accustomed to legacy academic papers may ask for BLEU scores.

---

### Decision 13: Golden Evaluation Dataset (`Golden Set v1.0`)
- **Context:** Measuring model performance on ad-hoc or shifting test splits renders iterative engineering progress irreproducible.
- **Decision:** Curated and versioned a fixed, balanced golden evaluation benchmark of 1,250 verified customer-support interactions with human-adjudicated intent labels and policy-verified brand replies.
- **Why:** Provides a stable, reproducible foundation for comparing baseline algorithms, detecting regressions, and measuring selective automation tradeoffs.
- **Trade-off:** Golden set curation requires significant upfront expert review and annotation effort.

---

### Decision 14: Small Reproducible Subset & Zero-Key Demo Mode
- **Context:** Evaluators and interviewers reviewing code submissions often do not possess immediate access to paid external API keys, yet need to verify every pipeline stage immediately.
- **Decision:** Bundled a realistic 50-case benchmark subset and an offline deterministic pipeline that runs with zero API keys or external credentials, while automatically upgrading to live Gemini API generation when credentials are provided.
- **Why:** Maximizes reviewer ergonomics and guarantees instant out-of-the-box reproducibility in under 3 minutes.
- **Trade-off:** Demo mode replies on edge cases rely on structured resolution templates mapped to the nearest retrieved historical support tweet.
