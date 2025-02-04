"use client";
import { CrossIcon, MenuIcon, SidebarClose } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuth from "@/hooks/useAuth"; // Import the useAuth hook

export default function Header() {
  const [isScrolling, setIsScrolling] = useState(false);
  const [toggleMenu, setToggleMenu] = useState(false);
  const { logout } = useAuth(); // Get user and logout function from useAuth
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolling(true);
      } else {
        setIsScrolling(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <nav
        className={`flex justify-between items-center px-8 py-6 sticky ${
          isScrolling ? "sticky-header" : ""
        }`}
      >
        <div>
          <Image
            src='/primary_logo.svg'
            alt='GharSahayog'
            width={125}
            height={125}
          />
        </div>
        <ul className='gap-6 text-xl font-medium hidden sm:flex'>
          <li>
            <Link href='/'>Home </Link>
          </li>
          <li>
            <Link href='/services'>Services</Link>
          </li>
          <li>
            <Link href='/about'>About</Link>
          </li>
          <li>
            <Link href='/contact'>Contact</Link>
          </li>
        </ul>
        <div className='sm:hidden'>
          <MenuIcon
            onClick={() => {
              setToggleMenu(true);
            }}
            role='button'
            aria-label='Open mobile menu'
          />
        </div>
        <div className='sm:flex gap-4 hidden'>
          {user ? (
            <>
              <Link href='/profile'>
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback>
                    {user.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <Link
                href='/services'
                className='bg-primary-default px-4 py-2 font-medium rounded-md text-base text-white'
              >
                Find Service
              </Link>
            </>
          ) : (
            <Link
              href='/auth/login'
              className='bg-orange-500 px-4 py-2 font-medium rounded-md text-base text-white'
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Overlay for background */}
      <div
        className={`mobile-menu-overlay ${
          toggleMenu ? "mobile-menu-overlay-active" : ""
        }`}
        onClick={() => setToggleMenu(false)} // Close menu on overlay click
      ></div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${toggleMenu ? "mobile-menu-active" : ""}`}>
        <div className='absolute top-8 right-8'>
          <SidebarClose
            onClick={() => {
              setToggleMenu(false);
            }}
            role='button'
            aria-label='Close mobile menu'
          />
        </div>
        <ul className='text-lg'>
          <li>
            <Link href='/' onClick={() => setToggleMenu(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link href='/services' onClick={() => setToggleMenu(false)}>
              Services
            </Link>
          </li>
          <li>
            <Link href='/about' onClick={() => setToggleMenu(false)}>
              About
            </Link>
          </li>
        </ul>
        <div className='mt-8'>
          {user ? (
            <>
              <Link
                href='/services'
                className='bg-primary-default px-4 py-2 font-medium rounded-md text-base text-white block text-center mb-4'
                onClick={() => setToggleMenu(false)}
              >
                Find Service
              </Link>
              <Link
                href='/profile'
                className='bg-orange-500 px-4 py-2 font-medium rounded-md text-base text-white block text-center mb-4'
                onClick={() => setToggleMenu(false)}
              >
                Profile
              </Link>
              <Link
                href='/bookmarks'
                className='bg-orange-500 px-4 py-2 font-medium rounded-md text-base text-white block text-center mb-4'
                onClick={() => setToggleMenu(false)}
              >
                Bookmarks
              </Link>
              <button
                onClick={() => {
                  // logout();
                  setToggleMenu(false);
                }}
                className='bg-red-500 px-4 py-2 font-medium rounded-md text-base text-white block text-center w-full'
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href='/auth/login'
              className='bg-orange-500 px-4 py-2 font-medium rounded-md text-base text-white block text-center mb-4'
              onClick={() => setToggleMenu(false)}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
