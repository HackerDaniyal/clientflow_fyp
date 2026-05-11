import React from "react";
import Link from "next/link";
import { 
  IconRocket, 
  IconShieldCheck, 
  IconSparkles, 
  IconArrowRight, 
  IconDeviceLaptop,
  IconUsers,
  IconBriefcase,
  IconCheck,
  IconBrandGithub,
  IconBrandTwitter,
  IconMessageCircle,
  IconCalendar,
  IconFileText,
  IconChartBar,
  IconWallet
} from "@tabler/icons-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-brand-accent/30">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-light/30">
        <div className="flex justify-between items-center px-6 md:px-12 lg:px-20 py-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-brand-dark rounded-lg flex items-center justify-center">
              <div className="flex gap-[2px]">
                <div className="w-1.5 h-3.5 bg-brand-accent rounded-[1px]"></div>
                <div className="w-1.5 h-3.5 bg-brand-accent rounded-[1px] opacity-60"></div>
              </div>
            </div>
            <span className="text-[18px] font-semibold text-brand-dark tracking-tight">
              ClientFlow
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-[14px] font-medium text-text-secondary hover:text-brand-dark transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link href="/auth/signup" className="pill-btn">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-light/20 to-brand-accent/10 border border-brand-light/50 rounded-full mb-8">
            <IconSparkles size={16} className="text-brand-dark" />
            <span className="text-[12px] font-semibold text-brand-dark uppercase tracking-wider">Trusted by 1000+ Freelancers & Agencies</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-brand-dark tracking-tight leading-[1.1] mb-6">
            Manage Clients & Projects
            <br />
            <span className="bg-gradient-to-r from-brand-dark to-brand-accent bg-clip-text text-transparent">Like a Pro.</span>
          </h1>
          
          <p className="text-xl text-text-secondary max-w-[700px] mx-auto mb-12 leading-relaxed">
            The all-in-one CRM built for freelancers and agencies. 
            Track projects, automate invoicing, and keep clients happy — all in one beautiful workspace.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/auth/signup" className="pill-btn px-8 py-4 text-[16px] font-semibold group shadow-lg hover:shadow-xl transition-all">
              Start Free Trial
              <IconArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#features" className="pill-btn-outline px-8 py-4 text-[16px] font-semibold">
              See Features
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12 border-t border-brand-light/30">
            <div>
              <div className="text-3xl font-bold text-brand-dark mb-1">10k+</div>
              <div className="text-sm text-text-secondary">Projects Managed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-dark mb-1">98%</div>
              <div className="text-sm text-text-secondary">Client Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-brand-dark mb-1">5x</div>
              <div className="text-sm text-text-secondary">Faster Workflow</div>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Cards */}
      <section className="px-6 py-24 bg-gradient-to-br from-brand-surface to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-brand-dark mb-4">Choose Your Path</h2>
            <p className="text-lg text-text-secondary max-w-[600px] mx-auto">
              Whether you're a freelancer managing clients or a business owner tracking projects, we've got you covered.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Freelancer Card */}
            <div className="group relative bg-white rounded-2xl p-8 border-2 border-brand-light/50 hover:border-brand-accent transition-all hover:shadow-xl">
              <div className="absolute top-0 right-0 bg-brand-accent text-white text-[11px] font-bold px-4 py-1.5 rounded-bl-lg rounded-tr-2xl">
                MOST POPULAR
              </div>
              
              <div className="w-16 h-16 bg-gradient-to-br from-brand-dark to-brand-accent rounded-xl flex items-center justify-center mb-6">
                <IconBriefcase size={32} className="text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-brand-dark mb-3">For Freelancers & Agencies</h3>
              <p className="text-text-secondary mb-6 leading-relaxed">
                Manage your entire business from one dashboard. Track clients, projects, invoices, and payments effortlessly.
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <IconCheck size={18} className="text-brand-accent mt-0.5 flex-shrink-0" />
                  <span className="text-[14px] text-text-secondary">Unlimited client management</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck size={18} className="text-brand-accent mt-0.5 flex-shrink-0" />
                  <span className="text-[14px] text-text-secondary">Automated invoicing & payments</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck size={18} className="text-brand-accent mt-0.5 flex-shrink-0" />
                  <span className="text-[14px] text-text-secondary">Real-time project tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck size={18} className="text-brand-accent mt-0.5 flex-shrink-0" />
                  <span className="text-[14px] text-text-secondary">AI-powered assistant</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck size={18} className="text-brand-accent mt-0.5 flex-shrink-0" />
                  <span className="text-[14px] text-text-secondary">Referral code system</span>
                </li>
              </ul>
              
              <Link href="/auth/signup" className="w-full pill-btn bg-brand-dark hover:bg-brand-dark/90 text-white flex items-center justify-center gap-2 group">
                Start as Freelancer
                <IconArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Client Card */}
            <div className="group relative bg-white rounded-2xl p-8 border-2 border-brand-light/50 hover:border-brand-dark transition-all hover:shadow-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-light to-brand-dark/20 rounded-xl flex items-center justify-center mb-6">
                <IconUsers size={32} className="text-brand-dark" />
              </div>
              
              <h3 className="text-2xl font-bold text-brand-dark mb-3">For Clients & Businesses</h3>
              <p className="text-text-secondary mb-6 leading-relaxed">
                Get full visibility into your projects. Track progress, communicate with your team, and manage deliverables.
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <IconCheck size={18} className="text-brand-dark mt-0.5 flex-shrink-0" />
                  <span className="text-[14px] text-text-secondary">Real-time project updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck size={18} className="text-brand-dark mt-0.5 flex-shrink-0" />
                  <span className="text-[14px] text-text-secondary">Direct messaging with your team</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck size={18} className="text-brand-dark mt-0.5 flex-shrink-0" />
                  <span className="text-[14px] text-text-secondary">Secure file sharing</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck size={18} className="text-brand-dark mt-0.5 flex-shrink-0" />
                  <span className="text-[14px] text-text-secondary">Invoice & payment history</span>
                </li>
                <li className="flex items-start gap-2">
                  <IconCheck size={18} className="text-brand-dark mt-0.5 flex-shrink-0" />
                  <span className="text-[14px] text-text-secondary">Easy project requests</span>
                </li>
              </ul>
              
              <Link href="/auth/signup" className="w-full pill-btn-outline flex items-center justify-center gap-2 group">
                Join as Client
                <IconArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-brand-dark mb-4">Everything You Need</h2>
            <p className="text-lg text-text-secondary max-w-[600px] mx-auto">
              Powerful features to streamline your workflow and delight your clients.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group p-6 rounded-xl border border-brand-light/50 hover:border-brand-accent hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-brand-surface rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand-accent/20 transition-colors">
                <IconRocket size={24} className="text-brand-dark" />
              </div>
              <h3 className="text-lg font-semibold text-brand-dark mb-2">Quick Onboarding</h3>
              <p className="text-[14px] text-text-secondary leading-relaxed">
                Get started in minutes. Set up your workspace and invite clients with a simple referral code.
              </p>
            </div>
            
            <div className="group p-6 rounded-xl border border-brand-light/50 hover:border-brand-accent hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-brand-surface rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand-accent/20 transition-colors">
                <IconChartBar size={24} className="text-brand-dark" />
              </div>
              <h3 className="text-lg font-semibold text-brand-dark mb-2">Project Tracking</h3>
              <p className="text-[14px] text-text-secondary leading-relaxed">
                Monitor project progress with Kanban boards, timelines, and real-time status updates.
              </p>
            </div>
            
            <div className="group p-6 rounded-xl border border-brand-light/50 hover:border-brand-accent hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-brand-surface rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand-accent/20 transition-colors">
                <IconWallet size={24} className="text-brand-dark" />
              </div>
              <h3 className="text-lg font-semibold text-brand-dark mb-2">Smart Invoicing</h3>
              <p className="text-[14px] text-text-secondary leading-relaxed">
                Create professional invoices, track payments, and automate recurring billing.
              </p>
            </div>
            
            <div className="group p-6 rounded-xl border border-brand-light/50 hover:border-brand-accent hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-brand-surface rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand-accent/20 transition-colors">
                <IconMessageCircle size={24} className="text-brand-dark" />
              </div>
              <h3 className="text-lg font-semibold text-brand-dark mb-2">Built-in Messaging</h3>
              <p className="text-[14px] text-text-secondary leading-relaxed">
                Communicate with clients directly. No more scattered emails or lost conversations.
              </p>
            </div>
            
            <div className="group p-6 rounded-xl border border-brand-light/50 hover:border-brand-accent hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-brand-surface rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand-accent/20 transition-colors">
                <IconCalendar size={24} className="text-brand-dark" />
              </div>
              <h3 className="text-lg font-semibold text-brand-dark mb-2">Milestone Management</h3>
              <p className="text-[14px] text-text-secondary leading-relaxed">
                Set project milestones, track deadlines, and keep everyone aligned on deliverables.
              </p>
            </div>
            
            <div className="group p-6 rounded-xl border border-brand-light/50 hover:border-brand-accent hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-brand-surface rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand-accent/20 transition-colors">
                <IconSparkles size={24} className="text-brand-dark" />
              </div>
              <h3 className="text-lg font-semibold text-brand-dark mb-2">AI Assistant</h3>
              <p className="text-[14px] text-text-secondary leading-relaxed">
                Draft proposals, summarize conversations, and generate project roadmaps with AI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 bg-gradient-to-br from-brand-dark to-brand-dark/90">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl text-white/80 mb-12 max-w-[600px] mx-auto">
            Join thousands of freelancers and agencies who trust ClientFlow to manage their business.
          </p>
          <Link href="/auth/signup" className="inline-flex items-center gap-2 pill-btn bg-white text-brand-dark hover:bg-brand-light px-10 py-5 text-[18px] font-semibold shadow-xl group">
            Get Started Free
            <IconArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-sm text-white/60 mt-6">
            No credit card required · Free 14-day trial · Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-brand-surface border-t border-brand-light/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-dark rounded-lg flex items-center justify-center">
                <div className="flex gap-[2px]">
                  <div className="w-1.5 h-3 bg-brand-accent rounded-[1px]"></div>
                  <div className="w-1.5 h-3 bg-brand-accent rounded-[1px] opacity-60"></div>
                </div>
              </div>
              <span className="text-[16px] font-semibold text-brand-dark">
                ClientFlow
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-text-secondary">
              <Link href="/auth/login" className="hover:text-brand-dark transition-colors">Sign In</Link>
              <Link href="/auth/signup" className="hover:text-brand-dark transition-colors">Sign Up</Link>
              <a href="#features" className="hover:text-brand-dark transition-colors">Features</a>
            </div>
            
            <div className="flex items-center gap-4">
              <a href="#" className="text-text-secondary hover:text-brand-dark transition-colors">
                <IconBrandTwitter size={20} />
              </a>
              <a href="#" className="text-text-secondary hover:text-brand-dark transition-colors">
                <IconBrandGithub size={20} />
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-brand-light/30 text-center">
            <p className="text-[12px] text-text-tertiary">
              © 2026 ClientFlow. All rights reserved. Built with Next.js and Supabase.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
