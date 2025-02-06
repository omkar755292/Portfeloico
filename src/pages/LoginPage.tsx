"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { validatePhone } from "@/utils/utils";

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const handleSendOTP = () => {
    if (validatePhone(phone)) {
      setShowOTP(true);
    } else {
      alert("Please enter a valid 10-digit phone number");
    }
  };

  const handleVerifyOTP = () => {
    if (otp.length === 6) {
      setPhoneVerified(true);
      setShowOTP(false);
    } else {
      alert("Please enter a valid 6-digit OTP");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    login(email, password);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      {/* Brand Logo */}
      <div className="absolute top-4 left-4 flex items-end">
        <img src="/logo.svg" alt="Brand Logo" className="h-10" />
        <span className="text-l ml-1 font-bold">Admin Panel</span>
      </div>
      <div className="w-full h-screen flex bg-white shadow-lg rounded-lg">
        {/* Left Side */}
        <div className="w-1/2 p-20 flex flex-col justify-center overflow-y-auto hide-scrollbar">
          <h2 className="text-2xl font-bold mb-6">
            {isSignup ? "Create an account" : "Welcome back"}
          </h2>
          <p className="text-gray-600 mb-6">Please enter your details</p>
          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div className="mb-4">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="mt-1 w-full"
                />
              </div>
            )}
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Button
                    type="button"
                    disabled={showOTP || phoneVerified}
                    variant="outline"
                    className="mt-1"
                    onClick={handleSendOTP}
                  >
                    {phoneVerified ? "Verified" : "Verify"}
                  </Button>
                </div>
              </div>
            )}
            {showOTP && (
              <div className="mb-4">
                <Label htmlFor="otp">Enter OTP</Label>
                <div className="flex gap-2">
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    className="mt-1 w-full"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
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
                {phoneVerified && (
                  <p className="text-sm text-green-600 mt-1">Phone number verified successfully!</p>
                )}
              </div>
            )}
            <div className="mb-4">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="mt-1 w-full"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder={isSignup ? "Create a password" : "Enter your password"}
                className="mt-1 w-full"
              />
            </div>
            {isSignup && (
              <div className="mb-4">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  className="mt-1 w-full"
                />
              </div>
            )}
            <div className="flex justify-end items-center mb-4">
              {!isSignup && (
                <a href="#" className="text-sm text-purple-600 hover:underline">
                  Forgot password?
                </a>
              )}
            </div>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
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
