import React, { useState, useEffect, useRef } from 'react';
import {
  Navigation,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Shield,
  Cpu,
  Route,
  Activity,
  Zap,
  Globe,
  TrendingDown,
  Clock,
  Layers,
  Compass,
  Lock,
  UserCheck,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

import dynamicBg from '../../assets/images/disha_dynamic_bg_1790611705998.jpg';
import iconPrediction from '../../assets/images/icon_prediction_1790611722134.jpg';
import iconOptimization from '../../assets/images/icon_optimization_1790611736574.jpg';
import iconSpillback from '../../assets/images/icon_spillback_1790611752799.jpg';

interface LandingPageProps {
  onGetStarted: () => void;
  onDirectLogin: () => void;
  onExploreDemoDirectly: () => void;
  hasActiveSession?: boolean;
  onResumeSession?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onDirectLogin,
  onExploreDemoDirectly,
  hasActiveSession = false,
  onResumeSession,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // Dynamic particle canvas on top of background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes representing dynamic traffic telemetry
    const particleCount = Math.min(Math.floor(width / 35), 45);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.4 ? 'rgba(56, 189, 248, 0.45)' : 'rgba(52, 211, 153, 0.45)',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connecting telemetry lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 * (1 - dist / 140)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Draw and update glowing particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#38bdf8';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const faqs = [
    {
      q: 'How does DISHA differ from standard GPS navigation apps like Google Maps?',
      a: 'Traditional navigation algorithms react to congestion that has already formed, often redirecting hundreds of vehicles onto the same alternate street and triggering a secondary bottleneck. DISHA uses spatial-temporal deep learning to predict traffic density 15 to 30 minutes in the future and QPSO (Quantum Particle Swarm Optimization) to distribute vehicles across non-conflicting corridors before gridlock develops.',
    },
    {
      q: 'What is "Traffic Spillback" and how does DISHA prevent it?',
      a: 'Spillback occurs when a queue at a downstream intersection backs up and blocks an upstream junction, cascading paralysis across entire arterial networks (such as Silk Board or Hebbal in Bangalore). DISHA calculates queue length growth rates and actively reroutes commuters away from critical choke points before spillback locks the junction.',
    },
    {
      q: 'Does DISHA work for electric vehicles and eco-conscious drivers?',
      a: 'Yes. DISHA includes green routing metrics that optimize for smooth constant-velocity transit, minimizing stop-and-go battery drain, regenerative braking loss, and CO2 emissions while prioritizing charging infrastructure corridors.',
    },
    {
      q: 'How do I access the full navigation engine and live dashboard?',
      a: 'Scroll to the bottom of this page to the single DISHA Access Portal. You can either sign in with your credentials or launch immediately with Guest Commuter access to start planning real-world routes.',
    },
    {
      q: 'What real-time data sources power DISHA’s predictive engine?',
      a: 'DISHA ingests IoT road sensors, municipal signal timing controllers, connected probe vehicle velocities, and historical temporal traffic patterns, combining them into a unified dynamic digital twin.',
    },
  ];

  return (
    <div className="relative min-h-screen text-slate-100 bg-slate-950 font-sans selection:bg-cyan-500 selection:text-white">
      {/* 1. FIXED DYNAMIC BACKGROUND IMAGE */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src={dynamicBg}
          alt="DISHA Dynamic Smart Mobility Network Background"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Deep translucent overlay veil to ensure crisp text readability while preserving background clarity */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/75 to-slate-950/90 backdrop-blur-[1px]" />
        {/* Animated dynamic particle telemetry canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
      </div>

      {/* 2. STICKY GLASS HEADER (Clean, simple, no clutter, no redundant login buttons) */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/60 backdrop-blur-xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Platform Name */}
          <button
            type="button"
            onClick={() => scrollToSection('overview')}
            className="flex items-center gap-3 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 ring-1 ring-white/20 group-hover:scale-105 transition-transform">
              <Navigation className="w-5 h-5 text-white transform -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  DISHA
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Intelligent System
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Dynamic Intelligent System for Holistic Access
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            <button
              type="button"
              onClick={() => scrollToSection('overview')}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('pillars')}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Core Capabilities
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('architecture')}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Architecture
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('comparison')}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Comparison
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('metrics')}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Impact
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('faq')}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              FAQ
            </button>
          </nav>

          {/* Header Action: Smoothly directs to the bottom Sign In / Login portal */}
          <div className="hidden md:flex items-center">
            <button
              type="button"
              onClick={() => scrollToSection('access-portal')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400/50 shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <span>Go to Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900/60 border border-white/10 text-slate-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-white/10 bg-slate-950/95 backdrop-blur-2xl px-6 py-5 space-y-4">
            <div className="flex flex-col space-y-3">
              <button
                type="button"
                onClick={() => scrollToSection('overview')}
                className="text-left text-sm font-medium text-slate-200 py-1.5"
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('pillars')}
                className="text-left text-sm font-medium text-slate-200 py-1.5"
              >
                Core Capabilities
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('architecture')}
                className="text-left text-sm font-medium text-slate-200 py-1.5"
              >
                Architecture
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('comparison')}
                className="text-left text-sm font-medium text-slate-200 py-1.5"
              >
                Comparison
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('metrics')}
                className="text-left text-sm font-medium text-slate-200 py-1.5"
              >
                Impact
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('faq')}
                className="text-left text-sm font-medium text-slate-200 py-1.5"
              >
                FAQ
              </button>
            </div>
            <div className="pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => scrollToSection('access-portal')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-cyan-300 bg-cyan-500/15 border border-cyan-500/30"
              >
                <span>Go to Sign In Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 3. MAIN PAGE CONTENT — FLOWS SEAMLESSLY OVER DYNAMIC BACKGROUND */}
      <main className="relative z-10">
        {/* HERO SECTION (#overview) */}
        <section
          id="overview"
          className="scroll-mt-24 min-h-[calc(100vh-4.5rem)] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8"
        >
          <div className="max-w-5xl mx-auto text-center">
            {/* Live Corridor Status Chip */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/60 border border-cyan-500/30 backdrop-blur-md shadow-lg shadow-cyan-500/10 mb-8 animate-pulse">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20" />
              <span className="text-xs font-semibold tracking-wide text-cyan-200 uppercase">
                Active Telemetry: 14,820 Arterial Nodes Online
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-xs text-slate-300">Bangalore Urban Corridor</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight sm:leading-none mb-6">
              Predictive Urban Mobility. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                Zero Spillback Congestion.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-300 font-normal leading-relaxed mb-10">
              DISHA is an AI-powered traffic intelligence system combining multi-horizon congestion
              forecasting with Quantum-inspired Particle Swarm Optimization (QPSO) to eliminate
              bottlenecks before gridlock strikes.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <button
                type="button"
                onClick={() => scrollToSection('access-portal')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-xl shadow-cyan-500/25 ring-1 ring-white/20 transition-all hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <span>Access DISHA Portal</span>
                <ArrowRight className="w-5 h-5 text-cyan-100" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('pillars')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-medium text-slate-200 bg-slate-900/60 hover:bg-slate-800/80 border border-white/15 backdrop-blur-md transition-all hover:text-white hover:border-cyan-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <Compass className="w-5 h-5 text-cyan-400" />
                <span>Explore Capabilities</span>
              </button>
            </div>

            {/* Live Impact Highlights Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
              <div className="p-4 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/10 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-cyan-400">28%</div>
                <div className="text-xs text-slate-400 mt-1">Commute Time Saved</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/10 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-400">15–30m</div>
                <div className="text-xs text-slate-400 mt-1">Forecast Horizon</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/10 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-indigo-300">0%</div>
                <div className="text-xs text-slate-400 mt-1">Spillback Gridlock</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/10 text-center">
                <div className="text-2xl sm:text-3xl font-bold text-amber-300">QPSO</div>
                <div className="text-xs text-slate-400 mt-1">Global Optimal Path</div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. CORE CAPABILITIES SECTION (#pillars with Rich Generated Visual Images) */}
        <section id="pillars" className="scroll-mt-24 py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Intelligent Core</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Three Pillars of Autonomous Traffic Harmony
              </h2>
              <p className="text-slate-300 mt-3 text-base sm:text-lg">
                Engineered specifically for hyper-dense metropolitan corridors where traditional
                reactive GPS routing constantly fails.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1: Multi-Horizon Traffic Prediction */}
              <div className="group rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 p-7 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all duration-300 shadow-xl flex flex-col">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-6 border border-white/10 bg-slate-950">
                  <img
                    src={iconPrediction}
                    alt="AI Multi-Horizon Traffic Prediction Engine"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-500/30 text-[11px] font-semibold text-cyan-300">
                    Neural Forecaster
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2 text-cyan-400 font-semibold text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Horizon: 15 / 30 Minutes</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Multi-Horizon Prediction</h3>
                <p className="text-slate-300 text-sm leading-relaxed flex-grow">
                  Spatial-temporal deep learning analyzes upstream road velocity, bottle-neck
                  choke points, and historical patterns to anticipate jams before vehicles arrive.
                </p>
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span>Accuracy Benchmark</span>
                  <span className="text-emerald-400 font-semibold">94.8% Precision</span>
                </div>
              </div>

              {/* Card 2: QPSO Route Optimization */}
              <div className="group rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 p-7 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all duration-300 shadow-xl flex flex-col">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-6 border border-white/10 bg-slate-950">
                  <img
                    src={iconOptimization}
                    alt="Quantum Particle Swarm Route Optimization"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/30 text-[11px] font-semibold text-emerald-300">
                    QPSO Engine
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2 text-emerald-400 font-semibold text-sm">
                  <Zap className="w-4 h-4" />
                  <span>Quantum Swarm Intelligence</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">QPSO Route Optimization</h3>
                <p className="text-slate-300 text-sm leading-relaxed flex-grow">
                  Evaluates global traffic balance across hundreds of alternative paths
                  simultaneously, preventing the herd-routing effect typical of legacy navigation.
                </p>
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span>Convergence Speed</span>
                  <span className="text-emerald-400 font-semibold">&lt; 140ms Synthesis</span>
                </div>
              </div>

              {/* Card 3: Dynamic Spillback Defense */}
              <div className="group rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 p-7 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all duration-300 shadow-xl flex flex-col">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-6 border border-white/10 bg-slate-950">
                  <img
                    src={iconSpillback}
                    alt="Dynamic Spillback & Shockwave Prevention"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-500/30 text-[11px] font-semibold text-amber-300">
                    Spillback Shield
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2 text-amber-400 font-semibold text-sm">
                  <Shield className="w-4 h-4" />
                  <span>Junction Shockwave Defense</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Dynamic Spillback Defense</h3>
                <p className="text-slate-300 text-sm leading-relaxed flex-grow">
                  Identifies when queue back-ups threaten upstream intersections and proactively
                  channels vehicles along high-throughput bypasses to protect city junctions.
                </p>
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <span>Junction Protection</span>
                  <span className="text-cyan-400 font-semibold">100% Critical Nodes</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. HOW DISHA WORKS / PIPELINE ARCHITECTURE (#architecture) */}
        <section id="architecture" className="scroll-mt-24 py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-3">
                <Cpu className="w-3.5 h-3.5" />
                <span>System Pipeline</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                How DISHA Transforms Raw Data Into Flow
              </h2>
              <p className="text-slate-300 mt-3 text-base sm:text-lg">
                A 4-stage pipeline that continuously synchronizes real-world urban telemetry with
                mathematical path optimization.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Step 1 */}
              <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 relative">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-lg mb-4">
                  01
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Ingestion & Road Graph</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Real-time GPS probes, road sensor counts, and signal timing cycles feed into an
                  in-memory graph representing thousands of road segments.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 relative">
                <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center font-bold text-lg mb-4">
                  02
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Spatial-Temporal Forecaster</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Deep learning models compute forecasted congestion density at +15m and +30m
                  intervals, flagging queue spillbacks before physical manifestation.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 relative">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-lg mb-4">
                  03
                </div>
                <h4 className="text-lg font-bold text-white mb-2">QPSO Path Synthesis</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Quantum-behaved Particle Swarm Optimization discovers non-competing paths that
                  minimize transit time and avoid overloading secondary streets.
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 relative">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-lg mb-4">
                  04
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Adaptive Dispatch</h4>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Guidance is delivered to commuters with proactive turn warnings and automated
                  reroutes when downstream congestion spikes are detected.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. COMPARISON MATRIX (#comparison) */}
        <section id="comparison" className="scroll-mt-24 py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
                <Layers className="w-3.5 h-3.5" />
                <span>The DISHA Difference</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Traditional GPS vs. DISHA Intelligent System
              </h2>
              <p className="text-slate-300 mt-3 text-base sm:text-lg">
                See why conventional reactive navigation creates traffic waves and why DISHA
                sustains network equilibrium.
              </p>
            </div>

            <div className="overflow-x-auto rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-2xl">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/60 border-b border-white/10 text-xs uppercase text-slate-400 font-semibold tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-4">Capability</th>
                    <th scope="col" className="px-6 py-4 text-slate-400">Traditional Navigation (Google / Waze)</th>
                    <th scope="col" className="px-6 py-4 text-cyan-300 font-bold bg-cyan-950/30 border-l border-cyan-500/20">
                      DISHA Intelligent System
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">Routing Philosophy</td>
                    <td className="px-6 py-4 text-slate-400">Reactive (Responds to jams already formed)</td>
                    <td className="px-6 py-4 text-cyan-300 font-semibold bg-cyan-950/20 border-l border-cyan-500/20">
                      Predictive (Solves jams 15-30 mins before arrival)
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">Secondary Bottlenecks</td>
                    <td className="px-6 py-4 text-slate-400">High (Dumps all cars onto the same side-street)</td>
                    <td className="px-6 py-4 text-emerald-400 font-semibold bg-cyan-950/20 border-l border-cyan-500/20">
                      Eliminated via Quantum Swarm Distribution
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">Spillback Detection</td>
                    <td className="px-6 py-4 text-slate-400">None (Intersections choke without warning)</td>
                    <td className="px-6 py-4 text-cyan-300 font-semibold bg-cyan-950/20 border-l border-cyan-500/20">
                      Real-time queue tracking & shockwave defense
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">Algorithm Basis</td>
                    <td className="px-6 py-4 text-slate-400">Dijkstra / A* Shortest Static Path</td>
                    <td className="px-6 py-4 text-cyan-300 font-semibold bg-cyan-950/20 border-l border-cyan-500/20">
                      QPSO (Quantum Particle Swarm Optimization)
                    </td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">Environmental Eco-Routing</td>
                    <td className="px-6 py-4 text-slate-400">Basic fuel estimate</td>
                    <td className="px-6 py-4 text-emerald-400 font-semibold bg-cyan-950/20 border-l border-cyan-500/20">
                      Full EV regenerative & CO2-minimized velocity curves
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 7. REAL-WORLD CORRIDOR IMPACT (#metrics) */}
        <section id="metrics" className="scroll-mt-24 py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
                <Activity className="w-3.5 h-3.5" />
                <span>Validated Results</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Empirical Corridor Performance
              </h2>
              <p className="text-slate-300 mt-3 text-base sm:text-lg">
                Measured on Bangalore's most challenging transit arteries during peak commuting
                hours.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-8 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 text-center">
                <div className="text-5xl font-extrabold text-cyan-400 mb-2">28.4%</div>
                <div className="text-lg font-bold text-white mb-2">Travel Time Reduction</div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Average round-trip commute from MG Road to Electronic City shortened by over 22
                  minutes during rush hour.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 text-center">
                <div className="text-5xl font-extrabold text-emerald-400 mb-2">41.2%</div>
                <div className="text-lg font-bold text-white mb-2">Less Idle Choke Time</div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Substantial reduction in stop-and-go queue wait times at critical intersections
                  like Silk Board and Marathahalli.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 text-center">
                <div className="text-5xl font-extrabold text-indigo-400 mb-2">19.5%</div>
                <div className="text-lg font-bold text-white mb-2">CO2 & Fuel Savings</div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Smoothed acceleration profiles and reduced queue idling directly lowered commuter
                  carbon footprints.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. FAQ ACCORDION (#faq) */}
        <section id="faq" className="scroll-mt-24 py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
                <Compass className="w-3.5 h-3.5" />
                <span>Knowledge Base</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-300 mt-3 text-base sm:text-lg">
                Everything you need to know about the DISHA platform and how to start navigating.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-2xl bg-slate-900/60 backdrop-blur-md border border-white/10 overflow-hidden transition-all duration-200 hover:border-cyan-500/30"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isOpen ? null : index)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                      aria-expanded={isOpen}
                    >
                      <span className="text-base font-semibold text-white pr-4">{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-cyan-400 transition-transform duration-200 flex-shrink-0 ${
                          isOpen ? 'transform rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-sm text-slate-300 leading-relaxed border-t border-white/5">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 9. THE SINGLE SIGN IN / LOGIN AT THE BOTTOM OF THE PAGE (#access-portal) */}
        <section
          id="access-portal"
          className="scroll-mt-24 py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10"
        >
          <div className="max-w-3xl mx-auto">
            <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-cyan-500/30 shadow-2xl shadow-cyan-950/50 text-center relative overflow-hidden">
              {/* Glowing accent orb */}
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-cyan-500/30 ring-1 ring-white/20 mx-auto mb-6">
                  <Lock className="w-8 h-8" />
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Authorized Access Portal</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
                  Enter DISHA Navigation Engine
                </h2>

                <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto mb-8">
                  Sign in to access personalized commuter preferences, live spillback simulation,
                  and real-time predictive turn-by-turn routing.
                </p>

                {/* Single Primary Sign In / Login Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                  <button
                    type="button"
                    onClick={onDirectLogin}
                    className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-xl shadow-cyan-500/25 ring-1 ring-white/20 transition-all hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <Lock className="w-4 h-4 text-cyan-100" />
                    <span>Sign In to Account</span>
                  </button>

                  <button
                    type="button"
                    onClick={onGetStarted}
                    className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl text-base font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-white/15 backdrop-blur-md transition-all hover:text-white hover:border-cyan-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <UserCheck className="w-4 h-4 text-cyan-400" />
                    <span>Instant Guest Access</span>
                  </button>
                </div>

                {hasActiveSession && onResumeSession && (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={onResumeSession}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline underline-offset-4"
                    >
                      <span>Resume your ongoing navigation session</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Trust Badges */}
                <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Real-time Predictive Navigation
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Zero Spillback Rerouting
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Instant Guest Mode Supported
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 10. CLEAN MINIMAL FOOTER */}
      <footer className="relative z-10 border-t border-white/10 bg-slate-950/80 backdrop-blur-md py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
              <Navigation className="w-3.5 h-3.5 transform -rotate-45" />
            </div>
            <span>
              DISHA — Dynamic Intelligent System for Holistic Access.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => scrollToSection('overview')}
              className="hover:text-white transition-colors"
            >
              Back to Top
            </button>
            <button
              type="button"
              onClick={onDirectLogin}
              className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
            >
              Commuter Sign In
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
