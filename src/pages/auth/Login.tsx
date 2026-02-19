import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Mail, Lock, ArrowRight } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-deep flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-deep to-navy/80" />
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-lg text-highlight">
            <div className="h-9 w-9 rounded-lg bg-navy border border-interface/30 flex items-center justify-center">
              <Brain className="h-5 w-5 text-highlight" />
            </div>
            <span className="tracking-tight">StudyMind</span>
          </Link>
        </div>
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold text-highlight tracking-tight leading-tight">
            Welcome back to<br />smarter learning.
          </h1>
          <p className="text-soft text-lg max-w-md leading-relaxed">
            Pick up where you left off. Your AI tutor, quizzes, and study streaks are waiting.
          </p>
          <div className="flex gap-6 pt-4">
            {[
              { value: "50K+", label: "Students" },
              { value: "1M+", label: "Questions Solved" },
              { value: "98%", label: "Satisfaction" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-highlight">{s.value}</div>
                <div className="text-xs text-soft mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-xs text-soft">
          © 2026 StudyMind. All rights reserved.
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-2.5 font-bold text-lg text-foreground mb-8">
            <div className="h-9 w-9 rounded-lg bg-navy flex items-center justify-center">
              <Brain className="h-5 w-5 text-highlight" />
            </div>
            <span>StudyMind</span>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Sign in to your account</h2>
            <p className="text-muted-foreground mt-2 text-sm">Enter your credentials to continue learning</p>
          </div>

          <Button variant="outline" className="w-full h-11 gap-3 text-sm font-medium border-border">
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-3 text-muted-foreground">or</span></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="you@example.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Password</label>
                <a href="#" className="text-xs text-accent hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 h-11" />
              </div>
            </div>
            <Button type="submit" className="w-full h-11 bg-navy text-highlight hover:bg-navy/90 font-semibold gap-2">
              Sign In <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-accent font-medium hover:underline">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
