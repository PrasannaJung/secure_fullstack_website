"use client";
import Footer from "@/components/layout/Footer";
import dynamic from "next/dynamic";
const Header = dynamic(() => import("@/components/layout/Header"), {
  ssr: false,
});

export default function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
