import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

const SearchServices = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchServices = async () => {
      if (searchTerm.trim().length > 0) {
        try {
          const response = await fetch(
            `http://localhost:5000/api/v1/services/search?search=${searchTerm}`,
          );
          const data = await response.json();
          setSuggestions(data.data);
        } catch (error) {
          console.error("Error fetching services:", error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(fetchServices, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className='relative w-full max-w-xl' ref={searchRef}>
      <div className='relative'>
        <input
          type='text'
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder='Search for services...'
          className='w-full px-4 py-3 pl-12 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-default focus:border-transparent bg-white/90 backdrop-blur-sm text-gray-900'
        />
        <Search
          className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400'
          size={20}
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className='absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg'>
          {suggestions.map((service) => (
            <Link
              key={service._id}
              href={`/services/${service._id}`}
              className='block px-4 py-3 hover:bg-gray-50 transition-colors duration-200'
              onClick={() => {
                setShowSuggestions(false);
                setSearchTerm("");
              }}
            >
              <span className='text-gray-800 hover:text-primary-default'>
                {service.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchServices;
