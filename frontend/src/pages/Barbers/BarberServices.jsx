/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Calendar, ShoppingCart, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../config';

const BarberServices = ({ barberData }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [providerServices, setProviderServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch provider services
  useEffect(() => {
    if (barberData?._id) {
      fetchServices();
    }
  }, [barberData]);

  // Fetch services for the provider
  const fetchServices = async () => {
    try {
      const jwt = localStorage.getItem('token');
      if (!jwt || !barberData?._id) {
        toast.error('Authentication required');
        return;
      }

      const res = await fetch(`${BASE_URL}provider-services/provider/${barberData._id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch services');
      }

      const data = await res.json();
      const formattedServices = (data.data || []).map((service) => ({
        id: service._id,
        name: service.name,
        duration: Number(service.duration) || 0,
        price: parseFloat(service.price),
        image: service.image?.url || '/api/placeholder/100/100', // Fallback image
        description: service.description,
        availability: service.availability,
      }));

      setProviderServices(formattedServices.filter((service) => service.availability));
      setLoading(false);
    } catch (err) {
      console.error('Service fetch error:', err);
      setError('Failed to load services. Please try again later.');
      setLoading(false);
      toast.error('Error loading services');
    }
  };

  // Calculate total duration and price
  const calculateTotalDuration = () => selectedServices.reduce((total, service) => total + (service.duration || 0), 0);
  const calculateTotalPrice = () => selectedServices.reduce((total, service) => total + service.price, 0);
  const formatPrice = (price) => `GH₵${price.toFixed(2)}`;

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 19; hour++) {
      for (let minute of ['00', '30']) {
        slots.push(`${hour}:${minute}`);
      }
    }
    return slots;
  };

  // Handle service selection
  const handleServiceSelect = (service) => {
    setSelectedServices((prev) => {
      const isSelected = prev.some((s) => s.id === service.id);
      return isSelected ? prev.filter((s) => s.id !== service.id) : [...prev, service];
    });
  };

  // Handle service removal
  const handleRemoveService = (serviceId) => {
    setSelectedServices((prev) => prev.filter((service) => service.id !== serviceId));
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Handle time selection
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // Handle booking confirmation
  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime || selectedServices.length === 0) {
      toast.error('Please complete all steps before confirming.');
      return;
    }

    try {
      const bookingData = {
        barberId: barberData._id,
        services: selectedServices.map((service) => service.id),
        date: selectedDate,
        time: selectedTime,
        totalPrice: calculateTotalPrice(),
      };

      // Mock API call for booking confirmation
      const res = await fetch(`${BASE_URL}bookings`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!res.ok) {
        throw new Error('Booking failed. Please try again.');
      }

      toast.success('Booking confirmed!');
      setCurrentStep(3); // Show confirmation step
    } catch (err) {
      console.error('Booking error:', err);
      toast.error('Error confirming booking. Please try again.');
    }
  };

  // Get the next 7 days for date selection
  const getNextSevenDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        full: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate(),
      });
    }
    return days;
  };

  // Service Selection Component
  const ServiceSelection = () => (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 px-2">Select Services</h2>
      <ServiceCart />
      {loading ? (
        <div className="text-center py-8">Loading services...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2">
          {providerServices.map((service) => (
            <div
              key={service.id}
              onClick={() => handleServiceSelect(service)}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                selectedServices.some((s) => s.id === service.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'hover:border-blue-500'
              }`}
            >
              <img
                src={service.image}
                alt={service.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="ml-4 flex-1">
                <h3 className="font-semibold">{service.name}</h3>
                <p className="text-sm text-gray-500">{service.duration} mins</p>
                {service.description && (
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                )}
                <p className="text-blue-600 font-semibold mt-1">{formatPrice(service.price)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Service Cart Component
  const ServiceCart = () => (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center">
          <ShoppingCart className="w-5 h-5 mr-2" />
          Selected Services
        </h3>
        <span className="text-sm text-gray-500">
          Total Duration: {calculateTotalDuration()} mins
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
            onClick={() => setCurrentStep(2)}
            className="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Proceed to Date & Time
          </button>
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No services selected</p>
      )}
    </div>
  );

  // Date & Time Selection Component
  const DateTimeSelection = () => (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 px-2">Select Date & Time</h2>
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center px-4">
            <Calendar className="w-5 h-5 mr-2" />
            Select Date
          </h3>
          <div className="flex overflow-x-auto scrollbar-hide pb-2 px-4 -mx-4 scroll-smooth">
            <div className="flex space-x-2">
              {getNextSevenDays().map((date) => (
                <button
                  key={date.full}
                  onClick={() => handleDateSelect(date.full)}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg w-16 h-20 ${
                    selectedDate === date.full ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-xs font-medium">{date.day}</span>
                  <span className="text-lg font-bold mt-1">{date.date}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {selectedDate && (
          <div className="space-y-4 px-4">
            <h3 className="font-semibold">Select Time</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[280px] overflow-y-auto pr-2">
              {generateTimeSlots().map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`p-3 rounded text-sm font-medium transition-colors ${
                    selectedTime === time ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Confirmation Component
  const Confirmation = () => (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 px-2">Confirm Booking</h2>
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-4">Booking Summary</h3>
        <div className="space-y-3">
          <div>
            <span className="text-gray-600">Services:</span>
            <div className="mt-2 space-y-2">
              {selectedServices.map((service) => (
                <div key={service.id} className="flex justify-between text-sm font-semibold">
                  <span>{service.name}</span>
                  <span>{formatPrice(service.price)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-semibold">
              {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Time:</span>
            <span className="font-semibold">{selectedTime}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Duration:</span>
            <span className="font-semibold">{calculateTotalDuration()} mins</span>
          </div>
          <div className="flex justify-between pt-3 border-t">
            <span className="text-gray-600">Total Price:</span>
            <span className="font-bold text-lg">{formatPrice(calculateTotalPrice())}</span>
          </div>
        </div>
      </div>
      <button
        onClick={handleConfirmBooking}
        className="w-full mt-6 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Confirm Booking
      </button>
    </div>
  );

  // Booking Steps Component
  const BookingSteps = () => (
    <div className="flex flex-wrap items-center justify-center mb-8 text-sm gap-4 px-2">
      {[
        { num: 1, text: 'Services' },
        { num: 2, text: 'Date & Time' },
        { num: 3, text: 'Confirm' },
      ].map((step) => (
        <div key={step.num} className="flex items-center">
          <div
            className={`flex items-center ${
              currentStep >= step.num ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                currentStep >= step.num ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
              }`}
            >
              {step.num}
            </div>
            <span className="ml-2 hidden sm:inline">{step.text}</span>
          </div>
          {step.num < 3 && (
            <div
              className={`w-8 sm:w-12 h-0.5 mx-2 ${
                currentStep > step.num ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-4">
      <BookingSteps />
      {currentStep === 1 && <ServiceSelection />}
      {currentStep === 2 && <DateTimeSelection />}
      {currentStep === 3 && <Confirmation />}
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

export default BarberServices;