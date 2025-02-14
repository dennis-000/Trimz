import Loader from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";
import useGetProfile from "../../hooks/useFetchData";
import { BASE_URL } from "../../config";
import Tabs from "./Tabs";
// import { barbers } from "../../assets/data/barbers";
import { useContext, useEffect, useState } from "react";
import BarberAbout from './../../pages/Barbers/BarberAbout';
import Profile from "./Profile";
import starIcon from '../../assets/images/star.png'
import { AuthContext } from "../../context/AuthContext";

import Appointments  from "./Appointments";
import Service from "./Service";
import GalleryUpload from "./GalleryUpload";
const Dashboard = () => {
    const {user} = useContext(AuthContext)
  const { data,
    
     loading, 
     error } = useGetProfile(`${BASE_URL}users/${user._id}`);
     
  const [tab, setTab] = useState('overview');
  const [appointments, setAppointments] = useState([]);

  // ✅ Fetch Appointments in useEffect
  useEffect(() => {
    const getAppointmentsData = async () => {
      try {
        const response = await fetch(`${BASE_URL}appointments/provider`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const result = await response.json();
        console.log(result);
        setAppointments(result.data); // Correctly setting state
      } catch (error) {
        console.error("Error fetching appointments:", error.message);
      }
    };

    getAppointmentsData();
  }, []); // ✅ Runs once when component mounts

  // console.log("Profile Picture URL:", data?.profilePicture);
  // console.log("Profile Picture URL:", data?.user?.profilePicture);

  return (
    <section>
      <div className="max-w-[1170px] px-5 mx-auto">
        {loading && <Loader />}
        {error && <Error />}

        {!loading && !error && (
          <div className="grid lg:grid-cols-3 gap-[30px] lg:gap-[50px]">
            <Tabs tab={tab} setTab={setTab} />

            <div className="lg:col-span-2">
            {console.log('Data:', data)}
            

{/* ================ This is not working ============== */}
            {/* ===== Not Approved ======  */}
            
            {data?.isApproved === 'pending' && (
              
              <div className="flex p-4 mb-4 text-red-800 bg-red-400 rounded-lg">
              <span role="img" aria-label="alert" className="mr-2">
                ⚠️
              </span>
              <div className="text-sm font-medium">
                To get approval, please complete your profile. We&apos;ll review and approve within 2 days.
              </div>
            </div>
)}

<div className="mt-8">
  {tab === 'overview' && (
    <div>
      <div className="flex items-center gap-4 mb-10">
        <figure className="w-[200px] h-[200px]">
          <img
            src={data?.profilePicture?.url || '/placeholder.jpg'}
            alt="Profile Picture"
            className="w-full h-full object-cover rounded-full"
          />
        </figure>
       
                    <div>
                      <span className="bg-[#CCF0F3] text-irisBlueColor py-1 px-4 lg:py-2 lg:px-6 rounded text-[12px] leading-4 
                      lg:text-[16px] lg:leading-6 font-semibold">
                        {data.specialization}
                        
                      </span>

                      <h3 className="text-[22px] leading-9 font-bold text-headingColor mt-3">
                      {data.name}
                        </h3>

                        <div className="flex items-center gap-[6px]">
                          <span className="flex items-center gap-[6px] text-headingColor text-[14px] 
                          leading-5 lg:text-[16px] lg:leading-6 font-semibold">
                            <img src={starIcon }alt="" />
                            {data.averageRating}
                            </span>
                          <span className=" text-textColor text-[14px] 
                          leading-5 lg:text-[16px] lg:leading-6 font-semibold">
                            ({data.totalRating})
                            </span>
                        </div>

                        <p className="text__para font-[15px] lg:max-w-[390px] leading-6">
                          {data?.bio}
                          </p>
                    </div>
                    
              </div>
                  <BarberAbout 
                  name={data?.name} 
                  about={data?.about}
                  achievements={data?.achievements} 
                  experience={data?.experience}
                  />
                  </div>
  )
  
                  }
                  

                {tab==='appointments' && 
                <Appointments appointments={appointments}/>}
                {tab==='settings' && <Profile barberData={data}/>}
                {tab==='services' && <Service barberData={data}/>}
                {tab==='galleryupload' && <GalleryUpload providerId={JSON.parse(localStorage.getItem('user'))._id}/>}
                </div>
                
                
            </div>
          </div>
        )}
      </div>
      
      {/* <div>
      <Appointment/>
      </div> */}
    </section>
  );
};

// Debugging barbers data (uncomment for debugging)

// console.log("Barber Data:", barbers);

export default Dashboard;
