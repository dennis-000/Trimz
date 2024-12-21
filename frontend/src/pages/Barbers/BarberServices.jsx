// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { Calendar, ShoppingCart, X } from 'lucide-react';
import service1 from '../../assets/images/classicFade.jpg';

const BookingSystem = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  

  // Sample data with prices in Ghanaian Cedis
  const services = [
    {
      id: 1,
      name: "Men's Haircut",
      duration: "30 min",
      price: 150,
      image: service1,
    },
    {
      id: 2,
      name: "Beard Trim",
      duration: "20 min",
      price: 100,
      image: "/api/placeholder/100/100"
    },
    {
      id: 3,
      name: "Hair & Beard Combo",
      duration: "45 min",
      price: 225,
      image: "/api/placeholder/100/100"
    },
    {
      id: 4,
      name: "Kids Haircut",
      duration: "20 min",
      price: 125,
      image: "/api/placeholder/100/100"
    }
  ];
  const calculateTotalDuration = () => {
    return selectedServices.reduce((total, service) => {
      const duration = parseInt(service.duration.split(' ')[0], 10); // Extract numeric value
      return total + (isNaN(duration) ? 0 : duration);
    }, 0);
  };
  
 
  

  const calculateTotalPrice = () => {
    return selectedServices.reduce((total, service) => total + service.price, 0);
  };

  const formatPrice = (price) => {
    return `GH₵${price.toFixed(2)}`;
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 19; hour++) {
      for (let minute of ['00', '30']) {
        slots.push(`${hour}:${minute}`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const getNextSevenDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        full: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate()
      });
    }
    return days;
  };

  const handleServiceSelect = (service) => {
    setSelectedServices(prev => 
      prev.find(s => s.id === service.id) ? prev : [...prev, service]
    );
  };
  

  const handleRemoveService = (serviceId) => {
    setSelectedServices(prev => prev.filter(service => service.id !== serviceId));
  };

  const handleProceedToStaff = () => {
    if (selectedServices.length > 0) {
      setCurrentStep(2);
    }
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    setCurrentStep(3);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setCurrentStep(4);
  };

  const ServiceCart = () => (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center">
          <ShoppingCart className="w-5 h-5 mr-2" />
          Selected Services
        </h3>
        <span className="text-sm text-gray-500">
          Total Duration: {calculateTotalDuration()} min
        </span>
      </div>
      {selectedServices.length > 0 ? (
        <div className="space-y-2">
          {selectedServices.map((service) => (
            <div key={service.id} className="flex items-center justify-between bg-white p-2 rounded">
              <div>
                <span className="font-medium">{service.name}</span>
                <span className="text-sm text-gray-500 ml-2">{formatPrice(service.price)}</span>
              </div>
              <button
                onClick={() => handleRemoveService(service.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}

          <div className="flex justify-between pt-3 border-t mt-3">
            <span className="font-semibold">Total:</span>
            <span className="font-bold">{formatPrice(calculateTotalPrice())}</span>
          </div>
          <button
            onClick={handleProceedToStaff}
            className="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Proceed to Payment Method
          </button>
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No services selected</p>
      )}
    </div>
  );

  const ServiceSelection = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2">
      {services.map((service) => (
        <div
          key={service.id}
          onClick={() => handleServiceSelect(service)}
          className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-blue-500 transition-all"
        >
          <img src={service.image} alt={service.name} className="w-16 h-16 rounded-lg object-cover" />
          <div className="ml-4 flex-1">
            <h3 className="font-semibold">{service.name}</h3>
            <p className="text-sm text-gray-500">{service.duration}</p>
            <p className="text-blue-600 font-semibold">{formatPrice(service.price)}</p>
          </div>
        </div>
      ))}
    </div>
  );
  const PaymentMethodSelection = () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-2">
      {["Cash", "Mobile Money", "Card"].map((method) => (
        <div
          key={method}
          onClick={() => handlePaymentMethodSelect(method)}
          className={`p-4 border rounded-lg cursor-pointer hover:border-blue-500 transition-all
            ${selectedPaymentMethod === method ? 'border-blue-500' : 'border-gray-300'}`}
        >
          <h3 className="font-semibold">{method}</h3>
        </div>
      ))}
    </div>
  );

  const BookingSteps = () => (
    <div className="flex flex-wrap items-center justify-center mb-8 text-sm gap-4 px-2">
      {[
        { num: 1, text: "Services" },
        { num: 2, text: "Payment Method" },
        { num: 3, text: "Date & Time" },
        { num: 4, text: "Confirm" }
      // eslint-disable-next-line no-unused-vars
      ].map((step, index) => (
        <div key={step.num} className="flex items-center">
          <div className={`flex items-center ${currentStep >= step.num ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
              ${currentStep >= step.num ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
              {step.num}
            </div>
            <span className="ml-2 hidden sm:inline">{step.text}</span>
          </div>
          {step.num < 4 && (
            <div className={`w-8 sm:w-12 h-0.5 mx-2 ${currentStep > step.num ? 'bg-blue-600' : 'bg-gray-300'}`} />
          )}
        </div>
      ))}
    </div>
  );

 

  const DateTimeSelection = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold flex items-center px-4">
          <Calendar className="w-5 h-5 mr-2" />
          Select Date
        </h3>
        <div className="relative">
          <div className="flex overflow-x-auto scrollbar-hide pb-2 px-4 -mx-4 scroll-smooth">
            <div className="flex space-x-2">
              {getNextSevenDays().map((date) => (
                <button
                  key={date.full}
                  onClick={() => handleDateSelect(date.full)}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg w-16 h-20
                    ${selectedDate === date.full 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  <span className="text-xs font-medium">{date.day}</span>
                  <span className="text-lg font-bold mt-1">{date.date}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="hidden sm:block absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white pointer-events-none" />
        </div>
      </div>

      {selectedDate && (
        <div className="space-y-4 px-4">
          <h3 className="font-semibold">Select Time</h3>
          <div className="relative">
            <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-6 gap-2 max-h-[280px] overflow-y-auto pr-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`p-3 rounded text-sm font-medium transition-colors
                    ${selectedTime === time 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                  {time}
                </button>
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-2 h-8 bg-gradient-to-t from-white pointer-events-none" />
          </div>
        </div>
      )}
    </div>
  );

  const Confirmation = () => (
    <div className="space-y-6 px-2">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-4">Booking Summary</h3>
        <div className="space-y-3">

          {/* ===== Display name of Service selected even multiple with their prices ====== */}
          <div>
            <span className="text-gray-600">Services:</span>
            <div className="mt-2 space-y-2">
              {selectedServices.map(service => (
                <div key={service.id} className="flex justify-between text-sm font-semibold">
                  <span>{service.name}</span>
                  <span className="font-semibold">{formatPrice(service.price)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ==== Display Payment Method ===== */}
          <div className='flex flex-col sm:flex-row sm:justify-between gap-1'>
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-semibold">{selectedPaymentMethod}</span>
          </div>

          {/* ===== Display Time and Date */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-gray-600">Date:</span>
            <span className="font-semibold">
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-gray-600">Time:</span>
            <span className="font-semibold">{selectedTime}</span>
          </div>
          {/* ===== Display Duration ======== */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
            <span className="text-gray-600">Total Duration:</span>
            <span className="font-semibold">{calculateTotalDuration()} min</span>
          </div>

          {/* ===== Display Total Prices of services ======= */}
          <div className="flex justify-between pt-3 border-t">
            <span className="text-gray-600">Total Price:</span>
            <span className="font-bold text-lg">{formatPrice(calculateTotalPrice())}</span>
          </div>
        </div>
      </div>
      
              {/* === confirm Booking ===== */}
              {/* ====== Later the Booking Button will lead to Payment Gateway */}
              {/* ==== for now just gives an alert */}
      <button
        onClick={() => alert('Booking confirmed!')}
        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Confirm Booking
      </button>
    </div>
  );


  // =========
  return (
    <div className="max-w-3xl mx-auto p-4">
      <BookingSteps />
      
      <div className="mt-8">
        {currentStep === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-6 px-2">Select Services</h2>
            <ServiceCart />
            <ServiceSelection />
          </>
        )}

        {currentStep === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-6 px-2">Payment Method</h2>
            <PaymentMethodSelection />
          </>
        )}

        {currentStep === 3 && (
          <>
            <h2 className="text-2xl font-bold mb-6 px-2">Select Date & Time</h2>
            <DateTimeSelection />
          </>
        )}

        {currentStep === 4 && (
          <>
            <h2 className="text-2xl font-bold mb-6 px-2">Confirm Booking</h2>
            <Confirmation />
          </>
        )}
      </div>

      {currentStep > 1 && (
        <button
          onClick={() => setCurrentStep(currentStep - 1)}
          className="mt-6 text-blue-500 hover:text-blue-600 px-2"
        >
          ← Back to previous step
        </button>
      )}
    </div>
  
  );

};

export default BookingSystem;