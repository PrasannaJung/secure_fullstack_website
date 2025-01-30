"use client";
import React, { useEffect, useState } from "react";
import { Clock, Tag, Phone, MapPin, CalendarDays, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { getServiceById } from "@/api/services";
import { createBooking } from "@/api/bookings";
import toast from "react-hot-toast";

const BookServiceComponent = ({ id }) => {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const getTodayDate = () => new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await getServiceById(id);
        setService(response.data.service);
      } catch (error) {
        console.error("Error fetching service:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleBooking = async () => {
    try {
      const bookingPromise = createBooking({
        service: service._id,
        date,
        time,
        address: location,
        provider: service.provider._id,
      });

      toast.promise(bookingPromise, {
        loading: "Booking Service...",
        success: (response) => {
          if (response.success) {
            return "Service booked successfully";
          }
          return response.message;
        },
        error: (error) => {
          return error.response.data.message;
        },
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading || !service) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <div className='grid md:grid-cols-2 gap-8 mb-12'>
        {/* Left Side: Service Details */}
        <div className='space-y-6'>
          <Card className='p-6'>
            <div className='relative h-64 rounded-lg overflow-hidden'>
              <Image
                src={"http://localhost:5000/" + service.image}
                alt='Service Image'
                fill
                style={{ objectFit: "cover" }}
                className='rounded-lg'
              />
            </div>
            <h1 className='text-3xl font-semibold mt-6'>{service.name}</h1>
            <div className='flex items-center gap-3 mt-4'>
              <Clock className='w-5 h-5 text-gray-600' />
              <div>
                <p className='text-sm text-gray-500'>Expected Arrival Time</p>
                <p className='font-medium'>{service.arrivalTime}</p>
              </div>
            </div>
            <div className='flex items-center gap-3 mt-4'>
              <Tag className='w-5 h-5 text-gray-600' />
              <div>
                <p className='text-sm text-gray-500'>Provider</p>
                <p className='font-medium'>{service.provider.username}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Side: Booking Form */}
        <Card className='p-6'>
          <h2 className='text-2xl font-semibold mb-6'>Book Service</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleBooking();
            }}
            className='space-y-6'
          >
            <div>
              <label
                htmlFor='date'
                className='block text-sm font-medium text-gray-700'
              >
                Select Date
              </label>
              <div className='relative mt-1'>
                <input
                  type='date'
                  id='date'
                  value={date}
                  min={getTodayDate()}
                  onChange={(e) => setDate(e.target.value)}
                  className='w-full border-gray-300 rounded-lg p-2'
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='time'
                className='block text-sm font-medium text-gray-700'
              >
                Select Time
              </label>
              <input
                type='time'
                id='time'
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className='w-full border-gray-300 rounded-lg p-2'
                required
              />
            </div>

            <div>
              <label
                htmlFor='location'
                className='block text-sm font-medium text-gray-700'
              >
                Location
              </label>
              <div className='relative mt-1'>
                <input
                  type='text'
                  id='location'
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className='w-full border-gray-300 rounded-lg p-2'
                  placeholder='Enter your location'
                  required
                />
                <MapPin className='absolute top-2 right-3 text-gray-400 w-5 h-5' />
              </div>
            </div>

            <div>
              <label
                htmlFor='phone'
                className='block text-sm font-medium text-gray-700'
              >
                Phone Number
              </label>
              <div className='relative mt-1'>
                <input
                  type='tel'
                  id='phone'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className='w-full border-gray-300 rounded-lg p-2'
                  placeholder='Enter your phone number'
                  required
                />
                <Phone className='absolute top-2 right-3 text-gray-400 w-5 h-5' />
              </div>
            </div>

            <button
              type='submit'
              className='w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2'
            >
              <Send className='w-5 h-5' />
              Book Service
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default BookServiceComponent;
