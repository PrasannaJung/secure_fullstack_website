"use client";
import api from "@/api/api";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function LoginForm() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!phone || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await login(phone, password);

      if (success) {
        toast.success("Login successful!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className='mt-10'>
      <h1 className='text-5xl uppercase font-semibold'>
        Login to your account
      </h1>
      <p className='mt-5 text-lg'>
        Do not have an account?{" "}
        <Link href='/auth/signup' className='underline text-[#557aff]'>
          Sign up
        </Link>
      </p>
      <div className='mt-24'>
        <form className='space-y-6 pr-6' onSubmit={handleLoginSubmit}>
          <div className='flex flex-col gap-2'>
            <label htmlFor='phone'>Phone Number</label>
            <input
              onChange={(e) => setPhone(e.target.value)}
              className='bg-[#f4f4f4] border border-black border-1  px-6 py-3 rounded-md'
              type='text'
              id='phone'
              name='phone'
              placeholder='Enter your phone number'
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label htmlFor='password'>Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              className='bg-[#f4f4f4] border border-black border-1 px-6 py-3 rounded-md'
              type='password'
              id='password'
              name='password'
              placeholder='********'
            />
          </div>
          <button
            type='submit'
            disabled={isSubmitting}
            className={`mt-3 bg-[#557aff] px-8 py-2 text-xl font-medium text-white rounded-md ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
      <div className='mt-5'>
        <Link href='/forgot-password' className='underline mt-5'>
          Forgot password?
        </Link>
      </div>
    </div>
  );
}
