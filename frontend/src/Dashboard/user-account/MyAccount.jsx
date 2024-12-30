import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

import MyAppointments from './MyAppointments';
import Profile from './Profile';

import useGetProfile from '../../hooks/useFetchData';
import { BASE_URL } from '../../config';

import Loading from '../../components/Loading/Loading';
import Error   from '../../components/Error/Error';


const MyAccount = () => {
  const { dispatch } = useContext(AuthContext);
  const [tab, setTab] = useState('bookings'); // Default active tab
  // eslint-disable-next-line no-unused-vars
  const {user, role, token} = useContext(AuthContext)

  const { 
    data: userData, 
    loading, 
    error 
  } = useGetProfile(`${BASE_URL}users/${user._id}`);
  
  console.log(userData, 'userData');

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
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
              <img
                src={userData.profilePicture}
                alt="The user's image"
                className="w-full h-full rounded-full"
              />
            </figure>
            
          </div>


           

          <div className="text-center mt-4">
          <div className="mt-4 text-center">
              <h4 className="text-[16px] font-semibold text-headingColor mb-2">Bio</h4>
              <p className="text-textColor text-[14px] leading-6 italic">
                {userData.bio}
              </p>
            </div>
            <h3 className="text-[18px] leading-[30px] text-headingColor font-bold">{userData.name}</h3>
            <p className="text-textColor text-[15px] leading-6 font-medium">{userData.email}</p>
            <p className="text-textColor text-[15px] leading-6 font-medium">{userData.phone}</p>
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