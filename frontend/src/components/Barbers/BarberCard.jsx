/* eslint-disable react/prop-types */
// Importing assets and components
import starIcon from '../../assets/images/Star.png'; // Importing the star icon image
import placeholder from '../../assets/images/placeholder.jpg'; // Importing the placeholder image
import { Link } from 'react-router-dom'; // Importing Link for navigation
import { BsArrowRight } from 'react-icons/bs'; // Importing the right arrow icon from react-icons

// Functional component that receives a barber object as a prop
const BarberCard = ({ user }) => {
    // Destructuring properties from the barber object
    // console.log('User:', user);
    const {
        name ,
        avgRating ,
        totalRating ,
        specialization ,
        experiences ,
        profilePicture ,
    } = user || {};
    
    // console.log(user?.profilePicture?.url);

    return (
        <div className='p-3 lg:p-5'> {/* Main card container with padding */}
            <div className='w-full h-[280px] overflow-hidden rounded-2xl'>
            {user && user.profilePicture && user.profilePicture.url && (<img src={user?.profilePicture?.url} 
            className='w-full h-full object-cover' 
            alt={`${name}'s profile`} />)} {/* Barber's photo */}
                {/*  Optional: Display a placeholder if no image is available */}
                {!user || !user?.profilePicture || !user?.profilePicture?.url && 
                (<img src={placeholder} 
                className='w-full h-full object-cover' 
                alt="Placeholder" /> )}
            </div>

            <h2 className='text-[18px] leading-[30px] lg:text-[26px] lg:leading-9 text-headingColor 
            font-[700] mt-3 lg:mt-5'>{user?.name} {/* Barber's name */}</h2>

            <div className='mt-2 lg:mt-4 flex items-center justify-between'> {/* Flex container for specialization and rating */}
                <span className='bg-[#CCF0F3] text-irisBlueColor py-1 px-2 lg:py-2 lg:px-6 text-[12px] leading-4
                lg:text-[16px] lg:leading-7 font-semibold rounded'>
                    {user?.specialization} {/* Barber's specialization */}
                </span>

                <div className='flex items-center gap-[6px]'> {/* Flex container for average rating and total ratings */}
                    <span className='flex items-center gap-[6px] text-[14px] leading-6 lg:text-[16px] lg:leading-7
                    font-semibold text-headingColor'>
                        <img src={starIcon} alt="" />{user?.avgRating} {/* Displaying the average rating */}
                    </span>
                    <span className='text-[14px] leading-6 lg:text-[16px] lg:leading-7
                    font-[400] text-textColor'>({user?.totalRating}) {/* Displaying total ratings */}
                    </span>
                </div>
            </div>

            <div className='mt-[18px] lg:mt-5 flex items-center justify-between'> {/* Flex container for clients and location */}
                <div>
                    {/* <h3 className='text-[16px] leading-7 lg:text-[18px] lg:leading-[30px] font-semibold 
                    text-headingColor'>

                        +{totalClients} Clients 
                    </h3> */}
                    <p className='text-[14px] leading-6 font-[400] text-textColor'>
                        {/* Might change */}
                        {experiences?.length > 0 ? `At ${experiences[0]?.experience}` : 'Experience details not available'}
                        </p>
                </div>

                <Link
                    to={`/barbers/${user?._id || 'unknown'}`}
                    className='w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E]
                    flex items-center justify-center group hover:bg-primaryColor hover:border-none'>
                    
                    <BsArrowRight // Right arrow icon for navigation
                        className='group-hover:text-white w-6 h-5' />
                </Link>
            </div>
        </div>
    );
};

// Exporting the BarberCard component for use in other parts of the application
export default BarberCard;
