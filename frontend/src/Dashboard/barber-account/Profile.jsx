/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../config';

import TimeSlotSection from './TimeSlotSection';

const Profile = ({ barberData }) => {
  const [previewURL, setPreviewURL] = useState('');
  const [formData, setFormData] = useState({
    // Initial state for the profile form data
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
    // services: [], // If needed later
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
        // Note: we're mapping workingHours from barberData to timeSlots here
        timeSlots: barberData.workingHours || [],
        about: barberData.about || '',
        profilePicture: barberData.profilePicture || "/api/placeholder/100/100",
      });
      // Set preview URL from barberData if available
      if (barberData.profilePicture?.url) {
        setPreviewURL(barberData.profilePicture.url);
      } else {
        setPreviewURL(barberData.profilePicture);
      }
    }
  }, [barberData]);

  useEffect(() => {
    return () => {
      console.log("Cleaning up previewURL:", previewURL);
      if (typeof previewURL === 'string' && previewURL.startsWith('blob:')) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [previewURL]);  

  // Handle form input changes for text fields
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input change for profile picture
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png'];
      if (!validImageTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload a JPEG or PNG image.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds 5MB.');
        return;
      }
      // Generate a preview URL for the image and update state
      const objectURL = URL.createObjectURL(file);
      setPreviewURL(objectURL);
      setFormData({ ...formData, profilePicture: file });
    }
  };

  // Reusable function to handle changes for array-type fields (e.g. achievements, experience)
  const handleReusableInputChangeFunc = (key, index, event) => {
    const { name, value } = event.target;
    setFormData(prev => {
      const updatedItems = [...prev[key]];
      updatedItems[index] = { ...updatedItems[index], [name]: value };
      return { ...prev, [key]: updatedItems };
    });
  };

  // Function to add new achievement items
  const addAchievements = (e) => {
    e.preventDefault();
    addItem('achievements', {
      date: '',
      description: '',
      title: 'Best Stylist',
    });
  };

  // Reusable function for adding an item to an array field
  const addItem = (key, newItem) => {
    setFormData(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), newItem],
    }));
    toast.info('Item added');
  };

  // Reusable function for removing an item from an array field
  const removeItem = (key, index) => {
    setFormData(prev => ({
      ...prev,
      [key]: prev[key]?.filter((_, i) => i !== index) || [],
    }));
    toast.info('Item removed');
  };

  // Function to add new experience item
  const addExperience = (e) => {
    e.preventDefault();
    addItem('experience', {
      startingDate: '',
      endingDate: '',
      workplace: 'Ecutz Barbering Shop',
      role: '',
      description: '',
    });
  };

  // Handlers for achievements and experience changes
  const handleAchievementsChange = (event, index) => {
    handleReusableInputChangeFunc('achievements', index, event);
  };

  const handleExperienceChange = (event, index) => {
    handleReusableInputChangeFunc('experience', index, event);
  };

  // Submit the updated profile data
  const updateProfileHandler = async (e) => {
    e.preventDefault();
    try {
      const updateData = new FormData();
      // Append each field from formData. If the field is an object (like achievements or experience), stringify it.
      Object.keys(formData).forEach(key => {
        if (key !== "profilePicture") {
          if (typeof formData[key] === "object") {
            updateData.append(key, JSON.stringify(formData[key]));
          } else {
            updateData.append(key, formData[key]);
          }
        }
      });
      // Append profilePicture if it's a file
      if (formData.profilePicture instanceof File) {
        updateData.append('profilePicture', formData.profilePicture);
      }
      // (Optional) Log all FormData entries for debugging
      for (let [key, value] of updateData.entries()) {
        console.log(key, value);
      }

      const token = localStorage.getItem('token');
      const res = await fetch(`${BASE_URL}users/${barberData._id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: updateData,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      }
      // Update localStorage with new user data
      localStorage.setItem('user', JSON.stringify(result.data));
      localStorage.setItem('role', result.data.role);
      localStorage.setItem('token', token);

      toast.success(result.message);
      // Reload the page or update parent state to reflect changes immediately
      window.location.reload();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h2 className="text-headingColor font-bold text-[24px] leading-9 mb-10">
        Profile Information
      </h2>
      <form onSubmit={updateProfileHandler}>
        {/* Name Field */}
        <div className="mb-5">
          <p className="form__label">Name*</p>
          <input 
            type="text"
            name="name" 
            value={formData.name} 
            onChange={handleInputChange} 
            placeholder="Full Name" 
            className="form__input mt-1 focus:outline-none focus:border-primaryColor"
          />
        </div>

        {/* Email Field (Read-only) */}
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

        {/* Phone Field */}
        <div className="mb-5">
          <p className="form__label">Phone Number*</p>
          <input 
            type="number"
            name="phone" 
            value={formData.phone} 
            onChange={handleInputChange} 
            placeholder="Phone Number" 
            className="form__input mt-1 focus:outline-none focus:border-primaryColor"
          />
        </div>

        {/* Bio Field */}
        <div className="mb-5">
          <p className="form__label">Bio*</p>
          <input 
            type="text"
            name="bio" 
            value={formData.bio} 
            onChange={handleInputChange} 
            placeholder="Bio"
            maxLength={100}
            className="form__input mt-1 focus:outline-none focus:border-primaryColor"
          />
        </div>

        {/* Gender and Specialization */}
        <div className="mb-5 flex items-center justify-between">
          <label className="text-textColor font-semibold text-[15px] leading-7">
            Gender:
            <select 
              name="gender" 
              value={formData.gender} 
              onChange={handleInputChange}
              className="form__input py-3.5"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label className="text-textColor font-semibold text-[15px] leading-7">
            Specialization:
            <select 
              name="specialization" 
              value={formData.specialization} 
              onChange={handleInputChange}
              className="form__input py-3.5"
            >
              <option value="">Select</option>
              <option value="Shaving">Shaving</option>
              <option value="Braiding">Braiding</option>
              <option value="Hairstyling">Hair Styling</option>
            </select>
          </label>
        </div>

        {/* Achievements Section */}
        <div className="mb-5">
          <p className="form__label">Achievements</p>
          {formData.achievements?.map((item, index) => (
            <div key={index}>
              <div className="grid grid-cols-2 gap-5 mt-5">
                <div>
                  <p className="form__label">Date</p>
                  <input
                    type="date"
                    name="date"
                    value={item.date ? new Date(item.date).toISOString().split('T')[0] : ''}
                    className="form__input mt-1 focus:outline-none focus:border-primaryColor"
                    onChange={(e) => handleAchievementsChange(e, index)}
                  />
                </div>
                <div>
                  <p className="form__label">Description</p>
                  <input
                    type="text"
                    name="description"
                    value={item.description}
                    className="form__input mt-1 focus:outline-none focus:border-primaryColor"
                    onChange={(e) => handleAchievementsChange(e, index)}
                  />
                </div>
                <div>
                  <p className="form__label">Title</p>
                  <input
                    type="text"
                    name="title"
                    value={item.title}
                    className="form__input mt-1 focus:outline-none focus:border-primaryColor"
                    onChange={(e) => handleAchievementsChange(e, index)}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeItem('achievements', index)}
                className="bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px] cursor-pointer"
              >
                <AiOutlineDelete />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addAchievements}
            className="bg-[#000] py-2 px-5 h-fit text-white cursor-pointer btn mt-0 rounded-[0px] rounded-r-md"
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
                    value={item.startingDate ? new Date(item.startingDate).toISOString().split('T')[0] : ''}
                    className="form__input mt-1 focus:outline-none focus:border-primaryColor"
                    onChange={(e) => handleExperienceChange(e, index)}
                  />
                </div>
                <div>
                  <p className="form__label">Ending Date</p>
                  <input
                    type="date"
                    name="endingDate"
                    value={item.endingDate ? new Date(item.endingDate).toISOString().split('T')[0] : ''}
                    className="form__input mt-1 focus:outline-none focus:border-primaryColor"
                    onChange={(e) => handleExperienceChange(e, index)}
                  />
                </div>
                <div>
                  <p className="form__label">Workplace</p>
                  <input
                    type="text"
                    name="workplace"
                    value={item.workplace}
                    className="form__input mt-1 focus:outline-none focus:border-primaryColor"
                    onChange={(e) => handleExperienceChange(e, index)}
                  />
                </div>
                <div>
                  <p className="form__label">Role</p>
                  <input
                    type="text"
                    name="role"
                    value={item.role}
                    className="form__input mt-1 focus:outline-none focus:border-primaryColor"
                    onChange={(e) => handleExperienceChange(e, index)}
                  />
                </div>
                <div>
                  <p className="form__label">Description</p>
                  <input
                    type="text"
                    name="description"
                    value={item.description}
                    className="form__input mt-1 focus:outline-none focus:border-primaryColor"
                    onChange={(e) => handleExperienceChange(e, index)}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeItem('experience', index)}
                className="bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px] cursor-pointer"
              >
                <AiOutlineDelete />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addExperience}
            className="bg-[#000] py-2 px-5 h-fit text-white cursor-pointer btn mt-0 rounded-[0px] rounded-r-md"
          >
            Add Experience
          </button>
        </div>

        <TimeSlotSection formData={formData} setFormData={setFormData} />

        {/* About Section */}
        <div className="mb-5">
          <p className="form__label">About*</p>
          <textarea 
            name="about" 
            rows={5} 
            value={formData.about} 
            placeholder="Write About Yourself"
            onChange={handleInputChange} 
            className="form__input focus:border-primaryColor"
          ></textarea>
        </div>

        {/* Profile Picture Section */}
        <div className="mb-5 flex items-center gap-3">
          {formData.profilePicture && (
            <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center overflow-hidden bg-[#f5f5f5]">
              <img 
                src={previewURL} 
                alt="profile" 
                className="w-full object-cover"
              />
            </figure>
          )}

          <div className="relative w-[130px] h-[50px]">
            <input 
              type="file"
              name="profilePicture"
              id="customFile"
              onChange={handleFileInputChange}
              accept=".jpg, .jpeg, .png"
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />

            <label 
              htmlFor="customFile"
              className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
            >
              Upload Photo
            </label>
          </div>
        </div>

        <div className="mt-7">
          <button
            type="submit"
            onClick={updateProfileHandler}
            className="bg-primaryColor py-3 px-4 h-fit text-white text-[18px] leading-[30px] cursor-pointer min-w-40 rounded-lg"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;