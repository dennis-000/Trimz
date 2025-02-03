/* eslint-disable react/prop-types */
import { ShoppingCart, X } from 'lucide-react';

const ServiceSelection = ({ providerServices, selectedServices, handleServiceSelect, handleRemoveService, calculateTotalDuration, calculateTotalPrice, formatPrice, loading, error, setCurrentStep }) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 px-2">Select Services</h2>
      <ServiceCart
        selectedServices={selectedServices}
        handleRemoveService={handleRemoveService}
        calculateTotalDuration={calculateTotalDuration}
        calculateTotalPrice={calculateTotalPrice}
        formatPrice={formatPrice}
        setCurrentStep={setCurrentStep}
      />
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
};

const ServiceCart = ({ selectedServices, handleRemoveService, calculateTotalDuration, calculateTotalPrice, formatPrice, setCurrentStep }) => (
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

export default ServiceSelection;