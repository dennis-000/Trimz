import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../config';
import { toast } from 'react-toastify';
import HashLoader from 'react-spinners/BeatLoader';
import logo from '../assets/images/trimz.png';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}auth/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      console.log(password);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      toast.success('Password reset successful');
      navigate('/login');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='px-5 lg:px-0 min-h-screen flex items-center justify-center'>
      <div className='w-full max-w-[500px] mx-auto bg-white/90 rounded-lg shadow-[0_5px_20px_rgba(0,0,0,0.1)] md:p-10 p-6 backdrop-blur-sm my-8'>
        <div className="flex justify-center mb-8">
          <Link to="/">
            <img src={logo} alt="Ecutz Logo" className="h-20 w-auto cursor-pointer" />
          </Link>
        </div>

        <h3 className='text-headingColor text-center text-[22px] leading-9 font-bold mb-10'>
          Reset Your Password
        </h3>

        <form className="py-4 md:py-0" onSubmit={handleSubmit}>
          <div className='mb-5'>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
              focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
              placeholder:text-textColor rounded-md cursor-pointer'
              required
            />
          </div>

          <div className='mb-5'>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='w-full px-4 py-3 border-b border-solid border-[#0066ff61] focus:outline-none
              focus:border-b-primaryColor text-[16px] leading-7 text-headingColor 
              placeholder:text-textColor rounded-md cursor-pointer'
              required
            />
          </div>

          <div className='mt-7 flex justify-center'>
            <button 
              type='submit' 
              className='w-64 bg-primaryColor text-white text-[18px] leading-[30px] rounded-lg px-4 py-3'
            >
              {loading ? <HashLoader size={25} color='#fff'/> : 'Reset Password'}
            </button>
          </div>

          <p className='mt-5 text-textColor text-center'>
            Remember your password? 
            <Link to='/login' className='text-primaryColor font-medium ml-1'>
              Login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default ResetPassword;
