"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Shield, AlertCircle, CheckCircle, Mail } from "lucide-react";
import { colors } from "@/config/theme";
import { useAuth } from "@/hooks/useAuth";

interface FormData {
  email: string;
  password: string;
}

interface AlertState {
  type: "success" | "error" | "info";
  message: string;
}

export default function AdminLogin(): React.ReactElement {
  const { login } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<AlertState | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string>("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setAlert(null);

    try {
      await login(formData.email, formData.password);
      setAlert({
        type: "success",
        message: "Login successful! Redirecting...",
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed. Please try again.";
      setAlert({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setAlert(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setAlert({
          type: "success",
          message: data.message || "Password reset link has been sent to your email.",
        });
        setShowForgotPassword(false);
        setForgotPasswordEmail("");
      } else {
        setAlert({
          type: "error",
          message: data.error || "Failed to send password reset email.",
        });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "An error occurred. Please try again later.",
      });
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center p-4"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, ${colors.primary} 2px, transparent 2px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            style={{
              backgroundColor: colors.primary,
            }}
          >
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1
            className="mb-2 text-3xl font-bold"
            style={{ color: colors.textPrimary }}
          >
            Admin Portal
          </h1>
          <p
            className="text-sm"
            style={{
              color: colors.gray,
            }}
          >
            Sign in to access the administration dashboard
          </p>
        </div>

        {/* Login Card */}
        <Card
          className="border-0 shadow-lg"
          style={{
            backgroundColor: colors.white,
          }}
        >
          <CardHeader className="space-y-1 pb-6">
            <CardTitle
              className="text-center text-2xl font-semibold"
              style={{
                color: colors.textPrimary,
              }}
            >
              {showForgotPassword ? "Reset Password" : "Welcome Back"}
            </CardTitle>
            <CardDescription
              className="text-center"
              style={{
                color: colors.gray,
              }}
            >
              {showForgotPassword
                ? "Enter your email to receive a password reset link"
                : "Please enter your credentials to continue"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Alert Messages */}
            {alert && (
              <Alert
                className={`mb-4 ${
                  alert.type === "error"
                    ? "border-red-200 bg-red-50"
                    : alert.type === "success"
                      ? "border-green-200 bg-green-50"
                      : "border-blue-200 bg-blue-50"
                }`}
              >
                {alert.type === "error" && (
                  <AlertCircle
                    className="h-4 w-4"
                    style={{ color: colors.red }}
                  />
                )}
                {alert.type === "success" && (
                  <CheckCircle
                    className="h-4 w-4"
                    style={{
                      color: colors.green,
                    }}
                  />
                )}
                <AlertDescription
                  style={{
                    color:
                      alert.type === "error"
                        ? colors.red
                        : alert.type === "success"
                          ? colors.green
                          : colors.primary,
                  }}
                >
                  {alert.message}
                </AlertDescription>
              </Alert>
            )}

            {showForgotPassword ? (
              /* Forgot Password Form */
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="forgot-email"
                    className="text-sm font-medium"
                    style={{
                      color: colors.textPrimary,
                    }}
                  >
                    Email Address
                  </Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="admin@example.com"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    disabled={forgotPasswordLoading}
                    className="h-12 w-full font-semibold text-white"
                    style={{
                      backgroundColor: colors.primary,
                    }}
                  >
                    {forgotPasswordLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Reset Link
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotPasswordEmail("");
                      setAlert(null);
                    }}
                    className="h-12 w-full"
                  >
                    Back to Login
                  </Button>
                </div>
              </form>
            ) : (
              /* Login Form */
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium"
                    style={{
                      color: colors.textPrimary,
                    }}
                  >
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="h-12"
                    required
                  />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium"
                    style={{
                      color: colors.textPrimary,
                    }}
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="h-12 pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm font-medium transition-colors hover:underline"
                    style={{
                      color: colors.primary,
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 w-full font-semibold text-white"
                  style={{
                    backgroundColor: colors.primary,
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p
            className="text-xs"
            style={{
              color: colors.gray,
            }}
          >
            © 2025 Admin Portal. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
