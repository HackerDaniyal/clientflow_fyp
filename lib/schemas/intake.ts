import { z } from "zod";

export const intakeStep1Schema = z.object({
  project_name: z.string().min(1, "Project name is required"),
  project_type: z.string().optional(),
  description: z.string().optional(),
  budget_min: z.coerce.number().optional(),
  budget_max: z.coerce.number().optional(),
  currency: z.string().default("USD"),
  deadline: z.string().optional(),
});

export const intakeStep2Schema = z.object({
  brand_name: z.string().optional(),
  brand_colors: z.array(z.string()).optional(),
  brand_fonts: z.array(z.string()).optional(),
  style_notes: z.string().optional(),
  competitor_urls: z.array(z.string()).optional(),
});

export const intakeStep3Schema = z.object({
  platform: z.string().optional(),
  has_existing_site: z.boolean().optional(),
  existing_site_url: z.string().optional(),
  integrations: z.array(z.string()).optional(),
  special_requirements: z.string().optional(),
});

export const intakeSubmitSchema = intakeStep1Schema
  .merge(intakeStep2Schema)
  .merge(intakeStep3Schema)
  .extend({
    id: z.string().uuid().optional(),
    referral_code: z.string().min(1),
    client_notes: z.string().optional(),
    asset_paths: z.array(z.string()).default([]),
    asset_metadata: z
      .array(
        z.object({
          name: z.string(),
          size: z.number(),
          type: z.string(),
          path: z.string(),
        })
      )
      .default([]),
  });

export type IntakeSubmit = z.infer<typeof intakeSubmitSchema>;
