"use client";
import { getAllServices } from "@/api/services";
import {
  Clock,
  DamIcon,
  HandHeartIcon,
  LeafIcon,
  Lightbulb,
  ShieldCheck,
  SofaIcon,
  Wallet,
  WrenchIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import SearchServices from "../services/SearchServices";

export default function HeroSection() {
  const [featuredServices, setFeaturedServices] = useState([]);

  // fetch it from the json file present it in the data folder in the src
  useEffect(() => {
    const fetchServices = async () => {
      const response = await getAllServices();

      const featured = response.data.services.slice(1, 4);
      setFeaturedServices(featured);
    };
    fetchServices();
  }, []);

  const SERVICE_CATEGORIES = [
    { name: "Electrical Services", icon: <Lightbulb size={72} /> },
    { name: "Plumbing & Leakage", icon: <DamIcon size={72} /> },
    { name: "Cleaning & Gardening", icon: <LeafIcon size={72} /> },
    { name: "Furnishing Services", icon: <SofaIcon size={72} /> },
    { name: "Repair & Installation", icon: <WrenchIcon size={72} /> },
  ];

  return (
    <section>
      <div className='hero-section relative'>
        <div className='absolute left-16 top-1/2 -translate-y-1/2 z-10 w-[400px]'>
          <h2 className='text-2xl font-bold text-white mb-4'>Find Services</h2>
          <SearchServices />
        </div>
        <div className='md:w-[45%] sm:px-32 px-16 ml-0 md:ml-auto md:pt-64 pt-48 space-y-8 '>
          <h1 className='text-5xl font-bold'>
            Reliable Electrical Repairs, Anytime You Need
          </h1>
          <p className='text-xl'>
            From flickering lights to faulty wiring, our expert electricians are
            here to keep your home safe and powered.
          </p>
          <div>
            <Link
              href={"/services"}
              className='bg-primary-default text-white px-4 py-2 rounded-md font-semibold'
            >
              Explore Services
            </Link>
          </div>
        </div>
      </div>

      <div className='px-8 py-24 grid grid-cols-responsive justify-items-center gap-16'>
        {/* <h3 className='text-3xl font-semibold'>Category</h3> */}

        <div className='flex items-center gap-3'>
          <Clock stroke='#557aff' size={56} />
          <div>
            <span className='text-2xl font-bold'>24/7 Support</span>
            <p>Support online 24 hours a day</p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <Wallet stroke='#557aff' size={56} />
          <div>
            <span className='text-2xl font-bold'>Money Return</span>
            <p className='text-lg'>Back guarantee under 7 days</p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <HandHeartIcon stroke='#557aff' size={56} />
          <div>
            <span className='text-2xl font-bold'>Reliable</span>
            <p className='text-lg'>Trusted by 100+ people</p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <ShieldCheck stroke='#557aff' size={56} />
          <div>
            <span className='text-2xl font-bold'>Secure Transactions</span>
            <p className='text-lg'>Your data is safe with us</p>
          </div>
        </div>
      </div>

      <div className='px-8 py-16 bg-gray-50'>
        <div className='text-center'>
          <span className='uppercase bg-blue-100 font-bold text-blue-900 px-6 py-3 rounded-lg text-lg inline-block'>
            Categories
          </span>
          <p className='text-gray-600 mt-4'>
            Choose from a wide range of expert services
          </p>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-16'>
          {SERVICE_CATEGORIES.map((category, index) => (
            <div
              className='group shadow-lg p-10 flex flex-col items-center text-center bg-white rounded-xl border border-gray-200 hover:shadow-xl hover:scale-105 transform transition-all duration-300'
              key={index}
            >
              <div className='text-secondary-600 mb-4 group-hover:scale-110 transition-all group-hover:text-primary-default'>
                {category.icon}
              </div>
              <p className='text-2xl font-bold text-gray-800 group-hover:text-primary-default transition-all'>
                {category.name}
              </p>
              <p className='text-gray-500 mt-2 group-hover:text-gray-700 transition-colors'>
                High-quality {category.name.toLowerCase()}.
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className='px-8 py-6 pt-12'>
        <div className='text-center'>
          <span className='bg-orange-100 font-bold uppercase text-xl text-orange-900 px-6 py-3 rounded-lg inline-block'>
            Featured Services
          </span>
          <p className='text-gray-600 mt-4'>
            Explore our top-notch services tailored for you
          </p>
        </div>
        <div className='grid grid-cols-responsive my-8 gap-6'>
          {featuredServices.map((service) => (
            <div
              key={service._id}
              className='group rounded-lg border border-gray-300 shadow-md hover:-translate-y-4 transition-all duration-300 overflow-hidden'
            >
              {/* Image Section */}
              <Image
                src={"http://localhost:5000" + service.image}
                alt='Service Image'
                width={400}
                height={70}
                style={{
                  objectFit: "cover",
                }}
                className='w-full h-48 group-hover:scale-105 transition-transform duration-300'
              />

              {/* Content Section */}
              <div className='px-4 py-5'>
                {/* Category Badge */}
                <span className='bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold uppercase'>
                  {service.category}
                </span>

                {/* Service Name and Price */}
                <div className='flex justify-between items-center pt-4 pb-3'>
                  <h3 className='font-semibold text-lg text-gray-800'>
                    {service.name}
                  </h3>
                  <p className='text-primary-default font-bold'>
                    Rs.{service.price}
                  </p>
                </div>

                {/* Buttons */}
                <div className='flex justify-between items-center mt-4'>
                  <Link
                    href={`/services/book/${service._id}`}
                    className='text-white bg-primary-default rounded-lg px-4 py-2 hover:bg-primary-500 transition-colors duration-200 font-medium'
                  >
                    Book Now
                  </Link>
                  <Link
                    href={`/services/${service._id}`}
                    className='text-primary-default font-medium hover:underline'
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
