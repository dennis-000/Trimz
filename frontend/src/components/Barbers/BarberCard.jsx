/* eslint-disable react/prop-types */
import starIcon from '../../assets/images/Star.png';
import placeholder from '../../assets/images/placeholder.jpg';
import { useNavigate } from 'react-router-dom'; // Replace Link with useNavigate
import { BsArrowRight } from 'react-icons/bs';

// Functional component that receives a barber object as a prop
const BarberCard = ({ user }) => {
    // console.log('User:', user);
    const navigate = useNavigate();
    const {
        name
    } = user || {};

    const handleCardClick = () => {
        navigate(`/barbers/${user?._id || 'unknown'}`);
    }
    
    // console.log(user?.profilePicture?.url);

    return (
        <div 
        className='p-3 lg:p-5 cursor-pointer hover:shadow-lg transition-all duration-300' 
        onClick={handleCardClick} // Add click event to entire card
    >
        <div className='w-full h-[280px] overflow-hidden rounded-2xl'>
            {user && user.profilePicture && user.profilePicture.url && (
                <img 
                    src={user?.profilePicture?.url} 
                    className='w-full h-full object-cover' 
                    alt={`${name}'s profile`} 
                />
            )}
            {(!user || !user?.profilePicture || !user?.profilePicture?.url) && (
                <img 
                    src={placeholder} 
                    className='w-full h-full object-cover' 
                    alt="Placeholder" 
                />
            )}
        </div>

        <h2 className='text-[18px] leading-[30px] lg:text-[26px] lg:leading-9 text-headingColor 
        font-[700] mt-3 lg:mt-5'>{user?.name}</h2>

        <div className='mt-2 lg:mt-4 flex items-center justify-between'>
            <span className='bg-[#CCF0F3] text-irisBlueColor py-1 px-2 lg:py-2 lg:px-6 text-[12px] leading-4
            lg:text-[16px] lg:leading-7 font-semibold rounded'>
                {user?.specialization}
            </span>

            <div className='flex items-center gap-[6px]'>
                <span className='flex items-center gap-[6px] text-[14px] leading-6 lg:text-[16px] lg:leading-7
                font-semibold text-headingColor'>
                    <img src={starIcon} alt="" />{user?.averageRating}
                </span>
                <span className='text-[14px] leading-6 lg:text-[16px] lg:leading-7
                font-[400] text-textColor'>({user?.totalRating})</span>
            </div>
        </div>

        <div className='mt-[18px] lg:mt-5 flex items-center justify-between'>
            <div>
                <p className='text-[14px] leading-6 font-[400] text-textColor'>
                    {user?.bio}
                </p>
            </div>

            {/* Keep the arrow as an additional navigation cue */}
            <div
                className='w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E]
                flex items-center justify-center group hover:bg-primaryColor hover:border-none'
            >
                <BsArrowRight
                    className='group-hover:text-white w-6 h-5' />
            </div>
        </div>
    </div>
);
};

// Exporting the BarberCard component for use in other parts of the application
export default BarberCard;
