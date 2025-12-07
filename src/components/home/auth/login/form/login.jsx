"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useUser } from "@/app/(home)/_context/UserContext";
import Link from "next/link";

function Login() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { getUser } = useUser();

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "";

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!name || !password) {
      setError("Please enter both username and password.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/loginuser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_login_name: name,
          user_password: password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        return toast.error(errorData?.message || "Something went wrong!");
      }

      const result = await res.json();
      getUser();

      const redirectPath =
        redirect && redirect.startsWith("/")
          ? redirect
          : redirect
            ? `/${redirect}`
            : "";

      if (result?.details) {
        if (redirectPath) {
          router.replace(redirectPath);
        } else if (result?.details[0]?.role_name === "invent_vendor") {
          router.push("/dashboard/vendor");
        } else if (result?.details[0]?.role_name === "invent_administrator") {
          router.push("/dashboard/admin");
        } else {
          router.push("/");
        }
      } else {
        toast.error(result?.message?.text || "Invalid login credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupRedirect = () => {
    router.push("/auth/register");
  };

  return (
    <div className="min-h-screen bg-gray-50 jost-text">
      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <div className="backdrop-blur-sm shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
              {/* Welcome Section */}
              <div className="hidden md:flex flex-col justify-center items-center text-center p-8 bg-gradient-to-br from-primary/70 via-primary/90 to-primary/70 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative z-10 space-y-6 max-w-sm">
                  <h1 className="text-3xl xl:text-4xl font-bold leading-tight">
                    Welcome Back
                  </h1>
                  <p className="text-lg text-white/90 leading-relaxed">
                    Sign in to access your account and continue your journey
                    with us
                  </p>
                </div>
              </div>

              {/* Form Section */}
              <div className="p-8 flex flex-col justify-center bg-white">
                <div className="space-y-6">
                  {error && (
                    <Alert
                      variant="destructive"
                      className="border-red-200 bg-red-50"
                    >
                      <AlertDescription className="text-red-800">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Login Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="username"
                        className="text-gray-700 font-medium"
                      >
                        Username
                      </Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter your Username"
                        value={name}
                        autoComplete="username"
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-11 focus:ring-2 focus:ring-primary/90 focus:border-primary/90 border-gray-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-gray-700 font-medium"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          autoComplete="current-password"
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={isLoading}
                          className="h-11 pr-10 focus:ring-2 focus:ring-primary/90 focus:border-primary/90 border-gray-300"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                          aria-label="Toggle password visibility"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>

                      {/* Forgot Password Link */}
                      <div className="text-right ">
                        <Link
                          href="/auth/reset"  // Replace with your route
                          className="text-sm text-primary hover:underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                    </div>


                    <Button
                      type="submit"
                      className="w-full h-11 bg-primary hover:bg-primary/80 text-white font-medium shadow-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>

                  {/* Sign Up Link */}
                  <div className="text-center pt-2">
                    <span className="text-gray-600">
                      {"Don't have an account? "}
                    </span>
                    <Button
                      variant="link"
                      onClick={handleSignupRedirect}
                      className="p-0 h-auto font-semibold text-primary hover:text-primary/90"
                      disabled={isLoading}
                    >
                      Create Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
