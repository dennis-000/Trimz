/* eslint-disable react/prop-types */

import { useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';


const FaqItem = ({ item }) => {

  const [isOpen, setIsOpen] = useState(false);
  
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };


  return (
    <div
      className='p-3 lg:p5 rounded-[12px] border border-solid border-[#D9DCE2] mb-5
  cursor-pointer'>
      
      {/* Clickable header that toggles the accordion */}
      <div
        className='flex items-center justify-between gap-5'
        onClick={toggleAccordion} // Attach click event to toggle the accordion
      >


        
        <h4 className='text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor '>
          {/* Display the question from the item prop */}
        {item.question} 
      </h4>

        
        {/* With how to display the shapes */}
        <div
          className={`${
            isOpen && 'bg-primaryColor text-white border-none' // Change styles if accordion is open
            } w-7 h-7 lg:w-8 lg:h-8 border border-solid border-[#141F21] rounded flex
      items-center justify-center`}
        >
        {isOpen ? <AiOutlineMinus /> : <AiOutlinePlus/> /* Show minus or plus icon based on state */}
      </div>
    </div>
      
      {isOpen && ( // Conditionally render the answer if the accordion is open
        <div className="mt-4">
          <p className='text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-[400] text-textColor'>
            {item.content} {/* Display the content (answer) from the item prop */}
          </p>
        </div>
        )}
    </div>
  )
  
};

export default FaqItem;
// ======== FEELS COMPLICATED 🤔🤔 =========== 