"use client";

import { useState } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, User, Building2, Truck, Package, Shield } from "lucide-react";
import { UserRole } from "@/lib/auth/roles";
import { useToast } from "@/hooks/use-toast";

interface AuthFormProps {
  mode: "signin" | "signup";
  onSubmit?: (data: FormData) => void;
}

export function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.SHIPPER);
  
  const { signIn, setActive: setActiveSignIn } = useSignIn();
  const { signUp, setActive: setActiveSignUp } = useSignUp();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      if (mode === "signup") {
        await handleSignUp(formData);
      } else {
        await handleSignIn(formData);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleSignUp = async (formData: FormData) => {
    if (!signUp) return;

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;
    const company = formData.get("company") as string;
    const [firstName, ...lastNameParts] = fullName.split(" ");
    const lastName = lastNameParts.join(" ");

    try {
      // Create sign up with metadata
      await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
        unsafeMetadata: {
          role: selectedRole,
          companyName: company,
        },
      });

      // Send email verification
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set session active and redirect to verification
      await setActiveSignUp({ session: signUp.createdSessionId });
      
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account.",
      });

      // Redirect to onboarding
      router.push("/onboarding");
    } catch (error: any) {
      console.error("Sign up error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (formData: FormData) => {
    if (!signIn) return;

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActiveSignIn({ session: result.createdSessionId });
        
        toast({
          title: "Welcome back!",
          description: "Successfully signed in.",
        });

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        console.error("Sign in incomplete:", result);
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const isSignUp = mode === "signup";

  const roleOptions = [
    {
      value: UserRole.SHIPPER,
      label: "Shipper",
      description: "I need to ship goods",
      icon: Package,
    },
    {
      value: UserRole.DRIVER,
      label: "Driver",
      description: "I transport goods",
      icon: Truck,
    },
    {
      value: UserRole.ADMIN,
      label: "Admin",
      description: "Platform administrator",
      icon: Shield,
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSignUp && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            I am a...
          </label>
          <div className="grid grid-cols-1 gap-2">
            {roleOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedRole(option.value)}
                  className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all ${
                    selectedRole === option.value
                      ? "border-primary bg-primary/5"
                      : "border-input hover:border-primary/50"
                  }`}
                >
                  <Icon className={`h-5 w-5 mt-0.5 ${
                    selectedRole === option.value ? "text-primary" : "text-muted-foreground"
                  }`} />
                  <div className="flex-1 text-left">
                    <p className={`font-medium ${
                      selectedRole === option.value ? "text-primary" : "text-foreground"
                    }`}>
                      {option.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

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
