"use client";
import { useEffect, useState } from "react";
import { getOrderById } from "@/api/bookings";
import { Calendar, Clock, BadgeIndianRupee, TagIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

export default function OrderDetails({ id }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrderById(id);
        console.log(response.data);
        setOrder(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='flex space-x-2'>
          <div className='w-4 h-4 bg-gray-300 rounded-full animate-bounce'></div>
          <div className='w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-150'></div>
          <div className='w-4 h-4 bg-gray-300 rounded-full animate-bounce delay-300'></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <p className='text-gray-500'>Order not found.</p>
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto p-8 flex flex-col md:flex-row gap-3'>
      {/* Left Section: Service Details */}
      <div className='w-full md:w-1/2'>
        <Image
          height={200}
          width={360}
          src={
            "http://localhost:5000" + order.service?.image || "/placeholder.jpg"
          }
          alt={order.service?.name || "Service Image"}
          // className='w-full  object-cover rounded-lg'
        />
        <h2 className='text-xl font-semibold mt-4'>
          {order.service?.name || "Service Name"}
        </h2>

        {/* Ratings */}
        <div className='flex items-center space-x-2 mt-2'>
          <span className='text-yellow-500 text-lg'>★★★★☆</span>
          <span className='text-gray-500 text-sm'>(1 review)</span>
        </div>
      </div>

      {/* Right Section: Order Details */}
      <div className='w-full md:w-1/2 space-y-4'>
        <h3 className='text-2xl font-semibold'>Order Details</h3>

        {/* Provider Info */}
        <div className='flex items-center space-x-3'>
          <span className='text-gray-600'>Provider:</span>
          <Avatar>
            <AvatarImage
              src={
                "http://localhost:5000" + order.provider?.profilePicture ||
                "/placeholder-avatar.jpg"
              }
              alt='Provider'
            />
            <AvatarFallback>
              {order.provider?.username?.[0] || "P"}
            </AvatarFallback>
          </Avatar>
          <span className='font-medium'>
            {order.provider?.username || "Unknown Provider"}
          </span>
        </div>

        {/* Price */}
        <div className='flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg text-gray-700'>
          <TagIcon size={16} />
          <span className='font-semibold'>
            Price: Rs. {order.service?.price || "N/A"}
          </span>
        </div>

        {/* Scheduled Arrival Time */}
        <div className='bg-gray-100 p-4 rounded-lg'>
          <div className='flex items-center space-x-2 text-gray-700 font-medium'>
            <Clock size={16} />
            <span>Scheduled Arrival Time</span>
          </div>
          <div className='flex items-center space-x-2 mt-1 text-gray-600'>
            <Calendar size={16} />
            <span>
              {new Date(order.date).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <div className='flex items-center space-x-2 text-gray-600 mt-1'>
            <Clock size={16} />
            <span>{order.time || "No Time"}</span>
          </div>
        </div>

        {/* Chat Button */}
        <Button className='w-full bg-blue-600 text-white hover:bg-blue-700'>
          <Link href={`/my/orders`}>Back To Orders</Link>
        </Button>
      </div>
    </div>
  );
}
