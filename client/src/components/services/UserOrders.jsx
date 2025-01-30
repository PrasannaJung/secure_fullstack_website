"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllUserBookings, cancelUserOrder } from "@/api/bookings";
import { Calendar, Clock, LogOut, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { isAxiosError } from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import useAuth from "@/hooks/useAuth";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("Pending");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const { logout } = useAuth();

  const getOrders = async () => {
    try {
      setLoading(true);
      const response = await getAllUserBookings();
      const data = await response.data;
      if (data) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    try {
      const response = await cancelUserOrder(selectedOrderId);
      if (response.success) {
        setOrders(orders.filter((order) => order._id !== selectedOrderId));
        toast.success("Order cancelled successfully");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    }
  };

  const handlePayment = async (orderId, amount) => {
    const url = `http://localhost:5000/api/v1/order/esewa/${orderId}`;
    const data = {
      paymentAmount: amount,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.payment_method === "esewa") {
          esewaCall(responseData.formData);
        }
      } else {
        toast.error("Payment initiation failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment process failed");
    }
  };

  const esewaCall = (formData) => {
    const path = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
    const form = document.createElement("form");
    form.setAttribute("method", "POST");
    form.setAttribute("action", path);

    for (const key in formData) {
      const hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", formData[key]);
      form.appendChild(hiddenField);
    }

    document.body.appendChild(form);
    form.submit();
  };

  useEffect(() => {
    getOrders();
  }, []);

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

  const filteredOrders = Array.isArray(orders)
    ? orders.filter((order) => order.status === filter)
    : [];

  return (
    <div className='flex h-screen'>
      {/* Sidebar */}
      <div className='w-64 bg-gray-100 p-6'>
        <ul className='space-y-4'>
          <li>
            <Link href='/profile' className=''>
              Profile
            </Link>
          </li>
          <li>
            <Link href='/my/orders' className='font-semibold text-black'>
              Orders
            </Link>
          </li>
          <li>
            <Link
              href='/my/payments'
              className='text-gray-600 hover:text-black'
            >
              Payment History
            </Link>
          </li>
          <li>
            <Link href='/my/reviews' className='text-gray-600 hover:text-black'>
              Reviews
            </Link>
          </li>
          <li>
            <div
              onClick={() => logout()}
              className='text-gray-600 hover:text-black flex items-center space-x-2'
            >
              <LogOut size={16} />
              <span>Logout</span>
            </div>
          </li>
        </ul>
      </div>

      {/* Orders Section */}
      <div className='flex-1 p-8 max-w-5xl mx-auto'>
        <h2 className='text-lg font-semibold mb-4'>Your Orders</h2>

        <div className='flex space-x-4 mb-6'>
          {["Pending", "Accepted"].map((status) => (
            <button
              key={status}
              className={cn(
                "px-4 py-2 text-sm rounded-full border",
                filter === status
                  ? "bg-black text-white border-black"
                  : "bg-gray-100 text-gray-600 border-gray-300",
              )}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>

        <div className='space-y-4'>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className='flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm'
              >
                <div className='flex items-center space-x-4'>
                  <Image
                    height={48}
                    width={48}
                    src={
                      "http://localhost:5000" + order.service?.image ||
                      "/placeholder.jpg"
                    }
                    alt={order.service?.name || "Service"}
                    className='w-12 h-12 rounded-full object-cover'
                  />
                  <div className='space-y-1'>
                    <h3 className='text-md font-semibold'>
                      {order.service?.name || "Unknown Service"}
                    </h3>
                    <div className='flex items-center text-primary-default'>
                      <Wallet size={16} className='mr-1' />
                      <span className='font-medium'>
                        Rs. {order.service?.price || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='flex items-center space-x-2 text-gray-500'>
                  <Calendar size={16} />
                  <span>
                    {new Date(order.date).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <Clock size={16} />
                  <span>{order.time}</span>
                </div>

                <div className='flex items-center space-x-4'>
                  <Link
                    href={`/my/orders/${order._id}`}
                    className='text-blue-600 hover:underline'
                  >
                    View Details &gt;
                  </Link>

                  {filter === "Pending" ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className='text-red-600 hover:underline'
                          onClick={() => setSelectedOrderId(order._id)}
                        >
                          Cancel
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel Order</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to cancel this order? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>No, keep it</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleConfirmCancel}
                            className='bg-red-600 hover:bg-red-700'
                          >
                            Yes, cancel order
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <Button
                      onClick={() =>
                        handlePayment(order._id, order.service?.price)
                      }
                      className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded'
                    >
                      Pay Now
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className='text-gray-500'>No orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
