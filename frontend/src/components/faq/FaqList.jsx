/* eslint-disable react/prop-types */
// FaqList.jsx
import { useState } from 'react';
import { faqs } from '../../assets/data/faqs';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

const FaqItem = ({ item, isOpen, onToggle }) => {
  return (
    <div className="p-3 lg:p5 rounded-[12px] border border-solid border-[#D9DCE2] mb-5 cursor-pointer">
      <div className="flex items-center justify-between gap-5" onClick={onToggle}>
        <h4 className="text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor">
          {item.question}
        </h4>
        <div className={`${
          isOpen && 'bg-primaryColor text-white border-none'
        } w-7 h-7 lg:w-8 lg:h-8 border border-solid border-[#141F21] rounded flex items-center justify-center`}>
          {isOpen ? <AiOutlineMinus /> : <AiOutlinePlus />}
        </div>
      </div>
      
      {isOpen && (
        <div className="mt-4">
          <p className="text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-[400] text-textColor">
            {item.content}
          </p>
        </div>
      )}
    </div>
  );
};

const FaqList = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <ul className="mt-[38px]">
      {faqs.map((item, index) => (
        <FaqItem
          key={index}
          item={item}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </ul>
  );
};

export default FaqList;