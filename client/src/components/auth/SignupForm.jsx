"use client";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import api from "@/api/api";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const passwordSchema = z
  .string()
  .min(8, "At least 8 characters")
  .regex(/[A-Z]/, "At least one uppercase letter")
  .regex(/\d/, "At least one number")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "At least one special character");

export default function SignupForm() {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Evaluate password strength and requirements
  const handlePasswordChange = (value) => {
    setPassword(value);

    const newRequirements = {
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      number: /\d/.test(value),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    };

    setRequirements(newRequirements);

    // Password strength logic
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

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await api.post("/auth/signup", {
        username,
        phone,
        password,
      });
      if (response.data.success) {
        toast.success("Account created successfully", {
          position: "top-right",
          duration: 2500,
        });
        router.push(`/auth/otp?phone=${encodeURIComponent(phone)}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='mt-10'>
      <h1 className='text-5xl uppercase font-semibold'>Create your account</h1>
      <p className='mt-5 text-lg'>
        Already have an account?{" "}
        <Link href='/auth/login' className='underline text-primary-default'>
          Login
        </Link>
      </p>
      <div className='mt-24'>
        <form className='space-y-6 pr-6' onSubmit={handleSignupSubmit}>
          <div className='flex flex-col gap-2'>
            <label htmlFor='username'>Username</label>
            <input
              className='bg-[#f4f4f4] border border-black px-6 py-3 rounded-md'
              type='text'
              id='username'
              name='username'
              placeholder='Enter your username'
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='phone'>Phone Number</label>
            <input
              className='bg-[#f4f4f4] border border-black px-6 py-3 rounded-md'
              type='text'
              id='phone'
              name='phone'
              placeholder='Enter your phone number'
              onChange={(e) => setPhone(e.target.value)}
              value={phone}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='password'>Password</label>
            <input
              className='bg-[#f4f4f4] border border-black px-6 py-3 rounded-md'
              type='password'
              id='password'
              name='password'
              placeholder='********'
              onChange={(e) => handlePasswordChange(e.target.value)}
              value={password}
            />
            <div className='mt-2'>
              <p
                className={`text-sm ${
                  passwordStrength === "Weak"
                    ? "text-red-500"
                    : passwordStrength === "Moderate"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                {passwordStrength
                  ? `Password Strength: ${passwordStrength}`
                  : ""}
              </p>
              <ul className='mt-2 space-y-1 text-sm'>
                <li className='flex items-center gap-2'>
                  <span
                    className={`$ {
                      requirements.length ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {requirements.length ? "✔" : "✘"}
                  </span>
                  At least 8 characters
                </li>
                <li className='flex items-center gap-2'>
                  <span
                    className={`$ {
                      requirements.uppercase ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {requirements.uppercase ? "✔" : "✘"}
                  </span>
                  At least one uppercase letter
                </li>
                <li className='flex items-center gap-2'>
                  <span
                    className={`$ {
                      requirements.number ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {requirements.number ? "✔" : "✘"}
                  </span>
                  At least one number
                </li>
                <li className='flex items-center gap-2'>
                  <span
                    className={`$ {
                      requirements.specialChar ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {requirements.specialChar ? "✔" : "✘"}
                  </span>
                  At least one special character
                </li>
              </ul>
            </div>
          </div>
          <button
            type='submit'
            className={`mt-3 ${
              !isSubmitting ? "bg-primary-default" : "bg-primary-100"
            } px-8 py-2 text-xl font-medium text-white rounded-md flex gap-2 items-center`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <LoaderCircle size='16' className='animate-spin' />
            ) : null}
            {isSubmitting ? "Creating user..." : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
