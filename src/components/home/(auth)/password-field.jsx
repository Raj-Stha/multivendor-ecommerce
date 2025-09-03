"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function PasswordField({
  show,
  setShow,
  field,
  placeholder = "Enter password...",
  showGenerator = false,
  onPasswordGenerated,
  showStrengthMeter = false,
  className = "",
}) {
  const [strength, setStrength] = useState(0);
  const [strengthText, setStrengthText] = useState("");
  const [strengthColor, setStrengthColor] = useState("bg-gray-200");

  // Check password strength
  useEffect(() => {
    if (!field.value) {
      setStrength(0);
      setStrengthText("");
      setStrengthColor("bg-gray-200");
      return;
    }

    // Calculate password strength
    let score = 0;
    const password = field.value;

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Character variety checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Set strength based on score
    if (score <= 2) {
      setStrength(25);
      setStrengthText("Weak");
      setStrengthColor("bg-red-500");
    } else if (score <= 4) {
      setStrength(50);
      setStrengthText("Medium");
      setStrengthColor("bg-yellow-500");
    } else if (score <= 5) {
      setStrength(75);
      setStrengthText("Strong");
      setStrengthColor("bg-green-500");
    } else {
      setStrength(100);
      setStrengthText("Very Strong");
      setStrengthColor("bg-green-600");
    }
  }, [field.value]);

  // Generate a strong password
  const generatePassword = () => {
    const length = 16;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?";
    let password = "";

    // Ensure at least one of each character type
    password += getRandomChar("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    password += getRandomChar("abcdefghijklmnopqrstuvwxyz");
    password += getRandomChar("0123456789");
    password += getRandomChar("!@#$%^&*()_-+=<>?");

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    // Shuffle the password
    password = password
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("");

    // Update the field value
    field.onChange(password);

    if (onPasswordGenerated) {
      onPasswordGenerated(password);
    }
  };

  const getRandomChar = (charset) => {
    return charset.charAt(Math.floor(Math.random() * charset.length));
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={field.value}
          onChange={(e) => field.onChange(e.target.value)}
          className={`border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-20 ${className}`}
        />
        <div className="absolute right-0 top-0 h-full flex">
          {showGenerator && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-full px-2 hover:bg-transparent"
                    onClick={generatePassword}
                  >
                    <RefreshCw size={16} className="text-gray-500" />
                    <span className="sr-only">Generate password</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Generate strong password</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-full px-3 hover:bg-transparent"
            onClick={() => setShow(!show)}
          >
            {show ? (
              <EyeOff size={16} className="text-gray-500" />
            ) : (
              <Eye size={16} className="text-gray-500" />
            )}
            <span className="sr-only">Toggle password visibility</span>
          </Button>
        </div>
      </div>

      {showStrengthMeter && field.value && (
        <div className="space-y-1">
          <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${strengthColor} transition-all duration-300`}
              style={{ width: `${strength}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Password strength:</span>
            <span
              className={`font-medium ${
                strength <= 25
                  ? "text-red-500"
                  : strength <= 50
                  ? "text-yellow-500"
                  : "text-green-600"
              }`}
            >
              {strengthText}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
