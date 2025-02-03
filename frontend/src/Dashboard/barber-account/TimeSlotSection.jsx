/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';

const TimeSlotSection = ({ formData, setFormData }) => {
  const [selectedDates, setSelectedDates] = useState([]);

  const handleTimeSlotsChange = (event, index) => {
    const { name, value } = event.target;
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
    day: 'monday',
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
        {
          day: 'monday',
          isRecurring: true,
          startingTime: '09:00',
          endingTime: '17:00',
          specificDate: '',
          status: 'available'
        }
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
        <div key={slot.id} className="border p-4 rounded-lg mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Schedule Type</label>
              <select
                name="isRecurring"
                value={slot.isRecurring}
                onChange={(e) => handleTimeSlotsChange(e, index)}
                className="form__input py-2.5"
              >
                <option value={true}>Weekly Recurring</option>
                <option value={false}>Specific Date</option>
              </select>
            </div>

            {slot.isRecurring ? (
              <div>
                <label className="block text-sm font-medium mb-1">Day of Week</label>
                <select
                  name="day"
                  value={slot.day}
                  className="form__input py-2.5"
                  onChange={(e) => handleTimeSlotsChange(e, index)}
                >
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-1">Specific Date</label>
                <input
                  type="date"
                  name="specificDate"
                  value={slot.specificDate}
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