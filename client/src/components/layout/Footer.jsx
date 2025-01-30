import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Heart,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className='bg-[#030425] text-white'>
      <div className='max-w-7xl mx-auto px-4 py-16'>
        {/* Main Footer Content */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12'>
          {/* Company Info */}
          <div className='space-y-5'>
            <Link href='/' className='inline-block'>
              <Image
                src='/primary_logo_white.svg'
                alt='HomeServices Logo'
                width={150}
                height={40}
                className='h-10 w-auto'
              />
            </Link>
            <p className='text-gray-300 text-base'>
              Your trusted partner for all home service needs. We provide
              quality services to make your life easier and your home better.
            </p>
            <div className='flex space-x-5'>
              <Link
                href='#'
                className='text-gray-300 hover:text-white transition-colors'
              >
                <Facebook className='w-6 h-6' />
              </Link>
              <Link
                href='#'
                className='text-gray-300 hover:text-white transition-colors'
              >
                <Twitter className='w-6 h-6' />
              </Link>
              <Link
                href='#'
                className='text-gray-300 hover:text-white transition-colors'
              >
                <Instagram className='w-6 h-6' />
              </Link>
              <Link
                href='#'
                className='text-gray-300 hover:text-white transition-colors'
              >
                <Linkedin className='w-6 h-6' />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-xl font-semibold mb-6'>Quick Links</h3>
            <ul className='space-y-3'>
              {[
                { name: "About Us", path: "/about" },
                { name: "Services", path: "/services" },
                { name: "Book Now", path: "/booking" },
                { name: "Careers", path: "/careers" },
                { name: "Blog", path: "/blog" },
                { name: "Contact", path: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className='text-gray-300 hover:text-white transition-colors text-base'
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className='text-xl font-semibold mb-6'>Our Services</h3>
            <ul className='space-y-3'>
              {[
                {
                  name: "Router Installation",
                  path: "/services/router-installation",
                },
                { name: "Wi-Fi Setup", path: "/services/wifi-setup" },
                { name: "Computer Repair", path: "/services/computer-repair" },
                { name: "Data Recovery", path: "/services/data-recovery" },
                { name: "Network Setup", path: "/services/network-setup" },
                {
                  name: "Software Support",
                  path: "/services/software-support",
                },
              ].map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.path}
                    className='text-gray-300 hover:text-white transition-colors text-base'
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className='space-y-5'>
            <h3 className='text-xl font-semibold mb-6'>Contact Us</h3>
            <div className='space-y-4'>
              <div className='flex items-start space-x-3'>
                <MapPin className='w-6 h-6 text-gray-300 mt-1' />
                <p className='text-gray-300 text-base'>
                  123 Tech Street, Digital City,
                  <br />
                  Code State 12345
                </p>
              </div>
              <div className='flex items-center space-x-3'>
                <Phone className='w-6 h-6 text-gray-300' />
                <Link
                  href='tel:+15551234567'
                  className='text-gray-300 hover:text-white text-base'
                >
                  +1 (555) 123-4567
                </Link>
              </div>
              <div className='flex items-center space-x-3'>
                <Mail className='w-6 h-6 text-gray-300' />
                <Link
                  href='mailto:support@homeservices.com'
                  className='text-gray-300 hover:text-white text-base'
                >
                  support@homeservices.com
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className='text-center text-gray-300 border-t border-gray-800 pt-8'>
          <p className='flex items-center justify-center gap-2 text-base'>
            Developed by HomeServices Team
          </p>
          <p className='mt-3 text-base'>
            © {new Date().getFullYear()} HomeServices. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
