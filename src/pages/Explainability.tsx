import { useEffect, useState } from 'react'
import {
  AlertCircle,
  BrainCircuit,
  CheckCircle2,
  GitBranch,
  ShieldCheck,
} from 'lucide-react'

import GlassPanel from '../components/GlassPanel'
import type { AnalyzeResponse } from '../api/types'

function Explainability() {
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('latestAnalysis')

    if (!stored) {
      return
    }

    try {
      setAnalysis(JSON.parse(stored) as AnalyzeResponse)
    } catch {
      sessionStorage.removeItem('latestAnalysis')
    }
  }, [])

  if (!analysis) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Explainable detection
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
            Understand the decision.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
            Run a prompt analysis first. The detection signals from the
            latest real backend analysis will appear here.
          </p>
        </div>

        <GlassPanel className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-white/80 bg-white/60">
            <BrainCircuit className="h-7 w-7 text-slate-500" />
          </div>

          <h2 className="mt-6 text-xl font-semibold text-slate-800">
            No analysis available
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
            Analyze a prompt to populate this page with real ML,
            rule-based, semantic, and fusion signals.
          </p>
        </GlassPanel>
      </div>
    )
  }

  const score = analysis.threat_score * 100

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Explainable detection
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
          Understand the decision.
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
          This view uses the real signals returned by the detection
          engine to explain how the final decision was formed.
        </p>
      </div>

      <GlassPanel className="p-7 sm:p-9">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              {analysis.decision === 'BLOCK' ? (
                <AlertCircle className="h-6 w-6 text-slate-700" />
              ) : (
                <CheckCircle2 className="h-6 w-6 text-slate-500" />
              )}

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Final decision
                </p>

                <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
                  {analysis.decision}
                </p>
              </div>
            </div>

            <div className="mt-7 rounded-2xl border border-white/70 bg-white/35 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Analyzed prompt
              </p>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {analysis.text}
              </p>
            </div>
          </div>

          <div className="flex h-44 w-44 shrink-0 items-center justify-center rounded-full border border-white/80 bg-white/45 shadow-[0_20px_60px_rgba(30,41,59,0.08)]">
            <div className="text-center">
              <p className="text-4xl font-semibold tracking-tight text-slate-900">
                {score.toFixed(1)}%
              </p>

              <p className="mt-1 text-xs uppercase tracking-[0.15em] text-slate-400">
                Threat score
              </p>
            </div>
          </div>
        </div>
      </GlassPanel>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <SignalCard
          icon={<BrainCircuit className="h-5 w-5" />}
          title="Machine learning"
          score={analysis.ml.probability}
          description={
            analysis.ml.label === 1
              ? 'The ML detector classified this prompt as a threat.'
              : 'The ML detector classified this prompt as non-threatening.'
          }
        />

        <SignalCard
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Behavioral rules"
          score={analysis.rules.score}
          description={
            analysis.rules.is_threat
              ? 'Security rules identified suspicious behavior.'
              : 'No rule-based threat condition was triggered.'
          }
        />

        <SignalCard
          icon={<GitBranch className="h-5 w-5" />}
          title="Semantic analysis"
          score={analysis.semantic.score}
          description={
            analysis.semantic.is_threat
              ? 'Semantic similarity indicates potentially malicious intent.'
              : 'Semantic similarity did not cross the threat threshold.'
          }
        />
      </div>

      <GlassPanel className="mt-5 p-7 sm:p-9">
        <div className="flex items-center gap-3">
          <GitBranch className="h-5 w-5 text-slate-500" />

          <div>
            <h2 className="text-lg font-semibold">
              Detection fusion
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              The final threat score combines the detector signals
              returned by the backend.
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          <FusionValue
            label="ML"
            value={analysis.ml.probability}
            weight={analysis.fusion.weights?.ml}
          />

          <FusionValue
            label="Rules"
            value={analysis.rules.score}
            weight={analysis.fusion.weights?.rules}
          />

          <FusionValue
            label="Semantic"
            value={analysis.semantic.score}
            weight={analysis.fusion.weights?.semantic}
          />
        </div>

        <div className="mt-7 rounded-2xl border border-white/70 bg-white/35 p-5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-slate-500">
              Final threat score
            </span>

            <span className="text-lg font-semibold text-slate-800">
              {analysis.threat_score.toFixed(4)}
            </span>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200/60">
            <div
              className="h-full rounded-full bg-slate-700 transition-all duration-700"
              style={{
                width: `${Math.min(analysis.threat_score * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      </GlassPanel>

      <GlassPanel className="mt-5 p-7 sm:p-9">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-slate-500" />

          <div>
            <h2 className="text-lg font-semibold">
              Detector voting
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Each detector contributes one threat/non-threat vote.
            </p>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-4">
          <Vote
            label="ML"
            value={analysis.detector_votes.ml}
          />

          <Vote
            label="Rules"
            value={analysis.detector_votes.rules}
          />

          <Vote
            label="Semantic"
            value={analysis.detector_votes.semantic}
          />

          <div className="rounded-2xl border border-white/70 bg-white/35 p-5">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400">
              Total
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-800">
              {analysis.detector_votes.total}/3
            </p>
          </div>
        </div>
      </GlassPanel>

      <GlassPanel className="mt-5 p-7 sm:p-9">
        <h2 className="text-lg font-semibold">
          Semantic evidence
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <EvidenceValue
            label="Similarity"
            value={`${(
              analysis.semantic_evidence.similarity * 100
            ).toFixed(1)}%`}
          />

          <EvidenceValue
            label="Matched label"
            value={String(
              analysis.semantic_evidence.matched_label,
            )}
          />

          <EvidenceValue
            label="Malicious neighbors"
            value={String(
              analysis.semantic_evidence.malicious_neighbor_count,
            )}
          />

          <EvidenceValue
            label="High confidence"
            value={
              analysis.semantic_evidence.high_confidence
                ? 'Yes'
                : 'No'
            }
          />
        </div>
      </GlassPanel>

      <GlassPanel className="mt-5 p-7 sm:p-9">
        <h2 className="text-lg font-semibold">
          Explainability status
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          SHAP feature-attribution data is not exposed by the current
          backend API. This page therefore does not fabricate SHAP
          values. When a dedicated explainability endpoint is added,
          its response can be connected here.
        </p>
      </GlassPanel>
    </div>
  )
}

function SignalCard({
  icon,
  title,
  score,
  description,
}: {
  icon: React.ReactNode
  title: string
  score: number
  description: string
}) {
  return (
    <GlassPanel className="p-7">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/60 text-slate-600">
        {icon}
      </div>

      <p className="mt-6 text-sm font-semibold text-slate-800">
        {title}
      </p>

      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
        {(score * 100).toFixed(1)}%
      </p>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </GlassPanel>
  )
}

function FusionValue({
  label,
  value,
  weight,
}: {
  label: string
  value: number
  weight?: number
}) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/35 p-5">
      <p className="text-xs uppercase tracking-[0.15em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold text-slate-800">
        {(value * 100).toFixed(1)}%
      </p>

      <p className="mt-2 text-xs text-slate-400">
        Weight:{' '}
        {typeof weight === 'number'
          ? `${(weight * 100).toFixed(0)}%`
          : 'Unavailable'}
      </p>
    </div>
  )
}

function Vote({
  label,
  value,
}: {
  label: string
  value: boolean
}) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/35 p-5">
      <p className="text-xs uppercase tracking-[0.15em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold text-slate-800">
        {value ? 'Threat' : 'Non-threat'}
      </p>
    </div>
  )
}

function EvidenceValue({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/35 p-5">
      <p className="text-xs uppercase tracking-[0.15em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold text-slate-800">
        {value}
      </p>
    </div>
  )
}

export default Explainability