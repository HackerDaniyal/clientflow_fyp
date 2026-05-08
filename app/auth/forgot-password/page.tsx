"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, Loader2, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const supabase = createClient();

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Supabase handles the security of not revealing if the user exists
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
      });

      if (error) throw error;

      setSubmitted(true);
      toast.success("Reset instructions sent to your email!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-[450px] w-full relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/auth/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-8 font-black text-xs uppercase tracking-widest">
            <ArrowLeft size={16} />
            Back to Sign In
          </Link>
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
            <span className="text-white font-black text-xl">CF</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Reset Password</h1>
          <p className="text-slate-500 font-medium">We'll send you instructions to reset your password</p>
        </div>

        <Card className="p-8 border-none shadow-2xl shadow-slate-200/50 rounded-[32px] bg-white/80 backdrop-blur-xl border border-white">
          {!submitted ? (
            <form onSubmit={handleResetRequest} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 py-6 bg-slate-50/50 border-slate-100 rounded-2xl focus:ring-primary/10 focus:border-primary transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-7 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    Send Reset Link
                    <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                )}
              </Button>
              
              <p className="text-[11px] text-slate-400 text-center leading-relaxed italic">
                Note: To protect your security, we will only send a link if an account is associated with this email address.
              </p>
            </form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">Check your email</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                If an account exists for <span className="text-slate-900 font-bold">{email}</span>, you will receive an email with instructions shortly.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setSubmitted(false)}
                className="w-full py-6 rounded-2xl border-slate-100 font-bold hover:bg-slate-50"
              >
                Try another email
              </Button>
            </motion.div>
          )}
        </Card>

        {/* Security Tip */}
        <div className="mt-8 flex items-center gap-3 bg-white/50 border border-white p-4 rounded-2xl backdrop-blur-sm">
          <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
            <Sparkles size={16} />
          </div>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            <span className="text-slate-900 font-bold uppercase tracking-widest block mb-0.5">Security Notice</span>
            Recovery links expire after 24 hours for your protection.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
