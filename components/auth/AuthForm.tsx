"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, User, Building2 } from "lucide-react";

interface AuthFormProps {
  mode: "signin" | "signup";
  onSubmit: (data: FormData) => void;
}

export function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    // TODO: Implement actual form submission with Clerk
    setTimeout(() => {
      onSubmit(formData);
      setIsLoading(false);
    }, 2000);
  };

  const isSignUp = mode === "signup";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSignUp && (
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-sm font-medium text-foreground">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              id="fullName"
              name="fullName"
              type="text"
              required={isSignUp}
              placeholder="John Doe"
              className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
          </div>
        </div>
      )}

      {isSignUp && (
        <div className="space-y-2">
          <label htmlFor="company" className="text-sm font-medium text-foreground">
            Company Name
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              id="company"
              name="company"
              type="text"
              required={isSignUp}
              placeholder="Acme Logistics"
              className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@company.com"
            className="w-full h-11 pl-10 pr-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="••••••••"
            minLength={8}
            className="w-full h-11 pl-10 pr-12 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {isSignUp && (
          <p className="text-xs text-muted-foreground">
            Must be at least 8 characters long
          </p>
        )}
      </div>

      {!isSignUp && (
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="remember"
              className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
            />
            <span className="text-muted-foreground">Remember me</span>
          </label>
          <a href="#" className="text-primary hover:underline font-medium">
            Forgot password?
          </a>
        </div>
      )}

      {isSignUp && (
        <div className="flex items-start space-x-2">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="w-4 h-4 mt-1 rounded border-input text-primary focus:ring-2 focus:ring-ring"
          />
          <label htmlFor="terms" className="text-sm text-muted-foreground">
            I agree to the{" "}
            <a href="#" className="text-primary hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:underline">
              Privacy Policy
            </a>
          </label>
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-11 font-semibold"
        disabled={isLoading}
      >
        {isLoading
          ? "Processing..."
          : isSignUp
          ? "Create Account"
          : "Sign In"}
      </Button>
    </form>
  );
}
