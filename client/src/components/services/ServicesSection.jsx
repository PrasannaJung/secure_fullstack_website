"use client";
import { useState, useEffect, useCallback } from "react";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "../ui/card";
import { getAllServices as fetchAllServices } from "@/api/services";

export default function ServicesSection() {
  const [allServices, setAllServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Fixed limit per page

  const fetchServices = async () => {
    try {
      const response = await fetchAllServices(
        page,
        limit,
        searchQuery,
        selectedLocations,
        selectedCategories,
      );
      setAllServices(response.data.services);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  // Debounced function for fetching services
  const debouncedFetch = useCallback(
    debounce(() => {
      fetchServices();
    }, 500), // 500ms debounce delay
    [page, limit, searchQuery, selectedLocations, selectedCategories],
  );

  // Trigger fetch when filters, search, or pagination change
  useEffect(() => {
    debouncedFetch();
  }, [
    page,
    searchQuery,
    selectedLocations,
    selectedCategories,
    debouncedFetch,
  ]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category],
    );
  };

  const handleLocationChange = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((loc) => loc !== location)
        : [...prev, location],
    );
  };

  return (
    <section className='min-h-screen md:flex gap-6 relative px-8 pt-6'>
      <aside className='pr-8'>
        <h2 className='text-xl font-bold'>Search and Filter</h2>
        <div className='flex flex-col gap-4 py-4 md:py-0'>
          <div className='flex md:flex-col gap-4 md:gap-0'>
            <p className='font-semibold'>Category</p>
            <div className='flex md:flex-col gap-2 items-center md:items-start'>
              {["Electrical", "Plumbing", "Furnishing", "Cleaning"].map(
                (category) => (
                  <div key={category} className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      id={category}
                      onChange={() => handleCategoryChange(category)}
                    />
                    <label htmlFor={category}>{category}</label>
                  </div>
                ),
              )}
            </div>
          </div>
          <div className='flex md:flex-col gap-4 md:gap-0'>
            <p className='font-semibold'>Location</p>
            <div className='flex md:flex-col gap-2 items-center md:items-start'>
              {["Kathmandu", "Lalitpur", "Bhaktapur"].map((location) => (
                <div key={location} className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    id={location}
                    onChange={() => handleLocationChange(location)}
                  />
                  <label htmlFor={location}>{location}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
      <div className='flex-1'>
        <div className='md:w-1/3 flex items-center gap-4 border-1 border-black border rounded-md pl-2 pr-6 py-2'>
          <SearchIcon />
          <input
            type='search'
            placeholder='Search services'
            className='inline-block w-full py-2 bg-transparent focus:outline-none'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* List of services card here */}
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 my-8 gap-6'>
          {allServices.map((service) => (
            <Card key={service._id}>
              {/* Image container with fixed height */}
              <div className='h-48 overflow-hidden'>
                {" "}
                {/* Adjust height as needed */}
                <Image
                  src={"http://localhost:5000/" + service.image}
                  alt='Service Image'
                  width={690}
                  height={50}
                  style={{
                    objectFit: "cover", // Ensures the image covers the container
                    width: "100%", // Ensures the image takes full width
                    height: "100%", // Ensures the image takes full height
                  }}
                  className='rounded-t-md'
                />
              </div>
              <div className='px-3 pt-3 pb-5'>
                <span className='bg-green-400 px-3 py-1 rounded-full text-white text-sm font-semibold'>
                  {service.category}
                </span>
                <div className='flex justify-between items-center pt-4 pb-3'>
                  <h3 className='font-medium text-lg'>{service.name}</h3>
                  <p>Rs.{service.price}</p>
                </div>
                <div className='flex justify-between'>
                  <Link
                    href={`/services/book/${service._id}`}
                    className='text-white font-medium bg-primary-default rounded-md px-3 py-1 hover:bg-primary-500 transition-all duration-75'
                  >
                    Book Now
                  </Link>
                  <Link
                    href={`/services/${service._id}`}
                    className='underline text-primary-default hover:text-primary-500'
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Utility function for debouncing
function debounce(func, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), delay);
  };
}
