/* eslint-disable react/prop-types */
import { CalendarIcon } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const DateTimeSelection = ({ selectedDate, selectedTime, handleDateSelect, handleTimeSelect }) => {
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 19; hour++) {
      for (let minute of ['00', '30']) {
        slots.push(`${hour}:${minute}`);
      }
    }
    return slots;
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 px-2">Select Date & Time</h2>
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center px-4">
            <CalendarIcon className="w-5 h-5 mr-2" />
            Select Date
          </h3>
          <div className="flex justify-center">
            <Calendar
              onChange={handleDateSelect}
              value={selectedDate}
              minDate={new Date()} // Disable past dates
              className="border border-gray-200 rounded-lg shadow-sm"
            />
          </div>
        </div>

        {selectedDate && (
          <div className="space-y-4 px-4">
            <h3 className="font-semibold">Select Time</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {generateTimeSlots().map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)}
                  className={`p-3 rounded text-sm font-medium transition-colors ${
                    selectedTime === time
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
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
};

export default DateTimeSelection;