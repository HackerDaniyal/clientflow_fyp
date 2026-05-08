"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Lock, Loader2, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Check if we have a session (Supabase handles the email link auto-login)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Invalid or expired reset link.");
        router.push("/auth/login");
      }
    };
    checkSession();
  }, [router, supabase.auth]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setSuccess(true);
      toast.success("Password updated successfully!");
      
      // Auto-redirect after 3 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-[450px] w-full relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20 text-white">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Create New Password</h1>
          <p className="text-slate-500 font-medium">Please enter your new secure password</p>
        </div>

        <Card className="p-8 border-none shadow-2xl shadow-slate-200/50 rounded-[32px] bg-white/80 backdrop-blur-xl border border-white">
          {!success ? (
            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">New Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 py-6 bg-slate-50/50 border-slate-100 rounded-2xl focus:ring-primary/10 focus:border-primary transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-11 py-6 bg-slate-50/50 border-slate-100 rounded-2xl focus:ring-primary/10 focus:border-primary transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                  <ShieldCheck size={12} className="text-primary" />
                  Security Audit Checklist
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <div className={`w-1.5 h-1.5 rounded-full ${password.length >= 8 ? "bg-emerald-500" : "bg-slate-300"}`} />
                  Min. 8 characters
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(password) ? "bg-emerald-500" : "bg-slate-300"}`} />
                  Contains a number
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <div className={`w-1.5 h-1.5 rounded-full ${/[^A-Za-z0-9]/.test(password) ? "bg-emerald-500" : "bg-slate-300"}`} />
                  Special character (!@#$)
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <div className={`w-1.5 h-1.5 rounded-full ${password === confirmPassword && password.length > 0 ? "bg-emerald-500" : "bg-slate-300"}`} />
                  Passwords match
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || password.length < 8 || password !== confirmPassword}
                className="w-full py-7 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    Update Password
                    <ShieldCheck size={20} className="group-hover:scale-110 transition-transform" />
                  </span>
                )}
              </Button>
            </form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-6"
            >
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Security Updated!</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                Your password has been changed successfully. Redirecting you to sign in...
              </p>
              <div className="flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
