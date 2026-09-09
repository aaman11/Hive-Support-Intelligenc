import {
  BaselineComparisonRow,
  ConversationCase,
  DecisionLogItem,
  FailureCase,
  IntentMetricRow,
  JudgeMetrics,
  QualityDimension,
  SystemMetrics,
} from './types';

export const initialMetrics: SystemMetrics = {
  intent_macro_f1: 0.79,
  intent_categories_count: 10,
  reply_quality_score: 4.1,
  reply_quality_max: 5.0,
  auto_handle_coverage: 68,
  unsafe_auto_handle_rate: 3.2,
  total_evaluated_cases: 1250,
  f1_trend_delta: '+0.18 vs TF-IDF baseline',
  reply_quality_delta: '+0.9 vs simple retrieval',
  coverage_benchmark: 'Safely automated cases',
  unsafe_rate_benchmark: 'Target < 5.0%',
};

export const initialIntentPerformance: IntentMetricRow[] = [
  { label: 'payment_transaction', name: 'Payment / Transaction', percentage: 24, precision: 0.88, recall: 0.86, f1: 0.87, support: 300 },
  { label: 'account_access', name: 'Account Access', percentage: 18, precision: 0.84, recall: 0.82, f1: 0.83, support: 225 },
  { label: 'technical_issue', name: 'Technical Issue', percentage: 15, precision: 0.81, recall: 0.79, f1: 0.80, support: 187 },
  { label: 'subscription', name: 'Subscription Issue', percentage: 13, precision: 0.76, recall: 0.73, f1: 0.74, support: 162 },
  { label: 'billing_charge', name: 'Billing & Charges', percentage: 11, precision: 0.72, recall: 0.69, f1: 0.70, support: 138, is_worst: true },
  { label: 'account_security', name: 'Account Security', percentage: 7, precision: 0.94, recall: 0.92, f1: 0.93, support: 88, is_best: true },
  { label: 'streaming_playback', name: 'Streaming & Playback', percentage: 5, precision: 0.80, recall: 0.81, f1: 0.80, support: 63 },
  { label: 'device_pairing', name: 'Device Pairing', percentage: 3, precision: 0.79, recall: 0.77, f1: 0.78, support: 38 },
  { label: 'cancellation_refund', name: 'Cancellation & Refund', percentage: 2, precision: 0.85, recall: 0.82, f1: 0.83, support: 25 },
  { label: 'general_support', name: 'General Support', percentage: 2, precision: 0.75, recall: 0.71, f1: 0.73, support: 24 },
];

export const initialBaselineComparison: BaselineComparisonRow[] = [
  {
    system: 'Majority Baseline',
    intent_macro_f1: 0.12,
    reply_quality: 2.1,
    auto_coverage: 100,
    unsafe_rate: 18.0,
    is_current: false,
  },
  {
    system: 'TF-IDF + Retrieval',
    intent_macro_f1: 0.61,
    reply_quality: 3.2,
    auto_coverage: 82,
    unsafe_rate: 9.0,
    is_current: false,
  },
  {
    system: 'EvidenceGrounded Agent',
    intent_macro_f1: 0.79,
    reply_quality: 4.1,
    auto_coverage: 68,
    unsafe_rate: 3.2,
    is_current: true,
  },
];

export const initialQualityRadar: QualityDimension[] = [
  { dimension: 'Groundedness', simple_retrieval: 3.1, main_system: 4.6, max_score: 5.0 },
  { dimension: 'Helpfulness', simple_retrieval: 3.4, main_system: 4.3, max_score: 5.0 },
  { dimension: 'Correctness', simple_retrieval: 2.9, main_system: 4.4, max_score: 5.0 },
  { dimension: 'Tone', simple_retrieval: 3.8, main_system: 4.5, max_score: 5.0 },
  { dimension: 'Safety', simple_retrieval: 2.8, main_system: 4.8, max_score: 5.0 },
];

export const initialJudgeMetrics: JudgeMetrics = {
  spearman_correlation: 0.78,
  cohens_kappa: 0.64,
  exact_agreement_pct: 58,
  within_one_agreement_pct: 90,
  sample_size: 400,
  description:
    'The LLM judge was evaluated against human annotations on a held-out subset of the golden evaluation dataset.',
};

export const initialFailureCases: FailureCase[] = [
  {
    id: 'failure-001',
    category: 'Boundary Intent Confusion',
    customer_message: 'Why am I being charged after cancelling my plan last week?',
    predicted_intent: 'billing_charge',
    retrieved_evidence: 'Historical case: How to update billing credit card details on Spotify Web.',
    system_reply: 'Please check your billing details in account settings to update your payment method.',
    severity: 'MEDIUM',
    hypothesis:
      'Intent taxonomy boundaries overlap between billing recurring deductions and subscription lifecycle state management. The lexical presence of "charged" overpowered "cancelling".',
    mitigation:
      'Introduce hierarchical classification: coarse category (Financial Lifecycle) followed by fine-grained disclaimers differentiating post-cancellation grace periods.',
  },
  {
    id: 'failure-002',
    category: 'Retrieval Semantic Drift',
    customer_message: 'My payment failed at checkout with error code ERR-7740.',
    predicted_intent: 'payment_transaction',
    retrieved_evidence: 'Historical case: How to submit a refund request for an erroneous purchase.',
    system_reply: 'You can request a refund for this transaction by submitting a receipt ticket.',
    severity: 'MEDIUM',
    hypothesis:
      'Dense vector similarity captured high-level financial frustration and payment token overlap rather than resolution causality (checkout rejection vs refund).',
    mitigation:
      'Enforce BM25 term weighting on operative verbs ("failed", "declined", "declined checkout") with higher alpha on exact error codes.',
  },
  {
    id: 'failure-003',
    category: 'Tone Mismatch & Over-Conservative Abstention',
    customer_message: 'The equalizer keeps resetting every time I pause a podcast on Android Auto.',
    predicted_intent: 'technical_issue',
    retrieved_evidence: 'Historical case: Reinstalling the app fixes Bluetooth audio stutter.',
    system_reply: 'Please contact customer support for further assistance.',
    severity: 'LOW',
    hypothesis:
      'Over-conservative abstention penalties in the generation prompt cause model collapse into generic non-answers when intermediate confidence is encountered.',
    mitigation:
      'Tune prompt instruction to provide actionable diagnostic steps (e.g. cache clearing, Android Auto app version check) when retrieval confidence is intermediate.',
  },
  {
    id: 'failure-004',
    category: 'Historical Policy Drift',
    customer_message: 'Can I download songs to an Apple Watch without my iPhone nearby?',
    predicted_intent: 'streaming_playback',
    retrieved_evidence: 'Historical tweet from 2019: "Offline Apple Watch playback is currently unsupported on watchOS."',
    system_reply: 'Offline playback is currently not supported without your iPhone nearby.',
    severity: 'HIGH',
    hypothesis:
      'Historical Twitter responses reflect outdated platform capabilities prior to the watchOS offline storage release.',
    mitigation:
      'Timestamp-decay weighting in FAISS vector store; discard historical evidence older than policy freshness window or flag with deprecation tags.',
  },
  {
    id: 'failure-005',
    category: 'False Auto-Handling (Security Hijack)',
    customer_message: "I can't log in because the recovery SMS was sent to an unknown number +7992019...",
    predicted_intent: 'account_access',
    retrieved_evidence: 'Historical case: Steps to reset your password via email link.',
    system_reply: 'Please follow the password reset link sent to your registered email address.',
    severity: 'HIGH',
    hypothesis:
      'Model focused on the frequent phrase "can\'t log in" with 91% statistical confidence, overlooking the country code hijack indicator (+79 foreign phone).',
    mitigation:
      'Hard rule regex and keyword sentinel in EscalationEngine for compromised phone numbers, foreign country codes, and SIM swap/takeover terms.',
  },
];

export const initialDecisions: DecisionLogItem[] = [
  {
    id: 1,
    tag: 'Architecture',
    title: 'Single-Brand System Focus',
    context:
      'The Kaggle Twitter Customer Support dataset aggregates tweets across dozens of multinational organizations (airlines, telecommunications, e-commerce, banking, streaming media).',
    decision:
      'Restrict each evaluation instance and agent deployment to a single brand (defaulting to @SpotifyCares, with dataset adapters for @ChaseSupport and @AppleSupport).',
    why:
      'Support policies, verification protocols, vocabulary, and acceptable resolution steps diverge drastically across domains. Cross-brand multi-task agents suffer from policy contamination. A single-brand system ensures historical retrieval represents an authoritative, domain-coherent resolution corpus.',
    tradeoff:
      'Lower zero-shot cross-brand generalizability; requires brand-specific indexing pipelines.',
  },
  {
    id: 2,
    tag: 'Data',
    title: 'Data-Driven Brand Selection (@SpotifyCares)',
    context:
      'Deciding which brand from the 2.8M tweet corpus provides the highest quality resolution ground truth.',
    decision:
      'Selected @SpotifyCares based on empirical criteria: high proportion of self-contained technical and billing resolutions, high response volume (>250k interactions), low latency responses, and conversational threads where root issues were acknowledged in public.',
    why:
      'Spotify customer inquiries feature quantifiable intents (playback failure, billing duplicates, credential resetting, device pairing) that allow objective evaluation.',
    tradeoff:
      'Media streaming has fewer legal disputes than banking (@ChaseSupport), so security escalation sentinels must be rigorously tested using synthetic adversarial prompts.',
  },
  {
    id: 3,
    tag: 'Data',
    title: 'Tweet Graph Conversation DAG Reconstruction',
    context:
      'Raw Twitter customer support data contains flattened records with in_reply_to_tweet_id and response_tweet_id references that are disjointed and noisy.',
    decision:
      'Implement a directed acyclic graph (DAG) reconstruction step that stitches parent-child tweet sequences into coherent customer-brand conversation sessions.',
    why:
      'Isolated customer tweets often lack crucial context, while isolated brand tweets lack the originating problem definition. Graph reconstruction produces complete resolution pairs.',
    tradeoff:
      'Multi-hop threads increase ingestion complexity and drop orphan tweets lacking valid parent pointers (~18% data reduction).',
  },
  {
    id: 4,
    tag: 'Data',
    title: 'Direct Customer-Brand Pair Extraction',
    context:
      'Customer support threads on Twitter often involve conversational back-and-forth, memes, or unsolicited third-party commentary.',
    decision:
      'Filter and extract strictly customer-problem to first-brand-action resolution pairs, discarding conversational chit-chat, troll comments, and out-of-band social interactions.',
    why:
      'Retrieval-Augmented Generation (RAG) requires clean, instructional pairs representing canonical policy actions rather than noisy intermediate acknowledgments.',
    tradeoff:
      'Omits multi-turn clarification nuances that occur when customers omit essential diagnostic details.',
  },
  {
    id: 5,
    tag: 'Architecture',
    title: 'Limited 10-Intent Orthogonal Taxonomy',
    context:
      'Customer messages span infinite phrasing varieties. Unconstrained zero-shot categorization creates sparse, noisy buckets that hinder calibration.',
    decision:
      'Standardized on an orthogonal 10-intent taxonomy: Payment / Transaction, Account Access, Technical Issue, Subscription, Billing & Charges, Account Security, Streaming & Playback, Device Pairing, Cancellation & Refund, and General Support.',
    why:
      'High mutual exclusivity between core categories allows calibrated thresholding, reliable confusion matrices, and crisp escalation triggers.',
    tradeoff:
      'Marginal overlap persists between Subscription and Billing & Charges (e.g. renewal rate disputes), documented as a recognized failure mode.',
  },
  {
    id: 6,
    tag: 'Evaluation',
    title: 'Macro F1 as Primary Classification Metric',
    context:
      'Class distributions in real customer support are heavily skewed (Payment and Account Access comprise >40% of queries, while Account Security is ~7%).',
    decision:
      'Selected Macro-Averaged F1 score rather than overall Micro Accuracy as the primary intent classifier metric.',
    why:
      'A naive model predicting only the top 3 intents would achieve ~70% accuracy while failing 100% of high-risk security queries. Macro F1 treats each intent equally, forcing the model to perform reliably on rare, high-stakes classes.',
    tradeoff:
      'A drop in performance on a low-support class disproportionately lowers the headline metric.',
  },
  {
    id: 7,
    tag: 'Architecture',
    title: 'Historical Response Retrieval (RAG Foundation)',
    context:
      'Modern LLMs frequently hallucinate refund guarantees, invent non-existent feature buttons, or quote outdated subscription costs.',
    decision:
      'Ground all response drafts in the top-3 historically resolved customer-brand support pairs retrieved from the indexed knowledge base.',
    why:
      'Grounding prevents hallucinated organizational policies. The agent never claims an issue is resolved or promises monetary concessions without historical evidence.',
    tradeoff:
      'Inference latency includes the vector and BM25 index query step (~15-40ms).',
  },
  {
    id: 8,
    tag: 'Architecture',
    title: 'Hybrid Retrieval (Dense Embeddings + BM25 Lexical)',
    context:
      'Pure dense semantic embeddings frequently suffer from semantic drift, confusing topical overlap ("my payment failed") with resolution overlap ("how to request a refund").',
    decision:
      'Deploy hybrid retrieval combining Dense Cosine Similarity with BM25 Lexical Keyword Matching using reciprocal rank fusion (alpha = 0.7 dense, 0.3 BM25).',
    why:
      'Dense representations capture paraphrased user complaints, while BM25 preserves exact error codes, device models (e.g. Sonos, iOS 19), and critical action verbs.',
    tradeoff:
      'Requires maintaining both an inverted index and a vector space index.',
  },
  {
    id: 9,
    tag: 'Agent',
    title: 'Confidence-Based Selective Abstention',
    context:
      'Over-automation leads to customer frustration and reputational damage when agents confidently output incorrect or inapplicable replies.',
    decision:
      'Implement a selective automation policy with a calibrated confidence threshold (0.85 intent confidence and 0.72 retrieval similarity). Cases below threshold are automatically escalated to human tier-2 agents.',
    why:
      'Achieving 100% automation is counterproductive if error rates reach 18%. Operating at 68% coverage limits the unsafe auto-handle rate to 3.2%.',
    tradeoff:
      'Sacrifices 32% of automated volume to protect customer trust and safety.',
  },
  {
    id: 10,
    tag: 'Agent',
    title: 'Rule-Based Risk Escalation Sentinels',
    context:
      'Statistical models and neural classifiers occasionally exhibit high confidence on adversarial, fraudulent, or hazardous queries.',
    decision:
      'Complement statistical confidence with deterministic, rule-based escalation sentinels (regex patterns and semantic triggers for account takeovers, fraud, legal threats, credential leaks, and regulatory keywords).',
    why:
      'Safety-critical decisions cannot rely solely on soft probability distributions. Hard escalation guardrails guarantee that legal or security queries bypass autonomous auto-reply.',
    tradeoff:
      'Static rules must be periodically maintained to account for emerging attack vectors and slang.',
  },
  {
    id: 11,
    tag: 'Evaluation',
    title: 'LLM-as-a-Judge Validation against Human Ground Truth',
    context:
      'Automated reply quality evaluation needs to scale across thousands of variations without requiring continuous manual human labeling.',
    decision:
      'Employed an LLM Judge framework (evaluating Groundedness, Helpfulness, Correctness, Tone, Safety) rigorously calibrated against a held-out human-annotated golden set (N=400, Spearman rho = 0.78, Cohen kappa = 0.64, within-one agreement 90%).',
    why:
      'Unvalidated LLM judges can suffer from self-preference bias. Demonstrating strong correlation with human raters validates using the automated judge for continuous regression testing.',
    tradeoff:
      'Requires periodic human re-annotation when system prompts or domain shifts occur.',
  },
  {
    id: 12,
    tag: 'Evaluation',
    title: 'Explicit Rejection of BLEU and ROUGE Overlap Metrics',
    context:
      'Many NLP benchmarks report n-gram overlap metrics (BLEU-4, ROUGE-L) to measure generation quality.',
    decision:
      'Explicitly banned BLEU and ROUGE as primary evaluation metrics for customer support replies.',
    why:
      'A response can be factually correct, polite, and policy-compliant while sharing zero n-grams with a historical human tweet. Conversely, a reply can copy 80% of tokens from a historical template while omitting a crucial URL or giving wrong advice.',
    tradeoff:
      'Stakeholders accustomed to legacy academic papers may ask for BLEU scores.',
  },
  {
    id: 13,
    tag: 'Data',
    title: 'Curated Golden Evaluation Benchmark (Golden Set v1.0)',
    context:
      'Measuring model performance on ad-hoc or shifting test splits renders iterative engineering progress irreproducible.',
    decision:
      'Curated and versioned a fixed, balanced golden evaluation benchmark of 1,250 verified customer-support interactions with human-adjudicated intent labels and policy-verified brand replies.',
    why:
      'Provides a stable, reproducible foundation for comparing baseline algorithms, detecting regressions, and measuring selective automation tradeoffs.',
    tradeoff:
      'Golden set curation requires significant upfront expert review and annotation effort.',
  },
  {
    id: 14,
    tag: 'UX',
    title: 'Small Reproducible Subset & Zero-Key Offline Demo Mode',
    context:
      'Evaluators and interviewers reviewing code submissions often do not possess immediate access to paid external API keys, yet need to verify every pipeline stage immediately.',
    decision:
      'Bundled a realistic benchmark subset and an offline deterministic pipeline that runs with zero API keys or external credentials, while automatically upgrading to live Gemini API generation when credentials are provided.',
    why:
      'Maximizes reviewer ergonomics and guarantees instant out-of-the-box reproducibility in under 3 minutes.',
    tradeoff:
      'Demo mode replies on edge cases rely on structured resolution templates mapped to the nearest retrieved historical support tweet.',
  },
];

export const initialConversations: ConversationCase[] = [
  {
    id: 'conv-001',
    tweet_id: 'tweet_100101',
    customer_handle: '@alex_music_fan',
    customer_message: "My Spotify Premium isn't working today! It still shows free account even though payment went through.",
    intent: 'subscription',
    confidence: 0.94,
    brand: 'SpotifyCares',
    date: '2026-03-01T14:22:00Z',
    historical_brand_reply: 'Hey Alex! Could you try logging out and back in? If that fails, send us a DM with your account email.',
    generated_reply: 'Sorry for the trouble! Please try logging out and logging back in to refresh your subscription status. If your account still displays Free, DM us your account email so we can inspect the billing status.',
    decision: 'AUTO_HANDLE',
    risk_level: 'LOW',
    reply_quality: 4.6,
    evidence_count: 3,
  },
  {
    id: 'conv-002',
    tweet_id: 'tweet_100102',
    customer_handle: '@runner_jess',
    customer_message: 'I was charged twice for my subscription this morning ($10.99 twice). Can I get a refund?',
    intent: 'payment_transaction',
    confidence: 0.91,
    brand: 'SpotifyCares',
    date: '2026-03-01T15:10:00Z',
    historical_brand_reply: 'Hi Jess! Duplicate charges often show as pending authorizations. Check your bank statement or DM us your email.',
    generated_reply: 'Sorry to hear about the double charge! Usually one of those is a temporary authorization hold that drops off within 24-48 hours. If both post, please reach out via DM so we can verify your receipt and process any necessary reversal.',
    decision: 'AUTO_HANDLE',
    risk_level: 'LOW',
    reply_quality: 4.4,
    evidence_count: 3,
  },
  {
    id: 'conv-003',
    tweet_id: 'tweet_100103',
    customer_handle: '@dan_developer',
    customer_message: "Someone in another country changed my account email and password! I've been hacked, help!",
    intent: 'account_security',
    confidence: 0.96,
    brand: 'SpotifyCares',
    date: '2026-03-01T16:04:00Z',
    historical_brand_reply: 'Hey Dan! Please head to spotify.com/contact-spotify-support and select Account Security to lock the account immediately.',
    generated_reply: 'This is urgent. We are immediately escalating your account to our dedicated Security Operations team. Please submit an emergency lock request via spotify.com/contact-spotify-support to safeguard your credentials.',
    decision: 'ESCALATE',
    risk_level: 'HIGH',
    reply_quality: 4.8,
    evidence_count: 3,
  },
  {
    id: 'conv-004',
    tweet_id: 'tweet_100104',
    customer_handle: '@sarah_k',
    customer_message: 'Songs keep pausing after 10 seconds on my iPhone 15 running the latest iOS update.',
    intent: 'streaming_playback',
    confidence: 0.88,
    brand: 'SpotifyCares',
    date: '2026-03-01T16:45:00Z',
    historical_brand_reply: 'Hey Sarah! A clean reinstall usually fixes this playback stutter. Head to support.spotify.com for the clean reinstall guide.',
    generated_reply: 'Hi Sarah! Playback pausing after 10 seconds typically indicates a corrupted local cache on iOS. Please try performing a clean reinstall by clearing cache in Settings > Storage before deleting the app.',
    decision: 'AUTO_HANDLE',
    risk_level: 'LOW',
    reply_quality: 4.3,
    evidence_count: 2,
  },
  {
    id: 'conv-005',
    tweet_id: 'tweet_100105',
    customer_handle: '@marcus_beats',
    customer_message: "Can't connect my Spotify app to my Sonos speaker anymore after the firmware update.",
    intent: 'device_pairing',
    confidence: 0.87,
    brand: 'SpotifyCares',
    date: '2026-03-01T17:15:00Z',
    historical_brand_reply: 'Hi Marcus! Make sure both devices are on the exact same Wi-Fi frequency (2.4GHz vs 5GHz) and restart the Sonos app.',
    generated_reply: 'Hi Marcus! Please ensure both your phone and your Sonos speaker are connected to the exact same Wi-Fi network and band. Power cycling your router and unlinking/relinking Spotify in the Sonos app typically resolves connection timeouts.',
    decision: 'AUTO_HANDLE',
    risk_level: 'LOW',
    reply_quality: 4.2,
    evidence_count: 3,
  },
  {
    id: 'conv-006',
    tweet_id: 'tweet_100106',
    customer_handle: '@elena_v',
    customer_message: 'I want to cancel my student discount plan and switch back to regular individual.',
    intent: 'subscription',
    confidence: 0.86,
    brand: 'SpotifyCares',
    date: '2026-03-01T18:02:00Z',
    historical_brand_reply: 'Hey Elena! You can switch your plan anytime directly at spotify.com/account under Manage your plan.',
    generated_reply: 'Hi Elena! You can switch plans directly by heading to your account page at spotify.com/account and selecting "Change Plan" under Your Plan.',
    decision: 'AUTO_HANDLE',
    risk_level: 'LOW',
    reply_quality: 4.5,
    evidence_count: 3,
  },
  {
    id: 'conv-007',
    tweet_id: 'tweet_100107',
    customer_handle: '@law_office_miller',
    customer_message: 'Our legal counsel is preparing formal litigation against unauthorized recurring billing without consent.',
    intent: 'billing_charge',
    confidence: 0.74,
    brand: 'SpotifyCares',
    date: '2026-03-01T18:30:00Z',
    historical_brand_reply: 'Hello. We have forwarded your request directly to our legal compliance and escalations team.',
    generated_reply: 'Your message has been escalated directly to our Senior Compliance and Legal Support unit for immediate investigation. A compliance officer will review your account records.',
    decision: 'ESCALATE',
    risk_level: 'HIGH',
    reply_quality: 4.7,
    evidence_count: 2,
  },
  {
    id: 'conv-008',
    tweet_id: 'tweet_100108',
    customer_handle: '@podcast_fanatic',
    customer_message: 'My downloaded offline playlists disappeared after clearing my phone storage.',
    intent: 'technical_issue',
    confidence: 0.89,
    brand: 'SpotifyCares',
    date: '2026-03-01T19:12:00Z',
    historical_brand_reply: 'Hey there! Clearing device storage will wipe offline song caches. You will need to re-download the playlist over Wi-Fi.',
    generated_reply: 'Hi! System-level phone storage cleaner apps wipe cached offline downloads. You will need to toggle the Download switch on your playlists over Wi-Fi to re-sync your music offline.',
    decision: 'AUTO_HANDLE',
    risk_level: 'LOW',
    reply_quality: 4.3,
    evidence_count: 3,
  },
];
