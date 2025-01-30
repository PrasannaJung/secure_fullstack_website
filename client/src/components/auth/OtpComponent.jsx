"use client";
import { resendOtp, verifyOtp } from "@/api/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useRef } from "react";
import toast from "react-hot-toast";

const OTPInput = ({ length = 6 }) => {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const inputs = useRef([]);
  const router = useRouter();

  const handleChange = (e, index) => {
    const { value } = e.target;

    // Only allow single digit input
    if (value.match(/^\d$/) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to the next input if valid digit is entered
      if (value && index < length - 1) {
        inputs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "") {
      // Move focus to previous input on backspace if current input is empty
      if (index > 0) {
        inputs.current[index - 1].focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    try {
      const phone = new URLSearchParams(window.location.search).get("phone");

      if (!phone) {
        toast.error("Phone number missing");
        return;
      }

      const response = await verifyOtp(phone, otpString);

      console.log(response);

      if (response.success) {
        toast.success("User verified successfully");
        router.push("/auth/login");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      console.error(error);
      toast.error("Verification failed");
    }
  };

  const getOtpAgain = async () => {
    try {
      const phone = new URLSearchParams(window.location.search).get("phone");

      if (!phone) {
        toast.error("Phone number missing");
        return;
      }

      const otpPromise = resendOtp(phone);

      toast.promise(otpPromise, {
        loading: "Sending OTP...",
        success: (response) => {
          if (response.success) {
            return "OTP resent successfully";
          }
          throw new Error("Could not send OTP");
        },
        error: "Failed to resend OTP",
      });
    } catch (error) {
      console.error(error);
      toast.error("Some error occurred. Please try later");
    }
  };

  return (
    <div className='shadow-lg rounded-md px-16 py-6'>
      <p className='text-3xl font-semibold text-center my-8'>
        {" "}
        Enter your OTP{" "}
      </p>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col space-y-4 items-center'
      >
        <div className='space-x-2'>
          {otp.map((value, index) => (
            <input
              key={index}
              type='text'
              maxLength='1'
              value={value}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputs.current[index] = el)}
              className='w-12 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          ))}
        </div>
        <button
          type='submit'
          className='bg-primary-default text-white font-medium py-3 px-4 rounded-md text-lg'
        >
          Submit
        </button>
      </form>
      <div className='flex justify-between mt-6'>
        <button
          className='underline text-primary-300'
          type='button'
          onClick={getOtpAgain}
        >
          Resend OTP
        </button>
        <Link href={"/auth/login"} className='underline text-primary-300'>
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default OTPInput;
