/* eslint-disable no-undef */
import signupImg from '../assets/images/signup.gif';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { BASE_URL } from '../config';
import {toast} from 'react-toastify';
import HashLoader from 'react-spinners/BeatLoader';

const Signup = () => {
  // State for handling file upload preview
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState();
  
  // State for managing loading state during form submission
  const [loading, setLoading] = useState(false);
  
  // State for confirm password field (separate from main form data)
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Main form data state with initial values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '', // Added phone number field
    profilePicture: selectedFile,
    gender: '',
    role: 'customer',
  });

  // Hook for programmatic navigation
  const navigate = useNavigate()

  // Generic input handler for form fields
  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  };

  // Separate handler for confirm password
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };
  
  // Handler for file input changes (profile photo upload)
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Generate a local preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewURL(reader.result);
      };
      reader.readAsDataURL(file);

      // Update the formData with the selected file
      setSelectedFile(file);
    }
  };

  // Form submission handler
  const submitHandler = async event => {
    event.preventDefault();
    
    // Password validation checks
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    // Password match validation
    if (formData.password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Phone number validation (basic)
    const phoneRegex = /^[0-9]{10}$/; // Assumes 10-digit phone number
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      // Create a FormData object to send the data
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('phone', formData.phone); // Add phone number
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('role', formData.role);
      
      if (selectedFile) {
        formDataToSend.append('profilePicture', selectedFile);
      }
      // const token = localStorage.getItem('token');

      const res = await fetch(`${BASE_URL}users`, {
        method: 'post',
        headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),

      });


      const { message } = await res.json();

      // Handle unsuccessful registration
      if (!res.ok) {
        throw new Error(message);
      }

      // Handle successful registration
      setLoading(false);
      toast.success(message);
      navigate('/login');
    
    } catch (err) {
      // Handle registration errors
      toast.error(err.message);
      setLoading(false);
    }
  };
    
  return (
    <section className='px-5 xl:px-0'>
      <div className='max-w-[1000px] mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-2'>
          {/* Left side - Image display (hidden on mobile) */}
          <div className='hidden lg:block bg-primaryColor rounded-l-lg'>
            <figure className='rounded-l-lg'>
              <img src={signupImg} alt='SignUp Image' className='w-full rounded-l-lg'/>
            </figure>
          </div>

          {/* Right side - Signup form */}
          <div className='rounded-l-lg lg:pl-16 py-10'>
            <h3 className='text-headingColor text-[22px] leading-9 font-bold mb-10'>
              Create an
              <span className='text-primaryColor'> Account</span>
            </h3>

            {/* Sign up form */}
            <form onSubmit={submitHandler}>
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
                  required 
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
                  required 
                />
              </div>

              {/* Phone number input field */}
              <div className='mb-5'>
                <input
                  type="tel"
                  placeholder='Phone Number (10 digits)'
                  name='phone'
                  value={formData.phone}
                  onChange={handleInputChange}
                  className='w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
                    focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                    placeholder:text-textColor rounded-md cursor-pointer'
                  pattern="[0-9]{10}"
                  required 
                />
                <p className="text-xs text-textColor mt-1">Please enter a 10-digit phone number</p>
              </div>

              {/* Existing password and confirm password fields */}
              <div className='mb-5'>
                <input
                  type="password"
                  placeholder='Password'
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  className='w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
                    focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                    placeholder:text-textColor rounded-md cursor-pointer'
                  required 
                />
                <p className="text-xs text-textColor mt-1">Password must be at least 6 characters long</p>
              </div>

              <div className='mb-5'>
                <input
                  type="password"
                  placeholder='Confirm Password'
                  name='confirmPassword'
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className='w-full pr-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
                    focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
                    placeholder:text-textColor rounded-md cursor-pointer'
                  required 
                />
              </div>

              {/* Role and Gender selection container */}
              <div className='mb-5 flex items-center justify-between'>
                {/* Role selection dropdown */}
                <label className='text-textColor font-semibold text-[15px] leading-7'>
                  Are you a:
                  <select
                    value={formData.role}
                    onChange={handleInputChange}
                    name="role"
                    className="text-textColor font-semibold text-[15px] leading-7 px-4 py-3
                      focus:outline-none"
                  >
                    <option value="provider">Barber/Stylist</option>
                    <option value="customer">User</option>
                  </select>
                </label>
                
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
                {/* Preview selected photo if available */}
                {selectedFile && (
                  <figure className='w-[60px] h-[60px] rounded-full border-2 border-solid
                    border-primaryColor flex items-center justify-center overflow-hidden bg-[#f5f5f5]'>
                    <img 
                      src={previewURL} 
                      alt="" 
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

              {/* Submit button with loading state */}
              <div className='mt-7 flex justify-center'>
                <button
                  disabled={loading}  // Disable button while loading
                  type='submit' 
                  className='w-64 bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3'
                >
                  {/* Show loader or 'Sign Up' text based on loading state */}
                  {loading ? <HashLoader size={35} color='#ffffff'/> : 'Sign Up'}
                </button>
              </div>

              {/* Login link for existing users */}
              <p className='mt-5 text-textColor text-center'>
                Already have an account? 
                <Link to='/login' className='text-primaryColor font-medium mt-1'> 
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Signup