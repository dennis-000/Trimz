/* eslint-disable react/prop-types */
import { useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';

const TimeSlotSection = ({ formData, setFormData }) => {
  // Update the handler to convert "isRecurring" to a boolean.
  const handleTimeSlotsChange = (event, index) => {
    let { name, value } = event.target;
    if (name === "isRecurring") {
      // Convert the string "true"/"false" to a boolean
      value = value === "true";
    }
    setFormData(prevData => {
      const updatedSlots = [...prevData.timeSlots];
      updatedSlots[index] = {
        ...updatedSlots[index],
        [name]: value
      };
      return { ...prevData, timeSlots: updatedSlots };
    });
  };

  const DEFAULT_TIME_SLOT = {
    day: 'Monday',
    isRecurring: true,
    startingTime: '09:00',
    endingTime: '17:00',
    specificDate: '',
    status: 'available'
  };

  const addTimeSlot = () => {
    setFormData(prevData => ({
      ...prevData,
      timeSlots: [
        ...prevData.timeSlots,
        { ...DEFAULT_TIME_SLOT }
      ]
    }));
  };

  const removeTimeSlot = (index) => {
    setFormData(prevData => ({
      ...prevData,
      timeSlots: prevData.timeSlots.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="mb-5">
      <p className="form__label">Availability Schedule</p>
      {formData.timeSlots?.map((slot, index) => (
        <div key={index} className="border p-4 rounded-lg mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Schedule Type</label>
              <select
                name="isRecurring"
                // Convert boolean to string for the select value
                value={slot.isRecurring.toString()}
                onChange={(e) => handleTimeSlotsChange(e, index)}
                className="form__input py-2.5"
              >
                <option value="true">Weekly Recurring</option>
                <option value="false">Specific Date</option>
              </select>
            </div>

            {slot.isRecurring ? (
              <div>
                <label className="block text-sm font-medium mb-1">Day of Week</label>
                <select
                  name="day"
                  value={slot.day}
                  onChange={(e) => handleTimeSlotsChange(e, index)}
                  className="form__input py-2.5"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-1">Specific Date</label>
                <input
                  type="date"
                  name="specificDate"
                  value={slot.specificDate ? new Date(slot.specificDate).toISOString().split('T')[0] : ''}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => handleTimeSlotsChange(e, index)}
                  className="form__input py-2"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                name="status"
                value={slot.status}
                onChange={(e) => handleTimeSlotsChange(e, index)}
                className="form__input py-2.5"
              >
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            {slot.status === 'available' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Start Time</label>
                  <input
                    type="time"
                    name="startingTime"
                    value={slot.startingTime}
                    onChange={(e) => handleTimeSlotsChange(e, index)}
                    className="form__input py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Time</label>
                  <input
                    type="time"
                    name="endingTime"
                    value={slot.endingTime}
                    onChange={(e) => handleTimeSlotsChange(e, index)}
                    className="form__input py-2"
                  />
                </div>
              </>
            )}
          </div>
          
          <button
            type="button"
            onClick={() => removeTimeSlot(index)}
            className="bg-red-600 p-2 rounded-full text-white text-[18px] mt-4 cursor-pointer"
          >
            <AiOutlineDelete />
          </button>
        </div>
      ))}
      
      <button
        type="button"
        onClick={addTimeSlot}
        className="bg-[#000] py-2 px-5 text-white cursor-pointer rounded-md"
      >
        Add Availability
      </button>
    </div>
  );
};

export default TimeSlotSection;