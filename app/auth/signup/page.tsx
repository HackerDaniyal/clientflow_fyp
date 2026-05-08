"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight, User, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        toast.success("Registration initiated. Please check your email for verification.");
        router.push("/auth/login");
      }
    } catch (error: any) {
      toast.error("Could not complete registration. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-[450px] w-full relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/20">
            <span className="text-white font-black text-xl">CF</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Create Account</h1>
          <p className="text-slate-500 font-medium">Join ClientFlow and streamline your work</p>
        </div>

        <Card className="p-8 border-none shadow-2xl shadow-slate-200/50 rounded-[32px] bg-white/80 backdrop-blur-xl border border-white">
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</Label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-11 py-6 bg-slate-50/50 border-slate-100 rounded-2xl focus:ring-primary/10 focus:border-primary transition-all font-medium"
                  required
                />
              </div>
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>

            <Button
              type="submit"
              disabled={loading || password.length < 8 || !/[0-9]/.test(password) || !/[^A-Za-z0-9]/.test(password)}
              className="w-full py-7 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Get Started
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm font-medium">
              Already have an account?{" "}
              <button onClick={() => router.push("/auth/login")} className="text-primary font-black hover:underline">
                Sign In
              </button>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
