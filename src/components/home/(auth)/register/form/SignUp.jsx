"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { PasswordField } from "../../password-field";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isFormLoading, setIsFormLoading] = useState(false);
  const router = useRouter();

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://45.117.153.186/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // setIsFormLoading(true);

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      setIsFormLoading(false);
      return;
    }

    const data = {
      name,
      email,
      password,
    };
    console.log(data);

    // try {
    //   const response = await fetch(`${API_BASE_URL}/users/register`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ name, email, password }),
    //   });

    //   const data = await response.json();

    //   if (response.ok) {
    //     toast.success("Signup successfull! ");
    //   } else {
    //     setError(data.message || "Failed to create an account.");
    //     toast.error(data.message || "Failed to create an account.");
    //   }
    // } catch (err) {
    //   const errorMessage = "An error occurred. Please try again.";
    //   setError(errorMessage);
    //   toast.error(errorMessage);
    //   console.error("Signup error:", err);
    // } finally {
    //   setIsFormLoading(false);
    // }
  };

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  const isLoading = isFormLoading;

  return (
    <>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/vendor-signup-bg.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/60" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-6xl">
            {/* Mobile-first responsive grid */}
            <div className="backdrop-blur-sm shadow-2xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
                {/* Welcome Section - Hidden on mobile, visible on large screens */}
                <div className="hidden md:flex flex-col justify-center items-center text-center p-8 xl:p-12 bg-transparent text-white">
                  <div className="space-y-4 max-w-md nunito-text">
                    <div className="space-y-4">
                      <h1 className="md:text-3xl xl:text-4xl nunito-text font-bold leading-tight">
                        Join Our Community
                      </h1>
                      <p className="text-sm md:text-lg text-slate-300 leading-relaxed">
                        Create your account and start your journey with us today
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Section */}
                <div className="p-6 flex flex-col justify-center bg-white/95 nunito-text">
                  {/* Mobile header - only visible on small screens */}
                  <div className="md:hidden text-center ">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      Create Account
                    </h1>
                    <p className="text-gray-600">Join our community today</p>
                  </div>

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

                    <h3 className="text-3xl font-semibold text-primary">
                      Sign Up{" "}
                    </h3>
                    {/* Signup Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-primary font-medium"
                        >
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          disabled={isLoading}
                          className="h-12 text-base rounded-none lg:focus:ring-0 lg:focus:border-blue-500 border-gray-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="text-primary font-medium"
                        >
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={isLoading}
                          className="h-12 text-base rounded-none lg:focus:ring-0 lg:focus:border-blue-500 border-gray-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="password"
                          className="text-primary font-medium"
                        >
                          Password
                        </Label>
                        <PasswordField
                          className="h-12 text-base rounded-none pr-12 lg:focus:ring-0 lg:focus:border-blue-500 border-gray-300"
                          show={showPassword}
                          setShow={setShowPassword}
                          field={{
                            value: password,
                            onChange: setPassword,
                          }}
                          placeholder="Enter your password"
                          showGenerator={true}
                          showStrengthMeter={true}
                          onPasswordGenerated={(newPassword) => {
                            setPassword(newPassword);
                            toast.success("Strong password generated!");
                          }}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 bg-primary rounded-none cursor-pointer hover:bg-primary/90 text-white text-base font-medium"
                        disabled={isLoading}
                      >
                        {isFormLoading ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </form>

                    {/* Login Redirect */}
                    <div className="text-center pt-4">
                      <span className="text-gray-600 text-base">
                        Already have an account?{" "}
                      </span>
                      <Button
                        variant="link"
                        onClick={handleLoginRedirect}
                        className="p-0 h-auto font-semibold text-primary hover:text-primary/90 text-base cursor-pointer"
                        disabled={isLoading}
                      >
                        Sign In
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
