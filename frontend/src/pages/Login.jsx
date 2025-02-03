import {useState, useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';
import { toast } from 'react-toastify';
import {AuthContext} from '../context/AuthContext.jsx'
import HashLoader from 'react-spinners/BeatLoader';
import logo from '../assets/images/ecutz.png'
import { FcGoogle } from 'react-icons/fc'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  

  // Loading State
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form submission handler
  const submitHandler = async (event) => {
    event.preventDefault(); // Prevent default form submission

    setLoading(true); // Start loading state

    try {
      // Send login request to backend
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send form data as JSON
      });

      const result = await res.json(); // Extract message from response

      // Log response for debugging
      console.log(result);

      // Handle unsuccessful login
      if (!res.ok) {
        throw new Error(result.message);
      }

      const userRole = result.data.role;

      // After successful login
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: result.data,
          token: result.token,
          role: userRole,
        },
      });

      // Log the role for debugging
      console.log("User Role:", result.data.role);

      // Dynamically navigate based on role
      if (userRole === 'user') {
        navigate('/users/profile/me', {replace: true}); // Redirect to user dashboard
      } else if (userRole === 'barber') {
        navigate('/barber/profile/me', {replace: true}); // Redirect to barber dashboard
      } else {
        navigate('/home', {replace: true}); // Fallback navigation
      }

      toast.success(result.message); // Show success message
      setLoading(false); // Stop loading state
    } catch (err) {
      // Handle login errors
      toast.success(err.message); // Show error message
      setLoading(false); // Stop loading state
    }
    
  };
  
  //Add forgotPassword handler
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if(!formData.email){
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}auth/forgot-password`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const result = await res.json();

      if(!res.ok){
        throw new Error(result.message);
      }

      toast.success('Password reset link sent to your email. Please check your inbox.');
      setLoading(false);

    } catch(err) {
      toast.error(err.message);
      setLoading(false);
    }
  };


  const handleOauth = async () => {
    try {
      window.location.href = "http://localhost:5000/api/auth/google";
      
    }catch(err){
      toast.error(err.message)
    }
  }


  return (
    <section className='px-5 lg:px-0 min-h-screen flex items-center justify-center'>
      <div className='w-full max-w-[500px] mx-auto bg-white/90 rounded-lg shadow-[0_5px_20px_rgba(0,0,0,0.1)] md:p-10 p-6 backdrop-blur-sm my-8'>    {/* Added Logo Section */}
        <div className="flex justify-center mb-8">
          <Link to="/">
            <img 
              src={logo} 
              alt="Ecutz Logo" 
              className="h-20 w-auto cursor-pointer"
            />
          </Link>
        </div>

        <h3 className='text-headingColor text-center text-[22px] leading-9 font-bold mb-10'>
          Hello!  <span className='text-primaryColor'>Welcome</span>  Back 🎉
        </h3>

        <form className="py-4 md:py-0" onSubmit={submitHandler}>
          {/* ===== EMAIL ===== */}
          <div className='mb-5'>
            <input
              type="email"
              placeholder='Enter Your Email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              className='w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
            focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
            placeholder:text-textColor
            rounded-md cursor-pointer'
              required />
          </div>
            {/* === PASSWORD ===== */}
          <div className='mb-5'>
            <input
              type="password"
              placeholder='Password'
              name='password' value={formData.password}
              onChange={handleInputChange}
              className='w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
            focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
            placeholder:text-textColor
            rounded-md cursor-pointer'
              required />
          </div>

          {/* Forgot Password */}
          <div className='text-right mb-4'>
            <button
            type='button'
            onClick={handleForgotPassword}
            className='text-primaryColor text-[16px] leading-7 text-headingColor hover:underline'>
              Forgot Password?
            </button>
          </div>

          <div 
          className='flex justify-center'>
            <button 
            type='submit' 
            className="w-full relative bg-primaryColor text-white text-lg font-semibold rounded-xl
            px-6 py-4 shadow-lg hover:shadow-primaryColor/30
            transform hover:-translate-y-0.5 active:translate-y-0
            transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed
            disabled:hover:shadow-none disabled:hover:translate-y-0">

          <div className="flex items-center justify-center min-h-[30px]">
              {loading ? (<HashLoader size={25} color='#fff'/>)
               :(
                <span>Login</span>
               )}
              </div>
            </button>
          </div>

          {/* Divider */}
            <div className="flex items-center gap-4 my-2">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-500 text-sm font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>


          {/* Google Auth Button */}
                <div>
                  <button 
                    onClick={handleOauth}
                    className="group relative w-full bg-white text-gray-700 font-medium
                             rounded-xl border border-gray-300 shadow-sm
                             hover:shadow-lg hover:border-gray-400
                             transition-all duration-200 overflow-hidden"
                  >
                    {/* Colored top border */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r 
                                  from-[#4285F4] via-[#34A853] to-[#FBBC05]"></div>
                    
                    {/* Button content */}
                    <div className="flex items-center justify-center gap-3 px-6 py-4">
                      <FcGoogle className="text-2xl" />
                      <span className="font-roboto">Sign in with Google</span>
                    </div>
          
                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r 
                                  from-[#4285F4]/5 via-[#34A853]/5 to-[#FBBC05]/5 
                                  opacity-0 group-hover:opacity-100 
                                  transition-opacity duration-200" />
                  </button>
                </div>

          <p className='mt-5 text-textColor text-center'>
            {/* Don&apos;t have an account? */}
            New to Ecutz? 
            <Link to='/register' className='text-primaryColor font-medium mt-1'>
               Register
            </Link>
          </p>
        </form>
      </div>
      
    </section>
  );
}

export default Login;