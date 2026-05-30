export const PIPELINE_STAGES = [
  "Lead",
  "Onboarding",
  "Proposal Sent",
  "In Progress",
  "Review",
  "Completed",
  "Churned",
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export const DEFAULT_PIPELINE_STAGE: PipelineStage = "In Progress";

export const STAGE_META: Record<
  PipelineStage,
  { dot: string; column: string; description: string }
> = {
  Lead: {
    dot: "bg-amber-400",
    column: "border-amber-200/80 bg-amber-50/40",
    description: "New prospects not yet onboarded",
  },
  Onboarding: {
    dot: "bg-sky-400",
    column: "border-sky-200/80 bg-sky-50/40",
    description: "Setting up workspace and scope",
  },
  "Proposal Sent": {
    dot: "bg-violet-400",
    column: "border-violet-200/80 bg-violet-50/40",
    description: "Awaiting client approval",
  },
  "In Progress": {
    dot: "bg-brand-accent",
    column: "border-brand-light/80 bg-brand-surface",
    description: "Active delivery work",
  },
  Review: {
    dot: "bg-orange-400",
    column: "border-orange-200/80 bg-orange-50/40",
    description: "Client review or feedback",
  },
  Completed: {
    dot: "bg-status-success",
    column: "border-emerald-200/80 bg-emerald-50/40",
    description: "Project wrapped successfully",
  },
  Churned: {
    dot: "bg-text-tertiary",
    column: "border-gray-200 bg-gray-50/60",
    description: "Lost or paused engagements",
  },
};
