/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
/*eslint no-unused-vars: ["error", { "args": "none" }]*/
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../../config';
import ServiceSelection from './ServiceSelection';
import DateTimeSelection from './DateTimeSelection.jsx';
import Confirmation from './Confirmation';
import BookingSteps from './BookingSteps';
import { useNavigate } from 'react-router-dom';
import { BsCheckCircle } from 'react-icons/bs'; // Import a checkmark icon

const BarberServices = ({ barberData }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [providerServices, setProviderServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    return `${hour.padStart(2, '0')}:${minute}`;
  };

  // Fetch provider services
  useEffect(() => {
    if (barberData?._id) {
      fetchServices();
    }
  }, [barberData]);

  // Move to the next step when both date and time are selected
  useEffect(() => {
    if (selectedDate && selectedTime) {
      setCurrentStep(3);
    }
  }, [selectedDate, selectedTime]);

  console.log('Barber Data:', barberData);

  // Fetch services for the provider
  const fetchServices = async () => {
    try {
      const jwt = localStorage.getItem('token');
      if (!jwt || !barberData?._id) {
        toast.warn('Please login to view services');
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
        image: service.image?.url || '/api/placeholder/100/100',
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

  // Handle Pay Cash
  const handlePayCash = async () => {
    try {
      await handleConfirmBooking('cash'); // Ensure booking is confirmed
        
      // Redirect to the Thank You page after a short delay
      setTimeout(() => {
        navigate('/thank-you'); // Update with your actual route
      }, 2000);
    } catch (error) {
      toast.error('Booking failed. Please try again.');
    }
  };

  // Handle Pay with Paystack
  const handlePayWithPaystack = () => {
    // Initialize Paystack payment
    const paystackHandler = window.PaystackPop.setup({
      key: 'YOUR_PAYSTACK_PUBLIC_KEY',
      email: 'customer@example.com',
      amount: calculateTotalPrice() * 100,
      currency: 'GHS',
      ref: `booking_${Date.now()}`,
      callback: function (response) {
        toast.success('Payment successful!');
        handleConfirmBooking("momo");
      },
      onClose: function () {
        toast.info('Payment window closed.');
      },
    });
    paystackHandler.openIframe();
  };

  // Handle booking confirmation
  const handleConfirmBooking = async (paymentMethod) => {
    if (!selectedDate || !selectedTime || selectedServices.length === 0) {
      toast.error('Please complete all steps before confirming.');
      return;
    }

    try {
      const bookingData = {
        provider: barberData._id,
        providerServices: selectedServices.map((service) => service.id),
        date: selectedDate.toISOString().split('T')[0],
        startTime: new Date(`${selectedDate.toISOString().split('T')[0]}T${formatTime(selectedTime)}:00.000Z`), // Full DateTime format
        duration: calculateTotalDuration(),
        totalPrice: formatPrice(calculateTotalPrice()),
        paymentMethod: paymentMethod || 'cash',
      };

      console.log("Booking: ",bookingData);
      console.log("DAte: ",selectedDate);
      console.log("time: ",selectedTime);

      const res = await fetch(`${BASE_URL}appointments`, {
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
      setCurrentStep(3);
    } catch (err) {
      console.error('Booking error:', err);
      toast.error('Error confirming booking. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <BookingSteps currentStep={currentStep} />
      {currentStep === 1 && (
        <ServiceSelection
          providerServices={providerServices}
          selectedServices={selectedServices}
          handleServiceSelect={handleServiceSelect}
          handleRemoveService={handleRemoveService}
          calculateTotalDuration={calculateTotalDuration}
          calculateTotalPrice={calculateTotalPrice}
          formatPrice={formatPrice}
          loading={loading}
          error={error}
          setCurrentStep={setCurrentStep}
        />
      )}
      {currentStep === 2 && (
        <DateTimeSelection
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          handleDateSelect={handleDateSelect}
          handleTimeSelect={handleTimeSelect}
          workingHours={barberData.workingHours}
        />
      )}
      {currentStep === 3 && (
        <Confirmation
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          selectedServices={selectedServices}
          calculateTotalDuration={calculateTotalDuration}
          calculateTotalPrice={calculateTotalPrice}
          formatPrice={formatPrice}
          handlePayCash={handlePayCash}
          handlePayWithPaystack={handlePayWithPaystack}
        />
      )}
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