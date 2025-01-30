"use client";
import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      // Simulate API call

      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulated success response
      setStatus({
        loading: false,
        success: true,
        error: null,
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Reset success message after 3 seconds
      setTimeout(() => {
        setStatus((prev) => ({ ...prev, success: false }));
      }, 3000);
    } catch (error) {
      setStatus({
        loading: false,
        success: false,
        error: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className='min-h-screen bg-secondary-100'>
      {/* Hero Section */}
      <div className='bg-primary-dark text-white py-20'>
        <div className='max-w-7xl mx-auto px-4 text-center'>
          <h1 className='text-4xl font-bold mb-4'>Contact Us</h1>
          <p className='text-gray-300 max-w-2xl mx-auto text-lg'>
            Have questions? We'd love to hear from you. Send us a message and
            we'll respond as soon as possible.
          </p>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-16'>
        <div className='grid lg:grid-cols-2 gap-16'>
          {/* Contact Information */}
          <div className='space-y-8'>
            <div>
              <h2 className='text-2xl font-semibold text-primary-dark mb-6'>
                Get in Touch
              </h2>
              <p className='text-secondary-500 mb-8'>
                Feel free to reach out to us using any of the following methods
                or fill out the contact form.
              </p>
            </div>

            <div className='space-y-6'>
              <div className='flex items-start space-x-4'>
                <div className='bg-primary-100 p-3 rounded-lg'>
                  <MapPin className='w-6 h-6 text-primary-500' />
                </div>
                <div>
                  <h3 className='font-medium text-primary-dark mb-1'>
                    Our Location
                  </h3>
                  <p className='text-secondary-500'>
                    Mahakavi Marga, Gyanshwor
                  </p>
                </div>
              </div>

              <div className='flex items-start space-x-4'>
                <div className='bg-primary-100 p-3 rounded-lg'>
                  <Phone className='w-6 h-6 text-primary-500' />
                </div>
                <div>
                  <h3 className='font-medium text-primary-dark mb-1'>
                    Phone Number
                  </h3>
                  <p className='text-secondary-500'>+977 9841362344</p>
                </div>
              </div>

              <div className='flex items-start space-x-4'>
                <div className='bg-primary-100 p-3 rounded-lg'>
                  <Mail className='w-6 h-6 text-primary-500' />
                </div>
                <div>
                  <h3 className='font-medium text-primary-dark mb-1'>
                    Email Address
                  </h3>
                  <p className='text-secondary-500'>prasannajung08@gmail.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className='bg-white rounded-lg p-8 shadow-lg'>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-secondary-600 mb-2'
                >
                  Your Name
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className='w-full px-4 py-3 rounded-lg border border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-300'
                  placeholder='Prasanna Jung Thapa'
                />
              </div>

              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-secondary-600 mb-2'
                >
                  Email Address
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className='w-full px-4 py-3 rounded-lg border border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-300'
                  placeholder='prasanna@example.com'
                />
              </div>

              <div>
                <label
                  htmlFor='subject'
                  className='block text-sm font-medium text-secondary-600 mb-2'
                >
                  Subject
                </label>
                <input
                  type='text'
                  id='subject'
                  name='subject'
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className='w-full px-4 py-3 rounded-lg border border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-300'
                  placeholder='How can we help?'
                />
              </div>

              <div>
                <label
                  htmlFor='message'
                  className='block text-sm font-medium text-secondary-600 mb-2'
                >
                  Message
                </label>
                <textarea
                  id='message'
                  name='message'
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className='w-full px-4 py-3 rounded-lg border border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-300 resize-none'
                  placeholder='Your message...'
                />
              </div>

              <button
                type='submit'
                disabled={status.loading}
                className='w-full bg-primary-default text-white py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center space-x-2'
              >
                {status.loading ? (
                  <>
                    <Loader2 className='w-5 h-5 animate-spin' />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className='w-5 h-5' />
                    <span>Send Message</span>
                  </>
                )}
              </button>

              {status.success && (
                <p className='text-green-600 text-center'>
                  Message sent successfully!
                </p>
              )}

              {status.error && (
                <p className='text-red-600 text-center'>{status.error}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
