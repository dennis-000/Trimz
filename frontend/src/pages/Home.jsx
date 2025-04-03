import heroImg01 from '../assets/images/4.jpg';
import heroImg02 from '../assets/images/2.jpg';
import heroImg03 from '../assets/images/3.jpg';
import featureImg from '../assets/images/feature-img1.jpg'
import videoIcon from '../assets/images/video-icon.png'
import avatarIcon from '../assets/images/avatar-icon.png'
import icon01 from '../assets/images/icon01.png'
import icon02 from '../assets/images/icon02.png'
import icon03 from '../assets/images/icon03.png'
import faqImg from '../assets/images/faq-img1.png';
import { BsArrowRight } from 'react-icons/bs';
import About from '../components/About/about';
import ServiceList from '../components/Services/ServiceList';
// import BarberList from '../components/Barbers/BarberList';
import FaqList from '../components/faq/faqList';
import Testimonial from'../components/Testimonial/Testimonial';
import CounterSection from '../components/Counter/CounterSection';

import { Link } from 'react-scroll';
import { useEffect } from 'react';
import 'aos/dist/aos.css'; // Import AOS styles
import AOS from 'aos'; // Import AOS library
import ScrollToTop from './ScrollToTop';
// import RecomBarbers from '../components/Barbers/RecomBarbers';

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 2000, // Animation duration in milliseconds
      once: false, // Whether animation should happen only once
    });
  }, []);
  return <>
    {/* ====== Hero Section ========== */}
    <section className='hero__section pt-[60px] 2xl:h-[800px]' id="hero">
      <div className="container">
        <div className='flex flex-col lg:flex-row gap-[90px] items-center justify-between'>

          {/* =========== Home Page CONTENTS ========== */}
          <div>
            <div className='lg:w-[570px]'>
              

              <h1 className='text-[24px] leading-[34px] text-headingColor font-[800] md:text-[36px] md:leading-[46px] lg:text-[60px] lg:leading-[70px]'>
              Looking for Expert Grooming Services Near You?
                </h1>

              <p className='text_para'> Trimz offers expert grooming for everyone, with professional barbers and stylists delivering haircuts, 
                beard grooming, and chic hairstyles. Enjoy convenient online booking for effortless service anywhere.
              </p>
            </div>
            {/* Home btn */}
            <Link to="/services" smooth={true} duration={500}>
                <button className="btn">Our Services</button>
              </Link>
          </div>

          {/* =========== Home Page CONTENTS Image ========== */}
<div className='flex flex-wrap gap-[20px] justify-center md:justify-end'>
  {/* 'flex-wrap' allows the images to wrap if they can't fit on smaller screens. 
      'gap-[20px]' reduces the gap a bit for smaller screens.
      'justify-center' centers the images on small screens, 'md:justify-end' aligns them to the right on medium and larger screens. */}
  
  <div>
  <img className='w-[150px] h-[250px] sm:w-[200px] sm:h-[300px] md:w-[250px] md:h-[400px] 
    rounded-3xl' src={heroImg01} alt="First content Image" />
    {/* Responsive image sizing: 
        - On small screens (sm), it will scale to width 200px, height 300px.
        - On medium screens (md), it will use 250px width and 400px height (original size).
        - On extra-small screens, it shrinks to 150px width and 250px height. */}
  </div>

  <div className='mt-[20px] sm:mt-[30px]'>
    {/* Adjust top margin to be smaller on very small screens for better spacing. */}
    
              <img src={heroImg02} alt="Second Img" className='w-[150px] h-[120px] sm:w-[175px] sm:h-[150px] 
    md:w-[200px] md:h-[170px] mb-[20px] rounded-lg' />
    {/* Second image: 
        - Shrinks to 150px wide and 120px tall on very small screens.
        - Scales to 175px by 150px on small screens.
        - Reverts to 200px by 170px on medium screens and larger. */}
    
              <img src={heroImg03} alt="Third Img" className='w-[150px] h-[100px] sm:w-[175px] sm:h-[130px] md:w-[200px] 
    md:h-[150px] rounded-lg'/>
    {/* Third image:
        - Shrinks to 150px wide and 100px tall on very small screens.
        - Grows to 175px by 130px on small screens.
        - Reverts to 200px by 150px on medium and larger screens. */}
  </div>

            
         {/* <div className='flex gap-[30px] justify-end'>
            <div>
              <img className='w-[250px] h-[400px] rounded-3xl' src={heroImg01} alt="Fisrt content Image" />
            </div>
            <div className='mt-[30px]'>
              <img src={heroImg02} alt="Second Img" className='w-[200px] h-[170px] mb-[30px] rounded-lg' />
              <img src={heroImg03} alt="Third Img" className='w-[200px] h-[150px] mb-[30px] rounded-lg'/>
            </div>
          </div> */}
</div>

        </div>

          {/* ===== counter section ==== */}
          <CounterSection/>
       
      </div>
    </section>
    {/* ==================== Hero Section End =================== */}

    {/* =================== New Section Container======================== */}
    
    <section data-aos="zoom-in">
      <div className="container">
        <div className='lg:w-[470px] mx-auto'>
          <h2 className='heading text-center'>Providing the Best Hair Styling Services
          </h2>
          <p className='text__para text-center'>First-Class Barbers and hair Stylists. View profiles and choose your favorite styler. 
          </p>
        </div>

        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] 
        lg:mt-[55px]'>


          {/* ======= First Illustration ======== */}
            <div className='py-[30px] px-5'>
              <div className='flex items-center justify-center'>
                <img src={icon01} alt="" />
            </div>
            
            <div className='mt-[30px]'>
              <h2 className='text-[26px] leading-9 text-headingColor font-[700] text-center'>
                Find a Stylist Or Barber
              </h2>
              <p className='text-[16px] leading-7 text-textColor font-[400] mt-4 text-center'>
                Discover skilled hair stylists and barbers.  Trimz allows you to explore profiles,
                view ratings, and choose your ideal professional.
              </p>

              <Link to='/barbers' className='w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto 
              flex items-center justify-center group hover:bg-primaryColor hover:border-none'>
                <BsArrowRight className='group-hover:text-white w-6 h-5'/>
              </Link>
            </div>
          </div>


          {/* ======= Second Illustration ======== */}
            <div className='py-[30px] px-5'>
              <div className='flex items-center justify-center'>
                <img src={icon02} alt="" />
            </div>
            
            <div className='mt-[30px]'>
              <h2 className='text-[26px] leading-9 text-headingColor font-[700] text-center'>
                Find a Location
              </h2>
              <p className='text-[16px] leading-7 text-textColor font-[400] mt-4 text-center'>
              Find your favorite stylists on campus with  Trimz. Use our map to locate nearby stylists,
              check availability, and book your slot.
              </p>
              <Link to='/barbers' className='w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto 
              flex items-center justify-center group hover:bg-primaryColor hover:border-none'>
                <BsArrowRight className='group-hover:text-white w-6 h-5'/>
              </Link>
            </div>
          </div>


          {/* ======= Third Illustration ======== */}
            <div className='py-[30px] px-5'>
              <div className='flex items-center justify-center'>
                <img src={icon03} alt="" />
            </div>
            
            <div className='mt-[30px]'>
              <h2 className='text-[26px] leading-9 text-headingColor font-[700] text-center'>
                Book Appointment
              </h2>
              <p className='text-[16px] leading-7 text-textColor font-[400] mt-4 text-center'>
              Book your next haircut easily with  Trimz. Browse stylists, choose a service, pick a time, and confirm in just a few clicks.
              </p>
              <Link to='/barbers' className='w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto 
              flex items-center justify-center group hover:bg-primaryColor hover:border-none'>
                <BsArrowRight className='group-hover:text-white w-6 h-5'/>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* ===== End Of the New Section Container */}


    {/* ======== About Section Begin ========== */}
    <About/>
    {/* ======== About Section End ========== */}


    {/* ======== Services Section Start ========== */}
    <section id="services" data-aos="zoom-in">
      <div className="container">
        <div className='xl:w-[470] mx-auto'>
          <h2 className='heading text-center'>Styling and Babering Services</h2>
          <p className='text__para text-center'>
             Trimz provides on-campus haircuts, trims, beard grooming, and styling.
            Enjoy quick, quality service.
          </p> 
        </div>

      <ServiceList/>
      </div>
</section>
    {/* ======== Services Section End ========== */}

    
    {/* ======== Feature Section ========= */}
    <section data-aos="zoom-in">
      <div className='container'>
        <div className='flex items-center justify-between flex-col lg:flex-row'>

          {/* ====== feature content ====== */}
          <div className='xl:w-[670px]'>
            <h2 className='heading'>
              Best Grooming Services <br /> Anytime, Anywhere
            </h2>
            <ul className="pl-4">
              <li className="text__para">
                1. Book your appointment directly with just a few clicks.
              </li>
              <li className="text__para">
                2. Explore and connect with professional barbers available on campus.
              </li>
              <li className="text__para">
                3. Browse our barbers and stylists, view their availability, and
                choose a time that fits your schedule.
              </li> 
            </ul>

            <Link to='/aboutus'>
              <button className='btn'>Learn More</button>
            </Link>
          </div>


          {/* ============ feature Image ========== */}
          <div className='relative z-10 xl:w-[770px] flex justify-end mt-[50px] lg:mt-0'>
            <img src={featureImg} className='w-3/4' alt="The Feature Content Image" />

            <div className='w-[150px] lg:w-[248px] bg-white absolute bottom-[50px] left-0 
            md:bottom-[100px] md:left-5 z-20 p-2 pb-3 lg:pt-4 lg:px-4 lg:pb-[26px] rounded-[10px]'>

              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-[6px] lg:gap-3'>
                  {/* ==== Example Appoint Date */}
                  <p className='text-[10px] leading-[10px] lg:text-[14px] lg:leading-5 text-textColor
                  font-[400]'>Tues, 24
                  </p>
                  <p className='text-[10px] leading-[10px] lg:text-[14px] lg:leading-5 text-textColor
                  font-[400]'>10:00AM
                  </p>
                </div>
                <span className='w-5 h-5 lg:w-[34px] lg:h-[34px] flex items-center justify-center
                bg-irisBlueColor rounded py-1 px-[6px] lg:py-3 lg:px-[9px]'>
                  <img src={videoIcon} alt="Small Video Icon" />
                </span>
              </div>

              {/* ============= Styled Small Text ================= */}
              <div className='w-[75px] lg:w-[96px] bg-[#CCF0F3] py-1 px-2 lg:py-[6px] lg:px-[10px]
              text-[8px] leading-[8px] lg:text-[12px] lg:leading-4 text-irisBlueColor font-[800] mt-2 lg:mt-4
              rounded-s-full'>
                Professional
              </div>

            {/* ======= small Profile Icon Image */}
            {/* ========== CHANGE THIS IMAGE/ AVATAR ICON ============== */}
              <div className='flex items-center gap-[6px] lg:gap-[10px] mt-2 lg:mt-[18px]'>
                <img src={avatarIcon} alt="Profile Avartar Icon" />
                <h4 className='text-[10px] leading-3 lg:text-[16px] lg:leading-[22px] font-[700] text-headingColor'>
                  Saddiq Ahmed
                </h4>
              </div>


            </div>
          </div>


        </div>

      </div>
    </section>

    {/* ============= Feature Section ============== */}
    {/* ============= High Rated OR Recommended Barbers Section START ============== */}
    {/* <div>
        <RecomBarbers/>
      </div> */}
    {/* ============= High Rated OR Recommended Barbers Section END ============== */}


    
    {/* ================== faqs SECTION START ==================*/}
    <section data-aos="zoom-in">
      <div className="container">
        <div className='flex justify-between gap-[50px] lg:gap-0'>
          <div className='w-[40%] hidden md:block'>
            <img src={faqImg} alt="faq Image" />
          </div>

          <div className='w-full md:w-1/2 '>
            <h2 className='heading'>Most questions by our beloved customers</h2>
            <FaqList/>

          </div>


        </div>
      </div>

    </section>
    {/* ================== faqs SECTION END ==================*/}

    {/* ================== Testimonial SECTION Start ==================*/}
    <section data-aos="fade-up">
      <div className="container">
        <div className='xl:w-[470] mx-auto'>
            <h2 className='heading text-center'>What our clients say</h2>
            <p className='text__para text-center'>
            At Trimz, we pride ourselves on delivering top-notch styling
            services to everyone everywhere.
            </p> 
        </div>
        <Testimonial/>
      </div>
      {/* <Footer/> */}
    </section>
    <ScrollToTop/>

    {/* ================== Testimonial SECTION End ==================*/}

  </>
}

export default Home;