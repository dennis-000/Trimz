/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { BASE_URL } from '../../config';
import { toast } from 'react-toastify';
// import ServiceManagement from './ServiceManagement';

const Profile = ({barberData}) => {
  const [previewURL, setPreviewURL] = useState('');
  const [formData, setFormData] = useState({
    // State to store the profile form data
    name: '',
    email: '',
    password: '',
    phone: '',
    bio: '',
    gender: '',
    specialization: '',
    experience: [],
    achievements: [],
    timeSlots: [],
    about: '',
    profilePicture: null,
    // service: '',
  });

  // Populate the form data when barberData changes

  useEffect(() => {
    if (barberData) {
      setFormData({
        name: barberData.name || '',
        email: barberData.email || '',
        phone: barberData.phone || '',
        bio: barberData.bio || '',
        gender: barberData.gender || '',
        specialization: barberData.specialization || '',
        experience: barberData.experience || [],
        achievements: barberData.achievements || [],
        timeSlots: barberData.timeSlots || [],
        about: barberData.about || '',
        profilePicture: barberData.profilePicture || "/api/placeholder/100/100",
        services: barberData.services || [],
      });
    }
    if (barberData.profilePicture?.url) {
      setPreviewURL(barberData.profilePicture.url);
    }
    else{
      setPreviewURL(barberData.profilePicture)
    }
  }, [barberData]);

  // Cleanup preview URL on component unmount or new upload
  useEffect(() => {
    return () => {
      if (previewURL.startsWith('blob:')) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [previewURL]);
  
    // Handle form input changes for text fields
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  // Submit the updated profile data
  const updateProfileHandler = async (e) => {
    e.preventDefault();
    
    try {
      // Create a FormData object to handle file upload
      const updateData = new FormData();
      // Append all form data fields except profilePicture to FormData
      // Append all text fields to FormData
      Object.keys(formData).forEach(key => {
        if (key !== 'profilePicture') {
          updateData.append(key, formData[key]);
        }
      });
      
      // Append the profile picture file if it exists
      if (formData.profilePicture instanceof File) {
        updateData.append('profilePicture', formData.profilePicture);
      }
      for (let [key, value] of updateData.entries()) {
        console.log(key, value);
      }      
      const token = localStorage.getItem('token');
      // Send the updated data to the server
      const res = await fetch(`${BASE_URL}users/${barberData._id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: updateData
      });
      // console.log('Barber data',barberData._id);

  
      const result = await res.json();
  
      if (!res.ok) {
        throw Error(result.message);
      }
      localStorage.setItem('user', JSON.stringify(result.data));
      localStorage.setItem('role', result.data.role);
      localStorage.setItem('token', token);
  
      toast.success(result.message);
      window.location.reload();
    } catch (error) {
      toast.error(error.message);
    }
  };
  
    // Handle file input change for profile picture
  // Modify handleFileInputChange to store the File object
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File", file);
      const validImageTypes = ['image/jpeg', 'image/png'];
      if (!validImageTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload a JPEG or PNG image.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds 5MB.');
        return;
      }
      // Generate a preview URL for the image
      const objectURL = URL.createObjectURL(file);
      setPreviewURL(objectURL);
      setFormData({ ...formData, profilePicture: file });
    }
  };
  


  // Handle dynamic changes for reusable inputs like timeSlots
  // Reusable function for handling input changes
  const handleReusableInputChangeFunc = (key, index, event) => {
    const { name, value } = event.target;
    setFormData(prevFormData => {
      const updateItems = [...prevFormData[key]];
      updateItems[index][name] = value;
      return {
        ...prevFormData,
        [key]: updateItems,
      };
    });
  };


  // reusable function for adding more achievements items
  const addAchievements = (e) => {
    e.preventDefault();
    addItem('achievements', {
      startingDate: '',
      endingDate: '',
      achievement: 'Best Stylist'
    });
  };


  // reusable function for removing and adding items
  const addItem = (key, newItem) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [key]: [...(prevFormData[key] || []), newItem],
    }));
    toast.info('Item added');
  };
  
  const removeItem = (key, index) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [key]: prevFormData[key]?.filter((_, i) => i !== index) || [],
    }));
    toast.info('Item removed');
  };
  

  // reusable function for adding more experience
  const addExperience = (e) => {
    e.preventDefault();
    addItem('experience', {
      startingDate: '',
      endingDate: '',
      workplaces: 'Ecutz Barbering Shop',
      years: '2 years'
    });
  };


  // reusable function that updates the 'achievements' field in the form data when a change event occurs
  const handleAchievementsChange = (event, index) => {
    handleReusableInputChangeFunc('achievements', index, event);
  };

  // reusable function that updates the 'experience' field in the form data when a change event occurs
  const handleExperienceChange = (event, index) => {
    handleReusableInputChangeFunc('experience', index, event);
  };

   // reusable function for adding more time slots
   const addTimeSlot = (e) => {
    e.preventDefault();
    addItem('timeSlots', {
      day: 'Sunday',
      startingTime: '10:00',
      endingTime: '5:00',
    });
  };  
    // Handle changes to specific time slots

  // reusable function that updates the 'timeSlots' field in the form data when a change event occurs
  const handleTimeSlotsChange = (event, index) => {
    handleReusableInputChangeFunc('timeSlots', index, event);
  };

  

    return (
    <div>
      <h2 className="text-headingColor font-bold text-[24px] leading-9 mb-10">
        Profile Information
        </h2>
        <form onSubmit={updateProfileHandler}>
        <div className="mb-5">
                <p className="form__label">Name*</p>
                <input type="text"
                name='name' 
                value={formData.name} 
                onChange={handleInputChange} 
                placeholder="Full Name" 
                className="form__input mt-1 focus:outline-none focus:border-primaryColor"/>
            </div>
            <div className="mb-5">
                <p className="form__label">Email*</p>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  placeholder="Email"
                  className="form__input mt-1 focus:outline-none focus:border-primaryColor"
                  disabled
                />
            </div>
            <div className="mb-5">
                <p className="form__label">Phone Number*</p>
                <input type="number"
                name='phone' 
                value={formData.phone} 
                onChange={handleInputChange} 
                placeholder="Phone Number" 
                className="form__input mt-1 focus:outline-none focus:border-primaryColor"
                
                />
            </div>
            <div className="mb-5">
                <p className="form__label">Bio*</p>
                <input type="text"
                name='bio' 
                value={formData.bio} 
                onChange={handleInputChange} 
                placeholder="Bio"
                maxLength={100}
                className="form__input mt-1 focus:outline-none focus:border-primaryColor"
                
                />
            </div>

            <div className="mb-5">
              <div className="grid grid-cols-3 gap-5 mb-[30px] ">
                <div>
                  <p className="form__label">Gender*</p>
                  <select name="gender" 
                  value={formData.gender} 
                  onChange={handleInputChange}
                  className="form__input py-3.5"
                  aria-label="Select Gender"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <p className="form__label">Specialization*</p>
                  <select name="specialization" 
                  value={formData.specialization} 
                  onChange={handleInputChange}
                  className="form__input py-3.5">
                    <option value="">Select</option>
                    <option value="shaving">Shaving</option>
                    <option value="braiding">Braiding</option>
                    <option value="hairstyling">Hair Styling</option>
                  </select>
                </div>

                {/* <div>
                  <p>Ticket Price</p>
                </div> */}
              </div>
            </div>
            <div>
              {/* <ServiceManagement/> */}
            </div>

        {/* Achievements Section */}
        <div className="mb-5">
          <p className="form__label">Achievements</p>
          {formData.achievements?.map((item, index) => (
            <div key={index}>
              <div className="grid grid-cols-2 gap-5 mt-5">
                <div>
                  <p className="form__label">Starting Date</p>
                  <input
                    type="date"
                    name="startingDate"
                    value={item.startingDate}
                    className="form__input mt-1 focus:outline-none focus:border-primaryColor"
                    onChange={(e) => handleAchievementsChange(e, index)}
                  />
                </div>
                <div>
                  <p className="form__label">Ending Date</p>
                  <input
                    type="date"
                    name="endingDate"
                    value={item.endingDate}
                    className="form__input mt-1 focus:outline-none focus:border-primaryColor"
                    onChange={(e) => handleAchievementsChange(e, index)}
                  />
                </div>
                <div>
                  <p className="form__label">Type Of Achievement</p>
                  <input
                    type="text"
                    name="achievement"
                    value={item.achievement}
                    className="form__input mt-1 focus:outline-none focus:border-primaryColor"
                    onChange={(e) => handleAchievementsChange(e, index)}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeItem('achievements', index)}
                className='bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px] cursor-pointer'
              >
                <AiOutlineDelete />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addAchievements}
            className='bg-[#000] py-2 px-5 h-fit text-white cursor-pointer btn mt-0 rounded-[0px] rounded-r-md'
          >
            Add Achievement
          </button>
        </div>

        {/* Experience Section */}
        <div className="mb-5">
          <p className="form__label">Experience</p>
          {formData.experience?.map((item, index) => (
            <div key={index}>
              <div className="grid grid-cols-2 gap-5 mt-5">
                <div>
                  <p className="form__label">Starting Date</p>
                  <input
                    type="date"
                    name="startingDate"
                    value={item.startingDate}
                    className="form__input mt-1 focus:outline-none focus:border-primaryColor"
                    onChange={(e) => handleExperienceChange(e, index)}
                  />
                </div>
                <div>
                  <p className="form__label">Ending Date</p>
                  <input
                    type="date"
                    name="endingDate"
                    value={item.endingDate}
                    className="form__input mt-1 focus:outline-none focus:border-primaryColor"
                    onChange={(e) => handleExperienceChange(e, index)}
                  />
                </div>
                <div>
                  <p className="form__label">Workplaces</p>
                  <input
                    type="text"
                    name="workplaces"
                    value={item.workplaces}
                    className="form__input mt-1 focus:outline-none focus:border-primaryColor"
                    onChange={(e) => handleExperienceChange(e, index)}
                  />
                </div>
                <div>
                  <p className="form__label">Years of Practice</p>
                  <input
                    type="text"
                    name="years"
                    value={item.years}
                    className="form__input mt-1 focus:outline-none focus:border-primaryColor"
                    onChange={(e) => handleExperienceChange(e, index)}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeItem('experience', index)}
                className='bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px] cursor-pointer'
              >
                <AiOutlineDelete />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addExperience}
            className='bg-[#000] py-2 px-5 h-fit text-white cursor-pointer btn mt-0 rounded-[0px] rounded-r-md'
          >
            Add Experience
          </button>
        </div>

        {/* Time Slots Section */}
        <div className="mb-5">
          <p className="form__label">Time Slots</p>
          {formData.timeSlots?.map((item, index) => (
            <div key={index}>
              <div className="grid grid-cols-2 md:grid-cols-4 mb-[30px] gap-5 mt-5">
                <div>
                  <p className="form__label">Day</p>
                  <select
                    name="day"
                    value={item.day}
                    className="form__input py-3.5"
                    onChange={(e) => handleTimeSlotsChange(e, index)}
                  >
                    <option value="">Select</option>
                    <option value="monday">Monday</option>
                    <option value="tuesday">Tuesday</option>
                    <option value="wednesday">Wednesday</option>
                    <option value="thursday">Thursday</option>
                    <option value="friday">Friday</option>
                    <option value="saturday">Saturday</option>
                    <option value="sunday">Sunday</option>
                  </select>
                </div>
                <div>
                  <p className="form__label">Starting Time</p>
                  <input
                    type="time"
                    name="startingTime"
                    value={item.startingTime}
                    className="form__input mt-1 focus:outline-none focus:border-primaryColor"
                    onChange={(e) => handleTimeSlotsChange(e, index)}
                  />
                </div>
                <div>
                  <p className="form__label">Ending Time</p>
                  <input
                    type="time"
                    name="endingTime"
                    value={item.endingTime}
                    className="form__input mt-1 focus:outline-none focus:border-primaryColor"
                    onChange={(e) => handleTimeSlotsChange(e, index)}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeItem('timeSlots', index)}
                className="bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px] cursor-pointer"
              >
                <AiOutlineDelete />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addTimeSlot}
            className="bg-[#000] py-2 px-5 h-fit text-white cursor-pointer btn mt-0 rounded-[0px] rounded-r-md"
          >
            Add Time Slot
          </button>
        </div>


        
{/* ================= About ===============*/}
            <div className="mb-5">
              <p className="form__label">About*</p>
              <textarea 
              name="about" 
              rows={5} 
              value={formData.about} 
              placeholder="Write About Yourself"
              onChange={handleInputChange} 
              className="form__input focus:border-primaryColor"></textarea>
            </div>
{/* =============== Profile Picture =============== */}
            <div className="mb-5 flex items-center gap-3">
            {formData.profilePicture && (
                  <figure className='w-[60px] h-[60px] rounded-full border-2 border-solid
                    border-primaryColor flex items-center justify-center overflow-hidden bg-[#f5f5f5]'>
                    <img 
                      src={previewURL} 
                      alt='profile'
                      className='w-full object-cover'
                    />
                  </figure>
                )}

                {/* Photo upload input */}
                <div className='relative w-[130px] h-[50px]'>
                  <input 
                    type="file"
                    name='profilePicture'
                    id='customFile'
                    onChange={handleFileInputChange}
                    accept='.jpg, .jpeg, .png'
                    className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
                  />

                  {/* Custom styled upload button */}
                  <label 
                    htmlFor="customFile" 
                    className='absolute top-0 left-0 w-full h-full flex
                      items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46]
                      text-headingColor font-semibold rounded-lg truncate cursor-pointer'
                  >
                    Upload Photo
                  </label>
                </div>
            </div>

            <div className='mt-7'>
              <button
              type="submit"
              onClick={updateProfileHandler}
               className="bg-primaryColor py-3 px-4 h-fit text-white text-[18px] leading-[30px] cursor-pointer min-w-40 rounded-lg">Update Profile</button>
            </div>

        </form>
    </div>
  );
};

export default Profile;
