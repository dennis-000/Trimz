/* eslint-disable react/prop-types */
const BookingSteps = ({ currentStep }) => (
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
  
  export default BookingSteps;