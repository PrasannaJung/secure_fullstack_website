import HeroSection from "@/components/home/HeroSection";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className=''>
        <HeroSection />
      </main>
      {/* <Footer /> */}
    </>
  );
}
