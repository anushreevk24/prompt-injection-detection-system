export interface AnalyzeRequest {
  text: string
}

export interface AnalyzeResponse {
  text: string
  prediction_id?: number

  ml: MLResult
  rules: RuleResult
  semantic: SemanticResult
  semantic_evidence: SemanticEvidence

  fusion: FusionResult

  threat_score: number
  decision: Decision
  severity: Severity

  detector_votes: DetectorVotes

  // Reserved for future backend extensions.
  hypothesis?: string
  description?: string
  confidence?: number
  recommended_action?: string
  hypotheses?: HypothesisResult[]
  evidence?: EvidenceItem[]
}

export type Decision = 'ALLOW' | 'REVIEW' | 'BLOCK'

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH'

export interface MLResult {
  label: number
  probability: number
}

export interface RuleResult {
  score: number
  is_threat: boolean
  categories: string[]
  matched_rules: string[]
}

export interface SemanticResult {
  similarity: number
  score: number
  threshold: number
  is_threat: boolean
  matched_label: number
  matched_text: string
  is_malicious_match: boolean
  threat_score: number

  // Additional fields returned by the semantic detector.
  [key: string]: unknown
}

export interface SemanticEvidence {
  similarity: number
  matched_label: number
  malicious_match: boolean
  threat_score: number
  malicious_neighbor_count: number
  strong_malicious_neighbor_count: number
  high_confidence: boolean
}

export interface FusionResult {
  threat_score: number
  decision: Decision

  // The backend may expose the configured detector weights.
  weights?: FusionWeights

  [key: string]: unknown
}

export interface FusionWeights {
  ml?: number
  rules?: number
  semantic?: number
}

export interface DetectorVotes {
  ml: boolean
  rules: boolean
  semantic: boolean
  total: number
}

export interface HypothesisResult {
  hypothesis?: string
  description?: string
  confidence?: number
  recommended_action?: string
}

export interface EvidenceItem {
  type?: string
  title?: string
  description?: string
  value?: string | number | boolean
}

export interface FeedbackRequest {
  prediction_id: number
  human_label: number
  attack_category?: string | null
}

export interface FeedbackResponse {
  status?: string
  prediction_id?: number
  human_label?: number
  attack_category?: string | null
  message?: string
}

export interface HealthResponse {
  status: string
  [key: string]: unknown
}

export interface APIInfoResponse {
  system?: string
  status?: string
  service?: string
  [key: string]: unknown
}

export interface APIError {
  message: string
  status?: number
}