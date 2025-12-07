"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { isPasswordStrong } from "@/lib/password-strong";

function Reset() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(""); // ← token auto-filled
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";

  // Fill Email + Token Automatically
  useEffect(() => {
    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");

    if (emailParam) setEmail(emailParam);
    if (tokenParam) setToken(tokenParam);
  }, [searchParams]);

  const getErrorMessage = (errorData) => {
    if (typeof errorData?.message === "string") return errorData.message;
    if (errorData?.message?.status === "error")
      return errorData.message.role || "Password reset failed.";
    if (Array.isArray(errorData?.details)) return errorData.details[0];
    if (typeof errorData?.hint === "string") return errorData.hint;

    return "An error occurred. Please try again.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ❌ DON'T start loading yet
    // setIsLoading(true);

    // 1️⃣ Validate first (NO LOADER)
    if (!email) return setError("Email is required.");
    if (!token) return setError("Token is required.");
    if (!password) return setError("Enter new password.");
    if (password.length < 8)
      return setError("Password must be at least 8 characters.");
    if (password !== confirmPassword)
      return setError("Passwords do not match.");

    if (!isPasswordStrong(password)) {
      return setError(
        "Weak password. Must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
    }


    // 2️⃣ If validation success → NOW start loading
    setIsLoading(true);

    try {
      const res = await fetch(`${baseUrl}/forgotpassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_email: email,
          token: token,
          user_password: password,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        const errMsg = getErrorMessage(result);
        setError(errMsg);
        toast.error(errMsg);
        setIsLoading(false);
        return;
      }

      toast.success("Password reset successful! Redirecting...");

      setTimeout(() => router.push("/auth/login"), 1500);
    } catch (err) {
      console.error(err);
      toast.error("Network error.");
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
                    Almost There!
                  </h1>
                  <p className="text-lg text-white/90 leading-relaxed">
                    Enter the token from your email and create a new secure password
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
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-red-800">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div>
                    <h3 className="text-3xl pb-1 text-primary">Reset Password</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      Check your email for the reset token
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-gray-700 font-medium"
                      >
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                        className="h-11"
                        readOnly
                      />
                    </div>

                    {/* Token */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="token"
                        className="text-gray-700 font-medium"
                      >
                        Reset Token
                      </Label>
                      <Input
                        id="token"
                        type="text"
                        placeholder="Enter token (e.g., 1947BA)"
                        value={token}
                        onChange={(e) => setToken(e.target.value.toUpperCase())}
                        required
                        disabled={isLoading}
                        className="h-11 font-mono tracking-wider text-center text-lg"
                        maxLength={6}
                        readOnly
                      />

                    </div>

                    {/* Password */}
                    {/* New Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700 font-medium">
                        New Password
                      </Label>

                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your new password"
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
                      <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                        Confirm Password
                      </Label>

                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Re-enter your new password"
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
                          Updating Password...
                        </>
                      ) : (
                        "Update Password"
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