/* eslint-disable react/no-unescaped-entities */
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import patientAvatar from '../../assets/images/patient-avatar.png'
import { HiStar } from "react-icons/hi";

const Testimonial = () => {
    return (
        <div className='mt-[30px] lg:mt-[55px]'>
            <Swiper
                modules={[Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                pagination={{ clickable: true }}
                breakpoints={{
                    640: {
                        slidesPerView: 1,
                        spaceBetween: 0,
                    },
                    760: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                }}
            >
                {/* ========= 1 ============ */}
                <SwiperSlide>
                    <div className='py-[30px] px-5 rounded-3'>
                        <div className='flex items-center gap-[13px]'>
                            <img src={patientAvatar} alt="" />
                            <div>
                                <h4 className='text-[18px] leading-[30px] font-semibold text-headingColor'>
                                    — Issah
                                </h4>

                                <div className='flex items-center gap-[2px]'>
                                    <HiStar className='text-yellowColor w-[18px] h-5'/>
                                    <HiStar className='text-yellowColor w-[18px] h-5'/>
                                    <HiStar className='text-yellowColor w-[18px] h-5'/>
                                    <HiStar className='text-yellowColor w-[18px] h-5'/>
                                    <HiStar className='text-yellowColor w-[18px] h-5'/>
                                </div>
                            </div>
                        </div>
                        <h4 className='text-[15px] leading-[20px] font-medium text-headingColor'>
                            "Convenient and Reliable"
                        </h4>
                        <p className='text-[16px] leading-5 mt-4 text-textColor font-[400]'>
                            "Trimz makes booking haircuts easy, and getting styled on campus is so
                            convenient!"
                        </p>
                    </div>
                </SwiperSlide>

                {/* ================= 2 ============ */}
                <SwiperSlide>
                    <div className='py-[30px] px-5 rounded-3'>
                        <div className='flex items-center gap-[13px]'>
                            <img src={patientAvatar} alt="" />
                            <div>
                                <h4 className='text-[18px] leading-[30px] font-semibold text-headingColor'>
                                    — Saddiq Ahmed
                                </h4>

                                <div className='flex items-center gap-[2px]'>
                                    <HiStar className='text-yellowColor w-[18px] h-5'/>
                                    <HiStar className='text-yellowColor w-[18px] h-5'/>
                                    <HiStar className='text-yellowColor w-[18px] h-5'/>
                                    <HiStar className='text-yellowColor w-[18px] h-5'/>
                                    <HiStar className='text-yellowColor w-[18px] h-5'/>
                                </div>
                            </div>
                        </div>
                        <h4 className='text-[15px] leading-[20px] font-medium text-headingColor'>
                            "Great Services"
                        </h4>
                        <p className='text-[16px] leading-5 mt-4 text-textColor font-[400]'>
                            "Every barber and stylist I've tried on Trimz is professional and friendly. Always a
                            great experience!"
                        </p>
                    </div>
                </SwiperSlide>

                {/* ========== 3 ========= */}
                <SwiperSlide>
                    <div className='py-[30px] px-5 rounded-3'>
                        <div className='flex items-center gap-[13px]'>
                            <img src={patientAvatar} alt="" />
                            <div>
                                <h4 className='text-[18px] leading-[30px] font-semibold text-headingColor'>
                                    — Larmar 
                                </h4>

                                <div className='flex items-center gap-[2px]'>
                                    <HiStar className='text-yellowColor w-[18px] h-5'/>
                                    <HiStar className='text-yellowColor w-[18px] h-5'/>
                                    <HiStar className='text-yellowColor w-[18px] h-5'/>
                                    <HiStar className='text-yellowColor w-[18px] h-5'/>
                                    <HiStar className='text-yellowColor w-[18px] h-5'/>
                                </div>
                            </div>
                        </div>
                        <h4 className='text-[15px] leading-[20px] font-medium text-headingColor'>
                            "Perfect for Everyone"
                        </h4>
                        <p className='text-[16px] leading-4 mt-4 text-textColor font-[400]'>
                            "Trimz saves me time with quality haircuts, no need to
                            leave your hostel."
                        </p>
                    </div>
                </SwiperSlide>

                {/* ============ 4 =========== */}
                <SwiperSlide>
                    <div className='py-[30px] px-5 rounded-3'>
                        <div className='flex items-center gap-[13px]'>
                            <img src={patientAvatar} alt="" />
                            <div>
                                <h4 className='text-[18px] leading-[30px] font-semibold text-headingColor'>
                                    — Benjamin
                                </h4>

                                <div className='flex items-center gap-[2px]'>
                                    <HiStar className='text-yellowColor w-[18px] h-5'/>
                                    <HiStar className='text-yellowColor w-[18px] h-5'/>
                                    <HiStar className='text-yellowColor w-[18px] h-5'/>
                                    <HiStar className='text-yellowColor w-[18px] h-5'/>
                                    <HiStar className='text-yellowColor w-[18px] h-5'/>
                                </div>
                            </div>
                        </div>
                        <h4 className='text-[15px] leading-[20px] font-medium text-headingColor'>
                            "Highly Recommended"
                        </h4>
                        <p className='text-[16px] leading-4 mt-4 text-textColor font-[400]'>
                            "Skilled workers, fast service, and flexible booking make Trimz a must!"
                        </p>
                    </div>
                </SwiperSlide>

                {/* ============= 5 ========== */}
                <SwiperSlide>
                    <div className='py-[30px] px-5 rounded-3'>
                        <div className='flex items-center gap-[13px]'>
                            <img src={patientAvatar} alt="" />
                            <div>
                                <h4 className='text-[18px] leading-[30px] font-semibold text-headingColor'>
                                    — Stephen
                                </h4>

                                <div className='flex items-center gap-[2px]'>
                                    <HiStar className='text-yellowColor w-[18px] h-5'/>
                                    <HiStar className='text-yellowColor w-[18px] h-5'/>
                                    <HiStar className='text-yellowColor w-[18px] h-5'/>
                                    <HiStar className='text-yellowColor w-[18px] h-5'/>
                                    <HiStar className='text-yellowColor w-[18px] h-5'/>
                                </div>
                            </div>
                        </div>
                        <h4 className='text-[15px] leading-[20px] font-medium text-headingColor'>
                            "Exceptional Experience"
                        </h4>
                        <p className='text-[16px] leading-4 mt-4 text-textColor font-[400]'>
                            "Trimz provides top-notch grooming with great customer service. I’ve never
                            been disappointed!"
                        </p>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    )
};

export default Testimonial