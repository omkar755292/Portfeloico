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
import { useAppDispatch, useAppSelector } from "@/hooks/providers";
import { userLogin, userRegister, authSelector, verifyToken } from "@/store/slices/authSlice";
import Error from "@/components/custom/Error";

const loginSchema = z.object({
  Email: z.string().email("Please enter a valid email address"),
  Password: z.string().min(8, "Password must be at least 8 characters"),
});

const signupSchema = z.object({
  FirstName: z.string().min(2, "First name must be at least 2 characters"),
  // MiddleName: z.string().min(2, "Middle name must be at least 2 characters"),
  LastName: z.string().min(2, "Last name must be at least 2 characters"),
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
  const { isLoading, error } = useAppSelector(authSelector);
  const dispatch = useAppDispatch();
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
      setPhoneVerified(true);
      setShowOTP(false);
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  const handleSubmit = async (data: z.infer<typeof loginSchema> | z.infer<typeof signupSchema>) => {
    try {
      if (isSignup) {
        const response = await dispatch(userRegister(data)).unwrap();
        if (response.status === 201) {
          await dispatch(verifyToken()).unwrap();
        }
      } else {
        const response = await dispatch(userLogin(data)).unwrap();
        if (response.status === 200) {
          router.push("/");
        }
      }
    } catch (error: any) {
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
      <div className="w-full h-screen flex bg-white shadow-lg rounded-lg">
        {/* Left Side */}
        <div className="w-1/2 bg-white flex items-center justify-center">
          <img
            src="/p1.jpg"
            alt="Login Illustration"
            className="img-fluid object-cover w-full h-full"
          />
        </div>
        {/* Right Side */}
        <div className="w-1/2 px-20 flex flex-col justify-center overflow-y-auto hide-scrollbar">
          {error && <Error message={error} />}
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
            {isSignup && (
              <div className="mb-4">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  className="mt-1 w-full"
                  {...form.register("LastName")}
                />
                {form.formState.errors.LastName && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.LastName.message}
                  </p>
                )}
              </div>
            )}
            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                disabled={isLoading}
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
                disabled={isLoading}
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
                    className="mt-1 text-sm text-gray-600"
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
                    className="mt-1 text-sm"
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
                  className="text-sm underline text-blue-600 hover:text-blue-800"
                >
                  forgot password?
                </button>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-primary">
              {isLoading ? "Loading..." : isSignup ? "Sign up" : "Sign in"}
            </Button>
          </form>
          <div className="mt-4 text-center text-gray-600">
            <Button
              variant="outline"
              disabled={isLoading}
              className="w-full items-center justify-center"
            >
              <FcGoogle className="mr-2" />{" "}
              {isSignup ? "Sign up with Google" : "Sign in with Google"}
            </Button>
          </div>

          <p className="text-center text-sm mt-4">
            {isSignup ? "Already have an account? " : "Don’t have an account? "}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {isSignup ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
