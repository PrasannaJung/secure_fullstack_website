"use client";
import React, { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoaderCircle } from "lucide-react";

const ChangePasswordForm = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

  const handlePasswordChange = (value) => {
    setNewPassword(value);

    const newRequirements = {
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      number: /\d/.test(value),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    };

    setRequirements(newRequirements);

    const fulfilledCount =
      Object.values(newRequirements).filter(Boolean).length;

    if (fulfilledCount === 0) {
      setPasswordStrength("");
    } else if (fulfilledCount <= 2) {
      setPasswordStrength("Weak");
    } else if (fulfilledCount === 3) {
      setPasswordStrength("Moderate");
    } else if (fulfilledCount === 4) {
      setPasswordStrength("Strong");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      setIsSubmitting(false);
      return;
    }

    if (newPassword === "Prasanna10") {
      setMessage({
        type: "error",
        text: "This was one of your recent passwords",
      });
    } else if (newPassword === "PrasannaThapa10") {
      setMessage({ type: "success", text: "Password changed successfully" });
    }

    setIsSubmitting(false);
  };

  return (
    <main className='h-screen flex items-center'>
      <div className='w-full max-w-5xl mx-auto p-6 '>
        <h1 className='text-2xl font-bold mb-6'>Change Password</h1>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <label htmlFor='oldPassword' className='block text-sm font-medium'>
              Current Password
            </label>
            <input
              type='password'
              id='oldPassword'
              className='w-full p-2 border rounded-md'
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className='space-y-2'>
            <label htmlFor='newPassword' className='block text-sm font-medium'>
              New Password
            </label>
            <input
              type='password'
              id='newPassword'
              className='w-full p-2 border rounded-md'
              value={newPassword}
              onChange={(e) => handlePasswordChange(e.target.value)}
              required
            />
            {passwordStrength && (
              <p
                className={`text-sm ${
                  passwordStrength === "Weak"
                    ? "text-red-500"
                    : passwordStrength === "Moderate"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                Password Strength: {passwordStrength}
              </p>
            )}
            <ul className='mt-2 space-y-1 text-sm'>
              {Object.entries(requirements).map(([key, met]) => (
                <li key={key} className='flex items-center gap-2'>
                  <span className={met ? "text-green-500" : "text-red-500"}>
                    {met ? "✔" : "✘"}
                  </span>
                  {key === "length" && "At least 8 characters"}
                  {key === "uppercase" && "At least one uppercase letter"}
                  {key === "number" && "At least one number"}
                  {key === "specialChar" && "At least one special character"}
                </li>
              ))}
            </ul>
          </div>
          <div className='space-y-2'>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium'
            >
              Confirm New Password
            </label>
            <input
              type='password'
              id='confirmPassword'
              className='w-full p-2 border rounded-md'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {message.text && (
            <Alert
              className={`${
                message.type === "error"
                  ? "bg-red-100 border-red-400"
                  : "bg-green-100 border-green-400"
              }`}
            >
              <AlertDescription
                className={`${
                  message.type === "error" ? "text-red-800" : "text-green-800"
                }`}
              >
                {message.text}
              </AlertDescription>
            </Alert>
          )}
          <button
            type='submit'
            className='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2'
            disabled={isSubmitting}
          >
            {isSubmitting && <LoaderCircle className='animate-spin h-4 w-4' />}
            {isSubmitting ? "Changing Password..." : "Change Password"}
          </button>
        </form>
      </div>
    </main>
  );
};

export default ChangePasswordForm;
