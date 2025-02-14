import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

import MyAppointments from './MyAppointments';
import Profile from './Profile';

import useGetProfile from '../../hooks/useFetchData';
import { BASE_URL } from '../../config';

import Loading from '../../components/Loading/Loading';
import Error   from '../../components/Error/Error';
import {jwtDecode} from 'jwt-decode';
// import { Navigate } from 'react-router-dom';


const MyAccount = () => {
  const { dispatch } = useContext(AuthContext);
  const [tab, setTab] = useState('bookings'); // Default active tab
  // eslint-disable-next-line no-unused-vars
  const {user, role, token} = useContext(AuthContext)
  const [userData, setUserData] = useState(null); // State to store user data
  const [loading, setLoading] = useState(false); // State for  loading
  const [error, setError] = useState(null); // State for  error

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
  
    if (urlParams.get('method') === 'googleoauth') {
      const initializeAuth = async () => {
        const jwtToken = urlParams.get('token');
  
        if (jwtToken) {
          try {
            const decodedToken = jwtDecode(jwtToken);
            const { id } = decodedToken;
            console.log('Decoded token:', decodedToken);
  
            const response = await fetch(`${BASE_URL}users/${id}`);
            const userData = await response.json();
            console.log(userData);
  
            if (response.ok) {
              const { role } = userData.data;
  
              dispatch({
                type: 'LOGIN',
                payload: {
                  token: jwtToken,
                  user: userData,
                  role,
                },
              });
  
              setUserData(userData.data);
              console.log(userData);
              localStorage.setItem('token', jwtToken);
              localStorage.setItem('user', JSON.stringify(userData.data));
              localStorage.setItem('role', role);
  
              window.history.replaceState({}, document.title, window.location.pathname);
              window.location.reload()
            } else {
              setError('Failed to fetch user role.');
              console.error('Failed to fetch user role:', userData.message);
            }
          } catch (error) {
            setError('Error initializing authentication.');
            console.error('Error initializing auth:', error);
          }
        }
      };
  
      initializeAuth();
    } else {
      const storedUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  
      if (storedUser) {
        setUserData((prev) => (prev ? prev : storedUser)); // Avoid resetting if already set
      }
    }
  }, [dispatch]);
  
  useEffect(() => {
    if (userData && userData._id) {
      const fetchUserProfile = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${BASE_URL}users/${userData._id}`);
          const profileData = await response.json();
  
          if (response.ok) {
            setUserData((prev) => (prev?._id === profileData.data._id ? prev : profileData.data)); // Avoid redundant updates
          } else {
            setError('Failed to load profile.');
          }
        } catch (error) {
          setError('Error fetching profile: ' + error.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUserProfile();
    }
  }, [userData]);
  
  

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    window.location.href = '/login';
  };

  return (
   <section>
     <div className="max-w-[1170px] px-5 mx-auto">

    {loading && !error && <Loading/>}

    { error && !loading && <Error errMessage={error}/>}

     {!loading && !error && (
        <div className="grid md:grid-cols-3 gap-10">
        {/* Sidebar */}
        <div className="pb-[50px] px-[30px] rounded-md">
          <div className="flex items-center justify-center">
            <figure className="w-[100px] h-[100px] rounded-full border-2 border-solid border-primaryColor">
              {userData && userData.profilePicture &&(
                <img
                src={userData.profilePicture.url}
                alt="The user's image"
                className="w-full h-full object-cover object-top rounded-full"
              />)}
            </figure>
            
          </div>


           

          <div className="text-center mt-4">
          <div className="mt-4 text-center">
              <h4 className="text-[16px] font-semibold text-headingColor mb-2">Bio</h4>
              {userData && userData.bio && (<p className="text-textColor text-[14px] leading-6 italic">
                {userData.bio}
              </p>)}
            </div>
            {userData && userData.name &&(<h3 className="text-[18px] leading-[30px] text-headingColor font-bold">{userData.name}</h3>)}
            {userData && userData.email &&(<p className="text-textColor text-[15px] leading-6 font-medium">{userData.email}</p>)}
            {userData && userData.phone &&(<p className="text-textColor text-[15px] leading-6 font-medium">{userData.phone}</p>)}
          </div>

          

          <div className="mt-[50px] md:mt-[100px]">
            <button
              onClick={handleLogout}
              className="w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white font-bold"
            >
              Logout
            </button>
            <button className="w-full bg-red-600 mt-4 p-3 text-[16px] leading-7 rounded-md text-white font-bold">
              Delete Account
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 md:px-[30px]">
          {/* Tab Buttons */}
          <div style={{ position: 'relative', zIndex: 10 }}>
          <button
              onClick={() =>{ console.log('My Bookings button clicked');
                setTab('bookings')}}
              className={`p-2 mr-5 px-5 rounded-md font-semibold text-[16px] leading-7 border border-solid ${
                tab === 'bookings'
                  ? 'bg-primaryColor text-white border-primaryColor'
                  : 'text-headingColor border-gray-300'
              }`}
            >
              My Appointments
            </button>

            <button
              onClick={() => setTab('settings')}
              className={`py-2 px-5 rounded-md font-semibold text-[16px] leading-7 border border-solid ${
                tab === 'settings'
                  ? 'bg-primaryColor text-white border-primaryColor'
                  : 'text-headingColor border-gray-300'
              }`}
            >
              Profile Settings
            </button>
          </div>

          {
          tab ==='bookings' && <MyAppointments/>
          }
          {
            tab==='settings' && <Profile user={userData}/>
          }
        </div>
      </div>
      )
      }
    </div>
   </section>
  );
};

export default MyAccount;