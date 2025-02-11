/* eslint-disable react/prop-types */

const Confirmation = ({ selectedDate, selectedTime, selectedServices, calculateTotalDuration, calculateTotalPrice, formatPrice, handlePayCash, handlePayWithPaystack }) => (
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
              {selectedDate.toLocaleDateString('en-US', {
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
      <div className="mt-6 flex gap-4">
        <button
          onClick={handlePayCash}
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
        >
          Pay Cash
        </button>
        <button
          onClick={handlePayWithPaystack}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Pay with Paystack
        </button>
      </div>
    </div>
  );
  
  export default Confirmation;