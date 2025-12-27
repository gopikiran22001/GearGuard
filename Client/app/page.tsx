"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, CheckCircle2, Factory, BarChart3, ShieldCheck, Users } from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">GearGuard</span>
          </div>
          <nav className="flex items-center gap-4">
            {user ? (
              <Button asChild className="bg-primary hover:bg-primary/90 text-white">
                <Link href="/dashboard">
                  Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary/90 text-white">
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>


      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-muted skew-y-3 transform origin-top-left -z-10 h-3/4"></div>
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-foreground">
              Industrial Maintenance <span className="text-primary">Simplified</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Streamline your equipment maintenance, track repairs, and boost operational efficiency with our professional SaaS platform designed for modern industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-6 h-auto" asChild>
                <Link href="/register">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 h-auto" asChild>
                <Link href="/demo">Request Demo</Link>
              </Button>
            </div>
            <div className="flex gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-secondary" />
                <span>Real-time Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-secondary" />
                <span>Preventive Maintenance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-secondary" />
                <span>Team Management</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-border">

              <div className="bg-slate-900 h-8 flex items-center px-4 gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
              <div className="p-6 bg-slate-50">
                <div className="flex gap-4 mb-6">
                  <div className="w-1/4 h-24 bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                    <div className="h-2 w-12 bg-slate-200 rounded mb-2"></div>
                    <div className="h-8 w-16 bg-blue-100 rounded-lg"></div>
                  </div>
                  <div className="w-1/4 h-24 bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                    <div className="h-2 w-12 bg-slate-200 rounded mb-2"></div>
                    <div className="h-8 w-16 bg-orange-100 rounded-lg"></div>
                  </div>
                  <div className="w-1/4 h-24 bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                    <div className="h-2 w-12 bg-slate-200 rounded mb-2"></div>
                    <div className="h-8 w-16 bg-green-100 rounded-lg"></div>
                  </div>
                  <div className="w-1/4 h-24 bg-white rounded-lg shadow-sm border border-slate-200 p-4">
                    <div className="h-2 w-12 bg-slate-200 rounded mb-2"></div>
                    <div className="h-8 w-16 bg-red-100 rounded-lg"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-12 w-full bg-white rounded border border-slate-200"></div>
                  <div className="h-12 w-full bg-white rounded border border-slate-200"></div>
                  <div className="h-12 w-full bg-white rounded border border-slate-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Everything you need to manage assets</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Powerful features built for maintenance teams, facility managers, and technicians.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-card border border-border hover:shadow-lg transition-all group">
              <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Factory className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Asset Management</h3>
              <p className="text-muted-foreground">Keep detailed records of all your equipment, including warranty info, service history, and location.</p>
            </div>
            <div className="p-8 rounded-xl bg-card border border-border hover:shadow-lg transition-all group">
              <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Analytics & Reports</h3>
              <p className="text-muted-foreground">Gain insights into equipment performance, team productivity, and maintenance costs with real-time charts.</p>
            </div>
            <div className="p-8 rounded-xl bg-card border border-border hover:shadow-lg transition-all group">
              <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Team Collaboration</h3>
              <p className="text-muted-foreground">Assign tasks to technicians, track progress, and communicate effectively within the platform.</p>
            </div>
          </div>
        </div>
      </section>


      <section className="py-24 bg-secondary text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to optimize your maintenance workflow?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">Join thousands of industrial companies using GearGuard to reduce downtime and extend asset lifespan.</p>
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white text-lg px-10 py-6 h-auto rounded-full" asChild>
            <Link href="/register">Get Started Now</Link>
          </Button>
        </div>
      </section>


      <footer className="py-12 bg-slate-900 text-gray-400 border-t border-slate-800 mt-auto">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <ShieldCheck className="h-6 w-6" />
            <span className="text-lg font-bold text-white">GearGuard</span>
          </div>
          <div className="flex gap-8 text-sm">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact Support</Link>
          </div>
          <div className="mt-4 md:mt-0 text-xs">
            &copy; {new Date().getFullYear()} GearGuard Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
