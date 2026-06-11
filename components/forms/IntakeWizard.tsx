"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { uploadProjectAsset } from "@/lib/storage";
import { submitProjectRequest } from "@/app/actions/requests";

const step1 = z.object({
  project_name: z.string().min(1),
  project_type: z.string().optional(),
  description: z.string().optional(),
  budget_min: z.coerce.number().optional(),
  budget_max: z.coerce.number().optional(),
  currency: z.string(),
  deadline: z.string().optional(),
});

type Step1 = z.infer<typeof step1>;

export function IntakeWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralCode = (searchParams.get("code") ?? "").trim();

  const requestId = useMemo(() => crypto.randomUUID(), []);

  const [step, setStep] = useState(0);
  const [brandName, setBrandName] = useState("");
  const [brandColors, setBrandColors] = useState<string[]>(["#2F9B65", "#1A3D2B"]);
  const [styleNotes, setStyleNotes] = useState("");
  const [platform, setPlatform] = useState("");
  const [hasExistingSite, setHasExistingSite] = useState(false);
  const [existingSiteUrl, setExistingSiteUrl] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [assetPaths, setAssetPaths] = useState<string[]>([]);
  const [assetMeta, setAssetMeta] = useState<
    { name: string; size: number; type: string; path: string }[]
  >([]);
  const [clientNotes, setClientNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form1 = useForm<Step1>({
    resolver: zodResolver(step1),
    defaultValues: { currency: "USD", project_name: "" },
  });

  const steps = ["Basics", "Branding", "Technical", "Assets", "Review"];

  async function onUploadFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    for (const file of Array.from(files)) {
      if (file.size > 50 * 1024 * 1024) {
        setError("Each file must be 50MB or smaller.");
        return;
      }
      const { path, metadata } = await uploadProjectAsset(file, requestId);
      setAssetPaths((p) => [...p, path]);
      setAssetMeta((m) => [...m, { ...metadata, path }]);
    }
  }

  async function onSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const v1 = form1.getValues();
      await submitProjectRequest({
        id: requestId,
        referral_code: referralCode,
        project_name: v1.project_name,
        project_type: v1.project_type,
        description: v1.description,
        budget_min: v1.budget_min,
        budget_max: v1.budget_max,
        currency: v1.currency ?? "USD",
        deadline: v1.deadline,
        brand_name: brandName,
        brand_colors: brandColors,
        brand_fonts: [],
        style_notes: styleNotes,
        competitor_urls: [],
        platform,
        has_existing_site: hasExistingSite,
        existing_site_url: existingSiteUrl,
        integrations: [],
        special_requirements: specialRequirements,
        asset_paths: assetPaths,
        asset_metadata: assetMeta,
        client_notes: clientNotes,
      });
      router.push("/client?submitted=1");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (!referralCode) {
    return (
      <Card className="p-6">
        <p className="text-sm text-neutral-600">
          Missing referral code.{" "}
          <Button variant="secondary" type="button" onClick={() => router.push("/client/onboarding/connect")}>
            Go back
          </Button>
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center gap-2">
        {steps.map((label, i) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                i === step ? "bg-brand-dark text-white" : "bg-neutral-100 text-neutral-600"
              }`}
            >
              {i + 1}
            </div>
            {i < steps.length - 1 && <div className="h-px flex-1 bg-neutral-200" />}
          </div>
        ))}
      </div>

      {error && (
        <p className="mb-4 rounded-btn border border-danger/40 bg-[#fde8e6] px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      {step === 0 && (
        <form
          className="space-y-4"
          onSubmit={form1.handleSubmit(() => {
            setStep(1);
          })}
        >
          <div>
            <Label htmlFor="project_name">Project name</Label>
            <Input id="project_name" {...form1.register("project_name")} />
          </div>
          <div>
            <Label htmlFor="project_type">Project type</Label>
            <Input id="project_type" placeholder="Web Design, Branding…" {...form1.register("project_type")} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...form1.register("description")} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="budget_min">Budget min</Label>
              <Input id="budget_min" type="number" {...form1.register("budget_min")} />
            </div>
            <div>
              <Label htmlFor="budget_max">Budget max</Label>
              <Input id="budget_max" type="number" {...form1.register("budget_max")} />
            </div>
          </div>
          <div>
            <Label htmlFor="deadline">Deadline</Label>
            <Input id="deadline" type="date" {...form1.register("deadline")} />
          </div>
          <Button type="submit">Continue</Button>
        </form>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <Label>Brand name</Label>
            <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Primary color</Label>
              <Input
                type="color"
                value={brandColors[0]}
                onChange={(e) => {
                  const secondary = brandColors[1] ?? "#1A3D2B";
                  setBrandColors([e.target.value, secondary]);
                }}
              />
            </div>
            <div>
              <Label>Secondary color</Label>
              <Input
                type="color"
                value={brandColors[1]}
                onChange={(e) => {
                  const primary = brandColors[0] ?? "#2F9B65";
                  setBrandColors([primary, e.target.value]);
                }}
              />
            </div>
          </div>
          <div>
            <Label>Style notes</Label>
            <Textarea value={styleNotes} onChange={(e) => setStyleNotes(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={() => setStep(0)}>
              Back
            </Button>
            <Button type="button" onClick={() => setStep(2)}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <Label>Platform / CMS</Label>
            <Input value={platform} onChange={(e) => setPlatform(e.target.value)} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={hasExistingSite}
              onChange={(e) => setHasExistingSite(e.target.checked)}
            />
            Existing website
          </label>
          {hasExistingSite && (
            <div>
              <Label>Site URL</Label>
              <Input value={existingSiteUrl} onChange={(e) => setExistingSiteUrl(e.target.value)} />
            </div>
          )}
          <div>
            <Label>Special requirements</Label>
            <Textarea value={specialRequirements} onChange={(e) => setSpecialRequirements(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button type="button" onClick={() => setStep(3)}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <Label>Upload assets</Label>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-card border-2 border-dashed border-neutral-300 bg-brand-faint px-6 py-10 text-center text-sm text-neutral-600 hover:border-brand">
            <input
              type="file"
              className="hidden"
              multiple
              accept="image/*,.pdf,.doc,.docx,.zip"
              onChange={(e) => void onUploadFiles(e.target.files)}
            />
            Drag & drop or click to upload (max 50MB each)
          </label>
          <ul className="text-sm text-neutral-700">
            {assetMeta.map((a) => (
              <li key={a.path}>
                {a.name} ({Math.round(a.size / 1024)} KB)
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button type="button" onClick={() => setStep(4)}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4 text-sm text-neutral-700">
          <p>
            <strong>Referral:</strong> {referralCode}
          </p>
          <p>
            <strong>Project:</strong> {form1.getValues("project_name")}
          </p>
          <div>
            <Label>Notes before submit</Label>
            <Textarea value={clientNotes} onChange={(e) => setClientNotes(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={() => setStep(3)}>
              Back
            </Button>
            <Button type="button" loading={submitting} onClick={() => void onSubmit()}>
              Submit request
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
