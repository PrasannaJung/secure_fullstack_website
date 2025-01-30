import React from "react";

const AboutUs = () => {
  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-4'>
      <div className='max-w-6xl mx-auto'>
        {/* Hero Section */}
        <div className='text-center mb-16'>
          <h1 className='text-6xl font-bold text-gray-800 mb-6 tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.15)]'>
            Who We Are
          </h1>
          <p className='text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed mb-8'>
            We're more than just a service provider – we're your trusted partner
            in creating the perfect living space. With years of expertise and a
            commitment to excellence, we bring together the finest professionals
            to deliver exceptional home services that transform your space and
            exceed your expectations.
          </p>
          <button className='bg-primary-default hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition duration-300 ease-in-out transform hover:scale-105 shadow-lg'>
            Explore Our Services
          </button>
        </div>

        {/* Stats Section */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* Services Card */}
          <div className='bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300'>
            <div className='text-center'>
              <span className='text-5xl font-bold text-primary-default mb-2 block'>
                70+
              </span>
              <div className='w-16 h-1 bg-primary-default mx-auto mb-4 rounded-full'></div>
              <h3 className='text-xl font-semibold text-gray-800'>Services</h3>
              <p className='text-gray-600 mt-2'>
                Comprehensive solutions for every home need
              </p>
            </div>
          </div>

          {/* Categories Card */}
          <div className='bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300'>
            <div className='text-center'>
              <span className='text-5xl font-bold text-primary-default mb-2 block'>
                10
              </span>
              <div className='w-16 h-1 bg-primary-default mx-auto mb-4 rounded-full'></div>
              <h3 className='text-xl font-semibold text-gray-800'>
                Categories
              </h3>
              <p className='text-gray-600 mt-2'>
                Specialized areas of expertise
              </p>
            </div>
          </div>

          {/* Professionals Card */}
          <div className='bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300'>
            <div className='text-center'>
              <span className='text-5xl font-bold text-primary-default mb-2 block'>
                35+
              </span>
              <div className='w-16 h-1 bg-primary-default mx-auto mb-4 rounded-full'></div>
              <h3 className='text-xl font-semibold text-gray-800'>
                Professionals
              </h3>
              <p className='text-gray-600 mt-2'>
                Expert technicians at your service
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
