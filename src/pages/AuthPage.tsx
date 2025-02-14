"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { validatePhone } from "@/utils/utils";
import ApiService from "@/utils/ApiService";
import { API } from "@/utils/Api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
  Email: z.string().email("Please enter a valid email address"),
  Password: z.string().min(8, "Password must be at least 8 characters"),
});

const signupSchema = z.object({
  FirstName: z.string().min(2, "Name must be at least 2 characters"),
  MiddleName: z.string().min(2, "Name must be at least 2 characters"),
  LastName: z.string().min(2, "Name must be at least 2 characters"),
  Email: z.string().email("Please enter a valid email address"),
  Password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  PhoneNo: z
    .string()
    .regex(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number")
    .optional(),
  OTP: z
    .string()
    .regex(/^[0-9]{6}$/, "Please enter a valid 6-digit OTP")
    .optional(),
});

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [OTPLogin, setOTPLogin] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(isSignup ? signupSchema : loginSchema),
    defaultValues: {
      FirstName: "",
      MiddleName: "",
      LastName: "",
      Email: "",
      Password: "",
      PhoneNo: "",
      OTP: "",
    },
  });

  const handleSendOTP = async () => {
    const phone = form.getValues("PhoneNo");
    if (!validatePhone(phone)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }
    // try {
    //   const response = await ApiService.post(API.auth.sendOTP, { phone });
    //   if (response.status === 200) {
    setShowOTP(true);
    //   }
    // } catch (error) {
    //   console.error("Error sending OTP:", error);
    // }
  };

  const handleVerifyOTP = async () => {
    const otp = form.getValues("OTP");
    if (!otp || otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }
    try {
      const response = await ApiService.post(API.auth.verifyOTP, { otp });
      if (response.status === 200) {
        setPhoneVerified(true);
        setShowOTP(false);
      } else {
        alert("Invalid OTP, please try again.");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  const handleSubmit = async (data: z.infer<typeof loginSchema> | z.infer<typeof signupSchema>) => {
    try {
      const response = await ApiService.post(isSignup ? API.auth.register : API.auth.login, data);
      if (response.status === 200) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const response = await ApiService.post(API.auth.forgotPassword);
      if (response.status === 200) {
        console.log(response.data);
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      // alert("An error occurred while processing your request");
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100 overflow-y-hidden">
      {/* Brand Logo */}
      <div className="absolute top-4 left-4 flex items-end">
        <img src="/logo.svg" alt="Brand Logo" className="h-10" />
        <span className="text-l ml-1 font-bold">Admin Panel</span>
      </div>
      <div className="w-full h-screen flex bg-white shadow-lg rounded-lg">
        {/* Left Side */}
        <div className="w-1/2 px-20 flex flex-col justify-center overflow-y-auto hide-scrollbar">
          <h2 className="text-2xl font-bold mb-6">
            {isSignup ? "Create an account" : "Welcome back"}
          </h2>
          <p className="text-gray-600 mb-6">Please enter your details</p>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {isSignup && (
              <div className="mb-4">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  className="mt-1 w-full"
                  {...form.register("FirstName")}
                />
                {form.formState.errors.FirstName && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.FirstName.message}
                  </p>
                )}
              </div>
            )}
            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="mt-1 w-full"
                {...form.register("Email")}
              />
              {form.formState.errors.Email && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.Email.message}</p>
              )}
            </div>
            <div className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="mt-1 w-full"
                {...form.register("Password")}
              />
              {form.formState.errors.Password && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.Password.message}
                </p>
              )}
            </div>
            {isSignup && (
              <div className="mb-4">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                  <Input
                    disabled={phoneVerified}
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    className="mt-1 w-full"
                    {...form.register("PhoneNo")}
                  />
                  <Button
                    type="button"
                    disabled={showOTP || phoneVerified}
                    variant="outline"
                    className="mt-1"
                    onClick={handleSendOTP}
                  >
                    {phoneVerified ? "Verified" : "Send OTP"}
                  </Button>
                </div>
                {form.formState.errors.PhoneNo && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.PhoneNo.message}
                  </p>
                )}
              </div>
            )}
            {showOTP && (
              <div className="mb-4">
                <Label htmlFor="otp">OTP</Label>
                <div className="flex gap-2">
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    className="mt-1 w-full"
                    {...form.register("OTP")}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-1"
                    onClick={handleVerifyOTP}
                  >
                    Verify OTP
                  </Button>
                </div>
                {form.formState.errors.OTP && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.OTP.message}</p>
                )}
              </div>
            )}
            <div className="flex justify-end items-center mb-4">
              {!isSignup && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-purple-600 hover:underline"
                >
                  forgot password?
                </button>
              )}
            </div>

            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
              {isSignup ? "Sign up" : "Sign in"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button variant="outline" className="w-full flex items-center justify-center">
              <FcGoogle className="mr-2 text-lg" />{" "}
              {isSignup ? "Sign up with Google" : "Sign in with Google"}
            </Button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-4">
            {isSignup ? "Already have an account? " : "Don’t have an account? "}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-purple-600 hover:underline"
            >
              {isSignup ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
        {/* Right Side */}
        <div className="w-1/2 bg-purple-100 flex items-center justify-center">
          <img src="/loginpage.png" alt="Login Illustration" className="" />
        </div>
      </div>
    </div>
  );
}
