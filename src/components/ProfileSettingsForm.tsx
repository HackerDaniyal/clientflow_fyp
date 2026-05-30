"use client";

import React, { useTransition } from "react";
import { updateProfile } from "@/app/settings/actions";

export default function ProfileSettingsForm({
  fullName,
  bio,
}: {
  fullName: string;
  bio: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = React.useState<string | null>(null);

  return (
    <form
      className="space-y-4"
      action={(fd) => {
        startTransition(async () => {
          try {
            await updateProfile(fd);
            setMessage("Profile saved.");
          } catch (e: unknown) {
            setMessage(e instanceof Error ? e.message : "Save failed");
          }
        });
      }}
    >
      <div>
        <label className="text-[12px] font-medium text-text-secondary mb-1 block">Full Name</label>
        <input
          name="full_name"
          defaultValue={fullName}
          required
          className="w-full bg-brand-surface border border-brand-light rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-brand-accent"
        />
      </div>
      <div>
        <label className="text-[12px] font-medium text-text-secondary mb-1 block">Bio</label>
        <textarea
          name="bio"
          defaultValue={bio}
          rows={3}
          className="w-full bg-brand-surface border border-brand-light rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-brand-accent resize-none"
        />
      </div>
      {message && <p className="text-[12px] text-brand-mid">{message}</p>}
      <button type="submit" disabled={isPending} className="pill-btn disabled:opacity-50">
        {isPending ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
