/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';

const Counter = ({ end, duration, title, colorClass }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return (
    <div>
      <h2 className="text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor">
        {count}{end.toString().includes('+') ? '+' : '%'}
      </h2>
      <span className={`w-[100px] h-2 ${colorClass} rounded-full block mt-[-14px]`}></span>
      <p className="text__para">{title}</p>
    </div>
  );
};

const CounterSection = () => {
  return (
    <div className="mt-[30px] lg:mt-[70px] flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-[30px]">
      <Counter 
        end={30} 
        duration={2000} 
        title="Barbers"  // Changed from Hair Stylists to Barbers
        colorClass="bg-yellowColor" 
      />
      <Counter 
        end={500} 
        duration={2000} 
        title="Registered Users"  // Changed Users to Registered Users
        colorClass="bg-purpleColor" 
      />
      <Counter 
        end={100} 
        duration={2000} 
        title="Positive Feedback"  // Changed User Experience to Positive Feedback
        colorClass="bg-irisBlueColor" 
      />
    </div>
  );
};

export default CounterSection;
