"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, Sparkles, ArrowRight, Globe, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return;
    
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAttempts(prev => prev + 1);
        if (attempts >= 4) {
          setCooldown(30); // 30 second cooldown after 5 failed attempts
          toast.error("Too many failed attempts. Please wait 30 seconds.");
        }
        throw error;
      }

      toast.success("Signed in successfully!");
      router.refresh();
      router.push("/auth/onboarding");
    } catch (error: any) {
      toast.error("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden font-sans">
      {/* Left Side: Hero Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-50 relative flex-col justify-between p-12 overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-primary/5 rounded-full blur-[120px]" />
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-black text-xl">CF</span>
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">ClientFlow</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-5xl font-black text-slate-900 leading-[1.1] tracking-tight mb-6">
              Manage your business with <span className="text-primary">clarity.</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed mb-10">
              The all-in-one CRM for freelancers and agencies to track leads, manage projects, and grow revenue.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="relative rounded-[32px] overflow-hidden shadow-2xl shadow-slate-200 border border-white"
          >
            <Image 
              src="/crm_login_hero.png" 
              alt="ClientFlow Dashboard Preview" 
              width={1200}
              height={800}
              className="w-full h-auto object-cover"
            />
          </motion.div>
        </div>

        <div className="relative z-10 flex items-center gap-6">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" />
            ))}
          </div>
          <p className="text-sm font-bold text-slate-400">Join 2,000+ top freelancers</p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-[420px] w-full"
        >
          <div className="mb-10 lg:hidden">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-black">CF</span>
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">ClientFlow</span>
            </Link>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Sign in</h1>
            <p className="text-slate-500 font-medium">Welcome back! Please enter your details.</p>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Button variant="outline" className="h-14 rounded-2xl border-slate-100 font-bold hover:bg-slate-50 gap-3">
              <Globe className="w-5 h-5" />
              Google
            </Button>
            <Button variant="outline" className="h-14 rounded-2xl border-slate-100 font-bold hover:bg-slate-50 gap-3">
              <Command className="w-5 h-5" />
              GitHub
            </Button>
          </div>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-slate-400">
              <span className="bg-white px-4">Or with email</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 px-5 bg-slate-50/50 border-slate-100 rounded-2xl focus:ring-primary/10 focus:border-primary transition-all font-medium"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" exports={Label} className="text-xs font-black uppercase tracking-widest text-slate-400">Password</Label>
                <Link href="/auth/forgot-password" size={14} className="text-[11px] font-black text-primary hover:underline uppercase tracking-widest cursor-pointer">Forgot?</Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 px-5 bg-slate-50/50 border-slate-100 rounded-2xl focus:ring-primary/10 focus:border-primary transition-all font-medium"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading || cooldown > 0}
              className="w-full h-16 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all group"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : cooldown > 0 ? (
                <span className="flex items-center gap-2">
                  Wait {cooldown}s
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 text-sm font-medium">
              New to ClientFlow?{" "}
              <button onClick={() => router.push("/auth/signup")} className="text-primary font-black hover:underline underline-offset-4">
                Create an account
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

import Link from "next/link";
