/* eslint-disable react/prop-types */
 // import avatar from '../assets/images/doctor-img01.png';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../../config';
import {toast} from 'react-toastify';
import HashLoader from 'react-spinners/BeatLoader';

const Profile = ({user}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    newPassword: '', 
    profilePicture: null,
    gender: '',
    phone: '',
    bio: '',  
  });
  console.log('user', user);
  // Hook for programmatic navigation
  const navigate = useNavigate()

  useEffect(()=>{
    setFormData({
      name: user.name, 
      email: user.email, 
      gender: user.gender, 
      phone: user.phone,
      bio: user.bio || '',  // Set bio from user object, default to empty string
      newPassword: '',
    })
  }, [user])

  // Generic input handler for form fields
  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Separate handler for confirm password
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };
  
  // Handler for file input changes (profile photo upload)
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      console.log('File', file);

  }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
  
    // Password validation and reset logic
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return;
      }
      if (formData.newPassword !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
    }
  
    setLoading(true); // Start loading state
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('bio', formData.bio);
  
      if (formData.newPassword) {
        formDataToSend.append('password', formData.newPassword);
      }
  
      if (selectedFile) {
        formDataToSend.append('profilePicture', selectedFile);
      }
      const token = localStorage.getItem('token');

      const res = await fetch(`${BASE_URL}users/${user._id}`, {
        method: 'PATCH',
        headers: {
              // "Content-Type": "application/json",
              
              Authorization: `Bearer ${token}`,
            },
            body: formDataToSend,

      });
      // console.log('Result',res);

      // console.log(token, 'TOKEN')
      console.log('Name', formData.name)
      console.log('File', formData.selectedFile)
      console.log('FormData', formDataToSend)
  
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message);
      }
      
      localStorage.setItem('user', JSON.stringify(data.data));
      localStorage.setItem('role', data.data.role);
      localStorage.setItem('token', token);

      
      setLoading(false);
      toast.success('Profile updated successfully!');

      // Optional: Clear password fields after successful update
      setFormData((prev) => ({
        ...prev,
        newPassword: '',
      }));
      setConfirmPassword('');

      // Optional: navigate only if specified
      navigate('/users/profile/me');
      window.location.reload();
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };
   


  return (
    <div className='mt-10'>
       <form onSubmit={submitHandler}>

        {/* New Bio Textarea */}
        <div className='mb-5'>
          <textarea
            placeholder='Tell us about yourself (max 300 characters)'
            name='bio'
            value={formData.bio}
            onChange={handleInputChange}
            maxLength={300}
            className='w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
              focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
              placeholder:text-textColor rounded-md cursor-pointer'
            rows={4}
          />
          <p className='text-sm text-gray-500 mt-1'>
            {formData.bio ? `${formData.bio.length}/300` : '0/300'} characters
          </p>
        </div>

              {/* Name input field */}
              <div className='mb-5'>
                <input
                  type="text"
                  placeholder='Full Name'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  className='w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
                    focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                    placeholder:text-textColor rounded-md cursor-pointer'
                />
              </div>

              {/* Email input field */}
              <div className='mb-5'>
                <input
                  type="email"
                  placeholder='Enter your email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  className='w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
                    focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                    placeholder:text-textColor rounded-md cursor-pointer'
                    aria-readonly
                    readOnly
                />
              </div>

              <div className='mb-5'>
                <input
                  type="tel"
                  placeholder='Phone'
                  name='phone'
                  value={formData.phone}
                  onChange={handleInputChange}
                  className='w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
                    focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                    placeholder:text-textColor rounded-md cursor-pointer'
                />
              </div>

              {/* New Password Fields */}
        <div className='mb-5'>
          <input
            type="password"
            placeholder='New Password'
            name='newPassword'
            value={formData.newPassword || ''}
            onChange={handleInputChange}
            className='w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
              focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
              placeholder:text-textColor rounded-md cursor-pointer'
          />
        </div>

        <div className='mb-5'>
          <input
            type="password"
            placeholder='Confirm New Password'
            name='confirmPassword'
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className='w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
              focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
              placeholder:text-textColor rounded-md cursor-pointer'
          />
        </div>


              {/* Role and Gender selection container */}
              <div className='mb-5 flex items-center justify-between'>
                
                
                {/* Gender selection dropdown */}
                <label className='text-textColor font-semibold text-[15px] leading-7'>
                  Gender:
                  <select
                    value={formData.gender}
                    onChange={handleInputChange}
                    name="gender"
                    className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3
                      focus:outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </label>
              </div>  

           {/* Photo upload section */}
<div className='mb-5 flex items-center gap-3'>
  { (
    <figure className='w-[70px] h-[70px] rounded-full border-2 border-solid
        border-primaryColor flex items-center justify-center overflow-hidden bg-[#f5f5f5]'>
      <img 
        src={previewUrl || user.profilePicture.url} 
        alt="profile" 
        className='w-full h-full object-cover'
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
      className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10'
    />

    <label 
      htmlFor="customFile" 
      className='absolute top-0 left-0 w-full h-full flex
        items-center px-4 py-2 text-[15px] leading-6 
        bg-[#0066ff46] hover:bg-[#0066ff61] transition-all
        text-headingColor font-semibold rounded-lg
        cursor-pointer truncate shadow-sm'
    >
      Upload Photo
    </label>
  </div>
</div>


              {/* Submit button with loading state */}
              <div className='mt-7 flex justify-center'>
                <button
                  disabled={loading}  // Disable button while loading
                  type='submit' 
                  className='w-64 bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3'
                >
                  {/* Show loader or 'Sign Up' text based on loading state */}
                  {loading ? <HashLoader size={25} color='#ffffff'/> : 'Update'}
                </button>
              </div>

              
            </form>
    </div>
  )

};

export default Profile;