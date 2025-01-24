import React from "react";
import BarberCard from "./BarberCard";
import BarberList from "./BarberList";

const RecomBarbers = () => {
    return (
        <section data-aos="zoom-in">
        <div className="container">
            <div className='xl:w-[470] mx-auto'>
              <h2 className='heading text-center'>Recommended</h2>
              <p className='text__para text-center'>
                Discover top-rated barbers on campus for expert haircuts, trims, and beard grooming.
                Book now for quality service tailored to your style.
              </p>
              </div>
     </div>
     
     {/* <BarberList/> */}

    </section>      
    );
}

export default RecomBarbers;