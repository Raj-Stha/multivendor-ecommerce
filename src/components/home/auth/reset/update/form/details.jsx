"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

function Reset() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "";

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!password) {
      setError("Please enter password.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      console.log(password);

      // API call goes here
    } catch (err) {
      console.error("Reset error:", err);
      setError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 jost-text">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <div className="backdrop-blur-sm shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
              {/* Left side */}
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

              {/* Form */}
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

                  <h3 className="text-3xl pb-1 text-primary">Reset Password</h3>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Password */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="password"
                        className="text-gray-700 font-medium"
                      >
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={isLoading}
                          className="h-11 pr-10"
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
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-gray-700 font-medium"
                      >
                        Confirm Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-11"
                      />
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      className="w-full h-11 bg-primary hover:bg-primary/80 text-white font-medium shadow-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating ...
                        </>
                      ) : (
                        "Update"
                      )}
                    </Button>
                  </form>
                </div>
              </div>
              {/* End form */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reset;
