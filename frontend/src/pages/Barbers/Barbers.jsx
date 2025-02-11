import { useState, useEffect } from "react";
import BarberCard from "../../components/Barbers/BarberCard";
import Testimonial from "../../components/Testimonial/Testimonial";
import { BASE_URL } from "./../../config";
import Loader from "../../components/Loading/Loading.jsx";
import Error from "../../components/Error/Error";
import { Search, Scissors, Star, Calendar } from 'lucide-react';

const Barbers = () => {
  const [query, setQuery] = useState("");
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProviders = async () => {
      const url = `${BASE_URL}users/providers`;
      try {
        const response = await fetch(url, { method: "GET" });
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const result = await response.json();
        const data = result.data && Array.isArray(result.data) ? result.data : result;
        setProviders(data);
        setFilteredProviders(data);
      } catch (err) {
        setError({ message: err.message });
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, []);

  // Simplified search logic - only search by name
  useEffect(() => {
    if (query.trim() === "") {
      setFilteredProviders(providers);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = providers.filter((provider) => 
        provider.name && provider.name.toLowerCase().includes(lowerQuery)
      );
      setFilteredProviders(filtered);
    }
  }, [query, providers]);

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 bg-[#fff9ea] overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-primaryColor/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-primaryColor/5 rounded-full translate-x-1/2 translate-y-1/2" />
        
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-headingColor mb-4">
              Find Your Perfect Stylist
            </h1>
            <p className="text-textColor mb-8 text-base sm:text-lg">
              Search our talented stylists by name and book your next appointment
            </p>

            {/* Search Section */}
            <div className="relative max-w-[570px] mx-auto">
              <div className="relative flex items-center group">
                <input
                  type="search"
                  className="w-full px-4 py-4 pl-12 bg-white rounded-lg border border-gray-200 
                            shadow-lg transition-all duration-300
                            placeholder:text-gray-400 text-gray-700
                            focus:outline-none focus:border-primaryColor focus:ring-2 focus:ring-primaryColor/20"
                  placeholder="Search barber by name"
                  value={query}
                  onChange={handleSearch}
                />
                <div className="absolute left-4 text-gray-400 transition-colors duration-300 group-hover:text-primaryColor">
                  <Search className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { icon: <Scissors className="w-6 h-6" />, text: "Expert Stylists" },
                { icon: <Star className="w-6 h-6" />, text: "Top Rated Service" },
                { icon: <Calendar className="w-6 h-6" />, text: "Easy Booking" },
              ].map((feature, index) => (
                <div key={index} className="flex items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-primaryColor/10 flex items-center justify-center text-primaryColor">
                    {feature.icon}
                  </div>
                  <span className="text-textColor font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Barbers Grid Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {loading && <Loader />}
          {error && <Error errMessage={error.message} />}
          {!loading && !error && (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-headingColor">
                  Available Stylists
                </h2>
                <p className="text-textColor">
                  {filteredProviders.length} stylists found
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProviders.map((provider) => (
                  <BarberCard key={provider._id} user={provider} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-headingColor mb-4">
              What our clients say
            </h2>
            <p className="text-textColor">
              At Ecutz, we pride ourselves on delivering top-notch barbering services to students right on campus.
            </p>
          </div>
          <Testimonial />
        </div>
      </section>
    </>
  );
};

export default Barbers;