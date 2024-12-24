import Loader from "../../components/Loading/Loading";
import Error from "../../components/Error/Error";
import useGetProfile from "../../hooks/useFetchData";
import { BASE_URL } from "../../config";
import Tabs from "./Tabs";
// import { barbers } from "../../assets/data/barbers";
import { useState } from "react";
import BarberAbout from './../../pages/Barbers/BarberAbout';
import Profile from "./Profile";
import starIcon from '../../assets/images/star.png'

const Dashboard = () => {
  const { data,
     loading, 
     error } = useGetProfile(`${BASE_URL}users`);
  const [tab, setTab] = useState('overview');

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
            


            {/* ===== Not Approved ======  */}
              {data?.isApproved === 'pending' && (
                <div className="flex p-4 mb-4 text-red-800 bg-red-400 rounded-lg">
                  <svg
                    aria-hidden="true"
                    className="flex-shrink-0 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000
                      2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Info</span>
                  <div className="ml-3 text-sm font-medium">
                    To get approval, please complete your profile. We&apos;ll
                    review and approve within 2 days.
                  </div>
                </div>
              )}


              {/* ===== When Approved */}
              <div className="mt-8">
                {tab==='overview' && <div>
                  <div className="flex items-center gap-4 mb-10">
                    <figure className="max-w-[200px] max-h-[200px]">
                      <img src={data?.profilePicture?.url} alt="Profile Picture" className="w-full"/>
                      
                    </figure>

                    <div>
                      <span className="bg-[#CCF0F3] text-irisBlueColor py-1 px-4 lg:py-2 lg:px-6 rounded text-[12px] leading-4 
                      lg:text-[16px] lg:leading-6 font-semibold">
                        {/* {data.specialization} */}
                        Barber
                      </span>

                      <h3 className="text-[22px] leading-9 font-bold text-headingColor mt-3">
                      Sadiqq Ahmed
                        </h3>

                        <div className="flex items-center gap-[6px]">
                          <span className="flex items-center gap-[6px] text-headingColor text-[14px] 
                          leading-5 lg:text-[16px] lg:leading-6 font-semibold">
                            <img src={starIcon }alt="" />4.5
                            </span>
                          <span className=" text-textColor text-[14px] 
                          leading-5 lg:text-[16px] lg:leading-6 font-semibold">
                            (233)
                            </span>
                        </div>

                        <p className="text__para font-[15px] lg:max-w-[390px] leading-6">provider bio</p>
                    </div>
                    
                  </div>
                  <BarberAbout 
                  name={data?.name} 
                  about={data?.about}
                  qualification={data?.qualification} 
                  experience={data?.experience}/>
                  </div>}
                  

                {tab==='appointments' && <div>appointments</div>}
                {tab==='settings' && <Profile/>}
                </div>
                
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

// Debugging barbers data (uncomment for debugging)

// console.log("Barber Data:", barbers);

export default Dashboard;
