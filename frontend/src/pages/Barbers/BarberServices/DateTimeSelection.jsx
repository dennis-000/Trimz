/* eslint-disable react/prop-types */
import { CalendarIcon } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const DateTimeSelection = ({ selectedDate, selectedTime, handleDateSelect, handleTimeSelect, workingHours }) => {
  
  const isDateAvailable = (date) => {
    if (!workingHours || workingHours.length === 0) return false;
  
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = dayNames[date.getDay()]; // Convert numeric index to name
    const formattedDate = date.toISOString().split("T")[0]; // Extract YYYY-MM-DD format
  
    return workingHours.some((wh) => {
      if (wh.isRecurring) {
        return wh.day === dayName && wh.status === "available";
      } else {
        return wh.specificDate && wh.specificDate.split("T")[0] === formattedDate && wh.status === "available";
      }
    });
  };  

  const generateTimeSlots = () => {
    if (!selectedDate || !workingHours) return [];
  
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = dayNames[selectedDate.getDay()];
    const formattedDate = selectedDate.toISOString().split("T")[0];
  
    // Find working hours for the selected date
    const daySchedule = workingHours.find((wh) => 
      (wh.isRecurring && wh.day === dayName && wh.status === "available") || 
      (!wh.isRecurring && wh.specificDate && wh.specificDate.split("T")[0] === formattedDate && wh.status === "available")
    );
  
    if (!daySchedule) return [];
  
    const { startingTime, endingTime } = daySchedule;
    const slots = [];
    let [startHour, startMinute] = startingTime.split(":").map(Number);
    let [endHour, endMinute] = endingTime.split(":").map(Number);
  
    while (startHour < endHour || (startHour === endHour && startMinute < endMinute)) {
      slots.push(`${startHour}:${startMinute.toString().padStart(2, "0")}`);
      startMinute += 30;
      if (startMinute >= 60) {
        startMinute = 0;
        startHour++;
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
              minDate={new Date()}
              tileDisabled={({ date }) => !isDateAvailable(date)} // Disable unavailable days
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