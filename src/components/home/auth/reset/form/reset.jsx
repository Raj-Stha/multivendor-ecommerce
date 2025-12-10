"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { isPasswordStrong } from "@/lib/password-strong";

export default function ResetPassword() {
  // PHASE STATES
  const [step, setStep] = useState("email"); // "email" → "password"

  // FORM STATES
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(""); // hidden token
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI STATES
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://45.117.153.186/api";

  // Error Parsing
  const getErrorMessage = (e) => {
    if (typeof e?.message === "string") return e.message;
    if (Array.isArray(e?.details)) return e.details[0];
    if (typeof e?.hint === "string") return e.hint;
    return "Something went wrong.";
  };

  /* ---------------------------------------------------------
    1️⃣ FIRST STEP — SEND EMAIL TO GET TOKEN
  --------------------------------------------------------- */
  const handleSendEmail = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email) {
      setError("Please enter an email.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/forgotpassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_email: email }),
      });

      const result = await res.json();

      if (!res.ok) {
        const errorMsg = getErrorMessage(result);
        setError(errorMsg);
        toast.error(errorMsg);
        setIsLoading(false);
        return;
      }

      // extract token
      const receivedToken =
        result?.details?.[0]?.["password reset initiated successfully "] || "";

      if (!receivedToken) {
        toast.error("Token not received.");
        setIsLoading(false);
        return;
      }

      setToken(receivedToken); // store internally
      setStep("password"); // jump to next UI step

      toast.success("Email sent. Check inbox!");
    } catch (err) {
      toast.error("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------------------------------------------------
    2️⃣ SECOND STEP — SUBMIT NEW PASSWORD WITH TOKEN + EMAIL
  --------------------------------------------------------- */
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!password) return setError("Enter a password.");
    if (password !== confirmPassword)
      return setError("Passwords do not match.");

    if (!isPasswordStrong(password))
      return setError(
        "Weak password. Include uppercase, lowercase, number & special character."
      );

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

      toast.success("Password updated successfully!");
      setTimeout(() => router.push("/auth/login"), 1500);
    } catch (err) {
      toast.error("Network error.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------------------------------------------------
    👉 RENDER (CONDITIONAL UI)
  --------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gray-50 jost-text">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-5xl">
          <div className="backdrop-blur-sm shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
              {/* Welcome Section */}
              <div className="hidden md:flex flex-col justify-center items-center text-center p-8 bg-gradient-to-br from-primary/70 via-primary/90 to-primary/70 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10" />
                <div className="relative z-10 space-y-6 max-w-sm">
                  <h1 className="text-3xl xl:text-4xl font-bold leading-tight">
                    No Worries !!
                  </h1>
                  <p className="text-lg text-white/90 leading-relaxed">
                    Enter your email to reset your password. We'll send you a
                    secure token.
                  </p>
                </div>
              </div>

              <div className="p-8 flex flex-col justify-center bg-white">
                <div className="mb-8">

                  <h3 className="text-3xl pb-1 text-primary">Reset Password</h3>
                  <p className="text-sm text-gray-600">
                    Enter your email address and we'll send you a reset token.
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* **********************************************************
           STEP 1 — EMAIL INPUT SCREEN
        ********************************************************** */}
                {step === "email" && (
                  <form onSubmit={handleSendEmail} className="space-y-6">
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        disabled={isLoading}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <Button disabled={isLoading} className="w-full h-11">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />{" "}
                          Sending...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </form>
                )}

                {/* **********************************************************
           STEP 2 — PASSWORD INPUT SCREEN (EMAIL + TOKEN HIDDEN)
        ********************************************************** */}
                {step === "password" && (
                  <form onSubmit={handleUpdatePassword} className="space-y-5">
                    {/* New Password */}
                    <div>
                      <Label>New Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          className="absolute right-1 top-1 h-9 px-2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </Button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <Label>Confirm Password</Label>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>

                    <Button disabled={isLoading} className="w-full h-11">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />{" "}
                          Updating...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
