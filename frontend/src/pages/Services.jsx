/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import ServiceCard from '../components/Services/ServiceCard';
import { services } from '../assets/data/services';
import { BsSearch, BsScissors } from 'react-icons/bs';
import BottomCTA from '../components/CTA/BottomCTA';
import { Link } from 'react-router-dom';
const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'haircut', 'shaving', 'styling', 'coloring'];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 mb-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BsScissors className="w-8 h-8 text-primaryColor mr-2" />
            <h1 className="text-[32px] lg:text-[40px] font-[700] text-headingColor">
              Our Premium Services
            </h1>
          </div>
          <p className="text-[16px] leading-7 text-textColor max-w-2xl mx-auto">
            Experience the art of grooming with our professional Stylists. 
            From classic cuts to modern styles, we&apos;ve got you covered.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryColor focus:border-transparent"
              />
              <BsSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 flex-wrap justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-[500] transition-colors
                    ${selectedCategory === category
                      ? 'bg-primaryColor text-white'
                      : 'bg-gray-100 text-textColor hover:bg-gray-200'
                    }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px]">
          {filteredServices.map((item, index) => (
            <ServiceCard 
              key={index}
              item={item}
              index={index}
              className="transform transition-transform hover:scale-105"
            />
          ))}
        </div>

        {/* No Results Message */}
        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-textColor text-lg">
              No services found matching your criteria. Please try a different search.
            </p>
          </div>
        )}
      </div>


      <div>
        {/* CTA Section */}
      <div className="bg-yellow-50 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <h2 className="text-yellow-600 text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <div className="flex gap-4 justify-center">
            <button className="bg-primaryColor text-white-600 px-8 py-3 rounded-lg hover:bg-irisBlueColor transition-colors">
              <Link to='/register'>
                List Your Business
              </Link>
            </button>
            <button className="bg-irisBlueColor px-8 py-3 rounded-lg hover:bg-primaryColor transition-colors">
              <Link to='/services'>Find Services</Link>
            </button>
          </div>
        </div>


      </div>
        <BottomCTA/>
      </div>
    </section>
  );
};

export default Services;