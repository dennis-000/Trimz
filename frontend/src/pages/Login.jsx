import {useState, useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';
import { toast } from 'react-toastify';
import {AuthContext} from '../context/AuthContext.jsx'
import HashLoader from 'react-spinners/BeatLoader';
import logo from '../assets/images/ecutz.png'

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

      // After successful login
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: result.data,
          token: result.token,
          role: result.data.role,
        },
      });

      // Log the role for debugging
      console.log("User Role:", result.data.role);

      // Dynamically navigate based on role
      if (result.data.role === 'user') {
        navigate('/users/profile/me'); // Redirect to user dashboard
      } else if (result.data.role === 'barber') {
        navigate('/barber/profile/me'); // Redirect to barber dashboard
      } else {
        navigate('/home'); // Fallback navigation
      }

      setLoading(false); // Stop loading state
      toast.success(result.message); // Show success message
    } catch (err) {
      // Handle login errors
      toast.error(err.message); // Show error message
      setLoading(false); // Stop loading state
    }
  };


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

          <div className='mt-7 flex justify-center'>
            <button type='submit' className='w-64 bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3'>
              {loading ? <HashLoader size={25} color='#fff'/> : 'Login'}
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