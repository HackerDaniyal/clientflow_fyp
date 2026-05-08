"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Users, Briefcase, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function OnboardingPage() {
  const [role, setRole] = useState<"freelancer" | "client" | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleCompleteOnboarding = async () => {
    if (!role) return;
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          role: role,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success(`Welcome aboard! Redirecting to your ${role} dashboard...`);
      router.push(`/${role}/dashboard`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
            <span className="text-white font-black text-2xl">CF</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">
            Welcome to ClientFlow
          </h1>
          <p className="text-slate-500 text-lg font-medium">
            How will you be using the platform? Choose your path.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.div
            whileHover={{ y: -5 }}
            onClick={() => setRole("freelancer")}
            className="cursor-pointer"
          >
            <Card className={`p-8 h-full border-2 transition-all duration-300 relative overflow-hidden ${
              role === "freelancer" ? "border-primary bg-primary/5 shadow-2xl" : "border-slate-100 hover:border-slate-200"
            }`}>
              {role === "freelancer" && (
                <div className="absolute top-4 right-4 text-primary">
                  <CheckCircle2 size={24} />
                </div>
              )}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                role === "freelancer" ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
              }`}>
                <Briefcase size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">I'm a Freelancer</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Manage your clients, send proposals, track time, and get paid seamlessly.
              </p>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            onClick={() => setRole("client")}
            className="cursor-pointer"
          >
            <Card className={`p-8 h-full border-2 transition-all duration-300 relative overflow-hidden ${
              role === "client" ? "border-primary bg-primary/5 shadow-2xl" : "border-slate-100 hover:border-slate-200"
            }`}>
              {role === "client" && (
                <div className="absolute top-4 right-4 text-primary">
                  <CheckCircle2 size={24} />
                </div>
              )}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                role === "client" ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
              }`}>
                <Users size={28} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">I'm a Client</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Connect with talent, track project progress, and manage your invoices in one place.
              </p>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <Button
            size="lg"
            disabled={!role || loading}
            onClick={handleCompleteOnboarding}
            className="px-12 py-7 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
          >
            {loading ? "Setting up your workspace..." : "Continue to Workspace"}
            <ChevronRight className="ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
