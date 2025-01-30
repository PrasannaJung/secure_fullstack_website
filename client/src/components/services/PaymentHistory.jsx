"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, Calendar, Clock, CreditCard, Receipt } from "lucide-react";
import Image from "next/image";
import useAuth from "@/hooks/useAuth";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuth();

  const getPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/v1/payments/all",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const result = await response.json();
      if (result.success) {
        setPayments(result.data);
      } else {
        setPayments([]);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPayments();
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

  return (
    <div className='flex h-screen'>
      {/* Sidebar */}
      <div className='w-64 bg-gray-100 p-6'>
        <ul className='space-y-4'>
          <li>
            <Link href='/profile' className='text-gray-600 hover:text-black'>
              Profile
            </Link>
          </li>
          <li>
            <Link href='/my/orders' className='text-gray-600 hover:text-black'>
              Orders
            </Link>
          </li>
          <li>
            <Link href='/my/payments' className='font-semibold text-black'>
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

      {/* Payments Section */}
      <div className='flex-1 p-8 max-w-5xl mx-auto'>
        <h2 className='text-lg font-semibold mb-6'>Payment History</h2>

        <div className='space-y-4'>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <div
                key={payment._id}
                className='bg-white rounded-lg shadow-md p-6 space-y-4'
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-4'>
                    <Image
                      height={64}
                      width={64}
                      src={
                        "http://localhost:5000" + payment.order.service.image ||
                        "/placeholder.jpg"
                      }
                      alt={payment.order.service.name}
                      className='w-16 h-16 rounded-lg object-cover'
                    />
                    <div className='space-y-1'>
                      <h3 className='text-lg font-semibold'>
                        {payment.order.service.name}
                      </h3>
                      <div className='flex items-center space-x-4 text-sm text-gray-600'>
                        <div className='flex items-center'>
                          <Calendar size={16} className='mr-1' />
                          <span>
                            {new Date(payment.order.date).toLocaleDateString(
                              "en-US",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                        <div className='flex items-center'>
                          <Clock size={16} className='mr-1' />
                          <span>{payment.order.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='flex items-center space-x-2 text-green-600 font-semibold'>
                      <Receipt size={20} />
                      <span>Rs. {payment.amount}</span>
                    </div>
                    <div className='flex items-center space-x-2 text-gray-500 mt-2'>
                      <CreditCard size={16} />
                      <span className='text-sm'>Payment ID: {payment._id}</span>
                    </div>
                  </div>
                </div>
                <div className='pt-4 border-t border-gray-200'>
                  <p className='text-sm text-gray-600'>
                    Service Location: {payment.order.address}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className='text-center py-8'>
              <p className='text-gray-500'>No payment history found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
